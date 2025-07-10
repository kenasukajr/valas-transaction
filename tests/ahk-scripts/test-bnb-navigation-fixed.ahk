; Test Script AHK v2 - Validasi Perbaikan Navigasi Antar Transaksi BNB
; AutoHotkey v2 Script (install AutoHotkey v2 untuk hasil terbaik)
; Download: https://www.autohotkey.com/v2/
#SingleInstance Force

; === TEST MULTIPLE BNB TRANSACTIONS WITH FIXED NAVIGATION ===
; Script ini menguji logic navigasi antar transaksi yang sudah diperbaiki

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
    Send("=== TEST NAVIGASI ANTAR TRANSAKSI BNB ===`n")
    Send("Perbaikan: Enter 4x untuk navigasi antar transaksi`n")
    Send("Test dimulai...`n`n")
}

; === DETEKSI JENIS TRANSAKSI: BNB ===
; Jenis transaksi BNB atau default - langsung lanjut input

Send("{Enter}")
Sleep(200)
Send("{Enter}")
Sleep(200)

; Data Diri (AHK v2 Map)
data := Map()
data["Nama Lengkap"] := "Test User BNB Multi"
data["Alamat"] := "Jl. Test No. 123"
data["Nomor Telepon"] := "081234567890"
data["Pekerjaan"] := "Test Job"
data["Nomor Identitas"] := "1234567890123456"
data["Tempat Tanggal Lahir"] := "Jakarta 01/01/1990"

TypeString(str) {
    Loop Parse, str {
        Send(A_LoopField)
        Sleep(0)
    }
}

; Isi data diri (AHK v2 for-in loop)
keys := ["Nama Lengkap", "Alamat", "Nomor Telepon", "Pekerjaan", "Nomor Identitas", "Tempat Tanggal Lahir"]
for index, key in keys {
    TypeString(data[key])
    Sleep(50)
    if (index < keys.Length) {
        Send("{Tab}")
        Sleep(100)
    }
}

; === NAVIGASI KE BAGIAN TRANSAKSI ===
; Total transaksi yang akan diproses: 3
; Setelah mengisi Tempat Tanggal Lahir, langsung ke transaksi
Sleep(200)

; Pastikan window masih aktif
WinActivate("Data Prosesing PT Mulia Bumi Arta")
Sleep(100)

; Enter 2x untuk navigasi ke field Code Currency (cepat untuk BNB)
Send("{Enter}")
Sleep(100)
Send("{Enter}")
Sleep(100)

; === ISI DATA TRANSAKSI 1 ===
; Debug: Currency input = "USD", Code = 1
; Jenis Transaksi: BNB
; Isi Code Currency USD = 1
Send("1")
Sleep(100)

; Enter 2x untuk navigasi ke field Amount (cepat untuk BNB)
Send("{Enter}")
Sleep(100)
Send("{Enter}")
Sleep(100)

; Isi Amount 100
TypeString("100")
Sleep(100)

; Enter 1x untuk navigasi ke field Exchange Rate (cepat untuk BNB)
Send("{Enter}")
Sleep(100)

; Isi Exchange Rate 15000
TypeString("15000")
Sleep(100)

; Setelah input rate - masih ada transaksi lain BNB: Enter 4x untuk navigasi ke baris berikutnya
Send("{Enter}")
Sleep(100)
Send("{Enter}")
Sleep(100)
Send("{Enter}")
Sleep(100)
Send("{Enter}")  ; Enter tambahan untuk memastikan navigasi ke baris berikutnya
Sleep(200)

; === TRANSAKSI 2 ===
; BNB navigation: Enter 1x tambahan untuk navigasi ke baris berikutnya
; Enter 4x sudah dilakukan di dalam fillTransactionRow
; Tambahkan sedikit delay untuk memastikan UI siap
Sleep(200)
; Pastikan window masih aktif sebelum input currency berikutnya
WinActivate("Data Prosesing PT Mulia Bumi Arta")
Sleep(100)

; === ISI DATA TRANSAKSI 2 ===
; Debug: Currency input = "EUR", Code = 4
; Jenis Transaksi: BNB
; Isi Code Currency EUR = 4
Send("4")
Sleep(100)

; Enter 2x untuk navigasi ke field Amount (cepat untuk BNB)
Send("{Enter}")
Sleep(100)
Send("{Enter}")
Sleep(100)

; Isi Amount 50
TypeString("50")
Sleep(100)

; Enter 1x untuk navigasi ke field Exchange Rate (cepat untuk BNB)
Send("{Enter}")
Sleep(100)

; Isi Exchange Rate 17000
TypeString("17000")
Sleep(100)

; Setelah input rate - masih ada transaksi lain BNB: Enter 4x untuk navigasi ke baris berikutnya
Send("{Enter}")
Sleep(100)
Send("{Enter}")
Sleep(100)
Send("{Enter}")
Sleep(100)
Send("{Enter}")  ; Enter tambahan untuk memastikan navigasi ke baris berikutnya
Sleep(200)

; === TRANSAKSI 3 (TERAKHIR) ===
; BNB navigation: Enter 1x tambahan untuk navigasi ke baris berikutnya
; Enter 4x sudah dilakukan di dalam fillTransactionRow
; Tambahkan sedikit delay untuk memastikan UI siap
Sleep(200)
; Pastikan window masih aktif sebelum input currency berikutnya
WinActivate("Data Prosesing PT Mulia Bumi Arta")
Sleep(100)

; === ISI DATA TRANSAKSI 3 ===
; Debug: Currency input = "GBP", Code = 5
; Jenis Transaksi: BNB
; Isi Code Currency GBP = 5
Send("5")
Sleep(100)

; Enter 2x untuk navigasi ke field Amount (cepat untuk BNB)
Send("{Enter}")
Sleep(100)
Send("{Enter}")
Sleep(100)

; Isi Amount 25
TypeString("25")
Sleep(100)

; Enter 1x untuk navigasi ke field Exchange Rate (cepat untuk BNB)
Send("{Enter}")
Sleep(100)

; Isi Exchange Rate 19000
TypeString("19000")
Sleep(100)

; Setelah input rate - transaksi terakhir BNB: Enter 2x → Down 1x → Enter 1x → 1s delay → Reset R
Send("{Enter}")
Sleep(200)
Send("{Enter}")
Sleep(200)

; Tekan panah ke bawah 1x untuk navigasi selanjutnya
Send("{Down}")
Sleep(300)

; Tekan Enter 1x setelah panah bawah
Send("{Enter}")
Sleep(300)

; Jeda 1 detik sebelum reset
Sleep(1000)

; Tekan tombol R 1x untuk reset ke menu utama
Send("r")
Sleep(500)

; Navigasi selesai - 3 transaksi telah diproses
Sleep(300)

; Script selesai
Sleep(1000)

; Tampilkan pesan sukses
MsgBox("✓ Test navigasi antar transaksi BNB selesai!`n`nPerbaikan yang diterapkan:`n- Enter 4x untuk navigasi antar transaksi BNB`n- Logic berbeda untuk transaksi terakhir`n- Timing yang dioptimalkan", "Test Complete", 64)

ExitApp()
