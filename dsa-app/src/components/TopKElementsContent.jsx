import QuestionCard from './QuestionCard'
import CodeBlock from './CodeBlock'
import BigOBadge from './BigOBadge'

function Sub({ title, children }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <h3 style={{ color: 'var(--accent)', marginBottom: 12, fontSize: '1.1rem' }}>{title}</h3>
      {children}
    </div>
  )
}

function Callout({ type = 'info', children }) {
  const colors = { info: 'var(--accent)', warn: 'var(--yellow)', tip: 'var(--green)', danger: 'var(--red)' }
  return (
    <div style={{
      borderLeft: `3px solid ${colors[type]}`,
      background: 'var(--surface)',
      padding: '10px 16px',
      borderRadius: '0 8px 8px 0',
      margin: '12px 0',
      fontSize: '0.9rem',
    }}>
      {children}
    </div>
  )
}

const TOPK_VISUAL = `
TOP K ELEMENTS — keep a min-heap of size k

Goal: find the 3 largest numbers in [3,1,5,6,2,4]

Use a MIN-heap of size k=3 (top = smallest of the k-largest so far)

Process each number:
  push 3 → heap=[3]           size=1 ≤ k, no pop
  push 1 → heap=[1,3]         size=2 ≤ k, no pop
  push 5 → heap=[1,3,5]       size=3 = k, no pop yet
  push 6 → heap=[1,3,5,6]     size=4 > k → POP min (1) → heap=[3,5,6]
  push 2 → heap=[2,3,5,6]     size=4 > k → POP min (2) → heap=[3,5,6]
  push 4 → heap=[3,4,5,6]     size=4 > k → POP min (3) → heap=[4,5,6]

Final heap = [4,5,6] → the 3 largest elements!

WHY min-heap? The smallest element in the heap is the "bouncer" —
if a new element is bigger than it, the new element kicks it out.
After processing all n elements, only the k largest remain.

Time: O(n log k)  ← much better than O(n log n) full sort when k << n
`

const TOPK_STRATEGIES = `
THREE STRATEGIES FOR "TOP K" PROBLEMS:

1. SORT — O(n log n):
   nums.sort(reverse=True); return nums[:k]
   Simple but slow. Fine for small n.

2. MIN-HEAP OF SIZE K — O(n log k):
   Push each element. If heap grows > k, pop the minimum.
   Heap always holds the k largest seen so far.
   Best when k << n (streaming data, can't sort all of it).

3. QUICKSELECT — O(n) average:
   Partition array like quicksort, but only recurse into ONE half.
   Best for finding the kth element when you don't need sorted output.
   Not covered here — heap is more interview-common.
`

// ── Q1: Kth Largest Element ────────────────────────────────────────────────
const q1Brute = `# Brute: sort descending, return element at index k-1
def find_kth_largest_brute(nums, k):
    nums.sort(reverse=True)      # sort all n elements — O(n log n)
    return nums[k - 1]           # kth element from the start`

const q1Opt = `import heapq

def find_kth_largest(nums, k):
    heap = []                        # min-heap of size k

    for num in nums:
        heapq.heappush(heap, num)    # add this element
        if len(heap) > k:
            heapq.heappop(heap)      # kick out the SMALLEST — it can't be top-k

    return heap[0]                   # top of min-heap = kth largest`

// ── Q2: Top K Frequent Elements ────────────────────────────────────────────
const q2Brute = `from collections import Counter

# Brute: count, sort by frequency, take top k
def top_k_frequent_brute(nums, k):
    counts = Counter(nums)           # O(n) count
    # sort all unique elements by frequency descending — O(u log u)
    sorted_items = sorted(counts.items(), key=lambda x: -x[1])
    return [item[0] for item in sorted_items[:k]]`

const q2Opt = `import heapq
from collections import Counter

def top_k_frequent(nums, k):
    counts = Counter(nums)           # {element: frequency}
    heap = []                        # min-heap of (frequency, element)

    for num, freq in counts.items():
        heapq.heappush(heap, (freq, num))  # push (freq, element) pair
        if len(heap) > k:
            heapq.heappop(heap)      # remove the LEAST frequent (min of freq)

    return [num for freq, num in heap]   # extract just the elements`

// ── Q3: K Closest Points to Origin ────────────────────────────────────────
const q3Brute = `# Brute: compute all distances, sort, take k closest
def k_closest_brute(points, k):
    # sort by distance squared (no need for sqrt — order is same)
    points.sort(key=lambda p: p[0]**2 + p[1]**2)
    return points[:k]`

