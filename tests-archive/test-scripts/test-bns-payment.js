const fs = require('fs');

// Test script untuk BNS Payment API
async function testBNSPaymentAPI() {
  console.log('=== TEST BNS PAYMENT API ===\n');
  
  const baseUrl = 'http://localhost:3000';
  
  // Test 1: Kalkulasi pembayaran
  console.log('1. Testing payment calculation...');
  try {
    const response = await fetch(`${baseUrl}/api/bns-payment?amount=1000&rate=15750`);
    if (response.ok) {
      const data = await response.json();
      console.log('✓ Payment calculation successful');
      console.log(`  Amount: 1000`);
      console.log(`  Rate: 15750`);
      console.log(`  Payment Amount: ${data.paymentAmount}`);
      console.log(`  Formatted: ${data.formattedAmount}`);
    } else {
      console.log('✗ Payment calculation failed:', response.status);
    }
  } catch (error) {
    console.log('✗ Error:', error.message);
  }
  
  console.log('\n' + '='.repeat(50));
  
  // Test 2: Simpan data pembayaran
  console.log('\n2. Testing save payment data...');
  const paymentData = {
    customerName: "PUJI PURNAWAN",
    customerPhone: "085878813372",
    currency: "USD",
    amount: 1000,
    exchangeRate: 15750,
    notes: "Test BNS transaction"
  };
  
  try {
    const response = await fetch(`${baseUrl}/api/bns-payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData)
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✓ Payment data saved successfully');
      console.log(`  Transaction ID: ${data.transactionId}`);
      console.log(`  Customer: ${data.customerName}`);
      console.log(`  Currency: ${data.currency}`);
      console.log(`  Amount: ${data.amount}`);
      console.log(`  Rate: ${data.exchangeRate}`);
      console.log(`  Payment Amount: ${data.paymentAmount}`);
      console.log(`  Status: ${data.paymentStatus}`);
      
      // Simpan transaction ID untuk test selanjutnya
      const testData = { lastTransactionId: data.transactionId };
      fs.writeFileSync('bns-test-data.json', JSON.stringify(testData, null, 2));
    } else {
      console.log('✗ Save payment data failed:', response.status);
      const errorData = await response.json();
      console.log('  Error:', errorData.error);
    }
  } catch (error) {
    console.log('✗ Error:', error.message);
  }
  
  console.log('\n' + '='.repeat(50));
  
  // Test 3: Ambil data pembayaran
  console.log('\n3. Testing fetch payment data...');
  try {
    const response = await fetch(`${baseUrl}/api/bns-payment?customerName=PUJI`);
    if (response.ok) {
      const data = await response.json();
      console.log('✓ Payment data fetched successfully');
      console.log(`  Total records: ${data.length}`);
      data.forEach((payment, index) => {
        console.log(`  Record ${index + 1}:`);
        console.log(`    ID: ${payment.transactionId}`);
        console.log(`    Customer: ${payment.customerName}`);
        console.log(`    Currency: ${payment.currency}`);
        console.log(`    Amount: ${payment.paymentAmount}`);
        console.log(`    Status: ${payment.paymentStatus}`);
      });
    } else {
      console.log('✗ Fetch payment data failed:', response.status);
    }
  } catch (error) {
    console.log('✗ Error:', error.message);
  }
  
  console.log('\n' + '='.repeat(50));
  
  // Test 4: Update status pembayaran
  console.log('\n4. Testing update payment status...');
  try {
    // Baca transaction ID dari test sebelumnya
    const testData = JSON.parse(fs.readFileSync('bns-test-data.json', 'utf-8'));
    const transactionId = testData.lastTransactionId;
    
    const response = await fetch(`${baseUrl}/api/bns-payment?transactionId=${transactionId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        paymentStatus: 'completed',
        notes: 'Payment completed via test'
      })
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✓ Payment status updated successfully');
      console.log(`  Transaction ID: ${data.transactionId}`);
      console.log(`  New Status: ${data.paymentStatus}`);
      console.log(`  Notes: ${data.notes}`);
    } else {
      console.log('✗ Update payment status failed:', response.status);
    }
  } catch (error) {
    console.log('✗ Error:', error.message);
  }
  
  console.log('\n' + '='.repeat(50));
  
  // Test 5: Test dengan berbagai currency
  console.log('\n5. Testing multiple currencies...');
  const currencies = [
    { code: 'USD', amount: 1000, rate: 15750 },
    { code: 'EUR', amount: 500, rate: 17200 },
    { code: 'GBP', amount: 300, rate: 19500 },
    { code: 'SGD', amount: 800, rate: 11300 }
  ];
  
  for (const curr of currencies) {
    try {
      const response = await fetch(`${baseUrl}/api/bns-payment?amount=${curr.amount}&rate=${curr.rate}`);
      if (response.ok) {
        const data = await response.json();
        console.log(`✓ ${curr.code}: ${curr.amount} × ${curr.rate} = ${data.paymentAmount}`);
      } else {
        console.log(`✗ ${curr.code}: Failed`);
      }
    } catch (error) {
      console.log(`✗ ${curr.code}: Error - ${error.message}`);
    }
  }
  
  console.log('\n=== TEST COMPLETED ===');
}

