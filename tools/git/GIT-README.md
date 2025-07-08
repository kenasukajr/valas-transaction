# Blackbox Project - Portable Git Setup

## 🚀 Setup di Komputer Baru

### 1. **Jika Komputer SUDAH Punya Git:**
```cmd
git-helper.bat status
```
Langsung jalan!

### 2. **Jika Komputer BELUM Punya Git:**

#### Opsi A - Install Otomatis:
```cmd
# Run as Administrator
install-git.bat
```

#### Opsi B - Install Manual:
1. Download Git: https://git-scm.com/download/win
2. Install dengan setting default
3. Restart terminal
4. Jalankan: `git-helper.bat status`

## 📋 Git Helper Commands

```cmd
git-helper.bat status      # Lihat status
git-helper.bat checkpoint  # Buat checkpoint baru
git-helper.bat log         # Lihat history
git-helper.bat reset       # Kembali ke checkpoint terakhir
git-helper.bat help        # Bantuan
```

## 🔄 Checkpoint System

### Buat Checkpoint:
```cmd
git-helper.bat checkpoint "Deskripsi perubahan"
```

### Kembali ke Checkpoint Terakhir:
```cmd
git-helper.bat reset
```

### Kembali ke Checkpoint Tertentu:
```cmd
git-helper.bat log         # Lihat hash commit
git reset --hard <hash>    # Kembali ke hash tertentu
```

## 📂 File Penting

- `.git/` - Repository data (JANGAN DIHAPUS)
- `git-helper.bat` - Script utama
- `install-git.bat` - Installer Git
- Semua file proyek akan di-track oleh Git

## ✅ Portabilitas

Project ini 100% portable:
- Pindah flashdisk ✓
- Pindah komputer ✓ 
- History tetap utuh ✓
- Auto-detect Git location ✓
