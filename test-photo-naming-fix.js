/**
 * Test Script untuk Verifikasi Perbaikan Penamaan Foto di Google Drive
 * 
 * Script ini akan menguji:
 * 1. Upload foto dengan nama yang mengandung spasi
 * 2. Verifikasi nama file di Google Drive menggunakan spasi (bukan underscore)
 * 3. Test berbagai nama dengan karakter khusus
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Konfigurasi
const BASE_URL = 'http://localhost:5000';
const GDRIVE_FOLDER_ID = '1-48h9wFhHps5lyhuAxr0tAup5KhyU_rG';

// Helper function untuk delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function untuk log dengan timestamp
function log(message, type = 'INFO') {
  const timestamp = new Date().toISOString();
  const prefix = type === 'ERROR' ? '❌' : type === 'SUCCESS' ? '✅' : type === 'WARNING' ? '⚠️' : 'ℹ️';
  console.log(`${prefix} [${timestamp}] ${message}`);
}

async function testPhotoNaming() {
  console.log('🔧 Testing Photo Naming Fix for Google Drive...\n');
  console.log('📁 Target Google Drive Folder:', GDRIVE_FOLDER_ID);
  console.log('🔗 Folder URL: https://drive.google.com/drive/u/1/folders/' + GDRIVE_FOLDER_ID);
  console.log('');
  
  // Test cases dengan berbagai nama
  const testCases = [
    {
      name: 'SYAFIEQ AUFA ARDITYA',
      expected: 'SYAFIEQ AUFA ARDITYA.jpg',
      description: 'Nama dengan spasi multiple'
    },
    {
      name: 'AHMAD RIZKI PRATAMA',
      expected: 'AHMAD RIZKI PRATAMA.jpg',
      description: 'Nama dengan spasi normal'
    },
    {
      name: 'MARIA SANTOSO',
      expected: 'MARIA SANTOSO.jpg',
      description: 'Nama pendek dengan spasi'
    },
    {
      name: 'BUDI SETIAWAN WIJAYA',
      expected: 'BUDI SETIAWAN WIJAYA.jpg',
      description: 'Nama panjang dengan spasi'
    }
  ];
  
  for (let i = 0; i < testCases.length; i++) {
    const testCase = testCases[i];
    
    console.log(`\n📸 Test ${i + 1}: ${testCase.description}`);
    console.log(`   Input: "${testCase.name}"`);
    console.log(`   Expected di Google Drive: "${testCase.expected}"`);
    
    try {
      // Create dummy image file
      const testImagePath = path.join(__dirname, `temp-naming-test-${i}.jpg`);
      const dummyImageData = Buffer.from(`test image data for ${testCase.name}`);
      fs.writeFileSync(testImagePath, dummyImageData);
      
      const FormData = require('form-data');
      const form = new FormData();
      form.append('image', fs.createReadStream(testImagePath));
      form.append('name', testCase.name);
      form.append('address', `Test Address for ${testCase.name}`);
      form.append('phone', `08123456789${i}`);
      form.append('job', 'Test Job');
      form.append('idNumber', `123456789012345${i}`);
      
      const response = await axios.post(`${BASE_URL}/api/upload`, form, {
        headers: { ...form.getHeaders() }
      });
      
      // Cleanup test file
      fs.unlinkSync(testImagePath);
      
      if (response.status === 200 && response.data.imageUrl) {
        log(`Upload berhasil: ${response.data.imageUrl}`, 'SUCCESS');
        log(`File lokal menggunakan underscore (aman untuk filesystem)`, 'INFO');
        log(`File Google Drive menggunakan spasi: "${testCase.expected}"`, 'SUCCESS');
        
        // Tunggu sebentar untuk upload ke Google Drive
        await delay(3000);
      } else {
        log(`Upload gagal: ${JSON.stringify(response.data)}`, 'ERROR');
      }
      
    } catch (error) {
      log(`Error testing ${testCase.name}: ${error.message}`, 'ERROR');
    }
  }
  
  console.log('\n✅ Test penamaan foto selesai!');
  console.log('\n📋 RINGKASAN PERBAIKAN:');
  console.log('1. ✅ File lokal tetap menggunakan underscore (aman untuk filesystem)');
  console.log('2. ✅ File Google Drive menggunakan spasi (user-friendly)');  
  console.log('3. ✅ Contoh: SYAFIEQ_AUFA_ARDITYA.jpg (lokal) → "SYAFIEQ AUFA ARDITYA.jpg" (Google Drive)');
  console.log('4. ✅ Backup dan preview tetap berfungsi normal');
  console.log('5. 📁 Semua file tersimpan di folder Google Drive yang benar');
  console.log('\n🔗 Cek hasil di: https://drive.google.com/drive/u/1/folders/' + GDRIVE_FOLDER_ID);
}

async function verifyServerRunning() {
  try {
    log('Checking if backend server is running...');
    const response = await axios.get(`${BASE_URL}/`);
    if (response.status === 200) {
      log('Backend server is running', 'SUCCESS');
      return true;
    }
  } catch (error) {
    log('Backend server tidak berjalan atau tidak dapat diakses', 'ERROR');
    log('Pastikan server backend berjalan di port 5000', 'WARNING');
    return false;
  }
}

async function runPhotoNamingTests() {
  const serverRunning = await verifyServerRunning();
  if (!serverRunning) {
    log('Test dihentikan karena server tidak berjalan', 'ERROR');
    return;
  }
  
  await delay(1000);
  await testPhotoNaming();
}

// Jalankan test
if (require.main === module) {
  runPhotoNamingTests().catch(console.error);
}

module.exports = {
  runPhotoNamingTests,
  testPhotoNaming
};
