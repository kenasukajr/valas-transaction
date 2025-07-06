@echo off
REM Server Manager Launcher
REM Quick launcher for Server Manager operations

if "%1"=="" goto :help
if "%1"=="help" goto :help
if "%1"=="--help" goto :help
if "%1"=="/?" goto :help

powershell.exe -ExecutionPolicy Bypass -File "%~dp0ServerManager.ps1" %*
goto :end

:help
echo.
echo Server Manager Launcher
echo.
echo Usage: %~nx0 [action] [ip]
echo.
echo Actions:
echo   gui             - Start Server Manager GUI (default)
echo   start-backend   - Start backend server
echo   stop-backend    - Stop backend server  
echo   start-frontend  - Start frontend server
echo   stop-frontend   - Stop frontend server
echo   restart-all     - Restart both servers
echo   status          - Check server status
echo   help            - Show this help
echo.
echo Examples:
echo   %~nx0 gui
echo   %~nx0 start-backend
echo   %~nx0 restart-all
echo   %~nx0 status
echo.

:end
