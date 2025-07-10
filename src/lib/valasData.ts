// Data valas yang sama dengan yang ada di halaman daftar valas
// Disamakan urutan & isi dengan src/app/valasKode.json (Daftar Valas)
// USK dan USB adalah alias dari USD
export const daftarValas = [
  { no: -1, kode: 'USK', nama: 'USK', alias: 'USD' },
  { no: 1, kode: 'USB', nama: 'USB', alias: 'USD' },
  { no: 2, kode: 'AUD', nama: 'AUD' },
  { no: 3, kode: 'CAD', nama: 'CAD' },
  { no: 4, kode: 'EUR', nama: 'EUR' },
  { no: 5, kode: 'GBP', nama: 'GBP' },
  { no: 6, kode: 'CHF', nama: 'CHF' },
  { no: 7, kode: 'HKD', nama: 'HKD' },
  { no: 8, kode: 'SGD', nama: 'SGD' },
  { no: 9, kode: 'JPY', nama: 'JPY' },
  { no: 10, kode: 'NZD', nama: 'NZD' },
  { no: 11, kode: 'MYR', nama: 'MYR' },
  { no: 12, kode: 'BND', nama: 'BND' },
  { no: 13, kode: 'INR', nama: 'INR' },
  { no: 14, kode: 'TWD', nama: 'TWD' },
  { no: 15, kode: 'PHP', nama: 'PHP' },
  { no: 16, kode: 'SAR', nama: 'SAR' },
  { no: 17, kode: 'THB', nama: 'THB' },
  { no: 18, kode: 'KPW', nama: 'KPW' },
  { no: 19, kode: 'RUB', nama: 'RUB' },
  { no: 20, kode: 'YUA', nama: 'YUA' },
  { no: 21, kode: 'UEA', nama: 'UEA' },
  { no: 22, kode: 'KWD', nama: 'KWD' },
  { no: 23, kode: 'QTR', nama: 'QTR' },
  { no: 24, kode: 'JOD', nama: 'JOD' },
  { no: 25, kode: 'BHD', nama: 'BHD' },
  { no: 26, kode: 'OMR', nama: 'OMR' },
  { no: 27, kode: 'EGP', nama: 'EGP' },
  { no: 28, kode: 'DKK', nama: 'DKK' },
  { no: 29, kode: 'NOK', nama: 'NOK' },
  { no: 30, kode: 'SEK', nama: 'SEK' },
  { no: 31, kode: 'IQD', nama: 'IQD' },
  { no: 32, kode: 'VND', nama: 'VND' },
  { no: 33, kode: 'TRY', nama: 'TRY' },
];

// Helper untuk mendapatkan kode utama (USD) jika alias USK/USB
export function getMainCurrencyCode(valas: { alias?: string; kode: string } | null | undefined): string | null {
  if (!valas) return null;
  return valas.alias || valas.kode;
}

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

// Fungsi untuk mendapatkan currency code number berdasarkan string currency (untuk AHK script)
export function getCurrencyCodeNumber(currencyString: string): string {
  const currency = currencyString.toUpperCase().trim()
  
  // Cari currency di daftarValas berdasarkan kode atau alias
  let valasItem = daftarValas.find(item => 
    item.kode.toUpperCase() === currency || 
    (item.alias && item.alias.toUpperCase() === currency)
  )
  
  if (valasItem) {
    // Gunakan nomor urut dari daftarValas
    return valasItem.no.toString()
  }
  
  // Fallback ke mapping manual jika tidak ditemukan
  const fallbackMapping: { [key: string]: string } = {
    'USD': '1',
    'AUD': '2', 
    'CAD': '3',
    'EUR': '4',
    'GBP': '5',
    'CHF': '6',
    'HKD': '7',
    'SGD': '8',
    'JPY': '9',
    'NZD': '10',
    'MYR': '11',
    'BND': '12',
    'INR': '13',
    'TWD': '14',
    'PHP': '15',
    'SAR': '16',
    'THB': '17',
    'KPW': '18',
    'RUB': '19',
    'YUA': '20',
    'UEA': '21',
    'KWD': '22',
    'QTR': '23',
    'JOD': '24',
    'BHD': '25',
    'OMR': '26',
    'EGP': '27',
    'DKK': '28',
    'NOK': '29',
    'SEK': '30',
    'IQD': '31',
    'VND': '32',
    'TRY': '33'
  }
  
  return fallbackMapping[currency] || '1' // default USD
}
