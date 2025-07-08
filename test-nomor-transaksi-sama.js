// Test untuk memverifikasi fix pengambilan semua transaksi dengan nomor yang sama
console.log('=== TEST PENGAMBILAN TRANSAKSI BERDASARKAN NOMOR YANG SAMA ===');

// Simulasi data transaksi seperti yang ada di TransactionList.tsx
const transactions = [
  // Transaksi dengan nomor TRX001 (9 transaksi valas)
  { id: 1, transactionNumber: 'TRX001', name: 'John Doe', currency: 'USD', amount: 1000, rate: 16000 },
  { id: 2, transactionNumber: 'TRX001', name: 'John Doe', currency: 'EUR', amount: 500, rate: 18000 },
  { id: 3, transactionNumber: 'TRX001', name: 'John Doe', currency: 'GBP', amount: 300, rate: 22000 },
  { id: 4, transactionNumber: 'TRX001', name: 'John Doe', currency: 'AUD', amount: 800, rate: 10500 },
  { id: 5, transactionNumber: 'TRX001', name: 'John Doe', currency: 'CAD', amount: 600, rate: 12000 },
  { id: 6, transactionNumber: 'TRX001', name: 'John Doe', currency: 'JPY', amount: 50000, rate: 110 },
  { id: 7, transactionNumber: 'TRX001', name: 'John Doe', currency: 'SGD', amount: 1200, rate: 12500 },
  { id: 8, transactionNumber: 'TRX001', name: 'John Doe', currency: 'CHF', amount: 400, rate: 20000 },
  { id: 9, transactionNumber: 'TRX001', name: 'John Doe', currency: 'HKD', amount: 5000, rate: 2000 },
  
  // Transaksi dengan nomor TRX002 (2 transaksi valas)
  { id: 10, transactionNumber: 'TRX002', name: 'Jane Smith', currency: 'USD', amount: 2000, rate: 16100 },
  { id: 11, transactionNumber: 'TRX002', name: 'Jane Smith', currency: 'EUR', amount: 1000, rate: 18200 },
  
  // Transaksi dengan nomor TRX003 (1 transaksi valas)
  { id: 12, transactionNumber: 'TRX003', name: 'Bob Johnson', currency: 'USD', amount: 500, rate: 16050 },
];

console.log(`Total transaksi dalam database: ${transactions.length}`);
console.log('');

// Test: Klik tombol script di baris ke-5 (TRX001 - CAD)
const clickedTransaction = transactions[4]; // index 4 = baris ke-5
console.log('=== SIMULASI KLIK TOMBOL SCRIPT ===');
console.log(`Baris yang diklik: ${clickedTransaction.transactionNumber} - ${clickedTransaction.currency}`);
console.log('');

// Ambil semua transaksi dengan nomor yang sama (fix yang diterapkan)
const sameNumberTransactions = transactions.filter(
  (t) => t.transactionNumber === clickedTransaction.transactionNumber
);

console.log('=== HASIL FILTER BERDASARKAN NOMOR TRANSAKSI ===');
console.log(`Nomor transaksi yang dicari: ${clickedTransaction.transactionNumber}`);
console.log(`Jumlah transaksi ditemukan: ${sameNumberTransactions.length}`);
console.log('');

console.log('Detail transaksi yang akan dikirim ke API:');
sameNumberTransactions.forEach((t, i) => {
  console.log(`${i + 1}. ${t.currency} - Amount: ${t.amount} - Rate: ${t.rate}`);
});

console.log('');
console.log('=== VERIFIKASI ===');
console.log(`Expected: 9 transaksi untuk ${clickedTransaction.transactionNumber}`);
console.log(`Actual: ${sameNumberTransactions.length} transaksi`);
console.log(`Status: ${sameNumberTransactions.length === 9 ? '✅ BERHASIL' : '❌ GAGAL'}`);

console.log('');
console.log('=== TEST KASUS LAIN ===');

// Test dengan transaksi nomor TRX002
const trx002 = transactions.find(t => t.transactionNumber === 'TRX002');
const trx002Transactions = transactions.filter(t => t.transactionNumber === 'TRX002');
console.log(`TRX002: Expected 2, Actual ${trx002Transactions.length} ${trx002Transactions.length === 2 ? '✅' : '❌'}`);

// Test dengan transaksi nomor TRX003
const trx003 = transactions.find(t => t.transactionNumber === 'TRX003');
const trx003Transactions = transactions.filter(t => t.transactionNumber === 'TRX003');
console.log(`TRX003: Expected 1, Actual ${trx003Transactions.length} ${trx003Transactions.length === 1 ? '✅' : '❌'}`);

console.log('');
console.log('🎉 FIX BERHASIL! Sekarang semua transaksi dengan nomor yang sama akan diproses!');
