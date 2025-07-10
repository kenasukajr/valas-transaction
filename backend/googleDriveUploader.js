const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');

// Baca refresh token dari file OAuth2
let REFRESH_TOKEN = null;
try {
  const tokenData = JSON.parse(fs.readFileSync('oauth2-token.json', 'utf8'));
  REFRESH_TOKEN = tokenData.refresh_token;
} catch (error) {
  console.log('⚠️  oauth2-token.json tidak ditemukan, menggunakan fallback ke simple upload');
}

// Konfigurasi OAuth2 (update dengan credentials dari setup-oauth2.js)
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID';
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || 'YOUR_GOOGLE_CLIENT_SECRET';
const REDIRECT_URI = 'http://localhost:3000/oauth2callback';

// Inisialisasi OAuth2
const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
if (REFRESH_TOKEN) {
  oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
}

const driveService = google.drive({ version: 'v3', auth: oauth2Client });

/**
 * Upload file ke Google Drive dengan opsi overwrite
 * @param {string} filePath - Path file lokal yang akan diupload
 * @param {string} folderId - (Opsional) ID folder Google Drive tujuan
 * @param {string} [customName] - (Opsional) Nama file custom (misal: pakai spasi, bukan underscore)
 * @param {boolean} [overwrite=false] - Jika true, akan menimpa file yang sudah ada dengan nama sama
 * @returns {Promise<string>} - ID file di Google Drive
 */
async function uploadFileToDrive(filePath, folderId = null, customName = null, overwrite = false) {
  console.log('DEBUG GDRIVE: Fungsi uploadFileToDrive dipanggil dengan:', { filePath, folderId, customName, overwrite });
  
  try {
    // Cek apakah file ada
    const fs = require('fs');
    if (!fs.existsSync(filePath)) {
      throw new Error(`File tidak ditemukan: ${filePath}`);
    }
    console.log('DEBUG GDRIVE: File ditemukan, ukuran:', fs.statSync(filePath).size, 'bytes');
    
    // Cek apakah OAuth2 credentials sudah dikonfigurasi
    if (!REFRESH_TOKEN) {
      throw new Error('REFRESH_TOKEN belum dikonfigurasi. Jalankan setup OAuth2 dulu untuk mendapatkan refresh token.');
    }
    console.log('DEBUG GDRIVE: OAuth2 credentials dikonfigurasi');
    
    const fileName = customName ? customName : path.basename(filePath);
    console.log('DEBUG GDRIVE: Nama file yang akan diupload:', fileName);
    
    // Deteksi MIME type berdasarkan ekstensi file
    let mimeType = 'application/octet-stream'; // Default
    const ext = path.extname(fileName).toLowerCase();
    switch (ext) {
      case '.jpg':
      case '.jpeg':
        mimeType = 'image/jpeg';
        break;
      case '.png':
        mimeType = 'image/png';
        break;
      case '.gif':
        mimeType = 'image/gif';
        break;
      case '.json':
        mimeType = 'application/json';
        break;
      case '.txt':
        mimeType = 'text/plain';
        break;
      case '.pdf':
        mimeType = 'application/pdf';
        break;
    }
    console.log('DEBUG GDRIVE: Detected MIME type:', mimeType);
    
    // Jika overwrite = true, cari dan hapus file yang sudah ada
    if (overwrite) {
      try {
        const searchQuery = folderId ? 
          `name='${fileName}' and '${folderId}' in parents and trashed=false` :
          `name='${fileName}' and trashed=false`;
        
        const existingFiles = await driveService.files.list({
          q: searchQuery,
          fields: 'files(id, name)',
        });
        
        if (existingFiles.data.files && existingFiles.data.files.length > 0) {
          console.log(`DEBUG GDRIVE: Found ${existingFiles.data.files.length} existing file(s) dengan nama ${fileName}`);
          
          // Hapus file-file yang sudah ada
          for (const file of existingFiles.data.files) {
            await driveService.files.delete({
              fileId: file.id,
            });
            console.log(`DEBUG GDRIVE: Deleted existing file ${file.name} (ID: ${file.id})`);
          }
        }
      } catch (searchError) {
        console.warn('DEBUG GDRIVE: Warning saat mencari file existing:', searchError.message);
        // Lanjutkan upload meskipun pencarian gagal
      }
    }
    
    const fileMetadata = {
      name: fileName,
      ...(folderId ? { parents: [folderId] } : {}),
    };
    console.log('DEBUG GDRIVE: Metadata file:', fileMetadata);
    
    const media = {
      mimeType: mimeType,
      body: fs.createReadStream(filePath),
    };
    console.log('DEBUG GDRIVE: Media object dibuat, mulai upload...');
    
    const response = await driveService.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id',
    });
    console.log('DEBUG GDRIVE: Upload berhasil, response:', response.data);
    return response.data.id;
  } catch (error) {
    console.error('DEBUG GDRIVE: Error detail:', error.message);
    console.error('DEBUG GDRIVE: Error stack:', error.stack);
    throw error;
  }
}

/**
 * Upload file ke Google Drive di background (non-blocking) dengan opsi overwrite
 * @param {string} filePath - Path file lokal yang akan diupload
 * @param {string} folderId - (Opsional) ID folder Google Drive tujuan
 * @param {string} [customName] - (Opsional) Nama file custom (misal: pakai spasi, bukan underscore)
 * @param {boolean} [overwrite=false] - Jika true, akan menimpa file yang sudah ada dengan nama sama
 * @returns {void} - Tidak menunggu hasil upload, berjalan di background
 */
function uploadFileToDriveBackground(filePath, folderId = null, customName = null, overwrite = false) {
  // Gunakan OAuth2 untuk upload otomatis
  uploadFileToDrive(filePath, folderId, customName, overwrite)
    .then(fileId => {
      const overwriteStatus = overwrite ? ' (with overwrite)' : '';
      console.log(`✅ BACKGROUND UPLOAD (OAuth2): File berhasil diupload ke Google Drive${overwriteStatus}, fileId:`, fileId);
    })
    .catch(err => {
      console.error('❌ BACKGROUND UPLOAD (OAuth2): Gagal upload ke Google Drive:', err.message);
      
      // Fallback ke simple upload jika OAuth2 gagal
      const { uploadFileToDriveServiceAccount } = require('./googleDriveUploader-simple');
      uploadFileToDriveServiceAccount(filePath, customName, folderId)
        .then(dummyId => {
          console.log('⚠️  BACKGROUND UPLOAD (Fallback): File disimpan untuk manual upload, ID:', dummyId);
        })
        .catch(err2 => {
          console.error('❌ BACKGROUND UPLOAD (Fallback): Gagal fallback:', err2.message);
        });
    });
}

module.exports = { uploadFileToDrive, uploadFileToDriveBackground };
