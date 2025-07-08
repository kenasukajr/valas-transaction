const fs = require('fs');

// Test script AHK untuk berbagai currency
async function testMultipleCurrencies() {
  console.log('=== TEST SCRIPT AHK UNTUK BERBAGAI CURRENCY ===\n');

  const baseUrl = 'http://localhost:8000';
  
  // Test data untuk berbagai currency
  const testCurrencies = [
    { currency: 'USD', rate: '15750', code: '1' },
    { currency: 'EUR', rate: '17200', code: '2' },
    { currency: 'GBP', rate: '19800', code: '3' },
    { currency: 'AUD', rate: '10500', code: '4' },
    { currency: 'CAD', rate: '11800', code: '5' },
    { currency: 'CHF', rate: '17500', code: '6' },
    { currency: 'JPY', rate: '105', code: '7' },
    { currency: 'SGD', rate: '11700', code: '8' }
  ];

  const baseData = {
    name: "PUJI PURNAWAN",
    address: "Jl. Sudirman No. 123, Jakarta Pusat",
    phone: "081234567890",
    job: "Software Engineer",
    idNumber: "3173051234567890",
    birthPlace: "Jakarta",
    birthDate: "1990-05-15",
    amount: "1000"
  };

  for (const currencyData of testCurrencies) {
    console.log(`\n=== TESTING ${currencyData.currency} ===`);
    
    const testData = {
      ...baseData,
      currency: currencyData.currency,
      rate: currencyData.rate,
      rupiahEquivalent: (parseFloat(currencyData.rate) * 1000).toString()
    };

    try {
      const response = await fetch(`${baseUrl}/api/generate-ahk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testData)
      });

      if (response.ok) {
        const buffer = await response.arrayBuffer();
        const ahkContent = Buffer.from(buffer).toString('utf-8');
        
        // Simpan script untuk setiap currency
        const outputFile = `test-currency-${currencyData.currency}.ahk`;
        fs.writeFileSync(outputFile, ahkContent);
        
        console.log(`✓ Script ${currencyData.currency} berhasil digenerate`);
        console.log(`✓ File: ${outputFile}`);
        
        // Validasi currency code
        const expectedSend = `Send, ${currencyData.code}`;
        const hasCorrectCurrencyCode = ahkContent.includes(expectedSend);
        const hasCorrectRate = ahkContent.includes(currencyData.rate);
        const hasCorrectAmount = ahkContent.includes('1000');
        
        console.log(`  - Currency Code (${currencyData.currency}=${currencyData.code}): ${hasCorrectCurrencyCode ? '✓' : '✗'}`);
        console.log(`  - Rate (${currencyData.rate}): ${hasCorrectRate ? '✓' : '✗'}`);
        console.log(`  - Amount (1000): ${hasCorrectAmount ? '✓' : '✗'}`);
        
        // Cek comment pada script
        const expectedComment = `; Isi Code Currency ${currencyData.currency} = ${currencyData.code}`;
        const hasComment = ahkContent.includes(expectedComment);
        console.log(`  - Comment: ${hasComment ? '✓' : '✗'}`);
        
        if (hasCorrectCurrencyCode && hasCorrectRate && hasCorrectAmount && hasComment) {
          console.log(`✅ ${currencyData.currency} script VALID`);
        } else {
          console.log(`❌ ${currencyData.currency} script INVALID`);
        }
        
      } else {
        console.log(`❌ Gagal generate script untuk ${currencyData.currency}`);
        console.log('Status:', response.status);
      }
    } catch (error) {
      console.error(`❌ Error saat test ${currencyData.currency}:`, error.message);
    }
    
    // Delay antar test
    await new Promise(resolve => setTimeout(resolve, 500));
  }
}

// Test khusus untuk JPY (rate yang berbeda karena nominal kecil)
async function testJPYSpecial() {
  console.log('\n=== TEST KHUSUS JPY ===');
  
  const baseUrl = 'http://localhost:8000';
  
  const jpyData = {
    name: "PUJI PURNAWAN",
    address: "Jl. Sudirman No. 123, Jakarta Pusat",
    phone: "081234567890",
    job: "Software Engineer",
    idNumber: "3173051234567890",
    birthPlace: "Jakarta",
    birthDate: "1990-05-15",
    currency: "JPY",
    amount: "10000", // JPY biasanya nominal lebih besar
    rate: "105.50", // JPY rate per 100 unit
    rupiahEquivalent: "1055000"
  };

  try {
    const response = await fetch(`${baseUrl}/api/generate-ahk`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(jpyData)
    });

    if (response.ok) {
      const buffer = await response.arrayBuffer();
      const ahkContent = Buffer.from(buffer).toString('utf-8');
      
      fs.writeFileSync('test-jpy-special.ahk', ahkContent);
      
      console.log('✓ Script JPY khusus berhasil digenerate');
      console.log('✓ File: test-jpy-special.ahk');
      
      // Validasi JPY
      const hasJPYCode = ahkContent.includes('Send, 7'); // JPY = 7
      const hasJPYAmount = ahkContent.includes('10000');
      const hasJPYRate = ahkContent.includes('105.50');
      
      console.log(`  - JPY Code (7): ${hasJPYCode ? '✓' : '✗'}`);
      console.log(`  - JPY Amount (10000): ${hasJPYAmount ? '✓' : '✗'}`);
      console.log(`  - JPY Rate (105.50): ${hasJPYRate ? '✓' : '✗'}`);
      
      if (hasJPYCode && hasJPYAmount && hasJPYRate) {
        console.log('✅ JPY script VALID');
      } else {
        console.log('❌ JPY script INVALID');
      }
      
    } else {
      console.log('❌ Gagal generate script JPY');
    }
  } catch (error) {
    console.error('❌ Error saat test JPY:', error.message);
  }
}

// Summary test
function showSummary() {
  console.log('\n=== SUMMARY TEST ===');
  console.log('File yang dihasilkan:');
  
  const currencies = ['USD', 'EUR', 'GBP', 'AUD', 'CAD', 'CHF', 'JPY', 'SGD'];
  currencies.forEach(currency => {
    const filename = `test-currency-${currency}.ahk`;
    if (fs.existsSync(filename)) {
      const stats = fs.statSync(filename);
      console.log(`✓ ${filename} (${stats.size} bytes)`);
    } else {
      console.log(`✗ ${filename} (tidak ditemukan)`);
    }
  });
  
  if (fs.existsSync('test-jpy-special.ahk')) {
    const stats = fs.statSync('test-jpy-special.ahk');
    console.log(`✓ test-jpy-special.ahk (${stats.size} bytes)`);
  }
  
  console.log('\n📋 Langkah selanjutnya:');
  console.log('1. Jalankan script AHK secara manual di aplikasi PT Mulia Bumi Arta');
  console.log('2. Validasi apakah navigasi dan pengisian data berjalan dengan benar');
  console.log('3. Sesuaikan timing (Sleep) jika diperlukan');
  console.log('4. Validasi currency code mapping dengan aplikasi sesungguhnya');
  console.log('5. Test dengan data real untuk memastikan tidak ada error');
}

// Jalankan semua test
async function runAllTests() {
  await testMultipleCurrencies();
  await testJPYSpecial();
  showSummary();
}

runAllTests().catch(console.error);
