; Test Script AHK v2 - Validasi Perbaikan Navigasi BNS Multiple Transactions
; AutoHotkey v2 Script (install AutoHotkey v2 untuk hasil terbaik)
; Download: https://www.autohotkey.com/v2/
#SingleInstance Force

; === TEST MULTIPLE BNS TRANSACTIONS WITH FIXED NAVIGATION ===
; Script ini menguji logic navigasi antar transaksi BNS yang sudah diperbaiki

; FUNGSI TYPESTRING (AHK v2)
TypeString(str) {
    for index, char in StrSplit(str)
    {
        Send(char)
        Sleep(5)
    }
}

if WinExist("Data Prosesing PT Mulia Bumi Arta") {
    WinRestore("Data Prosesing PT Mulia Bumi Arta")
    WinActivate("Data Prosesing PT Mulia Bumi Arta")
    WinMaximize("Data Prosesing PT Mulia Bumi Arta")
} else {
    MsgBox("Window `"Data Prosesing PT Mulia Bumi Arta`" tidak ditemukan.`n`nTest akan menggunakan Notepad sebagai simulasi.", "Test Mode", 64)
    
    ; Buka Notepad untuk simulasi test
    Run("notepad.exe")
    Sleep(2000)
    WinActivate("Notepad")
    
    ; Tulis header test
    Send("=== TEST NAVIGASI ANTAR TRANSAKSI BNS ===`n")
    Send("Perbaikan: Logic navigasi antar transaksi untuk BNS`n")
    Send("Test dimulai...`n`n")
}

; === DETEKSI JENIS TRANSAKSI: BNS ===
; Jenis transaksi BNS - tekan panah kanan 1x SEBELUM memulai script
Send("{Right}")
Sleep(300)

Send("{Enter}")
Sleep(200)
Send("{Enter}")
Sleep(200)

; Data Diri (AHK v2 Map)
data := Map()
data["Nama Lengkap"] := "Test User BNS Multi"
data["Alamat"] := "Jl. Test BNS No. 456"
data["Nomor Telepon"] := "081234567890"
data["Pekerjaan"] := "Test Job BNS"
data["Nomor Identitas"] := "1234567890123456"
data["Tempat Tanggal Lahir"] := "Surabaya 15/05/1985"

; Input data step by step menggunakan loop AHK v2
keys := ["Nama Lengkap", "Alamat", "Nomor Telepon", "Pekerjaan", "Nomor Identitas", "Tempat Tanggal Lahir"]
for index, key in keys
{
    TypeString(data[key])
    Sleep(50)
    if (index < keys.Length)
    {
        Send("{Tab}")
        Sleep(100)
    }
}

; === NAVIGASI KE BAGIAN TRANSAKSI ===
; Total transaksi yang akan diproses: 4
; Setelah mengisi Tempat Tanggal Lahir, langsung ke transaksi
Sleep(200)

; Pastikan window masih aktif
WinActivate("Data Prosesing PT Mulia Bumi Arta")
Sleep(100)

; Enter 2x untuk navigasi ke field Code Currency (normal untuk BNS)
Send("{Enter}")
Sleep(200)
Send("{Enter}")
Sleep(200)

; === ISI DATA TRANSAKSI 1 ===
; Debug: Currency input = "USD", Code = 1
; Jenis Transaksi: BNS
; Isi Code Currency USD = 1
Send("1")
Sleep(200)

; Enter 2x untuk navigasi ke field Amount (normal untuk BNS)
Send("{Enter}")
Sleep(200)
Send("{Enter}")
Sleep(200)

; Isi Amount 200
TypeString("200")
Sleep(100)

; Enter 1x untuk navigasi ke field Exchange Rate (normal untuk BNS)
Send("{Enter}")
Sleep(200)

; Isi Exchange Rate 15500
TypeString("15500")
Sleep(100)

; Setelah input rate: Enter 3x
Send("{Enter}")
Sleep(100)
Send("{Enter}")
Sleep(100)
Send("{Enter}")
Sleep(200)

; === NAVIGASI KE BARIS TRANSAKSI 2 (NORMAL) ===
; BNS navigation: timing khusus untuk stabilitas
; Masih ada transaksi lain - Enter 1x lalu ketik code currency
Send("{Enter}")
Sleep(500)  ; Increase dari 200 ke 500 untuk BNS
; Pastikan window masih aktif sebelum input currency
WinActivate("Data Prosesing PT Mulia Bumi Arta")
Sleep(200)

; === ISI DATA TRANSAKSI 2 ===
; Debug: Currency input = "EUR", Code = 4
; Jenis Transaksi: BNS
; Isi Code Currency EUR = 4
Send("4")
Sleep(200)

; Enter 2x untuk navigasi ke field Amount (normal untuk BNS)
Send("{Enter}")
Sleep(200)
Send("{Enter}")
Sleep(200)

; Isi Amount 100
TypeString("100")
Sleep(100)

; Enter 1x untuk navigasi ke field Exchange Rate (normal untuk BNS)
Send("{Enter}")
Sleep(200)

; Isi Exchange Rate 17500
TypeString("17500")
Sleep(100)

; Setelah input rate: Enter 3x
Send("{Enter}")
Sleep(100)
Send("{Enter}")
Sleep(100)
Send("{Enter}")
Sleep(200)

; === NAVIGASI KE BARIS TRANSAKSI 3 (NORMAL) ===
; BNS navigation: timing khusus untuk stabilitas
; Masih ada transaksi lain - Enter 1x lalu ketik code currency
Send("{Enter}")
Sleep(500)  ; Increase dari 200 ke 500 untuk BNS
; Pastikan window masih aktif sebelum input currency
WinActivate("Data Prosesing PT Mulia Bumi Arta")
Sleep(200)

; === ISI DATA TRANSAKSI 3 ===
; Debug: Currency input = "GBP", Code = 5
; Jenis Transaksi: BNS
; Isi Code Currency GBP = 5
Send("5")
Sleep(200)

; Enter 2x untuk navigasi ke field Amount (normal untuk BNS)
Send("{Enter}")
Sleep(200)
Send("{Enter}")
Sleep(200)

; Isi Amount 50
TypeString("50")
Sleep(100)

; Enter 1x untuk navigasi ke field Exchange Rate (normal untuk BNS)
Send("{Enter}")
Sleep(200)

; Isi Exchange Rate 19500
TypeString("19500")
Sleep(100)

; Setelah input rate: Enter 3x
Send("{Enter}")
Sleep(100)
Send("{Enter}")
Sleep(100)
Send("{Enter}")
Sleep(200)

; === NAVIGASI KE BARIS TRANSAKSI 4 (NORMAL) ===
; BNS navigation: timing khusus untuk stabilitas
; Masih ada transaksi lain - Enter 1x lalu ketik code currency
Send("{Enter}")
Sleep(500)  ; Increase dari 200 ke 500 untuk BNS
; Pastikan window masih aktif sebelum input currency
WinActivate("Data Prosesing PT Mulia Bumi Arta")
Sleep(200)

; === ISI DATA TRANSAKSI 4 (TERAKHIR) ===
; Debug: Currency input = "SGD", Code = 8
; Jenis Transaksi: BNS
; Isi Code Currency SGD = 8
Send("8")
Sleep(200)

; Enter 2x untuk navigasi ke field Amount (normal untuk BNS)
Send("{Enter}")
Sleep(200)
Send("{Enter}")
Sleep(200)

; Isi Amount 300
TypeString("300")
Sleep(100)

; Enter 1x untuk navigasi ke field Exchange Rate (normal untuk BNS)
Send("{Enter}")
Sleep(200)

; Isi Exchange Rate 11000
TypeString("11000")
Sleep(100)

; Setelah input rate: Enter 3x (transaksi terakhir BNS)
Send("{Enter}")
Sleep(100)
Send("{Enter}")
Sleep(100)
Send("{Enter}")
Sleep(200)

; Navigasi selesai - 4 transaksi telah diproses
Sleep(300)

; === SELESAI TRANSAKSI BNS ===
; Setelah transaksi selesai: navigasi ke pembayaran

; Tekan panah ke bawah 1x untuk navigasi ke pembayaran
Send("{Down}")
Sleep(500)

; Tekan Enter 1x untuk masuk ke field pembayaran
Send("{Enter}")
Sleep(500)

; Masukkan data pembayaran: 4825000 (total calculated)
TypeString("4825000")
Sleep(300)

; Tekan Enter 3x setelah input pembayaran
Send("{Enter}")
Sleep(300)
Send("{Enter}")
Sleep(300)
Send("{Enter}")
Sleep(300)

; Jeda 1 detik sebelum reset
Sleep(1000)

; Tekan tombol R 1x untuk reset ke menu utama
Send("r")
Sleep(500)

; === SCRIPT SELESAI ===
Sleep(1000)

; Tampilkan pesan sukses
MsgBox("✓ Test navigasi antar transaksi BNS selesai!`n`nPerbaikan yang diterapkan:`n- Enter 1x + Sleep 500ms untuk navigasi antar transaksi BNS`n- Logic berbeda dengan BNB`n- Payment flow di akhir transaksi`n- WinActivate untuk memastikan window focus", "Test Complete", 64)

ExitApp()
