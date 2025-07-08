// Test untuk validasi fallback currency mapping
const axios = require('axios');

// Test currency yang tidak ada di valasData (fallback)
const testCurrenciesFallback = [
  { currency: 'XYZ', expected: '1' },  // unknown currency, should fallback to USD
  { currency: 'AAA', expected: '1' },  // unknown currency, should fallback to USD
  { currency: '', expected: '1' },     // empty currency, should fallback to USD
];

async function testCurrencyFallback() {
  const baseUrl = 'http://localhost:3000/api/generate-ahk';
  
  console.log('=== TEST CURRENCY FALLBACK MAPPING ===');
  console.log('Memastikan currency yang tidak dikenal fallback ke USD...\n');

  for (const testCase of testCurrenciesFallback) {
    const data = {
      name: 'Test User',
      address: 'Test Address',
      phone: '08123456789',
      job: 'Test Job',
      idNumber: '1234567890',
      birthPlace: 'Test Place',
      birthDate: '1990-01-01',
      currency: testCase.currency,
      amount: '1000',
      rate: '16000'
    };

    try {
      const response = await axios.post(baseUrl, data, {
        responseType: 'text'
      });

      const ahkContent = response.data;
      
      // Cek apakah script berisi mapping currency yang benar
      const debugLine = ahkContent.split('\n').find(line => 
        line.includes('Debug: Currency input')
      );
      
      const codeLine = ahkContent.split('\n').find(line => 
        line.includes(`Send, ${testCase.expected}`)
      );

      console.log(`Currency: "${testCase.currency}"`);
      console.log(`Expected Code: ${testCase.expected}`);
      console.log(`Debug Line: ${debugLine || 'NOT FOUND'}`);
      console.log(`Code Mapping: ${codeLine ? 'FOUND' : 'NOT FOUND'}`);
      
      if (codeLine) {
        console.log('✅ PASS - Fallback bekerja');
      } else {
        console.log('❌ FAIL - Fallback tidak bekerja');
      }
      console.log('---');
      
    } catch (error) {
      console.error(`Error testing "${testCase.currency}":`, error.message);
    }
  }
  
  console.log('\n=== TEST SELESAI ===');
}

testCurrencyFallback().catch(console.error);
