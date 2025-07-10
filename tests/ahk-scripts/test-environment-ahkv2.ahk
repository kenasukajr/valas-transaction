#Requires AutoHotkey v2.0
#SingleInstance Force

; TEST ENVIRONMENT: Pastikan AutoHotkey v2 berjalan dengan benar

; Test 1: Map creation
testData := Map()
testData["test"] := "Hello AHK v2"

; Test 2: Function definition
TestFunction(text) {
    return "Function works: " . text
}

; Test 3: Loop Parse with Send
TestTypeString(str) {
    Loop Parse, str {
        ; Send(A_LoopField)  ; Commented untuk test tanpa interfere
        ; Sleep(5)
    }
}

; Test 4: Array and for-in loop
testArray := ["item1", "item2", "item3"]
for index, value in testArray {
    ; Loop test
}

; Test 5: Conditional
if WinExist("Notepad") {
    ; Window exists
} else {
    ; Window not found - this is expected
}

; Show result
result := TestFunction(testData["test"])
MsgBox(result . "`n`nAHK v2 Environment Test: SUCCESS!", "Environment Test", 64)

; Clean exit
ExitApp()
