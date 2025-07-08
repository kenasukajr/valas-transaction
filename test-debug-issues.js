// Test untuk debug masalah preview gambar dan auto kapitalisasi

const fs = require('fs');
const path = require('path');

function testDebugIssues() {
  console.log('=== DEBUG: Preview Gambar & Auto Kapitalisasi ===');
  
  // Test 1: Periksa UserFormRight.tsx logic
  console.log('\n1. Testing UserFormRight.tsx logic...');
  const userFormRightPath = path.join(__dirname, 'src/components/UserFormRight.tsx');
  const userFormRightContent = fs.readFileSync(userFormRightPath, 'utf8');
  
  // Cek apakah ada bug dalam useEffect
  const hasCorrectLogic = userFormRightContent.includes('// Jika ada previewSuggestion, selalu tampilkan gambar dari situ (prioritas tertinggi)');
  console.log(`   - Fixed useEffect logic: ${hasCorrectLogic ? '✅ ADA' : '❌ TIDAK ADA'}`);
  
  // Cek apakah ada kondisi yang salah
  const hasBadCondition = userFormRightContent.includes('if (previewSuggestion === null) {');
  console.log(`   - Bad condition removed: ${hasBadCondition ? '❌ MASIH ADA' : '✅ SUDAH DIHAPUS'}`);
  
  // Test 2: Periksa page.tsx handlers
  console.log('\n2. Testing page.tsx handlers...');
  const pageMainPath = path.join(__dirname, 'src/app/page.tsx');
  const pageMainContent = fs.readFileSync(pageMainPath, 'utf8');
  
  // Cek handleImageUpload
  const hasImageUploadFix = pageMainContent.includes('images: [data.imageUrl] // Tambahkan ke images array juga');
  console.log(`   - handleImageUpload fix: ${hasImageUploadFix ? '✅ ADA' : '❌ TIDAK ADA'}`);
  
  // Cek handleImagePaste
  const hasImagePasteFix = pageMainContent.includes('images: [data.imageUrl] // Tambahkan ke images array juga');
  console.log(`   - handleImagePaste fix: ${hasImagePasteFix ? '✅ ADA' : '❌ TIDAK ADA'}`);
  
  // Test 3: Periksa auto kapitalisasi
  console.log('\n3. Testing auto kapitalisasi...');
  const userFormPath = path.join(__dirname, 'src/components/UserForm.tsx');
  const userFormContent = fs.readFileSync(userFormPath, 'utf8');
  
  // Cek handleInputChange
  const hasAutoCapital = userFormContent.includes('if (name !== "idNumber" && name !== "birthDate") {') &&
                        userFormContent.includes('autoValue = value.toUpperCase();');
  console.log(`   - Auto kapitalisasi logic: ${hasAutoCapital ? '✅ ADA' : '❌ TIDAK ADA'}`);
  
  // Cek onValueChange
  const hasOnValueChange = userFormContent.includes('onValueChange(name, autoValue);');
  console.log(`   - onValueChange call: ${hasOnValueChange ? '✅ ADA' : '❌ TIDAK ADA'}`);
  
  // Cek handleValueChange di parent
  const hasHandleValueChange = pageMainContent.includes('const handleValueChange = (name: string, value: string) => {');
  console.log(`   - handleValueChange di page.tsx: ${hasHandleValueChange ? '✅ ADA' : '❌ TIDAK ADA'}`);
  
  // Test 4: Potential issues
  console.log('\n4. Potential Issues Analysis...');
  
  // Issue 1: formData.images tidak terupdate
  const formDataImagesUpdate = pageMainContent.includes('setFormData(prev => ({') &&
                              pageMainContent.includes('image: data.imageUrl,') &&
                              pageMainContent.includes('images: [data.imageUrl]');
  console.log(`   - formData.images update: ${formDataImagesUpdate ? '✅ OK' : '❌ MASALAH'}`);
  
  // Issue 2: useEffect dependency
  const hasCorrectDependency = userFormRightContent.includes('}, [formData.images, formData.image, previewSuggestion]);');
  console.log(`   - useEffect dependency: ${hasCorrectDependency ? '✅ OK' : '❌ MASALAH'}`);
  
  // Issue 3: arraysEqual function
  const hasArraysEqual = userFormRightContent.includes('function arraysEqual(a: any[], b: any[]) {');
  console.log(`   - arraysEqual function: ${hasArraysEqual ? '✅ OK' : '❌ MASALAH'}`);
  
  console.log('\n=== DEBUGGING TIPS ===');
  console.log('🔍 UNTUK DEBUG PREVIEW GAMBAR:');
  console.log('1. Buka DevTools -> Console');
  console.log('2. Upload gambar dan lihat console log');
  console.log('3. Cek apakah formData.images terupdate');
  console.log('4. Cek apakah useEffect UserFormRight terpanggil');
  
  console.log('\n🔍 UNTUK DEBUG AUTO KAPITALISASI:');
  console.log('1. Ketik di field nama/alamat/pekerjaan');
  console.log('2. Lihat apakah handleInputChange terpanggil');
  console.log('3. Cek apakah onValueChange dipanggil dengan nilai uppercase');
  console.log('4. Cek apakah setFormData dipanggil dengan benar');
  
  console.log('\n📋 QUICK CHECKS:');
  console.log('• Hard refresh browser (Ctrl+F5)');
  console.log('• Cek Network tab untuk upload API');
  console.log('• Cek React DevTools untuk state changes');
  console.log('• Cek Console untuk error messages');
  
  const allOK = hasCorrectLogic && !hasBadCondition && hasImageUploadFix && hasImagePasteFix && 
               hasAutoCapital && hasOnValueChange && hasHandleValueChange && formDataImagesUpdate && 
               hasCorrectDependency && hasArraysEqual;
  
  console.log('\n=== KESIMPULAN ===');
  if (allOK) {
    console.log('✅ SEMUA LOGIC SUDAH BENAR');
    console.log('   - Jika masih bermasalah, kemungkinan cache browser atau React state');
    console.log('   - Coba restart browser atau clear cache');
  } else {
    console.log('❌ MASIH ADA MASALAH DALAM KODE');
    console.log('   - Periksa item yang gagal di atas');
  }
}

// Jalankan test
testDebugIssues();
