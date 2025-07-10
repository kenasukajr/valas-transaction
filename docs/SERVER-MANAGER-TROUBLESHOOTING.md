# Server Manager Troubleshooting Guide

## Masalah Umum dan Solusi

### 1. Backend Server Tidak Bisa Dijalankan

**Gejala:**
- Server Manager menunjukkan error saat menjalankan backend
- Error "Cannot find module 'googleapis'" atau dependencies lainnya
- Backend tidak response di port 5000

**Penyebab:**
- Dependencies Node.js tidak ter-install dengan lengkap
- Module googleapis atau dependencies backend lainnya hilang

**Solusi:**

#### Solusi Otomatis:
```powershell
# ServerManager sudah otomatis mengecek dependencies
.\ServerManager.ps1 start-backend
```

#### Solusi Manual:
```powershell
# 1. Install dependencies yang hilang
npm install

# 2. Install dependencies backend spesifik
npm install googleapis multer express cors

# 3. Test dependency
cd backend
node -e "console.log('Testing...'); require('express'); require('cors'); require('multer'); require('googleapis'); console.log('All dependencies OK');"

# 4. Jalankan backend
node server.js
```

### 2. Dependencies Check Script

Gunakan script untuk mengecek dependencies:
```powershell
.\scripts\check-dependencies.ps1
```

### 3. Manual Backend Start

Jika ServerManager tidak bekerja, jalankan backend manual:
```powershell
cd backend
node server.js
```

### 4. Port Conflict

Jika port 5000 sudah digunakan:
```powershell
# Stop semua process di port 5000
.\ServerManager.ps1 stop-backend

# Check port status
netstat -ano | findstr :5000
```

## Perintah ServerManager

```powershell
# GUI Mode (default)
.\ServerManager.ps1

# Command Line Mode
.\ServerManager.ps1 start-backend     # Start backend only
.\ServerManager.ps1 start-frontend    # Start frontend only  
.\ServerManager.ps1 restart-all       # Restart both servers
.\ServerManager.ps1 status           # Check server status
.\ServerManager.ps1 stop-backend     # Stop backend
.\ServerManager.ps1 stop-frontend    # Stop frontend

# Dengan IP spesifik
.\ServerManager.ps1 start-backend 192.168.1.100
```

## Verifikasi Backend

Setelah backend jalan, test dengan:
```powershell
# Test connection
curl http://localhost:5000/api/test

# Atau buka di browser:
# http://localhost:5000
# http://[IP-ADDRESS]:5000
```

## Log Files

- Backend logs: Console output di terminal
- Frontend logs: Console output di terminal
- Error logs: Lihat output di PowerShell terminal

## Dependencies Diperlukan

Backend membutuhkan:
- `express` - Web framework
- `cors` - Cross-Origin Resource Sharing
- `multer` - File upload handling
- `googleapis` - Google Drive integration

Frontend membutuhkan:
- `next` - React framework
- `react` - UI library
- `react-dom` - React DOM rendering

Semua dependencies tercantum di `package.json` dan akan ter-install otomatis dengan `npm install`.
