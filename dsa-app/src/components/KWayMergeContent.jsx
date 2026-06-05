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

const KWM_VISUAL = `
K-WAY MERGE — merge 3 sorted lists using a min-heap

Lists:  [1, 4, 7]   [2, 5, 8]   [3, 6, 9]

Seed the heap with the FIRST element of each list:
  heap = [(1, list=0, idx=0), (2, list=1, idx=0), (3, list=2, idx=0)]

Step 1: pop (1, list=0, idx=0) → result=[1]
        push next from list 0: (4, list=0, idx=1)
        heap = [(2,1,0), (3,2,0), (4,0,1)]

Step 2: pop (2, list=1, idx=0) → result=[1,2]
        push next from list 1: (5, list=1, idx=1)
        heap = [(3,2,0), (4,0,1), (5,1,1)]

Step 3: pop (3, list=2, idx=0) → result=[1,2,3]
        push next from list 2: (6, list=2, idx=1)
        heap = [(4,0,1), (5,1,1), (6,2,1)]

Step 4: pop (4, list=0, idx=1) → result=[1,2,3,4]
        push next from list 0: (7, list=0, idx=2)
        heap = [(5,1,1), (6,2,1), (7,0,2)]

...continue until all lists exhausted...

Final: [1,2,3,4,5,6,7,8,9]

KEY IDEA: heap always holds the current "frontier" —
          one candidate from each list that hasn't been output yet.
          Pop the global min, then advance that list's pointer.
`

// ── Q1: Merge K Sorted Lists ───────────────────────────────────────────────
const q1Brute = `// Brute: collect all values, sort, rebuild — O(n log n)
fn merge_k_lists_brute(lists: Vec<Vec<i32>>) -> Vec<i32> {
    let mut vals: Vec<i32> = lists.into_iter().flatten().collect();
    vals.sort();
    vals
}`

const q1Opt = `use std::collections::BinaryHeap;
use std::cmp::Reverse;

fn merge_k_lists(lists: Vec<Vec<i32>>) -> Vec<i32> {
    // min-heap stores (value, list_index, element_index)
    let mut heap: BinaryHeap<Reverse<(i32, usize, usize)>> = BinaryHeap::new();

    // seed heap with the head of each non-empty list
    for (i, list) in lists.iter().enumerate() {
        if !list.is_empty() {
            heap.push(Reverse((list[0], i, 0)));  // (value, list_idx, elem_idx)
        }
    }

    let mut result: Vec<i32> = Vec::new();

    while let Some(Reverse((val, list_idx, elem_idx))) = heap.pop() {
        result.push(val);                          // globally smallest current element
        let next_idx = elem_idx + 1;
        if next_idx < lists[list_idx].len() {
            // advance pointer in the same list
            heap.push(Reverse((lists[list_idx][next_idx], list_idx, next_idx)));
        }
    }
    result
}`

// ── Q2: Kth Smallest in M Sorted Lists ────────────────────────────────────
const q2Brute = `// Brute: merge all, sort, return kth — O(N log N) where N = total elements
fn kth_smallest_brute(lists: Vec<Vec<i32>>, k: usize) -> i32 {
    let mut all_vals: Vec<i32> = lists.into_iter().flatten().collect();
    all_vals.sort();
    all_vals[k - 1]
}`

const q2Opt = `use std::collections::BinaryHeap;
use std::cmp::Reverse;

fn kth_smallest(lists: Vec<Vec<i32>>, k: usize) -> i32 {
    // seed with first element of each list: (value, list_index, element_index)
    let mut heap: BinaryHeap<Reverse<(i32, usize, usize)>> = lists
        .iter()
        .enumerate()
        .filter(|(_, lst)| !lst.is_empty())
        .map(|(i, lst)| Reverse((lst[0], i, 0)))
        .collect();

    let mut count = 0;
    while let Some(Reverse((val, list_i, elem_i))) = heap.pop() {
        count += 1;
        if count == k {
            return val;              // this is the kth smallest overall
        }
        // push next element from the same list
        let next_i = elem_i + 1;
        if next_i < lists[list_i].len() {
            heap.push(Reverse((lists[list_i][next_i], list_i, next_i)));
        }
    }
    -1                               // k is larger than total element count
}`

