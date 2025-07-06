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
  // jika previewSuggestion null DAN formData.image/images ada, hanya tampilkan jika user upload manual
  const getImagesFromSource = () => {
    // Jika ada previewSuggestion, gunakan itu (suggestion/autofill)
    if (previewSuggestion) {
      if (Array.isArray(previewSuggestion.images) && previewSuggestion.images.length > 0) return previewSuggestion.images;
      if (previewSuggestion.image) return [previewSuggestion.image];
      return [];
    }
    // Jika tidak ada previewSuggestion, hanya tampilkan gambar jika user upload manual (bukan autofill)
    // Cek: jika formData.image/images ada DAN formData.name kosong (form baru) atau formData hasil upload manual
    if (formData.images && Array.isArray(formData.images) && formData.images.length > 0 && !formData.name) return formData.images;
    if (formData.image && !formData.name) return [formData.image];
    return [];
  };
  const [images, setImages] = useState<string[]>(getImagesFromSource());
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  // PATCH: Sinkronisasi images state dengan formData.images dari parent (previewSuggestion)
  // Jika jumlah gambar berubah (misal upload/add), tetap di gambar terakhir. Jika ganti data (suggestion/autofill), ke gambar pertama.
  const prevImagesLength = useRef<number>(images.length);
  const prevImagesRef = useRef<string[]>(images);
  // Tambahkan flag agar upload gambar tidak dianggap suggestion
  const isAddingImage = useRef(false);

  useEffect(() => {
    // Jika ada previewSuggestion, selalu tampilkan gambar dari situ
    if (previewSuggestion) {
      if (Array.isArray(previewSuggestion.images) && previewSuggestion.images.length > 0) {
        // Hanya update jika array gambar berbeda
        if (!arraysEqual(images, previewSuggestion.images)) {
          setImages(previewSuggestion.images);
          setActiveImageIdx(0); // Reset hanya jika data benar-benar berbeda
          prevImagesLength.current = previewSuggestion.images.length;
          prevImagesRef.current = previewSuggestion.images;
        }
        isAddingImage.current = false;
        return;
      } else if (previewSuggestion.image) {
        const newImages = [previewSuggestion.image];
        // Hanya update jika array gambar berbeda
        if (!arraysEqual(images, newImages)) {
          setImages(newImages);
          setActiveImageIdx(0); // Reset hanya jika data benar-benar berbeda
          prevImagesLength.current = 1;
          prevImagesRef.current = newImages;
        }
        isAddingImage.current = false;
        return;
      } else {
        // Jika previewSuggestion tidak punya gambar, hanya clear jika belum kosong
        if (images.length > 0) {
          setImages([]);
          setActiveImageIdx(0);
          prevImagesLength.current = 0;
          prevImagesRef.current = [];
        }
        isAddingImage.current = false;
        return;
      }
    } 
    
    // Fallback: jika tidak ada previewSuggestion, tampilkan gambar dari formData jika ada
    if (formData.images && Array.isArray(formData.images) && formData.images.length > 0) {
      // Hanya update jika array gambar berbeda
      if (!arraysEqual(images, formData.images)) {
        setImages(formData.images);
        setActiveImageIdx(0); // Reset hanya jika data benar-benar berbeda
        prevImagesLength.current = formData.images.length;
        prevImagesRef.current = formData.images;
      }
      isAddingImage.current = false;
      return;
    } else if (formData.image) {
      const newImages = [formData.image];
      // Hanya update jika array gambar berbeda
      if (!arraysEqual(images, newImages)) {
        setImages(newImages);
        setActiveImageIdx(0); // Reset hanya jika data benar-benar berbeda
        prevImagesLength.current = 1;
        prevImagesRef.current = newImages;
      }
      isAddingImage.current = false;
      return;
    } else {
      // Tidak ada gambar sama sekali, hanya clear jika belum kosong
      if (images.length > 0) {
        setImages([]);
        setActiveImageIdx(0);
        prevImagesLength.current = 0;
        prevImagesRef.current = [];
        isAddingImage.current = false;
      }
      return;
    }
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

  // Handler untuk tombol Clear (hapus gambar aktif)
  function handleClearActiveImage() {
    setImages(prev => {
      if (prev.length === 0) return prev;
      const arr = prev.filter((_, idx) => idx !== activeImageIdx);
      let nextIdx = activeImageIdx;
      if (arr.length === 0) {
        nextIdx = 0;
      } else if (activeImageIdx >= arr.length) {
        nextIdx = arr.length - 1;
      }
      setTimeout(() => setActiveImageIdx(nextIdx), 0);
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

    const ahkContent = `; Auto-generated AutoHotkey script to input form data
; Script runs immediately without hotkey
; Assume program is already running but may be minimized or not active
; Activate window, maximize window, else show error and exit
IfWinExist, Data Prosesing PT Mulia Bumi Arta
{
    WinRestore, Data Prosesing PT Mulia Bumi Arta
    WinActivate, Data Prosesing PT Mulia Bumi Arta
    WinMaximize, Data Prosesing PT Mulia Bumi Arta
}
else
{
    MsgBox, 16, Error, Window "Data Prosesing PT Mulia Bumi Arta" tidak ditemukan. Pastikan program sudah berjalan.
    ExitApp
}
; No sleep after activation

; Select BNB by pressing Enter
Send, {Enter}
Sleep, 500

; Select kerjakan by pressing K
Send, k
Sleep, 500

; Data to input
data := {}
data["Nama Lengkap"] := "${data.name || ''}"
data["Alamat"] := "${truncatedAddress}"
data["Nomor Telepon"] := "${data.phone || ''}"
data["Pekerjaan"] := "${data.job || ''}"
data["Nomor Identitas"] := "${data.idNumber || ''}"
data["Tempat Tanggal Lahir"] := "${data.birthPlace || ''}${formattedBirthDate}"

TypeString(str) {
    Loop Parse, str
    {
        Send %A_LoopField%
        Sleep 0
    }
}

keys := ["Nama Lengkap", "Alamat", "Nomor Telepon", "Pekerjaan", "Nomor Identitas", "Tempat Tanggal Lahir"]
for index, key in keys
{
    TypeString(data[key])
    Sleep 0
    Send {Tab}
    Sleep 0
}
Sleep 500
FileDelete, %A_ScriptFullPath%
ExitApp
`

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
