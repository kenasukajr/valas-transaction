@echo off
REM Simple batch script to start backend and frontend servers in background without opening terminal windows

REM Start backend server in background
start /b cmd /c "cd backend && npm run backend > ..\backend.log 2>&1"

REM Start frontend server in background
start /b cmd /c "npm run dev > frontend.log 2>&1"

echo Backend and frontend servers started in background.
REM No pause to keep script running in background