// ── Q3: Find K Pairs with Smallest Sums ───────────────────────────────────
const q3Brute = `// Brute: generate all pairs, sort by sum, take first k
fn k_smallest_pairs_brute(nums1: Vec<i32>, nums2: Vec<i32>, k: usize) -> Vec<[i32; 2]> {
    let mut pairs: Vec<(i32, i32, i32)> = nums1
        .iter()
        .flat_map(|&a| nums2.iter().map(move |&b| (a + b, a, b)))
        .collect();
    pairs.sort();
    pairs.into_iter().take(k).map(|(_, a, b)| [a, b]).collect()
}`

const q3Opt = `use std::collections::BinaryHeap;
use std::cmp::Reverse;

fn k_smallest_pairs(nums1: Vec<i32>, nums2: Vec<i32>, k: usize) -> Vec<[i32; 2]> {
    if nums1.is_empty() || nums2.is_empty() {
        return vec![];
    }

    // Treat each row of a virtual sum-matrix as a sorted list.
    // nums1[i] + nums2[j] is sorted ascending in j for fixed i.
    // Seed heap with (nums1[i] + nums2[0], i, 0) for each i.
    let mut heap: BinaryHeap<Reverse<(i32, usize, usize)>> = BinaryHeap::new();
    for i in 0..k.min(nums1.len()) {   // only need first k rows
        heap.push(Reverse((nums1[i] + nums2[0], i, 0)));
    }

    let mut result: Vec<[i32; 2]> = Vec::new();

    while let Some(Reverse((_, i, j))) = heap.pop() {
        if result.len() == k { break; }
        result.push([nums1[i], nums2[j]]);
        if j + 1 < nums2.len() {
            // advance j in this "row" (same nums1[i], next nums2 element)
            heap.push(Reverse((nums1[i] + nums2[j + 1], i, j + 1)));
        }
    }
    result
}`

// ── Q4: Merge K Sorted Arrays ─────────────────────────────────────────────
const q4Brute = `// Brute: flatten and sort — O(N log N)
fn merge_k_arrays_brute(arrays: Vec<Vec<i32>>) -> Vec<i32> {
    let mut merged: Vec<i32> = arrays.into_iter().flatten().collect();
    merged.sort();
    merged
}`

const q4Opt = `use std::collections::BinaryHeap;
use std::cmp::Reverse;

fn merge_k_arrays(arrays: Vec<Vec<i32>>) -> Vec<i32> {
    let mut result: Vec<i32> = Vec::new();
    // heap entry: (value, array_index, element_index)
    let mut heap: BinaryHeap<Reverse<(i32, usize, usize)>> = arrays
        .iter()
        .enumerate()
        .filter(|(_, arr)| !arr.is_empty())
        .map(|(i, arr)| Reverse((arr[0], i, 0)))
        .collect();

    while let Some(Reverse((val, arr_i, elem_i))) = heap.pop() {
        result.push(val);
        let next_i = elem_i + 1;
        if next_i < arrays[arr_i].len() {
            heap.push(Reverse((arrays[arr_i][next_i], arr_i, next_i)));
        }
    }
    result
}`

// ── Q5: Smallest Range Covering Elements from K Lists ─────────────────────
const q5Brute = `// Brute: generate all possible ranges [a, b] and check coverage — O(N^2 * K)
fn smallest_range_brute(nums: Vec<Vec<i32>>) -> [i32; 2] {
    // collect all values with their list index
    let mut all_vals: Vec<(i32, usize)> = nums
        .iter()
        .enumerate()
        .flat_map(|(i, lst)| lst.iter().map(move |&v| (v, i)))
        .collect();
    all_vals.sort();
    let k = nums.len();
    let mut best = [all_vals[0].0, all_vals[all_vals.len() - 1].0];

    for left in 0..all_vals.len() {
        let mut covered = std::collections::HashSet::new();
        let mut right = left;
        while right < all_vals.len() && covered.len() < k {
            covered.insert(all_vals[right].1);
            right += 1;
        }
        if right > 0 { right -= 1; }
        if covered.len() == k {
            let (lo, hi) = (all_vals[left].0, all_vals[right].0);
            if hi - lo < best[1] - best[0] {
                best = [lo, hi];
            }
        }
    }
    best
}`

