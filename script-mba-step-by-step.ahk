; Script AHK untuk PT Mulia Bumi Arta - Step by Step Validation
; Version: 1.0.0 - Manual Validation Mode
; Setiap step akan ditampilkan dialog untuk konfirmasi

; === INISIALISASI ===
IfWinExist, Data Prosesing PT Mulia Bumi Arta
{
    WinRestore, Data Prosesing PT Mulia Bumi Arta
    WinActivate, Data Prosesing PT Mulia Bumi Arta
    WinMaximize, Data Prosesing PT Mulia Bumi Arta
}
else
{
    MsgBox, 16, Error, Window "Data Prosesing PT Mulia Bumi Arta" tidak ditemukan.`n`nPastikan program sudah berjalan dan window terbuka.
    ExitApp
}

; === PERSIAPAN ===
MsgBox, 0, Persiapan, Pastikan hal berikut:`n`n1. Aplikasi PT Mulia Bumi Arta sudah terbuka`n2. Kursor berada di field NAMA LENGKAP (field pertama)`n3. Form dalam keadaan kosong/siap diisi`n`nKlik OK untuk melanjutkan.

; === FUNGSI HELPER ===
TypeString(str) {
    Loop Parse, str
    {
        Send %A_LoopField%
        Sleep 30  ; Delay untuk menghindari miss character
    }
}

; === DATA NASABAH ===
data := {}
data["Nama Lengkap"] := "PUJI PURNAWAN"
data["Alamat"] := "Jl. Sudirman No. 123, Jakarta Pusat, DKI Jakarta 10110"
data["Nomor Telepon"] := "081234567890"
data["Pekerjaan"] := "Software Engineer"
data["Nomor Identitas"] := "3173051234567890"
data["Tempat Tanggal Lahir"] := "Jakarta 15/05/1990"

; === STEP 1: PENGISIAN DATA NASABAH ===
MsgBox, 0, Step 1, Mulai mengisi data nasabah...`n`nField: Nama Lengkap`nValue: %data["Nama Lengkap"]%`n`nKlik OK untuk mengisi field ini.

; Isi Nama Lengkap
TypeString(data["Nama Lengkap"])
Sleep, 500
Send, {Tab}
Sleep, 300
MsgBox, 0, Validasi, Apakah field Nama Lengkap sudah terisi dengan benar?`n`nNama: %data["Nama Lengkap"]%`n`nKlik OK untuk lanjut ke field berikutnya.

; Isi Alamat
MsgBox, 0, Step 2, Field: Alamat`nValue: %data["Alamat"]%`n`nKlik OK untuk mengisi field ini.
TypeString(data["Alamat"])
Sleep, 500
Send, {Tab}
Sleep, 300
MsgBox, 0, Validasi, Apakah field Alamat sudah terisi dengan benar?`n`nKlik OK untuk lanjut.

; Isi Nomor Telepon
MsgBox, 0, Step 3, Field: Nomor Telepon`nValue: %data["Nomor Telepon"]%`n`nKlik OK untuk mengisi field ini.
TypeString(data["Nomor Telepon"])
Sleep, 500
Send, {Tab}
Sleep, 300
MsgBox, 0, Validasi, Apakah field Nomor Telepon sudah terisi dengan benar?`n`nKlik OK untuk lanjut.

; Isi Pekerjaan
MsgBox, 0, Step 4, Field: Pekerjaan`nValue: %data["Pekerjaan"]%`n`nKlik OK untuk mengisi field ini.
TypeString(data["Pekerjaan"])
Sleep, 500
Send, {Tab}
Sleep, 300
MsgBox, 0, Validasi, Apakah field Pekerjaan sudah terisi dengan benar?`n`nKlik OK untuk lanjut.

; Isi Nomor Identitas
MsgBox, 0, Step 5, Field: Nomor Identitas`nValue: %data["Nomor Identitas"]%`n`nKlik OK untuk mengisi field ini.
TypeString(data["Nomor Identitas"])
Sleep, 500
Send, {Tab}
Sleep, 300
MsgBox, 0, Validasi, Apakah field Nomor Identitas sudah terisi dengan benar?`n`nKlik OK untuk lanjut.

; Isi Tempat Tanggal Lahir
MsgBox, 0, Step 6, Field: Tempat Tanggal Lahir`nValue: %data["Tempat Tanggal Lahir"]%`n`nKlik OK untuk mengisi field ini.
TypeString(data["Tempat Tanggal Lahir"])
Sleep, 500
MsgBox, 0, Validasi, Apakah field Tempat Tanggal Lahir sudah terisi dengan benar?`n`nKlik OK untuk lanjut ke bagian transaksi.

