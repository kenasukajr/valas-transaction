# INTEGRASI PEMBAYARAN BNS DARI HALAMAN UTAMA - v1.4.3

## Overview
Implementasi lengkap integrasi data pembayaran BNS dari field "Pembayaran Rp" di halaman utama ke dalam sistem backend, script AHK, dan tampilan detail transaksi.

## Komponen yang Dimodifikasi

### 1. Halaman Utama (`src/app/page.tsx`)
- **Field Pembayaran BNS**: Field "Pembayaran Rp" yang hanya muncul untuk transaksi BNS
- **Kalkulasi Kembalian**: Otomatis menghitung kembalian (pembayaran - jumlah rupiah)
- **Pengiriman Data**: Data pembayaran dikirim ke API generator AHK

#### Perubahan:
```typescript
// Fungsi generateAndDownloadAHK diperbaharui
async function generateAndDownloadAHK(data: any, valasTransactions: any[] = [], pembayaranRp: string = '') {
  // ...
  // Data pembayaran BNS
  pembayaranRp: pembayaranData,
  // ...
}
```

### 2. API Generator AHK (`src/app/api/generate-ahk/route.ts`)
- **Penerimaan Data Pembayaran**: Menerima field `pembayaranRp` dari frontend
- **Fallback Logic**: Jika tidak ada data pembayaran, fallback ke kalkulasi (amount * rate)
- **Script Generation**: Generate script AHK dengan nilai pembayaran dari field user

#### Perubahan:
```typescript
// Ambil pembayaran dari data yang dikirim oleh frontend
let paymentAmount = '15750000' // default
if (data.pembayaranRp && data.pembayaranRp.toString().trim() !== '') {
  // Pembayaran dari field halaman utama
  paymentAmount = data.pembayaranRp.toString().replace(/[^0-9]/g, '') // hapus non-digit
} else if (data.amount && data.rate) {
  // Fallback ke kalkulasi jika tidak ada data pembayaran dari field
  const calculatedAmount = parseFloat(data.amount) * parseFloat(data.rate)
  paymentAmount = Math.round(calculatedAmount).toString()
}
```

### 3. Detail Transaksi (`src/components/TransactionList.tsx`)
- **Section Pembayaran BNS**: Section khusus untuk menampilkan detail pembayaran
- **Format Display**: Menampilkan jumlah rupiah, pembayaran, dan kembalian
- **Visual Styling**: Background merah muda untuk transaksi BNS

#### Perubahan:
```tsx
{/* Detail Pembayaran untuk transaksi BNS */}
{relatedTransactions[0]?.jenisTransaksi === 'BNS' && relatedTransactions[0]?.pembayaranRp && (
  <div className="mt-6 bg-red-50 border-2 border-red-200 rounded-lg p-4">
    <h4 className="text-lg font-semibold mb-3 text-red-800">Detail Pembayaran BNS</h4>
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="font-medium text-gray-700">Jumlah Rupiah:</span>
        <span className="font-mono text-lg">Rp {relatedTransactions[0].totalRupiah?.toLocaleString()}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="font-medium text-gray-700">Pembayaran:</span>
        <span className="font-mono text-lg text-blue-600">Rp {relatedTransactions[0].pembayaranRp?.toLocaleString()}</span>
      </div>
      <div className="flex justify-between items-center border-t pt-2">
        <span className="font-semibold text-gray-800">Kembalian:</span>
        <span className={`font-mono text-lg font-bold ${
          (relatedTransactions[0].kembalianRp || 0) >= 0 ? 'text-green-600' : 'text-red-600'
        }`}>
          Rp {(relatedTransactions[0].kembalianRp || 0).toLocaleString()}
        </span>
      </div>
    </div>
  </div>
)}
```

### 4. Script AHK Manual (`tools/autohotkey/auto_type_form.ahk`)
- **Dokumentasi**: Penjelasan bahwa nilai pembayaran akan diambil dari API
- **Struktur Data**: Contoh struktur data pembayaran BNS

## Flow Integrasi

### 1. Input Data di Halaman Utama
```
User pilih BNS → Field "Pembayaran Rp" muncul → User input pembayaran → Kalkulasi kembalian otomatis
```

### 2. Penyimpanan Data
```
Form submit → Data pembayaran disimpan ke database → Generate AHK script dengan data pembayaran
```

### 3. Script AHK
```
API menerima data pembayaran → Generate script dengan nilai dari field → Script menggunakan pembayaran user
```

### 4. Detail Transaksi
```
User buka detail → Section pembayaran BNS tampil → Menampilkan jumlah rupiah, pembayaran, kembalian
```

## Flow Navigasi AHK untuk BNS

### Setelah Input Rate:
1. **Tekan Enter 1x** (untuk konfirmasi rate dan navigasi)
2. **Cek apakah masih ada data:**
   - **Jika MASIH ADA transaksi:** Tekan Enter 1x → ketik code currency → lanjut input
   - **Jika TIDAK ADA transaksi lagi:** Langsung lanjut ke langkah pembayaran (sudah Enter 1x)

