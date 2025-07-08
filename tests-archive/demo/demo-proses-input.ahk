; ==========================================
; DEMO PROSES INPUT DARI AWAL
; Script AHK PT Mulia Bumi Arta
; ==========================================
; Version: Demo 1.0
; Menunjukkan proses input dari awal hingga selesai
; ==========================================

; === STEP 1: DETEKSI WINDOW APLIKASI ===
MsgBox, 64, Demo Step 1, STEP 1: DETEKSI WINDOW APLIKASI`n`nScript akan mencari window "Data Prosesing PT Mulia Bumi Arta"`n`nJika ditemukan: Window akan di-restore, activate, dan maximize`nJika tidak ditemukan: Script akan berhenti dengan pesan error`n`nKlik OK untuk melanjutkan demo.

IfWinExist, Data Prosesing PT Mulia Bumi Arta
{
    MsgBox, 64, Demo, ✓ Window aplikasi ditemukan!`n`nMelakukan:`n• WinRestore (kembalikan dari minimize)`n• WinActivate (fokus ke window)`n• WinMaximize (maximize window)
    
    WinRestore, Data Prosesing PT Mulia Bumi Arta
    WinActivate, Data Prosesing PT Mulia Bumi Arta
    WinMaximize, Data Prosesing PT Mulia Bumi Arta
    Sleep, 1000
}
else
{
    MsgBox, 16, Demo - Error, ❌ Window "Data Prosesing PT Mulia Bumi Arta" tidak ditemukan!`n`nPastikan:`n• Aplikasi PT Mulia Bumi Arta sudah terbuka`n• Nama window sama persis`n• Aplikasi tidak crash/hang`n`nDemo akan berhenti.
    ExitApp
}

; === STEP 2: PERSIAPAN DATA ===
MsgBox, 64, Demo Step 2, STEP 2: PERSIAPAN DATA`n`nScript akan mempersiapkan data nasabah dan transaksi:`n`nDATA NASABAH:`n• Nama: PUJI PURNAWAN`n• Alamat: Jl. Sudirman No. 123, Jakarta`n• Telepon: 081234567890`n• Pekerjaan: Software Engineer`n• ID: 3173051234567890`n• TTL: Jakarta 15/05/1990`n`nDATA TRANSAKSI:`n• Currency: USD (Code: 1)`n• Amount: 1000`n• Rate: 15750`n`nKlik OK untuk melanjutkan.

; Persiapan data nasabah
data := {}
data["Nama Lengkap"] := "PUJI PURNAWAN"
data["Alamat"] := "Jl. Sudirman No. 123, Jakarta Pusat, DKI Jakarta"
data["Nomor Telepon"] := "081234567890"
data["Pekerjaan"] := "Software Engineer"
data["Nomor Identitas"] := "3173051234567890"
data["Tempat Tanggal Lahir"] := "Jakarta 15/05/1990"

; Persiapan data transaksi
transactionData := {}
transactionData["Currency"] := "USD"
transactionData["Amount"] := "1000"
transactionData["Rate"] := "15750"
transactionData["CurrencyCode"] := "1"

; === STEP 3: FUNGSI HELPER ===
MsgBox, 64, Demo Step 3, STEP 3: FUNGSI HELPER`n`nScript menyiapkan fungsi TypeString untuk mengetik karakter per karakter:`n`nTypeString(str) {`n    Loop Parse, str`n    {`n        Send %A_LoopField%`n        Sleep 25`n    }`n}`n`nFungsi ini memastikan setiap karakter terkirim dengan benar.`n`nKlik OK untuk melanjutkan.

TypeString(str) {
    Loop Parse, str
    {
        Send %A_LoopField%
        Sleep 25
    }
}

; === STEP 4: POSISI AWAL ===
MsgBox, 64, Demo Step 4, STEP 4: POSISI AWAL`n`nScript akan memulai dari posisi awal aplikasi.`n`nBerdasarkan aplikasi PT Mulia Bumi Arta:`n• Biasanya perlu 2x Enter untuk memulai`n• Atau navigasi awal untuk mencapai field pertama`n`nScript akan mengirim:`n• Enter (Sleep 500ms)`n• Enter (Sleep 500ms)`n`nKlik OK untuk melanjutkan.

; Navigasi awal (berdasarkan aplikasi)
Send, {Enter}
Sleep, 500
Send, {Enter}
Sleep, 500

; === STEP 5: PENGISIAN DATA NASABAH ===
MsgBox, 64, Demo Step 5, STEP 5: PENGISIAN DATA NASABAH`n`nScript akan mengisi 6 field data nasabah secara berurutan:`n`n1. Nama Lengkap → Tab`n2. Alamat → Tab`n3. Nomor Telepon → Tab`n4. Pekerjaan → Tab`n5. Nomor Identitas → Tab`n6. Tempat Tanggal Lahir`n`nSetiap field diisi dengan TypeString, lalu Tab ke field berikutnya.`n`nKlik OK untuk memulai pengisian.

; Urutan field berdasarkan aplikasi
keys := ["Nama Lengkap", "Alamat", "Nomor Telepon", "Pekerjaan", "Nomor Identitas", "Tempat Tanggal Lahir"]

; Loop untuk mengisi semua field nasabah
Loop, % keys.MaxIndex()
{
    currentKey := keys[A_Index]
    currentValue := data[currentKey]
    
    ; Tampilkan field yang sedang diisi
    MsgBox, 64, Demo - Mengisi Field %A_Index%, MENGISI FIELD %A_Index%/6`n`nField: %currentKey%`n`nValue: %currentValue%`n`nProses:`n1. TypeString("%currentValue%")`n2. Sleep 200ms`n3. Send {Tab} (jika bukan field terakhir)`n4. Sleep 300ms`n`nKlik OK untuk mengisi field ini.
    
    ; Isi field dengan data
    TypeString(currentValue)
    Sleep, 200
    
    ; Tab ke field berikutnya (kecuali field terakhir)
    if (A_Index < keys.MaxIndex()) {
        Send, {Tab}
        Sleep, 300
    }
}

MsgBox, 64, Demo, ✓ SEMUA DATA NASABAH SELESAI DIISI!`n`nField yang telah diisi:`n1. ✓ Nama Lengkap`n2. ✓ Alamat`n3. ✓ Nomor Telepon`n4. ✓ Pekerjaan`n5. ✓ Nomor Identitas`n6. ✓ Tempat Tanggal Lahir`n`nSelanjutnya akan navigasi ke bagian transaksi.

; === STEP 6: NAVIGASI KE BAGIAN TRANSAKSI ===
MsgBox, 64, Demo Step 6, STEP 6: NAVIGASI KE BAGIAN TRANSAKSI`n`nSetelah selesai mengisi data nasabah, script akan navigasi ke tabel transaksi.`n`nProses navigasi:`n1. Sleep 1000ms (tunggu data nasabah tersimpan)`n2. WinActivate (pastikan window masih aktif)`n3. Sleep 500ms`n4. Send {Tab} × 3 (navigasi ke tabel transaksi)`n5. Sleep 400ms setiap Tab`n`nKlik OK untuk melakukan navigasi.

; Tunggu setelah selesai isi data nasabah
Sleep, 1000

; Pastikan window masih aktif
WinActivate, Data Prosesing PT Mulia Bumi Arta
Sleep, 500

; Navigasi ke tabel transaksi dengan multiple Tab
MsgBox, 64, Demo, Melakukan navigasi ke tabel transaksi...`n`nSend {Tab} #1
Send, {Tab}
Sleep, 400

MsgBox, 64, Demo, Send {Tab} #2
Send, {Tab}
Sleep, 400

MsgBox, 64, Demo, Send {Tab} #3
Send, {Tab}
Sleep, 400

MsgBox, 64, Demo, ✓ NAVIGASI KE TABEL TRANSAKSI SELESAI!`n`nKursor sekarang seharusnya berada di:`n• Tabel transaksi bagian bawah`n• Field Code Currency (kolom pertama)`n`nSelanjutnya akan mengisi data transaksi.

; === STEP 7: PENGISIAN DATA TRANSAKSI ===
MsgBox, 64, Demo Step 7, STEP 7: PENGISIAN DATA TRANSAKSI`n`nScript akan mengisi 3 field transaksi:`n`n1. Code Currency: %transactionData["CurrencyCode"]% (USD)`n2. Amount: %transactionData["Amount"]%`n3. Exchange Rate: %transactionData["Rate"]%`n`nSetiap field diisi lalu Tab ke field berikutnya.`n`nKlik OK untuk memulai pengisian transaksi.

; Field 1: Currency Code
MsgBox, 64, Demo - Field 1/3, FIELD 1/3: CODE CURRENCY`n`nMengisi Code Currency:`n• Currency: %transactionData["Currency"]%`n• Code: %transactionData["CurrencyCode"]%`n`nMapping:`n• USD = 1, EUR = 2, GBP = 3, AUD = 4, dll`n`nProses:`n1. Send %transactionData["CurrencyCode"]%`n2. Sleep 600ms`n3. Tab ke field Amount`n`nKlik OK untuk mengisi.

Send, %transactionData["CurrencyCode"]%
Sleep, 600

; Tab ke field Amount
Send, {Tab}
Sleep, 400

; Field 2: Amount
MsgBox, 64, Demo - Field 2/3, FIELD 2/3: AMOUNT`n`nMengisi Amount:`n• Value: %transactionData["Amount"]%`n`nProses:`n1. TypeString("%transactionData["Amount"]%")`n2. Sleep 500ms`n3. Tab ke field Exchange Rate`n`nKlik OK untuk mengisi.

TypeString(transactionData["Amount"])
Sleep, 500

; Tab ke field Exchange Rate
Send, {Tab}
Sleep, 400

; Field 3: Exchange Rate
MsgBox, 64, Demo - Field 3/3, FIELD 3/3: EXCHANGE RATE`n`nMengisi Exchange Rate:`n• Value: %transactionData["Rate"]%`n`nProses:`n1. TypeString("%transactionData["Rate"]%")`n2. Sleep 500ms`n3. Enter untuk konfirmasi baris`n`nKlik OK untuk mengisi.

TypeString(transactionData["Rate"])
Sleep, 500

; === STEP 8: KONFIRMASI TRANSAKSI ===
MsgBox, 64, Demo Step 8, STEP 8: KONFIRMASI TRANSAKSI`n`nSetelah semua field transaksi terisi, script akan:`n`n1. Send {Enter} untuk konfirmasi baris transaksi`n2. Sleep 1000ms (tunggu baris masuk ke tabel)`n3. Sleep 800ms (tunggu kalkulasi Rupiah Equivalent)`n`nKlik OK untuk konfirmasi.

; Konfirmasi baris transaksi dengan Enter
Send, {Enter}
Sleep, 1000

; Tunggu untuk memastikan data tersimpan
Sleep, 800

; === STEP 9: FINALISASI ===
MsgBox, 64, Demo Step 9, STEP 9: FINALISASI`n`nScript akan menyelesaikan proses:`n`n1. Sleep 500ms (tunggu final)`n2. FileDelete %A_ScriptFullPath% (hapus script)`n3. ExitApp (keluar dari script)`n`nKlik OK untuk menyelesaikan demo.

; Finalisasi
Sleep, 500

; === RINGKASAN LENGKAP ===
MsgBox, 64, Demo Selesai, 🎉 DEMO PROSES INPUT SELESAI!`n`nRINGKASAN LENGKAP:`n`n📋 DATA NASABAH:`n• Nama: %data["Nama Lengkap"]%`n• Alamat: %data["Alamat"]%`n• Telepon: %data["Nomor Telepon"]%`n• Pekerjaan: %data["Pekerjaan"]%`n• ID: %data["Nomor Identitas"]%`n• TTL: %data["Tempat Tanggal Lahir"]%`n`n💱 DATA TRANSAKSI:`n• Currency: %transactionData["Currency"]% (Code: %transactionData["CurrencyCode"]%)`n• Amount: %transactionData["Amount"]%`n• Rate: %transactionData["Rate"]%`n`n⏱️ TOTAL WAKTU: ~30-40 detik`n`nScript akan menghapus dirinya sendiri dan keluar.

; Auto-delete script
FileDelete, %A_ScriptFullPath%
ExitApp
