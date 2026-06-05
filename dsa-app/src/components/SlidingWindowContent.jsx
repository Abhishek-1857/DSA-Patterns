import CodeBlock from './CodeBlock'
import BigOBadge from './BigOBadge'
import QuestionCard from './QuestionCard'

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

// ─────────────────────────────────────────────────────────────
//  ASCII WALKTHROUGH
// ─────────────────────────────────────────────────────────────

const SW_VISUAL = `# Maximum Sum Subarray of size k  —  nums=[2,1,5,1,3,2], k=3
#
# Maintain a window of exactly k elements.
# Slide: add new right element, remove old left element.
# No re-summing — just one addition and one subtraction per step.
#
# Step 1:  [ 2  1  5 ] 1  3  2    window_sum = 2+1+5 = 8
#            L─────R
# Step 2:   2 [ 1  5  1 ] 3  2    window_sum = 8 - 2 + 1 = 7
#              L─────R
# Step 3:   2  1 [ 5  1  3 ] 2    window_sum = 7 - 1 + 3 = 9  ← new max!
#                  L─────R
# Step 4:   2  1  5 [ 1  3  2 ]   window_sum = 9 - 5 + 2 = 6
#                     L─────R
#
# Answer: 9  (the window [5, 1, 3] had the highest sum)`

// ─────────────────────────────────────────────────────────────
//  TAUGHT Q1 — Maximum Sum Subarray of Size K
// ─────────────────────────────────────────────────────────────

const SW_Q1_BRUTE = `// Brute force: sum every possible window of size k from scratch
fn max_sum_subarray_brute(nums: &[i32], k: usize) -> i32 {
    let mut max_sum = 0i32;    // largest window sum found so far
    let n = nums.len();        // total number of elements

    for i in 0..=(n - k) {              // i = start of window (0 to n-k)
        let mut window_sum = 0i32;      // reset sum for each fresh window
        for j in i..(i + k) {          // j walks through k elements in this window
            window_sum += nums[j];      // accumulate the window sum
        }
        max_sum = max_sum.max(window_sum);  // keep the largest
    }

    max_sum
    // Time:  O(n * k) — outer loop n times, inner sums k elements each
    // Space: O(1)     — only a handful of integer variables
}`

const SW_Q1_OPT = `// Sliding Window: keep a running sum, slide one element at a time
fn max_sum_subarray(nums: &[i32], k: usize) -> i32 {
    // build the first window (sum the first k elements)
    let mut window_sum: i32 = nums[..k].iter().sum();  // initial window sum
    let mut max_sum = window_sum;                       // first window is our starting best

    // slide from position k to the end of the array
    for i in k..nums.len() {
        window_sum += nums[i];          // add element entering from right
        window_sum -= nums[i - k];      // remove element leaving from left
        max_sum = max_sum.max(window_sum);  // update if this window is better
    }

    max_sum
    // Walk-through: [2,1,5,1,3,2], k=3
    // First window: sum=8
    // i=3: 8 + 1 - 2 = 7
    // i=4: 7 + 3 - 1 = 9  ← max!
    // i=5: 9 + 2 - 5 = 6
    // Answer: 9 ✅
    // Time:  O(n) — each element processed exactly once
    // Space: O(1)
}`

// ─────────────────────────────────────────────────────────────
//  TAUGHT Q2 — Longest Substring Without Repeating Characters
// ─────────────────────────────────────────────────────────────

const SW_Q2_BRUTE = `// Brute force: try every possible substring
fn length_of_longest_substring_brute(s: &str) -> usize {
    let chars: Vec<char> = s.chars().collect();
    let n = chars.len();
    let mut max_len = 0usize;  // longest valid (no-repeat) window found

    for i in 0..n {                          // try every possible start position
        let mut seen = std::collections::HashSet::new();  // characters currently in this window
        for j in i..n {                      // extend window rightward
            if seen.contains(&chars[j]) {    // duplicate found!
                break;                       // this window is invalid, stop extending
            }
            seen.insert(chars[j]);           // new unique char, add it
            max_len = max_len.max(j - i + 1);  // valid window — record length
        }
    }

    max_len
    // Time:  O(n²) — nested loops
    // Space: O(min(n, 26)) — set holds unique chars in window
}`

const SW_Q2_OPT = `// Sliding Window: track the last-seen index of each character
fn length_of_longest_substring(s: &str) -> usize {
    use std::collections::HashMap;
    let chars: Vec<char> = s.chars().collect();
    let mut last_seen: HashMap<char, usize> = HashMap::new();  // char → index where we last saw it
    let mut left = 0usize;   // left edge of current valid window
    let mut max_len = 0usize; // longest window with no repeating characters

    for right in 0..chars.len() {
        let c = chars[right];    // current character being added

        // if char is inside our window (last seen at or after left):
        if let Some(&prev) = last_seen.get(&c) {
            if prev >= left {
                // jump left pointer past the previous occurrence
                left = prev + 1;   // shrink window from left
            }
        }

        last_seen.insert(c, right);                    // update position
        max_len = max_len.max(right - left + 1);       // record window size
    }

    max_len
    // Walk-through: "abcabcbb"
    // r=0 a: window=a,   len=1
    // r=1 b: window=ab,  len=2
    // r=2 c: window=abc, len=3
    // r=3 a: a at 0, left jumps to 1,  window=bca, len=3
    // r=4 b: b at 1, left jumps to 2,  window=cab, len=3
    // r=5 c: c at 2, left jumps to 3,  window=abc, len=3
    // r=6 b: b at 4, left jumps to 5,  window=cb,  len=2
    // r=7 b: b at 6, left jumps to 7,  window=b,   len=1
    // Answer: 3 ✅
    // Time:  O(n), Space: O(min(n, 26))
}`