const q3Opt = `import heapq

def k_closest(points, k):
    # MAX-heap of size k: store (-distance, point) so Python's min-heap acts as max
    heap = []

    for x, y in points:
        dist_sq = x*x + y*y
        heapq.heappush(heap, (-dist_sq, x, y))  # negate: smallest dist = largest neg
        if len(heap) > k:
            heapq.heappop(heap)      # pop the FARTHEST point (largest dist = least neg)

    return [[x, y] for _, x, y in heap]`

// ── Q4: Sort Characters by Frequency ──────────────────────────────────────
const q4Brute = `from collections import Counter

# Brute: count, sort by frequency desc, rebuild string
def frequency_sort_brute(s):
    counts = Counter(s)
    # sort characters by frequency descending
    chars = sorted(counts.keys(), key=lambda c: -counts[c])
    return ''.join(c * counts[c] for c in chars)`

const q4Opt = `import heapq
from collections import Counter

def frequency_sort(s):
    counts = Counter(s)              # count each character's frequency
    # max-heap: store (-freq, char) so highest frequency pops first
    heap = [(-freq, ch) for ch, freq in counts.items()]
    heapq.heapify(heap)              # O(n) build heap

    result = []
    while heap:
        freq, ch = heapq.heappop(heap)   # most frequent character
        result.append(ch * (-freq))      # append it -freq times (freq is negative)

    return ''.join(result)`

// ── Q5: Kth Smallest in Sorted Matrix ─────────────────────────────────────
const q5Brute = `# Brute: flatten the matrix, sort, return kth element
def kth_smallest_brute(matrix, k):
    flat = [val for row in matrix for val in row]  # flatten
    flat.sort()                      # sort all n*n elements
    return flat[k - 1]               # kth smallest (1-indexed)`

const q5Opt = `import heapq

def kth_smallest(matrix, k):
    n = len(matrix)
    # min-heap: (value, row, col) — start with the first element of each row
    heap = [(matrix[i][0], i, 0) for i in range(n)]
    heapq.heapify(heap)              # O(n) build

    val = 0
    for _ in range(k):
        val, row, col = heapq.heappop(heap)   # pop the current minimum
        if col + 1 < n:
            # push the next element in the same row
            heapq.heappush(heap, (matrix[row][col + 1], row, col + 1))

    return val                       # after k pops, val is the kth smallest`

// ── PRACTICE answers ───────────────────────────────────────────────────────
const pq1Code = `import heapq

# Find K Pairs with Smallest Sums — merge k sorted lists with a heap
def k_smallest_pairs(nums1, nums2, k):
    if not nums1 or not nums2:
        return []
    heap = []
    result = []
    # seed the heap with (nums1[i] + nums2[0], i, 0) for all i in nums1
    # (only first k elements of nums1 matter since it's sorted)
    for i in range(min(k, len(nums1))):
        heapq.heappush(heap, (nums1[i] + nums2[0], i, 0))

    while heap and len(result) < k:
        total, i, j = heapq.heappop(heap)
        result.append([nums1[i], nums2[j]])
        if j + 1 < len(nums2):
            # push the pair with the same nums1[i] but next nums2 element
            heapq.heappush(heap, (nums1[i] + nums2[j + 1], i, j + 1))

    return result`

const pq2Code = `import heapq
from collections import Counter

# Reorganize String — max-heap by frequency, interleave characters
def reorganize_string(s):
    counts = Counter(s)
    max_heap = [(-cnt, ch) for ch, cnt in counts.items()]
    heapq.heapify(max_heap)

    result = []
    prev_cnt, prev_ch = 0, ''        # hold the previously placed char on cooldown

    while max_heap or prev_cnt < 0:
        if not max_heap:
            return ""                 # can't place — two of same char would be adjacent
        cnt, ch = heapq.heappop(max_heap)
        result.append(ch)
        if prev_cnt < 0:             # previous char still has remaining uses
            heapq.heappush(max_heap, (prev_cnt, prev_ch))
        prev_cnt = cnt + 1           # decrement count (counts are negative)
        prev_ch = ch

    return "".join(result)`

