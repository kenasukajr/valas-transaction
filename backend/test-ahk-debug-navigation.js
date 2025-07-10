// Debug script untuk melihat navigasi transaksi step by step
const http = require('http');

console.log('🔍 Debugging AHK transaction navigation...');

// Script debug dengan navigasi yang lebih detail dan timing
const debugScript = `
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

; === DETEKSI JENIS TRANSAKSI: BNS ===
; Jenis transaksi BNS - tekan panah kanan 1x SEBELUM memulai script
Send, {Right}
Sleep, 500

Send, {Enter}
Sleep, 300
Send, {Enter}
Sleep, 300

; === INPUT DATA NASABAH (SIMPLIFIED FOR DEBUG) ===
; Skip ke akhir data nasabah dengan Tab
Send, {Tab}{Tab}{Tab}{Tab}{Tab}{Tab}
Sleep, 500

; === DEBUG: POSISI SETELAH DATA NASABAH ===
MsgBox, 0, Debug, Posisi setelah data nasabah. Siap input transaksi?, 3

; === NAVIGASI KE TRANSAKSI ===
; Tab 1 - Mungkin field mata uang
Send, {Tab}
Sleep, 300
MsgBox, 0, Debug Step 1, Tab 1 - Field mata uang?, 2

; Input mata uang
Send, USD
Sleep, 300

; Tab 2 - Mungkin field amount
Send, {Tab}
Sleep, 300
MsgBox, 0, Debug Step 2, Tab 2 - Field amount?, 2

; Input amount
Send, 1000
Sleep, 300

; Tab 3 - Mungkin field rate
Send, {Tab}
Sleep, 300
MsgBox, 0, Debug Step 3, Tab 3 - Field rate?, 2

; Input rate
Send, 15750
Sleep, 300

; Tab 4 - Mungkin field jumlah rupiah (calculated)
Send, {Tab}
Sleep, 300
MsgBox, 0, Debug Step 4, Tab 4 - Field jumlah rupiah?, 2

; Tab 5 - Mungkin field pembayaran
Send, {Tab}
Sleep, 300
MsgBox, 0, Debug Step 5, Tab 5 - Field pembayaran?, 2

; Input pembayaran
Send, 16000000
Sleep, 300

; Tab 6 - Mungkin field kembalian (calculated)
Send, {Tab}
Sleep, 300
MsgBox, 0, Debug Step 6, Tab 6 - Field kembalian?, 2

MsgBox, 0, Debug Complete, Debug navigasi selesai! Cek apakah semua field terisi dengan benar., 5
`.trim();

const postData = JSON.stringify({
  script: debugScript
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
        console.log('✅ SUCCESS: Debug script executed!');
        console.log(`📋 PID: ${response.pid}`);
        console.log('🔍 Debug akan menunjukkan step-by-step navigasi');
        console.log('📝 Perhatikan di mana cursor berhenti dan field mana yang terisi');
        console.log('💡 Gunakan info ini untuk memperbaiki navigasi yang benar');
      } else {
        console.log('❌ FAILED: Debug script failed');
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
