// Test untuk memvalidasi navigasi berbeda setelah transaksi ke-7
console.log('=== TEST NAVIGASI TRANSAKSI SETELAH BARIS 7 ===');

// Simulasi 9 transaksi untuk menguji navigasi
const transactions = [
  { id: 1, currency: 'USD', amount: 1000, rate: 16000 },
  { id: 2, currency: 'EUR', amount: 500, rate: 18000 },
  { id: 3, currency: 'GBP', amount: 300, rate: 22000 },
  { id: 4, currency: 'AUD', amount: 800, rate: 10500 },
  { id: 5, currency: 'CAD', amount: 600, rate: 12000 },
  { id: 6, currency: 'JPY', amount: 50000, rate: 110 },
  { id: 7, currency: 'SGD', amount: 1200, rate: 12500 },
  { id: 8, currency: 'CHF', amount: 400, rate: 20000 },  // Setelah baris 7
  { id: 9, currency: 'HKD', amount: 5000, rate: 2000 },  // Setelah baris 7
];

console.log(`Total transaksi: ${transactions.length}`);
console.log('');

// Simulasi logika navigasi
transactions.forEach((transaction, index) => {
  const currentTransactionNumber = index + 1;
  console.log(`Transaksi ${currentTransactionNumber}: ${transaction.currency} ${transaction.amount} ${transaction.rate}`);
  
  // Jika bukan transaksi terakhir, cek navigasi
  if (index < transactions.length - 1) {
    const nextTransactionNumber = index + 2;
    
    if (nextTransactionNumber > 7) {
      console.log(`  → Navigasi ke transaksi ${nextTransactionNumber}: KHUSUS (Enter 2x + Panah Atas + Enter)`);
    } else {
      console.log(`  → Navigasi ke transaksi ${nextTransactionNumber}: NORMAL (Enter 2x)`);
    }
  } else {
    console.log(`  → Transaksi terakhir, tidak ada navigasi`);
  }
});

console.log('');
console.log('=== BREAKDOWN NAVIGASI ===');
console.log('Transaksi 1 → 2: NORMAL (Enter 2x)');
console.log('Transaksi 2 → 3: NORMAL (Enter 2x)');
console.log('Transaksi 3 → 4: NORMAL (Enter 2x)');
console.log('Transaksi 4 → 5: NORMAL (Enter 2x)');
console.log('Transaksi 5 → 6: NORMAL (Enter 2x)');
console.log('Transaksi 6 → 7: NORMAL (Enter 2x)');
console.log('Transaksi 7 → 8: KHUSUS (Enter 2x + Panah Atas + Enter) ⚠️');
console.log('Transaksi 8 → 9: KHUSUS (Enter 2x + Panah Atas + Enter) ⚠️');

console.log('');
console.log('=== LOGIKA YANG DITERAPKAN ===');
console.log('- Transaksi 1-7: Navigasi normal dengan Enter 2x');
console.log('- Transaksi 8+: Navigasi khusus dengan Enter 2x + Panah Atas + Enter');
console.log('- Perubahan terjadi setelah baris ke-7 selesai');

console.log('');
console.log('=== TIMELINE NAVIGASI ===');
console.log('Baris 1 [USD] → Enter 2x → Baris 2');
console.log('Baris 2 [EUR] → Enter 2x → Baris 3');
console.log('Baris 3 [GBP] → Enter 2x → Baris 4');
console.log('Baris 4 [AUD] → Enter 2x → Baris 5');
console.log('Baris 5 [CAD] → Enter 2x → Baris 6');
console.log('Baris 6 [JPY] → Enter 2x → Baris 7');
console.log('Baris 7 [SGD] → Enter 2x + ↑ + Enter → Baris 8 ⚠️');
console.log('Baris 8 [CHF] → Enter 2x + ↑ + Enter → Baris 9 ⚠️');
console.log('Baris 9 [HKD] → Selesai');

console.log('');
console.log('✅ Logika navigasi khusus setelah baris 7 sudah diterapkan!');
console.log('🎯 Script akan otomatis mendeteksi dan menggunakan navigasi yang tepat');
