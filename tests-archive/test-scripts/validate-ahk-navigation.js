// Simple validation script untuk memeriksa generate-ahk API
// Memvalidasi apakah navigation flow sudah sesuai instruksi

const fs = require('fs')
const path = require('path')

function validateAHKGeneratorCode() {
  console.log('=== VALIDASI AHK GENERATOR CODE ===\n')
  
  // Read the API file
  const apiPath = path.join(__dirname, '..', '..', 'src', 'app', 'api', 'generate-ahk', 'route.ts')
  
  if (!fs.existsSync(apiPath)) {
    console.error('❌ API file not found:', apiPath)
    return
  }
  
  const apiContent = fs.readFileSync(apiPath, 'utf8')
  
  // Check for updated navigation patterns
  const expectedPatterns = [
    'Setelah input rate: Enter 3x',
    'Masih ada transaksi lain - Enter 1x lalu ketik code currency',
    'Tidak ada transaksi lagi - lanjut ke pembayaran',
    'Tekan panah ke bawah 1x untuk navigasi ke field pembayaran',
    'Tekan Enter 1x untuk masuk ke field pembayaran',
    'Tekan Enter 3x untuk konfirmasi pembayaran',
    'Beri jeda 1 detik sebelum reset',
    'Tekan tombol r 1x untuk kembali ke menu utama'
  ]
  
  console.log('Checking for expected navigation patterns...\n')
  
  expectedPatterns.forEach((pattern, index) => {
    const found = apiContent.includes(pattern)
    const status = found ? '✅' : '❌'
    console.log(`${status} Pattern ${index + 1}: "${pattern}"`)
  })
  
  console.log('\n=== DETAILED ANALYSIS ===\n')
  
  // Check specific code sections
  const codeChecks = [
    {
      name: 'Enter 3x after rate input',
      pattern: /Send, \{Enter\}[\s\S]*?Send, \{Enter\}[\s\S]*?Send, \{Enter\}/,
      context: 'After rate input'
    },
    {
      name: 'Single Enter for next transaction',
      pattern: /Masih ada transaksi lain[\s\S]*?Send, \{Enter\}[\s\S]*?Sleep, 500/,
      context: 'Navigation between transactions'
    },
    {
      name: 'Down arrow for payment field',
      pattern: /Send, \{Down\}[\s\S]*?Sleep, 500/,
      context: 'Navigation to payment field'
    },
    {
      name: 'Enter 3x for payment confirmation',
      pattern: /konfirmasi pembayaran[\s\S]*?Send, \{Enter\}[\s\S]*?Send, \{Enter\}[\s\S]*?Send, \{Enter\}/,
      context: 'Payment confirmation'
    },
    {
      name: '1 second delay before reset',
      pattern: /Sleep, 1000[\s\S]*?Send, r/,
      context: 'Reset timing'
    }
  ]
  
  codeChecks.forEach(check => {
    const found = check.pattern.test(apiContent)
    const status = found ? '✅' : '❌'
    console.log(`${status} Code check: ${check.name}`)
    console.log(`   Context: ${check.context}`)
  })
  
  console.log('\n=== SUMMARY ===')
  
  const totalPatterns = expectedPatterns.length
  const foundPatterns = expectedPatterns.filter(pattern => apiContent.includes(pattern)).length
  const totalCodeChecks = codeChecks.length
  const foundCodeChecks = codeChecks.filter(check => check.pattern.test(apiContent)).length
  
  console.log(`Navigation patterns: ${foundPatterns}/${totalPatterns} found`)
  console.log(`Code implementations: ${foundCodeChecks}/${totalCodeChecks} found`)
  
  if (foundPatterns === totalPatterns && foundCodeChecks === totalCodeChecks) {
    console.log('✅ ALL CHECKS PASSED - AHK navigation flow updated correctly!')
  } else {
    console.log('❌ Some checks failed - review the implementation')
  }
}

// Run the validation
validateAHKGeneratorCode()
