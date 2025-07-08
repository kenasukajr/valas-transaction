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

export function UserFormTransaksiMod({ formData, handleChange, handleImagePaste, handleImageUpload, clearImage, handleSubmit, savedTransactions, onAutofillSelect }: {
  formData: Nasabah;
  handleChange: (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleImagePaste: (e: React.ClipboardEvent) => void;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  clearImage: () => void;
  handleSubmit: (e: React.FormEvent) => void;
  savedTransactions: Nasabah[];
  onAutofillSelect: (selected: Nasabah) => void;
}) {
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    handleChange(e)

    if (value.length === 0) {
      setShowSuggestions(prev => ({ ...prev, [name]: false }))
      setFilteredSuggestions(prev => ({ ...prev, [name]: [] }))
      return
    }

    const filtered = savedTransactions.filter(tx => {
      if (name === "birthDate") {
        return tx.birthDate?.toLowerCase().includes(value.toLowerCase())
      }
      return tx[name as keyof Nasabah]?.toLowerCase().includes(value.toLowerCase())
    })
    setFilteredSuggestions(prev => ({ ...prev, [name]: filtered }))
    setShowSuggestions(prev => ({ ...prev, [name]: true }))
  }

  const handleSuggestionClick = (field: string, selected: Nasabah) => {
    onAutofillSelect(selected)
    setShowSuggestions(prev => ({ ...prev, [field]: false }))
  }

  // Helper to format date to DD/MM/YYYY
  const formatDate = (dateString: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return ''
    return ` ${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`
  }

  // Helper to truncate string at word boundary within max length
  const truncateAtWord = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text
    const truncated = text.substring(0, maxLength)
    const lastSpaceIndex = truncated.lastIndexOf(' ')
    return lastSpaceIndex > 0 ? truncated.substring(0, lastSpaceIndex) + '...' : truncated + '...'
  }

  // Helper to ensure string length does not exceed max length
  const truncateMaxLength = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.substring(0, maxLength) : text
  }
  // Function to generate and download AHK script
  const generateAndDownloadAHK = (data: any) => {
    const formattedBirthDate = formatDate(data.birthDate)
    let truncatedAddress = truncateAtWord(data.address || '', 70)
    truncatedAddress = truncateMaxLength(truncatedAddress, 70)

    // Build AHK content step by step to avoid template literal issues
    let ahkLines = []
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

  return (
    <form onSubmit={handleSubmitWrapper} className="h-full flex flex-col">
      {/* Photo Upload - Top */}
      <div className="mb-4">
        <Label>Foto/Gambar</Label>
          <div className="space-y-4 relative">
          <div className="flex justify-center gap-2" style={{ display: 'none' }}>
            {/* Hidden Choose File, Clear, Simpan Data, and Batal buttons without changing UserFormRight */}
          </div>
          
          <div 
            className="border rounded-md p-4 text-center cursor-pointer hover:border-gray-400 transition-colors mx-auto"
            style={{ width: '600px', height: '360px' }}
            onPaste={handleImagePaste}
            tabIndex={0}
          >
            {formData.image ? (
              <img 
                src={formData.image} 
                alt="Preview" 
                className="w-full h-full object-contain rounded"
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <p className="mb-2 text-sm">Upload atau paste gambar (Ctrl+V untuk paste) 300px x 180px</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Submit Button - Bottom */}
      <div className="flex gap-2 mb-4" style={{ display: 'none' }}>
        <Button type="submit" className="flex-1" variant="default" style={{ backgroundColor: '#2563eb', color: 'white' }}>
          Simpan Data
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
    </form>
  )
}
