const fs = require('fs');

// Test script AHK untuk berbagai mata uang
async function testCurrencyMapping() {
  console.log('=== TEST CURRENCY MAPPING SCRIPT AHK ===\n');

  const currencies = [
    { code: 'USD', name: 'US Dollar', expected: '1' },
    { code: 'AUD', name: 'Australian Dollar', expected: '2' },
    { code: 'EUR', name: 'Euro', expected: '3' },
    { code: 'GBP', name: 'British Pound', expected: '4' },
    { code: 'JPY', name: 'Japanese Yen', expected: '5' },
    { code: 'SGD', name: 'Singapore Dollar', expected: '6' },
    { code: 'CAD', name: 'Canadian Dollar', expected: '1' }, // fallback to default
  ];

  for (const currency of currencies) {
    console.log(`Testing ${currency.code} (${currency.name})...`);
    
    const testData = {
      name: "TEST NASABAH",
      address: "Alamat Test",
      phone: "081234567890",
      job: "Pegawai Test",
      idNumber: "1234567890123456",
      birthPlace: "Jakarta",
      birthDate: "1990-01-01",
      currency: currency.code,
      amount: "1000",
      rate: "15800",
      rupiahEquivalent: "15800000"
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
        
        // Cek apakah currency code sudah benar
        const currencyCodeMatch = ahkContent.match(/Send, (\d+)/);
        if (currencyCodeMatch) {
          const generatedCode = currencyCodeMatch[1];
          const isCorrect = generatedCode === currency.expected;
          console.log(`  ✓ ${currency.code} → Code: ${generatedCode} ${isCorrect ? '✓' : '✗'}`);
        } else {
          console.log(`  ✗ ${currency.code} → Code tidak ditemukan`);
        }
        
        // Cek flow transaksi
        const hasEnterAfterCode = ahkContent.includes('Send, {Enter}');
        const hasAmount = ahkContent.includes(`TypeString("${testData.amount}")`);
        const hasRate = ahkContent.includes(`TypeString("${testData.rate}")`);
        const hasDownArrow = ahkContent.includes('Send, {Down}');
        
        console.log(`  ✓ Flow: Enter after code: ${hasEnterAfterCode ? 'YA' : 'TIDAK'}`);
        console.log(`  ✓ Flow: Amount filled: ${hasAmount ? 'YA' : 'TIDAK'}`);
        console.log(`  ✓ Flow: Rate filled: ${hasRate ? 'YA' : 'TIDAK'}`);
        console.log(`  ✓ Flow: Down arrow: ${hasDownArrow ? 'YA' : 'TIDAK'}`);
        
      } else {
        console.log(`  ✗ Error: ${response.status}`);
      }
    } catch (error) {
      console.log(`  ✗ Error: ${error.message}`);
    }
    
    console.log('');
  }
  
  console.log('=== RINGKASAN CURRENCY MAPPING ===');
  console.log('1 = USD (US Dollar)');
  console.log('2 = AUD (Australian Dollar)');
  console.log('3 = EUR (Euro)');
  console.log('4 = GBP (British Pound)');
  console.log('5 = JPY (Japanese Yen)');
  console.log('6 = SGD (Singapore Dollar)');
  console.log('Default = 1 (USD) untuk currency lain');
}

testCurrencyMapping().catch(console.error);
