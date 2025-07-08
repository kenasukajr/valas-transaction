// Test untuk validasi currency mapping dinamis dari valasData
const axios = require('axios');

// Test currency mapping yang sesuai dengan valasData
const testCurrencies = [
  { currency: 'USD', expected: '1' },
  { currency: 'USB', expected: '1' },  // alias untuk USD
  { currency: 'USK', expected: '1' },  // alias untuk USD
  { currency: 'AUD', expected: '2' },
  { currency: 'CAD', expected: '3' },
  { currency: 'EUR', expected: '4' },
  { currency: 'GBP', expected: '5' },
  { currency: 'CHF', expected: '6' },
  { currency: 'HKD', expected: '7' },
  { currency: 'SGD', expected: '8' },
  { currency: 'JPY', expected: '9' },
  { currency: 'NZD', expected: '10' },
];

async function testCurrencyMapping() {
  const baseUrl = 'http://localhost:3000/api/generate-ahk';
  
  console.log('=== TEST CURRENCY MAPPING DINAMIS ===');
  console.log('Memastikan mapping currency menggunakan valasData...\n');

  for (const testCase of testCurrencies) {
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

      console.log(`Currency: ${testCase.currency}`);
      console.log(`Expected Code: ${testCase.expected}`);
      console.log(`Debug Line: ${debugLine || 'NOT FOUND'}`);
      console.log(`Code Mapping: ${codeLine ? 'FOUND' : 'NOT FOUND'}`);
      
      if (codeLine) {
        console.log('✅ PASS');
      } else {
        console.log('❌ FAIL');
      }
      console.log('---');
      
    } catch (error) {
      console.error(`Error testing ${testCase.currency}:`, error.message);
    }
  }
  
  console.log('\n=== TEST SELESAI ===');
}

testCurrencyMapping().catch(console.error);
