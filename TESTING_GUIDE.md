# Testing Guide - Digital Learning Platform

## Complete Testing Workflow

### Step 1: Start the Application

**Terminal 1 - Backend:**
```bash
cd server
npm start
```
✅ Expected output:
```
Server running on port 5000
MongoDB connected
```

**Terminal 2 - Frontend:**
```bash
cd client
npm start
```
✅ Opens browser at `http://localhost:3000`

---

## Test Scenario 1: Teacher Creates Course

### 1.1 Register as Teacher
1. Click "Register" on landing page
2. Fill in:
   - Name: John Teacher
   - Email: teacher@test.com
   - Password: password123
   - Confirm Password: password123
   - Role: Teacher
   - Subject Specialization: Mathematics
   - Years of Experience: 5
   - Qualification: M.Sc Mathematics
3. Click "Register"
4. ✅ Should redirect to Teacher Dashboard

### 1.2 Create a Course
1. Click "Create Course" button
2. Fill in:
   - Course Title: Advanced Calculus
   - Description: Learn calculus from basics to advanced
3. Click "Create"
4. ✅ Course appears in dashboard
5. ✅ Shows "0 students enrolled"

### 1.3 Add Video to Course
1. Click "Add Video" on the course card
2. Fill in:
   - Video Title: Introduction to Limits
   - Video URL: https://youtube.com/watch?v=example
   - Duration: 15:30
3. Click "Add Video"
4. ✅ Video added successfully

### 1.4 Create Assignment
1. Go to "Assignments" tab
2. Click "Create Assignment"
3. Fill in:
   - Select Course: Advanced Calculus
   - Assignment Title: Limits Practice Problems
   - Description: Solve problems 1-10 from chapter 2
   - Due Date: Select a future date
4. Click "Create"
5. ✅ Assignment appears in list

---

## Test Scenario 2: Student Enrolls and Submits

### 2.1 Register as Student
1. Open new incognito/private window (or logout)
2. Click "Register"
3. Fill in:
   - Name: Alice Student
   - Email: student@test.com
   - Password: password123
   - Confirm Password: password123
   - Role: Student
   - Grade/Class: Grade 12
   - School Name: Central High School
   - Interests: Math, Science
4. Click "Register"
5. ✅ Should redirect to Student Dashboard

### 2.2 Browse and Enroll in Course
1. Click "Browse" tab
2. ✅ See "Advanced Calculus" course
3. Click "Enroll Now"
4. ✅ Alert: "Enrolled successfully!"
5. ✅ Teacher receives real-time notification (check teacher dashboard)

### 2.3 View Course Content
1. Go to "Courses" tab
2. ✅ See "Advanced Calculus" with teacher name
3. ✅ See video: "Introduction to Limits"

### 2.4 Submit Assignment
1. Go to "Assignments" tab
2. ✅ See "Limits Practice Problems"
3. Click "Submit" button
4. Enter submission text:
   ```
   Problem 1: lim(x→0) sin(x)/x = 1
   Problem 2: lim(x→∞) 1/x = 0
   [... more solutions ...]
   ```
5. Click "Submit"
6. ✅ Alert: "Assignment submitted successfully!"
7. ✅ Status changes to "Submitted"
8. ✅ Teacher receives real-time notification

### 2.5 Check Progress
1. Go to "Overview" tab
2. ✅ See statistics:
   - Enrolled Courses: 1
   - Assignments: 1/1
   - Progress bar showing completion

---

## Test Scenario 3: Teacher Grades Assignment

### 3.1 View Submissions
1. Switch back to teacher account
2. Go to "Assignments" tab
3. ✅ See "Limits Practice Problems"
4. ✅ See "Submissions (1)"
5. ✅ See student name: Alice Student
6. ✅ See submission content

### 3.2 Grade the Assignment
1. Enter grade in the input field: 85
2. Press Enter or click outside
3. ✅ Alert: "Assignment graded successfully!"
4. ✅ Student receives real-time notification
5. ✅ Grade shows as "Current: 85%"

---

## Test Scenario 4: Parent Tracks Progress

### 4.1 Register as Parent
1. Open new incognito/private window
2. Click "Register"
3. Fill in:
   - Name: Bob Parent
   - Email: parent@test.com
   - Password: password123
   - Confirm Password: password123
   - Role: Parent
   - Child Name: Alice Student
   - Child Grade: Grade 12
   - Contact Number: 555-0123
4. Click "Register"
5. ✅ Should redirect to Parent Dashboard

### 4.2 Link Student Account
1. ✅ See "No Student Linked" message
2. Click "Link Student Account"
3. Enter student email: student@test.com
4. Click "Link Account"
5. ✅ Alert: "Student linked successfully!"

