import { useState } from 'react'
import ResizedCard from './ResizedCard.jsx'
import { downloadAllAsZip } from '../utils/zipDownload.js'

export default function ResultsGrid({ results }) {
  const [isZipping, setIsZipping] = useState(false)

  if (!results || results.length === 0) return null

  const handleDownloadAll = async () => {
    setIsZipping(true)
    try {
      await downloadAllAsZip(
        results.map(r => ({
          canvas: r.canvas,
          filename: `${r.platform.replace(/\s+/g, '-').replace(/[()]/g, '').toLowerCase()}-${r.label.replace(/[\s/]+/g, '-').toLowerCase()}-${r.width}x${r.height}.jpg`
        })),
        'social-images'
      )
    } finally {
      setIsZipping(false)
    }
  }

  return (
    <div className="animate-fadeIn">
      {/* Results header with Download All */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-white font-bold text-xl">Resized Images</h2>
          <p className="text-galactic text-sm mt-0.5">
            {results.length} image{results.length !== 1 ? 's' : ''} ready to download
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <p className="text-galactic text-xs text-center sm:text-right self-center">
            Exported as JPEG at 90% quality
          </p>
          <button
            onClick={handleDownloadAll}
            disabled={isZipping}
            type="button"
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-lg border border-azure text-azure hover:bg-azure/10 font-semibold text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-azure focus:ring-offset-2 focus:ring-offset-abyss disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap"
            aria-label="Download all resized images as ZIP"
          >
            {isZipping ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                Zipping...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                </svg>
                Download All as ZIP
              </>
            )}
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {results.map((result, index) => (
          <ResizedCard
            key={`${result.platform}-${result.label}-${index}`}
            canvas={result.canvas}
            platform={result.platform}
            label={result.label}
            width={result.width}
            height={result.height}
          />
        ))}
      </div>
    </div>
  )
}
