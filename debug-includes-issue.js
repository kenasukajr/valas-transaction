// Test spesifik untuk masalah PUJI K dengan filtering .includes()
console.log("=== DEBUG FILTERING PUJI K ===");

const testData = [
  { name: "PUJI PURNAWAN", idNumber: "1234567890123456" }
];

const input = "PUJI K";

// Test filtering lama (includes) 
console.log("=== OLD FILTERING (includes) ===");
const capitalizedValue = input.trim().toUpperCase();
console.log("Input upper:", capitalizedValue);

testData.forEach(tx => {
  const nameUpper = tx.name.trim().toUpperCase();
  const includesResult = nameUpper.includes(capitalizedValue);
  console.log(`${tx.name} includes "${capitalizedValue}": ${includesResult}`);
  
  // Detail check
  console.log(`  "${nameUpper}" contains "${capitalizedValue}"?`);
  console.log(`  PUJI PURNAWAN contains PUJI K? ${nameUpper.includes(capitalizedValue)}`);
});

console.log("\n=== MASALAH DITEMUKAN ===");
console.log("PUJI PURNAWAN TIDAK mengandung 'PUJI K' secara substring!");
console.log("Tapi mengapa dropdown masih muncul?");

console.log("\n=== COBA SEMUA KEMUNGKINAN ===");
const variations = [
  "PUJI K",
  "PUJI",
  "K",
  "PUJI ",
  " K"
];

variations.forEach(variant => {
  const result = "PUJI PURNAWAN".includes(variant);
  console.log(`"PUJI PURNAWAN".includes("${variant}"): ${result}`);
});

console.log("\n=== KEMUNGKINAN MASALAH ===");
console.log("1. Ada whitespace atau karakter tersembunyi?");
console.log("2. Ada logika lain yang override filtering?");
console.log("3. Browser cache?");
console.log("4. React state tidak update?");
