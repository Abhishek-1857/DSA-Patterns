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

const HEAP_ANATOMY = `
A HEAP is a tree that obeys one rule:

MAX-HEAP: every parent is >= its children
          (biggest value is always at the top)

         9
        / \\
       7   8
      / \\ / \\
     3  6 4  5

MIN-HEAP: every parent is <= its children
          (smallest value is always at the top)

         1
        / \\
       3   2
      / \\ / \\
     8  5 4  6

push/pop always take O(log n) — heap fixes itself
peek at top is always O(1)

Python: heapq is a MIN-HEAP by default
        For MAX-HEAP: store negatives (-9, -7, -8...)
`

const TWO_HEAPS_VISUAL = `
TWO HEAPS for streaming median:

Running numbers: [5, 2, 8, 1, 9, 4]

After each insertion the MEDIAN is easy to find:

  small (max-heap)    large (min-heap)   median
  stores lower half   stores upper half
  ──────────────────────────────────────────────
  [5]                 []                 5
  [2]                 [5]                (2+5)/2 = 3.5
  [2]                 [5, 8]      → rebalance
  [2, 5]              [8]                (5+8)/2... wait:
                                         after rebal: small=[2,5] large=[8]
                                         median = 5 (small is larger by 1)
  [1, 2, 5]           [8]         → rebalance
  [1, 2]              [5, 8]             (2+5)/2 = 3.5
  [1, 2, 5]           [8, 9]      → rebalance
  [1, 2, 5]           [8, 9]             5 (small is larger by 1)
  [1, 2, 4, 5]        [8, 9]      → rebalance
  [1, 2, 4]           [5, 8, 9]          (4+5)/2 = 4.5

RULE: small.top <= large.top  (partition point)
      |len(small) - len(large)| <= 1 (balanced sizes)
      median = small.top if odd count, else avg of both tops
`

// ── Q1: Median of a Number Stream ─────────────────────────────────────────
const q1Brute = `# Brute: keep a sorted list, insert in O(n), read middle in O(1)
import bisect

class MedianFinderBrute:
    def __init__(self):
        self.data = []

    def add_num(self, num):
        bisect.insort(self.data, num)   # O(n) insert to keep sorted

    def find_median(self):
        n = len(self.data)
        if n % 2 == 1:
            return self.data[n // 2]    # middle element
        return (self.data[n//2 - 1] + self.data[n//2]) / 2`

const q1Opt = `import heapq

class MedianFinder:
    def __init__(self):
        # small: max-heap stores lower half (negate values for max-heap in Python)
        self.small = []
        # large: min-heap stores upper half
        self.large = []

    def add_num(self, num):
        # step 1: push to small (max-heap, so negate)
        heapq.heappush(self.small, -num)
        # step 2: ensure everything in small <= everything in large
        if self.large and (-self.small[0]) > self.large[0]:
            # top of small is bigger than top of large → move it over
            heapq.heappush(self.large, -heapq.heappop(self.small))
        # step 3: rebalance sizes (small can be at most 1 bigger)
        if len(self.small) > len(self.large) + 1:
            heapq.heappush(self.large, -heapq.heappop(self.small))
        elif len(self.large) > len(self.small):
            heapq.heappush(self.small, -heapq.heappop(self.large))

    def find_median(self):
        if len(self.small) > len(self.large):
            return -self.small[0]        # odd count: top of small is median
        return (-self.small[0] + self.large[0]) / 2  # even: average both tops`

// ── Q2: Sliding Window Median ─────────────────────────────────────────────
const q2Brute = `# Brute: sort the window each time — O(n * k log k)
def median_sliding_window_brute(nums, k):
    result = []
    for i in range(len(nums) - k + 1):
        window = sorted(nums[i:i+k])         # sort each window
        mid = k // 2
        if k % 2 == 1:
            result.append(float(window[mid]))
        else:
            result.append((window[mid-1] + window[mid]) / 2)
    return result`

