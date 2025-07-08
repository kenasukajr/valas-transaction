
import React from "react";
import valasKode from "../valasKode.json";

interface ValasItem {
  no: number;
  kode: string;
  nama: string;
}

interface TabelValasProps {
  daftarValas: ValasItem[];
}


export default function TabelValas({ daftarValas }: TabelValasProps) {
  // Buat map kode->data utama (untuk lookup nama)
  const dataUtamaMap: Record<string, ValasItem> = {};
  daftarValas.forEach((item) => {
    dataUtamaMap[item.kode] = item;
  });

  // Urutkan dan tampilkan sesuai urutan valasKode.json
  // Mapping nama khusus untuk kode valas tertentu
  const namaKhusus: Record<string, string> = {
    USK: 'US Dollar Kecil',
    USB: 'US Dollar Besar',
    KPW: 'Won Korea',
    YUA: 'Yuan China',
    UEA: 'Dirham Uni Emirat Arab',
    QTR: 'Riyal Qatar',
  };

  const gabungan = valasKode.map((mapping) => {
    const utama = dataUtamaMap[mapping.valas];
    return {
      no: mapping.kode,
      kode: mapping.valas,
      nama: namaKhusus[mapping.valas] ?? utama?.nama ?? '',
      kodeMapping: mapping.kode,
    };
  });

  // Layout 3 kolom
  const kolom = 3;
  const baris = Math.ceil(gabungan.length / kolom);
  const rows = Array.from({ length: baris }, (_, rowIdx) =>
    Array.from({ length: kolom }, (_, colIdx) => {
      const index = rowIdx + colIdx * baris;
      return index < gabungan.length ? gabungan[index] : null;
    })
  );

  return (
    <div className="w-full">
      <div className="shadow overflow-hidden border border-gray-400 rounded-lg mb-2">
        <table className="w-full text-base mb-0 table-fixed rounded-lg overflow-hidden">
          <colgroup>
            <col style={{ width: '10%' }} />
            <col style={{ width: '15%' }} />
            <col style={{ width: '25%' }} />
            <col style={{ width: '15%' }} /> {/* Kode Mapping */}
            <col style={{ width: '10%' }} />
            <col style={{ width: '15%' }} />
            <col style={{ width: '25%' }} />
            <col style={{ width: '15%' }} /> {/* Kode Mapping */}
            <col style={{ width: '10%' }} />
            <col style={{ width: '15%' }} />
            <col style={{ width: '25%' }} />
            <col style={{ width: '15%' }} /> {/* Kode Mapping */}
          </colgroup>
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-2 py-2 text-center font-bold">No</th>
              <th className="border border-gray-300 px-2 py-2 text-center font-bold">Kode</th>
              <th className="border border-gray-300 px-2 py-2 text-left font-bold">Nama</th>
              <th className="border border-gray-300 px-2 py-2 text-center font-bold">Kode Mapping</th>
              <th className="border border-gray-300 px-2 py-2 text-center font-bold">No</th>
              <th className="border border-gray-300 px-2 py-2 text-center font-bold">Kode</th>
              <th className="border border-gray-300 px-2 py-2 text-left font-bold">Nama</th>
              <th className="border border-gray-300 px-2 py-2 text-center font-bold">Kode Mapping</th>
              <th className="border border-gray-300 px-2 py-2 text-center font-bold">No</th>
              <th className="border border-gray-300 px-2 py-2 text-center font-bold">Kode</th>
              <th className="border border-gray-300 px-2 py-2 text-left font-bold">Nama</th>
              <th className="border border-gray-300 px-2 py-2 text-center font-bold">Kode Mapping</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIdx) => (
              <tr key={rowIdx} className={rowIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                {row.map((item, colIdx) =>
                  item ? (
                    <React.Fragment key={`${rowIdx}-${colIdx}`}>
                      <td className="border border-gray-300 px-2 py-1 text-center font-bold">{item.no}</td>
                      <td className="border border-gray-300 px-2 py-1 text-center font-mono font-bold">{item.kode}</td>
                      <td className="border border-gray-300 px-2 py-1 text-left">{item.nama}</td>
                      <td className="border border-gray-300 px-2 py-1 text-center font-mono font-bold">{item.kodeMapping !== undefined && item.kodeMapping !== null ? item.kodeMapping : '-'}</td>
                    </React.Fragment>
                  ) : (
                    <React.Fragment key={`${rowIdx}-${colIdx}-empty`}>
                      <td className="border border-gray-300 px-2 py-1"></td>
                      <td className="border border-gray-300 px-2 py-1"></td>
                      <td className="border border-gray-300 px-2 py-1"></td>
                      <td className="border border-gray-300 px-2 py-1"></td>
                    </React.Fragment>
                  )
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="text-lg font-bold text-blue-800 mb-2">Cara Penggunaan:</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• <strong>Masukkan nomor urut</strong> (1-35) di field "Code" pada form transaksi valas</li>
          <li>• <strong>Klik tombol "Cek"</strong> untuk mendapatkan kode mata uang</li>
          <li>• Contoh: ketik "1" → tekan "Cek" → akan muncul "USD" di field Currency</li>
          <li>• Atau langsung masukkan kode mata uang (USD, EUR, dll) untuk pencarian terbalik</li>
        </ul>
      </div>
    </div>
  );
}
