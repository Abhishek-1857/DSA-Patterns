const FAST = new Set(['O(1)', 'O(log n)', 'O(log N)'])
const MED  = new Set(['O(n)', 'O(n log n)', 'O(N)', 'O(N log N)'])

function classify(complexity) {
  if (FAST.has(complexity)) return 'green'
  if (MED.has(complexity)) return 'yellow'
  return 'red'
}

export default function BigOBadge({ complexity, label }) {
  const tier = classify(complexity)
  return (
    <span className={`bigo-badge ${tier}`} title={label}>
      {complexity}
      {label && <span style={{ marginLeft: 4, fontWeight: 400, opacity: 0.8 }}>· {label}</span>}
    </span>
  )
}
