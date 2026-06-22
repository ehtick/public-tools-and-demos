const STEPS = [
  {
    instruction: 'Drive southeast on Harriet Street',
    distance: '250 ft',
    dir: '↘'
  },
  {
    instruction: 'Turn right onto Harrison Street',
    distance: '0.1 mi',
    dir: '↱'
  },
  { instruction: 'Turn right onto 7th Street', distance: '0.5 mi', dir: '↱' },
  {
    instruction: 'Turn left onto McAllister Street',
    distance: '0.4 mi',
    dir: '↰'
  },
  {
    instruction: 'Turn right onto Van Ness Avenue',
    distance: '1.5 mi',
    dir: '↱'
  },
  {
    instruction: 'Turn left onto Lombard Street',
    distance: '0.5 mi',
    dir: '↰'
  },
  {
    instruction: 'Turn left onto Buchanan Street',
    distance: '175 ft',
    dir: '↰'
  },
  {
    instruction: 'Turn right onto Moulton Street',
    distance: '150 ft',
    dir: '↱'
  },
  {
    instruction: 'Your destination is on the right',
    distance: 'Destination',
    dir: '📍'
  }
]

export default function NavInfoCard() {
  return (
    <div className='nav-card'>
      <div className='nav-header'>
        <div className='nav-header-icon'>
          <svg viewBox='0 0 24 24' fill='currentColor'>
            <polygon points='3 11 22 2 13 21 11 13 3 11' />
          </svg>
        </div>
        <div className='nav-header-info'>
          <span className='nav-eta'>19 min</span>
          <span className='nav-meta'>3.1 mi · via Van Ness Ave</span>
        </div>
        <div className='nav-status'>
          <span className='nav-status-dot' />
          Live
        </div>
      </div>
      <div className='nav-steps'>
        {STEPS.map((step, i) => (
          <div
            key={i}
            className={`nav-step${i === 0 ? ' nav-step-active' : ''}`}
          >
            <span className='step-dir'>{step.dir}</span>
            <div className='step-body'>
              <span className='step-instruction'>{step.instruction}</span>
              <span className='step-distance'>{step.distance}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