// ─────────────────────────────────────────────────────────────
//  TAUGHT Q3 — Minimum Size Subarray Sum
// ─────────────────────────────────────────────────────────────

const SW_Q3_BRUTE = `// Brute force: try every subarray, check if sum meets target
fn min_subarray_len_brute(target: i32, nums: &[i32]) -> usize {
    let n = nums.len();
    let mut min_len = usize::MAX;   // usize::MAX = no valid window found yet

    for i in 0..n {                          // try every starting position
        let mut current_sum = 0i32;
        for j in i..n {                      // extend window rightward
            current_sum += nums[j];          // grow the sum
            if current_sum >= target {       // found a valid window!
                min_len = min_len.min(j - i + 1);  // record its length
                break;                       // no need to grow this window further
            }
        }
    }

    if min_len == usize::MAX { 0 } else { min_len }
    // Time:  O(n²), Space: O(1)
}`

const SW_Q3_OPT = `// Variable Sliding Window: shrink greedily once window is valid
fn min_subarray_len(target: i32, nums: &[i32]) -> usize {
    let mut left = 0usize;          // left edge of window
    let mut current_sum = 0i32;     // sum of elements in the window
    let mut min_len = usize::MAX;   // smallest valid window found

    for right in 0..nums.len() {    // expand window on the right
        current_sum += nums[right]; // add new element

        // while window sum >= target, it's valid — try to shrink
        while current_sum >= target {
            min_len = min_len.min(right - left + 1);  // record length
            current_sum -= nums[left];  // remove leftmost element
            left += 1;                  // shrink window from left
        }
    }

    if min_len == usize::MAX { 0 } else { min_len }
    // Walk-through: target=7, nums=[2,3,1,2,4,3]
    // right=0: sum=2  (< 7)
    // right=1: sum=5  (< 7)
    // right=2: sum=6  (< 7)
    // right=3: sum=8  (≥ 7!) min=4, shrink: sum=6, left=1
    // right=4: sum=10 (≥ 7!) min=3, shrink: sum=7 → min=3, shrink: sum=4, left=3
    // right=5: sum=7  (≥ 7!) min=2 ✅
    // Time:  O(n) — each element enters and leaves the window at most once
    // Space: O(1)
}`

// ─────────────────────────────────────────────────────────────
//  TAUGHT Q4 — Longest Substring with K Distinct Characters
// ─────────────────────────────────────────────────────────────

const SW_Q4_BRUTE = `// Brute force: try every start, extend until too many distinct chars
fn longest_k_distinct_brute(s: &str, k: usize) -> usize {
    use std::collections::HashMap;
    let chars: Vec<char> = s.chars().collect();
    let n = chars.len();
    let mut max_len = 0usize;

    for i in 0..n {
        let mut freq: HashMap<char, i32> = HashMap::new();  // char frequencies in window
        for j in i..n {
            *freq.entry(chars[j]).or_insert(0) += 1;        // add char
            if freq.len() <= k {                             // still within k distinct
                max_len = max_len.max(j - i + 1);
            } else {
                break;                                       // too many distinct, stop
            }
        }
    }

    max_len
    // Time:  O(n²), Space: O(k)
}`

const SW_Q4_OPT = `// Sliding Window with frequency map
fn longest_k_distinct(s: &str, k: usize) -> usize {
    use std::collections::HashMap;
    let chars: Vec<char> = s.chars().collect();
    let mut freq: HashMap<char, i32> = HashMap::new();  // char → count in current window
    let mut left = 0usize;   // left edge
    let mut max_len = 0usize; // longest valid window

    for right in 0..chars.len() {
        let c = chars[right];
        *freq.entry(c).or_insert(0) += 1;    // add char to window

        // if we now have more than k distinct chars, shrink from left
        while freq.len() > k {
            let left_char = chars[left];
            let count = freq.entry(left_char).or_insert(0);
            *count -= 1;                      // reduce that char's count
            if *count == 0 {
                freq.remove(&left_char);      // remove from map when count hits 0
            }
            left += 1;                        // shrink window
        }

        max_len = max_len.max(right - left + 1);  // valid window
    }

    max_len
    // Walk-through: s="araaci", k=2
    // r=0 a: freq={a:1},       len=1
    // r=1 r: freq={a:1,r:1},   len=2
    // r=2 a: freq={a:2,r:1},   len=3
    // r=3 a: freq={a:3,r:1},   len=4  ← max!
    // r=4 c: 3 distinct > k=2 → shrink: remove 'a'→{a:2,r:1,c:1}→still 3
    //   remove 'r'→{a:2,c:1} = 2 ✅  left=2, len=3
    // r=5 i: 3 > 2 → shrink to {c:1,i:1}, left=5, len=1
    // Answer: 4 ✅
    // Time:  O(n), Space: O(k)
}`

