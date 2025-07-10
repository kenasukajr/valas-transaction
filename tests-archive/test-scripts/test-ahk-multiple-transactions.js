// Test script untuk mengecek AHK generation untuk multiple transactions BNS

async function testAhkGenerationMultipleTransactions() {
  console.log('=== TEST AHK GENERATION MULTIPLE TRANSACTIONS BNS ===\n');
  
  const testData = {
    name: 'TEST USER',
    address: 'TEST ADDRESS',
    phone: '081234567890',
    job: 'SWASTA',
    idNumber: '1234567890123456',
    birthPlace: 'JAKARTA',
    birthDate: '1990-01-01',
    transactionType: 'BNS',
    pembayaranRp: '50000000',
    // Multiple transactions
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
      },
      {
        currency: 'GBP',
        amount: '300',
        rate: '19500'
      }
    ]
  };
  
  console.log('📝 Test Data:');
  console.log(`   • Customer: ${testData.name}`);
  console.log(`   • Transaction Type: ${testData.transactionType}`);
  console.log(`   • Payment Amount: Rp ${testData.pembayaranRp}`);
  console.log(`   • Total Transactions: ${testData.transactions.length}`);
  console.log('');
  
  testData.transactions.forEach((tx, index) => {
    console.log(`   Transaction ${index + 1}:`);
    console.log(`     - Currency: ${tx.currency}`);
    console.log(`     - Amount: ${tx.amount}`);
    console.log(`     - Rate: ${tx.rate}`);
    console.log(`     - Total: Rp ${(parseFloat(tx.amount) * parseFloat(tx.rate)).toLocaleString()}`);
  });
  
  console.log('\n🔄 Generating AHK Script...');
  
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
    
    // Save AHK to file untuk inspection
    const fs = require('fs');
    const filename = 'test-multiple-transactions-bns.ahk';
    fs.writeFileSync(filename, ahkContent);
    
    console.log('✅ AHK script generated successfully');
    console.log(`📁 File saved: ${filename}`);
    
    // Analyze AHK content untuk currency codes
    console.log('\n🔍 Analyzing AHK Script for Currency Codes...');
    
    const lines = ahkContent.split('\n');
    let transactionCount = 0;
    let currencyInputs = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Look for currency input patterns
      if (line.includes('Debug: Currency input =')) {
        const match = line.match(/Currency input = "([^"]+)", Code = (-?\d+)/);
        if (match) {
          currencyInputs.push({
            currency: match[1],
            code: match[2],
            line: i + 1
          });
        }
      }
      
      // Look for ISI DATA TRANSAKSI patterns
      if (line.includes('=== ISI DATA TRANSAKSI')) {
        const match = line.match(/TRANSAKSI (\d+)/);
        if (match) {
          transactionCount = Math.max(transactionCount, parseInt(match[1]));
        }
      }
    }
    
    console.log(`   • Total currency inputs found: ${currencyInputs.length}`);
    console.log(`   • Max transaction number: ${transactionCount}`);
    console.log('');
    
    currencyInputs.forEach((input, index) => {
      console.log(`   Currency Input ${index + 1}:`);
      console.log(`     - Currency: ${input.currency}`);
      console.log(`     - Code: ${input.code}`);
      console.log(`     - Line: ${input.line}`);
    });
    
    // Check for navigation issues
    console.log('\n🔍 Checking for Navigation Issues...');
    
    const navigationLines = lines.filter(line => 
      line.includes('NAVIGASI KE BARIS TRANSAKSI') || 
      line.includes('Enter 2x untuk navigasi ke baris transaksi berikutnya')
    );
    
    console.log(`   • Navigation sections found: ${navigationLines.length}`);
    
    if (navigationLines.length < testData.transactions.length - 1) {
      console.log('   ⚠️  WARNING: Insufficient navigation sections for multiple transactions');
    } else {
      console.log('   ✅ Navigation sections look correct');
    }
    
    // Check for currency code issues
    console.log('\n🔍 Checking Currency Code Issues...');
    
    if (currencyInputs.length !== testData.transactions.length) {
      console.log(`   ❌ ERROR: Expected ${testData.transactions.length} currency inputs, found ${currencyInputs.length}`);
    } else {
      console.log(`   ✅ Currency input count matches transaction count`);
    }
    
    // Verify each currency
    testData.transactions.forEach((tx, index) => {
      const expectedCurrency = tx.currency;
      const actualInput = currencyInputs[index];
      
      if (actualInput && actualInput.currency === expectedCurrency) {
        console.log(`   ✅ Transaction ${index + 1}: ${expectedCurrency} -> Code ${actualInput.code}`);
      } else {
        console.log(`   ❌ Transaction ${index + 1}: Expected ${expectedCurrency}, got ${actualInput?.currency || 'MISSING'}`);
      }
    });
    
    console.log('\n🎯 Analysis Summary:');
    console.log(`   • AHK file generated: ${filename}`);
    console.log(`   • Total transactions: ${testData.transactions.length}`);
    console.log(`   • Currency inputs: ${currencyInputs.length}`);
    console.log(`   • Navigation sections: ${navigationLines.length}`);
    
    if (currencyInputs.length === testData.transactions.length) {
      console.log('   🎉 SUCCESS: All transactions have currency inputs');
    } else {
      console.log('   ❌ ISSUE: Missing currency inputs for some transactions');
    }
    
  } catch (error) {
    console.error('❌ Error generating AHK script:', error.message);
  }
}

// Run test
testAhkGenerationMultipleTransactions();
