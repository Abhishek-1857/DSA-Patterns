import { useState } from 'react'

export default function HintButton({ hint = 'Think about what information you need to track as you iterate.' }) {
  const [visible, setVisible] = useState(false)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <button className="hint-btn" onClick={() => setVisible(v => !v)}>
        <span>💡</span>
        {visible ? 'Hide hint' : 'Show hint'}
      </button>
      {visible && (
        <div className="hint-box">
          <strong style={{ color: 'var(--yellow)', fontSize: 11, letterSpacing: '0.5px', textTransform: 'uppercase' }}>Hint</strong>
          <p style={{ marginTop: 6 }}>{hint}</p>
        </div>
      )}
    </div>
  )
}
