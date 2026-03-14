const express = require('express');
const router = express.Router();
const { auth, roleAuth } = require('../middleware/auth');
const Course = require('../models/Course');
const Assignment = require('../models/Assignment');
const Quiz = require('../models/Quiz');
const User = require('../models/User');

router.use(auth, roleAuth(['teacher']));

// Create course
router.post('/courses', async (req, res) => {
  try {
    const course = new Course({
      ...req.body,
      teacherId: req.user.userId
    });
    await course.save();
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get teacher's courses
router.get('/courses', async (req, res) => {
  try {
    const courses = await Course.find({ teacherId: req.user.userId })
      .populate('enrolledStudents', 'name email grade');
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add video to course
router.post('/courses/:id/videos', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    course.videos.push(req.body);
    await course.save();
    
    // Notify enrolled students
    const io = req.app.get('io');
    course.enrolledStudents.forEach(studentId => {
      io.to(studentId.toString()).emit('new-video', {
        courseId: course._id,
        courseName: course.title,
        videoTitle: req.body.title
      });
    });
    
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create assignment
router.post('/assignments', async (req, res) => {
  try {
    const assignment = new Assignment({
      ...req.body,
      teacherId: req.user.userId
    });
    await assignment.save();
    
    // Notify enrolled students
    const course = await Course.findById(req.body.courseId);
    const io = req.app.get('io');
    course.enrolledStudents.forEach(studentId => {
      io.to(studentId.toString()).emit('new-assignment', {
        assignmentId: assignment._id,
        title: assignment.title,
        dueDate: assignment.dueDate
      });
    });
    
    res.status(201).json(assignment);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get assignments
router.get('/assignments', async (req, res) => {
  try {
    const courses = await Course.find({ teacherId: req.user.userId });
    const courseIds = courses.map(c => c._id);
    
    const assignments = await Assignment.find({ courseId: { $in: courseIds } })
      .populate('courseId', 'title')
      .populate({
        path: 'submissions.studentId',
        select: 'name email'
      });
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Grade assignment
router.post('/assignments/:assignmentId/grade/:submissionId', async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.assignmentId);
    const submission = assignment.submissions.id(req.params.submissionId);
    submission.grade = req.body.grade;
    await assignment.save();
    
    // Notify student
    const io = req.app.get('io');
    io.to(submission.studentId.toString()).emit('assignment-graded', {
      assignmentTitle: assignment.title,
      grade: req.body.grade
    });
    
    res.json({ message: 'Assignment graded' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get quizzes
router.get('/quizzes', async (req, res) => {
  try {
    const courses = await Course.find({ teacherId: req.user.userId });
    const courseIds = courses.map(c => c._id);
    const quizzes = await Quiz.find({ courseId: { $in: courseIds } }).populate('courseId', 'title');
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create quiz
router.post('/quizzes', async (req, res) => {
  try {
    const quiz = new Quiz({
      ...req.body,
      teacherId: req.user.userId
    });
    await quiz.save();
    
    // Notify enrolled students
    const course = await Course.findById(req.body.courseId);
    const io = req.app.get('io');
    course.enrolledStudents.forEach(studentId => {
      io.to(studentId.toString()).emit('new-quiz', {
        quizId: quiz._id,
        title: quiz.title
      });
    });
    
    res.status(201).json(quiz);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get student performance
router.get('/students/:courseId/performance', async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId)
      .populate('enrolledStudents', 'name email');
    
    const assignments = await Assignment.find({ courseId: req.params.courseId });
    const quizzes = await Quiz.find({ courseId: req.params.courseId });
    
    const studentPerformance = course.enrolledStudents.map(student => {
      const submittedAssignments = assignments.filter(a =>
        a.submissions.some(s => s.studentId.toString() === student._id.toString())
      ).length;
      
      const quizScores = [];
      quizzes.forEach(quiz => {
        const attempt = quiz.attempts.find(a => a.studentId.toString() === student._id.toString());
        if (attempt) quizScores.push(attempt.score);
      });
      
      const avgScore = quizScores.length > 0
        ? quizScores.reduce((a, b) => a + b, 0) / quizScores.length
        : 0;
      
      return {
        student: student.name,
        email: student.email,
        assignmentsSubmitted: submittedAssignments,
        totalAssignments: assignments.length,
        quizzesCompleted: quizScores.length,
        avgQuizScore: Math.round(avgScore)
      };
    });
    
    res.json(studentPerformance);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
