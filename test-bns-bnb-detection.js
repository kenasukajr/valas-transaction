// Test untuk fitur deteksi jenis transaksi BNB/BNS
// File: test-bns-bnb-detection.js

const testData = {
  // Test 1: Transaksi BNB (normal) - tidak ada navigasi khusus
  testBNB: {
    name: "Test BNB",
    address: "Jl. Test BNB",
    phone: "08123456789",
    job: "Tester",
    idNumber: "1234567890",
    birthPlace: "Jakarta",
    birthDate: "1990-01-01",
    transactionType: "BNB",
    transactions: [
      {
        currency: "USD",
        amount: 1000,
        rate: 15000,
        transactionType: "BNB"
      },
      {
        currency: "EUR",
        amount: 500,
        rate: 16000,
        transactionType: "BNB"
      }
    ]
  },
  
  // Test 2: Transaksi BNS - harus ada navigasi khusus (Right arrow)
  testBNS: {
    name: "Test BNS",
    address: "Jl. Test BNS",
    phone: "08123456789",
    job: "Tester",
    idNumber: "1234567890",
    birthPlace: "Jakarta",
    birthDate: "1990-01-01",
    transactionType: "BNS",
    transactions: [
      {
        currency: "USD",
        amount: 1000,
        rate: 15000,
        transactionType: "BNS"
      },
      {
        currency: "EUR",
        amount: 500,
        rate: 16000,
        transactionType: "BNS"
      }
    ]
  },
  
  // Test 3: Mixed transaksi (BNB dan BNS)
  testMixed: {
    name: "Test Mixed",
    address: "Jl. Test Mixed",
    phone: "08123456789",
    job: "Tester",
    idNumber: "1234567890",
    birthPlace: "Jakarta",
    birthDate: "1990-01-01",
    transactionType: "BNB", // default global
    transactions: [
      {
        currency: "USD",
        amount: 1000,
        rate: 15000,
        transactionType: "BNB"
      },
      {
        currency: "EUR",
        amount: 500,
        rate: 16000,
        transactionType: "BNS"
      },
      {
        currency: "GBP",
        amount: 300,
        rate: 18000,
        transactionType: "BNB"
      }
    ]
  }
}

async function testBNBBNSDetection() {
  console.log('=== TEST DETEKSI JENIS TRANSAKSI BNB/BNS ===\n')
  
  try {
    // Test 1: BNB
    console.log('1. Testing BNB transactions...')
    const resBNB = await fetch('http://localhost:3000/api/generate-ahk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testData.testBNB)
    })
    
    if (resBNB.ok) {
      const scriptBNB = await resBNB.text()
      console.log('✓ BNB script generated successfully')
      
      // Cek apakah TIDAK ada navigasi khusus untuk BNB
      const hasRightArrow = scriptBNB.includes('Send, {Right}')
      if (!hasRightArrow) {
        console.log('✓ BNB: Tidak ada navigasi khusus {Right} - BENAR')
      } else {
        console.log('✗ BNB: Ada navigasi khusus {Right} - SALAH')
      }
    } else {
      console.log('✗ BNB script generation failed')
    }
    
    console.log()
    
    // Test 2: BNS
    console.log('2. Testing BNS transactions...')
    const resBNS = await fetch('http://localhost:3000/api/generate-ahk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testData.testBNS)
    })
    
    if (resBNS.ok) {
      const scriptBNS = await resBNS.text()
      console.log('✓ BNS script generated successfully')
      
      // Cek apakah ADA navigasi khusus untuk BNS
      const hasRightArrow = scriptBNS.includes('Send, {Right}')
      const bnsComment = scriptBNS.includes('Jenis transaksi BNS')
      
      if (hasRightArrow && bnsComment) {
        console.log('✓ BNS: Ada navigasi khusus {Right} - BENAR')
      } else {
        console.log('✗ BNS: Tidak ada navigasi khusus {Right} - SALAH')
      }
      
      // Count berapa kali navigasi khusus muncul (harus 2x untuk 2 transaksi)
      const rightArrowCount = (scriptBNS.match(/Send, \{Right\}/g) || []).length
      console.log(`✓ BNS: Navigasi khusus muncul ${rightArrowCount} kali untuk ${testData.testBNS.transactions.length} transaksi`)
    } else {
      console.log('✗ BNS script generation failed')
    }
    
    console.log()
    
    // Test 3: Mixed
    console.log('3. Testing Mixed transactions (BNB + BNS)...')
    const resMixed = await fetch('http://localhost:3000/api/generate-ahk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testData.testMixed)
    })
    
    if (resMixed.ok) {
      const scriptMixed = await resMixed.text()
      console.log('✓ Mixed script generated successfully')
      
      // Cek apakah ada navigasi khusus hanya untuk BNS
      const rightArrowCount = (scriptMixed.match(/Send, \{Right\}/g) || []).length
      const bnsCount = testData.testMixed.transactions.filter(t => t.transactionType === 'BNS').length
      
      if (rightArrowCount === bnsCount) {
        console.log(`✓ Mixed: Navigasi khusus muncul ${rightArrowCount} kali untuk ${bnsCount} transaksi BNS - BENAR`)
      } else {
        console.log(`✗ Mixed: Navigasi khusus muncul ${rightArrowCount} kali, tapi ada ${bnsCount} transaksi BNS - SALAH`)
      }
      
      // Tampilkan sample script untuk review
      console.log('\n--- SAMPLE SCRIPT MIXED ---')
      const lines = scriptMixed.split('\n')
      lines.forEach((line, index) => {
        if (line.includes('Jenis Transaksi') || line.includes('Send, {Right}') || line.includes('ISI DATA TRANSAKSI')) {
          console.log(`${index + 1}: ${line}`)
        }
      })
    } else {
      console.log('✗ Mixed script generation failed')
    }
    
    console.log('\n=== TEST SELESAI ===')
    
  } catch (error) {
    console.error('Error during test:', error)
  }
}

// Jalankan test
testBNBBNSDetection()
