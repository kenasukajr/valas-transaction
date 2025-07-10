; AHK v2 Compatibility Test - Pastikan environment support AHK v2
; Script ini akan memberitahu user versi AHK dan masalah kompatibilitas

; === TEST BASIC AHK v2 FEATURES ===
MsgBox("Starting AHK v2 compatibility test...", "AHK v2 Test", "T3")

; Test 1: Function definition
TestV2Function(param) {
    return "AHK v2 function works: " . param
}

; Test 2: Map object
testMap := Map()
testMap["key"] := "value"

; Test 3: Array with .Length
testArray := ["item1", "item2", "item3"]
arrayLength := testArray.Length

; Test 4: For-in loop
resultText := "Test Results:`n"
resultText .= "Function: " . TestV2Function("OK") . "`n"
resultText .= "Map: " . testMap["key"] . "`n"
resultText .= "Array Length: " . arrayLength . "`n"

; Test 5: Loop through array
for index, item in testArray {
    resultText .= "Item " . index . ": " . item . "`n"
}

; Display results
MsgBox(resultText, "AHK v2 Compatibility Results", "T10")

; === SOLUSI UNTUK USER ===
if (A_AhkVersion < "2.0") {
    MsgBox("❌ MASALAH DITEMUKAN:`n`n" .
           "AutoHotkey version: " . A_AhkVersion . "`n" .
           "Required: v2.0 or higher`n`n" .
           "SOLUSI:`n" .
           "1. Download AutoHotkey v2 dari https://autohotkey.com/`n" .
           "2. Install AHK v2 alongside v1`n" .
           "3. Set .ahk files to open with AHK v2`n" .
           "4. Atau rename script ke .ah2 extension", "Version Error", "")
} else {
    MsgBox("✅ AutoHotkey v2 detected!`n`n" .
           "Version: " . A_AhkVersion . "`n" .
           "Generator script should work correctly.`n`n" .
           "If you still get errors, check:`n" .
           "1. Data input untuk karakter special`n" .
           "2. Window title yang benar`n" .
           "3. Permissions untuk file operations", "Success", "")
}

ExitApp()
