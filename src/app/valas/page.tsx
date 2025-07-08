"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { daftarValas } from "@/lib/valasData";
import ValasKodeTable from "@/components/ValasKodeTable";
const TabelValas = dynamic(() => import("./TabelValas"), { ssr: false });

export default function DaftarValasPage() {
  // Gunakan data dari valasData.ts yang sudah memiliki nomor urut
  const dataValas = daftarValas.slice(0, 35); // Batasi hanya 35 data

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="relative bg-gray-900 text-white py-8">
        <div className="relative px-0 pl-2.5 flex flex-col items-center justify-center text-center">
          <h1 className="text-4xl font-bold mb-2 text-center">Daftar Valas</h1>
          <p className="text-gray-300 text-center">Daftar mata uang asing yang tersedia</p>
        </div>
      </div>
      <div className="px-0 py-8 w-full">
        <div className="w-full max-w-none mx-auto bg-white rounded shadow py-6 border border-gray-200">
          <div className="mb-4 flex justify-start items-center">
            <Link href="/" className="inline-block px-4 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-800 transition-colors text-base font-semibold shadow">← Kembali</Link>
          </div>
          <TabelValas daftarValas={dataValas} />
          {/* Tabel Mapping Kode Valas */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-2 text-center text-blue-900">Tabel Mapping Kode Valas</h2>
            <ValasKodeTable />
          </div>
        </div>
      </div>
    </main>
  );
}
