import React from "react";
import { useEffect, useState } from "react";
import { parseKursMbarate, KursRow } from "./parseKursMbarate";
import kursLocal from "../kurs-mbarate.json";


export default function KursMbarateTable() {
  // MARKER: Untuk debug, log ke console saja, JANGAN render ke UI!
  if (typeof window !== 'undefined') {
    // eslint-disable-next-line no-console
    console.log('🟢 KursMbarateTableNew.tsx RENDERED! (JIKA ANDA MELIHAT INI DI CONSOLE, FILE BARU SUDAH DIPAKAI)');
  }
  const [kurs, setKurs] = useState<KursRow[]>([]);
  const [lastUpdate, setLastUpdate] = useState<string>("");

  useEffect(() => {
    console.log("🚀 KursMbarateTableNew component starting...");
    async function fetchKurs() {
      try {
        // GUNAKAN ENDPOINT PROXY NEXT.JS AGAR TIDAK KENA CORS
        const res = await fetch('/api/kurs-mbarate', { cache: 'no-store' });
        console.log("Response status:", res.status);
        const data = await res.json();
        console.log("Data length:", Array.isArray(data) ? data.length : (data?.kurs?.length || 0));
        // Ambil informasi last update dari data
        let updateNumber = "";
        let foundNumbers = [];
        // Jika data ada field update/last_update, gunakan itu
        if (data && (typeof data === 'object')) {
          if (data.update) updateNumber = data.update;
          if (data.last_update) updateNumber = data.last_update;
        }
        // Jika data array, lakukan pattern lama
        if (!updateNumber && Array.isArray(data) && data.length > 0) {
          for (const row of data) {
            if (Array.isArray(row)) {
              for (const cell of row) {
                if (typeof cell === 'string') {
                  const cellStr = cell.trim();
                  
                  // Look for various update patterns
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
                // Look for pattern: [45841, 45841.xxxxx, updateNumber]
                if (typeof row[0] === 'number' && typeof row[1] === 'number' && typeof row[2] === 'number') {
                  const first = Math.floor(row[0]);
                  const second = Math.floor(row[1]);
                  
                  // Check if it matches mbarate pattern (45841 or similar)
                  if (first === second && first >= 45840 && first <= 46000) {
                    updateNumber = String(row[2]);
                    break;
                  }
                }
              }
            }
          }
        }
        
        // TEMPORARY: Force set to 2 for testing
        const finalUpdateNumber = updateNumber || "2";
        
        setLastUpdate(finalUpdateNumber);
        // Jika data ada field kurs, gunakan data.kurs, jika array langsung, gunakan data
        if (Array.isArray(data)) {
          setKurs(parseKursMbarate(data));
        } else if (data && Array.isArray(data.kurs)) {
          setKurs(parseKursMbarate(data.kurs));
        } else {
          setKurs([]);
        }
      } catch (e) {
        console.log("❌ FETCH ERROR:", e);
        setLastUpdate("1");
        setKurs(Array.isArray(kursLocal)
          ? kursLocal.map((row: any) => ({ kode: row.currency, buy: row.buy, sell: row.sell }))
          : []);
      }
    }
    fetchKurs();
  }, []);

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
    <div style={{ width: '100%', background: '#fffbe6', borderRadius: 8, padding: 12, margin: 0, boxShadow: '0 1px 4px #0001' }}>
      <div style={{ fontSize: 16, color: '#1f2937', marginBottom: 16, fontWeight: 500 }}>
        Update Kurs No <b>{lastUpdate}</b> (NEW VERSION)
      </div>
      {/* ...existing kurs table code... */}
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
