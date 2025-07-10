/**
 * Test Script: Verifikasi Perbaikan Upload Gambar Ganda ke Google Drive
 * 
 * Masalah yang diperbaiki:
 * - Upload gambar dilakukan 2x: di /api/upload dan di /api/transactions
 * - Untuk transaksi dengan 2 mata uang, total upload bisa jadi 3x
 * 
 * Perbaikan yang dilakukan:
 * 1. Menghapus upload ganda di endpoint /api/transactions
 * 2. Hanya upload 1x di endpoint /api/upload
 * 3. Menggunakan nama nasabah untuk nama file di Google Drive
 */

const fs = require('fs');
const path = require('path');

async function testPerbaikanUploadGanda() {
  console.log('=== TEST PERBAIKAN UPLOAD GAMBAR GANDA KE GOOGLE DRIVE ===\n');
  
  const baseUrl = 'http://localhost:5000';
  
  // Simulasi data test seperti transaksi real
  const testNasabahData = {
    name: "TEST UPLOAD GANDA",
    address: "Jl. Test Upload",
    phone: "081234567890",
    job: "TESTER",
    idNumber: "1234567890123456",
    birthPlace: "Jakarta",
    birthDate: "1990-01-01"
  };
  
  let uploadCount = 0;
  let uploadedFileNames = [];
  
  // Monitor upload dengan intercept console log
  const originalConsoleLog = console.log;
  console.log = function(...args) {
    const message = args.join(' ');
    if (message.includes('[GDRIVE] Starting background upload')) {
      uploadCount++;
      const fileName = message.split('for: ')[1];
      uploadedFileNames.push(fileName);
      console.log(`🔍 DETECTED UPLOAD #${uploadCount}: ${fileName}`);
    }
    originalConsoleLog.apply(console, args);
  };
  
  try {
    console.log('1. Testing upload gambar...');
    
    // Buat file test gambar
    const testImagePath = path.join(__dirname, 'test-upload-ganda.txt');
    fs.writeFileSync(testImagePath, 'Test file untuk upload ganda');
    
    // Test 1: Upload gambar
    const FormData = require('form-data');
    const form = new FormData();
    form.append('image', fs.createReadStream(testImagePath), 'test-upload-ganda.txt');
    form.append('name', testNasabahData.name);
    
    const uploadResponse = await fetch(`${baseUrl}/api/upload`, {
      method: 'POST',
      body: form
    });
    
    if (uploadResponse.ok) {
      const uploadResult = await uploadResponse.json();
      console.log('✅ Upload gambar berhasil:', uploadResult.imageUrl);
    } else {
      console.log('❌ Upload gambar gagal:', uploadResponse.status);
      return;
    }
    
    // Wait untuk memastikan upload background selesai
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('\n2. Testing save nasabah...');
    
    // Test 2: Save nasabah
    const nasabahData = {
      ...testNasabahData,
      image: '/uploads/TEST_UPLOAD_GANDA.txt',
      images: ['/uploads/TEST_UPLOAD_GANDA.txt'],
      id: Date.now(),
      transactionNumber: 'TEST001',
      date: new Date().toISOString()
    };
    
    const nasabahResponse = await fetch(`${baseUrl}/api/nasabah`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nasabahData)
    });
    
    let savedNasabah;
    if (nasabahResponse.ok) {
      savedNasabah = await nasabahResponse.json();
      console.log('✅ Save nasabah berhasil');
    } else {
      console.log('❌ Save nasabah gagal:', nasabahResponse.status);
      return;
    }
    
    console.log('\n3. Testing save multiple transactions...');
    
    // Test 3: Save multiple transactions (simulasi 2 mata uang)
    const transactions = [
      {
        ...savedNasabah,
        id: Date.now() + 1,
        jenisTransaksi: 'BNB',
        currency: 'USD',
        amount: 1000,
        rate: 15750,
        rupiahEquivalent: 15750000,
        transactionOrder: 1,
        totalTransactions: 2
      },
      {
        ...savedNasabah,
        id: Date.now() + 2,
        jenisTransaksi: 'BNB',
        currency: 'EUR',
        amount: 500,
        rate: 17200,
        rupiahEquivalent: 8600000,
        transactionOrder: 2,
        totalTransactions: 2
      }
    ];
    
    for (let i = 0; i < transactions.length; i++) {
      const transactionResponse = await fetch(`${baseUrl}/api/transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transactions[i])
      });
      
      if (transactionResponse.ok) {
        console.log(`✅ Save transaction ${i + 1} berhasil`);
      } else {
        console.log(`❌ Save transaction ${i + 1} gagal:`, transactionResponse.status);
      }
      
      // Wait sedikit antar transaksi
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    // Wait untuk memastikan semua background process selesai
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Restore console.log
    console.log = originalConsoleLog;
    
    console.log('\n' + '='.repeat(60));
    console.log('\n📊 HASIL ANALISIS UPLOAD:');
    console.log(`Total upload yang terdeteksi: ${uploadCount}`);
    console.log('File yang diupload:');
    uploadedFileNames.forEach((fileName, index) => {
      console.log(`  ${index + 1}. ${fileName}`);
    });
    
    console.log('\n🎯 EVALUASI:');
    if (uploadCount === 1) {
      console.log('✅ BERHASIL: Upload hanya dilakukan 1x (benar!)');
      console.log('✅ Masalah upload ganda telah teratasi');
    } else if (uploadCount > 1) {
      console.log('❌ MASIH ADA MASALAH: Upload dilakukan lebih dari 1x');
      console.log('❌ Perlu investigasi lebih lanjut');
    } else {
      console.log('⚠️ TIDAK ADA UPLOAD: Mungkin ada masalah dengan Google Drive upload');
    }
    
    console.log('\n📋 SEHARUSNYA:');
    console.log('1. Upload gambar: 1x (saat /api/upload)');
    console.log('2. Save nasabah: 0x upload (tidak perlu upload lagi)');
    console.log('3. Save transaksi 1: 0x upload (tidak perlu upload lagi)');
    console.log('4. Save transaksi 2: 0x upload (tidak perlu upload lagi)');
    console.log('   TOTAL: 1x upload untuk 1 gambar');
    
    // Cleanup
    try {
      fs.unlinkSync(testImagePath);
      console.log('\n🧹 Test file cleaned up');
    } catch (err) {
      // File sudah terhapus atau tidak ada
    }
    
  } catch (error) {
    console.log = originalConsoleLog;
    console.error('❌ Test error:', error.message);
  }
}

// Jalankan test
console.log('🚀 Memulai test perbaikan upload ganda...');
console.log('⚠️ Pastikan backend berjalan di port 5000');
console.log('📊 Monitoring upload ke Google Drive...\n');

testPerbaikanUploadGanda().catch(console.error);
