import React from "react";
import { useEffect, useState } from "react";
import { parseKursMbarate, KursRow } from "./parseKursMbarate";
import kursLocal from "../kurs-mbarate.json";

interface KursMbarateTableProps {
  refreshTrigger?: string; // Trigger untuk refresh saat jenis transaksi berubah
  selectedCurrency?: string; // Mata uang yang dipilih untuk sorting dan highlighting
}

export default function KursMbarateTable({ refreshTrigger, selectedCurrency }: KursMbarateTableProps) {
  const [kurs, setKurs] = useState<KursRow[]>([]);
  const [lastUpdate, setLastUpdate] = useState<string>("");
  const [fetchError, setFetchError] = useState<string>("");

  useEffect(() => {
    async function fetchKurs() {
      try {
        const timestamp = Date.now();
        console.log("🔄 Fetching kurs data from proxy /api/kurs-mbarate...", new Date().toISOString());
        if (refreshTrigger) {
          console.log("📈 Refresh triggered by transaction type:", refreshTrigger);
        }
        const res = await fetch(`/api/kurs-mbarate?t=${timestamp}&v=2&force=true`, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });
        if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
        const data = await res.json();
        if (!data || !Array.isArray(data)) throw new Error("Data is not array");
        
        // Ambil informasi last update dari data
        let updateNumber = extractUpdateNumber(data);
        setLastUpdate(updateNumber || "1");
        setKurs(parseKursMbarate(data));
      } catch (e) {
        console.log("❌ FETCH ERROR:", e);
        setFetchError("Fetch error: " + (typeof e === 'object' && e && 'message' in e ? (e as any).message : String(e)));
        // Fallback ke kursLocal
        let updateNumber = extractUpdateNumberLocal(kursLocal);
        setLastUpdate(updateNumber || "1");
        setKurs(Array.isArray(kursLocal)
          ? kursLocal.map((row: any) => ({ kode: row.currency, buy: row.buy, sell: row.sell }))
          : []);
      }
    }
    
    // Hanya fetch jika refreshTrigger tidak kosong dan valid (BNB atau BNS)
    if (refreshTrigger && (refreshTrigger === 'BNB' || refreshTrigger === 'BNS')) {
      fetchKurs();
    } else if (!refreshTrigger) {
      // Initial load saat pertama kali komponen dimount
      fetchKurs();
    }
  }, [refreshTrigger]); // Refresh saat refreshTrigger berubah

  // Ekstrak update number dari data array (mbarate.net style)
  function extractUpdateNumber(data: any[]): string {
    let updateNumber = "";
    if (data.length > 0) {
      // Strategy 1: Look for explicit text patterns first
      for (const row of data) {
        if (Array.isArray(row)) {
          for (const cell of row) {
            if (typeof cell === 'string') {
              const cellStr = cell.trim();
              const patterns = [
                /last\s+update\s+(\d+)/i,
                /lastupdate\s*(\d+)/i,
                /update\s+(\d+)/i,
                /update\s+no\s*\.?\s*(\d+)/i,
                /kurs\s+no\s*\.?\s*(\d+)/i
              ];
              for (const pattern of patterns) {
                const match = cellStr.match(pattern);
                if (match) {
                  updateNumber = match[1];
                  break;
                }
              }
              if (updateNumber) break;
            }
          }
          if (updateNumber) break;
        }
      }
      // Strategy 2: Look for mbarate.net specific pattern - 45841 followed by decimal and then update number
      if (!updateNumber) {
        for (const row of data) {
          if (Array.isArray(row) && row.length >= 3) {
            if (typeof row[0] === 'number' && typeof row[1] === 'number' && typeof row[2] === 'number') {
              const first = Math.floor(row[0]);
              const second = Math.floor(row[1]);
              if (first === second && first >= 45840 && first <= 46000) {
                updateNumber = String(row[2]);
                break;
              }
            }
          }
        }
      }
    }
    return updateNumber;
  }

  // Ekstrak update number dari kursLocal (dummy)
  function extractUpdateNumberLocal(local: any[]): string {
    // Coba cari field "update" jika ada
    if (Array.isArray(local)) {
      for (const row of local) {
        if (row && typeof row.update === 'string') return row.update;
      }
    }
    // Atau hardcode "1" jika tidak ada
    return "1";
  }

  // Urutan kurs sesuai gambar
  const kursOrder = [
    "USD New", "USD 2nd", "USD 5-50", "USD putih", "USD pec 1/tdk layak",
    "EURO", "AUD", "CAD", "GBP", "CHF",
    "SGD : 1.000", "SGD : 2-100",
    "HKD : 500 - 1.000", "HKD : 10 - 100",
    "JPY", "MYR : 5 - 100", ": 1 - 2",
    "SAR : 500", ": 50 - 200", ": 1 - 20",
    "KWD : 5 - 20", ": 1", ": 0.25 - 0.5",
    "WON", "NT : 500 - 2.000", "NT : 100 - 200", ": 100 - 200",
    "BND : 50 - 1.000", ": 5 - 10", "NZD", "PHP", "THB",
    "YUAN : 50 - 100", ": 10 - 20",
    "AED : 50 - 1000", ": 5 - 20",
    "QTR : 50 - 500", ": 5 - 20", "; 1", "INR"
  ];

  // Filter: hanya baris yang bukan penjelasan, dan ambil satu dari setiap 3 duplikat
  // Hilangkan baris penjelasan (yang mengandung tanda ":" dan ada penjelasan di belakang nama mata uang)
  const isPenjelasan = (kode: string) => {
    const lower = kode.toLowerCase();
    return (
      lower.includes('jl margo utomo') ||
      lower.includes('usd pec 100') ||
      lower.includes('usd pth') ||
      // lower.includes('usd 1') || // HAPUS agar USD pec 1/tdk layak tidak terfilter
      lower.includes('catatan') ||
      lower.includes('kurs sewaktu') ||
      lower.includes('penjelasan') ||
      lower.includes('usd kondisi khusus') ||
      lower.match(/^no\b/) ||
      lower.match(/^sell\b/) ||
      lower.match(/^buy\b/) ||
      lower.match(/^coin\s?sar/) ||
      lower.match(/^: ?'1000/) ||
      lower.match(/^'\s*:?\s*1\b/) ||
      lower.match(/^:?\s*'\s*1\b/) ||
      lower.match(/^usd 5 - 20 ?:/) ||
      // lower.match(/^usd pec 1\b/) || // JANGAN FILTER agar tetap muncul
      lower.match(/^\s*$/)
    );
  };
  // Hilangkan baris penjelasan dan kosong
  // Filter khusus: hilangkan USD pec 1/15300 yang di bawah INR, tapi tetap tampilkan yang di bawah USD putih
  let kursFiltered = kurs.filter((row: KursRow, idx: number, arr: KursRow[]) => {
    // Sembunyikan baris : 5 - 20, : 100 - 200, : 10 - 20
    if (!row.kode || typeof row.kode !== 'string') return false;
    const kode = row.kode.trim();
    // Sembunyikan : 5 - 20, : 100 - 200, : 10 - 20 kecuali jika kode sebelumnya mengandung 'SAR'
    // Untuk baris SAR : 1 - 20, tetap tampil meskipun polanya sama dengan varian lain
    // Untuk SAR : 1 - 20, cek jika ada SAR di atasnya (bukan hanya baris sebelumnya)
    if (/^:\s*1\s*-\s*20$/i.test(kode)) {
      let foundSAR = false;
      for (let j = idx - 1; j >= 0; j--) {
        const kodePrev = arr[j]?.kode?.toUpperCase() || "";
        if (/^SAR/.test(kodePrev)) {
          foundSAR = true;
          break;
        }
        // Jika ketemu currency lain, stop
        if (/^[A-Z]{2,}/.test(kodePrev) && !/^SAR/.test(kodePrev)) break;
      }
      if (foundSAR) {
        return true;
      } else {
        return false;
      }
    }
    if (/^:\s*5\s*-\s*20$/i.test(kode)) {
      const prev = arr[idx-1]?.kode?.toUpperCase() || "";
      if (!prev.includes('SAR') && !prev.includes('AED') && !prev.includes('QTR')) return false;
    }
    if (/^:\s*100\s*-\s*200$/i.test(kode)) {
      const prev = arr[idx-1]?.kode?.toUpperCase() || "";
      if (!prev.includes('SAR') && !prev.includes('NT')) return false;
    }
    if (/^:\s*10\s*-\s*20$/i.test(kode)) {
      const prev = arr[idx-1]?.kode?.toUpperCase() || "";
      // Hanya izinkan : 10 - 20 setelah YUAN, bukan setelah SAR atau currency lain
      if (!prev.includes('YUAN')) return false;
    }
    // Sembunyikan CHF : 10-20
    if (/^CHF\s*:\s*10-20$/i.test(kode)) return false;
    // Sembunyikan : 5 - 10 setelah BND (yang di bawah NT)
    if (/^:\s*5\s*-\s*10$/i.test(kode)) {
      const prev = arr[idx-1]?.kode?.toUpperCase() || "";
      if (prev.includes('BND')) return false;
    }
    // Sembunyikan baris tambahan sesuai permintaan user (kecuali HKD : 10 - 100, : 1 - 20, KWD : 5 - 20, ': 1, : 0.25 - 0.5)
    if (/^CAD\s*:\s*5\s*-\s*20$/i.test(kode)) return false;
    // BND : 50 - 1.000 dikembalikan (tidak disembunyikan lagi)
    // if (/^BND\s*:\s*50\s*-\s*1\.000$/i.test(kode)) return false;
    // YUAN : 50 - 100 dikembalikan (tidak disembunyikan lagi)
    // if (/^YUAN\s*:\s*50\s*-\s*100$/i.test(kode)) return false;
    // Sembunyikan baris sesuai permintaan user
    // EURO : 5-20
    if (/^EURO\s*:\s*5\s*-\s*20$/i.test(kode)) return false;
    // HKD : 500-1.000 dikembalikan (tidak disembunyikan lagi)
    // if (/^HKD\s*:\s*500\s*-\s*1\.000$/i.test(kode)) return false;
    // Kembalikan : 1 - 2 (jangan disembunyikan)
    // 1 :
    if (/^1\s*:$/i.test(kode)) return false;
    // Hilangkan USD pec 1/15300 dan USD 1 : usd pec 1 dan pec 100 dengan coretan, cap, tulisan yang di bawah INR (bagian bawah tabel)
    const isUSD1Pec = (kode === 'USD pec 1' && (row.buy == 15300 || row.buy == '15300'));
    const isUSD1Penjelasan = kode.toLowerCase().startsWith('usd 1 : usd pec 1');
    // Jika baris ini USD pec 1/15300 atau penjelasan, dan ada INR di baris sebelumnya atau sebelumnya lagi (hingga baris awal), hapus SEMUA baris USD pec 1/15300 dan penjelasan SETELAH INR
    if ((isUSD1Pec || isUSD1Penjelasan)) {
      let foundINR = false;
      for (let i = idx - 1; i >= 0; i--) {
        const prev = arr[i];
        if (prev && prev.kode && typeof prev.kode === 'string' && prev.kode.toUpperCase().includes('INR')) {
          foundINR = true;
          break;
        }
      }
      if (foundINR) return false;
    }
    // Hilangkan baris penjelasan
    return !isPenjelasan(kode);
  });
  // Hilangkan duplikat: ambil hanya baris unik berdasarkan kode (case-insensitive, tanpa spasi)
  const seen = new Set<string>();
  kursFiltered = kursFiltered.filter((row: KursRow, idx: number, arr: KursRow[]) => {
    const kodeRaw = row.kode || '';
    const kode = kodeRaw.replace(/\s+/g, '').toUpperCase();
    
    // Kecualikan duplikat khusus untuk : 1 - 20 jika di bawah : 50 - 200
    if (/^:1-20$/i.test(kode)) {
      // Cek apakah ada : 50 - 200 di atasnya dalam blok
      let found50200 = false;
      for (let j = idx - 1; j >= 0; j--) {
        const kodePrev = (arr[j]?.kode || '').replace(/\s+/g, '').toUpperCase();
        if (kodePrev === ':50-200') { found50200 = true; break; }
        if (/^[A-Z]{2,}/.test(kodePrev)) break;
      }
      if (found50200) {
        // Hanya izinkan satu : 1 - 20 setelah : 50 - 200
        const sudahAda = arr.slice(0, idx).some((r: KursRow) => r && r.kode && r.kode.replace(/\s+/g, '').toUpperCase() === ':1-20' && (() => {
          let f50200 = false;
          for (let k = arr.indexOf(r) - 1; k >= 0; k--) {
            const kodePrev2 = (arr[k]?.kode || '').replace(/\s+/g, '').toUpperCase();
            if (kodePrev2 === ':50-200') { f50200 = true; break; }
            if (/^[A-Z]{2,}/.test(kodePrev2)) break;
          }
          return f50200;
        })());
        if (sudahAda) return false;
        return true;
      }
    }
    
    // Kecualikan duplikat untuk : 5 - 20 - izinkan multiple jika setelah currency berbeda
    if (/^:5-20$/i.test(kode)) {
      // Cari currency induk sebelumnya
      let parentCurrency = '';
      for (let j = idx - 1; j >= 0; j--) {
        const kodePrev = (arr[j]?.kode || '').toUpperCase();
        if (/^[A-Z]{2,}/.test(kodePrev) && !kodePrev.startsWith(':')) {
          parentCurrency = kodePrev.split(':')[0].trim();
          break;
        }
      }
      
      // Special case: untuk QTR, cek berdasarkan nilai buy juga
      if (parentCurrency === 'QTR' || !parentCurrency) {
        const buyStr = String(row.buy || '').replace(/\./g, '');
        if (buyStr === '4150') {
          parentCurrency = 'QTR_4150'; // unique identifier for QTR : 5 - 20 with value 4150
        }
      }
      
      // Buat key unik berdasarkan parent currency
      const uniqueKey = `${parentCurrency}:5-20`;
      if (seen.has(uniqueKey)) return false;
      seen.add(uniqueKey);
      return true;
    }
    
    if (!kode || seen.has(kode)) return false;
    seen.add(kode);
    return true;
  });
  // Sorting kurs sesuai urutan di atas, sisanya di bawah
  let kursSorted = [...kursFiltered].sort((a, b) => {
    const norm = (s: string) => (s || '').replace(/\s+/g, '').replace(/[:.]/g, '').toUpperCase();
    const kodeA = norm(a.kode);
    const kodeB = norm(b.kode);
    const idxA = kursOrder.findIndex(k => kodeA.startsWith(norm(k)));
    const idxB = kursOrder.findIndex(k => kodeB.startsWith(norm(k)));
    if (idxA === -1 && idxB === -1) return 0;
    if (idxA === -1) return 1;
    if (idxB === -1) return -1;
    return idxA - idxB;
  });

  // --- SORTING BERDASARKAN MATA UANG YANG DIPILIH ---
  if (selectedCurrency && selectedCurrency.trim() !== '') {
    const selectedCurrencyUpper = selectedCurrency.toUpperCase().trim();
    
    // Cari baris yang cocok dengan mata uang yang dipilih
    const matchedRows: KursRow[] = [];
    const otherRows: KursRow[] = [];
    
    kursSorted.forEach(row => {
      const kode = (row.kode || '').toUpperCase();
      const isMatch = 
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
        (selectedCurrencyUpper === 'QAR' && kode.includes('QTR'));
        
      if (isMatch) {
        matchedRows.push(row);
      } else {
        otherRows.push(row);
      }
    });
    
    // Gabungkan: matched rows di atas, other rows di bawah
    kursSorted = [...matchedRows, ...otherRows];
  }


  // --- Penempatan khusus : 1 - 20 di bawah : 50 - 200 ---
  const idx50200 = kursSorted.findIndex(row => typeof row.kode === 'string' && row.kode.replace(/\s+/g, '') === ':50-200');
  const idx120 = kursSorted.findIndex(row => typeof row.kode === 'string' && row.kode.replace(/\s+/g, '') === ':1-20');
  if (idx50200 !== -1 && idx120 !== -1 && idx120 !== idx50200 - 1) {
    const row120 = kursSorted.splice(idx120, 1)[0];
    kursSorted.splice(idx50200, 0, row120);
  }

  // --- Penempatan khusus SAR : 1 - 20 di bawah SAR : 50 - 200 ---
  const idxSAR50_200 = kursSorted.findIndex(row => typeof row.kode === 'string' && row.kode.toUpperCase().replace(/\s+/g, '') === 'SAR:50-200');
  const idx1_20 = kursSorted.findIndex(row => typeof row.kode === 'string' && row.kode.replace(/\s+/g, '') === ':1-20');
  if (idxSAR50_200 !== -1 && idx1_20 !== -1 && idx1_20 !== idxSAR50_200 + 1) {
    const row1_20 = kursSorted.splice(idx1_20, 1)[0];
    kursSorted.splice(idxSAR50_200 + 1, 0, row1_20);
  }

  // --- Penempatan khusus NT : 100 - 200 naik 1 baris dari posisi NT : 500 - 2.000 ---
  const idxNT500_2000 = kursSorted.findIndex(row => typeof row.kode === 'string' && row.kode.toUpperCase().replace(/\s+/g, '') === 'NT:500-2.000');
  const idx100_200 = kursSorted.findIndex(row => typeof row.kode === 'string' && row.kode.replace(/\s+/g, '') === ':100-200');
  if (idxNT500_2000 !== -1 && idx100_200 !== -1 && idx100_200 !== idxNT500_2000) {
    const row100_200 = kursSorted.splice(idx100_200, 1)[0];
    kursSorted.splice(idxNT500_2000, 0, row100_200);
  }

  // --- Penempatan khusus NZD: turunkan ke bawah ": 100 - 200" ---
  const idxNZD = kursSorted.findIndex(row => typeof row.kode === 'string' && row.kode.toUpperCase() === 'NZD');
  const idx100_200_variant = kursSorted.findIndex(row => typeof row.kode === 'string' && row.kode.replace(/\s+/g, '') === ':100-200');
  
  if (idxNZD !== -1 && idx100_200_variant !== -1 && idxNZD < idx100_200_variant) {
    // Pindahkan NZD ke posisi setelah ": 100 - 200"
    const nzdRow = kursSorted.splice(idxNZD, 1)[0];
    kursSorted.splice(idx100_200_variant, 0, nzdRow);
  }

  // --- Penempatan khusus BND dan NT : 100 - 200: tukar posisi ---
  const idxBND = kursSorted.findIndex(row => typeof row.kode === 'string' && row.kode.toUpperCase().replace(/\s+/g, '') === 'BND:50-1.000');
  const idxNT100_200 = kursSorted.findIndex(row => typeof row.kode === 'string' && row.kode.replace(/\s+/g, '') === ':100-200');
  
  if (idxBND !== -1 && idxNT100_200 !== -1 && idxBND < idxNT100_200) {
    // Tukar posisi: NT : 100 - 200 naik, BND : 50 - 1.000 turun
    const bndRow = kursSorted[idxBND];
    const nt100Row = kursSorted[idxNT100_200];
    kursSorted[idxBND] = nt100Row;
    kursSorted[idxNT100_200] = bndRow;
  }

  // --- Penempatan khusus : 10 - 20 di bawah YUAN : 50 - 100 ---
  const idxYUAN = kursSorted.findIndex(row => typeof row.kode === 'string' && row.kode.toUpperCase().replace(/\s+/g, '') === 'YUAN:50-100');
  const idx10_20 = kursSorted.findIndex(row => typeof row.kode === 'string' && row.kode.replace(/\s+/g, '') === ':10-20');
  
  if (idxYUAN !== -1 && idx10_20 !== -1 && idx10_20 !== idxYUAN + 1) {
    // Pindahkan : 10 - 20 ke posisi tepat setelah YUAN : 50 - 100
    const row10_20 = kursSorted.splice(idx10_20, 1)[0];
    kursSorted.splice(idxYUAN + 1, 0, row10_20);
  }

  // --- Pastikan AED : 50 - 1000 di bawah : 10 - 20 ---
  const idxAED = kursSorted.findIndex(row => typeof row.kode === 'string' && row.kode.toUpperCase().replace(/\s+/g, '') === 'AED:50-1000');
  const idx10_20_final = kursSorted.findIndex(row => typeof row.kode === 'string' && row.kode.replace(/\s+/g, '') === ':10-20');
  
  if (idxAED !== -1 && idx10_20_final !== -1 && idxAED < idx10_20_final) {
    // Tukar posisi: : 10 - 20 di atas, AED di bawah
    const aedRow = kursSorted[idxAED];
    const row10_20Final = kursSorted[idx10_20_final];
    kursSorted[idxAED] = row10_20Final;
    kursSorted[idx10_20_final] = aedRow;
  }

  // --- QTR positioning: tempatkan : 5 - 20 (4150) di antara QTR dan ; 1 ---
  const idxQTR = kursSorted.findIndex(row => typeof row.kode === 'string' && row.kode.toUpperCase().replace(/\s+/g, '') === 'QTR:50-500');
  const idxSemicolon1 = kursSorted.findIndex(row => typeof row.kode === 'string' && row.kode.replace(/\s+/g, '') === ';1');
  
  // Cari : 5 - 20 dengan nilai 4150 di mana saja dalam array
  let idxQTR5_20 = -1;
  for (let i = 0; i < kursSorted.length; i++) {
    const row = kursSorted[i];
    if (row && typeof row.kode === 'string' && row.kode.replace(/\s+/g, '') === ':5-20') {
      const buyStr = String(row.buy || '').replace(/\./g, '');
      if (buyStr === '4150' || row.buy === 4150 || row.buy === '4150') {
        idxQTR5_20 = i;
        break;
      }
    }
  }
  
  // Pindahkan : 5 - 20 (4150) ke posisi setelah QTR dan sebelum ; 1
  if (idxQTR !== -1 && idxSemicolon1 !== -1 && idxQTR5_20 !== -1) {
    // Ambil row : 5 - 20 (4150)
    const qtr5_20Row = kursSorted.splice(idxQTR5_20, 1)[0];
    
    // Update index ; 1 jika perlu (karena splice bisa mengubah index)
    const newIdxSemicolon1 = kursSorted.findIndex(row => typeof row.kode === 'string' && row.kode.replace(/\s+/g, '') === ';1');
    
    // Masukkan : 5 - 20 tepat sebelum ; 1 (setelah QTR)
    if (newIdxSemicolon1 !== -1) {
      kursSorted.splice(newIdxSemicolon1, 0, qtr5_20Row);
    }
  }

  // Buat array hasil filter untuk sembunyikan baris USD pec 1/15300 dan penjelasan setelah INR
  let kursDisplay: KursRow[] = [];
  let afterINR = false;
  for (let i = 0; i < kursSorted.length; i++) {
    const row = kursSorted[i];
    const kode = (row.kode || '').trim();
    if (kode.toUpperCase().includes('INR')) afterINR = true;
    const isUSD1Pec = (kode === 'USD pec 1' && (row.buy == 15300 || row.buy == '15300'));
    // Perbaikan: filter baris penjelasan USD 1 apapun setelah INR
    const isUSD1Penjelasan = kode.toLowerCase().startsWith('usd 1');
    if (afterINR && (isUSD1Pec || isUSD1Penjelasan)) {
      continue;
    }
    kursDisplay.push(row);
  }

  return (
    <div className="w-full" style={{ minWidth: 340, maxWidth: 420, position: 'relative', marginTop: '20px' }}>
      <div className="text-center" style={{ fontSize: '16px', fontWeight: 'bold', color: '#1f2937', marginBottom: '16px', marginTop: '10px', zIndex: 10, width: '100%' }}>
        Update Kurs No {lastUpdate}
        {fetchError && (
          <div style={{color: 'red', fontSize: 12, marginTop: 4}}>
            Error: {fetchError}
          </div>
        )}
      </div>
      <div className="overflow-hidden border border-black" style={{ minWidth: 340, maxWidth: 420, marginTop: '-4px' }}>
        <style>{`
          .kurs-table-scroll::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        <div className="kurs-table-scroll" style={{maxHeight: 13 * 38 + 2, overflowY: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none', position: 'relative'}}>
          <table className="w-full text-base mb-0 table-fixed border border-black bg-white" style={{ minWidth: 340, maxWidth: 420, borderCollapse: 'collapse', tableLayout: 'fixed', marginBottom: 0 }}>
            <colgroup>
              <col style={{minWidth: 220, width: '60%'}} />
              <col style={{width: '20%'}} />
              <col style={{width: '20%'}} />
            </colgroup>
            <thead style={{position: 'sticky', top: 0, zIndex: 100, background: '#2563eb', boxShadow: '0 -4px 0 0 #2563eb'}}>
              <tr>
                <th className="text-left pl-2 w-3/5 border border-black text-white" style={{background: '#2563eb'}}>Currency</th>
                <th className="text-center border border-black text-white" style={{background: '#2563eb'}}>Buy</th>
                <th className="text-center pr-0 border border-black text-white" style={{background: '#2563eb'}}>Sell</th>
              </tr>
            </thead>
            <tbody>
              {kursDisplay.length === 0 ? (
                <tr><td colSpan={3} className="text-center text-gray-400 border border-black">Tidak ada data kurs</td></tr>
              ) : kursDisplay.map((row: KursRow, idx: number) => {
                // Cek apakah baris ini cocok dengan mata uang yang dipilih
                const isSelectedCurrency = selectedCurrency && selectedCurrency.trim() !== '' ? (() => {
                  const selectedCurrencyUpper = selectedCurrency.toUpperCase().trim();
                  const kode = (row.kode || '').toUpperCase();
                  
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
                })() : false;

                // Cek apakah ini baris pertama atau terakhir dari grup mata uang yang dipilih
                const isFirstSelectedRow = isSelectedCurrency && (idx === 0 || !kursDisplay[idx - 1] || (() => {
                  if (!selectedCurrency) return true;
                  const selectedCurrencyUpper = selectedCurrency.toUpperCase().trim();
                  const prevKode = (kursDisplay[idx - 1].kode || '').toUpperCase();
                  
                  return !(
                    prevKode === selectedCurrencyUpper ||
                    prevKode.startsWith(selectedCurrencyUpper + ' ') ||
                    prevKode.startsWith(selectedCurrencyUpper + ':') ||
                    (selectedCurrencyUpper === 'USD' && prevKode.includes('USD')) ||
                    (selectedCurrencyUpper === 'EUR' && (prevKode.includes('EURO') || prevKode.includes('EUR'))) ||
                    (selectedCurrencyUpper === 'CNY' && prevKode.includes('YUAN')) ||
                    (selectedCurrencyUpper === 'KRW' && prevKode.includes('WON')) ||
                    (selectedCurrencyUpper === 'TWD' && prevKode.includes('NT')) ||
                    (selectedCurrencyUpper === 'QAR' && prevKode.includes('QTR'))
                  );
                })());

                const isLastSelectedRow = isSelectedCurrency && (idx === kursDisplay.length - 1 || !kursDisplay[idx + 1] || (() => {
                  if (!selectedCurrency) return true;
                  const selectedCurrencyUpper = selectedCurrency.toUpperCase().trim();
                  const nextKode = (kursDisplay[idx + 1].kode || '').toUpperCase();
                  
                  return !(
                    nextKode === selectedCurrencyUpper ||
                    nextKode.startsWith(selectedCurrencyUpper + ' ') ||
                    nextKode.startsWith(selectedCurrencyUpper + ':') ||
                    (selectedCurrencyUpper === 'USD' && nextKode.includes('USD')) ||
                    (selectedCurrencyUpper === 'EUR' && (nextKode.includes('EURO') || nextKode.includes('EUR'))) ||
                    (selectedCurrencyUpper === 'CNY' && nextKode.includes('YUAN')) ||
                    (selectedCurrencyUpper === 'KRW' && nextKode.includes('WON')) ||
                    (selectedCurrencyUpper === 'TWD' && nextKode.includes('NT')) ||
                    (selectedCurrencyUpper === 'QAR' && nextKode.includes('QTR'))
                  );
                })());

                // Style untuk border neon merah
                const borderStyle = isSelectedCurrency ? {
                  borderTop: isFirstSelectedRow ? '3px solid #ff0040' : '1px solid #black',
                  borderBottom: isLastSelectedRow ? '3px solid #ff0040' : '1px solid #black',
                  borderLeft: '3px solid #ff0040',
                  borderRight: '3px solid #ff0040',
                  boxShadow: '0 0 8px rgba(255, 0, 64, 0.5), inset 0 0 8px rgba(255, 0, 64, 0.1)',
                } : {};

                return (
                  <tr 
                    key={idx} 
                    className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                    style={borderStyle}
                  >
                    <td
                      className={"text-left w-3/5 border border-black"}
                      style={{
                        paddingLeft: (() => {
                          const kode = String(row.kode || '').trim();
                          if (!kode) return 42;
                          // Special padding for NT : 100 - 200
                          if (kode === ': 100 - 200') return 25;
                          if (/^:\s*\d/.test(kode)) return 42;
                          if (/^;\s*\d/.test(kode)) return 42;
                          return 4;
                        })(),
                        borderLeft: isSelectedCurrency ? 'none' : '1px solid black',
                        borderRight: isSelectedCurrency ? 'none' : '1px solid black',
                        borderTop: isSelectedCurrency ? 'none' : '1px solid black',
                        borderBottom: isSelectedCurrency ? 'none' : '1px solid black'
                      }}
                    >
                      {(() => {
                        const kode = (row as any).currency || row.kode;
                        return kode;
                      })()}
                    </td>

                    <td 
                      className="text-center border border-black"
                      style={{
                        borderLeft: isSelectedCurrency ? 'none' : '1px solid black',
                        borderRight: isSelectedCurrency ? 'none' : '1px solid black',
                        borderTop: isSelectedCurrency ? 'none' : '1px solid black',
                        borderBottom: isSelectedCurrency ? 'none' : '1px solid black'
                      }}
                    >
                      {formatRibuan(row.buy)}
                    </td>
                    <td 
                      className="text-center pr-0 border border-black"
                      style={{
                        borderLeft: isSelectedCurrency ? 'none' : '1px solid black',
                        borderRight: isSelectedCurrency ? 'none' : '1px solid black',
                        borderTop: isSelectedCurrency ? 'none' : '1px solid black',
                        borderBottom: isSelectedCurrency ? 'none' : '1px solid black'
                      }}
                    >
                      {formatRibuan(row.sell)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Format angka ribuan dengan tanda titik
function formatRibuan(val: string | number) {
  if (val === undefined || val === null || val === "") return "";
  const str = String(val);
  // Jika bukan angka, return str;
  if (!/^\d+(\.\d+)?$/.test(str.replace(/\./g, ""))) return str;
  // Pisahkan angka desimal
  const [intPart, dec] = str.split(".");
  const formatted = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return dec ? formatted + "," + dec : formatted;
}
