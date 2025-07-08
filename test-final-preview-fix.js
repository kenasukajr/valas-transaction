// Test final untuk memastikan preview suggestion sudah benar
console.log("=== TEST FINAL PREVIEW SUGGESTION ===");

// Simulasi helper function yang sudah diperbaiki
function shouldShowPreview(input, data, field) {
  if (!input || input.trim().length === 0) return null;
  
  const inputUpper = input.trim().toUpperCase();
  const filtered = data.filter(tx => {
    const fieldValue = field === 'name' ? tx.name : tx.idNumber;
    return fieldValue && fieldValue.trim().toUpperCase().includes(inputUpper);
  });
  
  if (filtered.length === 0) return null;
  
  // Cari exact match terlebih dahulu
  const exactMatch = filtered.find(tx => {
    const fieldValue = field === 'name' ? tx.name : tx.idNumber;
    return fieldValue && fieldValue.trim().toUpperCase() === inputUpper;
  });
  if (exactMatch) return { ...exactMatch, matchType: 'EXACT' };
  
  // Cari prefix match
  const prefixMatch = filtered.find(tx => {
    const fieldValue = field === 'name' ? tx.name : tx.idNumber;
    return fieldValue && fieldValue.trim().toUpperCase().startsWith(inputUpper);
  });
  if (prefixMatch) return { ...prefixMatch, matchType: 'PREFIX' };
  
  // Jika hanya partial match, jangan tampilkan preview
  return null;
}

// Data test
const savedData = [
  { name: "PUJI PURNAWAN", idNumber: "3401121406910001", image: "puji_purnawan.jpg" },
  { name: "PUJI RAHAYU", idNumber: "3401121406910004", image: "puji_rahayu.jpg" },
  { name: "BUDI SANTOSO", idNumber: "3201121406910002", image: "budi_santoso.jpg" }
];

// Test cases yang HARUS BENAR
const criticalTests = [
  { input: "PUJI WIDODO", field: "name", expected: null, description: "🔥 CRITICAL: Tidak boleh ada preview!" },
  { input: "PUJI PURNAWAN", field: "name", expected: "EXACT", description: "✅ Harus ada preview exact match" },
  { input: "PUJI", field: "name", expected: "PREFIX", description: "✅ Harus ada preview prefix match" },
  { input: "WIDODO", field: "name", expected: null, description: "❌ Tidak boleh ada preview" },
  { input: "1406910001", field: "idNumber", expected: null, description: "❌ ID partial match tidak boleh ada preview" },
  { input: "3401", field: "idNumber", expected: "PREFIX", description: "✅ ID prefix match harus ada preview" }
];

console.log("HASIL TEST:");
console.log("===========");

let allPassed = true;
criticalTests.forEach((test, idx) => {
  const result = shouldShowPreview(test.input, savedData, test.field);
  const actualType = result ? result.matchType : null;
  const passed = actualType === test.expected;
  
  if (!passed) allPassed = false;
  
  console.log(`${idx + 1}. ${passed ? '✅' : '❌'} "${test.input}" (${test.field})`);
  console.log(`   Expected: ${test.expected || 'NO PREVIEW'}`);
  console.log(`   Actual: ${actualType || 'NO PREVIEW'}`);
  console.log(`   ${test.description}`);
  if (result && result.name) {
    console.log(`   Would show: ${result.name}`);
  }
  console.log("");
});

console.log("=== SUMMARY ===");
if (allPassed) {
  console.log("🎉 SEMUA TEST PASSED! Preview suggestion sudah benar.");
} else {
  console.log("🚨 ADA TEST YANG GAGAL! Masih perlu perbaikan.");
}

console.log("\n📋 ATURAN PREVIEW:");
console.log("✅ EXACT MATCH → Show preview");
console.log("✅ PREFIX MATCH → Show preview");  
console.log("❌ PARTIAL MATCH → NO preview");
console.log("❌ NO MATCH → NO preview");
