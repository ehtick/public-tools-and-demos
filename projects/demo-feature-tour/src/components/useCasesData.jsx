export const USE_CASES = [
  {
    id: 'globe',
    label: 'Globe View',
    description: 'Rotating 3D globe',
    icon: (
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
    )
  },
  {
    id: 'buildings',
    label: '3D Basemap',
    description: 'Buildings, landmarks, and trees',
    icon: (
      <svg
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      >
        <path d='M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z' />
        <path d='M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2' />
        <path d='M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2' />
        <path d='M10 6h4M10 10h4M10 14h4M10 18h4' />
      </svg>
    )
  },
  {
    id: 'markers',
    label: 'Markers',
    description: 'Custom pins with popups',
    icon: (
      <svg
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      >
        <path d='M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z' />
        <circle cx='12' cy='10' r='3' />
      </svg>
    )
  },
  {
    id: 'data-overlay',
    label: 'Data Overlay (2D)',
    description: 'Live seismic event heatmap',
    icon: (
      <svg
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      >
        <path d='m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z' />
        <path d='m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65' />
        <path d='m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65' />
      </svg>
    )
  },
  {
    id: 'raster',
    label: 'Wind Speed',
    description: 'Global particle animation',
    icon: (
      <svg
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      >
        <path d='M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2' />
        <path d='M9.6 4.6A2 2 0 1 1 11 8H2' />
        <path d='M12.6 19.4A2 2 0 1 0 14 16H2' />
      </svg>
    )
  },
  {
    id: 'navigation',
    label: 'Navigation',
    description: 'Turn-by-turn route guidance',
    icon: (
      <svg
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      >
        <polygon points='3 11 22 2 13 21 11 13 3 11' />
      </svg>
    )
  },
  {
    id: 'asset-tracking',
    label: 'Asset Tracking',
    description: 'Isochrones, live locations, and matrices',
    icon: (
      <svg
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      >
        <path d='M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3' />
        <rect width='7' height='7' x='14' y='10' rx='1' />
        <path d='M5 17a2 2 0 1 0 4 0 2 2 0 0 0-4 0Z' />
        <path d='M16 17a2 2 0 1 0 4 0 2 2 0 0 0-4 0Z' />
        <path d='M14 13H9' />
      </svg>
    )
  },
  {
    id: 'terrain',
    label: 'Terrain',
    description: '3D landscape with elevation',
    icon: (
      <svg
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      >
        <path d='m8 3 4 8 5-5 5 15H2L8 3z' />
      </svg>
    )
  }
]
