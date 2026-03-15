require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');

const authRoutes = require('./routes/auth');
const studentRoutes = require('./routes/student');
const teacherRoutes = require('./routes/teacher');
const parentRoutes = require('./routes/parent');
const courseRoutes = require('./routes/courses');

const app = express();
const server = http.createServer(app);

// CORS — allow localhost + deployed frontend
app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.options('*', cors());
app.use(express.json());

// Socket.IO
const io = socketIo(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
});
io.on('connection', (socket) => {
  socket.on('join-room', (userId) => socket.join(userId));
});
app.set('io', io);

// MongoDB with retry
const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('❌ MONGODB_URI is not set in environment variables!');
    console.error('Go to Render → Environment → add MONGODB_URI');
    return;
  }
  try {
    await mongoose.connect(uri);
    console.log('✅ MongoDB connected successfully');
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
    console.log('Retrying in 5 seconds...');
    setTimeout(connectDB, 5000);
  }
};
connectDB();

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'LearnHub API is running 🚀' });
});

// Diagnostic — shows what env vars Render has loaded
app.get('/debug', (req, res) => {
  res.json({
    mongoUri: process.env.MONGODB_URI ? 'SET ✅' : 'MISSING ❌',
    mongoUriPreview: process.env.MONGODB_URI ? process.env.MONGODB_URI.substring(0, 30) + '...' : 'NOT SET',
    jwtSecret: process.env.JWT_SECRET ? 'SET ✅' : 'MISSING ❌',
    nodeEnv: process.env.NODE_ENV || 'not set',
    port: process.env.PORT || '5000',
    mongoState: mongoose.connection.readyState === 1 ? 'Connected ✅' : 'Disconnected ❌'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/teacher', teacherRoutes);
app.use('/api/parent', parentRoutes);
app.use('/api/courses', courseRoutes);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
