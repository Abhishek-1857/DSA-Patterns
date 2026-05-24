import { useState } from 'react'

const KEYWORDS = new Set([
  'function','return','if','else','for','while','const','let','var','class',
  'import','export','from','in','of','true','false','null','undefined','new',
  'this','break','continue','def','and','or','not','range','len','append',
  'print','elif','pass','yield','async','await','try','except','finally',
  'throw','catch','switch','case','default','do','typeof','instanceof',
  'extends','super','static','self','None','True','False',
  'with','as','del','raise','is','lambda','assert','global','nonlocal',
])

function tokenize(code) {
  const tokens = []
  let i = 0
  while (i < code.length) {
    // Single-line comment: // or #
    if ((code[i] === '/' && code[i+1] === '/') || code[i] === '#') {
      let end = code.indexOf('\n', i)
      if (end === -1) end = code.length
      tokens.push({ type: 'comment', value: code.slice(i, end) })
      i = end
      continue
    }
    // String: " ' `
    if (code[i] === '"' || code[i] === "'" || code[i] === '`') {
      const q = code[i]
      let j = i + 1
      while (j < code.length) {
        if (code[j] === '\\') { j += 2; continue }
        if (code[j] === q) { j++; break }
        j++
      }
      tokens.push({ type: 'string', value: code.slice(i, j) })
      i = j
      continue
    }
    // Number
    if (/[0-9]/.test(code[i])) {
      let j = i
      while (j < code.length && /[0-9._]/.test(code[j])) j++
      tokens.push({ type: 'number', value: code.slice(i, j) })
      i = j
      continue
    }
    // Identifier or keyword
    if (/[a-zA-Z_$]/.test(code[i])) {
      let j = i
      while (j < code.length && /[a-zA-Z0-9_$]/.test(code[j])) j++
      const word = code.slice(i, j)
      tokens.push({ type: KEYWORDS.has(word) ? 'keyword' : 'plain', value: word })
      i = j
      continue
    }
    // Plain character
    const last = tokens[tokens.length - 1]
    if (last && last.type === 'plain') {
      last.value += code[i]
    } else {
      tokens.push({ type: 'plain', value: code[i] })
    }
    i++
  }
  return tokens
}

export default function CodeBlock({ code = '', lang = 'js' }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const tokens = tokenize(code)

  return (
    <div className="code-block">
      <div className="code-block-header">
        <span className="code-lang">{lang}</span>
        <button className={`code-copy-btn${copied ? ' copied' : ''}`} onClick={handleCopy}>
          {copied ? '✓ copied' : 'copy'}
        </button>
      </div>
      <pre className="code-pre">
        {tokens.map((tok, idx) => (
          <span key={idx} className={`tok-${tok.type}`}>{tok.value}</span>
        ))}
      </pre>
    </div>
  )
}
