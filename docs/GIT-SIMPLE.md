# Git Tools - Simple & Robust

## 🚀 **Cara Pakai:**

### **1. Cek Status & History (Cepat):**
```cmd
quick-git.bat
```
- Langsung tampil status dan 5 commit terakhir
- Auto-detect lokasi Git
- Safe dan tidak akan hang

### **2. Lihat Status Detail:**
```cmd
git-status.bat
```

### **3. Buat Checkpoint:**
```cmd
git-commit.bat "deskripsi perubahan"
```

## 📂 **Struktur Git Tools:**

```
├── quick-git.bat      # Main launcher - cepat & aman
├── git-status.bat     # Status detail
├── git-commit.bat     # Buat checkpoint 
├── git-tools/         # Advanced tools (optional)
│   ├── git-helper.bat    
│   ├── install-git.bat   
│   └── GIT-README.md     
└── git.bat           # Advanced launcher
```

## ✅ **Keunggulan:**

- **Portable:** Jalan di komputer manapun
- **Robust:** Tidak hang, auto-detect Git
- **Simple:** 1 klik untuk cek status
- **Safe:** Error handling yang baik

## 🔄 **Workflow:**

1. **Cek status:** `quick-git.bat`
2. **Buat checkpoint:** `git-commit.bat "pesan"`
3. **Ulangi** saat butuh backup

## 🆘 **Troubleshooting:**

**Git tidak ditemukan?**
- Install Git: https://git-scm.com/download/win
- Atau jalankan: `git-tools\install-git.bat`

**File hang?**
- Gunakan `quick-git.bat` (paling aman)
- Avoid `git.bat` jika ada masalah
