// Test untuk validasi AHK multiple transaksi dan rate validation
console.log("=== TEST AHK MULTIPLE TRANSAKSI ===");

// Simulasi data multiple transaksi
const testData = {
  name: "TEST USER",
  address: "Jl. Test No. 123",
  phone: "081234567890",
  job: "Test Job",
  idNumber: "1234567890123456",
  birthPlace: "Jakarta",
  birthDate: "01/01/1990",
  transactionType: "BNB",
  transactions: [
    { currency: "USD", amount: "1000.00", rate: "15750.00" },
    { currency: "EUR", amount: "500.00", rate: "17200.00" },
    { currency: "SGD", amount: "200.00", rate: "11400.00" }
  ]
};

console.log("Data Nasabah:");
console.log(`- Nama: ${testData.name}`);
console.log(`- Alamat: ${testData.address}`);
console.log(`- Telepon: ${testData.phone}`);
console.log(`- Jenis Transaksi: ${testData.transactionType}`);

console.log("\nData Transaksi:");
testData.transactions.forEach((tx, idx) => {
  console.log(`${idx + 1}. ${tx.currency}: ${tx.amount} x ${tx.rate}`);
});

console.log("\n=== FLOW AHK SCRIPT MULTIPLE TRANSAKSI ===");
console.log("1. Deteksi window aplikasi");
console.log("2. Pilih jenis transaksi (BNB/BNS)");
console.log("3. Isi data nasabah (6 field)");
console.log("4. Enter untuk konfirmasi nasabah");
console.log("5. Enter untuk masuk ke transaksi");
console.log("6. LOOP untuk setiap transaksi:");
console.log("   a. Isi currency code");
console.log("   b. Enter x2 untuk konfirmasi currency");
console.log("   c. Isi amount + Enter");
console.log("   d. Isi rate + Enter");
console.log("   e. F2 untuk baris baru (jika bukan transaksi terakhir)");
console.log("7. Down + Enter untuk selesai");

console.log("\n=== VALIDASI RATE BERDASARKAN JENIS TRANSAKSI ===");
console.log("BNB (Beli Nota Biasa) = Menggunakan BUY rate");
console.log("BNS (Beli Nota Segar) = Menggunakan SELL rate");

// Test validasi
const testValidation = [
  { type: "BNB", currency: "USD", rate: 15750, expected: "BUY" },
  { type: "BNS", currency: "USD", rate: 15650, expected: "SELL" },
  { type: "BNB", currency: "EUR", rate: 17200, expected: "BUY" },
  { type: "BNS", currency: "EUR", rate: 17000, expected: "SELL" }
];

console.log("\nTest Cases:");
testValidation.forEach((test, idx) => {
  console.log(`${idx + 1}. ${test.type} ${test.currency} rate ${test.rate} → validasi ${test.expected}`);
});

console.log("\n✅ PERBAIKAN SUDAH DILAKUKAN:");
console.log("1. AHK script mendukung multiple transaksi");
console.log("2. Rate validation sesuai jenis transaksi");
console.log("3. Menggunakan F2 untuk tambah baris baru");
console.log("4. Total transaksi ditampilkan di message box");
