import { USE_CASES } from './useCasesData'

export default function UseCasePanel({ activeId, onSelect }) {
  return (
    <div className='use-case-panel'>
      <p className='panel-heading'>Scenes</p>
      <div className='use-case-list'>
        {USE_CASES.map((uc) => (
          <button
            key={uc.id}
            className={`use-case-btn${activeId === uc.id ? ' active' : ''}`}
            onClick={() => onSelect(uc.id)}
            title={uc.description}
          >
            <span className='uc-icon'>{uc.icon}</span>
            <div className='uc-text'>
              <span className='uc-label'>{uc.label}</span>
              <span className='uc-desc'>{uc.description}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
