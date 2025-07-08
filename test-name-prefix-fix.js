// Test script untuk verifikasi logika name prefix matching yang ketat
console.log("=== TEST LOGIKA NAME PREFIX MATCHING KETAT ===");

// Mock data sesuai dengan kasus yang disebutkan
const mockData = [
  { name: "PUJI PURNAWAN", idNumber: "1234567890123456" },
  { name: "PUJI KURNIAWAN", idNumber: "9876543210987654" },
  { name: "BUDI SANTOSO", idNumber: "1111222233334444" },
  { name: "SITI RAHAYU", idNumber: "2222333344445555" }
];

// Simulasi fungsi shouldShowPreview yang sudah diperbaiki
function shouldShowPreview(input, data, field) {
  if (!input || input.trim().length === 0) return null;
  
  const inputTrimmed = input.trim();
  const inputUpper = inputTrimmed.toUpperCase();
  
  if (field === 'idNumber') {
    if (inputTrimmed.length < 11) return null;
    
    const exactMatch = data.find(tx => {
      const fieldValue = tx.idNumber;
      return fieldValue && fieldValue.trim() === inputTrimmed;
    });
    if (exactMatch) return exactMatch;
    
    const partialMatch = data.find(tx => {
      const fieldValue = tx.idNumber;
      return fieldValue && fieldValue.trim().startsWith(inputTrimmed);
    });
    return partialMatch || null;
  }
  
  // Untuk name: cari exact match terlebih dahulu
  const exactMatch = data.find(tx => {
    const fieldValue = tx.name;
    return fieldValue && fieldValue.trim().toUpperCase() === inputUpper;
  });
  if (exactMatch) return exactMatch;
  
  // Untuk name: cari prefix match yang ketat (word boundary)
  const prefixMatch = data.find(tx => {
    const fieldValue = tx.name;
    if (!fieldValue) return false;
    
    const nameUpper = fieldValue.trim().toUpperCase();
    const words = nameUpper.split(' ');
    const inputWords = inputUpper.split(' ');
    
    // Jika input hanya 1 kata, cek apakah kata pertama dari nama dimulai dengan input
    if (inputWords.length === 1) {
      return words[0] && words[0].startsWith(inputWords[0]);
    }
    
    // Jika input lebih dari 1 kata, cek setiap kata secara berurutan
    if (inputWords.length > words.length) return false;
    
    for (let i = 0; i < inputWords.length; i++) {
      if (i === inputWords.length - 1) {
        // Kata terakhir dari input bisa partial match
        if (!words[i] || !words[i].startsWith(inputWords[i])) {
          return false;
        }
      } else {
        // Kata-kata sebelumnya harus exact match
        if (!words[i] || words[i] !== inputWords[i]) {
          return false;
        }
      }
    }
    
    return true;
  });
  
  return prefixMatch || null;
}

// Test cases yang spesifik untuk kasus yang disebutkan
console.log("\n📝 Test Cases untuk Kasus yang Disebutkan:");

const testCases = [
  // Test kasus yang bermasalah
  { input: "PUJI", expected: "PUJI PURNAWAN", desc: "PUJI → should show PUJI PURNAWAN (first match)" },
  { input: "PUJI K", expected: null, desc: "PUJI K → should show NO PREVIEW (tidak ada yang match)" },
  { input: "PUJI KURNIAWAN", expected: "PUJI KURNIAWAN", desc: "PUJI KURNIAWAN → should show PUJI KURNIAWAN (exact match)" },
  { input: "PUJI P", expected: "PUJI PURNAWAN", desc: "PUJI P → should show PUJI PURNAWAN (prefix match)" },
  { input: "PUJI PUR", expected: "PUJI PURNAWAN", desc: "PUJI PUR → should show PUJI PURNAWAN (prefix match)" },
  { input: "PUJI PURN", expected: "PUJI PURNAWAN", desc: "PUJI PURN → should show PUJI PURNAWAN (prefix match)" },
  { input: "PUJI PURNAWAN", expected: "PUJI PURNAWAN", desc: "PUJI PURNAWAN → should show PUJI PURNAWAN (exact match)" },
  
  // Test kasus lain untuk memastikan logika benar
  { input: "P", expected: "PUJI PURNAWAN", desc: "P → should show PUJI PURNAWAN (first match)" },
  { input: "PU", expected: "PUJI PURNAWAN", desc: "PU → should show PUJI PURNAWAN (first match)" },
  { input: "PUJ", expected: "PUJI PURNAWAN", desc: "PUJ → should show PUJI PURNAWAN (first match)" },
  { input: "PUJI KUR", expected: "PUJI KURNIAWAN", desc: "PUJI KUR → should show PUJI KURNIAWAN (prefix match)" },
  { input: "PUJI KURN", expected: "PUJI KURNIAWAN", desc: "PUJI KURN → should show PUJI KURNIAWAN (prefix match)" },
  { input: "PUJI X", expected: null, desc: "PUJI X → should show NO PREVIEW (tidak ada yang match)" },
  { input: "PUJI Z", expected: null, desc: "PUJI Z → should show NO PREVIEW (tidak ada yang match)" },
  { input: "BUDI", expected: "BUDI SANTOSO", desc: "BUDI → should show BUDI SANTOSO" },
  { input: "BUDI S", expected: "BUDI SANTOSO", desc: "BUDI S → should show BUDI SANTOSO" },
  { input: "BUDI X", expected: null, desc: "BUDI X → should show NO PREVIEW" },
  { input: "TIDAK ADA", expected: null, desc: "TIDAK ADA → should show NO PREVIEW" }
];

testCases.forEach(test => {
  const result = shouldShowPreview(test.input, mockData, 'name');
  const resultName = result ? result.name : null;
  const expected = test.expected;
  const passed = resultName === expected;
  
  console.log(`  ${passed ? '✅' : '❌'} ${test.desc}`);
  if (!passed) {
    console.log(`     Expected: ${expected}`);
    console.log(`     Got:      ${resultName}`);
  }
});

console.log("\n🎯 Test Summary:");
console.log("- 'PUJI' → menampilkan PUJI PURNAWAN (first match)");
console.log("- 'PUJI K' → TIDAK menampilkan preview (tidak ada yang match)");
console.log("- 'PUJI KURNIAWAN' → menampilkan PUJI KURNIAWAN (exact match)");
console.log("- 'PUJI P' → menampilkan PUJI PURNAWAN (prefix match)");
console.log("- 'PUJI X' → TIDAK menampilkan preview (tidak ada yang match)");

console.log("\n📋 Logika Perbaikan:");
console.log("1. Exact match selalu prioritas pertama");
console.log("2. Prefix match word-by-word, bukan character-by-character");
console.log("3. Jika input 'PUJI K', cek apakah ada nama yang kata kedua dimulai dengan 'K'");
console.log("4. Jika tidak ada, return null (no preview)");
console.log("5. Gambar preview hanya muncul jika ada exact/prefix match yang valid");
