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

Rust: BinaryHeap<i32> is a MAX-HEAP by default
      For MIN-HEAP: wrap values with Reverse(x)
      use std::collections::BinaryHeap;
      use std::cmp::Reverse;
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
const q1Brute = `// Brute: keep a sorted vec, insert in O(n), read middle in O(1)
struct MedianFinderBrute {
    data: Vec<i32>,
}

impl MedianFinderBrute {
    fn new() -> Self {
        MedianFinderBrute { data: Vec::new() }
    }

    fn add_num(&mut self, num: i32) {
        // binary search for insertion point, then insert — O(n) due to shift
        let pos = self.data.partition_point(|&x| x <= num);
        self.data.insert(pos, num);  // O(n) insert to keep sorted
    }

    fn find_median(&self) -> f64 {
        let n = self.data.len();
        if n % 2 == 1 {
            self.data[n / 2] as f64   // middle element
        } else {
            (self.data[n / 2 - 1] + self.data[n / 2]) as f64 / 2.0
        }
    }
}`

const q1Opt = `use std::collections::BinaryHeap;
use std::cmp::Reverse;

struct MedianFinder {
    // lower: max-heap stores lower half (BinaryHeap is max-heap by default)
    lower: BinaryHeap<i32>,
    // upper: min-heap stores upper half (Reverse wrapper flips ordering)
    upper: BinaryHeap<Reverse<i32>>,
}

impl MedianFinder {
    fn new() -> Self {
        MedianFinder {
            lower: BinaryHeap::new(),
            upper: BinaryHeap::new(),
        }
    }

    fn add_num(&mut self, num: i32) {
        // step 1: push to lower (max-heap)
        self.lower.push(num);
        // step 2: ensure everything in lower <= everything in upper
        if let Some(&top_lower) = self.lower.peek() {
            if let Some(&Reverse(top_upper)) = self.upper.peek() {
                if top_lower > top_upper {
                    // top of lower is bigger than top of upper → move it over
                    let val = self.lower.pop().unwrap();
                    self.upper.push(Reverse(val));
                }
            } else {
                // upper is empty: move top of lower to upper to bootstrap partition
                let val = self.lower.pop().unwrap();
                self.upper.push(Reverse(val));
            }
        }
        // step 3: rebalance sizes (lower can be at most 1 bigger)
        if self.lower.len() > self.upper.len() + 1 {
            let val = self.lower.pop().unwrap();
            self.upper.push(Reverse(val));
        } else if self.upper.len() > self.lower.len() {
            let Reverse(val) = self.upper.pop().unwrap();
            self.lower.push(val);
        }
    }

    fn find_median(&self) -> f64 {
        if self.lower.len() > self.upper.len() {
            *self.lower.peek().unwrap() as f64   // odd count: top of lower is median
        } else {
            let low = *self.lower.peek().unwrap() as f64;
            let high = self.upper.peek().unwrap().0 as f64;
            (low + high) / 2.0   // even: average both tops
        }
    }
}`

// ── Q2: Sliding Window Median ─────────────────────────────────────────────
const q2Brute = `// Brute: sort the window each time — O(n * k log k)
fn median_sliding_window_brute(nums: &[i32], k: usize) -> Vec<f64> {
    let mut result = Vec::new();
    for i in 0..=(nums.len() - k) {
        let mut window = nums[i..i + k].to_vec();  // copy the window
        window.sort_unstable();                     // sort each window O(k log k)
        let mid = k / 2;
        let median = if k % 2 == 1 {
            window[mid] as f64
        } else {
            (window[mid - 1] + window[mid]) as f64 / 2.0
        };
        result.push(median);
    }
    result
}`

