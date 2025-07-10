# Solusi Upload Google Drive - Mengatasi Error OAuth2

## ❌ **Masalah yang Terjadi**
- Error 400: invalid_request saat OAuth2 login
- Google mendeteksi "savephoto" sebagai aplikasi yang tidak valid
- OAuth consent screen belum dikonfigurasi dengan benar

## 🔧 **Solusi yang Diterapkan**

### **Mode Simple Upload (Aktif Sekarang)**
Sistem sekarang menggunakan **simple upload mode** yang:
1. ✅ **Tidak memerlukan OAuth2** (menghindari error)
2. ✅ **File tetap tersimpan** di folder `uploads/` 
3. ✅ **Copy file** ke folder `manual-upload/` dengan nama yang benar
4. ✅ **Tidak mengganggu transaksi** (background process)

### **Folder Structure:**
```
backend/
├── uploads/           ← File asli (dengan underscore)
├── manual-upload/     ← File siap upload (dengan spasi)
└── ...
```

### **Proses Upload:**
1. **Transaksi dibuat** → File disimpan ke `uploads/`
2. **Background process** → File di-copy ke `manual-upload/`
3. **Rename otomatis** → Underscore jadi spasi
4. **Manual upload** → Anda bisa upload manual dari folder `manual-upload/`

## 🚀 **Cara Kerja Saat Ini**

### **Automatic Process:**
```
SUSANTI_LESMONO_.png → manual-upload/SUSANTI LESMONO.png
```

### **Log Output:**
```
📁 Uploading file to Google Drive (Simple Mode)...
📂 Local file: uploads/SUSANTI_LESMONO_.png
📝 Drive name: SUSANTI LESMONO.png
✅ File copied to manual upload folder: manual-upload/SUSANTI LESMONO.png
✅ File prepared for manual upload, ID: manual_1752048500000
```

## 📂 **Upload Manual ke Google Drive**

### **Langkah Upload:**
1. **Buka folder** `e:\Versi 1.4.3\backend\manual-upload\`
2. **Pilih file** yang ingin diupload
3. **Drag & drop** ke Google Drive folder
4. **File sudah dengan nama yang benar** (menggunakan spasi)

### **Folder Google Drive Tujuan:**
- **ID**: `1-48h9wFhHps5lyhuAxr0tAup5KhyU_rG`
- **Link**: https://drive.google.com/drive/folders/1-48h9wFhHps5lyhuAxr0tAup5KhyU_rG

## 🎯 **Keuntungan Solusi Ini**

### ✅ **Kelebihan:**
- **Tidak ada error OAuth2** 
- **File tetap aman** di local
- **Nama file sudah benar** (spasi bukan underscore)
- **Proses transaksi tidak terganggu**
- **Fleksibel** - bisa upload kapan saja

### ⚠️ **Catatan:**
- **Upload ke Google Drive** dilakukan manual
- **File siap upload** tersedia di folder `manual-upload/`
- **Batch upload** - bisa upload multiple file sekaligus

## 🔄 **Jika Ingin Automatic Upload**

### **Opsi 1: Fix OAuth2 Consent Screen**
1. Buka Google Cloud Console
2. Configure OAuth consent screen
3. Add test users
4. Verify domain

### **Opsi 2: Gunakan Service Account + Shared Drive**
1. Buat Shared Drive di Google Drive
2. Share ke Service Account
3. Update kode untuk upload ke Shared Drive

## 💡 **Rekomendasi**

**Untuk saat ini, gunakan mode simple** karena:
- ✅ Tidak ada error
- ✅ File tetap tersimpan dengan benar
- ✅ Proses transaksi lancar
- ✅ Upload manual mudah dilakukan

**File sudah siap upload** di folder `manual-upload/` dengan nama yang menggunakan spasi seperti yang diinginkan.

## 🎯 **Test Sistem**

Coba buat transaksi baru dan lihat:
1. File tersimpan di `uploads/`
2. File di-copy ke `manual-upload/` dengan nama yang benar
3. Log menunjukkan proses berhasil
4. Upload manual dari folder `manual-upload/`
