import { useState, useEffect, useRef } from 'react'
import './App.css'
import Sidebar from './components/Sidebar'
import SectionCard from './components/SectionCard'
import FoundationsContent from './components/FoundationsContent'
import SlidingWindowContent from './components/SlidingWindowContent'
import TwoPointersContent from './components/TwoPointersContent'
import FastSlowPointersContent from './components/FastSlowPointersContent'
import MergeIntervalsContent from './components/MergeIntervalsContent'
import CyclicSortContent from './components/CyclicSortContent'
import InPlaceReversalContent from './components/InPlaceReversalContent'
import TreeBFSContent from './components/TreeBFSContent'
import TreeDFSContent from './components/TreeDFSContent'
import TwoHeapsContent from './components/TwoHeapsContent'
import BacktrackingContent from './components/BacktrackingContent'
import BinarySearchContent from './components/BinarySearchContent'
import TopKElementsContent from './components/TopKElementsContent'
import KWayMergeContent from './components/KWayMergeContent'
import DynamicProgrammingContent from './components/DynamicProgrammingContent'
import GraphBFSDFSContent from './components/GraphBFSDFSContent'
import MonotonicStackContent from './components/MonotonicStackContent'
import CompletionSection from './components/CompletionSection'
import { SECTIONS } from './data/sections'

const initChecked = () => {
  try {
    const saved = localStorage.getItem('dsa-checked')
    if (saved) return JSON.parse(saved)
  } catch {}
  return SECTIONS.reduce((acc, s) => ({ ...acc, [s.id]: false }), {})
}

export default function App() {
  const [checked, setChecked] = useState(initChecked)
  const [activeId, setActiveId] = useState(SECTIONS[0].id)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const mainRef = useRef(null)

  const toggleChecked = (id) =>
    setChecked(prev => ({ ...prev, [id]: !prev[id] }))

  useEffect(() => {
    localStorage.setItem('dsa-checked', JSON.stringify(checked))
  }, [checked])

  useEffect(() => {
    const observers = []
    SECTIONS.forEach(s => {
      const el = document.getElementById(s.id)
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveId(s.id) },
        { threshold: 0.25, rootMargin: '-60px 0px -60% 0px' }
      )
      obs.observe(el)
      observers.push(obs)
    })
    return () => observers.forEach(o => o.disconnect())
  }, [])

  return (
    <div className="app-layout">
      <Sidebar
        checked={checked}
        onToggle={toggleChecked}
        activeId={activeId}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      <main className="main-content" ref={mainRef}>
        <div className="hero">
          <button
            className="hamburger-btn"
            onClick={() => setSidebarOpen(o => !o)}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>
          <h1 className="hero-title">
            Master DSA —{' '}
            <span>One Pattern at a Time</span>
          </h1>

          <div className="hero-meta">
            <span className="hero-badge">
              <span className="dot" />
              17 patterns
            </span>
            <span className="hero-badge" style={{ '--dot-color': 'var(--accent)' }}>
              <span className="dot" style={{ background: 'var(--accent)' }} />
              Interactive problems
            </span>
            <span className="hero-badge">
              <span className="dot" style={{ background: 'var(--purple)' }} />
              Visual explanations
            </span>
          </div>
        </div>

        <div className="sections-container">
          {SECTIONS.map((s, i) => (
            <SectionCard
              key={s.id}
              id={s.id}
              num={i + 1}
              title={s.title}
              triggers={s.triggers}
              defaultOpen={i === 0}
            >
              {s.id === 'foundations'        ? <FoundationsContent />        : null}
              {s.id === 'sliding-window'     ? <SlidingWindowContent />      : null}
              {s.id === 'two-pointers'       ? <TwoPointersContent />        : null}
              {s.id === 'fast-slow-pointers' ? <FastSlowPointersContent />   : null}
              {s.id === 'merge-intervals'    ? <MergeIntervalsContent />      : null}
              {s.id === 'cyclic-sort'        ? <CyclicSortContent />         : null}
              {s.id === 'in-place-reversal'  ? <InPlaceReversalContent />    : null}
              {s.id === 'tree-bfs'           ? <TreeBFSContent />            : null}
              {s.id === 'tree-dfs'           ? <TreeDFSContent />            : null}
              {s.id === 'two-heaps'          ? <TwoHeapsContent />           : null}
              {s.id === 'backtracking'       ? <BacktrackingContent />       : null}
              {s.id === 'binary-search'      ? <BinarySearchContent />       : null}
              {s.id === 'top-k-elements'     ? <TopKElementsContent />       : null}
              {s.id === 'k-way-merge'        ? <KWayMergeContent />          : null}
              {s.id === 'dynamic-programming'? <DynamicProgrammingContent /> : null}
              {s.id === 'graph-bfs-dfs'      ? <GraphBFSDFSContent />        : null}
              {s.id === 'monotonic-stack'    ? <MonotonicStackContent />     : null}
            </SectionCard>
          ))}
        </div>

        <CompletionSection checked={checked} onToggle={toggleChecked} />
      </main>
    </div>
  )
}
