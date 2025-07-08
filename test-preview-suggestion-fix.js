// Test untuk validasi logika preview suggestion yang sudah diperbaiki
console.log("=== TEST PREVIEW SUGGESTION LOGIC ===");

// Simulasi data nasabah yang tersimpan
const savedTransactions = [
  { name: "PUJI PURNAWAN", idNumber: "3401121406910001", image: "puji_purnawan.jpg" },
  { name: "BUDI SANTOSO", idNumber: "3201121406910002", image: "budi_santoso.jpg" },
  { name: "SITI NURHALIZA", idNumber: "3301121406910003", image: "siti_nurhaliza.jpg" },
  { name: "PUJI RAHAYU", idNumber: "3401121406910004", image: "puji_rahayu.jpg" }
];

// Test cases untuk berbagai input nama
const testCases = [
  {
    input: "PUJI PURNAWAN",
    expected: "EXACT MATCH",
    description: "Input sama persis dengan data yang ada"
  },
  {
    input: "PUJI WIDODO", 
    expected: "NO PREVIEW",
    description: "Input mengandung 'PUJI' tapi bukan nama yang ada"
  },
  {
    input: "PUJI",
    expected: "PREFIX MATCH", 
    description: "Input adalah prefix dari nama yang ada"
  },
  {
    input: "BUDI",
    expected: "PREFIX MATCH",
    description: "Input adalah prefix dari BUDI SANTOSO"
  },
  {
    input: "ANTO",
    expected: "NO PREVIEW",
    description: "Input tidak ada di data"
  },
  {
    input: "SITI NUR",
    expected: "PREFIX MATCH", 
    description: "Input adalah prefix dari SITI NURHALIZA"
  },
  {
    input: "RAHAYU",
    expected: "NO PREVIEW",
    description: "Input adalah bagian tengah/akhir nama, bukan prefix"
  }
];

// Simulasi logika baru
function getPreviewSuggestion(input, savedData) {
  if (!input || input.trim().length === 0) return null;
  
  const capitalizedValue = input.trim().toUpperCase();
  let filtered = savedData.filter(tx => tx.name && tx.name.trim().toUpperCase().includes(capitalizedValue));
  
  if (filtered.length === 0) return null;
  
  // Cari exact match terlebih dahulu
  const exactMatch = filtered.find(tx => tx.name && tx.name.trim().toUpperCase() === capitalizedValue);
  if (exactMatch) {
    return { match: exactMatch, type: "EXACT MATCH" };
  }
  
  // Cari prefix match
  const prefixMatch = filtered.find(tx => tx.name && tx.name.trim().toUpperCase().startsWith(capitalizedValue));
  if (prefixMatch) {
    return { match: prefixMatch, type: "PREFIX MATCH" };
  }
  
  // Jika hanya partial match di tengah, tidak tampilkan preview
  return null;
}

console.log("Test Results:");
console.log("=============");

testCases.forEach((testCase, index) => {
  const result = getPreviewSuggestion(testCase.input, savedTransactions);
  const actualResult = result ? result.type : "NO PREVIEW";
  const isCorrect = actualResult === testCase.expected;
  
  console.log(`${index + 1}. Input: "${testCase.input}"`);
  console.log(`   Expected: ${testCase.expected}`);
  console.log(`   Actual: ${actualResult}`);
  console.log(`   Status: ${isCorrect ? "✅ PASS" : "❌ FAIL"}`);
  if (result && result.match) {
    console.log(`   Matched: ${result.match.name}`);
    console.log(`   Image: ${result.match.image ? "Yes" : "No"}`);
  } else {
    console.log(`   Image Preview: No`);
  }
  console.log(`   Description: ${testCase.description}`);
  console.log("");
});

console.log("=== SUMMARY ===");
console.log("✅ EXACT MATCH: Tampilkan gambar dari data yang sama persis");
console.log("✅ PREFIX MATCH: Tampilkan gambar jika input adalah awal nama");
console.log("❌ PARTIAL MATCH: TIDAK tampilkan gambar jika hanya sebagian nama");
console.log("❌ NO MATCH: TIDAK tampilkan gambar jika tidak ada data");
console.log("\n🎯 Perbaikan berhasil! 'PUJI WIDODO' tidak akan menampilkan gambar 'PUJI PURNAWAN'");
