import { useState } from 'react'
import CodeBlock from './CodeBlock'
import BigOBadge from './BigOBadge'
import HintButton from './HintButton'
import AnswerButton from './AnswerButton'
import { getLcUrl } from '../data/lcLinks'

const TABS = ['Problem', 'Brute Force', 'Optimized']

export default function QuestionCard({
  title = 'Problem Title',
  difficulty = 'Medium',
  bruteComplexity = 'O(n²)',
  optComplexity = 'O(n)',
  optSpaceComplexity = 'O(1)',
  problem = 'Problem statement goes here.',
  hint = 'Think step by step.',
  answer = 'The optimal solution explanation goes here.',
  answerCode,
  answerLang = 'rust',
  bruteCode = '// Brute force code here',
  optCode = '// Optimized code here',
  lang = 'rust',
}) {
  const [tab, setTab] = useState(0)
  const lcUrl = getLcUrl(title)

  const diffColor = {
    Easy: 'var(--green)',
    Medium: 'var(--yellow)',
    Hard: 'var(--red)',
  }[difficulty] || 'var(--text-dim)'

  return (
    <div className="question-card">
      <div className="question-card-title">
        {title}
        {lcUrl && (
          <a
            href={lcUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="lc-link"
            onClick={e => e.stopPropagation()}
          >
            Solve on LC →
          </a>
        )}
      </div>
      <div className="qcard-meta">
        <span style={{ fontSize: 11, color: diffColor, fontWeight: 600 }}>{difficulty}</span>
        {tab === 1 && <BigOBadge complexity={bruteComplexity} label="time" />}
        {tab === 2 && (
          <>
            <BigOBadge complexity={optComplexity} label="time" />
            <BigOBadge complexity={optSpaceComplexity} label="space" />
          </>
        )}
      </div>

      <div className="qcard-tabs">
        {TABS.map((t, i) => (
          <button
            key={t}
            className={`qcard-tab${tab === i ? ' active' : ''}`}
            onClick={() => setTab(i)}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="qcard-body">
        {tab === 0 && (
          <>
            <p className="qcard-problem">{problem}</p>
            <div className="qcard-actions">
              <HintButton hint={hint} />
              <AnswerButton answer={answer} code={answerCode} lang={answerLang} />
            </div>
          </>
        )}
        {tab === 1 && (
          <>
            <CodeBlock code={bruteCode} lang={lang} />
            <p style={{ fontSize: 12, color: 'var(--text-dim)' }}>
              Brute force — works but not efficient. Good starting point.
            </p>
          </>
        )}
        {tab === 2 && (
          <>
            <CodeBlock code={optCode} lang={lang} />
            <p style={{ fontSize: 12, color: 'var(--text-dim)' }}>
              Optimized solution using the pattern.
            </p>
          </>
        )}
      </div>
    </div>
  )
}
