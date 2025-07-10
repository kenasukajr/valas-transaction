# Setup Upload Google Drive - Panduan Lengkap

## 🎯 Tujuan
Membuat proses upload file gambar ID dari backend Node.js ke Google Drive secara otomatis setelah transaksi dengan syarat:
- Upload ke folder Google Drive tertentu
- Nama file di Google Drive menggunakan spasi (bukan underscore)
- Proses upload berjalan di background (tidak blocking transaksi)

## 📋 Status Saat Ini
- ✅ Backend Node.js sudah setup dengan dependencies (googleapis, node-fetch, form-data)
- ✅ Kode upload Google Drive sudah dibuat
- ✅ Upload background (non-blocking) sudah diintegrasikan
- ✅ Service Account sudah dikonfigurasi
- ❌ **OAuth2 refresh token belum dikonfigurasi** (diperlukan untuk upload ke My Drive)

## 🔧 Langkah Setup OAuth2 (WAJIB)

### 1. Jalankan Setup OAuth2
```bash
cd "e:\Versi 1.4.3\backend"
node setup-oauth2-gdrive.js
```

### 2. Ikuti Langkah-langkah di Terminal
1. **Buka URL** yang muncul di terminal
2. **Login** dengan akun Google Anda
3. **Klik "Allow"** untuk memberikan izin
4. **Copy authorization code** dari browser
5. **Paste code** ke terminal

### 3. Verifikasi Setup
```bash
node test-service-account-upload.js
```

## 🚀 Setelah Setup Berhasil

Upload akan berjalan otomatis saat transaksi:
1. **File gambar ID** akan diupload ke Google Drive
2. **Folder tujuan**: `1-48h9wFhHps5lyhuAxr0tAup5KhyU_rG`
3. **Nama file**: Menggunakan spasi (contoh: "WISNU ADITYA.png")
4. **Background process**: Tidak mengganggu transaksi
5. **Log output**: Akan muncul di console backend

## 📁 File yang Terlibat

### File Utama:
- `googleDriveUploader.js` - Fungsi utama upload
- `googleDriveUploader-serviceaccount.js` - Implementasi OAuth2
- `setup-oauth2-gdrive.js` - Setup OAuth2 refresh token

### File Generated:
- `oauth2-token.json` - Token OAuth2 (akan dibuat otomatis)

## 🔍 Troubleshooting

### Error "OAuth2 refresh token belum dikonfigurasi"
```bash
node setup-oauth2-gdrive.js
```

### Error "Insufficient Permission"
- Akun Google Anda belum memiliki akses ke folder Google Drive
- Pastikan akun yang digunakan untuk OAuth2 memiliki akses ke folder

### Error "The API is not enabled"
- Google Drive API belum diaktifkan di Google Cloud Console
- Aktifkan di: https://console.cloud.google.com/apis/library/drive.googleapis.com

## 🧪 Test Upload

### Test Manual:
```bash
node test-service-account-upload.js
```

### Test via Transaksi:
1. Jalankan backend dan frontend
2. Buat transaksi dengan gambar ID
3. Lihat log backend untuk status upload

## 📝 Log Output yang Diharapkan

```
🚀 BACKGROUND UPLOAD: Memulai upload ke Google Drive untuk: WISNU ADITYA.png
📁 Uploading file to Google Drive using OAuth2 Client...
📂 Local file: e:\Versi 1.4.3\backend\uploads\WISNU_ADITYA_.png
📝 Drive name: WISNU ADITYA.png
🗂️  Folder ID: 1-48h9wFhHps5lyhuAxr0tAup5KhyU_rG
✅ File uploaded successfully, ID: 1abc123def456ghi789
✅ BACKGROUND UPLOAD: Gambar ID berhasil diupload ke Google Drive, fileId: 1abc123def456ghi789
```

## 🔄 Maintenance

### Refresh Token Expired
- Jalankan ulang: `node setup-oauth2-gdrive.js`
- Ini biasanya terjadi setelah beberapa bulan

### Change Google Drive Folder
- Edit `FOLDER_ID` di `googleDriveUploader-serviceaccount.js`
- Pastikan folder baru sudah di-share ke akun Google Anda

## 💡 Catatan Penting

1. **OAuth2 vs Service Account**: Service Account tidak bisa upload ke My Drive biasa, hanya ke Shared Drive. Makanya kita menggunakan OAuth2.

2. **Background Upload**: Upload berjalan di background sehingga tidak mengganggu proses transaksi.

3. **File Local**: File tetap tersimpan di local (folder uploads) sebagai backup.

4. **Error Handling**: Jika upload gagal, proses transaksi tetap berjalan normal.

## 🎯 Langkah Selanjutnya

1. **Jalankan setup OAuth2**: `node setup-oauth2-gdrive.js`
2. **Test upload**: `node test-service-account-upload.js`
3. **Test transaksi**: Buat transaksi dengan gambar ID
4. **Verifikasi**: Cek Google Drive untuk file yang diupload

Setelah setup berhasil, upload akan berjalan otomatis untuk semua transaksi selanjutnya!
