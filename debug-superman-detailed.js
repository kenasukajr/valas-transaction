// Debug: mengapa SUPERMAN menampilkan SRI WULANSARI
console.log("=== DEBUG: SUPERMAN vs SRI WULANSARI ===");

// Simulasi data yang ada
const mockData = [
  { name: "SRI WULANSARI", idNumber: "1234567890123" },
  { name: "PUJI PURNAWAN", idNumber: "1234567890124" },
  { name: "BUDI SANTOSO", idNumber: "1234567890125" }
];

// Simulasi filtering dropdown (seperti di useEffect)
function filterDropdown(input, data) {
  const capitalizedValue = input.trim().toUpperCase();
  
  let filtered = data.filter(tx => {
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
  
  return filtered;
}

// Simulasi shouldShowPreview
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

// Test dengan input "SUPERMAN"
console.log("\n🔍 Test Input: SUPERMAN");
const filteredResults = filterDropdown("SUPERMAN", mockData);
console.log("Filtered dropdown results:", filteredResults.map(r => r.name));

const previewResult = shouldShowPreview("SUPERMAN", mockData, 'name');
console.log("Preview result:", previewResult ? previewResult.name : 'NO PREVIEW');

// Test dengan input "S"
console.log("\n🔍 Test Input: S");
const filteredResultsS = filterDropdown("S", mockData);
console.log("Filtered dropdown results:", filteredResultsS.map(r => r.name));

const previewResultS = shouldShowPreview("S", mockData, 'name');
console.log("Preview result:", previewResultS ? previewResultS.name : 'NO PREVIEW');

// Test dengan input "SU"
console.log("\n🔍 Test Input: SU");
const filteredResultsSU = filterDropdown("SU", mockData);
console.log("Filtered dropdown results:", filteredResultsSU.map(r => r.name));

const previewResultSU = shouldShowPreview("SU", mockData, 'name');
console.log("Preview result:", previewResultSU ? previewResultSU.name : 'NO PREVIEW');

console.log("\n🎯 ANALISIS:");
console.log("1. Jika dropdown kosong tapi preview ada → bug di shouldShowPreview");
console.log("2. Jika dropdown ada tapi preview null → bug di event handler mouse");
console.log("3. Jika keduanya konsisten → mungkin ada bug di tempat lain");

console.log("\n📋 KEMUNGKINAN PENYEBAB:");
console.log("- Event handler mouse di dropdown yang override logika");
console.log("- State React yang tidak sync");
console.log("- Cache browser yang masih menyimpan data lama");
console.log("- Ada kode lain yang memanggil onPreviewSuggestion");
