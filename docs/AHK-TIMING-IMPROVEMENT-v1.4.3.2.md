# AHK Script Update - Improved Reset Timing v1.4.3.2

## Update Summary

### Issue Identified
- Tombol R ditekan terlalu cepat setelah program MBA dibuka
- Program MBA belum fully loaded saat tombol R ditekan
- Menyebabkan miss atau tidak berfungsi dengan baik

### Solution Implemented
1. **Increased Initial Window Loading Time**: 2 detik setelah window detection
2. **Added WinWaitActive**: Memastikan window benar-benar aktif sebelum melanjutkan
3. **Added 2 Second Pre-Reset Delay**: Delay tambahan 2 detik sebelum menekan tombol R
4. **Improved Reset Timing**: 1.5 detik setelah menekan tombol R (naik dari 1 detik)
5. **Enhanced User Feedback**: Dialog yang lebih informatif

## Files Updated

### 1. `script-production.ahk`
**Changes Made:**
- Window loading: `Sleep, 1000` → `Sleep, 2000`
- Added `WinWaitActive` dengan timeout 5 detik
- Pre-reset delay: Ditambahkan `Sleep, 2000` sebelum menekan R
- Post-reset delay: `Sleep, 1000` → `Sleep, 1500`
- Enhanced MsgBox dengan informasi lebih jelas

### 2. `script-mba-optimized.ahk`
**Changes Made:**
- Window loading: `Sleep, 1000` → `Sleep, 2000`
- Added `WinWaitActive` dengan timeout 5 detik
- Pre-reset delay: Ditambahkan `Sleep, 2000` sebelum menekan R
- Post-reset delay: `Sleep, 1000` → `Sleep, 1500`
- Enhanced MsgBox dengan informasi lebih jelas

### 3. `script-mba-step-by-step.ahk`
**Changes Made:**
- Window loading: Ditambahkan `Sleep, 2000`
- Added `WinWaitActive` dengan timeout 5 detik
- Pre-reset delay: Ditambahkan `Sleep, 2000` sebelum menekan R
- Post-reset delay: `Sleep, 1000` → `Sleep, 1500`
- Enhanced MsgBox dengan informasi lebih jelas

### 4. `script-mba-application.ahk`
**Changes Made:**
- Window loading: Ditambahkan `Sleep, 2000`
- Added `WinWaitActive` dengan timeout 5 detik
- Pre-reset delay: Ditambahkan `Sleep, 2000` sebelum menekan R
- Post-reset delay: `Sleep, 1000` → `Sleep, 1500`
- Enhanced MsgBox dengan informasi lebih jelas

### 5. `tools/autohotkey/auto_type_form.ahk`
**Changes Made:**
- Pre-reset delay: `Sleep, 1000` → `Sleep, 2000`
- Post-reset delay: `Sleep, 1000` → `Sleep, 1500`

### 6. `tests-archive/ahk-tests/test-ahk-reset-halaman.ahk`
**Changes Made:**
- Window loading: `Sleep, 1000` → `Sleep, 2000`
- Added `WinWaitActive` dengan timeout 5 detik
- Pre-reset delay: Ditambahkan `Sleep, 2000` sebelum menekan R
- Post-reset delay: `Sleep, 2000` → `Sleep, 1500`

## New Timing Sequence

### Before (v1.4.3.1):
1. Window Detection → `Sleep, 1000`
2. User Dialog
3. Reset R key → `Sleep, 1000`
4. Continue

### After (v1.4.3.2):
1. Window Detection → `Sleep, 2000`
2. `WinWaitActive` (up to 5 seconds)
3. User Dialog
4. **Pre-reset delay** → `Sleep, 2000`
5. Reset R key → `Sleep, 1500`
6. Continue

**Total delay before R key**: ~5+ seconds (vs ~1 second before)

## Benefits

1. **✅ Improved Reliability**: Program MBA fully loaded before R key press
2. **✅ Better Error Handling**: WinWaitActive detects if window activation fails
3. **✅ Enhanced User Experience**: Clear dialogs about what's happening
4. **✅ Reduced Miss Rate**: Much lower chance of R key being pressed too early
5. **✅ Consistent Timing**: Standardized across all AHK scripts

## Technical Details

### WinWaitActive Implementation
```ahk
WinWaitActive, Data Prosesing PT Mulia Bumi Arta, , 5
if ErrorLevel
{
    MsgBox, 16, Error, Window tidak dapat diaktifkan!
    ExitApp
}
```

### New Reset Sequence
```ahk
; 1. Window fully loaded
Sleep, 2000

; 2. Additional safety delay
Sleep, 2000

; 3. User confirmation
MsgBox, 0, Reset Halaman, Sekarang akan menekan tombol R...

; 4. Press R key
Send, r

; 5. Wait for reset to complete
Sleep, 1500
```

## Testing Instructions

1. **Close** PT Mulia Bumi Arta completely
2. **Open** PT Mulia Bumi Arta
3. **Wait** for program to fully load (don't rush)
4. **Run** any AHK script
5. **Observe** the timing:
   - Should wait 2 seconds after window detection
   - Should show "Reset Halaman" dialog
   - Should wait 2 more seconds before pressing R
   - Should press R and wait 1.5 seconds

## Expected Results

- **No more early R key presses**
- **Consistent reset behavior**
- **Better user feedback**
- **Higher success rate**

## Rollback Plan

If issues occur, previous timing values were:
- Window loading: `Sleep, 1000`
- No `WinWaitActive`
- No pre-reset delay
- Post-reset delay: `Sleep, 1000`

---

**Version**: v1.4.3.2  
**Update Date**: 2025-07-08  
**Files Modified**: 6 AHK scripts  
**Primary Focus**: Improved timing and reliability
