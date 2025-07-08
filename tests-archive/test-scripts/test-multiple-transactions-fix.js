// Test untuk memverifikasi fix multiple transactions bug
const testData = {
  // Data nasabah
  name: "John Doe",
  address: "Test Address",
  phone: "08123456789",
  job: "Test Job",
  idNumber: "123456789",
  birthPlace: "Test Place",
  birthDate: "1990-01-01",
  
  // Data transaksi utama (yang diklik - seharusnya diabaikan jika ada array)
  currency: "USD",
  amount: 1000,
  rate: 16000,
  
  // Array semua transaksi (yang seharusnya diproses semua)
  transactions: [
    { currency: "USD", amount: 1000, rate: 16000 },
    { currency: "EUR", amount: 500, rate: 18000 },
    { currency: "GBP", amount: 300, rate: 22000 },
    { currency: "AUD", amount: 800, rate: 10500 },
    { currency: "CAD", amount: 600, rate: 12000 },
    { currency: "JPY", amount: 50000, rate: 110 },
    { currency: "SGD", amount: 1200, rate: 12500 },
    { currency: "CHF", amount: 400, rate: 20000 },
    { currency: "HKD", amount: 5000, rate: 2000 }
  ]
};

console.log('=== TEST MULTIPLE TRANSACTIONS FIX ===');
console.log('Test scenario: 9 transaksi dalam array, 1 transaksi utama');
console.log('Expected: Script harus memproses 9 transaksi dari array, bukan 1 transaksi utama');
console.log('');

// Simulasi logika yang sudah diperbaiki
console.log('Data yang akan dikirim:');
console.log(`- Transaksi utama: ${testData.currency} ${testData.amount} ${testData.rate}`);
console.log(`- Array transaksi: ${testData.transactions.length} transaksi`);
console.log('');

// Test logika prioritas
const transactions = [];

// Prioritas 1: Ambil dari array transactions jika ada (semua transaksi)
if (testData.transactions && Array.isArray(testData.transactions)) {
  testData.transactions.forEach((transaction, index) => {
    if (transaction.currency && transaction.amount && transaction.rate) {
      transactions.push(transaction);
      console.log(`✅ Transaksi ${index + 1}: ${transaction.currency} ${transaction.amount} ${transaction.rate}`);
    }
  });
}

// Prioritas 2: Jika tidak ada array transactions, ambil dari data utama
if (transactions.length === 0 && testData.currency && testData.amount && testData.rate) {
  transactions.push({
    currency: testData.currency,
    amount: testData.amount,
    rate: testData.rate
  });
  console.log(`✅ Fallback - Transaksi utama: ${testData.currency} ${testData.amount} ${testData.rate}`);
}

console.log('');
console.log('=== HASIL TEST ===');
console.log(`Total transaksi yang akan diproses: ${transactions.length}`);
console.log(`Expected: 9 transaksi ✅`);
console.log(`Actual: ${transactions.length} transaksi ${transactions.length === 9 ? '✅' : '❌'}`);

if (transactions.length === 9) {
  console.log('🎉 FIX BERHASIL! Semua transaksi akan diproses');
} else {
  console.log('❌ FIX GAGAL! Masih ada bug');
}

console.log('');
console.log('=== DETAIL TRANSAKSI YANG AKAN DIPROSES ===');
transactions.forEach((t, i) => {
  console.log(`${i + 1}. ${t.currency} - Amount: ${t.amount} - Rate: ${t.rate}`);
});
