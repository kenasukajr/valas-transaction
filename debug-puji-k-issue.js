console.log('🐛 VERIFY: Gambar Tidak Hilang Saat Nama Tidak Ada');

// Test case spesifik dari user:
// 1. Ketik "PUJI" → gambar PUJI PURNAWAN muncul
// 2. Ketik "PUJI K" → gambar harus HILANG (tidak ada data PUJI K)
// 3. Actual: gambar tetap PUJI PURNAWAN (BUG!)

console.log('🔍 SPECIFIC CASE:');
console.log('Input: "PUJI" → Preview: PUJI PURNAWAN → Gambar muncul ✅');
console.log('Input: "PUJI K" → Preview: NULL → Gambar harus HILANG ❌');
console.log('Actual: Gambar tetap PUJI PURNAWAN (BUG!)');

console.log('');
console.log('🔍 DEBUGGING CHECKLIST:');
console.log('1. shouldShowPreview("PUJI K", data, "name") → harus return null');
console.log('2. onPreviewSuggestion(null) → harus dipanggil');
console.log('3. UserFormRight previewSuggestion = null → harus diterima');
console.log('4. imageSource = "suggestion" → harus clear images');

console.log('');
console.log('🔍 KEMUNGKINAN PENYEBAB:');
console.log('A. shouldShowPreview masih return PUJI PURNAWAN untuk "PUJI K"');
console.log('B. onPreviewSuggestion tidak dipanggil dengan null');
console.log('C. imageSource tracking tidak bekerja');
console.log('D. useEffect dependency tidak update');

console.log('');
console.log('🧪 MANUAL TEST STEPS:');
console.log('1. Buka browser console');
console.log('2. Ketik "PUJI" di field nama');
console.log('3. Lihat log: "Preview=PUJI PURNAWAN"');
console.log('4. Ketik "PUJI K" di field nama');
console.log('5. Lihat log: "Preview=NULL" atau masih "PUJI PURNAWAN"?');
console.log('6. Jika masih "PUJI PURNAWAN" → shouldShowPreview bug');
console.log('7. Jika "NULL" tapi gambar tidak hilang → UserFormRight bug');

console.log('');
console.log('🔧 DEBUGGING ACTIONS:');
console.log('1. Test shouldShowPreview("PUJI K", data, "name")');
console.log('2. Check console log saat mengetik "PUJI K"');
console.log('3. Check imageSource value');
console.log('4. Check useEffect execution');

console.log('');
console.log('📍 MARI KITA DEBUG STEP BY STEP!');