const q2Opt = `import heapq

def median_sliding_window(nums, k):
    small = []   # max-heap (lower half, negated)
    large = []   # min-heap (upper half)
    result = []

    def add(num):
        # same insertion logic as streaming median
        heapq.heappush(small, -num)
        if large and -small[0] > large[0]:
            heapq.heappush(large, -heapq.heappop(small))
        if len(small) > len(large) + 1:
            heapq.heappush(large, -heapq.heappop(small))
        elif len(large) > len(small):
            heapq.heappush(small, -heapq.heappop(large))

    def remove(num):
        # lazy deletion: mark the number as "to be removed"
        # heapq doesn't support arbitrary remove, so we skip stale tops later
        if num <= -small[0]:
            small[small.index(-num)] = small[0]  # push to front then pop
            heapq.heapreplace(small, small[-1])
            small.pop()
            heapq.heapify(small)                 # O(k) rebuild — acceptable for sliding
        else:
            large[large.index(num)] = large[0]
            heapq.heapreplace(large, large[-1])
            large.pop()
            heapq.heapify(large)

    def get_median():
        if len(small) > len(large):
            return float(-small[0])
        return (-small[0] + large[0]) / 2

    for i, num in enumerate(nums):
        add(num)
        if i >= k - 1:                   # window is full
            result.append(get_median())
            remove(nums[i - k + 1])      # slide: remove outgoing element
    return result`

// ── Q3: Maximize Capital (IPO) ────────────────────────────────────────────
const q3Brute = `# Brute: each round, scan all affordable projects, pick max profit
def find_maximized_capital_brute(k, w, profits, capital):
    projects = list(zip(capital, profits))   # pair each project
    for _ in range(k):
        best = -1
        for cap, prof in projects:
            if cap <= w:                     # affordable?
                best = max(best, prof)
        if best == -1:
            break                            # no affordable project
        # find and remove that project
        for i, (cap, prof) in enumerate(projects):
            if cap <= w and prof == best:
                projects.pop(i)
                break
        w += best                            # add profit to capital
    return w`

const q3Opt = `import heapq

def find_maximized_capital(k, w, profits, capital):
    # min-heap of (capital_required, profit) — sorted by capital needed
    available = sorted(zip(capital, profits))  # cheapest to unlock first
    affordable = []                 # max-heap of profits we can currently afford
    idx = 0                         # pointer into sorted available list

    for _ in range(k):
        # unlock all projects we can now afford (w >= their capital requirement)
        while idx < len(available) and available[idx][0] <= w:
            cap, prof = available[idx]
            heapq.heappush(affordable, -prof)  # negate for max-heap
            idx += 1
        if not affordable:
            break                   # no affordable projects left
        # pick the most profitable affordable project
        w += -heapq.heappop(affordable)   # un-negate when popping
    return w`

// ── Q4: Next Interval ─────────────────────────────────────────────────────
const q4Brute = `# Brute: for each interval, scan all others to find closest start >= its end
def find_next_interval_brute(intervals):
    result = []
    for i, (start_i, end_i) in enumerate(intervals):
        best_idx = -1
        best_start = float('inf')
        for j, (start_j, _) in enumerate(intervals):
            if start_j >= end_i and start_j < best_start:
                best_start = start_j
                best_idx = j
        result.append(best_idx)
    return result`

const q4Opt = `import heapq

def find_next_interval(intervals):
    n = len(intervals)
    result = [-1] * n
    # max-heap of (start, index) — we want the LARGEST start <= end
    max_start = [(-intervals[i][0], i) for i in range(n)]
    heapq.heapify(max_start)
    # max-heap of (end, index) — process intervals by largest end first
    max_end = [(-intervals[i][1], i) for i in range(n)]
    heapq.heapify(max_end)

    for _ in range(n):
        end_val, end_idx = heapq.heappop(max_end)
        end_val = -end_val              # un-negate
        # pop starts that are too small (start < end)
        # we need smallest start >= end — but max_start gives largest first
        # instead: collect all starts >= end, take the minimum of those
        temp = []
        while max_start and -max_start[0][0] >= end_val:
            temp.append(heapq.heappop(max_start))
        if temp:
            # temp is sorted descending by start; min start is last element
            temp.sort()                 # sort ascending by negated start
            result[end_idx] = temp[0][1]  # smallest start >= end
        for item in temp:
            heapq.heappush(max_start, item)  # push back unused starts
    return result`

