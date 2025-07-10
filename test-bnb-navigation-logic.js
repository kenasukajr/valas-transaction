// Test script untuk BNB navigation logic - multiple transactions
const fetch = require('node-fetch').default || require('node-fetch');

const testBNBMultipleTransactions = async () => {
  console.log('🧪 Testing BNB Multiple Transactions Navigation Logic...');
  
  const testData = {
    // Data nasabah
    name: "PUJI PURNAWAN",
    address: "VILLA BANGUNTAPAN 2 NO E5 SAMPANGAN WIROKERTEN BANGUNTAPAN BANTUL YOGY",
    phone: "085878813372",
    job: "SWASTA",
    idNumber: "3401121406910001",
    birthPlace: "MAGELANG",
    birthDate: "1991-06-14",
    
    // Jenis transaksi
    transactionType: "BNB",
    
    // Multiple transactions
    transactions: [
      {
        currency: "USD",
        amount: "1000",
        rate: "15750"
      },
      {
        currency: "EUR", 
        amount: "500",
        rate: "17200"
      },
      {
        currency: "SGD",
        amount: "800",
        rate: "11400"
      }
    ]
  };
  
  try {
    console.log('📤 Sending request to generate AHK...');
    
    const response = await fetch('http://localhost:3000/api/generate-ahk', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testData)
    });
    
    if (response.ok) {
      const ahkScript = await response.text();
      console.log('✅ AHK script generated successfully!');
      
      // Check untuk logic Enter 3x untuk transaksi non-terakhir
      const enterThreeTimesCount = (ahkScript.match(/masih ada transaksi lain BNB: Enter 3x/g) || []).length;
      console.log(`📊 Enter 3x for non-last transactions: ${enterThreeTimesCount}`);
      
      // Check untuk logic transaksi terakhir
      const lastTransactionPattern = /transaksi terakhir BNB: Enter 2x → Down 1x → Enter 1x → 1s delay → Reset R/g;
      const lastTransactionCount = (ahkScript.match(lastTransactionPattern) || []).length;
      console.log(`📊 Last transaction pattern: ${lastTransactionCount}`);
      
      // Check untuk total transaksi
      const totalTransactionPattern = /Total transaksi yang akan diproses: (\d+)/;
      const totalMatch = ahkScript.match(totalTransactionPattern);
      const totalTransactions = totalMatch ? parseInt(totalMatch[1]) : 0;
      console.log(`📊 Total transactions: ${totalTransactions}`);
      
      // Validation
      const expectedEnterThreeTimes = totalTransactions - 1; // Semua kecuali terakhir
      const expectedLastTransaction = 1; // Hanya transaksi terakhir
      
      if (enterThreeTimesCount === expectedEnterThreeTimes && lastTransactionCount === expectedLastTransaction) {
        console.log('✅ BNB Navigation Logic is CORRECT!');
        console.log(`   - ${expectedEnterThreeTimes} transactions get Enter 3x`);
        console.log(`   - ${expectedLastTransaction} transaction gets special ending`);
      } else {
        console.log('❌ BNB Navigation Logic has ISSUES!');
        console.log(`   Expected: ${expectedEnterThreeTimes} Enter 3x, ${expectedLastTransaction} special ending`);
        console.log(`   Got: ${enterThreeTimesCount} Enter 3x, ${lastTransactionCount} special ending`);
      }
      
      // Save script untuk manual inspection
      const fs = require('fs');
      fs.writeFileSync('test-bnb-multiple-output.ahk', ahkScript);
      console.log('💾 Script saved to test-bnb-multiple-output.ahk');
      
    } else {
      console.error('❌ Failed to generate AHK script:', response.status, response.statusText);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
};

// Test single transaction juga
const testBNBSingleTransaction = async () => {
  console.log('\n🧪 Testing BNB Single Transaction Navigation Logic...');
  
  const testData = {
    name: "PUJI PURNAWAN",
    address: "VILLA BANGUNTAPAN 2 NO E5",
    phone: "085878813372",
    job: "SWASTA",
    idNumber: "3401121406910001",
    birthPlace: "MAGELANG",
    birthDate: "1991-06-14",
    
    transactionType: "BNB",
    
    // Single transaction
    currency: "USD",
    amount: "1000",
    rate: "15750"
  };
  
  try {
    const response = await fetch('http://localhost:3000/api/generate-ahk', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testData)
    });
    
    if (response.ok) {
      const ahkScript = await response.text();
      console.log('✅ Single transaction AHK script generated!');
      
      // Check untuk logic transaksi tunggal (langsung special ending)
      const lastTransactionPattern = /transaksi terakhir BNB: Enter 2x → Down 1x → Enter 1x → 1s delay → Reset R/g;
      const lastTransactionCount = (ahkScript.match(lastTransactionPattern) || []).length;
      
      if (lastTransactionCount === 1) {
        console.log('✅ Single transaction BNB logic is CORRECT!');
      } else {
        console.log('❌ Single transaction BNB logic has ISSUES!');
      }
      
      // Save script
      const fs = require('fs');
      fs.writeFileSync('test-bnb-single-output.ahk', ahkScript);
      console.log('💾 Script saved to test-bnb-single-output.ahk');
      
    } else {
      console.error('❌ Failed to generate single transaction AHK script');
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
};

// Run tests
const runTests = async () => {
  console.log('🚀 Starting BNB Navigation Logic Tests...\n');
  
  await testBNBMultipleTransactions();
  await testBNBSingleTransaction();
  
  console.log('\n🏁 Tests completed!');
  console.log('📝 Check the generated .ahk files to verify the logic manually');
};

runTests();
