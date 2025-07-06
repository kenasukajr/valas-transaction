// Test API performance untuk debug timeout issue
const testApiPerformance = async () => {
  const BACKEND_URL = 'http://192.168.1.6:5000';
  
  console.log('🚀 Starting API performance test...');
  
  try {
    // Test 1: Nasabah API
    console.log('📡 Testing Nasabah API...');
    const start1 = Date.now();
    const response1 = await fetch(`${BACKEND_URL}/api/nasabah`);
    const end1 = Date.now();
    console.log(`✅ Nasabah API: ${response1.status} - ${end1 - start1}ms`);
    
    const nasabahData = await response1.json();
    console.log(`📊 Nasabah count: ${nasabahData.length}`);
    
    // Test 2: Transactions API
    console.log('📡 Testing Transactions API...');
    const start2 = Date.now();
    const response2 = await fetch(`${BACKEND_URL}/api/transactions`);
    const end2 = Date.now();
    console.log(`✅ Transactions API: ${response2.status} - ${end2 - start2}ms`);
    
    const transactionData = await response2.json();
    console.log(`📊 Transactions count: ${transactionData.length}`);
    
    // Test 3: Sequential calls (seperti di komponen)
    console.log('📡 Testing Sequential calls...');
    const startSeq = Date.now();
    
    const seqResponse1 = await fetch(`${BACKEND_URL}/api/nasabah`);
    const seqData1 = await seqResponse1.json();
    const seqResponse2 = await fetch(`${BACKEND_URL}/api/transactions`);
    const seqData2 = await seqResponse2.json();
    
    const endSeq = Date.now();
    console.log(`✅ Sequential calls: ${endSeq - startSeq}ms total`);
    
    console.log('🎉 API performance test completed successfully');
    
  } catch (error) {
    console.error('❌ API performance test failed:', error);
  }
};

// Run test
testApiPerformance();
