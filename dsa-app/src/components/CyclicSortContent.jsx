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

const CS_VISUAL = `
CYCLIC SORT — place each number in its correct index slot
Array: [3, 1, 5, 4, 2]   (numbers 1..5, each belongs at index num-1)

Step 1: i=0, nums[0]=3 → should be at index 2 → SWAP with nums[2]
        [5, 1, 3, 4, 2]   (3 is now correct, but 5 landed at i=0)

Step 2: i=0, nums[0]=5 → should be at index 4 → SWAP with nums[4]
        [2, 1, 3, 4, 5]   (5 correct, 2 landed at i=0)

Step 3: i=0, nums[0]=2 → should be at index 1 → SWAP with nums[1]
        [1, 2, 3, 4, 5]   (2 correct, 1 landed at i=0)

Step 4: i=0, nums[0]=1 → already at index 0 ✓ → advance i to 1

Step 5..4: all already correct → advance i each time

Result: [1, 2, 3, 4, 5]  — fully sorted in O(n) with O(1) space!

KEY INSIGHT: each swap places at least one number correctly
             so total swaps ≤ n, giving O(n) overall
`

// ─── TAUGHT Q1: Cyclic Sort (basic) ─────────────────────────────────────────
const cs1Brute = `// Brute force: just use Rust's built-in sort
fn cyclic_sort_brute(nums: &mut Vec<i32>) {
    nums.sort();  // O(n log n) — wastes the "range 1..n" hint
}`

const cs1Opt = `// Optimised: place every number at index (num - 1) directly
fn cyclic_sort(nums: &mut Vec<i32>) {
    let mut i = 0usize;
    while i < nums.len() {
        // where should nums[i] live?  number 3 → index 2 = num-1
        let j = (nums[i] - 1) as usize;
        if nums[i] != nums[j] {  // if it's NOT already home
            // swap it to its correct slot
            nums.swap(i, j);
            // DON'T advance i — the number that landed here might also need moving
        } else {
            i += 1;  // this slot is correct, move on
        }
    }
}`

// ─── TAUGHT Q2: Find Missing Number ─────────────────────────────────────────
const cs2Brute = `// Brute force: sort then scan for the gap
fn missing_number_brute(mut nums: Vec<i32>) -> i32 {
    nums.sort();  // O(n log n)
    for i in 0..nums.len() {
        if nums[i] != i as i32 {  // index i should hold i
            return i as i32;
        }
    }
    nums.len() as i32  // gap is at the very end
}`

const cs2Opt = `// Optimised: cyclic sort then one scan
fn missing_number(mut nums: Vec<i32>) -> i32 {
    let n = nums.len();
    let mut i = 0usize;
    while i < n {
        let j = nums[i] as usize;  // number x belongs at index x (range 0..n)
        // only swap if correct index is in bounds AND not already there
        if j < n && nums[i] != nums[j] {
            nums.swap(i, j);
        } else {
            i += 1;  // this slot is fine, move on
        }
    }
    // second pass: find the index whose value doesn't match
    for i in 0..n {
        if nums[i] != i as i32 {
            return i as i32;  // i is missing!
        }
    }
    n as i32  // 0..n-1 all present, n is missing
}`

// ─── TAUGHT Q3: Find All Missing Numbers ────────────────────────────────────
const cs3Brute = `// Brute force: use a HashSet, then check what's absent
use std::collections::HashSet;

fn find_all_missing_brute(nums: Vec<i32>) -> Vec<i32> {
    let seen: HashSet<i32> = nums.iter().cloned().collect();  // O(n) space
    let n = nums.len();
    (1..=n as i32).filter(|x| !seen.contains(x)).collect()
}`

const cs3Opt = `// Optimised: cyclic sort then scan for mismatches
fn find_all_missing(mut nums: Vec<i32>) -> Vec<i32> {
    let n = nums.len();
    let mut i = 0usize;
    while i < n {
        // number x should sit at index x-1
        let j = (nums[i] - 1) as usize;
        if nums[i] != nums[j] {     // not home yet → swap
            nums.swap(i, j);
        } else {
            i += 1;                 // already correct, advance
        }
    }
    let mut missing = Vec::new();
    for i in 0..n {
        if nums[i] != (i + 1) as i32 {  // index i should hold i+1
            missing.push((i + 1) as i32);  // so i+1 is a missing number
        }
    }
    missing
}`

