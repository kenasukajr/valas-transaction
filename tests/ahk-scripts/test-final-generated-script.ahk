; Test script verifikasi akhir untuk memastikan urutan dan syntax benar
; Generated berdasarkan generator route.ts

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
    MsgBox, 16, Error, Window "Data Prosesing PT Mulia Bumi Arta" tidak ditemukan. Pastikan program sudah berjalan.
    ExitApp
}

; === MULAI INPUT DATA ===
Send, {Enter}
Sleep, 500
Send, {Enter}
Sleep, 500

; === INPUT DATA NASABAH ===
TypeString("NASABAH TEST")
Sleep, 100
Send, {Tab}
Sleep, 200
TypeString("Alamat Test")
Sleep, 100
Send, {Tab}
Sleep, 200
TypeString("081234567890")
Sleep, 100
Send, {Tab}
Sleep, 200
TypeString("Pegawai Test")
Sleep, 100
Send, {Tab}
Sleep, 200
TypeString("1234567890123456")
Sleep, 100
Send, {Tab}
Sleep, 200
TypeString("Jakarta 01/01/1990")

; === NAVIGASI KE BAGIAN TRANSAKSI ===
Sleep, 1000
WinActivate, Data Prosesing PT Mulia Bumi Arta
Sleep, 500
Send, {Enter}
Sleep, 1500
WinActivate, Data Prosesing PT Mulia Bumi Arta
Sleep, 500

; === ISI DATA TRANSAKSI BNS ===
; === INPUT CODE CURRENCY USD = 1 ===
Send, 1
Sleep, 700

; Enter setelah currency code
Send, {Enter}
Sleep, 1000

; === INPUT AMOUNT: 1000 ===
TypeString("1000")
Sleep, 600
Send, {Enter}
Sleep, 900

; === INPUT RATE: 15800 ===
TypeString("15800")
Sleep, 600
Send, {Enter}
Sleep, 900

; === SELESAI TRANSAKSI ===
Send, {Down}
Sleep, 600
Send, {Enter}
Sleep, 1200

; === SCRIPT SELESAI ===
Sleep, 500
MsgBox, 0, Info, Test script selesai! Urutan dan syntax sudah benar., 3
FileDelete, %A_ScriptFullPath%
ExitApp
