// Test script untuk membuat metode input dari file txt
const fs = require('fs');

// Test cara input dari file txt
async function testFileInputMethod() {
  console.log('=== TEST FILE INPUT METHOD ===\n');

  // Contoh data yang akan ditulis ke file txt
  const nasabahData = {
    name: "PUJI PURNAWAN",
    address: "VILLA BANGUNTAPAN 2 NO E5 SAMPANGAN WIROKERTEN BANGUNTAPAN BANTUL",
    phone: "085878813372",
    job: "SWASTA",
    idNumber: "3401121406910001",
    birthPlace: "JOGA",
    birthDate: "1991-06-14",
    currency: "USD",
    amount: "100.00",
    rate: "16100.00"
  };

  // Format 1: Tab-separated (untuk copy-paste langsung)
  const tabSeparated = [
    nasabahData.name,
    nasabahData.address,
    nasabahData.phone,
    nasabahData.job,
    nasabahData.idNumber,
    `${nasabahData.birthPlace} ${new Date(nasabahData.birthDate).getDate().toString().padStart(2, '0')}/${(new Date(nasabahData.birthDate).getMonth() + 1).toString().padStart(2, '0')}/${new Date(nasabahData.birthDate).getFullYear()}`,
    nasabahData.currency,
    nasabahData.amount,
    nasabahData.rate
  ].join('\t');

  // Format 2: Line-separated (untuk pembacaan berurutan)
  const lineSeparated = [
    nasabahData.name,
    nasabahData.address,
    nasabahData.phone,
    nasabahData.job,
    nasabahData.idNumber,
    `${nasabahData.birthPlace} ${new Date(nasabahData.birthDate).getDate().toString().padStart(2, '0')}/${(new Date(nasabahData.birthDate).getMonth() + 1).toString().padStart(2, '0')}/${new Date(nasabahData.birthDate).getFullYear()}`,
    nasabahData.currency,
    nasabahData.amount,
    nasabahData.rate
  ].join('\n');

  // Format 3: JSON (untuk parsing yang lebih kompleks)
  const jsonFormat = JSON.stringify(nasabahData, null, 2);

  // Simpan ke file
  fs.writeFileSync('nasabah-data-tab.txt', tabSeparated);
  fs.writeFileSync('nasabah-data-line.txt', lineSeparated);
  fs.writeFileSync('nasabah-data.json', jsonFormat);

  console.log('✓ Data disimpan dalam format tab-separated: nasabah-data-tab.txt');
  console.log('✓ Data disimpan dalam format line-separated: nasabah-data-line.txt');
  console.log('✓ Data disimpan dalam format JSON: nasabah-data.json');

  // Buat script AHK yang membaca dari file txt
  const ahkScript = `
; Script AHK untuk membaca data dari file txt
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

; Baca data dari file txt (line-separated)
FileRead, FileContent, nasabah-data-line.txt
if ErrorLevel
{
    MsgBox, 16, Error, Tidak dapat membaca file nasabah-data-line.txt
    ExitApp
}

; Split data berdasarkan newline
StringSplit, DataArray, FileContent, \`n

; Validasi jumlah data
if DataArray0 < 9
{
    MsgBox, 16, Error, Data tidak lengkap. Dibutuhkan 9 baris data.
    ExitApp
}

; Assign data ke variabel
NamaLengkap := DataArray1
Alamat := DataArray2
NomorTelepon := DataArray3
Pekerjaan := DataArray4
NomorIdentitas := DataArray5
TempatTanggalLahir := DataArray6
Currency := DataArray7
Amount := DataArray8
Rate := DataArray9

; Navigasi awal
Send, {Enter}
Sleep, 500
Send, {Enter}
Sleep, 500

; Fungsi untuk mengetik string
TypeString(str) {
    Loop Parse, str
    {
        Send %A_LoopField%
        Sleep 0
    }
}

; === ISI DATA NASABAH ===
; Nama Lengkap
TypeString(NamaLengkap)
Sleep, 100
Send, {Tab}
Sleep, 200

; Alamat
TypeString(Alamat)
Sleep, 100
Send, {Tab}
Sleep, 200

; Nomor Telepon
TypeString(NomorTelepon)
Sleep, 100
Send, {Tab}
Sleep, 200

; Pekerjaan
TypeString(Pekerjaan)
Sleep, 100
Send, {Tab}
Sleep, 200

; Nomor Identitas
TypeString(NomorIdentitas)
Sleep, 100
Send, {Tab}
Sleep, 200

; Tempat Tanggal Lahir
TypeString(TempatTanggalLahir)
Sleep, 100
Send, {Tab}
Sleep, 200

; === NAVIGASI KE BAGIAN TRANSAKSI ===
Sleep, 1000
WinActivate, Data Prosesing PT Mulia Bumi Arta
Sleep, 500

; Enter 1x untuk masuk ke bagian transaksi
Send, {Enter}
Sleep, 1500

; Pastikan window masih aktif
WinActivate, Data Prosesing PT Mulia Bumi Arta
Sleep, 500

; === ISI DATA TRANSAKSI ===
; Konversi currency ke code
CurrencyCode := "1"
if (Currency = "USD" or Currency = "USB")
    CurrencyCode := "1"
else if (Currency = "AUD")
    CurrencyCode := "2"
else if (Currency = "EUR")
    CurrencyCode := "3"
else if (Currency = "GBP")
    CurrencyCode := "4"
else if (Currency = "JPY")
    CurrencyCode := "5"
else if (Currency = "SGD")
    CurrencyCode := "6"
else if (Currency = "CAD")
    CurrencyCode := "7"
else if (Currency = "CHF")
    CurrencyCode := "8"

; Isi code currency
Send, %CurrencyCode%
Sleep, 700
Send, {Enter}
Sleep, 1000

; Isi amount
TypeString(Amount)
Sleep, 600
Send, {Enter}
Sleep, 900

; Isi rate
TypeString(Rate)
Sleep, 600
Send, {Enter}
Sleep, 900

; Selesai transaksi
Send, {Down}
Sleep, 600
Send, {Enter}
Sleep, 1200

; Cleanup
Sleep, 500
ExitApp
`;

  // Simpan script AHK
  fs.writeFileSync('script-file-input.ahk', ahkScript);
  
  console.log('✓ Script AHK dengan file input: script-file-input.ahk');
  console.log('\nCara penggunaan:');
  console.log('1. Edit file nasabah-data-line.txt dengan data yang diinginkan');
  console.log('2. Jalankan script-file-input.ahk');
  console.log('3. Script akan membaca data dari file dan mengisi otomatis');
  
  console.log('\n=== PREVIEW DATA ===');
  console.log('Tab-separated format:');
  console.log(tabSeparated);
  console.log('\nLine-separated format:');
  console.log(lineSeparated);
  
  return true;
}

// Jalankan test
testFileInputMethod().catch(console.error);
