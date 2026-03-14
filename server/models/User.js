const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'teacher', 'parent'], required: true },
  
  // Student fields
  grade: String,
  schoolName: String,
  interests: [String],
  
  // Teacher fields
  subjectSpecialization: String,
  yearsOfExperience: Number,
  qualification: String,
  
  // Parent fields
  childName: String,
  childGrade: String,
  contactNumber: String,
  linkedStudentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