### 4.3 View Child Progress
1. ✅ Dashboard updates with student information
2. ✅ See statistics:
   - Enrolled Courses: 1
   - Attendance: 100%
   - Avg Grade: 85%
   - Quiz Score: 0% (no quizzes taken yet)
3. ✅ See enrolled course: "Advanced Calculus"
4. ✅ See assignment progress: 1/1 submitted
5. ✅ See recent activity

---

## Test Scenario 5: Real-Time Notifications

### 5.1 Test Student Notifications
1. Have student logged in
2. Teacher creates new assignment
3. ✅ Student sees notification toast appear
4. ✅ Notification shows assignment title

### 5.2 Test Teacher Notifications
1. Have teacher logged in
2. Student enrolls in course
3. ✅ Teacher sees notification toast
4. ✅ Shows student enrolled message

---

## Test Scenario 6: Multiple Courses

### 6.1 Create Second Course
1. As teacher, create another course:
   - Title: Linear Algebra
   - Description: Matrices and vector spaces
2. ✅ Both courses visible in dashboard

### 6.2 Student Enrolls in Multiple Courses
1. As student, go to "Browse" tab
2. Enroll in "Linear Algebra"
3. ✅ Overview shows: Enrolled Courses: 2

---

## Verification Checklist

### Authentication ✅
- [ ] Register with all three roles works
- [ ] Login with correct credentials works
- [ ] Login with wrong credentials fails
- [ ] Role-based registration fields appear
- [ ] JWT token stored in localStorage
- [ ] Logout clears token and redirects

### Student Features ✅
- [ ] Can browse all courses
- [ ] Can enroll in courses
- [ ] Can view enrolled courses
- [ ] Can see course videos
- [ ] Can view assignments
- [ ] Can submit assignments
- [ ] Can see progress statistics
- [ ] Receives real-time notifications

### Teacher Features ✅
- [ ] Can create courses
- [ ] Can add videos to courses
- [ ] Can create assignments
- [ ] Can view submissions
- [ ] Can grade assignments
- [ ] Can see enrolled students
- [ ] Receives real-time notifications

### Parent Features ✅
- [ ] Can link student account
- [ ] Can view child's courses
- [ ] Can see assignment progress
- [ ] Can view grades
- [ ] Can see attendance
- [ ] Dashboard updates in real-time

### Data Persistence ✅
- [ ] User data saved to MongoDB
- [ ] Courses persist after refresh
- [ ] Assignments persist after refresh
- [ ] Submissions saved correctly
- [ ] Grades saved correctly
- [ ] Parent-student link persists

### Real-Time Features ✅
- [ ] Socket.IO connection established
- [ ] Notifications appear instantly
- [ ] Multiple users can be online
- [ ] Notifications are role-specific

---

## Common Issues & Solutions

### Issue: MongoDB Connection Failed
**Solution:** 
- Ensure MongoDB is running
- Check connection string in `server/.env`
- For Atlas, whitelist your IP address

### Issue: Real-time notifications not working
**Solution:**
- Check browser console for Socket.IO errors
- Ensure both frontend and backend are running
- Verify CORS settings in server.js

### Issue: "Cannot find module" error
**Solution:**
```bash
cd server
npm install

cd ../client
npm install
```

### Issue: Port already in use
**Solution:**
- Change PORT in `server/.env`
- Or kill the process using the port:
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

---

## Performance Testing

### Load Testing
1. Create 10 courses
2. Register 5 students
3. Enroll all students in all courses
4. Create 20 assignments
5. Submit all assignments
6. ✅ System should remain responsive

### Real-Time Testing
1. Open 3 browser windows (Teacher, Student, Parent)
2. Perform actions in one window
3. ✅ Other windows update in real-time

---

## Database Verification

### Check MongoDB Data
```bash
# Connect to MongoDB
mongo

# Use the database
use learning-platform

# Check collections
show collections

# View users
db.users.find().pretty()

# View courses
db.courses.find().pretty()

# View assignments
db.assignments.find().pretty()
```

---

## Success Criteria

✅ All three roles can register and login
✅ Teachers can create courses and assignments
✅ Students can enroll and submit work
✅ Parents can track child progress
✅ Real-time notifications work
✅ Data persists in MongoDB
✅ UI is responsive and user-friendly
✅ No console errors
✅ All API endpoints return correct data

---

## Next Steps After Testing

1. Deploy to production (Heroku, Vercel, etc.)
2. Add more features (file uploads, quizzes, etc.)
3. Implement email notifications
4. Add payment integration
5. Create mobile app
6. Add analytics dashboard
