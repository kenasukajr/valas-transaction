"use client"

import { useState, useEffect, useRef } from "react"
import dynamic from "next/dynamic"
import { getValasByNumber, getValasByCode } from "@/lib/valasData"
const KursMbarateTable = dynamic(() => import("./valas/KursMbarateTable"), { ssr: false })
// CustomDropdownLokasi: dropdown polos tanpa highlight biru/oranye, full kontrol styling
function CustomDropdownLokasi() {

  const options = ["MANGKUBUMI", "AMPLAZ", "PLAZMA"];
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(options[0]);
  const [hovered, setHovered] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [search, setSearch] = useState("");
  const filteredOptions = options.filter(opt => opt.toLowerCase().includes(search.toLowerCase()));

  return (
    <div ref={dropdownRef} style={{ width: "100%", position: "relative" }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        style={{
          width: "100%",
          border: "1px solid #000",
          borderRadius: 6,
          background: "#fff",
          color: "#000",
          fontWeight: "bold",
          // padding: "10px 0", // sebelumnya 10px 0
          padding: "7px 0", // dikurangi 30% dari 10px → 7px
          textAlign: "center",
          cursor: "pointer",
          outline: "none",
          boxShadow: "none",
          fontSize: 16,
          userSelect: "none",
        }}
        tabIndex={0}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {selected}
        <span style={{ float: "right", marginRight: 12, fontWeight: "normal" }}>▼</span>
      </button>
      {/* Field search di bawah dropdown */}
      <input
        type="text"
        placeholder="Cari pelanggan..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{
          width: "100%",
          marginTop: 6,
          marginBottom: 2,
          padding: "7px 8px",
          border: "1px solid #000",
          borderRadius: 5,
          fontSize: 15,
          outline: "none",
          boxSizing: "border-box",
        }}
      />
      {open && (
        <ul
          role="listbox"
          tabIndex={-1}
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            width: "100%",
            background: "#fff",
            border: "1px solid #000",
            borderRadius: 6,
            margin: 0,
            padding: 0,
            zIndex: 100,
            boxShadow: "none",
            listStyle: "none",
            maxHeight: 150,
            overflowY: "auto",
          }}
          onMouseLeave={() => setHovered(null)}
        >
          {filteredOptions.length === 0 && (
            <li style={{ padding: "7px 0", textAlign: "center", color: "#888" }}>Tidak ada hasil</li>
          )}
          {filteredOptions.map((opt) => {
            const isHovered = hovered === opt;
            // highlight oranye hanya saat hover/focus, bukan saat selected
            return (
              <li
                key={opt}
                role="option"
                aria-selected={selected === opt}
                onClick={() => {
                  setSelected(opt);
                  setOpen(false);
                  setSearch("");
                }}
                style={{
                  padding: "7px 0", // dikurangi 30% dari 10px → 7px
                  textAlign: "center",
                  cursor: "pointer",
                  background: isHovered ? "#f97316" : "#fff",
                  color: isHovered ? "#fff" : "#000",
                  fontWeight: isHovered ? "bold" : "normal",
                  userSelect: "none",
                  borderBottom: opt !== filteredOptions[filteredOptions.length - 1] ? "1px solid #eee" : "none",
                  transition: "background 0.15s, color 0.15s",
                }}
                tabIndex={0}
                onMouseDown={e => e.preventDefault()}
                onMouseEnter={() => setHovered(opt)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(opt)}
                onBlur={() => setHovered(null)}
              >
                {opt}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

import { useRouter } from "next/navigation"
import { UserForm } from "@/components/UserForm"
import { UserFormRight } from "@/components/UserFormRight"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { toast } from "sonner"

interface FormData {
  name: string
  address: string
  phone: string
  job: string
  idNumber: string
  birthPlace: string
  birthDate: string
  image: string
  images?: string[]
}

interface ValasTransaction {
  currency: string
  amount: number
  rate: number
  rupiahEquivalent: number
  transactionOrder: number
  totalTransactions: number
}

interface TransactionData extends FormData {
  id: number
  transactionNumber: string
  date: string
  jenisTransaksi: string
  currency: string
  amount: number
  rate: number
  rupiahEquivalent: number
  totalRupiah: number
  pembayaranRp?: number | null
  kembalianRp?: number | null
  transactionOrder: number
  totalTransactions: number
}

// Helper untuk ambil env var backend
function getBackendUrl() {
  let BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  if (typeof window !== 'undefined' && !BACKEND_URL) {
    BACKEND_URL = (window as any).__NEXT_PUBLIC_BACKEND_URL;
  }
  return BACKEND_URL;
}


export default function Home() {
  const router = useRouter()
  const [transactionNumber, setTransactionNumber] = useState<string>("")
  const [transactionDate, setTransactionDate] = useState<string>("")
  const [formData, setFormData] = useState<FormData>({
    name: "",
    address: "",
    phone: "",
    job: "",
    idNumber: "",
    birthPlace: "",
    birthDate: "",
    image: "",
    images: []
  })
  const [savedTransactions, setSavedTransactions] = useState<FormData[]>([])
  const [savedNasabah, setSavedNasabah] = useState<FormData[]>([])
  const [mounted, setMounted] = useState(false)
  const [localImagePreview, setLocalImagePreview] = useState<string>("")
  const [envError, setEnvError] = useState<string | null>(null)
  const [previewSuggestion, setPreviewSuggestion] = useState<any>(null)

  // === State untuk Multi Transaksi Valas ===
  // 10 rows: 1st row kosong, sisanya kosong (tanpa placeholder)
  const [valasRows, setValasRows] = useState([
    { kode: '', valas: '', valas2: '', jumlah: '', rate: '', hasil: '' },
    ...Array(9).fill({ kode: '', valas: '', valas2: '', jumlah: '', rate: '', hasil: '' })
  ]);

  // State untuk modal daftar valas
  const [showValasList, setShowValasList] = useState(false);

  // State dan ref untuk auto-height textarea terbilang
  const [terbilangHeight, setTerbilangHeight] = useState<number>(40);
  const terbilangRef = useRef<HTMLTextAreaElement>(null);

  // State untuk jenis transaksi dan pembayaran
  const [jenisTransaksi, setJenisTransaksi] = useState<string>("");
  const [pembayaranRp, setPembayaranRp] = useState<string>("");
  const [isTransactionAreaOpen, setIsTransactionAreaOpen] = useState<boolean>(false); // Kontrol akses ke area transaksi

  // State untuk mode edit baris tabel
  const [editingRowIndex, setEditingRowIndex] = useState<number | null>(null);

  // Refs untuk navigasi dengan Enter
  const kodeRef = useRef<HTMLInputElement>(null);
  const cekButtonRef = useRef<HTMLButtonElement>(null);
  const amountRef = useRef<HTMLInputElement>(null);
  const rateRef = useRef<HTMLInputElement>(null);
  const pembayaranRef = useRef<HTMLInputElement>(null);
  const betulButtonRef = useRef<HTMLButtonElement>(null);
  const lanjutButtonRef = useRef<HTMLButtonElement>(null);
  const selesaiCetakButtonRef = useRef<HTMLButtonElement>(null);
  const batalUlangButtonRef = useRef<HTMLButtonElement>(null);

  // Hitung hasil otomatis setiap ada perubahan jumlah/rate
  useEffect(() => {
    setValasRows(rows => rows.map((row, idx) => {
      const jumlahNum = parseFloat((row.jumlah || '').replace(/,/g, '.')) || 0;
      const rateNum = parseFloat((row.rate || '').replace(/,/g, '.')) || 0;
      return {
        ...row,
        hasil: jumlahNum && rateNum ? (jumlahNum * rateNum).toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : ''
      };
    }));
  }, [JSON.stringify(valasRows.map(r => [r.jumlah, r.rate]))]);

  // Jumlah total rupiah
  const totalRupiah = valasRows.reduce((acc, row) => acc + (parseFloat(row.hasil.replace(/\./g, '').replace(/,/g, '.')) || 0), 0);

  // Kembalian Rp (harus setelah totalRupiah)
  const kembalianRp = (parseFloat(pembayaranRp.replace(/,/g, '.')) || 0) - totalRupiah;

  // (useEffect lama untuk valas tunggal dihapus, sudah digantikan logic multi-row di atas)

  useEffect(() => {
    setMounted(true)
    // Auto focus ke field Code saat halaman dimuat
    setTimeout(() => {
      if (kodeRef.current) {
        kodeRef.current.focus();
      }
    }, 500);
  }, [])

  useEffect(() => {
    if (!mounted) return;
    const BACKEND_URL = getBackendUrl();
    if (!BACKEND_URL) {
      setEnvError('NEXT_PUBLIC_BACKEND_URL belum di-set. Hubungi admin/server manager.');
      setSavedTransactions([]);
      setSavedNasabah([]);
      setTransactionNumber('');
      setTransactionDate('');
      return;
    } else {
      setEnvError(null);
    }
    // Ambil data transaksi untuk penomoran transaksi
    fetch(`${BACKEND_URL}/api/transactions`)
      .then(res => res.json())
      .then(data => {
        setSavedTransactions(data);
        let lastNumber = 0;
        if (data.length > 0) {
          const lastTransaction = [...data].reverse().find((t: any) => t.transactionNumber);
          if (lastTransaction && lastTransaction.transactionNumber) {
            lastNumber = parseInt(lastTransaction.transactionNumber);
          }
        } else {
          lastNumber = 0;
          localStorage.setItem("lastTransactionNumber", "000000000");
        }
        const nextNumber = lastNumber + 1;
        const formattedNumber = nextNumber.toString().padStart(9, '0');
        setTransactionNumber(formattedNumber);
        const now = new Date();
        const dateString = now.toLocaleDateString('id-ID', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        });
        setTransactionDate(dateString);
      })
      .catch(err => {
        console.error('Failed to fetch transactions from backend:', err);
        setSavedTransactions([]);
        // fallback ke localStorage atau 1
        const localLastNumber = localStorage.getItem("lastTransactionNumber");
        let lastNumber = 0;
        if (localLastNumber) {
          lastNumber = parseInt(localLastNumber);
        }
        const nextNumber = lastNumber + 1;
        const formattedNumber = nextNumber.toString().padStart(9, '0');
        setTransactionNumber(formattedNumber);
        setTransactionDate(new Date().toLocaleDateString('id-ID'));
      });

    // Ambil data nasabah untuk suggestion/autofill
    fetch(`${BACKEND_URL}/api/nasabah`)
      .then(res => res.json())
      .then(data => {
        setSavedNasabah(data);
      })
      .catch(err => {
        console.error('Failed to fetch nasabah for suggestion:', err);
        setSavedNasabah([]);
      });
  }, [mounted]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const BACKEND_URL = getBackendUrl();
    if (!BACKEND_URL) {
      setEnvError('NEXT_PUBLIC_BACKEND_URL belum di-set. Tidak bisa simpan data.');
      return;
    }
    try {
      // Ambil data transaksi valas yang terisi (bukan row pertama dan bukan row kosong)
      const activeValasTransactions = valasRows.slice(1).filter(row => 
        row.valas && row.valas.trim() !== '' && 
        row.jumlah && row.jumlah.trim() !== '' && 
        row.rate && row.rate.trim() !== ''
      );

      // Jika tidak ada transaksi valas, tampilkan peringatan
      if (activeValasTransactions.length === 0) {
        toast.error('Tambahkan minimal satu transaksi valas sebelum menyimpan');
        return;
      }

      // Ambil data nasabah terbaru dari backend
      const nasabahListRes = await fetch(`${BACKEND_URL}/api/nasabah`);
      const nasabahList = nasabahListRes.ok ? await nasabahListRes.json() : [];
      // Cek apakah data sudah ada (berdasarkan name, address, phone, idNumber)
      const existing = nasabahList.find((n: any) =>
        n.name === formData.name &&
        n.address === formData.address &&
        n.phone === formData.phone &&
        n.idNumber === formData.idNumber
      );
      let nasabahData;
      if (existing) {
        // Jika sudah ada, update gambar saja (PUT)
        const oldImages = Array.isArray(existing.images) ? existing.images : (existing.image ? [existing.image] : []);
        const newImages = Array.isArray(formData.images) ? formData.images : (formData.image ? [formData.image] : []);
        const mergedImages = Array.from(new Set([...(oldImages || []), ...(newImages || [])]));
        const updatedNasabah = {
          ...existing,
          ...formData,
          image: mergedImages.length > 0 ? mergedImages[mergedImages.length - 1] : "",
          images: mergedImages
        };
        const putRes = await fetch(`${BACKEND_URL}/api/nasabah/${existing.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedNasabah)
        });
        if (!putRes.ok) throw new Error('Failed to update nasabah');
        nasabahData = await putRes.json();
      } else {
        // Jika belum ada, tambah baru (POST)
        const newNasabah = {
          ...formData,
          image: formData.image ? formData.image : "",
          images: formData.images && formData.images.length > 0 ? formData.images : (formData.image ? [formData.image] : []),
          id: Date.now(),
          transactionNumber: transactionNumber,
          date: new Date().toISOString()
        };
        const nasabahResponse = await fetch(`${BACKEND_URL}/api/nasabah`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newNasabah)
        });
        if (!nasabahResponse.ok) throw new Error('Failed to save nasabah');
        nasabahData = await nasabahResponse.json();
      }
      
      // Hitung total untuk setiap mata uang dan total rupiah keseluruhan
      const totalRupiahFinal = activeValasTransactions.reduce((acc, row) => {
        const hasil = parseFloat(row.hasil.replace(/\./g, '').replace(/,/g, '.')) || 0;
        return acc + hasil;
      }, 0);

      // Simpan setiap transaksi valas sebagai record terpisah
      const savedTransactions = [];
      for (let i = 0; i < activeValasTransactions.length; i++) {
        const valasTransaction = activeValasTransactions[i];
        const newTransaction = {
          ...nasabahData,
          id: Date.now() + Math.floor(Math.random() * 10000) + i, // unique id untuk setiap transaksi
          transactionNumber: transactionNumber,
          date: new Date().toISOString(),
          jenisTransaksi: jenisTransaksi,
          // Data transaksi valas
          currency: valasTransaction.valas,
          amount: parseFloat(valasTransaction.jumlah.replace(/,/g, '.')) || 0,
          rate: parseFloat(valasTransaction.rate.replace(/,/g, '.')) || 0,
          rupiahEquivalent: parseFloat(valasTransaction.hasil.replace(/\./g, '').replace(/,/g, '.')) || 0,
          // Data pembayaran (jika BNS)
          totalRupiah: totalRupiahFinal,
          pembayaranRp: jenisTransaksi === 'BNS' ? (parseFloat(pembayaranRp.replace(/,/g, '.')) || 0) : null,
          kembalianRp: jenisTransaksi === 'BNS' ? ((parseFloat(pembayaranRp.replace(/,/g, '.')) || 0) - totalRupiahFinal) : null,
          // Nomor urut transaksi dalam grup yang sama
          transactionOrder: i + 1,
          totalTransactions: activeValasTransactions.length
        };
        
        const transactionResponse = await fetch(`${BACKEND_URL}/api/transactions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newTransaction)
        });
        
        if (!transactionResponse.ok) {
          throw new Error(`Failed to save transaction ${i + 1}`)
        }
        
        const savedTransaction = await transactionResponse.json();
        savedTransactions.push(savedTransaction);
      }

      // Reset form
      setFormData({
        name: "",
        address: "",
        phone: "",
        job: "",
        idNumber: "",
        birthPlace: "",
        birthDate: "",
        image: "",
        images: []
      })
      setPreviewSuggestion(null);

      // Reset data valas dan auto-focus ke field Code untuk transaksi berikutnya
      setValasRows([
        { kode: '', valas: '', valas2: '', jumlah: '', rate: '', hasil: '' },
        ...Array(9).fill({ kode: '', valas: '', valas2: '', jumlah: '', rate: '', hasil: '' })
      ]);
      
      // Reset pembayaran, jenis transaksi, dan area transaksi
      setPembayaranRp("");
      setJenisTransaksi("");
      setIsTransactionAreaOpen(false);

      // Tidak ada auto-focus setelah submit karena area transaksi direset

      // Update lastTransactionNumber in localStorage
      localStorage.setItem("lastTransactionNumber", transactionNumber);

      // Show success toast dengan info jumlah transaksi tersimpan
      toast.success(`Data berhasil disimpan dengan ${savedTransactions.length} transaksi valas`)

      // Redirect to transactions page
      router.push("/transaksi")
    } catch (error) {
      console.error("Error saving data:", error)
      toast.error("Terjadi kesalahan saat menyimpan data")
    }
  }

  // Ganti tipe handleChange agar bisa menerima input atau textarea
  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleValueChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Pastikan image selalu string dan update previewSuggestion
  const onAutofillSelect = (selected: any) => {
    setFormData({
      ...selected,
      image: selected.image || "",
      images: selected.images && selected.images.length > 0
        ? selected.images
        : (selected.image ? [selected.image] : [])
    })
    setPreviewSuggestion(selected);
  }

  const handleImagePaste = async (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const blob = items[i].getAsFile()
        if (blob) {
          try {
            // Show local preview instantly
            const localUrl = URL.createObjectURL(blob);
            setLocalImagePreview(localUrl);
            
            const formDataUpload = new FormData();
            // Append 'name' terlebih dahulu
            if (formData.name) {
              formDataUpload.append('name', formData.name);
            }
            formDataUpload.append('image', blob);
            
            const res = await fetch('/api/upload', {
              method: 'POST',
              body: formDataUpload,
            });
            if (!res.ok) throw new Error('Upload gagal');
            const data = await res.json();
            setFormData(prev => ({
              ...prev,
              image: data.imageUrl
            }));
            // Remove local preview after upload
            setLocalImagePreview("");
            URL.revokeObjectURL(localUrl);
          } catch (error) {
            console.error('Error uploading pasted image:', error)
          }
        }
      }
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Show local preview instantly
    const localUrl = URL.createObjectURL(file);
    setLocalImagePreview(localUrl);
    const formDataUpload = new FormData();
    // Append 'name' terlebih dahulu
    if (formData.name) {
      formDataUpload.append('name', formData.name);
    }
    formDataUpload.append('image', file);
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload,
      });
      if (!res.ok) throw new Error('Upload gagal');
      const data = await res.json();
      setFormData(prev => ({
        ...prev,
        image: data.imageUrl
      }));
      // Remove local preview after upload
      setLocalImagePreview("");
      URL.revokeObjectURL(localUrl);
    } catch (err) {
      console.error('Gagal upload gambar:', err);
    }
  }

  const clearImage = () => {
    setFormData(prev => ({
      ...prev,
      image: ""
    }))
  }

  // Update tinggi textarea terbilang setiap totalRupiah berubah
  useEffect(() => {
    if (terbilangRef.current) {
      terbilangRef.current.style.height = 'auto';
      setTerbilangHeight(terbilangRef.current.scrollHeight);
    }
  }, [totalRupiah]);

  // Auto-focus ke field nama setelah jenis transaksi dipilih
  useEffect(() => {
    if (mounted && jenisTransaksi && !isTransactionAreaOpen) {
      setTimeout(() => {
        // Fokus ke field nama di UserForm
        const nameField = document.getElementById('name');
        if (nameField) {
          nameField.focus();
        }
      }, 100);
    }
  }, [mounted, jenisTransaksi, isTransactionAreaOpen]);

  // Auto-focus ke field Code setelah area transaksi dibuka (tombol Lanjut ditekan)
  useEffect(() => {
    if (mounted && isTransactionAreaOpen && kodeRef.current) {
      setTimeout(() => {
        kodeRef.current?.focus();
      }, 100);
    }
  }, [mounted, isTransactionAreaOpen]);

  // Fungsi terbilang untuk konversi angka ke kata-kata
  const satuan = ["", "satu", "dua", "tiga", "empat", "lima", "enam", "tujuh", "delapan", "sembilan", "sepuluh", "sebelas"];
  
  function toTerbilang(n: number): string {
    if (n < 12) return satuan[n];
    if (n < 20) return toTerbilang(n - 10) + " belas";
    if (n < 100) return toTerbilang(Math.floor(n / 10)) + " puluh" + (n % 10 !== 0 ? " " + toTerbilang(n % 10) : "");
    if (n < 200) return "seratus" + (n - 100 !== 0 ? " " + toTerbilang(n - 100) : "");
    if (n < 1000) return toTerbilang(Math.floor(n / 100)) + " ratus" + (n % 100 !== 0 ? " " + toTerbilang(n % 100) : "");
    if (n < 2000) return "seribu" + (n - 1000 !== 0 ? " " + toTerbilang(n - 1000) : "");
    if (n < 1000000) return toTerbilang(Math.floor(n / 1000)) + " ribu" + (n % 1000 !== 0 ? " " + toTerbilang(n % 1000) : "");
    if (n < 1000000000) return toTerbilang(Math.floor(n / 1000000)) + " juta" + (n % 1000000 !== 0 ? " " + toTerbilang(n % 1000000) : "");
    if (n < 1000000000000) return toTerbilang(Math.floor(n / 1000000000)) + " miliar" + (n % 1000000000 !== 0 ? " " + toTerbilang(n % 1000000000) : "");
    if (n < 1000000000000000) return toTerbilang(Math.floor(n / 1000000000000)) + " triliun" + (n % 1000000000000 !== 0 ? " " + toTerbilang(n % 1000000000000) : "");
    return "terlalu besar";
  }
  
  function terbilang(angka: number): string {
    const n = Math.floor(angka);
    if (n === 0) return "nol rupiah";
    return toTerbilang(n).replace(/ +/g, ' ').trim() + " rupiah";
  }
  
  // Fungsi terbilang dengan desimal
  function terbilangWithDecimal(angka: number): string {
    const n = Math.floor(angka);
    const decimal = Math.round((angka - n) * 100);
    let result = n === 0 ? "nol rupiah" : toTerbilang(n).replace(/ +/g, ' ').trim() + " rupiah";
    if (decimal > 0) {
      result += ` ${toTerbilang(decimal)} sen`;
    }
    return result;
  }

  // Fungsi untuk navigasi dengan Enter key
  const handleKeyDown = (e: React.KeyboardEvent, nextField?: React.RefObject<HTMLInputElement | null>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (nextField && nextField.current) {
        nextField.current.focus();
      }
    }
  };

  // Fungsi untuk tombol Cek dengan navigasi
  const handleCekClick = () => {
    const kodeInput = valasRows[0].kode.trim().toUpperCase();
    
    // Jika input kosong, tidak melakukan apa-apa
    if (!kodeInput) {
      toast.error('Masukkan nomor urut (1-35) atau kode mata uang terlebih dahulu');
      return;
    }
    
    // Jika input adalah angka, cari berdasarkan nomor urut
    if (/^\d+$/.test(kodeInput)) {
      const nomor = parseInt(kodeInput);
      const valas = getValasByNumber(nomor);
      if (valas) {
        // Tetap simpan kode input, jangan dikosongkan
        setValasRows(rows => rows.map((row, idx) => 
          idx === 0 ? { ...row, valas: '', valas2: valas.kode } : row
        ));
        toast.success(`Ditemukan: ${valas.kode} - ${valas.nama}`);
        // Pindah fokus ke field Amount setelah berhasil
        setTimeout(() => {
          if (amountRef.current) {
            amountRef.current.focus();
          }
        }, 100);
      } else {
        toast.error(`Nomor ${nomor} tidak ditemukan dalam daftar valas`);
      }
    } 
    // Jika input adalah kode mata uang, cari berdasarkan kode
    else if (/^[A-Z]{3}$/i.test(kodeInput)) {
      const valas = getValasByCode(kodeInput);
      if (valas) {
        // Tetap simpan kode input, jangan dikosongkan
        setValasRows(rows => rows.map((row, idx) => 
          idx === 0 ? { ...row, valas: '', valas2: valas.kode } : row
        ));
        toast.success(`Ditemukan: ${valas.kode} - ${valas.nama}`);
        // Pindah fokus ke field Amount setelah berhasil
        setTimeout(() => {
          if (amountRef.current) {
            amountRef.current.focus();
          }
        }, 100);
      } else {
        toast.error(`Kode mata uang ${kodeInput} tidak ditemukan`);
      }
    } 
    // Input tidak valid
    else {
      toast.error('Masukkan nomor urut (1-35) atau kode mata uang (USD, EUR, dll)');
    }
  };

  // Fungsi untuk tombol Betul (menambahkan data input atas ke tabel bawah)
  const handleBetulClick = () => {
    const currentRow = valasRows[0];
    
    // Validasi data input
    if (!currentRow.valas2) {
      toast.error('Silakan pilih mata uang terlebih dahulu dengan tombol Cek');
      return;
    }
    
    if (!currentRow.jumlah || parseFloat(currentRow.jumlah) <= 0) {
      toast.error('Masukkan jumlah yang valid');
      return;
    }
    
    if (!currentRow.rate || parseFloat(currentRow.rate) <= 0) {
      toast.error('Masukkan rate yang valid');
      return;
    }
    
    // Cari index baris kosong pertama di tabel bawah (mulai dari index 1)
    let emptyIndex = valasRows.findIndex((row, idx) => idx > 0 && (!row.valas || row.valas.trim() === ''));
    
    // Jika tidak ada baris kosong, tambah baris baru
    if (emptyIndex === -1) {
      const newRow = { 
        kode: '', 
        valas: currentRow.valas2, 
        valas2: '', 
        jumlah: currentRow.jumlah, 
        rate: currentRow.rate, 
        hasil: currentRow.hasil 
      };
      setValasRows(rows => [...rows, newRow]);
    } else {
      // Update baris kosong yang ditemukan
      setValasRows(rows => rows.map((row, idx) => 
        idx === emptyIndex ? { 
          ...row, 
          valas: currentRow.valas2, 
          jumlah: currentRow.jumlah, 
          rate: currentRow.rate, 
          hasil: currentRow.hasil 
        } : row
      ));
    }
    
    toast.success('Data berhasil ditambahkan ke tabel transaksi');
    
    // Pindah fokus ke tombol Lanjut
    setTimeout(() => {
      if (lanjutButtonRef.current) {
        lanjutButtonRef.current.focus();
      }
    }, 100);
  };

  // Fungsi untuk tombol Lanjut (reset input atas dan fokus ke Code)
  const handleLanjutClick = () => {
    // Reset field input atas (Code, Currency, Amount, Rate)
    setValasRows(rows => rows.map((row, idx) => 
      idx === 0 ? { 
        ...row, 
        kode: '', 
        valas: '', 
        valas2: '', 
        jumlah: '', 
        rate: '', 
        hasil: '' 
      } : row
    ));
    
    // Pindah fokus kembali ke field Code dan select
    setTimeout(() => {
      if (kodeRef.current) {
        kodeRef.current.focus();
        kodeRef.current.select();
      }
    }, 100);
    
    toast.success('Siap untuk transaksi berikutnya');
  };

  // Fungsi untuk tombol Batal Ulang (hapus semua data di tabel bawah)
  const handleBatalUlangClick = () => {
    // Reset seluruh tabel valas (termasuk input atas dan tabel bawah)
    setValasRows([
      { kode: '', valas: '', valas2: '', jumlah: '', rate: '', hasil: '' },
      ...Array(9).fill({ kode: '', valas: '', valas2: '', jumlah: '', rate: '', hasil: '' })
    ]);
    
    // Reset field pembayaran jika ada
    setPembayaranRp('');
    
    // Reset area transaksi dan jenis transaksi
    setIsTransactionAreaOpen(false);
    setJenisTransaksi('');
    
    // Tidak ada fokus setelah reset
    toast.success('Semua data transaksi telah dihapus');
  };

  // Fungsi untuk navigasi dengan arrow keys
  const handleArrowNavigation = (e: React.KeyboardEvent, currentRef: React.RefObject<HTMLInputElement | HTMLButtonElement | null>) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      // Navigasi ke field berikutnya
      if (currentRef === kodeRef && cekButtonRef.current) {
        cekButtonRef.current.focus();
      } else if (currentRef === cekButtonRef && amountRef.current) {
        amountRef.current.focus();
      } else if (currentRef === amountRef && rateRef.current) {
        rateRef.current.focus();
      } else if (currentRef === rateRef && betulButtonRef.current) {
        betulButtonRef.current.focus();
      } else if (currentRef === betulButtonRef && lanjutButtonRef.current) {
        lanjutButtonRef.current.focus();
      } else if (currentRef === lanjutButtonRef && selesaiCetakButtonRef.current) {
        // Dari Lanjut ke Selesai Cetak
        selesaiCetakButtonRef.current.focus();
      } else if (currentRef === selesaiCetakButtonRef && batalUlangButtonRef.current) {
        // Dari Selesai Cetak ke Batal/Ulang
        batalUlangButtonRef.current.focus();
      } else if (currentRef === batalUlangButtonRef && kodeRef.current) {
        // Dari Batal/Ulang loop kembali ke awal
        kodeRef.current.focus();
        kodeRef.current.select();
      }
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      // Navigasi ke field sebelumnya
      if (currentRef === batalUlangButtonRef && selesaiCetakButtonRef.current) {
        // Dari Batal/Ulang ke Selesai Cetak
        selesaiCetakButtonRef.current.focus();
      } else if (currentRef === selesaiCetakButtonRef && lanjutButtonRef.current) {
        // Dari Selesai Cetak ke Lanjut
        lanjutButtonRef.current.focus();
      } else if (currentRef === lanjutButtonRef && betulButtonRef.current) {
        betulButtonRef.current.focus();
      } else if (currentRef === betulButtonRef && rateRef.current) {
        rateRef.current.focus();
      } else if (currentRef === rateRef && amountRef.current) {
        amountRef.current.focus();
      } else if (currentRef === amountRef && cekButtonRef.current) {
        cekButtonRef.current.focus();
      } else if (currentRef === cekButtonRef && kodeRef.current) {
        kodeRef.current.focus();
        kodeRef.current.select();
      } else if (currentRef === kodeRef && batalUlangButtonRef.current) {
        // Dari Code loop ke akhir
        batalUlangButtonRef.current.focus();
      }
    }
  };

  // Fungsi untuk edit baris di tabel transaksi (edit langsung di baris)
  const handleEditRow = (rowIndex: number) => {
    const actualIndex = rowIndex + 1; // karena slice(1), index 0 = baris ke-1 di tabel
    const rowData = valasRows[actualIndex];
    
    if (!rowData || !rowData.valas) {
      toast.error('Baris kosong, tidak ada data untuk diedit');
      return;
    }
    
    // Aktifkan mode edit untuk baris ini
    setEditingRowIndex(rowIndex);
    
    // Auto focus ke field Amount (karena Currency tidak bisa diedit)
    setTimeout(() => {
      const currentRow = document.querySelector(`tbody tr:nth-child(${rowIndex + 1})`);
      const amountInput = currentRow?.querySelector('input[type="number"]') as HTMLInputElement;
      if (amountInput) {
        amountInput.focus();
        amountInput.select();
      }
    }, 100);
    
    toast.success('Mode edit aktif - Edit Amount dan Rate');
  };

  // Fungsi untuk simpan perubahan edit (icon check hijau)
  const handleSaveEdit = (rowIndex: number) => {
    const actualIndex = rowIndex + 1; // karena slice(1), index 0 = baris ke-1 di tabel
    const rowData = valasRows[actualIndex];
    
    // Validasi data sebelum simpan
    if (!rowData.valas || !rowData.jumlah || !rowData.rate) {
      toast.error('Semua field harus diisi');
      return;
    }
    
    if (parseFloat(rowData.jumlah) <= 0 || parseFloat(rowData.rate) <= 0) {
      toast.error('Jumlah dan rate harus lebih dari 0');
      return;
    }
    
    // Keluar dari mode edit
    setEditingRowIndex(null);
    toast.success(`Perubahan data ${rowData.valas} berhasil disimpan`);
  };

  // Fungsi untuk batal edit (ESC atau klik di luar)
  const handleCancelEdit = () => {
    setEditingRowIndex(null);
    toast.info('Edit dibatalkan');
  };

  // Fungsi untuk hapus baris di tabel transaksi
  const handleDeleteRow = (rowIndex: number) => {
    const actualIndex = rowIndex + 1; // karena slice(1), index 0 = baris ke-1 di tabel
    const rowData = valasRows[actualIndex];
    
    if (!rowData || !rowData.valas) {
      toast.error('Baris kosong, tidak ada data untuk dihapus');
      return;
    }
    
    // Hapus data di baris yang dipilih
    setValasRows(rows => rows.map((row, idx) => 
      idx === actualIndex ? { 
        ...row, 
        kode: '', 
        valas: '', 
        valas2: '', 
        jumlah: '', 
        rate: '', 
        hasil: '' 
      } : row
    ));
    
    toast.success(`Data ${rowData.valas} berhasil dihapus dari tabel`);
  };

  if (!mounted) {
    return null
  }

  if (envError) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">{envError}</h1>
          <p className="text-gray-700">Aplikasi tidak dapat digunakan tanpa konfigurasi backend yang benar.</p>
        </div>
      </main>
    )
  }

  // Format kembalianRp untuk input
  let kembalianRpDisplay = '';
  if (!isNaN(kembalianRp)) {
    if (Number.isInteger(kembalianRp)) {
      kembalianRpDisplay = kembalianRp.toLocaleString('id-ID', { maximumFractionDigits: 0 });
    } else {
      kembalianRpDisplay = kembalianRp.toLocaleString('id-ID');
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Form Data Diri</h1>
          <div className="flex gap-4 items-start">
            <Link
              href="/nasabah"
              className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
            >
              Nasabah
            </Link>
            {/* Link ke halaman Daftar Valas */}
            <Link
              href="/valas"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition-colors"
            >
              Daftar Valas
            </Link>

            <Link
              href="/transaksi"
              className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors"
            >
              Lihat Transaksi
            </Link>
          </div>
        </div>

        {/* Transaction Info */}
        <div className="flex gap-2 mb-2 w-full">
          <div className="flex-1 flex justify-start items-center gap-2">
            <span className="font-medium text-gray-700">Tgl. Transaksi:</span>
            <span className="font-medium text-gray-900">{transactionDate}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-700">No. Transaksi:</span>
            <span className="font-mono text-lg font-bold text-gray-900">{transactionNumber}</span>
          </div>
          {/* Hapus tombol pilih jenis transaksi BNB/BNS di sini, karena sudah ada di UserForm */}
        </div>

        {/* Main Content - Responsive Layout */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8 overflow-hidden">
          {/* Left Column - Form Part 1 */}
          <div>
            <Card className="w-full h-full">
              <CardContent className="p-4 h-full">
                <UserForm
                  formData={formData}
                  handleChange={handleChange}
                  savedTransactions={savedNasabah}
                  onAutofillSelect={onAutofillSelect}
                  onValueChange={handleValueChange}
                  onPreviewSuggestion={setPreviewSuggestion}
                  onForcePreviewSuggestion={setPreviewSuggestion}
                  jenisTransaksi={jenisTransaksi}
                  setJenisTransaksi={setJenisTransaksi}
                />
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Form Part 2 + Photo */}
          <div className="flex flex-col h-full">
            <Card className="w-full flex-1 flex flex-col h-full">
              <CardContent className="flex-1 p-4 h-full">
                <UserFormRight
                  formData={formData}
                  handleChange={handleChange}
                  savedTransactions={savedNasabah}
                  onAutofillSelect={onAutofillSelect}
                  handleImagePaste={handleImagePaste}
                  handleImageUpload={handleImageUpload}
                  clearImage={clearImage}
                  handleSubmit={handleSubmit}
                  previewSuggestion={previewSuggestion}
                  onLanjutClick={() => setIsTransactionAreaOpen(true)}
                />
              </CardContent>
            </Card>
          </div>
        </div>
        {/* === Transaksi Valas Section === */}
        <div className="bg-white rounded shadow p-6 w-full flex gap-0 justify-start items-start" style={{alignItems: 'flex-start'}}>
          {/* Bagian Kiri: 50% */}
          <div style={{ width: '50%', background: '#FFFFFF', minHeight: 400, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', padding: 12 }}>
            <h2 className="text-xl font-bold mb-4 mt-0" style={{minHeight: 32, marginBottom: 16}}>Transaksi Valas</h2>
            {/* Baris input atas dengan label di atas field, jarak antar field seragam */}
            <div className="flex flex-row space-x-[1px] mb-2 items-end w-max" style={{marginLeft: '0'}}>
              <div className="flex flex-col items-center" style={{width: '45px', marginRight: '1px'}}>
                <label className="text-base font-semibold text-black mb-1">Code</label>
                <input
                  ref={kodeRef}
                  id="valas-code-field"
                  type="text"
                  className={`border border-black px-2 py-1 w-full text-center font-mono uppercase font-bold rounded ${!isTransactionAreaOpen ? 'bg-gray-200 cursor-not-allowed' : 'bg-white'}`}
                  value={valasRows[0].kode || ''}
                  onChange={e => setValasRows(rows => rows.map((row, idx) => idx === 0 ? { ...row, kode: e.target.value } : row))}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      // Pindah fokus ke tombol Cek
                      if (cekButtonRef.current) {
                        cekButtonRef.current.focus();
                      }
                    } else {
                      // Handle arrow navigation
                      handleArrowNavigation(e, kodeRef);
                    }
                  }}
                  disabled={!isTransactionAreaOpen}
                  title={!isTransactionAreaOpen ? "Tekan tombol Lanjut pada form nasabah terlebih dahulu" : "Masukkan nomor urut (1-35) atau kode mata uang, tekan Enter untuk pindah ke tombol Cek"}
                />
              </div>
              <div className="flex flex-col items-center" style={{width: '82px'}}>
                <label className="mb-1" style={{visibility: 'hidden'}}>&nbsp;</label>
                <button
                  ref={cekButtonRef}
                  type="button"
                  className={`px-2 py-1 font-bold rounded border border-black focus:ring-2 focus:ring-blue-300 ${!isTransactionAreaOpen ? 'bg-gray-400 text-gray-600 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
                  style={{ width: '65.6px', marginLeft: '-15px', marginRight: '1px' }}
                  onClick={handleCekClick}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleCekClick();
                    } else {
                      // Handle arrow navigation
                      handleArrowNavigation(e, cekButtonRef);
                    }
                  }}
                  disabled={!isTransactionAreaOpen}
                  title={!isTransactionAreaOpen ? "Tekan tombol Lanjut pada form nasabah terlebih dahulu" : "Tekan Enter untuk mencari mata uang"}
                >
                  Cek
                </button>
              </div>
              <div className="flex flex-col items-start" style={{width: '82px'}}>
                <label className="text-base font-semibold text-black mb-1 w-full text-left" style={{marginLeft: '-17px'}}>Currency</label>
                <input
                  type="text"
                  className="border border-black px-2 py-1 w-full text-left rounded uppercase font-bold bg-gray-100 cursor-not-allowed select-none"
                  value={(valasRows[0].valas2 || '').toUpperCase()}
                  readOnly
                  tabIndex={-1}
                  style={{ pointerEvents: 'none', userSelect: 'none', marginLeft: '-17px' }}
                />
              </div>
              {/* AMOUNT */}
              <div className="flex flex-col items-start" style={{width: '132px'}}>
                <label className="text-base font-semibold text-black mb-1 w-full text-center" style={{marginLeft: '-17px'}}>Amount</label>
                <input
                  ref={amountRef}
                  type="number"
                  className={`border border-black px-2 py-1 w-full text-left font-bold rounded ${!isTransactionAreaOpen ? 'bg-gray-200 cursor-not-allowed' : 'bg-white'}`}
                  value={valasRows[0].jumlah === undefined ? '' : valasRows[0].jumlah}
                  onChange={e => setValasRows(rows => rows.map((row, idx) => idx === 0 ? { ...row, jumlah: e.target.value } : row))}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (rateRef && rateRef.current) {
                        rateRef.current.focus();
                      }
                    } else {
                      // Handle arrow navigation
                      handleArrowNavigation(e, amountRef);
                    }
                  }}
                  min="0"
                  step="any"
                  disabled={!isTransactionAreaOpen}
                  style={{marginLeft: '-17px'}} 
                  title={!isTransactionAreaOpen ? "Tekan tombol Lanjut pada form nasabah terlebih dahulu" : "Masukkan jumlah mata uang, tekan Enter untuk lanjut ke Rate"}
                />
              </div>
              {/* RATE */}
              <div className="flex flex-col items-center" style={{width: '82px'}}>
                <label className="text-base font-semibold text-black mb-1 w-full text-center" style={{marginLeft: '-33px'}}>Rate</label>
                <input
                  ref={rateRef}
                  type="number"
                  className={`border border-black px-2 py-1 w-full text-left font-bold rounded ${!isTransactionAreaOpen ? 'bg-gray-200 cursor-not-allowed' : 'bg-white'}`}
                  value={valasRows[0].rate === undefined ? '' : valasRows[0].rate}
                  onChange={e => setValasRows(rows => rows.map((row, idx) => idx === 0 ? { ...row, rate: e.target.value } : row))}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      // Pindah fokus ke tombol Betul
                      if (betulButtonRef.current) {
                        betulButtonRef.current.focus();
                      }
                    } else {
                      // Handle arrow navigation
                      handleArrowNavigation(e, rateRef);
                    }
                  }}
                  min="0"
                  step="any"
                  disabled={!isTransactionAreaOpen}
                  style={{marginLeft: '-33px'}} 
                  title={!isTransactionAreaOpen ? "Tekan tombol Lanjut pada form nasabah terlebih dahulu" : "Masukkan rate/kurs, tekan Enter untuk lanjut"}
                />
              </div>
              <div className="flex flex-col items-center" style={{width: '181px'}}>
                <label className="text-base font-semibold text-black mb-1" style={{marginLeft: '-33px'}}>Rupiah Equivalent</label>
                <input
                  type="text"
                  className="border border-black px-2 py-1 w-full text-right bg-gray-100 font-bold rounded"
                  value={valasRows[0].hasil}
                  readOnly
                  tabIndex={-1}
                  style={{ pointerEvents: 'none', userSelect: 'none', marginLeft: '-33px', width: '181px' }}
                />
              </div>
            </div>
            {/* Tabel transaksi valas */}
            <table className="w-full border border-black rounded text-sm mb-2 table-fixed bg-white">
              <colgroup><col style={{ width: '30px' }}/><col style={{ width: '70px' }}/><col style={{ width: '150px' }}/><col style={{ width: '80px' }}/><col style={{ width: '144px' }}/><col style={{ width: '90px' }}/></colgroup>
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-black px-1 py-1 w-4 text-center font-bold">No</th>
                  <th className="border border-black px-1 py-1 font-bold">Currency</th>
                  <th className="border border-black px-1 py-1 font-bold">Amount</th>
                  <th className="border border-black px-1 py-1 font-bold">Rate</th>
                  <th className="border border-black px-1 py-1 font-bold">Rupiah Equivalent</th>
                  <th className="border border-black px-1 py-1 text-center font-bold">Edit/Hapus</th>
                </tr>
              </thead>
              <tbody>
                {valasRows.slice(1).map((row, idx) => (
                  <tr key={idx + 1}>
                    <td className="border border-black px-1 py-1 text-center font-bold" style={{width: '30px'}}>{idx + 2}</td>
                    <td className="border border-black px-1 py-1 font-bold" style={{width: '70px'}}>
                      <input
                        type="text"
                        className={`w-full border-none focus:ring-0 px-1 py-0.5 uppercase font-bold ${
                          editingRowIndex === idx ? 'bg-gray-200 cursor-not-allowed' : 'bg-transparent'
                        }`}
                        value={row.valas.toUpperCase()}
                        onChange={e => setValasRows(rows => rows.map((r, i) => i === idx + 1 ? { ...r, valas: e.target.value.toUpperCase() } : r))}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            // Pindah ke field jumlah di baris yang sama
                            const nextInput = e.currentTarget.closest('tr')?.querySelector('input[type="number"]') as HTMLInputElement;
                            if (nextInput) nextInput.focus();
                          } else if (e.key === 'Escape') {
                            handleCancelEdit();
                          }
                        }}
                        readOnly={true}
                        style={{ 
                          pointerEvents: 'none',
                          cursor: 'not-allowed',
                          color: editingRowIndex === idx ? '#666' : 'inherit'
                        }}
                        title={editingRowIndex === idx ? "Currency tidak bisa diedit dalam mode edit" : "Masukkan kode mata uang, tekan Enter untuk lanjut"}
                      />
                    </td>
                    <td className="border border-black px-1 py-1 font-bold" style={{width: '150px'}}>
                      <input
                        type="number"
                        className={`w-full border-none focus:ring-0 px-1 py-0.5 text-right appearance-none font-bold ${
                          editingRowIndex === idx ? 'bg-yellow-50' : 'bg-transparent'
                        }`}
                        value={(() => {
                          const num = parseFloat(row.jumlah);
                          if (isNaN(num)) return row.jumlah;
                          return Number.isInteger(num) ? num.toLocaleString('id-ID', { maximumFractionDigits: 0 }) : num.toLocaleString('id-ID');
                        })()}
                        onChange={e => setValasRows(rows => rows.map((r, i) => i === idx + 1 ? { ...r, jumlah: e.target.value } : r))}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            // Pindah ke field rate di baris yang sama
                            const currentRow = e.currentTarget.closest('tr');
                            const nextInput = currentRow?.querySelectorAll('input[type="number"]')[1] as HTMLInputElement;
                            if (nextInput) nextInput.focus();
                          } else if (e.key === 'Escape') {
                            handleCancelEdit();
                          }
                        }}
                        min="0"
                        readOnly={editingRowIndex !== idx}
                        style={{ 
                          MozAppearance: 'textfield',
                          pointerEvents: editingRowIndex === idx ? 'auto' : 'none',
                          cursor: editingRowIndex === idx ? 'text' : 'default'
                        }}
                        title={editingRowIndex === idx ? "Edit jumlah, tekan Enter untuk lanjut ke Rate, ESC untuk batal" : "Masukkan jumlah, tekan Enter untuk lanjut ke Rate"}
                      />
                    </td>
                    <td className="border border-black px-1 py-1 font-bold" style={{width: '80px'}}>
                      <input
                        type="number"
                        className={`w-full border-none focus:ring-0 px-1 py-0.5 text-right appearance-none font-bold ${
                          editingRowIndex === idx ? 'bg-yellow-50' : 'bg-transparent'
                        }`}
                        value={row.rate}
                        onChange={e => setValasRows(rows => rows.map((r, i) => i === idx + 1 ? { ...r, rate: e.target.value } : r))}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            // Jika dalam mode edit, simpan perubahan
                            if (editingRowIndex === idx) {
                              handleSaveEdit(idx);
                            } else {
                              // Pindah ke baris berikutnya (field valas)
                              const currentRowIndex = idx + 1;
                              if (currentRowIndex < valasRows.length - 1) {
                                // Pindah ke baris berikutnya
                                const nextRowIndex = currentRowIndex + 1;
                                setTimeout(() => {
                                  const nextRow = document.querySelector(`tbody tr:nth-child(${nextRowIndex + 1})`) as HTMLTableRowElement;
                                  const firstInput = nextRow?.querySelector('input[type="text"]') as HTMLInputElement;
                                  if (firstInput) firstInput.focus();
                                }, 50);
                              } else {
                                // Jika ini baris terakhir, kembali ke field Code di atas
                                if (kodeRef.current) {
                                  kodeRef.current.focus();
                                  kodeRef.current.select();
                                }
                              }
                            }
                          } else if (e.key === 'Escape') {
                            handleCancelEdit();
                          }
                        }}
                        min="0"
                        readOnly={editingRowIndex !== idx}
                        style={{ 
                          MozAppearance: 'textfield',
                          pointerEvents: editingRowIndex === idx ? 'auto' : 'none',
                          cursor: editingRowIndex === idx ? 'text' : 'default'
                        }}
                        title={editingRowIndex === idx ? "Edit rate, tekan Enter untuk simpan, ESC untuk batal" : "Masukkan rate, tekan Enter untuk lanjut ke baris berikutnya"}
                      />
                    </td>
                    <td className="border border-black px-1 py-1 font-bold" style={{width: '144px'}}>
                      <input
                        type="text"
                        className="w-full border-none focus:ring-0 px-1 py-0.5 bg-gray-100 text-right font-bold"
                        value={(() => {
                          const num = parseFloat(row.hasil.replace(/\./g, '').replace(/,/g, '.'));
                          if (isNaN(num)) return '';
                          return Number.isInteger(num) ? num.toLocaleString('id-ID', { maximumFractionDigits: 0 }) : num.toLocaleString('id-ID');
                        })()}
                        readOnly
                        tabIndex={-1}
                        style={{ pointerEvents: 'none', userSelect: 'none' }}
                      />
                    </td>
                    <td className="border border-black px-1 py-1 text-center font-bold" style={{width: '90px'}}>
                      {editingRowIndex === idx ? (
                        // Mode edit: Tampilkan tombol Save (check hijau) dan Cancel (X abu-abu)
                        <>
                          <button
                            type="button"
                            className="inline-flex items-center justify-center px-1 py-1 mr-1 text-green-600 hover:text-green-800 hover:bg-green-50 rounded transition-colors"
                            title="Simpan - Simpan perubahan edit"
                            onClick={() => handleSaveEdit(idx)}
                          >
                            ✅
                          </button>
                          <button
                            type="button"
                            className="inline-flex items-center justify-center px-1 py-1 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded transition-colors"
                            title="Batal - Batalkan edit"
                            onClick={handleCancelEdit}
                          >
                            ❌
                          </button>
                        </>
                      ) : (
                        // Mode normal: Tampilkan tombol Edit (pencil biru) dan Delete (X merah)
                        <>
                          <button
                            type="button"
                            className="inline-flex items-center justify-center px-1 py-1 mr-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                            title="Edit - Edit data di baris ini"
                            onClick={() => handleEditRow(idx)}
                          >
                            ✏️
                          </button>
                          <button
                            type="button"
                            className="inline-flex items-center justify-center px-1 py-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                            title="Hapus - Hapus data dari tabel"
                            onClick={() => handleDeleteRow(idx)}
                          >
                            ❌
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Footer jumlah Rp, pembayaran, kembalian, terbilang */}
            <div className="flex justify-end items-center mt-2">
              <span className="font-bold mr-2">Jumlah Rp</span>
              <input
                type="text"
                className="border border-black px-2 py-1 text-right bg-gray-100 font-mono font-bold cursor-not-allowed select-none"
                style={{ width: '280px', textAlign: 'right', pointerEvents: 'none', userSelect: 'none' }}
                value={(() => {
                  if (Number.isInteger(totalRupiah)) {
                    return totalRupiah.toLocaleString('id-ID', { maximumFractionDigits: 0 });
                  } else {
                    return totalRupiah.toLocaleString('id-ID');
                  }
                })()}
                readOnly
                tabIndex={-1}
              />
            </div>
            {/* Field Pembayaran Rp dan Kembalian, hanya tampil jika jenisTransaksi === 'BNS' */}
            {jenisTransaksi === 'BNS' && (
              <>
                <div className="flex justify-end items-center mt-1">
                  <span className="font-bold mr-2">Pembayaran Rp</span>
                  <input
                    ref={pembayaranRef}
                    type="text"
                    className="border px-2 py-1 text-right font-mono"
                    style={{ width: '280px' }}
                    value={(() => {
                      const num = parseFloat(pembayaranRp.replace(/,/g, '.'));
                      if (isNaN(num)) return pembayaranRp;
                      return Number.isInteger(num) ? num.toLocaleString('id-ID', { maximumFractionDigits: 0 }) : num.toLocaleString('id-ID');
                    })()}
                    onChange={e => setPembayaranRp(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        // Setelah input pembayaran, kembali ke Code untuk transaksi berikutnya
                        if (kodeRef.current) {
                          kodeRef.current.focus();
                          kodeRef.current.select();
                        }
                      }
                    }}
                    min="0"
                    title="Masukkan jumlah pembayaran, tekan Enter untuk selesai"
                  />
                </div>
                <div className="flex justify-end items-center mt-1">
                  <span className="font-bold mr-2">Kembalian</span>
                  <input
                    type="text"
                    className="border border-black px-2 py-1 text-right bg-gray-100 font-mono cursor-not-allowed select-none"
                    style={{ width: '280px', pointerEvents: 'none', userSelect: 'none' }}
                    value={kembalianRpDisplay}
                    readOnly
                    tabIndex={-1}
                  />
                </div>
                {/* Field Terbilang di bawah Kembalian */}
                <div className="flex justify-end items-center mt-1">
                  <textarea
                    ref={terbilangRef}
                    className="border border-black px-2 py-1 bg-gray-100 font-mono uppercase resize-none font-bold"
                    style={{ width: '620px', height: terbilangHeight, pointerEvents: 'none', userSelect: 'none', textAlign: 'right' }}
                    value={terbilangWithDecimal(totalRupiah).toUpperCase()}
                    readOnly
                    tabIndex={-1}
                    rows={1}
                  />
                </div>
              </>
            )}
            {/* Field Terbilang di bawah Jumlah Rp jika bukan BNS */}
            {jenisTransaksi !== 'BNS' && (
              <div className="flex justify-end items-center mt-1">
                <textarea
                  ref={terbilangRef}
                  className="border border-black px-2 py-1 bg-gray-100 font-mono uppercase resize-none font-bold"
                  style={{ width: '620px', height: terbilangHeight, pointerEvents: 'none', userSelect: 'none', textAlign: 'right' }}
                  value={terbilangWithDecimal(totalRupiah).toUpperCase()}
                  readOnly
                  tabIndex={-1}
                  rows={1}
                />
              </div>
            )}
          </div>

          {/* Bagian Tengah: 25% */}
          <div style={{ width: '25%', background: '#FFFFFF', minHeight: 400, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', padding: 12 }}>
            <div style={{height: '76px'}} /> {/* Spacer agar tombol lebih turun, dikembalikan ke 76px seperti settingan sebelumnya */}
            {/* Tombol Betul & Lanjut saling bersebelahan */}
            <div className="flex flex-row gap-2 mb-2" style={{width: '228px'}}>
              <button
                ref={betulButtonRef}
                type="button"
                className={`border border-black px-2 py-1 rounded font-semibold transition-colors w-1/2 ${!isTransactionAreaOpen ? 'bg-gray-400 text-gray-600 cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-700'}`}
                style={{minWidth: '0', width: '50%'}} 
                onClick={handleBetulClick}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleBetulClick();
                  } else {
                    // Handle arrow navigation
                    handleArrowNavigation(e, betulButtonRef);
                  }
                }}
                disabled={!isTransactionAreaOpen}
                title={!isTransactionAreaOpen ? "Tekan tombol Lanjut pada form nasabah terlebih dahulu" : "Tekan Enter untuk menambahkan data ke tabel transaksi"}
              >
                Betul
              </button>
              <button
                ref={lanjutButtonRef}
                type="button"
                className={`border border-black px-2 py-1 rounded font-semibold transition-colors w-1/2 ${!isTransactionAreaOpen ? 'bg-gray-400 text-gray-600 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                style={{minWidth: '0', width: '50%'}} 
                onClick={handleLanjutClick}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleLanjutClick();
                  } else {
                    // Handle arrow navigation
                    handleArrowNavigation(e, lanjutButtonRef);
                  }
                }}
                disabled={!isTransactionAreaOpen}
                title={!isTransactionAreaOpen ? "Tekan tombol Lanjut pada form nasabah terlebih dahulu" : "Tekan Enter untuk reset form dan mulai transaksi baru"}
              >
                Lanjut
              </button>
            </div>
            <button
              ref={selesaiCetakButtonRef}
              type="button"
              className={`border border-black px-2 py-1 rounded font-semibold transition-colors mb-2 ${!isTransactionAreaOpen ? 'bg-gray-400 text-gray-600 cursor-not-allowed' : 'bg-purple-700 text-white hover:bg-purple-800'}`}
              style={{minWidth: '228px', width: '228px'}} 
              onClick={handleSubmit}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSubmit(e);
                } else {
                  // Handle arrow navigation
                  handleArrowNavigation(e, selesaiCetakButtonRef);
                }
              }}
              disabled={!isTransactionAreaOpen}
              title={!isTransactionAreaOpen ? "Tekan tombol Lanjut pada form nasabah terlebih dahulu" : "Simpan semua transaksi"}
            >
              Selesai Cetak
            </button>
            <button
              ref={batalUlangButtonRef}
              type="button"
              className={`border border-black px-2 py-1 rounded font-semibold transition-colors ${!isTransactionAreaOpen ? 'bg-gray-400 text-gray-600 cursor-not-allowed' : 'bg-red-700 text-white hover:bg-red-800'}`}
              style={{minWidth: '228px', width: '228px'}} 
              onClick={handleBatalUlangClick}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleBatalUlangClick();
                } else {
                  // Handle arrow navigation
                  handleArrowNavigation(e, batalUlangButtonRef);
                }
              }}
              disabled={!isTransactionAreaOpen}
              title={!isTransactionAreaOpen ? "Tekan tombol Lanjut pada form nasabah terlebih dahulu" : "Tekan Enter untuk menghapus semua data transaksi"}
            >
              Batal/Ulang
            </button>

            {/* Tabel 1 kolom 10 baris di bawah tombol Batal Ulang */}
            {/* Spacer 4px antara tombol Batal Ulang dan Daftar Pelanggan */}
            <div style={{ height: 10 }} />
            <div className="font-bold text-center mt-2 mb-0.5" style={{ width: '228px', fontSize: '1.1rem' }}>Daftar Pelanggan</div>
            {/* Baris pertama: custom dropdown polos tanpa highlight */}
            <div className="mt-1 mb-0 flex justify-center" style={{ width: '228px', position: 'relative' }}>
              <CustomDropdownLokasi />
            </div>
            {/* Sisa 9 baris: tabel nomor */}
            <table className="border border-black mt-2 table-fixed bg-white" style={{ width: '228px' }}>
              <colgroup>
                <col style={{ width: '20%' }} />
                <col style={{ width: '80%' }} />
              </colgroup>
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-black px-2 py-1 text-center font-bold">No</th>
                  <th className="border border-black px-2 py-1 text-center font-bold">Nama</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 7 }).map((_, idx) => (
                  <tr key={idx + 1}>
                    <td className="border border-black px-2 py-0.5 text-center font-bold" style={{ width: '20%' }}>{idx + 1}</td>
                    <td className="border border-black px-2 py-0.5" style={{ width: '80%' }}>&nbsp;</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Bagian Kanan: 25% */}
          <div style={{ width: '60%', background: '#FFFFFF', minHeight: 400, marginLeft: 'auto', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: 32, maxWidth: 900 }} className="flex flex-col items-end">
            {/* Komponen tabel kurs mbarate.net */}
            <div style={{ width: '100%', marginTop: 0, padding: 0, overflow: 'hidden' }}>
              <KursMbarateTable refreshTrigger={jenisTransaksi} />
            </div>
          </div>
        </div>
        <style jsx global>{`
  input[type=number]::-webkit-inner-spin-button,
  input[type=number]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  input[type=number] {
    -moz-appearance: textfield;
  }
  textarea[readonly] {
    text-align: right;
  }
  
  /* Modern Focus Highlight Styles - Merah Menyala dengan Priority Tinggi */
  input:focus, textarea:focus, input:focus-visible, textarea:focus-visible {
    outline: none !important;
    /* Jangan ubah border, gunakan box-shadow untuk simulasi border */
    box-shadow: 0 0 0 2px #ef4444, 0 0 0 6px rgba(239, 68, 68, 0.3) !important;
    background-color: rgba(239, 68, 68, 0.05) !important;
    transition: all 0.2s ease-in-out !important;
    border-color: inherit !important; /* Pertahankan border asli */
  }
  
  /* Focus untuk tombol dengan priority tinggi */
  button:focus, button:focus-visible {
    outline: none !important;
    box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.5) !important;
    /* Jangan ubah border atau background tombol */
  }
  
  /* Focus untuk readonly fields */
  input[readonly]:focus, textarea[readonly]:focus,
  input[readonly]:focus-visible, textarea[readonly]:focus-visible {
    outline: none !important;
    box-shadow: 0 0 0 2px #ef4444, 0 0 0 6px rgba(239, 68, 68, 0.2) !important;
    background-color: rgba(239, 68, 68, 0.03) !important;
  }
  
  /* Hover effects untuk input */
  input:hover:not([readonly]):not(:focus), textarea:hover:not([readonly]):not(:focus) {
    box-shadow: 0 0 0 1px rgba(156, 163, 175, 0.3);
    transition: all 0.15s ease-in-out;
  }
  
  /* Hover untuk tombol - jangan ada transform */
  button:hover:not(:focus) {
    filter: brightness(1.05);
    transition: filter 0.15s ease-in-out;
  }
  
  /* Hilangkan semua transform dan perubahan ukuran */
  input:active, button:active, textarea:active {
    /* Jangan ada transform atau perubahan ukuran */
  }
  
  /* Pastikan semua elemen tetap pada ukuran yang sama */
  input, button, textarea {
    box-sizing: border-box;
  }
  
  /* Override untuk input di dalam tabel agar tidak bergeser */
  table input:focus, table textarea:focus,
  table input:focus-visible, table textarea:focus-visible {
    outline: none !important;
    box-shadow: 0 0 0 2px #ef4444, 0 0 0 4px rgba(239, 68, 68, 0.2) !important;
    background-color: rgba(239, 68, 68, 0.05) !important;
    border-color: inherit !important;
    /* Pastikan tidak ada perubahan ukuran */
    transform: none !important;
    margin: 0 !important;
    padding: inherit !important;
  }
`}</style>
      </div>
    </main>
  )
}
