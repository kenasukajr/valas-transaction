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
function getTolerance(price: number, currency?: string): number {
  // Special case untuk JPY
  if (currency && currency.toUpperCase() === 'JPY') {
    // JPY tolerance: ±5 (110.50 ± 5 = 105.50 - 115.50)
    return 5;
  }
  
  if (price >= 10000) {
    // Harga puluhan ribu (USD, EURO, dll): ±100
    return 100;
  } else if (price >= 100) {
    // Harga ratusan (THB 480, dll): ±50
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
import { getMainCurrencyCode } from "@/lib/valasData";
function getCurrencyRanges(kursData: KursData[], selectedCurrency: string): { buyRange: ValidationRange | null; sellRange: ValidationRange | null } {
  if (!selectedCurrency) return { buyRange: null, sellRange: null };

  // Normalisasi alias USK/USB ke USD
  let selectedCurrencyUpper = selectedCurrency.toUpperCase().trim();
  let mainCode = getMainCurrencyCode({ kode: selectedCurrencyUpper })?.toUpperCase() || selectedCurrencyUpper;
  if (mainCode === 'USK' || mainCode === 'USB') mainCode = 'USD';

  // Filter data kurs berdasarkan mata uang yang dipilih
  const matchedRates = kursData.filter(rate => {
    const kode = rate.currency.toUpperCase();
    return (
      kode === mainCode ||
      kode.startsWith(mainCode + ' ') ||
      kode.startsWith(mainCode + ':') ||
      (mainCode === 'USD' && kode.includes('USD')) ||
      (mainCode === 'EUR' && (kode.includes('EURO') || kode.includes('EUR')))
      || (mainCode === 'CNY' && kode.includes('YUAN'))
      || (mainCode === 'KRW' && kode.includes('WON'))
      || (mainCode === 'TWD' && kode.includes('NT'))
      || (mainCode === 'QAR' && kode.includes('QTR'))
    );
  });

  if (matchedRates.length === 0) {
    return { buyRange: null, sellRange: null };
  }

  // Ambil semua harga buy yang valid
  const buyPrices = matchedRates
    .map(rate => {
      let buyStr = rate.buy.trim();
      if (selectedCurrencyUpper === 'JPY') {
        return parseFloat(buyStr);
      } else {
        return parseFloat(buyStr.replace(/\./g, '').replace(/,/g, '.'));
      }
    })
    .filter(price => !isNaN(price) && price > 0);

  // Ambil semua harga sell yang valid
  const sellPrices = matchedRates
    .map(rate => {
      let sellStr = (rate.sell || '').trim();
      if (!sellStr) return NaN;
      if (selectedCurrencyUpper === 'JPY') {
        return parseFloat(sellStr);
      } else {
        return parseFloat(sellStr.replace(/\./g, '').replace(/,/g, '.'));
      }
    })
    .filter(price => !isNaN(price) && price > 0);

  let buyRange: ValidationRange | null = null;
  let sellRange: ValidationRange | null = null;

  // Hitung range berdasarkan harga buy (dari terkecil sampai terbesar + tolerance)
  if (buyPrices.length > 0) {
    const minBuy = Math.min(...buyPrices);
    const maxBuy = Math.max(...buyPrices);
    const tolerance = getTolerance(maxBuy, selectedCurrency);
    buyRange = {
      min: minBuy - tolerance,
      max: maxBuy + tolerance
    };
  }

  // Hitung range berdasarkan harga sell (dari terkecil sampai terbesar + tolerance)
  if (sellPrices.length > 0) {
    const minSell = Math.min(...sellPrices);
    const maxSell = Math.max(...sellPrices);
    const tolerance = getTolerance(maxSell, selectedCurrency);
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
  // BNB (Beli Nota Biasa) = Buy rate, BNS (Beli Nota Segar) = Sell rate
  const isBuyTransaction = transactionType === 'BNB';
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