const q2Opt = `use std::collections::BinaryHeap;
use std::cmp::Reverse;

fn median_sliding_window(nums: &[i32], k: usize) -> Vec<f64> {
    let mut lower: BinaryHeap<i32> = BinaryHeap::new();   // max-heap (lower half)
    let mut upper: BinaryHeap<Reverse<i32>> = BinaryHeap::new(); // min-heap (upper half)
    let mut result = Vec::new();

    let add = |num: i32, lower: &mut BinaryHeap<i32>, upper: &mut BinaryHeap<Reverse<i32>>| {
        lower.push(num);
        // fix ordering: lower.top must be <= upper.top
        if let (Some(&lo), Some(&Reverse(hi))) = (lower.peek(), upper.peek()) {
            if lo > hi {
                let val = lower.pop().unwrap();
                upper.push(Reverse(val));
            }
        } else if lower.len() > upper.len() + 1 {
            // bootstrap upper when empty
        }
        // rebalance sizes
        if lower.len() > upper.len() + 1 {
            let val = lower.pop().unwrap();
            upper.push(Reverse(val));
        } else if upper.len() > lower.len() {
            let Reverse(val) = upper.pop().unwrap();
            lower.push(val);
        }
    };

    // lazy removal: rebuild heap after removing element (O(k) — acceptable for window)
    let remove = |num: i32, lower: &mut BinaryHeap<i32>, upper: &mut BinaryHeap<Reverse<i32>>| {
        let lower_top = lower.peek().copied().unwrap_or(i32::MIN);
        if num <= lower_top {
            // remove from lower half: drain, filter, rebuild
            let mut v: Vec<i32> = lower.drain().filter(|&x| x != num).collect();
            // put one copy back if we removed too many (only remove one occurrence)
            *lower = v.into_iter().collect();
        } else {
            let mut v: Vec<i32> = upper.drain().map(|Reverse(x)| x).filter(|&x| x != num).collect();
            *upper = v.into_iter().map(Reverse).collect();
        }
        // rebalance after removal
        if lower.len() > upper.len() + 1 {
            let val = lower.pop().unwrap();
            upper.push(Reverse(val));
        } else if upper.len() > lower.len() {
            let Reverse(val) = upper.pop().unwrap();
            lower.push(val);
        }
    };

    for i in 0..nums.len() {
        add(nums[i], &mut lower, &mut upper);
        if i >= k - 1 {                     // window is full
            let median = if lower.len() > upper.len() {
                *lower.peek().unwrap() as f64
            } else {
                let lo = *lower.peek().unwrap() as f64;
                let hi = upper.peek().unwrap().0 as f64;
                (lo + hi) / 2.0
            };
            result.push(median);
            remove(nums[i + 1 - k], &mut lower, &mut upper); // slide: remove outgoing element
        }
    }
    result
}`

// ── Q3: Maximize Capital (IPO) ────────────────────────────────────────────
const q3Brute = `// Brute: each round, scan all affordable projects, pick max profit
fn find_maximized_capital_brute(k: i32, mut w: i32, profits: &[i32], capital: &[i32]) -> i32 {
    let mut projects: Vec<(i32, i32)> = capital.iter().copied()
        .zip(profits.iter().copied())
        .collect();   // pair (capital_required, profit)

    for _ in 0..k {
        let best = projects.iter()
            .filter(|&&(cap, _)| cap <= w)     // affordable?
            .map(|&(_, prof)| prof)
            .max();
        match best {
            None => break,                     // no affordable project
            Some(b) => {
                // find and remove that project (first match)
                if let Some(pos) = projects.iter().position(|&(cap, prof)| cap <= w && prof == b) {
                    projects.remove(pos);
                }
                w += b;                        // add profit to capital
            }
        }
    }
    w
}`

const q3Opt = `use std::collections::BinaryHeap;

fn find_maximized_capital(k: i32, mut w: i32, profits: &[i32], capital: &[i32]) -> i32 {
    // sort projects by capital required — cheapest to unlock first
    let mut available: Vec<(i32, i32)> = capital.iter().copied()
        .zip(profits.iter().copied())
        .collect();
    available.sort_unstable();   // sorted by capital (ascending)

    let mut affordable: BinaryHeap<i32> = BinaryHeap::new();  // max-heap of profits
    let mut idx = 0;             // pointer into sorted available list

    for _ in 0..k {
        // unlock all projects we can now afford (w >= their capital requirement)
        while idx < available.len() && available[idx].0 <= w {
            affordable.push(available[idx].1);  // push profit onto max-heap
            idx += 1;
        }
        match affordable.pop() {
            None => break,          // no affordable projects left
            Some(best_profit) => {
                // pick the most profitable affordable project
                w += best_profit;
            }
        }
    }
    w
}`

