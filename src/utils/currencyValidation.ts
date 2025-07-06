interface KursData {
  currency: string;
  buy: string;
  sell: string;
}

interface ValidationRange {
  min: number;
  max: number;
}

interface CurrencyValidationResult {
  isValid: boolean;
  validRange: ValidationRange;
  rateType: 'buy' | 'sell';
}

// Fungsi untuk mendapatkan tolerance berdasarkan range harga
function getTolerance(price: number): number {
  if (price >= 10000) {
    // Harga puluhan ribu (USD, EURO, dll): ±100
    return 100;
  } else if (price >= 100) {
    // Harga ratusan (THB, dll): ±50
    return 50;
  } else if (price >= 1) {
    // Harga satuan (VND, dll): ±0.10
    return 0.10;
  } else {
    // Harga desimal: ±0.05
    return 0.05;
  }
}

// Fungsi untuk mendapatkan range kurs untuk mata uang tertentu
function getCurrencyRanges(kursData: KursData[], selectedCurrency: string): { buyRange: ValidationRange | null; sellRange: ValidationRange | null } {
  if (!selectedCurrency) return { buyRange: null, sellRange: null };

  const selectedCurrencyUpper = selectedCurrency.toUpperCase().trim();
  
  // Filter data kurs berdasarkan mata uang yang dipilih
  const matchedRates = kursData.filter(rate => {
    const kode = rate.currency.toUpperCase();
    
    return (
      // Exact match dengan kode currency
      kode === selectedCurrencyUpper ||
      // Match dengan currency yang diikuti spasi atau ":"
      kode.startsWith(selectedCurrencyUpper + ' ') ||
      kode.startsWith(selectedCurrencyUpper + ':') ||
      // Match untuk USD variants (USD New, USD 2nd, dll)
      (selectedCurrencyUpper === 'USD' && kode.includes('USD')) ||
      // Match untuk EURO
      (selectedCurrencyUpper === 'EUR' && (kode.includes('EURO') || kode.includes('EUR'))) ||
      // Match untuk YUAN/CNY
      (selectedCurrencyUpper === 'CNY' && kode.includes('YUAN')) ||
      // Match untuk WON/KRW  
      (selectedCurrencyUpper === 'KRW' && kode.includes('WON')) ||
      // Match untuk NT/TWD
      (selectedCurrencyUpper === 'TWD' && kode.includes('NT')) ||
      // Match untuk QTR/QAR
      (selectedCurrencyUpper === 'QAR' && kode.includes('QTR'))
    );
  });

  if (matchedRates.length === 0) {
    return { buyRange: null, sellRange: null };
  }

  // Ambil semua harga buy dan sell yang valid
  const buyPrices = matchedRates
    .map(rate => parseFloat(rate.buy.replace(/\./g, '').replace(/,/g, '.')))
    .filter(price => !isNaN(price) && price > 0);
    
  const sellPrices = matchedRates
    .map(rate => parseFloat(rate.sell.replace(/\./g, '').replace(/,/g, '.')))
    .filter(price => !isNaN(price) && price > 0);

  let buyRange: ValidationRange | null = null;
  let sellRange: ValidationRange | null = null;

  // Hitung range untuk buy
  if (buyPrices.length > 0) {
    const minBuy = Math.min(...buyPrices);
    const maxBuy = Math.max(...buyPrices);
    const tolerance = getTolerance(maxBuy);
    
    buyRange = {
      min: minBuy - tolerance,
      max: maxBuy + tolerance
    };
  }

  // Hitung range untuk sell
  if (sellPrices.length > 0) {
    const minSell = Math.min(...sellPrices);
    const maxSell = Math.max(...sellPrices);
    const tolerance = getTolerance(maxSell);
    
    sellRange = {
      min: minSell - tolerance,
      max: maxSell + tolerance
    };
  }

  return { buyRange, sellRange };
}

// Fungsi utama untuk validasi rate
export function validateCurrencyRate(
  kursData: KursData[], 
  selectedCurrency: string, 
  enteredRate: number, 
  transactionType: string
): CurrencyValidationResult {
  
  const { buyRange, sellRange } = getCurrencyRanges(kursData, selectedCurrency);
  
  // Tentukan apakah ini buy atau sell berdasarkan jenis transaksi
  // BNS (Beli Nota Segar) = Buy rate, JNS (Jual Nota Segar) = Sell rate
  const isBuyTransaction = transactionType === 'BNS';
  const targetRange = isBuyTransaction ? buyRange : sellRange;
  
  if (!targetRange) {
    // Jika tidak ada data kurs, anggap valid
    return {
      isValid: true,
      validRange: { min: 0, max: 0 },
      rateType: isBuyTransaction ? 'buy' : 'sell'
    };
  }
  
  const isValid = enteredRate >= targetRange.min && enteredRate <= targetRange.max;
  
  return {
    isValid,
    validRange: targetRange,
    rateType: isBuyTransaction ? 'buy' : 'sell'
  };
}

export type { CurrencyValidationResult, ValidationRange, KursData };
