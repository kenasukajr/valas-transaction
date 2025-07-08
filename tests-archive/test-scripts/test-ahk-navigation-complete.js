// Test script AHK dengan navigasi khusus setelah transaksi ke-7
const fs = require('fs')
const path = require('path')

// Simulasi data dengan 10 transaksi
const testDataMultiple = {
  name: 'Test Nasabah Multi',
  address: 'Jl. Test Multi No. 1',
  phone: '081234567890',
  job: 'Tester',
  idNumber: '1234567890123456',
  birthPlace: 'Test City',
  birthDate: '1990-01-01',
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

console.log('=== TEST SCRIPT AHK DENGAN NAVIGASI KHUSUS ===')
console.log(`Total transaksi: ${testDataMultiple.transactions.length}`)
console.log('Transaksi 1-7: Navigasi normal (Enter 2x)')
console.log('Transaksi 8-10: Navigasi khusus (Enter 2x + Panah Atas + Enter)')
console.log('')

// Simulasi request ke API
async function testGenerateAhkScript() {
  try {
    const response = await fetch('http://localhost:3000/api/generate-ahk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testDataMultiple)
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const ahkScript = await response.text()
    
    // Simpan script untuk analisis
    const outputFile = 'test-output-multiple-navigasi.ahk'
    fs.writeFileSync(outputFile, ahkScript)
    
    console.log(`✅ Script AHK berhasil dibuat: ${outputFile}`)
    console.log('')
    
    // Analisis navigasi dalam script
    const lines = ahkScript.split('\n')
    let normalNavigation = 0
    let specialNavigation = 0
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      
      // Cek navigasi normal
      if (line.includes('=== NAVIGASI KE BARIS TRANSAKSI') && line.includes('(NORMAL)')) {
        normalNavigation++
        console.log(`🔵 ${line.trim()}`)
      }
      
      // Cek navigasi khusus
      if (line.includes('=== NAVIGASI KE BARIS TRANSAKSI') && line.includes('(SETELAH BARIS 7)')) {
        specialNavigation++
        console.log(`🔴 ${line.trim()}`)
      }
    }
    
    console.log('')
    console.log('=== RINGKASAN NAVIGASI ===')
    console.log(`Navigasi normal (1-7): ${normalNavigation}`)
    console.log(`Navigasi khusus (8+): ${specialNavigation}`)
    console.log(`Total navigasi: ${normalNavigation + specialNavigation}`)
    console.log(`Diharapkan: ${testDataMultiple.transactions.length - 1}`)
    
    // Validasi
    const expectedTotal = testDataMultiple.transactions.length - 1
    const actualTotal = normalNavigation + specialNavigation
    
    if (actualTotal === expectedTotal) {
      console.log('✅ Jumlah navigasi sesuai!')
    } else {
      console.log('❌ Jumlah navigasi tidak sesuai!')
    }
    
    if (normalNavigation === 6 && specialNavigation === 3) {
      console.log('✅ Pembagian navigasi normal/khusus sesuai!')
    } else {
      console.log('❌ Pembagian navigasi normal/khusus tidak sesuai!')
    }
    
    // Cek apakah ada panah atas dalam navigasi khusus
    const hasUpArrow = ahkScript.includes('Send, {Up}')
    console.log(`Panah atas ditemukan: ${hasUpArrow ? '✅' : '❌'}`)
    
  } catch (error) {
    console.error('Error:', error.message)
    console.log('⚠️ Server mungkin belum berjalan, coba jalankan: npm run dev')
  }
}

// Jalankan test
testGenerateAhkScript()
