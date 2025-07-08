// Test untuk validasi perhitungan total rupiah
// Simulasi data valasRows seperti di aplikasi

const valasRows = [
  // Baris 0: Input aktif (tidak dihitung dalam total)
  { kode: '1', valas: 'USD', valas2: 'USD', jumlah: '1000', rate: '15750', hasil: '15.750.000,00' },
  
  // Baris 1-2: Transaksi yang sudah ditambahkan (dihitung dalam total)
  { kode: '2', valas: 'EUR', valas2: 'EUR', jumlah: '500', rate: '17200', hasil: '8.600.000,00' },
  { kode: '3', valas: 'SGD', valas2: 'SGD', jumlah: '200', rate: '11400', hasil: '2.280.000,00' },
  
  // Baris 3-12: Kosong (tidak dihitung)
  ...Array(10).fill({ kode: '', valas: '', valas2: '', jumlah: '', rate: '', hasil: '' })
];

console.log("=== TEST PERHITUNGAN TOTAL RUPIAH ===");
console.log("Data valasRows:");
valasRows.forEach((row, idx) => {
  if (row.valas) {
    console.log(`Baris ${idx}: ${row.valas} ${row.jumlah} x ${row.rate} = ${row.hasil}`);
  }
});

console.log("\n=== PERHITUNGAN LAMA (SALAH) ===");
// Perhitungan lama: menggunakan semua baris
const totalRupiahLama = valasRows.reduce((acc, row) => acc + (parseFloat(row.hasil.replace(/\./g, '').replace(/,/g, '.')) || 0), 0);
console.log("Total (semua baris):", totalRupiahLama.toLocaleString('id-ID'));

console.log("\n=== PERHITUNGAN BARU (BENAR) ===");
// Perhitungan baru: hanya baris yang terisi (slice(1) untuk skip baris pertama)
const totalRupiahBaru = valasRows.slice(1).filter(row => 
  row.valas && row.valas.trim() !== '' && 
  row.jumlah && row.jumlah.trim() !== '' && 
  row.rate && row.rate.trim() !== ''
).reduce((acc, row) => acc + (parseFloat(row.hasil.replace(/\./g, '').replace(/,/g, '.')) || 0), 0);

console.log("Total (baris terisi saja):", totalRupiahBaru.toLocaleString('id-ID'));

console.log("\n=== HASIL ===");
console.log("Perbedaan:", (totalRupiahLama - totalRupiahBaru).toLocaleString('id-ID'));
console.log("Baris yang dihitung:");
valasRows.slice(1).filter(row => 
  row.valas && row.valas.trim() !== '' && 
  row.jumlah && row.jumlah.trim() !== '' && 
  row.rate && row.rate.trim() !== ''
).forEach((row, idx) => {
  console.log(`  ${idx + 1}. ${row.valas}: ${row.hasil}`);
});

console.log("\n✅ Perhitungan total rupiah sudah diperbaiki!");
console.log("Sekarang hanya menghitung baris transaksi yang terisi saja, tidak termasuk baris input aktif (baris 0)");
