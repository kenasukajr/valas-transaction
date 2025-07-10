// Test script untuk memeriksa syntax AHK yang dihasilkan
const http = require('http');

console.log('🧪 Testing AHK syntax with correct assignment...');

const testData = {
  name: 'John Doe Test',
  address: 'Jl. Test 123',
  phone: '081234567890',
  job: 'Software Engineer',
  idNumber: '1234567890123456',
  birthPlace: 'Jakarta',
  birthDate: '1990-01-01',
  transactionType: 'BNB'
};

// Test dengan data yang akan di-generate ke script
const postData = JSON.stringify(testData);

const options = {
  hostname: 'localhost',
  port: 8000,  // Frontend port untuk generate script
  path: '/api/execute-ahk',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

const req = http.request(options, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const result = JSON.parse(data);
      
      if (result.success) {
        console.log('✅ SUCCESS: AHK script generated and executed!');
        console.log('📋 Details:', result);
      } else {
        console.log('❌ FAILED: AHK script generation failed');
        console.log('📋 Error:', result.error);
        console.log('📋 Details:', result.details);
      }
    } catch (parseError) {
      console.error('❌ PARSE ERROR:', parseError.message);
      console.log('📋 Raw response:', data);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ REQUEST ERROR:', error.message);
  console.log('💡 Pastikan frontend server berjalan di port 8000');
});

req.write(postData);
req.end();
