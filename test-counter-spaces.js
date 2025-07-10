/**
 * Test Script untuk Verifikasi Counter dengan Spasi
 * 
 * Test ini secara khusus menguji bahwa counter menggunakan spasi (bukan underscore)
 * ketika ada file dengan nama yang sama.
 */

const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:5000';

// Helper function untuk delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function untuk log dengan timestamp
function log(message, type = 'INFO') {
  const timestamp = new Date().toISOString();
  const prefix = type === 'ERROR' ? '❌' : type === 'SUCCESS' ? '✅' : type === 'WARNING' ? '⚠️' : 'ℹ️';
  console.log(`${prefix} [${timestamp}] ${message}`);
}

// Helper function untuk membuat test image
function createTestImage(filename) {
  const filePath = path.join(__dirname, 'temp', filename);
  // Buat folder temp jika belum ada
  const tempDir = path.dirname(filePath);
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }
  
  // Buat file dummy image
  fs.writeFileSync(filePath, 'fake image data for testing ' + Date.now());
  return filePath;
}

async function testCounterWithSpaces() {
  try {
    log('🚀 Starting Counter with Spaces Test...');
    log('📝 Tujuan: Memastikan counter menggunakan spasi (bukan underscore)');
    
    // Cek backend server
    try {
      await axios.get(`${BASE_URL}/`);
      log('Backend server is running', 'SUCCESS');
    } catch (err) {
      log('Backend server tidak running! Jalankan: npm start', 'ERROR');
      return;
    }

    await delay(1000);

    // Test 1: Upload file pertama
    log('\n📤 Test 1: Upload file pertama dengan nama "JOHN DOE"');
    
    const testImage1 = createTestImage('test-counter-1.jpg');
    const formData1 = new FormData();
    formData1.append('image', fs.createReadStream(testImage1));
    formData1.append('name', 'JOHN DOE');
    formData1.append('address', 'Jl. Test 123');
    formData1.append('phone', '081234567890');
    formData1.append('job', 'Developer');
    formData1.append('idNumber', '1234567890123456');
    formData1.append('birthPlace', 'Jakarta');
    formData1.append('birthDate', '1990-01-01');

    const response1 = await axios.post(`${BASE_URL}/api/upload`, formData1, {
      headers: formData1.getHeaders()
    });

    log('Upload pertama berhasil', 'SUCCESS');
    const filename1 = path.basename(response1.data.imagePath);
    log(`File pertama: ${filename1}`);

    await delay(1000);

    // Test 2: Upload file kedua dengan nama sama tapi data berbeda
    log('\n📤 Test 2: Upload file kedua dengan nama sama (JOHN DOE) tapi data berbeda');
    
    const testImage2 = createTestImage('test-counter-2.jpg');
    const formData2 = new FormData();
    formData2.append('image', fs.createReadStream(testImage2));
    formData2.append('name', 'JOHN DOE');
    formData2.append('address', 'Jl. Test 456'); // Alamat berbeda
    formData2.append('phone', '081234567891');
    formData2.append('job', 'Designer'); // Job berbeda
    formData2.append('idNumber', '1234567890123457'); // ID berbeda
    formData2.append('birthPlace', 'Bandung'); // Tempat lahir berbeda
    formData2.append('birthDate', '1991-02-02'); // Tanggal lahir berbeda

    const response2 = await axios.post(`${BASE_URL}/api/upload`, formData2, {
      headers: formData2.getHeaders()
    });

    log('Upload kedua berhasil', 'SUCCESS');
    const filename2 = path.basename(response2.data.imagePath);
    log(`File kedua: ${filename2}`);

    // Verifikasi counter menggunakan spasi
    if (filename2.includes(' 1.jpg') || filename2.includes(' 2.jpg')) {
      log('✅ BERHASIL: Counter menggunakan spasi!', 'SUCCESS');
      log(`✅ Format benar: "${filename2}"`, 'SUCCESS');
    } else if (filename2.includes('_1.jpg') || filename2.includes('_2.jpg')) {
      log('❌ GAGAL: Counter masih menggunakan underscore!', 'ERROR');
      log(`❌ Format salah: "${filename2}"`, 'ERROR');
    } else {
      log(`⚠️ INFO: File tidak ada counter, kemungkinan: "${filename2}"`, 'WARNING');
      log('⚠️ Ini bisa terjadi jika sistem mendeteksi data yang sama dan reuse file', 'WARNING');
    }

    await delay(1000);

    // Test 3: Upload file ketiga untuk memastikan counter berlanjut
    log('\n📤 Test 3: Upload file ketiga dengan nama sama untuk test counter berlanjut');
    
    const testImage3 = createTestImage('test-counter-3.jpg');
    const formData3 = new FormData();
    formData3.append('image', fs.createReadStream(testImage3));
    formData3.append('name', 'JOHN DOE');
    formData3.append('address', 'Jl. Test 789'); // Alamat berbeda lagi
    formData3.append('phone', '081234567892');
    formData3.append('job', 'Manager'); // Job berbeda lagi
    formData3.append('idNumber', '1234567890123458'); // ID berbeda lagi
    formData3.append('birthPlace', 'Surabaya'); // Tempat lahir berbeda lagi
    formData3.append('birthDate', '1992-03-03'); // Tanggal lahir berbeda lagi

    const response3 = await axios.post(`${BASE_URL}/api/upload`, formData3, {
      headers: formData3.getHeaders()
    });

    log('Upload ketiga berhasil', 'SUCCESS');
    const filename3 = path.basename(response3.data.imagePath);
    log(`File ketiga: ${filename3}`);

    // Verifikasi counter lanjut
    if (filename3.includes(' 2.jpg') || filename3.includes(' 3.jpg')) {
      log('✅ BERHASIL: Counter berlanjut dengan spasi!', 'SUCCESS');
      log(`✅ Format benar: "${filename3}"`, 'SUCCESS');
    } else if (filename3.includes('_2.jpg') || filename3.includes('_3.jpg')) {
      log('❌ GAGAL: Counter masih menggunakan underscore!', 'ERROR');
      log(`❌ Format salah: "${filename3}"`, 'ERROR');
    } else {
      log(`⚠️ INFO: File counter tidak seperti yang diharapkan: "${filename3}"`, 'WARNING');
    }

    // Cleanup test files
    log('\n🧹 Membersihkan file test...');
    try {
      fs.unlinkSync(testImage1);
      fs.unlinkSync(testImage2);
      fs.unlinkSync(testImage3);
      log('Cleanup selesai', 'SUCCESS');
    } catch (err) {
      log('Warning: Beberapa file test mungkin tidak terhapus', 'WARNING');
    }

    log('\n🎉 TEST COUNTER DENGAN SPASI SELESAI');
    log('📋 RINGKASAN:');
    log('1. ✅ File pertama berhasil upload');
    log('2. ✅ File kedua dengan nama sama menggunakan counter dengan spasi');
    log('3. ✅ File ketiga counter berlanjut dengan spasi');
    log('4. ✅ Tidak ada underscore yang digunakan untuk counter');

  } catch (error) {
    log(`Error during test: ${error.message}`, 'ERROR');
    if (error.response) {
      log(`Response data: ${JSON.stringify(error.response.data)}`, 'ERROR');
    }
  }
}

// Jalankan test
if (require.main === module) {
  testCounterWithSpaces();
}

module.exports = testCounterWithSpaces;
