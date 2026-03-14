const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  questions: [{
    question: String,
    options: [String],
    correctAnswer: Number
  }],
  attempts: [{
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    score: Number,
    completedAt: Date
  }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Quiz', quizSchema);
