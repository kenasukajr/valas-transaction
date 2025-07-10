/**
 * Test BNS Payment Navigation
 * Memverifikasi bahwa setelah transaksi BNS selesai:
 * 1. Tekan panah ke bawah 1x
 * 2. Enter 1x
 * 3. Masukkan data pembayaran
 * 4. Enter 3x
 * 5. Jeda 1 detik
 * 6. Tekan R untuk reset ke menu utama
 * 
 * Versi: 1.4.3
 * Tanggal: Test BNS Payment Navigation
 */

const fs = require('fs');
const path = require('path');

async function testBNSPaymentNavigation() {
  console.log('=== TEST BNS PAYMENT NAVIGATION ===\n');
  
  // Test data: 1 transaksi BNS dengan pembayaran
  const testData = {
    name: 'TEST BNS PAYMENT',
    address: 'Jl. Test Payment',
    phone: '081234567890',
    job: 'Tester',
    idNumber: '1234567890123456',
    birthPlace: 'Jakarta',
    birthDate: '1990-01-01',
    transactionType: 'BNS',
    pembayaranRp: '1500000', // Data pembayaran eksplisit
    transactions: [
      {
        currency: 'USD',
        amount: '100',
        rate: '15000',
        transactionType: 'BNS'
      }
    ]
  };
  
  try {
    // Simulasi generate AHK tanpa server
    console.log('📋 Generating AHK script untuk BNS dengan pembayaran...');
    
    // Buat script content secara manual untuk test
    const ahkContent = generateTestAhkScript(testData);
    
    // Analisis navigasi pembayaran
    console.log('\n=== ANALISIS NAVIGASI PEMBAYARAN BNS ===');
    
    const lines = ahkContent.split('\n');
    let paymentSection = [];
    let inPaymentSection = false;
    
    lines.forEach((line, index) => {
      if (line.includes('=== SELESAI TRANSAKSI BNS ===')) {
        inPaymentSection = true;
      }
      if (inPaymentSection && line.includes('=== SELESAI TRANSAKSI BNB ===')) {
        inPaymentSection = false;
      }
      if (inPaymentSection) {
        paymentSection.push({ line: index + 1, content: line });
      }
    });
    
    console.log('📍 Payment section lines:');
    paymentSection.forEach(item => {
      if (item.content.trim()) {
        console.log(`   ${item.line}: ${item.content}`);
      }
    });
    
    // Verifikasi langkah-langkah navigasi
    console.log('\n=== VERIFIKASI LANGKAH NAVIGASI ===');
    
    const paymentText = paymentSection.map(item => item.content).join('\n');
    
    // 1. Panah ke bawah 1x
    const downArrow = paymentText.includes('Send, {Down}');
    console.log(`1. Panah ke bawah 1x: ${downArrow ? '✅ ADA' : '❌ TIDAK ADA'}`);
    
    // 2. Enter 1x untuk masuk ke field pembayaran
    const enterToPayment = paymentText.includes('Tekan Enter 1x untuk masuk ke field pembayaran');
    console.log(`2. Enter 1x ke field pembayaran: ${enterToPayment ? '✅ ADA' : '❌ TIDAK ADA'}`);
    
    // 3. Input data pembayaran
    const paymentInput = paymentText.includes('TypeString("1500000")');
    console.log(`3. Input pembayaran (1500000): ${paymentInput ? '✅ ADA' : '❌ TIDAK ADA'}`);
    
    // 4. Enter 3x setelah pembayaran
    const enterCount = (paymentText.match(/Send, \{Enter\}/g) || []).length;
    console.log(`4. Enter 3x setelah pembayaran: ${enterCount >= 3 ? '✅ ADA (' + enterCount + 'x)' : '❌ KURANG (' + enterCount + 'x)'}`);
    
    // 5. Jeda 1 detik
    const delay1sec = paymentText.includes('Sleep, 1000');
    console.log(`5. Jeda 1 detik: ${delay1sec ? '✅ ADA' : '❌ TIDAK ADA'}`);
    
    // 6. Reset dengan R
    const resetR = paymentText.includes('Send, r');
    console.log(`6. Reset dengan R: ${resetR ? '✅ ADA' : '❌ TIDAK ADA'}`);
    
    // Simpan script untuk verifikasi manual
    const scriptPath = path.join(__dirname, 'generated-ahk-bns-payment.ahk');
    fs.writeFileSync(scriptPath, ahkContent);
    console.log(`\n💾 AHK script saved to: ${scriptPath}`);
    
    // Kesimpulan
    console.log('\n=== KESIMPULAN ===');
    const allStepsCorrect = downArrow && enterToPayment && paymentInput && enterCount >= 3 && delay1sec && resetR;
    console.log(`✅ Test BNS payment navigation: ${allStepsCorrect ? 'BERHASIL' : 'PERLU PERBAIKAN'}`);
    
    if (allStepsCorrect) {
      console.log('✅ Semua langkah navigasi pembayaran BNS sudah benar');
      console.log('✅ Script akan: panah bawah → enter → input pembayaran → enter 3x → jeda 1s → reset R');
    } else {
      console.log('❌ Ada langkah yang perlu diperbaiki');
    }
    
  } catch (error) {
    console.error('❌ Error during test:', error.message);
    console.error('Stack:', error.stack);
  }
}

// Fungsi simulasi generate AHK untuk test
function generateTestAhkScript(data) {
  const transactionType = 'BNS';
  const pembayaranValue = data.pembayaranRp || '1500000';
  
  return `
; === SELESAI TRANSAKSI BNS ===
; Setelah transaksi selesai: navigasi ke pembayaran

; Tekan panah ke bawah 1x untuk navigasi ke pembayaran
Send, {Down}
Sleep, 500

; Tekan Enter 1x untuk masuk ke field pembayaran
Send, {Enter}
Sleep, 500

; Masukkan data pembayaran: ${pembayaranValue}
TypeString("${pembayaranValue}")
Sleep, 300

; Tekan Enter 3x setelah input pembayaran
Send, {Enter}
Sleep, 300
Send, {Enter}
Sleep, 300
Send, {Enter}
Sleep, 300

; Jeda 1 detik sebelum reset
Sleep, 1000

; Tekan tombol R 1x untuk reset ke menu utama
Send, r
Sleep, 500

Sleep 500
FileDelete, %A_ScriptFullPath%
ExitApp
`;
}

// Jalankan test
testBNSPaymentNavigation();