// ─── TAUGHT Q4: Find Duplicate Number ───────────────────────────────────────
const cs4Brute = `// Brute force: seen set
use std::collections::HashSet;

fn find_duplicate_brute(nums: Vec<i32>) -> i32 {
    let mut seen = HashSet::new();
    for &n in &nums {
        if !seen.insert(n) {
            return n;  // second time we see it → duplicate
        }
    }
    -1
}`

const cs4Opt = `// Optimised: cyclic sort — the duplicate ends up in the wrong slot
fn find_duplicate(mut nums: Vec<i32>) -> i32 {
    let mut i = 0usize;
    while i < nums.len() {
        // number x belongs at index x-1 (range 1..n)
        let j = (nums[i] - 1) as usize;
        if nums[i] != (i + 1) as i32 {       // not already home?
            if nums[i] != nums[j] {           // and the slot isn't already taken?
                nums.swap(i, j);
            } else {
                // can't place it — the slot already has the same number!
                return nums[i];               // this IS the duplicate
            }
        } else {
            i += 1;
        }
    }
    -1
}`

// ─── TAUGHT Q5: Find All Duplicates ─────────────────────────────────────────
const cs5Brute = `// Brute force: sort and check adjacent
fn find_all_duplicates_brute(mut nums: Vec<i32>) -> Vec<i32> {
    nums.sort();
    let mut result = Vec::new();
    for i in 1..nums.len() {
        if nums[i] == nums[i - 1] {
            result.push(nums[i]);
        }
    }
    result
}`

const cs5Opt = `// Optimised: cyclic sort then scan for nums[i] != i+1
fn find_all_duplicates(mut nums: Vec<i32>) -> Vec<i32> {
    let mut i = 0usize;
    while i < nums.len() {
        let j = (nums[i] - 1) as usize;  // number x lives at index x-1
        if nums[i] != nums[j] {           // swap if the slot is different
            nums.swap(i, j);
        } else {
            i += 1;                       // already correct (or duplicate blocked)
        }
    }
    let mut duplicates = Vec::new();
    for i in 0..nums.len() {
        if nums[i] != (i + 1) as i32 {   // mismatch → nums[i] is a duplicate
            duplicates.push(nums[i]);
        }
    }
    duplicates
}`

// ─── PRACTICE answers ────────────────────────────────────────────────────────
const pq1Code = `// Set Mismatch — one number duplicated, one missing
fn find_error_nums(mut nums: Vec<i32>) -> Vec<i32> {
    let mut i = 0usize;
    while i < nums.len() {
        let j = (nums[i] - 1) as usize;  // number x → index x-1
        if nums[i] != nums[j] {          // not home → swap
            nums.swap(i, j);
        } else {
            i += 1;
        }
    }
    for i in 0..nums.len() {
        if nums[i] != (i + 1) as i32 {
            // nums[i] is the duplicate (it's here but shouldn't be)
            // i+1 is the missing number (supposed to be here)
            return vec![nums[i], (i + 1) as i32];
        }
    }
    vec![]
}`

const pq2Code = `// First Missing Positive — cyclic sort, then find first mismatch
fn first_missing_positive(mut nums: Vec<i32>) -> i32 {
    let n = nums.len();
    let mut i = 0usize;
    while i < n {
        let j = (nums[i] - 1) as usize;  // number x belongs at index x-1
        // only act on numbers in range [1, n]
        if nums[i] >= 1 && nums[i] <= n as i32 && nums[i] != nums[j] {
            nums.swap(i, j);
        } else {
            i += 1;
        }
    }
    for i in 0..n {
        if nums[i] != (i + 1) as i32 {
            return (i + 1) as i32;  // first slot where number is wrong
        }
    }
    (n + 1) as i32  // 1..n all present, answer is n+1
}`

const pq3Code = `// Find the Corrupt Pair — same as Set Mismatch
fn find_corrupt_pair(mut nums: Vec<i32>) -> Vec<i32> {
    let mut i = 0usize;
    while i < nums.len() {
        let j = (nums[i] - 1) as usize;
        if nums[i] != nums[j] {
            nums.swap(i, j);
        } else {
            i += 1;
        }
    }
    for i in 0..nums.len() {
        if nums[i] != (i + 1) as i32 {
            // duplicate is nums[i], missing is i+1
            return vec![nums[i], (i + 1) as i32];
        }
    }
    vec![]
}`

