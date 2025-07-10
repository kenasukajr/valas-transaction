; Test 2: Version directive explicit
#Requires AutoHotkey v2.0

TypeString(str) {
    for index, char in StrSplit(str) {
        Send(char)
        Sleep(5)
    }
}

MsgBox("Test 2: Version directive + function berhasil", "AHK v2 Test")
ExitApp()
