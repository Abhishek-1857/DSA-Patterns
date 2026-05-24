import { SECTIONS } from '../data/sections'

export default function Sidebar({ checked, onToggle, activeId }) {
  const doneCount = Object.values(checked).filter(Boolean).length

  const scrollTo = (id) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-title">Master DSA</div>

      </div>

      <nav className="sidebar-nav">
        {SECTIONS.map((s, i) => (
          <div
            key={s.id}
            className={`nav-item${activeId === s.id ? ' active' : ''}`}
            onClick={() => scrollTo(s.id)}
          >
            <span className="nav-num">{i + 1}</span>
            <span className="nav-label">{s.title}</span>
            <div
              className={`nav-checkbox${checked[s.id] ? ' checked' : ''}`}
              onClick={(e) => { e.stopPropagation(); onToggle(s.id) }}
              title={checked[s.id] ? 'Mark incomplete' : 'Mark complete'}
            >
              {checked[s.id] && (
                <svg viewBox="0 0 10 8">
                  <polyline points="1,4 4,7 9,1" />
                </svg>
              )}
            </div>
          </div>
        ))}
      </nav>

      <div className="sidebar-progress">
        <span>{doneCount} / {SECTIONS.length} completed</span>
        <div className="progress-bar-track">
          <div
            className="progress-bar-fill"
            style={{ width: `${(doneCount / SECTIONS.length) * 100}%` }}
          />
        </div>
      </div>
    </aside>
  )
}
