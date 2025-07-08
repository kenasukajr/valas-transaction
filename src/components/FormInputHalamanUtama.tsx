"use client"

import React, { useState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { deduplicateByKey } from "@/lib/deduplicate"

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
}

interface FormInputHalamanUtamaProps {
  formData: Nasabah;
  handleChange: (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => void;
  savedTransactions: Nasabah[];
  onAutofillSelect: (selected: Nasabah) => void;
  onTransactionTypeSelect?: (type: string) => void;
  handleImagePaste: (e: React.ClipboardEvent<HTMLFormElement>) => void;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  clearImage: () => void;
  handleSubmit: (e: React.FormEvent) => void;
  readOnly?: boolean;
}

export const FormInputHalamanUtama: React.FC<FormInputHalamanUtamaProps> = ({
  formData,
  handleChange,
  savedTransactions,
  onAutofillSelect,
  onTransactionTypeSelect,
  handleImagePaste,
  handleImageUpload,
  clearImage,
  handleSubmit,
  readOnly = false,
}) => {
  const [showSuggestions, setShowSuggestions] = useState<{[key: string]: boolean}>({
    name: false,
    address: false,
    phone: false,
    job: false,
    idNumber: false,
    birthPlace: false,
    birthDate: false
  })

  const [filteredSuggestions, setFilteredSuggestions] = useState<{[key: string]: Nasabah[]}>({
    name: [],
    address: [],
    phone: [],
    job: [],
    idNumber: [],
    birthPlace: [],
    birthDate: []
  })

  // State for selected transaction type
  const [selectedTransactionType, setSelectedTransactionType] = useState<string | null>(formData.transactionType || null)

  // Update transaction type in formData
  const updateTransactionTypeInFormData = (type: string) => {
    if (handleChange) {
      const event = {
        target: {
          name: "transactionType",
          value: type
        }
      } as React.ChangeEvent<HTMLInputElement>
      handleChange(event)
    }
  }

  // Create refs for dropdown suggestion containers
  const dropdownRefs = {
    idNumber: useRef<HTMLUListElement>(null),
    name: useRef<HTMLUListElement>(null),
    address: useRef<HTMLUListElement>(null),
    phone: useRef<HTMLUListElement>(null),
    job: useRef<HTMLUListElement>(null),
    birthPlace: useRef<HTMLUListElement>(null),
    birthDate: useRef<HTMLUListElement>(null),
  }

  // Ref for entire form container
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        setShowSuggestions({
          name: false,
          address: false,
          phone: false,
          job: false,
          idNumber: false,
          birthPlace: false,
          birthDate: false
        })
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const upperValue = value.toUpperCase();
    const customEvent = {
      target: {
        name,
        value: upperValue,
      }
    } as React.ChangeEvent<HTMLInputElement>;
    handleChange(customEvent);

    if (upperValue.length === 0) {
      setShowSuggestions(prev => ({ ...prev, [name]: false }))
      setFilteredSuggestions(prev => ({ ...prev, [name]: [] }))
      return
    }

    let filtered = savedTransactions.filter(tx => {
      if (name === "birthDate") {
        return tx.birthDate?.toLowerCase().includes(value.toLowerCase())
      }
      return tx[name as keyof Nasabah]?.toLowerCase().includes(value.toLowerCase())
    })

    filtered = deduplicateByKey(filtered, name as keyof Nasabah)

    setFilteredSuggestions(prev => ({ ...prev, [name]: filtered }))
    setShowSuggestions(prev => ({ ...prev, [name]: true }))
  }

