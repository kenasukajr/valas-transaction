# Manual Test Verification v1.4.3

## Test Cases untuk Verifikasi Fix

### 1. Test Preview Gambar Suggestion (Fix Utama)

#### Test Case 1.1: Exact Match
- **Input**: "JOHN DOE" (exact match dengan data)
- **Expected**: Gambar preview muncul, dropdown suggestion muncul
- **Verify**: Gambar benar-benar dari suggestion, bukan upload manual

#### Test Case 1.2: Prefix Match dengan Word Boundary
- **Input**: "JOHN" (prefix dari "JOHN DOE")
- **Expected**: Gambar preview muncul, dropdown suggestion muncul
- **Verify**: Gambar suggestion sesuai dengan "JOHN DOE"

#### Test Case 1.3: Prefix Match Multi-Word
- **Input**: "JOHN D" (prefix dari "JOHN DOE")
- **Expected**: Gambar preview muncul, dropdown suggestion muncul

#### Test Case 1.4: Partial Match (Tidak Match)
- **Input**: "OHN" (partial dari "JOHN DOE")
- **Expected**: Gambar preview TIDAK muncul, dropdown suggestion kosong

#### Test Case 1.5: Edge Case - Data Tidak Ada
- **Input**: "PUJI K" (tidak ada data yang match)
- **Expected**: Gambar preview TIDAK muncul, dropdown suggestion kosong

### 2. Test Upload Manual Gambar (Fix Penting)

#### Test Case 2.1: Upload Manual Tanpa Suggestion
- **Action**: Upload gambar manual untuk nama yang tidak ada di data
- **Expected**: Gambar manual tampil dan tetap ada

#### Test Case 2.2: Upload Manual + Suggestion
- **Action**: 
  1. Upload gambar manual
  2. Ketik nama yang match dengan suggestion
- **Expected**: Gambar manual tetap tampil (tidak diganti dengan suggestion)

#### Test Case 2.3: Clear Manual, Lalu Suggestion
- **Action**:
  1. Upload gambar manual
  2. Clear gambar manual
  3. Ketik nama yang match dengan suggestion
- **Expected**: Gambar suggestion muncul setelah clear manual

#### Test Case 2.4: Manual Upload → Non-Match Input
- **Action**:
  1. Upload gambar manual
  2. Ketik nama yang tidak match dengan data
- **Expected**: Gambar manual tetap tampil (tidak hilang)

### 3. Test Paste Gambar

#### Test Case 3.1: Paste Gambar Manual
- **Action**: Paste gambar dari clipboard
- **Expected**: Gambar paste tampil dan tetap ada

#### Test Case 3.2: Paste + Suggestion Interaction
- **Action**:
  1. Paste gambar
  2. Ketik nama yang match dengan suggestion
- **Expected**: Gambar paste tetap tampil (tidak diganti)

### 4. Test Auto Kapitalisasi

#### Test Case 4.1: Nama Field
- **Input**: "john doe" → **Expected**: "JOHN DOE"

#### Test Case 4.2: Tempat Lahir
- **Input**: "jakarta" → **Expected**: "JAKARTA"

#### Test Case 4.3: Alamat
- **Input**: "jl. kebon jeruk" → **Expected**: "JL. KEBON JERUK"

#### Test Case 4.4: Birth Date (Tidak Auto Kapitalisasi)
- **Input**: "1990-01-01" → **Expected**: "1990-01-01" (unchanged)

### 5. Test Dropdown Suggestion Consistency

#### Test Case 5.1: Dropdown Filtering
- **Input**: "JOHN"
- **Expected**: Dropdown menampilkan semua nama yang dimulai dengan "JOHN"
- **Verify**: Konsisten dengan logika preview gambar

#### Test Case 5.2: Dropdown Selection
- **Action**: Pilih nama dari dropdown
- **Expected**: Nama ter-fill dan gambar suggestion muncul

### 6. Test Edge Cases

#### Test Case 6.1: Empty Input
- **Input**: "" (kosong)
- **Expected**: Tidak ada gambar preview, dropdown kosong

#### Test Case 6.2: Space Only
- **Input**: "   " (space saja)
- **Expected**: Tidak ada gambar preview, dropdown kosong

#### Test Case 6.3: Special Characters
- **Input**: "JOHN@DOE"
- **Expected**: Tidak ada gambar preview (karena tidak match)

#### Test Case 6.4: Numbers
- **Input**: "JOHN123"
- **Expected**: Tidak ada gambar preview (karena tidak match)

### 7. Test State Management

#### Test Case 7.1: Multiple Field Interaction
- **Action**: Isi semua field satu per satu
- **Expected**: Auto kapitalisasi bekerja untuk semua field yang sesuai

#### Test Case 7.2: Form Reset
- **Action**: Reset form
- **Expected**: Semua field clear termasuk gambar

### 8. Test Responsiveness

#### Test Case 8.1: Desktop View
- **Verify**: Layout normal, gambar preview ukuran sesuai

#### Test Case 8.2: Mobile View
- **Verify**: Layout responsive, gambar preview tetap proporsional

## Checklist Verifikasi

- [ ] Test Case 1.1 - Exact Match ✓
- [ ] Test Case 1.2 - Prefix Match ✓
- [ ] Test Case 1.3 - Multi-Word Prefix ✓
- [ ] Test Case 1.4 - Partial Match (Tidak Match) ✓
- [ ] Test Case 1.5 - Edge Case "PUJI K" ✓
- [ ] Test Case 2.1 - Upload Manual Tanpa Suggestion ✓
- [ ] Test Case 2.2 - Upload Manual + Suggestion ✓
- [ ] Test Case 2.3 - Clear Manual, Lalu Suggestion ✓
- [ ] Test Case 2.4 - Manual Upload → Non-Match Input ✓
- [ ] Test Case 3.1 - Paste Gambar Manual ✓
- [ ] Test Case 3.2 - Paste + Suggestion Interaction ✓
- [ ] Test Case 4.1 - Auto Kapitalisasi Nama ✓
- [ ] Test Case 4.2 - Auto Kapitalisasi Tempat Lahir ✓
- [ ] Test Case 4.3 - Auto Kapitalisasi Alamat ✓
- [ ] Test Case 4.4 - Birth Date (Tidak Auto Kapitalisasi) ✓
- [ ] Test Case 5.1 - Dropdown Filtering ✓
- [ ] Test Case 5.2 - Dropdown Selection ✓
- [ ] Test Case 6.1 - Empty Input ✓
- [ ] Test Case 6.2 - Space Only ✓
- [ ] Test Case 6.3 - Special Characters ✓
- [ ] Test Case 6.4 - Numbers ✓
- [ ] Test Case 7.1 - Multiple Field Interaction ✓
- [ ] Test Case 7.2 - Form Reset ✓
- [ ] Test Case 8.1 - Desktop View ✓
- [ ] Test Case 8.2 - Mobile View ✓

## Status: READY FOR TESTING
- Server: http://localhost:8000
- Version: 1.4.3
- Git Status: Pushed to GitHub
- Tag: v1.4.3

## Notes
- Semua fix sudah di-deploy ke GitHub
- Aplikasi siap untuk testing manual
- Bisa dilakukan testing oleh user atau QA team
