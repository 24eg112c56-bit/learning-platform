@echo off
echo ========================================
echo Digital Learning Platform
echo ========================================
echo.

echo Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js found!
echo.

echo Checking MongoDB connection...
echo Make sure MongoDB is running before continuing.
echo.
pause

echo Starting Backend Server...
start cmd /k "cd server && npm start"

timeout /t 3 /nobreak >nul

echo Starting Frontend...
start cmd /k "cd client && npm start"

echo.
echo ========================================
echo Application is starting!
echo ========================================
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Press any key to exit this window...
pause >nul
