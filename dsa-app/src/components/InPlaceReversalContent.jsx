import { useState } from 'react'
import QuestionCard from './QuestionCard'
import CodeBlock from './CodeBlock'
import BigOBadge from './BigOBadge'
import SectionHeader from './SectionHeader'

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

const IPR_VISUAL = `
IN-PLACE REVERSAL — reverse a linked list without extra space

Original: 1 → 2 → 3 → 4 → 5 → None
           ↑
          head

The trick: walk forward with three pointers (prev, curr, next)
           and flip each arrow as you go.

Step 0:  prev=None   curr=1   next=?

Step 1:  save next = curr.next  (= 2)
         curr.next = prev       (flip arrow: 1 → None)
         prev = curr            (prev moves to 1)
         curr = next            (curr moves to 2)
         State: None ← 1    2 → 3 → 4 → 5 → None

Step 2:  save next = 3
         curr.next = prev  (2 → 1)
         prev = 2,  curr = 3
         State: None ← 1 ← 2    3 → 4 → 5 → None

Step 3:  save next = 4
         curr.next = prev  (3 → 2)
         prev = 3,  curr = 4

Step 4:  save next = 5
         curr.next = prev  (4 → 3)
         prev = 4,  curr = 5

Step 5:  save next = None
         curr.next = prev  (5 → 4)
         prev = 5,  curr = None   ← loop ends

Result:  5 → 4 → 3 → 2 → 1 → None   new head = prev = 5

KEY: "save next BEFORE flipping, then flip, then advance"
`

// Educational approach note shown once for context
const nodeClass = `// Educational approach: represent list as Vec<i32>, reverse in-place
// Rust ownership makes pointer-based linked lists complex for learning,
// so we simulate with a Vec<i32> — the algorithms are identical in logic.

fn reverse_list(nums: &mut Vec<i32>) {
    let mut left = 0usize;
    let mut right = nums.len() - 1;
    while left < right {
        nums.swap(left, right);
        left += 1;
        right -= 1;
    }
}`

// ─── TAUGHT Q1: Reverse a Linked List ───────────────────────────────────────
const ipr1Brute = `// Brute force: collect all values into a new Vec, fill back in reverse order
fn reverse_list_brute(nums: &mut Vec<i32>) {
    let vals: Vec<i32> = nums.clone();   // pass 1: snapshot all values
    let n = vals.len();
    for i in 0..n {                      // pass 2: fill in reverse order
        nums[i] = vals[n - 1 - i];
    }
}`

const ipr1Opt = `// Optimised: two-pointer in-place swap — O(n) time, O(1) space
fn reverse_list(nums: &mut Vec<i32>) {
    let mut left = 0usize;
    let mut right = nums.len() - 1;     // will wrap if empty, guard below
    while left < right {
        nums.swap(left, right);          // swap() is built-in on Vec/slice
        left += 1;
        right -= 1;
    }
}

// --- example usage ---
fn main() {
    let mut list = vec![1, 2, 3, 4, 5];
    reverse_list(&mut list);
    println!("{:?}", list); // [5, 4, 3, 2, 1]
}`

// ─── TAUGHT Q2: Reverse a Sub-list ──────────────────────────────────────────
const ipr2Brute = `// Brute force: reverse the slice [p-1 .. q-1] using a temp Vec
// p and q are 1-indexed positions
fn reverse_between_brute(nums: &mut Vec<i32>, p: usize, q: usize) {
    let slice: Vec<i32> = nums[p - 1..=q - 1].iter().copied().rev().collect();
    nums[p - 1..=q - 1].copy_from_slice(&slice);
}`

const ipr2Opt = `// Optimised: two-pointer swap directly inside the slice — O(n) time, O(1) space
// p and q are 1-indexed positions
fn reverse_between(nums: &mut Vec<i32>, p: usize, q: usize) {
    if p >= q { return; }            // nothing to reverse
    let mut left = p - 1;            // convert to 0-indexed
    let mut right = q - 1;
    while left < right {
        nums.swap(left, right);      // swap() avoids borrow-checker issues
        left += 1;
        right -= 1;
    }
}

// --- example usage ---
fn main() {
    let mut list = vec![1, 2, 3, 4, 5];
    reverse_between(&mut list, 2, 4);
    println!("{:?}", list); // [1, 4, 3, 2, 5]
}`

