# SOLUSI PERBAIKAN BUG CURRENCY CODE MAPPING

## Problem yang Diperbaiki
- Bug currency code mapping dimana semua currency di-map ke code "1" (USD)
- Specific issue: AUD seharusnya code "2" tapi tertulis "1"
- Function `getMainCurrencyCode` digunakan dengan parameter yang salah

## Root Cause Analysis
1. **Wrong Function Usage**: Di execute-ahk dan generate-ahk, `getMainCurrencyCode(currency)` dipanggil dengan string parameter, padahal function tersebut butuh object valas
2. **Missing Helper Function**: Tidak ada function yang benar untuk convert string currency ke currency code number
3. **Inconsistent Logic**: generate-ahk punya logic manual yang benar, tapi execute-ahk tidak

## Files yang Bermasalah
- `src/app/api/execute-ahk/route.ts` - Line 153: `getMainCurrencyCode(currency)` 
- `src/app/api/generate-ahk/route.ts` - Logic manual yang panjang dan redundant

## Solusi yang Diterapkan

### 1. Tambahkan Helper Function Baru di valasData.ts
```typescript
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
  
  // Fallback mapping untuk 33 currencies
  return fallbackMapping[currency] || '1' // default USD
}
```

### 2. Update Import Statements
```typescript
// BEFORE
import { daftarValas, getMainCurrencyCode } from '@/lib/valasData'

// AFTER  
import { daftarValas, getMainCurrencyCode, getCurrencyCodeNumber } from '@/lib/valasData'
```

### 3. Fix Function Call di execute-ahk/route.ts
```typescript
// BEFORE (WRONG)
let currencyCode = getMainCurrencyCode(currency) || '1'

// AFTER (CORRECT)
let currencyCode = getCurrencyCodeNumber(currency)
```

### 4. Simplify Logic di generate-ahk/route.ts
```typescript
// BEFORE (MANUAL MAPPING)
let currencyCode = '1' // default untuk USD
let valasItem = daftarValas.find(...)
if (valasItem) {
  currencyCode = valasItem.no.toString()
} else {
  // Long manual fallback mapping
}

// AFTER (USING HELPER)
let currencyCode = getCurrencyCodeNumber(currency)
```

## Currency Code Mapping (Corrected)
| Currency | Code | Previous Bug | Fixed |
|----------|------|--------------|-------|
| USD      | 1    | ✓ Correct    | ✓     |
| AUD      | 2    | ✗ Was 1      | ✓     |
| CAD      | 3    | ✗ Was 1      | ✓     |
| EUR      | 4    | ✗ Was 1      | ✓     |
| GBP      | 5    | ✗ Was 1      | ✓     |
| CHF      | 6    | ✗ Was 1      | ✓     |
| HKD      | 7    | ✗ Was 1      | ✓     |
| SGD      | 8    | ✗ Was 1      | ✓     |
| JPY      | 9    | ✗ Was 1      | ✓     |
| NZD      | 10   | ✗ Was 1      | ✓     |
| ...      | ...  | ...          | ...   |
| TRY      | 33   | ✗ Was 1      | ✓     |

## Testing & Validation

### 1. Test Logic Validation
```bash
node test-currency-codes.js
```
✅ All 33 currencies mapped correctly

### 2. Test dengan Server
- Buat transactions dengan multiple currencies berbeda
- Verify generated AHK script contains correct currency codes
- Check debug logs untuk currency code mapping

### 3. Test Real Usage
```javascript
const testData = {
  transactions: [
    { currency: 'USD', amount: 100, rate: 15000 },  // Code 1
    { currency: 'AUD', amount: 50, rate: 11000 },   // Code 2 ✓
    { currency: 'EUR', amount: 75, rate: 17000 },   // Code 4 ✓
    { currency: 'SGD', amount: 200, rate: 11500 }   // Code 8 ✓
  ]
}
```

## Expected Behavior Setelah Perbaikan
1. ✅ **USD**: Code 1 (unchanged)
2. ✅ **AUD**: Code 2 (was incorrectly 1)  
3. ✅ **EUR**: Code 4 (was incorrectly 1)
4. ✅ **SGD**: Code 8 (was incorrectly 1)
5. ✅ **All 33 currencies**: Correct mapping sesuai daftarValas
6. ✅ **Case insensitive**: "usd", "USD", "Usd" semua → Code 1
7. ✅ **Invalid currency**: Default ke USD (Code 1)
8. ✅ **Consistency**: generate-ahk dan execute-ahk menghasilkan code yang sama

## Debug Information
```javascript
// Debug logs will show:
Debug: Currency input = "AUD", Code = 2  // ✓ Now correct
Debug: Currency input = "EUR", Code = 4  // ✓ Now correct  
Debug: Currency input = "SGD", Code = 8  // ✓ Now correct

// Instead of previous bug:
Debug: Currency input = "AUD", Code = 1  // ✗ Was wrong
```

## Files Modified
1. ✅ `src/lib/valasData.ts` - Added getCurrencyCodeNumber function
2. ✅ `src/app/api/execute-ahk/route.ts` - Fixed import & function call
3. ✅ `src/app/api/generate-ahk/route.ts` - Updated import & simplified logic
4. ✅ `test-currency-codes.js` - Validation test script

## Status: ✅ COMPLETED
- ✅ Bug currency code mapping diperbaiki
- ✅ All 33 currencies map to correct codes
- ✅ Consistent behavior antara generate-ahk dan execute-ahk
- ✅ Test validation passed untuk semua currency
- ✅ Documentation complete

## Impact
- **Critical**: Multiple currency transactions sekarang menggunakan currency code yang benar
- **User Experience**: Script AHK akan input currency code yang tepat
- **System Reliability**: Consistency antara generator dan executor

---
*Dokumentasi dibuat: [Current Date]*
*Bug impact: HIGH - All non-USD currencies were incorrectly mapped*
*Fix priority: CRITICAL - Required for proper multi-currency functionality*
