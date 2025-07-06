"use client"

import { useState, useRef, useEffect } from "react"
/* Temporarily replace custom Input component with native input for testing */
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
  [key: string]: any;
}

export function UserForm(props: {
  formData: Nasabah;
  handleChange: (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => void;
  savedTransactions: Nasabah[];
  onAutofillSelect: (selected: Nasabah) => void;
  onTransactionTypeSelect?: (type: string) => void;
  onValueChange: (name: string, value: string) => void;
  onPreviewSuggestion?: (suggested: Nasabah | null) => void;
  onForcePreviewSuggestion?: (suggested: Nasabah) => void;
  jenisTransaksi: string;
  setJenisTransaksi: (type: string) => void;
}) {
  const { formData, handleChange, savedTransactions, onAutofillSelect, onTransactionTypeSelect, onValueChange, onPreviewSuggestion, onForcePreviewSuggestion, jenisTransaksi, setJenisTransaksi } = props;
    const [showSuggestions, setShowSuggestions] = useState<{[key: string]: boolean}>({
      name: false,
      address: false,
      phone: false,
      job: false,
      idNumber: false,
      birthPlace: false,
      birthDate: false
    });
    // State: apakah field idNumber sedang fokus
    const [idNumberFocused, setIdNumberFocused] = useState(false);
  
    const [filteredSuggestions, setFilteredSuggestions] = useState<{[key: string]: Nasabah[]}>({
      name: [],
      address: [],
      phone: [],
      job: [],
      idNumber: [],
      birthPlace: [],
      birthDate: []
    });

    // Add flag to ignore reopening dropdown immediately after selection
    const [ignoreNextShowSuggestions, setIgnoreNextShowSuggestions] = useState(false);
  
    // --- PATCH: Sync suggestion with formData.name/idNumber change ---
    // Hilangkan preview gambar secara real-time jika suggestion hilang
    // State untuk menyimpan selectedSuggestionName dan selectedSuggestionIdNumber
    const [selectedSuggestionName, setSelectedSuggestionName] = useState<string | null>(null);
    const [selectedSuggestionIdNumber, setSelectedSuggestionIdNumber] = useState<string | null>(null);

    // PATCH: Only show name suggestion if field is focused
    const [nameFocused, setNameFocused] = useState(false);
    useEffect(() => {
      const name = "name";
      if (selectedSuggestionName && formData.name.trim().toUpperCase() === selectedSuggestionName.trim().toUpperCase()) {
        setShowSuggestions(prev => ({ ...prev, [name]: false }));
        setHighlightedIndex(prev => ({ ...prev, [name]: -1 }));
        // Still update preview to the selected suggestion
        if (onPreviewSuggestion) {
          const match = savedTransactions.find(tx => tx.name && tx.name.trim().toUpperCase() === selectedSuggestionName.trim().toUpperCase());
          onPreviewSuggestion(match || null);
        }
        return;
      }
      if (ignoreNextShowSuggestions) {
        setIgnoreNextShowSuggestions(false);
        return;
      }
      if (formData.name && formData.name.trim().length > 0) {
        const capitalizedValue = formData.name.trim().toUpperCase();
        let filtered = savedTransactions.filter(tx => tx.name && tx.name.trim().toUpperCase().includes(capitalizedValue));
        // Deduplicate by name+idNumber
        const seen = new Set();
        filtered = filtered.filter(item => {
          const key = item.name + "|" + item.idNumber;
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });
        setFilteredSuggestions(prev => ({ ...prev, [name]: filtered }));
        setShowSuggestions(prev => ({ ...prev, [name]: filtered.length > 0 && nameFocused }));
        setHighlightedIndex(prev => ({ ...prev, [name]: filtered.length > 0 ? 0 : -1 }));
        // Always update preview to top suggestion (or null)
        if (onPreviewSuggestion) {
          onPreviewSuggestion(filtered.length > 0 ? filtered[0] : null);
        }
      } else {
        setFilteredSuggestions(prev => ({ ...prev, [name]: [] }));
        setShowSuggestions(prev => ({ ...prev, [name]: false }));
        setHighlightedIndex(prev => ({ ...prev, [name]: -1 }));
        if (onPreviewSuggestion) {
          onPreviewSuggestion(null);
        }
      }
    }, [formData.name, savedTransactions, onPreviewSuggestion, ignoreNextShowSuggestions, selectedSuggestionName, nameFocused]);

    // PATCH: Sync suggestion with formData.idNumber change and selectedSuggestionIdNumber (single effect only)
    useEffect(() => {
      const idNumber = "idNumber";
      if (ignoreNextShowSuggestions) {
        setIgnoreNextShowSuggestions(false);
        setShowSuggestions(prev => ({ ...prev, [idNumber]: false }));
        setHighlightedIndex(prev => ({ ...prev, [idNumber]: -1 }));
        return;
      }
      if (formData.idNumber && formData.idNumber.trim().length > 0) {
        const idVal = formData.idNumber.trim();
        let filtered = savedTransactions.filter(tx =>
          tx.idNumber && tx.idNumber.trim().includes(idVal)
        );
        filtered = deduplicateByKey(filtered, "idNumber");
        setFilteredSuggestions(prev => ({ ...prev, [idNumber]: filtered }));
        // Hanya show dropdown jika field idNumber sedang fokus
        setShowSuggestions(prev => ({ ...prev, [idNumber]: filtered.length > 0 && idNumberFocused }));
        setHighlightedIndex(prev => ({ ...prev, [idNumber]: filtered.length > 0 ? 0 : -1 }));
        // PATCH: update preview to first suggestion if dropdown open
        if (onPreviewSuggestion && filtered.length > 0 && showSuggestions.idNumber) {
          onPreviewSuggestion(filtered[0]);
        } else if (onPreviewSuggestion && !showSuggestions.idNumber) {
          onPreviewSuggestion(null);
        }
      } else {
        setFilteredSuggestions(prev => ({ ...prev, [idNumber]: [] }));
        setShowSuggestions(prev => ({ ...prev, [idNumber]: false }));
        setHighlightedIndex(prev => ({ ...prev, [idNumber]: -1 }));
        if (onPreviewSuggestion) {
          onPreviewSuggestion(null);
        }
      }
    }, [formData.idNumber, savedTransactions, onPreviewSuggestion, showSuggestions.idNumber, ignoreNextShowSuggestions, idNumberFocused]);
  
    // State for highlighted suggestion index per field
    const [highlightedIndex, setHighlightedIndex] = useState<{[key: string]: number}>({});
  
    // Track selected suggestion for name field (moved to top, only declare once!)
  
    // Fungsi untuk memperbarui formData dengan jenis transaksi
    const updateTransactionTypeInFormData = (type: string) => {
      if (handleChange) {
        // Membuat event palsu untuk memperbarui formData
        const event = {
          target: {
            name: "transactionType",
            value: type
          }
        } as React.ChangeEvent<HTMLInputElement>
        handleChange(event)
      }
    }
  
    // Create refs for each dropdown suggestion container
    const dropdownRefs = {
      idNumber: useRef<HTMLUListElement>(null),
      name: useRef<HTMLUListElement>(null),
      address: useRef<HTMLUListElement>(null),
      phone: useRef<HTMLUListElement>(null),
      job: useRef<HTMLUListElement>(null),
      birthPlace: useRef<HTMLUListElement>(null),
      birthDate: useRef<HTMLUListElement>(null),
    }
  
    // Add ref for the entire form container
    const formRef = useRef<HTMLFormElement>(null)
  
    useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
        // Close dropdowns if click is outside the entire form
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
  
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      // Auto kapital untuk SEMUA field kecuali idNumber dan birthDate
      let autoValue = value;
      if (name !== "idNumber" && name !== "birthDate") {
        autoValue = value.toUpperCase();
      }
      onValueChange(name, autoValue);

      // PATCH: Reset selectedSuggestionName if user edits name field
      if (name === 'name') {
        setSelectedSuggestionName(null);
      }
      // PATCH: Reset selectedSuggestionIdNumber if user edits idNumber field
      if (name === 'idNumber') {
        setSelectedSuggestionIdNumber(null);
      }
    }
  
    const handleSuggestionClick = (field: string, selected: any) => {
      // Gabungkan data autofill dengan jenis transaksi yang sudah dipilih
      const mergedData = {
        ...selected,
        transactionType: jenisTransaksi || formData.transactionType || ""
      }
      // PATCH: Update preview immediately on suggestion click (parent)
      if (onForcePreviewSuggestion) {
        onForcePreviewSuggestion(mergedData);
      }
      if (onPreviewSuggestion) {
        onPreviewSuggestion(mergedData);
      }
      // Close dropdown immediately after selection
      setShowSuggestions(prev => ({ ...prev, [field]: false }))
      setHighlightedIndex(prev => ({ ...prev, [field]: -1 }))
      setShowSuggestions({
        name: false,
        address: false,
        phone: false,
        job: false,
        idNumber: false,
        birthPlace: false,
        birthDate: false
      });
      setHighlightedIndex({});
      // Set flag to ignore reopening dropdown immediately after selection
      setIgnoreNextShowSuggestions(true);
      setTimeout(() => {
        onAutofillSelect(mergedData)
        // --- PATCH: After selecting suggestion, move focus to next field ---
        // Cari elemen input berikutnya setelah field yang dipilih
        const form = formRef.current;
        if (form) {
          const focusable = Array.from(form.querySelectorAll('input,textarea,select,button'))
            .filter(el => (el as HTMLElement).tabIndex !== -1 && !(el as HTMLInputElement).disabled && (el as HTMLElement).offsetParent !== null);
          // Temukan index field aktif
          const active = form.querySelector(`[name='${field}']`);
          const idx = focusable.indexOf(active as HTMLElement);
          let nextIdx = idx + 1;
          while (nextIdx < focusable.length && (focusable[nextIdx] as HTMLElement).tagName === 'BUTTON') {
            nextIdx++;
          }
          if (idx > -1 && nextIdx < focusable.length) {
            (focusable[nextIdx] as HTMLElement).focus();
          }
        }
      }, 80);

      // Pastikan state selectedTransactionType sinkron dengan formData
      if (mergedData.transactionType !== jenisTransaksi) {
        setJenisTransaksi(mergedData.transactionType)
      }

      // PATCH: Set selectedSuggestionName/IdNumber when user selects a suggestion
      if (field === 'name') {
        setSelectedSuggestionName(selected.name || null);
      }
      if (field === 'idNumber') {
        setSelectedSuggestionIdNumber(selected.idNumber || null);
      }
    }
  
    // Handler untuk Enter: jika tidak sedang memilih suggestion, pindah ke field berikutnya
    const handleFormKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
      const field = (e.target as HTMLInputElement).name;
      // PATCH: Always handle Enter for all fields, not just when suggestion is open
      if (e.key === 'Enter') {
        setShowSuggestions(prev => ({ ...prev, [field]: false }));
        setHighlightedIndex(prev => ({ ...prev, [field]: -1 }));
        if (onPreviewSuggestion) onPreviewSuggestion(null);
        
        // Special case: jika di field birthDate, fokus ke tombol Lanjut
        if (field === 'birthDate') {
          e.preventDefault();
          setTimeout(() => {
            const lanjutButton = document.getElementById('lanjut-button');
            if (lanjutButton) {
              lanjutButton.focus();
            }
          }, 100);
          return;
        }
        
        const form = formRef.current;
        if (form) {
          const focusable = Array.from(form.querySelectorAll('input,textarea,select,button'))
            .filter(el => (el as HTMLElement).tabIndex !== -1 && !(el as HTMLInputElement).disabled && (el as HTMLElement).offsetParent !== null);
          // PATCH: skip button dan cari field input berikutnya
          const idx = focusable.indexOf(e.target as HTMLElement);
          let nextIdx = idx + 1;
          while (nextIdx < focusable.length && (focusable[nextIdx] as HTMLElement).tagName === 'BUTTON') {
            nextIdx++;
          }
          if (idx > -1 && nextIdx < focusable.length) {
            (focusable[nextIdx] as HTMLElement).focus();
            e.preventDefault();
          }
        }
        return;
      }
      if (showSuggestions[field] && filteredSuggestions[field]?.length > 0) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setHighlightedIndex(prev => {
            const max = filteredSuggestions[field].length - 1;
            const next = prev[field] === undefined || prev[field] < 0 ? 0 : Math.min(prev[field] + 1, max);
            if (onPreviewSuggestion) onPreviewSuggestion(filteredSuggestions[field][next]);
            return { ...prev, [field]: next };
          });
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          setHighlightedIndex(prev => {
            const max = filteredSuggestions[field].length - 1;
            const next = prev[field] === undefined || prev[field] <= 0 ? 0 : prev[field] - 1;
            if (onPreviewSuggestion) onPreviewSuggestion(filteredSuggestions[field][next]);
            return { ...prev, [field]: next };
          });
        } else if (e.key === 'Escape') {
          setShowSuggestions(prev => ({ ...prev, [field]: false }));
          setHighlightedIndex(prev => ({ ...prev, [field]: -1 }));
          if (onPreviewSuggestion) onPreviewSuggestion(null);
        } else if (e.key === 'Tab') {
          // PATCH: Tab: tutup dropdown dan biarkan browser handle pindah field
          setShowSuggestions(prev => ({ ...prev, [field]: false }));
          setHighlightedIndex(prev => ({ ...prev, [field]: -1 }));
          if (onPreviewSuggestion) onPreviewSuggestion(null);
        } else if (e.key === 'Enter') {
          // PATCH: Enter hanya untuk pindah field, JANGAN pilih suggestion
          setShowSuggestions(prev => ({ ...prev, [field]: false }));
          setHighlightedIndex(prev => ({ ...prev, [field]: -1 }));
          if (onPreviewSuggestion) onPreviewSuggestion(null);
          // Biarkan handler Enter di form yang memindahkan fokus ke field berikutnya
        }
      }
    };
  
    // PATCH: Always close dropdown on blur (after short delay to allow click)
    const handleInputBlur = (field: string) => {
      setTimeout(() => {
        setShowSuggestions(prev => ({ ...prev, [field]: false }));
        setHighlightedIndex(prev => ({ ...prev, [field]: -1 }));
        // PATCH: Always clear preview image on blur if not selecting suggestion
        if (onPreviewSuggestion) onPreviewSuggestion(null);
        // PATCH: Reset selectedSuggestionName/IdNumber on blur so dropdown will not reopen
        if (field === 'name') {
          setSelectedSuggestionName(null);
        }
        if (field === 'idNumber') {
          setSelectedSuggestionIdNumber(null);
        }
      }, 120);
    }
  
  const isDisabled = !jenisTransaksi;
  
  // Sync jenisTransaksi dengan formData.transactionType
  useEffect(() => {
    if (jenisTransaksi && jenisTransaksi !== formData.transactionType) {
      onValueChange("transactionType", jenisTransaksi);
    }
  }, [jenisTransaksi]);
  
  return (
    <form ref={formRef} className="space-y-4" onKeyDown={handleFormKeyDown}>
      <div className="flex gap-2 mb-2">
        <Button
          type="button"
          variant="default"
          className={`flex-1 text-white hover:bg-blue-700 ${jenisTransaksi === "BNB" ? "bg-black" : "bg-blue-600"}`}
          onClick={() => {
            setJenisTransaksi("BNB");
            onValueChange("transactionType", "BNB");
            if (onTransactionTypeSelect) onTransactionTypeSelect("BNB");
          }}
        >
          BNB
        </Button>
        <Button
          type="button"
          variant="default"
          className={`flex-1 text-white hover:bg-blue-700 ${jenisTransaksi === "BNS" ? "bg-black" : "bg-blue-600"}`}
          onClick={() => {
            setJenisTransaksi("BNS");
            onValueChange("transactionType", "BNS");
            if (onTransactionTypeSelect) onTransactionTypeSelect("BNS");
          }}
        >
          BNS
        </Button>
      </div>
      <div className="space-y-4">
        <div className="relative w-full flex items-center gap-0">
          <Label htmlFor="transactionType" className="w-40 text-right">Jenis Transaksi</Label>
          <input
            id="transactionType"
            name="transactionType"
            type="text"
            value={jenisTransaksi || ""}
            onChange={handleInputChange}
            required
            placeholder="Masukkan jenis transaksi"
            autoComplete="off"
            disabled
            className={`flex-1 text-black border-2 border-black rounded px-2 py-1 shadow-md cursor-not-allowed
              ${jenisTransaksi === 'BNB' ? 'bg-green-200 border-green-500' : ''}
              ${jenisTransaksi === 'BNS' ? 'bg-red-200 border-red-500' : ''}
              ${!jenisTransaksi ? 'bg-gray-200' : ''}`}
          />
        </div>
        <div className="w-full flex items-center">
          <Label htmlFor="name" className="w-40 text-right gap-2">Nama Lengkap</Label>
          <div className="relative flex-1">
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              onFocus={() => setNameFocused(true)}
              onBlur={() => { setNameFocused(false); handleInputBlur('name'); }}
              required
              placeholder="Masukkan nama lengkap"
              autoComplete="off"
              className={`w-full border-2 border-black rounded px-2 py-1 shadow-md ${isDisabled ? 'bg-gray-200 cursor-not-allowed' : ''}`}
              disabled={isDisabled}
            />
            {showSuggestions.name && filteredSuggestions.name.length > 0 && !isDisabled && (
              <ul
                ref={dropdownRefs.name}
                className="border border-gray-300 rounded mt-1 max-h-40 overflow-auto bg-white z-10 absolute left-0 w-full"
              >
              {filteredSuggestions.name.map((suggestion, index) => (
                <li
                  key={index}
                  className={`px-2 py-1 cursor-pointer hover:bg-gray-200 ${highlightedIndex.name === index ? 'bg-blue-100' : ''}`}
                  onMouseEnter={() => {
                    setHighlightedIndex(prev => ({ ...prev, name: index }));
                    if (onPreviewSuggestion) onPreviewSuggestion(suggestion);
                  }}
                  onMouseLeave={() => {
                    setHighlightedIndex(prev => ({ ...prev, name: -1 }));
                    if (onPreviewSuggestion) onPreviewSuggestion(null);
                  }}
                  onMouseDown={() => handleSuggestionClick('name', suggestion)}
                >
                  {suggestion.name}
                </li>
              ))}
            </ul>
          )}
          </div>
        </div>
        <div className="relative w-full flex items-center">
          <Label htmlFor="address" className="w-40 text-right gap-2">Alamat</Label>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={(e) => handleChange(e)}
            onBlur={() => handleInputBlur('address')}
            required
            placeholder="Masukkan alamat lengkap"
            autoComplete="off"
            rows={2}
            className={`flex-1 border-2 border-black rounded px-2 py-1 shadow-md resize-none ${isDisabled ? 'bg-gray-200 cursor-not-allowed' : ''}`}
            disabled={isDisabled}
          />
        </div>
        <div className="flex gap-4">
          {/* Nomor Telepon: label left, input aligned with pekerjaan input */}
          <div className="flex-1 flex flex-col justify-end">
            <div style={{ height: '1.75rem' }}></div> {/* Spacer to match Pekerjaan label height */}
            <div className="flex items-center w-full">
              <Label htmlFor="phone" className="w-40 text-right gap-2">Nomor Telepon</Label>
              <input
                id="phone"
                name="phone"
                type="text"
                value={formData.phone}
                onChange={handleInputChange}
                onBlur={() => handleInputBlur('phone')}
                required
                placeholder="Masukkan nomor telepon"
                autoComplete="off"
                className={`flex-1 border-2 border-black rounded px-2 py-1 shadow-md ${isDisabled ? 'bg-gray-200 cursor-not-allowed' : ''}`}
                disabled={isDisabled}
              />
            </div>
          </div>
          {/* Pekerjaan: label above, input below */}
          <div className="flex-1 flex flex-col gap-1 justify-end">
            <Label htmlFor="job" className="mb-1">Pekerjaan</Label>
            <input
              id="job"
              name="job"
              type="text"
              value={formData.job}
              onChange={handleInputChange}
              onBlur={() => handleInputBlur('job')}
              required
              placeholder="Masukkan pekerjaan"
              autoComplete="off"
              className={`w-full border-2 border-black rounded px-2 py-1 shadow-md ${isDisabled ? 'bg-gray-200 cursor-not-allowed' : ''}`}
              disabled={isDisabled}
            />
          </div>
        </div>
        <div className="w-full flex items-center">
          <Label htmlFor="idNumber" className="w-40 text-right gap-2">Nomor Identitas</Label>
          <div className="relative flex-1">
            <input
              id="idNumber"
              name="idNumber"
              type="text"
              value={formData.idNumber}
              onChange={handleInputChange}
              onFocus={() => setIdNumberFocused(true)}
              onBlur={() => { setIdNumberFocused(false); handleInputBlur('idNumber'); }}
              required
              placeholder="Masukkan nomor identitas"
              autoComplete="off"
              className={`w-full border-2 border-black rounded px-2 py-1 shadow-md ${isDisabled ? 'bg-gray-200 cursor-not-allowed' : ''}`}
              disabled={isDisabled}
            />
            {showSuggestions.idNumber && filteredSuggestions.idNumber.length > 0 && !isDisabled && (
              <ul
                ref={dropdownRefs.idNumber}
                className="border border-gray-300 rounded mt-1 max-h-40 overflow-auto bg-white z-10 absolute left-0 w-full"
              >
              {filteredSuggestions.idNumber.map((suggestion, index) => (
                <li
                  key={index}
                  className="px-2 py-1 cursor-pointer hover:bg-gray-200"
                  onMouseDown={() => handleSuggestionClick('idNumber', suggestion)}
                >
                  {suggestion.idNumber}
                </li>
              ))}
            </ul>
          )}
          </div>
        </div>
        <div className="flex gap-4">
          {/* Tempat Lahir: label left, input right, vertically centered */}
          <div className="flex-1 flex flex-col justify-end">
            <div style={{ height: '1.75rem' }}></div> {/* Spacer to match Tanggal Lahir label height */}
            <div className="flex items-center w-full">
              <Label htmlFor="birthPlace" className="w-40 text-right gap-2">Tempat Lahir</Label>
              <input
                id="birthPlace"
                name="birthPlace"
                type="text"
                value={formData.birthPlace}
                onChange={handleInputChange}
                onBlur={() => handleInputBlur('birthPlace')}
                required
                placeholder="Masukkan tempat lahir"
                autoComplete="off"
                className={`flex-1 border-2 border-black rounded px-2 py-1 shadow-md ${isDisabled ? 'bg-gray-200 cursor-not-allowed' : ''}`}
                disabled={isDisabled}
              />
            </div>
          </div>
          {/* Tanggal Lahir: label above, input below */}
          <div className="flex-1 flex flex-col gap-1 justify-end">
            <Label htmlFor="birthDate" className="mb-1">Tanggal Lahir</Label>
            <input
              id="birthDate"
              name="birthDate"
              type="date"
              value={formData.birthDate}
              onChange={handleInputChange}
              onBlur={() => handleInputBlur('birthDate')}
              placeholder="Masukkan tanggal lahir"
              autoComplete="off"
              className={`w-full border-2 border-black rounded px-2 py-1 shadow-md ${isDisabled ? 'bg-gray-200 cursor-not-allowed' : ''}`}
              disabled={isDisabled}
            />
          </div>
        </div>
      </div>
  </form>
  );
}
