import { NextRequest, NextResponse } from 'next/server'
import { daftarValas, getMainCurrencyCode, getCurrencyCodeNumber } from '@/lib/valasData'

// Helper: Generate AHK script content from transaction data
function generateAhkScript(data: any): string {
  const formattedBirthDate = data.birthDate ? ` ${new Date(data.birthDate).getDate().toString().padStart(2, '0')}/${(new Date(data.birthDate).getMonth() + 1).toString().padStart(2, '0')}/${new Date(data.birthDate).getFullYear()}` : ''
  const truncatedAddress = (data.address || '').length > 70 ? (data.address || '').substring(0, 70) : (data.address || '')

  const ahkLines = []
  // Header tanpa #Requires agar tidak error di AHK v1
  ahkLines.push('; AutoHotkey v2 Script (install AutoHotkey v2 untuk hasil terbaik)')
  ahkLines.push('; Download: https://www.autohotkey.com/v2/')
  ahkLines.push('#SingleInstance Force')
  ahkLines.push('')
  
  ahkLines.push('if WinExist("Data Prosesing PT Mulia Bumi Arta") {')
  ahkLines.push('    WinRestore("Data Prosesing PT Mulia Bumi Arta")')
  ahkLines.push('    WinActivate("Data Prosesing PT Mulia Bumi Arta")')
  ahkLines.push('    WinMaximize("Data Prosesing PT Mulia Bumi Arta")')
  ahkLines.push('} else {')
  ahkLines.push('    MsgBox("Window `"Data Prosesing PT Mulia Bumi Arta`" tidak ditemukan. Pastikan program sudah berjalan.", "Error", 16)')
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
  ahkLines.push('Sleep(200)')  // Reduced from 500 to 200 for faster BNB navigation
  ahkLines.push('Send("{Enter}")')
  ahkLines.push('Sleep(200)')  // Reduced from 500 to 200 for faster BNB navigation
  ahkLines.push('')
  
  // Data Diri (AHK v2 Map)
  ahkLines.push('data := Map()')
  ahkLines.push(`data["Nama Lengkap"] := "${data.name || ''}"`)
  ahkLines.push(`data["Alamat"] := "${truncatedAddress}"`)
  ahkLines.push(`data["Nomor Telepon"] := "${data.phone || ''}"`)
  ahkLines.push(`data["Pekerjaan"] := "${data.job || ''}"`)
  ahkLines.push(`data["Nomor Identitas"] := "${data.idNumber || ''}"`)
  ahkLines.push(`data["Tempat Tanggal Lahir"] := "${data.birthPlace || ''}${formattedBirthDate}"`)
  ahkLines.push('')
  
  // Data Transaksi (jika ada) - hanya untuk validasi
  const hasTransactionData = !!(data.currency && data.amount && data.rate)
  
  ahkLines.push('TypeString(str) {')
  ahkLines.push('    Loop Parse, str {')
  ahkLines.push('        Send(A_LoopField)')
  ahkLines.push('        Sleep(0)')
  ahkLines.push('    }')
  ahkLines.push('}')
  ahkLines.push('')
  
  // Isi data diri (AHK v2 for-in loop)
  ahkLines.push('keys := ["Nama Lengkap", "Alamat", "Nomor Telepon", "Pekerjaan", "Nomor Identitas", "Tempat Tanggal Lahir"]')
  ahkLines.push('for index, key in keys {')
  ahkLines.push('    TypeString(data[key])')
  ahkLines.push('    Sleep(50)')
  ahkLines.push('    if (index < keys.Length) {')
  ahkLines.push('        Send("{Tab}")')
  ahkLines.push('        Sleep(100)')
  ahkLines.push('    }')
  ahkLines.push('}')
  ahkLines.push('')
  
  // Helper function untuk mengisi satu baris transaksi
  const fillTransactionRow = (transactionData: any, rowNumber: number, isLastTransaction: boolean = false) => {
    const currency = (transactionData.currency || '').toUpperCase().trim()
    
    // Konversi currency ke code number menggunakan helper function
    let currencyCode = getCurrencyCodeNumber(currency)
    
    // Deteksi jenis transaksi dari data transaksi individual atau data global
    const currentTransactionType = (transactionData.transactionType || transactionData.jenisTransaksi || transactionType || 'BNB').toUpperCase()
    
    ahkLines.push(`; === ISI DATA TRANSAKSI ${rowNumber} ===`)
    ahkLines.push(`; Debug: Currency input = "${currency}", Code = ${currencyCode}`)
    ahkLines.push(`; Jenis Transaksi: ${currentTransactionType}`)
    
    ahkLines.push(`; Isi Code Currency ${currency} = ${currencyCode}`)
    ahkLines.push(`Send("${currencyCode}")`)
    
    // Conditional timing berdasarkan jenis transaksi
    if (currentTransactionType === 'BNB') {
      ahkLines.push('Sleep(100)')  // Faster for BNB
      ahkLines.push('')
      ahkLines.push('; Enter 2x untuk navigasi ke field Amount (cepat untuk BNB)')
      ahkLines.push('Send("{Enter}")')
      ahkLines.push('Sleep(100)')  // Faster for BNB
      ahkLines.push('Send("{Enter}")')
      ahkLines.push('Sleep(100)')  // Faster for BNB
    } else {
      ahkLines.push('Sleep(200)')  // Normal for BNS
      ahkLines.push('')
      ahkLines.push('; Enter 2x untuk navigasi ke field Amount (normal untuk BNS)')
      ahkLines.push('Send("{Enter}")')
      ahkLines.push('Sleep(200)')  // Normal for BNS
      ahkLines.push('Send("{Enter}")')
      ahkLines.push('Sleep(200)')  // Normal for BNS
    }
    ahkLines.push('')
    ahkLines.push(`; Isi Amount ${transactionData.amount}`)
    ahkLines.push(`TypeString("${String(transactionData.amount || '')}")`)
    ahkLines.push('Sleep(100)')
    ahkLines.push('')
    
    // Enter ke field Rate juga dipercepat untuk BNB
    if (currentTransactionType === 'BNB') {
      ahkLines.push('; Enter 1x untuk navigasi ke field Exchange Rate (cepat untuk BNB)')
      ahkLines.push('Send("{Enter}")')
      ahkLines.push('Sleep(100)')  // Faster for BNB
    } else {
      ahkLines.push('; Enter 1x untuk navigasi ke field Exchange Rate (normal untuk BNS)')
      ahkLines.push('Send("{Enter}")')
      ahkLines.push('Sleep(200)')  // Normal for BNS
    }
    ahkLines.push('')
    ahkLines.push(`; Isi Exchange Rate ${transactionData.rate}`)
    ahkLines.push(`TypeString("${String(transactionData.rate || '')}")`)
    ahkLines.push('Sleep(100)')
    ahkLines.push('')
    
    // Logika berbeda untuk BNB berdasarkan apakah ini transaksi terakhir
    if (currentTransactionType === 'BNB') {
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
        ahkLines.push('')
      } else {
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
      // Untuk BNS, tetap menggunakan logic yang sudah ada
      ahkLines.push('; Setelah input rate: Enter 3x')
      ahkLines.push('Send("{Enter}")')
      ahkLines.push('Sleep(100)')
      ahkLines.push('Send("{Enter}")')
      ahkLines.push('Sleep(100)')
      ahkLines.push('Send("{Enter}")')
      ahkLines.push('Sleep(200)')
      ahkLines.push('')
    }
  }

  // Isi data transaksi (mendukung multiple transactions)
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
    
    // Conditional timing untuk BNB vs BNS
    if (transactionType === 'BNB') {
      ahkLines.push('; Enter 2x untuk navigasi ke field Code Currency (cepat untuk BNB)')
      ahkLines.push('Send("{Enter}")')
      ahkLines.push('Sleep(100)')  // Faster for BNB
      ahkLines.push('Send("{Enter}")')
      ahkLines.push('Sleep(100)')  // Faster for BNB
    } else {
      ahkLines.push('; Enter 2x untuk navigasi ke field Code Currency (normal untuk BNS)')
      ahkLines.push('Send("{Enter}")')
      ahkLines.push('Sleep(200)')  // Normal timing for BNS
      ahkLines.push('Send("{Enter}")')
      ahkLines.push('Sleep(200)')  // Normal timing for BNS
    }
    ahkLines.push('')
    
    // Proses setiap transaksi
    transactions.forEach((transaction, index) => {
      const isLastTransaction = (index === transactions.length - 1)
      fillTransactionRow(transaction, index + 1, isLastTransaction)
      
      // Jika bukan transaksi terakhir, navigasi ke baris berikutnya
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
    
    // Untuk BNS, tidak perlu Enter lagi setelah transaksi selesai
    // Untuk BNB, navigasi terakhir sudah ditangani dalam fillTransactionRow
  } else {
    ahkLines.push('; Tidak ada data transaksi - hanya mengisi data nasabah')
    ahkLines.push('Sleep(300)')
  }
  
  // Untuk BNS, tambahkan navigasi pembayaran setelah semua transaksi selesai
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
  ahkLines.push('; Script selesai')
  ahkLines.push('Sleep(1000)')
  ahkLines.push('ExitApp()')

  return ahkLines.join('\n')
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    
    // Enhanced debugging untuk multiple transactions
    console.log('=== DEBUGGING MULTIPLE TRANSACTIONS ===')
    console.log('Raw data received:', JSON.stringify(data, null, 2))
    console.log('data.transactions exists:', !!data.transactions)
    console.log('data.transactions is array:', Array.isArray(data.transactions))
    console.log('data.transactions length:', data.transactions?.length || 0)
    
    // Debug: Log data yang masuk untuk memastikan currency benar
    console.log('Data yang diterima:', {
      currency: data.currency,
      amount: data.amount,
      rate: data.rate,
      name: data.name,
      transactionsArray: data.transactions?.length || 0,
      totalTransactionsToProcess: data.transactions?.length || (data.currency && data.amount && data.rate ? 1 : 0)
    })
    
    // Debug: Log detail semua transaksi yang akan diproses
    if (data.transactions && Array.isArray(data.transactions)) {
      console.log('Detail transaksi yang akan diproses:', data.transactions.map((t: any, i: number) => ({
        index: i + 1,
        currency: t.currency,
        amount: t.amount,
        rate: t.rate,
        transactionType: t.transactionType || t.jenisTransaksi,
        hasRequiredFields: !!(t.currency && t.amount && t.rate)
      })))
    }
    
    // Process data and check what gets into the script
    const testTransactions = []
    
    // Prioritas 1: Ambil dari array transactions jika ada (semua transaksi)
    if (data.transactions && Array.isArray(data.transactions)) {
      data.transactions.forEach((transaction: any, index: number) => {
        console.log(`Processing transaction ${index + 1}:`, {
          currency: transaction.currency,
          amount: transaction.amount,
          rate: transaction.rate,
          hasAllFields: !!(transaction.currency && transaction.amount && transaction.rate)
        })
        
        if (transaction.currency && transaction.amount && transaction.rate) {
          testTransactions.push(transaction)
        } else {
          console.log(`Skipping transaction ${index + 1} - missing required fields`)
        }
      })
    }
    
    // Prioritas 2: Jika tidak ada array transactions, ambil dari data utama
    if (testTransactions.length === 0 && data.currency && data.amount && data.rate) {
      console.log('Using fallback single transaction from main data')
      testTransactions.push({
        currency: data.currency,
        amount: data.amount,
        rate: data.rate
      })
    }
    
    console.log(`Final transactions to process: ${testTransactions.length}`)
    console.log('Transactions summary:', testTransactions.map((t, i) => `${i+1}. ${t.currency} ${t.amount} @ ${t.rate}`))
    
    const ahkContent = generateAhkScript(data)
    
    // Check if the script contains multiple transaction processing
    const transactionLines = ahkContent.split('\n').filter(line => line.includes('ISI DATA TRANSAKSI'))
    console.log(`Generated script contains ${transactionLines.length} transaction sections`)
    
    const ahkBuffer = Buffer.from(ahkContent, 'utf-8')
    return new NextResponse(ahkBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': 'attachment; filename="script.ahk"',
        'Content-Length': ahkBuffer.length.toString(),
      },
    })
  } catch (err) {
    console.error('Error generate AHK:', err)
    return NextResponse.json({ error: 'Gagal generate skrip AHK' }, { status: 500 })
  }
}
