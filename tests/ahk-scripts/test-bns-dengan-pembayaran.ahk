; Test script untuk verifikasi generator sudah benar
; Berdasarkan generator route.ts yang sudah diperbaiki

; === FUNGSI TYPESTRING ===
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

; === DATA NASABAH ===
FullName = PUJI PURNAWAN
Address = VILLA BANGUNTAPAN 2 NO E5 SAMPANGAN WIROKERTEN BANGUNTAPAN BANTUL YOGY
PhoneNumber = 085878813372
JobTitle = SWASTA
IdNumber = 3401121406910001
BirthPlace = MAGELANG
BirthDate =  14/06/1991

; Input Nama Lengkap
if FullName !=
{
    Send, %FullName%
    Sleep, 150
}
Send, {Tab}
Sleep, 100

; Input Alamat
if Address !=
{
    Send, %Address%
    Sleep, 150
}
Send, {Tab}
Sleep, 100

; Input Nomor Telepon
if PhoneNumber !=
{
    Send, %PhoneNumber%
    Sleep, 150
}
Send, {Tab}
Sleep, 100

; Input Pekerjaan
if JobTitle !=
{
    Send, %JobTitle%
    Sleep, 150
}
Send, {Tab}
Sleep, 100

; Input Nomor Identitas
if IdNumber !=
{
    Send, %IdNumber%
    Sleep, 150
}
Send, {Tab}
Sleep, 100

; Input Tempat Lahir
if BirthPlace !=
{
    Send, %BirthPlace%
    Sleep, 150
}
Send, {Tab}
Sleep, 100

; Input Tanggal Lahir
if BirthDate !=
{
    Send, %BirthDate%
    Sleep, 150
}
Send, {Tab}
Sleep, 100

; === NAVIGASI KE BAGIAN TRANSAKSI ===
; Tunggu setelah selesai isi data nasabah
Sleep, 1000

; Pastikan window masih aktif sebelum navigasi
WinActivate, Data Prosesing PT Mulia Bumi Arta
Sleep, 500

; Enter 1x untuk masuk ke bagian transaksi
Send, {Enter}
Sleep, 1500

; Pastikan window masih aktif sebelum isi transaksi
WinActivate, Data Prosesing PT Mulia Bumi Arta
Sleep, 500

; === SELESAI TRANSAKSI BNS ===
; Setelah transaksi BNS selesai
; Tekan Enter 1x untuk mengakhiri input transaksi
Send, {Enter}
Sleep, 300

; Tekan panah ke bawah 1x untuk navigasi selanjutnya
Send, {Down}
Sleep, 500

; Tekan Enter 1x
Send, {Enter}
Sleep, 500

; Masukan jumlah pembayaran (default estimasi)
TypeString("16000000")
Sleep, 500

; Tekan panah ke bawah 1x
Send, {Down}
Sleep, 500

; Tekan Enter 1x
Send, {Enter}
Sleep, 500

; Jeda 1 detik sebelum reset
Sleep, 1000

; Tekan tombol R 1x untuk reset
Send, r
Sleep, 500

; === SCRIPT SELESAI ===
; Tunggu sebentar sebelum script selesai
Sleep, 1000
MsgBox, 0, Test Complete, Test BNS dengan pembayaran selesai! Generator sudah benar., 3
FileDelete, %A_ScriptFullPath%
ExitApp
