"use client"

import { useRefresh } from "@/context/RefreshContext"
import TransactionList from "@/components/TransactionList"
import Link from "next/link"

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function NasabahPage() {
  const { refreshFlag, toggleRefresh } = useRefresh()

  if (!BACKEND_URL) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">NEXT_PUBLIC_BACKEND_URL belum di-set</h1>
          <p className="text-gray-700">Hubungi admin/server manager untuk menjalankan aplikasi dengan benar.</p>
          <div className="mt-4 text-xs text-gray-400">ENV: {JSON.stringify(process.env.NEXT_PUBLIC_BACKEND_URL)}</div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gray-900 text-white py-8">
      <div className="max-w-3xl mx-auto relative px-0 pl-2.5 flex flex-col items-center justify-center text-center">
          <h1 className="text-4xl font-bold mb-2">Nasabah</h1>
          <p className="text-gray-300">Daftar data nasabah</p>
        </div>
      </div>

      {/* Nasabah List Section */}
      <div className="px-[10px] py-8 w-full">
        <TransactionList 
          refreshFlag={refreshFlag} 
          toggleRefresh={toggleRefresh}
          showDeleteButtons={true} 
          showEditButtons={true}
          backendUrl={`${BACKEND_URL}/api/nasabah`} 
          showRowNumber={true} 
          showTransactionType={false}
          showDateColumn={false}
          showTimeColumn={false}
          showValasColumns={false}
        />
      </div>
    </main>
  )
}
