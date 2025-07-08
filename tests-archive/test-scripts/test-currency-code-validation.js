const fs = require('fs');

// Test spesifik untuk currency code validation
async function testCurrencyCodeValidation() {
  console.log('=== TEST CURRENCY CODE VALIDATION ===\n');

  const testCases = [
    { currency: 'USD', expected: 'Send, 1', name: 'US Dollar' },
    { currency: 'AUD', expected: 'Send, 2', name: 'Australian Dollar' },
    { currency: 'EUR', expected: 'Send, 3', name: 'Euro' },
    { currency: 'GBP', expected: 'Send, 4', name: 'British Pound' },
    { currency: 'JPY', expected: 'Send, 5', name: 'Japanese Yen' },
    { currency: 'SGD', expected: 'Send, 6', name: 'Singapore Dollar' },
    { currency: 'CAD', expected: 'Send, 1', name: 'Canadian Dollar (fallback)' },
    { currency: 'CHF', expected: 'Send, 1', name: 'Swiss Franc (fallback)' },
  ];

  for (const testCase of testCases) {
    console.log(`\nTesting ${testCase.currency} (${testCase.name}):`);
    
    const testData = {
      name: "TEST NASABAH",
      address: "Alamat Test",
      phone: "081234567890",
      job: "Pegawai Test",
      idNumber: "1234567890123456",
      birthPlace: "Jakarta",
      birthDate: "1990-01-01",
      currency: testCase.currency,
      amount: "1000",
      rate: "15800"
    };

    try {
      const response = await fetch('http://localhost:8000/api/generate-ahk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testData)
      });

      if (response.ok) {
        const buffer = await response.arrayBuffer();
        const ahkContent = Buffer.from(buffer).toString('utf-8');
        
        // Simpan untuk debug
        fs.writeFileSync(`test-currency-${testCase.currency}.ahk`, ahkContent);
        
        // Cek apakah currency code ada
        const hasCurrencyCode = ahkContent.includes(testCase.expected);
        const lines = ahkContent.split('\n');
        
        let foundCurrencyLine = '';
        for (const line of lines) {
          if (line.includes('Send, ') && line.match(/Send, \d+/)) {
            foundCurrencyLine = line.trim();
            break;
          }
        }
        
        console.log(`  Input: ${testCase.currency}`);
        console.log(`  Expected: ${testCase.expected}`);
        console.log(`  Found: ${foundCurrencyLine || 'TIDAK DITEMUKAN'}`);
        console.log(`  Status: ${hasCurrencyCode ? '✓ BENAR' : '✗ SALAH'}`);
        
        // Cek konteks sekitar currency code
        if (foundCurrencyLine) {
          const lineIndex = lines.findIndex(line => line.includes(foundCurrencyLine));
          if (lineIndex > 0) {
            console.log(`  Konteks sebelum: ${lines[lineIndex - 1]?.trim()}`);
          }
          if (lineIndex < lines.length - 1) {
            console.log(`  Konteks sesudah: ${lines[lineIndex + 1]?.trim()}`);
          }
        }
        
        // Cek apakah ada navigasi ke transaksi
        const hasTransactionNav = ahkContent.includes('NAVIGASI KE BAGIAN TRANSAKSI');
        const hasTransactionData = ahkContent.includes('ISI DATA TRANSAKSI');
        console.log(`  Navigasi transaksi: ${hasTransactionNav ? 'ADA' : 'TIDAK ADA'}`);
        console.log(`  Bagian transaksi: ${hasTransactionData ? 'ADA' : 'TIDAK ADA'}`);
        
      } else {
        console.log(`  ✗ Error: ${response.status}`);
      }
    } catch (error) {
      console.log(`  ✗ Error: ${error.message}`);
    }
  }
  
  console.log('\n=== SUMMARY ===');
  console.log('File output untuk debug:');
  testCases.forEach(testCase => {
    console.log(`- test-currency-${testCase.currency}.ahk`);
  });
}

testCurrencyCodeValidation().catch(console.error);
