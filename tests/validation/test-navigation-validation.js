/**
 * Test Validasi Perbaikan Navigation Logic BNB
 * Memvalidasi bahwa perbaikan Enter 3x vs Enter 4x sudah benar
 */

const testData = {
  name: "Test Navigation BNB Fixed",
  address: "Test Address Navigation",
  phone: "08123456789",
  job: "Test Job",
  idNumber: "1234567890123456",
  birthPlace: "Test City",
  birthDate: "1990-01-01",
  transactionType: "BNB",
  transactions: [
    {
      currency: "USD",
      amount: "1000",
      rate: "15000"
    },
    {
      currency: "EUR", 
      amount: "500",
      rate: "17000"
    },
    {
      currency: "GBP",
      amount: "300", 
      rate: "19000"
    }
  ]
}

async function testNavigationFix() {
  console.log("=== TEST NAVIGATION FIX BNB (Updated) ===")
  console.log("Testing dengan 3 transaksi BNB - validasi Enter 3x vs Enter 4x")
  
  try {
    // Test generate-ahk endpoint
    const response = await fetch('http://localhost:3000/api/generate-ahk', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const scriptBlob = await response.blob()
    const scriptText = await scriptBlob.text()
    
    console.log("✅ Script berhasil digenerate")
    
    // Validasi logic navigasi
    console.log("\n=== VALIDASI LOGIC NAVIGASI (AFTER FIX) ===")
    
    // 1. Cek bahwa untuk BNB non-terakhir menggunakan Enter 3x (bukan 4x)
    const enter3xPattern = /masih ada transaksi lain BNB.*?Enter 3x/g
    const enter3xMatches = scriptText.match(enter3xPattern)
    console.log(`Enter 3x untuk BNB non-terakhir found: ${enter3xMatches ? enter3xMatches.length : 0}`)
    
    // 2. Cek tidak ada Enter 4x untuk BNB
    const enter4xPattern = /BNB.*?Enter 4x/g
    const enter4xMatches = scriptText.match(enter4xPattern)
    console.log(`Enter 4x untuk BNB found (should be 0): ${enter4xMatches ? enter4xMatches.length : 0}`)
    
    // 3. Cek struktur navigasi antar transaksi
    const transactionSections = scriptText.split('=== ISI DATA TRANSAKSI')
    console.log(`Jumlah section transaksi: ${transactionSections.length - 1}`)
    
    // 4. Cek navigasi khusus untuk BNB (dari routeold.ts)
    const bnbNavigationCorrect = scriptText.includes('Enter 3x sudah dilakukan di dalam fillTransactionRow')
    console.log(`BNB navigation logic (routeold.ts style): ${bnbNavigationCorrect}`)
    
    // 5. Cek reset logic untuk transaksi terakhir BNB
    const hasResetLogic = scriptText.includes('Tekan tombol R 1x untuk reset ke menu utama')
    console.log(`Reset logic found: ${hasResetLogic}`)
    
    // 6. Cek timing yang benar untuk BNB (100ms vs 200ms)
    const fastTimingBNB = scriptText.includes('Sleep(100)')
    console.log(`Fast timing for BNB (100ms): ${fastTimingBNB}`)
    
    // Tulis script untuk review manual
    require('fs').writeFileSync('test-navigation-fixed-output.ahk', scriptText)
    console.log("\n✅ Script disimpan ke test-navigation-fixed-output.ahk untuk review manual")
    
    // Extract sample navigasi untuk analisis
    const sampleNavigasi = scriptText.substring(
      scriptText.indexOf('=== ISI DATA TRANSAKSI 1 ==='),
      scriptText.indexOf('=== ISI DATA TRANSAKSI 3 ===') > 0 ? 
        scriptText.indexOf('=== ISI DATA TRANSAKSI 3 ===') : 
        scriptText.length
    )
    
    console.log("\n=== SAMPLE NAVIGASI TRANSAKSI 1-2 ===")
    console.log(sampleNavigasi.substring(0, 800) + "...")
    
    console.log("\n=== HASIL VALIDASI FINAL ===")
    const allValidationsPassed = (
      enter3xMatches && enter3xMatches.length > 0 &&
      (!enter4xMatches || enter4xMatches.length === 0) &&
      bnbNavigationCorrect &&
      hasResetLogic &&
      fastTimingBNB
    )
    
    console.log(`✅ Script generation: SUCCESS`)
    console.log(`✅ Enter 3x for BNB: ${enter3xMatches && enter3xMatches.length > 0 ? 'CORRECT' : 'INCORRECT'}`)
    console.log(`✅ No Enter 4x for BNB: ${!enter4xMatches || enter4xMatches.length === 0 ? 'CORRECT' : 'INCORRECT'}`)
    console.log(`✅ BNB navigation logic: ${bnbNavigationCorrect ? 'CORRECT' : 'INCORRECT'}`)
    console.log(`✅ Reset logic: ${hasResetLogic ? 'PRESENT' : 'MISSING'}`)
    console.log(`✅ Fast timing (100ms): ${fastTimingBNB ? 'CORRECT' : 'INCORRECT'}`)
    
    if (allValidationsPassed) {
      console.log("\n🎉 SEMUA VALIDASI PASSED! Navigation fix berhasil sesuai routeold.ts!")
    } else {
      console.log("\n⚠️ Ada validasi yang gagal, perlu dicek ulang")
    }
    
  } catch (error) {
    console.error("❌ Test error:", error.message)
  }
}

// Jalankan test
testNavigationFix()
