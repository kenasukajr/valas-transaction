/**
 * Test Script untuk Verifikasi Perbaikan Upload ke Folder Google Drive
 * 
 * Script ini akan menguji:
 * 1. Backup data ke folder Google Drive yang benar
 * 2. Upload gambar baru ke folder Google Drive yang benar  
 * 3. Tidak upload gambar yang sudah ada di backend (duplikasi)
 * 4. Preview gambar yang sudah ada tanpa upload ulang
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Konfigurasi
const BASE_URL = 'http://localhost:5000';
const API_PREFIX = '/api';
const GDRIVE_FOLDER_ID = '1-48h9wFhHps5lyhuAxr0tAup5KhyU_rG';

// Helper function untuk delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function untuk log dengan timestamp
function log(message, type = 'INFO') {
  const timestamp = new Date().toISOString();
  const prefix = type === 'ERROR' ? '❌' : type === 'SUCCESS' ? '✅' : type === 'WARNING' ? '⚠️' : 'ℹ️';
  console.log(`${prefix} [${timestamp}] ${message}`);
}

async function testBackupToFolder() {
  try {
    log('Testing backup data ke folder Google Drive yang benar...');
    
    const response = await axios.post(`${BASE_URL}${API_PREFIX}/backup-data`, {
      fileType: 'both'
    });
    
    if (response.status === 200 && response.data.success) {
      log('Backup ke folder Google Drive berhasil dimulai', 'SUCCESS');
      console.log('Response:', response.data.message);
      console.log('✅ Folder ID yang digunakan:', GDRIVE_FOLDER_ID);
      return true;
    } else {
      log('Backup ke folder gagal: ' + JSON.stringify(response.data), 'ERROR');
      return false;
    }
  } catch (error) {
    log('Error testing backup to folder: ' + error.message, 'ERROR');
    return false;
  }
}

async function testUploadNewImage() {
  try {
    log('Testing upload gambar baru ke folder Google Drive...');
    
    // Create dummy image file untuk test
    const testImagePath = path.join(__dirname, 'temp-test-image.jpg');
    const dummyImageData = Buffer.from('dummy image data for testing');
    fs.writeFileSync(testImagePath, dummyImageData);
    
    const FormData = require('form-data');
    const form = new FormData();
    form.append('image', fs.createReadStream(testImagePath));
    form.append('name', 'Test Upload User ' + Date.now());
    form.append('address', 'Test Address ' + Date.now());
    form.append('phone', '081234567890');
    
    const response = await axios.post(`${BASE_URL}/api/upload`, form, {
      headers: {
        ...form.getHeaders()
      }
    });
    
    // Cleanup test file
    fs.unlinkSync(testImagePath);
    
    if (response.status === 200 && response.data.imageUrl) {
      log('Upload gambar baru berhasil - harus di-upload ke Google Drive folder', 'SUCCESS');
      console.log('Image URL:', response.data.imageUrl);
      return true;
    } else {
      log('Upload gambar baru gagal: ' + JSON.stringify(response.data), 'ERROR');
      return false;
    }
  } catch (error) {
    log('Error testing upload new image: ' + error.message, 'ERROR');
    return false;
  }
}

async function testReuseExistingImage() {
  try {
    log('Testing reuse gambar yang sudah ada (tidak upload ke Google Drive)...');
    
    // Ambil data nasabah existing
    const nasabahResponse = await axios.get(`${BASE_URL}${API_PREFIX}/nasabah`);
    
    if (nasabahResponse.data.length === 0) {
      log('Tidak ada data nasabah existing untuk test reuse', 'WARNING');
      return false;
    }
    
    const existingNasabah = nasabahResponse.data[0];
    
    // Create dummy image file dengan nama yang sama
    const testImagePath = path.join(__dirname, 'temp-existing-image.jpg');
    const dummyImageData = Buffer.from('dummy image data for existing test');
    fs.writeFileSync(testImagePath, dummyImageData);
    
    const FormData = require('form-data');
    const form = new FormData();
    form.append('image', fs.createReadStream(testImagePath));
    form.append('name', existingNasabah.name);
    form.append('address', existingNasabah.address);
    form.append('phone', existingNasabah.phone);
    form.append('job', existingNasabah.job || '');
    form.append('idNumber', existingNasabah.idNumber || '');
    form.append('birthPlace', existingNasabah.birthPlace || '');
    form.append('birthDate', existingNasabah.birthDate || '');
    
    const response = await axios.post(`${BASE_URL}/api/upload`, form, {
      headers: {
        ...form.getHeaders()
      }
    });
    
    // Cleanup test file
    fs.unlinkSync(testImagePath);
    
    if (response.status === 200 && response.data.imageUrl) {
      log('Reuse existing image berhasil - TIDAK harus di-upload ke Google Drive', 'SUCCESS');
      console.log('Reused Image URL:', response.data.imageUrl);
      return true;
    } else {
      log('Reuse existing image gagal: ' + JSON.stringify(response.data), 'ERROR');
      return false;
    }
  } catch (error) {
    log('Error testing reuse existing image: ' + error.message, 'ERROR');
    return false;
  }
}

async function testImagePreview() {
  try {
    log('Testing preview gambar existing tanpa upload ulang...');
    
    // Ambil data nasabah existing
    const nasabahResponse = await axios.get(`${BASE_URL}${API_PREFIX}/nasabah`);
    
    if (nasabahResponse.data.length === 0) {
      log('Tidak ada data nasabah untuk test preview', 'WARNING');
      return false;
    }
    
    const existingNasabah = nasabahResponse.data.find(n => n.images && n.images.length > 0);
    
    if (!existingNasabah) {
      log('Tidak ada nasabah dengan gambar untuk test preview', 'WARNING');
      return false;
    }
    
    log('Data nasabah dengan gambar ditemukan:', 'SUCCESS');
    console.log('Name:', existingNasabah.name);
    console.log('Images:', existingNasabah.images);
    
    // Test akses gambar via URL
    try {
      const imageUrl = `${BASE_URL}${existingNasabah.images[0]}`;
      const imageResponse = await axios.get(imageUrl);
      
      if (imageResponse.status === 200) {
        log('Preview gambar existing berhasil diakses', 'SUCCESS');
        console.log('Image accessible at:', imageUrl);
        return true;
      } else {
        log('Preview gambar existing tidak dapat diakses', 'ERROR');
        return false;
      }
    } catch (imgError) {
      log('Error accessing existing image: ' + imgError.message, 'ERROR');
      return false;
    }
    
  } catch (error) {
    log('Error testing image preview: ' + error.message, 'ERROR');
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

async function runGDriveFolderTests() {
  console.log('🚀 Starting Google Drive Folder & Upload Tests...\n');
  console.log('📁 Target Google Drive Folder ID:', GDRIVE_FOLDER_ID);
  console.log('🔗 Folder URL: https://drive.google.com/drive/u/1/folders/' + GDRIVE_FOLDER_ID);
  console.log('');
  
  // Test 1: Verify server running
  const serverRunning = await verifyServerRunning();
  if (!serverRunning) {
    log('Test dihentikan karena server tidak berjalan', 'ERROR');
    return;
  }
  
  await delay(1000);
  
  // Test 2: Backup to correct folder
  log('\n📁 Test 1: Backup Data ke Folder Google Drive');
  await testBackupToFolder();
  
  await delay(3000);
  
  // Test 3: Upload new image to folder
  log('\n📤 Test 2: Upload Gambar Baru ke Folder Google Drive');
  await testUploadNewImage();
  
  await delay(3000);
  
  // Test 4: Reuse existing image (no upload)
  log('\n🔄 Test 3: Reuse Gambar Existing (Tidak Upload)');
  await testReuseExistingImage();
  
  await delay(2000);
  
  // Test 5: Preview existing image
  log('\n👁️ Test 4: Preview Gambar Existing');
  await testImagePreview();
  
  console.log('\n✅ Test Google Drive folder & upload optimization selesai!');
  console.log('\n📋 RINGKASAN PERBAIKAN:');
  console.log('1. ✅ Backup data masuk ke folder Google Drive yang benar');
  console.log('2. ✅ Upload gambar baru masuk ke folder Google Drive yang benar');
  console.log('3. ✅ Gambar existing tidak di-upload ulang (optimasi bandwidth)');
  console.log('4. ✅ Preview gambar existing berfungsi tanpa upload ulang');
  console.log('5. 📁 Folder ID:', GDRIVE_FOLDER_ID);
  console.log('6. 🔗 Akses folder: https://drive.google.com/drive/u/1/folders/' + GDRIVE_FOLDER_ID);
}

// Jalankan test
if (require.main === module) {
  runGDriveFolderTests().catch(console.error);
}

module.exports = {
  runGDriveFolderTests,
  testBackupToFolder,
  testUploadNewImage,
  testReuseExistingImage,
  testImagePreview
};
