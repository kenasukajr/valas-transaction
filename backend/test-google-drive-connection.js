// Script untuk test koneksi Google Drive API
// Jalankan dengan: node test-google-drive-connection.js

const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');

// Path ke file credentials (sesuaikan dengan nama file Anda)
const SERVICE_ACCOUNT_FILE = path.join(__dirname, 'service-account-key.json');
const OAUTH2_CLIENT_FILE = path.join(__dirname, 'client_secret_186428806776-guambluh98u0b12cs9e68l6mb5q8kj6o.apps.googleusercontent.com.json');

// Folder ID Google Drive
const FOLDER_ID = '1-48h9wFhHps5lyhuAxr0tAup5KhyU_rG';

async function testServiceAccount() {
  console.log('=== Testing Service Account ===');
  
  try {
    // Cek apakah file Service Account ada
    if (!fs.existsSync(SERVICE_ACCOUNT_FILE)) {
      console.log('❌ File Service Account tidak ditemukan:', SERVICE_ACCOUNT_FILE);
      return false;
    }
    
    // Baca dan parse file credentials
    const credentialsContent = fs.readFileSync(SERVICE_ACCOUNT_FILE, 'utf8');
    const credentials = JSON.parse(credentialsContent);
    
    // Validasi format Service Account
    if (credentials.type !== 'service_account') {
      console.log('❌ File bukan Service Account. Type:', credentials.type);
      return false;
    }
    
    if (!credentials.private_key || !credentials.client_email) {
      console.log('❌ File Service Account tidak lengkap. Missing private_key atau client_email');
      return false;
    }
    
    console.log('✅ File Service Account format valid');
    console.log('📧 Service Account Email:', credentials.client_email);
    console.log('🔑 Project ID:', credentials.project_id);
    
    // Test koneksi ke Google Drive API
    const auth = new google.auth.GoogleAuth({
      keyFile: SERVICE_ACCOUNT_FILE,
      scopes: ['https://www.googleapis.com/auth/drive.file']
    });
    
    const authClient = await auth.getClient();
    const drive = google.drive({ version: 'v3', auth: authClient });
    
    // Test list files di folder
    const response = await drive.files.list({
      q: `'${FOLDER_ID}' in parents`,
      fields: 'files(id, name)'
    });
    
    console.log('✅ Koneksi ke Google Drive API berhasil');
    console.log('📁 Files dalam folder:', response.data.files.length);
    
    return true;
    
  } catch (error) {
    console.log('❌ Error Service Account:', error.message);
    return false;
  }
}

async function testOAuth2Client() {
  console.log('\n=== Testing OAuth2 Client ===');
  
  try {
    // Cek apakah file OAuth2 Client ada
    if (!fs.existsSync(OAUTH2_CLIENT_FILE)) {
      console.log('❌ File OAuth2 Client tidak ditemukan:', OAUTH2_CLIENT_FILE);
      return false;
    }
    
    // Baca dan parse file credentials
    const credentialsContent = fs.readFileSync(OAUTH2_CLIENT_FILE, 'utf8');
    const credentials = JSON.parse(credentialsContent);
    
    // Validasi format OAuth2 Client
    if (credentials.installed || credentials.web) {
      console.log('✅ File OAuth2 Client format valid');
      console.log('🔑 Client ID:', credentials.installed?.client_id || credentials.web?.client_id);
      console.log('⚠️  OAuth2 Client memerlukan setup tambahan (token, consent screen)');
      return true;
    } else {
      console.log('❌ File OAuth2 Client format tidak valid');
      return false;
    }
    
  } catch (error) {
    console.log('❌ Error OAuth2 Client:', error.message);
    return false;
  }
}

async function testAppsScriptURL() {
  console.log('\n=== Testing Apps Script URL ===');
  
  try {
    // Import fetch dinamis
    const fetch = (await import('node-fetch')).default;
    
    const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby-mvvODPL7BdAN1AMh_0xTwyBCcc7tm0srelEeNw2K7-3Fmgsl2toDmVIORBh3keLi/exec';
    
    console.log('🔗 Testing URL:', APPS_SCRIPT_URL);
    
    const response = await fetch(APPS_SCRIPT_URL, {
      method: 'GET',
      headers: {
        'User-Agent': 'Node.js Test'
      }
    });
    
    const result = await response.text();
    console.log('📡 Response status:', response.status);
    console.log('📄 Response:', result.substring(0, 200) + '...');
    
    if (response.status === 200 && !result.includes('<!DOCTYPE html>') && !result.includes('<!doctype html>')) {
      console.log('✅ Apps Script URL working');
      return true;
    } else {
      console.log('❌ Apps Script URL error atau belum deploy dengan benar');
      console.log('📄 Response preview:', result.substring(0, 100) + '...');
      return false;
    }
    
  } catch (error) {
    console.log('❌ Error testing Apps Script URL:', error.message);
    return false;
  }
}

// Jalankan test Service Account
async function runAllTests() {
  console.log('🧪 Testing Google Drive Upload Configuration - Service Account Only\n');
  
  const serviceAccountResult = await testServiceAccount();
  
  console.log('\n=== HASIL TEST ===');
  console.log('Service Account:', serviceAccountResult ? '✅ READY' : '❌ NOT READY');
  
  console.log('\n=== REKOMENDASI ===');
  if (serviceAccountResult) {
    console.log('🎉 Service Account sudah siap! Upload ke Google Drive akan bekerja.');
    console.log('📂 Upload akan berjalan otomatis saat transaksi.');
    console.log('📁 File akan diupload ke folder Google Drive yang sudah dikonfigurasi.');
  } else {
    console.log('❌ Service Account belum siap. Ikuti langkah-langkah berikut:');
    console.log('1. Buat Service Account di Google Cloud Console');
    console.log('2. Download JSON key → rename menjadi service-account-key.json');
    console.log('3. Share folder Google Drive ke email Service Account');
    console.log('4. Enable Google Drive API');
    console.log('📖 Panduan lengkap ada di file SERVICE-ACCOUNT-SETUP.md');
  }
}

// Jalankan test
runAllTests().catch(console.error);
