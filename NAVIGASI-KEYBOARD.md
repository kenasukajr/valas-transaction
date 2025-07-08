# 🎯 Navigasi Keyboard dengan Enter - Form Transaksi Valas

## 📋 **Urutan Navigasi Form**

### 🔢 **Alur Input Utama (Baru):**
```
1. Code → Enter (fokus ke tombol Cek) → Enter (jalankan pencarian) → Amount → Rate → Betul → Lanjut → (reset & kembali ke Code)
```

### 🔄 **Alur Lengkap Transaksi:**
```
Code → Cek → Amount → Rate → Betul (data masuk tabel) → Lanjut (reset form) → Code (transaksi baru)
```

### 💰 **Mode BNS (Beli Nota Segar) - Field Pembayaran:**
```
Code → Cek → Amount → Rate → Betul → Lanjut → Code (dengan field Pembayaran Rp aktif)
```

## ⌨️ **Shortcut Keyboard**

| Field | Aksi Enter | Tujuan |
|-------|------------|--------|
| **Code** | Pindah fokus ke tombol Cek | Bersiap untuk pencarian |
| **Cek (button)** | Jalankan pencarian + pindah ke Amount | Mencari mata uang dan lanjut input |
| **Amount** | Pindah ke Rate | Input jumlah selesai |
| **Rate** | Pindah ke tombol Betul | Input rate selesai, siap konfirmasi |
| **Betul (button)** | Data masuk tabel + fokus ke Lanjut | Konfirmasi data transaksi |
| **Lanjut (button)** | Reset form + fokus ke Code | Siap transaksi berikutnya |
| **Pembayaran Rp** | (khusus BNS) Input manual | Field opsional untuk mode BNS |

## 🔢 **Navigasi Tabel Multi-Row**

### 📊 **Tabel Baris 2-10:**
```
Valas → Jumlah → Rate → Baris berikutnya
```

**Detail:**
- **Field Valas**: Enter → Pindah ke Jumlah (baris sama)
- **Field Jumlah**: Enter → Pindah ke Rate (baris sama)  
- **Field Rate**: Enter → Pindah ke Valas (baris berikutnya)
- **Baris terakhir**: Enter → Kembali ke Code (atas)

## 🎯 **Fitur Auto-Focus**

- ✅ **Auto-focus** ke field Code saat halaman dimuat
- ✅ **Enter pertama** di Code → fokus ke tombol Cek
- ✅ **Enter kedua** di tombol Cek → jalankan pencarian + pindah ke Amount
- ✅ **Auto-focus** ke Amount setelah berhasil cek Code  
- ✅ **Rate → Betul → Lanjut** navigasi untuk konfirmasi data
- ✅ **Smart reset** field input atas setelah tombol Lanjut
- ✅ **Loop navigation** untuk input transaksi berkelanjutan
- ✅ **Data persistence** di field Code (tidak dihapus setelah pencarian)

## 🔧 **Validasi Input**

- ⚠️ **Field Code**: Wajib diisi sebelum pencarian
- ⚠️ **Field Amount**: Harus angka positif sebelum Betul
- ⚠️ **Field Rate**: Harus angka positif sebelum Betul
- ✅ **Auto-calc**: Rupiah Equivalent otomatis terhitung
- ✅ **Toast notification** untuk feedback error/sukses
- ✅ **Auto-select text** di field Code setelah selesai transaksi

## 🔧 **Perilaku Field Code**

### 📝 **Input dan Pencarian:**
- **Field kosong saat awal**: Tidak ada placeholder angka yang ditampilkan
- **Input tetap tampil**: Angka/kode yang diinput user tidak dihapus setelah pencarian berhasil
- **Hanya reset saat transaksi selesai**: Field Code baru dikosongkan saat selesai transaksi lengkap

### 🔍 **Contoh Alur:**
```
1. User ketik "1" di Code → Enter → fokus ke tombol Cek
2. Enter di tombol Cek → cari USD → field Code tetap "1", valas2 terisi "USD"
3. Lanjut input Amount dan Rate
4. Setelah transaksi selesai → field Code baru dikosongkan untuk transaksi baru
```

## 💡 **Tips Penggunaan**

1. **Quick Entry**: Ketik nomor di Code → Enter → langsung lanjut input
2. **Continuous Input**: Setelah selesai satu transaksi, langsung input berikutnya
3. **Multi-Currency**: Gunakan tabel baris 2-10 untuk transaksi multi mata uang
4. **Keyboard Only**: Seluruh form dapat dioperasikan tanpa mouse

## 🔧 **Fitur Tambahan**

- **Placeholder hints** di setiap field
- **Tooltips** dengan instruksi navigasi
- **Visual feedback** saat perpindahan fokus
- **Auto-select** text di field Code untuk input cepat

## 📊 **Auto-Refresh Tabel Kurs**

### 🔄 **Refresh Otomatis saat Ganti Jenis Transaksi:**
- Tabel kurs **otomatis refresh** saat memilih jenis transaksi (BNB/BNS)
- Data kurs selalu **up-to-date** sesuai mode transaksi yang dipilih
- **Tidak ada refresh berlebihan** - hanya saat benar-benar diperlukan

### 📈 **Cara Kerja:**
```
1. User pilih jenis transaksi → BNB atau BNS
2. Tabel kurs otomatis refresh
3. Data kurs terbaru ditampilkan
4. Siap untuk transaksi dengan data akurat
```

## 🏹 **Navigasi dengan Arrow Keys**

### ➡️ **Arrow Right / Arrow Down (Maju):**
```
Code → Cek → Amount → Rate → Betul → Lanjut → Code (loop)
```

### ⬅️ **Arrow Left / Arrow Up (Mundur):**
```
Lanjut → Betul → Rate → Amount → Cek → Code → Lanjut (loop)
```

### 🎯 **Kombinasi Navigasi:**
- **Enter**: Eksekusi aksi + pindah ke field berikutnya
- **Arrow Keys**: Pindah field tanpa eksekusi aksi
- **Tab**: Navigasi browser default (jika diperlukan)

---

**🚀 Dengan navigasi Enter ini, input transaksi valas menjadi lebih cepat dan efisien!**
