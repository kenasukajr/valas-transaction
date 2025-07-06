@echo off
REM Quick Git Commit
if "%1"=="" (
    echo Usage: git-commit.bat "commit message"
    pause
    exit /b 1
)

cd /d "%~dp0"

set GIT_EXE=""
if exist "C:\Program Files\Git\bin\git.exe" (
    set GIT_EXE="C:\Program Files\Git\bin\git.exe"
) else if exist "C:\Program Files (x86)\Git\bin\git.exe" (
    set GIT_EXE="C:\Program Files (x86)\Git\bin\git.exe"
) else (
    echo Git not found!
    pause
    exit /b 1
)

echo Adding all files...
%GIT_EXE% add .

echo Committing with message: %1
%GIT_EXE% commit -m "CHECKPOINT: %*"

echo.
echo Commit completed!
pause