// ─────────────────────────────────────────────────────────────
//  TAUGHT Q5 — Permutation in String
// ─────────────────────────────────────────────────────────────

const SW_Q5_BRUTE = `// Brute force: slide a window, rebuild frequency count each time
fn check_inclusion_brute(s1: &str, s2: &str) -> bool {
    use std::collections::HashMap;

    if s1.len() > s2.len() {
        return false;
    }

    let s1_chars: Vec<char> = s1.chars().collect();
    let s2_chars: Vec<char> = s2.chars().collect();
    let m = s1_chars.len();

    // build target frequencies from s1
    let mut s1_count: HashMap<char, i32> = HashMap::new();
    for &c in &s1_chars {
        *s1_count.entry(c).or_insert(0) += 1;
    }

    // check every window of size m in s2
    for i in 0..=(s2_chars.len() - m) {
        let mut window: HashMap<char, i32> = HashMap::new();
        for j in i..(i + m) {
            *window.entry(s2_chars[j]).or_insert(0) += 1;  // build window freq
        }
        if window == s1_count {   // same character frequencies?
            return true;          // it's a permutation!
        }
    }

    false
    // Time:  O(n * m) — for each of n windows, counting takes O(m)
    // Space: O(m)     — maps store at most m unique characters
}`

const SW_Q5_OPT = `// Sliding Window: update frequency map incrementally
fn check_inclusion(s1: &str, s2: &str) -> bool {
    use std::collections::HashMap;

    if s1.len() > s2.len() {
        return false;
    }

    let s1_chars: Vec<char> = s1.chars().collect();
    let s2_chars: Vec<char> = s2.chars().collect();
    let m = s1_chars.len();

    // build target frequency map (fixed)
    let mut s1_count: HashMap<char, i32> = HashMap::new();
    for &c in &s1_chars {
        *s1_count.entry(c).or_insert(0) += 1;
    }

    // build frequency map of first window in s2
    let mut window: HashMap<char, i32> = HashMap::new();
    for &c in &s2_chars[..m] {
        *window.entry(c).or_insert(0) += 1;
    }

    if window == s1_count {    // check the very first window
        return true;
    }

    // slide the window from position m to end of s2
    for i in m..s2_chars.len() {
        let new_char = s2_chars[i];           // character entering from right
        *window.entry(new_char).or_insert(0) += 1;  // add it to frequency map

        let old_char = s2_chars[i - m];       // character leaving from left
        let count = window.entry(old_char).or_insert(0);
        *count -= 1;
        if *count == 0 {
            window.remove(&old_char);         // clean up zero counts
        }

        if window == s1_count {               // does this window match s1?
            return true;
        }
    }

    false
    // Key: instead of re-counting each window (O(m)), we update 2 chars.
    // Time:  O(n) — n = s2.len(), single pass
    // Space: O(1) — at most 26 lowercase letters in either map
}`

// ─────────────────────────────────────────────────────────────
//  PRACTICE Q1 — Maximum Average Subarray
// ─────────────────────────────────────────────────────────────

const SW_P1_CODE = `fn find_max_average(nums: &[i32], k: usize) -> f64 {
    // build the first window of k elements
    let mut window_sum: i32 = nums[..k].iter().sum();  // sum of first k elements
    let mut max_sum = window_sum;                       // best sum seen so far

    // slide the window to the right, one step at a time
    for i in k..nums.len() {
        window_sum += nums[i];          // add element entering on right
        window_sum -= nums[i - k];      // remove element leaving on left
        max_sum = max_sum.max(window_sum);  // track best
    }

    max_sum as f64 / k as f64  // divide max sum by k to get average
    // Time: O(n), Space: O(1)
}`

// ─────────────────────────────────────────────────────────────
//  PRACTICE Q2 — Longest Repeating Character Replacement
// ─────────────────────────────────────────────────────────────

const SW_P2_CODE = `fn character_replacement(s: &str, k: usize) -> usize {
    use std::collections::HashMap;
    let chars: Vec<char> = s.chars().collect();
    let mut freq: HashMap<char, usize> = HashMap::new();  // char → count in current window
    let mut left = 0usize;     // left edge
    let mut max_freq = 0usize; // count of the most frequent char in window
    let mut max_len = 0usize;  // answer: longest valid window

    for right in 0..chars.len() {
        let c = chars[right];
        *freq.entry(c).or_insert(0) += 1;
        max_freq = max_freq.max(*freq.get(&c).unwrap());  // track most frequent char count

        // replacements needed = window_size - max_freq
        // if we need more replacements than k, shrink from left
        while (right - left + 1) - max_freq > k {
            let lc = chars[left];
            *freq.entry(lc).or_insert(0) -= 1;  // remove leftmost char from freq map
            left += 1;                           // shrink window
        }

        max_len = max_len.max(right - left + 1);  // valid window!
    }

    max_len
    // Time: O(n), Space: O(1) — at most 26 entries in freq
}`

