@echo off
setlocal enabledelayedexpansion
REM Git Helper Script untuk Blackbox Project (Portable Version)

if "%1"=="" (
    echo Usage: git-helper.bat [command]
    echo.
    echo Commands:
    echo   status     - Show git status
    echo   checkpoint - Create a checkpoint commit
    echo   log        - Show commit history
    echo   reset      - Reset to last checkpoint
    echo   help       - Show this help
    goto :end
)

REM Auto-detect project root directory (one level up from git-tools)
cd /d "%~dp0\.."

REM Try to find Git executable
set GIT_CMD=git
git --version >nul 2>&1
if errorlevel 1 (
    set GIT_CMD="C:\Program Files\Git\bin\git.exe"
    "C:\Program Files\Git\bin\git.exe" --version >nul 2>&1
    if errorlevel 1 (
        echo Git not found! 
        echo.
        echo Opsi untuk install Git:
        echo 1. Jalankan: install-git.bat ^(otomatis^)
        echo 2. Download manual: https://git-scm.com/download/win
        echo.
        goto :end
    )
)

if "%1"=="status" (
    %GIT_CMD% status
) else if "%1"=="checkpoint" (
    if "%2"=="" (
        set /p message="Enter checkpoint message: "
    ) else (
        set message=%2 %3 %4 %5 %6 %7 %8 %9
    )
    %GIT_CMD% add .
    %GIT_CMD% commit -m "CHECKPOINT: !message!"
    echo Checkpoint created successfully!
) else if "%1"=="log" (
    %GIT_CMD% log --oneline -10
) else if "%1"=="reset" (
    echo WARNING: This will reset to the last commit and lose all changes!
    set /p confirm="Are you sure? (y/N): "
    if /i "!confirm!"=="y" (
        %GIT_CMD% reset --hard HEAD
        echo Reset completed!
    ) else (
        echo Reset cancelled.
    )
) else if "%1"=="help" (
    echo Git Helper Commands:
    echo   status     - Show current git status
    echo   checkpoint - Add all files and create a checkpoint commit
    echo   log        - Show last 10 commits
    echo   reset      - Reset to last commit ^(WARNING: loses changes^)
    echo   help       - Show this help
) else (
    echo Unknown command: %1
    echo Use 'git-helper.bat help' for available commands
)

:end
