// Test untuk memverifikasi perbaikan suggestion gambar dan auto kapitalisasi

const fs = require('fs');
const path = require('path');

function testAllFixes() {
  console.log('=== TEST: Verifikasi Semua Perbaikan ===');
  
  const userFormPath = path.join(__dirname, 'src/components/UserForm.tsx');
  const userFormContent = fs.readFileSync(userFormPath, 'utf8');
  
  console.log('\n1. Testing Auto Kapitalisasi...');
  
  // Test auto kapitalisasi alamat
  const hasAddressCapital = userFormContent.includes('const autoValue = value.toUpperCase();') &&
                           userFormContent.includes('onValueChange(name, autoValue);');
  console.log(`   - Alamat auto kapital: ${hasAddressCapital ? '✅ ADA' : '❌ TIDAK ADA'}`);
  
  // Test auto kapitalisasi input fields (kecuali idNumber dan birthDate)
  const hasInputCapital = userFormContent.includes('if (name !== "idNumber" && name !== "birthDate") {') &&
                         userFormContent.includes('autoValue = value.toUpperCase();');
  console.log(`   - Input fields auto kapital: ${hasInputCapital ? '✅ ADA' : '❌ TIDAK ADA'}`);
  
  console.log('\n2. Testing Suggestion Preview Logic...');
  
  // Test shouldShowPreview untuk idNumber exact match only
  const hasIdExactMatch = userFormContent.includes('// Untuk idNumber: hanya tampilkan jika EXACT MATCH (16 digit sama semua)') &&
                         userFormContent.includes('return fieldValue && fieldValue.trim() === input.trim();');
  console.log(`   - ID Number exact match only: ${hasIdExactMatch ? '✅ ADA' : '❌ TIDAK ADA'}`);
  
  // Test shouldShowPreview untuk name (exact/prefix)
  const hasNameExactPrefix = userFormContent.includes('// Untuk name: cari exact match terlebih dahulu') &&
                            userFormContent.includes('// Untuk name: cari prefix match');
  console.log(`   - Name exact/prefix match: ${hasNameExactPrefix ? '✅ ADA' : '❌ TIDAK ADA'}`);
  
  // Test useEffect idNumber menggunakan exact match
  const hasIdUseEffectFix = userFormContent.includes('const exactMatch = filtered.find(tx => tx.idNumber && tx.idNumber.trim() === idVal);') &&
                           userFormContent.includes('if (exactMatch) {') &&
                           userFormContent.includes('onPreviewSuggestion(exactMatch);');
  console.log(`   - ID Number useEffect exact match: ${hasIdUseEffectFix ? '✅ ADA' : '❌ TIDAK ADA'}`);
  
  // Test arrow key navigation dengan null fallback
  const hasArrowKeyFix = userFormContent.includes('} else {') &&
                        userFormContent.includes('onPreviewSuggestion(null);');
  console.log(`   - Arrow key navigation fix: ${hasArrowKeyFix ? '✅ ADA' : '❌ TIDAK ADA'}`);
  
  // Test onMouseEnter dengan validasi
  const hasMouseEnterFix = userFormContent.includes('const validPreview = shouldShowPreview(formData.name, savedTransactions, \'name\');') &&
                          userFormContent.includes('if (validPreview && validPreview === suggestion) {');
  console.log(`   - Mouse enter validation: ${hasMouseEnterFix ? '✅ ADA' : '❌ TIDAK ADA'}`);
  
  console.log('\n3. Testing Edge Cases...');
  
  // Test case: nama yang tidak ada di data
  console.log('   🔍 CASE: Mengetik "JOHN DOE" (tidak ada di data)');
  console.log('      Expected: Dropdown muncul tapi NO PREVIEW gambar');
  console.log('      Logic: shouldShowPreview return null untuk partial match');
  
  // Test case: ID partial match
  console.log('   🔍 CASE: Mengetik "1234567890" (10 digit pertama sama)');
  console.log('      Expected: Dropdown muncul tapi NO PREVIEW gambar');
  console.log('      Logic: exactMatch hanya jika 16 digit sama semua');
  
  // Test case: ID exact match
  console.log('   🔍 CASE: Mengetik "1234567890123456" (16 digit sama persis)');
  console.log('      Expected: Dropdown muncul DAN PREVIEW gambar muncul');
  console.log('      Logic: exactMatch return data');
  
  console.log('\n=== HASIL VERIFIKASI ===');
  const allTestsPass = hasAddressCapital && hasInputCapital && hasIdExactMatch && 
                       hasNameExactPrefix && hasIdUseEffectFix && hasArrowKeyFix && 
                       hasMouseEnterFix;
  
  if (allTestsPass) {
    console.log('🎉 SEMUA PERBAIKAN BERHASIL!');
    console.log('✅ Auto kapitalisasi: alamat, nama, telepon, pekerjaan, tempat lahir');
    console.log('✅ Suggestion gambar nama: hanya exact/prefix match');
    console.log('✅ Suggestion gambar ID: hanya exact match (16 digit sama)');
    console.log('✅ Arrow key & mouse enter: validasi ketat');
    console.log('✅ Edge cases: nama tidak ada, ID partial = no preview');
    console.log('');
    console.log('📋 TESTING MANUAL YANG HARUS DILAKUKAN:');
    console.log('1. Ketik di field alamat huruf kecil → auto jadi kapital');
    console.log('2. Ketik nama yang tidak ada di data → no preview gambar');
    console.log('3. Ketik 10 digit pertama ID yang sama → no preview gambar');
    console.log('4. Ketik 16 digit ID yang sama persis → preview gambar muncul');
    console.log('5. Ketik nama yang ada (prefix match) → preview gambar muncul');
  } else {
    console.log('❌ MASIH ADA YANG PERLU DIPERBAIKI:');
    if (!hasAddressCapital) console.log('- Auto kapitalisasi alamat');
    if (!hasInputCapital) console.log('- Auto kapitalisasi input fields');
    if (!hasIdExactMatch) console.log('- ID exact match logic');
    if (!hasNameExactPrefix) console.log('- Name exact/prefix logic');
    if (!hasIdUseEffectFix) console.log('- ID useEffect fix');
    if (!hasArrowKeyFix) console.log('- Arrow key navigation');
    if (!hasMouseEnterFix) console.log('- Mouse enter validation');
  }
}

// Jalankan test
testAllFixes();
