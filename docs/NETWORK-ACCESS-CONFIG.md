# Konfigurasi Network Access untuk Blackbox App

## Overview
Aplikasi ini telah dikonfigurasi untuk full online access agar bisa diakses dari semua komputer dalam 1 jaringan local.

## Network Configuration

### IP Address
- **Host Server**: 192.168.1.6
- **Frontend Port**: 8000
- **Backend Port**: 5000

### Frontend Access URLs
- **Local**: http://localhost:8000
- **Network**: http://192.168.1.6:8000

### Backend API URLs
- **Local**: http://localhost:5000/api/*
- **Network**: http://192.168.1.6:5000/api/*

## Configuration Files Updated

### 1. .env.local
```bash
NEXT_PUBLIC_BACKEND_URL=http://192.168.1.6:5000
BACKEND_URL=http://192.168.1.6:5000
```

### 2. backend/server.js
- **Port**: 5000
- **Bind Address**: 0.0.0.0 (allows network access)
- **CORS Origins**: Added 192.168.1.6:8000, 192.168.1.6:3000, 192.168.1.6:5000

### 3. package.json
```json
"dev": "next dev -H 0.0.0.0 -p 8000"
```
- `-H 0.0.0.0`: Bind to all network interfaces
- `-p 8000`: Use port 8000

### 4. TransactionSummaryTable.tsx
- Updated to use `backendUrl` prop from environment variable
- Fallback to `http://192.168.1.6:5000` if backendUrl not provided

## Server Manager
Kedua server (frontend dan backend) sudah berjalan melalui Server Manager dengan konfigurasi network access.

## Network Access Test
✅ Frontend: http://192.168.1.6:8000 - ACCESSIBLE
✅ Backend API: http://192.168.1.6:5000/api/nasabah - ACCESSIBLE

## Devices Access
Komputer lain dalam jaringan 192.168.1.x dapat mengakses aplikasi melalui:
- **Frontend**: http://192.168.1.6:8000
- **API**: http://192.168.1.6:5000/api/*

## Security Notes
- Application bind ke 0.0.0.0 untuk network access
- CORS dikonfigurasi untuk mengizinkan origin dari network IP
- Firewall mungkin perlu dikonfigurasi untuk mengizinkan port 8000 dan 5000

## Troubleshooting
1. **Tidak bisa akses dari komputer lain**: 
   - Check firewall Windows
   - Pastikan kedua server berjalan dengan Server Manager
   
2. **CORS Error**:
   - Pastikan IP komputer client ada dalam allowedOrigins di server.js
   
3. **Timeout Error**:
   - Check koneksi jaringan
   - Pastikan environment variable NEXT_PUBLIC_BACKEND_URL benar