// ─── TAUGHT Q3: Reverse Every K-element Sub-list ────────────────────────────
const ipr3Brute = `// Brute force: collect values into chunks, reverse full chunks, rebuild
fn reverse_k_group_brute(nums: &mut Vec<i32>, k: usize) {
    let n = nums.len();
    let mut result: Vec<i32> = Vec::with_capacity(n);
    let mut i = 0;
    while i < n {
        let end = (i + k).min(n);
        if end - i == k {
            // full chunk — push reversed
            for j in (i..end).rev() {
                result.push(nums[j]);
            }
        } else {
            // leftover chunk — push as-is
            result.extend_from_slice(&nums[i..end]);
        }
        i += k;
    }
    nums.copy_from_slice(&result);
}`

const ipr3Opt = `// Optimised: reverse each k-sized window in-place, skip leftover tail
fn reverse_k_group(nums: &mut Vec<i32>, k: usize) {
    let n = nums.len();
    let mut start = 0usize;
    while start + k <= n {           // only process full groups
        let end = start + k - 1;
        let mut l = start;
        let mut r = end;
        while l < r {
            nums.swap(l, r);         // standard two-pointer swap
            l += 1;
            r -= 1;
        }
        start += k;                  // advance to next group
    }
    // tail (fewer than k nodes) is left untouched automatically
}

// --- example usage ---
fn main() {
    let mut list = vec![1, 2, 3, 4, 5, 6, 7, 8];
    reverse_k_group(&mut list, 3);
    println!("{:?}", list); // [3, 2, 1, 6, 5, 4, 7, 8]
}`

// ─── TAUGHT Q4: Rotate a Linked List ────────────────────────────────────────
const ipr4Brute = `// Brute force: rotate the Vec right by 1, k times
fn rotate_right_brute(nums: &mut Vec<i32>, k: usize) {
    let n = nums.len();
    if n == 0 { return; }
    let k = k % n;
    for _ in 0..k {
        let last = nums.pop().unwrap(); // remove last element
        nums.insert(0, last);           // insert at front — O(n) per step
    }
}`

const ipr4Opt = `// Optimised: three-reversal trick — O(n) time, O(1) space
// Rotating right by k == reverse all, reverse first k, reverse rest
fn rotate_right(nums: &mut Vec<i32>, k: usize) {
    let n = nums.len();
    if n == 0 { return; }
    let k = k % n;                   // rotating by n is a no-op
    if k == 0 { return; }

    // helper: reverse nums[lo..=hi] in place
    fn rev(nums: &mut Vec<i32>, mut lo: usize, mut hi: usize) {
        while lo < hi { nums.swap(lo, hi); lo += 1; hi -= 1; }
    }

    rev(nums, 0, n - 1);             // step 1: reverse entire slice
    rev(nums, 0, k - 1);             // step 2: reverse first k elements
    rev(nums, k, n - 1);             // step 3: reverse remaining elements
}

// --- example usage ---
fn main() {
    let mut list = vec![1, 2, 3, 4, 5];
    rotate_right(&mut list, 2);
    println!("{:?}", list); // [4, 5, 1, 2, 3]
}`

// ─── TAUGHT Q5: Reverse Alternating K-element Sub-list ──────────────────────
const ipr5Brute = `// Brute force: collect values, reverse alternating chunks, rebuild
fn reverse_alternate_k_groups_brute(nums: &mut Vec<i32>, k: usize) {
    let n = nums.len();
    let mut result: Vec<i32> = Vec::with_capacity(n);
    let mut i = 0;
    let mut should_reverse = true;
    while i < n {
        let end = (i + k).min(n);
        if should_reverse {
            for j in (i..end).rev() { result.push(nums[j]); }
        } else {
            result.extend_from_slice(&nums[i..end]);
        }
        i += k;
        should_reverse = !should_reverse;   // alternate each chunk
    }
    nums.copy_from_slice(&result);
}`

