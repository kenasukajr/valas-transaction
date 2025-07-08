; Script AHK untuk testing manual - Mengisi data nasabah dan transaksi
; Pastikan aplikasi "Data Prosesing PT Mulia Bumi Arta" sudah berjalan

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

; Tunggu 3 detik untuk persiapan
Sleep, 3000

; Data yang akan diisi
data := {}
data["Nama Lengkap"] := "TEST NASABAH AHK"
data["Alamat"] := "Jl. Testing No. 123, Jakarta"
data["Nomor Telepon"] := "081234567890"
data["Pekerjaan"] := "Software Tester"
data["Nomor Identitas"] := "3173051234567890"
data["Tempat Tanggal Lahir"] := "Jakarta 01/01/1990"

transactionData := {}
transactionData["Currency"] := "USD"
transactionData["Amount"] := "500"
transactionData["Rate"] := "15800"

TypeString(str) {
    Loop Parse, str
    {
        Send %A_LoopField%
        Sleep 50
    }
}

; === MENGISI DATA NASABAH ===
MsgBox, 0, Info, Mulai mengisi data nasabah dalam 3 detik..., 3

keys := ["Nama Lengkap", "Alamat", "Nomor Telepon", "Pekerjaan", "Nomor Identitas", "Tempat Tanggal Lahir"]
for index, key in keys
{
    TypeString(data[key])
    Sleep, 100
    Send, {Tab}
    Sleep, 200
}

; === NAVIGASI KE BAGIAN TRANSAKSI ===
MsgBox, 0, Info, Selesai mengisi data nasabah. Navigasi ke transaksi dalam 3 detik..., 3

; Tunggu lebih lama setelah selesai isi data nasabah
Sleep, 1500

; Enter pertama untuk konfirmasi data nasabah
Send, {Enter}
Sleep, 1000

; Enter kedua untuk masuk ke bagian transaksi
Send, {Enter}
Sleep, 1500

; === ISI DATA TRANSAKSI ===
MsgBox, 0, Info, Mulai mengisi data transaksi..., 2

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
TypeString("500")
Sleep, 500
Send, {Enter}
Sleep, 800

; Isi rate
TypeString("15800")
Sleep, 500
Send, {Enter}
Sleep, 800

; Selesai transaksi - navigasi ke selesai
Send, {Down}
Sleep, 500
Send, {Enter}
Sleep, 1000

MsgBox, 0, Success, Script AHK selesai! Data nasabah dan transaksi telah diisi.
ExitApp
