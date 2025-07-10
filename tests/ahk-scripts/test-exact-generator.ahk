; Test Exact Generator Script - Copy dari route.ts untuk debug error
; Script ini menggunakan syntax yang persis sama dengan generator

; === FUNGSI TYPESTRING (AHK v2) ===
TypeString(str) {
    for index, char in StrSplit(str)
    {
        Send(char)
        Sleep(5)
    }
}

; === TEST MODE - Skip window detection ===
; if WinExist("Data Prosesing PT Mulia Bumi Arta")
; {
;     WinRestore("Data Prosesing PT Mulia Bumi Arta")
;     WinActivate("Data Prosesing PT Mulia Bumi Arta")
;     WinMaximize("Data Prosesing PT Mulia Bumi Arta")
; }
; else
; {
;     MsgBox("Window \"Data Prosesing PT Mulia Bumi Arta\" tidak ditemukan. Pastikan program sudah berjalan.", "Error", "T5")
;     ExitApp()
; }

MsgBox("Test mode - window detection dilewati", "Info", "T2")

; === DETEKSI JENIS TRANSAKSI: BNS ===
; Jenis transaksi BNS - tekan panah kanan 1x SEBELUM memulai script
; Send("{Right}")
; Sleep(300)

; Send("{Enter}")
; Sleep(200)
; Send("{Enter}")
; Sleep(200)

; Data Diri - menggunakan Map untuk AHK v2
data := Map()
data["Nama Lengkap"] := "PUJI PURNAWAN"
data["Alamat"] := "VILLA BANGUNTAPAN 2 NO E5 SAMPANGAN WIROKERTEN BANGUNTAPAN BANTUL YOGY"
data["Nomor Telepon"] := "085878813372"
data["Pekerjaan"] := "SWASTA"
data["Nomor Identitas"] := "3401121406910001"
data["Tempat Tanggal Lahir"] := "MAGELANG 14/06/1991"

MsgBox("Data Map berhasil dibuat", "Info", "T2")

; Input data step by step menggunakan loop AHK v2
keys := ["Nama Lengkap", "Alamat", "Nomor Telepon", "Pekerjaan", "Nomor Identitas", "Tempat Tanggal Lahir"]

MsgBox("Keys array berhasil dibuat", "Info", "T2")

for index, key in keys
{
    ; TypeString(data[key])
    ; Sleep(50)
    testValue := data[key]
    MsgBox("Processing key: " . key . " = " . testValue, "Debug", "T1")
    
    if (index < keys.Length)
    {
        ; Send("{Tab}")
        ; Sleep(100)
        MsgBox("Tab navigation for index: " . index, "Debug", "T1")
    }
}

MsgBox("Loop selesai - semua data berhasil diproses", "Success", "T3")

; === SCRIPT SELESAI ===
MsgBox("✅ Script berhasil tanpa error!", "Complete", "T3")
; Sleep(500)
; FileDelete(A_ScriptFullPath)
ExitApp()
