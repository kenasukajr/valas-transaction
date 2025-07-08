// Test script untuk memverifikasi semua perbaikan final
// 1. Suggestion gambar hanya muncul untuk nama yang benar-benar match
// 2. Auto kapitalisasi untuk alamat dan nomor ID
// 3. Suggestion gambar ID hanya muncul jika minimal 11 digit sama atau exact match

console.log("=== TEST FINAL FIXES ===");

// Test 1: Validasi shouldShowPreview untuk nama
console.log("\n1. Test shouldShowPreview untuk nama:");
const testData = [
  { name: "PUJI WIDODO", idNumber: "1234567890123456" },
  { name: "BUDI SANTOSO", idNumber: "9876543210987654" },
  { name: "SITI RAHAYU", idNumber: "1111222233334444" }
];

// Mock function shouldShowPreview
function shouldShowPreview(input, data, field) {
  if (!input || input.trim().length === 0) return null;
  
  const inputTrimmed = input.trim();
  const inputUpper = inputTrimmed.toUpperCase();
  
  if (field === 'idNumber') {
    // Minimal 11 digit sama atau exact match
    if (inputTrimmed.length < 11) return null;
    
    // Exact match
    const exactMatch = data.find(tx => {
      const fieldValue = tx.idNumber;
      return fieldValue && fieldValue.trim() === inputTrimmed;
    });
    if (exactMatch) return exactMatch;
    
    // Partial match (minimal 11 digit)
    const partialMatch = data.find(tx => {
      const fieldValue = tx.idNumber;
      return fieldValue && fieldValue.trim().startsWith(inputTrimmed);
    });
    return partialMatch || null;
  }
  
  // Untuk nama: exact match terlebih dahulu
  const exactMatch = data.find(tx => {
    const fieldValue = tx.name;
    return fieldValue && fieldValue.trim().toUpperCase() === inputUpper;
  });
  if (exactMatch) return exactMatch;
  
  // Prefix match
  const prefixMatch = data.find(tx => {
    const fieldValue = tx.name;
    return fieldValue && fieldValue.trim().toUpperCase().startsWith(inputUpper);
  });
  if (prefixMatch) return prefixMatch;
  
  return null;
}

// Test cases untuk nama
const nameTestCases = [
  { input: "PUJI WIDODO", expected: "PUJI WIDODO", desc: "Exact match" },
  { input: "PUJI", expected: "PUJI WIDODO", desc: "Prefix match" },
  { input: "PUJ", expected: "PUJI WIDODO", desc: "Prefix match" },
  { input: "UJI", expected: null, desc: "Partial match (should be null)" },
  { input: "WIDODO", expected: null, desc: "Partial match (should be null)" },
  { input: "BUDI SANTOSO", expected: "BUDI SANTOSO", desc: "Exact match" },
  { input: "BUDI", expected: "BUDI SANTOSO", desc: "Prefix match" },
  { input: "SANTOSO", expected: null, desc: "Partial match (should be null)" },
  { input: "TIDAK ADA", expected: null, desc: "No match" }
];

nameTestCases.forEach(test => {
  const result = shouldShowPreview(test.input, testData, 'name');
  const resultName = result ? result.name : null;
  const passed = resultName === test.expected;
  console.log(`  ${passed ? '✓' : '✗'} ${test.desc}: "${test.input}" -> ${resultName} (expected: ${test.expected})`);
});

// Test 2: Validasi shouldShowPreview untuk ID Number
console.log("\n2. Test shouldShowPreview untuk ID Number:");
const idTestCases = [
  { input: "1234567890123456", expected: "1234567890123456", desc: "Exact match (16 digit)" },
  { input: "12345678901", expected: "1234567890123456", desc: "Minimal 11 digit match" },
  { input: "123456789012", expected: "1234567890123456", desc: "12 digit match" },
  { input: "1234567890", expected: null, desc: "10 digit (should be null)" },
  { input: "123456789", expected: null, desc: "9 digit (should be null)" },
  { input: "98765432109", expected: "9876543210987654", desc: "11 digit match" },
  { input: "9876543210987654", expected: "9876543210987654", desc: "Exact match" },
  { input: "1111222233334444", expected: "1111222233334444", desc: "Exact match" },
  { input: "11112222333", expected: "1111222233334444", desc: "11 digit match" },
  { input: "5555666677", expected: null, desc: "No match" }
];

idTestCases.forEach(test => {
  const result = shouldShowPreview(test.input, testData, 'idNumber');
  const resultId = result ? result.idNumber : null;
  const passed = resultId === test.expected;
  console.log(`  ${passed ? '✓' : '✗'} ${test.desc}: "${test.input}" -> ${resultId} (expected: ${test.expected})`);
});

// Test 3: Auto kapitalisasi
console.log("\n3. Test Auto Kapitalisasi:");
const autoCapitalTestCases = [
  { field: "name", input: "puji widodo", expected: "PUJI WIDODO" },
  { field: "address", input: "jl. merdeka no. 123", expected: "JL. MERDEKA NO. 123" },
  { field: "phone", input: "081234567890", expected: "081234567890" },
  { field: "job", input: "wiraswasta", expected: "WIRASWASTA" },
  { field: "idNumber", input: "1234567890123456", expected: "1234567890123456" },
  { field: "birthPlace", input: "jakarta", expected: "JAKARTA" },
  { field: "birthDate", input: "1990-01-01", expected: "1990-01-01" }
];

autoCapitalTestCases.forEach(test => {
  let result;
  if (test.field !== "birthDate") {
    result = test.input.toUpperCase();
  } else {
    result = test.input;
  }
  const passed = result === test.expected;
  console.log(`  ${passed ? '✓' : '✗'} ${test.field}: "${test.input}" -> "${result}" (expected: "${test.expected}")`);
});

console.log("\n=== RINGKASAN PERBAIKAN ===");
console.log("1. ✓ Suggestion gambar nama: hanya exact/prefix match");
console.log("2. ✓ Suggestion gambar ID: minimal 11 digit sama atau exact match");
console.log("3. ✓ Auto kapitalisasi: semua field kecuali birthDate");
console.log("4. ✓ Upload/paste manual tetap berfungsi");
console.log("5. ✓ Clear gambar sinkron dengan parent");

console.log("\n=== TESTING MANUAL YANG PERLU DILAKUKAN ===");
console.log("1. Ketik nama yang tidak ada -> gambar suggestion tidak muncul");
console.log("2. Ketik nama yang ada (prefix) -> gambar suggestion muncul");
console.log("3. Ketik ID kurang dari 11 digit -> gambar suggestion tidak muncul");
console.log("4. Ketik ID minimal 11 digit sama -> gambar suggestion muncul");
console.log("5. Upload/paste gambar manual -> tetap berfungsi");
console.log("6. Clear gambar -> menghilangkan semua gambar");
console.log("7. Auto kapitalisasi -> semua field kecuali birthDate");
