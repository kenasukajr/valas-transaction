"use client"

import React, { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

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
  [key: string]: any;
}

export function UserFormRight({ formData, handleChange, handleImagePaste, handleImageUpload, clearImage, handleSubmit, savedTransactions, onAutofillSelect, hideButtons = false, previewSuggestion, onLanjutClick }: {
  formData: Nasabah;
  handleChange: (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleImagePaste: (e: React.ClipboardEvent) => void;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  clearImage: () => void;
  handleSubmit: (e: React.FormEvent) => void;
  savedTransactions: Nasabah[];
  onAutofillSelect: (selected: Nasabah) => void;
  hideButtons?: boolean;
  previewSuggestion?: any;
  onLanjutClick?: () => void;
}) {
  // PATCH: images state sinkron dengan previewSuggestion jika ada,
  // jika previewSuggestion null, tampilkan gambar dari formData (upload manual)
  const getImagesFromSource = () => {
    // Prioritas 1: Jika ada previewSuggestion, gunakan itu (suggestion/autofill)
    if (previewSuggestion) {
      if (Array.isArray(previewSuggestion.images) && previewSuggestion.images.length > 0) return previewSuggestion.images;
      if (previewSuggestion.image) return [previewSuggestion.image];
      return [];
    }
    
    // Prioritas 2: Jika tidak ada previewSuggestion, tampilkan gambar dari formData (upload manual)
    if (formData.images && Array.isArray(formData.images) && formData.images.length > 0) {
      return formData.images;
    }
    if (formData.image && formData.image.trim() !== '') {
      return [formData.image];
    }
    
    return [];
  };
  const [images, setImages] = useState<string[]>(getImagesFromSource());
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  
  // PATCH: Track sumber gambar untuk membedakan manual upload vs preview suggestion
  const [imageSource, setImageSource] = useState<'manual' | 'suggestion' | null>(null);

  // PATCH: Sinkronisasi images state dengan formData.images dari parent (previewSuggestion)
  // Jika jumlah gambar berubah (misal upload/add), tetap di gambar terakhir. Jika ganti data (suggestion/autofill), ke gambar pertama.
  const prevImagesLength = useRef<number>(images.length);
  const prevImagesRef = useRef<string[]>(images);
  // Tambahkan flag agar upload gambar tidak dianggap suggestion
  const isAddingImage = useRef(false);

  useEffect(() => {
    console.log(`🖼️ UserFormRight useEffect: previewSuggestion =`, previewSuggestion);
    console.log(`📁 formData.images:`, formData.images, `formData.image:`, formData.image);
    console.log(`🏷️ imageSource:`, imageSource);
    
    // PRIORITAS 1: Jika ada previewSuggestion, tampilkan gambar dari suggestion
    if (previewSuggestion) {
      console.log(`  → Ada previewSuggestion: ${previewSuggestion.name}`);
      if (Array.isArray(previewSuggestion.images) && previewSuggestion.images.length > 0) {
        if (!arraysEqual(images, previewSuggestion.images)) {
          console.log(`  → Update images dengan previewSuggestion.images:`, previewSuggestion.images);
          setImages(previewSuggestion.images);
          setActiveImageIdx(0);
          setImageSource('suggestion');
          prevImagesLength.current = previewSuggestion.images.length;
          prevImagesRef.current = previewSuggestion.images;
        } else {
          console.log(`  → Images sudah sama, tidak update`);
        }
        isAddingImage.current = false;
        return;
      } else if (previewSuggestion.image) {
        const newImages = [previewSuggestion.image];
        if (!arraysEqual(images, newImages)) {
          console.log(`  → Update images dengan previewSuggestion.image:`, newImages);
          setImages(newImages);
          setActiveImageIdx(0);
          setImageSource('suggestion');
          prevImagesLength.current = 1;
          prevImagesRef.current = newImages;
        } else {
          console.log(`  → Images sudah sama, tidak update`);
        }
        isAddingImage.current = false;
        return;
      }
    }
    
    // PRIORITAS 2: Jika tidak ada previewSuggestion, cek apakah ada upload manual
    if (formData.images && Array.isArray(formData.images) && formData.images.length > 0) {
      console.log(`  → Tidak ada previewSuggestion, ada formData.images:`, formData.images);
      
      // PERBAIKAN: Untuk case dimana imageSource adalah 'suggestion' tapi previewSuggestion null
      if (imageSource === 'suggestion' && !previewSuggestion) {
        console.log(`  → Checking: imageSource=suggestion, previewSuggestion=null`);
        
        const currentName = formData.name ? formData.name.trim() : '';
        
        // Jika nama kosong, clear images
        if (!currentName) {
          console.log(`  → Nama kosong, clear images`);
          setImages([]);
          setActiveImageIdx(0);
          setImageSource(null);
          prevImagesLength.current = 0;
          prevImagesRef.current = [];
          isAddingImage.current = false;
          return;
        }
        
        // KUNCI PERBAIKAN: Cek apakah nama saat ini match dengan database
        // Jika previewSuggestion null tapi ada formData.images, kemungkinan:
        // 1. User sudah lanjut ke transaksi (valid) → keep images
        // 2. User edit nama ke invalid → clear images
        
        // Cara membedakan: 
        // 1. Cek apakah nama masih valid di database (menggunakan logic yang sama seperti shouldShowPreview)
        // 2. Cek apakah ada field lain yang terisi (indikator sudah autofill complete)
        
        // VALIDASI NAMA: Gunakan logic yang sama seperti shouldShowPreview
        const isNameValid = (() => {
          if (!currentName) return false;
          
          const inputUpper = currentName.toUpperCase();
          
          // Cari exact match terlebih dahulu
          const exactMatch = savedTransactions.find(tx => {
            const fieldValue = tx.name;
            return fieldValue && fieldValue.trim().toUpperCase() === inputUpper;
          });
          if (exactMatch) return true;
          
          // Cari prefix match yang ketat (word boundary)
          const prefixMatch = savedTransactions.find(tx => {
            const fieldValue = tx.name;
            if (!fieldValue) return false;
            
            const nameUpper = fieldValue.trim().toUpperCase();
            const words = nameUpper.split(' ');
            const inputWords = inputUpper.split(' ');
            
            // Jika input hanya 1 kata, cek apakah kata pertama dari nama dimulai dengan input
            if (inputWords.length === 1) {
              return words[0] && words[0].startsWith(inputWords[0]);
            }
            
            // Jika input lebih dari 1 kata, cek setiap kata secara berurutan
            if (inputWords.length > words.length) return false;
            
            for (let i = 0; i < inputWords.length; i++) {
              if (i === inputWords.length - 1) {
                // Kata terakhir dari input bisa partial match
                if (!words[i] || !words[i].startsWith(inputWords[i])) {
                  return false;
                }
              } else {
                // Kata-kata sebelumnya harus exact match
                if (!words[i] || words[i] !== inputWords[i]) {
                  return false;
                }
              }
            }
            return true;
          });
          return !!prefixMatch;
        })();
        
        console.log(`  → Nama "${currentName}" valid di database:`, isNameValid);
        
        // Jika nama tidak valid, CLEAR images
        if (!isNameValid) {
          console.log(`  → Nama tidak valid, clear images`);
          setImages([]);
          setActiveImageIdx(0);
          setImageSource(null);
          prevImagesLength.current = 0;
          prevImagesRef.current = [];
          isAddingImage.current = false;
          return;
        }
        
        // Jika nama valid, cek apakah data lengkap untuk membedakan autofill vs user input
        const hasCompleteData = formData.address && formData.address.trim() !== '' && 
                               formData.phone && formData.phone.trim() !== '' &&
                               formData.idNumber && formData.idNumber.trim() !== '';
        
        if (hasCompleteData && arraysEqual(images, formData.images)) {
          console.log(`  → Nama valid + data lengkap + images match → ini autofill valid yang sudah complete - KEEP images`);
          // Ini adalah autofill yang sudah complete, user mungkin sudah lanjut ke transaksi
          isAddingImage.current = false;
          return;
        } else {
          console.log(`  → Nama valid tapi data tidak lengkap atau images tidak match → clear images (mungkin user sedang ngetik)`);
          // Nama valid tapi data tidak lengkap atau images tidak match
          setImages([]);
          setActiveImageIdx(0);
          setImageSource(null);
          prevImagesLength.current = 0;
          prevImagesRef.current = [];
          isAddingImage.current = false;
          return;
        }
      }
      
      // Jika imageSource bukan 'suggestion' atau tidak ada masalah, update images dengan formData
      if (!arraysEqual(images, formData.images)) {
        console.log(`  → Update images dengan formData.images:`, formData.images);
        setImages(formData.images);
        setActiveImageIdx(0);
        // Set ke manual jika bukan suggestion
        if (imageSource !== 'suggestion') {
          setImageSource('manual');
        }
        prevImagesLength.current = formData.images.length;
        prevImagesRef.current = formData.images;
      } else {
        console.log(`  → formData.images sama dengan current images, tidak update`);
      }
      isAddingImage.current = false;
      return;
    } else if (formData.image && formData.image.trim() !== '') {
      console.log(`  → Tidak ada previewSuggestion, ada formData.image:`, formData.image);
      
      // PERBAIKAN: Sama seperti di atas untuk formData.image
      if (imageSource === 'suggestion' && !previewSuggestion) {
        console.log(`  → Checking: imageSource=suggestion, previewSuggestion=null, formData.image exists`);
        
        const currentName = formData.name ? formData.name.trim() : '';
        
        if (!currentName) {
          console.log(`  → Nama kosong, clear images`);
          setImages([]);
          setActiveImageIdx(0);
          setImageSource(null);
          prevImagesLength.current = 0;
          prevImagesRef.current = [];
          isAddingImage.current = false;
          return;
        }
        
        // KUNCI PERBAIKAN: Sama seperti di atas, cek nama valid dan data lengkap
        
        // VALIDASI NAMA: Gunakan logic yang sama seperti shouldShowPreview
        const isNameValid = (() => {
          if (!currentName) return false;
          
          const inputUpper = currentName.toUpperCase();
          
          // Cari exact match terlebih dahulu
          const exactMatch = savedTransactions.find(tx => {
            const fieldValue = tx.name;
            return fieldValue && fieldValue.trim().toUpperCase() === inputUpper;
          });
          if (exactMatch) return true;
          
          // Cari prefix match yang ketat (word boundary)
          const prefixMatch = savedTransactions.find(tx => {
            const fieldValue = tx.name;
            if (!fieldValue) return false;
            
            const nameUpper = fieldValue.trim().toUpperCase();
            const words = nameUpper.split(' ');
            const inputWords = inputUpper.split(' ');
            
            // Jika input hanya 1 kata, cek apakah kata pertama dari nama dimulai dengan input
            if (inputWords.length === 1) {
              return words[0] && words[0].startsWith(inputWords[0]);
            }
            
            // Jika input lebih dari 1 kata, cek setiap kata secara berurutan
            if (inputWords.length > words.length) return false;
            
            for (let i = 0; i < inputWords.length; i++) {
              if (i === inputWords.length - 1) {
                // Kata terakhir dari input bisa partial match
                if (!words[i] || !words[i].startsWith(inputWords[i])) {
                  return false;
                }
              } else {
                // Kata-kata sebelumnya harus exact match
                if (!words[i] || words[i] !== inputWords[i]) {
                  return false;
                }
              }
            }
            return true;
          });
          return !!prefixMatch;
        })();
        
        console.log(`  → Nama "${currentName}" valid di database:`, isNameValid);
        
        // Jika nama tidak valid, CLEAR images
        if (!isNameValid) {
          console.log(`  → Nama tidak valid, clear images`);
          setImages([]);
          setActiveImageIdx(0);
          setImageSource(null);
          prevImagesLength.current = 0;
          prevImagesRef.current = [];
          isAddingImage.current = false;
          return;
        }
        
        // Jika nama valid, cek apakah data lengkap untuk membedakan autofill vs user input
        const hasCompleteData = formData.address && formData.address.trim() !== '' && 
                               formData.phone && formData.phone.trim() !== '' &&
                               formData.idNumber && formData.idNumber.trim() !== '';
        
        const formDataImages = [formData.image];
        if (hasCompleteData && arraysEqual(images, formDataImages)) {
          console.log(`  → Nama valid + data lengkap + images match → ini autofill valid yang sudah complete - KEEP images`);
          isAddingImage.current = false;
          return;
        } else {
          console.log(`  → Nama valid tapi data tidak lengkap atau images tidak match → clear images (mungkin user sedang ngetik)`);
          setImages([]);
          setActiveImageIdx(0);
          setImageSource(null);
          prevImagesLength.current = 0;
          prevImagesRef.current = [];
          isAddingImage.current = false;
          return;
        }
      }
      
      const newImages = [formData.image];
      if (!arraysEqual(images, newImages)) {
        console.log(`  → Update images dengan formData.image:`, newImages);
        setImages(newImages);
        setActiveImageIdx(0);
        // Set ke manual jika bukan suggestion
        if (imageSource !== 'suggestion') {
          setImageSource('manual');
        }
        prevImagesLength.current = 1;
        prevImagesRef.current = newImages;
      } else {
        console.log(`  → formData.image sama dengan current images, tidak update`);
      }
      isAddingImage.current = false;
      return;
    }
    
    // PRIORITAS 3: Clear images jika tidak ada gambar dari manapun
    console.log(`  → Tidak ada previewSuggestion dan tidak ada formData images`);
    if (images.length > 0) {
      console.log(`  → Clear images karena tidak ada gambar dari manapun`);
      setImages([]);
      setActiveImageIdx(0);
      setImageSource(null);
      prevImagesLength.current = 0;
      prevImagesRef.current = [];
    } else {
      console.log(`  → Images sudah kosong, tidak perlu clear`);
    }
    isAddingImage.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.images, formData.image, previewSuggestion]);

  // Helper: cek apakah dua array sama isinya
  function arraysEqual(a: any[], b: any[]) {
    if (a === b) return true;
    if (!Array.isArray(a) || !Array.isArray(b)) return false;
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }

  // Sinkronisasi images ke parent (page.tsx) setiap kali images berubah
  useEffect(() => {
    // PATCH: Hanya sinkronisasi ke parent jika BUKAN halaman utama (form kanan)
    // Deteksi halaman nasabah dengan cek ada/tidaknya prop setFormData/onImagesChange
    if (typeof formData === 'object' && formData) {
      // Jangan update parent jika ini halaman utama (form kanan)
      const isMainForm = formData.isMainForm === true;
      if (!isMainForm && !arraysEqual(formData.images, images)) {
        if (typeof formData.setFormData === 'function') {
          formData.setFormData((prev: any) => ({ ...prev, images }));
        } else {
          if (typeof formData.onImagesChange === 'function') {
            formData.onImagesChange(images);
          }
          if ('images' in formData) {
            formData.images = images;
          }
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images]);
  const [showSuggestions, setShowSuggestions] = useState<{[key: string]: boolean}>({})

  const [filteredSuggestions, setFilteredSuggestions] = useState<{[key: string]: Nasabah[]}>({})

  const containerRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        // Clicked outside the form container, close all dropdowns
        setShowSuggestions(prev => {
          const newState: {[key: string]: boolean} = {}
          Object.keys(prev).forEach(key => {
            newState[key] = false
          })
          return newState
        })
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // PATCH: Hapus efek sinkronisasi images ke parent dari handleInputChange (khusus halaman utama saja)
  // Untuk halaman nasabah, sinkronisasi images ke parent hanya dilakukan lewat useEffect utama di atas
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleChange(e)
  };

  // Handler untuk upload gambar baru (choose file/add more)
  async function handleAddMoreImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const formDataUpload = new FormData();
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
      const imageUrl = data.imageUrl;
      isAddingImage.current = true;
      setImages(prev => {
        // Jika images kosong, replace, jika ada isi, tambahkan
        let arr = prev.length === 0 ? [imageUrl] : [...prev, imageUrl];
        setActiveImageIdx(arr.length - 1);
        setImageSource('manual'); // PERBAIKAN: Set imageSource ke 'manual' untuk upload
        // --- FORCE SYNC to formData.images (for direct mutation fallback)
        if (formData && typeof formData === 'object') {
          if ('images' in formData) {
            formData.images = arr;
          }
          if (typeof formData.setFormData === 'function') {
            formData.setFormData((prev: any) => ({ ...prev, images: arr }));
          }
          if (typeof formData.onImagesChange === 'function') {
            formData.onImagesChange(arr);
          }
        }
        return arr;
      });
    } catch (err) {
      console.error('Gagal upload gambar:', err);
    }
    e.target.value = "";
  }

  // Handler untuk tombol Clear (hapus semua gambar)
  function handleClearActiveImage() {
    console.log('🗑️ Clear button clicked');
    // Gunakan clearImage dari parent (page.tsx) untuk clear semua gambar
    clearImage();
    // Juga clear local state
    setImages([]);
    setActiveImageIdx(0);
    setImageSource(null); // PERBAIKAN: Reset imageSource
  }

  // Helper to format date to DD/MM/YYYY
  const formatDate = (dateStr: string) => {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return ''
    const day = ('0' + d.getDate()).slice(-2)
    const month = ('0' + (d.getMonth() + 1)).slice(-2)
    const year = d.getFullYear()
    return `${day}-${month}-${year}`
  }

  // Helper to truncate string at word boundary within max length
  const truncateAtWord = (str: string, maxLength: number) => {
    if (str.length <= maxLength) return str
    const truncated = str.substring(0, maxLength)
    const lastSpace = truncated.lastIndexOf(' ')
    if (lastSpace === -1) return truncated
    return truncated.substring(0, lastSpace)
  }

  // Helper to ensure string length does not exceed max length
  const truncateMaxLength = (str: string, maxLength: number) => {
    if (str.length <= maxLength) return str
    return str.substring(0, maxLength)
  }

  // Function to generate and download AHK script
  const generateAndDownloadAHK = (data: any) => {
    const formattedBirthDate = formatDate(data.birthDate)
    let truncatedAddress = truncateAtWord(data.address || '', 70)
    truncatedAddress = truncateMaxLength(truncatedAddress, 70)

    const ahkLines = []
    ahkLines.push('IfWinExist, Data Prosesing PT Mulia Bumi Arta')
    ahkLines.push('{')
    ahkLines.push('    WinRestore, Data Prosesing PT Mulia Bumi Arta')
    ahkLines.push('    WinActivate, Data Prosesing PT Mulia Bumi Arta')
    ahkLines.push('    WinMaximize, Data Prosesing PT Mulia Bumi Arta')
    ahkLines.push('}')
    ahkLines.push('else')
    ahkLines.push('{')
    ahkLines.push('    MsgBox, 16, Error, Window "Data Prosesing PT Mulia Bumi Arta" tidak ditemukan. Pastikan program sudah berjalan.')
    ahkLines.push('    ExitApp')
    ahkLines.push('}')
    ahkLines.push('')
    ahkLines.push('Send, {Enter}')
    ahkLines.push('Sleep, 500')
    ahkLines.push('Send, {Enter}')
    ahkLines.push('Sleep, 500')
    ahkLines.push('')
    
    // Data Diri
    ahkLines.push('data := {}')
    ahkLines.push(`data["Nama Lengkap"] := "${data.name || ''}"`)
    ahkLines.push(`data["Alamat"] := "${truncatedAddress}"`)
    ahkLines.push(`data["Nomor Telepon"] := "${data.phone || ''}"`)
    ahkLines.push(`data["Pekerjaan"] := "${data.job || ''}"`)
    ahkLines.push(`data["Nomor Identitas"] := "${data.idNumber || ''}"`)
    ahkLines.push(`data["Tempat Tanggal Lahir"] := "${data.birthPlace || ''}${formattedBirthDate}"`)
    ahkLines.push('')
    
    // Data Transaksi (jika ada)
    if (data.currency && data.amount && data.rate) {
      ahkLines.push('transactionData := {}')
      ahkLines.push(`transactionData["Currency"] := "${data.currency || ''}"`)
      ahkLines.push(`transactionData["Amount"] := "${data.amount || ''}"`)
      ahkLines.push(`transactionData["Rate"] := "${data.rate || ''}"`)
      ahkLines.push(`transactionData["Total"] := "${data.rupiahEquivalent || ''}"`)
      ahkLines.push('')
    }
    
    ahkLines.push('TypeString(str) {')
    ahkLines.push('    Loop Parse, str')
    ahkLines.push('    {')
    ahkLines.push('        Send %A_LoopField%')
    ahkLines.push('        Sleep 0')
    ahkLines.push('    }')
    ahkLines.push('}')
    ahkLines.push('')
    
    // Isi data diri
    ahkLines.push('keys := ["Nama Lengkap", "Alamat", "Nomor Telepon", "Pekerjaan", "Nomor Identitas", "Tempat Tanggal Lahir"]')
    ahkLines.push('for index, key in keys')
    ahkLines.push('{')
    ahkLines.push('    TypeString(data[key])')
    ahkLines.push('    Sleep 0')
    ahkLines.push('    Send {Tab}')
    ahkLines.push('    Sleep 0')
    ahkLines.push('}')
    ahkLines.push('')
    
    // Isi data transaksi (jika ada)
    if (data.currency && data.amount && data.rate) {
      ahkLines.push('; Lanjut ke bagian transaksi')
      ahkLines.push('Send, {Tab}')  // Pindah ke bagian transaksi
      ahkLines.push('Sleep, 500')
      ahkLines.push('')
      ahkLines.push('transactionKeys := ["Currency", "Amount", "Rate"]')
      ahkLines.push('for index, key in transactionKeys')
      ahkLines.push('{')
      ahkLines.push('    TypeString(transactionData[key])')
      ahkLines.push('    Sleep, 100')
      ahkLines.push('    Send {Tab}')
      ahkLines.push('    Sleep, 100')
      ahkLines.push('}')
      ahkLines.push('')
    }
    
    ahkLines.push('Sleep 500')
    ahkLines.push('FileDelete, %A_ScriptFullPath%')
    ahkLines.push('ExitApp')

    const ahkContent = ahkLines.join('\n')

  const blob = new Blob([ahkContent], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'auto_type_form.ahk'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
  }

  // Wrapper for handleSubmit to generate AHK script after saving
  const handleSubmitWrapper = (e: React.FormEvent) => {
    e.preventDefault()
    handleSubmit(e)
    generateAndDownloadAHK(formData)
  }

  const getBackendUrl = () => {
    if (typeof window !== 'undefined') {
      // Always use port 5000 for backend image preview
      const { protocol, hostname } = window.location;
      return `${protocol}//${hostname}:5000`;
    }
    return '';
  };

  return (
    <div className="h-full flex flex-col">
      {/* Photo Upload - Top */}
      <div className="mb-4">
          <div className="space-y-4 relative">
      {!hideButtons && (
        <div className="flex justify-center gap-2">
          {/* Choose File: hanya aktif jika belum ada gambar */}
          <input
            type="file"
            accept="image/*"
            onChange={handleAddMoreImage}
            className="hidden"
            id="file-upload"
            disabled={images.length > 0}
          />
          <label
            htmlFor="file-upload"
            className={`px-4 py-2 rounded select-none transition-colors ${images.length > 0 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white cursor-pointer hover:bg-blue-700'}`}
            style={images.length > 0 ? { pointerEvents: 'none' } : {}}
          >
            Choose File
          </label>
          {/* Add More: hanya aktif jika sudah ada gambar */}
          <input
            type="file"
            accept="image/*"
            onChange={handleAddMoreImage}
            className="hidden"
            id="add-more-upload"
            disabled={images.length === 0}
          />
          <label
            htmlFor="add-more-upload"
            className={`px-4 py-2 rounded select-none transition-colors ml-2 ${images.length === 0 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-green-600 text-white cursor-pointer hover:bg-green-700'}`}
            style={images.length === 0 ? { pointerEvents: 'none' } : {}}
          >
            Add More
          </label>
          {/* Clear: hanya aktif jika ada gambar */}
          {images.length > 0 && (
            <Button type="button" variant="destructive" onClick={handleClearActiveImage}>
              Clear
            </Button>
          )}
        </div>
      )}
          
          <div 
            className="border rounded-md p-4 text-center cursor-pointer hover:border-gray-400 transition-colors mx-auto relative"
            style={{ width: '600px', height: '360px', marginBottom: '32px' }}
            onPaste={handleImagePaste}
            tabIndex={0}
          >
            {images.length > 0 ? (
              <>
                <img 
                  src={images[activeImageIdx]?.startsWith('/uploads/') ? `${getBackendUrl()}${images[activeImageIdx]}` : images[activeImageIdx]} 
                  alt="Preview" 
                  className="w-full object-contain rounded"
                  style={{ maxHeight: '280px' }}
                />
                {/* Navigasi angka */}
                {images.length > 1 && (
                  <div className="flex justify-center gap-1 mt-3">
                    {images.map((img, idx) => (
                      <button
                        key={idx}
                        type="button"
                        className={`w-8 h-8 rounded border text-sm flex items-center justify-center transition-colors ${activeImageIdx === idx ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-200 text-gray-800 border-gray-400 hover:bg-blue-100'}`}
                        onClick={e => {
                          e.preventDefault();
                          setActiveImageIdx(idx);
                        }}
                        aria-label={`Gambar ${idx + 1}`}
                      >
                        {idx + 1}
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <p className="mb-2 text-sm">Upload atau paste gambar (Ctrl+V untuk paste) 300px x 180px</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {!hideButtons && (
        <>
          {/* Lanjut Button - Bottom */}
          <div className="flex gap-2 mb-4 mt-2">
            <Button 
              type="button" 
              id="lanjut-button"
              onClick={() => {
                // Panggil callback untuk mengaktifkan area transaksi
                if (onLanjutClick) {
                  onLanjutClick();
                }
                // Focus ke field Code di transaksi valas
                setTimeout(() => {
                  const codeField = document.getElementById('valas-code-field');
                  if (codeField) {
                    codeField.focus();
                  }
                }, 100);
              }} 
              className="flex-1" 
              variant="default" 
              style={{ backgroundColor: '#2563eb', color: 'white' }}
            >
              Lanjut
            </Button>
            <Button type="button" variant="default" className="flex-1" style={{ backgroundColor: '#2563eb', color: 'white' }} onClick={() => {
              // Clear all form fields
              const emptyEvent = {
                target: {
                  name: '',
                  value: ''
                }
              } as unknown as React.ChangeEvent<HTMLInputElement>
              // Clear each field by calling handleChange with empty value
              const fields = ['idNumber', 'name', 'address', 'phone', 'job', 'birthPlace', 'birthDate', 'image']
              fields.forEach(field => {
                emptyEvent.target.name = field
                emptyEvent.target.value = ''
                handleChange(emptyEvent)
              })
              // Close all autofill suggestion dropdowns by setting all keys to false
              setShowSuggestions(prev => {
                const newState: {[key: string]: boolean} = {}
                Object.keys(prev).forEach(key => {
                  newState[key] = false
                })
                return newState
              })
            }}>
              Batal
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
