import React from "react"

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

interface ImageDisplayMenuProps {
  imageSrc: string | null
  altText?: string
}

export const ImageDisplayMenu: React.FC<ImageDisplayMenuProps> = ({ imageSrc, altText = "Image" }) => {
  if (!imageSrc) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500 p-4 border rounded-md" style={{ width: '600px', height: '360px' }}>
        <p>No image available</p>
      </div>
    )
  }

  // Fix: prepend backend URL if imageSrc is a relative uploads path
  const displaySrc = imageSrc.startsWith('/uploads/') ? BACKEND_URL + imageSrc : imageSrc;

  return (
    <div className="flex items-center justify-center p-4 border rounded-md" style={{ width: '600px', height: '360px' }}>
      <img src={displaySrc} alt={altText} className="max-w-full max-h-full object-contain rounded" />
    </div>
  )
}
