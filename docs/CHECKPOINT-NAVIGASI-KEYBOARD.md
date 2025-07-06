# CHECKPOINT: Perbaikan Flow Fokus Bertahap

## Tanggal: 6 Juli 2025

## Perubahan yang Dilakukan:

### 1. Flow 2 Tahap yang Lebih Logis

#### **TAHAP 1 - Setelah Jenis Transaksi Dipilih**
- **Fokus**: Otomatis ke field **Nama** (bukan Code)
- **Area Transaksi**: Tetap grey out dan disabled
- **Tujuan**: User harus lengkapi data nasabah dulu
- **Tooltip**: "Tekan tombol Lanjut pada form nasabah terlebih dahulu"

#### **TAHAP 2 - Setelah Tombol "Lanjut" Ditekan**
- **Area Transaksi**: Terbuka (`isTransactionAreaOpen = true`)
- **Fokus**: Otomatis pindah ke field **Code**
- **Tujuan**: User dapat mulai input transaksi valas
- **Tooltip**: Kembali normal sesuai fungsi masing-masing

### 2. State Baru: `isTransactionAreaOpen`
- **Tujuan**: Mengontrol akses ke area transaksi valas
- **Default**: `false` (area transaksi tertutup)
- **Diaktifkan**: Saat tombol "Lanjut" di form nasabah ditekan
- **Direset**: Saat submit berhasil atau tombol "Batal/Ulang"

### 3. Kondisi Disabled yang Diperbarui
- **Sebelumnya**: `disabled={!jenisTransaksi}`
- **Sekarang**: `disabled={!isTransactionAreaOpen}`
- **Field yang terpengaruh**: Code, Amount, Rate, semua tombol transaksi

### 4. Auto-Focus Bertahap
```typescript
// Tahap 1: Fokus ke nama setelah jenis transaksi dipilih
useEffect(() => {
  if (mounted && jenisTransaksi && !isTransactionAreaOpen) {
    const nameField = document.getElementById('name');
    if (nameField) nameField.focus();
  }
}, [mounted, jenisTransaksi, isTransactionAreaOpen]);

// Tahap 2: Fokus ke Code setelah area transaksi dibuka
useEffect(() => {
  if (mounted && isTransactionAreaOpen && kodeRef.current) {
    kodeRef.current.focus();
  }
}, [mounted, isTransactionAreaOpen]);
```

### 5. Modifikasi UserFormRight.tsx
- **Tambah prop**: `onLanjutClick?: () => void`
- **Tombol Lanjut**: Panggil callback untuk mengaktifkan area transaksi
- **Flow**: onClick → callback → fokus ke Code

### 6. Reset Behavior
- **handleSubmit**: Reset `isTransactionAreaOpen = false`
- **handleBatalUlangClick**: Reset semua termasuk `jenisTransaksi = ''`
- **Tidak ada auto-focus**: Setelah reset, halaman kembali netral

### 7. User Experience yang Diperbaiki

#### **Urutan Kerja yang Logis:**
1. **Buka halaman**: Semua grey, tidak ada fokus
2. **Pilih BNB/BNS**: Fokus ke nama, siap isi data nasabah
3. **Isi data nasabah**: Form nasabah aktif, area transaksi masih grey
4. **Tekan "Lanjut"**: Area transaksi terbuka, fokus ke Code
5. **Input transaksi**: Flow normal seperti biasa
6. **Submit/Batal**: Kembali ke tahap 1

#### **Feedback Visual Jelas:**
- **Grey area**: Belum saatnya diisi
- **Tooltip informatif**: User tahu harus melakukan apa
- **Fokus terarah**: User tidak bingung mau ngapain

### 8. Tooltip yang Diperbarui
- **Area transaksi disabled**: "Tekan tombol Lanjut pada form nasabah terlebih dahulu"
- **Area transaksi enabled**: Tooltip normal sesuai fungsi

## File yang Diubah:
- `src/app/page.tsx`: State baru, auto-focus bertahap, kondisi disabled
- `src/components/UserFormRight.tsx`: Prop callback, modifikasi tombol Lanjut

## Flow Lengkap:
```
Halaman Buka
     ↓
Pilih BNB/BNS → Fokus: Nama
     ↓
Isi Data Nasabah
     ↓
Tekan "Lanjut" → Area Transaksi Terbuka + Fokus: Code
     ↓
Input Transaksi Valas
     ↓
Submit/Batal → Reset ke Awal
```

## Test Scenario:
- [x] Buka halaman: semua grey, tidak ada fokus
- [x] Pilih BNB: fokus ke nama, area transaksi masih grey
- [x] Isi nama, tekan Lanjut: area transaksi terbuka, fokus ke Code
- [x] Input transaksi normal
- [x] Submit: kembali ke kondisi awal (semua grey)
- [x] Batal/Ulang: reset total termasuk jenis transaksi

## Commit: 59cf314
**Message**: "Perbaikan flow fokus: Nama → Transaksi berdasarkan tahap"

---

## Update Tambahan:

### 1. Perbaikan Navigasi Keyboard Tombol (6 Juli 2025)
- **Tombol "Selesai Cetak"**: Ditambahkan `ref={selesaiCetakButtonRef}` dan `onKeyDown` handler
- **Navigasi Arrow Keys**: Semua tombol (Betul, Lanjut, Selesai Cetak, Batal/Ulang) sudah mendukung navigasi anak panah
- **Flow Navigasi**: Betul → Lanjut → Selesai Cetak → Batal/Ulang → (loop kembali ke Code)

### 2. Konfirmasi Halaman Nasabah
- **Tampilan**: Tetap hanya menampilkan data nasabah (nama, alamat, tanggal lahir, dll)
- **Kolom Valas**: Tidak ditampilkan (`showValasColumns={false}`)
- **Konsistensi**: Berbeda dengan halaman transaksi yang menampilkan detail transaksi valas

### Test Navigasi Keyboard:
- [x] Tombol Betul: Arrow down/right → Lanjut
- [x] Tombol Lanjut: Arrow down/right → Selesai Cetak  
- [x] Tombol Selesai Cetak: Arrow down/right → Batal/Ulang
- [x] Tombol Batal/Ulang: Arrow down/right → Code (loop)
- [x] Navigasi terbalik dengan Arrow up/left
- [x] Enter tetap berfungsi untuk eksekusi aksi tombol
