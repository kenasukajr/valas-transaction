# DEBUGGING GUIDE - Preview Gambar & Auto Kapitalisasi

## 🚀 SERVER STATUS
✅ Development server sudah berjalan di http://localhost:8000

## 🔍 DEBUGGING STEPS

### 1. **TEST PREVIEW GAMBAR**
1. Buka http://localhost:8000 di browser
2. Buka DevTools (F12) -> Console tab
3. Ketik nama random (bukan yang ada di data) misal: "JOHN DOE"
4. Upload gambar atau paste gambar (Ctrl+V)
5. **Lihat console log** - seharusnya muncul:
   ```
   🔍 UserFormRight useEffect triggered: {previewSuggestion: null, formData.images: [...], ...}
   📋 Using formData images (upload manual)
   ✅ Setting images from formData.images: [...]
   ```

### 2. **TEST AUTO KAPITALISASI**
1. Klik field "Nama Lengkap" atau "Alamat" atau "Pekerjaan"
2. Ketik huruf kecil: "john doe"
3. **Lihat console log** - seharusnya muncul:
   ```
   🔍 handleInputChange called: {name: "name", value: "john doe"}
   ✅ Auto kapitalisasi applied: {original: "john doe", capitalized: "JOHN DOE"}
   📤 Calling onValueChange with: {name: "name", autoValue: "JOHN DOE"}
   🔍 handleValueChange called: {name: "name", value: "JOHN DOE"}
   ✅ FormData updated: {name: "JOHN DOE", ...}
   ```

### 3. **TEST FIELD YANG TIDAK AUTO KAPITAL**
1. Klik field "Nomor Identitas" (idNumber)
2. Ketik: "1234567890"
3. **Lihat console log** - seharusnya muncul:
   ```
   🔍 handleInputChange called: {name: "idNumber", value: "1234567890"}
   📋 Auto kapitalisasi skipped for field: idNumber
   📤 Calling onValueChange with: {name: "idNumber", autoValue: "1234567890"}
   ```

## 🐛 POSSIBLE ISSUES

### A. **Jika Preview Gambar Tidak Muncul:**
- Cek console log saat upload
- Jika tidak ada log "🔍 UserFormRight useEffect triggered", berarti props tidak sampai ke UserFormRight
- Jika ada log tapi tidak ada "✅ Setting images", berarti ada masalah dengan kondisi
- Cek Network tab - apakah upload API berhasil (status 200)

### B. **Jika Auto Kapitalisasi Tidak Bekerja:**
- Cek console log saat ketik
- Jika tidak ada log "🔍 handleInputChange called", berarti event handler tidak terpasang
- Jika ada log tapi tidak ada "✅ Auto kapitalisasi applied", berarti kondisi field salah
- Cek apakah field menggunakan onChange={handleInputChange}

### C. **Jika FormData Tidak Terupdate:**
- Cek apakah ada log "🔍 handleValueChange called"
- Cek apakah ada log "✅ FormData updated"
- Cek React DevTools untuk melihat state changes

## 📋 QUICK FIXES

### 1. **Hard Refresh Browser**
```bash
Ctrl + F5 (Windows)
Cmd + Shift + R (Mac)
```

### 2. **Clear Browser Cache**
```bash
DevTools -> Application -> Storage -> Clear site data
```

### 3. **Restart Dev Server**
```bash
Ctrl + C (di terminal)
npm run dev
```

## 🎯 EXPECTED BEHAVIOR

### ✅ **Preview Gambar HARUS:**
- Muncul langsung setelah upload/paste
- Tidak ada delay
- Gambar terlihat di preview area

### ✅ **Auto Kapitalisasi HARUS:**
- Semua field kecuali "Nomor Identitas" dan "Tanggal Lahir"
- Huruf kecil langsung jadi huruf besar
- Real-time (tidak perlu blur field)

---

**LAKUKAN TESTING SEKARANG!**
1. Buka http://localhost:8000
2. Buka DevTools Console
3. Test upload gambar
4. Test auto kapitalisasi
5. Lihat console log dan laporkan hasil

Jika ada error atau behavior yang tidak sesuai, copy paste console log untuk debugging lebih lanjut.
