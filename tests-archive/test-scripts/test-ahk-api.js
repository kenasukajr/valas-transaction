// Test script untuk generate AHK via API
const testData = {
  name: "John Doe",
  address: "Jalan Test No. 123",
  phone: "081234567890",
  job: "Programmer", 
  idNumber: "1234567890123456",
  birthPlace: "Jakarta",
  birthDate: "1990-01-15",
  transactionType: "BNB",
  // Data transaksi
  currency: "USD",
  amount: 100,
  rate: 16100,
  rupiahEquivalent: 1610000
};

async function testAhkGeneration() {
  try {
    console.log('Testing AHK API with data:', testData);
    
    const response = await fetch('http://localhost:8000/api/generate-ahk', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });
    
    if (response.ok) {
      const text = await response.text();
      console.log('Generated AHK Script:');
      console.log('=' .repeat(50));
      console.log(text);
      console.log('=' .repeat(50));
      
      // Check for line 3 specifically
      const lines = text.split('\n');
      console.log('\nLine-by-line check:');
      lines.forEach((line, index) => {
        console.log(`Line ${index + 1}: "${line}"`);
      });
      
    } else {
      console.error('API Error:', response.status, response.statusText);
    }
  } catch (error) {
    console.error('Fetch error:', error);
  }
}

testAhkGeneration();
