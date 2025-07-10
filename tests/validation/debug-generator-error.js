/**
 * Debug Generator Output - Analisis error line by line
 * Generate script seperti di route.ts dan analisis setiap baris untuk kemungkinan error
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
    'JPY': '3'
  }
  return map[currency] || '1'
}

// Data yang user gunakan (dari test-routeold-compatibility.js)
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

// Generate script dari route.ts dengan line numbers untuk debug
function generateDebugScript(data) {
  const formattedBirthDate = data.birthDate ? ` ${new Date(data.birthDate).getDate().toString().padStart(2, '0')}/${(new Date(data.birthDate).getMonth() + 1).toString().padStart(2, '0')}/${new Date(data.birthDate).getFullYear()}` : ''
  const truncatedAddress = (data.address || '').length > 70 ? (data.address || '').substring(0, 70) : (data.address || '')

  const ahkLines = []
  let lineNumber = 1
  
  // Fungsi helper untuk menambah line dengan nomor
  const addLine = (line) => {
    ahkLines.push(`; Line ${lineNumber}: ${line}`)
    ahkLines.push(line)
    lineNumber++
  }
  
  addLine('TypeString(str) {')
  addLine('    for index, char in StrSplit(str)')
  addLine('    {')
  addLine('        Send(char)')
  addLine('        Sleep(5)')
  addLine('    }')
  addLine('}')
  addLine('')
  
  addLine('if WinExist("Data Prosesing PT Mulia Bumi Arta")')
  addLine('{')
  addLine('    WinRestore("Data Prosesing PT Mulia Bumi Arta")')
  addLine('    WinActivate("Data Prosesing PT Mulia Bumi Arta")')
  addLine('    WinMaximize("Data Prosesing PT Mulia Bumi Arta")')
  addLine('}')
  addLine('else')
  addLine('{')
  addLine('    MsgBox("Window \\"Data Prosesing PT Mulia Bumi Arta\\" tidak ditemukan. Pastikan program sudah berjalan.", "Error", "T5")')
  addLine('    ExitApp()')
  addLine('}')
  addLine('')
  
  const transactionType = (data.transactionType || '').toUpperCase()
  
  addLine(`; === DETEKSI JENIS TRANSAKSI: ${transactionType} ===`)
  
  if (transactionType === 'BNS') {
    addLine('; Jenis transaksi BNS - tekan panah kanan 1x SEBELUM memulai script')
    addLine('Send("{Right}")')
    addLine('Sleep(300)')
    addLine('')
  } else {
    addLine('; Jenis transaksi BNB atau default - langsung lanjut input')
    addLine('')
  }
  
  addLine('Send("{Enter}")')
  addLine('Sleep(200)')
  addLine('Send("{Enter}")')
  addLine('Sleep(200)')
  addLine('')
  
  addLine('data := Map()')
  addLine(`data["Nama Lengkap"] := "${escapeAhkString(data.name || '')}"`)
  addLine(`data["Alamat"] := "${escapeAhkString(truncatedAddress)}"`)
  addLine(`data["Nomor Telepon"] := "${escapeAhkString(data.phone || '')}"`)
  addLine(`data["Pekerjaan"] := "${escapeAhkString(data.job || '')}"`)
  addLine(`data["Nomor Identitas"] := "${escapeAhkString(data.idNumber || '')}"`)
  addLine(`data["Tempat Tanggal Lahir"] := "${escapeAhkString(data.birthPlace || '')}${escapeAhkString(formattedBirthDate)}"`)
  addLine('')
  
  addLine('keys := ["Nama Lengkap", "Alamat", "Nomor Telepon", "Pekerjaan", "Nomor Identitas", "Tempat Tanggal Lahir"]')
  addLine('for index, key in keys')
  addLine('{')
  addLine('    TypeString(data[key])')
  addLine('    Sleep(50)')
  addLine('    if (index < keys.Length)')
  addLine('    {')
  addLine('        Send("{Tab}")')
  addLine('        Sleep(100)')
  addLine('    }')
  addLine('}')
  addLine('')

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
    addLine('; === NAVIGASI KE BAGIAN TRANSAKSI ===')
    addLine('Sleep(200)')
    addLine('WinActivate("Data Prosesing PT Mulia Bumi Arta")')
    addLine('Sleep(100)')
    addLine('')
    
    if (transactionType === 'BNB') {
      addLine('Send("{Enter}")')
      addLine('Sleep(100)')
      addLine('Send("{Enter}")')
      addLine('Sleep(100)')
    } else {
      addLine('Send("{Enter}")')
      addLine('Sleep(200)')
      addLine('Send("{Enter}")')
      addLine('Sleep(200)')
    }
    
    transactions.forEach((transaction, index) => {
      const isLastTransaction = (index === transactions.length - 1)
      const currency = (transaction.currency || '').toUpperCase().trim()
      let currencyCode = getMainCurrencyCode(currency) || '1'
      
      addLine(`; === ISI DATA TRANSAKSI ${index + 1} ===`)
      addLine(`Send("${currencyCode}")`)
      
      if (transactionType === 'BNB') {
        addLine('Sleep(100)')
        addLine('Send("{Enter}")')
        addLine('Sleep(100)')
        addLine('Send("{Enter}")')
        addLine('Sleep(100)')
      } else {
        addLine('Sleep(200)')
        addLine('Send("{Enter}")')
        addLine('Sleep(200)')
        addLine('Send("{Enter}")')
        addLine('Sleep(200)')
      }
      
      addLine(`TypeString("${String(transaction.amount || '')}")`)
      addLine('Sleep(100)')
      
      if (transactionType === 'BNB') {
        addLine('Send("{Enter}")')
        addLine('Sleep(100)')
      } else {
        addLine('Send("{Enter}")')
        addLine('Sleep(200)')
      }
      
      addLine(`TypeString("${String(transaction.rate || '')}")`)
      addLine('Sleep(100)')
      
      if (transactionType === 'BNB') {
        if (isLastTransaction) {
          addLine('Send("{Enter}")')
          addLine('Sleep(200)')
          addLine('Send("{Enter}")')
          addLine('Sleep(200)')
          addLine('Send("{Down}")')
          addLine('Sleep(300)')
          addLine('Send("{Enter}")')
          addLine('Sleep(300)')
          addLine('Sleep(1000)')
          addLine('Send("r")')
          addLine('Sleep(500)')
        } else {
          addLine('Send("{Enter}")')
          addLine('Sleep(100)')
          addLine('Send("{Enter}")')
          addLine('Sleep(100)')
          addLine('Send("{Enter}")')
          addLine('Sleep(200)')
        }
      } else {
        addLine('Send("{Enter}")')
        addLine('Sleep(100)')
        addLine('Send("{Enter}")')
        addLine('Sleep(100)')
        addLine('Send("{Enter}")')
        addLine('Sleep(200)')
      }
    })
  }
  
  if (transactionType === 'BNS' && transactions.length > 0) {
    addLine('; === SELESAI TRANSAKSI BNS ===')
    addLine('Send("{Down}")')
    addLine('Sleep(500)')
    addLine('Send("{Enter}")')
    addLine('Sleep(500)')
    
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
      addLine(`TypeString("${pembayaranValue}")`)
      addLine('Sleep(300)')
    }
    
    addLine('Send("{Enter}")')
    addLine('Sleep(300)')
    addLine('Send("{Enter}")')
    addLine('Sleep(300)')
    addLine('Send("{Enter}")')
    addLine('Sleep(300)')
    addLine('Sleep(1000)')
    addLine('Send("r")')
    addLine('Sleep(500)')
  }
  
  addLine('')
  addLine('; === SCRIPT SELESAI ===')
  addLine('Sleep(500)')
  addLine('FileDelete(A_ScriptFullPath)')
  addLine('ExitApp()')

  return ahkLines.join('\n')
}

console.log('=== DEBUG GENERATOR OUTPUT ===')
console.log('Data input:', JSON.stringify(testData, null, 2))

const debugScript = generateDebugScript(testData)

console.log('\n=== SCRIPT DENGAN LINE NUMBERS ===')
console.log(debugScript)

// Analisis potential issues
console.log('\n=== ANALISIS POTENTIAL ISSUES ===')

const lines = debugScript.split('\n')
const issues = []

lines.forEach((line, index) => {
  const lineNum = index + 1
  
  // Check untuk syntax issues umum
  if (line.includes('Send,') || line.includes('Sleep,')) {
    issues.push(`Line ${lineNum}: AHK v1 comma syntax: ${line.trim()}`)
  }
  
  if (line.includes('Gosub')) {
    issues.push(`Line ${lineNum}: AHK v1 Gosub: ${line.trim()}`)
  }
  
  if (line.match(/^\w+:$/) && !line.includes(';')) {
    issues.push(`Line ${lineNum}: AHK v1 label: ${line.trim()}`)
  }
  
  if (line.includes('MaxIndex()')) {
    issues.push(`Line ${lineNum}: AHK v1 MaxIndex(): ${line.trim()}`)
  }
  
  if (line.includes('data := {}')) {
    issues.push(`Line ${lineNum}: AHK v1 object syntax: ${line.trim()}`)
  }
  
  // Check untuk string escaping issues
  if (line.includes('\\"') && !line.includes('MsgBox')) {
    issues.push(`Line ${lineNum}: Possible string escaping issue: ${line.trim()}`)
  }
})

if (issues.length > 0) {
  console.log('❌ ISSUES DITEMUKAN:')
  issues.forEach(issue => console.log('  ', issue))
} else {
  console.log('✅ Tidak ada syntax issues yang terdeteksi')
}

// Simpan untuk testing
const fs = require('fs')
const debugPath = './debug-generator-output.ahk'
fs.writeFileSync(debugPath, debugScript)

console.log(`\n📁 Debug script disimpan di: ${debugPath}`)
console.log('💡 Jalankan script ini di AHK v2 untuk melihat error di line mana')

// Kemungkinan penyebab error
console.log('\n=== KEMUNGKINAN PENYEBAB ERROR ===')
console.log('1. 🔧 AutoHotkey v1 terinstall, bukan v2')
console.log('2. 📝 String escaping issue di data input')
console.log('3. 🏷️  Variable naming conflict')
console.log('4. 🔤 Character encoding issue di string')
console.log('5. 📋 Syntax mixing antara v1 dan v2')
console.log('')
console.log('💡 SOLUSI:')
console.log('- Pastikan menggunakan AutoHotkey v2')
console.log('- Check data input tidak ada karakter special')
console.log('- Test script sederhana dulu untuk isolasi masalah')
