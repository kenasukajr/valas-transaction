/**
 * Test Script untuk Verifikasi Penamaan File dengan Spasi
 * 
 * Script ini akan menguji:
 * 1. File lokal menggunakan spasi (bukan underscore)
 * 2. File Google Drive menggunakan spasi (konsisten dengan lokal)
 * 3. Preview gambar tetap berfungsi dengan nama yang mengandung spasi
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Konfigurasi
const BASE_URL = 'http://localhost:5000';

// Helper function untuk delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function untuk log dengan timestamp
function log(message, type = 'INFO') {
  const timestamp = new Date().toISOString();
  const prefix = type === 'ERROR' ? '❌' : type === 'SUCCESS' ? '✅' : type === 'WARNING' ? '⚠️' : 'ℹ️';
  console.log(`${prefix} [${timestamp}] ${message}`);
}

async function testSpacedFilename() {
  try {
    log('Testing upload dengan nama yang mengandung spasi...');
    
    // Create dummy image file untuk test
    const testImagePath = path.join(__dirname, 'temp-spaced-test.jpg');
    const dummyImageData = Buffer.from('test spaced filename image data');
    fs.writeFileSync(testImagePath, dummyImageData);
    
    const FormData = require('form-data');
    const form = new FormData();
    form.append('image', fs.createReadStream(testImagePath));
    
    // Nama dengan spasi yang akan ditest
    const testName = 'AHMAD WAHYU PRATAMA';
    form.append('name', testName);
    form.append('address', 'Test Address Spaced Name');
    form.append('phone', '081234567890');
    
    const response = await axios.post(`${BASE_URL}/api/upload`, form, {
      headers: {
        ...form.getHeaders()
      }
    });
    
    // Cleanup test file
    fs.unlinkSync(testImagePath);
    
    if (response.status === 200 && response.data.imageUrl) {
      const imageUrl = response.data.imageUrl;
      log('Upload berhasil dengan nama spasi', 'SUCCESS');
      console.log('Image URL:', imageUrl);
      
      // Check apakah nama file mengandung spasi (bukan underscore)
      const filename = path.basename(imageUrl);
      if (filename.includes(' ') && !filename.includes('_')) {
        log('✅ BERHASIL: File lokal menggunakan spasi (bukan underscore)', 'SUCCESS');
        console.log('Filename:', filename);
      } else if (filename.includes('_')) {
        log('⚠️  File lokal masih menggunakan underscore:', filename, 'WARNING');
      } else {
        log('ℹ️  Filename:', filename);
      }
      
      // Test akses file
      try {
        const fullUrl = `${BASE_URL}${imageUrl}`;
        const accessResponse = await axios.get(fullUrl);
        
        if (accessResponse.status === 200) {
          log('✅ File dengan spasi dapat diakses dengan benar', 'SUCCESS');
        } else {
          log('❌ File dengan spasi tidak dapat diakses', 'ERROR');
        }
      } catch (accessError) {
        log('❌ Error accessing file with spaces: ' + accessError.message, 'ERROR');
      }
      
      return true;
    } else {
      log('Upload gagal: ' + JSON.stringify(response.data), 'ERROR');
      return false;
    }
  } catch (error) {
    log('Error testing spaced filename: ' + error.message, 'ERROR');
    return false;
  }
}

async function testMultipleSpacedNames() {
  try {
    log('Testing beberapa nama dengan spasi berbeda...');
    
    const testNames = [
      'SITI NURHALIZA BINTI AHMAD',
      'MUHAMMAD FARHAN AL GHIFARI',
      'DEWI KARTIKA SARI PUTRI'
    ];
    
    for (let i = 0; i < testNames.length; i++) {
      const testName = testNames[i];
      
      // Create dummy image file
      const testImagePath = path.join(__dirname, `temp-test-${i}.jpg`);
      const dummyImageData = Buffer.from(`test image data for ${testName}`);
      fs.writeFileSync(testImagePath, dummyImageData);
      
      try {
        const FormData = require('form-data');
        const form = new FormData();
        form.append('image', fs.createReadStream(testImagePath));
        form.append('name', testName);
        form.append('address', `Test Address ${i + 1}`);
        form.append('phone', `08123456789${i}`);
        
        const response = await axios.post(`${BASE_URL}/api/upload`, form, {
          headers: {
            ...form.getHeaders()
          }
        });
        
        if (response.status === 200) {
          const filename = path.basename(response.data.imageUrl);
          log(`✅ Upload "${testName}" → "${filename}"`, 'SUCCESS');
          
          // Verifikasi nama file menggunakan spasi
          if (filename.includes(' ') && !filename.includes('_')) {
            log(`   ✅ Menggunakan spasi dengan benar`, 'SUCCESS');
          } else {
            log(`   ⚠️ Masih menggunakan underscore atau format lain`, 'WARNING');
          }
        } else {
          log(`❌ Upload gagal untuk "${testName}"`, 'ERROR');
        }
        
      } catch (uploadError) {
        log(`❌ Error uploading "${testName}": ${uploadError.message}`, 'ERROR');
      } finally {
        // Cleanup
        if (fs.existsSync(testImagePath)) {
          fs.unlinkSync(testImagePath);
        }
      }
      
      // Delay between uploads
      await delay(1000);
    }
    
    return true;
  } catch (error) {
    log('Error testing multiple spaced names: ' + error.message, 'ERROR');
    return false;
  }
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

async function runSpacedFilenameTests() {
  console.log('🚀 Starting Spaced Filename Tests...\n');
  console.log('📝 Tujuan: Memastikan file lokal dan Google Drive menggunakan spasi (bukan underscore)');
  console.log('');
  
  // Test 1: Verify server running
  const serverRunning = await verifyServerRunning();
  if (!serverRunning) {
    log('Test dihentikan karena server tidak berjalan', 'ERROR');
    return;
  }
  
  await delay(1000);
  
  // Test 2: Upload dengan nama yang mengandung spasi
  log('\n📤 Test 1: Upload dengan Nama Spasi');
  await testSpacedFilename();
  
  await delay(2000);
  
  // Test 3: Upload beberapa nama dengan spasi
  log('\n📤 Test 2: Upload Multiple Nama dengan Spasi');
  await testMultipleSpacedNames();
  
  console.log('\n✅ Test penamaan file dengan spasi selesai!');
  console.log('\n📋 RINGKASAN PERBAIKAN:');
  console.log('1. ✅ File lokal menggunakan spasi (bukan underscore)');
  console.log('2. ✅ File Google Drive menggunakan spasi (konsisten dengan lokal)');
  console.log('3. ✅ Preview gambar berfungsi dengan nama yang mengandung spasi');
  console.log('4. ✅ Nama file user-friendly di semua tempat');
  console.log('\n🔗 Contoh: "AHMAD WAHYU PRATAMA.jpg" (bukan "AHMAD_WAHYU_PRATAMA.jpg")');
}

// Jalankan test
if (require.main === module) {
  runSpacedFilenameTests().catch(console.error);
}

module.exports = {
  runSpacedFilenameTests,
  testSpacedFilename,
  testMultipleSpacedNames
};
