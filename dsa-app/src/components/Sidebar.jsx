import { useState } from 'react'
import { SECTIONS } from '../data/sections'

export default function Sidebar({ checked, onToggle, activeId, isOpen, onClose }) {
  const [query, setQuery] = useState('')
  const doneCount = Object.values(checked).filter(Boolean).length

  const filtered = query.trim()
    ? SECTIONS.filter(s =>
        s.title.toLowerCase().includes(query.toLowerCase()) ||
        s.triggers.some(t => t.toLowerCase().includes(query.toLowerCase()))
      )
    : SECTIONS

  const scrollTo = (id) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    onClose()
  }

  return (
    <aside className={`sidebar${isOpen ? ' open' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-title-row">
          <div className="sidebar-title">Master DSA</div>
          <button className="sidebar-close-btn" onClick={onClose} aria-label="Close menu">✕</button>
        </div>
        <div className="sidebar-search-wrap">
          <input
            className="sidebar-search"
            type="text"
            placeholder="Search patterns…"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          {query && (
            <button className="sidebar-search-clear" onClick={() => setQuery('')}>✕</button>
          )}
        </div>
      </div>

      <nav className="sidebar-nav">
        {filtered.length === 0 && (
          <div className="sidebar-no-results">No results for "{query}"</div>
        )}
        {filtered.map((s, i) => {
          const globalIndex = SECTIONS.indexOf(s)
          return (
            <div
              key={s.id}
              className={`nav-item${activeId === s.id ? ' active' : ''}`}
              onClick={() => scrollTo(s.id)}
            >
              <span className="nav-num">{globalIndex + 1}</span>
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
          )
        })}
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
