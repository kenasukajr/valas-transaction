import React, { useEffect, useState } from "react";
import KursTable from "./KursTable";
import { parseKursMbarate, KursRow } from "./parseKursMbarate";

export default function KursValasPageExample() {
  const [kursData, setKursData] = useState<KursRow[]>([]);

  useEffect(() => {
    fetch("/valas/data.json")
      .then(res => res.json())
      .then(json => setKursData(parseKursMbarate(json)));
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Tabel Kurs Valas (mbarate.net)</h2>
      <KursTable data={kursData} />
    </div>
  );
}
