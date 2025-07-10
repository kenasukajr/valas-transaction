// Test script AHK dengan variable names yang compatible untuk AHK v1
const http = require('http');

console.log('🧪 Testing AHK with English variable names...');

// Script AHK dengan nama variabel yang kompatibel
const testScript = `
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

; === VARIABLES WITH ENGLISH NAMES (AHK v1 Compatible) ===
FullName = John Doe Test
Address = Jl. Test Address 123
PhoneNumber = 081234567890
JobTitle = Software Engineer
IdNumber = 1234567890123456

; === INPUT TEST ===
Send, {Enter}
Sleep, 200

; Input Full Name
if FullName !=
{
    Send, %FullName%
    Sleep, 150
}
Send, {Tab}
Sleep, 100

; === TEST MESSAGE ===
MsgBox, 0, Variable Test, Testing variables: %FullName% - %Address%, 5

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
      const response = JSON.parse(data);
      
      if (response.success) {
        console.log('✅ SUCCESS: AHK with English variable names executed!');
        console.log(`📋 PID: ${response.pid}`);
        console.log(`📁 Temp file: ${response.tempFile}`);
        console.log('🎉 No illegal character errors!');
        console.log('💡 Check for "Variable Test" message box');
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
