import { useState } from 'react'

const KEYWORDS = new Set([
  // JS/TS
  'function','return','if','else','for','while','const','let','var','class',
  'import','export','from','in','of','true','false','null','undefined','new',
  'this','break','continue','async','await','try','catch','finally',
  'throw','switch','case','default','do','typeof','instanceof',
  'extends','super','static',
  // Python
  'def','and','or','not','range','len','append','print','elif','pass',
  'yield','except','with','as','del','raise','is','lambda','assert',
  'global','nonlocal','self','None','True','False',
  // Rust
  'fn','let','mut','pub','use','mod','struct','enum','impl','trait',
  'where','type','const','static','extern','unsafe','move','ref','dyn',
  'box','loop','match','if','else','while','for','in','return','break',
  'continue','true','false','self','Self','super','crate','as','use',
  'impl','pub','fn','struct','enum','trait','type','where','mod',
  'Vec','HashMap','HashSet','String','Option','Result','Some','None',
  'Ok','Err','usize','i32','i64','u32','u64','f32','f64','bool','char',
  'str','i8','u8','i16','u16','i128','u128','isize',
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
