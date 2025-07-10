/**
 * Test Real AHK Script - Generate dan jalankan script AHK v2 untuk melihat error runtime
 */

// Mock dependencies
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
    'JPY': '3',
    'GBP': '4',
    'SGD': '5'
  }
  return map[currency] || '1'
}

// Test data yang sama dengan yang user gunakan
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

console.log('=== GENERATE SCRIPT AHK v2 UNTUK TEST RUNTIME ===')
console.log('Data yang digunakan:', JSON.stringify(testData, null, 2))

// Generate script berdasarkan route.ts yang telah diupdate
function generateRealAhkScript(data) {
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
  
  // Test mode - tampilkan pesan tanpa window detection
  ahkLines.push('; === TEST MODE - SHOW SCRIPT CONTENT ===')
  ahkLines.push('MsgBox("Script AHK v2 dimulai untuk test runtime", "Info", "T3")')
  ahkLines.push('')
  
  const transactionType = (data.transactionType || data.jenisTransaksi || '').toUpperCase()
  
  ahkLines.push(`; === DETEKSI JENIS TRANSAKSI: ${transactionType} ===`)
  
  if (transactionType === 'BNS') {
    ahkLines.push('; Jenis transaksi BNS - tekan panah kanan 1x SEBELUM memulai script')
    ahkLines.push('; Send("{Right}")  ; Comment untuk test')
    ahkLines.push('; Sleep(300)       ; Comment untuk test')
    ahkLines.push('')
  } else {
    ahkLines.push('; Jenis transaksi BNB atau default - langsung lanjut input')
    ahkLines.push('')
  }
  
  ahkLines.push('; Send("{Enter}")   ; Comment untuk test')
  ahkLines.push('; Sleep(200)        ; Comment untuk test')
  ahkLines.push('; Send("{Enter}")   ; Comment untuk test')
  ahkLines.push('; Sleep(200)        ; Comment untuk test')
  ahkLines.push('')
  
  // Data Diri - menggunakan Map untuk AHK v2
  ahkLines.push('data := Map()')
  ahkLines.push(`data["Nama Lengkap"] := "${escapeAhkString(data.name || '')}"`)
  ahkLines.push(`data["Alamat"] := "${escapeAhkString(truncatedAddress)}"`)
  ahkLines.push(`data["Nomor Telepon"] := "${escapeAhkString(data.phone || '')}"`)
  ahkLines.push(`data["Pekerjaan"] := "${escapeAhkString(data.job || '')}"`)
  ahkLines.push(`data["Nomor Identitas"] := "${escapeAhkString(data.idNumber || '')}"`)
  ahkLines.push(`data["Tempat Tanggal Lahir"] := "${escapeAhkString(data.birthPlace || '')}${escapeAhkString(formattedBirthDate)}"`)
  ahkLines.push('')
  
  // Input data step by step menggunakan loop AHK v2
  ahkLines.push('keys := ["Nama Lengkap", "Alamat", "Nomor Telepon", "Pekerjaan", "Nomor Identitas", "Tempat Tanggal Lahir"]')
  ahkLines.push('for index, key in keys')
  ahkLines.push('{')
  ahkLines.push('    ; TypeString(data[key])  ; Comment untuk test')
  ahkLines.push('    ; Sleep(50)              ; Comment untuk test')
  ahkLines.push('    if (index < keys.Length)')
  ahkLines.push('    {')
  ahkLines.push('        ; Send("{Tab}")      ; Comment untuk test')
  ahkLines.push('        ; Sleep(100)         ; Comment untuk test')
  ahkLines.push('    }')
  ahkLines.push('}')
  ahkLines.push('')

  // Test tampilkan data
  ahkLines.push('MsgBox("Data berhasil diproses:`n" . data["Nama Lengkap"] . "`n" . data["Alamat"], "Data Test", "T5")')
  ahkLines.push('')

  // Tambahkan transaksi
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
    ahkLines.push(`; Total transaksi yang akan diproses: ${transactions.length}`)
    ahkLines.push('')
    
    transactions.forEach((transaction, index) => {
      const isLastTransaction = (index === transactions.length - 1)
      const currency = (transaction.currency || '').toUpperCase().trim()
      let currencyCode = getMainCurrencyCode(currency) || '1'
      
      ahkLines.push(`; === ISI DATA TRANSAKSI ${index + 1} ===`)
      ahkLines.push(`; Debug: Currency input = "${currency}", Code = ${currencyCode}`)
      ahkLines.push(`; Send("${currencyCode}")     ; Comment untuk test`)
      ahkLines.push(`; TypeString("${String(transaction.amount || '')}")  ; Comment untuk test`)
      ahkLines.push(`; TypeString("${String(transaction.rate || '')}")    ; Comment untuk test`)
      
      if (transactionType === 'BNB' && isLastTransaction) {
        ahkLines.push('; BNB transaksi terakhir logic')
        ahkLines.push('MsgBox("BNB Transaksi terakhir - akan reset", "Info", "T3")')
      } else if (transactionType === 'BNS') {
        ahkLines.push('; BNS logic dengan pembayaran')
        
        let pembayaranValue = ''
        if (data.pembayaranRp || data.totalAmount) {
          pembayaranValue = String(data.pembayaranRp || data.totalAmount)
        } else {
          const amount = parseFloat(transaction.amount) || 0
          const rate = parseFloat(transaction.rate) || 0
          pembayaranValue = String(amount * rate)
        }
        
        ahkLines.push(`; Pembayaran: ${pembayaranValue}`)
        ahkLines.push(`MsgBox("BNS - Pembayaran: ${pembayaranValue}", "Info", "T3")`)
      }
    })
  }
  
  ahkLines.push('')
  ahkLines.push('; === SCRIPT SELESAI ===')
  ahkLines.push('MsgBox("✅ Script AHK v2 berhasil dijalankan tanpa error!", "Success", "T5")')
  ahkLines.push('; Sleep(500)')
  ahkLines.push('; FileDelete(A_ScriptFullPath)  ; Comment untuk test')
  ahkLines.push('ExitApp()')

  return ahkLines.join('\n')
}

// Generate script
const ahkScript = generateRealAhkScript(testData)

console.log('\n=== SCRIPT AHK v2 YANG AKAN DITEST ===')
console.log(ahkScript)

// Simpan script untuk testing
const fs = require('fs')
const testScriptPath = './test-runtime-error.ahk'
fs.writeFileSync(testScriptPath, ahkScript)

console.log(`\n📁 Script disimpan di: ${testScriptPath}`)
console.log('🔧 Untuk test runtime error:')
console.log('   1. Buka AutoHotkey v2')
console.log('   2. Jalankan script ini')
console.log('   3. Lihat apakah ada error line tertentu')
console.log('')
console.log('💡 Script ini dibuat dengan comment pada Send/TypeString untuk testing aman')
console.log('   Jika masih error, kemungkinan ada syntax issue di generator')
