import React, { useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

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
    if (isOpen) {
      // Focus pada tombol "Tidak" saat modal terbuka
      const timer = setTimeout(() => {
        if (cancelButtonRef.current) {
          cancelButtonRef.current.focus();
        }
      }, 150); // Increased delay untuk memastikan dialog sudah ter-render
      
      return () => clearTimeout(timer);
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

  const formatNumber = (num: number): string => {
    return num.toLocaleString('id-ID', { maximumFractionDigits: 2 });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-[500px] bg-gradient-to-br from-blue-50 to-white border-l-4 border-l-blue-500" aria-describedby="dialog-desc-rate-validation" onKeyDown={handleKeyDown}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-gray-800">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">⚠</span>
            </div>
            Peringatan Rate
          </DialogTitle>
        </DialogHeader>
        <p id="dialog-desc-rate-validation" className="sr-only">Peringatan rate diluar batas normal.</p>
        <div className="py-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <p className="text-gray-800 mb-2">
              Rate yang Anda masukkan untuk <strong className="text-gray-900">{currency}</strong> adalah <strong className="text-gray-900">{formatNumber(enteredRate)}</strong>
            </p>
            <p className="text-gray-800 mb-2">
              Rate ini berada di luar batas normal: <strong className="text-gray-900">{formatNumber(validRange.min)} - {formatNumber(validRange.max)}</strong>
            </p>
          </div>
          <p className="text-gray-700 font-medium">
            Apakah Anda yakin ingin melanjutkan?
          </p>
        </div>
        <div className="flex justify-end gap-3">
          <button
            ref={confirmButtonRef}
            onClick={onConfirm}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-all duration-200 hover:shadow-lg"
          >
            Ya
          </button>
          <button
            ref={cancelButtonRef}
            onClick={onCancel}
            autoFocus
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-all duration-200 hover:shadow-lg"
          >
            Tidak
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
