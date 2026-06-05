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

const BS_WHAT_IS = `
BINARY SEARCH — cut the search space in half each step

Searching for 7 in: [1, 3, 5, 7, 9, 11, 13]
                     ↑               ↑
                   lo=0            hi=6

Step 1: mid = (0+6)//2 = 3 → arr[3] = 7 → FOUND!

Harder example — searching for 9:

Step 1: lo=0, hi=6, mid=3, arr[3]=7 < 9 → go RIGHT  (lo = mid+1 = 4)
         [_, _, _, _, 9, 11, 13]
                      ↑         ↑
                    lo=4       hi=6

Step 2: lo=4, hi=6, mid=5, arr[5]=11 > 9 → go LEFT  (hi = mid-1 = 4)
         [_, _, _, _, 9, _, _]
                      ↑
                    lo=hi=4

Step 3: lo=4, hi=4, mid=4, arr[4]=9 == 9 → FOUND!

KEY: each step eliminates HALF the remaining elements
     → O(log n) instead of O(n) linear scan
`

const BS_TEMPLATE = `
THE BINARY SEARCH TEMPLATE:

let mut left = 0i32;
let mut right = arr.len() as i32 - 1;

while left <= right {
    let mid = left + (right - left) / 2;  // avoids integer overflow (good habit)

    if arr[mid as usize] == target {
        return mid;                        // exact match
    } else if arr[mid as usize] < target {
        left = mid + 1;                    // target is in RIGHT half
    } else {
        right = mid - 1;                   // target is in LEFT half
    }
}
return -1;   // not found

ROTATED ARRAY VARIANT — two sorted halves:

Original: [1, 2, 3, 4, 5, 6, 7]
Rotated:  [4, 5, 6, 7, 1, 2, 3]
                       ↑
               rotation point (where it "drops")

Binary search still works — at every mid, ONE side is always sorted.
Figure out which side is sorted, check if target is in it, go there.
`

// ── Q1: Classic Binary Search ──────────────────────────────────────────────
const q1Brute = `// Brute: linear scan — O(n)
fn search_brute(nums: &[i32], target: i32) -> i32 {
    for (i, &n) in nums.iter().enumerate() {
        if n == target {
            return i as i32;
        }
    }
    -1
}`

const q1Opt = `fn search(nums: &[i32], target: i32) -> i32 {
    let mut lo = 0i32;
    let mut hi = nums.len() as i32 - 1;  // search window: [lo, hi] inclusive

    while lo <= hi {
        let mid = lo + (hi - lo) / 2;    // midpoint (avoid overflow with this form)

        if nums[mid as usize] == target {
            return mid;                   // found it!
        } else if nums[mid as usize] < target {
            lo = mid + 1;                 // target is to the RIGHT of mid
        } else {
            hi = mid - 1;                 // target is to the LEFT of mid
        }
    }
    -1                                    // target not in array
}`

// ── Q2: Smallest Letter Greater Than Target ────────────────────────────────
const q2Brute = `// Brute: linear scan for the first letter > target
fn next_greatest_letter_brute(letters: &[char], target: char) -> char {
    for &ch in letters {               // letters is sorted
        if ch > target {
            return ch;
        }
    }
    letters[0]                         // wrap around: all letters <= target
}`

const q2Opt = `fn next_greatest_letter(letters: &[char], target: char) -> char {
    let mut lo = 0i32;
    let mut hi = letters.len() as i32 - 1;

    // We want the LEFTMOST letter that is strictly > target
    let mut result = letters[0];       // default: wrap around to first letter

    while lo <= hi {
        let mid = lo + (hi - lo) / 2;
        if letters[mid as usize] > target {
            result = letters[mid as usize]; // this is a candidate, but maybe we can find smaller
            hi = mid - 1;                   // look left for an even smaller candidate
        } else {
            lo = mid + 1;                   // letters[mid] <= target, go right
        }
    }
    result
}`

// ── Q3: First and Last Position ────────────────────────────────────────────
const q3Brute = `// Brute: scan left for first occurrence, scan right for last — O(n)
fn search_range_brute(nums: &[i32], target: i32) -> [i32; 2] {
    let (mut first, mut last) = (-1i32, -1i32);
    for (i, &n) in nums.iter().enumerate() {
        if n == target {
            if first == -1 {
                first = i as i32;
            }
            last = i as i32;
        }
    }
    [first, last]
}`

