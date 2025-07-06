import React from "react"

interface Nasabah {
  idNumber?: string
  name?: string
  address?: string
  phone?: string
  job?: string
  birthPlace?: string
  birthDate?: string
  transactionType?: string
  image?: string
  [key: string]: any
}

interface UserFormNasabahImageOnlyProps {
  formData: Nasabah
  handleImagePaste: (e: React.ClipboardEvent<HTMLFormElement>) => void
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
  clearImage: () => void
  handleSubmit: (e: React.FormEvent) => void
}

export const UserFormNasabahImageOnly: React.FC<UserFormNasabahImageOnlyProps> = ({
  formData,
  handleImagePaste,
  handleImageUpload,
  clearImage,
  handleSubmit,
}) => {
  const [addMoreEnabled, setAddMoreEnabled] = React.useState(false);

  React.useEffect(() => {
    if (formData.image) {
      setAddMoreEnabled(true);
    } else {
      setAddMoreEnabled(false);
    }
  }, [formData.image]);

  return (
    <form onSubmit={handleSubmit} onPaste={handleImagePaste} className="space-y-4">
      <div>
        <label htmlFor="image" className="block font-medium mb-1">Foto/Gambar</label>
        <div className="border border-gray-300 rounded p-2 w-[600px] h-[350px] flex flex-col items-center justify-center shadow-lg">
          <div className="w-full h-full flex flex-col items-center justify-center">
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleImageUpload}
              className="mb-2"
              disabled={!!formData.image}
            />
            {formData.image && (
              <div className="relative">
                <img src={formData.image} alt="Preview" className="max-w-full max-h-48 rounded" />
                <button
                  type="button"
                  onClick={clearImage}
                  className="absolute top-0 right-0 bg-red-600 text-white rounded px-2 py-1"
                >
                  Clear
                </button>
                <button
                  type="button"
                  className="ml-2 bg-gray-200 text-gray-700 rounded px-2 py-1 border border-gray-400 disabled:opacity-50"
                  disabled={!addMoreEnabled}
                  onClick={() => {
                    clearImage();
                  }}
                >
                  Add More
                </button>
              </div>
            )}
            <div className="mt-1 text-sm text-gray-500 text-center">
              Upload atau paste gambar (Ctrl+V untuk paste) 300px x 180px
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <button
          type="submit"
          className="btn btn-primary"
        >
          Simpan Data
        </button>
      </div>
    </form>
  )
}
