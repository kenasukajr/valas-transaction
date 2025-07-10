# 🚨 SOLUSI ERROR "Line 1" - #Requires AutoHotkey v2.0

## MASALAH:
- Error: "This line does not contain a recognized action"
- Line Text: "#Requires AutoHotkey v2.0"

## ✅ PENYEBAB & SOLUSI

### 1. **AutoHotkey v1 Masih Terinstall** (PALING UMUM)
**Penyebab**: File .ahk dibuka dengan AutoHotkey v1, bukan v2
**Solusi**:
```bash
# Download dan install AutoHotkey v2
https://www.autohotkey.com/v2/

# Setelah install, set v2 sebagai default:
# - Klik kanan file .ahk
# - "Open with" → "Choose another app"
# - Pilih AutoHotkey v2 (bukan v1)
# - Check "Always use this app"
```

### 2. **Multiple AutoHotkey Versions**
**Penyebab**: v1 dan v2 terinstall bersamaan, Windows menggunakan v1
**Solusi**:
```bash
# Uninstall AutoHotkey v1 dari Control Panel
# Restart Windows
# Install hanya AutoHotkey v2
```

### 3. **Registry/File Association Wrong**
**Penyebab**: File .ahk ter-associate dengan AutoHotkey v1
**Solusi**:
```bash
# Option 1: Manual run dengan v2
"C:\Program Files\AutoHotkey\v2\AutoHotkey.exe" "script.ahk"

# Option 2: Fix file association
# Klik kanan .ahk → Properties → Change → AutoHotkey v2
```

---

## 🧪 TEST ENVIRONMENT

### Test 1: Check AutoHotkey Version
```autohotkey
; Save sebagai: test-version.ahk
MsgBox("AutoHotkey v2 detected!", "Version Test")
ExitApp()
```

### Test 2: Environment Test Lengkap
```autohotkey
; Save sebagai: test-environment.ahk
#Requires AutoHotkey v2.0
#SingleInstance Force

; Test Map
testData := Map()
testData["test"] := "Hello v2"

; Test Function
TestFunc(text) {
    return "Result: " . text
}

; Show result
MsgBox(TestFunc(testData["test"]), "Environment OK")
ExitApp()
```

---

## 🔧 LANGKAH PERBAIKAN

### Step 1: Verifikasi Installation
```bash
# Cek version yang terinstall
Get-ItemProperty HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\* | Where-Object {$_.DisplayName -match "AutoHotkey"} | Select-Object DisplayName, DisplayVersion
```

### Step 2: Clean Install AutoHotkey v2
1. **Uninstall** AutoHotkey v1 (jika ada)
2. **Download** AutoHotkey v2: https://www.autohotkey.com/v2/
3. **Install** dan set sebagai default
4. **Restart** Windows

### Step 3: Test Script Generator
1. Generate script dari browser
2. Save file .ahk
3. **Double-click** file .ahk (harus buka dengan v2)
4. **Expected**: Script berjalan tanpa error

---

## 📋 VERIFICATION CHECKLIST

- [ ] AutoHotkey v2 terinstall
- [ ] AutoHotkey v1 sudah di-uninstall  
- [ ] File .ahk ter-associate dengan v2
- [ ] Test script `test-environment.ahk` berjalan OK
- [ ] Generator script dari browser berjalan tanpa error

---

## 🎯 EXPECTED RESULT AFTER FIX

**✅ SEBELUM**: Error "Line 1" - #Requires not recognized  
**✅ SESUDAH**: Script berjalan smooth, no syntax error

**✅ File generator sudah benar 100% AHK v2 syntax**  
**✅ Masalah hanya di environment/installation**  
**✅ Setelah fix environment, semua script akan berjalan perfect**

---

## 🚀 QUICK FIX (Jika Tidak Bisa Install v2)

Jika tidak bisa install AutoHotkey v2, gunakan **compatibility mode**:

1. **Ganti header** di generator temporary:
```typescript
// Di generator, ganti:
ahkLines.push('#Requires AutoHotkey v2.0')
// Menjadi:
ahkLines.push('; Compatible with AutoHotkey v1 and v2')
```

2. **Update syntax** yang bermasalah saja
3. **Keep the rest** tetap v2 syntax

**NOTE**: Ini solusi temporary, best practice tetap install AutoHotkey v2.
