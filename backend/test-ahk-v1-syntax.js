// Test untuk memastikan syntax AHK v1 yang benar
const http = require('http');

console.log('🧪 Testing AHK syntax v1 compatibility...');

// Test script dengan syntax AHK v1 yang benar
const testScript = `
; Test AHK Script dengan syntax v1
namaLengkap = John Doe Test
alamat = Jl. Test 123
nomorTelepon = 081234567890

; Test variabel assignment dan message box
MsgBox, 0, Test Variables, Script AHK v1 berhasil dijalankan!, 3

; Test conditional
if namaLengkap !=
{
    ; Variable berisi data
}

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
        console.log('✅ SUCCESS: AHK v1 syntax working!');
        console.log('📋 Details:', result.message);
        console.log('🎯 PID:', result.pid);
        console.log('\n🎉 AHK script dengan syntax v1 berhasil dijalankan!');
        console.log('💡 Cek apakah muncul message box dengan data variabel.');
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
