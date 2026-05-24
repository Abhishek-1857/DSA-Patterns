import CodeBlock from './CodeBlock'
import BigOBadge from './BigOBadge'

// ─────────────────────────────────────────────────────────────
//  HELPER MICRO-COMPONENTS
// ─────────────────────────────────────────────────────────────

function Sub({ num, title, children }) {
  return (
    <div className="found-sub">
      <div className="found-sub-hdr">
        <span className="found-sub-num">{num}</span>
        <h2 className="found-sub-title">{title}</h2>
      </div>
      <div className="found-sub-body">{children}</div>
    </div>
  )
}

function Callout({ type = 'analogy', icon, label, children }) {
  const defaults = {
    analogy: { icon: '🗣️', label: 'Real-life analogy' },
    tip:     { icon: '💡', label: 'Quick tip' },
    warning: { icon: '⚠️', label: 'Common mistake' },
    note:    { icon: '📝', label: 'Note' },
  }
  const d = defaults[type]
  return (
    <div className={`callout ${type}`}>
      <span className="callout-label">{icon ?? d.icon} {label ?? d.label}</span>
      <div className="callout-body">{children}</div>
    </div>
  )
}

function DSCard({ icon, name, what, analogy, code }) {
  return (
    <div className="ds-card">
      <div className="ds-card-name">{icon} {name}</div>
      <div className="ds-card-what">{what}</div>
      <div className="ds-card-analo">📦 {analogy}</div>
      <CodeBlock code={code} lang="javascript" />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
//  CODE STRINGS
// ─────────────────────────────────────────────────────────────

const ARRAY_CODE = `// An array stores items in a fixed order, side by side in memory
const fruits = ["apple", "banana", "mango", "grape"];
//               idx 0     idx 1     idx 2    idx 3
//   ↑ indexes start at 0, not 1 — easy to forget!

console.log(fruits[0]);      // → "apple"  (instant: go straight to slot 0)
console.log(fruits[2]);      // → "mango"  (instant: go straight to slot 2)
console.log(fruits.length);  // → 4        (how many items are in here)

fruits.push("peach");        // add to the end   → [..., "peach"]
fruits.pop();                // remove last item  → removes "peach"`

const LINKED_LIST_CODE = `// Each "node" holds a value + a pointer to the next node
class Node {
  constructor(value) {
    this.value = value;  // the actual data stored here
    this.next  = null;   // arrow pointing to next node (null = end of list)
  }
}

// Build: 10 → 20 → 30 → null
const a = new Node(10);   // first node
const b = new Node(20);   // second node
const c = new Node(30);   // third node

a.next = b;               // 10 → 20
b.next = c;               // 20 → 30
// c.next stays null      → end of the list

// To reach the value 30, you must walk from the beginning:
console.log(a.next.next.value);  // → 30  (hop, hop, arrive)`

const STACK_CODE = `// Stack = a pile of plates. Last one placed = first one removed.
// Rule: you can ONLY add or remove from the TOP.
const stack = [];

stack.push("homework 1");  // add to top → ["homework 1"]
stack.push("homework 2");  // add to top → ["homework 1", "homework 2"]
stack.push("homework 3");  // add to top → ["...", "...", "homework 3"]

console.log(stack.pop()); // → "homework 3"  (last in, first out)
console.log(stack.pop()); // → "homework 2"
console.log(stack.length);// → 1  (only "homework 1" left)

// Real use: Ctrl+Z (undo), browser back button, call stack`

const QUEUE_CODE = `// Queue = a line at lunch. First person in = first person served.
// Rule: add to the BACK, remove from the FRONT.
const queue = [];

queue.push("Aryan");    // joins back → ["Aryan"]
queue.push("Priya");    // joins back → ["Aryan", "Priya"]
queue.push("Dev");      // joins back → ["Aryan", "Priya", "Dev"]

console.log(queue.shift()); // → "Aryan"  (first in, first out)
console.log(queue.shift()); // → "Priya"
// Dev is still waiting: ["Dev"]

// Real use: task schedulers, print queues, BFS graph traversal`

const HASHMAP_CODE = `// HashMap = a dictionary. Look up values instantly by name (key).
const scores = new Map();   // start with an empty map

scores.set("Alice",   95);  // key: "Alice",   value: 95
scores.set("Bob",     87);  // key: "Bob",     value: 87
scores.set("Charlie", 92);  // key: "Charlie", value: 92

// Find Alice's score — no looping, just instant lookup:
console.log(scores.get("Alice"));  // → 95
console.log(scores.has("Dave"));   // → false  (Dave not in here)
console.log(scores.size);          // → 3

// This is O(1) — same speed whether 3 entries or 3 million entries`

const TREE_CODE = `// Tree = a family tree. One root at top, branches going down.
// Each node can have child nodes. No going back (no cycles).
class TreeNode {
  constructor(val) {
    this.val   = val;   // this node's value
    this.left  = null;  // left child (or null if leaf)
    this.right = null;  // right child (or null if leaf)
  }
}

//  Build:        10       ← root (grandparent)
//               /  \\
//              5    15    ← children of 10
//             / \\
//            3   7        ← grandchildren of 10

const root      = new TreeNode(10);   // the root
root.left       = new TreeNode(5);    // left child of root
root.right      = new TreeNode(15);   // right child of root
root.left.left  = new TreeNode(3);    // left child of 5
root.left.right = new TreeNode(7);    // right child of 5

console.log(root.left.right.val); // → 7  (root → 5 → 7)`

const GRAPH_CODE = `// Graph = a network. Nodes connected by edges. Like a city road map.
// Adjacency list: each city lists which other cities it connects to.
const roads = {
  "Mumbai":    ["Pune", "Surat", "Nashik"],  // Mumbai connects to these
  "Pune":      ["Mumbai", "Nashik"],          // Pune's connections
  "Surat":     ["Mumbai", "Ahmedabad"],
  "Nashik":    ["Mumbai", "Pune"],
  "Ahmedabad": ["Surat"],
};

// Which cities can I reach directly from Mumbai?
console.log(roads["Mumbai"]); // → ["Pune", "Surat", "Nashik"]

// Is there a direct road from Mumbai to Ahmedabad?
console.log(roads["Mumbai"].includes("Ahmedabad")); // → false

// Unlike trees: graphs can have cycles, no single "root"`

const ALGO_CODE = `// Same Maggi steps — now written as code
// INPUT: raw noodles + water
// OUTPUT: hot, delicious Maggi

function makeMaggi(cupsOfWater) {
  // Step 1: prepare hot water
  const pot = boilWater(cupsOfWater);  // heat until 100°C

  // Step 2: add the noodle block
  addNoodles(pot);

  // Step 3: wait patiently (this is still a step!)
  wait(2);  // 2 minutes

  // Step 4: the crucial flavour step
  const masala = openPacket();
  addTo(pot, masala);  // dump in the whole packet

  // Step 5: mix it all together
  stir(pot, 30);  // 30 seconds

  // Step 6: done cooking
  turnOffStove();

  // Step 7: hand back the finished result
  return pot;  // ← this is the OUTPUT
}

// KEY INSIGHT: input goes in → steps happen → output comes out
// That's ALL an algorithm is. It just has fancier steps.`

const O1_CODE = `// O(1) — Constant time. Always 1 step, no matter the input size.
const students = ["Alice", "Bob", "Charlie", "Dave", "Eve"];

// Access by index — instant, always exactly 1 operation:
const third = students[2];  // → "Charlie"

// Doesn't matter if there are 5 students or 5 million:
function getFirst(arr) {
  return arr[0];  // always exactly 1 step
}

// getFirst([1])                  → 1 step  ⚡
// getFirst([1, 2, 3, 4, 5])     → 1 step  ⚡
// getFirst([...1 million items]) → 1 step  ⚡`

const OLOGN_CODE = `// O(log n) — each step HALVES the remaining work.
// Requires a SORTED array. Think: guess a number by halving.
function binarySearch(sortedArr, target) {
  let left  = 0;                        // left edge of search zone
  let right = sortedArr.length - 1;     // right edge of search zone

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);  // peek at the middle

    if (sortedArr[mid] === target) return mid;   // found it! done.
    if (sortedArr[mid] < target)  left  = mid + 1; // target is in right half
    else                          right = mid - 1; // target is in left half
  }
  return -1;  // not found
}

// Search for 7 in [1,2,3,4,5,6,7,8,9,10]:
// Step 1: mid=5 → too small → look right [6,7,8,9,10]
// Step 2: mid=8 → too big  → look left  [6,7]
// Step 3: mid=6 → too small → look right [7]
// Step 4: mid=7 → found! ✅  (10 items, only 4 checks)
// 1,000 items → ~10 checks. 1 million → ~20 checks.`

const ON_CODE = `// O(n) — Linear time. Work grows directly with input size.
function findFriend(crowd, friendName) {
  // Worst case: friend is last (or not there), so check everyone
  for (let i = 0; i < crowd.length; i++) {  // loop through each person
    if (crowd[i] === friendName) {           // is this them?
      return i;                              // found! return position
    }
  }
  return -1;  // friend wasn't in the crowd
}

// 10 people  → up to  10 checks
// 100 people → up to 100 checks
// n people   → up to   n checks  (that's why it's called O(n))

// Rule of thumb: ONE loop over n items = O(n)`

const ONLOGN_CODE = `// O(n log n) — a bit slower than O(n), WAY better than O(n²).
// Most good sorting algorithms land here.

const scores = [85, 42, 99, 17, 63, 28];

// JavaScript's built-in sort is O(n log n):
scores.sort((a, b) => a - b);
// → [17, 28, 42, 63, 85, 99]

// WHY n log n? (Merge sort example)
// Split array in half → split again → ... → log(n) levels
// Each level does O(n) work to merge → total: n × log(n)

// n = 100   →  ~700 steps   ✅
// n = 1000  → ~10,000 steps ✅
// n = 10000 → ~130,000 steps (still fine)`

const ON2_CODE = `// O(n²) — Quadratic time. Nested loop = danger sign!
function findAllPairs(arr) {
  const pairs = [];

  for (let i = 0; i < arr.length; i++) {       // outer: each element
    for (let j = i + 1; j < arr.length; j++) { // inner: compare with every other
      pairs.push([arr[i], arr[j]]);             // record this pair
    }
  }
  return pairs;
}

// n = 10    →    45 pairs   (fine)
// n = 100   → 4,950 pairs   (okay)
// n = 1000  → 499,500 pairs (getting slow 🐌)
// n = 10000 → 50 million ops (very slow 🐌🐌🐌)

// PATTERN: if you see a loop INSIDE a loop → probably O(n²)`

const SPACE_O1_CODE = `// O(1) space — same memory usage no matter the input size
function sumArray(arr) {
  let total = 0;  // just ONE extra variable, always

  for (let i = 0; i < arr.length; i++) {
    total += arr[i];  // reuse 'total' — don't create new variables
  }

  return total;
}

// arr has 5 items    → extra memory: 'total' + 'i' = 2 slots
// arr has 5000 items → extra memory: 'total' + 'i' = still 2 slots
// Your desk stays the same size regardless of how much data you process`

const SPACE_ON_CODE = `// O(n) space — memory GROWS with input size
function doubleAll(arr) {
  const result = [];  // new array — grows as arr grows!

  for (let i = 0; i < arr.length; i++) {
    result.push(arr[i] * 2);  // add one new slot per input item
  }

  return result;
}

// arr = [1, 2, 3]     → result = [2, 4, 6]    → 3 extra slots
// arr has 100 items   → result has 100 items   → 100 extra slots
// arr has 1000 items  → result has 1000 items  → 1000 extra slots
// Memory needed = n (scales with the input). That's O(n) space.`

const RECURSION_CORRECT = `// Factorial: 5! = 5 × 4 × 3 × 2 × 1 = 120
function factorial(n) {
  // ── BASE CASE: the stop sign ────────────────────────────
  // Without this, the function calls itself forever → CRASH
  if (n <= 1) return 1;  // we know: 0! = 1 and 1! = 1

  // ── RECURSIVE CASE: call yourself with a smaller problem ─
  return n * factorial(n - 1);
  //         ↑ same function, but n shrinks by 1 each time
}

// Tracing factorial(4):
//
//  factorial(4)         → 4 × factorial(3)
//    factorial(3)       →     3 × factorial(2)
//      factorial(2)     →         2 × factorial(1)
//        factorial(1)   →             1  ← BASE CASE! stop here.
//      factorial(2)     →         2 × 1  = 2   ← now we return up
//    factorial(3)       →     3 × 2      = 6
//  factorial(4)         → 4 × 6          = 24  ✅

console.log(factorial(4));  // → 24
console.log(factorial(6));  // → 720`

const RECURSION_BROKEN = `// ❌ BROKEN — no base case = infinite recursion = crash!
function brokenFactorial(n) {
  return n * brokenFactorial(n - 1);  // calls itself... forever
}

// What happens calling brokenFactorial(3):
//
//   brokenFactorial(3)
//     brokenFactorial(2)
//       brokenFactorial(1)
//         brokenFactorial(0)
//           brokenFactorial(-1)
//             brokenFactorial(-2)
//               ... goes on forever ...
//
//  💥 "Maximum call stack size exceeded" — the program CRASHES
//
// The call stack (pile of function calls) grows and grows
// until your computer runs out of room. Then boom.`

const FIVSTEP_BRUTE = `// STEP 2: Brute force — check every single pair
// Problem: find two numbers in [2, 7, 11, 15] that add up to 9

function twoSumBrute(arr, target) {
  for (let i = 0; i < arr.length; i++) {       // pick 1st number
    for (let j = i + 1; j < arr.length; j++) { // pick 2nd number
      if (arr[i] + arr[j] === target) {        // do they sum to target?
        return [i, j];                         // yes! return indexes
      }
    }
  }
  return [];  // no pair found
}

// STEP 3: What's slow?
// Two nested loops → O(n²)
// For arr[0]=2, we check 7, 11, 15 (3 checks)
// For arr[1]=7, we check 11, 15 (2 checks)
// ... lots of repeated scanning. We can do better.`

const FIVSTEP_OPT = `// STEP 4: Optimize — use a HashMap to remember what we've seen
function twoSumOptimized(arr, target) {
  const seen = new Map();  // value → its index in arr

  for (let i = 0; i < arr.length; i++) {
    const need = target - arr[i];  // what number do we NEED?

    if (seen.has(need)) {          // have we seen that number before?
      return [seen.get(need), i];  // yes! return both indexes
    }

    seen.set(arr[i], i);           // no? remember this number for later
  }
  return [];  // no solution
}

// Walk-through with [2, 7, 11, 15], target = 9:
// i=0: arr[0]=2, need=7.  seen={}    → remember {2→0}
// i=1: arr[1]=7, need=2.  Is 2 in seen? YES! → return [0, 1] ✅
//
// O(n) time  — one pass
// O(n) space — the map holds at most n entries`

// ─────────────────────────────────────────────────────────────
//  BIG-O TABLE
// ─────────────────────────────────────────────────────────────

function BigOTable() {
  const rows = [
    {
      tier: 'green',
      complexity: 'O(1)',
      name: 'Constant',
      analogy: 'Grabbing the top book off your desk — instant, always',
      n100: '1 op',
      n1000: '1 op',
      speed: '⚡⚡⚡',
    },
    {
      tier: 'green',
      complexity: 'O(log n)',
      name: 'Logarithmic',
      analogy: 'Guessing a number by halving: 1-100 → ~7 guesses',
      n100: '~7 ops',
      n1000: '~10 ops',
      speed: '⚡⚡⚡',
    },
    {
      tier: 'yellow',
      complexity: 'O(n)',
      name: 'Linear',
      analogy: 'Checking every person in a crowd one by one',
      n100: '100 ops',
      n1000: '1,000 ops',
      speed: '⚡⚡',
    },
    {
      tier: 'yellow',
      complexity: 'O(n log n)',
      name: 'Linearithmic',
      analogy: 'Sorting a deck of cards efficiently (merge sort)',
      n100: '~700 ops',
      n1000: '~10k ops',
      speed: '⚡',
    },
    {
      tier: 'red',
      complexity: 'O(n²)',
      name: 'Quadratic',
      analogy: 'Comparing every student in class to every other student',
      n100: '10,000 ops',
      n1000: '1M ops',
      speed: '🐌',
    },
  ]

  return (
    <div className="bigo-table-wrap">
      <table className="bigo-table">
        <thead>
          <tr>
            <th>Complexity</th>
            <th>Name</th>
            <th>Real-life feel</th>
            <th>n = 100</th>
            <th>n = 1,000</th>
            <th>Speed</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.complexity} className={`tier-${r.tier}`}>
              <td><BigOBadge complexity={r.complexity} /></td>
              <td><span className="bigo-name">{r.name}</span></td>
              <td>{r.analogy}</td>
              <td><span className="bigo-ops">{r.n100}</span></td>
              <td><span className="bigo-ops">{r.n1000}</span></td>
              <td>{r.speed}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
//  MEMORY VISUALIZATION
// ─────────────────────────────────────────────────────────────

function MemViz() {
  return (
    <div
      className="callout note"
      style={{ gap: 10 }}
    >
      <span className="callout-label">📊 Memory usage — visual</span>
      <div className="mem-viz">
        {/* O(1) — always the same 2 boxes */}
        <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 2, fontFamily: 'ui-monospace, monospace' }}>
          O(1) space — same memory regardless of input:
        </div>
        <div className="mem-row">
          <span className="mem-row-lbl">n = 5</span>
          <div className="mem-boxes">
            <div className="mem-box fixed">total</div>
            <div className="mem-box fixed">i</div>
          </div>
          <span className="mem-row-note">← always 2 slots</span>
        </div>
        <div className="mem-row">
          <span className="mem-row-lbl">n = 1000</span>
          <div className="mem-boxes">
            <div className="mem-box fixed">total</div>
            <div className="mem-box fixed">i</div>
          </div>
          <span className="mem-row-note">← still 2 slots</span>
        </div>

        <div style={{ height: 8 }} />

        {/* O(n) — grows with input */}
        <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 2, fontFamily: 'ui-monospace, monospace' }}>
          O(n) space — memory grows with input:
        </div>
        <div className="mem-row">
          <span className="mem-row-lbl">n = 4</span>
          <div className="mem-boxes">
            {[0,1,2,3].map(i => <div key={i} className="mem-box used">r[{i}]</div>)}
          </div>
        </div>
        <div className="mem-row">
          <span className="mem-row-lbl">n = 8</span>
          <div className="mem-boxes">
            {[0,1,2,3,4,5,6,7].map(i => <div key={i} className="mem-box used">r[{i}]</div>)}
          </div>
        </div>
        <div className="mem-row">
          <span className="mem-row-lbl">n = 12</span>
          <div className="mem-boxes">
            {[0,1,2,3,4,5,6,7,8,9,10,11].map(i => <div key={i} className="mem-box used">r[{i}]</div>)}
          </div>
          <span className="mem-row-note">← grows with n</span>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
//  CALL STACK VISUALIZATION
// ─────────────────────────────────────────────────────────────

function CallStackViz() {
  return (
    <div className="call-stack-wrap">
      {/* Phase 1: building up */}
      <div className="call-stack-phase">
        <div className="call-stack-phase-lbl">🔨 Phase 1 — building up (calling deeper)</div>
        <div className="call-stack" style={{ fontSize: 12 }}>
          {/* Rendered reversed — bottom item appears at bottom visually */}
          <div className="call-frame base">
            <span>factorial(1)</span>
            <span className="call-frame-status base">returns 1 ← BASE CASE!</span>
          </div>
          <div className="call-frame waiting">
            <span>factorial(2)&nbsp;&nbsp;→ waiting for factorial(1)</span>
            <span className="call-frame-status waiting">waiting</span>
          </div>
          <div className="call-frame waiting">
            <span>factorial(3)&nbsp;&nbsp;→ waiting for factorial(2)</span>
            <span className="call-frame-status waiting">waiting</span>
          </div>
          <div className="call-frame waiting">
            <span>factorial(4)&nbsp;&nbsp;→ waiting for factorial(3)</span>
            <span className="call-frame-status waiting">waiting</span>
          </div>
        </div>
        <div style={{ fontSize: 11.5, color: '#6b7280', paddingLeft: 4 }}>
          ↑ Stack grows downward. factorial(4) is at the top, factorial(1) at the bottom.
        </div>
      </div>

      {/* Phase 2: unwinding */}
      <div className="call-stack-phase">
        <div className="call-stack-phase-lbl">⬆️ Phase 2 — unwinding (returning back up)</div>
        <div
          style={{
            fontFamily: 'ui-monospace, monospace',
            fontSize: 12,
            background: '#0d0d0d',
            border: '1px solid var(--border)',
            borderRadius: 8,
            padding: '12px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
            color: '#6b7280',
            lineHeight: 1.8,
          }}
        >
          <span><span style={{ color: '#34d399' }}>factorial(1)</span> returns <span style={{ color: '#a78bfa' }}>1</span></span>
          <span><span style={{ color: '#60a5fa' }}>factorial(2)</span> returns 2 × 1 = <span style={{ color: '#a78bfa' }}>2</span></span>
          <span><span style={{ color: '#60a5fa' }}>factorial(3)</span> returns 3 × 2 = <span style={{ color: '#a78bfa' }}>6</span></span>
          <span><span style={{ color: '#60a5fa' }}>factorial(4)</span> returns 4 × 6 = <span style={{ color: '#fbbf24' }}>24 ✅</span></span>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
//  MAIN EXPORT
// ─────────────────────────────────────────────────────────────

export default function FoundationsContent() {
  return (
    <div className="found-content">

      {/* ══════════════════════════════════════════ */}
      {/*  1. WHAT IS A DATA STRUCTURE?             */}
      {/* ══════════════════════════════════════════ */}
      <Sub num="1" title="What is a Data Structure?">

        <p className="found-p">
          A data structure is just a <strong>way of organizing data</strong> so it&apos;s easier to use.
          That&apos;s it. Different structures are good at different things — like how a
          bookshelf (great for browsing) is different from a filing cabinet (great for finding a specific document).
        </p>

        <Callout type="analogy">
          <strong>Your school bag is a data structure.</strong> You have a main compartment for books,
          a side pocket for your water bottle, and a front zip for your pen — each pocket organizes
          things differently so you can find them fast. A data structure does the same thing for your
          program&apos;s data.
        </Callout>

        <p className="found-p">
          Here are the 7 you&apos;ll see in literally every DSA problem:
        </p>

        <div className="ds-grid">
          <DSCard
            icon="📦"
            name="Array"
            what="An ordered list of items stored side by side in memory. Each item has a number (index) so you can grab it instantly."
            analogy="A row of school lockers. Locker #1, #2, #3... you can go directly to any locker by number."
            code={ARRAY_CODE}
          />
          <DSCard
            icon="🔗"
            name="Linked List"
            what="Items stored anywhere in memory, but each item has a pointer to the next one — like a treasure hunt."
            analogy="A chain of wagons. Each wagon has cargo + a hook connecting to the next wagon. To get to wagon 5, walk from wagon 1."
            code={LINKED_LIST_CODE}
          />
          <DSCard
            icon="🍽️"
            name="Stack"
            what="Items stacked on top of each other. You can only add or remove from the top. Last In, First Out (LIFO)."
            analogy="A stack of plates. The last plate you put on top is the first one you take off. Can't grab the bottom one first."
            code={STACK_CODE}
          />
          <DSCard
            icon="🧍"
            name="Queue"
            what="Items in a line. You join at the back and leave from the front. First In, First Out (FIFO)."
            analogy="A lunch line at school. The first person to join is the first person to get their food."
            code={QUEUE_CODE}
          />
          <DSCard
            icon="📖"
            name="HashMap"
            what="Stores key-value pairs. Give it a key (like a word), get back a value (like its definition). Instant lookup."
            analogy="A dictionary. You don't read from page 1 to find 'zebra' — you jump straight to 'Z'. Same idea."
            code={HASHMAP_CODE}
          />
          <DSCard
            icon="🌳"
            name="Tree"
            what="Nodes connected in a hierarchy. One root at the top, branches spreading downward. No loops allowed."
            analogy="A family tree. Your grandparent is the root. They have children. Each child has children. It branches out."
            code={TREE_CODE}
          />
          <DSCard
            icon="🗺️"
            name="Graph"
            what="Nodes connected by edges. Unlike trees, any node can connect to any other node. Can have cycles."
            analogy="A Google Maps road network. Cities are nodes. Roads are edges. You can go in circles (unlike a tree)."
            code={GRAPH_CODE}
          />
        </div>

        <Callout type="tip">
          <strong>Which one to use?</strong> Arrays when you need fast access by index.
          HashMaps when you need fast lookup by name. Stacks for undo/redo. Queues for
          order-preserving tasks. Trees/Graphs for hierarchical or network data.
          You&apos;ll build an instinct for this over time — don&apos;t memorize, just use them.
        </Callout>

      </Sub>

      {/* ══════════════════════════════════════════ */}
      {/*  2. WHAT IS AN ALGORITHM?                 */}
      {/* ══════════════════════════════════════════ */}
      <Sub num="2" title="What is an Algorithm?">

        <p className="found-p">
          An algorithm is just <strong>a sequence of steps to solve a problem</strong>.
          You&apos;ve been writing algorithms your whole life without realizing it.
          Every recipe you&apos;ve followed, every game you&apos;ve played — those are algorithms.
        </p>

        <Callout type="analogy">
          <strong>Making Maggi noodles is an algorithm.</strong> You have a clear input
          (raw noodles + water), a fixed sequence of steps, and a predictable output (hot Maggi).
          That&apos;s exactly what code does — just with data instead of noodles.
        </Callout>

        <div className="recipe-card">
          <div className="recipe-title">🍜 Recipe: Maggi Noodles (2-minute Maggi algorithm)</div>
          <ol className="recipe-steps">
            {[
              'Boil 2 cups of water in a pan',
              'Add the noodle block to the boiling water',
              'Wait 2 minutes — let it cook properly',
              'Open the masala packet, pour it all in',
              'Stir for 30 seconds so it mixes well',
              'Turn off the stove',
              'Serve hot and eat',
            ].map((step, i) => (
              <li key={i} className="recipe-step">
                <span className="recipe-step-num">{i + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
          <div className="recipe-io">
            <span className="recipe-io-item"><strong>Input:</strong> raw noodles, water, masala packet</span>
            <span className="recipe-io-item"><strong>Output:</strong> hot, delicious Maggi</span>
          </div>
        </div>

        <p className="found-p">
          Now look at the exact same idea written as code. The structure is identical —
          input goes in, steps happen in order, output comes out:
        </p>

        <CodeBlock code={ALGO_CODE} lang="javascript" />

        <Callout type="tip">
          Every single algorithm you&apos;ll ever write has the same shape:{' '}
          <strong>input → steps → output</strong>. When you&apos;re stuck, ask yourself:
          &quot;What&apos;s my input? What should my output be? What steps connect them?&quot;
          That question alone will unblock you 90% of the time.
        </Callout>

      </Sub>

      {/* ══════════════════════════════════════════ */}
      {/*  3. TIME COMPLEXITY & BIG O               */}
      {/* ══════════════════════════════════════════ */}
      <Sub num="3" title="Time Complexity & Big O">

        <p className="found-p">
          Time complexity answers one question: <strong>as your input gets bigger, how much
          more work does your code have to do?</strong> We use <em>Big O notation</em> to
          describe this — it&apos;s just a standardized way of saying &quot;slow&quot; or &quot;fast&quot;.
        </p>
        <p className="found-p">
          The <em>O</em> stands for &quot;Order of&quot; — as in, &quot;this algorithm is on the order
          of n operations.&quot; Don&apos;t worry about the math. Just understand what each one
          feels like.
        </p>

        <Callout type="analogy">
          <strong>Imagine you&apos;re at a concert trying to find your friend in the crowd.</strong>{' '}
          How fast you find them depends on your <em>strategy</em> — and that strategy is
          what Big O measures.
        </Callout>

        {/* O(1) */}
        <div className="found-sub" style={{ gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <BigOBadge complexity="O(1)" />
            <span style={{ fontSize: 14, fontWeight: 700, color: '#f9fafb' }}>Constant Time</span>
          </div>
          <p className="found-p">
            Your friend texted you: <em>&quot;I&apos;m at seat 12.&quot;</em> You walk directly there.
            Doesn&apos;t matter if the venue has 100 seats or 100,000 — <strong>one step, done</strong>.
          </p>
          <CodeBlock code={O1_CODE} lang="javascript" />
        </div>

        {/* O(log n) */}
        <div className="found-sub" style={{ gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <BigOBadge complexity="O(log n)" />
            <span style={{ fontSize: 14, fontWeight: 700, color: '#f9fafb' }}>Logarithmic Time</span>
          </div>
          <p className="found-p">
            You&apos;re guessing a number between 1 and 100. You say 50. Too high — now you
            know it&apos;s 1-49. You say 25. Too low — now 26-49. Each guess <strong>cuts the
            remaining options in half</strong>. You&apos;ll find it in ~7 guesses max. That&apos;s log₂(100) ≈ 7.
          </p>
          <CodeBlock code={OLOGN_CODE} lang="javascript" />
        </div>

        {/* O(n) */}
        <div className="found-sub" style={{ gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <BigOBadge complexity="O(n)" />
            <span style={{ fontSize: 14, fontWeight: 700, color: '#f9fafb' }}>Linear Time</span>
          </div>
          <p className="found-p">
            Your friend said nothing. You start from one end of the crowd and check every
            single person. 500 people = up to 500 checks. <strong>Work grows directly with the
            crowd size</strong> — double the people, double the work.
          </p>
          <CodeBlock code={ON_CODE} lang="javascript" />
        </div>

        {/* O(n log n) */}
        <div className="found-sub" style={{ gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <BigOBadge complexity="O(n log n)" />
            <span style={{ fontSize: 14, fontWeight: 700, color: '#f9fafb' }}>Linearithmic Time</span>
          </div>
          <p className="found-p">
            You split the crowd into two halves, then each half into halves again (log n
            splits), and you check each person once per level (n checks per level). Slightly
            slower than O(n), but <strong>way better than O(n²)</strong>. This is where most
            good sorting algorithms live.
          </p>
          <CodeBlock code={ONLOGN_CODE} lang="javascript" />
        </div>

        {/* O(n²) */}
        <div className="found-sub" style={{ gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <BigOBadge complexity="O(n²)" />
            <span style={{ fontSize: 14, fontWeight: 700, color: '#f9fafb' }}>Quadratic Time</span>
          </div>
          <p className="found-p">
            For every single person in the crowd, you compare them with every other person.
            100 people = 10,000 comparisons. 1,000 people = 1,000,000 comparisons.{' '}
            <strong>Explodes fast.</strong> The tell-tale sign: a loop inside a loop.
          </p>
          <CodeBlock code={ON2_CODE} lang="javascript" />
        </div>

        <p className="found-p" style={{ marginTop: 8 }}>
          Here&apos;s the full picture at a glance:
        </p>
        <BigOTable />

        <Callout type="warning">
          <strong>Don&apos;t confuse worst case with average case.</strong> O(n) for linear search
          is the <em>worst case</em> (friend is last). On average you find them halfway — but
          Big O always describes the worst case unless stated otherwise. When someone says &quot;this
          is O(n)&quot; they mean: &quot;in the worst possible scenario, it&apos;s O(n).&quot;
        </Callout>

      </Sub>

      {/* ══════════════════════════════════════════ */}
      {/*  4. SPACE COMPLEXITY                       */}
      {/* ══════════════════════════════════════════ */}
      <Sub num="4" title="Space Complexity">

        <p className="found-p">
          Time complexity = how <em>fast</em> your code is. Space complexity = how much{' '}
          <strong>memory (RAM)</strong> your code uses. Same Big O notation, different
          question.
        </p>

        <Callout type="analogy">
          <strong>Think of RAM like your desk while doing homework.</strong> Some assignments
          just need a pencil and one sheet of paper — you could work on a tiny desk.
          Others need textbooks, rough sheets, a calculator, sticky notes spread everywhere.
          Space complexity measures how much desk space your code needs.
        </Callout>

        <MemViz />

        <p className="found-p">
          Let&apos;s see both in code — same goal (add up an array), but one uses a fixed amount
          of memory and the other allocates more as the input grows:
        </p>

        <CodeBlock code={SPACE_O1_CODE} lang="javascript" />
        <CodeBlock code={SPACE_ON_CODE} lang="javascript" />

        <Callout type="tip">
          <strong>There&apos;s often a trade-off between time and space.</strong> Using more memory
          (like a HashMap) often makes your code faster. Using less memory (in-place operations)
          can make it slower. When you see &quot;O(1) space,&quot; it means the algorithm is
          memory-efficient — it doesn&apos;t create extra data structures that grow with the input.
          Many interview questions specifically ask for O(1) space solutions — that&apos;s a harder
          challenge.
        </Callout>

      </Sub>

      {/* ══════════════════════════════════════════ */}
      {/*  5. RECURSION                             */}
      {/* ══════════════════════════════════════════ */}
      <Sub num="5" title="Recursion">

        <p className="found-p">
          Recursion is when <strong>a function calls itself</strong>. Sounds weird, but here&apos;s
          the key: every time it calls itself, it works on a <em>smaller version of the
          problem</em>. Eventually the problem is so small you know the answer — and that&apos;s
          when it stops.
        </p>

        <Callout type="analogy">
          <strong>Stand between two mirrors facing each other.</strong> You see yourself reflected
          forever — until the image gets too small to see. That infinite reflection is what
          recursion looks like. But in code, you <em>need</em> a stopping point (the base case),
          or it crashes. Think of the base case as putting a wall between the mirrors — it stops
          the reflection at a specific point.
        </Callout>

        <p className="found-p">
          Every recursive function has exactly <strong>two parts</strong>:
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{
            display: 'flex', gap: 10, alignItems: 'flex-start',
            background: 'rgba(52,211,153,0.06)', border: '1px solid rgba(52,211,153,0.2)',
            borderRadius: 8, padding: '12px 14px',
          }}>
            <span style={{ fontSize: 18, flexShrink: 0, marginTop: 1 }}>🛑</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#34d399', marginBottom: 3 }}>Base Case — the stop sign</div>
              <div style={{ fontSize: 12.5, color: '#9ca3af', lineHeight: 1.65 }}>
                The condition where you <strong style={{ color: '#e5e7eb' }}>already know the answer</strong> without
                recursing further. Without this, the function calls itself forever and crashes with a
                &quot;stack overflow&quot; error.
              </div>
            </div>
          </div>
          <div style={{
            display: 'flex', gap: 10, alignItems: 'flex-start',
            background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.2)',
            borderRadius: 8, padding: '12px 14px',
          }}>
            <span style={{ fontSize: 18, flexShrink: 0, marginTop: 1 }}>🔄</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#60a5fa', marginBottom: 3 }}>Recursive Case — the call itself</div>
              <div style={{ fontSize: 12.5, color: '#9ca3af', lineHeight: 1.65 }}>
                Call the same function again but with a <strong style={{ color: '#e5e7eb' }}>smaller input</strong>.
                Each call shrinks the problem until you hit the base case.
              </div>
            </div>
          </div>
        </div>

        <CodeBlock code={RECURSION_CORRECT} lang="javascript" />

        <p className="found-p">
          That comment-trace in the code above is how you should mentally walk through any
          recursive function. Let&apos;s also see it as a visual call stack — this is literally
          what&apos;s happening inside your computer&apos;s memory:
        </p>

        <CallStackViz />

        <p className="found-p">
          And here&apos;s what happens when you forget the base case — this is the most common
          recursion mistake:
        </p>

        <CodeBlock code={RECURSION_BROKEN} lang="javascript" />

        <Callout type="warning">
          <strong>The #1 recursion mistake: forgetting the base case.</strong> Your code
          compiles fine, runs fine... then crashes with &quot;Maximum call stack size exceeded&quot;
          or &quot;Stack overflow.&quot; If you ever see that error, the first thing to check is:
          does my base case exist? Does my recursive call actually make the input smaller
          each time so I eventually <em>reach</em> the base case?
        </Callout>

      </Sub>

      {/* ══════════════════════════════════════════ */}
      {/*  6. THE 5-STEP METHOD                    */}
      {/* ══════════════════════════════════════════ */}
      <Sub num="6" title="The 5-Step Method to Solve Any DSA Problem">

        <p className="found-p">
          Staring at a DSA problem and going blank is normal. Every beginner does it.
          But here&apos;s the thing — <strong>every problem you&apos;ll ever see follows the same
          process</strong>. Burn these 5 steps into your memory and you&apos;ll never stare at
          a blank screen again.
        </p>

        <Callout type="analogy">
          <strong>Example problem we&apos;ll use:</strong> Given an array of numbers and a target,
          return the indexes of the two numbers that add up to the target.
          Input: <code style={{ fontFamily: 'ui-monospace, monospace', fontSize: 12, color: '#a78bfa' }}>[2, 7, 11, 15]</code>, target <code style={{ fontFamily: 'ui-monospace, monospace', fontSize: 12, color: '#a78bfa' }}>9</code> →
          Output: <code style={{ fontFamily: 'ui-monospace, monospace', fontSize: 12, color: '#34d399' }}>[0, 1]</code> (because 2 + 7 = 9)
        </Callout>

        <div className="step-list">

          <div className="step-card">
            <span className="step-num">1</span>
            <div className="step-body">
              <div className="step-title">Understand the problem — what goes IN, what comes OUT?</div>
              <div className="step-desc">
                Before touching the keyboard: <strong>what exactly is the input?</strong> What type?
                What constraints? <strong>What should the output look like?</strong> Write it out in
                plain English. If you can&apos;t explain the problem back to yourself, you&apos;re not
                ready to code yet.
              </div>
              <div className="step-example">
                <span className="ex-label">In:</span> array of integers, one integer (target)<br />
                <span className="ex-label">Out:</span> array of two integers (indexes)<br />
                <span className="ex-label">Rule:</span> arr[i] + arr[j] === target, i ≠ j<br />
                <span className="ex-label">Q:</span> will there always be a solution? can i use the same element twice?
              </div>
            </div>
          </div>

          <div className="step-card">
            <span className="step-num">2</span>
            <div className="step-body">
              <div className="step-title">Think brute force first — the dumbest possible solution</div>
              <div className="step-desc">
                Don&apos;t try to be clever yet. What&apos;s the <strong>most obvious, simple, stupid way</strong> to
                solve this? Usually it&apos;s &quot;try every combination.&quot; This solution is always correct —
                it&apos;s just slow. That&apos;s okay. Write it. Get it working. <em>Then</em> optimize.
              </div>
              <CodeBlock code={FIVSTEP_BRUTE} lang="javascript" />
            </div>
          </div>

          <div className="step-card">
            <span className="step-num">3</span>
            <div className="step-body">
              <div className="step-title">Ask: what&apos;s slow about it?</div>
              <div className="step-desc">
                Look at your brute force. <strong>What&apos;s the bottleneck?</strong> Usually it&apos;s a
                loop inside a loop, or scanning the same data repeatedly. Ask: &quot;Am I
                redoing work I&apos;ve already done?&quot; If yes — that&apos;s where you optimize.
              </div>
              <div className="step-example">
                <span className="ex-label">Problem:</span> for each number, we scan ALL remaining numbers again<br />
                <span className="ex-label">Root cause:</span> we forget what we&apos;ve already seen → we re-scan<br />
                <span className="ex-label">Fix idea:</span> remember what we&apos;ve seen → instant lookup
              </div>
            </div>
          </div>

          <div className="step-card">
            <span className="step-num">4</span>
            <div className="step-body">
              <div className="step-title">Optimize using a pattern</div>
              <div className="step-desc">
                Most DSA problems map to one of ~15 known patterns (sliding window, two pointers,
                HashMap, etc.). Once you recognize the pattern, the solution almost writes itself.
                For this problem: <em>use a HashMap</em> to remember what we&apos;ve seen — trading
                O(n) space for O(n) time instead of O(n²) time.
              </div>
              <CodeBlock code={FIVSTEP_OPT} lang="javascript" />
              <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                <span style={{ fontSize: 12, color: 'var(--text-dim)' }}>Result:</span>
                <BigOBadge complexity="O(n)" label="time" />
                <BigOBadge complexity="O(n)" label="space" />
                <span style={{ fontSize: 12, color: 'var(--text-dim)', marginLeft: 4 }}>vs brute force</span>
                <BigOBadge complexity="O(n²)" label="time" />
              </div>
            </div>
          </div>

          <div className="step-card">
            <span className="step-num">5</span>
            <div className="step-body">
              <div className="step-title">Test edge cases — don&apos;t trust happy path only</div>
              <div className="step-desc">
                Your solution works for the example? Good. Now <strong>try to break it</strong>.
                Interviews and real systems fail on edge cases, not the normal input.
                Check these five every time:
              </div>
              <div className="step-example">
                <span className="ex-label">Empty:</span> arr = [] → should return [] (not crash)<br />
                <span className="ex-label">One item:</span> arr = [5] → can&apos;t form a pair → return []<br />
                <span className="ex-label">Negatives:</span> arr = [-3, 2, 5], target = -1 → works?<br />
                <span className="ex-label">Duplicates:</span> arr = [3, 3], target = 6 → should return [0, 1]<br />
                <span className="ex-label">No answer:</span> arr = [1, 2], target = 99 → return []
              </div>
            </div>
          </div>

        </div>

        <Callout type="tip">
          <strong>Use this method every single time</strong>, even when a problem seems easy.
          Skipping step 1 (understanding) is the biggest reason people write solutions that
          are technically correct but solve the wrong problem. Skipping step 5 (edge cases)
          is the biggest reason working solutions fail in production. The 5 minutes this process
          takes will save you from hours of debugging.
        </Callout>

      </Sub>

    </div>
  )
}
