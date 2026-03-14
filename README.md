<<<<<<< HEAD
# Digital Learning Platform 🎓

A full-stack EdTech platform inspired by Byju's, Unacademy, and Khan Academy with real-time features.

## ✨ Key Features

### 🎯 Real-Time Notifications
- Live updates using Socket.IO
- Students notified of new assignments, quizzes, and videos
- Teachers notified of assignment submissions
- Parents see real-time progress updates

### 👨‍🎓 Student Features
- Browse and enroll in courses
- View video lessons
- Submit assignments with text content
- Take quizzes and get instant scores
- Visual progress tracking dashboard
- Real-time notifications

### 👩‍🏫 Teacher Features
- Create and manage courses
- Upload video content to courses
- Create assignments with due dates
- Grade student submissions
- View student performance analytics
- Track enrolled students per course

### 👨‍👩‍👧 Parent Features
- Link to student account via email
- Comprehensive progress dashboard
- Track attendance and grades
- Monitor course enrollment
- View assignment completion rates
- Real-time activity feed

## 🛠 Tech Stack

**Frontend:** 
- React.js
- Tailwind CSS (via CDN)
- Axios
- React Router
- Socket.IO Client

**Backend:** 
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcrypt
- Socket.IO Server
- Multer (for file uploads)

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)

### Installation

**1. Install Backend Dependencies:**
```bash
cd server
npm install
```

**2. Install Frontend Dependencies:**
```bash
cd client
npm install
```

**3. Configure MongoDB:**
- For local MongoDB: Default settings in `server/.env` work
- For MongoDB Atlas: Update `MONGODB_URI` in `server/.env`

**4. Start Backend Server:**
```bash
cd server
npm start
```
Should see: `Server running on port 5000` and `MongoDB connected`

**5. Start Frontend (new terminal):**
```bash
cd client
npm start
```
Opens at `http://localhost:3000`

📖 **For detailed setup instructions, see [SETUP_GUIDE.md](SETUP_GUIDE.md)**

## Default Configuration

- Backend runs on port 5000
- Frontend runs on port 3000
- MongoDB connection: `mongodb://localhost:27017/learning-platform`

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user with role
- `POST /api/auth/login` - Login with email, password, and role

### Student Routes
- `GET /api/student/courses` - Get enrolled courses
- `POST /api/student/courses/:id/enroll` - Enroll in course
- `GET /api/student/assignments` - Get assignments for enrolled courses
- `POST /api/student/assignments/:id/submit` - Submit assignment
- `GET /api/student/quizzes` - Get available quizzes
- `POST /api/student/quizzes/:id/submit` - Submit quiz answers
- `GET /api/student/progress` - Get progress statistics

### Teacher Routes
- `POST /api/teacher/courses` - Create new course
- `GET /api/teacher/courses` - Get teacher's courses with enrolled students
- `POST /api/teacher/courses/:id/videos` - Add video to course
- `POST /api/teacher/assignments` - Create assignment
- `GET /api/teacher/assignments` - Get assignments with submissions
- `POST /api/teacher/assignments/:assignmentId/grade/:submissionId` - Grade submission
- `POST /api/teacher/quizzes` - Create quiz
- `GET /api/teacher/students/:courseId/performance` - Get student performance

### Parent Routes
- `POST /api/parent/link-student` - Link student account by email
- `GET /api/parent/child-progress` - Get comprehensive child progress

### Public Routes
- `GET /api/courses` - Browse all available courses

## Environment Variables

Create `server/.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/learning-platform
JWT_SECRET=your_secret_key_here
```

## 📁 Project Structure

