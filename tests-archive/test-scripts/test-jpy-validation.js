// Test JPY validation fix
const { validateCurrencyRate } = require('./src/utils/currencyValidation.ts');

// Mock kurs data
const kursData = [
  { "currency": "JPY", "buy": "110.50", "sell": "115.50" },
  { "currency": "USD New", "buy": "16050", "sell": "16300" }
];

console.log('=== JPY Validation Test ===');

// Test JPY validation
const jpyResult = validateCurrencyRate(kursData, 'JPY', 110, 'BNB');
console.log('JPY Input: 110');
console.log('JPY Valid Range:', jpyResult.validRange);
console.log('JPY Is Valid:', jpyResult.isValid);
console.log('Expected Range: ~105.5 - 120.5');

// Test USD validation (should still work)
const usdResult = validateCurrencyRate(kursData, 'USD', 16000, 'BNB');
console.log('\nUSD Input: 16000');
console.log('USD Valid Range:', usdResult.validRange);
console.log('USD Is Valid:', usdResult.isValid);
console.log('Expected Range: ~15950 - 16150');