const pq3Code = `import heapq
from collections import Counter
import math

# Task Scheduler — greedy: always run the most frequent available task
def least_interval(tasks, n):
    counts = Counter(tasks)
    max_heap = [-c for c in counts.values()]
    heapq.heapify(max_heap)

    time = 0
    cooldown = []                    # (available_at_time, neg_count)

    while max_heap or cooldown:
        time += 1
        if max_heap:
            cnt = heapq.heappop(max_heap) + 1   # run one (+1 because count is negative)
            if cnt < 0:                          # task still has remaining instances
                cooldown.append((time + n, cnt))
        # release tasks whose cooldown has expired
        if cooldown and cooldown[0][0] == time:
            _, cnt = cooldown.pop(0)
            heapq.heappush(max_heap, cnt)

    return time`

const pq4Code = `from collections import Counter

# Frequency Sort — same idea as Taught Q4, sort characters by frequency desc
def frequency_sort(s):
    counts = Counter(s)
    # Python's sorted with a key — sort by frequency descending
    chars = sorted(counts.keys(), key=lambda c: -counts[c])
    return ''.join(c * counts[c] for c in chars)`

const pq5Code = `import heapq
from collections import Counter

# Top K Frequent Words — heap of (freq, word), break ties alphabetically
def top_k_frequent_words(words, k):
    counts = Counter(words)
    # store (-freq, word): min-heap pops least frequent first
    # negative freq + natural word ordering gives us: highest freq first,
    # alphabetically first for ties
    heap = [(-freq, word) for word, freq in counts.items()]
    heapq.heapify(heap)

    result = []
    for _ in range(k):
        _, word = heapq.heappop(heap)  # pop the most frequent (or alphabetically first tie)
        result.append(word)

    return result`

