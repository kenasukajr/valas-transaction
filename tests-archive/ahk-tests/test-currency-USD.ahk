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
data["Alamat"] := "Jl. Sudirman No. 123, Jakarta Pusat"
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
; Setelah mengisi data nasabah, navigasi ke bagian transaksi
Sleep, 1000

; Pastikan window masih aktif
WinActivate, Data Prosesing PT Mulia Bumi Arta
Sleep, 500

; Navigasi ke tabel transaksi dengan Tab
; Mungkin perlu beberapa Tab tergantung UI aplikasi
Send, {Tab}
Sleep, 400
Send, {Tab}
Sleep, 400
Send, {Tab}
Sleep, 400

; === ISI DATA TRANSAKSI ===
; Isi Code Currency USD = 1
Send, 1
Sleep, 600

; Tab ke field Amount
Send, {Tab}
Sleep, 400

; Isi Amount 1000
TypeString("1000")
Sleep, 500

; Tab ke field Exchange Rate
Send, {Tab}
Sleep, 400

; Isi Exchange Rate 15750
TypeString("15750")
Sleep, 500

; Enter untuk konfirmasi baris transaksi
Send, {Enter}
Sleep, 1000

; Navigasi selesai - tunggu untuk memastikan data tersimpan
Sleep, 800
Sleep 500
FileDelete, %A_ScriptFullPath%
ExitApp