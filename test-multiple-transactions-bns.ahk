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

; === DETEKSI JENIS TRANSAKSI: BNS ===
; Jenis transaksi BNS - tekan panah kanan 1x SEBELUM memulai script
Send, {Right}
Sleep, 300

Send, {Enter}
Sleep, 500
Send, {Enter}
Sleep, 500

data := {}
data["Nama Lengkap"] := "TEST USER"
data["Alamat"] := "TEST ADDRESS"
data["Nomor Telepon"] := "081234567890"
data["Pekerjaan"] := "SWASTA"
data["Nomor Identitas"] := "1234567890123456"
data["Tempat Tanggal Lahir"] := "JAKARTA 01/01/1990"

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
    Sleep 50
    if (index < keys.MaxIndex())
    {
        Send {Tab}
        Sleep 100
    }
}

; === NAVIGASI KE BAGIAN TRANSAKSI ===
; Total transaksi yang akan diproses: 3
; Setelah mengisi Tempat Tanggal Lahir, langsung ke transaksi
Sleep, 200

; Pastikan window masih aktif
WinActivate, Data Prosesing PT Mulia Bumi Arta
Sleep, 100

; Enter 2x untuk navigasi ke field Code Currency (tanpa delay)
Send, {Enter}
Sleep, 200
Send, {Enter}
Sleep, 200

; === ISI DATA TRANSAKSI 1 ===
; Debug: Currency input = "USD", Code = -1
; Jenis Transaksi: BNS
; Isi Code Currency USD = -1
Send, -1
Sleep, 200

; Enter 2x untuk navigasi ke field Amount (cepat)
Send, {Enter}
Sleep, 200
Send, {Enter}
Sleep, 200

; Isi Amount 1000
TypeString("1000")
Sleep, 100

; Enter 1x untuk navigasi ke field Exchange Rate (cepat)
Send, {Enter}
Sleep, 200

; Isi Exchange Rate 15750
TypeString("15750")
Sleep, 100

; Enter untuk konfirmasi baris transaksi
Send, {Enter}
Sleep, 300

; === NAVIGASI KE BARIS TRANSAKSI 2 (NORMAL) ===
; BNS navigation: timing khusus untuk stabilitas
Send, {Enter}
Sleep, 500
Send, {Enter}
Sleep, 500
; Pastikan window masih aktif sebelum input currency
WinActivate, Data Prosesing PT Mulia Bumi Arta
Sleep, 200

; === ISI DATA TRANSAKSI 2 ===
; Debug: Currency input = "EUR", Code = 4
; Jenis Transaksi: BNS
; Isi Code Currency EUR = 4
Send, 4
Sleep, 200

; Enter 2x untuk navigasi ke field Amount (cepat)
Send, {Enter}
Sleep, 200
Send, {Enter}
Sleep, 200

; Isi Amount 500
TypeString("500")
Sleep, 100

; Enter 1x untuk navigasi ke field Exchange Rate (cepat)
Send, {Enter}
Sleep, 200

; Isi Exchange Rate 17200
TypeString("17200")
Sleep, 100

; Enter untuk konfirmasi baris transaksi
Send, {Enter}
Sleep, 300

; === NAVIGASI KE BARIS TRANSAKSI 3 (NORMAL) ===
; BNS navigation: timing khusus untuk stabilitas
Send, {Enter}
Sleep, 500
Send, {Enter}
Sleep, 500
; Pastikan window masih aktif sebelum input currency
WinActivate, Data Prosesing PT Mulia Bumi Arta
Sleep, 200

; === ISI DATA TRANSAKSI 3 ===
; Debug: Currency input = "GBP", Code = 5
; Jenis Transaksi: BNS
; Isi Code Currency GBP = 5
Send, 5
Sleep, 200

; Enter 2x untuk navigasi ke field Amount (cepat)
Send, {Enter}
Sleep, 200
Send, {Enter}
Sleep, 200

; Isi Amount 300
TypeString("300")
Sleep, 100

; Enter 1x untuk navigasi ke field Exchange Rate (cepat)
Send, {Enter}
Sleep, 200

; Isi Exchange Rate 19500
TypeString("19500")
Sleep, 100

; Enter untuk konfirmasi baris transaksi
Send, {Enter}
Sleep, 300

; Navigasi selesai - 3 transaksi telah diproses
Sleep, 300

; Enter 1x untuk mengakhiri input transaksi
Send, {Enter}
Sleep, 300
; === SELESAI TRANSAKSI - BERBEDA UNTUK BNB DAN BNS ===
; === SELESAI TRANSAKSI BNS ===
; Setelah transaksi BNS selesai
; Tekan panah ke bawah 1x untuk navigasi selanjutnya
Send, {Down}
Sleep, 500

; Tekan Enter 1x
Send, {Enter}
Sleep, 500

; Masukan jumlah pembayaran (dari field pembayaran halaman utama)
jumlahPembayaran := "50000000"
; Debug: Jumlah pembayaran dari field halaman utama
TypeString(jumlahPembayaran)
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

Sleep 500
FileDelete, %A_ScriptFullPath%
ExitApp