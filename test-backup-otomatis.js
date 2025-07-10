/**
 * Test Script untuk Fitur Backup Otomatis Data ke Google Drive
 * 
 * Script ini akan menguji:
 * 1. Backup otomatis setelah transaksi baru ditambahkan
 * 2. Backup otomatis setelah data nasabah diupdate
 * 3. Backup manual melalui endpoint API
 * 4. Status backup file
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Konfigurasi
const BASE_URL = 'http://localhost:5000';
const API_PREFIX = '/api';

// Helper function untuk delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function untuk log dengan timestamp
function log(message, type = 'INFO') {
  const timestamp = new Date().toISOString();
  const prefix = type === 'ERROR' ? '❌' : type === 'SUCCESS' ? '✅' : type === 'WARNING' ? '⚠️' : 'ℹ️';
  console.log(`${prefix} [${timestamp}] ${message}`);
}

async function testBackupStatus() {
  try {
    log('Testing backup status endpoint...');
    
    const response = await axios.get(`${BASE_URL}${API_PREFIX}/backup-status`);
    
    if (response.status === 200 && response.data.success) {
      log('Backup status check berhasil', 'SUCCESS');
      console.log('Files status:', JSON.stringify(response.data.files, null, 2));
      return true;
    } else {
      log('Backup status check gagal: ' + JSON.stringify(response.data), 'ERROR');
      return false;
    }
  } catch (error) {
    log('Error testing backup status: ' + error.message, 'ERROR');
    return false;
  }
}

async function testManualBackup(fileType = 'both') {
  try {
    log(`Testing manual backup for: ${fileType}...`);
    
    const response = await axios.post(`${BASE_URL}${API_PREFIX}/backup-data`, {
      fileType: fileType
    });
    
    if (response.status === 200 && response.data.success) {
      log(`Manual backup ${fileType} berhasil dimulai`, 'SUCCESS');
      console.log('Response:', response.data.message);
      return true;
    } else {
      log('Manual backup gagal: ' + JSON.stringify(response.data), 'ERROR');
      return false;
    }
  } catch (error) {
    log('Error testing manual backup: ' + error.message, 'ERROR');
    return false;
  }
}

async function testAutoBackupViaTransaction() {
  try {
    log('Testing auto backup via new transaction...');
    
    const testTransaction = {
      id: Date.now(),
      name: 'Test Backup User',
      address: 'Test Address for Backup',
      phone: '081234567890',
      job: 'Tester',
      idNumber: '1234567890123456',
      birthPlace: 'Test City',
      birthDate: '1990-01-01',
      image: '/uploads/test-backup.jpg',
      transferAmount: 100000,
      adminFee: 2500,
      totalAmount: 102500,
      exchangeRate: 14500,
      foreignAmount: 6.90,
      currency: 'SGD',
      bankName: 'Test Bank',
      accountNumber: '123456789',
      recipientName: 'Test Recipient',
      timestamp: new Date().toISOString()
    };
    
    const response = await axios.post(`${BASE_URL}${API_PREFIX}/transactions`, testTransaction);
    
    if (response.status === 201) {
      log('Transaksi test berhasil ditambahkan - backup otomatis harus terpicu', 'SUCCESS');
      console.log('Transaction ID:', response.data.id);
      
      // Tunggu sebentar untuk proses backup
      await delay(2000);
      return true;
    } else {
      log('Gagal menambahkan transaksi test: ' + JSON.stringify(response.data), 'ERROR');
      return false;
    }
  } catch (error) {
    log('Error testing auto backup via transaction: ' + error.message, 'ERROR');
    return false;
  }
}

async function testAutoBackupViaNasabah() {
  try {
    log('Testing auto backup via new nasabah...');
    
    const testNasabah = {
      id: Date.now(),
      name: 'Test Backup Nasabah',
      address: 'Test Address Nasabah',
      phone: '081234567899',
      job: 'Backup Tester',
      idNumber: '9876543210123456',
      birthPlace: 'Backup City',
      birthDate: '1985-05-15',
      images: ['/uploads/test-nasabah-backup.jpg']
    };
    
    const response = await axios.post(`${BASE_URL}${API_PREFIX}/nasabah`, testNasabah);
    
    if (response.status === 201 || response.status === 200) {
      log('Nasabah test berhasil ditambahkan - backup otomatis harus terpicu', 'SUCCESS');
      console.log('Nasabah ID:', response.data.id);
      
      // Tunggu sebentar untuk proses backup
      await delay(2000);
      return true;
    } else {
      log('Gagal menambahkan nasabah test: ' + JSON.stringify(response.data), 'ERROR');
      return false;
    }
  } catch (error) {
    log('Error testing auto backup via nasabah: ' + error.message, 'ERROR');
    return false;
  }
}

async function verifyServerRunning() {
  try {
    log('Checking if backend server is running...');
    const response = await axios.get(`${BASE_URL}/`);
    if (response.status === 200) {
      log('Backend server is running', 'SUCCESS');
      return true;
    }
  } catch (error) {
    log('Backend server tidak berjalan atau tidak dapat diakses', 'ERROR');
    log('Pastikan server backend berjalan di port 5000', 'WARNING');
    return false;
  }
}

async function runBackupTests() {
  console.log('🚀 Starting Backup Auto Tests...\n');
  
  // Test 1: Verify server running
  const serverRunning = await verifyServerRunning();
  if (!serverRunning) {
    log('Test dihentikan karena server tidak berjalan', 'ERROR');
    return;
  }
  
  await delay(1000);
  
  // Test 2: Check backup status
  log('\n📊 Test 1: Backup Status Check');
  await testBackupStatus();
  
  await delay(1000);
  
  // Test 3: Manual backup
  log('\n📤 Test 2: Manual Backup');
  await testManualBackup('transactions');
  await delay(2000);
  await testManualBackup('nasabah');
  await delay(2000);
  await testManualBackup('both');
  
  await delay(2000);
  
  // Test 4: Auto backup via transaction
  log('\n🔄 Test 3: Auto Backup via New Transaction');
  await testAutoBackupViaTransaction();
  
  await delay(2000);
  
  // Test 5: Auto backup via nasabah
  log('\n🔄 Test 4: Auto Backup via New Nasabah');
  await testAutoBackupViaNasabah();
  
  await delay(2000);
  
  // Final status check
  log('\n📊 Final: Backup Status Check');
  await testBackupStatus();
  
  console.log('\n✅ Test backup otomatis selesai!');
  console.log('\n📋 RINGKASAN:');
  console.log('1. Backup otomatis dijalankan setiap kali ada perubahan data');
  console.log('2. File backup akan menimpa file sebelumnya di Google Drive');
  console.log('3. Format nama backup: backup_nasabah.json dan backup_transactions.json');
  console.log('4. Backup berjalan di background, tidak mengganggu operasi utama');
  console.log('5. Gunakan endpoint /api/backup-data untuk backup manual');
  console.log('6. Gunakan endpoint /api/backup-status untuk cek status file');
}

// Jalankan test
if (require.main === module) {
  runBackupTests().catch(console.error);
}

module.exports = {
  runBackupTests,
  testBackupStatus,
  testManualBackup,
  testAutoBackupViaTransaction,
  testAutoBackupViaNasabah
};
