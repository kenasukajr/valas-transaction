# 💱 Sistem Transaksi Valas Blackbox v1.4.1

Aplikasi manajemen transaksi valuta asing (valas) yang komprehensif dengan sistem validasi kurs otomatis dan manajemen data nasabah.

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

### v1.4.1 (Latest)
- ✨ **UI Modal**: Redesign modal validasi dengan tema biru modern
- 🎯 **UX Focus**: Perbaikan navigasi keyboard dan default focus
- 🔧 **Z-Index Fix**: Perbaikan masalah overlay modal dengan header tabel
- ⚙️ **Tolerance**: Penyesuaian toleransi untuk mata uang ratusan (±50)

### v1.4.0
- ✨ **Rate Validation**: Sistem validasi kurs otomatis dengan modal
- 🎮 **Keyboard Navigation**: Dukungan navigasi keyboard lengkap
- 🎨 **UI Enhancement**: Perbaikan antarmuka dan styling

### v1.3.x
- 🏦 **Kurs Integration**: Integrasi real-time dengan mbarate.net
- 🎯 **Currency Highlighting**: Sistem highlighting mata uang aktif
- 📊 **Transaction Types**: Dukungan BNB dan BNS

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

*Version 1.4.1 - Smart Rate Validation System*