const q3Opt = `fn search_range(nums: &[i32], target: i32) -> [i32; 2] {
    fn find_first(nums: &[i32], target: i32) -> i32 {
        let mut lo = 0i32;
        let mut hi = nums.len() as i32 - 1;
        let mut result = -1i32;
        while lo <= hi {
            let mid = lo + (hi - lo) / 2;
            if nums[mid as usize] == target {
                result = mid;            // record this, but keep searching LEFT
                hi = mid - 1;           // ← push hi left to find earlier occurrence
            } else if nums[mid as usize] < target {
                lo = mid + 1;
            } else {
                hi = mid - 1;
            }
        }
        result
    }

    fn find_last(nums: &[i32], target: i32) -> i32 {
        let mut lo = 0i32;
        let mut hi = nums.len() as i32 - 1;
        let mut result = -1i32;
        while lo <= hi {
            let mid = lo + (hi - lo) / 2;
            if nums[mid as usize] == target {
                result = mid;            // record this, but keep searching RIGHT
                lo = mid + 1;           // ← push lo right to find later occurrence
            } else if nums[mid as usize] < target {
                lo = mid + 1;
            } else {
                hi = mid - 1;
            }
        }
        result
    }

    [find_first(nums, target), find_last(nums, target)]
}`

// ── Q4: Search in Rotated Sorted Array ────────────────────────────────────
const q4Brute = `// Brute: linear scan ignores the sorted structure — O(n)
fn search_rotated_brute(nums: &[i32], target: i32) -> i32 {
    for (i, &n) in nums.iter().enumerate() {
        if n == target {
            return i as i32;
        }
    }
    -1
}`

const q4Opt = `fn search_rotated(nums: &[i32], target: i32) -> i32 {
    let mut lo = 0i32;
    let mut hi = nums.len() as i32 - 1;

    while lo <= hi {
        let mid = lo + (hi - lo) / 2;
        if nums[mid as usize] == target {
            return mid;
        }

        // key insight: one half MUST be cleanly sorted — figure out which one
        if nums[lo as usize] <= nums[mid as usize] {
            // LEFT half [lo..mid] is sorted
            if target >= nums[lo as usize] && target < nums[mid as usize] {
                hi = mid - 1;           // target is inside the sorted left half
            } else {
                lo = mid + 1;           // target must be in the right half
            }
        } else {
            // RIGHT half [mid..hi] is sorted
            if target > nums[mid as usize] && target <= nums[hi as usize] {
                lo = mid + 1;           // target is inside the sorted right half
            } else {
                hi = mid - 1;           // target must be in the left half
            }
        }
    }
    -1
}`

// ── Q5: Find Minimum in Rotated Sorted Array ───────────────────────────────
const q5Brute = `// Brute: linear scan for the minimum — O(n)
fn find_min_brute(nums: &[i32]) -> i32 {
    *nums.iter().min().unwrap()
}`

const q5Opt = `fn find_min(nums: &[i32]) -> i32 {
    let mut lo = 0i32;
    let mut hi = nums.len() as i32 - 1;

    while lo < hi {                    // stop when window has 1 element
        let mid = lo + (hi - lo) / 2;

        if nums[mid as usize] > nums[hi as usize] {
            // mid is in the LEFT (larger) part of the rotation
            // minimum is somewhere to the RIGHT of mid
            lo = mid + 1;
        } else {
            // mid is in the RIGHT (smaller) part, or array isn't rotated here
            // minimum is at mid or to its LEFT (don't discard mid!)
            hi = mid;                  // ← note: hi = mid, not mid-1
        }
    }
    nums[lo as usize]                  // lo == hi, both pointing at the minimum
}`

// ── PRACTICE answers ───────────────────────────────────────────────────────
const pq1Code = `// Guess Number Higher or Lower — binary search on 1..=n
// guess(num) API: -1 = too high, 1 = too low, 0 = correct
fn guess_number(n: i32) -> i32 {
    let mut lo = 1i32;
    let mut hi = n;
    while lo <= hi {
        let mid = lo + (hi - lo) / 2;
        match guess(mid) {
            0 => return mid,
            1 => lo = mid + 1,         // guess was too low, go right
            _ => hi = mid - 1,         // guess was too high, go left
        }
    }
    -1
}`

