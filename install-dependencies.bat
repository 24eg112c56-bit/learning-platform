@echo off
echo ========================================
echo Installing Dependencies
echo ========================================
echo.

echo [1/2] Installing Backend Dependencies...
cd server
call npm install
if errorlevel 1 (
    echo ERROR: Backend installation failed!
    pause
    exit /b 1
)
cd ..

echo.
echo [2/2] Installing Frontend Dependencies...
cd client
call npm install
if errorlevel 1 (
    echo ERROR: Frontend installation failed!
    pause
    exit /b 1
)
cd ..

echo.
echo ========================================
echo Installation Complete!
echo ========================================
echo.
echo Dependencies installed:
echo - Backend: Express, MongoDB, Socket.IO, JWT, bcrypt
echo - Frontend: React, Axios, Socket.IO Client, React Router
echo.
echo Next steps:
echo 1. Make sure MongoDB is running
echo 2. Run start-app.bat to start the application
echo.
pause
