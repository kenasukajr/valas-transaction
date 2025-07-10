const fs = require('fs');

// Test script AHK dengan navigasi yang diperbaiki
async function testImprovedAhkGeneration() {
  console.log('=== TEST SCRIPT AHK DENGAN NAVIGASI YANG DIPERBAIKI ===\n');

  const baseUrl = 'http://localhost:8000';
  
  // Test data yang realistis
  const testData = {
    name: "PUJI PURNAWAN",
    address: "Jl. Sudirman No. 123, Jakarta Pusat, DKI Jakarta 10110",
    phone: "081234567890",
    job: "Software Engineer",
    idNumber: "3173051234567890",
    birthPlace: "Jakarta",
    birthDate: "1990-05-15",
    currency: "USD",
    amount: "1000",
    rate: "15750",
    rupiahEquivalent: "15750000"
  };

  console.log('Data yang akan ditest:');
  console.log(JSON.stringify(testData, null, 2));
  console.log('\n=== TESTING API GENERATOR ===');

  try {
    const response = await fetch(`${baseUrl}/api/generate-ahk`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testData)
    });

    if (response.ok) {
      const buffer = await response.arrayBuffer();
      const ahkContent = Buffer.from(buffer).toString('utf-8');
      
      // Simpan script hasil generate
      const outputFile = 'test-script-improved.ahk';
      fs.writeFileSync(outputFile, ahkContent);
      
      console.log('✓ Script AHK berhasil digenerate');
      console.log(`✓ File tersimpan: ${outputFile}`);
      console.log(`✓ Ukuran file: ${ahkContent.length} bytes`);
      
      // Validasi konten script
      console.log('\n=== VALIDASI KONTEN SCRIPT ===');
      
      // Check data nasabah
      const hasName = ahkContent.includes('PUJI PURNAWAN');
      const hasAddress = ahkContent.includes('Jl. Sudirman');
      const hasPhone = ahkContent.includes('081234567890');
      const hasJob = ahkContent.includes('Software Engineer');
      const hasIdNumber = ahkContent.includes('3173051234567890');
      const hasBirthPlace = ahkContent.includes('Jakarta');
      
      console.log('Data Nasabah:');
      console.log(`  - Nama: ${hasName ? '✓' : '✗'}`);
      console.log(`  - Alamat: ${hasAddress ? '✓' : '✗'}`);
      console.log(`  - Telepon: ${hasPhone ? '✓' : '✗'}`);
      console.log(`  - Pekerjaan: ${hasJob ? '✓' : '✗'}`);
      console.log(`  - ID Number: ${hasIdNumber ? '✓' : '✗'}`);
      console.log(`  - Tempat Lahir: ${hasBirthPlace ? '✓' : '✗'}`);
      
      // Check data transaksi
      const hasCurrencyCode = ahkContent.includes('Send, 1'); // USD = 1
      const hasAmount = ahkContent.includes('1000');
      const hasRate = ahkContent.includes('15750');
      const hasTransactionSection = ahkContent.includes('ISI DATA TRANSAKSI');
      
      console.log('\nData Transaksi:');
      console.log(`  - Currency Code (USD=1): ${hasCurrencyCode ? '✓' : '✗'}`);
      console.log(`  - Amount: ${hasAmount ? '✓' : '✗'}`);
      console.log(`  - Rate: ${hasRate ? '✓' : '✗'}`);
      console.log(`  - Transaction Section: ${hasTransactionSection ? '✓' : '✗'}`);
      
      // Check navigasi
      const hasWindowActivate = ahkContent.includes('WinActivate, Data Prosesing PT Mulia Bumi Arta');
      const hasTabNavigation = ahkContent.includes('Send, {Tab}');
      const hasEnterConfirmation = ahkContent.includes('Send, {Enter}');
      const hasSleepTiming = ahkContent.includes('Sleep,');
      
      console.log('\nNavigasi:');
      console.log(`  - Window Activate: ${hasWindowActivate ? '✓' : '✗'}`);
      console.log(`  - Tab Navigation: ${hasTabNavigation ? '✓' : '✗'}`);
      console.log(`  - Enter Confirmation: ${hasEnterConfirmation ? '✓' : '✗'}`);
      console.log(`  - Sleep Timing: ${hasSleepTiming ? '✓' : '✗'}`);
      
      // Check struktur script
      const hasTypeStringFunction = ahkContent.includes('TypeString(str)');
      const hasWindowCheck = ahkContent.includes('IfWinExist, Data Prosesing PT Mulia Bumi Arta');
      const hasAutoDelete = ahkContent.includes('FileDelete, %A_ScriptFullPath%');
      
      console.log('\nStruktur Script:');
      console.log(`  - TypeString Function: ${hasTypeStringFunction ? '✓' : '✗'}`);
      console.log(`  - Window Check: ${hasWindowCheck ? '✓' : '✗'}`);
      console.log(`  - Auto Delete: ${hasAutoDelete ? '✓' : '✗'}`);
      
      // Tampilkan preview script
      console.log('\n=== PREVIEW SCRIPT (50 baris pertama) ===');
      const lines = ahkContent.split('\n').slice(0, 50);
      lines.forEach((line, index) => {
        console.log(`${(index + 1).toString().padStart(2, '0')}: ${line}`);
      });
      
      if (ahkContent.split('\n').length > 50) {
        console.log('... (script memiliki lebih dari 50 baris)');
      }
      
      console.log('\n=== KESIMPULAN ===');
      const allDataComplete = hasName && hasAddress && hasPhone && hasJob && hasIdNumber && hasBirthPlace;
      const allTransactionComplete = hasCurrencyCode && hasAmount && hasRate && hasTransactionSection;
      const allNavigationComplete = hasWindowActivate && hasTabNavigation && hasEnterConfirmation && hasSleepTiming;
      
      console.log(`Status Data Nasabah: ${allDataComplete ? '✓ LENGKAP' : '✗ TIDAK LENGKAP'}`);
      console.log(`Status Data Transaksi: ${allTransactionComplete ? '✓ LENGKAP' : '✗ TIDAK LENGKAP'}`);
      console.log(`Status Navigasi: ${allNavigationComplete ? '✓ LENGKAP' : '✗ TIDAK LENGKAP'}`);
      
      if (allDataComplete && allTransactionComplete && allNavigationComplete) {
        console.log('\n🎉 SCRIPT AHK SIAP DIGUNAKAN!');
        console.log(`📁 File: ${outputFile}`);
        console.log('📝 Silakan test manual dengan aplikasi PT Mulia Bumi Arta');
      } else {
        console.log('\n⚠️  SCRIPT PERLU PERBAIKAN');
      }
      
    } else {
      console.log('❌ Gagal generate script AHK');
      console.log('Status:', response.status);
      console.log('Response:', await response.text());
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n🔍 Pastikan:');
    console.log('1. Server backend berjalan di port 8000');
    console.log('2. Endpoint /api/generate-ahk dapat diakses');
    console.log('3. Koneksi internet stabil');
  }
}

// Test currency code mapping
function testCurrencyMapping() {
  console.log('\n=== TEST CURRENCY CODE MAPPING ===');
  
  const currencies = ['USD', 'EUR', 'GBP', 'AUD', 'CAD', 'CHF', 'JPY', 'SGD'];
  const expectedCodes = ['1', '2', '3', '4', '5', '6', '7', '8'];
  
  currencies.forEach((currency, index) => {
    const expectedCode = expectedCodes[index];
    console.log(`${currency} = ${expectedCode}`);
  });
}

// Jalankan test
async function runTests() {
  await testImprovedAhkGeneration();
  testCurrencyMapping();
}

runTests().catch(console.error);
