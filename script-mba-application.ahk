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
data["Nama Lengkap"] := "PUJI PURNAWAN"
data["Alamat"] := "VILLA BANGUNTAPAN 2 NO E5 SAMPANGAN WIROKERTEN BANGUNTAPAN BANTUL"
data["Nomor Telepon"] := "085878813372"
data["Pekerjaan"] := "SWASTA"
data["Nomor Identitas"] := "3401121406910001"
data["Tempat Tanggal Lahir"] := "JOGA 14/06/1991"

TypeString(str) {
    Loop Parse, str
    {
        Send %A_LoopField%
        Sleep 0
    }
}

keys := ["Nama Lengkap", "Alamat", "Nomor Telepon", "Pekerjaan", "Nomor Identitas", "Tempat Tanggal Lahir"]
for index, key in keys
{
    TypeString(data[key])
    Sleep 100
    Send {Tab}
    Sleep 200
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

; Isi amount 100.00
TypeString("100.00")
Sleep, 600
Send, {Enter}
Sleep, 900

; Isi rate 16100.00
TypeString("16100.00")
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