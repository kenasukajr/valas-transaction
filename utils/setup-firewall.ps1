# Script untuk mengkonfigurasi Windows Firewall untuk Network Access
# Jalankan sebagai Administrator

Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "  KONFIGURASI FIREWALL UNTUK NETWORK ACCESS" -ForegroundColor Cyan  
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host ""

# Auto-detect IP address
$networkAdapters = Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.IPAddress -ne "127.0.0.1" -and $_.PrefixOrigin -eq "Dhcp" }
$autoIP = $networkAdapters[0].IPAddress

if (-not $autoIP) {
    $autoIP = "localhost"
}

Write-Host "IP Address terdeteksi: $autoIP" -ForegroundColor Yellow
Write-Host ""

# Check if running as Administrator
if (-NOT ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
    Write-Host "ERROR: Script ini harus dijalankan sebagai Administrator!" -ForegroundColor Red
    Write-Host "Klik kanan PowerShell dan pilih 'Run as Administrator'" -ForegroundColor Yellow
    pause
    exit 1
}

Write-Host "Menambahkan firewall rules..." -ForegroundColor Green

try {
    # Add firewall rule for port 8000 (Frontend)
    New-NetFirewallRule -DisplayName "Next.js Dev Server (Port 8000)" -Direction Inbound -Port 8000 -Protocol TCP -Action Allow -ErrorAction Stop
    Write-Host "✓ Port 8000 (Frontend) - BERHASIL ditambahkan" -ForegroundColor Green
} catch {
    Write-Host "✗ Port 8000 (Frontend) - Gagal atau sudah ada" -ForegroundColor Yellow
}

try {
    # Add firewall rule for port 5000 (Backend)  
    New-NetFirewallRule -DisplayName "Backend API Server (Port 5000)" -Direction Inbound -Port 5000 -Protocol TCP -Action Allow -ErrorAction Stop
    Write-Host "✓ Port 5000 (Backend) - BERHASIL ditambahkan" -ForegroundColor Green
} catch {
    Write-Host "✗ Port 5000 (Backend) - Gagal atau sudah ada" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "  KONFIGURASI SELESAI" -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Sekarang komputer lain bisa mengakses:" -ForegroundColor Green
Write-Host "- Frontend: http://$autoIP:8000" -ForegroundColor White
Write-Host "- Backend:  http://$autoIP:5000" -ForegroundColor White
Write-Host ""
Write-Host "Untuk menjalankan frontend dengan network access:" -ForegroundColor Yellow
Write-Host "start-frontend-network.bat" -ForegroundColor White
Write-Host ""

pause
