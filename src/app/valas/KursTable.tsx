import React from "react";
import type { KursRow } from "./parseKursMbarate";

interface KursTableProps {
  data: KursRow[];
}

export default function KursTable({ data }: KursTableProps) {
  const kolom = 3;
  const baris = Math.ceil(data.length / kolom);
  const rows = Array.from({ length: baris }, (_, rowIdx) =>
    Array.from({ length: kolom }, (_, colIdx) => data[rowIdx + colIdx * baris])
  );

  return (
    <div className="w-full">
      <div className="shadow overflow-hidden border border-gray-400 rounded-lg mb-2">
        <table className="w-full text-base mb-0 table-fixed rounded-lg overflow-hidden">
          <colgroup>
            <col style={{ width: '10%' }} />
            <col style={{ width: '30%' }} />
            <col style={{ width: '20%' }} />
            <col style={{ width: '20%' }} />
            <col style={{ width: '10%' }} />
            <col style={{ width: '30%' }} />
            <col style={{ width: '20%' }} />
            <col style={{ width: '20%' }} />
            <col style={{ width: '10%' }} />
            <col style={{ width: '30%' }} />
            <col style={{ width: '20%' }} />
            <col style={{ width: '20%' }} />
          </colgroup>
          <thead>
            <tr className="bg-gray-100">
              <th>No</th>
              <th>Currency</th>
              <th>Buy</th>
              <th>Sell</th>
              <th>No</th>
              <th>Currency</th>
              <th>Buy</th>
              <th>Sell</th>
              <th>No</th>
              <th>Currency</th>
              <th>Buy</th>
              <th>Sell</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIdx) => (
              <tr key={rowIdx} className={rowIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                {row.map((item, colIdx) =>
                  item ? (
                    <>
                      <td>{colIdx * baris + rowIdx + 1}</td>
                      <td>{item.kode}</td>
                      <td>{item.buy}</td>
                      <td>{item.sell}</td>
                    </>
                  ) : (
                    <><td></td><td></td><td></td><td></td></>
                  )
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
