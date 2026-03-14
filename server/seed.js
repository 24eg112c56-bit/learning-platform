const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');

const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  const demoUsers = [
    { name: 'Demo Student', email: 'student@demo.com', password: 'demo123', role: 'student', grade: 'Grade 10', schoolName: 'Demo High School', interests: ['Math', 'Science'] },
    { name: 'Demo Teacher', email: 'teacher@demo.com', password: 'demo123', role: 'teacher', subjectSpecialization: 'Mathematics', yearsOfExperience: 5, qualification: 'M.Sc Mathematics' },
    { name: 'Demo Parent', email: 'parent@demo.com', password: 'demo123', role: 'parent', childName: 'Demo Student', childGrade: 'Grade 10', contactNumber: '555-0123' },
  ];

  for (const u of demoUsers) {
    const exists = await User.findOne({ email: u.email });
    if (!exists) {
      const hashed = await bcrypt.hash(u.password, 10);
      await User.create({ ...u, password: hashed });
      console.log(`Created: ${u.email}`);
    } else {
      console.log(`Already exists: ${u.email}`);
    }
  }

  console.log('Seeding complete!');
  process.exit(0);
};

seed().catch(err => { console.error(err); process.exit(1); });
