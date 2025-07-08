import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

// Helper to escape double quotes in AHK strings
function ahkEscape(str: string) {
  return (str || '').replace(/"/g, '""');
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    // data: { name, address, phone, job, idNumber, birthPlace, birthDate, transactionType, transactions: [] }
    
    // Currency code mapping
    const currencyMapping: { [key: string]: string } = {
      'USD': '1', 'EUR': '2', 'GBP': '3', 'AUD': '4', 'CAD': '5',
      'CHF': '6', 'JPY': '7', 'SGD': '8', 'SEK': '9', 'NOK': '10',
      'DKK': '11', 'HKD': '12', 'NZD': '13', 'KRW': '14', 'MYR': '15',
      'THB': '16', 'SAR': '17', 'AED': '18', 'BND': '19', 'CNY': '20',
      'TWD': '21', 'INR': '22', 'PKR': '23', 'LKR': '24', 'VND': '25',
      'KHR': '26', 'LAK': '27', 'MMK': '28', 'BDT': '29', 'NPR': '30',
      'QAR': '31', 'KWD': '32', 'BHD': '33', 'OMR': '34', 'JOD': '35'
    };

    // Ambil data transaksi dari array transactions atau fallback ke single transaction
    const transactions = data.transactions || [
      {
        currency: data.currency || 'USD',
        amount: data.amount || '100.00',
        rate: data.rate || '15750.00'
      }
    ];

    // Generate AHK script dengan multiple transaksi
    let transactionScript = '';
    transactions.forEach((transaction: any, index: number) => {
      const currencyCode = currencyMapping[transaction.currency] || '1';
      
      if (index > 0) {
        // Jika bukan transaksi pertama, tambah baris baru
        transactionScript += `
    ; === TRANSAKSI ${index + 1}: ${transaction.currency} ===
    ; Tambah baris baru untuk transaksi berikutnya
    Send, {F2}
    Sleep, 800
    `;
      } else {
        transactionScript += `
    ; === TRANSAKSI ${index + 1}: ${transaction.currency} ===`;
      }
      
      transactionScript += `
    ; Isi currency code
    Send, ${currencyCode}
    Sleep, 500

    ; Enter pertama setelah currency code
    Send, {Enter}
    Sleep, 800

    ; Enter kedua untuk konfirmasi currency
    Send, {Enter}
    Sleep, 1000

    ; Isi amount
    TypeString("${ahkEscape(transaction.amount)}")
    Sleep, 500
    Send, {Enter}
    Sleep, 800

    ; Isi rate
    TypeString("${ahkEscape(transaction.rate)}")
    Sleep, 500
    Send, {Enter}
    Sleep, 800
    `;
    });

    const ahk = `; Auto-generated AutoHotkey script to input form data and multiple transactions
^t::
{
    ; Deteksi window aplikasi
    IfWinExist, Data Prosesing PT Mulia Bumi Arta
    {
        WinRestore, Data Prosesing PT Mulia Bumi Arta
        WinActivate, Data Prosesing PT Mulia Bumi Arta
        WinMaximize, Data Prosesing PT Mulia Bumi Arta
        Sleep, 1000
    }
    else
    {
        MsgBox, 16, Error, Window "Data Prosesing PT Mulia Bumi Arta" tidak ditemukan!
        ExitApp
    }

    ; Pilih jenis transaksi
    jenisTransaksi := "${ahkEscape(data.transactionType || 'BNB')}"

    ; Data nasabah
    data := {}
    data["Nama Lengkap"] := "${ahkEscape(data.name)}"
    data["Alamat"] := "${ahkEscape(data.address)}"
    data["Nomor Telepon"] := "${ahkEscape(data.phone)}"
    data["Pekerjaan"] := "${ahkEscape(data.job)}"
    data["Nomor Identitas"] := "${ahkEscape(data.idNumber)}"
    data["Tempat Tanggal Lahir"] := "${ahkEscape((data.birthPlace || '') + ' ' + (data.birthDate || '')).trim()}"

    TypeString(str) {
        Loop Parse, str
        {
            Send %A_LoopField%
            Sleep 25
        }
    }

    ; Pilih jenis transaksi jika BNS
    if (jenisTransaksi = "BNS") {
        Send {Right}
        Sleep 200
        Send {Enter}
        Sleep 300
    }

    ; === PENGISIAN DATA NASABAH ===
    keys := ["Nama Lengkap", "Alamat", "Nomor Telepon", "Pekerjaan", "Nomor Identitas", "Tempat Tanggal Lahir"]
    for index, key in keys
    {
        TypeString(data[key])
        Sleep 200
        Send {Tab}
        Sleep 200
    }

    ; === NAVIGASI KE BAGIAN TRANSAKSI ===
    Sleep, 1500
    WinActivate, Data Prosesing PT Mulia Bumi Arta
    Sleep, 500

    ; Enter pertama untuk konfirmasi data nasabah
    Send, {Enter}
    Sleep, 1000

    ; Enter kedua untuk masuk ke bagian transaksi
    Send, {Enter}
    Sleep, 1500

    ; === PENGISIAN MULTIPLE TRANSAKSI ===
    ${transactionScript}

    ; Selesai semua transaksi - navigasi ke selesai
    Send, {Down}
    Sleep, 500
    Send, {Enter}
    Sleep, 1000

    ; Pesan sukses
    MsgBox, 64, Script AHK Selesai, Data telah berhasil diisi! Total transaksi: ${transactions.length}

    Sleep, 500
    FileDelete, %A_ScriptFullPath%
    ExitApp
}
`;
    const ahkPath = path.resolve(process.cwd(), 'tools', 'autohotkey', 'auto_type_form.ahk');
    await fs.promises.writeFile(ahkPath, ahk, 'utf-8');
    
    // Return the AHK file as downloadable blob
    return new NextResponse(ahk, {
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': 'attachment; filename="script.ahk"',
      },
    });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to generate AHK', detail: String(e) }, { status: 500 });
  }
}