const q5Opt = `use std::collections::BinaryHeap;
use std::cmp::Reverse;

fn smallest_range(nums: Vec<Vec<i32>>) -> [i32; 2] {
    // seed heap with the first element of each list, track current max
    let mut heap: BinaryHeap<Reverse<(i32, usize, usize)>> = BinaryHeap::new();
    let mut current_max = i32::MIN;

    for (i, lst) in nums.iter().enumerate() {
        if !lst.is_empty() {
            heap.push(Reverse((lst[0], i, 0)));
            current_max = current_max.max(lst[0]);
        }
    }

    // initial range: min to max of first elements
    let mut best_range = if let Some(&Reverse((min_val, _, _))) = heap.peek() {
        [min_val, current_max]
    } else {
        return [0, 0];
    };

    loop {
        let Reverse((current_min, list_i, elem_i)) = heap.pop().unwrap();
        // current window is [current_min, current_max]
        if current_max - current_min < best_range[1] - best_range[0] {
            best_range = [current_min, current_max];
        }
        // advance the list that had the minimum
        let next_i = elem_i + 1;
        if next_i == nums[list_i].len() {
            break;                   // one list exhausted → can't cover all k lists anymore
        }
        let next_val = nums[list_i][next_i];
        heap.push(Reverse((next_val, list_i, next_i)));
        current_max = current_max.max(next_val);   // update max if needed
    }
    best_range
}`

// ── PRACTICE answers ───────────────────────────────────────────────────────
const pq1Code = `use std::collections::BinaryHeap;
use std::cmp::Reverse;

// Sort an array using K-way merge (external sort simulation)
// Split into chunks of size k, sort each chunk, then k-way merge
fn sort_array_kway(nums: Vec<i32>, k: usize) -> Vec<i32> {
    // split into sorted chunks
    let chunks: Vec<Vec<i32>> = nums
        .chunks(k)
        .map(|c| { let mut v = c.to_vec(); v.sort(); v })
        .collect();

    // k-way merge the sorted chunks
    let mut heap: BinaryHeap<Reverse<(i32, usize, usize)>> = chunks
        .iter()
        .enumerate()
        .map(|(ci, chunk)| Reverse((chunk[0], ci, 0)))
        .collect();

    let mut result: Vec<i32> = Vec::new();
    while let Some(Reverse((val, ci, ei))) = heap.pop() {
        result.push(val);
        let next = ei + 1;
        if next < chunks[ci].len() {
            heap.push(Reverse((chunks[ci][next], ci, next)));
        }
    }
    result
}`

const pq2Code = `use std::collections::BinaryHeap;
use std::cmp::Reverse;

// Kth Smallest Prime Fraction — from array of primes, find kth smallest a/b
fn kth_smallest_prime_fraction(arr: Vec<i32>, k: usize) -> [i32; 2] {
    let n = arr.len();
    // treat each "row i" as fractions arr[i]/arr[j] for j > i, sorted ascending in j descending
    // seed heap: (fraction_numerator*denom_inv, i, j) where j starts at n-1
    // store as ordered float via (numerator, denominator) and compare as f64
    let mut heap: BinaryHeap<Reverse<(ordered_float::NotNan<f64>, usize, usize)>> =
        BinaryHeap::new();

    // simpler: use i64 pair (num, den) and compare; heap stores (num, den, i, j)
    // represent fraction as (num * BIG - den) for integer comparison, or just use f64
    let mut heap2: BinaryHeap<Reverse<(i64, usize, usize)>> = BinaryHeap::new();
    let scale = 1_000_000i64;
    for i in 0..n - 1 {
        // arr[i]/arr[n-1] is the smallest fraction in row i
        let frac = (arr[i] as i64 * scale) / arr[n - 1] as i64;
        heap2.push(Reverse((frac, i, n - 1)));
    }

    let mut count = 0;
    while let Some(Reverse((_, i, j))) = heap2.pop() {
        count += 1;
        if count == k {
            return [arr[i], arr[j]];
        }
        if j - 1 > i {                     // move j left (larger fraction from this row)
            let frac = (arr[i] as i64 * scale) / arr[j - 1] as i64;
            heap2.push(Reverse((frac, i, j - 1)));
        }
    }
    []
}`

