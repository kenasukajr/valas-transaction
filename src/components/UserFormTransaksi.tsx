import React from "react"
import { ImageDisplayMenu } from "./ImageDisplayMenu"
import { ImageGallery } from "./ImageGallery"

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

interface UserFormTransaksiProps {
  formData: Nasabah;
  handleChange: (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleImagePaste: (e: React.ClipboardEvent<Element>) => void;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  clearImage: () => void;
  handleSubmit: (e: React.FormEvent) => void;
  readOnly?: boolean;
}

export const UserFormTransaksi: React.FC<UserFormTransaksiProps> = ({
  formData,
  handleChange,
  handleImagePaste,
  handleImageUpload,
  clearImage,
  handleSubmit,
  readOnly = false,
}) => {
  // PATCH: Always use images array if available, fallback to image string
  const images = Array.isArray(formData.images) && formData.images.length > 0
    ? formData.images
    : (formData.image ? [formData.image] : []);
  return (
    <form onSubmit={handleSubmit} onPaste={handleImagePaste} className="space-y-4 pl-5">
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="idNumber" className="block font-medium mb-1 pl-5">
              No. ID
            </label>
            <input
              type="text"
              id="idNumber"
              name="idNumber"
              value={formData.idNumber || ''}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-2 py-1"
              readOnly={readOnly}
              disabled={readOnly}
            />
          </div>
          <div>
            <label htmlFor="name" className="block font-medium mb-1 pl-5">
              Nama
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name || ''}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-2 py-1"
              readOnly={readOnly}
              disabled={readOnly}
            />
          </div>
          <div>
            <label htmlFor="address" className="block font-medium mb-1 pl-5">
              Alamat
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address || ''}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-2 py-1"
              readOnly={readOnly}
              disabled={readOnly}
            />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label htmlFor="phone" className="block font-medium mb-1 pl-5">
                No. Telepon
              </label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={formData.phone || ''}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-2 py-1"
                readOnly={readOnly}
                disabled={readOnly}
              />
            </div>
            <div className="flex-1">
              <label htmlFor="job" className="block font-medium mb-1 pl-5">
                Pekerjaan
              </label>
              <input
                type="text"
                id="job"
                name="job"
                value={formData.job || ''}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-2 py-1"
                readOnly={readOnly}
                disabled={readOnly}
              />
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label htmlFor="birthPlace" className="block font-medium mb-1 pl-5">
                Tempat Lahir
              </label>
              <input
                type="text"
                id="birthPlace"
                name="birthPlace"
                value={formData.birthPlace || ''}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-2 py-1"
                readOnly={readOnly}
                disabled={readOnly}
              />
            </div>
            <div className="flex-1">
              <label htmlFor="birthDate" className="block font-medium mb-1 pl-5">
                Tanggal Lahir
              </label>
              <input
                type="date"
                id="birthDate"
                name="birthDate"
                value={formData.birthDate || ''}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-2 py-1"
                readOnly={readOnly}
                disabled={readOnly}
              />
            </div>
          </div>
        </div>
        <div className="mb-4 flex items-center justify-center">
          {!readOnly && (
            <div className="flex justify-center gap-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer select-none hover:bg-blue-700 transition-colors">
                Choose File
              </label>
              {formData.image && (
                <button type="button" className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700" onClick={clearImage}>
                  Clear
                </button>
              )}
            </div>
          )}
          {/* PATCH: Show ImageGallery if images array exists, else fallback to single image */}
          {images.length > 0 ? (
            <ImageGallery images={images} altText="Transaksi Image" />
          ) : (
            <ImageDisplayMenu imageSrc={formData.image || null} altText="Transaksi Image" />
          )}
        </div>
      </div>
    </form>
  )
}
