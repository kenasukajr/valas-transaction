; Test untuk memverifikasi tidak ada error syntax di generator script
; Berdasarkan error line 12 sebelumnya: CallTypeString(str) { 

; Definisi TypeString yang benar untuk AHK v1
TypeString:
    StringLen, StrLen, TypeString_str
    Loop, %StrLen%
    {
        StringMid, char, TypeString_str, %A_Index%, 1
        Send %char%
        Sleep 5
    }
return

; Test data struktur nasabah seperti di generator
data := {}
data["Nama Lengkap"] := "John Doe"
data["Alamat"] := "Jl. Test 123"
data["Nomor Telepon"] := "08123456789"
data["Pekerjaan"] := "Developer"
data["Nomor Identitas"] := "1234567890"
data["Tempat Tanggal Lahir"] := "Jakarta, 01 Jan 1990"

; Test urutan input yang sama dengan generator (loop dengan array)
keys := ["Nama Lengkap", "Alamat", "Nomor Telepon", "Pekerjaan", "Nomor Identitas", "Tempat Tanggal Lahir"]
for index, key in keys
{
    ; Test pemanggilan TypeString dengan format AHK v1 yang benar
    TypeString_str := data[key]
    Gosub, TypeString
    Sleep 50
    if (index < keys.MaxIndex())
    {
        Send {Tab}
        Sleep 100
    }
}

; Test transaksi amount dan rate
TypeString_str := "100000"
Gosub, TypeString

TypeString_str := "15500"
Gosub, TypeString

; Test pembayaran
TypeString_str := "1550000000"
Gosub, TypeString

MsgBox, Test completed - Semua syntax TypeString berhasil tanpa error!
ExitApp
