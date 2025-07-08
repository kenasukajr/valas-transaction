"use client"

import { useRouter, useParams } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

interface Transaction {
  id: number
  name: string
  address: string
  phone: string
  job: string
  idNumber: string
  birthPlace: string
  birthDate: string
  image: string
  date: string
}

export default function DetailPage() {
  const router = useRouter()
  const params = useParams()
  const [transaction, setTransaction] = useState<Transaction | null>(null)

  useEffect(() => {
    if (!params?.id) return

    fetch(`${BACKEND_URL}/transactions`)
      .then(res => res.json())
      .then((transactions: Transaction[]) => {
        const found = transactions.find(t => t.id === Number(params.id))
        if (found) {
          setTransaction(found)
        } else {
          alert("Data transaksi tidak ditemukan")
          router.push("/transaksi")
        }
      })
      .catch(error => {
        console.error("Error loading transaction detail:", error)
        alert("Terjadi kesalahan saat memuat data")
        router.push("/transaksi")
      })
  }, [params?.id, router])

  const getBackendUrl = () => {
    if (typeof window !== 'undefined') {
      // Always use port 5000 for backend image preview
      const { protocol, hostname } = window.location;
      return `${protocol}//${hostname}:5000`;
    }
    return '';
  };

  if (!transaction) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-gray-500">Memuat data...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="w-full mx-auto">
      <Card>
        <CardContent>
          <div className="flex flex-row justify-between items-center gap-6">
            <div className="flex-1 h-full ml-8">
              <h2 className="text-2xl font-semibold mb-6">Detail Transaksi</h2>
              <p className="mb-4"><strong>Nama:</strong> {transaction.name}</p>
              <p className="mb-4"><strong>Alamat:</strong> {transaction.address}</p>
              <p className="mb-4"><strong>Nomor Telepon:</strong> {transaction.phone}</p>
              <p className="mb-4"><strong>Pekerjaan:</strong> {transaction.job}</p>
              <p className="mb-4"><strong>Nomor Identitas:</strong> {transaction.idNumber}</p>
              <p className="mb-4"><strong>Tempat Lahir:</strong> {transaction.birthPlace}</p>
              <p className="mb-4"><strong>Tanggal Lahir:</strong> {transaction.birthDate}</p>
              <p className="mb-4"><strong>Tanggal Transaksi:</strong> {new Date(transaction.date).toLocaleDateString('id-ID')}</p>
            </div>
            {transaction.image && transaction.image.trim() !== "" && (
              <div className="w-[700px] h-[500px] flex-shrink-0 border rounded-lg p-2 bg-gray-50 self-start">
                <p className="mb-2 font-semibold text-center">Foto</p>
                <img 
                  src={transaction.image.startsWith('/uploads/') ? getBackendUrl() + transaction.image : transaction.image} 
                  alt="Foto Profil" 
                  className="w-full h-full object-contain rounded-md shadow-sm"
                  onLoad={() => console.log("Image loaded successfully")}
                  onError={(e) => {
                    console.error("Error loading image:", e);
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML = '<p class="text-red-500 text-sm">Gagal memuat gambar</p>';
                    }
                  }}
                />
              </div>
            )}
          </div>
          <div className="mt-6">
            <Button onClick={() => router.back()}>Kembali</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
