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

  // Mapping nama lengkap untuk semua kode mata uang
  const namaLengkap: Record<string, string> = {
    // Mata uang utama
    USD: 'US Dollar',
    USK: 'US Dollar Kecil',
    USB: 'US Dollar Besar',
    EUR: 'Euro',
    JPY: 'Japanese Yen',
    GBP: 'British Pound Sterling',
    AUD: 'Australian Dollar',
    CAD: 'Canadian Dollar',
    CHF: 'Swiss Franc',
    CNY: 'Chinese Yuan',
    YUA: 'Chinese Yuan',
    HKD: 'Hong Kong Dollar',
    SGD: 'Singapore Dollar',
    NZD: 'New Zealand Dollar',
    
    // Mata uang Asia
    KRW: 'South Korean Won',
    KPW: 'South Korean Won',
    THB: 'Thai Baht',
    MYR: 'Malaysian Ringgit',
    INR: 'Indian Rupee',
    PHP: 'Philippine Peso',
    VND: 'Vietnamese Dong',
    TWD: 'Taiwan New Dollar',
    
    // Mata uang Timur Tengah & Afrika
    SAR: 'Saudi Arabian Riyal',
    AED: 'UAE Dirham',
    UEA: 'UAE Dirham',
    QAR: 'Qatari Riyal',
    QTR: 'Qatari Riyal',
    KWD: 'Kuwaiti Dinar',
    BHD: 'Bahraini Dinar',
    OMR: 'Omani Rial',
    JOD: 'Jordanian Dinar',
    LBP: 'Lebanese Pound',
    EGP: 'Egyptian Pound',
    ZAR: 'South African Rand',
    
    // Mata uang lainnya
    NOK: 'Norwegian Krone',
    SEK: 'Swedish Krona',
    DKK: 'Danish Krone',
    PLN: 'Polish Zloty',
    CZK: 'Czech Koruna',
    HUF: 'Hungarian Forint',
    RUB: 'Russian Ruble',
    TRY: 'Turkish Lira',
    ILS: 'Israeli New Shekel',
    BRL: 'Brazilian Real',
    MXN: 'Mexican Peso',
    CLP: 'Chilean Peso',
    COP: 'Colombian Peso',
    PEN: 'Peruvian Sol',
    // Penambahan sesuai request user
    BND: 'Brunei Dollar',
    IQD: 'Iraqi Dinar'
  };

  const gabungan = valasKode.map((mapping) => {
    const utama = dataUtamaMap[mapping.valas];
    return {
      no: mapping.kode,
      kode: mapping.valas,
      nama: namaLengkap[mapping.valas] ?? utama?.nama ?? mapping.valas,
    };
  });

  // Bagi data menjadi 3 bagian
  const itemsPerSection = Math.ceil(gabungan.length / 3);
  const section1 = gabungan.slice(0, itemsPerSection);
  const section2 = gabungan.slice(itemsPerSection, itemsPerSection * 2);
  const section3 = gabungan.slice(itemsPerSection * 2);

  // Komponen untuk render tabel individual
  const renderTable = (data: typeof gabungan, title: string) => (
    <div className="mb-6">
      <h3 className="text-lg font-bold text-gray-800 mb-3 text-center">{title}</h3>
      <div className="shadow overflow-hidden border border-gray-400 rounded-lg">
        <table className="w-full text-base table-fixed rounded-lg overflow-hidden">
          <colgroup>
            <col style={{ width: '15%' }} />
            <col style={{ width: '25%' }} />
            <col style={{ width: '60%' }} />
          </colgroup>
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-2 py-2 text-center font-bold">No</th>
              <th className="border border-gray-300 px-2 py-2 text-center font-bold">Kode</th>
              <th className="border border-gray-300 px-2 py-2 text-left font-bold">Nama</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, idx) => (
              <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="border border-gray-300 px-2 py-1 text-center font-bold">{item.no}</td>
                <td className="border border-gray-300 px-2 py-1 text-center font-mono font-bold">{item.kode}</td>
                <td className="border border-gray-300 px-2 py-1 text-left">{item.nama}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bagian 1 */}
        <div>
          {renderTable(section1, "Mata Uang 1-12")}
        </div>
        
        {/* Bagian 2 */}
        <div>
          {renderTable(section2, "Mata Uang 13-24")}
        </div>
        
        {/* Bagian 3 */}
        <div>
          {renderTable(section3, "Mata Uang 25-35")}
        </div>
      </div>
      
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
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