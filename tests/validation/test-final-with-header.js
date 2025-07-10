/**
 * Test Final Generator dengan Header AHK v2
 */

console.log('=== TEST GENERATOR DENGAN HEADER AHK v2 ===')

// Mock data
const testData = {
  transactionType: 'BNS',
  name: 'PUJI PURNAWAN',
  address: 'VILLA BANGUNTAPAN 2 NO E5 SAMPANGAN WIROKERTEN BANGUNTAPAN BANTUL YOGY',
  phone: '085878813372',
  job: 'SWASTA',
  idNumber: '3401121406910001',
  birthPlace: 'MAGELANG',
  birthDate: '1991-06-14',
  currency: 'USD',
  amount: '1000',
  rate: '15750',
  pembayaranRp: '16000000'
}

// Mock escape function
function escapeAhkString(str) {
  if (!str) return ''
  return str
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '""')
    .replace(/`/g, '``')
    .replace(/\r?\n/g, ' ')
    .replace(/\t/g, ' ')
    .trim()
}

// Mock currency code
function getMainCurrencyCode(currency) {
  return currency === 'USD' ? '1' : '1'
}

// Generate script dengan header v2
function generateWithHeader(data) {
  const formattedBirthDate = data.birthDate ? ` ${new Date(data.birthDate).getDate().toString().padStart(2, '0')}/${(new Date(data.birthDate).getMonth() + 1).toString().padStart(2, '0')}/${new Date(data.birthDate).getFullYear()}` : ''
  const truncatedAddress = (data.address || '').length > 70 ? (data.address || '').substring(0, 70) : (data.address || '')

  const ahkLines = []
  
  // === HEADER AHK v2 ===
  ahkLines.push('#Requires AutoHotkey v2.0')
  ahkLines.push('#SingleInstance Force')
  ahkLines.push('')
  
  // === FUNGSI TYPESTRING (AHK v2) ===
  ahkLines.push('TypeString(str) {')
  ahkLines.push('    for index, char in StrSplit(str)')
  ahkLines.push('    {')
  ahkLines.push('        Send(char)')
  ahkLines.push('        Sleep(5)')
  ahkLines.push('    }')
  ahkLines.push('}')
  ahkLines.push('')
  
  ahkLines.push('if WinExist("Data Prosesing PT Mulia Bumi Arta")')
  ahkLines.push('{')
  ahkLines.push('    WinRestore("Data Prosesing PT Mulia Bumi Arta")')
  ahkLines.push('    WinActivate("Data Prosesing PT Mulia Bumi Arta")')
  ahkLines.push('    WinMaximize("Data Prosesing PT Mulia Bumi Arta")')
  ahkLines.push('}')
  ahkLines.push('else')
  ahkLines.push('{')
  ahkLines.push('    MsgBox("Window \\"Data Prosesing PT Mulia Bumi Arta\\" tidak ditemukan. Pastikan program sudah berjalan.", "Error", "T5")')
  ahkLines.push('    ExitApp()')
  ahkLines.push('}')
  ahkLines.push('')
  
  const transactionType = (data.transactionType || '').toUpperCase()
  
  ahkLines.push(`; === DETEKSI JENIS TRANSAKSI: ${transactionType} ===`)
  
  if (transactionType === 'BNS') {
    ahkLines.push('Send("{Right}")')
    ahkLines.push('Sleep(300)')
    ahkLines.push('')
  }
  
  ahkLines.push('Send("{Enter}")')
  ahkLines.push('Sleep(200)')
  ahkLines.push('Send("{Enter}")')
  ahkLines.push('Sleep(200)')
  ahkLines.push('')
  
  // Data processing
  ahkLines.push('data := Map()')
  ahkLines.push(`data["Nama Lengkap"] := "${escapeAhkString(data.name || '')}"`)
  ahkLines.push(`data["Alamat"] := "${escapeAhkString(truncatedAddress)}"`)
  ahkLines.push(`data["Nomor Telepon"] := "${escapeAhkString(data.phone || '')}"`)
  ahkLines.push(`data["Pekerjaan"] := "${escapeAhkString(data.job || '')}"`)
  ahkLines.push(`data["Nomor Identitas"] := "${escapeAhkString(data.idNumber || '')}"`)
  ahkLines.push(`data["Tempat Tanggal Lahir"] := "${escapeAhkString(data.birthPlace || '')}${escapeAhkString(formattedBirthDate)}"`)
  ahkLines.push('')
  
  ahkLines.push('keys := ["Nama Lengkap", "Alamat", "Nomor Telepon", "Pekerjaan", "Nomor Identitas", "Tempat Tanggal Lahir"]')
  ahkLines.push('for index, key in keys')
  ahkLines.push('{')
  ahkLines.push('    TypeString(data[key])')
  ahkLines.push('    Sleep(50)')
  ahkLines.push('    if (index < keys.Length)')
  ahkLines.push('    {')
  ahkLines.push('        Send("{Tab}")')
  ahkLines.push('        Sleep(100)')
  ahkLines.push('    }')
  ahkLines.push('}')
  ahkLines.push('')

  // Simplified transaction logic for test
  if (data.currency && data.amount && data.rate) {
    ahkLines.push('; === TRANSAKSI ===')
    ahkLines.push('Sleep(200)')
    ahkLines.push('Send("{Enter}")')
    ahkLines.push('Sleep(200)')
    ahkLines.push('Send("{Enter}")')
    ahkLines.push('Sleep(200)')
    ahkLines.push(`Send("${getMainCurrencyCode(data.currency)}")`)
    ahkLines.push('Sleep(200)')
    ahkLines.push('Send("{Enter}")')
    ahkLines.push('Sleep(200)')
    ahkLines.push('Send("{Enter}")')
    ahkLines.push('Sleep(200)')
    ahkLines.push(`TypeString("${data.amount}")`)
    ahkLines.push('Sleep(100)')
    ahkLines.push('Send("{Enter}")')
    ahkLines.push('Sleep(200)')
    ahkLines.push(`TypeString("${data.rate}")`)
    ahkLines.push('Sleep(100)')
    
    if (transactionType === 'BNS') {
      ahkLines.push('Send("{Enter}")')
      ahkLines.push('Sleep(100)')
      ahkLines.push('Send("{Enter}")')
      ahkLines.push('Sleep(100)')
      ahkLines.push('Send("{Enter}")')
      ahkLines.push('Sleep(200)')
      ahkLines.push('Send("{Down}")')
      ahkLines.push('Sleep(500)')
      ahkLines.push('Send("{Enter}")')
      ahkLines.push('Sleep(500)')
      ahkLines.push(`TypeString("${data.pembayaranRp || (data.amount * data.rate)}")`)
      ahkLines.push('Sleep(300)')
      ahkLines.push('Send("{Enter}")')
      ahkLines.push('Sleep(300)')
      ahkLines.push('Send("{Enter}")')
      ahkLines.push('Sleep(300)')
      ahkLines.push('Send("{Enter}")')
      ahkLines.push('Sleep(300)')
      ahkLines.push('Sleep(1000)')
      ahkLines.push('Send("r")')
      ahkLines.push('Sleep(500)')
    }
  }
  
  ahkLines.push('')
  ahkLines.push('; === SCRIPT SELESAI ===')
  ahkLines.push('Sleep(500)')
  ahkLines.push('FileDelete(A_ScriptFullPath)')
  ahkLines.push('ExitApp()')

  return ahkLines.join('\n')
}

const finalScript = generateWithHeader(testData)

console.log('\n=== SCRIPT DENGAN HEADER AHK v2 ===')
console.log(finalScript)

// Simpan untuk testing
const fs = require('fs')
const finalPath = './FINAL-GENERATOR-WITH-HEADER.ahk'
fs.writeFileSync(finalPath, finalScript)

console.log(`\n📁 Final script disimpan di: ${finalPath}`)

console.log('\n=== SUMMARY PERBAIKAN ===')
console.log('✅ 1. Tambah header #Requires AutoHotkey v2.0')
console.log('✅ 2. Tambah #SingleInstance Force')
console.log('✅ 3. Pastikan semua syntax AHK v2')
console.log('✅ 4. Generator di route.ts sudah diupdate')
console.log('')
console.log('🎯 NEXT STEPS:')
console.log('1. Test file FINAL-GENERATOR-WITH-HEADER.ahk')
console.log('2. Jika masih error, test file test-v2-option1.ahk, option2, option3')
console.log('3. Jika semua error, pastikan AutoHotkey v2 terinstall dengan benar')
console.log('')
console.log('💡 HEADER #Requires AutoHotkey v2.0 akan memaksa script menggunakan v2')
console.log('   Jika AHK v2 tidak terinstall, akan muncul error yang jelas')
