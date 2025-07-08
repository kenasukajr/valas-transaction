// Test simple untuk currency mapping dengan console output
const testData = {
  name: "TEST USER",
  currency: "AUD",
  amount: 100,
  rate: 10500
};

console.log('=== SIMPLE CURRENCY MAPPING TEST ===');
console.log('Test data:', testData);
console.log('Expected: AUD should map to the correct code from daftarValas');
console.log('');

// Simulasi mapping logic (copy dari route.ts)
const currency = (testData.currency || '').toUpperCase().trim();
console.log('Normalized currency:', currency);

// Simulasi daftarValas (harus sesuai dengan yang di valasData.ts)
const daftarValas = [
  { no: 1, kode: 'USD', nama: 'US Dollar', flag: '🇺🇸' },
  { no: 2, kode: 'AUD', nama: 'Australian Dollar', flag: '🇦🇺' },
  { no: 3, kode: 'CAD', nama: 'Canadian Dollar', flag: '🇨🇦' },
  { no: 4, kode: 'EUR', nama: 'Euro', flag: '🇪🇺' },
  { no: 5, kode: 'GBP', nama: 'British Pound', flag: '🇬🇧' },
  // tambah lainnya sesuai kebutuhan
];

let valasItem = daftarValas.find(item => 
  item.kode.toUpperCase() === currency || 
  (item.alias && item.alias.toUpperCase() === currency)
);

console.log('Found valas item:', valasItem);

let currencyCode = '1'; // default
if (valasItem) {
  currencyCode = valasItem.no < 0 ? '1' : valasItem.no.toString();
  console.log('✅ Using daftarValas mapping:', currency, '→', currencyCode);
} else {
  console.log('❌ Not found in daftarValas, using fallback mapping');
  if (currency === 'AUD') currencyCode = '2';
  console.log('Fallback mapping:', currency, '→', currencyCode);
}

console.log('Final currency code:', currencyCode);
console.log('');
console.log('=== RESULT ===');
console.log(`Currency: ${currency}`);
console.log(`Code: ${currencyCode}`);
console.log(`Expected script line: Send, ${currencyCode}`);
