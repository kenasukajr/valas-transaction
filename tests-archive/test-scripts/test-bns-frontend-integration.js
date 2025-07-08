const fs = require('fs');

// Test script untuk integrasi pembayaran BNS dari halaman utama
async function testBNSPaymentIntegration() {
  console.log('=== TEST BNS PAYMENT INTEGRATION FROM FRONTEND ===\n');
  
  const baseUrl = 'http://localhost:3000';
  
  // Test 1: Simulasi data dari halaman utama dengan pembayaran BNS
  console.log('1. Testing BNS payment integration from frontend...');
  const frontendData = {
    name: "PUJI PURNAWAN",
    address: "VILLA BANGUNTAPAN 2 NO E5 SAMPANGAN WIROKERTEN BANGUNTAPAN BANTUL YOGY",
    phone: "085878813372",
    job: "SWASTA",
    idNumber: "3401121406910001",
    birthPlace: "MAGELANG",
    birthDate: "1991-06-14",
    transactionType: "BNS",
    transactions: [
      {
        currency: "USD",
        amount: "1000",
        rate: "15750"
      }
    ],
    // Field pembayaran dari halaman utama
    pembayaranRp: "16000000", // User input 16 juta
    currency: "USD",
    amount: "1000",
    rate: "15750"
  };
  
  try {
    // Test generate AHK dengan data pembayaran
    const response = await fetch(`${baseUrl}/api/generate-ahk`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(frontendData)
    });
    
    if (response.ok) {
      const ahkScript = await response.text();
      
      // Simpan script untuk inspection
      fs.writeFileSync('test-bns-payment-integration.ahk', ahkScript);
      
      console.log('✓ AHK script generated successfully');
      console.log(`✓ File saved: test-bns-payment-integration.ahk`);
      
      // Validasi apakah script mengandung pembayaran dari field halaman utama
      const hasPembayaranField = ahkScript.includes('16000000'); // Pembayaran yang diinput user
      const hasDebugComment = ahkScript.includes('Debug: Jumlah pembayaran dari field halaman utama');
      const hasPaymentVariable = ahkScript.includes('jumlahPembayaran :=');
      
      console.log(`✓ Payment from frontend field (16000000): ${hasPembayaranField ? 'FOUND' : 'NOT FOUND'}`);
      console.log(`✓ Debug comment: ${hasDebugComment ? 'FOUND' : 'NOT FOUND'}`);
      console.log(`✓ Payment variable: ${hasPaymentVariable ? 'FOUND' : 'NOT FOUND'}`);
      
      if (hasPembayaranField && hasDebugComment && hasPaymentVariable) {
        console.log('✅ BNS Payment Integration: SUCCESS');
      } else {
        console.log('❌ BNS Payment Integration: FAILED');
      }
    } else {
      console.log('✗ AHK generation failed:', response.status);
    }
  } catch (error) {
    console.log('✗ Error:', error.message);
  }
  
  console.log('\n' + '='.repeat(50));
  
  // Test 2: Test dengan pembayaran kosong (fallback ke kalkulasi)
  console.log('\n2. Testing fallback to calculation when no payment field...');
  const fallbackData = {
    ...frontendData,
    pembayaranRp: null // Tidak ada pembayaran dari field
  };
  
  try {
    const response = await fetch(`${baseUrl}/api/generate-ahk`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(fallbackData)
    });
    
    if (response.ok) {
      const ahkScript = await response.text();
      
      // Simpan script untuk inspection
      fs.writeFileSync('test-bns-fallback.ahk', ahkScript);
      
      // Validasi fallback ke kalkulasi (1000 * 15750 = 15750000)
      const hasFallbackCalculation = ahkScript.includes('15750000');
      
      console.log('✓ Fallback script generated successfully');
      console.log(`✓ Fallback calculation (15750000): ${hasFallbackCalculation ? 'FOUND' : 'NOT FOUND'}`);
      
      if (hasFallbackCalculation) {
        console.log('✅ Fallback Calculation: SUCCESS');
      } else {
        console.log('❌ Fallback Calculation: FAILED');
      }
    } else {
      console.log('✗ Fallback test failed:', response.status);
    }
  } catch (error) {
    console.log('✗ Error:', error.message);
  }
  
  console.log('\n' + '='.repeat(50));
  
  // Test 3: Test BNS Payment API dengan data pembayaran
  console.log('\n3. Testing BNS Payment API with payment data...');
  const paymentData = {
    customerName: frontendData.name,
    customerPhone: frontendData.phone,
    currency: frontendData.currency,
    amount: parseFloat(frontendData.amount),
    exchangeRate: parseFloat(frontendData.rate),
    paymentAmount: parseFloat(frontendData.pembayaranRp), // Pembayaran dari field
    notes: "Test from frontend integration"
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
      console.log('✓ BNS Payment API: SUCCESS');
      console.log(`  Transaction ID: ${data.transactionId}`);
      console.log(`  Customer: ${data.customerName}`);
      console.log(`  Rupiah Amount: Rp ${data.rupiahAmount.toLocaleString()}`);
      console.log(`  Payment: Rp ${data.paymentAmount.toLocaleString()}`);
      console.log(`  Change: Rp ${data.changeAmount.toLocaleString()}`);
      
      // Validasi perhitungan kembalian
      const expectedRupiah = parseFloat(frontendData.amount) * parseFloat(frontendData.rate);
      const expectedChange = parseFloat(frontendData.pembayaranRp) - expectedRupiah;
      
      console.log(`  Expected Rupiah: Rp ${expectedRupiah.toLocaleString()}`);
      console.log(`  Expected Change: Rp ${expectedChange.toLocaleString()}`);
      
      if (data.changeAmount === expectedChange) {
        console.log('✅ Payment Calculation: CORRECT');
      } else {
        console.log('❌ Payment Calculation: INCORRECT');
      }
    } else {
      console.log('✗ BNS Payment API failed:', response.status);
    }
  } catch (error) {
    console.log('✗ Error:', error.message);
  }
  
  console.log('\n=== TEST COMPLETED ===');
}

// Jalankan test
testBNSPaymentIntegration().catch(console.error);
