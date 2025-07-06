@echo off
REM Simple Git Launcher - Portable dan Robust
echo Git Status Checker...

REM Change to project directory 
cd /d "%~dp0"

REM Check if .git exists
if not exist ".git" (
    echo ERROR: No Git repository found!
    echo Make sure you're in the project root directory.
    pause
    exit /b 1
)

REM Try Git locations
set GIT_EXE=""
if exist "C:\Program Files\Git\bin\git.exe" (
    set GIT_EXE="C:\Program Files\Git\bin\git.exe"
) else if exist "C:\Program Files (x86)\Git\bin\git.exe" (
    set GIT_EXE="C:\Program Files (x86)\Git\bin\git.exe"
) else (
    echo Git not found! Please install Git.
    echo Download: https://git-scm.com/download/win
    pause
    exit /b 1
)

echo Using Git: %GIT_EXE%
echo.

REM Show current status
echo === Git Status ===
%GIT_EXE% status --porcelain
if errorlevel 1 (
    echo Git command failed!
    pause
    exit /b 1
)

echo.
echo === Recent Commits ===
%GIT_EXE% log --oneline -5

echo.
echo Commands available:
echo - To commit: git-commit.bat "message"
echo - To see full status: git-status.bat
echo - To see log: git-log.bat

pause
