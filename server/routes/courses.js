const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const Course = require('../models/Course');

// Get all available courses
router.get('/', auth, async (req, res) => {
  try {
    const courses = await Course.find()
      .populate('teacherId', 'name subjectSpecialization')
      .sort({ createdAt: -1 });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single course details
router.get('/:id', auth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('teacherId', 'name subjectSpecialization email');
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
