; AutoHotkey v2 Basic Test
; Script paling sederhana untuk test AHK v2 environment

; Test basic function
TestFunc() {
    return "OK"
}

; Test basic command
MsgBox("AHK v2 Test: " . TestFunc(), "Environment Test")

; If this line executes, AHK v2 works
ExitApp()
