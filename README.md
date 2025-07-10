# 💱 Blackbox Valas App v1.4.3

![Version](https://img.shields.io/badge/version-1.4.3-blue.svg)
![Status](https://img.shields.io/badge/status-production%20ready-green.svg)
![Network](https://img.shields.io/badge/network-LAN%20ready-orange.svg)
![BNS](https://img.shields.io/badge/BNS%20Payment-integrated-success.svg)

Aplikasi manajemen transaksi valuta asing (valas) yang komprehensif dengan sistem validasi kurs otomatis, manajemen data nasabah, dan akses jaringan penuh. **Versi 1.4.3** menambahkan integrasi lengkap untuk BNS Payment Navigation.

## 🎉 What's New in v1.4.3

### ✅ **BNS Payment Integration - COMPLETE**
- **Complete BNS Payment Workflow**: Navigasi pembayaran lengkap untuk transaksi BNS
- **Payment Navigation**: Down arrow → Enter → Payment input → Enter 3x → Reset R
- **Enhanced AHK Generator**: Mendukung data pembayaran BNS (`pembayaranRp`)
- **Payment Calculation**: Fallback otomatis dari data transaksi jika payment tidak disediakan
- **BNS vs BNB Differentiation**: Workflow terpisah untuk jenis transaksi berbeda

### 🔧 **Technical Improvements**
- **Fixed BNS Navigation**: Correct Enter press count after rate input
- **Conditional Navigation**: Different timing for BNS vs BNB transactions
- **Enhanced Error Handling**: Comprehensive validation for BNS payment scenarios
- **Production Ready**: All tests pass for deployment to PT Mulia Bumi Arta

### 🚀 **BNS Payment Workflow**
1. **Transaction Input**: Standard currency, amount, rate input
2. **Navigation to Payment**: Automatic navigation to payment field
3. **Payment Input**: Auto-calculated or manual payment value
4. **Completion**: Enter 3x → 1 second delay → Reset with R
5. **Return to Main Menu**: Ready for next transaction

### 🌐 **Network Configuration**
- **Frontend**: `http://192.168.1.6:8000` 
- **Backend**: `http://192.168.1.6:5000`
- **CORS Solved**: Next.js proxy mengatasi masalah cross-origin requests
- **Multi-Device**: Akses simultan dari multiple komputer

## 🌟 Fitur Utama

### 📊 **Transaksi Valas**
- **Input transaksi** dengan validasi kurs real-time
- **Deteksi mata uang otomatis** berdasarkan kode (1-35)
- **Sistem validasi rate pintar** dengan notifikasi peringatan
- **Dukungan jenis transaksi**: BNB (Beli Nota Biasa) dan BNS (Beli Nota Segar)
- **Kalkulasi otomatis** jumlah rupiah dan kembalian

### 🏦 **Data Kurs Real-time**
- **Sinkronisasi otomatis** dengan mbarate.net
- **Highlighting mata uang** yang sedang dipilih
- **Sorting otomatis** berdasarkan transaksi aktif
- **35+ mata uang** didukung (USD, EUR, JPY, SGD, dll)

### 👥 **Manajemen Nasabah**
- **Database nasabah** lengkap dengan foto
- **Form input** yang user-friendly
- **Upload gambar** via paste atau file
- **Riwayat transaksi** per nasabah

### 🎯 **Validasi Kurs Pintar**
- **Toleransi adaptif** berdasarkan nilai mata uang:
  - Puluhan ribu (USD, EUR): ±100
  - Ratusan (THB): ±50
  - Satuan (VND): ±0.10
- **Modal peringatan** dengan navigasi keyboard
- **Return to field** setelah koreksi

## 🚀 Teknologi

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, Shadcn/ui Components
- **Backend**: Node.js Express API
- **Database**: JSON file-based storage
- **Git**: Version control dengan tagging

## 📦 Instalasi

### Persyaratan
- Node.js 18+ 
- npm atau yarn
- Git

### Langkah Instalasi

1. **Clone repository**
   ```bash
   git clone https://github.com/kenasukajr/valas-transaction.git
   cd valas-transaction
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment**
   ```bash
   cp .env.example .env.local
   # Edit .env.local sesuai konfigurasi Anda
   ```

4. **Jalankan development server**
   ```bash
   npm run dev
   ```

5. **Jalankan backend server**
   ```bash
   cd backend
   node server.js
   ```

6. **Akses aplikasi**
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:5000`

## 🎮 Cara Penggunaan

### Transaksi Valas Baru

1. **Pilih jenis transaksi** (BNB/BNS)
2. **Isi data nasabah** lengkap
3. **Klik "Lanjut"** untuk membuka area transaksi
4. **Input kode mata uang** (1-35) atau nama mata uang
5. **Klik "Cek"** untuk deteksi otomatis
6. **Masukkan jumlah dan rate**
7. **Klik "Betul"** untuk menambah ke tabel
8. **Submit transaksi** atau lanjut dengan mata uang lain

### Validasi Rate Otomatis

Sistem akan menampilkan **modal peringatan** jika rate yang dimasukkan berada di luar batas normal:

- **Navigasi**: Gunakan panah kiri/kanan untuk berpindah tombol
- **Konfirmasi**: Enter untuk memilih, Esc untuk batal
- **Default focus**: Tombol "Tidak" (recommended)
- **Auto return**: Fokus kembali ke field rate setelah koreksi

## 📁 Struktur Project

```
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx           # Halaman utama transaksi
│   │   ├── nasabah/           # Halaman manajemen nasabah
│   │   ├── transaksi/         # Halaman riwayat transaksi
│   │   └── valas/             # Komponen tabel kurs
│   ├── components/            # React Components
│   │   ├── ui/                # Shadcn/ui components
│   │   ├── RateValidationModal.tsx
│   │   ├── TransactionList.tsx
│   │   └── UserForm*.tsx
│   ├── utils/                 # Utility functions
│   │   └── currencyValidation.ts
│   └── styles/               # Global styles
├── backend/                  # Express.js API
│   ├── server.js
│   ├── nasabah.json
│   └── transactions.json
└── docs/                     # Dokumentasi
```

## 🔧 Konfigurasi

### Environment Variables

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
KURS_API_URL=https://mbarate.net/api/kurs
```

### Server Manager

Gunakan script otomatis untuk menjalankan aplikasi:

**Windows:**
```cmd
ServerManager.bat
```

**PowerShell:**
```powershell
.\ServerManager.ps1
```

## 📝 API Endpoints

### Transaksi
- `GET /api/transactions` - Daftar semua transaksi
- `POST /api/transactions` - Buat transaksi baru
- `PUT /api/transactions/:id` - Update transaksi
- `DELETE /api/transactions/:id` - Hapus transaksi

### Nasabah
- `GET /api/nasabah` - Daftar semua nasabah
- `POST /api/nasabah` - Tambah nasabah baru
- `PUT /api/nasabah/:id` - Update data nasabah
- `DELETE /api/nasabah/:id` - Hapus nasabah

### Kurs
- `GET /api/kurs` - Data kurs real-time dari mbarate.net

## 🎯 Mata Uang Didukung

| Kode | Mata Uang | Contoh Rate |
|------|-----------|-------------|
| 1    | USD       | 15,650      |
| 2    | EUR       | 17,200      |
| 3    | SGD       | 11,400      |
| 4    | AUD       | 10,800      |
| 5    | GBP       | 19,500      |
| 6    | JPY       | 108         |
| 7    | HKD       | 2,010       |
| 8    | CHF       | 17,800      |
| 9    | CAD       | 11,900      |
| ...  | ...       | ...         |

*35 mata uang total didukung*

## 🧪 Testing

```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e

# Validation tests
node test-validation.js
```

## 📋 Changelog

### v1.4.3 (Latest)
- 🎉 **Complete BNS Payment Integration**: Production-ready workflow untuk Beli Nota Segar (BNS)
- 🚀 **Payment Navigation Workflow**: Automated payment input setelah transaction completion
- 🔧 **BNS vs BNB Differentiation**: Separate workflow handling untuk transaction types berbeda
- ✨ **Enhanced AHK Generator**: Full support untuk BNS payment data processing
- 🛠️ **Fixed BNS Navigation Logic**: Correct Enter press count setelah rate input
- 📋 **Complete Test Coverage**: Single dan multi-transaction BNS scenarios
- 🎯 **Production Ready**: All features tested dan validated untuk PT Mulia Bumi Arta

### v1.4.2
- 🌐 **Full Network Access**: Dapat diakses dari semua komputer dalam jaringan LAN
- 🔧 **Fixed Loading Timeout**: Mengatasi masalah "Loading timeout" dengan Next.js proxy
- 🎨 **Modern Transaction Display**: Tampilan transaksi dengan card design yang modern
- 📊 **Rate Validation**: Improved kurs validation dengan notifikasi peringatan
- 🛠️ **Upload/Paste Image**: Fixed gambar hilang saat nama tidak ada
- 🔄 **Enhanced Navigation**: Better keyboard navigation dan arrow key support

### v1.4.1
- ✨ **UI Modal**: Redesign modal validasi dengan tema biru modern
- 🎯 **UX Focus**: Perbaikan navigasi keyboard dan default focus
- 🔧 **Z-Index Fix**: Perbaikan masalah overlay modal dengan header tabel
- ⚙️ **Tolerance**: Penyesuaian toleransi untuk mata uang ratusan (±50)

### v1.4.0
- ✨ **Rate Validation**: Sistem validasi kurs otomatis dengan modal
- 🎮 **Keyboard Navigation**: Dukungan navigasi keyboard lengkap
- 🎨 **UI Enhancement**: Perbaikan antarmuka dan styling

## 🤝 Kontribusi

1. Fork repository ini
2. Buat branch fitur (`git checkout -b fitur-baru`)
3. Commit perubahan (`git commit -m 'Tambah fitur baru'`)
4. Push ke branch (`git push origin fitur-baru`)
5. Buat Pull Request

## 📞 Support

Untuk bantuan atau pertanyaan:
- **Issues**: [GitHub Issues](https://github.com/kenasukajr/valas-transaction/issues)
- **Documentation**: Lihat folder `/docs`
- **Email**: [Kontak Developer]

## 📄 Lisensi

Project ini menggunakan lisensi MIT. Lihat file `LICENSE` untuk detail lengkap.

---

**Dibuat dengan ❤️ untuk memudahkan transaksi valas**

*Version 1.4.3 - Complete BNS Payment Integration*
