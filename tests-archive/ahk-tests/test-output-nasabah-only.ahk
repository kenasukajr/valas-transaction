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
data["Nama Lengkap"] := "BUDI SANTOSO"
data["Alamat"] := "Jl. Gatot Subroto No. 456"
data["Nomor Telepon"] := "087654321098"
data["Pekerjaan"] := "Manager"
data["Nomor Identitas"] := "3174061987654321"
data["Tempat Tanggal Lahir"] := "Bandung 20/03/1985"

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

Sleep 500
FileDelete, %A_ScriptFullPath%
ExitApp