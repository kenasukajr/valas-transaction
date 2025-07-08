// Test untuk memastikan dropdown filtering konsisten dengan shouldShowPreview
console.log("=== TEST DROPDOWN FILTERING CONSISTENCY ===");

const testData = [
  { name: "PUJI PURNAWAN", idNumber: "1234567890123456" },
  { name: "BUDI SANTOSO", idNumber: "9876543210987654" },
  { name: "SITI RAHAYU", idNumber: "1111222233334444" }
];

// Simulasi filtering yang baru (konsisten dengan shouldShowPreview)
function filterDropdown(input, data) {
  if (!input || input.trim().length === 0) return [];
  
  const capitalizedValue = input.trim().toUpperCase();
  
  return data.filter(tx => {
    if (!tx.name) return false;
    
    const nameUpper = tx.name.trim().toUpperCase();
    const words = nameUpper.split(' ');
    const inputWords = capitalizedValue.split(' ');
    
    // Exact match
    if (nameUpper === capitalizedValue) return true;
    
    // Prefix match dengan word boundary
    if (inputWords.length === 1) {
      return words[0] && words[0].startsWith(inputWords[0]);
    }
    
    if (inputWords.length > words.length) return false;
    
    for (let i = 0; i < inputWords.length; i++) {
      if (i === inputWords.length - 1) {
        // Kata terakhir bisa partial match
        if (!words[i] || !words[i].startsWith(inputWords[i])) {
          return false;
        }
      } else {
        // Kata sebelumnya harus exact match
        if (!words[i] || words[i] !== inputWords[i]) {
          return false;
        }
      }
    }
    
    return true;
  });
}

// Simulasi filtering lama (yang bermasalah)
function filterDropdownOld(input, data) {
  if (!input || input.trim().length === 0) return [];
  
  const capitalizedValue = input.trim().toUpperCase();
  return data.filter(tx => tx.name && tx.name.trim().toUpperCase().includes(capitalizedValue));
}

// Test cases
const testCases = [
  "PUJI",
  "PUJI K", 
  "PUJI KURNIAWAN",
  "PUJI P",
  "BUDI",
  "BUDI X",
  "SITI"
];

console.log("Data tersedia:", testData.map(d => d.name).join(', '));
console.log("");

testCases.forEach(input => {
  const newFiltered = filterDropdown(input, testData);
  const oldFiltered = filterDropdownOld(input, testData);
  
  console.log(`Input: "${input}"`);
  console.log(`  New filtering: ${newFiltered.map(d => d.name).join(', ') || 'NO RESULTS'}`);
  console.log(`  Old filtering: ${oldFiltered.map(d => d.name).join(', ') || 'NO RESULTS'}`);
  
  if (newFiltered.length !== oldFiltered.length) {
    console.log(`  → DIFFERENCE DETECTED! ✅`);
  } else {
    console.log(`  → Same results`);
  }
  console.log("");
});

console.log("🎯 Expected improvements:");
console.log("- 'PUJI K' should show NO dropdown items (was showing PUJI PURNAWAN)");
console.log("- 'PUJI KURNIAWAN' should show NO dropdown items");
console.log("- 'BUDI X' should show NO dropdown items");
console.log("- Dropdown filtering now consistent with preview logic");
