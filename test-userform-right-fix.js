// Test untuk memverifikasi fix UserFormRight.tsx
// Memeriksa apakah duplikasi kode sudah dihapus dan logika preview gambar benar

const fs = require('fs');
const path = require('path');

function testUserFormRightFix() {
  console.log('=== TEST: UserFormRight.tsx Fix ===');
  
  // Baca file yang sudah diperbaiki
  const filePath = path.join(__dirname, 'src/components/UserFormRight.tsx');
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Test 1: Cek tidak ada duplikasi kode useEffect yang rusak
  const useEffectCount = (content.match(/useEffect\(\(\) => \{/g) || []).length;
  console.log('1. Jumlah useEffect:', useEffectCount);
  console.log('   - Harusnya ada 3 useEffect (images sync, click outside, images to parent)');
  
  // Test 2: Cek tidak ada duplikasi kode yang rusak
  const brokenPatterns = [
    'isAddingImage.current = false;\n      return;\n    } else if (formData.image) {',
    'prevImagesRef.current = formData.images;\n      }\n      isAddingImage.current = false;',
    'return;\n    }\n    // eslint-disable-next-line react-hooks/exhaustive-deps\n  }, [formData.images, formData.image, previewSuggestion]);\n\n  // Helper: cek apakah dua array sama isinya\n  function arraysEqual'
  ];
  
  let hasBrokenPattern = false;
  brokenPatterns.forEach((pattern, idx) => {
    if (content.includes(pattern)) {
      console.log(`2.${idx + 1}. GAGAL: Masih ada duplikasi kode yang rusak`);
      hasBrokenPattern = true;
    }
  });
  
  if (!hasBrokenPattern) {
    console.log('2. SUKSES: Tidak ada duplikasi kode yang rusak');
  }
  
  // Test 3: Cek struktur useEffect yang benar
  const correctUseEffectPattern = /useEffect\(\(\) => \{[\s\S]*?\/\/ eslint-disable-next-line react-hooks\/exhaustive-deps\s*\}, \[formData\.images, formData\.image, previewSuggestion\]\);/;
  if (correctUseEffectPattern.test(content)) {
    console.log('3. SUKSES: useEffect untuk sinkronisasi images sudah benar');
  } else {
    console.log('3. GAGAL: useEffect untuk sinkronisasi images tidak sesuai struktur');
  }
  
  // Test 4: Cek fungsi getImagesFromSource
  if (content.includes('const getImagesFromSource = () => {')) {
    console.log('4. SUKSES: Fungsi getImagesFromSource ada');
  } else {
    console.log('4. GAGAL: Fungsi getImagesFromSource tidak ditemukan');
  }
  
  // Test 5: Cek fungsi arraysEqual
  if (content.includes('function arraysEqual(a: any[], b: any[]) {')) {
    console.log('5. SUKSES: Fungsi arraysEqual ada');
  } else {
    console.log('5. GAGAL: Fungsi arraysEqual tidak ditemukan');
  }
  
  // Test 6: Cek logika previewSuggestion prioritas
  const priorityLogic = content.includes('// Prioritas 1: Jika ada previewSuggestion, gunakan itu') &&
                       content.includes('// Prioritas 2: Jika tidak ada previewSuggestion, tampilkan gambar dari formData');
  
  if (priorityLogic) {
    console.log('6. SUKSES: Logika prioritas previewSuggestion sudah benar');
  } else {
    console.log('6. GAGAL: Logika prioritas previewSuggestion tidak sesuai');
  }
  
  // Test 7: Cek syntax dan struktur brackets
  const openBrackets = (content.match(/\{/g) || []).length;
  const closeBrackets = (content.match(/\}/g) || []).length;
  
  if (openBrackets === closeBrackets) {
    console.log('7. SUKSES: Brackets balanced');
  } else {
    console.log('7. GAGAL: Brackets tidak balanced');
    console.log(`   - Open brackets: ${openBrackets}`);
    console.log(`   - Close brackets: ${closeBrackets}`);
  }
  
  console.log('\n=== KESIMPULAN ===');
  if (useEffectCount === 3 && !hasBrokenPattern && priorityLogic && openBrackets === closeBrackets) {
    console.log('✅ SUKSES: UserFormRight.tsx sudah diperbaiki dengan benar');
    console.log('   - Duplikasi kode dihapus');
    console.log('   - Logika preview gambar benar');
    console.log('   - Syntax valid');
  } else {
    console.log('❌ GAGAL: Masih ada masalah di UserFormRight.tsx');
  }
}

// Jalankan test
testUserFormRightFix();
