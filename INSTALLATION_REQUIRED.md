# ⚠️ IMPORTANT: Additional Dependencies Required

## Missing Dependencies

The following dependencies need to be installed for the real-time features to work:

### Client (Frontend)
```bash
cd client
npm install socket.io-client
```

### Server (Backend)
```bash
cd server
npm install socket.io multer
```

## Quick Install

Run these commands in order:

**1. Install Server Dependencies:**
```bash
cd server
npm install
```

**2. Install Client Dependencies:**
```bash
cd client
npm install
```

## Verify Installation

After installation, verify with:

```bash
# Check server
cd server
npm list socket.io

# Check client
cd client
npm list socket.io-client
```

## Then Start the App

```bash
# Terminal 1 - Backend
cd server
npm start

# Terminal 2 - Frontend
cd client
npm start
```

## Alternative: Use the Batch File

```bash
install-dependencies.bat
```

This will install all required dependencies automatically.

---

**Note**: The platform will work without these, but real-time notifications won't function until socket.io is installed.
