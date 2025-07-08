// Test langsung function generateAhkScript untuk validasi navigasi
const fs = require('fs')
const path = require('path')

// Simulasi daftarValas (dari valasData.ts)
const daftarValas = [
  { kode: "USD", no: 1, alias: "DOLLAR" },
  { kode: "EUR", no: 4, alias: "EURO" },
  { kode: "GBP", no: 5, alias: "POUND" },
  { kode: "AUD", no: 2, alias: "AUSTRALIAN" },
  { kode: "CAD", no: 3, alias: "CANADIAN" },
  { kode: "CHF", no: 6, alias: "SWISS" },
  { kode: "JPY", no: 9, alias: "YEN" },
  { kode: "SGD", no: 8, alias: "SINGAPORE" },
  { kode: "HKD", no: 7, alias: "HONGKONG" },
  { kode: "NZD", no: 10, alias: "NEWZEALAND" }
];

// Simulasi function generateAhkScript (excerpt dari route.ts)
function generateAhkScript(data) {
  const ahkLines = []
  
  // Simulasi data diri (disingkat)
  ahkLines.push('; === DATA DIRI ===')
  ahkLines.push(`; Nama: ${data.name}`)
  ahkLines.push('')
  
  // Helper function untuk mengisi satu baris transaksi
  const fillTransactionRow = (transactionData, rowNumber) => {
    const currency = (transactionData.currency || '').toUpperCase().trim()
    
    // Konversi currency ke code number
    let currencyCode = '1' // default USD
    const valasItem = daftarValas.find(item => 
      item.kode.toUpperCase() === currency || 
      (item.alias && item.alias.toUpperCase() === currency)
    )
    
    if (valasItem) {
      currencyCode = valasItem.no < 0 ? '1' : valasItem.no.toString()
    }
    
    ahkLines.push(`; === ISI DATA TRANSAKSI ${rowNumber} ===`)
    ahkLines.push(`; Currency: ${currency}, Code: ${currencyCode}`)
    ahkLines.push(`Send, ${currencyCode}`)
    ahkLines.push('Send, {Enter}')
    ahkLines.push('Send, {Enter}')
    ahkLines.push(`TypeString("${transactionData.amount}")`)
    ahkLines.push('Send, {Enter}')
    ahkLines.push(`TypeString("${transactionData.rate}")`)
    ahkLines.push('Send, {Enter}')
    ahkLines.push('')
  }

  // Proses transaksi
  const transactions = data.transactions || []
  
  if (transactions.length > 0) {
    ahkLines.push('; === NAVIGASI KE BAGIAN TRANSAKSI ===')
    ahkLines.push(`; Total transaksi: ${transactions.length}`)
    ahkLines.push('')
    
    // Proses setiap transaksi
    transactions.forEach((transaction, index) => {
      fillTransactionRow(transaction, index + 1)
      
      // Jika bukan transaksi terakhir, navigasi ke baris berikutnya
      if (index < transactions.length - 1) {
        const nextTransactionNumber = index + 2
        
        // Navigasi berbeda untuk transaksi setelah baris ke-7
        if (nextTransactionNumber > 7) {
          ahkLines.push(`; === NAVIGASI KE BARIS TRANSAKSI ${nextTransactionNumber} (SETELAH BARIS 7) ===`)
          ahkLines.push('; Setelah transaksi ke-7, navigasi berbeda: Enter 2x + Panah Atas 1x + Enter')
          ahkLines.push('Send, {Enter}')
          ahkLines.push('Sleep, 200')
          ahkLines.push('Send, {Enter}')
          ahkLines.push('Sleep, 200')
          ahkLines.push('; Tekan panah atas 1x untuk navigasi khusus setelah baris 7')
          ahkLines.push('Send, {Up}')
          ahkLines.push('Sleep, 200')
          ahkLines.push('Send, {Enter}')
          ahkLines.push('Sleep, 200')
          ahkLines.push('')
        } else {
          ahkLines.push(`; === NAVIGASI KE BARIS TRANSAKSI ${nextTransactionNumber} (NORMAL) ===`)
          ahkLines.push('; Enter 2x untuk navigasi ke baris transaksi berikutnya')
          ahkLines.push('Send, {Enter}')
          ahkLines.push('Sleep, 200')
          ahkLines.push('Send, {Enter}')
          ahkLines.push('Sleep, 200')
          ahkLines.push('')
        }
      }
    })
  }
  
  return ahkLines.join('\n')
}

