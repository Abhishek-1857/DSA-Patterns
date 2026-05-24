import { useState } from 'react'

export default function SectionHeader({ name, triggers = [] }) {
  const [showTriggers, setShowTriggers] = useState(false)

  return (
    <div className="section-header">
      <div className="section-header-top">
        <span className="section-header-name">{name}</span>
        {triggers.length > 0 && (
          <button
            className="when-to-use-btn"
            onClick={() => setShowTriggers(v => !v)}
          >
            {showTriggers ? '▲ when to use' : '▼ when to use'}
          </button>
        )}
      </div>
      {showTriggers && triggers.length > 0 && (
        <div className="triggers-list">
          {triggers.map(t => (
            <span key={t} className="trigger-chip">{t}</span>
          ))}
        </div>
      )}
    </div>
  )
}
