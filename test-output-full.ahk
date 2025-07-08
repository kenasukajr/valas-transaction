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
data["Alamat"] := "Jl. Sudirman No. 123, Jakarta Pusat, DKI Jakarta 10110"
data["Nomor Telepon"] := "081234567890"
data["Pekerjaan"] := "Software Engineer"
data["Nomor Identitas"] := "3173051234567890"
data["Tempat Tanggal Lahir"] := "Jakarta 15/05/1990"

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
; Tunggu lebih lama setelah selesai isi data nasabah
Sleep, 1500

; Enter pertama untuk konfirmasi data nasabah
Send, {Enter}
Sleep, 1000

; Enter kedua untuk masuk ke bagian transaksi
Send, {Enter}
Sleep, 1500

; === ISI DATA TRANSAKSI ===
; Isi code currency (1=USD, 2=AUD, dst)
Send, 1
Sleep, 500

; Enter pertama setelah currency code
Send, {Enter}
Sleep, 800

; Enter kedua untuk konfirmasi currency
Send, {Enter}
Sleep, 1000

; Isi amount
TypeString("1000")
Sleep, 500
Send, {Enter}
Sleep, 800

; Isi rate
TypeString("15750")
Sleep, 500
Send, {Enter}
Sleep, 800

; Selesai transaksi - navigasi ke selesai
Send, {Down}
Sleep, 500
Send, {Enter}
Sleep, 1000
Sleep 500
FileDelete, %A_ScriptFullPath%
ExitApp