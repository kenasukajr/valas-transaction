// TEST FINAL: Verifikasi Generator AHK v2 Sudah Benar
const fetch = require('node-fetch');

console.log('🧪 TEST FINAL: Memverifikasi Generator AHK v2...\n');

// Data test untuk generator
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

// Function untuk test generator
async function testGenerator(endpoint, description) {
  try {
    console.log(`📋 Testing ${description}...`);
    
    const response = await fetch(`http://localhost:3001/api/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testData)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const ahkContent = await response.text();
    
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
      { name: 'Old Send v1', test: ahkContent.includes('Send, {') },
      { name: 'Old Sleep v1', test: ahkContent.includes('Sleep, ') },
      { name: 'Old WinActivate v1', test: ahkContent.includes('WinActivate, ') },
      { name: 'Old Object v1', test: ahkContent.includes('data := {}') },
      { name: 'Old Loop v1', test: ahkContent.includes('Send %A_LoopField%') },
      { name: 'Old FileDelete v1', test: ahkContent.includes('FileDelete, %') },
      { name: 'Old ExitApp v1', test: ahkContent.includes('ExitApp') && !ahkContent.includes('ExitApp()') }
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
    const filename = `test-output-${endpoint.replace('/', '-')}.ahk`;
    fs.writeFileSync(filename, ahkContent);
    console.log(`  💾 Saved to: ${filename}`);
    
    return { allV2Passed, anyV1Found, content: ahkContent };
    
  } catch (error) {
    console.error(`❌ Error testing ${description}:`, error.message);
    return { allV2Passed: false, anyV1Found: true, error: error.message };
  }
}

// Run tests
async function runAllTests() {
  console.log('🚀 Starting comprehensive AHK v2 generator tests...\n');
  
  const tests = [
    { endpoint: 'execute-ahk', description: 'Main Generator (execute-ahk)' },
    { endpoint: 'generate-ahk', description: 'Alternative Generator (generate-ahk)' }
  ];
  
  let allTestsPassed = true;
  
  for (const test of tests) {
    const result = await testGenerator(test.endpoint, test.description);
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
  }
}

// Run the tests
runAllTests().catch(console.error);
