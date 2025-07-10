// Debug script untuk mengidentifikasi posisi field transaksi yang tepat
const http = require('http');

console.log('🔍 Debugging transaction field positions...');

// Script untuk mengecek posisi field satu per satu
const debugPositionScript = `
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

; === SETUP TRANSAKSI BNS ===
Send, {Right}
Sleep, 500
Send, {Enter}
Sleep, 300
Send, {Enter}
Sleep, 300

; === SKIP DATA NASABAH DENGAN TAB ===
; Asumsikan ada 6 field data nasabah
Send, {Tab}{Tab}{Tab}{Tab}{Tab}{Tab}
Sleep, 1000

MsgBox, 0, Debug, Selesai skip data nasabah. Sekarang akan test posisi field transaksi., 3

; === TEST POSISI FIELD TRANSAKSI ===
; Test Tab 1
Send, {Tab}
Sleep, 500
Send, TEST1
Sleep, 500
MsgBox, 0, Debug Tab 1, Tab 1 - Apakah ini field mata uang? Cek apa yang ter-input., 3

; Clear dan lanjut
Send, {Ctrl down}a{Ctrl up}{Delete}
Sleep, 200

; Test Tab 2  
Send, {Tab}
Sleep, 500
Send, TEST2
Sleep, 500
MsgBox, 0, Debug Tab 2, Tab 2 - Apakah ini field amount? Cek apa yang ter-input., 3

; Clear dan lanjut
Send, {Ctrl down}a{Ctrl up}{Delete}
Sleep, 200

; Test Tab 3
Send, {Tab}
Sleep, 500
Send, TEST3
Sleep, 500
MsgBox, 0, Debug Tab 3, Tab 3 - Apakah ini field rate? Cek apa yang ter-input., 3

; Clear dan lanjut
Send, {Ctrl down}a{Ctrl up}{Delete}
Sleep, 200

; Test Tab 4
Send, {Tab}
Sleep, 500
Send, TEST4
Sleep, 500
MsgBox, 0, Debug Tab 4, Tab 4 - Field apa ini? Jumlah rupiah atau lainnya?, 3

; Clear dan lanjut
Send, {Ctrl down}a{Ctrl up}{Delete}
Sleep, 200

; Test Tab 5
Send, {Tab}
Sleep, 500
Send, TEST5
Sleep, 500
MsgBox, 0, Debug Tab 5, Tab 5 - Field apa ini? Pembayaran atau lainnya?, 3

; Clear dan lanjut
Send, {Ctrl down}a{Ctrl up}{Delete}
Sleep, 200

; Test Tab 6
Send, {Tab}
Sleep, 500
Send, TEST6
Sleep, 500
MsgBox, 0, Debug Tab 6, Tab 6 - Field apa ini? Kembalian atau lainnya?, 3

MsgBox, 0, Debug Complete, Debug field position selesai! Catat field mana yang sesuai untuk mata uang, amount, rate, pembayaran., 5
`.trim();

const postData = JSON.stringify({
  script: debugPositionScript
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
        console.log('✅ SUCCESS: Debug position script executed!');
        console.log(`📋 PID: ${response.pid}`);
        console.log('🔍 Debug akan test setiap field position:');
        console.log('   📝 Tab 1: TEST1 - Cek apakah ini field mata uang');
        console.log('   📝 Tab 2: TEST2 - Cek apakah ini field amount');  
        console.log('   📝 Tab 3: TEST3 - Cek apakah ini field rate');
        console.log('   📝 Tab 4: TEST4 - Cek field apa ini');
        console.log('   📝 Tab 5: TEST5 - Cek field apa ini');
        console.log('   📝 Tab 6: TEST6 - Cek field apa ini');
        console.log('💡 Catat urutan field yang benar untuk perbaikan script!');
      } else {
        console.log('❌ FAILED: Debug position failed');
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
