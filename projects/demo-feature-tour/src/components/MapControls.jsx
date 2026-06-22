const LIGHT_PRESETS = [
  {
    id: 'dawn',
    label: 'Dawn',
    icon: (
      <svg
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      >
        <path d='M12 2v8' />
        <path d='m4.93 10.93 1.41 1.41' />
        <path d='M2 18h2' />
        <path d='M20 18h2' />
        <path d='m19.07 10.93-1.41 1.41' />
        <path d='M22 22H2' />
        <path d='m8 6 4-4 4 4' />
        <path d='M16 18a4 4 0 0 0-8 0' />
      </svg>
    )
  },
  {
    id: 'day',
    label: 'Day',
    icon: (
      <svg
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      >
        <circle cx='12' cy='12' r='4' />
        <path d='M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41' />
      </svg>
    )
  },
  {
    id: 'dusk',
    label: 'Dusk',
    icon: (
      <svg
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      >
        <path d='M12 10v8' />
        <path d='m4.93 10.93 1.41 1.41' />
        <path d='M2 18h2' />
        <path d='M20 18h2' />
        <path d='m19.07 10.93-1.41 1.41' />
        <path d='M22 22H2' />
        <path d='m16 6-4 4-4-4' />
        <path d='M16 18a4 4 0 0 0-8 0' />
      </svg>
    )
  },
  {
    id: 'night',
    label: 'Night',
    icon: (
      <svg
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      >
        <path d='M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z' />
      </svg>
    )
  }
]

const COLOR_THEMES = [
  { id: 'default', label: 'Default' },
  { id: 'faded', label: 'Faded' },
  { id: 'monochrome', label: 'Mono' },
  { id: 'ocean', label: 'Ocean' },
  { id: 'warm', label: 'Warm' },
  { id: 'vivid', label: 'Vivid' }
]

const THEME_SWATCHES = {
  default: ['#4264FB', '#F5F5F5', '#A3C4A8'],
  faded: ['#9BA8C0', '#D5CFC5', '#B8C4B8'],
  monochrome: ['#555', '#999', '#CCC'],
  ocean: ['#1A6B9E', '#2DB4C0', '#7EC8C8'],
  warm: ['#C67C3A', '#D4A96A', '#8B5E3C'],
  vivid: ['#FF4D4D', '#4DFF91', '#4D79FF']
}

function Swatch({ colors }) {
  return (
    <span className='theme-swatch'>
      {colors.map((c, i) => (
        <span key={i} className='swatch-dot' style={{ background: c }} />
      ))}
    </span>
  )
}

export default function MapControls({
  lightPreset,
  setLightPreset,
  colorTheme,
  setColorTheme,
  isSatellite,
  setIsSatellite,
  showLabels,
  setShowLabels,
  showLandmarks,
  setShowLandmarks
}) {
  return (
    <div className='map-controls'>
      {/* Time of Day */}
      <div className='control-section'>
        <p className='control-section-label'>Lighting</p>
        <div className='preset-grid'>
          {LIGHT_PRESETS.map((p) => (
            <button
              key={p.id}
              className={`preset-btn${lightPreset === p.id ? ' active' : ''}`}
              onClick={() => setLightPreset(p.id)}
            >
              <span className='preset-icon'>{p.icon}</span>
              <span className='preset-label'>{p.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className='control-divider' />

      {/* Color Theme */}
      <div className='control-section'>
        <p className='control-section-label'>Color Theme</p>
        <div className='theme-grid'>
          {COLOR_THEMES.map((t) => (
            <button
              key={t.id}
              className={`theme-btn${colorTheme === t.id ? ' active' : ''}`}
              onClick={() => setColorTheme(t.id)}
            >
              <Swatch colors={THEME_SWATCHES[t.id]} />
              <span>{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className='control-divider' />

      {/* Toggle controls */}
      <div className='control-section'>
        <p className='control-section-label'>View</p>
        <div className='toggle-list'>
          <button
            className={`control-pill${isSatellite ? ' active' : ''}`}
            onClick={() => setIsSatellite(!isSatellite)}
          >
            <span className='pill-icon'>
              <svg
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='1.5'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <circle cx='12' cy='12' r='10' />
                <path d='M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z' />
              </svg>
            </span>
            <span className='pill-label'>Satellite</span>
            <span className={`pill-toggle${isSatellite ? ' on' : ''}`} />
          </button>

          <button
            className={`control-pill${showLabels ? ' active' : ''}`}
            onClick={() => setShowLabels(!showLabels)}
          >
            <span className='pill-icon'>
              <svg
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='1.5'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <polyline points='4 7 4 4 20 4 20 7' />
                <line x1='9' y1='20' x2='15' y2='20' />
                <line x1='12' y1='4' x2='12' y2='20' />
              </svg>
            </span>
            <span className='pill-label'>Place Labels</span>
            <span className={`pill-toggle${showLabels ? ' on' : ''}`} />
          </button>

          <button
            className={`control-pill${showLandmarks ? ' active' : ''}`}
            onClick={() => setShowLandmarks(!showLandmarks)}
          >
            <span className='pill-icon'>
              <svg
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='1.5'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <polygon points='12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2' />
              </svg>
            </span>
            <span className='pill-label'>Points of Interest</span>
            <span className={`pill-toggle${showLandmarks ? ' on' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  )
}
