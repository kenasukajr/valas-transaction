"use client";

import React, { useState } from "react";

function formatDate(dateString: string): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  const day = ("0" + date.getDate()).slice(-2);
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

interface Nasabah {
  name: string;
  address: string;
  phone: string;
  job: string;
  idNumber: string;
  tglLahir: string;
  tempatLahir: string;
  jenisKelamin: string;
  agama: string;
  statusPerkawinan: string;
  pendidikan: string;
  namaIbuKandung: string;
  alamatKTP: string;
  alamatDomisili: string;
  noTelp: string;
  noHP: string;
  email: string;
  npwp: string;
  namaPasangan: string;
  pekerjaanPasangan: string;
  penghasilanPasangan: string;
  namaAhliWaris: string;
  hubunganAhliWaris: string;
  alamatAhliWaris: string;
  noTelpAhliWaris: string;
  noHPAhliWaris: string;
}

interface NasabahTableProps {
  data: Nasabah[];
}

export default function NasabahTable({ data }: NasabahTableProps) {
  const [selectedNasabah, setSelectedNasabah] = useState<Nasabah | null>(null);

  const openModal = (nasabah: Nasabah) => {
    setSelectedNasabah(nasabah);
  };

  const closeModal = () => {
    setSelectedNasabah(null);
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-md">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="text-center py-2 px-4 border-b">Name</th>
              <th className="text-center py-2 px-4 border-b">Address</th>
              <th className="text-center py-2 px-4 border-b">Phone</th>
              <th className="text-center py-2 px-4 border-b">ID Number</th>
              <th className="text-left py-2 px-4 border-b">Tempat Lahir</th>
              <th className="text-left py-2 px-4 border-b">Tgl Lahir</th>
              <th className="text-left py-2 px-4 border-b">Jenis Kelamin</th>
              <th className="text-left py-2 px-4 border-b">Agama</th>
              <th className="text-left py-2 px-4 border-b">Status Perkawinan</th>
              <th className="text-left py-2 px-4 border-b">Pendidikan</th>
              <th className="text-left py-2 px-4 border-b">Job</th>
              <th className="text-left py-2 px-4 border-b">Nama Ibu Kandung</th>
              <th className="text-left py-2 px-4 border-b">Alamat KTP</th>
              <th className="text-left py-2 px-4 border-b">Alamat Domisili</th>
              <th className="text-left py-2 px-4 border-b">No Telp</th>
              <th className="text-left py-2 px-4 border-b">No HP</th>
              <th className="text-left py-2 px-4 border-b">Email</th>
              <th className="text-left py-2 px-4 border-b">NPWP</th>
              <th className="text-left py-2 px-4 border-b">Nama Pasangan</th>
              <th className="text-left py-2 px-4 border-b">Pekerjaan Pasangan</th>
              <th className="text-left py-2 px-4 border-b">Penghasilan Pasangan</th>
              <th className="text-left py-2 px-4 border-b">Nama Ahli Waris</th>
              <th className="text-left py-2 px-4 border-b">Hubungan Ahli Waris</th>
              <th className="text-left py-2 px-4 border-b">Alamat Ahli Waris</th>
              <th className="text-left py-2 px-4 border-b">No Telp Ahli Waris</th>
              <th className="text-left py-2 px-4 border-b">No HP Ahli Waris</th>
              <th className="text-left py-2 px-4 border-b">Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((nasabah, index) => (
              <tr
                key={index}
                className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="text-center py-2 px-4 border-b">{nasabah.name}</td>
                <td className="text-center py-2 px-4 border-b">{nasabah.address}</td>
                <td className="text-center py-2 px-4 border-b">{nasabah.phone}</td>
                <td className="text-center py-2 px-4 border-b">{nasabah.idNumber}</td>
                <td className="py-2 px-4 border-b">{nasabah.tempatLahir}</td>
                <td className="py-2 px-4 border-b">{formatDate(nasabah.tglLahir)}</td>
                <td className="py-2 px-4 border-b">{nasabah.jenisKelamin}</td>
                <td className="py-2 px-4 border-b">{nasabah.agama}</td>
                <td className="py-2 px-4 border-b">{nasabah.statusPerkawinan}</td>
                <td className="py-2 px-4 border-b">{nasabah.pendidikan}</td>
                <td className="py-2 px-4 border-b">{nasabah.job}</td>
                <td className="py-2 px-4 border-b">{nasabah.namaIbuKandung}</td>
                <td className="py-2 px-4 border-b">{nasabah.alamatKTP}</td>
                <td className="py-2 px-4 border-b">{nasabah.alamatDomisili}</td>
                <td className="py-2 px-4 border-b">{nasabah.noTelp}</td>
                <td className="py-2 px-4 border-b">{nasabah.noHP}</td>
                <td className="py-2 px-4 border-b">{nasabah.email}</td>
                <td className="py-2 px-4 border-b">{nasabah.npwp}</td>
                <td className="py-2 px-4 border-b">{nasabah.namaPasangan}</td>
                <td className="py-2 px-4 border-b">{nasabah.pekerjaanPasangan}</td>
                <td className="py-2 px-4 border-b">{nasabah.penghasilanPasangan}</td>
                <td className="py-2 px-4 border-b">{nasabah.namaAhliWaris}</td>
                <td className="py-2 px-4 border-b">{nasabah.hubunganAhliWaris}</td>
                <td className="py-2 px-4 border-b">{nasabah.alamatAhliWaris}</td>
                <td className="py-2 px-4 border-b">{nasabah.noTelpAhliWaris}</td>
                <td className="py-2 px-4 border-b">{nasabah.noHPAhliWaris}</td>
                <td className="py-2 px-4 border-b">
                  <button
                    onClick={() => openModal(nasabah)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {selectedNasabah && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-lg p-6 max-w-md w-full overflow-y-auto max-h-[80vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4">Nasabah Details</h2>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {Object.entries(selectedNasabah).map(([key, value]) => (
                <div key={key} className="flex justify-between border-b py-1">
                  <span className="font-semibold capitalize">{key}</span>
                  <span>{value}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={closeModal}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
