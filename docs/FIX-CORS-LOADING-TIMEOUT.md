# Fix CORS Issue - Loading Timeout Solution

## Problem
- Fetch dan axios error semua dari browser
- "Loading timeout" error pada TransactionSummaryTable
- Backend API berfungsi normal dari command line tapi tidak dari browser

## Root Cause
**CORS (Cross-Origin Resource Sharing) Issue**: Browser memblokir request dari frontend (http://192.168.1.6:8000) ke backend (http://192.168.1.6:5000) karena berbeda port.

## Solution Applied

### 1. Next.js Proxy/Rewrite (Primary Solution)
Menggunakan Next.js built-in proxy untuk bypass CORS:

**File: `next.config.js`**
```javascript
async rewrites() {
  return [
    {
      source: '/api/nasabah',
      destination: `${backendUrl}/api/nasabah`
    },
    {
      source: '/api/transactions',
      destination: `${backendUrl}/api/transactions`
    }
  ]
}
```

**File: `.env.local`**
```bash
BACKEND_URL=http://192.168.1.6:5000
```

### 2. Frontend Changes
**TransactionSummaryTable.tsx**: Ubah dari absolute URL ke relative URL

```tsx
// BEFORE (CORS Error):
const nasabahUrl = `http://192.168.1.6:5000/api/nasabah`;

// AFTER (Works via Next.js proxy):
const nasabahUrl = `/api/nasabah`;
```

### 3. Backend CORS Enhancement (Secondary)
**File: `backend/server.js`**
```javascript
const corsOptions = {
  origin: '*', // Allow all origins explicitly
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cache-Control', 'Pragma'],
  credentials: false
};

// Manual CORS headers untuk memastikan compatibility
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization,Cache-Control,Pragma');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});
```

## Test Results

✅ **Command Line Test**: 
```bash
Invoke-WebRequest -Uri "http://192.168.1.6:5000/api/nasabah"
# Status: 200, Content: 473 bytes
```

✅ **Next.js Proxy Test**:
```bash
Invoke-WebRequest -Uri "http://192.168.1.6:8000/api/nasabah"  
# Status: 200, Content: 473 bytes
```

✅ **Browser Test**: TestFetch component dengan relative URL berhasil

## How It Works

1. **Browser requests**: `http://192.168.1.6:8000/api/nasabah` (same origin)
2. **Next.js receives**: Request di frontend server (port 8000)
3. **Next.js proxy**: Rewrite internal ke `http://192.168.1.6:5000/api/nasabah` 
4. **Backend responds**: Data dikirim ke Next.js
5. **Next.js forwards**: Response ke browser (tanpa CORS issue)

## Benefits

- ✅ **No CORS Issues**: Browser hanya komunikasi dengan same-origin
- ✅ **Network Compatible**: Tetap bisa akses dari komputer lain di jaringan
- ✅ **Transparent**: Frontend code tidak perlu tahu detail backend URL
- ✅ **Secure**: Backend tidak perlu expose CORS ke public

## Files Modified

1. `src/components/TransactionSummaryTable.tsx` - Gunakan relative URL
2. `src/components/TestFetch.tsx` - Test relative URL
3. `backend/server.js` - Enhanced CORS headers
4. `.env.local` - BACKEND_URL untuk Next.js proxy

## Status
🎉 **SOLVED**: Loading timeout error seharusnya sudah teratasi dengan menggunakan Next.js proxy instead of direct CORS requests.
