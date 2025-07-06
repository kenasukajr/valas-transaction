"use client"

import React from "react";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

interface ImageUploadProps {
  formData: { image?: string }
  handleImagePaste: (e: React.ClipboardEvent<HTMLDivElement>) => void
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
  clearImage: () => void
  handleSubmit: (e: React.FormEvent) => void
}

export function ImageUpload({ formData, handleImagePaste, handleImageUpload, clearImage, handleSubmit }: ImageUploadProps) {
  // Multi-image state
  const [images, setImages] = React.useState<string[]>(formData.image ? [formData.image] : []);
  const [activeImageIdx, setActiveImageIdx] = React.useState(0);

  // Tidak ada auto-reset index aktif, biarkan user kontrol manual via navigasi angka
  // Sync with formData.image if changed from outside
  React.useEffect(() => {
    if (formData.image && images.length === 0) {
      setImages([formData.image]);
      setActiveImageIdx(0);
    }
    if (!formData.image && images.length > 0) {
      setImages([]);
      setActiveImageIdx(0);
    }
    // Jangan reset activeImageIdx jika hanya images berubah karena hapus/tambah
    // Hanya reset jika formData.image berubah dari luar
    // eslint-disable-next-line
  }, [formData.image]);

  // Jangan reset activeImageIdx saat images berubah karena hapus/tambah
  // Handle upload
  const handleLocalImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleImageUpload(e); // still call parent handler if needed
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setImages(prev => {
        const arr = [...prev, ev.target?.result as string];
        setActiveImageIdx(arr.length - 1);
        return arr;
      });
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  // Handle clear
  // Perbaikan FINAL: update index aktif secara atomik dengan images agar tidak pernah mengarah ke gambar yang sudah terhapus
  const handleLocalClearImage = () => {
    setImages(prevImages => {
      const newImages = prevImages.filter((_, idx) => idx !== activeImageIdx);
      // Hitung index baru secara sinkron
      let newIdx = activeImageIdx;
      if (newImages.length === 0) {
        newIdx = 0;
      } else if (activeImageIdx >= newImages.length) {
        newIdx = newImages.length - 1;
      }
      setActiveImageIdx(newIdx);
      return newImages;
    });
  };

  const addMoreEnabled = images.length > 0;

  return (
    <div className="space-y-4">
      <Label>Foto/Gambar</Label>
      <div className="space-y-4">
        <div className="flex gap-2">
          <input
            type="file"
            accept="image/*"
            onChange={handleLocalImageUpload}
            className="flex-1 border rounded px-2 py-1 text-sm"
            disabled={images.length > 0}
            style={images.length > 0 ? { backgroundColor: '#e5e7eb', cursor: 'not-allowed', pointerEvents: 'none' } : {}}
          />
          {images.length > 0 && (
            <Button type="button" variant="outline" onClick={handleLocalClearImage}>
              Hapus Gambar
            </Button>
          )}
          <button
            type="button"
            disabled={!addMoreEnabled}
            onClick={() => {
              if (addMoreEnabled) handleLocalClearImage();
            }}
            style={{ marginLeft: 8, opacity: addMoreEnabled ? 1 : 0.5, cursor: addMoreEnabled ? 'pointer' : 'not-allowed', background: '#f3f4f6', color: '#374151', border: '1px solid #d1d5db', borderRadius: 4, padding: '0 12px', height: 36 }}
          >
            Add More
          </button>
        </div>

        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-gray-400 transition-colors mx-auto"
          style={{ width: '300px', height: '180px' }}
          onPaste={handleImagePaste}
          tabIndex={0}
        >
          {images.length > 0 ? (
            <>
              <img
                src={images[activeImageIdx]}
                alt="Preview"
                className="w-full h-full object-contain rounded"
              />
              <div className="flex justify-center gap-1 mt-2 mb-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`w-6 h-6 rounded border text-xs flex items-center justify-center transition-colors ${activeImageIdx === idx ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-200 text-gray-800 border-gray-400 hover:bg-blue-100'}`}
                    style={{ minWidth: 0, padding: 0 }}
                    onClick={e => {
                      e.preventDefault();
                      // Pastikan index valid pada saat klik
                      setActiveImageIdx(idx);
                    }}
                    aria-label={`Gambar ${idx + 1}`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
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

      <div className="mt-4">
        <button
          type="button"
          onClick={handleSubmit}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Simpan Data
        </button>
      </div>
    </div>
  )
}