  const handleSuggestionClick = (field: string, selected: Nasabah) => {
    const mergedData = {
      ...selected,
      transactionType: selectedTransactionType || formData.transactionType || ""
    };
    onAutofillSelect(mergedData);
    setShowSuggestions(prev => ({ ...prev, [field]: false }))

    if (mergedData.transactionType !== selectedTransactionType) {
      setSelectedTransactionType(mergedData.transactionType)
    }
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} onPaste={handleImagePaste} className="space-y-4">
      <div className="flex gap-2 mb-2">
        <Button
          type="button"
          variant="default"
          className={`flex-1 text-white hover:bg-blue-700 ${selectedTransactionType === "BNB" ? "bg-black" : "bg-blue-600"}`}
          onClick={() => {
            setSelectedTransactionType("BNB")
            updateTransactionTypeInFormData("BNB")
            if (onTransactionTypeSelect) onTransactionTypeSelect("BNB")
          }}
          disabled={readOnly}
        >
          BNB
        </Button>
        <Button
          type="button"
          variant="default"
          className={`flex-1 text-white hover:bg-blue-700 ${selectedTransactionType === "BNS" ? "bg-black" : "bg-blue-600"}`}
          onClick={() => {
            setSelectedTransactionType("BNS")
            updateTransactionTypeInFormData("BNS")
            if (onTransactionTypeSelect) onTransactionTypeSelect("BNS")
          }}
          disabled={readOnly}
        >
          BNS
        </Button>
      </div>
      <div className="space-y-4">
        <div className="relative w-full">
          <Label htmlFor="transactionType">Jenis Transaksi</Label>
          <Input
            id="transactionType"
            name="transactionType"
            type="text"
            value={formData.transactionType || ""}
            onChange={handleInputChange}
            required
            placeholder="Masukkan jenis transaksi"
            autoComplete="off"
            readOnly
          />
        </div>
        <div className="relative w-full">
          <Label htmlFor="idNumber">Nomor Identitas</Label>
          <Input
            id="idNumber"
            name="idNumber"
            type="text"
            value={formData.idNumber}
            onChange={handleInputChange}
            required
            placeholder="Masukkan nomor identitas"
            autoComplete="off"
            readOnly={readOnly}
            disabled={readOnly}
          />
          {showSuggestions.idNumber && filteredSuggestions.idNumber.length > 0 && (
            <ul
              ref={dropdownRefs.idNumber}
              className="border border-gray-300 rounded mt-1 max-h-40 overflow-auto bg-white z-10 absolute"
              style={{ width: '100%' }}
            >
              {filteredSuggestions.idNumber.map((suggestion, index) => (
                <li
                  key={index}
                  className="px-2 py-1 cursor-pointer hover:bg-gray-200"
                  onClick={() => handleSuggestionClick('idNumber', suggestion)}
                >
                  {suggestion.idNumber}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="relative w-full">
          <Label htmlFor="name">Nama Lengkap</Label>
          <Input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleInputChange}
            required
            placeholder="Masukkan nama lengkap"
            autoComplete="off"
            readOnly={readOnly}
            disabled={readOnly}
          />
          {showSuggestions.name && filteredSuggestions.name.length > 0 && (
            <ul
              ref={dropdownRefs.name}
              className="border border-gray-300 rounded mt-1 max-h-40 overflow-auto bg-white z-10 absolute"
              style={{ width: '100%' }}
            >
              {filteredSuggestions.name.map((suggestion, index) => (
                <li
                  key={index}
                  className="px-2 py-1 cursor-pointer hover:bg-gray-200"
                  onClick={() => handleSuggestionClick('name', suggestion)}
                >
                  {suggestion.name}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <Label htmlFor="address">Alamat</Label>
          <Input
            id="address"
            name="address"
            type="text"
            value={formData.address}
            onChange={handleInputChange}
            required
            placeholder="Masukkan alamat lengkap"
            autoComplete="off"
            readOnly={readOnly}
            disabled={readOnly}
          />
        </div>
        <div>
          <Label htmlFor="phone">Nomor Telepon</Label>
          <Input
            id="phone"
            name="phone"
            type="text"
            value={formData.phone}
            onChange={handleChange}
            required
            placeholder="Masukkan nomor telepon"
            autoComplete="off"
            readOnly={readOnly}
            disabled={readOnly}
          />
        </div>
        <div>
          <Label htmlFor="job">Pekerjaan</Label>
          <Input
            id="job"
            name="job"
            type="text"
            value={formData.job}
            onChange={handleChange}
            required
            placeholder="Masukkan pekerjaan"
            autoComplete="off"
            readOnly={readOnly}
            disabled={readOnly}
          />
        </div>
        <div>
          <Label htmlFor="birthPlace">Tempat Lahir</Label>
          <Input
            id="birthPlace"
            name="birthPlace"
            type="text"
            value={formData.birthPlace}
            onChange={handleChange}
            required
            placeholder="Masukkan tempat lahir"
            autoComplete="off"
            readOnly={readOnly}
            disabled={readOnly}
          />
        </div>
        <div>
          <Label htmlFor="birthDate">Tanggal Lahir</Label>
          <Input
            id="birthDate"
            name="birthDate"
            type="date"
            value={formData.birthDate}
            onChange={handleChange}
            placeholder="Masukkan tanggal lahir"
            autoComplete="off"
            readOnly={readOnly}
            disabled={readOnly}
          />
        </div>
        <div className="mb-4">
          <Label className="block font-medium mb-1 mt-4">Foto/Gambar</Label>
          <div className="space-y-4">
            <div className="flex justify-center">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="cursor-pointer rounded bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
                disabled={readOnly}
              />
            </div>
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-gray-400 transition-colors mx-auto relative"
              style={{ width: '600px', height: '360px' }}
              tabIndex={0}
            >
              {formData.image ? (
                <>
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="w-full h-full object-contain rounded"
                  />
                  {!readOnly && (
                    <button
                      type="button"
                      onClick={clearImage}
                      className="absolute top-1 right-1 bg-red-600 text-white rounded px-2 py-1 text-xs"
                    >
                      Clear
                    </button>
                  )}
                </>
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
      </div>
    </form>
  )
}
