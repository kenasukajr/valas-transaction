# Test Navigasi Keyboard - Blackbox Valas

## Flow Test Scenario:

### 1. Halaman Utama - Navigasi Tombol
1. Buka halaman utama http://localhost:3000
2. Pilih jenis transaksi BNB atau BNS
3. Isi minimal data nasabah (nama)
4. Tekan tombol "Lanjut" untuk membuka area transaksi
5. Area transaksi sekarang aktif

### 2. Test Navigasi Arrow Keys
Setelah area transaksi aktif:
- **Code field** → Arrow Down/Right → **Tombol Cek**
- **Tombol Cek** → Arrow Down/Right → **Amount field**
- **Amount field** → Arrow Down/Right → **Rate field**
- **Rate field** → Arrow Down/Right → **Tombol Betul**
- **Tombol Betul** → Arrow Down/Right → **Tombol Lanjut**
- **Tombol Lanjut** → Arrow Down/Right → **Tombol Selesai Cetak**
- **Tombol Selesai Cetak** → Arrow Down/Right → **Tombol Batal/Ulang**
- **Tombol Batal/Ulang** → Arrow Down/Right → **Code field** (loop)

### 3. Test Navigasi Terbalik
- **Arrow Up/Left** untuk navigasi ke arah sebaliknya

### 4. Test Halaman Nasabah
1. Buka http://localhost:3000/nasabah
2. Pastikan hanya menampilkan data nasabah
3. **Tidak ada kolom**: Currency, Amount, Rate, Jumlah Rupiah

### 5. Test Halaman Transaksi  
1. Buka http://localhost:3000/transaksi
2. Pastikan menampilkan detail transaksi valas
3. **Ada kolom**: Currency, Amount, Rate, Jumlah Rupiah

## Expected Result:
✅ Navigasi arrow keys berfungsi untuk semua tombol
✅ Halaman nasabah hanya data nasabah
✅ Halaman transaksi dengan detail valas
✅ Enter tetap berfungsi untuk eksekusi aksi