// ─────────────────────────────────────────────────────────────
//  PRACTICE Q3 — Max Consecutive Ones III
// ─────────────────────────────────────────────────────────────

const SW_P3_CODE = `fn longest_ones(nums: &[i32], k: usize) -> usize {
    let mut left = 0usize;   // left edge of window
    let mut zeros = 0usize;  // zeros in window (each one = a "flip" used)
    let mut max_len = 0usize; // longest all-ones window we can form

    for right in 0..nums.len() {
        if nums[right] == 0 {   // new element is a zero
            zeros += 1;         // we used one flip
        }

        // if we used more flips than allowed, shrink from left
        while zeros > k {
            if nums[left] == 0 {   // removing a zero frees one flip
                zeros -= 1;
            }
            left += 1;             // shrink window
        }

        max_len = max_len.max(right - left + 1);  // valid window
    }

    max_len
    // Time: O(n), Space: O(1)
}`

// ─────────────────────────────────────────────────────────────
//  PRACTICE Q4 — Minimum Window Substring
// ─────────────────────────────────────────────────────────────

const SW_P4_CODE = `fn min_window(s: &str, t: &str) -> String {
    use std::collections::HashMap;

    if t.is_empty() {
        return String::new();
    }

    let s_chars: Vec<char> = s.chars().collect();
    let mut need: HashMap<char, i32> = HashMap::new();
    for c in t.chars() {
        *need.entry(c).or_insert(0) += 1;  // how many of each char we need
    }

    let mut have: HashMap<char, i32> = HashMap::new();  // how many we currently have in window
    let mut formed = 0i32;              // unique chars from t that are fully satisfied
    let required = need.len() as i32;  // total unique chars we need to satisfy

    let mut left = 0usize;
    let mut min_len = usize::MAX;
    let mut result = String::new();

    for right in 0..s_chars.len() {
        let c = s_chars[right];
        *have.entry(c).or_insert(0) += 1;  // add char to window

        // did this char just meet its requirement?
        if let Some(&req) = need.get(&c) {
            if *have.get(&c).unwrap() == req {
                formed += 1;   // one more requirement satisfied
            }
        }

        // while window has all required chars, try to shrink it
        while formed == required {
            if right - left + 1 < min_len {    // new minimum found
                min_len = right - left + 1;
                result = s_chars[left..=right].iter().collect();  // save best window
            }

            // shrink: remove leftmost char
            let remove = s_chars[left];
            let cnt = have.entry(remove).or_insert(0);
            *cnt -= 1;
            if let Some(&req) = need.get(&remove) {
                if *have.get(&remove).unwrap() < req {
                    formed -= 1;   // requirement no longer met
                }
            }
            left += 1;
        }
    }

    result
    // Time: O(n + m), Space: O(n + m)
}`

// ─────────────────────────────────────────────────────────────
//  PRACTICE Q5 — Sliding Window Maximum
// ─────────────────────────────────────────────────────────────

const SW_P5_CODE = `use std::collections::VecDeque;

fn max_sliding_window(nums: &[i32], k: usize) -> Vec<i32> {
    let mut result: Vec<i32> = Vec::new();  // output: max of each window of size k
    let mut dq: VecDeque<usize> = VecDeque::new();  // monotonic decreasing deque — stores INDICES
    // invariant: dq[0] is always the index of the window's maximum

    for i in 0..nums.len() {
        // remove indices that are outside the current window
        while !dq.is_empty() && *dq.front().unwrap() + k <= i {
            dq.pop_front();      // front index is out of window
        }

        // remove indices of elements smaller than nums[i]
        // they can never be the max while nums[i] is in the window
        while !dq.is_empty() && nums[*dq.back().unwrap()] < nums[i] {
            dq.pop_back();       // useless: smaller and to the left of i
        }

        dq.push_back(i);         // add current index to back of deque

        // once the first full window is formed, record the max
        if i >= k - 1 {
            result.push(nums[*dq.front().unwrap()]);  // front = window maximum
        }
    }

    result
    // Time:  O(n) — each element pushed and popped at most once
    // Space: O(k) — deque holds at most k indices
}`

// ─────────────────────────────────────────────────────────────
//  MAIN EXPORT
// ─────────────────────────────────────────────────────────────

