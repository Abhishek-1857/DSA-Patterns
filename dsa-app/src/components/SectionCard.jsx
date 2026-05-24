import { useState } from 'react'
import SectionHeader from './SectionHeader'
import QuestionCard from './QuestionCard'
import CodeBlock from './CodeBlock'
import BigOBadge from './BigOBadge'

const PLACEHOLDER_CODE = `// Example pattern structure
function slidingWindow(arr, k) {
  let windowSum = 0; // track current window
  let maxSum = 0;

  for (let i = 0; i < k; i++) {
    windowSum += arr[i]; // build first window
  }
  maxSum = windowSum;

  for (let i = k; i < arr.length; i++) {
    // slide: add new, remove old
    windowSum += arr[i] - arr[i - k];
    maxSum = Math.max(maxSum, windowSum);
  }
  return maxSum; // O(n) time, O(1) space
}`

const PLACEHOLDER_BRUTE = `// Brute force: check every pair
function bruteForce(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] + arr[j] === target) {
        return [i, j]; // found it!
      }
    }
  }
  return []; // nothing found
}`

const PLACEHOLDER_OPT = `// Optimized: use a hash map
function twoSum(arr, target) {
  const seen = {}; // value -> index

  for (let i = 0; i < arr.length; i++) {
    const complement = target - arr[i];
    if (seen[complement] !== undefined) {
      return [seen[complement], i];
    }
    seen[arr[i]] = i; // remember this
  }
  return [];
}`

export default function SectionCard({ id, num, title, triggers, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="section-card" id={id}>
      <button className="section-card-header" onClick={() => setOpen(v => !v)}>
        <span className="section-card-num">{String(num).padStart(2, '0')}</span>
        <span className="section-card-title">{title}</span>
        <span className={`section-card-arrow${open ? ' open' : ''}`}>▼</span>
      </button>

      {open && (
        <div className="section-card-body">
          <SectionHeader name={title} triggers={triggers} />

          {children ?? (
            <>
              <div className="placeholder-content">
                Content for <strong>{title}</strong> is coming soon. The components below are live demos.
              </div>

              <CodeBlock code={PLACEHOLDER_CODE} lang="javascript" />

              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                <span style={{ fontSize: 12, color: 'var(--text-dim)' }}>Complexity badges:</span>
                <BigOBadge complexity="O(1)" label="space" />
                <BigOBadge complexity="O(n)" label="time" />
                <BigOBadge complexity="O(n²)" label="brute" />
              </div>

              <QuestionCard
                title={`[Placeholder] Sample ${title} Problem`}
                difficulty="Medium"
                bruteComplexity="O(n²)"
                optComplexity="O(n)"
                optSpaceComplexity="O(1)"
                problem={`This is where the ${title} problem statement will go. You'll be given an input and asked to find an optimal solution using the ${title} pattern.`}
                hint={`Think about how the ${title} pattern reduces repeated work. What do you reuse from the previous step?`}
                answer={`Use the ${title} pattern: instead of recomputing from scratch each time, maintain state as you iterate. This drops you from O(n²) to O(n).`}
                bruteCode={PLACEHOLDER_BRUTE}
                optCode={PLACEHOLDER_OPT}
                lang="javascript"
              />
            </>
          )}
        </div>
      )}
    </div>
  )
}
