// Test navigasi transaksi dengan timing yang lebih baik
const http = require('http');

console.log('🧪 Testing improved transaction navigation...');

// Data test lengkap
const testData = {
  name: "Test Navigation Fix",
  address: "Jl. Perbaikan Navigasi 123",
  phone: "081234567890",
  job: "QA Tester", 
  idNumber: "1234567890123456",
  birthPlace: "Jakarta",
  birthDate: "1990-01-15",
  transactionType: "BNS",
  currency: "USD",
  amount: "1500",
  rate: "15800",
  payment: "24000000"
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
        console.log('✅ SUCCESS: Improved navigation executed!');
        console.log(`📋 Details:`, response.details);
        console.log('🎯 Improvements made:');
        console.log('   - Extra Tab untuk sampai ke field transaksi');
        console.log('   - Timing 300ms (lebih lambat)');
        console.log('   - Skip calculated fields (jumlah rupiah, kembalian)');
        console.log('   - Separate handling untuk BNS vs BNB');
        console.log('💡 Check if transaction fields are filled correctly now');
      } else {
        console.log('❌ FAILED: Improved navigation failed');
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
  if (err.code === 'ECONNREFUSED') {
    console.log('💡 Frontend tidak berjalan, testing dengan backend langsung...');
    
    // Fallback ke backend direct test
    setTimeout(() => {
      console.log('🔄 Switching to backend direct test...');
      require('./test-ahk-backend-direct-fixed.js');
    }, 1000);
  }
});

req.write(postData);
req.end();
