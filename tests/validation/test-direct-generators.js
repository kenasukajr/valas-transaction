// TEST DIRECT: Verifikasi Generator Function Langsung (tanpa server)

// Import generator function langsung
const path = require('path');

console.log('🧪 TEST DIRECT: Testing generator functions directly...\n');

// Test data
const testData = {
  name: "John Doe", 
  address: "Jl. Test 123",
  phone: "08123456789",
  job: "Developer",
  idNumber: "1234567890123456",
  birthPlace: "Jakarta",
  birthDate: "1990-01-01",
  transactionType: "BNB",
  currency: "USD",
  amount: 1000,
  rate: 15500
};

// Function untuk test direct generator  
function testGeneratorDirect(generatorPath, description) {
  try {
    console.log(`📋 Testing ${description}...`);
    
    // Clear require cache untuk reload
    delete require.cache[require.resolve(generatorPath)];
    
    // Import the generator
    const { generateAhkScript } = require(generatorPath);
    
    if (!generateAhkScript) {
      console.log(`❌ Generator function not found in ${generatorPath}`);
      return false;
    }
    
    const ahkContent = generateAhkScript(testData);
    
    // Check AHK v2 syntax
    const checks = [
      { name: 'Header v2', test: ahkContent.includes('#Requires AutoHotkey v2.0') },
      { name: 'SingleInstance', test: ahkContent.includes('#SingleInstance Force') },
      { name: 'Function syntax', test: ahkContent.includes('TypeString(str) {') },
      { name: 'Map syntax', test: ahkContent.includes('data := Map()') },
      { name: 'Send v2', test: ahkContent.includes('Send("{') },
      { name: 'Sleep v2', test: ahkContent.includes('Sleep(') },
      { name: 'WinActivate v2', test: ahkContent.includes('WinActivate("') },
      { name: 'For-in v2', test: ahkContent.includes('for index, key in keys {') },
      { name: 'FileDelete v2', test: ahkContent.includes('FileDelete(A_ScriptFullPath)') },
      { name: 'ExitApp v2', test: ahkContent.includes('ExitApp()') }
    ];
    
    // Check for old v1 syntax (should NOT exist)
    const v1Checks = [
      { name: 'Old Send v1', test: ahkContent.includes('Send, {') || ahkContent.includes('Send,{') },
      { name: 'Old Sleep v1', test: ahkContent.includes('Sleep, ') && !ahkContent.includes('Sleep(') },
      { name: 'Old WinActivate v1', test: ahkContent.includes('WinActivate, ') },
      { name: 'Old Object v1', test: ahkContent.includes('data := {}') },
      { name: 'Old Loop v1', test: ahkContent.includes('Send %A_LoopField%') },
      { name: 'Old FileDelete v1', test: ahkContent.includes('FileDelete, %') }
    ];
    
    console.log(`\n✅ ${description} Results:`);
    
    let allV2Passed = true;
    let anyV1Found = false;
    
    checks.forEach(check => {
      const status = check.test ? '✅' : '❌';
      console.log(`  ${status} ${check.name}`);
      if (!check.test) allV2Passed = false;
    });
    
    console.log(`\n🚫 Old v1 Syntax Check (should be empty):`);
    v1Checks.forEach(check => {
      if (check.test) {
        console.log(`  ❌ FOUND: ${check.name}`);
        anyV1Found = true;
      }
    });
    
    if (!anyV1Found) {
      console.log(`  ✅ No old v1 syntax found`);
    }
    
    console.log(`\n📊 Summary for ${description}:`);
    console.log(`  AHK v2 Syntax: ${allV2Passed ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`  No v1 Syntax: ${!anyV1Found ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`  Overall: ${(allV2Passed && !anyV1Found) ? '🎉 PERFECT' : '⚠️ NEEDS FIX'}`);
    
    // Save script for manual verification
    const fs = require('fs');
    const filename = `test-output-${description.toLowerCase().replace(/[^a-z0-9]/g, '-')}.ahk`;
    fs.writeFileSync(filename, ahkContent);
    console.log(`  💾 Saved to: ${filename}`);
    
    // Show first few lines for quick check
    console.log(`\n📝 Preview (first 10 lines):`);
    const lines = ahkContent.split('\n').slice(0, 10);
    lines.forEach((line, i) => {
      console.log(`  ${(i + 1).toString().padStart(2)}: ${line}`);
    });
    
    return { allV2Passed, anyV1Found, content: ahkContent };
    
  } catch (error) {
    console.error(`❌ Error testing ${description}:`, error.message);
    return { allV2Passed: false, anyV1Found: true, error: error.message };
  }
}

// Run tests
async function runAllTests() {
  console.log('🚀 Starting direct generator function tests...\n');
  
  const tests = [
    { 
      path: './src/app/api/execute-ahk/route.ts', 
      description: 'Main Generator (execute-ahk)' 
    },
    { 
      path: './src/app/api/generate-ahk/route.ts', 
      description: 'Alternative Generator (generate-ahk)' 
    }
  ];
  
  let allTestsPassed = true;
  
  for (const test of tests) {
    const result = testGeneratorDirect(test.path, test.description);
    if (!result.allV2Passed || result.anyV1Found) {
      allTestsPassed = false;
    }
    console.log('\n' + '='.repeat(60) + '\n');
  }
  
  console.log('🏁 FINAL RESULT:');
  console.log(`  ${allTestsPassed ? '🎉 ALL TESTS PASSED!' : '⚠️ SOME TESTS FAILED'}`);
  console.log(`  Status: ${allTestsPassed ? 'Ready for production' : 'Needs more fixes'}\n`);
  
  if (allTestsPassed) {
    console.log('✅ Semua generator sudah menghasilkan AHK v2 yang benar!');
    console.log('✅ Tidak ada lagi syntax AHK v1 yang ketinggalan!');
    console.log('✅ Tombol script di frontend siap digunakan!');
    console.log('\n🎯 MASALAH ERROR "line 1" SEHARUSNYA SUDAH TERATASI!');
  } else {
    console.log('⚠️ Masih ada masalah dengan generator, perlu diperbaiki lagi.');
  }
}

// Run the tests
runAllTests().catch(console.error);
