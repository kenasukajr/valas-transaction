const fs = require('fs');

// Test script AHK untuk validasi final
async function testAhkGeneration() {
  console.log('=== TEST VALIDASI AKHIR SCRIPT AHK ===\n');

  const baseUrl = 'http://localhost:8000';
  
  // Test Case 1: Data nasabah + transaksi lengkap
  console.log('1. Testing script AHK dengan data nasabah + transaksi lengkap...');
  const fullData = {
    name: "PUJI PURNAWAN",
    address: "Jl. Sudirman No. 123, Jakarta Pusat, DKI Jakarta 10110",
    phone: "081234567890",
    job: "Software Engineer",
    idNumber: "3173051234567890",
    birthPlace: "Jakarta",
    birthDate: "1990-05-15",
    currency: "USD",
    amount: "1000",
    rate: "15750",
    rupiahEquivalent: "15750000"
  };

  try {
    const response = await fetch(`${baseUrl}/api/generate-ahk`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fullData)
    });

    if (response.ok) {
      const buffer = await response.arrayBuffer();
      const ahkContent = Buffer.from(buffer).toString('utf-8');
      
      // Simpan untuk inspeksi
      fs.writeFileSync('test-output-full.ahk', ahkContent);
      
      // Validasi konten
      console.log('✓ Script berhasil digenerate');
      console.log('✓ Size:', ahkContent.length, 'bytes');
      
      // Cek apakah mengandung data nasabah
      const hasName = ahkContent.includes('PUJI PURNAWAN');
      const hasAddress = ahkContent.includes('Jl. Sudirman');
      const hasPhone = ahkContent.includes('081234567890');
      console.log('✓ Mengandung data nasabah:', hasName && hasAddress && hasPhone ? 'YA' : 'TIDAK');
      
      // Cek apakah mengandung data transaksi
      const hasCurrency = ahkContent.includes('USD');
      const hasAmount = ahkContent.includes('1000');
      const hasRate = ahkContent.includes('15750');
      console.log('✓ Mengandung data transaksi:', hasCurrency && hasAmount && hasRate ? 'YA' : 'TIDAK');
      
      // Cek navigasi ke transaksi
      const hasTransactionNav = ahkContent.includes('NAVIGASI KE BAGIAN TRANSAKSI');
      const hasClickAction = ahkContent.includes('Click, 300, 400');
      const hasTabNavigation = ahkContent.includes('Loop, 5');
      console.log('✓ Navigasi ke transaksi:', hasTransactionNav && hasClickAction && hasTabNavigation ? 'ADA' : 'TIDAK ADA');
      
      // Cek struktur script
      const hasTypeString = ahkContent.includes('TypeString(str)');
      const hasAutoDelete = ahkContent.includes('FileDelete, %A_ScriptFullPath%');
      const hasExitApp = ahkContent.includes('ExitApp');
      console.log('✓ Struktur script lengkap:', hasTypeString && hasAutoDelete && hasExitApp ? 'YA' : 'TIDAK');
      
    } else {
      console.log('✗ Error:', response.status, response.statusText);
    }
  } catch (error) {
    console.log('✗ Network error:', error.message);
  }

  console.log('\n' + '='.repeat(50));

  // Test Case 2: Data nasabah saja (tanpa transaksi)
  console.log('\n2. Testing script AHK dengan data nasabah saja...');
  const nasabahOnly = {
    name: "BUDI SANTOSO",
    address: "Jl. Gatot Subroto No. 456",
    phone: "087654321098",
    job: "Manager",
    idNumber: "3174061987654321",
    birthPlace: "Bandung",
    birthDate: "1985-03-20"
  };

  try {
    const response = await fetch(`${baseUrl}/api/generate-ahk`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nasabahOnly)
    });

    if (response.ok) {
      const buffer = await response.arrayBuffer();
      const ahkContent = Buffer.from(buffer).toString('utf-8');
      
      fs.writeFileSync('test-output-nasabah-only.ahk', ahkContent);
      
      console.log('✓ Script berhasil digenerate');
      console.log('✓ Size:', ahkContent.length, 'bytes');
      
      const hasName = ahkContent.includes('BUDI SANTOSO');
      const hasAddress = ahkContent.includes('Gatot Subroto');
      console.log('✓ Mengandung data nasabah:', hasName && hasAddress ? 'YA' : 'TIDAK');
      
      // Tidak boleh ada data transaksi
      const hasTransactionData = ahkContent.includes('transactionData');
      const hasTransactionNav = ahkContent.includes('NAVIGASI KE BAGIAN TRANSAKSI');
      console.log('✓ Tidak ada data transaksi:', !hasTransactionData && !hasTransactionNav ? 'BENAR' : 'SALAH');
      
    } else {
      console.log('✗ Error:', response.status, response.statusText);
    }
  } catch (error) {
    console.log('✗ Network error:', error.message);
  }

  console.log('\n' + '='.repeat(50));

  // Test Case 3: Data dengan karakter khusus
  console.log('\n3. Testing script AHK dengan karakter khusus...');
  const specialChars = {
    name: "SRI MULYANI S.Kom",
    address: "Jl. H.R. Rasuna Said No. 1-2, RT.01/RW.02",
    phone: "+62-21-1234567",
    job: "IT Specialist & Developer",
    idNumber: "3201234567890123",
    birthPlace: "Surabaya",
    birthDate: "1988-12-31",
    currency: "JPY",
    amount: "100,000",
    rate: "105.50",
    rupiahEquivalent: "10,550,000"
  };

  try {
    const response = await fetch(`${baseUrl}/api/generate-ahk`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(specialChars)
    });

    if (response.ok) {
      const buffer = await response.arrayBuffer();
      const ahkContent = Buffer.from(buffer).toString('utf-8');
      
      fs.writeFileSync('test-output-special-chars.ahk', ahkContent);
      
      console.log('✓ Script berhasil digenerate');
      console.log('✓ Size:', ahkContent.length, 'bytes');
      
      const hasSpecialName = ahkContent.includes('SRI MULYANI S.Kom');
      const hasSpecialAddress = ahkContent.includes('H.R. Rasuna Said');
      const hasSpecialPhone = ahkContent.includes('+62-21-1234567');
      console.log('✓ Handle karakter khusus:', hasSpecialName && hasSpecialAddress && hasSpecialPhone ? 'BAIK' : 'BERMASALAH');
      
      const hasJPY = ahkContent.includes('JPY');
      const hasCommaAmount = ahkContent.includes('100,000');
      console.log('✓ Handle data transaksi khusus:', hasJPY && hasCommaAmount ? 'BAIK' : 'BERMASALAH');
      
    } else {
      console.log('✗ Error:', response.status, response.statusText);
    }
  } catch (error) {
    console.log('✗ Network error:', error.message);
  }

  console.log('\n=== HASIL VALIDASI ===');
  console.log('File test output disimpan:');
  console.log('- test-output-full.ahk (data lengkap)');
  console.log('- test-output-nasabah-only.ahk (data nasabah saja)');
  console.log('- test-output-special-chars.ahk (karakter khusus)');
  console.log('\nSilakan buka file .ahk untuk inspeksi manual.');
}

// Jalankan test
testAhkGeneration().catch(console.error);