// ── Q4: Next Interval ─────────────────────────────────────────────────────
const q4Brute = `// Brute: for each interval, scan all others to find closest start >= its end
fn find_next_interval_brute(intervals: &[[i32; 2]]) -> Vec<i32> {
    let mut result = Vec::new();
    for i in 0..intervals.len() {
        let end_i = intervals[i][1];
        let mut best_idx: i32 = -1;
        let mut best_start = i32::MAX;
        for j in 0..intervals.len() {
            let start_j = intervals[j][0];
            if start_j >= end_i && start_j < best_start {
                best_start = start_j;
                best_idx = j as i32;
            }
        }
        result.push(best_idx);
    }
    result
}`

const q4Opt = `use std::collections::BinaryHeap;

fn find_next_interval(intervals: &[[i32; 2]]) -> Vec<i32> {
    let n = intervals.len();
    let mut result = vec![-1i32; n];

    // max-heap of (start, original_index) — process starts from largest to smallest
    let mut max_start: BinaryHeap<(i32, usize)> = (0..n)
        .map(|i| (intervals[i][0], i))
        .collect();

    // max-heap of (end, original_index) — process ends from largest to smallest
    let mut max_end: BinaryHeap<(i32, usize)> = (0..n)
        .map(|i| (intervals[i][1], i))
        .collect();

    for _ in 0..n {
        let (end_val, end_idx) = max_end.pop().unwrap();

        // collect all starts >= end_val into a temp buffer
        let mut temp = Vec::new();
        while let Some(&(start_val, _)) = max_start.peek() {
            if start_val >= end_val {
                temp.push(max_start.pop().unwrap());
            } else {
                break;
            }
        }

        if !temp.is_empty() {
            // temp is sorted descending by start; minimum start is the last element
            let &(_, best_idx) = temp.iter().min_by_key(|&&(s, _)| s).unwrap();
            result[end_idx] = best_idx as i32;
        }

        // push back all unused starts
        for item in temp {
            max_start.push(item);
        }
    }
    result
}`

// ── Q5: Meeting Rooms III ─────────────────────────────────────────────────
const q5Brute = `// Brute: simulate each meeting, assign to first available room
fn most_booked_brute(n: usize, mut meetings: Vec<[i64; 2]>) -> usize {
    meetings.sort_unstable();
    let mut rooms = vec![0i64; n];   // rooms[i] = time room i becomes free
    let mut count = vec![0usize; n]; // how many meetings room i has held

    for meeting in &meetings {
        let (start, end) = (meeting[0], meeting[1]);
        // find first available room (free before or at start)
        let available: Vec<(i64, usize)> = (0..n)
            .filter(|&i| rooms[i] <= start)
            .map(|i| (rooms[i], i))
            .collect();

        let room;
        let new_end;
        if !available.is_empty() {
            // earliest-free available room (min by free time, then by index)
            room = available.iter().min_by_key(|&&(t, i)| (t, i)).unwrap().1;
            new_end = end;
        } else {
            // all busy: wait for earliest-ending meeting
            let (earliest_end, r) = (0..n).map(|i| (rooms[i], i)).min().unwrap();
            room = r;
            new_end = earliest_end + (end - start);  // delay the meeting
        }
        rooms[room] = new_end;
        count[room] += 1;
    }
    count.iter().enumerate().max_by_key(|&(_, &c)| c).unwrap().0
}`

