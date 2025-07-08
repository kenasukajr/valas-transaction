// Test manual untuk fetch API
console.log('🧪 Testing manual fetch...');

// Test 1: Direct fetch to localhost:5000
console.log('1️⃣ Testing localhost:5000 API...');
fetch('http://localhost:5000/api/nasabah')
  .then(response => {
    console.log('✅ Direct fetch response status:', response.status);
    return response.json();
  })
  .then(data => {
    console.log('✅ Direct fetch data:', data.length, 'records');
    console.log('First nasabah:', data[0]);
    
    // Test 2: Fetch transactions
    console.log('2️⃣ Testing transactions API...');
    return fetch('http://localhost:5000/api/transactions');
  })
  .then(response => {
    console.log('✅ Transactions response status:', response.status);
    return response.json();
  })
  .then(data => {
    console.log('✅ Transactions data:', data.length, 'records');
    
    // Filter for valas transactions
    const valasTransactions = data.filter(t => t.currency && t.amount && t.rate);
    console.log('💱 Valas transactions:', valasTransactions.length, 'records');
    
    console.log('Sample valas transactions:', valasTransactions.slice(0, 3).map(t => ({
      id: t.id,
      currency: t.currency,
      amount: t.amount,
      rate: t.rate,
      rupiahEquivalent: t.rupiahEquivalent
    })));
  })
  .catch(error => {
    console.error('❌ Fetch error:', error);
  });
