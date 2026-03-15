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

// Allow all origins (fixes CORS on Render/Vercel)
app.use(cors({ origin: '*', methods: ['GET','POST','PUT','DELETE','OPTIONS'], allowedHeaders: ['Content-Type','Authorization'] }));
app.use(express.json());

const io = socketIo(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
});

// MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err));

// Socket.io
io.on('connection', (socket) => {
  socket.on('join-room', (userId) => socket.join(userId));
});
app.set('io', io);

// Root health check — fixes "Cannot GET /"
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'LearnHub API is running 🚀', version: '1.0.0' });
});

app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/teacher', teacherRoutes);
app.use('/api/parent', parentRoutes);
app.use('/api/courses', courseRoutes);

// 404 handler
app.use((req, res) => res.status(404).json({ message: `Route ${req.method} ${req.url} not found` }));

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.get("/", (req, res) => {
  res.send("Learning Platform Backend is running");
});
