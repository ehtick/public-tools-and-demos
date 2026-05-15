const PICKUPS = [
  { label: 'Lincoln Park', color: '#E91E63' },
  { label: 'Wicker Park', color: '#9C27B0' },
  { label: 'Hyde Park', color: '#FF9800' }
]

const TRUCKS = [
  { label: 'Truck A', color: '#FF5A36' },
  { label: 'Truck B', color: '#FFC107' },
  { label: 'Truck C', color: '#00C853' }
]

// ETA matrix [pickup index][truck index] in minutes
const ETA = [
  [8, 14, 28],
  [13, 6, 34],
  [24, 27, 7]
]

function etaClass(min) {
  if (min <= 10) return 'eta-fast'
  if (min <= 20) return 'eta-medium'
  return 'eta-slow'
}

export default function FleetTable() {
  return (
    <div className='fleet-table-panel'>
      <p className='fleet-table-heading'>ETA Matrix</p>
      <table className='fleet-table'>
        <thead>
          <tr>
            <th className='fleet-th fleet-th-pickup'>Pickup</th>
            {TRUCKS.map((t) => (
              <th key={t.label} className='fleet-th'>
                <span
                  className='fleet-truck-dot'
                  style={{ background: t.color }}
                />
                {t.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {PICKUPS.map((pickup, i) => (
            <tr key={pickup.label}>
              <td className='fleet-td fleet-pickup-name'>
                <span
                  className='fleet-pickup-dot'
                  style={{ background: pickup.color }}
                />
                {pickup.label}
              </td>
              {ETA[i].map((min, j) => (
                <td key={j} className={`fleet-td fleet-eta ${etaClass(min)}`}>
                  {min}
                  <span className='fleet-eta-unit'> min</span>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
