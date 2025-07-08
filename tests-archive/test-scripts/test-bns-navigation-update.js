// Test script untuk validasi AHK navigation flow BNS yang diperbarui
// Sesuai dengan instruksi: setelah input rate, Enter 3x, lalu cek kondisi transaksi

const axios = require('axios')

async function testBNSNavigationFlow() {
  console.log('=== TEST BNS NAVIGATION FLOW YANG DIPERBARUI ===\n')
  
  // Test 1: Single transaction BNS
  console.log('1. Testing single transaction BNS flow...')
  
  const singleTransactionData = {
    name: 'Test User',
    address: 'Test Address',
    phone: '08123456789',
    transactionType: 'BNS',
    currency: 'USD',
    amount: '1000',
    rate: '15750',
    pembayaranRp: '16000000'
  }
  
  try {
    const response = await axios.post('http://localhost:3000/api/generate-ahk', singleTransactionData)
    const ahkScript = response.data.ahkScript
    
    console.log('✓ Single transaction BNS script generated successfully')
    
    // Validate navigation patterns
    const patterns = [
      'Setelah input rate: Enter 3x',
      'Tidak ada transaksi lagi - lanjut ke pembayaran',
      'Tekan panah ke bawah 1x untuk navigasi ke field pembayaran',
      'Tekan Enter 1x untuk masuk ke field pembayaran',
      'Tekan Enter 3x untuk konfirmasi pembayaran',
      'Beri jeda 1 detik sebelum reset',
      'Tekan tombol r 1x untuk kembali ke menu utama'
    ]
    
    let validationResults = []
    patterns.forEach((pattern, index) => {
      const found = ahkScript.includes(pattern)
      validationResults.push({
        step: index + 1,
        pattern,
        found,
        status: found ? '✓' : '✗'
      })
    })
    
    console.log('\nValidation Results for Single Transaction:')
    validationResults.forEach(result => {
      console.log(`${result.status} Step ${result.step}: ${result.pattern}`)
    })
    
  } catch (error) {
    console.error('✗ Error testing single transaction:', error.message)
  }
  
  // Test 2: Multiple transactions BNS
  console.log('\n2. Testing multiple transactions BNS flow...')
  
  const multiTransactionData = {
    name: 'Test User Multi',
    address: 'Test Address Multi',
    phone: '08123456789',
    transactionType: 'BNS',
    transactions: [
      { currency: 'USD', amount: '1000', rate: '15750' },
      { currency: 'EUR', amount: '500', rate: '17250' },
      { currency: 'SGD', amount: '2000', rate: '11500' }
    ],
    pembayaranRp: '50000000'
  }
  
  try {
    const response = await axios.post('http://localhost:3000/api/generate-ahk', multiTransactionData)
    const ahkScript = response.data.ahkScript
    
    console.log('✓ Multiple transactions BNS script generated successfully')
    
    // Validate multi-transaction navigation patterns
    const multiPatterns = [
      'Setelah input rate: Enter 3x',
      'Masih ada transaksi lain - Enter 1x lalu ketik code currency',
      'BNS navigation: timing khusus untuk stabilitas',
      'WinActivate, Data Prosesing PT Mulia Bumi Arta',
      'Tidak ada transaksi lagi - lanjut ke pembayaran'
    ]
    
    let multiValidationResults = []
    multiPatterns.forEach((pattern, index) => {
      const found = ahkScript.includes(pattern)
      multiValidationResults.push({
        step: index + 1,
        pattern,
        found,
        status: found ? '✓' : '✗'
      })
    })
    
    console.log('\nValidation Results for Multiple Transactions:')
    multiValidationResults.forEach(result => {
      console.log(`${result.status} Step ${result.step}: ${result.pattern}`)
    })
    
    // Count transaction occurrences
    const transactionCount = (ahkScript.match(/Baris transaksi \d+:/g) || []).length
    console.log(`\n✓ Found ${transactionCount} transaction entries in script`)
    
  } catch (error) {
    console.error('✗ Error testing multiple transactions:', error.message)
  }
  
  // Test 3: Flow comparison
  console.log('\n3. Testing flow comparison...')
  
  const flowSteps = [
    'Input Rate',
    'Enter 3x after rate',
    'Check if more transactions exist',
    'If more: Enter 1x + currency code',
    'If no more: Down 1x + Enter 1x',
    'Input payment amount',
    'Enter 3x for payment confirmation',
    'Sleep 1000ms',
    'Press r to return to main menu'
  ]
  
  console.log('\nExpected BNS Navigation Flow:')
  flowSteps.forEach((step, index) => {
    console.log(`${index + 1}. ${step}`)
  })
  
  console.log('\n=== TEST COMPLETED ===')
}

// Run the test
testBNSNavigationFlow().catch(console.error)
