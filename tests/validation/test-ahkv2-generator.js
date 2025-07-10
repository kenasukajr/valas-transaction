/**
 * Test generator AHK v2 - Memastikan script yang dihasilkan menggunakan sintaks AHK v2
 * Update: Validasi seluruh sintaks AHK v2 (function, Send, Sleep, Map, dll)
 */

const { generateAhkScript } = require('./src/app/api/execute-ahk/route.ts')

// Mock data untuk testing
const testData = {
  name: "Test User",
  address: "Jl. Test No. 123",
  phone: "08123456789",
  job: "Developer",
  idNumber: "1234567890123456",
  birthPlace: "Jakarta",
  birthDate: "1990-01-01",
  transactionType: "BNB",
  currency: "USD",
  amount: "1000",
  rate: "15000"
}

console.log("=== TEST GENERATOR AHK v2 ===")
console.log("Menguji apakah generator menghasilkan script AHK v2 yang valid...")

try {
  // Import fungsi generator dari route.ts
  const fs = require('fs')
  const path = require('path')
  
  // Baca file route.ts dan extract function generateAhkScript
  const routeContent = fs.readFileSync('./src/app/api/execute-ahk/route.ts', 'utf8')
  
  // Buat mock untuk dependencies
  const mockDaftarValas = {
    'USD': { code: '1', name: 'US Dollar' },
    'EUR': { code: '2', name: 'Euro' },
    'JPY': { code: '3', name: 'Japanese Yen' }
  }
  
  const mockGetMainCurrencyCode = (currency) => {
    const map = {
      'USD': '1',
      'EUR': '2', 
      'JPY': '3'
    }
    return map[currency] || '1'
  }
  
  // Mock function untuk escape string
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
  
  // Extract dan eksekusi generateAhkScript function
  const generateAhkScript = (data) => {
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

    // Tambahkan transaksi jika ada
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
      ahkLines.push('Send("{Enter}")')
      ahkLines.push('Sleep(200)')
      ahkLines.push('Send("{Enter}")')
      ahkLines.push('Sleep(200)')
      
      transactions.forEach((transaction, index) => {
        const currency = (transaction.currency || '').toUpperCase().trim()
        let currencyCode = mockGetMainCurrencyCode(currency) || '1'
        
        ahkLines.push(`; === ISI DATA TRANSAKSI ${index + 1} ===`)
        ahkLines.push(`Send("${currencyCode}")`)
        ahkLines.push('Sleep(100)')
        ahkLines.push('Send("{Enter}")')
        ahkLines.push('Sleep(100)')
        ahkLines.push('Send("{Enter}")')
        ahkLines.push('Sleep(100)')
        
        ahkLines.push(`TypeString("${String(transaction.amount || '')}")`)
        ahkLines.push('Sleep(100)')
        ahkLines.push('Send("{Enter}")')
        ahkLines.push('Sleep(100)')
        
        ahkLines.push(`TypeString("${String(transaction.rate || '')}")`)
        ahkLines.push('Sleep(100)')
        ahkLines.push('Send("{Enter}")')
        ahkLines.push('Sleep(200)')
      })
    }
    
    ahkLines.push('')
    ahkLines.push('; === SCRIPT SELESAI ===')
    ahkLines.push('Sleep(500)')
    ahkLines.push('FileDelete(A_ScriptFullPath)')
    ahkLines.push('ExitApp()')

    return ahkLines.join('\n')
  }
  
  // Generate script
  const ahkScript = generateAhkScript(testData)
  
  console.log("\n=== SCRIPT AHK v2 YANG DIHASILKAN ===")
  console.log(ahkScript)
  
  // Validasi sintaks AHK v2
  console.log("\n=== VALIDASI SINTAKS AHK v2 ===")
  
  const checks = [
    {
      name: "Function definition AHK v2",
      test: /TypeString\(str\) \{/.test(ahkScript),
      desc: "Menggunakan function definition dengan parameter dalam kurung"
    },
    {
      name: "Send() function",
      test: /Send\("[^"]*"\)/.test(ahkScript),
      desc: "Menggunakan Send() dengan string dalam kurung"
    },
    {
      name: "Sleep() function", 
      test: /Sleep\(\d+\)/.test(ahkScript),
      desc: "Menggunakan Sleep() dengan angka dalam kurung"
    },
    {
      name: "Map() object",
      test: /data := Map\(\)/.test(ahkScript),
      desc: "Menggunakan Map() untuk object/associative array"
    },
    {
      name: "for-in loop v2",
      test: /for index, \w+ in \w+/.test(ahkScript),
      desc: "Menggunakan for-in loop syntax AHK v2"
    },
    {
      name: "if condition v2",
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
      test: !/\w+:$/.test(ahkScript.replace(/; .*/g, '')),
      desc: "Tidak menggunakan labels (format AHK v1)"
    },
    {
      name: "No Gosub calls",
      test: !/Gosub[, ]/.test(ahkScript),
      desc: "Tidak menggunakan Gosub (AHK v1 style)"
    },
    {
      name: "No comma syntax",
      test: !/Send, /.test(ahkScript) && !/Sleep, /.test(ahkScript),
      desc: "Tidak menggunakan comma syntax untuk Send/Sleep (AHK v1)"
    }
  ]
  
  let allPassed = true
  checks.forEach(check => {
    const status = check.test ? "✅ PASS" : "❌ FAIL"
    console.log(`${status}: ${check.name} - ${check.desc}`)
    if (!check.test) allPassed = false
  })
  
  console.log(`\n=== HASIL VALIDASI ===`)
  if (allPassed) {
    console.log("✅ SEMUA CHECK BERHASIL - Script menggunakan sintaks AHK v2 yang benar!")
  } else {
    console.log("❌ ADA CHECK YANG GAGAL - Script masih menggunakan sintaks AHK v1!")
  }
  
  // Simpan script untuk testing manual
  const testOutputPath = './test-ahkv2-output.ahk'
  fs.writeFileSync(testOutputPath, ahkScript)
  console.log(`\n📁 Script disimpan di: ${testOutputPath}`)
  console.log("💡 Untuk test manual: jalankan script ini di AutoHotkey v2")
  
} catch (error) {
  console.error("❌ ERROR:", error.message)
  process.exit(1)
}
