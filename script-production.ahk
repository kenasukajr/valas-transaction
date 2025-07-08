; ==========================================
; SCRIPT AHK PRODUCTION PT MULIA BUMI ARTA
; ==========================================
; Version: 1.4.1
; Author: Puji Purnawan
; Date: 2024
; Description: Otomatis mengisi data nasabah dan transaksi valas
; ==========================================

; === DETEKSI WINDOW APLIKASI ===
IfWinExist, Data Prosesing PT Mulia Bumi Arta
{
    WinRestore, Data Prosesing PT Mulia Bumi Arta
    WinActivate, Data Prosesing PT Mulia Bumi Arta
    WinMaximize, Data Prosesing PT Mulia Bumi Arta
    Sleep, 1000
}
else
{
    MsgBox, 16, Error - Script AHK, Window "Data Prosesing PT Mulia Bumi Arta" tidak ditemukan!`n`nPastikan:`n1. Aplikasi PT Mulia Bumi Arta sudah terbuka`n2. Window name sama persis dengan "Data Prosesing PT Mulia Bumi Arta"`n3. Aplikasi tidak dalam keadaan minimized`n`nScript akan berhenti.
    ExitApp
}

; === PERSIAPAN USER ===
MsgBox, 64, Persiapan Script AHK, Script akan mengisi data nasabah dan transaksi secara otomatis.`n`nPastikan:`n✓ Kursor berada di field NAMA LENGKAP (field pertama)`n✓ Form dalam keadaan kosong/siap diisi`n✓ Tidak ada dialog atau popup yang terbuka`n`nScript akan dimulai dalam 3 detik setelah klik OK., 15

; Tunggu 3 detik untuk persiapan
Sleep, 3000

; === FUNGSI HELPER ===
TypeString(str) {
    Loop Parse, str
    {
        Send %A_LoopField%
        Sleep 25  ; Slight delay untuk menghindari miss character
    }
}

; === DATA NASABAH ===
; Data ini akan diisi otomatis dari generator
data := {}
data["Nama Lengkap"] := "TEST USER"
data["Alamat"] := "Jl. Test No. 123"
data["Nomor Telepon"] := "081234567890"
data["Pekerjaan"] := "Test Job"
data["Nomor Identitas"] := "1234567890123456"
data["Tempat Tanggal Lahir"] := "Jakarta 01/01/1990"

; === PENGISIAN DATA NASABAH ===
; Berdasarkan urutan field di aplikasi PT Mulia Bumi Arta
keys := ["Nama Lengkap", "Alamat", "Nomor Telepon", "Pekerjaan", "Nomor Identitas", "Tempat Tanggal Lahir"]

; Loop untuk mengisi semua field nasabah
Loop, % keys.MaxIndex()
{
    currentKey := keys[A_Index]
    currentValue := data[currentKey]
    
    ; Isi field dengan data
    TypeString(currentValue)
    Sleep, 200
    
    ; Tab ke field berikutnya (kecuali field terakhir)
    if (A_Index < keys.MaxIndex()) {
        Send, {Tab}
        Sleep, 300
    }
}

; === NAVIGASI KE BAGIAN TRANSAKSI ===
; Tunggu setelah selesai isi data nasabah
Sleep, 1200

; Pastikan window masih aktif sebelum navigasi
WinActivate, Data Prosesing PT Mulia Bumi Arta
Sleep, 600

; Navigasi ke tabel transaksi
; Berdasarkan UI aplikasi, mungkin perlu beberapa Tab untuk mencapai tabel transaksi
Send, {Tab}
Sleep, 500
Send, {Tab}
Sleep, 500
Send, {Tab}
Sleep, 500

; === DATA TRANSAKSI ===
; Data ini akan diisi otomatis dari generator
transactionData := {}
transactionData["Currency"] := "USD"
transactionData["Amount"] := "1000"
transactionData["Rate"] := "15750"

; === CURRENCY CODE MAPPING ===
; Mapping berdasarkan aplikasi PT Mulia Bumi Arta
currencyCode := "1"  ; Default USD
if (transactionData["Currency"] = "USD")
    currencyCode := "1"
else if (transactionData["Currency"] = "EUR")
    currencyCode := "2"
else if (transactionData["Currency"] = "GBP")
    currencyCode := "3"
else if (transactionData["Currency"] = "AUD")
    currencyCode := "4"
else if (transactionData["Currency"] = "CAD")
    currencyCode := "5"
else if (transactionData["Currency"] = "CHF")
    currencyCode := "6"
else if (transactionData["Currency"] = "JPY")
    currencyCode := "7"
else if (transactionData["Currency"] = "SGD")
    currencyCode := "8"
else if (transactionData["Currency"] = "SEK")
    currencyCode := "9"
else if (transactionData["Currency"] = "NOK")
    currencyCode := "10"

; === PENGISIAN DATA TRANSAKSI ===
; Field 1: Currency Code
Send, %currencyCode%
Sleep, 700

; Tab ke field Amount
Send, {Tab}
Sleep, 400

; Field 2: Amount
TypeString(transactionData["Amount"])
Sleep, 600

; Tab ke field Exchange Rate
Send, {Tab}
Sleep, 400

; Field 3: Exchange Rate
TypeString(transactionData["Rate"])
Sleep, 600

; Konfirmasi baris transaksi dengan Enter
Send, {Enter}
Sleep, 1200

; === FINALISASI ===
; Tunggu untuk memastikan semua data tersimpan
Sleep, 1000

; Pesan sukses
MsgBox, 64, Script AHK Selesai, Data telah berhasil diisi!`n`nData Nasabah:`n• Nama: %data["Nama Lengkap"]%`n• Alamat: %data["Alamat"]%`n• Telepon: %data["Nomor Telepon"]%`n• Pekerjaan: %data["Pekerjaan"]%`n• ID: %data["Nomor Identitas"]%`n• TTL: %data["Tempat Tanggal Lahir"]%`n`nData Transaksi:`n• Currency: %transactionData["Currency"]% (Code: %currencyCode%)`n• Amount: %transactionData["Amount"]%`n• Rate: %transactionData["Rate"]%`n`nSilakan periksa kembali data yang telah diisi.

; Auto-delete script setelah selesai untuk keamanan
FileDelete, %A_ScriptFullPath%

; Exit aplikasi
ExitApp

; === ERROR HANDLING ===
; Jika terjadi error, tampilkan pesan dan keluar
OnError("ErrorHandler")
return

ErrorHandler(exception) {
    MsgBox, 16, Error Script AHK, Terjadi error saat menjalankan script:`n`n%exception.message%`n`nScript akan berhenti.
    FileDelete, %A_ScriptFullPath%
    ExitApp
}
