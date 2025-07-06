; Auto-generated AutoHotkey script to input form data
^t::
{
    ; Data to input
    data := {}
    data["Nama Lengkap"] := "PUJI PURNAWAN"
    data["Alamat"] := "VILLA BANGUNTAPAN 2 NO E5 SAMPANGAN WIROKERTEN BANGUNTAPAN BANTUL YOGY"
    data["Nomor Telepon"] := "085878813372"
    data["Pekerjaan"] := "SWASTA"
    data["Nomor Identitas"] := "3401121406910001"
    data["Tempat Tanggal Lahir"] := "MAGELANG 14-06-1991"

    TypeString(str) {
        Loop Parse, str
        {
            Send %A_LoopField%
            Sleep 5
        }
    }

    keys := ["Nama Lengkap", "Alamat", "Nomor Telepon", "Pekerjaan", "Nomor Identitas", "Tempat Tanggal Lahir"]
    for index, key in keys
    {
        TypeString(data[key])
        Sleep 200
        Send {Tab}
        Sleep 200
    }
    Sleep 500
    FileDelete, %A_ScriptFullPath%
    ExitApp
}
