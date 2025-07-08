// Test shouldShowPreview logic untuk case "PUJI K"

console.log('🧪 TEST shouldShowPreview Logic');

// Simulasi data
const data = [
  { name: "PUJI PURNAWAN", idNumber: "1234567890123" },
  { name: "SRI WULANSARI", idNumber: "2345678901234" }
];

// Simulasi shouldShowPreview function
function shouldShowPreview(input, data, field) {
  if (!input || input.trim().length === 0) return null;
  
  const inputTrimmed = input.trim();
  const inputUpper = inputTrimmed.toUpperCase();
  
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

// Test cases
console.log('TEST CASES:');
console.log('');

const testCases = [
  { input: "PUJI", expected: "PUJI PURNAWAN" },
  { input: "PUJI K", expected: null }, // ❌ BUG: ini seharusnya null
  { input: "PUJI P", expected: "PUJI PURNAWAN" },
  { input: "PUJI PURNAWAN", expected: "PUJI PURNAWAN" },
  { input: "SRI", expected: "SRI WULANSARI" },
  { input: "SRI W", expected: "SRI WULANSARI" },
  { input: "SRI K", expected: null },
  { input: "SUPERMAN", expected: null }
];

testCases.forEach(testCase => {
  const result = shouldShowPreview(testCase.input, data, 'name');
  const resultName = result ? result.name : 'null';
  const status = (result?.name === testCase.expected || (result === null && testCase.expected === null)) ? '✅' : '❌';
  
  console.log(`${status} Input: "${testCase.input}" → Result: ${resultName} (Expected: ${testCase.expected})`);
});

console.log('');
console.log('🔍 ANALYSIS:');
console.log('Input "PUJI K" → words = ["PUJI", "K"]');
console.log('Data "PUJI PURNAWAN" → words = ["PUJI", "PURNAWAN"]');
console.log('Logic: words[0] === "PUJI" ✅, words[1].startsWith("K") ❌');
console.log('Expected: return false → null');
console.log('');

console.log('🐛 POSSIBLE BUG:');
console.log('Logika prefix match mungkin salah untuk multiple words');
console.log('Perlu dicek apakah "PURNAWAN".startsWith("K") = false');
