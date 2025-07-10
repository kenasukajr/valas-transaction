// Test untuk memastikan frontend menghasilkan script AHK dengan syntax v1 yang benar
const http = require('http');

console.log('🧪 Testing Frontend AHK Script Generation...');

// Data dummy untuk test
const testData = {
  name: "John Doe Test",
  address: "Jl. Test 123, Jakarta",
  phone: "081234567890",
  job: "Engineer",
  idNumber: "1234567890123456",
  birthPlace: "Jakarta",
  birthDate: "1990-01-15",
  transactionType: "BNB",
  amount: 1000000,
  currency: "USD"
};

// Call frontend API untuk generate script
const postData = JSON.stringify(testData);

const options = {
  hostname: 'localhost',
  port: 3000,
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
      const response = JSON.parse(data);
      
      if (response.success) {
        console.log('✅ SUCCESS: Frontend AHK script executed!');
        console.log(`📋 PID: ${response.pid}`);
        console.log(`📁 Temp file: ${response.tempFile}`);
        console.log('💡 Cek apakah script berjalan dengan benar tanpa error line 2.');
      } else {
        console.log('❌ FAILED: Frontend AHK execution failed');
        console.log('📋 Response:', response);
      }
    } catch (err) {
      console.error('❌ FAILED: Error parsing response');
      console.error('📋 Raw response:', data);
    }
  });
});

req.on('error', (err) => {
  console.error('❌ FAILED: Request error:', err.message);
  console.log('💡 Pastikan frontend server berjalan di port 3000');
});

req.write(postData);
req.end();
