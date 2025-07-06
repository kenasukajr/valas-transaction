@echo off
REM Quick Git Installer untuk Windows
echo Downloading Git untuk Windows...
echo.

REM Check if running as admin
net session >nul 2>&1
if %errorLevel% == 0 (
    echo Installing Git via winget...
    winget install --id Git.Git -e --source winget --silent
    if %errorLevel% == 0 (
        echo Git berhasil diinstall!
        echo Silakan restart terminal dan jalankan git-helper.bat lagi.
    ) else (
        echo Winget gagal. Silakan download manual dari: https://git-scm.com/download/win
    )
) else (
    echo Membutuhkan administrator privileges untuk install Git.
    echo.
    echo Pilihan:
    echo 1. Run as Administrator dan jalankan install-git.bat
    echo 2. Download manual dari: https://git-scm.com/download/win
)

pause