const q5Opt = `use std::collections::BinaryHeap;
use std::cmp::Reverse;

fn most_booked(n: usize, mut meetings: Vec<[i64; 2]>) -> usize {
    meetings.sort_unstable();           // process meetings in start-time order

    // min-heap of available room indices (Reverse makes BinaryHeap a min-heap)
    let mut free: BinaryHeap<Reverse<usize>> = (0..n).map(Reverse).collect();
    // min-heap of (end_time, room_index)
    let mut busy: BinaryHeap<Reverse<(i64, usize)>> = BinaryHeap::new();
    let mut count = vec![0usize; n];   // meeting count per room

    for meeting in &meetings {
        let (start, end) = (meeting[0], meeting[1]);

        // free up rooms whose meeting has ended by 'start'
        while let Some(&Reverse((end_time, _))) = busy.peek() {
            if end_time <= start {
                let Reverse((_, room)) = busy.pop().unwrap();
                free.push(Reverse(room));  // room is available again
            } else {
                break;
            }
        }

        let (room, new_end) = if let Some(Reverse(r)) = free.pop() {
            (r, end)                       // lowest-indexed available room
        } else {
            // all rooms busy: take the one that finishes soonest
            let Reverse((earliest_end, r)) = busy.pop().unwrap();
            (r, earliest_end + (end - start))  // meeting is delayed
        };

        busy.push(Reverse((new_end, room)));
        count[room] += 1;
    }

    count.iter().enumerate().max_by_key(|&(_, &c)| c).unwrap().0
}`

// ── PRACTICE answers ──────────────────────────────────────────────────────
const pq1Code = `use std::collections::BinaryHeap;
use std::cmp::Reverse;

// Kth Largest Element in a Stream
struct KthLargest {
    k: usize,
    heap: BinaryHeap<Reverse<i32>>,  // min-heap of size k (top = kth largest)
}

impl KthLargest {
    fn new(k: i32, nums: Vec<i32>) -> Self {
        let mut kl = KthLargest {
            k: k as usize,
            heap: BinaryHeap::new(),
        };
        for num in nums {
            kl.add(num);
        }
        kl
    }

    fn add(&mut self, val: i32) -> i32 {
        self.heap.push(Reverse(val));
        if self.heap.len() > self.k {
            self.heap.pop();           // keep only k largest
        }
        self.heap.peek().unwrap().0   // smallest of the k largest = kth largest
    }
}`

const pq2Code = `use std::collections::BinaryHeap;
use std::cmp::Reverse;

// Find Median from Data Stream — same as Taught Q1
struct MedianFinder {
    lower: BinaryHeap<i32>,           // max-heap (lower half)
    upper: BinaryHeap<Reverse<i32>>,  // min-heap (upper half)
}

impl MedianFinder {
    fn new() -> Self {
        MedianFinder {
            lower: BinaryHeap::new(),
            upper: BinaryHeap::new(),
        }
    }

    fn add_num(&mut self, num: i32) {
        self.lower.push(num);
        // fix ordering: lower.top must be <= upper.top
        if let (Some(&lo), Some(&Reverse(hi))) = (self.lower.peek(), self.upper.peek()) {
            if lo > hi {
                let val = self.lower.pop().unwrap();
                self.upper.push(Reverse(val));
            }
        } else if self.lower.len() > self.upper.len() + 1 {
            let val = self.lower.pop().unwrap();
            self.upper.push(Reverse(val));
        }
        // rebalance sizes
        if self.lower.len() > self.upper.len() + 1 {
            let val = self.lower.pop().unwrap();
            self.upper.push(Reverse(val));
        } else if self.upper.len() > self.lower.len() {
            let Reverse(val) = self.upper.pop().unwrap();
            self.lower.push(val);
        }
    }

    fn find_median(&self) -> f64 {
        if self.lower.len() > self.upper.len() {
            return *self.lower.peek().unwrap() as f64;
        }
        let low = *self.lower.peek().unwrap() as f64;
        let high = self.upper.peek().unwrap().0 as f64;
        (low + high) / 2.0
    }
}`

