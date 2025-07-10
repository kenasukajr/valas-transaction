; Test script untuk memverifikasi generator tidak error
; Berdasarkan generator route.ts yang sudah diperbaiki

TypeString(str) {
    Loop Parse, str
    {
        Send %A_LoopField%
        Sleep 5
    }
}

IfWinExist, Data Prosesing PT Mulia Bumi Arta
{
    WinRestore, Data Prosesing PT Mulia Bumi Arta
    WinActivate, Data Prosesing PT Mulia Bumi Arta
    WinMaximize, Data Prosesing PT Mulia Bumi Arta
}
else
{
    MsgBox, 16, Error, Window "Data Prosesing PT Mulia Bumi Arta" tidak ditemukan. Pastikan program sudah berjalan., 5
    ExitApp
}

; === DETEKSI JENIS TRANSAKSI: BNS ===
; Jenis transaksi BNS - tekan panah kanan 1x SEBELUM memulai script
Send, {Right}
Sleep, 300

Send, {Enter}
Sleep, 200
Send, {Enter}
Sleep, 200

; Data nasabah menggunakan array seperti routeold.ts
data := {}
data["Nama Lengkap"] := "PUJI PURNAWAN"
data["Alamat"] := "VILLA BANGUNTAPAN 2 NO E5 SAMPANGAN WIROKERTEN BANGUNTAPAN BANTUL YOGY"
data["Nomor Telepon"] := "085878813372"
data["Pekerjaan"] := "SWASTA"
data["Nomor Identitas"] := "3401121406910001"
data["Tempat Tanggal Lahir"] := "MAGELANG 14/06/1991"

keys := ["Nama Lengkap", "Alamat", "Nomor Telepon", "Pekerjaan", "Nomor Identitas", "Tempat Tanggal Lahir"]
for index, key in keys
{
    TypeString(data[key])
    Sleep 50
    if (index < keys.MaxIndex())
    {
        Send {Tab}
        Sleep 100
    }
}

; === NAVIGASI KE BAGIAN TRANSAKSI ===
; Total transaksi yang akan diproses: 1
; Setelah mengisi Tempat Tanggal Lahir, langsung ke transaksi
Sleep, 200

; Pastikan window masih aktif
WinActivate, Data Prosesing PT Mulia Bumi Arta
Sleep, 100

; Enter 2x untuk navigasi ke field Code Currency (normal untuk BNS)
Send, {Enter}
Sleep, 200
Send, {Enter}
Sleep, 200

; === ISI DATA TRANSAKSI 1 ===
; Debug: Currency input = "USD", Code = 1
; Jenis Transaksi: BNS

; Isi Code Currency USD = 1
Send, 1
Sleep, 200

; Enter 2x untuk navigasi ke field Amount (normal untuk BNS)
Send, {Enter}
Sleep, 200
Send, {Enter}
Sleep, 200

; Isi Amount 1000
TypeString("1000")
Sleep, 100

; Enter 1x untuk navigasi ke field Exchange Rate (normal untuk BNS)
Send, {Enter}
Sleep, 200

; Isi Exchange Rate 15750
TypeString("15750")
Sleep, 100

; Setelah input rate: Enter 3x
Send, {Enter}
Sleep, 100
Send, {Enter}
Sleep, 100
Send, {Enter}
Sleep, 200

; Navigasi selesai - 1 transaksi telah diproses
Sleep, 300

; === SELESAI TRANSAKSI BNS ===
; Setelah transaksi selesai: navigasi ke pembayaran

; Tekan panah ke bawah 1x untuk navigasi ke pembayaran
Send, {Down}
Sleep, 500

; Tekan Enter 1x untuk masuk ke field pembayaran
Send, {Enter}
Sleep, 500

; Masukkan data pembayaran: 15750000 (kalkulasi otomatis)
TypeString("15750000")
Sleep, 300

; Tekan Enter 3x setelah input pembayaran
Send, {Enter}
Sleep, 300
Send, {Enter}
Sleep, 300
Send, {Enter}
Sleep, 300

; Jeda 1 detik sebelum reset
Sleep, 1000

; Tekan tombol R 1x untuk reset ke menu utama
Send, r
Sleep, 500

; === SCRIPT SELESAI ===
Sleep 500
MsgBox, 0, Test Complete, Script test berhasil! Tidak ada error syntax., 3
FileDelete, %A_ScriptFullPath%
ExitApp
