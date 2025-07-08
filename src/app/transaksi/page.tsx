"use client"

import { useRefresh } from "@/context/RefreshContext"
import TransactionList from "@/components/TransactionList"
import Link from "next/link"

export default function TransaksiPage() {
  const { refreshFlag, toggleRefresh } = useRefresh()

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gray-900 text-white py-8">
        <div className="max-w-3xl mx-auto relative px-0 pl-2.5 flex flex-col items-center justify-center text-center">
          <h1 className="text-4xl font-bold mb-2">Transaksi</h1>
          <p className="text-gray-300">Daftar Transaksi yang telah diinput</p>
        </div>
      </div>

      {/* Transaction List Section */}
      <div className="px-[10px] py-8 w-full">
        <TransactionList 
          refreshFlag={refreshFlag} 
          toggleRefresh={toggleRefresh}
          backendUrl="/api/transactions" 
          showTransactionNumber={true} 
          showDeleteButtons={true}
          sortByDateDesc={true}
          showAhkButton={true}
        />
      </div>
    </main>
  )
}