### Proses Pembayaran (saat tidak ada transaksi lagi):
1. **Tekan anak panah bawah 1x** (navigasi ke field pembayaran)
2. **Tekan Enter 1x** (masuk ke field pembayaran)
3. **Masukan data pembayaran** (dari field halaman utama)
4. **Tekan Enter 3x** (konfirmasi pembayaran)
5. **Jeda 1 detik** (tunggu proses selesai)
6. **Tekan tombol 'r' 1x** (kembali ke menu utama program MBA)

## Testing

### Test Script: `test-bns-frontend-integration.js`

1. **Test Integration**: Generate AHK dengan data pembayaran dari frontend
2. **Test Fallback**: Validasi fallback ke kalkulasi jika tidak ada pembayaran
3. **Test API**: Test BNS Payment API dengan data pembayaran

### Menjalankan Test:
```bash
cd tests-archive/test-scripts
node test-bns-frontend-integration.js
```

## Validasi

### Checklist Fitur:
- ✅ Field pembayaran muncul hanya untuk BNS
- ✅ Kalkulasi kembalian otomatis
- ✅ Data pembayaran dikirim ke API generator AHK
- ✅ Script AHK menggunakan nilai pembayaran dari field
- ✅ Detail transaksi menampilkan informasi pembayaran
- ✅ Fallback ke kalkulasi jika tidak ada data pembayaran
- ✅ Visual styling khusus untuk section pembayaran BNS

### Output yang Diharapkan:

#### 1. Script AHK:
```ahk
; Masukan jumlah pembayaran (dari field pembayaran halaman utama)
jumlahPembayaran := "16000000"  ; Nilai dari field user
; Debug: Jumlah pembayaran dari field halaman utama
TypeString(jumlahPembayaran)
```

#### 2. Detail Transaksi:
- Section "Detail Pembayaran BNS" dengan background merah muda
- Jumlah Rupiah: Rp 15.750.000
- Pembayaran: Rp 16.000.000  
- Kembalian: Rp 250.000 (hijau jika positif, merah jika negatif)

## Troubleshooting

### Issue: Pembayaran tidak muncul di script AHK
**Solusi**: Pastikan field `pembayaranRp` terisi di halaman utama sebelum generate script

### Issue: Kembalian tidak terhitung
**Solusi**: Validasi bahwa data `pembayaranRp` dan `totalRupiah` tersimpan dengan benar

### Issue: Detail pembayaran tidak tampil
**Solusi**: Pastikan transaksi memiliki `jenisTransaksi === 'BNS'` dan `pembayaranRp` tidak null

## Database Schema

Data pembayaran disimpan dalam field berikut di tabel transactions:
- `pembayaranRp`: Jumlah pembayaran dari field halaman utama
- `kembalianRp`: Kembalian (pembayaran - jumlah rupiah)
- `jenisTransaksi`: "BNS" untuk mengidentifikasi transaksi BNS

## Navigasi AHK untuk BNS

### Flow Navigasi Setelah Input Rate:

1. **Setelah input rate**: Tekan Enter 1x
2. **Cek kondisi transaksi**:
   - **Jika masih ada data transaksi lainnya**: 
     - Tekan Enter 1x
     - Ketik code currency
     - Lanjutkan dengan transaksi berikutnya
   - **Jika tidak ada transaksi lagi**:
     - Tekan anak panah bawah 1x
     - Tekan Enter 1x
     - Masukan data pembayaran
     - Tekan Enter 3x
     - Beri jeda 1 detik (Sleep 1000)
     - Tekan tombol 'r' 1x untuk kembali ke menu utama

### Implementasi di AHK Script:

```ahk
; Setelah input rate - Enter 1x
Send, {Enter}
Sleep, 200

; Cek apakah masih ada transaksi lain
if (currentIndex < totalTransactions) {
    ; Masih ada transaksi lain - Enter 1x lalu ketik code currency
    Send, {Enter}
    Sleep, 200
    ; Ketik code currency untuk transaksi berikutnya
    TypeString(nextCurrencyCode)
} else {
    ; Tidak ada transaksi lagi - sudah Enter 1x setelah rate input
    ; Tekan panah bawah 1x untuk navigasi ke field pembayaran
    Send, {Down}
    Sleep, 500
    ; Tekan Enter 1x untuk masuk ke field pembayaran
    Send, {Enter}
    Sleep, 500
    ; Input pembayaran
    TypeString(jumlahPembayaran)
    Sleep, 200
    ; Tekan Enter 3x untuk konfirmasi pembayaran
    Send, {Enter}
    Sleep, 200
    Send, {Enter}
    Sleep, 200
    Send, {Enter}
    Sleep, 200
    ; Beri jeda 1 detik
    Sleep, 1000
    ; Tekan r untuk kembali ke menu utama
    Send, r
}
```

## Integrasi Selesai ✅

Sistem sekarang dapat:
1. Mengambil data pembayaran dari field halaman utama
2. Menggunakan data tersebut di script AHK
3. Menampilkan detail pembayaran di halaman detail transaksi
4. Memberikan fallback jika tidak ada data pembayaran
