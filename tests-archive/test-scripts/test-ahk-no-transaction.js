// Test script untuk generate AHK via API (tanpa data transaksi)
const testDataWithoutTransaction = {
  name: "Jane Doe",
  address: "Jalan Test No. 456",
  phone: "081987654321",
  job: "Designer", 
  idNumber: "6543210987654321",
  birthPlace: "Bandung",
  birthDate: "1985-03-25",
  transactionType: "BNB"
};

async function testAhkGenerationWithoutTransaction() {
  try {
    console.log('Testing AHK API without transaction data:', testDataWithoutTransaction);
    
    const response = await fetch('http://localhost:8000/api/generate-ahk', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testDataWithoutTransaction)
    });
    
    if (response.ok) {
      const text = await response.text();
      console.log('Generated AHK Script (without transaction):');
      console.log('=' .repeat(50));
      console.log(text);
      console.log('=' .repeat(50));
      
      // Check if transaction section is included
      if (text.includes('transactionData')) {
        console.log('❌ ERROR: Transaction data should not be included when no transaction data provided');
      } else {
        console.log('✅ SUCCESS: No transaction data included (as expected)');
      }
      
    } else {
      console.error('API Error:', response.status, response.statusText);
    }
  } catch (error) {
    console.error('Fetch error:', error);
  }
}

testAhkGenerationWithoutTransaction();
