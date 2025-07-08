console.log('🧪 TEST: Gambar Hilang Saat Nama Tidak Ada (Fixed)');

// Test untuk memverifikasi perbaikan: gambar preview harus hilang saat nama tidak ada di backend

console.log('📋 TEST SCENARIOS:');
console.log('');

console.log('🎯 SCENARIO 1: Upload Manual + Nama Tidak Ada');
console.log('1. Upload gambar manual (choose file atau paste)');
console.log('2. Ketik nama yang tidak ada: "SUPERMAN"');
console.log('3. Expected: Gambar manual TETAP tampil (imageSource = "manual")');
console.log('4. Verify: ✅ Gambar tidak hilang');
console.log('');

console.log('🎯 SCENARIO 2: Preview Suggestion + Nama Tidak Ada');
console.log('1. Ketik nama yang ada: "PUJI PURNAWAN"');
console.log('2. Expected: Gambar suggestion tampil (imageSource = "suggestion")');
console.log('3. Ketik nama yang tidak ada: "SUPERMAN"');
console.log('4. Expected: Gambar preview HILANG (previewSuggestion = null)');
console.log('5. Verify: ✅ Gambar hilang');
console.log('');

console.log('🎯 SCENARIO 3: Preview → Clear → Manual');
console.log('1. Upload gambar manual');
console.log('2. Ketik nama yang ada: "PUJI PURNAWAN"');
console.log('3. Expected: Gambar suggestion tampil');
console.log('4. Clear input nama');
console.log('5. Expected: Gambar manual kembali tampil');
console.log('6. Verify: ✅ Gambar manual kembali muncul');
console.log('');

console.log('🔧 TECHNICAL IMPLEMENTATION:');
console.log('- Added imageSource state: "manual" | "suggestion" | null');
console.log('- Track image source in useEffect and handlers');
console.log('- Logic: jika imageSource = "suggestion" dan previewSuggestion = null → clear images');
console.log('- Logic: jika imageSource = "manual" → tetap tampil meskipun previewSuggestion = null');
console.log('');

console.log('🔍 DEBUG LOG YANG DIHARAPKAN:');
console.log('Upload manual: → imageSource = "manual"');
console.log('Preview suggestion: → imageSource = "suggestion"');
console.log('Preview hilang + imageSource = "suggestion": → Clear images');
console.log('Preview hilang + imageSource = "manual": → Tetap tampil');
console.log('');

console.log('✅ EXPECTED BEHAVIOR:');
console.log('✅ Upload manual + nama tidak ada → gambar tetap tampil');
console.log('✅ Preview suggestion + nama tidak ada → gambar hilang');
console.log('✅ Preview → clear → manual → gambar manual kembali tampil');
console.log('');

console.log('🎯 SILAKAN TEST MANUAL DI BROWSER SEKARANG!');
console.log('http://localhost:8000');