// ── Q5: Meeting Rooms III ─────────────────────────────────────────────────
const q5Brute = `# Brute: simulate each meeting, assign to first available room
def most_booked_brute(n, meetings):
    meetings.sort()
    rooms = [0] * n          # rooms[i] = time room i becomes free
    count = [0] * n          # how many meetings room i has held
    for start, end in meetings:
        # find first available room
        available = [(rooms[i], i) for i in range(n) if rooms[i] <= start]
        if available:
            _, room = min(available)   # earliest-free available room
        else:
            # all busy: wait for earliest-ending meeting
            end_time, room = min((rooms[i], i) for i in range(n))
            end = end_time + (end - start)   # delay the meeting
        rooms[room] = end
        count[room] += 1
    return count.index(max(count))`

const q5Opt = `import heapq

def most_booked(n, meetings):
    meetings.sort()                  # process meetings in start-time order
    free = list(range(n))            # min-heap of available room indices
    heapq.heapify(free)
    busy = []                        # min-heap of (end_time, room_index)
    count = [0] * n                  # meeting count per room

    for start, end in meetings:
        # free up rooms whose meeting has ended by 'start'
        while busy and busy[0][0] <= start:
            end_time, room = heapq.heappop(busy)
            heapq.heappush(free, room)   # room is available again
        if free:
            room = heapq.heappop(free)   # lowest-indexed available room
            heapq.heappush(busy, (end, room))
        else:
            # all rooms busy: take the one that finishes soonest
            earliest_end, room = heapq.heappop(busy)
            new_end = earliest_end + (end - start)   # meeting is delayed
            heapq.heappush(busy, (new_end, room))
        count[room] += 1
    return count.index(max(count))`

// ── PRACTICE answers ──────────────────────────────────────────────────────
const pq1Code = `import heapq

# Kth Largest Element in a Stream
class KthLargest:
    def __init__(self, k, nums):
        self.k = k
        self.heap = []              # min-heap of size k (top = kth largest)
        for num in nums:
            self.add(num)

    def add(self, val):
        heapq.heappush(self.heap, val)
        if len(self.heap) > self.k:
            heapq.heappop(self.heap)   # keep only k largest
        return self.heap[0]            # smallest of the k largest = kth largest`

const pq2Code = `import heapq

# Find Median from Data Stream — same as Taught Q1
class MedianFinder:
    def __init__(self):
        self.small = []    # max-heap (lower half, negated)
        self.large = []    # min-heap (upper half)

    def addNum(self, num):
        heapq.heappush(self.small, -num)
        if self.large and -self.small[0] > self.large[0]:
            heapq.heappush(self.large, -heapq.heappop(self.small))
        if len(self.small) > len(self.large) + 1:
            heapq.heappush(self.large, -heapq.heappop(self.small))
        elif len(self.large) > len(self.small):
            heapq.heappush(self.small, -heapq.heappop(self.large))

    def findMedian(self):
        if len(self.small) > len(self.large):
            return float(-self.small[0])
        return (-self.small[0] + self.large[0]) / 2`

const pq3Code = `import heapq
from collections import Counter

# Task Scheduler — greedy: always schedule the most frequent remaining task
def least_interval(tasks, n):
    counts = Counter(tasks)
    max_heap = [-c for c in counts.values()]   # max-heap (negate for Python)
    heapq.heapify(max_heap)
    time = 0
    cooldown = []                              # (available_at_time, count)
    while max_heap or cooldown:
        time += 1
        if max_heap:
            count = heapq.heappop(max_heap) + 1  # run one of the top task (count -1, +1 because negated)
            if count < 0:                         # still has remaining instances
                cooldown.append((time + n, count))
        # check if any cooled-down task is ready
        if cooldown and cooldown[0][0] == time:
            _, count = cooldown.pop(0)
            heapq.heappush(max_heap, count)
    return time`

const pq4Code = `import heapq
from collections import Counter

# Reorganize String — place most frequent char first, interleave
def reorganize_string(s):
    counts = Counter(s)
    max_heap = [(-cnt, ch) for ch, cnt in counts.items()]
    heapq.heapify(max_heap)
    result = []
    prev_cnt, prev_ch = 0, ''          # track last placed char

    while max_heap or prev_cnt < 0:
        if not max_heap:
            return ""                  # impossible to reorganize
        cnt, ch = heapq.heappop(max_heap)
        result.append(ch)
        if prev_cnt < 0:               # previous char still has remaining uses
            heapq.heappush(max_heap, (prev_cnt, prev_ch))
        prev_cnt = cnt + 1             # decrement count (counts are negative)
        prev_ch = ch

    return "".join(result)`

