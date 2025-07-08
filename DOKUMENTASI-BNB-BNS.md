# DOKUMENTASI FITUR DETEKSI JENIS TRANSAKSI BNB/BNS

## Overview
Sistem MBA Transaction System v1.4.1 sekarang mendukung deteksi dan penanganan khusus untuk jenis transaksi BNB (Beli Nota Bank) dan BNS (Beli Nota Sight).

## Perbedaan Navigasi

### BNB (Beli Nota Bank) - Navigasi Normal
- Langsung input currency code
- Tidak ada navigasi khusus
- Flow: Currency Code → Amount → Exchange Rate

### BNS (Beli Nota Sight) - Navigasi Khusus
- Sebelum input currency code, tekan **Right Arrow** 1x
- Navigasi khusus diperlukan untuk BNS
- Flow: **Right Arrow** → Currency Code → Amount → Exchange Rate

## Implementasi

### 1. Backend (route.ts)
```typescript
// Deteksi jenis transaksi dari data transaksi individual atau data global
const currentTransactionType = (transactionData.transactionType || transactionData.jenisTransaksi || transactionType || 'BNB').toUpperCase()

// Navigasi khusus untuk BNS
if (currentTransactionType === 'BNS') {
  ahkLines.push(`; Jenis transaksi BNS - navigasi khusus sebelum input`)
  ahkLines.push('Send, {Right}')
  ahkLines.push('Sleep, 200')
  ahkLines.push('')
}
```

### 2. Frontend (TransactionList.tsx)
```typescript
// Mengirim transactionType untuk setiap transaksi
transactions: sameNumberTransactions.map((t: any) => ({
  currency: t.currency,
  amount: t.amount,
  rate: t.rate,
  rupiahEquivalent: t.rupiahEquivalent,
  transactionNumber: t.transactionNumber,
  transactionType: t.transactionType || t.jenisTransaksi || 'BNB' // Tambahan
}))
```

## Prioritas Deteksi Jenis Transaksi

1. **Level Transaksi Individual**: `transactionData.transactionType`
2. **Level Transaksi Individual (Alt)**: `transactionData.jenisTransaksi`
3. **Level Global**: `data.transactionType` (dari request utama)
4. **Default**: `'BNB'`

## Skenario Penggunaan

### Skenario 1: Semua Transaksi BNB
```json
{
  "transactionType": "BNB",
  "transactions": [
    {"currency": "USD", "amount": 1000, "rate": 15000},
    {"currency": "EUR", "amount": 500, "rate": 16000}
  ]
}
```
**Hasil**: Tidak ada navigasi khusus, langsung input currency code

### Skenario 2: Semua Transaksi BNS
```json
{
  "transactionType": "BNS",
  "transactions": [
    {"currency": "USD", "amount": 1000, "rate": 15000},
    {"currency": "EUR", "amount": 500, "rate": 16000}
  ]
}
```
**Hasil**: Setiap transaksi didahului dengan Right Arrow

### Skenario 3: Mixed Transaksi
```json
{
  "transactionType": "BNB",
  "transactions": [
    {"currency": "USD", "amount": 1000, "rate": 15000, "transactionType": "BNB"},
    {"currency": "EUR", "amount": 500, "rate": 16000, "transactionType": "BNS"},
    {"currency": "GBP", "amount": 300, "rate": 18000, "transactionType": "BNB"}
  ]
}
```
**Hasil**: 
- Transaksi 1 (USD): Navigasi normal
- Transaksi 2 (EUR): Navigasi khusus (Right Arrow)
- Transaksi 3 (GBP): Navigasi normal

## Generated Script Sample

### BNB (Normal)
```ahk
; === ISI DATA TRANSAKSI 1 ===
; Debug: Currency input = "USD", Code = 1
; Jenis Transaksi: BNB
; Isi Code Currency USD = 1
Send, 1
Sleep, 200
```

### BNS (Khusus)
```ahk
; === ISI DATA TRANSAKSI 2 ===
; Debug: Currency input = "EUR", Code = 4
; Jenis Transaksi: BNS
; Jenis transaksi BNS - navigasi khusus sebelum input
Send, {Right}
Sleep, 200

; Isi Code Currency EUR = 4
Send, 4
Sleep, 200
```

## Testing

### File Test
- `test-bns-bnb-detection.js`: Test otomatis untuk validasi fitur
- `demo-bns-bnb-detection.ahk`: Demo script untuk testing manual

### Cara Test
1. Jalankan server: `npm run dev`
2. Jalankan test: `node test-bns-bnb-detection.js`
3. Atau test manual dengan demo script

## Validasi

### Checklist Fitur
- ✅ Deteksi jenis transaksi dari data individual
- ✅ Deteksi jenis transaksi dari data global
- ✅ Navigasi khusus untuk BNS (Right Arrow)
- ✅ Navigasi normal untuk BNB
- ✅ Support mixed transaksi (BNB + BNS)
- ✅ Fallback ke BNB jika tidak ada data jenis transaksi
- ✅ Debug logging untuk monitoring

### Output Log Sample
```
; === ISI DATA TRANSAKSI 1 ===
; Debug: Currency input = "USD", Code = 1
; Jenis Transaksi: BNB

; === ISI DATA TRANSAKSI 2 ===
; Debug: Currency input = "EUR", Code = 4
; Jenis Transaksi: BNS
; Jenis transaksi BNS - navigasi khusus sebelum input
```

## Catatan Penting

1. **Konsistensi**: Pastikan jenis transaksi konsisten di database dan UI
2. **Testing**: Selalu test di aplikasi MBA yang sebenarnya
3. **Backward Compatibility**: Fitur ini backward compatible dengan data lama
4. **Performance**: Navigasi khusus menambah waktu eksekusi minimal (200ms per BNS)

## Troubleshooting

### Issue: BNS tidak terdeteksi
**Solusi**: Pastikan field `transactionType` atau `jenisTransaksi` terisi dengan benar

### Issue: Navigasi khusus tidak berfungsi
**Solusi**: Validasi di aplikasi MBA apakah Right Arrow benar-benar diperlukan untuk BNS

### Issue: Mixed transaksi tidak bekerja
**Solusi**: Pastikan setiap transaksi memiliki field `transactionType` yang eksplisit
