"use client"

import React, { useEffect, useState } from "react"
import { toast } from "sonner"

function formatDate(dateString: string): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  const day = ("0" + date.getDate()).slice(-2);
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;

}

function formatTime(dateString: string): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  const hours = ("0" + date.getHours()).slice(-2);
  const minutes = ("0" + date.getMinutes()).slice(-2);
  const seconds = ("0" + date.getSeconds()).slice(-2);
  return `${hours}:${minutes}:${seconds}`;
}

interface Transaction {
  id: number
  name: string
  address: string
  phone: string
  job: string
  idNumber: string
  birthPlace: string
  birthDate: string
  image?: string
  transactionNumber?: string
  date?: string
  transactionType?: string
  jenisTransaksi?: string
  // Data transaksi valas
  currency?: string
  amount?: number
  rate?: number
  rupiahEquivalent?: number
  totalRupiah?: number
  pembayaranRp?: number | null
  kembalianRp?: number | null
  transactionOrder?: number
  totalTransactions?: number
}

// Add Nasabah type for formData compatibility
interface Nasabah {
  idNumber: string;
  name: string;
  address: string;
  phone: string;
  job: string;
  birthPlace: string;
  birthDate: string;
  transactionType?: string;
  image?: string;
  [key: string]: unknown;
}

import { UserFormRight } from "./UserFormRight"
import { UserFormNasabah } from "./UserFormNasabah"
import { UserFormTransaksi } from "./UserFormTransaksi"
import { ImageGallery } from "./ImageGallery"
import { TransactionSummaryTable } from "./TransactionSummaryTable"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"

interface TransactionListProps {
  refreshFlag: boolean
  toggleRefresh?: () => void
  showDeleteButtons?: boolean
  showEditButtons?: boolean
  backendUrl?: string
  showTransactionNumber?: boolean
  showRowNumber?: boolean
  showTransactionType?: boolean
  sortByDateDesc?: boolean
  showDateColumn?: boolean
  showTimeColumn?: boolean
  showValasColumns?: boolean  // Kontrol tampilan kolom valas
  showAhkButton?: boolean  // Kontrol tampilan tombol generate AHK
  showTransactionTypeColors?: boolean  // Kontrol background color berdasarkan jenis transaksi
}

