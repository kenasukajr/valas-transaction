// Test navigasi transaksi langsung dengan script AHK manual
const http = require('http');

console.log('🧪 Testing AHK navigation to transaction section (Backend Direct)...');

// Script AHK lengkap dengan navigasi ke transaksi
const fullNavigationScript = `
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
Sleep, 300

Send, {Enter}
Sleep, 200
Send, {Enter}
Sleep, 200

; === VARIABEL DATA NASABAH ===
FullName = Test User Navigation
Address = Jl. Test Lengkap 123
PhoneNumber = 081234567890
JobTitle = Software Tester
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
; Transaksi BNS - navigasi ke field mata uang
Send, {Tab}
Sleep, 200

; === INPUT MATA UANG: USD ===
Send, USD
Sleep, 200
Send, {Tab}
Sleep, 100
Send, 1000
Sleep, 200
Send, {Tab}
Sleep, 100
Send, 15750
Sleep, 200

; Lanjut ke field pembayaran
Send, {Tab}
Sleep, 100
Send, 16000000
Sleep, 200

; === SCRIPT SELESAI ===
MsgBox, 0, Success, Input data dan transaksi selesai! Silakan cek semua field., 5
`.trim();

const postData = JSON.stringify({
  script: fullNavigationScript
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
        console.log('✅ SUCCESS: Full navigation script executed!');
        console.log(`📋 PID: ${response.pid}`);
        console.log(`📁 Temp file: ${response.tempFile}`);
        console.log('🎯 Script should complete data input AND transaction fields');
        console.log('💡 Check if script shows "Input data dan transaksi selesai!" message');
        console.log('📝 Verify all fields filled: Customer data + Currency + Amount + Rate + Payment');
      } else {
        console.log('❌ FAILED: Full navigation failed');
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