const pq3Code = `use std::collections::{BinaryHeap, VecDeque};
use std::collections::HashMap;

// Task Scheduler — greedy: always schedule the most frequent remaining task
fn least_interval(tasks: Vec<char>, n: i32) -> i32 {
    let mut counts: HashMap<char, i32> = HashMap::new();
    for t in &tasks {
        *counts.entry(*t).or_insert(0) += 1;
    }

    // max-heap of task counts
    let mut max_heap: BinaryHeap<i32> = counts.values().copied().collect();
    let mut time = 0;
    let mut cooldown: VecDeque<(i32, i32)> = VecDeque::new(); // (available_at, count)

    while !max_heap.is_empty() || !cooldown.is_empty() {
        time += 1;
        if let Some(count) = max_heap.pop() {
            // run one instance of the most frequent task (count decreases by 1)
            if count - 1 > 0 {
                cooldown.push_back((time + n, count - 1)); // still has remaining instances
            }
        }
        // check if any cooled-down task is ready
        if let Some(&(avail_at, _)) = cooldown.front() {
            if avail_at == time {
                let (_, count) = cooldown.pop_front().unwrap();
                max_heap.push(count);
            }
        }
    }
    time
}`

const pq4Code = `use std::collections::BinaryHeap;

// Reorganize String — place most frequent char first, interleave
fn reorganize_string(s: String) -> String {
    let mut counts = [0i32; 26];
    for b in s.bytes() {
        counts[(b - b'a') as usize] += 1;
    }

    // max-heap of (count, char_as_byte)
    let mut max_heap: BinaryHeap<(i32, u8)> = counts.iter().enumerate()
        .filter(|&(_, &c)| c > 0)
        .map(|(i, &c)| (c, b'a' + i as u8))
        .collect();

    let mut result = Vec::new();
    let mut prev: Option<(i32, u8)> = None;  // track last placed char

    while !max_heap.is_empty() || prev.is_some() {
        if max_heap.is_empty() {
            return String::new();  // impossible to reorganize
        }
        let (cnt, ch) = max_heap.pop().unwrap();
        result.push(ch);
        // reinsert the previous char now that a different char was placed
        if let Some((pc, pch)) = prev {
            max_heap.push((pc, pch));
        }
        // decrement count; hold this char back until next iteration
        prev = if cnt - 1 > 0 { Some((cnt - 1, ch)) } else { None };
    }

    String::from_utf8(result).unwrap()
}`

const pq5Code = `use std::collections::BinaryHeap;
use std::cmp::Reverse;

// K Closest Points to Origin — min-heap by distance squared
fn k_closest(points: Vec<Vec<i32>>, k: i32) -> Vec<Vec<i32>> {
    // store (distance_squared, index) in a min-heap — no sqrt needed
    let mut heap: BinaryHeap<Reverse<(i32, usize)>> = points.iter().enumerate()
        .map(|(i, p)| Reverse((p[0] * p[0] + p[1] * p[1], i)))
        .collect();  // O(n) heapify

    let mut result = Vec::new();
    for _ in 0..k {
        let Reverse((_, i)) = heap.pop().unwrap();  // pop k smallest distances
        result.push(points[i].clone());
    }
    result
}`