const pq4Code = `// Smallest Missing Positive — same as First Missing Positive
fn smallest_missing_positive(mut nums: Vec<i32>) -> i32 {
    let n = nums.len();
    let mut i = 0usize;
    while i < n {
        let j = (nums[i] - 1) as usize;
        if nums[i] >= 1 && nums[i] <= n as i32 && nums[i] != nums[j] {
            nums.swap(i, j);
        } else {
            i += 1;
        }
    }
    for i in 0..n {
        if nums[i] != (i + 1) as i32 {
            return (i + 1) as i32;
        }
    }
    (n + 1) as i32
}`

const pq5Code = `// K Missing Positive Numbers — cyclic sort then collect gaps
fn find_k_missing_positive(mut nums: Vec<i32>, k: usize) -> Vec<i32> {
    let n = nums.len();
    let mut i = 0usize;
    while i < n {
        let j = (nums[i] - 1) as usize;
        // only sort numbers in valid range (1..n)
        if nums[i] >= 1 && nums[i] <= n as i32 && nums[i] != nums[j] {
            nums.swap(i, j);
        } else {
            i += 1;
        }
    }
    let mut missing = Vec::new();
    for i in 0..n {
        if nums[i] != (i + 1) as i32 {
            missing.push((i + 1) as i32);  // i+1 is missing
            if missing.len() == k {
                return missing;
            }
        }
    }
    // if we still need more, continue from n+1 upward
    let mut j = 1i32;
    while missing.len() < k {
        missing.push(n as i32 + j);
        j += 1;
    }
    missing
}`

