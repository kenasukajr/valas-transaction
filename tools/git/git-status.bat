@echo off
REM Quick Git Status
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

echo === Git Status ===
%GIT_EXE% status

pause
