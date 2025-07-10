const fetch = require('node-fetch');

async function testFinalVerification() {
  console.log('=== TEST VERIFIKASI AKHIR GENERATOR AHK ===\n');
  
  const testData = {
    transactionType: 'BNS',
    namaLengkap: 'NASABAH TEST',
    alamat: 'Alamat Test',
    nomorTelepon: '081234567890',
    pekerjaan: 'Pegawai Test',
    nomorIdentitas: '1234567890123456',
    tempatTanggalLahir: 'Jakarta 01/01/1990',
    currency: 'USD',
    amount: '1000',
    rate: '15800'
  };

  try {
    console.log('Data test yang akan dikirim:');
    console.log(JSON.stringify(testData, null, 2));
    console.log('\n=== MENGIRIM REQUEST KE GENERATOR ===');
    
    const response = await fetch('http://localhost:3000/api/execute-ahk', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('\n=== HASIL RESPONSE ===');
    console.log('Success:', result.success);
    console.log('Message:', result.message);
    
    if (result.details && result.details.script) {
      console.log('\n=== SCRIPT AHK YANG DIHASILKAN ===');
      console.log(result.details.script);
      
      // Verifikasi urutan input transaksi
      const scriptLines = result.details.script.split('\n');
      let foundCurrency = false;
      let foundAmount = false;
      let foundRate = false;
      let foundFinish = false;
      
      console.log('\n=== VERIFIKASI URUTAN INPUT TRANSAKSI ===');
      
      for (let i = 0; i < scriptLines.length; i++) {
        const line = scriptLines[i].trim();
        
        if (line.includes('Send, 1') && !foundCurrency) {
          console.log('✓ Currency code input: Line', i + 1, ':', line);
          foundCurrency = true;
        }
        
        if (line.includes('TypeString("1000")') && foundCurrency && !foundAmount) {
          console.log('✓ Amount input: Line', i + 1, ':', line);
          foundAmount = true;
        }
        
        if (line.includes('TypeString("15800")') && foundAmount && !foundRate) {
          console.log('✓ Rate input: Line', i + 1, ':', line);
          foundRate = true;
        }
        
        if (line.includes('Send, {Down}') && foundRate && !foundFinish) {
          console.log('✓ Finish navigation: Line', i + 1, ':', line);
          foundFinish = true;
        }
      }
      
      if (foundCurrency && foundAmount && foundRate && foundFinish) {
        console.log('\n✅ SEMUA URUTAN INPUT TRANSAKSI BENAR!');
      } else {
        console.log('\n❌ ADA MASALAH PADA URUTAN INPUT TRANSAKSI!');
        console.log('Currency found:', foundCurrency);
        console.log('Amount found:', foundAmount);
        console.log('Rate found:', foundRate);
        console.log('Finish found:', foundFinish);
      }
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testFinalVerification();
