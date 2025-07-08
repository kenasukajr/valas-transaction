import React from "react"
import { ImageDisplayMenu } from "./ImageDisplayMenu"
import { ImageGallery } from "./ImageGallery"
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
  [key: string]: any;
}

interface UserFormNasabahProps {
  formData: Nasabah;
  handleChange: (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleImagePaste: (e: React.ClipboardEvent<Element>) => void;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  clearImage: () => void;
  handleSubmit: (e: React.FormEvent) => void;
  readOnly?: boolean;
}

export const UserFormNasabah: React.FC<UserFormNasabahProps> = ({
  formData,
  handleChange,
  handleImagePaste,
  handleImageUpload,
  clearImage,
  handleSubmit,
  readOnly = false,
}) => {
  // Multi-image state khusus halaman ubah nasabah
  const [images, setImages] = React.useState<string[]>(
    Array.isArray(formData.images) && formData.images.length > 0
      ? formData.images
      : (formData.image ? [formData.image] : [])
  );
  const [activeImageIdx, setActiveImageIdx] = React.useState(0);

  // Sync images jika formData.images berubah dari parent
  React.useEffect(() => {
    if (formData.images && Array.isArray(formData.images)) {
      setImages(formData.images);
      setActiveImageIdx(formData.images.length > 0 ? 0 : 0);
    } else if (formData.image) {
      setImages([formData.image]);
      setActiveImageIdx(0);
    } else {
      setImages([]);
      setActiveImageIdx(0);
    }
    // eslint-disable-next-line
  }, [formData.images, formData.image]);

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

  // Sinkronisasi images ke parent jika perlu
  React.useEffect(() => {
    if (typeof formData === 'object' && formData) {
      if (!arraysEqual(formData.images, images)) {
        if ('setFormData' in formData && typeof formData.setFormData === 'function') {
          formData.setFormData((prev: any) => ({ ...prev, images }));
        } else if ('onImagesChange' in formData && typeof formData.onImagesChange === 'function') {
          formData.onImagesChange(images);
        } else if ('images' in formData) {
          formData.images = images;
        }
      }
    }
    // eslint-disable-next-line
  }, [images]);

  // Handler upload gambar baru (choose file/add more)
  const handleLocalImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      let newImage: string = ev.target?.result as string;
      setImages(prev => {
        let arr = prev.length === 0 ? [newImage] : [...prev, newImage];
        return arr;
      });
      // Sinkronisasi ke parent dan handleChange tetap dilakukan oleh useEffect([images])
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  // PATCH: Set activeImageIdx ke gambar terakhir setiap kali jumlah images bertambah
  const prevImagesCount = React.useRef(images.length);
  React.useEffect(() => {
    if (images.length > prevImagesCount.current) {
      setActiveImageIdx(images.length - 1);
    }
    prevImagesCount.current = images.length;
  }, [images.length]);

  // Handler clear gambar aktif
  const handleLocalClearImage = () => {
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

      // Langsung sinkronisasi ke parent (formData.images)
      if (typeof formData === 'object' && formData) {
        if ('setFormData' in formData && typeof formData.setFormData === 'function') {
          formData.setFormData((prev: any) => ({ ...prev, images: arr }));
        } else if ('onImagesChange' in formData && typeof formData.onImagesChange === 'function') {
          formData.onImagesChange(arr);
        } else if ('images' in formData) {
          formData.images = arr;
        }
      }

      // PATCH: trigger handleChange agar parent pasti tahu images berubah
      if (typeof handleChange === 'function') {
        const event = {
          target: { name: 'images', value: arr }
        } as unknown as React.ChangeEvent<HTMLInputElement>;
        handleChange(event);
      }

      return arr;
    });
  };

  return (
    <form onSubmit={handleSubmit} onPaste={handleImagePaste} className="space-y-4 pl-5">
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="idNumber" className="block font-medium mb-1 pl-5">
              Nomor Identitas
            </label>
            <input
              type="text"
              id="idNumber"
              name="idNumber"
              value={formData.idNumber || ''}
              onChange={handleChange}
              className="w-full border-2 border-black rounded px-2 py-1 shadow-md"
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
              className="w-full border-2 border-black rounded px-2 py-1 shadow-md"
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
            className="w-full border-2 border-black rounded px-2 py-1 shadow-md"
            readOnly={readOnly}
            disabled={readOnly}
          />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label htmlFor="phone" className="block font-medium mb-1 pl-5">
                Nomor Telepon
              </label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={formData.phone || ''}
                onChange={handleChange}
                className="w-full border-2 border-black rounded px-2 py-1 shadow-md"
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
                className="w-full border-2 border-black rounded px-2 py-1 shadow-md"
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
                className="w-full border-2 border-black rounded px-2 py-1 shadow-md"
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
                className="w-full border-2 border-black rounded px-2 py-1 shadow-md"
                readOnly={readOnly}
                disabled={readOnly}
              />
            </div>
          </div>
        </div>
        <div className="mb-4">
          {/* Tombol upload khusus halaman ubah nasabah: Add More & Clear */}
          {!readOnly && (
            <div className="flex justify-center gap-2">
              {/* Choose File: hanya aktif jika belum ada gambar */}
              <input
                type="file"
                accept="image/*"
                onChange={handleLocalImageUpload}
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
                onChange={handleLocalImageUpload}
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
                <Button type="button" variant="destructive" onClick={handleLocalClearImage}>
                  Clear
                </Button>
              )}
            </div>
          )}
          {/* Navigasi angka di bawah gambar saja, tidak di sini */}
          {images.length > 0 ? (
            <ImageGallery
              images={images}
              altText="Nasabah Image"
              activeIndex={activeImageIdx}
              onActiveIndexChange={setActiveImageIdx}
            />
          ) : (
            <ImageDisplayMenu imageSrc={formData.image || null} altText="Nasabah Image" />
          )}
        </div>
      </div>
    </form>
  )
}
