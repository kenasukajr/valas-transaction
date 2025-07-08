console.log('🧪 DEBUG: Upload/Paste Image Issue Analysis');

// Test case: Upload/paste gambar manual, kemudian ketik "PUJI K" (tidak ada match)
// Expected: Gambar manual tetap ada, tidak terhapus

// ISSUE ANALYSIS:
// 1. handleImageUpload/handleImagePaste di page.tsx → update formData.image dan formData.images
// 2. UserFormRight.tsx useEffect menerima formData.images yang sudah ada
// 3. Saat ketik "PUJI K", previewSuggestion jadi null
// 4. UserFormRight.tsx useEffect logic:
//    - Jika previewSuggestion null, cek formData.images
//    - Jika formData.images ada, tampilkan
//    - Jika formData.images kosong, clear images
// 5. Tapi ada BUG: useEffect menjalankan clear images 2x, dan ada logic yang konfliktif

// EXPECTED BEHAVIOR:
// - Upload manual → formData.images = ['uploaded_image_url']
// - Ketik "PUJI K" → previewSuggestion = null, tapi formData.images tetap ada → gambar tetap tampil
// - Ketik nama yang match → previewSuggestion ada → gambar suggestion tampil
// - Clear suggestion → previewSuggestion = null, formData.images tetap ada → gambar manual tampil lagi

// MASALAH di UserFormRight.tsx useEffect:
// 1. Ada duplicate logic untuk handle previewSuggestion null
// 2. Logic pertama: lines 100-136 (correct)
// 3. Logic kedua: lines 138-165 (duplicate + overwrite)
// 4. Logic ketiga: lines 167-177 (force clear - BUG!)

// PERBAIKAN YANG DIBUTUHKAN:
// 1. Remove duplicate logic di useEffect
// 2. Pastikan clear images hanya terjadi jika benar-benar tidak ada gambar dari manapun
// 3. Prioritas: previewSuggestion > formData.images > clear

console.log('❗ ISSUE: useEffect di UserFormRight.tsx menjalankan clear images meski ada formData.images');
console.log('✅ EXPECTED: Gambar manual tetap ada saat previewSuggestion null');
console.log('🔧 SOLUTION: Hapus duplicate logic di useEffect, perbaiki prioritas');