const ipr5Opt = `// Optimised: reverse k elements in-place, then skip k elements, repeat
fn reverse_alternate_k_groups(nums: &mut Vec<i32>, k: usize) {
    let n = nums.len();
    let mut start = 0usize;
    loop {
        if start >= n { break; }

        // --- PHASE 1: reverse k elements starting at 'start' ---
        let end = (start + k).min(n);    // clamp to list end
        let mut l = start;
        let mut r = end - 1;
        while l < r {
            nums.swap(l, r);
            l += 1;
            r -= 1;
        }
        start += k;                      // move past reversed chunk

        // --- PHASE 2: skip k elements (leave them untouched) ---
        start += k;                      // jump over the skip window
    }
}

// --- example usage ---
fn main() {
    let mut list = vec![1, 2, 3, 4, 5, 6, 7, 8];
    reverse_alternate_k_groups(&mut list, 2);
    println!("{:?}", list); // [2, 1, 3, 4, 6, 5, 7, 8]
}`

// ─── PRACTICE answers ────────────────────────────────────────────────────────
const pq1Code = `// Swap Nodes in Pairs — reverse every 2-element group (k=2 special case)
fn swap_pairs(nums: &mut Vec<i32>) {
    let n = nums.len();
    let mut i = 0;
    while i + 1 < n {
        nums.swap(i, i + 1);   // swap adjacent pair
        i += 2;                // advance to next pair
    }
}

// --- example usage ---
fn main() {
    let mut list = vec![1, 2, 3, 4];
    swap_pairs(&mut list);
    println!("{:?}", list); // [2, 1, 4, 3]
}`

const pq2Code = `// Reverse Nodes in k-Group (same logic as Taught Q3)
fn reverse_k_group(nums: &mut Vec<i32>, k: usize) {
    let n = nums.len();
    let mut start = 0usize;
    while start + k <= n {       // only process complete groups
        let end = start + k - 1;
        let mut l = start;
        let mut r = end;
        while l < r {
            nums.swap(l, r);
            l += 1;
            r -= 1;
        }
        start += k;
    }
    // incomplete tail (< k elements) stays untouched
}

// --- example usage ---
fn main() {
    let mut list = vec![1, 2, 3, 4, 5];
    reverse_k_group(&mut list, 2);
    println!("{:?}", list); // [2, 1, 4, 3, 5]
}`

const pq3Code = `// Odd Even Linked List — gather odd-indexed values first, then even-indexed
// Uses index-based simulation: odd indices are 1,3,5... (1-indexed)
fn odd_even_list(nums: &mut Vec<i32>) {
    let odds:  Vec<i32> = nums.iter().enumerate()
        .filter(|(i, _)| i % 2 == 0)   // 0-indexed even → 1-indexed odd
        .map(|(_, &v)| v)
        .collect();
    let evens: Vec<i32> = nums.iter().enumerate()
        .filter(|(i, _)| i % 2 == 1)   // 0-indexed odd → 1-indexed even
        .map(|(_, &v)| v)
        .collect();
    let mut pos = 0;
    for v in odds.iter().chain(evens.iter()) {
        nums[pos] = *v;
        pos += 1;
    }
}

// --- example usage ---
fn main() {
    let mut list = vec![1, 2, 3, 4, 5];
    odd_even_list(&mut list);
    println!("{:?}", list); // [1, 3, 5, 2, 4]
}`

const pq4Code = `// Reverse Linked List II — same as Taught Q2
// p and q are 1-indexed
fn reverse_between(nums: &mut Vec<i32>, p: usize, q: usize) {
    if p >= q { return; }
    let mut left = p - 1;        // convert to 0-indexed
    let mut right = q - 1;
    while left < right {
        nums.swap(left, right);
        left += 1;
        right -= 1;
    }
}

// --- example usage ---
fn main() {
    let mut list = vec![1, 2, 3, 4, 5];
    reverse_between(&mut list, 2, 4);
    println!("{:?}", list); // [1, 4, 3, 2, 5]
}`

