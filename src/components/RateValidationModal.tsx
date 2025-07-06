import React, { useEffect, useRef } from 'react';

interface RateValidationModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  currency: string;
  enteredRate: number;
  validRange: { min: number; max: number };
  rateType: 'buy' | 'sell';
}

export default function RateValidationModal({
  isOpen,
  onConfirm,
  onCancel,
  currency,
  enteredRate,
  validRange,
  rateType
}: RateValidationModalProps) {
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const confirmButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen && cancelButtonRef.current) {
      // Focus pada tombol "Tidak" saat modal terbuka
      cancelButtonRef.current.focus();
    }
  }, [isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault();
      // Toggle focus antara tombol Ya dan Tidak
      if (document.activeElement === cancelButtonRef.current) {
        confirmButtonRef.current?.focus();
      } else {
        cancelButtonRef.current?.focus();
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (document.activeElement === confirmButtonRef.current) {
        onConfirm();
      } else {
        onCancel();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onCancel();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onKeyDown={handleKeyDown}
    >
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl border-2 border-red-300">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3">
            <span className="text-red-600 font-bold text-lg">⚠</span>
          </div>
          <h3 className="text-lg font-bold text-red-700">Peringatan Kurs</h3>
        </div>
        
        <div className="mb-6">
          <p className="text-gray-800 mb-3 font-semibold">
            Silahkan cek kembali kurs Anda, apakah Anda yakin ingin lanjut?
          </p>
          
          <div className="bg-gray-50 p-3 rounded border">
            <div className="text-sm text-gray-600 mb-2">
              <strong>Mata Uang:</strong> {currency}
            </div>
            <div className="text-sm text-gray-600 mb-2">
              <strong>Rate yang dimasukkan:</strong> {enteredRate.toLocaleString('id-ID')}
            </div>
            <div className="text-sm text-gray-600 mb-2">
              <strong>Range valid ({rateType}):</strong> {validRange.min.toLocaleString('id-ID')} - {validRange.max.toLocaleString('id-ID')}
            </div>
            <div className="text-sm text-red-600 font-semibold">
              Rate di luar range normal untuk {currency}
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            ref={cancelButtonRef}
            onClick={onCancel}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 focus:ring-2 focus:ring-gray-300 focus:outline-none font-semibold"
            autoFocus
          >
            Tidak
          </button>
          <button
            ref={confirmButtonRef}
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 focus:ring-2 focus:ring-red-300 focus:outline-none font-semibold"
          >
            Ya, Lanjut
          </button>
        </div>

        <div className="mt-3 text-xs text-gray-500 text-center">
          Gunakan ← → untuk pindah tombol, Enter untuk pilih, Esc untuk batal
        </div>
      </div>
    </div>
  );
}