const pq3Code = `// Kth Smallest Sum of a Matrix with Sorted Rows
// Each row is sorted. Sum = pick one from each row.
// Use a min-heap over combinations (BFS-style layer by layer)
fn kth_smallest_matrix_sum(mat: Vec<Vec<i32>>, k: usize) -> i32 {
    // start with just the first element of each row combined
    // merge row by row: current = sorted sums using rows[0..i]
    let mut current = vec![mat[0][0]];   // after processing row 0

    for row in mat.iter().skip(1) {
        // combine current sums with elements of this row
        // simpler approach: take all combinations, sort, keep k
        let mut combos: Vec<i32> = current
            .iter()
            .flat_map(|&s| row.iter().map(move |&r| s + r))
            .collect();
        combos.sort();
        combos.truncate(k);
        current = combos;
    }
    current[k - 1]
}`

const pq4Code = `// Merge Sorted Array — two-pointer merge in-place (from the back)
fn merge_sorted_array(nums1: &mut Vec<i32>, m: usize, nums2: &[i32], n: usize) {
    // p1 points to last valid in nums1, p2 to last in nums2, p to last slot overall
    let (mut p1, mut p2, mut p) = (m as i32 - 1, n as i32 - 1, (m + n) as i32 - 1);

    while p1 >= 0 && p2 >= 0 {
        if nums1[p1 as usize] > nums2[p2 as usize] {
            nums1[p as usize] = nums1[p1 as usize];  // larger element goes to the back
            p1 -= 1;
        } else {
            nums1[p as usize] = nums2[p2 as usize];
            p2 -= 1;
        }
        p -= 1;
    }

    // if nums2 still has elements, copy them (nums1 elements are already in place)
    while p2 >= 0 {
        nums1[p as usize] = nums2[p2 as usize];
        p2 -= 1;
        p -= 1;
    }
}`

const pq5Code = `// Employee Free Time — find gaps between merged intervals across all schedules
fn employee_free_time(schedules: Vec<Vec<[i32; 2]>>) -> Vec<[i32; 2]> {
    // flatten all intervals into one list, then k-way merge by start time
    let mut all_intervals: Vec<[i32; 2]> = schedules
        .into_iter()
        .flatten()
        .collect();
    all_intervals.sort_by_key(|iv| iv[0]);   // sort by start time

    let mut result: Vec<[i32; 2]> = Vec::new();
    let mut prev_end = all_intervals[0][1];  // track the end of the last covered interval

    for iv in all_intervals.iter().skip(1) {
        if iv[0] > prev_end {
            // gap found! [prev_end, iv[0]] is free time for everyone
            result.push([prev_end, iv[0]]);
        }
        prev_end = prev_end.max(iv[1]);      // extend coverage if this interval overlaps
    }
    result
}`

