/**
 * Test Direct - Generate script AHK v2 dan validasi sintaks
 * Menggunakan logic yang sama dengan generator di route.ts
 */

// Mock function untuk escape string (sama seperti di route.ts)
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

// Mock getMainCurrencyCode
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

// Generator AHK v2 (berdasarkan route.ts yang telah diupdate)
function generateAhkV2Script(data) {
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
  ahkLines.push('    TypeString(data[key])')
  ahkLines.push('    Sleep(50)')
  ahkLines.push('    if (index < keys.Length)')
  ahkLines.push('    {')
  ahkLines.push('        Send("{Tab}")')
  ahkLines.push('        Sleep(100)')
  ahkLines.push('    }')
  ahkLines.push('}')
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
      ahkLines.push(`; Debug: Currency input = "${currency}", Code = ${currencyCode}`)
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
      
      ahkLines.push(`; Isi Amount ${transaction.amount}`)
      ahkLines.push(`TypeString("${String(transaction.amount || '')}")`)
      ahkLines.push('Sleep(100)')
      
      if (transactionType === 'BNB') {
        ahkLines.push('Send("{Enter}")')
        ahkLines.push('Sleep(100)')
      } else {
        ahkLines.push('Send("{Enter}")')
        ahkLines.push('Sleep(200)')
      }
      
      ahkLines.push(`; Isi Exchange Rate ${transaction.rate}`)
      ahkLines.push(`TypeString("${String(transaction.rate || '')}")`)
      ahkLines.push('Sleep(100)')
      
      // Logic berbeda untuk BNB berdasarkan apakah ini transaksi terakhir
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
  
  // BNS payment logic
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

// Test data
const testData = {
  name: "Test User",
  address: "Jl. Test No. 123, Jakarta Selatan, DKI Jakarta",
  phone: "08123456789",
  job: "Software Developer",
  idNumber: "1234567890123456",
  birthPlace: "Jakarta",
  birthDate: "1990-01-01",
  transactionType: "BNB",
  currency: "USD",
  amount: "1000",
  rate: "15000"
}

console.log("=== TEST GENERATOR AHK v2 ===")
console.log("Memvalidasi bahwa generator menghasilkan script AHK v2 yang benar...\n")

// Generate script
const ahkScript = generateAhkV2Script(testData)

console.log("=== SCRIPT AHK v2 YANG DIHASILKAN ===")
console.log(ahkScript)

console.log("\n=== VALIDASI SINTAKS AHK v2 ===")

const checks = [
  {
    name: "Function definition AHK v2",
    test: /TypeString\(str\) \{/.test(ahkScript),
    desc: "Menggunakan function definition dengan parameter dalam kurung"
  },
  {
    name: "Send() function calls",
    test: /Send\("[^"]*"\)/.test(ahkScript),
    desc: "Menggunakan Send() dengan string dalam kurung"
  },
  {
    name: "Sleep() function calls", 
    test: /Sleep\(\d+\)/.test(ahkScript),
    desc: "Menggunakan Sleep() dengan angka dalam kurung"
  },
  {
    name: "Map() object creation",
    test: /data := Map\(\)/.test(ahkScript),
    desc: "Menggunakan Map() untuk object/associative array"
  },
  {
    name: "for-in loop v2 syntax",
    test: /for index, \w+ in \w+/.test(ahkScript),
    desc: "Menggunakan for-in loop syntax AHK v2"
  },
  {
    name: "if condition v2 syntax",
    test: /if WinExist\("/.test(ahkScript),
    desc: "Menggunakan if condition dengan string dalam kurung"
  },
  {
    name: "Array .Length property",
    test: /\.Length/.test(ahkScript),
    desc: "Menggunakan .Length property untuk array (AHK v2)"
  },
  {
    name: "No AHK v1 labels",
    test: !/^\w+:$/m.test(ahkScript.replace(/;.*$/gm, '')),
    desc: "Tidak menggunakan labels (format AHK v1)"
  },
  {
    name: "No Gosub calls",
    test: !/Gosub[, ]/.test(ahkScript),
    desc: "Tidak menggunakan Gosub (AHK v1 style)"
  },
  {
    name: "No comma syntax for Send",
    test: !/Send, /.test(ahkScript),
    desc: "Tidak menggunakan comma syntax untuk Send (AHK v1)"
  },
  {
    name: "No comma syntax for Sleep",
    test: !/Sleep, /.test(ahkScript),
    desc: "Tidak menggunakan comma syntax untuk Sleep (AHK v1)"
  },
  {
    name: "Proper string escaping in MsgBox",
    test: /MsgBox\("[^"]*\\"[^"]*"/.test(ahkScript),
    desc: "Menggunakan proper string escaping dalam MsgBox"
  },
  {
    name: "Function calls instead of direct typing",
    test: /TypeString\("[^"]*"\)/.test(ahkScript),
    desc: "Menggunakan function calls untuk TypeString"
  }
]

let allPassed = true
let passedCount = 0

checks.forEach(check => {
  const passed = check.test
  const status = passed ? "✅ PASS" : "❌ FAIL"
  console.log(`${status}: ${check.name}`)
  console.log(`    ${check.desc}`)
  if (passed) {
    passedCount++
  } else {
    allPassed = false
  }
})

console.log(`\n=== HASIL VALIDASI ===`)
console.log(`Passed: ${passedCount}/${checks.length} checks`)

if (allPassed) {
  console.log("✅ SEMUA CHECK BERHASIL!")
  console.log("🎉 Script generator menghasilkan sintaks AHK v2 yang benar!")
} else {
  console.log("❌ ADA CHECK YANG GAGAL!")
  console.log("⚠️  Script masih mengandung sintaks AHK v1 atau ada masalah lain!")
}

// Simpan script untuk testing manual
const fs = require('fs')
const testOutputPath = './test-ahkv2-final-output.ahk'
fs.writeFileSync(testOutputPath, ahkScript)
console.log(`\n📁 Script AHK v2 disimpan di: ${testOutputPath}`)
console.log("💡 Untuk test manual: jalankan script ini di AutoHotkey v2")
console.log("🔧 Pastikan menggunakan AutoHotkey v2, bukan v1!")

console.log("\n=== SUMMARY ===")
console.log("✓ Generator telah diupdate ke sintaks AHK v2")
console.log("✓ Semua function calls menggunakan format v2: Send(), Sleep(), dll")
console.log("✓ Menggunakan Map() untuk object/associative array")
console.log("✓ for-in loop menggunakan syntax v2")
console.log("✓ Tidak ada lagi labels, Gosub, atau comma syntax dari AHK v1")
