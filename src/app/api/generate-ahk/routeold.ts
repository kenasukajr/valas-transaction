import { NextRequest, NextResponse } from 'next/server'
import { daftarValas, getMainCurrencyCode } from '@/lib/valasData'

// Helper: Generate AHK script content from transaction data
function generateAhkScript(data: any): string {
  const formattedBirthDate = data.birthDate ? ` ${new Date(data.birthDate).getDate().toString().padStart(2, '0')}/${(new Date(data.birthDate).getMonth() + 1).toString().padStart(2, '0')}/${new Date(data.birthDate).getFullYear()}` : ''
  const truncatedAddress = (data.address || '').length > 70 ? (data.address || '').substring(0, 70) : (data.address || '')

  const ahkLines = []
  ahkLines.push('IfWinExist, Data Prosesing PT Mulia Bumi Arta')
  ahkLines.push('{')
  ahkLines.push('    WinRestore, Data Prosesing PT Mulia Bumi Arta')
  ahkLines.push('    WinActivate, Data Prosesing PT Mulia Bumi Arta')
  ahkLines.push('    WinMaximize, Data Prosesing PT Mulia Bumi Arta')
  ahkLines.push('}')
  ahkLines.push('else')
  ahkLines.push('{')
  ahkLines.push('    MsgBox, 16, Error, Window "Data Prosesing PT Mulia Bumi Arta" tidak ditemukan. Pastikan program sudah berjalan.')
  ahkLines.push('    ExitApp')
  ahkLines.push('}')
  ahkLines.push('')
  
  // Deteksi jenis transaksi untuk navigasi awal
  const transactionType = (data.transactionType || data.jenisTransaksi || '').toUpperCase()
  
  ahkLines.push(`; === DETEKSI JENIS TRANSAKSI: ${transactionType} ===`)
  
  if (transactionType === 'BNS') {
    ahkLines.push('; Jenis transaksi BNS - tekan panah kanan 1x SEBELUM memulai script')
    ahkLines.push('Send, {Right}')
    ahkLines.push('Sleep, 300')
    ahkLines.push('')
  } else {
    ahkLines.push('; Jenis transaksi BNB atau default - langsung lanjut input')
    ahkLines.push('')
  }
  
  ahkLines.push('Send, {Enter}')
  ahkLines.push('Sleep, 200')  // Reduced from 500 to 200 for faster BNB navigation
  ahkLines.push('Send, {Enter}')
  ahkLines.push('Sleep, 200')  // Reduced from 500 to 200 for faster BNB navigation
  ahkLines.push('')
  
  // Data Diri
  ahkLines.push('data := {}')
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
  ahkLines.push('    Loop Parse, str')
  ahkLines.push('    {')
  ahkLines.push('        Send %A_LoopField%')
  ahkLines.push('        Sleep 0')
  ahkLines.push('    }')
  ahkLines.push('}')
  ahkLines.push('')
  
  // Isi data diri
  ahkLines.push('keys := ["Nama Lengkap", "Alamat", "Nomor Telepon", "Pekerjaan", "Nomor Identitas", "Tempat Tanggal Lahir"]')
  ahkLines.push('for index, key in keys')
  ahkLines.push('{')
  ahkLines.push('    TypeString(data[key])')
  ahkLines.push('    Sleep 50')
  ahkLines.push('    if (index < keys.MaxIndex())')
  ahkLines.push('    {')
  ahkLines.push('        Send {Tab}')
  ahkLines.push('        Sleep 100')
  ahkLines.push('    }')
  ahkLines.push('}')
  ahkLines.push('')
  
  // Helper function untuk mengisi satu baris transaksi
  const fillTransactionRow = (transactionData: any, rowNumber: number, isLastTransaction: boolean = false) => {
    const currency = (transactionData.currency || '').toUpperCase().trim()
    
    // Konversi currency ke code number berdasarkan daftarValas
    let currencyCode = '1' // default untuk USD
    
    // Cari currency di daftarValas
    let valasItem = daftarValas.find(item => 
      item.kode.toUpperCase() === currency || 
      (item.alias && item.alias.toUpperCase() === currency)
    )
    
    if (valasItem) {
      // Gunakan nomor urut dari daftarValas sesuai aslinya
      // USK tetap menggunakan -1, USB menggunakan 1
      currencyCode = valasItem.no.toString()
    } else {
      // Fallback ke mapping manual jika tidak ditemukan
      if (currency === 'USD') currencyCode = '1'
      else if (currency === 'EUR') currencyCode = '4' 
      else if (currency === 'GBP') currencyCode = '5'
      else if (currency === 'AUD') currencyCode = '2'
      else if (currency === 'CAD') currencyCode = '3'
      else if (currency === 'CHF') currencyCode = '6'
      else if (currency === 'JPY') currencyCode = '9'
      else if (currency === 'SGD') currencyCode = '8'
      else if (currency === 'HKD') currencyCode = '7'
      else if (currency === 'NZD') currencyCode = '10'
      else currencyCode = '1' // default USD
    }
    
    // Deteksi jenis transaksi dari data transaksi individual atau data global
    const currentTransactionType = (transactionData.transactionType || transactionData.jenisTransaksi || transactionType || 'BNB').toUpperCase()
    
    ahkLines.push(`; === ISI DATA TRANSAKSI ${rowNumber} ===`)
    ahkLines.push(`; Debug: Currency input = "${currency}", Code = ${currencyCode}`)
    ahkLines.push(`; Jenis Transaksi: ${currentTransactionType}`)
    
    ahkLines.push(`; Isi Code Currency ${currency} = ${currencyCode}`)
    ahkLines.push(`Send, ${currencyCode}`)
    
    // Conditional timing berdasarkan jenis transaksi
    if (currentTransactionType === 'BNB') {
      ahkLines.push('Sleep, 100')  // Faster for BNB
      ahkLines.push('')
      ahkLines.push('; Enter 2x untuk navigasi ke field Amount (cepat untuk BNB)')
      ahkLines.push('Send, {Enter}')
      ahkLines.push('Sleep, 100')  // Faster for BNB
      ahkLines.push('Send, {Enter}')
      ahkLines.push('Sleep, 100')  // Faster for BNB
    } else {
      ahkLines.push('Sleep, 200')  // Normal for BNS
      ahkLines.push('')
      ahkLines.push('; Enter 2x untuk navigasi ke field Amount (normal untuk BNS)')
      ahkLines.push('Send, {Enter}')
      ahkLines.push('Sleep, 200')  // Normal for BNS
      ahkLines.push('Send, {Enter}')
      ahkLines.push('Sleep, 200')  // Normal for BNS
    }
    ahkLines.push('')
    ahkLines.push(`; Isi Amount ${transactionData.amount}`)
    ahkLines.push(`TypeString("${String(transactionData.amount || '')}")`)
    ahkLines.push('Sleep, 100')
    ahkLines.push('')
    
    // Enter ke field Rate juga dipercepat untuk BNB
    if (currentTransactionType === 'BNB') {
      ahkLines.push('; Enter 1x untuk navigasi ke field Exchange Rate (cepat untuk BNB)')
      ahkLines.push('Send, {Enter}')
      ahkLines.push('Sleep, 100')  // Faster for BNB
    } else {
      ahkLines.push('; Enter 1x untuk navigasi ke field Exchange Rate (normal untuk BNS)')
      ahkLines.push('Send, {Enter}')
      ahkLines.push('Sleep, 200')  // Normal for BNS
    }
    ahkLines.push('')
    ahkLines.push(`; Isi Exchange Rate ${transactionData.rate}`)
    ahkLines.push(`TypeString("${String(transactionData.rate || '')}")`)
    ahkLines.push('Sleep, 100')
    ahkLines.push('')
    
    // Logika berbeda untuk BNB berdasarkan apakah ini transaksi terakhir
    if (currentTransactionType === 'BNB') {
      if (isLastTransaction) {
        ahkLines.push(`; Setelah input rate - transaksi terakhir BNB: Enter 2x → Down 1x → Enter 1x → 1s delay → Reset R`)
        ahkLines.push('Send, {Enter}')
        ahkLines.push('Sleep, 200')
        ahkLines.push('Send, {Enter}')
        ahkLines.push('Sleep, 200')
        ahkLines.push('')
        ahkLines.push('; Tekan panah ke bawah 1x untuk navigasi selanjutnya')
        ahkLines.push('Send, {Down}')
        ahkLines.push('Sleep, 300')
        ahkLines.push('')
        ahkLines.push('; Tekan Enter 1x setelah panah bawah')
        ahkLines.push('Send, {Enter}')
        ahkLines.push('Sleep, 300')
        ahkLines.push('')
        ahkLines.push('; Jeda 1 detik sebelum reset')
        ahkLines.push('Sleep, 1000')
        ahkLines.push('')
        ahkLines.push('; Tekan tombol R 1x untuk reset ke menu utama')
        ahkLines.push('Send, r')
        ahkLines.push('Sleep, 500')
        ahkLines.push('')
      } else {
        ahkLines.push(`; Setelah input rate - masih ada transaksi lain BNB: Enter 3x`)
        ahkLines.push('Send, {Enter}')
        ahkLines.push('Sleep, 100')
        ahkLines.push('Send, {Enter}')
        ahkLines.push('Sleep, 100')
        ahkLines.push('Send, {Enter}')
        ahkLines.push('Sleep, 200')
        ahkLines.push('')
      }
    } else {
      // Untuk BNS, tetap menggunakan logic yang sudah ada
      ahkLines.push('; Setelah input rate: Enter 3x')
      ahkLines.push('Send, {Enter}')
      ahkLines.push('Sleep, 100')
      ahkLines.push('Send, {Enter}')
      ahkLines.push('Sleep, 100')
      ahkLines.push('Send, {Enter}')
      ahkLines.push('Sleep, 200')
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
    ahkLines.push('Sleep, 200')
    ahkLines.push('')
    ahkLines.push('; Pastikan window masih aktif')
    ahkLines.push('WinActivate, Data Prosesing PT Mulia Bumi Arta')
    ahkLines.push('Sleep, 100')
    ahkLines.push('')
    
    // Conditional timing untuk BNB vs BNS
    if (transactionType === 'BNB') {
      ahkLines.push('; Enter 2x untuk navigasi ke field Code Currency (cepat untuk BNB)')
      ahkLines.push('Send, {Enter}')
      ahkLines.push('Sleep, 100')  // Faster for BNB
      ahkLines.push('Send, {Enter}')
      ahkLines.push('Sleep, 100')  // Faster for BNB
    } else {
      ahkLines.push('; Enter 2x untuk navigasi ke field Code Currency (normal untuk BNS)')
      ahkLines.push('Send, {Enter}')
      ahkLines.push('Sleep, 200')  // Normal timing for BNS
      ahkLines.push('Send, {Enter}')
      ahkLines.push('Sleep, 200')  // Normal timing for BNS
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
          ahkLines.push('Send, {Enter}')
          ahkLines.push('Sleep, 200')
          ahkLines.push('Send, {Enter}')
          ahkLines.push('Sleep, 200')
          ahkLines.push('Send, {Enter}')
          ahkLines.push('Sleep, 300')
          ahkLines.push('; Jeda tambahan untuk memastikan UI siap sebelum panah atas')
          ahkLines.push('Sleep, 300')
          ahkLines.push('; Tekan panah atas 7x untuk navigasi khusus setelah baris 8')
          ahkLines.push('Send, {Up}')
          ahkLines.push('Sleep, 200')
          ahkLines.push('Send, {Up}')
          ahkLines.push('Sleep, 200')
          ahkLines.push('Send, {Up}')
          ahkLines.push('Sleep, 200')
          ahkLines.push('Send, {Up}')
          ahkLines.push('Sleep, 200')
          ahkLines.push('Send, {Up}')
          ahkLines.push('Sleep, 200')
          ahkLines.push('Send, {Up}')
          ahkLines.push('Sleep, 200')
          ahkLines.push('Send, {Up}')
          ahkLines.push('Sleep, 200')
          ahkLines.push('; Setelah panah atas 7x, langsung lanjut ke input transaksi selanjutnya')
          ahkLines.push('')
        } else {
          ahkLines.push(`; === NAVIGASI KE BARIS TRANSAKSI ${nextTransactionNumber} (NORMAL) ===`)
          
          // Conditional navigation berdasarkan jenis transaksi
          if (transactionType === 'BNS') {
            ahkLines.push('; BNS navigation: timing khusus untuk stabilitas')
            ahkLines.push('; Masih ada transaksi lain - Enter 1x lalu ketik code currency')
            ahkLines.push('Send, {Enter}')
            ahkLines.push('Sleep, 500')  // Increase dari 200 ke 500 untuk BNS
            ahkLines.push('; Pastikan window masih aktif sebelum input currency')
            ahkLines.push('WinActivate, Data Prosesing PT Mulia Bumi Arta')
            ahkLines.push('Sleep, 200')
            ahkLines.push('')
          } else {
            ahkLines.push('; BNB navigation: tidak perlu Enter tambahan')
            ahkLines.push('; Enter 3x sudah dilakukan di dalam fillTransactionRow')
            ahkLines.push('; Langsung lanjut ke input transaksi selanjutnya')
            ahkLines.push('Sleep, 200')
            ahkLines.push('')
          }
        }
      }
    })
    
    ahkLines.push(`; Navigasi selesai - ${transactions.length} transaksi telah diproses`)
    ahkLines.push('Sleep, 300')
    ahkLines.push('')
    
    // Untuk BNS, tidak perlu Enter lagi setelah transaksi selesai
    // Untuk BNB, navigasi terakhir sudah ditangani dalam fillTransactionRow
  } else {
    ahkLines.push('; Tidak ada data transaksi - hanya mengisi data nasabah')
    ahkLines.push('Sleep, 300')
  }
  
  // Untuk BNS, tambahkan navigasi pembayaran setelah semua transaksi selesai
  if (transactionType === 'BNS' && transactions.length > 0) {
    ahkLines.push('; === SELESAI TRANSAKSI BNS ===')
    ahkLines.push('; Setelah transaksi selesai: navigasi ke pembayaran')
    ahkLines.push('')
    ahkLines.push('; Tekan panah ke bawah 1x untuk navigasi ke pembayaran')
    ahkLines.push('Send, {Down}')
    ahkLines.push('Sleep, 500')
    ahkLines.push('')
    ahkLines.push('; Tekan Enter 1x untuk masuk ke field pembayaran')
    ahkLines.push('Send, {Enter}')
    ahkLines.push('Sleep, 500')
    ahkLines.push('')
    
    // Ambil data pembayaran dari transaksi atau hitung dari data yang ada
    let pembayaranValue = ''
    if (data.pembayaranRp) {
      pembayaranValue = String(data.pembayaranRp)
    } else if (transactions.length > 0) {
      // Hitung total pembayaran dari semua transaksi
      const totalPembayaran = transactions.reduce((sum, transaction) => {
        const amount = parseFloat(transaction.amount) || 0
        const rate = parseFloat(transaction.rate) || 0
        return sum + (amount * rate)
      }, 0)
      pembayaranValue = String(totalPembayaran)
    }
    
    if (pembayaranValue) {
      ahkLines.push(`; Masukkan data pembayaran: ${pembayaranValue}`)
      ahkLines.push(`TypeString("${pembayaranValue}")`)
      ahkLines.push('Sleep, 300')
      ahkLines.push('')
    } else {
      ahkLines.push('; Tidak ada data pembayaran yang diinput')
      ahkLines.push('Sleep, 300')
      ahkLines.push('')
    }
    
    ahkLines.push('; Tekan Enter 3x setelah input pembayaran')
    ahkLines.push('Send, {Enter}')
    ahkLines.push('Sleep, 300')
    ahkLines.push('Send, {Enter}')
    ahkLines.push('Sleep, 300')
    ahkLines.push('Send, {Enter}')
    ahkLines.push('Sleep, 300')
    ahkLines.push('')
    ahkLines.push('; Jeda 1 detik sebelum reset')
    ahkLines.push('Sleep, 1000')
    ahkLines.push('')
    ahkLines.push('; Tekan tombol R 1x untuk reset ke menu utama')
    ahkLines.push('Send, r')
    ahkLines.push('Sleep, 500')
    ahkLines.push('')
  }
  ahkLines.push('Sleep 500')
  ahkLines.push('FileDelete, %A_ScriptFullPath%')
  ahkLines.push('ExitApp')

  return ahkLines.join('\n')
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    
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
        rate: t.rate
      })))
    }
    
    const ahkContent = generateAhkScript(data)
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
