@echo off
echo ===============================================
echo  CLEANUP TEMPORARY AHK FILES  
echo ===============================================
echo.

set "TEMP_DIR=e:\Versi 1.4.4\temp"

if exist "%TEMP_DIR%" (
    echo Cleaning up temporary files in: %TEMP_DIR%
    echo.
    
    for %%f in ("%TEMP_DIR%\script_*.ahk") do (
        echo Deleting: %%~nxf
        del "%%f" 2>nul
    )
    
    echo.
    echo Cleanup completed!
) else (
    echo Temp directory not found: %TEMP_DIR%
)

echo.
pause