export default function KWayMergeContent() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>

      <Sub title="What is K-way Merge?">
        <p style={{ lineHeight: 1.7 }}>
          Imagine you have k friends who each have a sorted playlist, and you want to
          create one master playlist with every song in sorted order. The naive approach
          (throw all songs together and sort) is O(N log N). The smarter approach: always
          pick the currently smallest song across all playlists, then pull in the next song
          from whoever just contributed. A <strong>min-heap</strong> lets you find that
          global minimum in O(log k) — and with N total songs, the whole merge is
          O(N log k). When k is small, that's way faster than O(N log N).
        </p>
        <Callout type="tip">
          <strong>Trigger phrases:</strong> "merge k sorted lists/arrays", "kth smallest
          across multiple sorted lists", "smallest range covering k lists".
          Any time you're merging or finding minimums across multiple sorted sequences → K-way merge.
        </Callout>
      </Sub>

      <Sub title="How K-way Merge works — step by step">
        <CodeBlock code={KWM_VISUAL} lang="text" />
        <Callout type="info">
          Heap entry format: <code>(value, list_index, element_index)</code>.
          The list_index and element_index tell you exactly where to find the next element
          to push when this one gets popped. You never need to store the whole lists in
          the heap — just the current frontier.
        </Callout>
        <Callout type="danger">
          <strong>Rust note:</strong> Rust's <code>BinaryHeap</code> is a max-heap by default.
          Wrap every entry in <code>Reverse(...)</code> to get min-heap behavior.
          Use <code>while let Some(Reverse((val, list_idx, elem_idx))) = heap.pop()</code>
          to destructure cleanly. Tuples compare lexicographically, so <code>list_idx</code>
          acts as a natural tie-breaker when values are equal.
        </Callout>
      </Sub>

      <Sub title="Taught Questions">

        <QuestionCard
          num={1}
          title="Merge K Sorted Lists"
          difficulty="Hard"
          problem={`Given k sorted linked lists, merge them all into one sorted linked list and return it.

Example: [[1→4→5],[1→3→4],[2→6]] → 1→1→2→3→4→4→5→6`}
          brute={<>
            <BigOBadge time="O(N log N)" space="O(N)" />
            <CodeBlock code={q1Brute} lang="rust" />
            <Callout type="warn">Collecting all values and sorting ignores that the lists are already sorted. K-way merge exploits that structure.</Callout>
          </>}
          optimized={<>
            <BigOBadge time="O(N log k)" space="O(k)" />
            <CodeBlock code={q1Opt} lang="rust" />
            <Callout type="tip">
              <strong>Aha moment:</strong> The heap never holds more than k elements at once —
              one "frontier" node per list. Each pop + push is O(log k). With N total nodes
              across all lists, total work is O(N log k). When k is small (say 3 lists),
              that's essentially O(N).
            </Callout>
            <Callout type="danger">
              <strong>Common mistake:</strong> Forgetting <code>Reverse</code> around the heap
              tuple. Without it, Rust's max-heap pops the largest element first, giving you a
              descending merge instead of ascending. Always wrap with <code>Reverse((val, list_idx, elem_idx))</code>.
            </Callout>
          </>}
          answer="Min-heap of Reverse((val, list_idx, elem_idx)). Seed with first element of each list. Each pop: push next element from same list if it exists. Collect results."
        />

        <QuestionCard
          num={2}
          title="Kth Smallest in M Sorted Lists"
          difficulty="Medium"
          problem={`Given M sorted lists of integers, find the kth smallest element overall.

Example: lists=[[2,6,8],[3,6,7],[1,3,4]], k=5 → 4`}
          brute={<>
            <BigOBadge time="O(N log N)" space="O(N)" />
            <CodeBlock code={q2Brute} lang="rust" />
          </>}
          optimized={<>
            <BigOBadge time="O(k log M)" space="O(M)" />
            <CodeBlock code={q2Opt} lang="rust" />
            <Callout type="tip">
              <strong>Aha moment:</strong> You don't need to merge everything — stop as soon
              as you've popped k elements. The kth pop from a K-way merge gives exactly the
              kth smallest overall. Time is O(k log M) — if k is small, this is much
              faster than merging everything.
            </Callout>
            <Callout type="danger">
              <strong>Common mistake:</strong> Counting pops starting at 1 but returning
              at <code>count == k</code> — double check your off-by-one. The first pop
              gives the 1st smallest, so return when count reaches k.
            </Callout>
          </>}
          answer="Min-heap seeded with first element of each list. Pop and count. When count == k, return the popped value. Push next element from same list after each pop."
        />

        <QuestionCard
          num={3}
          title="Find K Pairs with Smallest Sums"
          difficulty="Medium"
          problem={`Given two sorted arrays, return the k pairs (one element from each) with the smallest sums.

Example: nums1=[1,7,11], nums2=[2,4,6], k=3 → [[1,2],[1,4],[1,6]]`}
          brute={<>
            <BigOBadge time="O(m·n log m·n)" space="O(m·n)" />
            <CodeBlock code={q3Brute} lang="rust" />
          </>}
          optimized={<>
            <BigOBadge time="O(k log k)" space="O(k)" />
            <CodeBlock code={q3Opt} lang="rust" />
            <Callout type="tip">
              <strong>Aha moment:</strong> Imagine a 2D matrix where entry (i, j) =
              nums1[i] + nums2[j]. Each row is sorted ascending. This is exactly a
              K-way merge problem — find the k smallest entries across k sorted rows.
              Seed the heap with (sum, i, 0) for each row i, then pop and push (i, j+1).
            </Callout>
            <Callout type="danger">
              <strong>Common mistake:</strong> Seeding all (i, j) combinations. Only seed
              (i, 0) — the first column. As you pop (i, j), you push (i, j+1). This avoids
              visiting entries you'll never need.
            </Callout>
          </>}
          answer="Virtual 2D matrix: row i is [nums1[i]+nums2[0], nums1[i]+nums2[1], ...]. K-way merge seeding with first column, push next column element after each pop."
        />

        <QuestionCard
          num={4}
          title="Merge K Sorted Arrays"
          difficulty="Medium"
          problem={`Given k sorted arrays, merge them into one sorted array.

Example: [[1,3,5],[2,4,6],[0,7,8]] → [0,1,2,3,4,5,6,7,8]`}
          brute={<>
            <BigOBadge time="O(N log N)" space="O(N)" />
            <CodeBlock code={q4Brute} lang="rust" />
          </>}
          optimized={<>
            <BigOBadge time="O(N log k)" space="O(k)" />
            <CodeBlock code={q4Opt} lang="rust" />
            <Callout type="tip">
              <strong>Aha moment:</strong> Identical to Merge K Sorted Lists — the only
              difference is arrays use index access instead of <code>.next</code> pointers.
              The heap tracks <code>(value, array_index, element_index)</code>; advancing
              means incrementing element_index.
            </Callout>
            <Callout type="danger">
              <strong>Common mistake:</strong> Seeding the heap with the entire first array
              of each list. Only seed the FIRST element of each array. You pull in the rest
              one at a time as needed.
            </Callout>
          </>}
          answer="Min-heap of Reverse((val, arr_idx, elem_idx)). Seed with first element of each array. Each pop: append to result, push next element from same array."
        />

        <QuestionCard
          num={5}
          title="Smallest Range Covering Elements from K Lists"
          difficulty="Hard"
          problem={`Given k sorted lists, find the smallest range [a, b] such that at least one element from each list falls within [a, b].

Example: [[4,10,15,24,26],[0,9,12,20],[5,18,22,30]] → [20,24]`}
          brute={<>
            <BigOBadge time="O(N² · k)" space="O(N)" />
            <CodeBlock code={q5Brute} lang="rust" />
          </>}
          optimized={<>
            <BigOBadge time="O(N log k)" space="O(k)" />
            <CodeBlock code={q5Opt} lang="rust" />
            <Callout type="tip">
              <strong>Aha moment:</strong> At any moment, the heap holds exactly one element
              from each list — the current "window". The window is [heap_min, current_max].
              To shrink the window, pop the minimum (it's the only thing we can move) and
              push the next element from that list. Track the max separately because the
              heap only gives you the min.
            </Callout>
            <Callout type="danger">
              <strong>Common mistake:</strong> Trying to shrink from both ends. You can only
              advance the minimum (by moving to the next element in that list). The maximum
              can only grow or stay — never shrink unless the old max's list advances past it.
            </Callout>
          </>}
          answer="Heap holds one element per list. Window = [heap_min, tracked_max]. Each step: update best range, pop min, push next from same list (updating max). Stop when any list is exhausted."
        />

      </Sub>

      <Sub title="Practice Questions">
        <Callout type="info">Each of these is the K-way merge pattern in a different costume. Identify the k sorted sequences and what counts as "advancing" in each one.</Callout>

        <QuestionCard
          num={6}
          title="Sort an Array Using K-way Merge"
          difficulty="Medium"
          practice
          problem={`Sort an array by splitting it into chunks of size k, sorting each chunk, then K-way merging them. This simulates external sort used when data is too large to fit in memory.

Example: nums=[3,1,4,1,5,9,2,6], k=3 → [1,1,2,3,4,5,6,9]`}
          hints={[
            "Split nums into ceil(n/k) chunks of size k. Sort each chunk individually.",
            "Now you have several small sorted arrays. K-way merge them using a min-heap.",
            "Heap entry: (value, chunk_index, element_index). Seed with first element of each chunk.",
          ]}
          answer="Divide into sorted chunks, then K-way merge the sorted chunks with a min-heap."
          answerCode={pq1Code}
        />

        <QuestionCard
          num={7}
          title="Kth Smallest Prime Fraction"
          difficulty="Hard"
          practice
          problem={`Given a sorted array of primes and 1 (e.g. [1,2,3,5]), return the kth smallest fraction formed by arr[i]/arr[j] where i < j.

Example: arr=[1,2,3,5], k=3 → [2,5] (fraction 2/5)`}
          hints={[
            "Think of it as k sorted rows: row i contains [arr[i]/arr[n-1], arr[i]/arr[n-2], ...] sorted ascending.",
            "Seed the heap with the smallest fraction from each row: (arr[i]/arr[n-1], i, n-1).",
            "After popping (i, j), push (i, j-1) — move j left to get the next larger fraction in that row.",
          ]}
          answer="K-way merge on virtual rows of fractions. Seed with largest-denominator fraction per row. Pop k times, advancing j left after each pop."
          answerCode={pq2Code}
        />

        <QuestionCard
          num={8}
          title="Find the Kth Smallest Sum of a Matrix"
          difficulty="Hard"
          practice
          problem={`Given a matrix where each row is sorted, find the kth smallest possible sum by picking exactly one element from each row.

Example: mat=[[1,3,11],[2,4,6]], k=5 → 7`}
          hints={[
            "Build up sums row by row. After processing the first row, you have possible sums from just that row.",
            "For each new row, combine every current sum with every element in the new row. Keep only the k smallest results.",
            "This is essentially a sequence of 'merge two sorted lists and keep k smallest' operations.",
          ]}
          answer="Accumulate sums row by row. At each row, combine previous sums with new row elements and keep only the k smallest. Repeat for all rows."
          answerCode={pq3Code}
        />

        <QuestionCard
          num={9}
          title="Merge Sorted Array"
          difficulty="Easy"
          practice
          problem={`Merge nums2 into nums1 in-place. nums1 has extra space at the end for nums2's elements. m = valid elements in nums1, n = elements in nums2.

Example: nums1=[1,2,3,0,0,0], m=3, nums2=[2,5,6], n=3 → [1,2,2,3,5,6]`}
          hints={[
            "If you merge from the front, you'd overwrite nums1 elements you haven't read yet.",
            "Merge from the BACK instead: compare the last valid elements of nums1 and nums2, place the larger one at the last slot.",
            "Three pointers: p1=m-1, p2=n-1, p=m+n-1. Move backward.",
          ]}
          answer="Three pointers starting at the end. Compare nums1[p1] vs nums2[p2], place the larger at nums1[p]. Move the pointer of whoever was placed. Copy remaining nums2 if any."
          answerCode={pq4Code}
        />

        <QuestionCard
          num={10}
          title="Employee Free Time"
          difficulty="Hard"
          practice
          problem={`Given each employee's schedule as a list of non-overlapping sorted intervals, find the free time intervals that are common to all employees (gaps in the merged schedule).

Example: [[[1,3],[6,7]],[[2,4]],[[2,5],[9,12]]] → [[5,6],[7,9]]`}
          hints={[
            "Flatten all intervals into one list and sort by start time. This is the K-way merge step.",
            "Scan through the sorted intervals, tracking the current 'coverage end'. A gap appears when the next interval starts after coverage ends.",
            "Track prev_end. For each interval: if interval.start > prev_end, we found a free period [prev_end, interval.start].",
          ]}
          answer="Flatten + sort all intervals. Scan with prev_end tracker. When next start > prev_end, record [prev_end, start] as free time. Update prev_end = max(prev_end, end)."
          answerCode={pq5Code}
        />
      </Sub>

    </div>
  )
}
