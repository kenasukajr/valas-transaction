console.log('🧪 MANUAL TEST: Upload/Paste Gambar');

// Test untuk verifikasi upload/paste gambar manual tidak terhapus saat previewSuggestion null

console.log('📋 TEST STEPS:');
console.log('1. Buka http://localhost:8000');
console.log('2. Upload gambar manual (choose file atau paste)');
console.log('3. Ketik "PUJI K" di field nama');
console.log('4. Verify: Gambar manual tetap tampil (tidak terhapus)');
console.log('5. Ketik "PUJI PURNAWAN" di field nama');
console.log('6. Verify: Gambar suggestion tampil (menggantikan gambar manual)');
console.log('7. Clear field nama');
console.log('8. Verify: Gambar manual kembali tampil');
console.log('9. Klik tombol Clear');
console.log('10. Verify: Tidak ada gambar');

console.log('');
console.log('🔧 DEBUGGING:');
console.log('- Check console log untuk melihat UserFormRight useEffect');
console.log('- Perhatikan log: "Update images dengan formData.images" vs "Clear images"');
console.log('- formData.images harus tetap ada setelah upload, meski previewSuggestion null');

console.log('');
console.log('🎯 EXPECTED BEHAVIOR:');
console.log('✅ Upload gambar manual → gambar tampil');
console.log('✅ Ketik "PUJI K" → gambar manual tetap tampil');
console.log('✅ Ketik nama yang match → gambar suggestion tampil');
console.log('✅ Clear input → gambar manual kembali tampil');
console.log('✅ Klik Clear → tidak ada gambar');

console.log('');
console.log('❌ BUG SEBELUMNYA:');
console.log('- Upload gambar manual → OK');
console.log('- Ketik "PUJI K" → gambar manual HILANG (BUG!)');
console.log('- Penyebab: useEffect clear images meski formData.images ada');

console.log('');
console.log('🔧 PERBAIKAN YANG DILAKUKAN:');
console.log('- Hapus duplicate logic di UserFormRight.tsx useEffect');
console.log('- Pastikan prioritas: previewSuggestion > formData.images > clear');
console.log('- Clear images HANYA jika benar-benar tidak ada gambar dari manapun');

console.log('');
console.log('📍 SILAKAN TEST MANUAL DI BROWSER SEKARANG!');
