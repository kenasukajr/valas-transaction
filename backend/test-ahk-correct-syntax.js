// Test script AHK dengan syntax v1 yang benar - langsung ke execute endpoint
const http = require('http');

console.log('🧪 Testing AHK Script with correct v1 syntax...');

// Script AHK yang benar untuk v1
const correctScript = `
IfWinExist, Data Prosesing PT Mulia Bumi Arta
{
    WinRestore, Data Prosesing PT Mulia Bumi Arta
    WinActivate, Data Prosesing PT Mulia Bumi Arta
    WinMaximize, Data Prosesing PT Mulia Bumi Arta
}
else
{
    MsgBox, 16, Error, Window "Data Prosesing PT Mulia Bumi Arta" tidak ditemukan. Pastikan program sudah berjalan.
    ExitApp
}

; === VARIABLES ASSIGNMENT (v1 syntax) ===
namaLengkap = John Doe Test
alamat = Jl. Test Address 123
nomorTelepon = 081234567890
pekerjaan = Software Engineer
nomorID = 1234567890123456

; === TEST MESSAGE ===
MsgBox, 0, Test Success, Script AHK v1 syntax berhasil! Nama: %namaLengkap%, 5

ExitApp
`.trim();

const postData = JSON.stringify({
  script: correctScript
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
      const response = JSON.parse(data);
      
      if (response.success) {
        console.log('✅ SUCCESS: AHK v1 syntax script executed!');
        console.log(`📋 PID: ${response.pid}`);
        console.log(`📁 Temp file: ${response.tempFile}`);
        console.log('🎉 Script AHK dengan syntax v1 berhasil dijalankan!');
        console.log('💡 Periksa apakah muncul message box "Test Success"');
      } else {
        console.log('❌ FAILED: AHK execution failed');
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
  console.log('💡 Pastikan backend server berjalan di port 5000');
});

req.write(postData);
req.end();
