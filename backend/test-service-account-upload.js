// Script untuk test upload Service Account
// Jalankan dengan: node test-service-account-upload.js

const fs = require('fs');
const path = require('path');
const { uploadFileToDriveServiceAccount } = require('./googleDriveUploader-serviceaccount');

// Konfigurasi test
const FOLDER_ID = '1-48h9wFhHps5lyhuAxr0tAup5KhyU_rG';
const TEST_FILE = 'test-upload.txt';

async function createTestFile() {
  const testContent = `Test upload Service Account
Timestamp: ${new Date().toISOString()}
File: ${TEST_FILE}
`;
  
  fs.writeFileSync(TEST_FILE, testContent);
  console.log('✅ File test dibuat:', TEST_FILE);
  return TEST_FILE;
}

async function testServiceAccountUpload() {
  try {
    console.log('🧪 Testing Service Account Upload to Google Drive\n');
    
    // Buat file test
    const filePath = await createTestFile();
    const customName = 'Test Upload Service Account.txt';
    
    console.log('📁 Uploading file...');
    console.log('📂 Local file:', filePath);
    console.log('📝 Drive name:', customName);
    console.log('🗂️  Folder ID:', FOLDER_ID);
    console.log('');
    
    // Upload file
    const fileId = await uploadFileToDriveServiceAccount(filePath, customName, FOLDER_ID);
    
    console.log('');
    console.log('🎉 Upload berhasil!');
    console.log('📄 File ID:', fileId);
    console.log('🔗 Link file:', `https://drive.google.com/file/d/${fileId}/view`);
    console.log('');
    console.log('✅ Service Account upload working perfectly!');
    
    // Cleanup
    fs.unlinkSync(filePath);
    console.log('🧹 File test dihapus');
    
  } catch (error) {
    console.error('❌ Test upload gagal:', error.message);
    console.log('');
    console.log('🔧 Troubleshooting:');
    
    if (error.message.includes('private_key')) {
      console.log('- File service-account-key.json tidak valid atau tidak ada');
      console.log('- Pastikan file JSON berisi private_key dan client_email');
    } else if (error.message.includes('Insufficient Permission')) {
      console.log('- Folder Google Drive belum di-share ke Service Account');
      console.log('- Share folder dengan email Service Account');
    } else if (error.message.includes('The API is not enabled')) {
      console.log('- Google Drive API belum diaktifkan');
      console.log('- Aktifkan Google Drive API di Google Cloud Console');
    } else {
      console.log('- Cek konfigurasi Service Account');
      console.log('- Jalankan: node test-google-drive-connection.js');
    }
    
    // Cleanup jika ada
    if (fs.existsSync(TEST_FILE)) {
      fs.unlinkSync(TEST_FILE);
    }
    
    process.exit(1);
  }
}

// Jalankan test
testServiceAccountUpload();
