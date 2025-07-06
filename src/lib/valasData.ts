// Data valas yang sama dengan yang ada di halaman daftar valas
export const daftarValas = [
  { no: 1, kode: 'USD', nama: 'Dollar Amerika' },
  { no: 2, kode: 'EUR', nama: 'Euro' },
  { no: 3, kode: 'JPY', nama: 'Yen Jepang' },
  { no: 4, kode: 'GBP', nama: 'Poundsterling Inggris' },
  { no: 5, kode: 'AUD', nama: 'Dollar Australia' },
  { no: 6, kode: 'CAD', nama: 'Dollar Kanada' },
  { no: 7, kode: 'CHF', nama: 'Franc Swiss' },
  { no: 8, kode: 'CNY', nama: 'Yuan China' },
  { no: 9, kode: 'SGD', nama: 'Dollar Singapura' },
  { no: 10, kode: 'HKD', nama: 'Dollar Hongkong' },
  { no: 11, kode: 'NZD', nama: 'Dollar Selandia Baru' },
  { no: 12, kode: 'KRW', nama: 'Won Korea' },
  { no: 13, kode: 'THB', nama: 'Baht Thailand' },
  { no: 14, kode: 'MYR', nama: 'Ringgit Malaysia' },
  { no: 15, kode: 'IDR', nama: 'Rupiah Indonesia' },
  { no: 16, kode: 'PHP', nama: 'Peso Filipina' },
  { no: 17, kode: 'INR', nama: 'Rupee India' },
  { no: 18, kode: 'TWD', nama: 'Dollar Taiwan' },
  { no: 19, kode: 'VND', nama: 'Dong Vietnam' },
  { no: 20, kode: 'SAR', nama: 'Riyal Saudi' },
  { no: 21, kode: 'AED', nama: 'Dirham Uni Emirat Arab' },
  { no: 22, kode: 'QAR', nama: 'Riyal Qatar' },
  { no: 23, kode: 'KWD', nama: 'Dinar Kuwait' },
  { no: 24, kode: 'BND', nama: 'Dollar Brunei' },
  { no: 25, kode: 'SEK', nama: 'Krona Swedia' },
  { no: 26, kode: 'NOK', nama: 'Krone Norwegia' },
  { no: 27, kode: 'DKK', nama: 'Krone Denmark' },
  { no: 28, kode: 'RUB', nama: 'Rubel Rusia' },
  { no: 29, kode: 'ZAR', nama: 'Rand Afrika Selatan' },
  { no: 30, kode: 'BRL', nama: 'Real Brasil' },
  { no: 31, kode: 'MXN', nama: 'Peso Meksiko' },
  { no: 32, kode: 'PLN', nama: 'Zloty Polandia' },
  { no: 33, kode: 'TRY', nama: 'Lira Turki' },
  { no: 34, kode: 'EGP', nama: 'Pound Mesir' },
  { no: 35, kode: 'PKR', nama: 'Rupee Pakistan' },
];

// Fungsi untuk mendapatkan data valas berdasarkan nomor urut
export function getValasByNumber(no: number) {
  const valas = daftarValas.find(item => item.no === no);
  return valas || null;
}

// Fungsi untuk mendapatkan data valas berdasarkan kode
export function getValasByCode(kode: string) {
  const valas = daftarValas.find(item => 
    item.kode.toLowerCase() === kode.toLowerCase()
  );
  return valas || null;
}
