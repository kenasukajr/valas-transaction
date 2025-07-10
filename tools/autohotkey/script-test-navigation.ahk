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

Send, {Enter}
Sleep, 500
Send, {Enter}
Sleep, 500

data := {}
NamaLengkap = NASABAH TEST
Alamat = Alamat Test
NomorTelepon = 081234567890
Pekerjaan = Pegawai Test
NomorIdentitas = 1234567890123456
TempatTanggalLahir = Jakarta 01/01/1990

TypeString(str) {
    Loop Parse, str
    {
        Send %A_LoopField%
        Sleep 0
    }
}

TypeString(NamaLengkap)
    Sleep 100
    Send {Tab}
    Sleep 200
    TypeString(Alamat)
    Sleep 100
    Send {Tab}
    Sleep 200
    TypeString(NomorTelepon)
    Sleep 100
    Send {Tab}
    Sleep 200
    TypeString(Pekerjaan)
    Sleep 100
    Send {Tab}
    Sleep 200
    TypeString(NomorIdentitas)
    Sleep 100
    Send {Tab}
    Sleep 200
    TypeString(TempatTanggalLahir)
}

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

; === ISI DATA TRANSAKSI ===
; Isi code currency USD = 1
Send, 1
Sleep, 700

; Enter setelah currency code
Send, {Enter}
Sleep, 1000

; Isi amount 1000
TypeString("1000")
Sleep, 600
Send, {Enter}
Sleep, 900

; Isi rate 15800
TypeString("15800")
Sleep, 600
Send, {Enter}
Sleep, 900

; Selesai transaksi - navigasi ke selesai
Send, {Down}
Sleep, 600
Send, {Enter}
Sleep, 1200
Sleep 500
FileDelete, %A_ScriptFullPath%
ExitApp