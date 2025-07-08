# AHK Image Recognition Setup Guide

## 📸 Cara Menggunakan Image Recognition di AHK

### 1. **Persiapan Screenshot**

Untuk menggunakan image recognition, Anda perlu menyiapkan 2 screenshot referensi:

#### Screenshot 1: `program_ready_indicator.png`
- **Tujuan**: Mendeteksi bahwa program MBA sudah terbuka sempurna
- **Cara**:
  1. Buka program MBA sampai fully loaded
  2. Screenshot bagian yang unik dan selalu ada (misalnya: logo, title bar, atau UI element spesifik)
  3. Crop screenshot jadi area kecil yang spesifik (misalnya 100x50 pixel)
  4. Save sebagai `program_ready_indicator.png`

#### Screenshot 2: `form_ready_indicator.png` 
- **Tujuan**: Mendeteksi bahwa form input sudah ready untuk diisi
- **Cara**:
  1. Pastikan form dalam kondisi siap diisi (setelah reset dengan R)
  2. Screenshot bagian yang menunjukkan form ready (misalnya: field "Nama", button "OK", atau label spesifik)
  3. Crop screenshot jadi area kecil yang spesifik
  4. Save sebagai `form_ready_indicator.png`

### 2. **Penempatan File Screenshot**

Simpan kedua file screenshot di folder yang sama dengan script AHK:
```
g:\Versi 1.4.1\
├── script-production-image-recognition.ahk
├── program_ready_indicator.png
└── form_ready_indicator.png
```

### 3. **Cara Mengambil Screenshot yang Baik**

#### Tips untuk Screenshot Berkualitas:
- **Area Kecil**: Crop hanya bagian yang penting (50x50 sampai 200x200 pixel)
- **Element Unik**: Pilih bagian yang unik dan tidak berubah-ubah
- **High Contrast**: Pilih area dengan kontras tinggi (mudah dibedakan)
- **Tidak Ada Teks Berubah**: Hindari area dengan tanggal/waktu yang berubah

#### Contoh Area yang Bagus:
- Logo PT Mulia Bumi Arta
- Button "OK" atau "Batal"
- Icon atau symbol yang tidak berubah
- Label field yang tetap (misalnya text "Nama:")

#### Contoh Area yang Buruk:
- Tanggal/waktu yang berubah
- Field input yang kosong (bisa berubah warna)
- Area yang bisa tertutup window lain

### 4. **Pengaturan Tolerance**

Di script, ada parameter `*50` yang artinya tolerance 50 dari 255:
```ahk
ImageSearch, FoundX, FoundY, 0, 0, A_ScreenWidth, A_ScreenHeight, *50 program_ready_indicator.png
```

**Tolerance Values:**
- `*0`: Exact match (sangat strict)
- `*50`: Medium tolerance (recommended)
- `*100`: High tolerance (lebih permisif)

### 5. **Testing Image Recognition**

#### Test Script Sederhana:
```ahk
; Test apakah screenshot bisa dideteksi
ImageSearch, FoundX, FoundY, 0, 0, A_ScreenWidth, A_ScreenHeight, *50 program_ready_indicator.png
if ErrorLevel = 0
{
    MsgBox, Image found at X:%FoundX% Y:%FoundY%
}
else
{
    MsgBox, Image not found! ErrorLevel: %ErrorLevel%
}
```

### 6. **Troubleshooting**

#### Jika Image Tidak Terdeteksi:
1. **Check File Path**: Pastikan file PNG ada di folder yang benar
2. **Check Resolution**: Pastikan resolusi layar sama dengan saat screenshot
3. **Check Window State**: Pastikan window tidak minimized atau tertutup
4. **Adjust Tolerance**: Coba naikkan nilai tolerance (*50 → *80)
5. **Check Image Size**: Pastikan screenshot tidak terlalu besar atau kecil

#### Error Codes:
- `ErrorLevel = 0`: Image found (sukses)
- `ErrorLevel = 1`: Image not found
- `ErrorLevel = 2`: File not found atau error lainnya

### 7. **Implementasi di Script Utama**

Setelah screenshot siap, Anda bisa:

1. **Replace timing-based approach** dengan image recognition
2. **Kombinasi**: Gunakan image recognition + timing sebagai backup
3. **Multiple checks**: Cek beberapa element untuk lebih akurat

### 8. **Keuntungan Image Recognition**

✅ **Lebih Reliable**: Tidak tergantung timing  
✅ **Visual Verification**: Benar-benar "melihat" kondisi program  
✅ **Adaptive**: Bisa menunggu sampai kondisi yang tepat  
✅ **User Friendly**: Tidak perlu user manually confirm  

### 9. **Langkah Implementasi**

1. **Ambil screenshot** dari 2 kondisi berbeda program MBA
2. **Crop dan save** sebagai PNG files  
3. **Test image recognition** dengan script sederhana
4. **Integrate** ke script utama
5. **Fine-tune tolerance** sesuai kebutuhan

---

**Note**: Image recognition akan sangat reliable jika screenshot diambil dengan benar dan tolerance disesuaikan dengan tepat!
