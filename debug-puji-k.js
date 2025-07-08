// Debug untuk memahami masalah dengan "PUJI K"
console.log("=== DEBUG PUJI K ISSUE ===");

const mockData = [
  { name: "PUJI PURNAWAN", idNumber: "1234567890123456" },
  { name: "PUJI KURNIAWAN", idNumber: "9876543210987654" }
];

const input = "PUJI K";
const inputUpper = input.toUpperCase();
const inputWords = inputUpper.split(' '); // ["PUJI", "K"]

console.log("Input:", input);
console.log("Input upper:", inputUpper);
console.log("Input words:", inputWords);

mockData.forEach((item, index) => {
  const nameUpper = item.name.trim().toUpperCase();
  const words = nameUpper.split(' ');
  
  console.log(`\nChecking ${item.name}:`);
  console.log("  Name words:", words);
  console.log("  Input words length:", inputWords.length);
  console.log("  Name words length:", words.length);
  
  // Cek kondisi untuk inputWords.length === 2
  if (inputWords.length === 2) {
    console.log("  Checking two words...");
    console.log("  Word 0 match:", words[0] === inputWords[0], `(${words[0]} vs ${inputWords[0]})`);
    console.log("  Word 1 starts with:", words[1] && words[1].startsWith(inputWords[1]), `(${words[1]} starts with ${inputWords[1]})`);
    
    // Cek apakah ini yang menyebabkan masalah
    if (words[0] === inputWords[0] && words[1] && words[1].startsWith(inputWords[1])) {
      console.log("  → MATCH FOUND! This is the problem.");
    }
  }
});

console.log("\n=== EXPECTED BEHAVIOR ===");
console.log("PUJI K should NOT match anything because:");
console.log("- PUJI PURNAWAN: second word 'PURNAWAN' does not start with 'K'");
console.log("- PUJI KURNIAWAN: second word 'KURNIAWAN' DOES start with 'K' - this is why it matches");
console.log("\nSo the logic is actually working correctly!");
console.log("PUJI K should match PUJI KURNIAWAN because KURNIAWAN starts with K");
console.log("The test expectation might be wrong.");
