// Debug khusus untuk kasus "PUJI K" yang masih menampilkan PUJI PURNAWAN
console.log("=== DEBUG KASUS PUJI K ===");

// Data yang sama dengan yang di aplikasi
const testData = [
  { name: "PUJI PURNAWAN", idNumber: "1234567890123456" }
];

// Function shouldShowPreview yang ada sekarang
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
    if (exactMatch) {
      console.log("Found exact match:", exactMatch.name);
      return exactMatch;
    }
    
    // Prefix match yang ketat (word boundary)
    const prefixMatch = data.find(tx => {
      const fieldValue = tx.name;
      if (!fieldValue) return false;
      
      const nameUpper = fieldValue.trim().toUpperCase();
      const words = nameUpper.split(' ');
      const inputWords = inputUpper.split(' ');
      
      console.log(`Checking ${fieldValue}:`);
      console.log(`  Name words:`, words);
      console.log(`  Input words:`, inputWords);
      
      // Jika input hanya 1 kata, cek apakah kata pertama dari nama dimulai dengan input
      if (inputWords.length === 1) {
        const result = words[0] && words[0].startsWith(inputWords[0]);
        console.log(`  Single word check: ${words[0]} starts with ${inputWords[0]} = ${result}`);
        return result;
      }
      
      // Jika input lebih dari 1 kata, cek setiap kata secara berurutan
      if (inputWords.length > words.length) {
        console.log(`  Too many input words: ${inputWords.length} > ${words.length}`);
        return false;
      }
      
      for (let i = 0; i < inputWords.length; i++) {
        if (i === inputWords.length - 1) {
          // Kata terakhir dari input bisa partial match
          if (!words[i] || !words[i].startsWith(inputWords[i])) {
            console.log(`  Last word check failed: ${words[i]} does not start with ${inputWords[i]}`);
            return false;
          } else {
            console.log(`  Last word check passed: ${words[i]} starts with ${inputWords[i]}`);
          }
        } else {
          // Kata-kata sebelumnya harus exact match
          if (!words[i] || words[i] !== inputWords[i]) {
            console.log(`  Word ${i} check failed: ${words[i]} !== ${inputWords[i]}`);
            return false;
          } else {
            console.log(`  Word ${i} check passed: ${words[i]} === ${inputWords[i]}`);
          }
        }
      }
      
      console.log(`  All checks passed for ${fieldValue}`);
      return true;
    });
    
    return prefixMatch || null;
  }
  
  return null;
}

// Test kasus bermasalah
console.log("\n=== TEST PUJI K ===");
const result = shouldShowPreview("PUJI K", testData, 'name');
console.log("Result for 'PUJI K':", result ? result.name : null);

console.log("\n=== EXPECTED BEHAVIOR ===");
console.log("PUJI K should NOT match PUJI PURNAWAN because:");
console.log("- First word: PUJI === PUJI ✓");
console.log("- Second word: PURNAWAN does NOT start with K ✗");
console.log("- Therefore: NO MATCH expected");

if (result) {
  console.log("\n❌ BUG CONFIRMED: Still returning match when it shouldn't");
} else {
  console.log("\n✅ LOGIC WORKING: No match returned as expected");
}
