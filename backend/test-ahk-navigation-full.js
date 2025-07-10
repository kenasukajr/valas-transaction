// Test script AHK dengan navigasi lengkap ke bagian transaksi
const http = require('http');

console.log('🧪 Testing AHK navigation to transaction section...');

// Data test lengkap dengan transaksi
const testData = {
  name: "Test User Navigation",
  address: "Jl. Test Lengkap 123",
  phone: "081234567890",
  job: "Software Tester", 
  idNumber: "1234567890123456",
  birthPlace: "Jakarta",
  birthDate: "1990-01-15",
  transactionType: "BNS",
  currency: "USD",
  amount: "1000",
  rate: "15750",
  payment: "16000000"
};

// Call frontend API
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
        console.log('✅ SUCCESS: Navigation script executed!');
        console.log(`📋 Script details:`, response.details);
        console.log('🎯 Script should navigate to transaction section');
        console.log('💡 Check if script continues after customer data to transaction fields');
      } else {
        console.log('❌ FAILED: Navigation script failed');
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
