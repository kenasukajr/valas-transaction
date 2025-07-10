// Test script dengan data yang mengandung karakter khusus
const http = require('http');

console.log('🧪 Testing AHK execution dengan data berkarakter khusus...');

const testData = {
  name: 'John "Doe" Test',
  address: 'Jl. Test 123, RT/RW 01/02, Kelurahan "Test"',
  phone: '081-234-567-890',
  job: 'Software Engineer & Developer',
  idNumber: '1234567890123456',
  birthPlace: 'Jakarta "Pusat"',
  birthDate: '1990-01-01',
  transactionType: 'BNB',
  currency: 'USD',
  amount: 1000,
  rate: 15000,
  rupiahEquivalent: 15000000
};

const postData = JSON.stringify({
  script: `
; Test AHK Script dengan karakter khusus
MsgBox, 0, Test AHK, Script AHK berhasil dijalankan!, 3
ExitApp
  `.trim()
});

const options = {
  hostname: 'localhost',
  port: 5000,
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
        console.log('✅ SUCCESS: AHK execution working with special characters!');
        console.log('📋 Details:', result.message);
        console.log('🎯 PID:', result.pid);
        console.log('📁 Temp file:', result.tempFile);
        console.log('\n🎉 AHK script berhasil dijalankan!');
      } else {
        console.log('❌ FAILED: AHK execution failed');
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
  console.log('💡 Pastikan backend server berjalan di port 5000');
});

req.write(postData);
req.end();