export default function TransactionList({
  refreshFlag,
  toggleRefresh,
  showDeleteButtons = false,
  showEditButtons = false,
  backendUrl,
  showTransactionNumber = false,
  showRowNumber = false,
  showTransactionType = false,
  sortByDateDesc = false,
  showDateColumn = true,
  showTimeColumn = true,
  showValasColumns = false,
  showAhkButton = true,  // Default true untuk backward compatibility
  showTransactionTypeColors = false,  // Default false untuk tidak menampilkan background color
}: TransactionListProps) {
  // Ambil env var tanpa fallback ke localhost
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  // Jika backendUrl prop tidak diberikan, gunakan BACKEND_URL + /api/transactions
  const effectiveBackendUrl = backendUrl || (BACKEND_URL ? `${BACKEND_URL}/api/transactions` : undefined);

  console.log('TransactionList props:', { backendUrl, BACKEND_URL, effectiveBackendUrl }); // Debug log

  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  
  console.log('TransactionList state initialized, loading:', loading, 'error:', error); // Debug log
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [passwordInput, setPasswordInput] = useState<string>("")
  const [passwordError, setPasswordError] = useState<string>("")
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState<boolean>(false)
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState<boolean>(false)
  const [singleDeleteId, setSingleDeleteId] = useState<number | null>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false)
  const [selectedViewTransaction, setSelectedViewTransaction] = useState<Transaction | null>(null)
  const [selectedEditTransaction, setSelectedEditTransaction] = useState<Transaction | null>(null)
  const [formData, setFormData] = useState<Partial<Transaction>>({})
  const [relatedTransactions, setRelatedTransactions] = useState<Transaction[]>([])  // Transaksi valas terkait

  const fetchTransactions = async () => {
    setLoading(true)
    setError(null)
    // Jika env var tidak ada, tampilkan error jelas
    if (!effectiveBackendUrl) {
      setError("NEXT_PUBLIC_BACKEND_URL tidak tersedia. Hubungi admin/server manager.");
      setLoading(false);
      return;
    }
    try {
      const url = effectiveBackendUrl;
      console.log('Fetching from URL:', url); // Debug log
      const res = await fetch(url)
      if (!res.ok) {
        throw new Error(`Failed to fetch data: ${res.status} ${res.statusText}`)
      }
      let data: Transaction[] = await res.json()
      // Tambahkan id unik jika tidak ada (untuk data nasabah)
      data = data.map((item, idx) => ({
        ...item,
        id: typeof item.id === 'number' ? item.id : idx + 1
      }))
      if (sortByDateDesc) {
        // Sort data by date descending (newest first)
        data.sort((a: Transaction, b: Transaction) => {
          const dateA = new Date(a.date || "").getTime()
          const dateB = new Date(b.date || "").getTime()
          return dateB - dateA
        })
      }
      setTransactions(data)
    } catch (err) {
      console.error('Fetch error:', err); // Debug log
      if (err instanceof TypeError && err.message.includes('fetch')) {
        setError("Tidak dapat terhubung ke server. Pastikan backend server berjalan di " + effectiveBackendUrl);
      } else {
        setError((err as Error).message);
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    console.log('=== USEEFFECT START ==='); // Debug log
    console.log('TransactionList useEffect triggered, refreshFlag:', refreshFlag); // Debug log
    console.log('effectiveBackendUrl:', effectiveBackendUrl); // Debug log
    fetchTransactions()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshFlag])

  const handleDelete = async (id: number) => {
    setSingleDeleteId(id)
    setPasswordInput("")
    setPasswordError("")
    setIsPasswordDialogOpen(true)
  }

  const handleEditClick = (tx: Transaction) => {
    setSelectedEditTransaction(tx)
    setFormData(tx)
    setIsEditModalOpen(true)
  }

  const handleViewClick = (tx: Transaction) => {
    setSelectedViewTransaction(tx)
    setFormData(tx)
    // Ambil semua transaksi dengan nomor transaksi yang sama untuk ditampilkan di tabel valas
    if (tx.transactionNumber) {
      const related = transactions.filter(t => t.transactionNumber === tx.transactionNumber)
        .sort((a: any, b: any) => {
          // Urutkan berdasarkan transactionOrder atau id (yang lebih kecil dulu)
          if (a.transactionOrder && b.transactionOrder) {
            return a.transactionOrder - b.transactionOrder;
          }
          return a.id - b.id;
        });
      setRelatedTransactions(related)
    } else {
      setRelatedTransactions([tx])  // Jika tidak ada nomor transaksi, tampilkan transaksi itu sendiri
    }
    setIsViewModalOpen(true)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev: any) => ({ ...prev, [name]: value }))
  }

  const handleImagePaste = (e: React.ClipboardEvent<Element>) => {
    // Implementation for image paste if needed
  }

  // Fungsi upload gambar ke backend dan set formData.image
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formDataUpload = new FormData();
    formDataUpload.append('image', file);
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload,
      });
      if (!res.ok) throw new Error('Upload gagal');
      const data = await res.json();
      setFormData((prev: any) => ({ ...prev, image: data.imageUrl }));
    } catch (err) {
      alert('Gagal upload gambar');
    }
  }

  // Fungsi upload gambar ke backend dan set formData.image (untuk data nasabah)
  const handleImageUploadNasabah = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formDataUpload = new FormData();
    formDataUpload.append('image', file);
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload,
      });
      if (!res.ok) throw new Error('Upload gagal');
      const data = await res.json();
      setFormData((prev: any) => ({ ...prev, image: data.imageUrl }));
    } catch (err) {
      alert('Gagal upload gambar');
    }
  }

  const clearImage = () => {
    setFormData((prev: any) => ({ ...prev, image: null }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!effectiveBackendUrl) {
      alert("NEXT_PUBLIC_BACKEND_URL tidak tersedia. Hubungi admin/server manager.");
      return;
    }
    try {
      let url = effectiveBackendUrl
      let method = selectedEditTransaction ? "PUT" : "POST"
      // Jika edit, tambahkan /:id di url
      if (selectedEditTransaction && formData.id) {
        url = url.endsWith('/') ? url + formData.id : url + '/' + formData.id
      }
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      if (!res.ok) {
        throw new Error("Failed to save data")
      }
      toast.success("Data berhasil disimpan")
      setIsEditModalOpen(false)
      // Generate AHK script otomatis setelah transaksi selesai dan auto-download (hanya jika showAhkButton true)
      if (showAhkButton) {
        try {
          const res = await fetch('/api/generate-ahk', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: formData.name,
              address: formData.address,
              phone: formData.phone,
              job: formData.job,
              idNumber: formData.idNumber,
              birthPlace: formData.birthPlace,
              birthDate: formData.birthDate,
              transactionType: formData.transactionType || formData.jenisTransaksi || 'BNB',
              // Data transaksi valas (jika ada)
              currency: formData.currency,
              amount: formData.amount,
              rate: formData.rate,
              rupiahEquivalent: formData.rupiahEquivalent,
            })
          });
          if (res.ok) {
            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'script.ahk';
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
            toast.success('Skrip AHK berhasil didownload!');
          } else {
            toast.error('Gagal generate skrip AHK');
          }
        } catch (ahkErr) {
          toast.error('Gagal generate skrip AHK');
        }
      }
      await fetchTransactions()
      if (toggleRefresh) {
        toggleRefresh()
      }
    } catch (err) {
      alert("Gagal menyimpan data: " + (err as Error).message)
    }
  }

  const toggleSelectAll = () => {
    if (selectedIds.length === transactions.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(transactions.map(tx => tx.id))
    }
  }

  const toggleSelectOne = (id: number) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(selectedId => selectedId !== id))
    } else {
      setSelectedIds([...selectedIds, id])
    }
  }

  const handleBulkDeleteClick = () => {
    if (selectedIds.length === 0) return
    setPasswordInput("")
    setPasswordError("")
    setIsPasswordDialogOpen(true)
  }

  const handleConfirmBulkDelete = async () => {
    if (passwordInput !== "1234567890") {
      setPasswordError("Salah password")
      return
    }
    setPasswordError("")
    setIsPasswordDialogOpen(false)
    setIsConfirmDialogOpen(true)
  }

  const handleConfirmBulkDeleteAction = async () => {
    if (!effectiveBackendUrl) {
      alert("NEXT_PUBLIC_BACKEND_URL tidak tersedia. Hubungi admin/server manager.");
      setIsConfirmDialogOpen(false);
      return;
    }
    if (singleDeleteId !== null) {
      // Single delete flow
      try {
        let url = effectiveBackendUrl
        // Jika delete nasabah, pastikan endpoint /:id dan id string
        if (backendUrl && backendUrl.includes('nasabah')) {
          url = url.endsWith('/') ? url + String(singleDeleteId) : url + '/' + String(singleDeleteId)
        } else {
          url = url.endsWith('/') ? url + singleDeleteId : url + '/' + singleDeleteId
        }
        const res = await fetch(url, { method: "DELETE" })
        if (!res.ok) {
          throw new Error("Failed to delete data")
        }
        toast.success("Data berhasil dihapus")
        setSingleDeleteId(null)
        await fetchTransactions()
        if (toggleRefresh) {
          toggleRefresh()
        }
      } catch (err) {
        alert("Gagal menghapus data: " + (err as Error).message)
      } finally {
        setIsConfirmDialogOpen(false)
      }
    } else {
      // Bulk delete flow
      try {
        const url = effectiveBackendUrl
        const bulkDeleteUrl = url.endsWith('/') ? url + 'bulk-delete' : url + '/bulk-delete'
        const res = await fetch(bulkDeleteUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ids: selectedIds.map(String) })
        })
        if (!res.ok) {
          throw new Error('Failed to bulk delete')
        }
        toast.success("Data berhasil dihapus")
        setSelectedIds([])
        await fetchTransactions()
        if (toggleRefresh) {
          toggleRefresh()
        }
      } catch (err) {
        alert("Gagal menghapus data: " + (err as Error).message)
      } finally {
        setIsConfirmDialogOpen(false)
      }
    }
  }

  const handleCancelDelete = () => {
    setIsPasswordDialogOpen(false)
    setIsConfirmDialogOpen(false)
    setPasswordInput("")
    setPasswordError("")
  }

  // Fix: Ensure formData always has all required fields for Nasabah
  const getSafeFormData = (): Nasabah & { images: string[] } => {
    let images: string[] = [];
    if (Array.isArray((formData as any).images)) {
      images = ((formData as any).images).filter((img: any) => typeof img === 'string');
    } else if (typeof formData.image === 'string' && formData.image) {
      images = [formData.image];
    }
    return {
      idNumber: formData.idNumber || '',
      name: formData.name || '',
      address: formData.address || '',
      phone: formData.phone || '',
      job: formData.job || '',
      birthPlace: formData.birthPlace || '',
      birthDate: formData.birthDate || '',
      transactionType: formData.transactionType || '',
      image: formData.image || '',
      images,
      // ...add other fields as needed
    };
  }

  if (loading) {
    return <p>Loading...</p>
  }

  if (error) {
    return <p style={{ color: 'red', fontWeight: 'bold' }}>Error: {error}</p>
  }

  if (transactions.length === 0) {
    return <p>Tidak ada data transaksi.</p>
  }

  return (
    <>
      <div className="mb-4 flex justify-between items-center">
        <a
          href="/"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center gap-2"
        >
          <span>←</span> Kembali
        </a>
        <button
          onClick={handleBulkDeleteClick}
          disabled={selectedIds.length === 0}
          className={`bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded shadow transition-colors duration-300 ${selectedIds.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
          type="button"
        >
          Hapus Terpilih
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300 text-sm">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="border border-gray-300 px-2 py-1 text-center">
                <input
                  type="checkbox"
                  checked={selectedIds.length === transactions.length && transactions.length > 0}
                  onChange={toggleSelectAll}
                />
              </th>
              {showDateColumn && <th className="border border-gray-300 px-2 py-1 text-center">Tgl Transaksi</th>}
              {showTimeColumn && <th className="border border-gray-300 px-2 py-1 text-center">Waktu Transaksi</th>}
              {showRowNumber && <th className="border border-gray-300 px-2 py-1 text-center">No</th>}
              {showTransactionNumber && <th className="border border-gray-300 px-2 py-1 text-center">No. Transaksi</th>}
              {showTransactionType && <th className="border border-gray-300 px-2 py-1 text-center max-w-[80px]">BNB/BNS</th>}
              <th className="border border-gray-300 px-2 py-1 text-left">Nama</th>
              {!showValasColumns && <th className="border border-gray-300 px-2 py-1 text-left">No. ID</th>}
              {!showValasColumns && <th className="border border-gray-300 px-2 py-1 text-left">Alamat</th>}
              {!showValasColumns && <th className="border border-gray-300 px-2 py-1 text-left">No. Telepon</th>}
              {!showValasColumns && <th className="border border-gray-300 px-2 py-1 text-left">Pekerjaan</th>}
              {showValasColumns && <th className="border border-gray-300 px-2 py-1 text-center">Currency</th>}
              {showValasColumns && <th className="border border-gray-300 px-2 py-1 text-center">Amount</th>}
              {showValasColumns && <th className="border border-gray-300 px-2 py-1 text-center">Rate</th>}
              {showValasColumns && <th className="border border-gray-300 px-2 py-1 text-center">Jumlah Rupiah</th>}
              <th className="border border-gray-300 px-2 py-1 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx, index) => {
              // Tentukan background color berdasarkan jenis transaksi
              let bgColorClass = index % 2 !== 0 ? "bg-gray-50" : "bg-white"; // default alternating
              
              // Hanya terapkan background color berdasarkan jenis transaksi jika showTransactionTypeColors = true
              if (showTransactionTypeColors) {
                if (tx.transactionType === 'BNB') {
                  bgColorClass = "bg-green-200"; // background hijau menyala untuk BNB
                } else if (tx.transactionType === 'BNS') {
                  bgColorClass = "bg-red-200"; // background merah menyala untuk BNS
                }
              }
              
              return (
                <tr key={tx.id} className={`border border-gray-300 ${bgColorClass} hover:bg-gray-100`}>
                <td className="border border-gray-300 px-2 py-0.5 text-center">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(tx.id)}
                    onChange={() => toggleSelectOne(tx.id)}
                  />
                </td>
                {showDateColumn && <td className="border border-gray-300 px-2 py-0.5 truncate max-w-xs text-center">{formatDate(tx.date || "")}</td>}
                {showTimeColumn && <td className="border border-gray-300 px-2 py-0.5 truncate max-w-xs text-center">{formatTime(tx.date || "")}</td>}
                {showRowNumber && <td className="border border-gray-300 px-2 py-0.5 truncate max-w-xs text-center">{index + 1}</td>}
                {showTransactionNumber && <td className="border border-gray-300 px-2 py-0.5 truncate max-w-xs text-center">{tx.transactionNumber}</td>}
                {showTransactionType && <td className="border border-gray-300 px-2 py-0.5 truncate max-w-[80px] text-center">{tx.transactionType}</td>}
                <td className="border border-gray-300 px-2 py-0.5 truncate max-w-xs">{tx.name}</td>
                {!showValasColumns && <td className="border border-gray-300 px-2 py-0.5 truncate max-w-xs">{tx.idNumber}</td>}
                {!showValasColumns && <td className="border border-gray-300 px-2 py-0.5 truncate max-w-[150px]">{tx.address}</td>}
                {!showValasColumns && <td className="border border-gray-300 px-2 py-0.5 truncate max-w-xs">{tx.phone}</td>}
                {!showValasColumns && <td className="border border-gray-300 px-2 py-0.5 truncate max-w-xs">{tx.job}</td>}
                {showValasColumns && <td className="border border-gray-300 px-2 py-0.5 truncate max-w-xs text-center">{tx.currency || '-'}</td>}
                {showValasColumns && <td className="border border-gray-300 px-2 py-0.5 truncate max-w-xs text-center">{tx.amount ? tx.amount.toLocaleString() : '-'}</td>}
                {showValasColumns && <td className="border border-gray-300 px-2 py-0.5 truncate max-w-xs text-center">{tx.rate ? tx.rate.toLocaleString() : '-'}</td>}
                {showValasColumns && <td className="border border-gray-300 px-2 py-0.5 truncate max-w-xs text-center">{tx.rupiahEquivalent ? tx.rupiahEquivalent.toLocaleString() : '-'}</td>}
                <td className="border border-gray-300 px-2 py-0.5 text-center">
                  <div className="flex flex-row gap-2 items-center justify-center">
                    {showAhkButton && (
                      <button
                        className="text-purple-600 hover:text-purple-800 border border-purple-300 rounded px-2 py-1"
                        title="Generate/Download Skrip AHK"
                        onClick={async (e) => {
                          e.stopPropagation();
                          
                          // Ambil semua transaksi dengan nomor yang sama
                          const sameNumberTransactions = transactions.filter(
                            (t: any) => t.transactionNumber === tx.transactionNumber
                          ).sort((a: any, b: any) => {
                            // Urutkan berdasarkan transactionOrder atau id (yang lebih kecil dulu)
                            if (a.transactionOrder && b.transactionOrder) {
                              return a.transactionOrder - b.transactionOrder;
                            }
                            return a.id - b.id;
                          });
                          
                          console.log(`Mengambil ${sameNumberTransactions.length} transaksi dengan nomor ${tx.transactionNumber}`);
                          
                          const res = await fetch('/api/generate-ahk', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              name: tx.name,
                              address: tx.address,
                              phone: tx.phone,
                              job: tx.job,
                              idNumber: tx.idNumber,
                              birthPlace: tx.birthPlace,
                              birthDate: tx.birthDate,
                              transactionType: tx.transactionType || tx.jenisTransaksi || 'BNB',
                              // Data transaksi valas (jika ada) - dari baris yang diklik
                              currency: tx.currency,
                              amount: tx.amount,
                              rate: tx.rate,
                              rupiahEquivalent: tx.rupiahEquivalent,
                              // Semua transaksi dengan nomor yang sama
                              transactions: sameNumberTransactions.map((t: any) => ({
                                currency: t.currency,
                                amount: t.amount,
                                rate: t.rate,
                                rupiahEquivalent: t.rupiahEquivalent,
                                transactionNumber: t.transactionNumber,
                                transactionType: t.transactionType || t.jenisTransaksi || 'BNB'
                              }))
                            })
                          });
                          if (res.ok) {
                            const blob = await res.blob();
                            const url = window.URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = 'script.ahk';
                            document.body.appendChild(a);
                            a.click();
                            a.remove();
                            window.URL.revokeObjectURL(url);
                            toast.success('Skrip AHK berhasil didownload!');
                          } else {
                            toast.error('Gagal generate skrip AHK');
                          }
                        }}
                      >
                        Script
                      </button>
                    )}
                    <button
                      className="text-green-600 hover:text-green-800 border border-green-300 rounded px-2 py-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewClick(tx);
                      }}
                    >
                      Lihat
                    </button>
                    {showEditButtons && (
                      <button
                        className="text-blue-600 hover:text-blue-800 border border-blue-300 rounded px-2 py-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditClick(tx);
                        }}
                      >
                        Ubah
                      </button>
                    )}
                    {showDeleteButtons && (
                      <button
                        className="text-red-600 hover:text-red-800 border border-red-300 rounded px-2 py-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(tx.id);
                        }}
                      >
                        Hapus
                      </button>
                    )}
                  </div>
                </td>
              </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Dialog Lihat Data */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="w-full bg-white max-w-[95vw] max-h-[95vh] overflow-y-auto sm:max-w-[1200px] md:max-w-[1400px]" aria-describedby="dialog-desc-view">
          <DialogHeader>
            <DialogTitle className="block pl-5 m-0">Lihat Data</DialogTitle>
          </DialogHeader>
          <p id="dialog-desc-view" className="sr-only">Detail data nasabah</p>
          <div className="space-y-4">
            <UserFormNasabah
              formData={getSafeFormData()}
              handleChange={() => {}}
              handleImagePaste={() => {}}
              handleImageUpload={() => {}}
              clearImage={() => {}}
              handleSubmit={() => {}}
              readOnly={true}
            />
            {/* ...existing code for detail modal... */}
            {/* Tabel Transaksi Valas */}
            {relatedTransactions.length > 0 && relatedTransactions.some(t => t.currency) && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-4">Detail Transaksi Valas</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full border-collapse border border-gray-300 text-sm">
                    <thead className="bg-blue-600 text-white">
                      <tr>
                        <th className="border border-gray-300 px-2 py-1 text-center">No</th>
                        <th className="border border-gray-300 px-2 py-1 text-center">Currency</th>
                        <th className="border border-gray-300 px-2 py-1 text-center">Amount</th>
                        <th className="border border-gray-300 px-2 py-1 text-center">Rate</th>
                        <th className="border border-gray-300 px-2 py-1 text-center">Jumlah Rupiah</th>
                      </tr>
                    </thead>
                    <tbody>
                      {relatedTransactions
                        .filter(t => t.currency)
                        .sort((a, b) => (a.transactionOrder || 0) - (b.transactionOrder || 0))
                        .map((tx, index) => (
                          <tr key={tx.id} className={`border border-gray-300 ${index % 2 !== 0 ? "bg-gray-50" : "bg-white"}`}>
                            <td className="border border-gray-300 px-2 py-1 text-center">{index + 1}</td>
                            <td className="border border-gray-300 px-2 py-1 text-center">{tx.currency}</td>
                            <td className="border border-gray-300 px-2 py-1 text-center">{tx.amount?.toLocaleString()}</td>
                            <td className="border border-gray-300 px-2 py-1 text-center">{tx.rate?.toLocaleString()}</td>
                            <td className="border border-gray-300 px-2 py-1 text-center">Rp {tx.rupiahEquivalent?.toLocaleString()}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
                {relatedTransactions.length > 1 && relatedTransactions[0]?.totalRupiah && (
                  <div className="mt-4 text-right">
                    <p className="text-lg font-semibold">
                      Total Keseluruhan: Rp {relatedTransactions[0].totalRupiah.toLocaleString()}
                    </p>
                  </div>
                )}
                
                {/* Section Pembayaran BNS - hanya tampil jika transaksi BNS dan ada data pembayaran */}
                {relatedTransactions.length > 0 && 
                 relatedTransactions[0]?.jenisTransaksi === 'BNS' && 
                 relatedTransactions[0]?.pembayaranRp !== null && (
                  <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="text-lg font-semibold mb-3 text-yellow-800">Detail Pembayaran BNS</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-700">Jumlah Rupiah:</span>
                        <span className="font-bold text-gray-900">
                          Rp {relatedTransactions[0].totalRupiah?.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-700">Pembayaran:</span>
                        <span className="font-bold text-blue-600">
                          Rp {relatedTransactions[0].pembayaranRp?.toLocaleString()}
                        </span>
                      </div>
                      <hr className="border-yellow-300" />
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-700">Kembalian:</span>
                        <span className={`font-bold ${
                          (relatedTransactions[0].kembalianRp || 0) >= 0 
                            ? 'text-green-600' 
                            : 'text-red-600'
                        }`}>
                          Rp {relatedTransactions[0].kembalianRp?.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                
              </div>
            )}
            {/* Tabel Transaksi Minimize - Hanya untuk halaman nasabah */}
            {backendUrl?.includes("nasabah") && selectedViewTransaction?.id && (() => {
              const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
              return (
                <TransactionSummaryTable 
                  nasabahId={selectedViewTransaction.id}
                  backendUrl={BACKEND_URL}
                />
              );
            })()}
            <div className="flex justify-end gap-2">
              <DialogClose asChild>
                <button type="button" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded shadow transition-colors duration-300">
                  Tutup
                </button>
              </DialogClose>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog Edit Data */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="w-full bg-white max-w-[95vw] max-h-[95vh] overflow-y-auto sm:max-w-[1200px] md:max-w-[1400px]" aria-describedby="dialog-desc-edit">
          <DialogHeader>
            <DialogTitle className="block pl-5 m-0">Ubah Data</DialogTitle>
          </DialogHeader>
          <p id="dialog-desc-edit" className="sr-only">Edit data nasabah</p>
          {backendUrl?.includes("nasabah") ? (
            <UserFormNasabah
              formData={{
                ...getSafeFormData(),
                setFormData,
                onImagesChange: (images: string[]) => setFormData((prev: any) => ({ ...prev, images })),
              }}
              handleChange={handleInputChange}
              handleImagePaste={handleImagePaste}
              handleImageUpload={handleImageUploadNasabah}
              clearImage={clearImage}
              handleSubmit={handleSubmit}
              readOnly={false}
            />
          ) : (
            <UserFormTransaksi
              formData={getSafeFormData()}
              handleChange={handleInputChange}
              handleImagePaste={handleImagePaste}
              handleImageUpload={handleImageUpload}
              clearImage={clearImage}
              handleSubmit={handleSubmit}
            />
          )}
          <div className="flex justify-end gap-2">
            <button
              onClick={handleSubmit}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded shadow transition-colors duration-300"
            >
              Simpan
            </button>
            <DialogClose asChild>
              <button
                type="button"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded shadow transition-colors duration-300"
              >
                Batal
              </button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>

      {/* Password Dialog */}
      <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
        <DialogContent className="sm:max-w-[425px]" aria-describedby="dialog-desc-password">
          <DialogHeader>
            <DialogTitle>Masukkan Password</DialogTitle>
          </DialogHeader>
          <p id="dialog-desc-password" className="sr-only">Masukkan password untuk konfirmasi hapus.</p>
          <div className="grid gap-4 py-4">
            <input
              type="password"
              placeholder="Password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              className="w-full rounded border border-gray-300 px-3 py-2"
            />
            {passwordError && <p className="text-red-600 text-sm">{passwordError}</p>}
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={handleConfirmBulkDelete}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded shadow transition-colors duration-300"
            >
              Konfirmasi
            </button>
            <button
              onClick={handleCancelDelete}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded shadow transition-colors duration-300"
            >
              Batal
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirm Bulk Delete Dialog */}
      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent className="sm:max-w-[425px]" aria-describedby="dialog-desc-confirm">
          <DialogHeader>
            <DialogTitle>Konfirmasi Hapus</DialogTitle>
          </DialogHeader>
          <p id="dialog-desc-confirm" className="sr-only">Konfirmasi hapus data.</p>
          <div className="py-4">
            <p>Apakah Anda yakin ingin menghapus data terpilih?</p>
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={handleConfirmBulkDeleteAction}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded shadow transition-colors duration-300"
            >
              Hapus
            </button>
            <button
              onClick={handleCancelDelete}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded shadow transition-colors duration-300"
            >
              Batal
            </button>
          </div>
        </DialogContent>
      </Dialog>

    </>
  )
}

