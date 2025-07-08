// Manual UI Test Guide untuk Pembayaran BNS
// Panduan test manual untuk memverifikasi integrasi pembayaran BNS di UI

console.log('=== PANDUAN TEST MANUAL UI PEMBAYARAN BNS ===\n');

// Test case yang harus dijalankan secara manual di browser
const testCases = [
  {
    no: 1,
    title: 'Test Input Field Pembayaran BNS',
    steps: [
      '1. Buka http://localhost:8000 di browser',
      '2. Isi form dengan data:',
      '   - Nama: TEST USER',
      '   - Mata Uang: USD',
      '   - Jumlah: 1000',
      '   - Kurs: 15750',
      '   - Pembayaran Rp: 16000000',
      '3. Klik "Hitung Kembalian"',
      '4. Verifikasi kembalian: Rp 250.000',
      '5. Klik "Simpan Data"'
    ],
    expectedResults: [
      'Field pembayaran terisi dengan benar',
      'Kembalian dihitung otomatis: Rp 250.000',
      'Data tersimpan ke database',
      'Notifikasi sukses muncul'
    ]
  },
  {
    no: 2,
    title: 'Test Generate AHK dengan Pembayaran',
    steps: [
      '1. Lanjutkan dari test case 1',
      '2. Klik "Generate AHK"',
      '3. Verifikasi file AHK ter-download',
      '4. Buka file AHK dengan text editor',
      '5. Cari baris: paymentAmount := 16000000',
      '6. Cari baris: changeAmount := 250000'
    ],
    expectedResults: [
      'File AHK berisi data pembayaran yang benar',
      'Variable paymentAmount sesuai input',
      'Variable changeAmount sesuai kalkulasi',
      'Semua data BNS terintegrasi ke AHK'
    ]
  },
  {
    no: 3,
    title: 'Test Display Transaksi dengan Pembayaran',
    steps: [
      '1. Buka halaman transaksi/history',
      '2. Cari transaksi BNS terbaru',
      '3. Lihat detail transaksi',
      '4. Verifikasi section "Pembayaran BNS"',
      '5. Cek tampilan:',
      '   - Jumlah Rupiah: Rp 15.750.000',
      '   - Pembayaran: Rp 16.000.000',
      '   - Kembalian: Rp 250.000'
    ],
    expectedResults: [
      'Section pembayaran BNS terpisah dan jelas',
      'Formatting angka dengan separator ribuan',
      'Kembalian berwarna hijau jika positif',
      'Kembalian berwarna merah jika negatif'
    ]
  },
  {
    no: 4,
    title: 'Test Multi-Currency BNS',
    steps: [
      '1. Test dengan EUR: 500, kurs 17200, bayar 9000000',
      '2. Test dengan GBP: 300, kurs 19500, bayar 6000000',
      '3. Test dengan SGD: 800, kurs 11250, bayar 9100000',
      '4. Verifikasi semua kembalian dihitung benar',
      '5. Generate AHK untuk masing-masing',
      '6. Cek display di transaction list'
    ],
    expectedResults: [
      'Semua mata uang BNS bisa input pembayaran',
      'Kalkulasi kembalian akurat untuk semua kurs',
      'AHK ter-generate dengan data pembayaran yang benar',
      'Transaction list menampilkan semua data dengan benar'
    ]
  },
  {
    no: 5,
    title: 'Test Edge Cases',
    steps: [
      '1. Test pembayaran pas: bayar = jumlah rupiah',
      '2. Test pembayaran kurang: bayar < jumlah rupiah',
      '3. Test pembayaran berlebih: bayar >> jumlah rupiah',
      '4. Test dengan angka besar: 100000 USD',
      '5. Test dengan angka kecil: 10 USD'
    ],
    expectedResults: [
      'Kembalian = 0 jika bayar pas',
      'Kembalian negatif jika bayar kurang (warna merah)',
      'Kembalian positif jika bayar berlebih (warna hijau)',
      'Formatting angka besar tetap benar',
      'Formatting angka kecil tetap benar'
    ]
  }
];

// Print test cases
testCases.forEach(testCase => {
  console.log(`\n📋 TEST CASE ${testCase.no}: ${testCase.title}`);
  console.log('─'.repeat(60));
  
  console.log('\n🔸 LANGKAH-LANGKAH:');
  testCase.steps.forEach(step => {
    console.log(`   ${step}`);
  });
  
  console.log('\n🔸 HASIL YANG DIHARAPKAN:');
  testCase.expectedResults.forEach(result => {
    console.log(`   ✓ ${result}`);
  });
  
  console.log('\n' + '='.repeat(60));
});

console.log('\n🎯 CATATAN PENTING:');
console.log('• Pastikan kedua server berjalan (frontend:8000, backend:5000)');
console.log('• Test harus dilakukan di browser yang berbeda untuk memastikan CORS');
console.log('• Verifikasi file AHK yang di-generate bisa dibuka dan berisi data yang benar');
console.log('• Cek console browser untuk error JavaScript');
console.log('• Test dengan berbagai browser (Chrome, Firefox, Edge)');

console.log('\n🚀 CHECKLIST INTEGRASI:');
console.log('□ Frontend: Field pembayaran BNS berfungsi');
console.log('□ Backend: API menyimpan data pembayaran dengan benar');
console.log('□ AHK: Script berisi data pembayaran dari frontend');
console.log('□ UI: Transaction list menampilkan detail pembayaran');
console.log('□ Calculation: Kembalian dihitung dengan akurat');
console.log('□ Validation: Edge cases ditangani dengan baik');

console.log('\n📁 FILE YANG TERLIBAT:');
console.log('• Frontend: src/app/page.tsx');
console.log('• Backend: src/app/api/bns-payment/route.ts');
console.log('• AHK API: src/app/api/generate-ahk/route.ts');
console.log('• AHK Script: tools/autohotkey/auto_type_form.ahk');
console.log('• UI Component: src/components/TransactionList.tsx');
console.log('• Test Script: tests-archive/test-scripts/test-integrasi-pembayaran-bns.js');
