// Test backend langsung dengan navigasi yang diperbaiki
const http = require('http');

console.log('🧪 Testing fixed navigation directly with backend...');

// Script dengan navigasi yang diperbaiki
const improvedScript = `
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

; === VARIABEL DATA NASABAH ===
FullName = Test Navigation Fix
Address = Jl. Perbaikan Navigasi 123
PhoneNumber = 081234567890
JobTitle = QA Tester
IdNumber = 1234567890123456
BirthPlace = Jakarta
BirthDate =  15/01/1990

; === INPUT DATA NASABAH ===
; Input Nama Lengkap
if FullName !=
{
    Send, %FullName%
    Sleep, 150
}
Send, {Tab}
Sleep, 100

; Input Alamat
if Address !=
{
    Send, %Address%
    Sleep, 150
}
Send, {Tab}
Sleep, 100

; Input Nomor Telepon
if PhoneNumber !=
{
    Send, %PhoneNumber%
    Sleep, 150
}
Send, {Tab}
Sleep, 100

; Input Pekerjaan
if JobTitle !=
{
    Send, %JobTitle%
    Sleep, 150
}
Send, {Tab}
Sleep, 100

; Input Nomor Identitas
if IdNumber !=
{
    Send, %IdNumber%
    Sleep, 150
}
Send, {Tab}
Sleep, 100

; Input Tempat Lahir
if BirthPlace !=
{
    Send, %BirthPlace%
    Sleep, 150
}
Send, {Tab}
Sleep, 100

; Input Tanggal Lahir
if BirthDate !=
{
    Send, %BirthDate%
    Sleep, 150
}
Send, {Tab}
Sleep, 100

; === LANJUT KE BAGIAN TRANSAKSI ===
Sleep, 500  ; Wait untuk memastikan form ready

; Transaksi BNS - navigasi ke field mata uang
; Biasanya perlu 1-2 Tab extra untuk sampai ke field transaksi
Send, {Tab}
Sleep, 300
Send, {Tab}
Sleep, 300

; === INPUT MATA UANG: USD ===
Send, USD
Sleep, 300
Send, {Tab}
Sleep, 200

; === INPUT AMOUNT: 1500 ===
Send, 1500
Sleep, 300
Send, {Tab}
Sleep, 200

; === INPUT RATE: 15800 ===
Send, 15800
Sleep, 300

; Skip calculated field (jumlah rupiah) dengan Tab
Send, {Tab}
Sleep, 200

; === INPUT PEMBAYARAN: 24000000 ===
Send, 24000000
Sleep, 300

; Skip calculated field (kembalian)
Send, {Tab}
Sleep, 200

; === SCRIPT SELESAI ===
MsgBox, 0, Success, Input data dan transaksi selesai! Timing diperbaiki., 5
`.trim();

const postData = JSON.stringify({
  script: improvedScript
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
        console.log('✅ SUCCESS: Fixed navigation executed!');
        console.log(`📋 PID: ${response.pid}`);
        console.log(`📁 Temp file: ${response.tempFile}`);
        console.log('🔧 Navigation fixes applied:');
        console.log('   ✅ Extra Tab untuk reach transaction fields');
        console.log('   ✅ Slower timing (300ms)');
        console.log('   ✅ Separate currency/amount/rate input');
        console.log('   ✅ Skip calculated fields properly');
        console.log('   ✅ Proper BNS flow navigation');
        console.log('💡 Check if transaction input works correctly now!');
      } else {
        console.log('❌ FAILED: Fixed navigation failed');
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
