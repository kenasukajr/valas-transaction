console.log('🐛 DEBUG: Gambar Tidak Hilang Saat Nama Tidak Ada');

// Test case: Mengetik nama yang tidak ada di backend
// Expected: Preview gambar harus hilang (previewSuggestion = null)
// Actual: Gambar tidak hilang (bug baru)

console.log('🔍 PROBLEM ANALYSIS:');
console.log('1. User mengetik nama yang tidak ada di data backend');
console.log('2. shouldShowPreview() return null (correct)');
console.log('3. onPreviewSuggestion(null) dipanggil (correct)');
console.log('4. UserFormRight useEffect: previewSuggestion = null (correct)');
console.log('5. Tapi gambar tetap tampil (BUG!)');

console.log('');
console.log('🔍 POSSIBLE CAUSES:');
console.log('A. formData.images masih ada dari upload sebelumnya');
console.log('B. UserFormRight useEffect prioritas: previewSuggestion > formData.images');
console.log('C. Jika previewSuggestion null, fallback ke formData.images');
console.log('D. Ini BENAR untuk upload manual, tapi SALAH untuk preview suggestion');

console.log('');
console.log('🔍 ROOT CAUSE:');
console.log('Priority logic di UserFormRight.tsx TERLALU PERMISIF');
console.log('Seharusnya: previewSuggestion null → clear preview (bukan fallback ke formData.images)');
console.log('Kecuali: jika memang ada upload manual yang harus tetap tampil');

console.log('');
console.log('🔧 DISTINCTION NEEDED:');
console.log('1. Upload manual → formData.images ada → gambar tetap tampil');
console.log('2. Preview suggestion → formData.images ada + previewSuggestion null → gambar harus hilang');
console.log('3. Need to distinguish: manual upload vs preview suggestion context');

console.log('');
console.log('💡 SOLUTION:');
console.log('Track state: apakah gambar berasal dari upload manual atau preview suggestion');
console.log('Jika dari preview suggestion dan previewSuggestion null → clear gambar');
console.log('Jika dari upload manual → tetap tampil');

console.log('');
console.log('🧪 TEST SCENARIOS:');
console.log('Scenario 1: Upload manual → ketik nama tidak ada → gambar tetap tampil ✅');
console.log('Scenario 2: Ketik nama ada → preview muncul → ketik nama tidak ada → preview hilang ❌');
console.log('Scenario 3: Preview active → clear input → kembali ke upload manual ✅');
