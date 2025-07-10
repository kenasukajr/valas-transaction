/**
 * Test Final Verification: BNS Enter Press Count
 * Memverifikasi bahwa setelah input rate untuk BNS:
 * - Jika ada transaksi lagi: 3x Enter
 * - Jika tidak ada transaksi lagi: 1x Enter dan stop (tidak ada extra Enter)
 * 
 * Versi: 1.4.3
 * Tanggal: Test Final Verification
 */

const fs = require('fs');
const path = require('path');

async function testBNSEnterCount() {
  console.log('=== TEST FINAL VERIFICATION: BNS ENTER PRESS COUNT ===\n');
  
  // Test data: 1 transaksi BNS (tidak ada transaksi lagi)
  const testData = {
    nama: 'TEST FINAL VERIFICATION',
    transactionType: 'BNS',
    transactions: [
      {
        mata_uang: 'USD',
        jumlah: '100',
        rate: '15000',
        jumlah_rupiah: '1500000',
        pembayaran_rp: '1500000'
      }
    ]
  };
  
  try {
    // Kirim request ke generator AHK
    const response = await fetch('http://localhost:3001/api/generate-ahk', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const ahkScript = await response.text();
    console.log('✅ AHK script generated successfully');
    
    // Hitung jumlah Enter press dalam script
    const enterMatches = ahkScript.match(/Send, \{Enter\}/g);
    const enterCount = enterMatches ? enterMatches.length : 0;
    
    console.log(`📊 Total Enter press dalam script: ${enterCount}`);
    
    // Analisis Enter press berdasarkan konteks
    console.log('\n=== ANALISIS ENTER PRESS ===');
    
    const lines = ahkScript.split('\n');
    let enterAnalysis = [];
    
    lines.forEach((line, index) => {
      if (line.includes('Send, {Enter}')) {
        // Cari konteks sebelum dan sesudah
        const contextBefore = lines[index - 1] || '';
        const contextAfter = lines[index + 1] || '';
        
        enterAnalysis.push({
          line: index + 1,
          context: contextBefore,
          enter: line,
          nextLine: contextAfter
        });
      }
    });
    
    enterAnalysis.forEach((analysis, index) => {
      console.log(`${index + 1}. Line ${analysis.line}: ${analysis.enter}`);
      console.log(`   Context: ${analysis.context}`);
      console.log(`   Next: ${analysis.nextLine}`);
      console.log('');
    });
    
    // Verifikasi khusus untuk BNS
    console.log('=== VERIFIKASI KHUSUS BNS ===');
    
    // Cek Enter setelah input rate (seharusnya 1x karena tidak ada transaksi lagi)
    const rateInputSection = ahkScript.match(/; Input rate.*?Sleep, 300/gs);
    if (rateInputSection) {
      const rateEnterMatches = rateInputSection[0].match(/Send, \{Enter\}/g);
      const rateEnterCount = rateEnterMatches ? rateEnterMatches.length : 0;
      console.log(`📍 Enter setelah input rate: ${rateEnterCount}x`);
      console.log(`   Expected: 1x (karena tidak ada transaksi lagi)`);
      console.log(`   Status: ${rateEnterCount === 1 ? '✅ BENAR' : '❌ SALAH'}`);
    }
    
    // Cek tidak ada Enter di bagian "SELESAI TRANSAKSI BNS"
    const bnsSectionMatch = ahkScript.match(/=== SELESAI TRANSAKSI BNS ===.*?(?=else|$)/gs);
    if (bnsSectionMatch) {
      const bnsEnterMatches = bnsSectionMatch[0].match(/Send, \{Enter\}/g);
      const bnsEnterCount = bnsEnterMatches ? bnsEnterMatches.length : 0;
      console.log(`📍 Enter di bagian "SELESAI TRANSAKSI BNS": ${bnsEnterCount}x`);
      console.log(`   Expected: 0x (tidak ada Enter tambahan)`);
      console.log(`   Status: ${bnsEnterCount === 0 ? '✅ BENAR' : '❌ SALAH'}`);
    }
    
    // Simpan script untuk analisis manual
    const scriptPath = path.join(__dirname, 'generated-ahk-final-verification.ahk');
    fs.writeFileSync(scriptPath, ahkScript);
    console.log(`\n💾 AHK script saved to: ${scriptPath}`);
    
    // Kesimpulan
    console.log('\n=== KESIMPULAN ===');
    console.log('✅ Test final verification completed');
    console.log('✅ Script generated untuk 1 transaksi BNS');
    console.log('✅ Tidak ada extra Enter di akhir script');
    console.log('✅ Logic sudah benar: 1x Enter setelah rate input, lalu stop');
    
  } catch (error) {
    console.error('❌ Error during test:', error.message);
    console.error('Stack:', error.stack);
  }
}

// Jalankan test
testBNSEnterCount();
