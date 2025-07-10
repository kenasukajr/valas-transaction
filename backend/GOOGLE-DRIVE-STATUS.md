# Status Upload Google Drive - Solusi Lengkap

## 🔍 Status Saat Ini

### ✅ Yang Sudah Berhasil:
- Backend Node.js sudah diinstal googleapis, node-fetch, form-data
- Kode upload Google Drive sudah dibuat dengan 3 metode:
  - Service Account (langsung)
  - OAuth2 Client (perlu setup)  
  - Apps Script (fallback)
- Upload background (non-blocking) sudah diintegrasikan
- Fallback system: Service Account → Apps Script

### ❌ Yang Masih Bermasalah:
- **Service Account**: File JSON belum dibuat (masih pakai OAuth2 Client)
- **Apps Script**: URL lama sudah tidak valid/expired
- **OAuth2 Client**: Butuh setup consent screen + refresh token

## 🎯 Solusi Rekomendasi

### **OPSI 1: Service Account (PALING MUDAH)**

1. **Buat Service Account** di Google Cloud Console:
   - Buka https://console.cloud.google.com/
   - APIs & Services → Credentials → Create Credentials → Service Account
   - Nama: "drive-uploader", Role: "Editor"
   - Download JSON key → rename jadi `service-account-key.json`

2. **Share folder Google Drive**:
   - Buka folder Google Drive (ID: 1-48h9wFhHps5lyhuAxr0tAup5KhyU_rG)
   - Share ke email Service Account (ada di JSON field "client_email")
   - Akses: Editor

3. **Enable API**:
   - Google Cloud Console → APIs & Services → Library
   - Cari "Google Drive API" → Enable

4. **Test**:
   ```bash
   node test-google-drive-connection.js
   ```

### **OPSI 2: Apps Script Baru (BACKUP)**

1. **Buat Apps Script baru**:
   - Buka https://script.google.com/
   - New project → Copy kode dari `apps-script-code.js`
   - Deploy → New deployment → Type: Web app
   - Execute as: Me, Access: Anyone

2. **Update URL**:
   - Copy URL web app yang baru
   - Update `APPS_SCRIPT_URL` di `googleDriveUploader-alternative.js`

3. **Test**:
   ```bash
   node test-google-drive-connection.js
   ```

## 📋 Langkah-langkah Praktis

### Untuk Service Account:
```bash
# 1. Buat service-account-key.json di folder backend
# 2. Test koneksi
cd "e:\Versi 1.4.3\backend"
node test-google-drive-connection.js

# 3. Test upload langsung
node -e "
const { uploadFileToDriveServiceAccount } = require('./googleDriveUploader-serviceaccount.js');
uploadFileToDriveServiceAccount('./uploads/test.jpg', 'Test Upload.jpg', '1-48h9wFhHps5lyhuAxr0tAup5KhyU_rG')
  .then(id => console.log('Upload success, ID:', id))
  .catch(err => console.error('Upload error:', err.message));
"
```

### Untuk Apps Script:
```bash
# 1. Deploy Apps Script baru dengan kode dari apps-script-code.js
# 2. Update URL di googleDriveUploader-alternative.js
# 3. Test
node test-google-drive-connection.js
```

## 🔧 File yang Perlu Disiapkan

### Service Account:
- `service-account-key.json` (download dari Google Cloud Console)

### Apps Script:
- URL web app baru (dari script.google.com)

## 🚀 Setelah Setup

Upload akan berjalan otomatis saat transaksi:
1. **Service Account** dicoba dulu (paling cepat)
2. **Apps Script** sebagai fallback jika Service Account gagal
3. **Background upload** tidak akan mengganggu proses transaksi

## 🐛 Troubleshooting

### "private_key and client_email are required"
- File masih OAuth2 Client, bukan Service Account
- Buat Service Account baru di Google Cloud Console

### "Insufficient Permission"
- Folder Google Drive belum di-share ke Service Account
- Share dengan email yang ada di JSON field "client_email"

### Apps Script "404" atau HTML error
- URL Apps Script salah atau belum deploy
- Deploy ulang dengan akses "Anyone"

### "The API is not enabled"
- Google Drive API belum diaktifkan
- Enable di Google Cloud Console

## 📞 Support

Jika ada error, jalankan:
```bash
node test-google-drive-connection.js
```

Script ini akan memberikan diagnosis lengkap dan solusi spesifik untuk masalah yang ditemukan.
