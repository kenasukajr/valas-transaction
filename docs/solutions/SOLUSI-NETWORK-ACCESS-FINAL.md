# SOLUSI LENGKAP: NETWORK ACCESS & FETCH FAILED

## 🎯 MASALAH UTAMA
- Error "fetch failed" terjadi karena masalah network connectivity
- Perlu akses dari komputer lain di jaringan

## ✅ SOLUSI YANG SUDAH DITERAPKAN

### 1. ELIMINASI DEPENDENCY BACKEND EKSTERNAL
- `execute-ahk/route.ts` sekarang langsung menjalankan AHK tanpa fetch ke backend terpisah
- Menggunakan Node.js `child_process` untuk eksekusi AHK
- Tidak ada lagi masalah "fetch failed" karena tidak ada external fetch

### 2. NETWORK ACCESS CONFIGURATION

#### A. Frontend (Next.js)
```bash
# Jalankan dengan network access
npm run dev -- --hostname 0.0.0.0 --port 8000

# Atau gunakan script yang sudah dibuat
start-frontend-network.bat
```

#### B. Environment Variable
```env
# .env.local
NEXT_PUBLIC_BACKEND_URL=http://192.168.1.6:5000
```

#### C. IP Address Komputer
- IP Lokal: `192.168.1.6`
- Frontend: `http://192.168.1.6:8000`
- Backend: `http://192.168.1.6:5000`

### 3. FIREWALL CONFIGURATION
Pastikan Windows Firewall mengizinkan:
- Port 8000 (Frontend)
- Port 5000 (Backend, jika diperlukan)

```powershell
# Tambah firewall rule untuk port 8000
New-NetFirewallRule -DisplayName "Next.js Dev Server" -Direction Inbound -Port 8000 -Protocol TCP -Action Allow

# Tambah firewall rule untuk port 5000  
New-NetFirewallRule -DisplayName "Backend API Server" -Direction Inbound -Port 5000 -Protocol TCP -Action Allow
```

## 🔧 CARA KERJA BARU

### SEBELUM (Ada masalah fetch failed)
```
Frontend → fetch() → Backend → AHK Execution
```

### SESUDAH (Tidak ada fetch failed)
```
Frontend → Direct AHK Execution (via Node.js child_process)
```

## 📋 AKSES DARI KOMPUTER LAIN

### 1. DARI KOMPUTER YANG SAMA
- `http://localhost:8000`
- `http://127.0.0.1:8000`

### 2. DARI KOMPUTER LAIN DI JARINGAN
- `http://192.168.1.6:8000`

### 3. REQUIREMENTS UNTUK NETWORK ACCESS
- Frontend harus dijalankan dengan `--hostname 0.0.0.0`
- Windows Firewall harus mengizinkan port 8000
- Router/Switch harus mengizinkan komunikasi antar komputer
- Semua komputer harus dalam subnet yang sama (192.168.1.x)

## 🚀 CARA MENJALANKAN

### UNTUK AKSES LOKAL SAJA
```bash
npm run dev
# Akses: http://localhost:8000
```

### UNTUK AKSES NETWORK (KOMPUTER LAIN)
```bash
# Option 1: Manual
npm run dev -- --hostname 0.0.0.0 --port 8000

# Option 2: Menggunakan script
start-frontend-network.bat

# Akses dari komputer lain: http://192.168.1.6:8000
```

## ✅ VALIDASI

### 1. Test Lokal
- Buka `http://localhost:8000`
- Test tombol "Generate Script" dan "Execute Script"
- Tidak boleh ada error "fetch failed"

### 2. Test Network
- Dari komputer lain, buka `http://192.168.1.6:8000`
- Test fungsi yang sama
- AHK akan berjalan di komputer server (192.168.1.6)

## 📝 CATATAN PENTING

### Keamanan
- Hanya jalankan dengan network access di jaringan terpercaya
- Port 8000 akan terbuka untuk seluruh jaringan
- Pertimbangkan menggunakan authentication jika diperlukan

### Performance
- AHK script akan berjalan di komputer server, bukan client
- Client hanya mengirim data, server yang eksekusi AHK
- Pastikan AutoHotkey terinstall di komputer server

### Troubleshooting
- Jika masih ada masalah, cek Windows Firewall
- Pastikan IP address masih valid (bisa berubah jika DHCP)
- Test koneksi dengan `ping 192.168.1.6` dari komputer lain
