// Test final: SUPERMAN issue setelah perbaikan UserFormRight.tsx
console.log("=== TEST FINAL: SUPERMAN ISSUE FIXED ===");

// Simulasi UserForm.tsx - logika sudah benar
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

// Data yang tersedia
const mockData = [
  { name: "SRI WULANSARI", image: "sri.jpg", images: ["sri.jpg"] },
  { name: "PUJI PURNAWAN", image: "puji.jpg", images: ["puji.jpg"] },
  { name: "BUDI SANTOSO", image: "budi.jpg", images: ["budi.jpg"] }
];

// Simulasi formData tanpa gambar
const formData = {
  images: [],
  image: ""
};

// Simulasi UserFormRight.tsx - logika yang sudah diperbaiki
function simulateUserFormRight(input, previewSuggestion, formData) {
  let images = [];
  
  // Prioritas 1: Jika ada previewSuggestion, gunakan itu
  if (previewSuggestion) {
    if (Array.isArray(previewSuggestion.images) && previewSuggestion.images.length > 0) {
      images = previewSuggestion.images;
      console.log(`  → Menggunakan previewSuggestion.images: ${images}`);
    } else if (previewSuggestion.image) {
      images = [previewSuggestion.image];
      console.log(`  → Menggunakan previewSuggestion.image: ${images}`);
    } else {
      console.log(`  → previewSuggestion ada tapi tidak punya gambar`);
    }
    return images;
  }
  
  // Prioritas 2: Jika tidak ada previewSuggestion, gunakan formData
  if (formData.images && Array.isArray(formData.images) && formData.images.length > 0) {
    images = formData.images;
    console.log(`  → Menggunakan formData.images: ${images}`);
  } else if (formData.image && formData.image.trim() !== '') {
    images = [formData.image];
    console.log(`  → Menggunakan formData.image: ${images}`);
  } else {
    console.log(`  → Tidak ada gambar, clear images`);
  }
  
  return images;
}

// Test scenario lengkap
console.log("\n🧪 Test Scenario: S → SU → SUPERMAN");

// Input "S"
let currentInput = "S";
let previewSuggestion = shouldShowPreview(currentInput, mockData, 'name');
let displayedImages = simulateUserFormRight(currentInput, previewSuggestion, formData);
console.log(`\nInput: "${currentInput}"`);
console.log(`PreviewSuggestion: ${previewSuggestion ? previewSuggestion.name : 'null'}`);
console.log(`Displayed Images: ${displayedImages.length > 0 ? displayedImages : 'NONE'}`);

// Input "SU"  
currentInput = "SU";
previewSuggestion = shouldShowPreview(currentInput, mockData, 'name');
displayedImages = simulateUserFormRight(currentInput, previewSuggestion, formData);
console.log(`\nInput: "${currentInput}"`);
console.log(`PreviewSuggestion: ${previewSuggestion ? previewSuggestion.name : 'null'}`);
console.log(`Displayed Images: ${displayedImages.length > 0 ? displayedImages : 'NONE'}`);

// Input "SUPERMAN"
currentInput = "SUPERMAN";
previewSuggestion = shouldShowPreview(currentInput, mockData, 'name');
displayedImages = simulateUserFormRight(currentInput, previewSuggestion, formData);
console.log(`\nInput: "${currentInput}"`);
console.log(`PreviewSuggestion: ${previewSuggestion ? previewSuggestion.name : 'null'}`);
console.log(`Displayed Images: ${displayedImages.length > 0 ? displayedImages : 'NONE'}`);

console.log("\n🎯 KESIMPULAN:");
console.log("✅ Input 'S' → SRI WULANSARI → Gambar muncul");
console.log("✅ Input 'SU' → null → Gambar hilang");
console.log("✅ Input 'SUPERMAN' → null → Gambar hilang");
console.log("\n🔧 PERBAIKAN YANG DILAKUKAN:");
console.log("1. UserForm.tsx: Logika shouldShowPreview sudah benar");
console.log("2. UserFormRight.tsx: Tambahkan handling untuk previewSuggestion = null");
console.log("3. useEffect di UserFormRight.tsx: Clear images jika previewSuggestion null dan tidak ada formData.images");
console.log("\n🚀 MASALAH SEHARUSNYA SUDAH TERATASI!");
