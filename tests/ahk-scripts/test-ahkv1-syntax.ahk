; Test AHK v1 data syntax
; Test object/array syntax

; Try AHK v1 object syntax
data := {}
data["test"] := "value"

MsgBox, Data test: %data["test"]%

ExitApp
