import { PLATFORMS } from '../utils/sizes.js'

// Platform icons as inline SVGs (simple brand-representative shapes)
const PlatformIcon = ({ platform }) => {
  const iconClass = "w-4 h-4 flex-shrink-0"

  switch (platform) {
    case 'Instagram':
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="12" cy="12" r="4" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
        </svg>
      )
    case 'Facebook':
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
        </svg>
      )
    case 'X (Twitter)':
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      )
    case 'LinkedIn':
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>
          <circle cx="4" cy="4" r="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    case 'Pinterest':
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 2C6.48 2 2 6.48 2 12c0 4.24 2.65 7.86 6.39 9.29-.09-.78-.17-1.98.03-2.83.19-.76 1.27-5.38 1.27-5.38s-.32-.65-.32-1.61c0-1.51.88-2.64 1.97-2.64.93 0 1.38.7 1.38 1.54 0 .94-.6 2.34-.91 3.64-.26 1.09.54 1.97 1.6 1.97 1.92 0 3.4-2.02 3.4-4.95 0-2.59-1.86-4.4-4.52-4.4-3.08 0-4.88 2.31-4.88 4.7 0 .93.36 1.93.8 2.47.09.11.1.2.07.31-.08.33-.26 1.09-.3 1.24-.05.2-.16.24-.37.15-1.39-.65-2.26-2.69-2.26-4.33 0-3.51 2.55-6.74 7.35-6.74 3.86 0 6.86 2.75 6.86 6.42 0 3.83-2.41 6.9-5.76 6.9-1.13 0-2.19-.59-2.55-1.28l-.69 2.59c-.25.96-.93 2.16-1.39 2.89.52.16 1.07.25 1.64.25 5.52 0 10-4.48 10-10S17.52 2 12 2z"/>
        </svg>
      )
    case 'YouTube':
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 00-1.95 1.96A29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.95A29 29 0 0023 12a29 29 0 00-.46-5.58z"/>
          <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    default:
      return null
  }
}

export default function PlatformSelector({ selected, onChange }) {
  // Build a flat list of all size keys: "platform::label"
  const allKeys = PLATFORMS.flatMap(p => p.sizes.map(s => `${p.platform}::${s.label}`))

  const handleCheckAll = () => onChange(new Set(allKeys))
  const handleUncheckAll = () => onChange(new Set())

  const handlePlatformToggle = (platform, sizes) => {
    const platformKeys = sizes.map(s => `${platform}::${s.label}`)
    const allChecked = platformKeys.every(k => selected.has(k))
    const next = new Set(selected)
    if (allChecked) {
      platformKeys.forEach(k => next.delete(k))
    } else {
      platformKeys.forEach(k => next.add(k))
    }
    onChange(next)
  }

  const handleSizeToggle = (key) => {
    const next = new Set(selected)
    if (next.has(key)) {
      next.delete(key)
    } else {
      next.add(key)
    }
    onChange(next)
  }

  const selectedCount = selected.size
  const totalCount = allKeys.length

  return (
    <div className="card-gradient border border-metal/20 rounded-2xl p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <h2 className="text-white font-semibold text-lg">Select Sizes</h2>
          <p className="text-galactic text-sm mt-0.5">
            {selectedCount} of {totalCount} sizes selected
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleCheckAll}
            className="text-sm text-azure hover:text-white transition-colors duration-200 font-medium focus:outline-none focus:underline"
            type="button"
          >
            Select all
          </button>
          <span className="text-metal" aria-hidden="true">/</span>
          <button
            onClick={handleUncheckAll}
            className="text-sm text-azure hover:text-white transition-colors duration-200 font-medium focus:outline-none focus:underline"
            type="button"
          >
            Deselect all
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {PLATFORMS.map(({ platform, sizes }) => {
          const platformKeys = sizes.map(s => `${platform}::${s.label}`)
          const checkedCount = platformKeys.filter(k => selected.has(k)).length
          const allChecked = checkedCount === platformKeys.length
          const someChecked = checkedCount > 0 && checkedCount < platformKeys.length
          const platformCheckId = `platform-${platform.replace(/\s+/g, '-').replace(/[()]/g, '')}`

          return (
            <div key={platform} className="bg-midnight/40 border border-metal/20 rounded-xl p-4">
              <div className="flex items-center gap-2.5 mb-3">
                <input
                  type="checkbox"
                  id={platformCheckId}
                  checked={allChecked}
                  ref={el => { if (el) el.indeterminate = someChecked }}
                  onChange={() => handlePlatformToggle(platform, sizes)}
                  className="w-4 h-4 rounded accent-azure cursor-pointer flex-shrink-0"
                  aria-label={`Toggle all ${platform} sizes`}
                />
                <label
                  htmlFor={platformCheckId}
                  className="flex items-center gap-2 cursor-pointer flex-1 min-w-0"
                >
                  <span className="text-cloudy flex-shrink-0">
                    <PlatformIcon platform={platform} />
                  </span>
                  <span className="text-white font-semibold text-sm truncate">{platform}</span>
                </label>
                <span className="text-galactic text-xs flex-shrink-0">
                  {checkedCount}/{sizes.length}
                </span>
              </div>

              <div className="space-y-2 pl-6">
                {sizes.map(({ label, width, height }) => {
                  const key = `${platform}::${label}`
                  const checkId = `size-${platform.replace(/\s+/g, '-').replace(/[()]/g, '')}-${label.replace(/\s+/g, '-').replace(/\//g, '-')}`
                  return (
                    <label
                      key={key}
                      htmlFor={checkId}
                      className="flex items-center gap-2.5 cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        id={checkId}
                        checked={selected.has(key)}
                        onChange={() => handleSizeToggle(key)}
                        className="w-3.5 h-3.5 rounded accent-azure cursor-pointer flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-cloudy text-sm group-hover:text-white transition-colors duration-150 truncate block">
                          {label}
                        </span>
                        <span className="text-galactic text-xs">
                          {width}&times;{height}
                        </span>
                      </div>
                    </label>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
