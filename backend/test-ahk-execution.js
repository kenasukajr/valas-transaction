// Test script untuk eksekusi AHK langsung
const http = require('http');

async function testAhkExecution() {
  try {
    console.log('🧪 Testing AHK execution endpoint...');
    
    const testScript = `
; Test AHK Script
MsgBox, 0, Test AHK, Script AHK berhasil dijalankan dari aplikasi web!, 3
ExitApp
    `.trim();
    
    const postData = JSON.stringify({
      script: testScript
    });
    
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/execute-ahk',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };
    
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
    
    if (result.success) {
      console.log('✅ SUCCESS: AHK execution endpoint working!');
      console.log('📋 Details:', result);
      console.log('🎯 PID:', result.pid);
      console.log('📁 Temp file:', result.tempFile);
    } else {
      console.log('❌ FAILED: AHK execution failed');
      console.log('📋 Error:', result);
    }
    
  } catch (error) {
    console.error('❌ TEST ERROR:', error.message);
  }
}

testAhkExecution();
