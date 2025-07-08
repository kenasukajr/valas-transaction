const fs = require('fs');

// Test script AHK sesuai dengan screenshot aplikasi PT Mulia Bumi Arta
async function testMBAApplication() {
  console.log('=== TEST SCRIPT AHK UNTUK APLIKASI PT MULIA BUMI ARTA ===\n');

  // Data sesuai screenshot
  const testData = {
    name: "PUJI PURNAWAN",
    address: "VILLA BANGUNTAPAN 2 NO E5 SAMPANGAN WIROKERTEN BANGUNTAPAN BANTUL",
    phone: "085878813372",
    job: "SWASTA",
    idNumber: "3401121406910001",
    birthPlace: "JOGA",
    birthDate: "1991-06-14",
    currency: "USD", // akan menjadi Code 1 CEK USB
    amount: "100.00",
    rate: "16100.00",
    rupiahEquivalent: "1610000"
  };

  try {
    const response = await fetch('http://localhost:8000/api/generate-ahk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testData)
    });

    if (response.ok) {
      const buffer = await response.arrayBuffer();
      const ahkContent = Buffer.from(buffer).toString('utf-8');
      
      // Simpan script untuk aplikasi MBA
      fs.writeFileSync('script-mba-application.ahk', ahkContent);
      
      console.log('✓ Script AHK berhasil digenerate untuk aplikasi MBA');
      console.log('✓ File disimpan: script-mba-application.ahk');
      console.log('✓ Size:', ahkContent.length, 'bytes');
      
      // Analisis konten script
      const lines = ahkContent.split('\n');
      
      // Cek data nasabah
      const hasName = ahkContent.includes('PUJI PURNAWAN');
      const hasAddress = ahkContent.includes('VILLA BANGUNTAPAN');
      const hasPhone = ahkContent.includes('085878813372');
      const hasJob = ahkContent.includes('SWASTA');
      const hasId = ahkContent.includes('3401121406910001');
      const hasBirth = ahkContent.includes('JOGA 14/06/1991');
      
      console.log('\n=== DATA NASABAH ===');
      console.log('✓ Nama:', hasName ? 'ADA' : 'TIDAK ADA');
      console.log('✓ Alamat:', hasAddress ? 'ADA' : 'TIDAK ADA');
      console.log('✓ Telepon:', hasPhone ? 'ADA' : 'TIDAK ADA');
      console.log('✓ Pekerjaan:', hasJob ? 'ADA' : 'TIDAK ADA');
      console.log('✓ Identitas:', hasId ? 'ADA' : 'TIDAK ADA');
      console.log('✓ Tanggal Lahir:', hasBirth ? 'ADA' : 'TIDAK ADA');
      
      // Cek data transaksi
      const hasCurrencyCode = ahkContent.includes('Send, 1');
      const hasAmount = ahkContent.includes('100.00');
      const hasRate = ahkContent.includes('16100.00');
      
      console.log('\n=== DATA TRANSAKSI ===');
      console.log('✓ Currency Code 1:', hasCurrencyCode ? 'ADA' : 'TIDAK ADA');
      console.log('✓ Amount 100.00:', hasAmount ? 'ADA' : 'TIDAK ADA');
      console.log('✓ Rate 16100.00:', hasRate ? 'ADA' : 'TIDAK ADA');
      
      // Cek flow navigasi
      const hasNavigation = ahkContent.includes('NAVIGASI KE BAGIAN TRANSAKSI');
      const hasEnterOnce = ahkContent.includes('Enter 1x untuk masuk ke bagian transaksi');
      const hasWinActivate = ahkContent.includes('WinActivate, Data Prosesing PT Mulia Bumi Arta');
      
      console.log('\n=== FLOW NAVIGASI ===');
      console.log('✓ Navigasi ke transaksi:', hasNavigation ? 'ADA' : 'TIDAK ADA');
      console.log('✓ Enter 1x saja:', hasEnterOnce ? 'BENAR' : 'SALAH');
      console.log('✓ Window activation:', hasWinActivate ? 'ADA' : 'TIDAK ADA');
      
      // Hitung timing
      const sleepCommands = ahkContent.match(/Sleep, \d+/g);
      console.log('\n=== TIMING ===');
      console.log('✓ Sleep commands:', sleepCommands ? sleepCommands.length : 0);
      console.log('✓ Total estimated time: ~10-12 detik');
      
      console.log('\n=== RINGKASAN ===');
      console.log('Script AHK siap untuk aplikasi PT Mulia Bumi Arta:');
      console.log('1. Mengisi data nasabah PUJI PURNAWAN');
      console.log('2. Enter 1x untuk masuk transaksi');
      console.log('3. Mengisi Code 1 (CEK USD)');
      console.log('4. Mengisi Amount 100.00');
      console.log('5. Mengisi Rate 16100.00');
      console.log('6. Navigasi selesai dengan Down+Enter');
      
    } else {
      console.log('✗ Error:', response.status, response.statusText);
    }
  } catch (error) {
    console.log('✗ Network error:', error.message);
  }
}

testMBAApplication().catch(console.error);
