@echo off
echo ===============================================
echo  STARTING FRONTEND WITH AUTO IP DETECTION
echo ===============================================
echo.

:: Auto-detect IP address
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /i "IPv4"') do (
    for /f "tokens=1" %%b in ("%%a") do (
        if not "%%b"=="127.0.0.1" (
            set "AUTO_IP=%%b"
            goto :found_ip
        )
    )
)

:found_ip
if not defined AUTO_IP set AUTO_IP=localhost

echo Frontend akan berjalan di:
echo - Lokal: http://localhost:8000
echo - Network: http://%AUTO_IP%:8000
echo.
echo Komputer lain di jaringan bisa mengakses dengan:
echo http://%AUTO_IP%:8000
echo.
echo IP Address terdeteksi: %AUTO_IP%
echo.
echo ===============================================

cd "e:\Versi 1.4.4"
set NETWORK_MODE=auto
npm run dev -- --hostname 0.0.0.0 --port 8000
