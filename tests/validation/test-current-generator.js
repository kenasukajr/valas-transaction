/**
 * Test Generator AHK v2 Current - Cek output generator route.ts saat ini
 */

console.log('=== TEST GENERATOR ROUTE.TS SAAT INI ===')

// Mock data yang sama dengan user
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

// Mock dependencies dari route.ts
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

function getMainCurrencyCode(currency) {
  const map = {
    'USD': '1',
    'EUR': '2', 
    'JPY': '3'
  }
  return map[currency] || '1'
}

// Generate script dengan logic yang sama persis dari route.ts
function generateCurrentScript(data) {
  const formattedBirthDate = data.birthDate ? ` ${new Date(data.birthDate).getDate().toString().padStart(2, '0')}/${(new Date(data.birthDate).getMonth() + 1).toString().padStart(2, '0')}/${new Date(data.birthDate).getFullYear()}` : ''
  const truncatedAddress = (data.address || '').length > 70 ? (data.address || '').substring(0, 70) : (data.address || '')

  const ahkLines = []
  
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
  
  const transactionType = (data.transactionType || data.jenisTransaksi || '').toUpperCase()
  
  ahkLines.push(`; === DETEKSI JENIS TRANSAKSI: ${transactionType} ===`)
  
  if (transactionType === 'BNS') {
    ahkLines.push('; Jenis transaksi BNS - tekan panah kanan 1x SEBELUM memulai script')
    ahkLines.push('Send("{Right}")')
    ahkLines.push('Sleep(300)')
    ahkLines.push('')
  } else {
    ahkLines.push('; Jenis transaksi BNB atau default - langsung lanjut input')
    ahkLines.push('')
  }
  
  ahkLines.push('Send("{Enter}")')
  ahkLines.push('Sleep(200)')
  ahkLines.push('Send("{Enter}")')
  ahkLines.push('Sleep(200)')
  ahkLines.push('')
  
  // Data Diri - AHK v2 Map
  ahkLines.push('data := Map()')
  ahkLines.push(`data["Nama Lengkap"] := "${escapeAhkString(data.name || '')}"`)
  ahkLines.push(`data["Alamat"] := "${escapeAhkString(truncatedAddress)}"`)
  ahkLines.push(`data["Nomor Telepon"] := "${escapeAhkString(data.phone || '')}"`)
  ahkLines.push(`data["Pekerjaan"] := "${escapeAhkString(data.job || '')}"`)
  ahkLines.push(`data["Nomor Identitas"] := "${escapeAhkString(data.idNumber || '')}"`)
  ahkLines.push(`data["Tempat Tanggal Lahir"] := "${escapeAhkString(data.birthPlace || '')}${escapeAhkString(formattedBirthDate)}"`)
  ahkLines.push('')
  
  // Loop AHK v2
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

  // Transaksi
  const transactions = []
  if (data.currency && data.amount && data.rate) {
    transactions.push({
      currency: data.currency,
      amount: data.amount,
      rate: data.rate,
      transactionType: transactionType
    })
  }
  
  if (transactions.length > 0) {
    ahkLines.push('; === NAVIGASI KE BAGIAN TRANSAKSI ===')
    ahkLines.push('Sleep(200)')
    ahkLines.push('WinActivate("Data Prosesing PT Mulia Bumi Arta")')
    ahkLines.push('Sleep(100)')
    ahkLines.push('')
    
    if (transactionType === 'BNB') {
      ahkLines.push('Send("{Enter}")')
      ahkLines.push('Sleep(100)')
      ahkLines.push('Send("{Enter}")')
      ahkLines.push('Sleep(100)')
    } else {
      ahkLines.push('Send("{Enter}")')
      ahkLines.push('Sleep(200)')
      ahkLines.push('Send("{Enter}")')
      ahkLines.push('Sleep(200)')
    }
    
    transactions.forEach((transaction, index) => {
      const isLastTransaction = (index === transactions.length - 1)
      const currency = (transaction.currency || '').toUpperCase().trim()
      let currencyCode = getMainCurrencyCode(currency) || '1'
      
      ahkLines.push(`; === ISI DATA TRANSAKSI ${index + 1} ===`)
      ahkLines.push(`Send("${currencyCode}")`)
      
      if (transactionType === 'BNB') {
        ahkLines.push('Sleep(100)')
        ahkLines.push('Send("{Enter}")')
        ahkLines.push('Sleep(100)')
        ahkLines.push('Send("{Enter}")')
        ahkLines.push('Sleep(100)')
      } else {
        ahkLines.push('Sleep(200)')
        ahkLines.push('Send("{Enter}")')
        ahkLines.push('Sleep(200)')
        ahkLines.push('Send("{Enter}")')
        ahkLines.push('Sleep(200)')
      }
      
      ahkLines.push(`TypeString("${String(transaction.amount || '')}")`)
      ahkLines.push('Sleep(100)')
      
      if (transactionType === 'BNB') {
        ahkLines.push('Send("{Enter}")')
        ahkLines.push('Sleep(100)')
      } else {
        ahkLines.push('Send("{Enter}")')
        ahkLines.push('Sleep(200)')
      }
      
      ahkLines.push(`TypeString("${String(transaction.rate || '')}")`)
      ahkLines.push('Sleep(100)')
      
      if (transactionType === 'BNB') {
        if (isLastTransaction) {
          ahkLines.push('Send("{Enter}")')
          ahkLines.push('Sleep(200)')
          ahkLines.push('Send("{Enter}")')
          ahkLines.push('Sleep(200)')
          ahkLines.push('Send("{Down}")')
          ahkLines.push('Sleep(300)')
          ahkLines.push('Send("{Enter}")')
          ahkLines.push('Sleep(300)')
          ahkLines.push('Sleep(1000)')
          ahkLines.push('Send("r")')
          ahkLines.push('Sleep(500)')
        } else {
          ahkLines.push('Send("{Enter}")')
          ahkLines.push('Sleep(100)')
          ahkLines.push('Send("{Enter}")')
          ahkLines.push('Sleep(100)')
          ahkLines.push('Send("{Enter}")')
          ahkLines.push('Sleep(200)')
        }
      } else {
        ahkLines.push('Send("{Enter}")')
        ahkLines.push('Sleep(100)')
        ahkLines.push('Send("{Enter}")')
        ahkLines.push('Sleep(100)')
        ahkLines.push('Send("{Enter}")')
        ahkLines.push('Sleep(200)')
      }
    })
  }
  
  if (transactionType === 'BNS' && transactions.length > 0) {
    ahkLines.push('; === SELESAI TRANSAKSI BNS ===')
    ahkLines.push('Send("{Down}")')
    ahkLines.push('Sleep(500)')
    ahkLines.push('Send("{Enter}")')
    ahkLines.push('Sleep(500)')
    
    let pembayaranValue = ''
    if (data.pembayaranRp || data.totalAmount) {
      pembayaranValue = String(data.pembayaranRp || data.totalAmount)
    } else if (transactions.length > 0) {
      const totalPembayaran = transactions.reduce((sum, transaction) => {
        const amount = parseFloat(transaction.amount) || 0
        const rate = parseFloat(transaction.rate) || 0
        return sum + (amount * rate)
      }, 0)
      pembayaranValue = String(totalPembayaran)
    }
    
    if (pembayaranValue) {
      ahkLines.push(`TypeString("${pembayaranValue}")`)
      ahkLines.push('Sleep(300)')
    }
    
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
  
  ahkLines.push('')
  ahkLines.push('; === SCRIPT SELESAI ===')
  ahkLines.push('Sleep(500)')
  ahkLines.push('FileDelete(A_ScriptFullPath)')
  ahkLines.push('ExitApp()')

  return ahkLines.join('\n')
}

// Generate dan analisis
const currentScript = generateCurrentScript(testData)

console.log('\n=== SCRIPT GENERATOR SAAT INI ===')
console.log(currentScript)

// Cek line 1 specifically
const lines = currentScript.split('\n')
console.log('\n=== ANALISIS LINE 1 ===')
console.log('Line 1:', lines[0])
console.log('Length:', lines[0].length)
console.log('Contains function syntax:', /^TypeString\(.*\)\s*\{/.test(lines[0]))

// Cek all lines untuk syntax issues
console.log('\n=== CEK SEMUA LINES ===')
const issues = []
lines.forEach((line, index) => {
  const lineNum = index + 1
  
  // Common AHK v2 syntax issues
  if (line.includes('Send,') || line.includes('Sleep,')) {
    issues.push(`Line ${lineNum}: AHK v1 comma syntax: ${line.trim()}`)
  }
  
  if (line.includes('Gosub')) {
    issues.push(`Line ${lineNum}: AHK v1 Gosub: ${line.trim()}`)
  }
  
  if (line.match(/^\w+:\s*$/) && !line.includes(';')) {
    issues.push(`Line ${lineNum}: AHK v1 label: ${line.trim()}`)
  }
  
  if (line.includes('MaxIndex()')) {
    issues.push(`Line ${lineNum}: AHK v1 MaxIndex(): ${line.trim()}`)
  }
  
  if (line.includes('data := {}')) {
    issues.push(`Line ${lineNum}: AHK v1 object syntax: ${line.trim()}`)
  }
  
  // Check for potential encoding/character issues
  if (line.includes('\u0000') || line.includes('\uFEFF')) {
    issues.push(`Line ${lineNum}: Hidden character/encoding issue: ${line.trim()}`)
  }
})

if (issues.length > 0) {
  console.log('❌ ISSUES DITEMUKAN:')
  issues.forEach(issue => console.log('  ', issue))
} else {
  console.log('✅ Tidak ada syntax issues yang terdeteksi')
}

// Kemungkinan masalah lain
console.log('\n=== KEMUNGKINAN MASALAH LINE 1 ===')
console.log('1. 🔤 Hidden character/BOM di awal file')
console.log('2. 📝 Encoding issue (UTF-8 vs ANSI)')
console.log('3. 🔧 AHK v2 installation issue')
console.log('4. 📂 File extension tidak dikenali sebagai AHK v2')
console.log('5. 🎯 Context/environment issue')

// Simpan untuk testing
const fs = require('fs')
const testPath = './test-current-generator.ahk'
fs.writeFileSync(testPath, currentScript)

console.log(`\n📁 Script disimpan di: ${testPath}`)
console.log('🔧 Test langsung di AutoHotkey v2 untuk konfirmasi error line 1')

// Generate script with BOM removed dan clean
const cleanScript = currentScript.replace(/^\uFEFF/, '')
const cleanPath = './test-clean-generator.ahk'
fs.writeFileSync(cleanPath, cleanScript, 'utf8')

console.log(`📁 Clean script disimpan di: ${cleanPath}`)
console.log('💡 Try menggunakan clean script jika ada encoding issue')
