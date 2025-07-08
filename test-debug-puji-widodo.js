// Test debug untuk preview suggestion PUJI WIDODO
console.log("=== DEBUG TEST: PUJI WIDODO ===");

// Simulasi data yang ada
const savedData = [
  { name: "PUJI PURNAWAN", idNumber: "3401121406910001", image: "puji_purnawan.jpg" },
  { name: "PUJI RAHAYU", idNumber: "3401121406910004", image: "puji_rahayu.jpg" }
];

// Simulasi exact logika dari UserForm.tsx
function debugPreviewLogic(input, savedTransactions) {
  console.log(`\n=== INPUT: "${input}" ===`);
  
  if (!input || input.trim().length === 0) {
    console.log("❌ Input kosong → previewSuggestion = null");
    return null;
  }
  
  const capitalizedValue = input.trim().toUpperCase();
  console.log(`🔍 Searching for: "${capitalizedValue}"`);
  
  // Filter dengan includes (seperti di kode asli)
  let filtered = savedTransactions.filter(tx => tx.name && tx.name.trim().toUpperCase().includes(capitalizedValue));
  console.log(`📋 Filtered results (${filtered.length}):`, filtered.map(tx => tx.name));
  
  if (filtered.length === 0) {
    console.log("❌ Tidak ada hasil filter → previewSuggestion = null");
    return null;
  }
  
  // EXACT MATCH
  const exactMatch = filtered.find(tx => tx.name && tx.name.trim().toUpperCase() === capitalizedValue);
  if (exactMatch) {
    console.log(`✅ EXACT MATCH found: "${exactMatch.name}" → previewSuggestion = data`);
    return { result: exactMatch, type: "EXACT" };
  }
  
  // PREFIX MATCH
  const prefixMatch = filtered.find(tx => tx.name && tx.name.trim().toUpperCase().startsWith(capitalizedValue));
  if (prefixMatch) {
    console.log(`✅ PREFIX MATCH found: "${prefixMatch.name}" → previewSuggestion = data`);
    return { result: prefixMatch, type: "PREFIX" };
  }
  
  // PARTIAL MATCH (TIDAK VALID)
  console.log("❌ Hanya PARTIAL MATCH → previewSuggestion = null");
  console.log("🚫 Filtered data akan ditampilkan di dropdown, tapi TIDAK di preview!");
  return null;
}

// Test sequence seperti user mengetik
const sequence = ["P", "PU", "PUJI", "PUJI ", "PUJI W", "PUJI WI", "PUJI WIDODO"];

console.log("=== SEQUENCE TEST: User mengetik 'PUJI WIDODO' ===");
sequence.forEach((input, idx) => {
  const result = debugPreviewLogic(input, savedData);
  console.log(`Step ${idx + 1}: "${input}" → ${result ? `Preview: ${result.result.name} (${result.type})` : 'NO PREVIEW'}`);
});

console.log("\n=== VERIFICATION ===");
const finalResult = debugPreviewLogic("PUJI WIDODO", savedData);
if (finalResult === null) {
  console.log("🎉 SUCCESS: 'PUJI WIDODO' correctly returns NULL preview!");
  console.log("✅ UserFormRight akan menerima previewSuggestion=null");
  console.log("✅ Images akan di-clear karena previewSuggestion=null");
} else {
  console.log("🚨 FAIL: 'PUJI WIDODO' masih menampilkan preview!");
  console.log("❌ Ada bug yang perlu diperbaiki");
}

console.log("\n=== KEMUNGKINAN PENYEBAB JIKA MASIH MUNCUL ===");
console.log("1. Browser cache - coba hard refresh (Ctrl+F5)");
console.log("2. React state belum terupdate - coba restart dev server");
console.log("3. Ada useEffect lain yang override previewSuggestion");
console.log("4. Component UserFormRight belum menerima props terbaru");
