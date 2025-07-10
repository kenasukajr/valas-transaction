// Test dummy upload ke Google Drive dengan Service Account
// Jalankan dengan: node test-dummy-upload.js

const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');

// Konfigurasi
const SERVICE_ACCOUNT_FILE = path.join(__dirname, 'service-account-key.json');
const FOLDER_ID = '1-48h9wFhHps5lyhuAxr0tAup5KhyU_rG';

/**
 * Upload file ke Google Drive menggunakan Service Account (otomatis)
 */
async function testDummyUpload() {
  try {
    console.log('🧪 Test Dummy Upload ke Google Drive\n');
    
    // 1. Validasi Service Account file
    if (!fs.existsSync(SERVICE_ACCOUNT_FILE)) {
      throw new Error(`Service Account file tidak ditemukan: ${SERVICE_ACCOUNT_FILE}`);
    }
    
    const credentials = JSON.parse(fs.readFileSync(SERVICE_ACCOUNT_FILE, 'utf8'));
    if (credentials.type !== 'service_account') {
      throw new Error('File bukan Service Account');
    }
    
    console.log('✅ Service Account file valid');
    console.log('📧 Email:', credentials.client_email);
    console.log('🔑 Project ID:', credentials.project_id);
    
    // 2. Buat file dummy untuk test
    const testFileName = 'test-dummy-upload.txt';
    const testContent = `Test Dummy Upload ke Google Drive
Timestamp: ${new Date().toISOString()}
User: SUSANTI LESMONO
NIK: 3301225511680001
Alamat: JL. RAYA KLEDOKAN NO. 10 A, NGENTAK
`;
    
    fs.writeFileSync(testFileName, testContent);
    console.log('✅ File dummy dibuat:', testFileName);
    
    // 3. Setup Google Auth dengan Service Account
    const auth = new google.auth.GoogleAuth({
      keyFile: SERVICE_ACCOUNT_FILE,
      scopes: ['https://www.googleapis.com/auth/drive.file']
    });
    
    const authClient = await auth.getClient();
    const drive = google.drive({ version: 'v3', auth: authClient });
    
    console.log('✅ Google Drive API connection established');
    
    // 4. Upload file ke Google Drive
    const driveFileName = 'SUSANTI LESMONO.txt';
    
    console.log('\n📁 Uploading file...');
    console.log('📂 Local file:', testFileName);
    console.log('📝 Drive name:', driveFileName);
    console.log('🗂️  Folder ID:', FOLDER_ID);
    
    const fileMetadata = {
      name: driveFileName,
      parents: [FOLDER_ID]
    };
    
    const media = {
      mimeType: 'text/plain',
      body: fs.createReadStream(testFileName)
    };
    
    const response = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id,name,parents,webViewLink'
    });
    
    console.log('\n🎉 Upload berhasil!');
    console.log('📄 File ID:', response.data.id);
    console.log('📝 File Name:', response.data.name);
    console.log('🔗 Web Link:', response.data.webViewLink);
    
    // 5. Verify upload - list files in folder
    const folderFiles = await drive.files.list({
      q: `'${FOLDER_ID}' in parents`,
      fields: 'files(id, name, createdTime)'
    });
    
    console.log('\n📂 Files in Google Drive folder:');
    folderFiles.data.files.forEach(file => {
      console.log(`  - ${file.name} (${file.id})`);
    });
    
    // 6. Cleanup local file
    fs.unlinkSync(testFileName);
    console.log('\n🧹 Local test file cleaned up');
    
    console.log('\n✅ Test dummy upload BERHASIL!');
    console.log('🎯 Upload otomatis ke Google Drive berjalan dengan sempurna');
    
    return response.data.id;
    
  } catch (error) {
    console.error('\n❌ Test dummy upload GAGAL:', error.message);
    
    // Cleanup jika ada error
    if (fs.existsSync('test-dummy-upload.txt')) {
      fs.unlinkSync('test-dummy-upload.txt');
    }
    
    // Diagnosa error
    if (error.message.includes('Service Accounts do not have storage quota')) {
      console.log('\n🔧 SOLUSI:');
      console.log('1. Buat Shared Drive di Google Drive');
      console.log('2. Share Shared Drive ke Service Account email');
      console.log('3. Gunakan Shared Drive ID sebagai folder tujuan');
    } else if (error.message.includes('Insufficient Permission')) {
      console.log('\n🔧 SOLUSI:');
      console.log('1. Folder Google Drive belum di-share ke Service Account');
      console.log('2. Share folder dengan email:', credentials?.client_email);
      console.log('3. Berikan akses "Editor" ke Service Account');
    } else if (error.message.includes('The API is not enabled')) {
      console.log('\n🔧 SOLUSI:');
      console.log('1. Aktifkan Google Drive API di Google Cloud Console');
      console.log('2. Buka: https://console.cloud.google.com/apis/library/drive.googleapis.com');
    }
    
    throw error;
  }
}

// Jalankan test
testDummyUpload()
  .then(fileId => {
    console.log('\n🎉 HASIL: Upload otomatis ke Google Drive BERHASIL!');
    console.log('📄 File ID:', fileId);
    console.log('🚀 Sistem siap untuk upload otomatis pada transaksi');
  })
  .catch(error => {
    console.log('\n❌ HASIL: Upload otomatis ke Google Drive GAGAL');
    console.log('🔧 Perbaiki masalah di atas, lalu coba lagi');
    process.exit(1);
  });
