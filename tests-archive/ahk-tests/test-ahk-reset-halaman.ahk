; Test Script untuk Verifikasi Reset Halaman dengan Tombol R
; Version: 1.0
; Purpose: Test apakah tombol R bekerja untuk reset halaman

; === DETEKSI WINDOW APLIKASI ===
IfWinExist, Data Prosesing PT Mulia Bumi Arta
{
    WinRestore, Data Prosesing PT Mulia Bumi Arta
    WinActivate, Data Prosesing PT Mulia Bumi Arta
    WinMaximize, Data Prosesing PT Mulia Bumi Arta
    Sleep, 2000  ; Tunggu 2 detik untuk memastikan window fully loaded
    
    ; Pastikan window benar-benar aktif dan ready
    WinWaitActive, Data Prosesing PT Mulia Bumi Arta, , 5
    if ErrorLevel
    {
        MsgBox, 16, Error - Test Script, Window "Data Prosesing PT Mulia Bumi Arta" tidak dapat diaktifkan!`n`nTest script akan berhenti.
        ExitApp
    }
}
else
{
    MsgBox, 16, Error - Test Script, Window "Data Prosesing PT Mulia Bumi Arta" tidak ditemukan!`n`nPastikan:`n1. Aplikasi PT Mulia Bumi Arta sudah terbuka`n2. Window name sama persis dengan "Data Prosesing PT Mulia Bumi Arta"`n`nTest script akan berhenti.
    ExitApp
}

; === TEST RESET HALAMAN ===
MsgBox, 64, Test Reset Halaman, Test script akan melakukan:`n`n1. Tunggu 2 detik untuk memastikan program siap`n2. Menekan tombol R untuk reset halaman`n3. Menunggu 1.5 detik`n4. Menampilkan hasil`n`nPastikan Anda siap untuk melihat efek tombol R.`n`nKlik OK untuk memulai test., 15

; Tunggu 2 detik tambahan untuk memastikan program benar-benar siap
Sleep, 2000

; Tekan tombol R
Send, r
Sleep, 1500

; Hasil test
MsgBox, 64, Hasil Test, Test selesai!`n`nPeriksa:`n✓ Apakah halaman kembali ke posisi netral?`n✓ Apakah kursor berada di field NAMA LENGKAP?`n✓ Apakah tidak ada dialog/popup yang terbuka?`n`nJika ya, tombol R berfungsi dengan baik.`n`nJika tidak, tombol R mungkin tidak berfungsi di aplikasi ini., 20

; === TEST NAVIGASI SEDERHANA ===
MsgBox, 0, Test Navigasi, Test lanjutan: Mencoba navigasi sederhana`n`nScript akan:`n1. Mengetik "TEST" di field pertama`n2. Tab ke field kedua`n3. Mengetik "ALAMAT TEST"`n`nKlik OK untuk melanjutkan atau Cancel untuk skip., 10

IfMsgBox OK
{
    ; Ketik di field pertama
    Send, TEST
    Sleep, 500
    
    ; Tab ke field kedua
    Send, {Tab}
    Sleep, 500
    
    ; Ketik di field kedua
    Send, ALAMAT TEST
    Sleep, 500
    
    MsgBox, 64, Test Navigasi Selesai, Test navigasi selesai!`n`nPeriksa:`n✓ Field pertama terisi "TEST"`n✓ Field kedua terisi "ALAMAT TEST"`n✓ Navigasi Tab berfungsi`n`nJika semua OK, skrip AHK siap digunakan., 15
}

; === CLEANUP ===
MsgBox, 64, Test Selesai, Test script selesai!`n`nRingkasan:`n✓ Test tombol R: Selesai`n✓ Test navigasi: Selesai`n`nJika semua test berhasil, semua skrip AHK sudah siap digunakan dengan fitur reset halaman.`n`nScript ini akan tertutup otomatis., 10

ExitApp
