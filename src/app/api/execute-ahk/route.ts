import { NextRequest, NextResponse } from 'next/server'
import { daftarValas, getMainCurrencyCode, getCurrencyCodeNumber } from '@/lib/valasData'

// Helper: Escape string untuk AHK script
function escapeAhkString(str: string): string {
  if (!str) return ''
  return str
    .replace(/\\/g, '\\\\')  // Escape backslash
    .replace(/"/g, '""')     // Escape double quotes untuk AHK
    .replace(/`/g, '``')     // Escape backticks
    .replace(/\r?\n/g, ' ')  // Replace newlines dengan space
    .replace(/\t/g, ' ')     // Replace tabs dengan space
    .trim()
}

// Helper: Generate AHK script content (same as generate-ahk but return string)
function generateAhkScript(data: any): string {
  const formattedBirthDate = data.birthDate ? ` ${new Date(data.birthDate).getDate().toString().padStart(2, '0')}/${(new Date(data.birthDate).getMonth() + 1).toString().padStart(2, '0')}/${new Date(data.birthDate).getFullYear()}` : ''
  const truncatedAddress = (data.address || '').length > 70 ? (data.address || '').substring(0, 70) : (data.address || '')

  const ahkLines = []
  
  // === HEADER TANPA #Requires untuk compatibility ===
  ahkLines.push('; AutoHotkey v2 Script (install AutoHotkey v2 untuk hasil terbaik)')
  ahkLines.push('; Download: https://www.autohotkey.com/v2/')
  ahkLines.push('#SingleInstance Force')
  ahkLines.push('')
  
  // === FUNGSI TYPESTRING (AHK v2) ===
  // Definisi fungsi menggunakan format AHK v2
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
  ahkLines.push('    MsgBox("Window `"Data Prosesing PT Mulia Bumi Arta`" tidak ditemukan. Pastikan program sudah berjalan.", "Error", "T5")')
  ahkLines.push('    ExitApp()')
  ahkLines.push('}')
  ahkLines.push('')
  
  // Deteksi jenis transaksi untuk navigasi awal
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

  // === NAVIGASI KE BAGIAN TRANSAKSI ===
  // Isi data transaksi (mendukung single atau multiple transactions seperti generate-ahk)
  const transactions = []
  
  // Prioritas 1: Ambil dari array transactions jika ada (semua transaksi)
  if (data.transactions && Array.isArray(data.transactions)) {
    data.transactions.forEach((transaction: any) => {
      if (transaction.currency && transaction.amount && transaction.rate) {
        transactions.push(transaction)
      }
    })
  }
  
  // Prioritas 2: Jika tidak ada array transactions, ambil dari data utama
  if (transactions.length === 0 && data.currency && data.amount && data.rate) {
    transactions.push({
      currency: data.currency,
      amount: data.amount,
      rate: data.rate
    })
  }
  
  if (transactions.length > 0) {
    ahkLines.push('; === NAVIGASI KE BAGIAN TRANSAKSI ===')
    ahkLines.push(`; Total transaksi yang akan diproses: ${transactions.length}`)
    ahkLines.push('; Setelah mengisi Tempat Tanggal Lahir, langsung ke transaksi')
    ahkLines.push('Sleep(200)')
    ahkLines.push('')
    ahkLines.push('; Pastikan window masih aktif')
    ahkLines.push('WinActivate("Data Prosesing PT Mulia Bumi Arta")')
    ahkLines.push('Sleep(100)')
    ahkLines.push('')
    
    // Conditional timing untuk BNB vs BNS seperti routeold.ts
    if (transactionType === 'BNB') {
      ahkLines.push('; Enter 2x untuk navigasi ke field Code Currency (cepat untuk BNB)')
      ahkLines.push('Send("{Enter}")')
      ahkLines.push('Sleep(100)')
      ahkLines.push('Send("{Enter}")')
      ahkLines.push('Sleep(100)')
    } else {
      ahkLines.push('; Enter 2x untuk navigasi ke field Code Currency (normal untuk BNS)')
      ahkLines.push('Send("{Enter}")')
      ahkLines.push('Sleep(200)')
      ahkLines.push('Send("{Enter}")')
      ahkLines.push('Sleep(200)')
    }
    ahkLines.push('')
    
    // Proses setiap transaksi
    transactions.forEach((transaction, index) => {
      const isLastTransaction = (index === transactions.length - 1)
      const currency = (transaction.currency || '').toUpperCase().trim()
      
      // Konversi currency ke code number berdasarkan getCurrencyCodeNumber
      let currencyCode = getCurrencyCodeNumber(currency)
      
      ahkLines.push(`; === ISI DATA TRANSAKSI ${index + 1} ===`)
      ahkLines.push(`; Debug: Currency input = "${currency}", Code = ${currencyCode}`)
      ahkLines.push(`; Jenis Transaksi: ${transactionType}`)
      
      ahkLines.push(`; Isi Code Currency ${currency} = ${currencyCode}`)
      ahkLines.push(`Send("${currencyCode}")`)
      
      // Conditional timing berdasarkan jenis transaksi seperti routeold.ts
      if (transactionType === 'BNB') {
        ahkLines.push('Sleep(100)')
        ahkLines.push('')
        ahkLines.push('; Enter 2x untuk navigasi ke field Amount (cepat untuk BNB)')
        ahkLines.push('Send("{Enter}")')
        ahkLines.push('Sleep(100)')
        ahkLines.push('Send("{Enter}")')
        ahkLines.push('Sleep(100)')
      } else {
        ahkLines.push('Sleep(200)')
        ahkLines.push('')
        ahkLines.push('; Enter 2x untuk navigasi ke field Amount (normal untuk BNS)')
        ahkLines.push('Send("{Enter}")')
        ahkLines.push('Sleep(200)')
        ahkLines.push('Send("{Enter}")')
        ahkLines.push('Sleep(200)')
      }
      ahkLines.push('')
      
      ahkLines.push(`; Isi Amount ${transaction.amount}`)
      ahkLines.push(`TypeString("${String(transaction.amount || '')}")`)
      ahkLines.push('Sleep(100)')
      ahkLines.push('')
      
      // Enter ke field Rate dengan timing berbeda untuk BNB vs BNS
      if (transactionType === 'BNB') {
        ahkLines.push('; Enter 1x untuk navigasi ke field Exchange Rate (cepat untuk BNB)')
        ahkLines.push('Send("{Enter}")')
        ahkLines.push('Sleep(100)')
      } else {
        ahkLines.push('; Enter 1x untuk navigasi ke field Exchange Rate (normal untuk BNS)')
        ahkLines.push('Send("{Enter}")')
        ahkLines.push('Sleep(200)')
      }
      ahkLines.push('')
      
      ahkLines.push(`; Isi Exchange Rate ${transaction.rate}`)
      ahkLines.push(`TypeString("${String(transaction.rate || '')}")`)
      ahkLines.push('Sleep(100)')
      ahkLines.push('')
      
      // Logic berbeda untuk BNB berdasarkan apakah ini transaksi terakhir (dari routeold.ts)
      if (transactionType === 'BNB') {
        if (isLastTransaction) {
          ahkLines.push(`; Setelah input rate - transaksi terakhir BNB: Enter 2x → Down 1x → Enter 1x → 1s delay → Reset R`)
          ahkLines.push('Send("{Enter}")')
          ahkLines.push('Sleep(200)')
          ahkLines.push('Send("{Enter}")')
          ahkLines.push('Sleep(200)')
          ahkLines.push('')
          ahkLines.push('; Tekan panah ke bawah 1x untuk navigasi selanjutnya')
          ahkLines.push('Send("{Down}")')
          ahkLines.push('Sleep(300)')
          ahkLines.push('')
          ahkLines.push('; Tekan Enter 1x setelah panah bawah')
          ahkLines.push('Send("{Enter}")')
          ahkLines.push('Sleep(300)')
          ahkLines.push('')
          ahkLines.push('; Jeda 1 detik sebelum reset')
          ahkLines.push('Sleep(1000)')
          ahkLines.push('')
          ahkLines.push('; Tekan tombol R 1x untuk reset ke menu utama')
          ahkLines.push('Send("r")')
          ahkLines.push('Sleep(500)')
          ahkLines.push('')      } else {
        ahkLines.push(`; Setelah input rate - masih ada transaksi lain BNB: Enter 3x`)
        ahkLines.push('Send("{Enter}")')
        ahkLines.push('Sleep(100)')
        ahkLines.push('Send("{Enter}")')
        ahkLines.push('Sleep(100)')
        ahkLines.push('Send("{Enter}")')
        ahkLines.push('Sleep(200)')
        ahkLines.push('')
      }
      } else {
        // Untuk BNS, tetap menggunakan logic dari routeold.ts
        ahkLines.push('; Setelah input rate: Enter 3x')
        ahkLines.push('Send("{Enter}")')
        ahkLines.push('Sleep(100)')
        ahkLines.push('Send("{Enter}")')
        ahkLines.push('Sleep(100)')
        ahkLines.push('Send("{Enter}")')
        ahkLines.push('Sleep(200)')
        ahkLines.push('')
      }
      
      // Jika bukan transaksi terakhir, navigasi ke baris berikutnya (tambahan dari generate-ahk)
      if (index < transactions.length - 1) {
        const nextTransactionNumber = index + 2
        
        // Navigasi berbeda untuk transaksi setelah baris ke-8
        if (nextTransactionNumber > 8) {
          ahkLines.push(`; === NAVIGASI KE BARIS TRANSAKSI ${nextTransactionNumber} (SETELAH BARIS 8) ===`)
          ahkLines.push('; Setelah transaksi ke-8, navigasi berbeda: Enter 3x + Jeda + Panah Atas 7x (langsung input)')
          ahkLines.push('Send("{Enter}")')
          ahkLines.push('Sleep(200)')
          ahkLines.push('Send("{Enter}")')
          ahkLines.push('Sleep(200)')
          ahkLines.push('Send("{Enter}")')
          ahkLines.push('Sleep(300)')
          ahkLines.push('; Jeda tambahan untuk memastikan UI siap sebelum panah atas')
          ahkLines.push('Sleep(300)')
          ahkLines.push('; Tekan panah atas 7x untuk navigasi khusus setelah baris 8')
          ahkLines.push('Send("{Up}")')
          ahkLines.push('Sleep(200)')
          ahkLines.push('Send("{Up}")')
          ahkLines.push('Sleep(200)')
          ahkLines.push('Send("{Up}")')
          ahkLines.push('Sleep(200)')
          ahkLines.push('Send("{Up}")')
          ahkLines.push('Sleep(200)')
          ahkLines.push('Send("{Up}")')
          ahkLines.push('Sleep(200)')
          ahkLines.push('Send("{Up}")')
          ahkLines.push('Sleep(200)')
          ahkLines.push('Send("{Up}")')
          ahkLines.push('Sleep(200)')
          ahkLines.push('; Setelah panah atas 7x, langsung lanjut ke input transaksi selanjutnya')
          ahkLines.push('')
        } else {
          ahkLines.push(`; === NAVIGASI KE BARIS TRANSAKSI ${nextTransactionNumber} (NORMAL) ===`)
          
          // Conditional navigation berdasarkan jenis transaksi
          if (transactionType === 'BNS') {
            ahkLines.push('; BNS navigation: timing khusus untuk stabilitas')
            ahkLines.push('; Masih ada transaksi lain - Enter 1x lalu ketik code currency')
            ahkLines.push('Send("{Enter}")')
            ahkLines.push('Sleep(500)')  // Increase dari 200 ke 500 untuk BNS
            ahkLines.push('; Pastikan window masih aktif sebelum input currency')
            ahkLines.push('WinActivate("Data Prosesing PT Mulia Bumi Arta")')
            ahkLines.push('Sleep(200)')
            ahkLines.push('')
          } else {
            ahkLines.push('; BNB navigation: tidak perlu Enter tambahan')
            ahkLines.push('; Enter 3x sudah dilakukan di dalam fillTransactionRow')
            ahkLines.push('; Langsung lanjut ke input transaksi selanjutnya')
            ahkLines.push('Sleep(200)')
            ahkLines.push('')
          }
        }
      }
    })
    
    ahkLines.push(`; Navigasi selesai - ${transactions.length} transaksi telah diproses`)
    ahkLines.push('Sleep(300)')
    ahkLines.push('')
  } else {
    ahkLines.push('; Tidak ada data transaksi - hanya mengisi data nasabah')
    ahkLines.push('Sleep(300)')
  }
  
  // Untuk BNS, tambahkan navigasi pembayaran setelah semua transaksi selesai (dari routeold.ts)
  if (transactionType === 'BNS' && transactions.length > 0) {
    ahkLines.push('; === SELESAI TRANSAKSI BNS ===')
    ahkLines.push('; Setelah transaksi selesai: navigasi ke pembayaran')
    ahkLines.push('')
    ahkLines.push('; Tekan panah ke bawah 1x untuk navigasi ke pembayaran')
    ahkLines.push('Send("{Down}")')
    ahkLines.push('Sleep(500)')
    ahkLines.push('')
    ahkLines.push('; Tekan Enter 1x untuk masuk ke field pembayaran')
    ahkLines.push('Send("{Enter}")')
    ahkLines.push('Sleep(500)')
    ahkLines.push('')
    
    // Ambil data pembayaran BNS dari field halaman utama
    let pembayaranValue = ''
    console.log('=== DEBUG PEMBAYARAN BNS ===')
    console.log('data.pembayaranRp:', data.pembayaranRp)
    console.log('data.totalAmount:', data.totalAmount)
    console.log('data.jumlahPembayaran:', data.jumlahPembayaran)
    console.log('data.pembayaran:', data.pembayaran)
    
    // Prioritas 1: Ambil dari field pembayaran halaman utama (pembayaranRp)
    if (data.pembayaranRp && String(data.pembayaranRp).trim() !== '') {
      pembayaranValue = String(data.pembayaranRp).replace(/[^0-9]/g, '') // Hapus formatting, ambil angka saja
      console.log('✅ Menggunakan pembayaran dari field halaman utama:', pembayaranValue)
    } 
    // Prioritas 2: Fallback ke totalAmount, jumlahPembayaran, atau pembayaran
    else if (data.totalAmount || data.jumlahPembayaran || data.pembayaran) {
      pembayaranValue = String(data.totalAmount || data.jumlahPembayaran || data.pembayaran)
      console.log('⚠️ Menggunakan fallback pembayaran:', pembayaranValue)
    } 
    // Prioritas 3: Hitung dari transaksi jika tidak ada pembayaran manual
    else if (transactions.length > 0) {
      const totalPembayaran = transactions.reduce((sum, transaction) => {
        const amount = parseFloat(transaction.amount) || 0
        const rate = parseFloat(transaction.rate) || 0
        return sum + (amount * rate)
      }, 0)
      pembayaranValue = String(Math.round(totalPembayaran))
      console.log('📊 Menghitung pembayaran otomatis dari transaksi:', pembayaranValue)
    }
    
    if (pembayaranValue) {
      ahkLines.push(`; === DATA PEMBAYARAN BNS ===`)
      ahkLines.push(`; Debug: Jumlah pembayaran dari field halaman utama`)
      ahkLines.push(`; Nilai: ${pembayaranValue}`)
      ahkLines.push(`TypeString("${pembayaranValue}")`)
      ahkLines.push('Sleep(300)')
      ahkLines.push('')
    } else {
      ahkLines.push('; === PERINGATAN: TIDAK ADA DATA PEMBAYARAN ===')
      ahkLines.push('; Pastikan field "Pembayaran Rp" diisi di halaman utama untuk transaksi BNS')
      ahkLines.push('Sleep(300)')
      ahkLines.push('')
    }
    
    ahkLines.push('; Tekan Enter 3x setelah input pembayaran')
    ahkLines.push('Send("{Enter}")')
    ahkLines.push('Sleep(300)')
    ahkLines.push('Send("{Enter}")')
    ahkLines.push('Sleep(300)')
    ahkLines.push('Send("{Enter}")')
    ahkLines.push('Sleep(300)')
    ahkLines.push('')
    ahkLines.push('; Jeda 1 detik sebelum reset')
    ahkLines.push('Sleep(1000)')
    ahkLines.push('')
    ahkLines.push('; Tekan tombol R 1x untuk reset ke menu utama')
    ahkLines.push('Send("r")')
    ahkLines.push('Sleep(500)')
    ahkLines.push('')
  }
  
  ahkLines.push('')
  ahkLines.push('; === SCRIPT SELESAI ===')
  ahkLines.push('Sleep(1000)')
  ahkLines.push('ExitApp()')

  return ahkLines.join('\n')
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    // Enhanced debugging untuk multiple transactions (same as generate-ahk)
    console.log('=== EXECUTE-AHK: DEBUGGING MULTIPLE TRANSACTIONS ===')
    console.log('Raw data received:', JSON.stringify(data, null, 2))
    console.log('data.transactions exists:', !!data.transactions)
    console.log('data.transactions is array:', Array.isArray(data.transactions))
    console.log('data.transactions length:', data.transactions?.length || 0)
    
    // Debug: Check what transactions will be processed
    const testTransactions = []
    
    if (data.transactions && Array.isArray(data.transactions)) {
      data.transactions.forEach((transaction: any, index: number) => {
        console.log(`EXECUTE-AHK: Processing transaction ${index + 1}:`, {
          currency: transaction.currency,
          amount: transaction.amount,
          rate: transaction.rate,
          hasAllFields: !!(transaction.currency && transaction.amount && transaction.rate)
        })
        
        if (transaction.currency && transaction.amount && transaction.rate) {
          testTransactions.push(transaction)
        }
      })
    }
    
    if (testTransactions.length === 0 && data.currency && data.amount && data.rate) {
      testTransactions.push({ currency: data.currency, amount: data.amount, rate: data.rate })
    }
    
    console.log(`EXECUTE-AHK: Final transactions to process: ${testTransactions.length}`)
    
    // Generate AHK script content
    const ahkScript = generateAhkScript(data)
    
    // SOLUSI: Langsung eksekusi AHK tanpa backend eksternal
    // Gunakan Node.js child_process untuk menjalankan AHK
    const fs = require('fs').promises
    const path = require('path')
    const { spawn } = require('child_process')
    
    // Create temporary AHK file di frontend
    const tempDir = path.join(process.cwd(), 'temp')
    const tempFile = path.join(tempDir, `script_${Date.now()}.ahk`)
    
    try {
      // Ensure temp directory exists
      await fs.mkdir(tempDir, { recursive: true })
      
      // Write script to temporary file
      await fs.writeFile(tempFile, ahkScript, 'utf-8')
      console.log(`[AHK] Script saved to: ${tempFile}`)
      
      // Execute AHK script - try different AutoHotkey paths
      const ahkPaths = [
        'C:\\Program Files\\AutoHotkey\\v2\\AutoHotkey.exe',
        'C:\\Program Files (x86)\\AutoHotkey\\AutoHotkey.exe',
        'C:\\Program Files\\AutoHotkey\\AutoHotkey.exe'
      ]
      
      let ahkExePath = ahkPaths[0] // Default to v2
      
      // Check which AutoHotkey version is available
      for (const ahkPath of ahkPaths) {
        try {
          await fs.access(ahkPath)
          ahkExePath = ahkPath
          break
        } catch (e) {
          // Path not found, try next
        }
      }
      
      const ahkProcess = spawn(ahkExePath, [tempFile], {
        detached: true,
        stdio: 'ignore'
      })
      
      // Don't wait for the process to complete, let it run in background
      ahkProcess.unref()
      
      console.log(`[AHK] Script executed with PID: ${ahkProcess.pid}`)
      
      // Clean up temporary file after a delay
      setTimeout(async () => {
        try {
          await fs.unlink(tempFile)
          console.log(`[AHK] Cleaned up temp file: ${tempFile}`)
        } catch (cleanupErr: any) {
          console.error(`[AHK] Failed to cleanup temp file: ${cleanupErr.message}`)
        }
      }, 5000) // Wait 5 seconds before cleanup
      
      return NextResponse.json({
        success: true,
        message: 'AHK script executed successfully',
        details: {
          pid: ahkProcess.pid,
          tempFile: tempFile,
          ahkPath: ahkExePath
        }
      })
      
    } catch (fileErr: any) {
      console.error('[AHK] File operation error:', fileErr)
      return NextResponse.json(
        { 
          success: false,
          error: 'Failed to create or execute AHK script',
          details: fileErr.message 
        },
        { status: 500 }
      )
    }
    
  } catch (error: any) {
    console.error('Error executing AHK:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to execute AHK script', 
        details: error.message,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}
