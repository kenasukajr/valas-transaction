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
