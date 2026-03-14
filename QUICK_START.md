# 🚀 Quick Start Guide

## Prerequisites Check

✅ Node.js installed? Run: `node --version`
✅ MongoDB ready? (Local or Atlas)

## 3-Step Setup

### Step 1: Install Dependencies

**Option A: Use the batch file (Windows)**
```bash
install-dependencies.bat
```

**Option B: Manual installation**
```bash
# Backend
cd server
npm install

# Frontend
cd client
npm install
```

### Step 2: Configure MongoDB

**Using Local MongoDB:**
- Default settings in `server/.env` work out of the box
- Just make sure MongoDB service is running

**Using MongoDB Atlas (Cloud):**
1. Sign up at https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get connection string
4. Update `server/.env`:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/learning-platform
```

### Step 3: Start the App

**Option A: Use the batch file (Windows)**
```bash
start-app.bat
```

**Option B: Manual start**

Terminal 1 - Backend:
```bash
cd server
npm start
```

Terminal 2 - Frontend:
```bash
cd client
npm start
```

## ✅ Verify It's Working

1. Backend should show:
   ```
   Server running on port 5000
   MongoDB connected
   ```

2. Frontend opens at: `http://localhost:3000`

3. You should see the landing page with "Learn Smart, Grow Fast"

## 🎯 First Test

1. Click "Register"
2. Create a teacher account
3. Create a course
4. Open incognito window
5. Register as student
6. Enroll in the course
7. ✅ Teacher receives real-time notification!

## 📚 Next Steps

- Read [TESTING_GUIDE.md](TESTING_GUIDE.md) for complete testing workflow
- Read [FEATURES_SUMMARY.md](FEATURES_SUMMARY.md) for all features
- Read [SETUP_GUIDE.md](SETUP_GUIDE.md) for detailed setup

## 🐛 Quick Troubleshooting

**MongoDB connection error?**
- Check if MongoDB is running
- Verify connection string in `server/.env`

**Port already in use?**
- Change PORT in `server/.env`
- Or kill the process using port 5000

**Dependencies error?**
- Delete `node_modules` folders
- Run `npm install` again

## 🎉 You're Ready!

The platform is now running with:
- ✅ Real-time notifications
- ✅ Course enrollment
- ✅ Assignment submission
- ✅ Progress tracking
- ✅ Parent monitoring

Happy learning! 🎓
