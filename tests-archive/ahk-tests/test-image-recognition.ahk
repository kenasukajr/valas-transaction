; Test Script untuk Image Recognition
; Gunakan script ini untuk test apakah screenshot detection bekerja

^i::  ; Ctrl+I untuk menjalankan test
{
    MsgBox, 64, Image Recognition Test, Test akan mencari screenshot indicator.`n`nPastikan:`n✓ Program MBA terbuka`n✓ File program_ready_indicator.png ada`n✓ Window dalam kondisi normal`n`nKlik OK untuk test.
    
    ; Test 1: Program Ready Indicator
    ToolTip, Testing program_ready_indicator.png...
    ImageSearch, FoundX, FoundY, 0, 0, A_ScreenWidth, A_ScreenHeight, *50 program_ready_indicator.png
    if ErrorLevel = 0
    {
        ToolTip  ; Clear tooltip
        MsgBox, 64, Test 1 Success, ✅ Program Ready Indicator FOUND!`n`nLocation: X=%FoundX%, Y=%FoundY%`n`nImage recognition bekerja dengan baik., 8
        
        ; Highlight the found area (optional)
        MouseMove, %FoundX%, %FoundY%, 50
        Sleep, 1000
    }
    else
    {
        ToolTip  ; Clear tooltip
        MsgBox, 16, Test 1 Failed, ❌ Program Ready Indicator NOT FOUND!`n`nError Level: %ErrorLevel%`n`nPossible issues:`n• File program_ready_indicator.png tidak ada`n• Screenshot tidak match dengan kondisi saat ini`n• Tolerance terlalu rendah, 10
    }
    
    Sleep, 1000
    
    ; Test 2: Form Ready Indicator  
    ToolTip, Testing form_ready_indicator.png...
    ImageSearch, FoundX2, FoundY2, 0, 0, A_ScreenWidth, A_ScreenHeight, *50 form_ready_indicator.png
    if ErrorLevel = 0
    {
        ToolTip  ; Clear tooltip
        MsgBox, 64, Test 2 Success, ✅ Form Ready Indicator FOUND!`n`nLocation: X=%FoundX2%, Y=%FoundY2%`n`nForm detection bekerja dengan baik., 8
        
        ; Highlight the found area (optional)
        MouseMove, %FoundX2%, %FoundY2%, 50
        Sleep, 1000
    }
    else
    {
        ToolTip  ; Clear tooltip
        MsgBox, 16, Test 2 Failed, ❌ Form Ready Indicator NOT FOUND!`n`nError Level: %ErrorLevel%`n`nPossible issues:`n• File form_ready_indicator.png tidak ada`n• Screenshot tidak match dengan kondisi saat ini`n• Form belum dalam kondisi ready, 10
    }
    
    ; Final Result
    if (ErrorLevel = 0) {
        MsgBox, 64, Test Complete, 🎉 Image Recognition Test COMPLETED!`n`nBoth indicators detected successfully.`n`nImage recognition siap digunakan di script utama., 10
    } else {
        MsgBox, 48, Test Complete, ⚠️ Image Recognition Test PARTIALLY SUCCESSFUL!`n`nBeberapa indicator tidak terdeteksi.`n`nPerlu perbaikan screenshot atau tolerance., 10
    }
    
    ExitApp
}

^h::  ; Ctrl+H untuk help
{
    MsgBox, 64, Image Recognition Test Help, Cara menggunakan test script:`n`n1. Pastikan program MBA terbuka`n2. Pastikan file PNG ada:`n   • program_ready_indicator.png`n   • form_ready_indicator.png`n3. Tekan Ctrl+I untuk test`n4. Lihat hasil detection`n`nJika tidak berhasil:`n• Ambil screenshot ulang`n• Adjust tolerance di script`n• Check file path, 15
}

; Auto-show help saat script dimulai
MsgBox, 64, Image Recognition Test, Test script untuk image recognition siap!`n`nControls:`n• Ctrl+I = Run Test`n• Ctrl+H = Show Help`n`nPastikan file PNG screenshot sudah disiapkan., 10
