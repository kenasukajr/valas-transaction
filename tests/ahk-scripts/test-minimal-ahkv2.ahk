; Test minimal AHK v2 - Identifikasi error line by line
; Script ini akan test setiap bagian syntax AHK v2 secara bertahap

; === TEST 1: BASIC SYNTAX ===
MsgBox("Test 1: Basic syntax", "Test", "T2")

; === TEST 2: FUNCTION DEFINITION ===
TestFunction(str) {
    return str
}
result := TestFunction("test")
MsgBox("Test 2: Function definition berhasil", "Test", "T2")

; === TEST 3: MAP OBJECT ===
testData := Map()
testData["key1"] := "value1"
testData["key2"] := "value2"
MsgBox("Test 3: Map object berhasil", "Test", "T2")

; === TEST 4: ARRAY AND FOR LOOP ===
testArray := ["item1", "item2", "item3"]
for index, item in testArray
{
    ; Test loop
    testValue := item
}
MsgBox("Test 4: Array and for loop berhasil", "Test", "T2")

; === TEST 5: ARRAY LENGTH PROPERTY ===
arrayLength := testArray.Length
MsgBox("Test 5: Array Length = " . arrayLength, "Test", "T2")

; === TEST 6: CONDITIONAL ===
if (arrayLength > 0)
{
    MsgBox("Test 6: Conditional berhasil", "Test", "T2")
}

; === TEST 7: STRING CONCATENATION ===
combinedString := "Test " . "concatenation"
MsgBox("Test 7: " . combinedString, "Test", "T2")

; === TEST 8: TYPESTRING FUNCTION (ACTUAL) ===
TypeString(str) {
    for index, char in StrSplit(str)
    {
        ; Simulasi tanpa Send aktual
        testChar := char
    }
}
TypeString("test string")
MsgBox("Test 8: TypeString function berhasil", "Test", "T2")

; === TEST 9: KOMPLEKS MAP + ARRAY + LOOP ===
data := Map()
data["Nama"] := "Test User"
data["Alamat"] := "Test Address"
data["Phone"] := "123456789"

keys := ["Nama", "Alamat", "Phone"]
for index, key in keys
{
    value := data[key]
    if (index < keys.Length)
    {
        ; Test logic
    }
}
MsgBox("Test 9: Kompleks logic berhasil", "Test", "T2")

; === SEMUA TEST SELESAI ===
MsgBox("✅ SEMUA TEST BERHASIL!`nTidak ada error syntax AHK v2", "Success", "T5")
ExitApp()
