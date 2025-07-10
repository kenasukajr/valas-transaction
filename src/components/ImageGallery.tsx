import React, { useState } from "react";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

interface ImageGalleryProps {
  images: string[];
  altText?: string;
  activeIndex?: number;
  onActiveIndexChange?: (idx: number) => void;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({ images, altText = "Image", activeIndex, onActiveIndexChange }) => {
  const isControlled = typeof activeIndex === 'number' && typeof onActiveIndexChange === 'function';
  const [internalIdx, setInternalIdx] = useState(0);
  const idx = isControlled ? activeIndex! : internalIdx;
  const setIdx = isControlled ? onActiveIndexChange! : setInternalIdx;
  React.useEffect(() => {
    if (isControlled && typeof activeIndex === 'number' && activeIndex >= images.length) {
      onActiveIndexChange && onActiveIndexChange(images.length - 1);
    }
  }, [images.length, activeIndex, isControlled, onActiveIndexChange]);
  const goPrev = () => setIdx((idx - 1 + images.length) % images.length);
  const goNext = () => setIdx((idx + 1) % images.length);
  if (!images || images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500 p-4 border rounded-md" style={{ width: '600px', height: '360px' }}>
        <p>No image available</p>
      </div>
    );
  }
  const displaySrc = images[idx]?.startsWith('/uploads/') ? BACKEND_URL + images[idx] : images[idx];
  return (
    <div className="flex flex-col items-center justify-center p-4 border rounded-md" style={{ width: '600px', height: '360px' }}>
      <img src={displaySrc} alt={altText} className="max-w-full max-h-[300px] object-contain rounded" />
      <div className="flex items-center justify-center gap-1 mt-2 mb-2">
        <button
          type="button"
          className="w-8 h-8 rounded border text-lg flex items-center justify-center transition-colors bg-gray-200 text-gray-800 border-gray-400 hover:bg-blue-100 mr-2"
          onClick={goPrev}
          aria-label="Gambar sebelumnya"
          disabled={images.length <= 1}
        >
          &#8592;
        </button>
        {images.map((img, idxBtn) => (
          <button
            key={idxBtn}
            type="button"
            className={`w-6 h-6 rounded border text-xs flex items-center justify-center transition-colors ${idx === idxBtn ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-200 text-gray-800 border-gray-400 hover:bg-blue-100'}`}
            style={{ minWidth: 0, padding: 0 }}
            onClick={() => setIdx(idxBtn)}
            aria-label={`Gambar ${idxBtn + 1}`}
          >
            {idxBtn + 1}
          </button>
        ))}
        <button
          type="button"
          className="w-8 h-8 rounded border text-lg flex items-center justify-center transition-colors bg-gray-200 text-gray-800 border-gray-400 hover:bg-blue-100 ml-2"
          onClick={goNext}
          aria-label="Gambar berikutnya"
          disabled={images.length <= 1}
        >
          &#8594;
        </button>
      </div>
    </div>
  );
};
