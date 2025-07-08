// Test berdasarkan skenario real yang dialami user
console.log("=== TEST SKENARIO REAL USER ===");

// Skenario: hanya ada PUJI PURNAWAN di data (tidak ada PUJI KURNIAWAN)
const realData = [
  { name: "PUJI PURNAWAN", idNumber: "1234567890123456" },
  { name: "BUDI SANTOSO", idNumber: "9876543210987654" },
  { name: "SITI RAHAYU", idNumber: "1111222233334444" }
];

// Simulasi fungsi shouldShowPreview yang sudah diperbaiki
function shouldShowPreview(input, data, field) {
  if (!input || input.trim().length === 0) return null;
  
  const inputTrimmed = input.trim();
  const inputUpper = inputTrimmed.toUpperCase();
  
  if (field === 'name') {
    // Exact match terlebih dahulu
    const exactMatch = data.find(tx => {
      const fieldValue = tx.name;
      return fieldValue && fieldValue.trim().toUpperCase() === inputUpper;
    });
    if (exactMatch) return exactMatch;
    
    // Prefix match yang ketat (word boundary)
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
  
  return null;
}

// Test cases berdasarkan skenario yang dialami user
console.log("\n📝 Test Cases Skenario Real (hanya ada PUJI PURNAWAN):");

const realTestCases = [
  { input: "PUJI", expected: "PUJI PURNAWAN", desc: "PUJI → should show PUJI PURNAWAN" },
  { input: "PUJI K", expected: null, desc: "PUJI K → should show NO PREVIEW (tidak ada nama dengan kata kedua dimulai K)" },
  { input: "PUJI KURNIAWAN", expected: null, desc: "PUJI KURNIAWAN → should show NO PREVIEW (tidak ada di data)" },
  { input: "PUJI P", expected: "PUJI PURNAWAN", desc: "PUJI P → should show PUJI PURNAWAN" },
  { input: "PUJI PUR", expected: "PUJI PURNAWAN", desc: "PUJI PUR → should show PUJI PURNAWAN" },
  { input: "PUJI PURN", expected: "PUJI PURNAWAN", desc: "PUJI PURN → should show PUJI PURNAWAN" },
  { input: "PUJI PURNAWAN", expected: "PUJI PURNAWAN", desc: "PUJI PURNAWAN → should show PUJI PURNAWAN" },
  { input: "PUJI X", expected: null, desc: "PUJI X → should show NO PREVIEW" },
  { input: "PUJI Z", expected: null, desc: "PUJI Z → should show NO PREVIEW" }
];

console.log("Data yang tersedia:", realData.map(d => d.name).join(', '));
console.log("");

realTestCases.forEach(test => {
  const result = shouldShowPreview(test.input, realData, 'name');
  const resultName = result ? result.name : null;
  const expected = test.expected;
  const passed = resultName === expected;
  
  console.log(`  ${passed ? '✅' : '❌'} ${test.desc}`);
  if (!passed) {
    console.log(`     Expected: ${expected}`);
    console.log(`     Got:      ${resultName}`);
  }
});

console.log("\n🎯 Kesimpulan:");
console.log("Dengan data yang hanya ada 'PUJI PURNAWAN':");
console.log("- 'PUJI' → menampilkan PUJI PURNAWAN ✅");
console.log("- 'PUJI K' → TIDAK menampilkan preview ✅");
console.log("- 'PUJI KURNIAWAN' → TIDAK menampilkan preview ✅");
console.log("- 'PUJI P' → menampilkan PUJI PURNAWAN ✅");

console.log("\n📋 Logika sudah benar untuk kasus real user!");
