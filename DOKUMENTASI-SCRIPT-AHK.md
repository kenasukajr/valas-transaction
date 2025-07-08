# DOKUMENTASI SCRIPT AHK PT MULIA BUMI ARTA

## OVERVIEW
Script AutoHotkey (AHK) ini dikembangkan untuk mengotomatisasi pengisian data nasabah dan transaksi valas pada aplikasi desktop "PT Mulia Bumi Arta". Script ini dapat mengisi data nasabah (nama, alamat, telepon, pekerjaan, ID, tempat tanggal lahir) dan data transaksi (currency code, amount, rate) secara otomatis.

## FITUR UTAMA

### 1. **Deteksi Window Aplikasi**
- Otomatis mendeteksi apakah aplikasi "Data Prosesing PT Mulia Bumi Arta" sedang berjalan
- Mengaktifkan, memaksimalkan, dan memfokuskan window aplikasi
- Menampilkan error jika aplikasi tidak ditemukan

### 2. **Pengisian Data Nasabah**
- Nama Lengkap
- Alamat (dibatasi 70 karakter)
- Nomor Telepon
- Pekerjaan
- Nomor Identitas
- Tempat Tanggal Lahir (format: Jakarta 15/05/1990)

### 3. **Pengisian Data Transaksi**
- Currency Code (mapping otomatis)
- Amount (jumlah transaksi)
- Exchange Rate (kurs)
- Navigasi otomatis antar field

### 4. **Navigasi Otomatis**
- Tab navigation antar field
- Timing yang disesuaikan untuk mencegah error
- Window activation untuk memastikan fokus yang benar

## CURRENCY CODE MAPPING

| Currency | Code | Keterangan |
|----------|------|------------|
| USD      | 1    | US Dollar  |
| EUR      | 2    | Euro       |
| GBP      | 3    | British Pound |
| AUD      | 4    | Australian Dollar |
| CAD      | 5    | Canadian Dollar |
| CHF      | 6    | Swiss Franc |
| JPY      | 7    | Japanese Yen |
| SGD      | 8    | Singapore Dollar |

## CARA PENGGUNAAN

### 1. **Persiapan**
- Pastikan aplikasi "PT Mulia Bumi Arta" sudah terbuka
- Pastikan form dalam keadaan kosong/siap diisi
- Posisikan kursor di field "Nama Lengkap" (field pertama)

### 2. **Generate Script**
- Akses aplikasi web di browser
- Isi data nasabah dan transaksi
- Klik tombol "Generate AHK Script"
- Download file script.ahk

### 3. **Menjalankan Script**
- Double-click file script.ahk yang telah didownload
- Script akan otomatis mengisi data dan menghapus dirinya sendiri

### 4. **Validasi**
- Periksa apakah semua field terisi dengan benar
- Pastikan currency code sesuai dengan yang diinginkan
- Pastikan kalkulasi Rupiah Equivalent benar

## STRUKTUR SCRIPT

### 1. **Window Detection**
```autohotkey
IfWinExist, Data Prosesing PT Mulia Bumi Arta
{
    WinRestore, Data Prosesing PT Mulia Bumi Arta
    WinActivate, Data Prosesing PT Mulia Bumi Arta
    WinMaximize, Data Prosesing PT Mulia Bumi Arta
}
```

### 2. **TypeString Function**
```autohotkey
TypeString(str) {
    Loop Parse, str
    {
        Send %A_LoopField%
        Sleep 0
    }
}
```

### 3. **Data Nasabah**
```autohotkey
data := {}
data["Nama Lengkap"] := "NAMA_NASABAH"
data["Alamat"] := "ALAMAT_NASABAH"
// ... dst
```

### 4. **Loop Pengisian Data**
```autohotkey
keys := ["Nama Lengkap", "Alamat", "Nomor Telepon", "Pekerjaan", "Nomor Identitas", "Tempat Tanggal Lahir"]
for index, key in keys
{
    TypeString(data[key])
    Sleep 100
    Send {Tab}
    Sleep 200
}
```

### 5. **Navigasi ke Transaksi**
```autohotkey
; Tunggu setelah selesai isi data nasabah
Sleep, 1000

; Pastikan window masih aktif
WinActivate, Data Prosesing PT Mulia Bumi Arta
Sleep, 500

; Navigasi ke tabel transaksi
Send, {Tab}
Sleep, 400
Send, {Tab}
Sleep, 400
Send, {Tab}
Sleep, 400
```

