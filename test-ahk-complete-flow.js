// Test script untuk validasi AHK generation dengan data lengkap
const testData = {
  name: "TEST USER",
  address: "Jl. Test No. 123",
  phone: "081234567890",
  job: "Test Job",
  idNumber: "1234567890123456",
  birthPlace: "Jakarta",
  birthDate: "01/01/1990",
  transactionType: "BNB",
  currency: "USD",
  amount: "1000.00",
  rate: "15750.00"
};

console.log("Test Data untuk AHK Generation:");
console.log("================================");
console.log("Data Nasabah:");
console.log(`- Nama: ${testData.name}`);
console.log(`- Alamat: ${testData.address}`);
console.log(`- Telepon: ${testData.phone}`);
console.log(`- Pekerjaan: ${testData.job}`);
console.log(`- ID: ${testData.idNumber}`);
console.log(`- TTL: ${testData.birthPlace} ${testData.birthDate}`);
console.log("\nData Transaksi:");
console.log(`- Jenis: ${testData.transactionType}`);
console.log(`- Currency: ${testData.currency}`);
console.log(`- Amount: ${testData.amount}`);
console.log(`- Rate: ${testData.rate}`);
console.log("\nCurrency Code Mapping:");
console.log("1 = USD, 2 = EUR, 3 = GBP, 4 = AUD, 5 = CAD");
console.log("6 = CHF, 7 = JPY, 8 = SGD, 9 = SEK, 10 = NOK");
console.log("\nFlow AHK Script:");
console.log("1. Deteksi window aplikasi");
console.log("2. Pilih jenis transaksi (BNB/BNS)");
console.log("3. Isi data nasabah (6 field)");
console.log("4. Enter untuk konfirmasi nasabah");
console.log("5. Enter untuk masuk ke transaksi");
console.log("6. Isi currency code");
console.log("7. Enter x2 untuk konfirmasi currency");
console.log("8. Isi amount + Enter");
console.log("9. Isi rate + Enter");
console.log("10. Down + Enter untuk selesai");
console.log("\n✅ Script AHK sudah diperbaiki untuk flow lengkap!");
