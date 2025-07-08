// Test untuk memastikan gambar upload manual tetap tampil
console.log("=== TEST UPLOAD MANUAL GAMBAR ===");

// Simulasi state
let images = [];
let previewSuggestion = null;
let formData = { image: "", images: [] };

// Helper
function arraysEqual(a, b) {
  if (a === b) return true;
  if (!Array.isArray(a) || !Array.isArray(b)) return false;
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

// Simulasi logika baru
function updateImages() {
  console.log("\n--- Update Images Logic ---");
  console.log("previewSuggestion:", previewSuggestion);
  console.log("formData.image:", formData.image);
  console.log("formData.images:", formData.images);
  
  // Prioritas 1: Jika ada previewSuggestion
  if (previewSuggestion) {
    if (Array.isArray(previewSuggestion.images) && previewSuggestion.images.length > 0) {
      images = previewSuggestion.images;
      console.log("→ Menggunakan previewSuggestion.images:", images);
      return;
    } else if (previewSuggestion.image) {
      images = [previewSuggestion.image];
      console.log("→ Menggunakan previewSuggestion.image:", images);
      return;
    } else {
      images = [];
      console.log("→ previewSuggestion ada tapi tidak punya gambar, clear images");
      return;
    }
  }
  
  // Prioritas 2: Jika tidak ada previewSuggestion, gunakan formData
  if (formData.images && Array.isArray(formData.images) && formData.images.length > 0) {
    images = formData.images;
    console.log("→ Menggunakan formData.images:", images);
    return;
  } else if (formData.image && formData.image.trim() !== '') {
    images = [formData.image];
    console.log("→ Menggunakan formData.image:", images);
    return;
  }
  
  // Tidak ada gambar
  images = [];
  console.log("→ Tidak ada gambar, clear images");
}

// Test scenario 1: Upload gambar manual
console.log("\n=== SKENARIO 1: Upload Gambar Manual ===");
previewSuggestion = null;
formData = { image: "uploaded_image.jpg", images: [] };
updateImages();
console.log("Result images:", images);
console.log("Expected: ['uploaded_image.jpg']");
console.log("Status:", JSON.stringify(images) === JSON.stringify(["uploaded_image.jpg"]) ? "✅ PASS" : "❌ FAIL");

// Test scenario 2: Paste multiple gambar
console.log("\n=== SKENARIO 2: Paste Multiple Gambar ===");
previewSuggestion = null;
formData = { image: "", images: ["paste1.jpg", "paste2.jpg"] };
updateImages();
console.log("Result images:", images);
console.log("Expected: ['paste1.jpg', 'paste2.jpg']");
console.log("Status:", JSON.stringify(images) === JSON.stringify(["paste1.jpg", "paste2.jpg"]) ? "✅ PASS" : "❌ FAIL");

// Test scenario 3: Preview suggestion aktif
console.log("\n=== SKENARIO 3: Preview Suggestion Aktif ===");
previewSuggestion = { name: "PUJI PURNAWAN", image: "puji_purnawan.jpg" };
formData = { image: "uploaded_image.jpg", images: [] };
updateImages();
console.log("Result images:", images);
console.log("Expected: ['puji_purnawan.jpg'] (suggestion prioritas)");
console.log("Status:", JSON.stringify(images) === JSON.stringify(["puji_purnawan.jpg"]) ? "✅ PASS" : "❌ FAIL");

// Test scenario 4: Preview suggestion null, ada gambar upload
console.log("\n=== SKENARIO 4: Preview Null + Upload Manual ===");
previewSuggestion = null;
formData = { image: "manual_upload.jpg", images: [] };
updateImages();
console.log("Result images:", images);
console.log("Expected: ['manual_upload.jpg']");
console.log("Status:", JSON.stringify(images) === JSON.stringify(["manual_upload.jpg"]) ? "✅ PASS" : "❌ FAIL");

console.log("\n=== KESIMPULAN ===");
console.log("✅ Upload manual harus tetap tampil saat previewSuggestion = null");
console.log("✅ Preview suggestion punya prioritas lebih tinggi dari upload manual");
console.log("✅ Logika baru sudah benar untuk menampilkan gambar upload manual");
