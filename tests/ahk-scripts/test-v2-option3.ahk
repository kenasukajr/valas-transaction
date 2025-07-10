; Test 3: Complete generator script dengan header
#Requires AutoHotkey v2.0
#SingleInstance Force

; TypeString function
TypeString(str) {
    for index, char in StrSplit(str) {
        Send(char)
        Sleep(5)
    }
}

; Test window detection (commented for safety)
; if WinExist("Data Prosesing PT Mulia Bumi Arta") {
;     WinActivate("Data Prosesing PT Mulia Bumi Arta")
; }

; Test data processing
data := Map()
data["test"] := "Test Value"

keys := ["test"]
for index, key in keys {
    testValue := data[key]
    ; TypeString(testValue)  ; Comment untuk test
    if (index < keys.Length) {
        ; Send("{Tab}")
    }
}

MsgBox("Test 3: Complete script structure berhasil", "AHK v2 Test")
ExitApp()