export default function TopKElementsContent() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>

      <Sub title="What is the Top K Elements pattern?">
        <p style={{ lineHeight: 1.7 }}>
          Imagine you run a streaming music app and need to show the top 10 most-played
          songs at any moment — out of millions of songs. You can't sort a million songs
          every second. Instead you keep a running list of only 10 songs, and whenever
          a new candidate beats the worst song in your list, that loser gets replaced.
          That's the Top K pattern: a <strong>heap of size k</strong> that always holds
          the best k elements seen so far.
        </p>
        <Callout type="tip">
          <strong>Trigger phrases:</strong> "top k", "kth largest/smallest", "k most frequent",
          "k closest", "k pairs with smallest sum". Whenever k is much smaller than n,
          a heap beats sorting.
        </Callout>
      </Sub>

      <Sub title="How it works — step-by-step walkthrough">
        <CodeBlock code={TOPK_VISUAL} lang="text" />
      </Sub>

      <Sub title="Three strategies compared">
        <CodeBlock code={TOPK_STRATEGIES} lang="text" />
        <Callout type="info">
          For interviews: if the problem says "find kth largest" or "top k", immediately
          think min-heap of size k. If the problem says "sort by frequency", think
          max-heap (negate counts). If n is small, just sort — simpler code.
        </Callout>
      </Sub>

      <Sub title="Taught Questions">

        <QuestionCard
          num={1}
          title="Kth Largest Element in an Array"
          difficulty="Medium"
          problem={`Find the kth largest element in an unsorted array (not kth distinct element).

Example: nums=[3,2,1,5,6,4], k=2 → 5`}
          brute={<>
            <BigOBadge time="O(n log n)" space="O(1)" />
            <CodeBlock code={q1Brute} lang="python" />
            <Callout type="warn">Sorting all n elements when you only need 1 is wasteful if k is small.</Callout>
          </>}
          optimized={<>
            <BigOBadge time="O(n log k)" space="O(k)" />
            <CodeBlock code={q1Opt} lang="python" />
            <Callout type="tip">
              <strong>Aha moment:</strong> A min-heap of size k keeps the k largest seen so
              far. The <em>top</em> of the min-heap is the smallest of those k — which is
              exactly the kth largest overall. Every new element that beats that minimum
              replaces it.
            </Callout>
            <Callout type="danger">
              <strong>Common mistake:</strong> Using a max-heap and popping k times. That
              works (O(n + k log n)) but is slower and more code than a min-heap of size k.
            </Callout>
          </>}
          answer="Min-heap of size k. For each num: push it, then pop if heap > k. Final heap[0] = kth largest."
        />

        <QuestionCard
          num={2}
          title="Top K Frequent Elements"
          difficulty="Medium"
          problem={`Given an integer array, return the k most frequent elements. Answer can be in any order.

Example: nums=[1,1,1,2,2,3], k=2 → [1,2]`}
          brute={<>
            <BigOBadge time="O(n log n)" space="O(n)" />
            <CodeBlock code={q2Brute} lang="python" />
          </>}
          optimized={<>
            <BigOBadge time="O(n log k)" space="O(n)" />
            <CodeBlock code={q2Opt} lang="python" />
            <Callout type="tip">
              <strong>Aha moment:</strong> Push <em>frequency</em> as the heap key, not the
              value itself. A min-heap of size k keyed by frequency keeps the k most-frequent
              elements — popping removes the least frequent, just like popping the smallest
              value in the number case.
            </Callout>
            <Callout type="danger">
              <strong>Common mistake:</strong> Pushing <code>(num, freq)</code> instead of
              <code>(freq, num)</code>. Python heaps compare tuples element by element —
              the first element must be your priority key.
            </Callout>
          </>}
          answer="Count frequencies. Min-heap of (freq, num) of size k. When heap > k, pop the least frequent. Remaining elements are the top k frequent."
        />

        <QuestionCard
          num={3}
          title="K Closest Points to Origin"
          difficulty="Medium"
          problem={`Return the k closest points to the origin (0,0). Distance = sqrt(x²+y²). Answer can be in any order.

Example: points=[[1,3],[-2,2]], k=1 → [[-2,2]]`}
          brute={<>
            <BigOBadge time="O(n log n)" space="O(1)" />
            <CodeBlock code={q3Brute} lang="python" />
          </>}
          optimized={<>
            <BigOBadge time="O(n log k)" space="O(k)" />
            <CodeBlock code={q3Opt} lang="python" />
            <Callout type="tip">
              <strong>Aha moment:</strong> We want the k <em>smallest</em> distances, so we
              keep a <em>max</em>-heap of size k. When a new point's distance is smaller than
              the farthest point in our heap, it replaces that farthest point. Simulate max-heap
              with Python by negating distances.
            </Callout>
            <Callout type="danger">
              <strong>Common mistake:</strong> Computing <code>sqrt(x²+y²)</code> when
              <code>x²+y²</code> alone preserves the ordering. Skip the sqrt — it's slower
              and identical for comparison purposes.
            </Callout>
          </>}
          answer="Max-heap of size k storing (-dist², x, y). When heap > k, pop the farthest. Remaining k elements are the closest points."
        />

        <QuestionCard
          num={4}
          title="Sort Characters by Frequency"
          difficulty="Medium"
          problem={`Given a string, sort it so characters with higher frequencies come first. If two characters have the same frequency, order doesn't matter.

Example: "tree" → "eert" or "eetr"
Example: "cccaaa" → "cccaaa" or "aaaccc"`}
          brute={<>
            <BigOBadge time="O(n log n)" space="O(n)" />
            <CodeBlock code={q4Brute} lang="python" />
          </>}
          optimized={<>
            <BigOBadge time="O(n log d)" space="O(d)" />
            <CodeBlock code={q4Opt} lang="python" />
            <Callout type="tip">
              <strong>Aha moment:</strong> This is a max-heap problem: keep popping the
              most frequent character and appending it <em>frequency</em> times. Unlike top-k
              where you stop at k elements, here you drain the entire heap to build the
              full output string.
            </Callout>
            <Callout type="danger">
              <strong>Common mistake:</strong> Appending the character once instead of
              <code>freq</code> times. You need to output every occurrence of that character
              consecutively before moving to the next.
            </Callout>
          </>}
          answer="Count frequencies. Max-heap of (-freq, char). Pop each char, append it freq times to result. Drain the entire heap."
        />

        <QuestionCard
          num={5}
          title="Kth Smallest Element in a Sorted Matrix"
          difficulty="Medium"
          problem={`Given an n×n matrix where each row and column is sorted ascending, find the kth smallest element.

Example: matrix=[[1,5,9],[10,11,13],[12,13,15]], k=8 → 13`}
          brute={<>
            <BigOBadge time="O(n² log n²)" space="O(n²)" />
            <CodeBlock code={q5Brute} lang="python" />
          </>}
          optimized={<>
            <BigOBadge time="O(k log n)" space="O(n)" />
            <CodeBlock code={q5Opt} lang="python" />
            <Callout type="tip">
              <strong>Aha moment:</strong> Think of each row as a sorted list. Initialize the
              heap with the first element of each row. Each pop gives you the globally
              smallest remaining element — then push the next element from the same row.
              After k pops you have the kth smallest.
            </Callout>
            <Callout type="danger">
              <strong>Common mistake:</strong> Initializing the heap with the entire first
              row and column. You only need the first element of each row — adding more
              upfront creates duplicates.
            </Callout>
          </>}
          answer="Min-heap seeded with (matrix[i][0], i, 0) for each row. Pop k times: each pop gives the next smallest, then push the next element in that row."
        />

      </Sub>

      <Sub title="Practice Questions">
        <Callout type="info">These extend the heap pattern in different directions. Ask yourself: am I tracking minimums or maximums? What's my heap key?</Callout>

        <QuestionCard
          num={6}
          title="Find K Pairs with Smallest Sums"
          difficulty="Medium"
          practice
          problem={`Given two sorted arrays, find the k pairs (one from each array) with the smallest sums.

Example: nums1=[1,7,11], nums2=[2,4,6], k=3 → [[1,2],[1,4],[1,6]]`}
          hints={[
            "The pair with the smallest sum starts at (nums1[0], nums2[0]). After picking that pair, the next candidates are (nums1[0], nums2[1]) and (nums1[1], nums2[0]).",
            "Seed a min-heap with (nums1[i]+nums2[0], i, 0) for each i. After popping (i,j), push (i, j+1).",
            "Only seed the first min(k, len(nums1)) entries — more than k entries from nums1 can never appear in the top k pairs.",
          ]}
          answer="Min-heap of (sum, i, j). Seed with (nums1[i]+nums2[0], i, 0). Each pop: add pair to result, push (i, j+1). Repeat k times."
          answerCode={pq1Code}
        />

        <QuestionCard
          num={7}
          title="Reorganize String"
          difficulty="Medium"
          practice
          problem={`Rearrange a string so no two adjacent characters are the same. Return the result, or empty string if impossible.

Example: "aab" → "aba"
Example: "aaab" → ""`}
          hints={[
            "Greedy: always place the most frequent character that wasn't just placed.",
            "Max-heap of (-freq, char). Place top character, hold the previous one on cooldown for one step, then reinsert it.",
            "If the heap is empty but you still have a held character to reinsert, return '' (impossible).",
          ]}
          answer="Max-heap of (-freq, char). Each step: pop most frequent, append it, push back the previous character (now off cooldown). If heap empty with held char remaining, impossible."
          answerCode={pq2Code}
        />

        <QuestionCard
          num={8}
          title="Task Scheduler"
          difficulty="Medium"
          practice
          problem={`Given tasks and a cooldown n (same task can't repeat within n steps), return minimum time to finish all tasks. CPU may idle.

Example: tasks=['A','A','A','B','B','B'], n=2 → 8`}
          hints={[
            "Greedy: always run the most frequent task that isn't on cooldown.",
            "Max-heap of task counts. Each time unit: pop most frequent, run it, put it in a cooldown queue with (available_at, remaining_count).",
            "If heap is empty but cooldown isn't: the CPU idles — still increment time. Drain cooldown when its time arrives.",
          ]}
          answer="Max-heap of counts. Each tick: pop most frequent (if available), run it, add to cooldown. Count idle ticks. Release cooldown entries back to heap when their time comes."
          answerCode={pq3Code}
        />

        <QuestionCard
          num={9}
          title="Frequency Sort"
          difficulty="Medium"
          practice
          problem={`Sort an array so elements with lower frequency come first. If two values have the same frequency, sort them with larger values first.

Example: [1,1,2,2,2,3] → [3,1,1,2,2,2]`}
          hints={[
            "Count frequencies first. Then sort using a custom key.",
            "Key: sort by (frequency ascending, value descending) — so rarer elements come first, and for ties larger values come first.",
            "Python's sorted is stable and accepts a tuple key: key=lambda x: (freq[x], -x).",
          ]}
          answer="Count frequencies. sorted(nums, key=lambda x: (freq[x], -x)) — ascending frequency, descending value for ties."
          answerCode={pq4Code}
        />

        <QuestionCard
          num={10}
          title="Top K Frequent Words"
          difficulty="Medium"
          practice
          problem={`Return the k most frequent words, sorted by frequency (highest first). Break frequency ties alphabetically.

Example: words=["i","love","leetcode","i","love","coding"], k=2 → ["i","love"]`}
          hints={[
            "Count word frequencies. Build a min-heap of (-freq, word) of size... actually just heapify all and pop k times.",
            "Storing (-freq, word) means Python's heap naturally breaks ties alphabetically for the word field.",
            "Pop k times from the heap — each pop gives the next most frequent (alphabetically first for ties).",
          ]}
          answer="Count frequencies. Min-heap of (-freq, word) — heapify all words. Pop k times: each pop is the next most frequent word (alphabetical tie-breaking is automatic)."
          answerCode={pq5Code}
        />
      </Sub>

    </div>
  )
}
