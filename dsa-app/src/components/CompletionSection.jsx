import { SECTIONS } from '../data/sections'

const PATTERN_EMOJIS = {
  'foundations':      '📐',
  'sliding-window':   '🪟',
  'two-pointers':     '👈👉',
  'fast-slow-pointers':'🐢🐇',
  'merge-intervals':  '📅',
  'cyclic-sort':      '🔄',
  'in-place-reversal':'↩️',
  'tree-bfs':         '🌳',
  'tree-dfs':         '🌲',
  'two-heaps':        '⚖️',
  'backtracking':     '🔁',
  'binary-search':    '🔍',
  'top-k-elements':   '🏆',
  'k-way-merge':      '🔀',
  'dynamic-programming':'🧩',
  'graph-bfs-dfs':    '🕸️',
  'monotonic-stack':  '📈',
}

export default function CompletionSection({ checked, onToggle }) {
  const total = SECTIONS.length
  const done  = SECTIONS.filter(s => checked[s.id]).length
  const pct   = Math.round((done / total) * 100)

  return (
    <section style={{
      margin: '64px 0 40px',
      padding: '48px 32px',
      background: 'linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(16,185,129,0.06) 100%)',
      border: '1px solid var(--border)',
      borderRadius: 20,
      textAlign: 'center',
    }}>
      {/* header */}
      <div style={{ fontSize: '3rem', marginBottom: 12 }}>🎉</div>
      <h2 style={{
        fontSize: 'clamp(1.4rem, 3vw, 2rem)',
        fontWeight: 800,
        marginBottom: 8,
        background: 'linear-gradient(90deg, var(--accent), var(--green))',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}>
        You've covered all {total} DSA Patterns!
      </h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: 32, fontSize: '0.95rem' }}>
        Mark each pattern as you master it. Track your progress below.
      </p>

      {/* progress bar */}
      <div style={{ maxWidth: 480, margin: '0 auto 40px', textAlign: 'left' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          <span>{done} / {total} patterns mastered</span>
          <span style={{ color: done === total ? 'var(--green)' : 'var(--accent)', fontWeight: 700 }}>{pct}%</span>
        </div>
        <div style={{ height: 10, background: 'var(--surface)', borderRadius: 99, overflow: 'hidden', border: '1px solid var(--border)' }}>
          <div style={{
            height: '100%',
            width: `${pct}%`,
            background: done === total
              ? 'linear-gradient(90deg, var(--green), #34d399)'
              : 'linear-gradient(90deg, var(--accent), #818cf8)',
            borderRadius: 99,
            transition: 'width 0.4s ease',
          }} />
        </div>
      </div>

      {/* pattern grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: 10,
        maxWidth: 860,
        margin: '0 auto 44px',
        textAlign: 'left',
      }}>
        {SECTIONS.map((s, i) => {
          const isChecked = checked[s.id]
          return (
            <button
              key={s.id}
              onClick={() => onToggle(s.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 14px',
                background: isChecked ? 'rgba(16,185,129,0.1)' : 'var(--surface)',
                border: `1px solid ${isChecked ? 'var(--green)' : 'var(--border)'}`,
                borderRadius: 10,
                cursor: 'pointer',
                color: isChecked ? 'var(--green)' : 'var(--text)',
                fontSize: '0.875rem',
                fontWeight: 500,
                textAlign: 'left',
                transition: 'all 0.15s',
              }}
            >
              {/* checkbox */}
              <div style={{
                width: 18,
                height: 18,
                borderRadius: 5,
                border: `2px solid ${isChecked ? 'var(--green)' : 'var(--border)'}`,
                background: isChecked ? 'var(--green)' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                fontSize: 11,
                color: '#fff',
                transition: 'all 0.15s',
              }}>
                {isChecked ? '✓' : ''}
              </div>
              <span style={{ fontSize: '1rem' }}>{PATTERN_EMOJIS[s.id] ?? '📌'}</span>
              <span style={{ lineHeight: 1.3 }}>
                <span style={{ opacity: 0.5, fontSize: '0.75rem', display: 'block' }}>#{i + 1}</span>
                {s.title}
              </span>
            </button>
          )
        })}
      </div>

      {/* motivational message */}
      <div style={{
        padding: '24px 28px',
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 14,
        maxWidth: 600,
        margin: '0 auto',
      }}>
        {done === total ? (
          <>
            <div style={{ fontSize: '2rem', marginBottom: 10 }}>🔥</div>
            <p style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--green)', marginBottom: 6 }}>
              You crushed it. Every single pattern. Done.
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
              You now know more DSA than most college students. The patterns you learned here
              cover 90% of what shows up in real interviews. Go get that offer. 🚀
            </p>
          </>
        ) : done >= total * 0.5 ? (
          <>
            <div style={{ fontSize: '2rem', marginBottom: 10 }}>💪</div>
            <p style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--accent)', marginBottom: 6 }}>
              Halfway there. You're actually doing this.
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
              Most people quit before page 2. You're past the halfway mark.
              Keep grinding — the patterns you've learned already make you dangerous. {total - done} left. Let's go.
            </p>
          </>
        ) : (
          <>
            <div style={{ fontSize: '2rem', marginBottom: 10 }}>🌱</div>
            <p style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>
              You now know more DSA than most college students. Keep grinding. 🔥
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
              Every pattern you learn stacks. Sliding Window makes Two Pointers easier.
              BFS makes Dijkstra click. It compounds. One pattern at a time — that's how you win.
            </p>
          </>
        )}
      </div>

      {/* small footer note */}
      <p style={{ marginTop: 28, fontSize: '0.78rem', color: 'var(--text-muted)', opacity: 0.6 }}>
        17 patterns · 170 problems · built for the grind
      </p>
    </section>
  )
}
