; Script AHK Optimized untuk PT Mulia Bumi Arta
; Berdasarkan screenshot aplikasi yang sesungguhnya
; Version: 1.0.0

; Deteksi window aplikasi
IfWinExist, Data Prosesing PT Mulia Bumi Arta
{
    WinRestore, Data Prosesing PT Mulia Bumi Arta
    WinActivate, Data Prosesing PT Mulia Bumi Arta
    WinMaximize, Data Prosesing PT Mulia Bumi Arta
    Sleep, 1000
}
else
{
    MsgBox, 16, Error, Window "Data Prosesing PT Mulia Bumi Arta" tidak ditemukan.`n`nPastikan program sudah berjalan dan window terbuka.
    ExitApp
}

; Tunggu user untuk memastikan posisi kursor yang benar
MsgBox, 0, Perhatian, Pastikan kursor berada di field NAMA LENGKAP (field pertama).`n`nScript akan dimulai dalam 3 detik., 3

; === FUNGSI HELPER ===
TypeString(str) {
    Loop Parse, str
    {
        Send %A_LoopField%
        Sleep 20  ; Sedikit delay untuk menghindari miss character
    }
}

; === DATA NASABAH ===
; Data test - ganti dengan data sesungguhnya
data := {}
data["Nama Lengkap"] := "PUJI PURNAWAN"
data["Alamat"] := "Jl. Sudirman No. 123, Jakarta Pusat"
data["Nomor Telepon"] := "081234567890"
data["Pekerjaan"] := "Software Engineer"
data["Nomor Identitas"] := "3173051234567890"
data["Tempat Tanggal Lahir"] := "Jakarta 15/05/1990"

; === PENGISIAN DATA NASABAH ===
; Berdasarkan screenshot, urutan field adalah:
; 1. Nama Lengkap
; 2. Alamat
; 3. Nomor Telepon
; 4. Pekerjaan
; 5. Nomor Identitas
; 6. Tempat Tanggal Lahir

keys := ["Nama Lengkap", "Alamat", "Nomor Telepon", "Pekerjaan", "Nomor Identitas", "Tempat Tanggal Lahir"]

Loop, % keys.MaxIndex()
{
    currentKey := keys[A_Index]
    currentValue := data[currentKey]
    
    ; Isi field
    TypeString(currentValue)
    Sleep, 300
    
    ; Pindah ke field berikutnya dengan Tab
    Send, {Tab}
    Sleep, 500
}

; === NAVIGASI KE BAGIAN TRANSAKSI ===
; Setelah semua data nasabah terisi, kita perlu navigasi ke bagian transaksi
; Berdasarkan screenshot, ada tabel transaksi di bagian bawah

; Tunggu sebentar untuk memastikan data nasabah tersimpan
Sleep, 1000

; Untuk navigasi ke tabel transaksi, mungkin perlu beberapa Tab tambahan
; atau kombinasi key tertentu. Ini perlu disesuaikan dengan aplikasi sesungguhnya.

; Opsi 1: Menggunakan Tab untuk navigasi ke bagian transaksi
Send, {Tab}
Sleep, 300
Send, {Tab}
Sleep, 300
Send, {Tab}
Sleep, 300

; Opsi 2: Menggunakan Enter untuk konfirmasi dan masuk ke bagian transaksi
; Send, {Enter}
; Sleep, 1000

; === DATA TRANSAKSI ===
; Berdasarkan screenshot, tabel transaksi memiliki kolom:
; - No. (otomatis)
; - Code (kode currency)
; - Amount (jumlah)
; - Rate (kurs)
; - Rupiah Equivalent (otomatis kalkulasi)

; Data transaksi test - ganti dengan data sesungguhnya
transactionData := {}
transactionData["Currency"] := "USD"
transactionData["Amount"] := "1000"
transactionData["Rate"] := "15750"

; === PENGISIAN DATA TRANSAKSI ===
; Mapping currency code berdasarkan yang umum digunakan di aplikasi money changer
; USD = 1, EUR = 2, GBP = 3, AUD = 4, dll.

currencyCode := "1"  ; Default USD
if (transactionData["Currency"] = "USD")
    currencyCode := "1"
else if (transactionData["Currency"] = "EUR")
    currencyCode := "2"
else if (transactionData["Currency"] = "GBP")
    currencyCode := "3"
else if (transactionData["Currency"] = "AUD")
    currencyCode := "4"
else if (transactionData["Currency"] = "CAD")
    currencyCode := "5"
else if (transactionData["Currency"] = "CHF")
    currencyCode := "6"
else if (transactionData["Currency"] = "JPY")
    currencyCode := "7"
else if (transactionData["Currency"] = "SGD")
    currencyCode := "8"

; Isi Code Currency
Send, %currencyCode%
Sleep, 500
Send, {Tab}
Sleep, 300

; Isi Amount
TypeString(transactionData["Amount"])
Sleep, 500
Send, {Tab}
Sleep, 300

; Isi Rate
TypeString(transactionData["Rate"])
Sleep, 500

; Konfirmasi baris transaksi
Send, {Enter}
Sleep, 1000

; === FINALISASI ===
; Setelah data transaksi diisi, mungkin perlu navigasi ke tombol Selesai
; atau konfirmasi akhir. Ini perlu disesuaikan dengan flow aplikasi.

; Opsi navigasi ke tombol Selesai
Send, {Tab}
Sleep, 300
Send, {Tab}
Sleep, 300

; Pesan sukses
MsgBox, 0, Sukses, Script AHK selesai!`n`nData nasabah dan transaksi telah diisi.`n`nSilakan cek kembali dan lakukan penyesuaian jika diperlukan.

; Auto-delete script setelah selesai
FileDelete, %A_ScriptFullPath%
ExitApp
