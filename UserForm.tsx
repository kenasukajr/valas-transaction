"use client"

import { useState, useRef, RefObject } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

interface FormData {
  name: string
  address: string
  phone: string
  job: string
  idNumber: string
  birthPlace: string
  birthDate: string
  image: string
}

export function UserForm({ formData, handleChange, savedTransactions, onAutofillSelect }: {
  formData: any
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  savedTransactions: FormData[]
  onAutofillSelect: (selected: FormData) => void
}) {
  const [showSuggestions, setShowSuggestions] = useState<{[key: string]: boolean}>({
    name: false,
    address: false,
    phone: false,
    job: false
  })

  const [filteredSuggestions, setFilteredSuggestions] = useState<{[key: string]: FormData[]}>({
    name: [],
    address: [],
    phone: [],
    job: []
  })

  // Add refs for each field with correct type
  const inputRefs: Record<string, RefObject<HTMLInputElement | null>> = {
    name: useRef<HTMLInputElement>(null),
    address: useRef<HTMLInputElement>(null),
    phone: useRef<HTMLInputElement>(null),
    job: useRef<HTMLInputElement>(null)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    handleChange(e)

    if (value.length === 0) {
      setShowSuggestions(prev => ({ ...prev, [name]: false }))
      setFilteredSuggestions(prev => ({ ...prev, [name]: [] }))
      return
    }

    const filtered = savedTransactions.filter(tx => tx[name as keyof FormData]?.toLowerCase().includes(value.toLowerCase()))
    setFilteredSuggestions(prev => ({ ...prev, [name]: filtered }))
    setShowSuggestions(prev => ({ ...prev, [name]: true }))
  }

  const handleSuggestionClick = (field: string, selected: FormData) => {
    onAutofillSelect(selected)
    setShowSuggestions(prev => ({ ...prev, [field]: false }))
  }

  return (
    <div className="space-y-4">
      {["name", "address", "phone", "job"].map((field) => (
        <div key={field} className="space-y-2">
          <Label htmlFor={field}>{{
            name: "Nama Lengkap",
            address: "Alamat",
            phone: "Nomor Telepon",
            job: "Pekerjaan"
          }[field]}</Label>
          <div className="relative">
            <Input
              id={field}
              name={field}
              ref={inputRefs[field]}
              value={formData[field]}
              onChange={handleInputChange}
              required
              placeholder={`Masukkan ${{
                name: "nama lengkap",
                address: "alamat lengkap",
                phone: "nomor telepon",
                job: "pekerjaan"
              }[field]}`}
              autoComplete="off"
              onBlur={() => setTimeout(() => setShowSuggestions(prev => ({ ...prev, [field]: false })), 100)}
              onFocus={() => {
                const filtered = formData[field].length > 0
                  ? savedTransactions.filter(tx => tx[field as keyof FormData]?.toLowerCase().includes(formData[field].toLowerCase()))
                  : savedTransactions
                setFilteredSuggestions(prev => ({ ...prev, [field]: filtered }))
                setShowSuggestions(prev => ({ ...prev, [field]: true }))
              }}
            />
            {showSuggestions[field] && filteredSuggestions[field].length > 0 && (
              <ul
                className="absolute z-10 bg-white border border-gray-300 rounded-md max-h-40 overflow-auto shadow-md"
                style={{
                  top: '100%',
                  left: 0,
                  right: 0,
                  width: '100%'
                }}
              >
                {filteredSuggestions[field].map((suggestion, index) => (
                  <li
                    key={index}
                    className="px-3 py-1 cursor-pointer hover:bg-gray-100"
                    onMouseDown={() => handleSuggestionClick(field, suggestion)}
                  >
                    {suggestion[field as keyof FormData]}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export function UserFormRight({ formData, handleChange, handleImagePaste, handleImageUpload, clearImage, handleSubmit, savedTransactions, onAutofillSelect }: {
  formData: any
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleImagePaste: (e: React.ClipboardEvent) => void
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
  clearImage: () => void
  handleSubmit: (e: React.FormEvent) => void
  savedTransactions: FormData[]
  onAutofillSelect: (selected: FormData) => void
}) {
  const [showSuggestions, setShowSuggestions] = useState<{[key: string]: boolean}>({
    idNumber: false,
    birthPlace: false,
    birthDate: false
  })

  const [filteredSuggestions, setFilteredSuggestions] = useState<{[key: string]: FormData[]}>({
    idNumber: [],
    birthPlace: [],
    birthDate: []
  })

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
      return tx[name as keyof FormData]?.toLowerCase().includes(value.toLowerCase())
    })
    setFilteredSuggestions(prev => ({ ...prev, [name]: filtered }))
    setShowSuggestions(prev => ({ ...prev, [name]: true }))
  }

  const handleSuggestionClick = (field: string, selected: FormData) => {
    onAutofillSelect(selected)
    setShowSuggestions(prev => ({ ...prev, [field]: false }))
  }

  return (
    <form onSubmit={handleSubmit} className="h-full flex flex-col">
      {/* Photo Upload - Top */}
      <div className="mb-4">
        <Label>Foto/Gambar</Label>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="flex-1"
            />
            {formData.image && (
              <Button type="button" variant="outline" onClick={clearImage}>
                Hapus Gambar
              </Button>
            )}
          </div>
          
          <div 
            className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-gray-400 transition-colors mx-auto"
            style={{ width: '300px', height: '180px' }}
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
                <p className="mb-2 text-sm">Upload atau paste gambar</p>
                <p className="text-xs">Ctrl+V untuk paste</p>
                <p className="text-xs mt-1">300px x 180px</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Middle Fields */}
      <div className="flex-1 space-y-4 mb-4">
        {["idNumber", "birthPlace", "birthDate"].map((field) => (
          <div key={field} className="relative space-y-2">
            <Label htmlFor={field}>{{
              idNumber: "Nomor Identitas",
              birthPlace: "Tempat Lahir",
              birthDate: "Tanggal Lahir"
            }[field]}</Label>
            <Input
              id={field}
              name={field}
              type={field === "birthDate" ? "date" : "text"}
              value={formData[field]}
              onChange={handleInputChange}
              required
              placeholder={`Masukkan ${{
                idNumber: "nomor identitas",
                birthPlace: "tempat lahir",
                birthDate: "tanggal lahir"
              }[field]}`}
              autoComplete="off"
              onBlur={() => setTimeout(() => setShowSuggestions(prev => ({ ...prev, [field]: false })), 100)}
              onFocus={() => {
                if (formData[field].length > 0) {
                  const filtered = savedTransactions.filter(tx => {
                    if (field === "birthDate") {
                      return tx.birthDate?.toLowerCase().includes(formData[field].toLowerCase())
                    }
                    return tx[field as keyof FormData]?.toLowerCase().includes(formData[field].toLowerCase())
                  })
                  setFilteredSuggestions(prev => ({ ...prev, [field]: filtered }))
                  setShowSuggestions(prev => ({ ...prev, [field]: true }))
                }
              }}
            />
            {showSuggestions[field] && filteredSuggestions[field].length > 0 && (
              <ul
                className="absolute z-10 bg-white border border-gray-300 rounded-md max-h-40 overflow-auto shadow-md"
                style={{
                  top: document.getElementById(field)?.offsetHeight + 'px' || '100%',
                  left: 0,
                  width: '100%',
                  maxWidth: document.getElementById(field)?.offsetWidth + 'px' || '100%' // Ensure dropdown width matches input field
                }}
              >
                {filteredSuggestions[field].map((suggestion, index) => (
                  <li
                    key={index}
                    className="px-3 py-1 cursor-pointer hover:bg-gray-100"
                    onMouseDown={() => handleSuggestionClick(field, suggestion)}
                  >
                    {field === "birthDate" ? suggestion.birthDate : suggestion[field as keyof FormData]}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>

      {/* Submit Button - Bottom */}
      <div className="mt-auto">
        <Button type="submit" className="w-full">
          Simpan Data
        </Button>
      </div>
    </form>
  )
}
