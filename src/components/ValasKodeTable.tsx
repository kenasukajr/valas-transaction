import React from "react";
import valasKode from "../app/valasKode.json";

export default function ValasKodeTable() {
  return (
    <div className="overflow-x-auto mt-6">
      <table className="min-w-[300px] border border-gray-300 text-sm">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="border border-gray-300 px-2 py-1 text-center">Kode</th>
            <th className="border border-gray-300 px-2 py-1 text-center">Valas</th>
          </tr>
        </thead>
        <tbody>
          {valasKode.map((item: { kode: number; valas: string }) => (
            <tr key={item.kode}>
              <td className="border border-gray-300 px-2 py-1 text-center">{item.kode}</td>
              <td className="border border-gray-300 px-2 py-1 text-center">{item.valas}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
