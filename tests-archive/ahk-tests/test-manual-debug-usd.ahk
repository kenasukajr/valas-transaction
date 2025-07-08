; Script AHK Test Manual dengan Debug Info
; Currency Code Test untuk USD

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
MsgBox, 0, Info, Script akan dimulai dalam 3 detik. Pastikan fokus di aplikasi yang benar., 3

Send, {Enter}
Sleep, 500
Send, {Enter}
Sleep, 500

; Data nasabah
data := {}
data["Nama Lengkap"] := "TEST USD CURRENCY"
data["Alamat"] := "Jl. Testing Currency USD"
data["Nomor Telepon"] := "081234567890"
data["Pekerjaan"] := "Currency Tester"
data["Nomor Identitas"] := "1234567890123456"
data["Tempat Tanggal Lahir"] := "Jakarta 01/01/1990"

TypeString(str) {
    Loop Parse, str
    {
        Send %A_LoopField%
        Sleep 50
    }
}

; Isi data nasabah
MsgBox, 0, Info, Mulai mengisi data nasabah..., 2
keys := ["Nama Lengkap", "Alamat", "Nomor Telepon", "Pekerjaan", "Nomor Identitas", "Tempat Tanggal Lahir"]
for index, key in keys
{
    TypeString(data[key])
    Sleep, 100
    Send, {Tab}
    Sleep, 200
}

; === NAVIGASI KE BAGIAN TRANSAKSI ===
MsgBox, 0, Info, Data nasabah selesai. Mulai navigasi ke transaksi..., 3

; Tunggu setelah selesai isi data nasabah
Sleep, 1000

; Pastikan window masih aktif sebelum navigasi
WinActivate, Data Prosesing PT Mulia Bumi Arta
Sleep, 500

MsgBox, 0, Info, Tekan Enter 1x untuk masuk ke bagian transaksi..., 2
; Enter 1x untuk masuk ke bagian transaksi
Send, {Enter}
Sleep, 1500

; Pastikan window masih aktif sebelum isi transaksi
WinActivate, Data Prosesing PT Mulia Bumi Arta
Sleep, 500

; === ISI DATA TRANSAKSI ===
MsgBox, 0, Info, Mulai mengisi currency code USD = 1..., 2

; Isi code currency USD = 1
Send, 1
Sleep, 700

MsgBox, 0, Info, Tekan Enter setelah currency code..., 2
; Enter setelah currency code
Send, {Enter}
Sleep, 1000

MsgBox, 0, Info, Isi amount 1000..., 2
; Isi amount 1000
TypeString("1000")
Sleep, 600
Send, {Enter}
Sleep, 900

MsgBox, 0, Info, Isi rate 15800..., 2
; Isi rate 15800
TypeString("15800")
Sleep, 600
Send, {Enter}
Sleep, 900

MsgBox, 0, Info, Navigasi selesai dengan Arrow Down + Enter..., 2
; Selesai transaksi - navigasi ke selesai
Send, {Down}
Sleep, 600
Send, {Enter}
Sleep, 1200

MsgBox, 0, Success, Script AHK selesai! Data nasabah dan transaksi USD telah diisi.
ExitApp
