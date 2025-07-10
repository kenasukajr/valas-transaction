// Test Navigasi Antar Transaksi BNB - Validasi Perbaikan
// Menguji apakah perbaikan Enter 4x untuk navigasi antar transaksi BNB berhasil

const testData = {
  name: 'Test User BNB Multi',
  address: 'Jl. Test No. 123',
  phone: '081234567890',
  job: 'Test Job',
  idNumber: '1234567890123456',
  birthPlace: 'Jakarta',
  birthDate: '1990-01-01',
  transactionType: 'BNB',
  transactions: [
    { currency: 'USD', amount: 100, rate: 15000 },
    { currency: 'EUR', amount: 50, rate: 17000 },
    { currency: 'GBP', amount: 25, rate: 19000 }
  ]
}

console.log('=== TEST NAVIGATION LOGIC FOR MULTIPLE BNB TRANSACTIONS ===')
console.log('Test Data:', JSON.stringify(testData, null, 2))

// Simulasi logic yang akan dihasilkan oleh generator
function simulateNavigationLogic(transactions, transactionType) {
  console.log('\n=== SIMULATED NAVIGATION LOGIC ===')
  
  transactions.forEach((transaction, index) => {
    const isLastTransaction = (index === transactions.length - 1)
    console.log(`\nTRANSAKSI ${index + 1}:`)
    console.log(`- Currency: ${transaction.currency}`)
    console.log(`- Amount: ${transaction.amount}`)
    console.log(`- Rate: ${transaction.rate}`)
    console.log(`- Is Last: ${isLastTransaction}`)
    
    if (transactionType === 'BNB') {
      if (isLastTransaction) {
        console.log('  NAVIGATION: Enter 2x → Down 1x → Enter 1x → 1s delay → Reset R (TRANSAKSI TERAKHIR)')
      } else {
        console.log('  NAVIGATION: Enter 4x untuk navigasi ke baris berikutnya (LANJUT KE TRANSAKSI BERIKUTNYA)')
      }
    } else {
      console.log('  NAVIGATION: Enter 3x (BNS LOGIC)')
    }
  })
}

// Test logic navigasi
simulateNavigationLogic(testData.transactions, testData.transactionType)

// Test dengan server lokal
async function testWithServer() {
  console.log('\n=== TESTING WITH LOCAL SERVER ===')
  
  try {
    // Test generate-ahk
    console.log('Testing generate-ahk endpoint...')
    const generateResponse = await fetch('http://localhost:8000/api/generate-ahk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testData)
    })
    
    if (generateResponse.ok) {
      console.log('✓ Generate AHK success')
      const blob = await generateResponse.blob()
      console.log(`  Script size: ${blob.size} bytes`)
    } else {
      console.log('✗ Generate AHK failed:', generateResponse.status)
    }
    
    // Test execute-ahk
    console.log('Testing execute-ahk endpoint...')
    const executeResponse = await fetch('http://localhost:8000/api/execute-ahk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testData)
    })
    
    if (executeResponse.ok) {
      const result = await executeResponse.json()
      console.log('✓ Execute AHK success')
      console.log(`  Message: ${result.message}`)
      console.log(`  Script path: ${result.scriptPath}`)
    } else {
      console.log('✗ Execute AHK failed:', executeResponse.status)
    }
    
  } catch (error) {
    console.log('✗ Server test failed:', error.message)
    console.log('  Make sure server is running at http://localhost:8000')
  }
}

// Export untuk penggunaan di browser atau Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { testData, simulateNavigationLogic, testWithServer }
} else if (typeof window !== 'undefined') {
  window.testNavigationLogic = { testData, simulateNavigationLogic, testWithServer }
}

console.log('\n=== INSTRUCTIONS ===')
console.log('1. Untuk test di Node.js: node test-bnb-navigation-fix.js')
console.log('2. Untuk test di browser: buka di browser dan lihat console')
console.log('3. Untuk test dengan server: pastikan server berjalan di port 8000')
