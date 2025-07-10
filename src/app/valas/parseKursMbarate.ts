// Fungsi parsing kurs mbarate.net agar semua blok 3 kolom per baris diambil
export type KursRow = {
  kode: string;
  buy: string | number;
  sell: string | number;
};

export function parseKursMbarate(data: any[][]): KursRow[] {
  const kursRows: KursRow[] = [];
  for (const row of data) {
    // Gabungkan blok HKD : 500 - 1.000 dan HKD : 10 - 100 jika ada di baris yang sama
    let hkd500 = null, hkd10 = null;
    // --- Penanda blok NT ---
    let lastNT = false;
    for (let i = 0; i < row.length; i += 4) {
      const kode = row[i];
      const buy = row[i + 1];
      const sell = row[i + 2];
      // Gabung HKD
      if (typeof kode === 'string' && kode.trim().toUpperCase().startsWith('HKD : 500')) {
        hkd500 = { kode: kode.trim(), buy: buy ?? '', sell: sell ?? '' };
      } else if (typeof kode === 'string' && kode.trim().toUpperCase().startsWith('HKD : 10')) {
        hkd10 = { kode: kode.trim(), buy: buy ?? '', sell: sell ?? '' };
      // Deteksi NT : 500 - 2.000
      } else if (typeof kode === 'string' && kode.trim().toUpperCase().startsWith('NT : 500')) {
        kursRows.push({ kode: kode.trim(), buy: buy ?? '', sell: sell ?? '' });
        lastNT = true;
      // Deteksi varian NT lain (awalan : ... setelah NT utama)
      } else if (typeof kode === 'string' && kode.trim().startsWith(':')) {
        if (lastNT) {
          kursRows.push({ kode: kode.trim(), buy: buy ?? '', sell: sell ?? '' });
        } else {
          kursRows.push({ kode: kode.trim(), buy: buy ?? '', sell: sell ?? '' });
        }
      } else if (
        typeof kode === 'string' && kode.trim() &&
        kode.toUpperCase() !== 'CURRENCY' &&
        kode.toUpperCase().indexOf('KURS') === -1 &&
        kode.toUpperCase().indexOf('CATATAN') === -1 &&
        kode.toUpperCase().indexOf('PENJELASAN') === -1
      ) {
        kursRows.push({ kode: kode.trim(), buy: buy ?? '', sell: sell ?? '' });
        lastNT = false;
      }
    }
    // Gabung HKD
    if (hkd500 && hkd10) {
      kursRows.push({
        kode: 'HKD : 500 - 1.000 / 10 - 100',
        buy: `${hkd500.buy} / ${hkd10.buy}`,
        sell: `${hkd500.sell} / ${hkd10.sell}`
      });
    } else {
      if (hkd500) kursRows.push(hkd500);
      if (hkd10) kursRows.push(hkd10);
    }
  }
  return kursRows;
}