// Test integration dengan AHK Generator
async function testAHKIntegration() {
  console.log('\n=== TEST AHK INTEGRATION ===\n');
  
  const baseUrl = 'http://localhost:3000';
  
  // Data untuk test BNS dengan pembayaran
  const testData = {
    name: "PUJI PURNAWAN",
    address: "VILLA BANGUNTAPAN 2 NO E5 SAMPANGAN WIROKERTEN BANGUNTAPAN BANTUL YOGY",
    phone: "085878813372",
    job: "SWASTA",
    idNumber: "3401121406910001",
    birthPlace: "MAGELANG",
    birthDate: "1991-06-14",
    transactionType: "BNS",
    currency: "USD",
    amount: 1000,
    rate: 15750
  };
  
  try {
    const response = await fetch(`${baseUrl}/api/generate-ahk`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });
    
    if (response.ok) {
      const ahkScript = await response.text();
      
      // Simpan script untuk inspection
      fs.writeFileSync('test-bns-payment.ahk', ahkScript);
      
      console.log('✓ AHK script generated successfully');
      console.log(`✓ File saved: test-bns-payment.ahk`);
      
      // Validasi apakah script mengandung kalkulasi pembayaran
      const expectedPayment = (testData.amount * testData.rate).toString();
      const hasPaymentCalculation = ahkScript.includes(expectedPayment);
      
      console.log(`✓ Payment calculation (${expectedPayment}): ${hasPaymentCalculation ? 'FOUND' : 'NOT FOUND'}`);
      
      // Validasi struktur BNS
      const hasBNSStructure = ahkScript.includes('SELESAI TRANSAKSI BNS');
      const hasPaymentInput = ahkScript.includes('jumlahPembayaran');
      
      console.log(`✓ BNS structure: ${hasBNSStructure ? 'FOUND' : 'NOT FOUND'}`);
      console.log(`✓ Payment input: ${hasPaymentInput ? 'FOUND' : 'NOT FOUND'}`);
      
      if (hasBNSStructure && hasPaymentInput && hasPaymentCalculation) {
        console.log('✅ BNS Payment integration: SUCCESS');
      } else {
        console.log('❌ BNS Payment integration: FAILED');
      }
    } else {
      console.log('✗ AHK generation failed:', response.status);
    }
  } catch (error) {
    console.log('✗ Error:', error.message);
  }
}

// Jalankan semua test
async function runAllTests() {
  await testBNSPaymentAPI();
  await testAHKIntegration();
  
  console.log('\n🎉 ALL TESTS COMPLETED!');
  console.log('\nFiles generated:');
  console.log('- bns-test-data.json (test data)');
  console.log('- test-bns-payment.ahk (generated AHK script)');
}

// Jalankan test
runAllTests().catch(console.error);