const pq5Code = `// Split Linked List in Parts — divide Vec into k chunks, largest chunks first
fn split_list_to_parts(nums: Vec<i32>, k: usize) -> Vec<Vec<i32>> {
    let n = nums.len();
    let base_size = n / k;       // minimum size of each part
    let extra = n % k;           // first 'extra' parts get one more element
    let mut result: Vec<Vec<i32>> = Vec::with_capacity(k);
    let mut pos = 0usize;
    for i in 0..k {
        let chunk_size = base_size + if i < extra { 1 } else { 0 };
        result.push(nums[pos..pos + chunk_size].to_vec());
        pos += chunk_size;
    }
    result
}

// --- example usage ---
fn main() {
    let list = vec![1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    let parts = split_list_to_parts(list, 3);
    for p in &parts { println!("{:?}", p); }
    // [1, 2, 3, 4]
    // [5, 6, 7]
    // [8, 9, 10]
}`

export default function InPlaceReversalContent() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>

      <Sub title="What is In-place Reversal?">
        <p style={{ lineHeight: 1.7 }}>
          Imagine you have a chain of paper clips: 1→2→3→4→5. You want to flip it
          to 5→4→3→2→1 <em>without using a second chain</em>. The trick? Walk along
          the chain with three fingers — one remembering where you came from
          (<code>prev</code>), one at your current clip (<code>curr</code>), and one
          peeking ahead (<code>next</code>). At each step, flip the clip's hook
          to point backward. That's in-place reversal: O(n) time, O(1) space.
        </p>
        <Callout type="tip">
          <strong>Trigger phrases:</strong> "reverse a linked list", "reverse a sublist",
          "rotate list", "reverse every k nodes". Any time you need to flip pointers
          without extra memory.
        </Callout>
      </Sub>

      <Sub title="How it works — ASCII walkthrough">
        <CodeBlock code={IPR_VISUAL} lang="text" />
        <Callout type="info">
          The three-pointer dance: <strong>save next → flip arrow → advance both pointers</strong>.
          Never forget to save <code>next</code> before overwriting <code>curr.next</code> —
          otherwise you lose the rest of the list forever.
        </Callout>
      </Sub>

      <Sub title="Educational setup (used in all problems)">
        <CodeBlock code={nodeClass} lang="rust" />
      </Sub>

      <Sub title="Taught Questions">
        <QuestionCard
          num={1}
          title="Reverse a Linked List"
          difficulty="Easy"
          problem={`Reverse a singly linked list in-place and return the new head.

Example: 1→2→3→4→5 → 5→4→3→2→1`}
          brute={<>
            <BigOBadge time="O(n)" space="O(n)" />
            <CodeBlock code={ipr1Brute} lang="rust" />
            <Callout type="warn">Stores all values — misses the point of "in-place".</Callout>
          </>}
          optimized={<>
            <BigOBadge time="O(n)" space="O(1)" />
            <CodeBlock code={ipr1Opt} lang="rust" />
            <Callout type="tip">
              <strong>Aha moment:</strong> Two pointers walking toward each other, swapping
              as they go. Rust's built-in <code>slice::swap</code> handles the borrow
              cleanly — no need for a temp variable.
              When <code>left</code> meets or passes <code>right</code>, the list is reversed.
            </Callout>
            <Callout type="danger">
              <strong>Common mistake:</strong> Using <code>nums.len() - 1</code> as a
              <code>usize</code> when the Vec is empty causes a wrapping underflow in Rust.
              Always guard with <code>if nums.is_empty() {'{ return; }'}</code> first.
            </Callout>
          </>}
          answer="Two pointers left=0, right=len-1. Swap and converge. Rust's nums.swap(l, r) makes this clean and safe."
        />

        <QuestionCard
          num={2}
          title="Reverse a Sub-list"
          difficulty="Medium"
          problem={`Given a linked list and positions left and right, reverse the nodes from position left to right (1-indexed). Return the modified list.

Example: 1→2→3→4→5, left=2, right=4 → 1→4→3→2→5`}
          brute={<>
            <BigOBadge time="O(n)" space="O(n)" />
            <CodeBlock code={ipr2Brute} lang="rust" />
          </>}
          optimized={<>
            <BigOBadge time="O(n)" space="O(1)" />
            <CodeBlock code={ipr2Opt} lang="rust" />
            <Callout type="tip">
              <strong>Aha moment:</strong> Convert 1-indexed <code>p</code> and <code>q</code>
              to 0-indexed, then run the same two-pointer swap inside the window.
              Everything outside <code>[p-1 .. q-1]</code> is untouched.
            </Callout>
            <Callout type="danger">
              <strong>Common mistake:</strong> Off-by-one when converting to 0-indexed.
              Position <code>left</code> (1-indexed) maps to index <code>left - 1</code>.
              Use <code>p - 1</code> and <code>q - 1</code> consistently.
            </Callout>
          </>}
          answer="Convert p,q to 0-indexed. Two-pointer swap from left=p-1 to right=q-1, converging inward."
        />

        <QuestionCard
          num={3}
          title="Reverse Every K-element Sub-list"
          difficulty="Medium"
          problem={`Given a linked list, reverse every k nodes as a group. If the last group has fewer than k nodes, leave them as-is.

Example: 1→2→3→4→5→6→7→8, k=3 → 3→2→1→6→5→4→7→8`}
          brute={<>
            <BigOBadge time="O(n)" space="O(n)" />
            <CodeBlock code={ipr3Brute} lang="rust" />
          </>}
          optimized={<>
            <BigOBadge time="O(n)" space="O(1)" />
            <CodeBlock code={ipr3Opt} lang="rust" />
            <Callout type="tip">
              <strong>Aha moment:</strong> The guard <code>start + k &lt;= n</code> ensures
              we only reverse complete groups. The tail (fewer than k elements) is
              automatically skipped. Each window is reversed with the same two-pointer swap.
            </Callout>
            <Callout type="danger">
              <strong>Common mistake:</strong> Forgetting to check if there are k nodes left
              before reversing. Reversing a partial group at the end is wrong — leave it as-is.
            </Callout>
          </>}
          answer="Loop with start+=k. Guard: start+k <= n. Two-pointer swap inside [start .. start+k-1]. Tail left untouched."
        />

        <QuestionCard
          num={4}
          title="Rotate a Linked List"
          difficulty="Medium"
          problem={`Given a linked list and integer k, rotate the list to the right by k places.

Example: 1→2→3→4→5, k=2 → 4→5→1→2→3`}
          brute={<>
            <BigOBadge time="O(n·k)" space="O(1)" />
            <CodeBlock code={ipr4Brute} lang="rust" />
            <Callout type="warn">O(n·k) — terrible when k is huge.</Callout>
          </>}
          optimized={<>
            <BigOBadge time="O(n)" space="O(1)" />
            <CodeBlock code={ipr4Opt} lang="rust" />
            <Callout type="tip">
              <strong>Aha moment:</strong> Three reversals is all it takes. Rotating right
              by k is equivalent to: reverse all → reverse first k → reverse rest.
              Reduce k with <code>k % n</code> first so you never do unnecessary work.
            </Callout>
            <Callout type="danger">
              <strong>Common mistake:</strong> Forgetting <code>k = k % n</code>.
              If k equals the list length, nothing should change — but a naive rotation
              would do n swaps.
            </Callout>
          </>}
          answer="k %= n, then three-reversal trick: reverse all, reverse [0..k-1], reverse [k..n-1]."
        />

        <QuestionCard
          num={5}
          title="Reverse Alternating K-element Sub-list"
          difficulty="Hard"
          problem={`Given a linked list and k, reverse k nodes, skip k nodes, reverse k nodes, skip k nodes... and so on.

Example: 1→2→3→4→5→6→7→8, k=2 → 2→1→3→4→6→5→7→8`}
          brute={<>
            <BigOBadge time="O(n)" space="O(n)" />
            <CodeBlock code={ipr5Brute} lang="rust" />
          </>}
          optimized={<>
            <BigOBadge time="O(n)" space="O(1)" />
            <CodeBlock code={ipr5Opt} lang="rust" />
            <Callout type="tip">
              <strong>Aha moment:</strong> Two phases per iteration — reverse k elements
              (two-pointer swap on the current window), then skip k elements (just advance
              the start index). Advancing <code>start += k</code> twice in one loop body
              handles both phases cleanly.
            </Callout>
            <Callout type="danger">
              <strong>Common mistake:</strong> Using <code>(start + k).min(n)</code> for the
              reverse end is important — the last reverse window may be smaller than k if
              the list length isn't a multiple of 2k.
            </Callout>
          </>}
          answer="Loop: two-pointer swap on [start .. start+k), then start += k twice (once for reverse window, once for skip window)."
        />
      </Sub>

      <Sub title="Practice Questions">
        <Callout type="info">Try these on your own first. Hints are there if you get stuck. Answer reveals after 3 seconds.</Callout>

        <QuestionCard
          num={6}
          title="Swap Nodes in Pairs"
          difficulty="Medium"
          practice
          problem={`Swap every two adjacent nodes in a linked list and return the head. Don't change node values — actually swap the nodes.

Example: 1→2→3→4 → 2→1→4→3`}
          hints={[
            "This is reverse-every-2 — special case of reverse k-group with k=2.",
            "Walk with a step of 2, swapping nums[i] and nums[i+1] each time.",
            "Guard i + 1 < n so you don't go out of bounds on an odd-length list.",
          ]}
          answer="Step by 2: while i+1 < n { nums.swap(i, i+1); i += 2; }"
          answerCode={pq1Code}
          lang="rust"
        />

        <QuestionCard
          num={7}
          title="Reverse Nodes in k-Group"
          difficulty="Hard"
          practice
          problem={`Reverse the nodes of a linked list k at a time. If the remaining nodes are fewer than k, leave them as-is.

Example: 1→2→3→4→5, k=2 → 2→1→4→3→5`}
          hints={[
            "Guard start + k <= n before reversing each window — incomplete tails stay as-is.",
            "Two-pointer swap on [start .. start+k-1] reverses the window in place.",
            "Advance start += k after each window and repeat.",
          ]}
          answer="while start + k <= n: two-pointer swap [start..start+k-1], then start += k."
          answerCode={pq2Code}
          lang="rust"
        />

        <QuestionCard
          num={8}
          title="Odd Even Linked List"
          difficulty="Medium"
          practice
          problem={`Rearrange a linked list so all odd-indexed nodes come first, then all even-indexed nodes. 1-indexed. Do it in O(1) space.

Example: 1→2→3→4→5 → 1→3→5→2→4`}
          hints={[
            "Collect odd-indexed values (0-indexed even positions) and even-indexed values separately.",
            "Concatenate odds then evens and write back into the slice.",
            "In Rust, iterator + enumerate() + filter() makes this clean.",
          ]}
          answer="Partition by index parity, collect odds then evens, write back in order."
          answerCode={pq3Code}
          lang="rust"
        />

        <QuestionCard
          num={9}
          title="Reverse Linked List II"
          difficulty="Medium"
          practice
          problem={`Reverse a linked list from position left to right (1-indexed) in one pass.

Example: 1→2→3→4→5, left=2, right=4 → 1→4→3→2→5`}
          hints={[
            "Convert 1-indexed left/right to 0-indexed left-1 / right-1.",
            "Two-pointer swap from both ends of the window, converging inward.",
            "Everything outside the window is untouched.",
          ]}
          answer="left_idx = left-1, right_idx = right-1. Two-pointer swap converging inward."
          answerCode={pq4Code}
          lang="rust"
        />

        <QuestionCard
          num={10}
          title="Split Linked List in Parts"
          difficulty="Medium"
          practice
          problem={`Split a linked list into k consecutive parts. Parts should be as equal in length as possible — earlier parts are larger if sizes differ. Return an array of k heads (use null for empty parts).

Example: 1→2→3→4→5→6→7→8→9→10, k=3 → [[1,2,3,4],[5,6,7],[8,9,10]]`}
          hints={[
            "base_size = n / k, extra = n % k. First 'extra' parts get base_size+1 elements.",
            "Walk pos through the slice, slicing off each chunk of the right size.",
            "Use nums[pos..pos+chunk_size].to_vec() to grab each chunk.",
          ]}
          answer="base_size = n/k, extra = n%k. For each i in 0..k: chunk_size = base_size + (i < extra ? 1 : 0), slice and advance pos."
          answerCode={pq5Code}
          lang="rust"
        />
      </Sub>

    </div>
  )
}
