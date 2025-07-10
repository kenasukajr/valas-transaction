const fs = require('fs');

// Test sederhana untuk debug currency mapping
async function debugCurrencyMapping() {
  console.log('=== DEBUG CURRENCY MAPPING ===\n');
  
  const baseUrl = 'http://localhost:3000'; // Ganti dengan port yang benar
  
  // Test dengan data sederhana
  const testData = {
    name: "TEST USER",
    address: "Test Address",
    phone: "123456789",
    job: "Test Job",
    idNumber: "123456789",
    birthPlace: "Test Place",
    birthDate: "1990-01-01",
    currency: "AUD",
    amount: 100,
    rate: 10500
  };

  console.log('Mengirim data test:', testData);

  try {
    const response = await fetch(`${baseUrl}/api/generate-ahk`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testData)
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    if (response.ok) {
      const buffer = await response.arrayBuffer();
      const ahkContent = Buffer.from(buffer).toString('utf-8');
      
      // Simpan untuk inspeksi
      fs.writeFileSync('debug-currency-mapping.ahk', ahkContent);
      
      console.log('✅ Script berhasil digenerate');
      console.log(`📁 File: debug-currency-mapping.ahk`);
      console.log(`📏 Size: ${ahkContent.length} bytes`);
      
      // Cari debug comment untuk currency mapping
      const lines = ahkContent.split('\n');
      const debugLine = lines.find(line => line.includes('Debug: Currency input'));
      const mappingLine = lines.find(line => line.includes('Isi Code Currency'));
      
      if (debugLine) {
        console.log('🔍 Debug info found:', debugLine.trim());
      }
      if (mappingLine) {
        console.log('🎯 Mapping info:', mappingLine.trim());
      }
      
      // Cari baris Send currency code
      const sendLine = lines.find(line => line.match(/^Send, \d+$/));
      if (sendLine) {
        console.log('📤 Send command:', sendLine.trim());
      }
      
    } else {
      const errorText = await response.text();
      console.log('❌ Error response:', errorText);
    }
    
  } catch (error) {
    console.error('❌ Request error:', error.message);
    console.log('\n🔍 Possible issues:');
    console.log('1. Server port might be different (check if it\'s 3000, 8000, or other)');
    console.log('2. Server might not be running');
    console.log('3. API endpoint might have changed');
  }
}

// Test dengan berbagai port
async function testMultiplePorts() {
  const ports = [3000, 8000, 3001, 8001];
  
  for (const port of ports) {
    console.log(`\n🔌 Testing port ${port}...`);
    try {
      const response = await fetch(`http://localhost:${port}/api/generate-ahk`, {
        method: 'GET'
      });
      console.log(`✅ Port ${port} responds with status: ${response.status}`);
      if (response.status !== 404) {
        console.log(`🎯 Using port ${port} for tests`);
        return port;
      }
    } catch (error) {
      console.log(`❌ Port ${port} not available`);
    }
  }
  return null;
}

async function runDebug() {
  const availablePort = await testMultiplePorts();
  if (availablePort) {
    console.log(`\n🚀 Running debug with port ${availablePort}`);
    // Update baseUrl and run debug
    await debugCurrencyMapping();
  } else {
    console.log('\n❌ No available port found. Please check if server is running.');
  }
}

runDebug().catch(console.error);
