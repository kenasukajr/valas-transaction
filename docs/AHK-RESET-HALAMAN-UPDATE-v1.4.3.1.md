# AHK Script Update - Reset Halaman dengan Tombol R

## Update Version 1.4.3.1

### Perubahan yang Dilakukan

**Masalah**: Skrip AHK tidak selalu bekerja dengan baik karena halaman program PT Mulia Bumi Arta mungkin tidak berada di posisi netral saat skrip dimulai.

**Solusi**: Menambahkan instruksi untuk menekan tombol **R** di awal setiap skrip AHK untuk memastikan halaman program berada di posisi netral sebelum memulai pengisian data.

### Files yang Diupdate

#### 1. `script-production.ahk`
- **Perubahan**: Menambahkan reset halaman dengan tombol R setelah persiapan user
- **Lokasi**: Setelah sleep 3000, sebelum pengisian data nasabah
- **Kode yang ditambahkan**:
```ahk
; === RESET HALAMAN KE POSISI NETRAL ===
; Tekan tombol R untuk memastikan halaman program PT Mulia Bumi Arta di posisi netral
Send, r
Sleep, 1000
MsgBox, 64, Reset Halaman, Halaman program telah direset ke posisi netral.`n`nPastikan kursor sekarang berada di field NAMA LENGKAP (field pertama).`n`nKlik OK untuk melanjutkan pengisian data., 10
Sleep, 1000
```

#### 2. `script-mba-optimized.ahk`
- **Perubahan**: Menambahkan reset halaman dengan tombol R setelah persiapan user
- **Lokasi**: Setelah MsgBox perhatian, sebelum pengisian data
- **Kode yang ditambahkan**:
```ahk
; === RESET HALAMAN KE POSISI NETRAL ===
; Tekan tombol R untuk memastikan halaman program PT Mulia Bumi Arta di posisi netral
Send, r
Sleep, 1000
MsgBox, 0, Reset Halaman, Halaman program telah direset ke posisi netral.`n`nPastikan kursor sekarang berada di field NAMA LENGKAP (field pertama).`n`nKlik OK untuk melanjutkan., 8
Sleep, 1000
```

#### 3. `script-mba-step-by-step.ahk`
- **Perubahan**: Menambahkan reset halaman dengan tombol R setelah persiapan
- **Lokasi**: Setelah MsgBox persiapan, sebelum Step 1
- **Kode yang ditambahkan**:
```ahk
; === RESET HALAMAN KE POSISI NETRAL ===
; Tekan tombol R untuk memastikan halaman program PT Mulia Bumi Arta di posisi netral
Send, r
Sleep, 1000
MsgBox, 0, Reset Halaman, Halaman program telah direset ke posisi netral.`n`nPastikan kursor sekarang berada di field NAMA LENGKAP (field pertama).`n`nKlik OK untuk melanjutkan ke Step 1., 10
Sleep, 1000
```

#### 4. `script-mba-application.ahk`
- **Perubahan**: Menambahkan reset halaman dengan tombol R setelah aktivasi window
- **Lokasi**: Setelah aktivasi window, sebelum Send {Enter}
- **Kode yang ditambahkan**:
```ahk
; === RESET HALAMAN KE POSISI NETRAL ===
; Tekan tombol R untuk memastikan halaman program PT Mulia Bumi Arta di posisi netral
Send, r
Sleep, 1000
MsgBox, 0, Reset Halaman, Halaman program telah direset ke posisi netral.`n`nPastikan kursor sekarang berada di field NAMA LENGKAP.`n`nKlik OK untuk melanjutkan., 8
Sleep, 1000
```

#### 5. `tools/autohotkey/auto_type_form.ahk`
- **Perubahan**: Menambahkan reset halaman dengan tombol R di awal hotkey
- **Lokasi**: Di awal fungsi ^t::, sebelum pilih jenis transaksi
- **Kode yang ditambahkan**:
```ahk
; === RESET HALAMAN KE POSISI NETRAL ===
; Tekan tombol R untuk memastikan halaman program PT Mulia Bumi Arta di posisi netral
Send, r
Sleep, 1000
```

### Manfaat Update

1. **Konsistensi**: Semua skrip sekarang selalu memulai dari posisi netral
2. **Reliability**: Mengurangi kemungkinan error karena posisi kursor yang tidak tepat
3. **User Experience**: User mendapat konfirmasi bahwa halaman sudah direset
4. **Debugging**: Lebih mudah untuk troubleshoot jika ada masalah

### Urutan Eksekusi Baru

1. **Aktivasi Window** - Pastikan aplikasi PT Mulia Bumi Arta aktif
2. **Persiapan User** - Dialog untuk memastikan user siap
3. **⭐ RESET HALAMAN** - Tekan tombol R untuk reset ke posisi netral
4. **Konfirmasi Reset** - Dialog konfirmasi bahwa halaman sudah direset
5. **Pengisian Data** - Mulai mengisi data nasabah dan transaksi

### Testing

Setelah update ini, silakan test:
1. Buka aplikasi PT Mulia Bumi Arta
2. Navigasi ke halaman manapun (tidak perlu di posisi netral)
3. Jalankan salah satu skrip AHK
4. Verify bahwa tombol R ditekan dan halaman kembali ke posisi netral
5. Verify bahwa kursor berada di field NAMA LENGKAP
6. Verify bahwa pengisian data berjalan dengan normal

### Catatan Penting

- Tombol **R** harus berfungsi untuk reset halaman di aplikasi PT Mulia Bumi Arta
- Jika tombol R tidak berfungsi, update ini perlu disesuaikan dengan hotkey yang sesuai
- Delay 1000ms setelah menekan R memberikan waktu untuk aplikasi memproses reset
- MsgBox memberikan kesempatan user untuk memverifikasi posisi kursor sebelum melanjutkan

### Version History

- **v1.4.3**: Implementasi fitur preview gambar dan auto kapitalisasi
- **v1.4.3.1**: Penambahan reset halaman dengan tombol R di semua skrip AHK

---
*Update dilakukan pada: 2025-07-08*  
*Affected files: 5 AHK scripts*