const pq5Code = `import heapq

# K Closest Points to Origin — min-heap by distance squared
def k_closest(points, k):
    # store (distance_squared, x, y) in a min-heap
    heap = [(x*x + y*y, x, y) for x, y in points]
    heapq.heapify(heap)                # O(n) heapify
    result = []
    for _ in range(k):
        _, x, y = heapq.heappop(heap)  # pop k smallest distances
        result.append([x, y])
    return result`

export default function TwoHeapsContent() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>

      <Sub title="What is a Heap?">
        <CodeBlock code={HEAP_ANATOMY} lang="text" />
        <Callout type="info">
          Think of a heap like a priority queue at a hospital emergency room. The most
          critical patient (highest priority) always gets seen first, no matter the order
          they arrived. In Python, <code>heapq</code> is always a min-heap — the smallest
          value pops first. To get a max-heap, store your values as negatives.
        </Callout>
      </Sub>

      <Sub title="The Two Heaps trick">
        <p style={{ lineHeight: 1.7 }}>
          Imagine splitting a list of numbers into two halves — smaller numbers on the
          left, bigger numbers on the right. If you keep the left half as a max-heap
          (so you can peek at the biggest "small" number instantly) and the right half
          as a min-heap (so you can peek at the smallest "big" number instantly), then
          finding the median is O(1): it's either the top of the left heap, or the
          average of both tops.
        </p>
        <Callout type="tip">
          <strong>Trigger phrases:</strong> "median of stream", "sliding window median",
          "maximize profit with constraints", "schedule tasks", "find interval".
          Two heaps shine when you need to efficiently track the middle or balance
          two competing groups.
        </Callout>
      </Sub>

      <Sub title="How Two Heaps works — ASCII walkthrough">
        <CodeBlock code={TWO_HEAPS_VISUAL} lang="text" />
        <Callout type="tip">
          Two invariants to maintain: (1) every number in <code>small</code> is ≤ every
          number in <code>large</code>. (2) sizes differ by at most 1. Enforce both after
          every insertion.
        </Callout>
      </Sub>

      <Sub title="Taught Questions">

        <QuestionCard
          num={1}
          title="Find the Median of a Number Stream"
          difficulty="Hard"
          problem={`Design a data structure that supports adding integers and returning the median after each addition.

Example: add(1) → 1.0, add(2) → 1.5, add(3) → 2.0`}
          brute={<>
            <BigOBadge time="O(n) add, O(1) median" space="O(n)" />
            <CodeBlock code={q1Brute} lang="python" />
            <Callout type="warn">Sorted insert is O(n) per addition — too slow for large streams.</Callout>
          </>}
          optimized={<>
            <BigOBadge time="O(log n) add, O(1) median" space="O(n)" />
            <CodeBlock code={q1Opt} lang="python" />
            <Callout type="tip">
              <strong>Aha moment:</strong> You don't need everything sorted — you only ever
              need the two middle values. Two heaps give you those in O(1) while maintaining
              the partition in O(log n) per insertion.
            </Callout>
            <Callout type="danger">
              <strong>Common mistake:</strong> Python's heapq is a min-heap. To use it as a
              max-heap, store negatives: push <code>-num</code>, and negate again when you
              read <code>-small[0]</code>.
            </Callout>
          </>}
          answer="small=max-heap (lower half), large=min-heap (upper half). After each insertion: fix ordering (small.top ≤ large.top), then rebalance sizes. Median = small.top or avg of both tops."
        />

        <QuestionCard
          num={2}
          title="Sliding Window Median"
          difficulty="Hard"
          problem={`Given an array and window size k, return the median for each sliding window position.

Example: nums=[1,3,-1,-3,5,3,6,7], k=3 → [1,-1,-1,3,5,6]`}
          brute={<>
            <BigOBadge time="O(n·k log k)" space="O(k)" />
            <CodeBlock code={q2Brute} lang="python" />
          </>}
          optimized={<>
            <BigOBadge time="O(n·k)" space="O(k)" />
            <CodeBlock code={q2Opt} lang="python" />
            <Callout type="tip">
              <strong>Aha moment:</strong> Adding is the same as the streaming median.
              Removing is tricky — heapq has no efficient arbitrary delete, so we
              use "lazy deletion" or a direct heapify rebuild on the k-sized window.
            </Callout>
            <Callout type="danger">
              <strong>Common mistake:</strong> Forgetting to rebalance after removal.
              Deletion can throw off the size balance, which corrupts the median calculation.
            </Callout>
          </>}
          answer="Two-heap streaming median, with an extra remove() operation each time the window slides. Remove by finding the element and rebuilding the heap."
        />

        <QuestionCard
          num={3}
          title="Maximize Capital (IPO)"
          difficulty="Hard"
          problem={`You have initial capital w. Given k projects, each with a profit and required capital, pick at most k projects to maximize your final capital. You must have enough capital to start each project.

Example: k=2, w=0, profits=[1,2,3], capital=[0,1,1] → 4`}
          brute={<>
            <BigOBadge time="O(k·n)" space="O(1)" />
            <CodeBlock code={q3Brute} lang="python" />
          </>}
          optimized={<>
            <BigOBadge time="O(n log n)" space="O(n)" />
            <CodeBlock code={q3Opt} lang="python" />
            <Callout type="tip">
              <strong>Aha moment:</strong> Two separate heaps for two separate concerns:
              a min-heap ordered by capital (to efficiently unlock newly affordable projects)
              and a max-heap ordered by profit (to always pick the best available project).
            </Callout>
            <Callout type="danger">
              <strong>Common mistake:</strong> Unlocking projects one at a time in the main
              loop. Use a <code>while</code> to unlock ALL newly affordable projects at once —
              you want the max profit across all of them.
            </Callout>
          </>}
          answer="Sort projects by capital. Each round: push all newly affordable profits onto a max-heap, pop the best profit, add to w. Repeat k times."
        />

        <QuestionCard
          num={4}
          title="Next Interval"
          difficulty="Hard"
          problem={`Given a list of intervals, for each interval find the index of the smallest interval whose start is >= the current interval's end. Return -1 if none exists.

Example: [[3,4],[2,3],[1,2]] → [−1, 0, 1]`}
          brute={<>
            <BigOBadge time="O(n²)" space="O(1)" />
            <CodeBlock code={q4Brute} lang="python" />
          </>}
          optimized={<>
            <BigOBadge time="O(n log n)" space="O(n)" />
            <CodeBlock code={q4Opt} lang="python" />
            <Callout type="tip">
              <strong>Aha moment:</strong> Two max-heaps — one on end times (to process
              intervals from largest end to smallest) and one on start times (to find
              the smallest start ≥ current end). By processing ends largest-first, you
              can greedily pull from starts.
            </Callout>
            <Callout type="danger">
              <strong>Common mistake:</strong> Confusing "next interval" with "next in
              the array". The answer index refers to position in the original input list,
              not position after sorting.
            </Callout>
          </>}
          answer="Two max-heaps (on starts and ends). Process each interval's end, find the minimum start that's still >= end, record the original index."
        />

        <QuestionCard
          num={5}
          title="Meeting Rooms III"
          difficulty="Hard"
          problem={`You have n meeting rooms (numbered 0 to n-1). Given meetings as [start, end] pairs, assign each meeting to the lowest-numbered available room. If all rooms are busy, delay the meeting until the earliest room frees up. Return the room that held the most meetings.

Example: n=2, meetings=[[0,10],[1,5],[2,7],[3,4]] → 0`}
          brute={<>
            <BigOBadge time="O(m·n)" space="O(n)" />
            <CodeBlock code={q5Brute} lang="python" />
          </>}
          optimized={<>
            <BigOBadge time="O(m log n)" space="O(n)" />
            <CodeBlock code={q5Opt} lang="python" />
            <Callout type="tip">
              <strong>Aha moment:</strong> Two separate heaps: <code>free</code> (min-heap
              of available room indices — lowest index pops first) and <code>busy</code>
              (min-heap of (end_time, room) — earliest finishing room pops first).
              Before each meeting, drain <code>busy</code> of all rooms that finished.
            </Callout>
            <Callout type="danger">
              <strong>Common mistake:</strong> When all rooms are busy and you must delay,
              the new end time is <code>earliest_end + (original_end - original_start)</code>
              — the meeting duration stays the same, only the start is pushed back.
            </Callout>
          </>}
          answer="Sort meetings. free=min-heap of room indices, busy=min-heap of (end_time, room). Each meeting: drain finished rooms from busy into free, assign lowest free or delay to earliest busy room."
        />

      </Sub>

      <Sub title="Practice Questions">
        <Callout type="info">Try each one first — hints are there if you get stuck. Answer reveals with full code after 3 seconds.</Callout>

        <QuestionCard
          num={6}
          title="Kth Largest Element in a Stream"
          difficulty="Easy"
          practice
          problem={`Design a class that finds the kth largest element in a stream of integers.

Example: k=3, initial=[4,5,8,2]. add(3)→4, add(5)→5, add(10)→5, add(9)→8`}
          hints={[
            "Keep a min-heap of exactly k elements. The top of the heap is always the kth largest.",
            "When adding a new number: push it, then if heap size exceeds k, pop the minimum.",
            "The heap top after trimming is the answer.",
          ]}
          answer="Min-heap of size k. Push new element, pop if size > k. Heap top = kth largest."
          answerCode={pq1Code}
        />

        <QuestionCard
          num={7}
          title="Find Median from Data Stream"
          difficulty="Hard"
          practice
          problem={`Implement MedianFinder with addNum(int) and findMedian() methods.

Example: addNum(1), addNum(2), findMedian()→1.5, addNum(3), findMedian()→2.0`}
          hints={[
            "This is exactly Taught Q1 — two heaps partitioning the data at the median.",
            "small = max-heap of lower half (negate values), large = min-heap of upper half.",
            "After each add: fix partition ordering, then rebalance sizes.",
          ]}
          answer="Same as Taught Q1 — small max-heap + large min-heap, maintain ordering and balance invariants."
          answerCode={pq2Code}
        />

        <QuestionCard
          num={8}
          title="Task Scheduler"
          difficulty="Medium"
          practice
          problem={`Given tasks (letters) and a cooldown n, return the minimum time to finish all tasks. Same task must be n units apart.

Example: tasks=['A','A','A','B','B','B'], n=2 → 8`}
          hints={[
            "Greedy: always run the most frequent task that isn't on cooldown.",
            "Max-heap of task counts. Each time unit: pop the top (most frequent), run it, put it in a cooldown queue with (available_at, remaining_count).",
            "If heap is empty but cooldown queue isn't, the CPU idles — still increment time.",
          ]}
          answer="Max-heap of counts. Each tick: run the most frequent available task, put it in cooldown queue. Count idle ticks when heap is empty but cooldown isn't."
          answerCode={pq3Code}
        />

        <QuestionCard
          num={9}
          title="Reorganize String"
          difficulty="Medium"
          practice
          problem={`Rearrange a string so no two adjacent characters are the same. Return the rearranged string or empty string if impossible.

Example: "aab" → "aba", "aaab" → ""`}
          hints={[
            "Greedy: always place the most frequent character that wasn't placed last.",
            "Max-heap of (count, char). After placing a char, hold it aside until the next character is placed, then reinsert.",
            "If the heap is empty but you still have a held character, it's impossible.",
          ]}
          answer="Max-heap of (count, char). Each step: pop most frequent, append to result, push the previous char back if it still has count remaining."
          answerCode={pq4Code}
        />

        <QuestionCard
          num={10}
          title="K Closest Points to Origin"
          difficulty="Medium"
          practice
          problem={`Given a list of points, return the k closest to the origin (0,0). Distance = sqrt(x²+y²).

Example: points=[[1,3],[-2,2]], k=1 → [[-2,2]]`}
          hints={[
            "You don't need the actual distance — distance² preserves ordering and avoids sqrt.",
            "Min-heap of (x²+y², x, y). Heapify once, then pop k times.",
            "Alternatively, use a max-heap of size k and keep only the k smallest seen so far.",
          ]}
          answer="Build a min-heap keyed by x²+y², heapify in O(n), pop k elements."
          answerCode={pq5Code}
        />
      </Sub>

    </div>
  )
}