### 6. **Pengisian Transaksi**
```autohotkey
; Isi Code Currency
Send, 1  ; USD = 1
Sleep, 600

; Tab ke field Amount
Send, {Tab}
Sleep, 400

; Isi Amount
TypeString("1000")
Sleep, 500

; Tab ke field Exchange Rate
Send, {Tab}
Sleep, 400

; Isi Exchange Rate
TypeString("15750")
Sleep, 500

; Enter untuk konfirmasi
Send, {Enter}
Sleep, 1000
```

## TIMING KONFIGURASI

| Aksi | Sleep (ms) | Keterangan |
|------|------------|------------|
| Antar character | 0 | Typing speed |
| Setelah TypeString | 100-500 | Tunggu field terisi |
| Setelah Tab | 200-400 | Tunggu navigasi |
| Setelah Enter | 500-1000 | Tunggu konfirmasi |
| Window Activate | 500 | Tunggu fokus |
| Navigasi ke transaksi | 1000 | Tunggu form siap |

## TROUBLESHOOTING

### 1. **Script Tidak Berjalan**
- Pastikan AutoHotkey sudah terinstall
- Pastikan aplikasi "PT Mulia Bumi Arta" terbuka
- Pastikan window name sama persis: "Data Prosesing PT Mulia Bumi Arta"

### 2. **Data Tidak Terisi**
- Periksa apakah kursor berada di field yang benar
- Tingkatkan timing Sleep jika aplikasi lambat
- Pastikan tidak ada dialog/popup yang menghalangi

### 3. **Currency Code Salah**
- Periksa mapping currency code dengan aplikasi sesungguhnya
- Update mapping jika ada perubahan di aplikasi
- Pastikan currency yang dipilih tersedia dalam mapping

### 4. **Navigasi Tidak Tepat**
- Sesuaikan jumlah Tab untuk navigasi ke transaksi
- Periksa apakah ada field tambahan yang perlu dilewati
- Gunakan script step-by-step untuk debugging

## FILES YANG DIHASILKAN

### 1. **Production Scripts**
- `test-script-improved.ahk` - Script utama yang diperbaiki
- `test-currency-[CURRENCY].ahk` - Script untuk setiap currency
- `test-jpy-special.ahk` - Script khusus JPY dengan nominal besar

### 2. **Debug Scripts**
- `script-mba-step-by-step.ahk` - Script dengan validasi manual setiap step
- `script-mba-optimized.ahk` - Script optimized dengan komentar lengkap

### 3. **Test Files**
- `test-script-improved.js` - Test API generator
- `test-multiple-currencies.js` - Test berbagai currency
- `test-ahk-final-validation.js` - Validasi akhir

## MAINTENANCE

### 1. **Update Currency Mapping**
Jika ada perubahan currency code di aplikasi:
```typescript
// Di file: src/app/api/generate-ahk/route.ts
if (data.currency === 'USD') currencyCode = '1'
else if (data.currency === 'EUR') currencyCode = '2'
// ... tambahkan currency baru
```

### 2. **Adjust Timing**
Jika aplikasi menjadi lebih lambat/cepat:
```autohotkey
Sleep, 400  ; Sesuaikan nilai ini
```

### 3. **Update Field Order**
Jika urutan field berubah:
```autohotkey
keys := ["Nama Lengkap", "Alamat", "..."]  ; Sesuaikan urutan
```

## TESTING

### 1. **Unit Test**
```bash
node test-script-improved.js
```

### 2. **Currency Test**
```bash
node test-multiple-currencies.js
```

### 3. **Manual Test**
- Jalankan script-mba-step-by-step.ahk
- Validasi setiap step secara manual
- Periksa hasil akhir di aplikasi

## CHANGELOG

### Version 1.4.1
- Memperbaiki navigasi ke bagian transaksi
- Menambahkan currency code mapping lengkap
- Optimasi timing untuk stabilitas
- Menambahkan auto-delete script
- Menambahkan validasi window detection

### Version 1.4.0
- Implementasi awal script AHK
- Pengisian data nasabah dan transaksi
- Basic navigation dan typing

## CONTACT

Untuk pertanyaan atau perbaikan script, silakan hubungi:
- Developer: Puji Purnawan
- Email: [email]
- Project: PT Mulia Bumi Arta Automation

---

**CATATAN PENTING:**
- Script ini dibuat khusus untuk aplikasi "PT Mulia Bumi Arta"
- Pastikan untuk melakukan backup data sebelum menggunakan script
- Lakukan testing pada data dummy sebelum menggunakan data real
- Script akan menghapus dirinya sendiri setelah selesai dijalankan
