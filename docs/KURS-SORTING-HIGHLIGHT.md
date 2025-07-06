# 🎯 Fitur Sorting & Highlighting Tabel Kurs Berdasarkan Mata Uang Yang Dipilih

## 📋 **Deskripsi Fitur**

Fitur ini secara otomatis mengurutkan dan memberikan highlight merah pada tabel kurs berdasarkan mata uang yang dipilih dalam transaksi valas.

## ✨ **Fungsionalitas**

### 🔄 **Auto-Sorting**
- Ketika user memilih mata uang (misal: USD, EUR, JPY) di form transaksi
- Tabel kurs otomatis mengurutkan mata uang yang dipilih ke **bagian paling atas**
- Mata uang lainnya tetap mengikuti urutan default di bawahnya

### 🎨 **Highlighting Merah**
- Baris mata uang yang dipilih diberi **background merah muda** (`#fef2f2`)
- **Text bold dan berwarna merah** (`#dc2626`)
- **Border shadow merah** untuk emphasis ekstra

## 🛠 **Implementasi Teknis**

### 📂 **File yang Dimodifikasi:**
- `src/app/valas/KursMbarateTable.tsx` - Komponen tabel kurs
- `src/app/page.tsx` - Halaman utama form transaksi

### 🔧 **Props Baru:**
```typescript
interface KursMbarateTableProps {
  refreshTrigger?: string;
  selectedCurrency?: string; // Mata uang yang dipilih untuk sorting dan highlighting
}
```

### 🎯 **Logika Matching:**
Sistem matching mendukung berbagai format mata uang:

| Input User | Mata Uang yang Terdeteksi |
|------------|---------------------------|
| `USD` | USD New, USD 2nd, USD 5-50, USD putih, USD pec 1/tdk layak |
| `EUR` | EURO |
| `CNY` | YUAN : 50 - 100, : 10 - 20 |
| `KRW` | WON |
| `TWD` | NT : 500 - 2.000, : 100 - 200 |
| `QAR` | QTR : 50 - 500, : 5 - 20, ; 1 |
| `JPY` | JPY |
| `SGD` | SGD : 1.000, SGD : 2-100 |

## 🧪 **Cara Testing**

### ✅ **Test Scenario 1: USD**
1. Buka aplikasi di `http://localhost:8000`
2. Di form transaksi, masukkan code `1` (USD)
3. Klik tombol "Cek"
4. **Expected Result**: 
   - Semua baris USD (USD New, USD 2nd, dll) muncul di **paling atas tabel kurs**
   - Baris USD diberi **highlight merah**

### ✅ **Test Scenario 2: JPY**
1. Masukkan code `6` (JPY)
2. Klik tombol "Cek"
3. **Expected Result**:
   - Baris JPY muncul di **paling atas**
   - Highlight merah pada baris JPY

### ✅ **Test Scenario 3: EUR**
1. Masukkan code `2` (EUR)
2. Klik tombol "Cek"
3. **Expected Result**:
   - Baris EURO muncul di **paling atas**
   - Highlight merah pada baris EURO

## 🎨 **Visual Styling**

### 🔴 **Highlighted Row Styles:**
```css
background-color: #fef2f2;    /* Light red background */
color: #dc2626;               /* Dark red text */
font-weight: bold;            /* Bold text */
box-shadow: 0 0 0 1px #ef4444; /* Red border shadow */
```

### ⚪ **Normal Row Styles:**
```css
background-color: white | #f9fafb; /* Alternating white/gray */
color: inherit;                     /* Default text color */
font-weight: normal;               /* Normal text weight */
```

## 🔧 **Konfigurasi**

### 📊 **Data Flow:**
```
User Input (Code) → Cek Button → Currency Detection → 
valasRows[0].valas2 → KursMbarateTable selectedCurrency prop → 
Sorting Logic → Highlighting Logic → Render
```

### 🎯 **Trigger Update:**
- Setiap kali `valasRows[0].valas2` berubah
- Komponen `KursMbarateTable` akan re-render
- Sorting dan highlighting dijalankan ulang

## 🚀 **Keunggulan**

1. **🎯 Real-time**: Update otomatis setiap kali mata uang dipilih
2. **🔍 Visual Clear**: Mata uang yang dipilih mudah dilihat dengan highlight merah
3. **📋 Organized**: Mata uang yang dipilih selalu di atas untuk akses cepat
4. **🔄 Responsive**: Tidak mengganggu fungsi lain, hanya menambah UX
5. **🛡️ Robust**: Mendukung berbagai format dan alias mata uang

## 🔮 **Future Enhancement Ideas**

- [ ] Multiple currency selection support
- [ ] Customizable highlight colors
- [ ] Animation transition saat sorting
- [ ] Keyboard navigation untuk highlighted rows
- [ ] Export highlighted currencies

---

**💡 Tips:** Fitur ini sangat berguna untuk teller yang sering melakukan transaksi dengan mata uang tertentu, memudahkan mereka melihat kurs yang relevan tanpa perlu scroll atau mencari di tabel.