export default function SlidingWindowContent() {
  return (
    <div className="found-content">

      {/* ══════════════════════════════════════════ */}
      {/*  PATTERN INTRO                            */}
      {/* ══════════════════════════════════════════ */}
      <Sub num="★" title="What is Sliding Window?">
        <p className="found-p">
          Imagine watching a train pass by through a fixed window frame. You see a
          few cars at a time — as the train moves, new cars appear on the right and
          old ones disappear on the left. The window stays put; what&apos;s inside changes.
          That&apos;s sliding window in a nutshell.
        </p>
        <p className="found-p">
          In code, we maintain a &quot;window&quot; (a range of indexes) over an array or string.
          Instead of re-computing the window from scratch at each position, we{' '}
          <strong>slide it one step</strong>: add the new right element, drop the old left
          element. This turns an O(n²) nested loop into a single O(n) pass.
        </p>

        <Callout type="analogy">
          <strong>Fitness tracker — 7-day rolling step count.</strong> You want the highest
          step total over any 7 consecutive days in a year. Instead of adding 7 days fresh
          for every possible week (365 × 7 = 2,555 operations), you keep a running total:
          add today&apos;s steps, subtract steps from 8 days ago. One add, one subtract, per day.
          Same answer — much less work.
        </Callout>

        <Callout type="tip" icon="🎯" label="When to use Sliding Window">
          Look for these phrases in a problem:
          <ul style={{ margin: '8px 0 0 16px', lineHeight: 2.2 }}>
            <li>&quot;<strong>subarray / substring of size K</strong>&quot;</li>
            <li>&quot;<strong>longest substring</strong> without / with [condition]&quot;</li>
            <li>&quot;<strong>minimum / maximum subarray</strong> that satisfies [condition]&quot;</li>
            <li>&quot;contiguous&quot; paired with &quot;sum / average / product&quot;</li>
          </ul>
        </Callout>

        <p className="found-p">
          Here&apos;s the pattern traced on the classic &quot;max sum subarray of size K&quot; example:
        </p>
        <CodeBlock code={SW_VISUAL} lang="python" />
      </Sub>

      {/* ══════════════════════════════════════════ */}
      {/*  TAUGHT QUESTIONS                         */}
      {/* ══════════════════════════════════════════ */}
      <Sub num="①" title="Taught Questions — Learn by Example">

        <QuestionCard
          title="Q1 · Maximum Sum Subarray of Size K"
          difficulty="Easy"
          bruteComplexity="O(n·k)"
          optComplexity="O(n)"
          optSpaceComplexity="O(1)"
          problem={<>
            Given an array of integers <code style={{fontFamily:'monospace',color:'var(--code-blue)'}}>nums</code> and integer <code style={{fontFamily:'monospace',color:'var(--code-blue)'}}>k</code>, find the <strong>maximum sum</strong> of any contiguous subarray of exactly size k.<br /><br />
            <strong>Example:</strong><br />
            nums = [2, 1, 5, 1, 3, 2], k = 3 → <span style={{color:'var(--green)'}}>9</span><br />
            <em>Subarray [5, 1, 3] sums to 9 — the highest of all k-size windows.</em><br /><br />
            <strong>Brute idea:</strong> Try every window of size k, sum k elements each time. O(n·k) — slow for large k.<br />
            <strong>Optimized idea:</strong> Keep a running sum. When you slide, add the new right element and subtract the old left element. One step per slide. O(n).
          </>}
          hint="Build the first window of size k. Then slide: what's the minimum information you need to update each step?"
          answer="The aha moment: you don't need to re-sum the window each time. Just add the element entering on the right and remove the element leaving on the left. One add + one subtract = O(1) per step, O(n) total."
          bruteCode={SW_Q1_BRUTE}
          optCode={SW_Q1_OPT}
          lang="rust"
        />

        <QuestionCard
          title="Q2 · Longest Substring Without Repeating Characters"
          difficulty="Medium"
          bruteComplexity="O(n²)"
          optComplexity="O(n)"
          optSpaceComplexity="O(1)"
          problem={<>
            Given a string <code style={{fontFamily:'monospace',color:'var(--code-blue)'}}>s</code>, return the length of the <strong>longest substring</strong> with no repeating characters.<br /><br />
            <strong>Examples:</strong><br />
            &quot;abcabcbb&quot; → <span style={{color:'var(--green)'}}>3</span> (&quot;abc&quot;)<br />
            &quot;bbbbb&quot; → <span style={{color:'var(--green)'}}>1</span> (&quot;b&quot;)<br />
            &quot;pwwkew&quot; → <span style={{color:'var(--green)'}}>3</span> (&quot;wke&quot;)<br /><br />
            <strong>Brute idea:</strong> For every start position, extend right until a repeat is found. Reset and try the next start. O(n²).<br />
            <strong>Optimized idea:</strong> Keep a hash map of last-seen positions. When a duplicate enters, jump the left pointer past the previous occurrence — no need to restart from scratch.
          </>}
          hint="Store where you last saw each character. When a duplicate arrives, don't restart — jump left directly past where you last saw it."
          answer="The window is always valid (no repeats). When a duplicate enters from the right, we shrink from the left in O(1) using the last-seen map — no rescanning needed. Single pass, O(n) time."
          bruteCode={SW_Q2_BRUTE}
          optCode={SW_Q2_OPT}
          lang="rust"
        />

        <QuestionCard
          title="Q3 · Minimum Size Subarray Sum"
          difficulty="Medium"
          bruteComplexity="O(n²)"
          optComplexity="O(n)"
          optSpaceComplexity="O(1)"
          problem={<>
            Given an array of <strong>positive</strong> integers <code style={{fontFamily:'monospace',color:'var(--code-blue)'}}>nums</code> and integer <code style={{fontFamily:'monospace',color:'var(--code-blue)'}}>target</code>, return the <strong>minimum length</strong> of a contiguous subarray with sum ≥ target. Return 0 if none exists.<br /><br />
            <strong>Examples:</strong><br />
            target=7, nums=[2,3,1,2,4,3] → <span style={{color:'var(--green)'}}>2</span> (subarray [4,3])<br />
            target=4, nums=[1,4,4] → <span style={{color:'var(--green)'}}>1</span> (subarray [4])<br />
            target=11, nums=[1,1,1,1,1,1,1,1] → <span style={{color:'var(--green)'}}>0</span><br /><br />
            <strong>Note:</strong> All values are positive — this means the sum only increases when you expand right, only decreases when you shrink left. This makes variable sliding window possible.
          </>}
          hint="Window size isn't fixed here. Expand right until sum >= target, then shrink left while still valid — recording minimum length each time you shrink."
          answer="Variable-size sliding window. Expand right greedily, then while valid (sum >= target) shrink left to minimize the window — recording length each time. O(n) because each element enters/leaves at most once."
          bruteCode={SW_Q3_BRUTE}
          optCode={SW_Q3_OPT}
          lang="rust"
        />

        <QuestionCard
          title="Q4 · Longest Substring with K Distinct Characters"
          difficulty="Medium"
          bruteComplexity="O(n²)"
          optComplexity="O(n)"
          optSpaceComplexity="O(k)"
          problem={<>
            Given a string <code style={{fontFamily:'monospace',color:'var(--code-blue)'}}>s</code> and integer <code style={{fontFamily:'monospace',color:'var(--code-blue)'}}>k</code>, return the length of the <strong>longest substring with at most k distinct characters</strong>.<br /><br />
            <strong>Examples:</strong><br />
            s=&quot;araaci&quot;, k=2 → <span style={{color:'var(--green)'}}>4</span> (&quot;araa&quot;)<br />
            s=&quot;araaci&quot;, k=1 → <span style={{color:'var(--green)'}}>2</span> (&quot;aa&quot;)<br />
            s=&quot;cbbebi&quot;, k=3 → <span style={{color:'var(--green)'}}>5</span> (&quot;cbbeb&quot;)<br /><br />
            <strong>Key difference from Q2:</strong> We allow repeats but cap the number of <em>distinct</em> characters. Use a frequency map — when len(freq) exceeds k, shrink.
          </>}
          hint="Use a frequency map. When len(freq) > k, shrink from left. When a char's count drops to 0, delete it from the map — so len(freq) always reflects the true distinct count."
          answer="A frequency map tracks what's in the window. Adding a new distinct char pushes us over k → slide left until a char's count hits zero and gets removed. Distinct count drops back to k. O(n) time, O(k) space."
          bruteCode={SW_Q4_BRUTE}
          optCode={SW_Q4_OPT}
          lang="rust"
        />

        <QuestionCard
          title="Q5 · Permutation in String"
          difficulty="Medium"
          bruteComplexity="O(n·m)"
          optComplexity="O(n)"
          optSpaceComplexity="O(1)"
          problem={<>
            Given strings <code style={{fontFamily:'monospace',color:'var(--code-blue)'}}>s1</code> and <code style={{fontFamily:'monospace',color:'var(--code-blue)'}}>s2</code>, return <strong>true</strong> if any permutation of s1 exists as a substring of s2.<br /><br />
            <strong>Examples:</strong><br />
            s1=&quot;ab&quot;, s2=&quot;eidbaooo&quot; → <span style={{color:'var(--green)'}}>True</span> (s2 contains &quot;ba&quot;)<br />
            s1=&quot;ab&quot;, s2=&quot;eidboaoo&quot; → <span style={{color:'var(--red)'}}>False</span><br /><br />
            <strong>Key insight:</strong> two strings are permutations of each other if and only if they have identical character frequencies. So the problem becomes: does any fixed-size window in s2 have the same frequency map as s1?
          </>}
          hint="Maintain a frequency map of a fixed-size window (size = len(s1)) in s2. Slide it: add one char on the right, remove one on the left. Compare to s1's map each step."
          answer="Fixed window of size len(s1). Update frequency map in O(1) per slide (add one char, remove one char). Compare maps each step. Two maps equal → permutation found. O(n) time, O(1) space (26 letters max)."
          bruteCode={SW_Q5_BRUTE}
          optCode={SW_Q5_OPT}
          lang="rust"
        />

      </Sub>

      {/* ══════════════════════════════════════════ */}
      {/*  PRACTICE QUESTIONS                       */}
      {/* ══════════════════════════════════════════ */}
      <Sub num="②" title="Practice Questions — Try These Yourself">

        <Callout type="tip">
          Attempt each problem yourself first. Use the hint only if you&apos;re stuck after
          a few minutes. Click <strong>Reveal Answer</strong> when you&apos;re ready to compare —
          the countdown gives you one last moment to think.
        </Callout>

        <QuestionCard
          title="P1 · Maximum Average Subarray I"
          difficulty="Easy"
          bruteComplexity="O(n·k)"
          optComplexity="O(n)"
          optSpaceComplexity="O(1)"
          problem={<>
            Given integer array <code style={{fontFamily:'monospace',color:'var(--code-blue)'}}>nums</code> and integer <code style={{fontFamily:'monospace',color:'var(--code-blue)'}}>k</code>, find the contiguous subarray of length k that has the <strong>maximum average value</strong> and return that average.<br /><br />
            <strong>Example:</strong><br />
            nums=[1,12,-5,-6,50,3], k=4 → <span style={{color:'var(--green)'}}>12.75</span><br />
            <em>Subarray [12,-5,-6,50] sums to 51 → average 51/4 = 12.75</em>
          </>}
          hint="Maximizing average = maximizing sum (same k for all windows). Find max sum of size k, then divide by k at the very end."
          answer="Same as Q1 — sliding window of fixed size k — but return max_sum / k instead of max_sum. O(n) time, O(1) space."
          answerCode={SW_P1_CODE}
          bruteCode={`// O(n*k): sum each window from scratch\nfn brute(nums: &[i32], k: usize) -> f64 {\n    let mut max_sum = i32::MIN;\n    for i in 0..=(nums.len() - k) {\n        let window_sum: i32 = nums[i..i + k].iter().sum();\n        max_sum = max_sum.max(window_sum);\n    }\n    max_sum as f64 / k as f64\n}`}
          optCode={SW_P1_CODE}
          lang="rust"
        />

        <QuestionCard
          title="P2 · Longest Repeating Character Replacement"
          difficulty="Medium"
          bruteComplexity="O(n²)"
          optComplexity="O(n)"
          optSpaceComplexity="O(1)"
          problem={<>
            Given string <code style={{fontFamily:'monospace',color:'var(--code-blue)'}}>s</code> and integer <code style={{fontFamily:'monospace',color:'var(--code-blue)'}}>k</code>, you may replace any character with any other, at most k times total. Return the length of the <strong>longest substring of identical characters</strong> you can achieve.<br /><br />
            <strong>Examples:</strong><br />
            s=&quot;ABAB&quot;, k=2 → <span style={{color:'var(--green)'}}>4</span> (replace both A&apos;s or both B&apos;s)<br />
            s=&quot;AABABBA&quot;, k=1 → <span style={{color:'var(--green)'}}>4</span>
          </>}
          hint="A window is valid if (window_size - count_of_most_frequent_char) <= k. That expression = how many replacements you need. Track the max frequency char as you expand."
          answer="Greedy: window_size - max_freq = replacements needed. While > k, shrink left. We only need to track max_freq (not which char), because we're trying to maximize window size. O(n) time, O(1) space."
          answerCode={SW_P2_CODE}
          bruteCode={`// O(n²): try all start positions\nfn brute(s: &str, k: usize) -> usize {\n    use std::collections::HashMap;\n    let chars: Vec<char> = s.chars().collect();\n    let mut max_len = 0usize;\n    for i in 0..chars.len() {\n        let mut freq: HashMap<char, usize> = HashMap::new();\n        for j in i..chars.len() {\n            *freq.entry(chars[j]).or_insert(0) += 1;\n            let max_f = *freq.values().max().unwrap();\n            if (j - i + 1) - max_f <= k {\n                max_len = max_len.max(j - i + 1);\n            }\n        }\n    }\n    max_len\n}`}
          optCode={SW_P2_CODE}
          lang="rust"
        />

        <QuestionCard
          title="P3 · Max Consecutive Ones III"
          difficulty="Medium"
          bruteComplexity="O(n²)"
          optComplexity="O(n)"
          optSpaceComplexity="O(1)"
          problem={<>
            Given binary array <code style={{fontFamily:'monospace',color:'var(--code-blue)'}}>nums</code> and integer <code style={{fontFamily:'monospace',color:'var(--code-blue)'}}>k</code>, you may flip at most k zeros to ones. Return the <strong>maximum number of consecutive ones</strong>.<br /><br />
            <strong>Examples:</strong><br />
            nums=[1,1,1,0,0,0,1,1,1,1,0], k=2 → <span style={{color:'var(--green)'}}>6</span><br />
            nums=[0,0,1,1,0,0,1,1,1,0,1,1,0,0,0,1,1,1,1,0], k=3 → <span style={{color:'var(--green)'}}>10</span>
          </>}
          hint="Think of k as your 'flip budget'. Track zeros in the window. If zeros > k, you overspent — shrink from left until you remove a zero to get back under budget."
          answer="Sliding window where the validity condition is: zeros in window <= k. Expand right freely, shrink left when zeros > k (removing a zero restores one flip). O(n) time, O(1) space."
          answerCode={SW_P3_CODE}
          bruteCode={`// O(n²): try all start positions\nfn brute(nums: &[i32], k: usize) -> usize {\n    let mut max_len = 0usize;\n    for i in 0..nums.len() {\n        let mut zeros = 0usize;\n        for j in i..nums.len() {\n            if nums[j] == 0 { zeros += 1; }\n            if zeros <= k {\n                max_len = max_len.max(j - i + 1);\n            } else {\n                break;\n            }\n        }\n    }\n    max_len\n}`}
          optCode={SW_P3_CODE}
          lang="rust"
        />

        <QuestionCard
          title="P4 · Minimum Window Substring"
          difficulty="Hard"
          bruteComplexity="O(n²)"
          optComplexity="O(n)"
          optSpaceComplexity="O(n)"
          problem={<>
            Given strings <code style={{fontFamily:'monospace',color:'var(--code-blue)'}}>s</code> and <code style={{fontFamily:'monospace',color:'var(--code-blue)'}}>t</code>, return the <strong>minimum window in s</strong> that contains all characters of t (with at least the same frequencies). Return &quot;&quot; if no such window exists.<br /><br />
            <strong>Examples:</strong><br />
            s=&quot;ADOBECODEBANC&quot;, t=&quot;ABC&quot; → <span style={{color:'var(--green)'}}>BANC</span><br />
            s=&quot;a&quot;, t=&quot;a&quot; → <span style={{color:'var(--green)'}}>a</span><br />
            s=&quot;a&quot;, t=&quot;aa&quot; → <span style={{color:'var(--green)'}}>&quot;&quot;</span> (can&apos;t form &quot;aa&quot; from just &quot;a&quot;)
          </>}
          hint="Expand right until you have all chars from t (use a 'formed' counter: increments when a char's count hits its required amount). Once valid, shrink left to minimize."
          answer="Two-frequency-map approach. 'formed' tracks fully-satisfied requirements. Expand until formed == required, then shrink while still valid — saving the smallest window seen. Classic hard sliding window — worth studying carefully."
          answerCode={SW_P4_CODE}
          bruteCode={`// O(n²): check every substring\nfn brute(s: &str, t: &str) -> String {\n    use std::collections::HashMap;\n    let s_chars: Vec<char> = s.chars().collect();\n    let mut need: HashMap<char, i32> = HashMap::new();\n    for c in t.chars() { *need.entry(c).or_insert(0) += 1; }\n    let mut best = String::new();\n    for i in 0..s_chars.len() {\n        let mut wc: HashMap<char, i32> = HashMap::new();\n        for j in i..s_chars.len() {\n            *wc.entry(s_chars[j]).or_insert(0) += 1;\n            if need.iter().all(|(c, &r)| *wc.get(c).unwrap_or(&0) >= r) {\n                let window: String = s_chars[i..=j].iter().collect();\n                if best.is_empty() || window.len() < best.len() {\n                    best = window;\n                }\n                break;\n            }\n        }\n    }\n    best\n}`}
          optCode={SW_P4_CODE}
          lang="rust"
        />

        <QuestionCard
          title="P5 · Sliding Window Maximum"
          difficulty="Hard"
          bruteComplexity="O(n·k)"
          optComplexity="O(n)"
          optSpaceComplexity="O(k)"
          problem={<>
            Given array <code style={{fontFamily:'monospace',color:'var(--code-blue)'}}>nums</code> and integer <code style={{fontFamily:'monospace',color:'var(--code-blue)'}}>k</code>, return an array of the <strong>maximum value in each sliding window of size k</strong>.<br /><br />
            <strong>Example:</strong><br />
            nums=[1,3,-1,-3,5,3,6,7], k=3 → <span style={{color:'var(--green)'}}>[3,3,5,5,6,7]</span><br />
            <em>Windows: [1,3,-1]→3, [3,-1,-3]→3, [-1,-3,5]→5, [-3,5,3]→5, [5,3,6]→6, [3,6,7]→7</em>
          </>}
          hint="You need O(1) max per window. Use a monotonic decreasing deque of indices. Key insight: if a new element is larger than anything in the deque, those smaller elements can never be the max — discard them."
          answer="Monotonic decreasing deque. Front = current window's max. Remove front when out-of-window. Remove back when back's value < new element (it's now permanently useless). Each element pushed/popped once → O(n) total."
          answerCode={SW_P5_CODE}
          bruteCode={`// O(n*k): max of every window directly\nfn brute(nums: &[i32], k: usize) -> Vec<i32> {\n    (0..=(nums.len() - k))\n        .map(|i| *nums[i..i + k].iter().max().unwrap())\n        .collect()\n}`}
          optCode={SW_P5_CODE}
          lang="rust"
        />

      </Sub>

    </div>
  )
}