// Test data dengan 10 transaksi
const testData = {
  name: 'Test Nasabah Navigation',
  transactions: [
    { currency: 'USD', amount: 1000, rate: 15000 },
    { currency: 'EUR', amount: 2000, rate: 17000 },
    { currency: 'GBP', amount: 3000, rate: 19000 },
    { currency: 'AUD', amount: 4000, rate: 11000 },
    { currency: 'CAD', amount: 5000, rate: 12000 },
    { currency: 'CHF', amount: 6000, rate: 16000 },
    { currency: 'JPY', amount: 7000, rate: 110 },   // Transaksi ke-7 (terakhir normal)
    { currency: 'SGD', amount: 8000, rate: 11500 }, // Transaksi ke-8 (pertama khusus)
    { currency: 'HKD', amount: 9000, rate: 1900 },  // Transaksi ke-9 (khusus)
    { currency: 'NZD', amount: 10000, rate: 10000 } // Transaksi ke-10 (khusus)
  ]
}

console.log('=== TEST NAVIGASI AHK SCRIPT ===')
console.log(`Total transaksi: ${testData.transactions.length}`)
console.log('')

// Generate script
const ahkScript = generateAhkScript(testData)

// Simpan hasil
const outputFile = 'test-output-navigation-validation.ahk'
fs.writeFileSync(outputFile, ahkScript)
console.log(`✅ Script AHK disimpan: ${outputFile}`)
console.log('')

// Analisis navigasi
const lines = ahkScript.split('\n')
let normalNavigation = 0
let specialNavigation = 0
let navigationDetails = []

for (let i = 0; i < lines.length; i++) {
  const line = lines[i]
  
  // Cek navigasi normal
  if (line.includes('=== NAVIGASI KE BARIS TRANSAKSI') && line.includes('(NORMAL)')) {
    normalNavigation++
    const transactionNumber = line.match(/TRANSAKSI (\d+)/)[1]
    navigationDetails.push(`Transaksi ${parseInt(transactionNumber) - 1} → ${transactionNumber}: NORMAL`)
  }
  
  // Cek navigasi khusus
  if (line.includes('=== NAVIGASI KE BARIS TRANSAKSI') && line.includes('(SETELAH BARIS 7)')) {
    specialNavigation++
    const transactionNumber = line.match(/TRANSAKSI (\d+)/)[1]
    navigationDetails.push(`Transaksi ${parseInt(transactionNumber) - 1} → ${transactionNumber}: KHUSUS`)
  }
}

console.log('=== DETAIL NAVIGASI ===')
navigationDetails.forEach(detail => console.log(detail))
console.log('')

console.log('=== RINGKASAN ===')
console.log(`Navigasi normal (1-7): ${normalNavigation}`)
console.log(`Navigasi khusus (8+): ${specialNavigation}`)
console.log(`Total navigasi: ${normalNavigation + specialNavigation}`)
console.log(`Diharapkan: ${testData.transactions.length - 1}`)

// Validasi
const expectedTotal = testData.transactions.length - 1
const actualTotal = normalNavigation + specialNavigation
const expectedNormal = 6  // Navigasi 1→2, 2→3, 3→4, 4→5, 5→6, 6→7, 7→8
const expectedSpecial = 3 // Navigasi 7→8, 8→9, 9→10

console.log('')
console.log('=== VALIDASI ===')
console.log(`✅ Total navigasi: ${actualTotal === expectedTotal ? 'PASS' : 'FAIL'}`)
console.log(`✅ Navigasi normal: ${normalNavigation === expectedNormal ? 'PASS' : 'FAIL'}`)
console.log(`✅ Navigasi khusus: ${specialNavigation === expectedSpecial ? 'PASS' : 'FAIL'}`)

// Cek apakah ada panah atas dalam navigasi khusus
const hasUpArrow = ahkScript.includes('Send, {Up}')
console.log(`✅ Panah atas ditemukan: ${hasUpArrow ? 'PASS' : 'FAIL'}`)

console.log('')
console.log('=== KESIMPULAN ===')
if (actualTotal === expectedTotal && normalNavigation === expectedNormal && specialNavigation === expectedSpecial && hasUpArrow) {
  console.log('🎉 SEMUA TEST PASSED! Navigasi khusus setelah baris 7 sudah benar.')
} else {
  console.log('❌ Ada test yang gagal, perlu perbaikan.')
}
