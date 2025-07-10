// Upload otomatis ke Google Drive menggunakan Service Account
// Mengatasi masalah OAuth2 dengan menggunakan Service Account langsung

const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');

// Path ke file Service Account key
const SERVICE_ACCOUNT_FILE = path.join(__dirname, 'service-account-key.json');

/**
 * Upload file ke Google Drive secara otomatis menggunakan Service Account
 * @param {string} localPath - Path file lokal
 * @param {string} fileName - Nama file di Google Drive
 * @param {string} folderId - ID folder Google Drive tujuan
 * @returns {Promise<string>} - ID file di Google Drive
 */
async function uploadFileToDriveServiceAccount(localPath, fileName, folderId = null) {
  try {
    console.log('� UPLOAD OTOMATIS: Mulai upload ke Google Drive...');
    console.log('📂 Local file:', localPath);
    console.log('📝 Drive name:', fileName);
    console.log('🗂️  Folder ID:', folderId || 'Root');
    
    // Cek apakah file ada
    if (!fs.existsSync(localPath)) {
      throw new Error(`File tidak ditemukan: ${localPath}`);
    }
    
    // Cek apakah file Service Account ada
    if (!fs.existsSync(SERVICE_ACCOUNT_FILE)) {
      console.log('⚠️  Service Account file tidak ditemukan, membuat folder manual-upload...');
      return await createManualUploadBackup(localPath, fileName);
    }
    
    // Baca credentials Service Account
    const credentials = JSON.parse(fs.readFileSync(SERVICE_ACCOUNT_FILE, 'utf8'));
    
    if (credentials.type !== 'service_account') {
      console.log('⚠️  File bukan Service Account, membuat folder manual-upload...');
      return await createManualUploadBackup(localPath, fileName);
    }
    
    console.log('✅ Service Account valid:', credentials.client_email);
    
    // Setup Google Auth dengan Service Account
    const auth = new google.auth.GoogleAuth({
      keyFile: SERVICE_ACCOUNT_FILE,
      scopes: ['https://www.googleapis.com/auth/drive.file']
    });
    
    const authClient = await auth.getClient();
    const drive = google.drive({ version: 'v3', auth: authClient });
    
    // Metadata file
    const fileMetadata = {
      name: fileName,
      ...(folderId ? { parents: [folderId] } : {}),
    };
    
    // Deteksi MIME type berdasarkan ekstensi file
    const fileExtension = path.extname(localPath).toLowerCase();
    let mimeType = 'application/octet-stream';
    
    if (['.jpg', '.jpeg'].includes(fileExtension)) {
      mimeType = 'image/jpeg';
    } else if (fileExtension === '.png') {
      mimeType = 'image/png';
    } else if (fileExtension === '.pdf') {
      mimeType = 'application/pdf';
    }
    
    // Media file
    const media = {
      mimeType: mimeType,
      body: fs.createReadStream(localPath),
    };
    
    // Upload file
    const res = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id',
    });
    
    console.log('🎉 UPLOAD OTOMATIS BERHASIL!');
    console.log('📄 File ID:', res.data.id);
    console.log('🔗 Link:', `https://drive.google.com/file/d/${res.data.id}/view`);
    
    return res.data.id;
    
  } catch (error) {
    console.error('❌ Upload otomatis gagal:', error.message);
    
    // Jika upload otomatis gagal, fallback ke manual upload
    console.log('🔄 Fallback: Membuat backup untuk manual upload...');
    return await createManualUploadBackup(localPath, fileName);
  }
}

/**
 * Fallback: Buat backup file untuk manual upload jika otomatis gagal
 */
async function createManualUploadBackup(localPath, fileName) {
  try {
    const manualUploadDir = path.join(__dirname, 'manual-upload');
    
    // Buat folder manual-upload jika belum ada
    if (!fs.existsSync(manualUploadDir)) {
      fs.mkdirSync(manualUploadDir, { recursive: true });
    }
    
    // Copy file ke folder manual-upload dengan nama yang benar
    const destPath = path.join(manualUploadDir, fileName);
    fs.copyFileSync(localPath, destPath);
    
    console.log('📁 Backup file created:', destPath);
    console.log('ℹ️  File tersedia di folder manual-upload untuk upload manual');
    
    // Return dummy ID untuk fallback
    const dummyId = 'backup_' + Date.now();
    return dummyId;
    
  } catch (error) {
    console.error('❌ Fallback backup gagal:', error.message);
    return 'error_' + Date.now();
  }
}

module.exports = { uploadFileToDriveServiceAccount };