export default function CyclicSortContent() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>

      <Sub title="What even is Cyclic Sort?">
        <p style={{ lineHeight: 1.7 }}>
          Imagine you have a pile of numbered cards (1 through n) scrambled all over
          the floor. The fastest way to sort them? Walk through the pile and whenever
          you pick up card <em>x</em>, immediately drop it in slot <em>x-1</em>.
          Keep swapping until everything is home. That's cyclic sort — it exploits
          the fact that numbers are consecutive integers to sort in <strong>O(n) time
          with O(1) space</strong>.
        </p>
        <Callout type="tip">
          <strong>Trigger phrases:</strong> "numbers 1 to n", "array of length n containing
          numbers 1..n", "find missing / duplicate in range 1..n". Any time numbers
          are supposed to live at predictable indices, think cyclic sort.
        </Callout>
      </Sub>

      <Sub title="How it works — ASCII walkthrough">
        <CodeBlock code={CS_VISUAL} lang="text" />
        <Callout type="info">
          The trick: <code>let j = (nums[i] - 1) as usize</code> tells you exactly where
          <code>nums[i]</code> belongs. If it's not there, swap. If the slot is already
          occupied by the same value, you've found a duplicate (or the number is out
          of range) — skip.
        </Callout>
      </Sub>

      <Sub title="Taught Questions">
        <QuestionCard
          num={1}
          title="Cyclic Sort (Basic)"
          difficulty="Easy"
          problem={`Given an array containing numbers from 1 to n (one per slot), sort it in-place in O(n) without using any extra space.

Example: [3,1,5,4,2] → [1,2,3,4,5]`}
          brute={<>
            <BigOBadge time="O(n log n)" space="O(1)" />
            <CodeBlock code={cs1Brute} lang="rust" />
            <Callout type="warn">Using sort() throws away the key insight — numbers are 1..n so each has a known home.</Callout>
          </>}
          optimized={<>
            <BigOBadge time="O(n)" space="O(1)" />
            <CodeBlock code={cs1Opt} lang="rust" />
            <Callout type="tip">
              <strong>Aha moment:</strong> Each swap puts at least one number in its correct
              place. So the total number of swaps can't exceed n — making the whole thing O(n)
              even though there's a while loop inside a while loop.
            </Callout>
            <Callout type="danger">
              <strong>Common mistake:</strong> Advancing <code>i</code> after a swap.
              The number that just landed at <code>i</code> might also need swapping!
              Only advance when the current slot is correct.
            </Callout>
          </>}
          answer="Every number has a known home: num lives at index num-1. Swap it there. Only advance i when the slot is already correct."
        />

        <QuestionCard
          num={2}
          title="Find the Missing Number"
          difficulty="Easy"
          problem={`Given an array nums containing n distinct numbers in the range [0, n], return the one number missing.

Example: [3,0,1] → 2
Example: [9,6,4,2,3,5,7,0,1] → 8`}
          brute={<>
            <BigOBadge time="O(n log n)" space="O(1)" />
            <CodeBlock code={cs2Brute} lang="rust" />
          </>}
          optimized={<>
            <BigOBadge time="O(n)" space="O(1)" />
            <CodeBlock code={cs2Opt} lang="rust" />
            <Callout type="tip">
              <strong>Aha moment:</strong> Range is 0..n so number x belongs at index x.
              But the array has n slots (indices 0..n-1) — number n has nowhere to go,
              so we skip it during sorting and check if the gap is at the end.
            </Callout>
            <Callout type="danger">
              <strong>Common mistake:</strong> Forgetting to guard <code>j &lt; n</code>
              before using it as an index — number n would cause an index-out-of-bounds.
            </Callout>
          </>}
          answer="Cyclic sort with range 0..n (number x → index x). Then scan: first index where nums[i] != i is the missing number. If none found, return n."
        />

        <QuestionCard
          num={3}
          title="Find All Missing Numbers"
          difficulty="Easy"
          problem={`Given an array of n integers where each integer is in [1, n], some numbers appear twice and others are missing. Return all missing numbers.

Example: [4,3,2,7,8,2,3,1] → [5,6]`}
          brute={<>
            <BigOBadge time="O(n)" space="O(n)" />
            <CodeBlock code={cs3Brute} lang="rust" />
          </>}
          optimized={<>
            <BigOBadge time="O(n)" space="O(1)" />
            <CodeBlock code={cs3Opt} lang="rust" />
            <Callout type="tip">
              <strong>Aha moment:</strong> Duplicates "block" their home slot — two numbers
              want the same index. After sorting, every wrong slot reveals a missing number.
            </Callout>
            <Callout type="danger">
              <strong>Common mistake:</strong> Checking <code>nums[i] != (i + 1) as i32</code> DURING
              the sort loop. Do it AFTER — the sort needs to finish first.
            </Callout>
          </>}
          answer="Cyclic sort, then scan: every index i where nums[i] != i+1 means i+1 is missing. Collect all such i+1 values."
        />

        <QuestionCard
          num={4}
          title="Find the Duplicate Number"
          difficulty="Medium"
          problem={`Given an array of n+1 integers where each integer is in [1, n], there is exactly one duplicate. Find it without modifying the array... wait, we WILL modify it with cyclic sort.

Example: [1,3,4,2,2] → 2
Example: [3,1,3,4,2] → 3`}
          brute={<>
            <BigOBadge time="O(n)" space="O(n)" />
            <CodeBlock code={cs4Brute} lang="rust" />
          </>}
          optimized={<>
            <BigOBadge time="O(n)" space="O(1)" />
            <CodeBlock code={cs4Opt} lang="rust" />
            <Callout type="tip">
              <strong>Aha moment:</strong> When two numbers want the same slot, the second
              one can't be placed — its "home" is already taken by an identical number.
              That deadlock reveals the duplicate.
            </Callout>
            <Callout type="danger">
              <strong>Common mistake:</strong> Only checking <code>nums[i] != nums[j]</code>
              without also checking <code>nums[i] != (i+1) as i32</code> first — you'd loop forever
              when a number is already home.
            </Callout>
          </>}
          answer="Cyclic sort: when you try to swap nums[i] to its correct slot but that slot already holds the same value, you've found the duplicate."
        />

        <QuestionCard
          num={5}
          title="Find All Duplicates in an Array"
          difficulty="Medium"
          problem={`Given an array of n integers where each integer is in [1, n], some elements appear twice and others once. Return all duplicates.

Example: [4,3,2,7,8,2,3,1] → [2,3]`}
          brute={<>
            <BigOBadge time="O(n log n)" space="O(1)" />
            <CodeBlock code={cs5Brute} lang="rust" />
          </>}
          optimized={<>
            <BigOBadge time="O(n)" space="O(1)" />
            <CodeBlock code={cs5Opt} lang="rust" />
            <Callout type="tip">
              <strong>Aha moment:</strong> After cyclic sort, every slot that doesn't hold
              its "correct" number must hold a duplicate — because the real owner of that slot
              is already correctly placed somewhere else (meaning the number sitting here
              has no home of its own).
            </Callout>
            <Callout type="danger">
              <strong>Common mistake:</strong> Thinking the answer is <code>(i+1) as i32</code> (the
              missing number). No — in this problem we want the duplicate, which is
              <code>nums[i]</code> (the impostor sitting in the wrong slot).
            </Callout>
          </>}
          answer="Cyclic sort, then scan: every index where nums[i] != i+1 means nums[i] is a duplicate (it couldn't go home because its slot was already taken)."
        />
      </Sub>

      <Sub title="Practice Questions">
        <Callout type="info">Try these on your own first. The hint will nudge you, and the answer reveals after a 3-second countdown.</Callout>

        <QuestionCard
          num={6}
          title="Set Mismatch"
          difficulty="Easy"
          practice
          problem={`You have a set [1..n] that became corrupted: one number got duplicated and another disappeared. Given the corrupted array, return [duplicate, missing].

Example: [1,2,2,4] → [2,3]`}
          hints={[
            "Cyclic sort first — get every number as close to home as possible.",
            "After sorting, find the index i where nums[i] != i+1. That index tells you two things at once.",
            "nums[i] is the duplicate (it's sitting in the wrong slot). i+1 is the missing number (the rightful owner of that slot).",
          ]}
          answer="Cyclic sort, scan for the mismatch slot: [nums[i], i+1]."
          answerCode={pq1Code}
          answerLang="rust"
        />

        <QuestionCard
          num={7}
          title="First Missing Positive"
          difficulty="Hard"
          practice
          problem={`Given an unsorted array of integers, return the smallest missing positive integer. Must be O(n) time and O(1) space.

Example: [1,2,0] → 3
Example: [3,4,-1,1] → 2`}
          hints={[
            "Negatives and zeros? Ignore them during cyclic sort — only move numbers in range [1, n].",
            "After sorting, the first index i where nums[i] != i+1 is your answer: i+1.",
            "If all positions 1..n are correct, the answer is n+1.",
          ]}
          answer="Cyclic sort ignoring numbers outside [1,n], then find first i where nums[i] != i+1, return i+1."
          answerCode={pq2Code}
          answerLang="rust"
        />

        <QuestionCard
          num={8}
          title="Find the Corrupt Pair"
          difficulty="Easy"
          practice
          problem={`In an array of 1..n, exactly one number is duplicated and one is missing. Return [wrong, missing].

Example: [3,1,2,5,2] → [2,4]`}
          hints={[
            "This is essentially Set Mismatch — same cyclic sort approach.",
            "One slot will have the wrong number after sorting. That wrong number is the duplicate; the slot index +1 is the missing one.",
          ]}
          answer="Cyclic sort, find mismatch slot: return [nums[i], i+1]."
          answerCode={pq3Code}
          answerLang="rust"
        />

        <QuestionCard
          num={9}
          title="Find the Smallest Missing Positive"
          difficulty="Medium"
          practice
          problem={`Same as First Missing Positive — smallest positive not in the array, O(n) time O(1) space.

Example: [2,3,4,1] → 5
Example: [2,3,4,6,1] → 5`}
          hints={[
            "Numbers outside [1,n] are irrelevant for finding the first gap — skip them during sort.",
            "After sort, first index i with nums[i] != i+1 gives answer i+1. Else n+1.",
          ]}
          answer="Same as First Missing Positive — cyclic sort on [1,n] range, then scan."
          answerCode={pq4Code}
          answerLang="rust"
        />

        <QuestionCard
          num={10}
          title="K Missing Positive Numbers"
          difficulty="Medium"
          practice
          problem={`Given an array of positive integers and a number k, find the k smallest missing positive numbers.

Example: [2,3,4], k=3 → [1,5,6]
Example: [1,2,3,6,7], k=3 → [4,5,8]`}
          hints={[
            "Cyclic sort to place numbers in their homes. Skip numbers outside [1,n].",
            "First pass: collect missing numbers from gaps in the sorted array.",
            "If you still need more after scanning 1..n, continue from n+1 upward.",
          ]}
          answer="Cyclic sort, collect mismatches up to k, then extend beyond n if needed."
          answerCode={pq5Code}
          answerLang="rust"
        />
      </Sub>

    </div>
  )
}
