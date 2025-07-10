; Test script tanpa FileDelete untuk validasi
; AutoHotkey v2 Script (install AutoHotkey v2 untuk hasil terbaik)
; Download: https://www.autohotkey.com/v2/
#SingleInstance Force

; Test basic functionality tanpa error
MsgBox("Test script dimulai - Tidak ada FileDelete error!", "Test", "T3")

; Test Map functionality
data := Map()
data["test"] := "Hello World"

; Test TypeString function
TypeString(str) {
    Loop Parse, str {
        Send(A_LoopField)
        Sleep(5)
    }
}

; Test for-in loop
keys := ["test"]
for index, key in keys {
    ; Script berjalan normal
}

; Test window detection (optional)
if WinExist("Data Prosesing PT Mulia Bumi Arta") {
    MsgBox("Window ditemukan!", "Success", "T2")
} else {
    MsgBox("Window tidak ditemukan - ini normal untuk testing!", "Info", "T2")
}

; Script selesai tanpa FileDelete
MsgBox("Test selesai - Script akan exit normal!", "Complete", "T2")
Sleep(1000)
ExitApp()
