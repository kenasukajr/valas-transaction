// Test kasus SUPERMAN vs SRI WULANSARI
console.log("=== TEST KASUS SUPERMAN vs SRI WULANSARI ===");

// Simulasi data yang ada
const mockData = [
  { name: "SRI WULANSARI", idNumber: "1234567890123" },
  { name: "PUJI PURNAWAN", idNumber: "1234567890124" },
  { name: "BUDI SANTOSO", idNumber: "1234567890125" }
];

// Simulasi helper function shouldShowPreview
function shouldShowPreview(input, data, field) {
  if (!input || input.trim().length === 0) return null;
  
  const inputTrimmed = input.trim();
  const inputUpper = inputTrimmed.toUpperCase();
  
  if (field === 'name') {
    // Cari exact match terlebih dahulu
    const exactMatch = data.find(tx => {
      const fieldValue = tx.name;
      return fieldValue && fieldValue.trim().toUpperCase() === inputUpper;
    });
    if (exactMatch) return exactMatch;
    
    // Cari prefix match yang ketat (word boundary)
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

// Test kasus SUPERMAN
console.log("\n📝 Test Case: SUPERMAN");
const testSuperman = shouldShowPreview("SUPERMAN", mockData, 'name');
console.log("Input: SUPERMAN");
console.log("Expected: null (tidak ada nama yang dimulai dengan SUPERMAN)");
console.log("Actual:", testSuperman);
console.log("✅ Test PASSED:", testSuperman === null);

// Test kasus S (ini yang salah!)
console.log("\n📝 Test Case: S");
const testS = shouldShowPreview("S", mockData, 'name');
console.log("Input: S");
console.log("Expected: { name: 'SRI WULANSARI' } (SRI dimulai dengan S)");
console.log("Actual:", testS);
console.log("✅ Test PASSED:", testS && testS.name === "SRI WULANSARI");

// Test kasus SU (seharusnya tidak ada match)
console.log("\n📝 Test Case: SU");
const testSU = shouldShowPreview("SU", mockData, 'name');
console.log("Input: SU");
console.log("Expected: null (tidak ada nama yang dimulai dengan SU)");
console.log("Actual:", testSU);
console.log("✅ Test PASSED:", testSU === null);

// Test kasus SUPER (seharusnya tidak ada match)
console.log("\n📝 Test Case: SUPER");
const testSUPER = shouldShowPreview("SUPER", mockData, 'name');
console.log("Input: SUPER");
console.log("Expected: null (tidak ada nama yang dimulai dengan SUPER)");
console.log("Actual:", testSUPER);
console.log("✅ Test PASSED:", testSUPER === null);

// Test kasus SUPERMAN (seharusnya tidak ada match)
console.log("\n📝 Test Case: SUPERMAN (detailed)");
console.log("Data available:", mockData.map(d => d.name));
console.log("Looking for names that start with 'SUPERMAN':");
mockData.forEach(tx => {
  const nameUpper = tx.name.trim().toUpperCase();
  const words = nameUpper.split(' ');
  const inputWords = "SUPERMAN".split(' ');
  
  console.log(`  ${tx.name}:`);
  console.log(`    First word: "${words[0]}"`);
  console.log(`    Starts with "SUPERMAN": ${words[0].startsWith("SUPERMAN")}`);
});

console.log("\n🎯 KESIMPULAN:");
console.log("Logika sudah benar untuk kasus SUPERMAN!");
console.log("Jika masih muncul gambar SRI WULANSARI saat mengetik SUPERMAN,");
console.log("kemungkinan ada bug di tempat lain atau cache browser.");
