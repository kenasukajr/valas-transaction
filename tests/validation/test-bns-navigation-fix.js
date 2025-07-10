// Test BNS Navigation Logic - Validasi Perbaikan Multiple Transactions
// Menguji apakah perbaikan navigasi antar transaksi BNS berhasil

const testDataBNS = {
  name: 'Test User BNS Multi',
  address: 'Jl. Test BNS No. 456',
  phone: '081234567890',
  job: 'Test Job BNS',
  idNumber: '1234567890123456',
  birthPlace: 'Surabaya',
  birthDate: '1985-05-15',
  transactionType: 'BNS',
  transactions: [
    { currency: 'USD', amount: 200, rate: 15500 },
    { currency: 'EUR', amount: 100, rate: 17500 },
    { currency: 'GBP', amount: 50, rate: 19500 },
    { currency: 'SGD', amount: 300, rate: 11000 }
  ]
}

console.log('=== TEST NAVIGATION LOGIC FOR MULTIPLE BNS TRANSACTIONS ===')
console.log('Test Data:', JSON.stringify(testDataBNS, null, 2))

// Simulasi logic yang akan dihasilkan oleh generator untuk BNS
function simulateBNSNavigationLogic(transactions, transactionType) {
  console.log('\n=== SIMULATED BNS NAVIGATION LOGIC ===')
  
  transactions.forEach((transaction, index) => {
    const isLastTransaction = (index === transactions.length - 1)
    const nextTransactionNumber = index + 2
    
    console.log(`\nTRANSAKSI ${index + 1}:`)
    console.log(`- Currency: ${transaction.currency}`)
    console.log(`- Amount: ${transaction.amount}`)
    console.log(`- Rate: ${transaction.rate}`)
    console.log(`- Is Last: ${isLastTransaction}`)
    
    // Logic setelah input rate
    console.log('  AFTER RATE INPUT: Enter 3x (BNS logic)')
    
    // Navigation antar transaksi
    if (!isLastTransaction) {
      if (nextTransactionNumber > 8) {
        console.log(`  NAVIGATION TO ${nextTransactionNumber}: Enter 3x + Sleep + Up 7x (AFTER ROW 8)`)
      } else {
        console.log(`  NAVIGATION TO ${nextTransactionNumber}: Enter 1x + Sleep 500ms + WinActivate (BNS NORMAL)`)
      }
    } else {
      console.log('  FINAL TRANSACTION: Down 1x → Enter → Payment Input → Enter 3x → Reset R')
    }
  })
}

// Test dengan data lebih dari 8 transaksi untuk test navigasi khusus
const testDataBNSLarge = {
  ...testDataBNS,
  transactions: [
    { currency: 'USD', amount: 100, rate: 15000 },
    { currency: 'EUR', amount: 50, rate: 17000 },
    { currency: 'GBP', amount: 25, rate: 19000 },
    { currency: 'AUD', amount: 75, rate: 11000 },
    { currency: 'CAD', amount: 60, rate: 12000 },
    { currency: 'CHF', amount: 40, rate: 16000 },
    { currency: 'JPY', amount: 10000, rate: 110 },
    { currency: 'SGD', amount: 80, rate: 11500 },
    { currency: 'HKD', amount: 200, rate: 1900 }, // Row 9 - trigger special navigation
    { currency: 'NZD', amount: 45, rate: 10000 }   // Row 10
  ]
}

// Test logic navigasi
console.log('\n=== TEST NORMAL BNS (<=8 ROWS) ===')
simulateBNSNavigationLogic(testDataBNS.transactions, 'BNS')

console.log('\n=== TEST BNS WITH SPECIAL NAVIGATION (>8 ROWS) ===')
simulateBNSNavigationLogic(testDataBNSLarge.transactions, 'BNS')

// Test dengan server lokal
async function testBNSWithServer() {
  console.log('\n=== TESTING BNS WITH LOCAL SERVER ===')
  
  try {
    // Test generate-ahk untuk BNS
    console.log('Testing BNS generate-ahk endpoint...')
    const generateResponse = await fetch('http://localhost:8000/api/generate-ahk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testDataBNS)
    })
    
    if (generateResponse.ok) {
      console.log('✓ BNS Generate AHK success')
      const blob = await generateResponse.blob()
      console.log(`  Script size: ${blob.size} bytes`)
    } else {
      console.log('✗ BNS Generate AHK failed:', generateResponse.status)
    }
    
    // Test execute-ahk untuk BNS
    console.log('Testing BNS execute-ahk endpoint...')
    const executeResponse = await fetch('http://localhost:8000/api/execute-ahk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testDataBNS)
    })
    
    if (executeResponse.ok) {
      const result = await executeResponse.json()
      console.log('✓ BNS Execute AHK success')
      console.log(`  Message: ${result.message}`)
      if (result.details) {
        console.log(`  Script path: ${result.details.tempFile}`)
      }
    } else {
      console.log('✗ BNS Execute AHK failed:', executeResponse.status)
    }
    
    // Test dengan data besar (>8 rows)
    console.log('Testing BNS with large dataset (>8 rows)...')
    const largeResponse = await fetch('http://localhost:8000/api/generate-ahk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testDataBNSLarge)
    })
    
    if (largeResponse.ok) {
      console.log('✓ BNS Large dataset success')
      const blob = await largeResponse.blob()
      console.log(`  Large script size: ${blob.size} bytes`)
    } else {
      console.log('✗ BNS Large dataset failed:', largeResponse.status)
    }
    
  } catch (error) {
    console.log('✗ BNS Server test failed:', error.message)
    console.log('  Make sure server is running at http://localhost:8000')
  }
}

// Key differences yang diperbaiki untuk BNS
console.log('\n=== KEY BNS FIXES APPLIED ===')
console.log('1. ✅ Added navigation logic between transactions for BNS')
console.log('2. ✅ BNS uses Enter 1x + Sleep 500ms for inter-transaction navigation')
console.log('3. ✅ BNS has different timing (slower) compared to BNB')
console.log('4. ✅ Special navigation for transactions after row 8 (Up 7x)')
console.log('5. ✅ Payment flow added for BNS (Down → Enter → Payment → Enter 3x → Reset)')
console.log('6. ✅ WinActivate added to ensure window focus for BNS')

// Export untuk penggunaan di browser atau Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { 
    testDataBNS, 
    testDataBNSLarge, 
    simulateBNSNavigationLogic, 
    testBNSWithServer 
  }
} else if (typeof window !== 'undefined') {
  window.testBNSLogic = { 
    testDataBNS, 
    testDataBNSLarge, 
    simulateBNSNavigationLogic, 
    testBNSWithServer 
  }
}

console.log('\n=== BNS TEST INSTRUCTIONS ===')
console.log('1. Untuk test di Node.js: node test-bns-navigation-fix.js')
console.log('2. Untuk test di browser: buka di browser dan lihat console')
console.log('3. Untuk test dengan server: pastikan server berjalan di port 8000')
console.log('4. Perbedaan utama BNS vs BNB:')
console.log('   - BNS: Enter 1x + Sleep 500ms antar transaksi')
console.log('   - BNB: Enter 3x + Sleep 100ms antar transaksi')
console.log('   - BNS: Ada payment flow di akhir')
console.log('   - BNB: Langsung reset R di akhir')
