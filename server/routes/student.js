const express = require('express');
const router = express.Router();
const { auth, roleAuth } = require('../middleware/auth');
const Course = require('../models/Course');
const Assignment = require('../models/Assignment');
const Quiz = require('../models/Quiz');
const User = require('../models/User');

router.use(auth, roleAuth(['student']));

// Get enrolled courses
router.get('/courses', async (req, res) => {
  try {
    const courses = await Course.find({ enrolledStudents: req.user.userId })
      .populate('teacherId', 'name subjectSpecialization');
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Enroll in a course
router.post('/courses/:id/enroll', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    if (!course.enrolledStudents.includes(req.user.userId)) {
      course.enrolledStudents.push(req.user.userId);
      await course.save();
      
      // Real-time notification to teacher
      const io = req.app.get('io');
      io.to(course.teacherId.toString()).emit('student-enrolled', {
        studentId: req.user.userId,
        courseId: course._id,
        courseName: course.title
      });
    }
    res.json({ message: 'Enrolled successfully', course });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get assignments for enrolled courses
router.get('/assignments', async (req, res) => {
  try {
    const enrolledCourses = await Course.find({ enrolledStudents: req.user.userId });
    const courseIds = enrolledCourses.map(c => c._id);
    
    const assignments = await Assignment.find({ courseId: { $in: courseIds } })
      .populate('courseId', 'title')
      .populate('teacherId', 'name')
      .sort({ dueDate: 1 });
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Submit assignment
router.post('/assignments/:id/submit', async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    const { content } = req.body;
    
    const existingSubmission = assignment.submissions.find(
      s => s.studentId.toString() === req.user.userId
    );
    
    if (existingSubmission) {
      existingSubmission.content = content;
      existingSubmission.submittedAt = new Date();
    } else {
      assignment.submissions.push({
        studentId: req.user.userId,
        content,
        submittedAt: new Date()
      });
    }
    
    await assignment.save();
    
    // Real-time notification to teacher
    const io = req.app.get('io');
    io.to(assignment.teacherId.toString()).emit('assignment-submitted', {
      studentId: req.user.userId,
      assignmentId: assignment._id,
      assignmentTitle: assignment.title
    });
    
    res.json({ message: 'Assignment submitted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get student progress
router.get('/progress', async (req, res) => {
  try {
    const enrolledCourses = await Course.find({ enrolledStudents: req.user.userId });
    const courseIds = enrolledCourses.map(c => c._id);
    
    const assignments = await Assignment.find({ courseId: { $in: courseIds } });
    const totalAssignments = assignments.length;
    const submittedAssignments = assignments.filter(a => 
      a.submissions.some(s => s.studentId.toString() === req.user.userId)
    ).length;
    
    const quizzes = await Quiz.find({ courseId: { $in: courseIds } });
    const totalQuizzes = quizzes.length;
    const completedQuizzes = quizzes.filter(q =>
      q.attempts.some(a => a.studentId.toString() === req.user.userId)
    ).length;
    
    const quizScores = [];
    quizzes.forEach(quiz => {
      const attempt = quiz.attempts.find(a => a.studentId.toString() === req.user.userId);
      if (attempt) quizScores.push(attempt.score);
    });
    
    const avgQuizScore = quizScores.length > 0 
      ? quizScores.reduce((a, b) => a + b, 0) / quizScores.length 
      : 0;
    
    res.json({
      enrolledCourses: enrolledCourses.length,
      totalAssignments,
      submittedAssignments,
      totalQuizzes,
      completedQuizzes,
      avgQuizScore: Math.round(avgQuizScore),
      progressPercentage: totalAssignments > 0 
        ? Math.round((submittedAssignments / totalAssignments) * 100) 
        : 0
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get quizzes
router.get('/quizzes', async (req, res) => {
  try {
    const enrolledCourses = await Course.find({ enrolledStudents: req.user.userId });
    const courseIds = enrolledCourses.map(c => c._id);
    
    const quizzes = await Quiz.find({ courseId: { $in: courseIds } })
      .populate('courseId', 'title');
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Submit quiz
router.post('/quizzes/:id/submit', async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    const { answers } = req.body;
    
    let score = 0;
    quiz.questions.forEach((q, index) => {
      if (answers[index] === q.correctAnswer) score++;
    });
    
    const percentage = Math.round((score / quiz.questions.length) * 100);
    
    quiz.attempts.push({
      studentId: req.user.userId,
      score: percentage,
      completedAt: new Date()
    });
    
    await quiz.save();
    
    res.json({ message: 'Quiz submitted', score: percentage });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
