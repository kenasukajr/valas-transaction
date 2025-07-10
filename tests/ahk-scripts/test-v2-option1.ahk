; SOLUSI ERROR LINE 1 - Multiple format test files
; Buat 3 versi file untuk test environment AHK v2

; Script 1: Function dengan empty line di awal

TypeString(str) {
    for index, char in StrSplit(str) {
        Send(char)
        Sleep(5)
    }
}

MsgBox("Test 1: Function definition berhasil", "AHK v2 Test")
ExitApp()
