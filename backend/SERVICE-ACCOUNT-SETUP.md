# Setup Service Account untuk Google Drive Upload

## 📋 Langkah-langkah Setup Service Account

### 1. Buat Service Account di Google Cloud Console

1. **Buka Google Cloud Console**
   - Kunjungi https://console.cloud.google.com/
   - Login dengan akun Google Anda
   - Pilih project yang sudah ada atau buat project baru

2. **Aktifkan Google Drive API**
   - Di menu sebelah kiri, pilih "APIs & Services" → "Library"
   - Cari "Google Drive API"
   - Klik "Enable"

3. **Buat Service Account**
   - Di menu sebelah kiri, pilih "APIs & Services" → "Credentials"
   - Klik "Create Credentials" → "Service Account"
   - Isi form:
     - **Service account name**: `drive-uploader`
     - **Service account ID**: `drive-uploader` (otomatis terisi)
     - **Description**: `Service Account untuk upload file ke Google Drive`
   - Klik "Create and Continue"

4. **Berikan Role**
   - Pada bagian "Grant this service account access to project"
   - Pilih role "Basic" → "Editor"
   - Klik "Continue"
   - Klik "Done"

### 2. Download JSON Key

1. **Buat Key**
   - Di halaman "Credentials", klik Service Account yang baru dibuat
   - Pilih tab "Keys"
   - Klik "Add Key" → "Create new key"
   - Pilih "JSON" sebagai key type
   - Klik "Create"

2. **Download dan Simpan**
   - File JSON akan otomatis didownload
   - **Pindahkan file ke folder backend**: `e:\Versi 1.4.3\backend\`
   - **Rename file menjadi**: `service-account-key.json`

### 3. Share Folder Google Drive

1. **Buka Folder Google Drive**
   - Buka folder dengan ID: `1-48h9wFhHps5lyhuAxr0tAup5KhyU_rG`
   - Atau buka folder yang ingin Anda gunakan

2. **Share ke Service Account**
   - Klik kanan folder → "Share"
   - Masukkan email Service Account (cek di file JSON, field "client_email")
   - Contoh: `drive-uploader@project-name.iam.gserviceaccount.com`
   - Berikan akses "Editor"
   - Klik "Send"

### 4. Test Koneksi

1. **Jalankan Test Script**
   ```bash
   cd "e:\Versi 1.4.3\backend"
   node test-google-drive-connection.js
   ```

2. **Hasil yang Diharapkan**
   ```
   ✅ File Service Account format valid
   📧 Service Account Email: drive-uploader@project-name.iam.gserviceaccount.com
   🔑 Project ID: project-name
   ✅ Koneksi ke Google Drive API berhasil
   📁 Files dalam folder: X
   ```

### 5. Test Upload File

1. **Buat file test**
   ```bash
   echo "test" > test.txt
   ```

2. **Test upload**
   ```bash
   node -e "
   const { uploadFileToDriveServiceAccount } = require('./googleDriveUploader-serviceaccount.js');
   uploadFileToDriveServiceAccount('./test.txt', 'Test Upload.txt', '1-48h9wFhHps5lyhuAxr0tAup5KhyU_rG')
     .then(id => console.log('✅ Upload berhasil, ID:', id))
     .catch(err => console.error('❌ Upload gagal:', err.message));
   "
   ```

## 🔧 Troubleshooting

### Error "private_key and client_email are required"
- File bukan Service Account atau file rusak
- Pastikan file bernama `service-account-key.json` dan berisi field lengkap
- Download ulang JSON key dari Google Cloud Console

### Error "Insufficient Permission"
- Folder Google Drive belum di-share ke Service Account
- Pastikan email Service Account benar (cek di file JSON)
- Berikan akses "Editor" ke Service Account

### Error "The API is not enabled"
- Google Drive API belum diaktifkan
- Aktifkan Google Drive API di Google Cloud Console

### Error "File tidak ditemukan"
- File `service-account-key.json` tidak ada di folder backend
- Pastikan file ada dan nama file benar

## 📁 Struktur File yang Benar

```
e:\Versi 1.4.3\backend\
├── service-account-key.json  ← File ini yang harus ada
├── googleDriveUploader.js
├── googleDriveUploader-serviceaccount.js
├── test-google-drive-connection.js
└── ... file lainnya
```

## 🎯 Setelah Setup Berhasil

Upload akan berjalan otomatis saat transaksi:
- File gambar ID akan diupload ke Google Drive
- Nama file di Google Drive akan menggunakan spasi (bukan underscore)
- Upload berjalan di background (tidak mengganggu transaksi)
- Log akan muncul di console backend

## 📞 Bantuan

Jika ada masalah, jalankan:
```bash
node test-google-drive-connection.js
```

Script ini akan memberikan diagnosis lengkap dan solusi spesifik untuk masalah yang ditemukan.
