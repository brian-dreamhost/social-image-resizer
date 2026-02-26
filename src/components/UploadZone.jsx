import { useState, useRef, useCallback } from 'react'

export default function UploadZone({ onImageLoaded }) {
  const [isDragging, setIsDragging] = useState(false)
  const [preview, setPreview] = useState(null)
  const [fileName, setFileName] = useState(null)
  const [dimensions, setDimensions] = useState(null)
  const [fileError, setFileError] = useState(null)
  const fileInputRef = useRef(null)

  const processFile = useCallback((file) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setFileError(`"${file.name}" is not a supported image file. Please upload a PNG, JPG, WebP, GIF, or SVG.`)
      return
    }
    setFileError(null)

    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      setPreview(url)
      setFileName(file.name)
      setDimensions({ width: img.naturalWidth, height: img.naturalHeight })
      onImageLoaded(img, file.name)
    }
    img.src = url
  }, [onImageLoaded])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    processFile(file)
  }, [processFile])

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleFileChange = useCallback((e) => {
    const file = e.target.files[0]
    processFile(file)
  }, [processFile])

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      fileInputRef.current?.click()
    }
  }

  return (
    <div className="w-full space-y-3">
      <div
        role="button"
        tabIndex={0}
        aria-label="Upload image — click or drag and drop"
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={[
          'relative w-full rounded-2xl p-4 sm:p-8 cursor-pointer transition-all duration-200',
          'border-2 border-dashed',
          isDragging
            ? 'border-azure/80 bg-azure/5'
            : 'border-metal/40 hover:border-azure/60 hover:bg-metal/5',
          'focus:outline-none focus:ring-2 focus:ring-azure focus:ring-offset-2 focus:ring-offset-abyss',
        ].join(' ')}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={handleFileChange}
          aria-hidden="true"
          tabIndex={-1}
        />

        {preview ? (
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="flex-shrink-0">
              <img
                src={preview}
                alt="Uploaded preview"
                className="w-24 h-24 object-cover rounded-xl border border-metal/30"
              />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <p className="text-white font-semibold text-base truncate max-w-xs">{fileName}</p>
              {dimensions && (
                <p className="text-galactic text-sm mt-1">
                  {dimensions.width} &times; {dimensions.height}px
                </p>
              )}
              <p className="text-azure text-sm mt-2 font-medium">Click or drag to replace</p>
            </div>
            <div className="flex-shrink-0">
              <svg className="w-8 h-8 text-turtle" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-4 py-4 text-center">
            <div className="w-16 h-16 rounded-2xl bg-azure/10 flex items-center justify-center">
              <svg className="w-8 h-8 text-azure" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
            </div>
            <div>
              <p className="text-white font-semibold text-lg">
                {isDragging ? 'Drop your image here' : 'Upload your image'}
              </p>
              <p className="text-galactic text-sm mt-1">
                Drag and drop or click to browse — PNG, JPG, WebP, GIF, SVG
              </p>
            </div>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-azure/10 border border-azure/20 text-azure text-sm font-medium pointer-events-none">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
              Choose file
            </span>
          </div>
        )}
      </div>

      {/* File type error */}
      {fileError && (
        <div className="flex items-start gap-3 p-3 rounded-xl bg-coral/10 border border-coral/30 text-coral text-sm" role="alert">
          <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
          <span>{fileError}</span>
        </div>
      )}
    </div>
  )
}