export default function TwoHeapsContent() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>

      <Sub title="What is a Heap?">
        <CodeBlock code={HEAP_ANATOMY} lang="text" />
        <Callout type="info">
          Think of a heap like a priority queue at a hospital emergency room. The most
          critical patient (highest priority) always gets seen first, no matter the order
          they arrived. In Rust, <code>BinaryHeap</code> is always a max-heap — the largest
          value pops first. To get a min-heap, wrap values with <code>Reverse(x)</code> from{' '}
          <code>std::cmp::Reverse</code>.
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
          Two invariants to maintain: (1) every number in <code>lower</code> is ≤ every
          number in <code>upper</code>. (2) sizes differ by at most 1. Enforce both after
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
            <CodeBlock code={q1Brute} lang="rust" />
            <Callout type="warn">Sorted insert is O(n) per addition — too slow for large streams.</Callout>
          </>}
          optimized={<>
            <BigOBadge time="O(log n) add, O(1) median" space="O(n)" />
            <CodeBlock code={q1Opt} lang="rust" />
            <Callout type="tip">
              <strong>Aha moment:</strong> You don't need everything sorted — you only ever
              need the two middle values. Two heaps give you those in O(1) while maintaining
              the partition in O(log n) per insertion.
            </Callout>
            <Callout type="danger">
              <strong>Common mistake:</strong> Rust's <code>BinaryHeap</code> is a max-heap.
              To use it as a min-heap, wrap values with <code>Reverse(x)</code> and unwrap
              with <code>.0</code> when reading: <code>upper.peek().unwrap().0</code>.
            </Callout>
          </>}
          answer="lower=max-heap (lower half), upper=min-heap (upper half). After each insertion: fix ordering (lower.top ≤ upper.top), then rebalance sizes. Median = lower.top or avg of both tops."
        />

        <QuestionCard
          num={2}
          title="Sliding Window Median"
          difficulty="Hard"
          problem={`Given an array and window size k, return the median for each sliding window position.

Example: nums=[1,3,-1,-3,5,3,6,7], k=3 → [1,-1,-1,3,5,6]`}
          brute={<>
            <BigOBadge time="O(n·k log k)" space="O(k)" />
            <CodeBlock code={q2Brute} lang="rust" />
          </>}
          optimized={<>
            <BigOBadge time="O(n·k)" space="O(k)" />
            <CodeBlock code={q2Opt} lang="rust" />
            <Callout type="tip">
              <strong>Aha moment:</strong> Adding is the same as the streaming median.
              Removing is tricky — <code>BinaryHeap</code> has no efficient arbitrary delete, so we
              use "lazy deletion" or a direct drain-filter-rebuild on the k-sized window.
            </Callout>
            <Callout type="danger">
              <strong>Common mistake:</strong> Forgetting to rebalance after removal.
              Deletion can throw off the size balance, which corrupts the median calculation.
            </Callout>
          </>}
          answer="Two-heap streaming median, with an extra remove() operation each time the window slides. Remove by draining, filtering, and rebuilding the heap."
        />

        <QuestionCard
          num={3}
          title="Maximize Capital (IPO)"
          difficulty="Hard"
          problem={`You have initial capital w. Given k projects, each with a profit and required capital, pick at most k projects to maximize your final capital. You must have enough capital to start each project.

Example: k=2, w=0, profits=[1,2,3], capital=[0,1,1] → 4`}
          brute={<>
            <BigOBadge time="O(k·n)" space="O(1)" />
            <CodeBlock code={q3Brute} lang="rust" />
          </>}
          optimized={<>
            <BigOBadge time="O(n log n)" space="O(n)" />
            <CodeBlock code={q3Opt} lang="rust" />
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
            <CodeBlock code={q4Brute} lang="rust" />
          </>}
          optimized={<>
            <BigOBadge time="O(n log n)" space="O(n)" />
            <CodeBlock code={q4Opt} lang="rust" />
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
            <CodeBlock code={q5Brute} lang="rust" />
          </>}
          optimized={<>
            <BigOBadge time="O(m log n)" space="O(n)" />
            <CodeBlock code={q5Opt} lang="rust" />
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
            "lower = max-heap of lower half, upper = min-heap of upper half (use Reverse).",
            "After each add: fix partition ordering, then rebalance sizes.",
          ]}
          answer="Same as Taught Q1 — lower max-heap + upper min-heap, maintain ordering and balance invariants."
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
            "Min-heap of (x²+y², index). Heapify once via collect(), then pop k times.",
            "Alternatively, use a max-heap of size k and keep only the k smallest seen so far.",
          ]}
          answer="Build a min-heap keyed by x²+y², heapify in O(n), pop k elements."
          answerCode={pq5Code}
        />
      </Sub>

    </div>
  )
}
