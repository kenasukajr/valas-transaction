const fs = require('fs');
const path = require('path');
const http = require('http');

async function testUpload() {
  try {
    console.log('🧪 Testing auto upload to Google Drive...');
    
    const filePath = path.join(__dirname, 'uploads', 'OMAR_HAMZY.png');
    console.log('📤 Testing with existing file:', filePath);
    
    // Simulasi upload dengan method yang lebih sederhana
    // Kita akan langsung test fungsi uploadFileToDriveBackground
    const { uploadFileToDriveBackground } = require('./googleDriveUploader.js');
    
    console.log('🚀 Starting background upload test...');
    uploadFileToDriveBackground(filePath, null, 'TEST_AUTO_UPLOAD_INTEGRATION.png');
    
    console.log('✅ Background upload initiated!');
    console.log('⏳ Check console output above for Google Drive upload status...');
    
    // Wait a bit for async upload to complete
    setTimeout(() => {
      console.log('🎉 Test completed! If you see "✅ BACKGROUND UPLOAD" message above, auto upload is working!');
    }, 5000);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testUpload();