const pq2Code = `// Sqrt(x) — binary search for largest k where k*k <= x
fn my_sqrt(x: i32) -> i32 {
    if x < 2 {
        return x;
    }
    let mut lo = 1i64;
    let mut hi = (x as i64) / 2;      // sqrt(x) is always <= x//2 for x >= 4
    let mut result = 1i64;
    while lo <= hi {
        let mid = lo + (hi - lo) / 2;
        if mid * mid == x as i64 {
            return mid as i32;         // perfect square
        } else if mid * mid < x as i64 {
            result = mid;              // this works, but maybe a larger one does too
            lo = mid + 1;
        } else {
            hi = mid - 1;
        }
    }
    result as i32                      // largest mid where mid*mid <= x
}`

const pq3Code = `// Find Peak Element — peak is any element > both neighbors
fn find_peak_element(nums: &[i32]) -> i32 {
    let mut lo = 0i32;
    let mut hi = nums.len() as i32 - 1;
    while lo < hi {
        let mid = lo + (hi - lo) / 2;
        if nums[mid as usize] > nums[(mid + 1) as usize] {
            // slope is going down → peak is at mid or to its LEFT
            hi = mid;
        } else {
            // slope is going up → peak is to the RIGHT of mid
            lo = mid + 1;
        }
    }
    lo                                 // lo == hi, pointing at a peak
}`

const pq4Code = `// Koko Eating Bananas — binary search on eating speed
fn min_eating_speed(piles: &[i32], h: i32) -> i32 {
    let can_finish = |speed: i32| -> bool {
        // how many hours to eat all piles at this speed?
        piles.iter().map(|&p| (p + speed - 1) / speed).sum::<i32>() <= h
    };

    let mut lo = 1i32;
    let mut hi = *piles.iter().max().unwrap(); // speed 1 = slowest, max(piles) = fastest (1 pile/hr)
    let mut result = hi;
    while lo <= hi {
        let mid = lo + (hi - lo) / 2;
        if can_finish(mid) {
            result = mid;              // this speed works, try slower
            hi = mid - 1;
        } else {
            lo = mid + 1;              // too slow, try faster
        }
    }
    result
}`

const pq5Code = `// Find in Mountain Array — peak split + binary search each half
fn find_in_mountain_array(target: i32, mountain_arr: &MountainArray) -> i32 {
    let n = mountain_arr.length();

    // step 1: find the peak index
    let mut lo = 0i32;
    let mut hi = n as i32 - 1;
    while lo < hi {
        let mid = lo + (hi - lo) / 2;
        if mountain_arr.get(mid) < mountain_arr.get(mid + 1) {
            lo = mid + 1;
        } else {
            hi = mid;
        }
    }
    let peak = lo;

    // step 2: search ascending left side [0..peak]
    let mut lo = 0i32;
    let mut hi = peak;
    while lo <= hi {
        let mid = lo + (hi - lo) / 2;
        let val = mountain_arr.get(mid);
        if val == target      { return mid; }
        else if val < target  { lo = mid + 1; }
        else                  { hi = mid - 1; }
    }

    // step 3: search descending right side [peak..n-1]
    let mut lo = peak;
    let mut hi = n as i32 - 1;
    while lo <= hi {
        let mid = lo + (hi - lo) / 2;
        let val = mountain_arr.get(mid);
        if val == target      { return mid; }
        else if val > target  { lo = mid + 1; }  // descending: bigger is to the LEFT
        else                  { hi = mid - 1; }
    }

    -1
}`