```
digital-learning-platform/
├── client/                      # React frontend
│   ├── public/
│   │   └── index.html          # HTML with Tailwind CDN
│   ├── src/
│   │   ├── components/
│   │   │   └── Notifications.jsx    # Real-time notifications
│   │   ├── pages/
│   │   │   ├── Landing.jsx          # Landing page
│   │   │   ├── Login.jsx            # Login with role selection
│   │   │   ├── Register.jsx         # Role-based registration
│   │   │   ├── StudentDashboard.jsx # Student dashboard
│   │   │   ├── TeacherDashboard.jsx # Teacher dashboard
│   │   │   ├── ParentDashboard.jsx  # Parent dashboard
│   │   │   └── BrowseCourses.jsx    # Course catalog
│   │   ├── context/
│   │   │   └── AuthContext.jsx      # Authentication context
│   │   ├── App.jsx                  # Main app with routing
│   │   └── index.js
│   └── package.json
├── server/                      # Node.js backend
│   ├── models/
│   │   ├── User.js             # User schema with roles
│   │   ├── Course.js           # Course schema
│   │   ├── Assignment.js       # Assignment schema
│   │   └── Quiz.js             # Quiz schema
│   ├── routes/
│   │   ├── auth.js             # Authentication routes
│   │   ├── student.js          # Student routes
│   │   ├── teacher.js          # Teacher routes
│   │   ├── parent.js           # Parent routes
│   │   └── courses.js          # Public course routes
│   ├── controllers/
│   │   └── authController.js   # Auth logic
│   ├── middleware/
│   │   └── auth.js             # JWT & role-based auth
│   ├── .env                    # Environment variables
│   ├── server.js               # Main server with Socket.IO
│   └── package.json
├── README.md
└── SETUP_GUIDE.md              # Detailed setup instructions
```


## 🎯 How It Works

### Course Enrollment Flow
1. Teacher creates a course
2. Course appears in "Browse Courses" for all students
3. Student enrolls in course
4. Teacher receives real-time notification
5. Student can access course content, assignments, and quizzes

### Assignment Flow
1. Teacher creates assignment for a course
2. All enrolled students receive real-time notification
3. Students submit assignment with text content
4. Teacher receives notification of submission
5. Teacher grades the assignment
6. Student receives notification of grade
7. Parent can view submission status and grade

### Parent Tracking Flow
1. Parent registers and logs in
2. Parent links to student account using student's email
3. System fetches all student data:
   - Enrolled courses
   - Assignment completion rate
   - Quiz scores
   - Overall progress
4. Parent dashboard updates in real-time

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Protected API routes
- Secure token storage

## 🌟 Real-Time Features (Socket.IO)

The platform uses WebSocket connections for instant updates:

**Student Notifications:**
- New assignment posted
- New quiz available
- New video uploaded
- Assignment graded

**Teacher Notifications:**
- Student enrolled in course
- Assignment submitted
- Quiz completed

**Parent Notifications:**
- Real-time progress updates
- Grade changes
- New course enrollments

## 🎨 UI/UX Features

- Modern gradient designs
- Responsive layout (mobile-friendly)
- Tab-based navigation
- Modal dialogs for forms
- Progress bars and statistics
- Color-coded role dashboards
- Smooth animations
- Real-time notification toasts

## 📊 Data Persistence

All data is stored in MongoDB:
- User accounts with role-specific fields
- Course content and videos
- Assignment submissions with grades
- Quiz attempts with scores
- Parent-student linkages
- Real-time activity logs

## 🚀 Future Enhancements

- [ ] Video player integration (YouTube/Vimeo)
- [ ] File upload for assignments (PDF, images)
- [ ] Live video classes (WebRTC)
- [ ] Discussion forums
- [ ] Certificate generation
- [ ] Payment integration for premium courses
- [ ] Email notifications
- [ ] Mobile app (React Native)
- [ ] Admin panel
- [ ] Analytics dashboard
- [ ] Dark mode
- [ ] Multi-language support

## 🐛 Troubleshooting

**MongoDB Connection Failed:**
- Ensure MongoDB is running
- Check connection string in `.env`
- For Atlas, whitelist your IP

**Real-time Notifications Not Working:**
- Check if both servers are running
- Verify Socket.IO connection in browser console
- Ensure CORS is properly configured

**Port Already in Use:**
- Change PORT in `server/.env`
- Update API URLs in frontend

## 📝 License

This project is open source and available for educational purposes.

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues and pull requests.

---

Built with ❤️ for education
=======
# learning-platform
A digital learning platform that provides interactive courses, video lessons, and quizzes to help students learn new skills anytime and anywhere.
>>>>>>> 83f1fc6ddc2224da574f0edc75fc6a8bc2711649
