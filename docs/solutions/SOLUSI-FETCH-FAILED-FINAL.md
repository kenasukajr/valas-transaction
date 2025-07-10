# SOLUSI ERROR "FETCH FAILED" - AHK SCRIPT EXECUTION

## STATUS SAAT INI
✅ Backend server berjalan di port 5000  
✅ Frontend server berjalan di port 8000  
✅ Endpoint `/api/execute-ahk` di backend berfungsi  
✅ Environment variable sudah diupdate ke `http://localhost:5000`  
✅ Script AHK v2 syntax sudah benar  

## LANGKAH TROUBLESHOOTING

### 1. VERIFIKASI SERVER STATUS
```powershell
# Check frontend
Invoke-WebRequest -Uri "http://localhost:8000" -Method Head

# Check backend
Invoke-WebRequest -Uri "http://localhost:5000" -Method Head

# Test backend endpoint
Invoke-WebRequest -Uri "http://localhost:5000/api/execute-ahk" -Method Post -ContentType "application/json" -Body '{"script":"Send(\"Hello World\")"}' -UseBasicParsing
```

### 2. VERIFIKASI ENVIRONMENT VARIABLE
File: `.env.local`
```
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
```

### 3. RESTART FRONTEND JIKA DIPERLUKAN
Jika masih error "fetch failed", restart frontend server:
```bash
# Di terminal Server Manager atau manual
npm run dev
# atau
next dev -p 8000
```

### 4. TEST SCRIPT AHK
Jalankan file test: `test-script-validation.ahk`
```powershell
Start-Process -FilePath "C:\Program Files\AutoHotkey\v2\AutoHotkey.exe" -ArgumentList "e:\Versi 1.4.4\test-script-validation.ahk"
```

### 5. TEST FRONTEND-BACKEND CONNECTION
Buka file: `test-frontend-backend.html` di browser dan test kedua tombol.

## KEMUNGKINAN PENYEBAB ERROR "FETCH FAILED"

### A. ENVIRONMENT VARIABLE TIDAK TERUPDATE
- Solution: Restart frontend setelah mengubah `.env.local`
- File yang diubah: `.env.local` (dari IP 192.168.1.6 ke localhost)

### B. BACKEND TIDAK BERJALAN
- Solution: Pastikan Server Manager menjalankan backend di port 5000
- Test: `Invoke-WebRequest -Uri "http://localhost:5000"`

### C. CORS ISSUE
- Backend sudah dikonfigurasi dengan CORS yang benar
- Headers: `Access-Control-Allow-Origin: *`

### D. NETWORK CONNECTIVITY
- Gunakan localhost bukan IP address untuk development lokal

## VALIDASI SUKSES

### ✅ Backend Response Test
```json
{
  "success": true,
  "message": "AHK script executed successfully", 
  "tempFile": "E:\\Versi 1.4.4\\backend\\temp\\script_1752109410754.ahk"
}
```

### ✅ Frontend URL
- Frontend: http://localhost:8000
- Backend: http://localhost:5000

### ✅ Script AHK v2 Syntax
- Header tanpa `#Requires AutoHotkey v2.0`
- Function syntax: `function() {}`
- Map syntax: `data := Map()`
- Loop syntax: `for index, key in keys {}`

## NEXT STEPS
1. Test di browser frontend (localhost:8000)
2. Coba tombol "Generate Script" dan "Execute Script"
3. Monitor console untuk error logs
4. Jika masih error, restart frontend dan test lagi

## FILE YANG SUDAH DIPERBAIKI
- `src/app/api/generate-ahk/route.ts` - Generator script AHK v2
- `src/app/api/execute-ahk/route.ts` - Executor script via backend
- `.env.local` - Environment variable backend URL
- `backend/server.js` - Endpoint execute-ahk
- Test files: `test-script-validation.ahk`, `test-frontend-backend.html`
