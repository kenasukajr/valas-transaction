/**
 * Test Script untuk Verifikasi Format Tempat Lahir + Tanggal Lahir
 * 
 * Script ini akan menguji apakah tempat lahir dan tanggal lahir dipisah dengan spasi
 */

const axios = require('axios');

// Konfigurasi
const BASE_URL = 'http://localhost:3000';

// Helper function untuk log dengan timestamp
function log(message, type = 'INFO') {
  const timestamp = new Date().toISOString();
  const prefix = type === 'ERROR' ? '❌' : type === 'SUCCESS' ? '✅' : type === 'WARNING' ? '⚠️' : 'ℹ️';
  console.log(`${prefix} [${timestamp}] ${message}`);
}

async function testBirthPlaceDateFormat() {
  try {
    log('Testing format Tempat Lahir + Tanggal Lahir...');
    
    const testData = {
      name: 'TEST USER',
      address: 'Test Address',
      phone: '081234567890',
      job: 'Tester', 
      idNumber: '1234567890123456',
      birthPlace: 'JAKARTA',
      birthDate: '1990-01-15', // 15 Januari 1990
      transactionType: 'BNB',
      currency: 'USD',
      amount: 1000,
      rate: 15750
    };
    
    const response = await axios.post(`${BASE_URL}/api/generate-ahk`, testData);
    
    if (response.status === 200 && response.data.success) {
      log('Generate AHK script berhasil', 'SUCCESS');
      
      const script = response.data.script;
      
      // Cari baris yang berisi "Tempat Tanggal Lahir"
      const lines = script.split('\n');
      const birthLine = lines.find(line => line.includes('Tempat Tanggal Lahir'));
      
      if (birthLine) {
        log('Baris Tempat Tanggal Lahir ditemukan:');
        console.log('   ' + birthLine);
        
        // Ekstrak nilai dari dalam tanda kutip
        const match = birthLine.match(/":= "(.+)"/);
        if (match) {
          const value = match[1];
          log(`Nilai: "${value}"`);
          
          // Analisis format
          if (value.includes('JAKARTA 15/01/1990')) {
            log('✅ FORMAT BENAR: Ada spasi pemisah antara tempat dan tanggal lahir', 'SUCCESS');
          } else if (value.includes('JAKARTA15/01/1990')) {
            log('❌ FORMAT SALAH: Tidak ada spasi pemisah antara tempat dan tanggal lahir', 'ERROR');
          } else {
            log(`⚠️ FORMAT TIDAK DIKENAL: ${value}`, 'WARNING');
          }
          
          // Test dengan berbagai format birthDate
          await testDifferentDateFormats();
          
        } else {
          log('❌ Tidak dapat mengekstrak nilai dari baris', 'ERROR');
        }
      } else {
        log('❌ Baris "Tempat Tanggal Lahir" tidak ditemukan', 'ERROR');
      }
      
    } else {
      log('Generate AHK script gagal: ' + JSON.stringify(response.data), 'ERROR');
    }
    
  } catch (error) {
    log('Error testing birth place date format: ' + error.message, 'ERROR');
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
}

async function testDifferentDateFormats() {
  log('\n📅 Testing berbagai format tanggal lahir...');
  
  const testCases = [
    { 
      birthPlace: 'BANDUNG', 
      birthDate: '1985-12-25',
      expected: 'BANDUNG 25/12/1985'
    },
    { 
      birthPlace: 'SURABAYA', 
      birthDate: '1992-03-05',
      expected: 'SURABAYA 05/03/1992'
    },
    { 
      birthPlace: 'YOGYAKARTA', 
      birthDate: '1988-07-10',
      expected: 'YOGYAKARTA 10/07/1988'
    }
  ];
  
  for (const testCase of testCases) {
    try {
      const testData = {
        name: 'TEST USER',
        address: 'Test Address',
        phone: '081234567890',
        job: 'Tester',
        idNumber: '1234567890123456',
        birthPlace: testCase.birthPlace,
        birthDate: testCase.birthDate,
        transactionType: 'BNB'
      };
      
      const response = await axios.post(`${BASE_URL}/api/generate-ahk`, testData);
      
      if (response.status === 200 && response.data.success) {
        const script = response.data.script;
        const lines = script.split('\n');
        const birthLine = lines.find(line => line.includes('Tempat Tanggal Lahir'));
        
        if (birthLine) {
          const match = birthLine.match(/":= "(.+)"/);
          if (match) {
            const value = match[1];
            
            if (value === testCase.expected) {
              log(`✅ ${testCase.birthPlace}: Format benar - "${value}"`, 'SUCCESS');
            } else {
              log(`❌ ${testCase.birthPlace}: Format salah`, 'ERROR');
              log(`   Expected: "${testCase.expected}"`);
              log(`   Actual:   "${value}"`);
            }
          }
        }
      }
      
    } catch (error) {
      log(`❌ Error testing ${testCase.birthPlace}: ${error.message}`, 'ERROR');
    }
  }
}

async function verifyServerRunning() {
  try {
    log('Checking if frontend server is running...');
    const response = await axios.get(`${BASE_URL}/`);
    if (response.status === 200) {
      log('Frontend server is running', 'SUCCESS');
      return true;
    }
  } catch (error) {
    log('Frontend server tidak berjalan atau tidak dapat diakses', 'ERROR');
    log('Pastikan server frontend berjalan di port 3000', 'WARNING');
    return false;
  }
}

async function runBirthPlaceDateTests() {
  console.log('🚀 Starting Birth Place + Date Format Tests...\n');
  
  // Test 1: Verify server running
  const serverRunning = await verifyServerRunning();
  if (!serverRunning) {
    log('Test dihentikan karena server tidak berjalan', 'ERROR');
    return;
  }
  
  // Test 2: Format tempat lahir + tanggal lahir
  await testBirthPlaceDateFormat();
  
  console.log('\n✅ Test format tempat lahir + tanggal lahir selesai!');
  console.log('\n📋 ANALISIS:');
  console.log('1. Cek apakah ada spasi pemisah antara tempat lahir dan tanggal lahir');
  console.log('2. Format yang benar: "JAKARTA 15/01/1990" (ada spasi)');
  console.log('3. Format yang salah: "JAKARTA15/01/1990" (tanpa spasi)');
}

// Jalankan test
if (require.main === module) {
  runBirthPlaceDateTests().catch(console.error);
}

module.exports = {
  runBirthPlaceDateTests,
  testBirthPlaceDateFormat
};
