// Test script untuk validasi perbaikan navigasi BNS transaksi ke-2

async function testBNSNavigationFix() {
  console.log('=== TEST BNS NAVIGATION FIX VALIDATION ===\n');
  
  // Test dengan 2 transaksi BNS
  const testData = {
    name: 'TEST BNS NAVIGATION',
    address: 'TEST ADDRESS',
    phone: '081234567890',
    job: 'SWASTA',
    idNumber: '1234567890123456',
    birthPlace: 'JAKARTA',
    birthDate: '1990-01-01',
    transactionType: 'BNS',
    pembayaranRp: '35000000',
    transactions: [
      {
        currency: 'USD',
        amount: '1000',
        rate: '15750'
      },
      {
        currency: 'EUR',
        amount: '500',
        rate: '17200'
      }
    ]
  };
  
  console.log('📝 Test Case: BNS dengan 2 transaksi');
  console.log('   Transaction 1: USD 1000 @ 15750 = Rp 15.750.000');
  console.log('   Transaction 2: EUR 500 @ 17200 = Rp 8.600.000');
  console.log('   Total: Rp 24.350.000');
  console.log('   Payment: Rp 35.000.000');
  console.log('   Change: Rp 10.650.000');
  console.log('');
  
  try {
    const response = await fetch('http://localhost:8000/api/generate-ahk', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const ahkContent = await response.text();
    
    // Save untuk manual testing
    const fs = require('fs');
    const filename = 'test-bns-navigation-fix.ahk';
    fs.writeFileSync(filename, ahkContent);
    
    console.log('✅ AHK script generated successfully');
    console.log(`📁 File saved: ${filename}`);
    
    // Analyze perbaikan
    const lines = ahkContent.split('\n');
    let navigationFixes = {
      bnsNavigation: false,
      slowTiming: false,
      windowActivation: false,
      currencyInputs: 0
    };
    
    let foundBNSNavigation = false;
    let foundSlowTiming = false;
    let foundWindowActivation = false;
    let currencyInputCount = 0;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Check for BNS navigation comment
      if (line.includes('BNS navigation: timing khusus untuk stabilitas')) {
        foundBNSNavigation = true;
      }
      
      // Check for slow timing (500ms)
      if (line === 'Sleep, 500') {
        foundSlowTiming = true;
      }
      
      // Check for window activation
      if (line.includes('WinActivate, Data Prosesing PT Mulia Bumi Arta')) {
        foundWindowActivation = true;
      }
      
      // Count currency inputs
      if (line.includes('Debug: Currency input =')) {
        currencyInputCount++;
      }
    }
    
    navigationFixes.bnsNavigation = foundBNSNavigation;
    navigationFixes.slowTiming = foundSlowTiming;
    navigationFixes.windowActivation = foundWindowActivation;
    navigationFixes.currencyInputs = currencyInputCount;
    
    console.log('\n🔍 VALIDATION RESULTS:');
    console.log(`   ✅ BNS Navigation Logic: ${navigationFixes.bnsNavigation ? 'IMPLEMENTED' : 'MISSING'}`);
    console.log(`   ✅ Slow Timing (500ms): ${navigationFixes.slowTiming ? 'IMPLEMENTED' : 'MISSING'}`);
    console.log(`   ✅ Window Activation: ${navigationFixes.windowActivation ? 'IMPLEMENTED' : 'MISSING'}`);
    console.log(`   ✅ Currency Inputs: ${navigationFixes.currencyInputs}/2 transactions`);
    
    // Check specific navigation section
    const navigationSections = lines.filter(line => 
      line.includes('=== NAVIGASI KE BARIS TRANSAKSI 2')
    );
    
    if (navigationSections.length > 0) {
      console.log('\n🔍 NAVIGATION SECTION ANALYSIS:');
      console.log('   ✅ Found navigation to transaction 2');
      
      // Find the section and analyze timing
      const nav2Index = lines.findIndex(line => 
        line.includes('=== NAVIGASI KE BARIS TRANSAKSI 2')
      );
      
      if (nav2Index !== -1) {
        const nextLines = lines.slice(nav2Index, nav2Index + 10);
        let hasBNSComment = false;
        let hasSlow500ms = false;
        let hasWindowActivate = false;
        
        nextLines.forEach(line => {
          if (line.includes('BNS navigation: timing khusus')) hasBNSComment = true;
          if (line.includes('Sleep, 500')) hasSlow500ms = true;
          if (line.includes('WinActivate')) hasWindowActivate = true;
        });
        
        console.log(`   ${hasBNSComment ? '✅' : '❌'} BNS-specific navigation comment`);
        console.log(`   ${hasSlow500ms ? '✅' : '❌'} 500ms timing for stability`);
        console.log(`   ${hasWindowActivate ? '✅' : '❌'} Window activation before currency input`);
      }
    }
    
    console.log('\n🎯 EXPECTED BEHAVIOR:');
    console.log('   1. Transaction 1: USD input should work normally');
    console.log('   2. Navigation to transaction 2: slower timing (500ms)');
    console.log('   3. Window activation before EUR input');
    console.log('   4. Transaction 2: EUR input should work reliably');
    
    console.log('\n🧪 MANUAL TESTING STEPS:');
    console.log('   1. Open MBA application');
    console.log('   2. Run the generated AHK script');
    console.log('   3. Verify transaction 1 (USD) inputs correctly');
    console.log('   4. Verify navigation to transaction 2 is stable');
    console.log('   5. Verify transaction 2 (EUR) inputs correctly');
    console.log('   6. Verify payment amount is entered correctly');
    
    if (navigationFixes.bnsNavigation && navigationFixes.slowTiming && 
        navigationFixes.windowActivation && navigationFixes.currencyInputs === 2) {
      console.log('\n🎉 SUCCESS: All navigation fixes implemented!');
    } else {
      console.log('\n⚠️  WARNING: Some fixes may be missing');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run test
testBNSNavigationFix();
