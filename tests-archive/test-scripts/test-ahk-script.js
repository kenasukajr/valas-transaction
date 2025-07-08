// Test script untuk generate AHK dari API
const testData = {
  name: "John Doe",
  address: "Jl. Test No. 123",
  phone: "081234567890",
  job: "Software Engineer",
  idNumber: "1234567890123456",
  birthPlace: "Jakarta",
  birthDate: "1990-01-15",
  transactionType: "BNB"
};

console.log("Testing AHK Script Generation from API...");
console.log("Test data:", testData);

fetch('http://localhost:3000/api/generate-ahk', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(testData)
})
.then(response => response.text())
.then(script => {
  console.log("\n=== Generated AHK Script ===");
  console.log(script);
  console.log("=== End of Script ===\n");
  
  // Check for potential issues
  const lines = script.split('\n');
  console.log(`Total lines: ${lines.length}`);
  console.log(`Line 1: "${lines[0]}"`);
  console.log(`Line 2: "${lines[1]}"`);
  console.log(`Line 3: "${lines[2]}"`);
  
  // Check for problematic characters
  if (script.includes('`')) {
    console.log("⚠️  WARNING: Script contains backticks which might cause issues");
  }
  if (script.includes('${')) {
    console.log("⚠️  WARNING: Script contains template literal syntax which might cause issues");
  }
  
  console.log("✅ Script generation test completed");
})
.catch(err => {
  console.error("❌ Error:", err);
});
