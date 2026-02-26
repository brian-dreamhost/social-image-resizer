import { useMemo } from 'react'
import { downloadCanvas } from '../utils/resizer.js'

export default function ResizedCard({ canvas, platform, label, width, height }) {
  const previewSrc = useMemo(() => {
    if (!canvas) return null
    return canvas.toDataURL('image/jpeg', 0.85)
  }, [canvas])

  const handleDownload = () => {
    const platformSlug = platform.replace(/\s+/g, '-').replace(/[()]/g, '').toLowerCase()
    const labelSlug = label.replace(/[\s/]+/g, '-').toLowerCase()
    const filename = `${platformSlug}-${labelSlug}-${width}x${height}.jpg`
    downloadCanvas(canvas, filename)
  }

  // Calculate aspect ratio for the preview container
  const aspectRatio = width / height

  return (
    <div className="card-gradient border border-metal/20 rounded-xl p-4 flex flex-col gap-3 animate-fadeIn">
      {/* Preview thumbnail */}
      <div
        className="w-full rounded-lg overflow-hidden bg-oblivion border border-metal/20 flex items-center justify-center"
        style={{ maxHeight: '120px' }}
      >
        {previewSrc ? (
          <img
            src={previewSrc}
            alt={`${platform} ${label} preview`}
            className="object-contain"
            style={{
              maxHeight: '120px',
              width: aspectRatio >= 1 ? '100%' : 'auto',
              height: aspectRatio < 1 ? '120px' : 'auto',
            }}
          />
        ) : (
          <div className="h-20 flex items-center justify-center">
            <svg className="w-6 h-6 text-metal" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-white text-sm font-semibold leading-tight truncate">
          {platform}
        </p>
        <p className="text-cloudy text-sm truncate">{label}</p>
        <p className="text-galactic text-xs mt-0.5 font-mono">
          {width}&times;{height}px
        </p>
      </div>

      {/* Download button */}
      <button
        onClick={handleDownload}
        type="button"
        className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-azure hover:bg-azure-hover text-white text-sm font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-azure focus:ring-offset-2 focus:ring-offset-abyss"
        aria-label={`Download ${platform} ${label} ${width}x${height}`}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
        </svg>
        Download
      </button>
    </div>
  )
}
