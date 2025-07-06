# CHECKPOINT: Grey Out Fields Sebelum Jenis Transaksi Dipilih

## Tanggal: 6 Juli 2025

## Perubahan yang Dilakukan:

### 1. Auto-Focus Dinonaktifkan
- **Sebelumnya**: Field Code langsung mendapat fokus saat halaman dimuat
- **Sekarang**: Auto-focus ke field Code hanya berfungsi setelah jenis transaksi (BNB/BNS) dipilih
- **Efek**: Halaman menjadi netral tanpa fokus di mana pun saat pertama dibuka

### 2. Semua Field Transaksi Valas Grey Out
Jika `jenisTransaksi` belum dipilih, semua field menjadi:
- **Disabled**: `disabled={!jenisTransaksi}`
- **Visual**: Background grey (`bg-gray-200`) dan `cursor-not-allowed`
- **Tooltip**: Berubah menjadi "Pilih jenis transaksi terlebih dahulu"

#### Field yang Dimodifikasi:
- **Field Code**: `bg-gray-200 cursor-not-allowed` jika disabled
- **Field Amount**: `bg-gray-200 cursor-not-allowed` jika disabled  
- **Field Rate**: `bg-gray-200 cursor-not-allowed` jika disabled

### 3. Semua Tombol Transaksi Valas Grey Out
Jika `jenisTransaksi` belum dipilih, tombol menjadi:
- **Disabled**: `disabled={!jenisTransaksi}`
- **Visual**: `bg-gray-400 text-gray-600 cursor-not-allowed`
- **Tooltip**: "Pilih jenis transaksi terlebih dahulu"

#### Tombol yang Dimodifikasi:
- **Tombol Cek**: Grey jika disabled, biru normal jika enabled
- **Tombol Betul**: Grey jika disabled, hijau normal jika enabled
- **Tombol Lanjut**: Grey jika disabled, biru normal jika enabled
- **Tombol Selesai Cetak**: Grey jika disabled, ungu normal jika enabled
- **Tombol Batal/Ulang**: Grey jika disabled, merah normal jika enabled

### 4. Form Data Nasabah 
- **UserForm.tsx** sudah memiliki logika `isDisabled = !jenisTransaksi`
- Semua field data nasabah otomatis grey out jika jenis transaksi belum dipilih
- Tidak perlu modifikasi tambahan

### 5. Kondisi Normal (Setelah Jenis Transaksi Dipilih)
- Semua field dan tombol kembali normal dan dapat digunakan
- Auto-focus ke field Code aktif
- Warna tombol kembali sesuai fungsi (biru, hijau, ungu, merah)
- Tooltip kembali ke fungsi normal

### 6. User Experience
- **Halaman pertama dibuka**: Netral, tidak ada fokus, semua grey
- **Setelah pilih BNB/BNS**: Semua field aktif, fokus ke Code, siap input
- **Feedback visual jelas**: User tahu harus pilih jenis transaksi dulu

## File yang Diubah:
- `src/app/page.tsx`

## Logika Kondisional:
```tsx
// Auto-focus hanya jika jenisTransaksi sudah dipilih
useEffect(() => {
  if (mounted && kodeRef.current && jenisTransaksi) {
    setTimeout(() => {
      kodeRef.current?.focus();
    }, 100);
  }
}, [mounted, jenisTransaksi]);

// Styling kondisional untuk setiap field/tombol
className={`base-style ${!jenisTransaksi ? 'bg-gray-200 cursor-not-allowed' : 'bg-white'}`}
disabled={!jenisTransaksi}
title={!jenisTransaksi ? "Pilih jenis transaksi terlebih dahulu" : "Normal tooltip"}
```

## Test:
- [x] Halaman dibuka pertama kali: semua field grey, tidak ada fokus
- [x] Pilih BNB: semua field aktif, fokus ke Code, warna normal
- [x] Pilih BNS: semua field aktif, fokus ke Code, warna normal
- [x] Tooltip berubah sesuai kondisi disabled/enabled
- [x] Visual feedback jelas untuk user

## Commit: 6ccb3a3
**Message**: "Halaman utama: Grey out semua field sebelum jenis transaksi dipilih"
