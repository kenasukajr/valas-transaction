# 📚 Panduan Lengkap Sistem Transaksi Valas

## 🎯 Pendahuluan

Sistem Transaksi Valas Blackbox adalah aplikasi manajemen transaksi valuta asing yang dirancang khusus untuk lembaga keuangan dan money changer. Aplikasi ini menyediakan:

- ✅ **Validasi kurs real-time** dengan data dari mbarate.net
- ✅ **Sistem peringatan** untuk rate di luar batas normal  
- ✅ **Manajemen nasabah** lengkap dengan foto
- ✅ **Interface yang user-friendly** dengan navigasi keyboard
- ✅ **Laporan transaksi** yang komprehensif

## 🚀 Memulai

### Langkah 1: Pilih Jenis Transaksi

Aplikasi mendukung 2 jenis transaksi:
- **BNB (Beli Nota Biasa)**: Transaksi pembelian mata uang biasa
- **BNS (Beli Nota Segar)**: Transaksi pembelian mata uang segar/baru

### Langkah 2: Input Data Nasabah

Form nasabah mencakup:
- 📝 **Nama Lengkap** (wajib)
- 🏠 **Alamat** (wajib)  
- 📞 **Nomor Telepon**
- 💼 **Pekerjaan**
- 🆔 **Nomor Identitas** (KTP/Passport)
- 📍 **Tempat Lahir**
- 📅 **Tanggal Lahir**
- 📸 **Foto** (upload atau paste)

### Langkah 3: Proses Transaksi Valas

1. **Klik "Lanjut"** setelah data nasabah lengkap
2. **Input kode mata uang** (1-35) atau ketik nama mata uang
3. **Klik "Cek"** untuk deteksi otomatis
4. **Masukkan jumlah** dalam mata uang asing
5. **Input rate** (akan ada validasi otomatis)
6. **Klik "Betul"** untuk menambah ke tabel transaksi

## 🎯 Sistem Validasi Kurs

### Cara Kerja Validasi

Sistem akan memvalidasi rate yang dimasukkan berdasarkan:

1. **Data kurs real-time** dari mbarate.net
2. **Range toleransi** yang disesuaikan dengan nilai mata uang:
   - **Puluhan ribu** (USD, EUR): Toleransi ±100
   - **Ratusan** (THB, MYR): Toleransi ±50  
   - **Satuan** (VND): Toleransi ±0.10
   - **Desimal**: Toleransi ±0.05

### Modal Peringatan

Jika rate di luar batas normal, akan muncul modal dengan:
- 🔵 **Desain modern** dengan tema biru
- ⚠️ **Informasi detail** rate yang dimasukkan vs range normal
- 🎮 **Navigasi keyboard**: Arrow keys, Enter, Esc
- 🎯 **Default focus** pada tombol "Tidak" (recommended)

### Navigasi Modal

| Tombol | Aksi |
|--------|------|
| `←` `→` | Pindah antara tombol Ya/Tidak |
| `Enter` | Pilih tombol yang aktif |
| `Esc` | Batal (sama dengan klik Tidak) |

Setelah klik "Tidak", fokus otomatis kembali ke field rate untuk koreksi.

## 💱 Daftar Mata Uang

### Mata Uang Mayor

| Kode | Mata Uang | Simbol | Contoh Rate |
|------|-----------|--------|-------------|
| 1 | USD (Dollar Amerika) | $ | 15,650 |
| 2 | EUR (Euro) | € | 17,200 |
| 3 | SGD (Dollar Singapura) | S$ | 11,400 |
| 4 | AUD (Dollar Australia) | A$ | 10,800 |
| 5 | GBP (Pound Sterling) | £ | 19,500 |
| 6 | JPY (Yen Jepang) | ¥ | 108 |
| 7 | HKD (Dollar Hong Kong) | HK$ | 2,010 |
| 8 | CHF (Franc Swiss) | CHF | 17,800 |
| 9 | CAD (Dollar Kanada) | C$ | 11,900 |

### Mata Uang Asia

| Kode | Mata Uang | Simbol | Contoh Rate |
|------|-----------|--------|-------------|
| 10 | CNY/YUAN (Renminbi China) | ¥ | 2,180 |
| 11 | KRW/WON (Won Korea) | ₩ | 12 |
| 12 | THB (Baht Thailand) | ฿ | 480 |
| 13 | MYR (Ringgit Malaysia) | RM | 3,550 |
| 14 | VND (Dong Vietnam) | ₫ | 0.65 |
| 15 | TWD/NT (Dollar Taiwan) | NT$ | 510 |

### Mata Uang Timur Tengah

| Kode | Mata Uang | Simbol | Contoh Rate |
|------|-----------|--------|-------------|
| 16 | SAR (Riyal Saudi) | ﷼ | 4,150 |
| 17 | AED (Dirham UAE) | AED | 4,250 |
| 18 | QAR/QTR (Riyal Qatar) | QR | 4,150 |

*Dan 17 mata uang lainnya...*

## 🎮 Shortcut Keyboard

### Navigasi Umum
- `Tab` / `Shift+Tab`: Pindah antar field
- `Enter`: Konfirmasi/Submit
- `Esc`: Batal/Tutup modal

### Form Transaksi
- `F1`: Focus ke field Kode
- `F2`: Klik tombol Cek
- `F3`: Focus ke field Jumlah  
- `F4`: Focus ke field Rate
- `F5`: Klik tombol Betul

### Modal Validasi
- `←` `→`: Pindah antara Ya/Tidak
- `Enter`: Pilih tombol aktif
- `Esc`: Batal (fokus kembali ke rate)

## 🔧 Troubleshooting

### Masalah Umum

**Q: Modal peringatan tidak muncul meskipun rate salah**
A: Pastikan data kurs ter-update. Cek koneksi ke mbarate.net.

**Q: Dropdown mata uang tidak muncul**
A: Pastikan backend server berjalan di port 5000.

**Q: Foto tidak bisa di-upload**  
A: Cek format file (JPG/PNG) dan ukuran maksimal 5MB.

**Q: Data transaksi tidak tersimpan**
A: Pastikan file `transactions.json` memiliki permission write.

### Error Codes

| Code | Deskripsi | Solusi |
|------|-----------|--------|
| 400 | Bad Request | Cek format data input |
| 404 | Data Not Found | Cek ID transaksi/nasabah |
| 500 | Server Error | Restart backend server |

## 📊 Tips & Best Practices

### Input Data Nasabah
- ✅ **Lengkapi semua field** untuk mencegah error
- ✅ **Upload foto berkualitas** untuk identifikasi
- ✅ **Gunakan format tanggal** DD/MM/YYYY
- ✅ **Nomor telepon** dengan kode negara (+62)

### Transaksi Valas
- ✅ **Cek rate terkini** sebelum input manual
- ✅ **Gunakan kode mata uang** (1-35) untuk input cepat
- ✅ **Validasi rate** sebelum konfirmasi
- ✅ **Double-check jumlah** sebelum submit

### Keamanan Data
- ✅ **Backup data** secara berkala
- ✅ **Gunakan password** untuk operasi delete
- ✅ **Monitor log activity** untuk audit
- ✅ **Update aplikasi** secara rutin

## 🔄 Update & Maintenance

### Auto Update
Aplikasi akan otomatis memeriksa update dari GitHub setiap startup.

### Manual Update
```bash
git pull origin main
npm install
npm run build
```

### Backup Data
```bash
# Backup data penting
cp backend/nasabah.json backup/
cp backend/transactions.json backup/
```

---

*Untuk bantuan lebih lanjut, silakan buka GitHub Issues atau hubungi tim developer.*