export default function BinarySearchContent() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>

      <Sub title="What is Binary Search?">
        <p style={{ lineHeight: 1.7 }}>
          Imagine guessing a number between 1 and 1000. If someone tells you "higher"
          or "lower" after each guess, the smart move is always to guess the middle.
          That way you cut the remaining possibilities in half every single time.
          1000 → 500 → 250 → ... → found it in at most 10 guesses. That's binary
          search: <strong>cut the search space in half each step → O(log n)</strong>.
        </p>
        <Callout type="tip">
          <strong>Trigger phrases:</strong> "sorted array", "find target", "find minimum/maximum
          satisfying some condition", "rotated sorted array", "O(log n) required".
          Any time you see a sorted (or partially ordered) structure and need to find
          something → think binary search.
        </Callout>
      </Sub>

      <Sub title="How Binary Search works — step by step">
        <CodeBlock code={BS_WHAT_IS} lang="text" />
      </Sub>

      <Sub title="The template + rotated arrays">
        <CodeBlock code={BS_TEMPLATE} lang="text" />
        <Callout type="info">
          Two common variants: (1) find <em>exact match</em> — return mid when
          <code>arr[mid as usize] == target</code>. (2) find <em>leftmost/rightmost</em>
          occurrence — record mid and keep searching in the appropriate direction.
          Learn both; most problems are one of these two.
        </Callout>
      </Sub>

      <Sub title="Taught Questions">

        <QuestionCard
          num={1}
          title="Binary Search (Classic)"
          difficulty="Easy"
          problem={`Given a sorted array and a target value, return the index of the target, or -1 if it doesn't exist. Must run in O(log n).

Example: nums=[-1,0,3,5,9,12], target=9 → 4`}
          brute={<>
            <BigOBadge time="O(n)" space="O(1)" />
            <CodeBlock code={q1Brute} lang="rust" />
            <Callout type="warn">Linear scan works but throws away the sorted structure. We can do O(log n).</Callout>
          </>}
          optimized={<>
            <BigOBadge time="O(log n)" space="O(1)" />
            <CodeBlock code={q1Opt} lang="rust" />
            <Callout type="tip">
              <strong>Aha moment:</strong> Write <code>mid = lo + (hi - lo) / 2</code>
              instead of <code>(lo + hi) / 2</code>. Both give the same answer, but the first
              form never overflows (important in languages with fixed integer sizes — Rust uses
              i32 here so this matters).
            </Callout>
            <Callout type="danger">
              <strong>Common mistake:</strong> Using <code>lo &lt; hi</code> instead of
              <code>lo &lt;= hi</code>. When lo equals hi, there's still one element left to
              check. Miss it and you'll return -1 when the target is right there.
            </Callout>
          </>}
          answer="lo=0, hi=len-1 (as i32). While lo<=hi: mid=lo+(hi-lo)/2. If match return mid. If arr[mid]<target: lo=mid+1. Else: hi=mid-1. Return -1."
        />

        <QuestionCard
          num={2}
          title="Find Smallest Letter Greater Than Target"
          difficulty="Easy"
          problem={`Given a sorted list of lowercase letters and a target letter, find the smallest letter in the list that is strictly greater than target. The list wraps around.

Example: letters=['c','f','j'], target='c' → 'f'
Example: letters=['c','f','j'], target='j' → 'c'  (wrap around)`}
          brute={<>
            <BigOBadge time="O(n)" space="O(1)" />
            <CodeBlock code={q2Brute} lang="rust" />
          </>}
          optimized={<>
            <BigOBadge time="O(log n)" space="O(1)" />
            <CodeBlock code={q2Opt} lang="rust" />
            <Callout type="tip">
              <strong>Aha moment:</strong> This is "find the leftmost element strictly greater
              than target". When you find a candidate (<code>letters[mid as usize] &gt; target</code>),
              record it but keep searching left — there might be a smaller valid answer.
              Default to <code>letters[0]</code> for the wrap-around case.
            </Callout>
            <Callout type="danger">
              <strong>Common mistake:</strong> Forgetting the wrap-around. If all letters are
              ≤ target, the answer loops back to <code>letters[0]</code>.
            </Callout>
          </>}
          answer="Binary search for leftmost letter > target. When letters[mid] > target, record it and push hi=mid-1 to look for smaller candidates. Default result=letters[0] handles wrap-around."
        />

        <QuestionCard
          num={3}
          title="Find First and Last Position of Element"
          difficulty="Medium"
          problem={`Given a sorted array and a target, return the first and last index where target appears. Return [-1,-1] if not found. Must be O(log n).

Example: nums=[5,7,7,8,8,10], target=8 → [3,4]`}
          brute={<>
            <BigOBadge time="O(n)" space="O(1)" />
            <CodeBlock code={q3Brute} lang="rust" />
          </>}
          optimized={<>
            <BigOBadge time="O(log n)" space="O(1)" />
            <CodeBlock code={q3Opt} lang="rust" />
            <Callout type="tip">
              <strong>Aha moment:</strong> Run binary search twice — once biased left
              (when you find a match, record it and push <code>hi = mid - 1</code> to
              keep searching left), and once biased right (record it and push
              <code>lo = mid + 1</code>). Two passes, each O(log n).
            </Callout>
            <Callout type="danger">
              <strong>Common mistake:</strong> Returning immediately on the first match.
              That gives you <em>a</em> position, not the <em>first</em> or <em>last</em>.
              Keep searching in the right direction after finding a match.
            </Callout>
          </>}
          answer="Two binary searches: find_first (when match found, push hi=mid-1 to keep looking left) and find_last (push lo=mid+1 to keep looking right). Return [-1,-1] if neither finds anything."
        />

        <QuestionCard
          num={4}
          title="Search in Rotated Sorted Array"
          difficulty="Medium"
          problem={`A sorted array was rotated at some unknown pivot. Find the target's index, or -1 if absent. Must be O(log n).

Example: nums=[4,5,6,7,0,1,2], target=0 → 4
Example: nums=[4,5,6,7,0,1,2], target=3 → -1`}
          brute={<>
            <BigOBadge time="O(n)" space="O(1)" />
            <CodeBlock code={q4Brute} lang="rust" />
          </>}
          optimized={<>
            <BigOBadge time="O(log n)" space="O(1)" />
            <CodeBlock code={q4Opt} lang="rust" />
            <Callout type="tip">
              <strong>Aha moment:</strong> Even in a rotated array, one of the two halves
              around any midpoint is always perfectly sorted. Compare <code>nums[lo as usize]</code>
              with <code>nums[mid as usize]</code> to determine which half is clean, then check if
              the target falls inside that clean half. If yes, search there. Otherwise search
              the other half.
            </Callout>
            <Callout type="danger">
              <strong>Common mistake:</strong> Using <code>nums[mid] &gt; nums[hi]</code>
              to check which side is sorted. Using <code>nums[lo] &lt;= nums[mid]</code>
              is more reliable — it correctly handles the case where lo == mid.
            </Callout>
          </>}
          answer="At each step, one half is always sorted. Check if nums[lo] <= nums[mid] (left is sorted). If target in [nums[lo], nums[mid]), go left. Otherwise go right. Repeat for the right-sorted case."
        />

        <QuestionCard
          num={5}
          title="Find Minimum in Rotated Sorted Array"
          difficulty="Medium"
          problem={`Find the minimum element in a rotated sorted array (all elements unique). Must be O(log n).

Example: [3,4,5,1,2] → 1
Example: [4,5,6,7,0,1,2] → 0`}
          brute={<>
            <BigOBadge time="O(n)" space="O(1)" />
            <CodeBlock code={q5Brute} lang="rust" />
          </>}
          optimized={<>
            <BigOBadge time="O(log n)" space="O(1)" />
            <CodeBlock code={q5Opt} lang="rust" />
            <Callout type="tip">
              <strong>Aha moment:</strong> Compare <code>nums[mid as usize]</code> with
              <code>nums[hi as usize]</code>. If <code>nums[mid] &gt; nums[hi]</code>, the big-value
              "hump" is on the left side — the minimum must be to the right, so
              <code>lo = mid + 1</code>. Otherwise the minimum is at mid or left, so
              <code>hi = mid</code> (not mid-1, since mid itself might be the minimum).
            </Callout>
            <Callout type="danger">
              <strong>Common mistake:</strong> Using <code>hi = mid - 1</code> instead of
              <code>hi = mid</code>. If mid IS the minimum, setting <code>hi = mid - 1</code>
              discards it. Also use <code>lo &lt; hi</code> (not <code>&lt;=</code>) — stop
              when the window collapses to one element.
            </Callout>
          </>}
          answer="Compare nums[mid] vs nums[hi]. If nums[mid] > nums[hi]: minimum is right → lo=mid+1. Otherwise minimum is at mid or left → hi=mid. Loop until lo==hi, return nums[lo]."
        />

      </Sub>

      <Sub title="Practice Questions">
        <Callout type="info">All of these are binary search in disguise. Identify the search space and the condition that tells you to go left or right.</Callout>

        <QuestionCard
          num={6}
          title="Guess Number Higher or Lower"
          difficulty="Easy"
          practice
          problem={`A number is picked from 1 to n. You call guess(num) which returns -1 (your guess is higher than the answer), 1 (lower), or 0 (correct). Find the number.`}
          hints={[
            "Binary search on the range [1, n].",
            "guess(mid) tells you exactly which half to search next — just like a standard binary search condition.",
            "If guess(mid)==1, the answer is higher → lo=mid+1. If -1, lower → hi=mid-1. If 0, return mid.",
          ]}
          answer="Binary search on [1,n]. Use guess(mid) result to pick left or right half."
          answerCode={pq1Code}
        />

        <QuestionCard
          num={7}
          title="Sqrt(x)"
          difficulty="Easy"
          practice
          problem={`Given a non-negative integer x, return the integer square root (floor of the actual square root) without using pow or sqrt.

Example: x=8 → 2 (sqrt(8)=2.82..., floor=2)`}
          hints={[
            "Binary search on the answer space [1, x/2].",
            "You're looking for the largest k where k*k <= x.",
            "When mid*mid <= x: record mid (it's a valid candidate) and search right. When mid*mid > x: search left.",
          ]}
          answer="Binary search [1, x/2]. Track the largest mid where mid*mid <= x. Return that."
          answerCode={pq2Code}
        />

        <QuestionCard
          num={8}
          title="Find Peak Element"
          difficulty="Medium"
          practice
          problem={`A peak element is greater than its neighbors. Given an array where nums[-1] = nums[n] = -∞, find any peak index. Must be O(log n).

Example: [1,2,3,1] → 2 (index of 3)`}
          hints={[
            "At any midpoint, look at which direction the slope goes: is nums[mid] < nums[mid+1]?",
            "If the slope goes up (nums[mid] < nums[mid+1]), a peak exists to the right → lo=mid+1.",
            "If the slope goes down (nums[mid] > nums[mid+1]), a peak exists at mid or left → hi=mid.",
          ]}
          answer="Binary search: if nums[mid] < nums[mid+1], peak is to the right (lo=mid+1). Else peak is at mid or left (hi=mid). Return lo when lo==hi."
          answerCode={pq3Code}
        />

        <QuestionCard
          num={9}
          title="Koko Eating Bananas"
          difficulty="Medium"
          practice
          problem={`Koko has piles of bananas and h hours. She eats at speed k (bananas/hour, one pile at a time). Find the minimum k that lets her finish all piles within h hours.

Example: piles=[3,6,7,11], h=8 → 4`}
          hints={[
            "The answer (speed) is somewhere between 1 and max(piles). Binary search that range.",
            "For a given speed k, she takes ceil(pile/k) hours per pile. If total hours <= h, speed k works.",
            "Find the MINIMUM speed that works: when can_finish(mid), record mid and try slower (hi=mid-1). Else try faster (lo=mid+1).",
          ]}
          answer="Binary search [1, max(piles)]. can_finish(speed): sum(ceil(p/speed)) <= h. Find minimum speed where can_finish is true."
          answerCode={pq4Code}
        />

        <QuestionCard
          num={10}
          title="Find in Mountain Array"
          difficulty="Hard"
          practice
          problem={`A mountain array increases then decreases. Find the index of target (return the smallest index if it appears twice). You can only call mountain_arr.get(index).

Example: [1,2,3,4,5,3,1], target=3 → 2`}
          hints={[
            "Step 1: find the peak index using binary search (slope direction: if get(mid) < get(mid+1), peak is right).",
            "Step 2: binary search the ascending left side [0..peak] normally.",
            "Step 3: binary search the descending right side [peak..n-1] with flipped comparisons (bigger values are to the LEFT).",
          ]}
          answer="Three binary searches: find peak, search ascending left half, search descending right half (reverse direction comparisons). Return smallest index found."
          answerCode={pq5Code}
        />
      </Sub>

    </div>
  )
}
