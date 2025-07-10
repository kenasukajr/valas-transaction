# Panduan Membuat Service Account untuk Google Drive API

## Langkah 1: Buat Service Account di Google Cloud Console

1. Buka [Google Cloud Console](https://console.cloud.google.com/)
2. Pilih project Anda (atau buat project baru)
3. Buka menu "APIs & Services" > "Credentials"
4. Klik "Create Credentials" > "Service Account"
5. Isi nama Service Account (contoh: "drive-uploader")
6. Klik "Create and Continue"
7. Pada "Role", pilih "Editor" atau "Basic > Editor"
8. Klik "Continue" > "Done"

## Langkah 2: Download JSON Key

1. Di halaman "Credentials", klik Service Account yang baru dibuat
2. Buka tab "Keys"
3. Klik "Add Key" > "Create new key"
4. Pilih "JSON" format
5. Klik "Create"
6. File JSON akan otomatis didownload

## Langkah 3: Ganti File Credentials

1. Pindahkan file JSON yang didownload ke folder backend
2. Ganti nama file menjadi `service-account-key.json`
3. Atau update path di `googleDriveUploader-serviceaccount.js`

## Langkah 4: Share Folder Google Drive

1. Buka folder Google Drive yang ingin digunakan
2. Klik kanan > "Share"
3. Masukkan email Service Account (ada di file JSON, field "client_email")
4. Berikan akses "Editor"
5. Klik "Send"

## Langkah 5: Enable Google Drive API

1. Di Google Cloud Console, buka "APIs & Services" > "Library"
2. Cari "Google Drive API"
3. Klik "Enable"

## Format File Service Account yang Benar

File JSON Service Account harus memiliki struktur seperti ini:

```json
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "your-service-account@your-project.iam.gserviceaccount.com",
  "client_id": "...",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "..."
}
```

## Troubleshooting

### Error "private_key and client_email are required"
- File credentials bukan Service Account
- Pastikan file JSON memiliki field "type": "service_account"

### Error "Insufficient Permission"
- Folder Google Drive belum di-share ke Service Account
- Share folder dengan email yang ada di field "client_email"

### Error "The API is not enabled"
- Google Drive API belum diaktifkan
- Enable Google Drive API di Google Cloud Console
