# Server Manager

Server Manager adalah aplikasi WPF untuk mengelola backend dan frontend server Blackbox application dengan mudah.

## Status Perbaikan ✅

**RESOLVED**: Masalah path backend directory telah diperbaiki!
- ❌ ~~Error: Backend folder not found: G:\Blackbox Versi 1.1\tools\backend~~
- ✅ **Fixed**: Backend sekarang menggunakan path yang benar: `G:\Blackbox Versi 1.1\backend`
- ✅ **Fixed**: PowerShell script menggunakan variable name yang tidak konflik
- ✅ **Fixed**: Path resolution di C# Server Manager diperbaiki

## Cara Penggunaan

### 1. Quick Start (Batch File)

```batch
# Cek status server
ServerManager.bat status

# Start GUI
ServerManager.bat gui

# Restart semua server
ServerManager.bat restart-all
```

### 2. Menggunakan PowerShell Script

```powershell
# Cek status server
.\ServerManager.ps1 status

# Start backend saja
.\ServerManager.ps1 start-backend

# Start frontend saja  
.\ServerManager.ps1 start-frontend

# Restart semua server
.\ServerManager.ps1 restart-all
```

### 3. Menggunakan GUI (Graphical User Interface)

```powershell
# Jalankan GUI
.\ServerManager.ps1 gui
# atau
ServerManager.bat gui
```

GUI menyediakan tombol untuk:
- **Start/Stop/Restart Backend** - Mengelola server Node.js backend pada port 5000
- **Start/Stop/Restart Frontend** - Mengelola server Next.js frontend pada port 8000  
- **Kill Port** - Membersihkan proses yang stuck pada port tertentu
- **Log Output** - Melihat log real-time dari semua operasi

### 2. Menggunakan Command Line

```powershell
# Cek status server
.\ServerManager.ps1 status

# Start backend saja
.\ServerManager.ps1 start-backend

# Start frontend saja  
.\ServerManager.ps1 start-frontend

# Stop backend
.\ServerManager.ps1 stop-backend

# Stop frontend
.\ServerManager.ps1 stop-frontend

# Restart semua server
.\ServerManager.ps1 restart-all

# Dengan IP spesifik
.\ServerManager.ps1 start-backend 192.168.1.100
.\ServerManager.ps1 start-frontend 192.168.1.100
```

## Fitur

### Automatic IP Detection
Server Manager secara otomatis mendeteksi IP LAN yang tersedia:
- Jika hanya ada 1 IP → Otomatis digunakan
- Jika ada beberapa IP → Menampilkan dialog pemilihan
- Jika tidak ada IP valid → Fallback ke localhost

### Environment Management
- Otomatis update `.env.local` dengan `NEXT_PUBLIC_BACKEND_URL`
- Mengkonfigurasi backend untuk listen pada `0.0.0.0` (semua interface)
- Mengelola komunikasi antara frontend dan backend

### Process Management
- Tracking PID untuk setiap server
- Clean shutdown dan restart
- Kill stuck processes pada port yang digunakan
- Real-time log monitoring

## Troubleshooting

### Error: Address already in use
```powershell
# Kill proses pada port tertentu
.\ServerManager.ps1 stop-backend    # untuk port 5000
.\ServerManager.ps1 stop-frontend   # untuk port 8000
```

### GUI tidak muncul
1. Pastikan .NET 8 Runtime terinstall
2. Coba jalankan dari command line untuk melihat error
3. Build ulang jika perlu:
   ```powershell
   dotnet build tools/server-manager/ServerManager.sln
   ```

### Backend/Frontend tidak start
1. Pastikan Node.js dan npm terinstall
2. Pastikan dependencies terinstall (`npm install`)
3. Cek log output di GUI atau terminal
4. Pastikan file `server.js` ada di folder `backend/`

## File yang Dikelola

- `backend/server.js` - Backend server Node.js
- `.env.local` - Environment variables untuk Next.js
- `package.json` - Dependencies dan scripts

## Network Configuration

Server Manager mengkonfigurasi network sebagai berikut:
- **Backend**: `http://[IP]:5000` - Listen pada semua interface
- **Frontend**: `http://[IP]:8000` - Next.js dev server
- **API Proxy**: Frontend memproxy `/api/*` ke backend via Next.js config

## Dependencies

- **Windows**: WPF application, requires Windows OS
- **.NET 8**: Runtime diperlukan untuk menjalankan GUI
- **Node.js**: Diperlukan untuk backend dan frontend
- **npm**: Package manager untuk dependencies

## Build dari Source

Jika perlu rebuild Server Manager:

```powershell
cd tools/server-manager
dotnet build
# atau
dotnet publish -c Release
```

Executable akan tersedia di `bin/Debug/net8.0-windows/` atau `bin/Release/net8.0-windows/`
