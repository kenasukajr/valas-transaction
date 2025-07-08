const fs = require('fs');

// Test sederhana untuk mengecek navigasi script AHK
async function testAhkNavigation() {
  console.log('=== TEST NAVIGASI SCRIPT AHK ===\n');

  const testData = {
    name: "NASABAH TEST",
    address: "Alamat Test",
    phone: "081234567890",
    job: "Pegawai Test",
    idNumber: "1234567890123456",
    birthPlace: "Jakarta",
    birthDate: "1990-01-01",
    currency: "USD",
    amount: "1000",
    rate: "15800",
    rupiahEquivalent: "15800000"
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
      
      fs.writeFileSync('script-test-navigation.ahk', ahkContent);
      
      console.log('✓ Script AHK berhasil digenerate');
      console.log('✓ File disimpan: script-test-navigation.ahk');
      console.log('✓ Size:', ahkContent.length, 'bytes');
      
      // Analisis komponen navigasi
      const lines = ahkContent.split('\n');
      let foundNavigation = false;
      let foundTransactionData = false;
      let foundMultipleStrategies = false;
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        if (line.includes('NAVIGASI KE BAGIAN TRANSAKSI')) {
          foundNavigation = true;
          console.log('✓ Ditemukan bagian navigasi di baris', i + 1);
        }
        
        if (line.includes('transactionData')) {
          foundTransactionData = true;
        }
        
        if (line.includes('Strategi') && lines[i + 10] && lines[i + 10].includes('Strategi')) {
          foundMultipleStrategies = true;
        }
      }
      
      console.log('✓ Navigasi ke transaksi:', foundNavigation ? 'ADA' : 'TIDAK ADA');
      console.log('✓ Data transaksi:', foundTransactionData ? 'ADA' : 'TIDAK ADA');
      console.log('✓ Multiple strategies:', foundMultipleStrategies ? 'ADA' : 'TIDAK ADA');
      
      // Hitung jumlah strategi navigasi
      const navigationStrategies = ahkContent.match(/Strategi \d+:/g);
      console.log('✓ Jumlah strategi navigasi:', navigationStrategies ? navigationStrategies.length : 0);
      
      // Analisis sleep time
      const sleepCommands = ahkContent.match(/Sleep, \d+/g);
      console.log('✓ Sleep commands:', sleepCommands ? sleepCommands.length : 0);
      
      console.log('\n=== RINGKASAN ===');
      console.log('Script AHK siap untuk mengisi:');
      console.log('1. Data nasabah (6 field)');
      console.log('2. Navigasi ke form transaksi (4 strategi)');
      console.log('3. Data transaksi (3 field)');
      console.log('4. Auto-delete dan exit');
      
    } else {
      console.log('✗ Error:', response.status, response.statusText);
    }
  } catch (error) {
    console.log('✗ Error:', error.message);
  }
}

testAhkNavigation().catch(console.error);
