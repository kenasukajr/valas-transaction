; Script test final berdasarkan auto_type_form.ahk yang benar
; Generated dari generator route.ts yang sudah diperbaiki

#NoEnv
#SingleInstance Force
#Persistent

; === FUNGSI TYPESTRING ===
TypeString(str) {
    Loop Parse, str
    {
        Send %A_LoopField%
        Sleep 0
    }
}

; === CEK WINDOW ===
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

; === DETEKSI JENIS TRANSAKSI: BNB ===
; Jenis transaksi BNB atau default - langsung lanjut input

Send, {Enter}
Sleep, 200
Send, {Enter}
Sleep, 200

; === INPUT DATA NASABAH ===
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

; === SELESAI TRANSAKSI BNB ===
; Implementasi baru: Enter 2x → Down 1x → Enter 1x → 1s delay → Reset R
; Setelah transaksi BNB selesai dan tidak ada data yang diinput lagi
Send, {Enter}
Sleep, 200
Send, {Enter}
Sleep, 200

; Tekan panah ke bawah 1x untuk navigasi selanjutnya
Send, {Down}
Sleep, 300

; Tekan Enter 1x setelah panah bawah
Send, {Enter}
Sleep, 300

; Jeda 1 detik sebelum reset
Sleep, 1000

; Tekan tombol R 1x untuk reset ke menu utama
Send, r
Sleep, 500

; === SCRIPT SELESAI ===
; Tunggu sebentar sebelum script selesai
Sleep, 1000
MsgBox, 0, Test Complete, Script test selesai! Generator sudah mengikuti auto_type_form.ahk dengan benar., 3
FileDelete, %A_ScriptFullPath%
ExitApp
