# Digital Learning Platform - Setup Guide

## Prerequisites

1. **Node.js & npm** - Download from https://nodejs.org/ (LTS version recommended)
2. **MongoDB** - Choose one option:
   - **Local Installation**: Download from https://www.mongodb.com/try/download/community
   - **MongoDB Atlas (Cloud)**: Sign up at https://www.mongodb.com/cloud/atlas (Free tier available)

## Installation Steps

### 1. Install Dependencies

**Backend:**
```bash
cd server
npm install
```

**Frontend:**
```bash
cd client
npm install
```

### 2. Configure MongoDB

**Option A: Local MongoDB**
- Ensure MongoDB service is running
- Default connection string is already set in `server/.env`

**Option B: MongoDB Atlas (Cloud)**
1. Create a free cluster at MongoDB Atlas
2. Get your connection string
3. Update `server/.env`:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/learning-platform
```

### 3. Environment Variables

Check `server/.env` file:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/learning-platform
JWT_SECRET=your_jwt_secret_key_change_in_production
```

**Important:** Change `JWT_SECRET` to a secure random string in production!

### 4. Start the Application

**Terminal 1 - Backend Server:**
```bash
cd server
npm start
```
You should see:
- `Server running on port 5000`
- `MongoDB connected`

**Terminal 2 - Frontend:**
```bash
cd client
npm start
```
The app will open at `http://localhost:3000`

## Features Overview

### For Students:
- Browse and enroll in courses
- View video lessons
- Submit assignments
- Take quizzes
- Track progress with visual dashboards
- Real-time notifications for new content

### For Teachers:
- Create and manage courses
- Upload video content
- Create assignments
- Grade student submissions
- View student performance
- Real-time notifications for submissions

### For Parents:
- Link to student account
- Track child's progress
- View attendance and grades
- Monitor course enrollment
- See assignment completion rates

## Real-Time Features

The platform uses Socket.IO for real-time notifications:
- Students get notified when teachers post new content
- Teachers get notified when students submit assignments
- Parents see live updates of their child's progress

## Testing the Platform

1. **Register as a Teacher:**
   - Go to Register page
   - Select "Teacher" role
   - Fill in subject specialization and experience

2. **Create a Course:**
   - Login as teacher
   - Click "Create Course"
   - Add course details

3. **Register as a Student:**
   - Register with "Student" role
   - Fill in grade and school details

4. **Enroll in Course:**
   - Login as student
   - Go to "Browse" tab
   - Click "Enroll Now" on available courses

5. **Submit Assignment:**
   - Teacher creates assignment
   - Student receives real-time notification
   - Student submits assignment
   - Teacher grades it

6. **Parent Tracking:**
   - Register as "Parent"
   - Link student account using student's email
   - View comprehensive progress dashboard

## Troubleshooting

**MongoDB Connection Error:**
- Ensure MongoDB service is running
- Check connection string in `.env`
- For Atlas, ensure IP whitelist is configured

**Port Already in Use:**
- Change PORT in `server/.env`
- Update API URLs in frontend files

**Real-time Notifications Not Working:**
- Ensure both frontend and backend are running
- Check browser console for Socket.IO connection errors

## Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components (Notifications)
│   │   ├── pages/         # Page components (Dashboards, Auth)
│   │   ├── context/       # Auth context
│   │   └── App.jsx
│   └── package.json
├── server/                # Node.js backend
│   ├── models/           # MongoDB schemas
│   ├── routes/           # API routes
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Auth middleware
│   └── server.js
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Student Routes
- `GET /api/student/courses` - Get enrolled courses
- `POST /api/student/courses/:id/enroll` - Enroll in course
- `GET /api/student/assignments` - Get assignments
- `POST /api/student/assignments/:id/submit` - Submit assignment
- `GET /api/student/progress` - Get progress stats

### Teacher Routes
- `POST /api/teacher/courses` - Create course
- `GET /api/teacher/courses` - Get teacher's courses
- `POST /api/teacher/courses/:id/videos` - Add video to course
- `POST /api/teacher/assignments` - Create assignment
- `POST /api/teacher/assignments/:assignmentId/grade/:submissionId` - Grade assignment

### Parent Routes
- `POST /api/parent/link-student` - Link student account
- `GET /api/parent/child-progress` - Get child's progress

### Public Routes
- `GET /api/courses` - Get all available courses

## Next Steps

- Add file upload for assignments (using Multer)
- Implement quiz functionality
- Add video player integration
- Create admin panel
- Add email notifications
- Implement payment gateway for premium courses
- Add dark mode toggle
- Create mobile app version

## Support

For issues or questions, check the console logs in both terminals for error messages.
