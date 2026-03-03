import { useState, useCallback } from 'react'
import UploadZone from './components/UploadZone.jsx'
import PlatformSelector from './components/PlatformSelector.jsx'
import ResultsGrid from './components/ResultsGrid.jsx'
import { PLATFORMS } from './utils/sizes.js'
import { resizeImage } from './utils/resizer.js'

// Build the initial "all selected" set
const ALL_KEYS = new Set(
  PLATFORMS.flatMap(p => p.sizes.map(s => `${p.platform}::${s.label}`))
)

export default function App() {
  const [imageElement, setImageElement] = useState(null)
  const [imageFileName, setImageFileName] = useState('')
  const [resizeMode, setResizeMode] = useState('crop') // 'crop' | 'letterbox'
  const [selected, setSelected] = useState(new Set(ALL_KEYS))
  const [results, setResults] = useState([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState(null)

  const fillTestData = useCallback(() => {
    // Select only Instagram sizes as a quick preset and set crop mode
    const instagramKeys = new Set(
      PLATFORMS
        .filter(p => p.platform === 'Instagram')
        .flatMap(p => p.sizes.map(s => `${p.platform}::${s.label}`))
    )
    setSelected(instagramKeys)
    setResizeMode('crop')
  }, [])

  const handleImageLoaded = useCallback((img, fileName) => {
    setImageElement(img)
    setImageFileName(fileName)
    setResults([]) // clear previous results when new image loaded
    setError(null)
  }, [])

  const handleGenerate = async () => {
    if (!imageElement) return
    if (selected.size === 0) {
      setError('Please select at least one size to generate.')
      return
    }

    setIsGenerating(true)
    setError(null)
    setResults([])

    try {
      const newResults = []

      for (const { platform, sizes } of PLATFORMS) {
        for (const { label, width, height } of sizes) {
          const key = `${platform}::${label}`
          if (!selected.has(key)) continue

          const canvas = await resizeImage(imageElement, width, height, resizeMode)
          newResults.push({ canvas, platform, label, width, height })
        }
      }

      setResults(newResults)

      // Scroll to results
      setTimeout(() => {
        document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
    } catch (err) {
      console.error('Resize error:', err)
      setError('Something went wrong while resizing. Please try a different image.')
    } finally {
      setIsGenerating(false)
    }
  }

  const hasImage = imageElement !== null
  const canGenerate = hasImage && selected.size > 0 && !isGenerating

  return (
    <div className="bg-abyss bg-glow bg-grid min-h-screen">
      <div className="relative max-w-[1600px] mx-auto px-4 py-12">

        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-galactic" aria-label="Breadcrumb">
          <a
            href="https://seo-tools-tau.vercel.app/"
            className="text-azure hover:text-white transition-colors duration-200"
          >
            Free Tools
          </a>
          <span className="mx-2 text-metal" aria-hidden="true">/</span>
          <a
            href="https://seo-tools-tau.vercel.app/social-media/"
            className="text-azure hover:text-white transition-colors duration-200"
          >
            Social Media Tools
          </a>
          <span className="mx-2 text-metal" aria-hidden="true">/</span>
          <span className="text-cloudy" aria-current="page">Social Image Resizer</span>
        </nav>

        {/* Header */}
        <div className="mb-10 animate-fadeIn">
          <div className="inline-flex items-center gap-2 border border-turtle text-turtle rounded-full px-4 py-2 text-sm font-medium mb-4">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 8 8" aria-hidden="true">
              <circle cx="4" cy="4" r="3"/>
            </svg>
            Free Tool
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            Social Image Resizer
          </h1>
          <p className="text-cloudy text-lg max-w-2xl">
            Upload one image and instantly resize it to every standard social media dimension.
            Download individually or all at once as a ZIP.
          </p>
        </div>

        {/* Fill Test Data */}
        <div className="flex justify-end mb-4">
          <button
            type="button"
            onClick={fillTestData}
            className="px-3 py-1.5 text-xs font-mono bg-prince/20 text-prince border border-prince/30 rounded hover:bg-prince/30 transition-colors focus:outline-none focus:ring-2 focus:ring-prince focus:ring-offset-2 focus:ring-offset-abyss"
          >
            Fill Test Data
          </button>
        </div>

        {/* Main content */}
        <div className="space-y-6 animate-fadeIn">

          {/* Step 1: Upload */}
          <section aria-labelledby="upload-heading">
            <div className="flex items-center gap-3 mb-3">
              <span className="w-7 h-7 rounded-full bg-azure/20 border border-azure/40 text-azure text-sm font-bold flex items-center justify-center flex-shrink-0" aria-hidden="true">1</span>
              <h2 id="upload-heading" className="text-white font-semibold text-lg">Upload your image</h2>
            </div>
            <UploadZone onImageLoaded={handleImageLoaded} />
          </section>

          {/* Step 2: Resize mode — only show after upload */}
          {hasImage && (
            <section aria-labelledby="mode-heading" className="animate-fadeIn">
              <div className="flex items-center gap-3 mb-3">
                <span className="w-7 h-7 rounded-full bg-azure/20 border border-azure/40 text-azure text-sm font-bold flex items-center justify-center flex-shrink-0" aria-hidden="true">2</span>
                <h2 id="mode-heading" className="text-white font-semibold text-lg">Choose resize mode</h2>
              </div>

              <div className="card-gradient border border-metal/20 rounded-2xl p-4 sm:p-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Crop to fill */}
                  <label
                    className={[
                      'flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all duration-200',
                      resizeMode === 'crop'
                        ? 'border-azure/60 bg-azure/5'
                        : 'border-metal/30 hover:border-metal/50'
                    ].join(' ')}
                  >
                    <input
                      type="radio"
                      name="resizeMode"
                      value="crop"
                      checked={resizeMode === 'crop'}
                      onChange={() => setResizeMode('crop')}
                      className="mt-0.5 accent-azure flex-shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <svg className="w-4 h-4 text-azure flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                        </svg>
                        <span className="text-white font-semibold text-sm">Crop to fill</span>
                        <span className="text-xs px-1.5 py-0.5 rounded bg-azure/20 text-azure font-medium">Recommended</span>
                      </div>
                      <p className="text-galactic text-xs leading-relaxed">
                        Scales image to cover the full frame, cropping from the center. Best for most social posts — no empty bars.
                      </p>
                    </div>
                  </label>

                  {/* Fit with letterbox */}
                  <label
                    className={[
                      'flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all duration-200',
                      resizeMode === 'letterbox'
                        ? 'border-azure/60 bg-azure/5'
                        : 'border-metal/30 hover:border-metal/50'
                    ].join(' ')}
                  >
                    <input
                      type="radio"
                      name="resizeMode"
                      value="letterbox"
                      checked={resizeMode === 'letterbox'}
                      onChange={() => setResizeMode('letterbox')}
                      className="mt-0.5 accent-azure flex-shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <svg className="w-4 h-4 text-cloudy flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 4.5v15m6-15v15m-10.875 0h15.75c.621 0 1.125-.504 1.125-1.125V5.625c0-.621-.504-1.125-1.125-1.125H4.125C3.504 4.5 3 5.004 3 5.625v12.75c0 .621.504 1.125 1.125 1.125z" />
                        </svg>
                        <span className="text-white font-semibold text-sm">Fit with letterbox</span>
                      </div>
                      <p className="text-galactic text-xs leading-relaxed">
                        Fits the full image within the frame with black bars filling the gaps. No content is cropped.
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </section>
          )}

          {/* Step 3: Platform selection — only show after upload */}
          {hasImage && (
            <section aria-labelledby="platforms-heading" className="animate-fadeIn">
              <div className="flex items-center gap-3 mb-3">
                <span className="w-7 h-7 rounded-full bg-azure/20 border border-azure/40 text-azure text-sm font-bold flex items-center justify-center flex-shrink-0" aria-hidden="true">3</span>
                <h2 id="platforms-heading" className="text-white font-semibold text-lg">Select platforms &amp; sizes</h2>
              </div>
              <PlatformSelector selected={selected} onChange={setSelected} />
            </section>
          )}

          {/* Error message */}
          {error && (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-coral/10 border border-coral/30 text-coral text-sm animate-fadeIn" role="alert">
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Generate button */}
          {hasImage && (
            <div className="flex flex-col sm:flex-row items-center gap-4 animate-fadeIn">
              <button
                onClick={handleGenerate}
                disabled={!canGenerate}
                type="button"
                className="w-full sm:w-auto flex items-center justify-center gap-3 bg-azure hover:bg-azure-hover disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg px-8 py-3.5 font-semibold text-base transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-azure focus:ring-offset-2 focus:ring-offset-abyss"
                aria-label={`Resize ${selected.size} selected image${selected.size !== 1 ? 's' : ''}`}
              >
                {isGenerating ? (
                  <>
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                    </svg>
                    Resizing {selected.size} image{selected.size !== 1 ? 's' : ''}...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                    </svg>
                    Resize {selected.size} Image{selected.size !== 1 ? 's' : ''}
                  </>
                )}
              </button>
              {selected.size === 0 && (
                <p className="text-galactic text-sm">Select at least one size above</p>
              )}
            </div>
          )}

          {/* Results */}
          <div id="results-section">
            <ResultsGrid results={results} />
          </div>

        </div>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-metal/30 text-center">
          <p className="text-galactic text-sm">
            Free marketing tools by{' '}
            <a
              href="https://www.dreamhost.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-azure hover:text-white transition-colors duration-200"
            >
              DreamHost
            </a>
            {' '}— All processing happens in your browser. Your images never leave your device.
          </p>
        </footer>

      </div>
    </div>
  )
}
