# 📁 Struktur Folder Project Valas Transaction

Struktur folder telah direorganisasi untuk meningkatkan kerapihan dan kemudahan maintenance.

## 📂 Root Directory
```
g:\Blackbox Versi 1.1\
├── 📁 src/                    # Source code aplikasi Next.js
├── 📁 backend/                # API backend Express.js
├── 📁 public/                 # Assets statis
├── 📁 docs/                   # ✨ BARU: Dokumentasi project
├── 📁 tools/                  # ✨ BARU: Tools dan utilities
├── 📁 config/                 # ✨ BARU: File konfigurasi dan script
├── 📁 logs/                   # ✨ BARU: File log aplikasi
├── 📁 scripts/                # Script testing dan automation
├── 📁 .git/                   # Git repository
├── 📁 .next/                  # Build output Next.js
├── 📁 node_modules/           # Dependencies
└── 🔧 config files (.env, package.json, etc.)
```

## 📁 Folder Details

### 📖 `/docs` - Dokumentasi
Semua file dokumentasi project:
- `README.md` - Dokumentasi utama project
- `NAVIGASI-KEYBOARD.md` - Panduan navigasi keyboard
- `RESPONSIVE-FIXES.md` - Dokumentasi perbaikan responsive
- `CHECKPOINT-*.md` - File checkpoint development
- `GIT-*.md` - Dokumentasi Git
- `*.txt` - File dokumentasi tambahan

### 🔧 `/tools` - Tools dan Utilities
Alat-alat development dan automation:

#### `/tools/git`
- `git-commit.bat` - Script commit Git
- `git-status.bat` - Script status Git  
- `quick-git.bat` - Script Git cepat
- `install-git.bat` - Script instalasi Git
- `git-helper.bat` - Helper Git
- `GIT-README.md` - Dokumentasi Git tools

#### `/tools/autohotkey`
- `auto_type_form.ahk` - Script AutoHotkey untuk form
- `AutoHotkey_2.0.19_setup.exe` - Installer AutoHotkey

#### `/tools/server-manager`
- Server manager tools (.xaml, .cs files)
- Build files dan dependencies

### ⚙️ `/config` - Konfigurasi dan Scripts
File konfigurasi dan startup scripts:
- `start-frontend.ps1` - Script startup frontend
- `start-server.js` - Script startup backend
- `start-simple.bat` - Script startup sederhana
- `next.config.ts.bak` - Backup konfigurasi Next.js
- `tsconfig.json.patch` - Patch TypeScript config

### 📊 `/logs` - Log Files
File log aplikasi:
- `backend.log` - Log backend API
- `frontend.log` - Log frontend Next.js

### 💻 `/scripts` - Automation Scripts
Script testing dan automation:
- Test scripts untuk API
- Script coordinate detection
- File log hasil testing

## 🎯 Benefits Struktur Baru

1. **📂 Organized**: File dikelompokkan berdasarkan fungsi
2. **🔍 Easy to Find**: Lokasi file mudah diprediksi
3. **🧹 Clean Root**: Root directory lebih bersih
4. **📝 Better Documentation**: Dokumentasi terpusat di `/docs`
5. **🔧 Separated Tools**: Tools terpisah dari source code
6. **⚙️ Config Management**: Konfigurasi terpusat di `/config`

## 🚀 Quick Access

### Dokumentasi
```bash
cd docs/
# Baca README.md, NAVIGASI-KEYBOARD.md, dll.
```

### Development Tools
```bash
cd tools/git/
# Jalankan git scripts

cd tools/autohotkey/
# Setup AutoHotkey automation
```

### Startup Scripts
```bash
cd config/
# Jalankan start-frontend.ps1 atau start-server.js
```

### Logs
```bash
cd logs/
# Cek backend.log atau frontend.log
```

---

✨ **Struktur folder ini dirancang untuk meningkatkan produktivitas development dan maintenance project.**
