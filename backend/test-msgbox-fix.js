const fs = require('fs');
const { spawn } = require('child_process');

console.log('🔧 Testing MsgBox syntax fix...\n');

// Test data dengan data transaksi tidak lengkap
const testData = {
  customerData: {
    fullName: 'Test Customer',
    address: 'Test Address',
    phoneNumber: '08123456789',
    jobTitle: 'Engineer'
  },
  transactionData: {
    transactionType: 'BNS',
    currency: 'USD',
    // Sengaja tidak lengkap untuk trigger MsgBox
    amount: null,
    rate: null,
    payment: null
  }
};

// Generate AHK script via API call
const testApiCall = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/execute-ahk', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    const result = await response.json();
    
    if (result.success) {
      console.log('✅ API Response SUCCESS');
      console.log('📋 PID:', result.pid);
      console.log('📁 Script file:', result.scriptPath);
      
      // Cek isi script untuk validasi MsgBox syntax
      if (fs.existsSync(result.scriptPath)) {
        const scriptContent = fs.readFileSync(result.scriptPath, 'utf8');
        
        console.log('\n🔍 Checking MsgBox syntax in generated script...');
        
        const msgBoxLines = scriptContent.split('\n').filter(line => line.includes('MsgBox'));
        
        if (msgBoxLines.length > 0) {
          console.log(`📝 Found ${msgBoxLines.length} MsgBox lines:`);
          msgBoxLines.forEach((line, index) => {
            console.log(`   ${index + 1}. ${line.trim()}`);
            
            // Validasi syntax: harus ada 4 parameter (Type, Title, Text, Timeout)
            const msgBoxMatch = line.match(/MsgBox,\s*([^,]+),\s*([^,]+),\s*([^,]+),\s*([^,\s]+)/);
            if (msgBoxMatch) {
              console.log(`      ✅ Valid syntax: Type=${msgBoxMatch[1].trim()}, Title=${msgBoxMatch[2].trim()}, Timeout=${msgBoxMatch[4].trim()}`);
            } else {
              console.log(`      ❌ Invalid syntax - missing parameters!`);
            }
          });
        } else {
          console.log('ℹ️ No MsgBox lines found in script');
        }
        
        console.log('\n🚀 Attempting to execute script to test syntax...');
        
        // Test eksekusi script (akan exit cepat karena window tidak ditemukan)
        const ahkProcess = spawn('autohotkey.exe', [result.scriptPath], {
          stdio: 'pipe'
        });
        
        let output = '';
        let errorOutput = '';
        
        ahkProcess.stdout.on('data', (data) => {
          output += data.toString();
        });
        
        ahkProcess.stderr.on('data', (data) => {
          errorOutput += data.toString();
        });
        
        ahkProcess.on('close', (code) => {
          if (code === 0) {
            console.log('✅ Script executed without syntax errors!');
          } else {
            console.log(`❌ Script execution failed with code: ${code}`);
            if (errorOutput) {
              console.log('Error output:', errorOutput);
            }
          }
          
          console.log('\n🧹 Cleaning up temp file...');
          if (fs.existsSync(result.scriptPath)) {
            fs.unlinkSync(result.scriptPath);
            console.log('✅ Temp file deleted');
          }
        });
        
        setTimeout(() => {
          ahkProcess.kill();
          console.log('⏰ Process killed after timeout');
        }, 3000);
        
      } else {
        console.log('❌ Script file not found:', result.scriptPath);
      }
      
    } else {
      console.log('❌ API Response FAILED:', result.error);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
};

// Start server dan test
console.log('🚀 Starting test server...');
const serverProcess = spawn('node', ['server.js'], {
  cwd: __dirname,
  stdio: 'pipe'
});

setTimeout(() => {
  console.log('📡 Server should be ready, testing API...\n');
  testApiCall().then(() => {
    setTimeout(() => {
      serverProcess.kill();
      console.log('\n🔚 Test completed, server stopped.');
    }, 5000);
  });
}, 2000);
