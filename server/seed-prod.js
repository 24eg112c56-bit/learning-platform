// Run this with your Atlas URI to seed demo accounts
// Usage: MONGODB_URI="mongodb+srv://..." node seed-prod.js

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const uri = process.env.MONGODB_URI;
if (!uri) { console.error('Set MONGODB_URI env variable'); process.exit(1); }

const seed = async () => {
  await mongoose.connect(uri);
  console.log('Connected to MongoDB Atlas');

  const demos = [
    { name: 'Demo Student', email: 'student@demo.com', password: 'demo123', role: 'student', grade: 'Grade 10', schoolName: 'Demo School', interests: ['Math', 'Science'] },
    { name: 'Demo Teacher', email: 'teacher@demo.com', password: 'demo123', role: 'teacher', subjectSpecialization: 'Mathematics', yearsOfExperience: 5, qualification: 'M.Sc' },
    { name: 'Demo Parent',  email: 'parent@demo.com',  password: 'demo123', role: 'parent',  childName: 'Demo Student', childGrade: 'Grade 10', contactNumber: '555-0123' },
  ];

  for (const u of demos) {
    const exists = await User.findOne({ email: u.email });
    if (exists) { console.log(`Already exists: ${u.email}`); continue; }
    await User.create({ ...u, password: await bcrypt.hash(u.password, 10) });
    console.log(`✅ Created: ${u.email}`);
  }

  console.log('\nDone! Demo accounts ready.');
  process.exit(0);
};

seed().catch(e => { console.error(e); process.exit(1); });
