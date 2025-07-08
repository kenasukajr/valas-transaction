

// Fetch kurs data dari endpoint proxy Next.js agar tidak kena CORS
export async function fetchKursMbarate() {
  try {
    const res = await fetch('/api/kurs-mbarate', { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch data.json');
    const data = await res.json();
    // Asumsi data format: [ { currency, buy, sell, ... }, ... ]
    if (Array.isArray(data)) {
      return data;
    }
    if (data && Array.isArray(data.kurs)) {
      return data.kurs;
    }
    throw new Error('Format data tidak sesuai');
  } catch (e) {
    // Fallback data dummy jika fetch gagal (CORS, network, dsb)
    return [
      { currency: 'USD New', buy: '16100', sell: '16350' },
      { currency: 'EURO', buy: '18900', sell: '19200' },
      { currency: 'AUD', buy: '10550', sell: '10750' },
      { currency: 'CAD', buy: '11700', sell: '12000' },
      { currency: 'GBP', buy: '22000', sell: '22500' },
      { currency: 'CHF', buy: '20150', sell: '20450' },
      { currency: 'SGD', buy: '12700', sell: '13050' },
      { currency: 'HKD', buy: '2000', sell: '2150' },
      { currency: 'JPY', buy: '110.5', sell: '115.5' },
      { currency: 'MYR', buy: '3800', sell: '3950' },
      { currency: 'NZD', buy: '9500', sell: '9700' },
      { currency: 'THB', buy: '430', sell: '450' },
      { currency: 'CNY', buy: '2200', sell: '2350' },
      { currency: 'KRW', buy: '11.5', sell: '12.5' },
      { currency: 'SAR', buy: '4200', sell: '4400' },
      { currency: 'INR', buy: '195', sell: '210' },
      { currency: 'PHP', buy: '280', sell: '300' },
      { currency: 'TWD', buy: '500', sell: '520' },
      { currency: 'VND', buy: '0.65', sell: '0.75' },
      { currency: 'IDR', buy: '1', sell: '1.1' }
    ];
  }
}

