import React from "react"

interface Transaction {
  id: number
  date?: string
  transactionNumber?: string
  transactionType?: string
  name: string
  idNumber: string
  address: string
  phone: string
  job: string
}

interface TransactionListMinimalProps {
  transactions: Transaction[]
  showRowNumber?: boolean
  showTransactionNumber?: boolean
  showTransactionType?: boolean
}

export const TransactionListMinimal: React.FC<TransactionListMinimalProps> = ({
  transactions,
  showRowNumber = false,
  showTransactionNumber = false,
  showTransactionType = true,
}) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return dateString || ""
    const day = ("0" + date.getDate()).slice(-2)
    const month = ("0" + (date.getMonth() + 1)).slice(-2)
    const year = date.getFullYear()
    return `${day}-${month}-${year}`
  }

  const formatTime = (dateString?: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return dateString || ""
    const hours = ("0" + date.getHours()).slice(-2)
    const minutes = ("0" + date.getMinutes()).slice(-2)
    const seconds = ("0" + date.getSeconds()).slice(-2)
    return `${hours}:${minutes}:${seconds}`
  }

  if (transactions.length === 0) {
    return <p>No transactions available.</p>
  }

  return (
    <>
      <table className="min-w-full border-collapse border border-gray-300 text-sm">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="border border-gray-300 px-2 py-1 text-center">Tgl Transaksi</th>
            <th className="border border-gray-300 px-2 py-1 text-center">Waktu Transaksi</th>
            {showRowNumber && <th className="border border-gray-300 px-2 py-1 text-center">No</th>}
            {showTransactionNumber && <th className="border border-gray-300 px-2 py-1 text-center">No. Transaksi</th>}
            {showTransactionType && <th className="border border-gray-300 px-2 py-1 text-center max-w-[80px]">BNB/BNS</th>}
            <th className="border border-gray-300 px-2 py-1 text-left">Nama</th>
            <th className="border border-gray-300 px-2 py-1 text-left">No. ID</th>
            <th className="border border-gray-300 px-2 py-1 text-left">Alamat</th>
            <th className="border border-gray-300 px-2 py-1 text-left">No. Telepon</th>
            <th className="border border-gray-300 px-2 py-1 text-left">Pekerjaan</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx, index) => (
            <tr key={tx.id} className={`border border-gray-300 ${index % 2 !== 0 ? "bg-gray-50" : "bg-white"} hover:bg-gray-100`}>
              <td className="border border-gray-300 px-2 py-0.5 truncate max-w-xs text-center">{formatDate(tx.date)}</td>
              <td className="border border-gray-300 px-2 py-0.5 truncate max-w-xs text-center">{formatTime(tx.date)}</td>
              {showRowNumber && <td className="border border-gray-300 px-2 py-0.5 truncate max-w-xs text-center">{index + 1}</td>}
              {showTransactionNumber && <td className="border border-gray-300 px-2 py-0.5 truncate max-w-xs text-center">{tx.transactionNumber}</td>}
              {showTransactionType && <td className="border border-gray-300 px-2 py-0.5 truncate max-w-[80px] text-center">{tx.transactionType}</td>}
              <td className="border border-gray-300 px-2 py-0.5 truncate max-w-xs">{tx.name}</td>
              <td className="border border-gray-300 px-2 py-0.5 truncate max-w-xs">{tx.idNumber}</td>
              <td className="border border-gray-300 px-2 py-0.5 truncate max-w-[150px]">{tx.address}</td>
              <td className="border border-gray-300 px-2 py-0.5 truncate max-w-xs">{tx.phone}</td>
              <td className="border border-gray-300 px-2 py-0.5 truncate max-w-xs">{tx.job}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}
