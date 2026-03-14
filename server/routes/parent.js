const express = require('express');
const router = express.Router();
const { auth, roleAuth } = require('../middleware/auth');
const User = require('../models/User');
const Course = require('../models/Course');
const Assignment = require('../models/Assignment');
const Quiz = require('../models/Quiz');

router.use(auth, roleAuth(['parent']));

// Link parent to student
router.post('/link-student', async (req, res) => {
  try {
    const { studentEmail } = req.body;
    const student = await User.findOne({ email: studentEmail, role: 'student' });
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    const parent = await User.findById(req.user.userId);
    parent.linkedStudentId = student._id;
    await parent.save();
    
    res.json({ message: 'Student linked successfully', student: { name: student.name, email: student.email } });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get child progress
router.get('/child-progress', async (req, res) => {
  try {
    const parent = await User.findById(req.user.userId);
    
    if (!parent.linkedStudentId) {
      return res.json({
        childName: parent.childName,
        childGrade: parent.childGrade,
        linked: false,
        message: 'No student linked yet'
      });
    }
    
    const student = await User.findById(parent.linkedStudentId);
    const enrolledCourses = await Course.find({ enrolledStudents: student._id })
      .populate('teacherId', 'name');
    
    const courseIds = enrolledCourses.map(c => c._id);
    
    const assignments = await Assignment.find({ courseId: { $in: courseIds } });
    const totalAssignments = assignments.length;
    const submittedAssignments = assignments.filter(a =>
      a.submissions.some(s => s.studentId.toString() === student._id.toString())
    ).length;
    
    const gradedAssignments = [];
    assignments.forEach(assignment => {
      const submission = assignment.submissions.find(s => 
        s.studentId.toString() === student._id.toString() && s.grade !== undefined
      );
      if (submission) gradedAssignments.push(submission.grade);
    });
    
    const avgGrade = gradedAssignments.length > 0
      ? gradedAssignments.reduce((a, b) => a + b, 0) / gradedAssignments.length
      : 0;
    
    const quizzes = await Quiz.find({ courseId: { $in: courseIds } });
    const quizScores = [];
    quizzes.forEach(quiz => {
      const attempt = quiz.attempts.find(a => a.studentId.toString() === student._id.toString());
      if (attempt) quizScores.push(attempt.score);
    });
    
    const avgQuizScore = quizScores.length > 0
      ? quizScores.reduce((a, b) => a + b, 0) / quizScores.length
      : 0;
    
    const attendance = totalAssignments > 0
      ? Math.round((submittedAssignments / totalAssignments) * 100)
      : 0;
    
    res.json({
      linked: true,
      childName: student.name,
      childGrade: student.grade,
      childEmail: student.email,
      enrolledCourses: enrolledCourses.length,
      courses: enrolledCourses,
      totalAssignments,
      submittedAssignments,
      attendance,
      avgGrade: Math.round(avgGrade),
      avgQuizScore: Math.round(avgQuizScore),
      recentActivity: [
        { type: 'assignment', message: `${submittedAssignments} of ${totalAssignments} assignments submitted` },
        { type: 'quiz', message: `Average quiz score: ${Math.round(avgQuizScore)}%` }
      ]
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
