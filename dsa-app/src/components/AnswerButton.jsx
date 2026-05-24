import { useState, useEffect, useRef } from 'react'
import CodeBlock from './CodeBlock'

export default function AnswerButton({ answer, code, lang = 'python' }) {
  const [phase, setPhase] = useState('idle') // idle | counting | revealed
  const [count, setCount] = useState(3)
  const timerRef = useRef(null)

  const start = () => {
    if (phase !== 'idle') return
    setCount(3)
    setPhase('counting')
  }

  useEffect(() => {
    if (phase === 'counting') {
      timerRef.current = setInterval(() => {
        setCount(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current)
            setPhase('revealed')
            return 0
          }
          return prev - 1
        })
      }, 700)
    }
    return () => clearInterval(timerRef.current)
  }, [phase])

  const reset = () => {
    clearInterval(timerRef.current)
    setPhase('idle')
    setCount(3)
  }

  if (phase === 'revealed') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div className="answer-box">
          <div className="answer-reveal-msg">
            <span>💪</span> You got this!
          </div>
          {answer && <p>{answer}</p>}
          {code && <CodeBlock code={code} lang={lang} />}
        </div>
        <button className="answer-btn" onClick={reset} style={{ alignSelf: 'flex-start' }}>
          ↩ Hide answer
        </button>
      </div>
    )
  }

  return (
    <button
      className={`answer-btn${phase === 'counting' ? ' counting' : ''}`}
      onClick={start}
      disabled={phase === 'counting'}
    >
      <span>🔒</span>
      {phase === 'counting' ? `${count}...` : 'Reveal answer'}
    </button>
  )
}