; === STEP 2: NAVIGASI KE BAGIAN TRANSAKSI ===
MsgBox, 0, Navigasi, Sekarang akan melakukan navigasi ke bagian transaksi.`n`nPerhatikan apakah setelah Tab atau Enter, kursor pindah ke tabel transaksi di bagian bawah.`n`nKlik OK untuk mulai navigasi.

; Coba navigasi dengan Tab
Send, {Tab}
Sleep, 500
MsgBox, 0, Cek Posisi, Apakah kursor sekarang berada di tabel transaksi?`n`nJika YA, klik OK untuk lanjut.`nJika TIDAK, klik Cancel untuk mencoba cara lain.
IfMsgBox Cancel
{
    ; Coba dengan Enter
    MsgBox, 0, Alternatif, Mencoba dengan Enter untuk navigasi...
    Send, {Enter}
    Sleep, 1000
    MsgBox, 0, Cek Posisi, Apakah sekarang kursor berada di tabel transaksi?`n`nJika YA, klik OK untuk lanjut.`nJika TIDAK, script akan berhenti untuk penyesuaian manual.
    IfMsgBox Cancel
    {
        MsgBox, 0, Berhenti, Script berhenti. Silakan lakukan penyesuaian navigasi secara manual.
        ExitApp
    }
}

; === STEP 3: PENGISIAN DATA TRANSAKSI ===
transactionData := {}
transactionData["Currency"] := "USD"
transactionData["Amount"] := "1000"
transactionData["Rate"] := "15750"

MsgBox, 0, Transaksi, Sekarang akan mengisi data transaksi:`n`nCurrency: %transactionData["Currency"]%`nAmount: %transactionData["Amount"]%`nRate: %transactionData["Rate"]%`n`nKlik OK untuk mulai mengisi.

; Isi Currency Code (1=USD)
MsgBox, 0, Currency, Mengisi Code Currency...`n`nUSD = 1`n`nKlik OK untuk mengisi.
Send, 1
Sleep, 500
MsgBox, 0, Validasi, Apakah Code Currency (1) sudah terisi?`n`nKlik OK untuk lanjut ke Amount.

; Pindah ke field Amount
Send, {Tab}
Sleep, 300
MsgBox, 0, Amount, Mengisi Amount...`n`nAmount: %transactionData["Amount"]%`n`nKlik OK untuk mengisi.
TypeString(transactionData["Amount"])
Sleep, 500
MsgBox, 0, Validasi, Apakah Amount sudah terisi dengan benar?`n`nKlik OK untuk lanjut ke Rate.

; Pindah ke field Rate
Send, {Tab}
Sleep, 300
MsgBox, 0, Rate, Mengisi Rate...`n`nRate: %transactionData["Rate"]%`n`nKlik OK untuk mengisi.
TypeString(transactionData["Rate"])
Sleep, 500
MsgBox, 0, Validasi, Apakah Rate sudah terisi dengan benar?`n`nKlik OK untuk konfirmasi baris transaksi.

; Konfirmasi baris transaksi
Send, {Enter}
Sleep, 1000
MsgBox, 0, Konfirmasi, Apakah baris transaksi sudah masuk ke tabel?`n`nPerhatikan apakah Rupiah Equivalent sudah ter-kalkulasi otomatis.`n`nKlik OK jika sudah benar.

; === FINALISASI ===
MsgBox, 0, Selesai, Script AHK selesai!`n`nData yang telah diisi:`n`nNASABAH:`n- Nama: %data["Nama Lengkap"]%`n- Alamat: %data["Alamat"]%`n- Telepon: %data["Nomor Telepon"]%`n- Pekerjaan: %data["Pekerjaan"]%`n- ID: %data["Nomor Identitas"]%`n- TTL: %data["Tempat Tanggal Lahir"]%`n`nTRANSAKSI:`n- Currency: %transactionData["Currency"]%`n- Amount: %transactionData["Amount"]%`n- Rate: %transactionData["Rate"]%`n`nSilakan cek kembali semua data dan lakukan penyesuaian jika diperlukan.

; Auto-delete script
FileDelete, %A_ScriptFullPath%
ExitApp
