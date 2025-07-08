// Test perbandingan kecepatan script AHK sebelum dan sesudah optimasi
console.log('=== ANALISIS KECEPATAN SCRIPT AHK ===');

// Simulasi timing sebelum optimasi
const timingBefore = {
  namaLengkap: { input: 100, tab: 200 },
  alamat: { input: 100, tab: 200 },
  telepon: { input: 100, tab: 200 },
  pekerjaan: { input: 100, tab: 200 },
  idNumber: { input: 100, tab: 200 },
  tempatTanggalLahir: { input: 100, tab: 0 },
  
  // Navigasi ke transaksi
  navigasiKeTransaksi: 800 + 500 + 600 + 600, // Sleep setelah data nasabah + WinActivate + 2x Enter
  
  // Per transaksi
  perTransaksi: {
    currencyCode: 600,
    navigasiToAmount: 600 + 600, // 2x Enter
    amount: 500,
    navigasiToRate: 600, // 1x Enter
    rate: 500,
    konfirmasi: 1000,
  },
  
  // Navigasi antar baris transaksi
  antarBaris: 600 + 600, // 2x Enter
};

// Simulasi timing setelah optimasi
const timingAfter = {
  namaLengkap: { input: 50, tab: 100 },
  alamat: { input: 50, tab: 100 },
  telepon: { input: 50, tab: 100 },
  pekerjaan: { input: 50, tab: 100 },
  idNumber: { input: 50, tab: 100 },
  tempatTanggalLahir: { input: 50, tab: 0 },
  
  // Navigasi ke transaksi
  navigasiKeTransaksi: 200 + 100 + 200 + 200, // Sleep setelah data nasabah + WinActivate + 2x Enter
  
  // Per transaksi
  perTransaksi: {
    currencyCode: 200,
    navigasiToAmount: 200 + 200, // 2x Enter
    amount: 100,
    navigasiToRate: 200, // 1x Enter
    rate: 100,
    konfirmasi: 300,
  },
  
  // Navigasi antar baris transaksi
  antarBaris: 200 + 200, // 2x Enter
};

function calculateTotalTime(timing, numTransactions = 9) {
  // Waktu input data nasabah
  const dataNasabah = Object.values(timing).slice(0, 6).reduce((total, field) => {
    return total + field.input + field.tab;
  }, 0);
  
  // Waktu navigasi ke transaksi
  const navigasi = timing.navigasiKeTransaksi;
  
  // Waktu per transaksi
  const perTransaksi = Object.values(timing.perTransaksi).reduce((total, time) => total + time, 0);
  
  // Waktu antar baris (hanya untuk transaksi ke-2 sampai terakhir)
  const antarBaris = timing.antarBaris * (numTransactions - 1);
  
  // Total waktu
  const totalTime = dataNasabah + navigasi + (perTransaksi * numTransactions) + antarBaris;
  
  return {
    dataNasabah,
    navigasi,
    transaksi: perTransaksi * numTransactions,
    antarBaris,
    total: totalTime
  };
}

console.log('📊 PERBANDINGAN WAKTU EKSEKUSI (ms):');
console.log('');

const before = calculateTotalTime(timingBefore, 9);
const after = calculateTotalTime(timingAfter, 9);

console.log('⏱️  SEBELUM OPTIMASI:');
console.log(`- Data Nasabah: ${before.dataNasabah}ms`);
console.log(`- Navigasi ke Transaksi: ${before.navigasi}ms`);
console.log(`- 9 Transaksi: ${before.transaksi}ms`);
console.log(`- Navigasi Antar Baris: ${before.antarBaris}ms`);
console.log(`- TOTAL: ${before.total}ms (${(before.total/1000).toFixed(1)} detik)`);
console.log('');

console.log('⚡ SETELAH OPTIMASI:');
console.log(`- Data Nasabah: ${after.dataNasabah}ms`);
console.log(`- Navigasi ke Transaksi: ${after.navigasi}ms`);
console.log(`- 9 Transaksi: ${after.transaksi}ms`);
console.log(`- Navigasi Antar Baris: ${after.antarBaris}ms`);
console.log(`- TOTAL: ${after.total}ms (${(after.total/1000).toFixed(1)} detik)`);
console.log('');

const timeSaved = before.total - after.total;
const percentSaved = ((timeSaved / before.total) * 100);

console.log('🚀 HASIL OPTIMASI:');
console.log(`- Waktu dihemat: ${timeSaved}ms (${(timeSaved/1000).toFixed(1)} detik)`);
console.log(`- Persentase lebih cepat: ${percentSaved.toFixed(1)}%`);
console.log(`- Kecepatan sekarang: ${(before.total/after.total).toFixed(1)}x lebih cepat`);

console.log('');
console.log('📈 BREAKDOWN PENGHEMATAN:');
console.log(`- Data Nasabah: ${before.dataNasabah - after.dataNasabah}ms`);
console.log(`- Navigasi: ${before.navigasi - after.navigasi}ms`);
console.log(`- Transaksi: ${before.transaksi - after.transaksi}ms`);
console.log(`- Antar Baris: ${before.antarBaris - after.antarBaris}ms`);

console.log('');
console.log('✨ OPTIMASI YANG DITERAPKAN:');
console.log('- Sleep data nasabah: 100ms → 50ms (input), 200ms → 100ms (tab)');
console.log('- Sleep navigasi ke transaksi: 800ms → 200ms');
console.log('- Sleep currency code: 600ms → 200ms');
console.log('- Sleep navigasi amount: 600ms → 200ms (2x)');
console.log('- Sleep input amount: 500ms → 100ms');
console.log('- Sleep navigasi rate: 600ms → 200ms');
console.log('- Sleep input rate: 500ms → 100ms');
console.log('- Sleep konfirmasi: 1000ms → 300ms');
console.log('- Sleep antar baris: 600ms → 200ms (2x)');
console.log('');
console.log('🎯 Script sekarang jauh lebih cepat dan responsif!');
