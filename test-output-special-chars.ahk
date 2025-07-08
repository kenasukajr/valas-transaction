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
data["Nama Lengkap"] := "SRI MULYANI S.Kom"
data["Alamat"] := "Jl. H.R. Rasuna Said No. 1-2, RT.01/RW.02"
data["Nomor Telepon"] := "+62-21-1234567"
data["Pekerjaan"] := "IT Specialist & Developer"
data["Nomor Identitas"] := "3201234567890123"
data["Tempat Tanggal Lahir"] := "Surabaya 31/12/1988"

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
Send, 5
Sleep, 500

; Enter pertama setelah currency code
Send, {Enter}
Sleep, 800

; Enter kedua untuk konfirmasi currency
Send, {Enter}
Sleep, 1000

; Isi amount
TypeString("100,000")
Sleep, 500
Send, {Enter}
Sleep, 800

; Isi rate
TypeString("105.50")
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