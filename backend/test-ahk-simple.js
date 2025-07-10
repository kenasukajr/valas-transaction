// Simple test script untuk eksekusi AHK langsung
const http = require('http');

console.log('🧪 Testing AHK execution endpoint...');

const testScript = `
; Test AHK Script
MsgBox, 0, Test AHK, Script AHK berhasil dijalankan dari aplikasi web!, 3
ExitApp
`.trim();

const postData = JSON.stringify({
  script: testScript
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
        console.log('✅ SUCCESS: AHK execution endpoint working!');
        console.log('📋 Details:', result.message);
        console.log('🎯 PID:', result.pid);
        console.log('📁 Temp file:', result.tempFile);
        console.log('\n🎉 Script AHK berhasil dijalankan langsung dari backend!');
        console.log('💡 Cek apakah muncul message box "Test AHK" di layar Anda.');
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
