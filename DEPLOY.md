# 🚀 Deploy LearnHub as a Live App

## Option 1: Render (Backend) + Vercel (Frontend) — FREE

### Step 1: Deploy Backend to Render

1. Push your code to GitHub
2. Go to https://render.com → Sign up free
3. Click "New Web Service"
4. Connect your GitHub repo
5. Set:
   - Root Directory: `server`
   - Build Command: `npm install`
   - Start Command: `node server.js`
6. Add Environment Variables:
   ```
   MONGODB_URI=mongodb+srv://...  (your Atlas URI)
   JWT_SECRET=your_secret_key
   NODE_ENV=production
   PORT=5000
   ```
7. Click Deploy → Copy your URL (e.g. https://learnhub-api.onrender.com)

### Step 2: Deploy Frontend to Vercel

1. Go to https://vercel.com → Sign up free
2. Import your GitHub repo
3. Set:
   - Root Directory: `client`
   - Build Command: `npm run build`
   - Output Directory: `build`
4. Add Environment Variable:
   ```
   REACT_APP_API_URL=https://learnhub-api.onrender.com
   ```
5. Click Deploy → Your app is live!

---

## Option 2: Railway (Full Stack) — FREE

1. Go to https://railway.app
2. New Project → Deploy from GitHub
3. Add two services: one for `server`, one for `client`
4. Set environment variables for each

---

## Option 3: Run Locally (Already Working)

```bash
# Terminal 1 - Backend
cd server
npm start

# Terminal 2 - Frontend
cd client
npm start
```

Open: http://localhost:3000

---

## MongoDB Atlas Setup (Required for Cloud)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create free cluster
3. Database Access → Add user with password
4. Network Access → Allow 0.0.0.0/0
5. Connect → Drivers → Copy connection string
6. Replace `<password>` with your password
7. Use as MONGODB_URI in your deployment

---

## Demo Accounts (Pre-seeded)

| Role    | Email              | Password |
|---------|--------------------|----------|
| Student | student@demo.com   | demo123  |
| Teacher | teacher@demo.com   | demo123  |
| Parent  | parent@demo.com    | demo123  |

To seed demo accounts:
```bash
cd server
node seed.js
```
