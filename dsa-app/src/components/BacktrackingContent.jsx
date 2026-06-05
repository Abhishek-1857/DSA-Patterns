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

const BT_WHAT_IS = `
BACKTRACKING = "try something, if it fails, undo and try the next thing"

Think of it like a maze:
  - Walk forward as long as you can
  - Hit a dead end? Back up one step and try a different turn
  - Repeat until you've found a solution (or tried everything)

The code template is ALWAYS:

  fn backtrack(choices, current_state) {
      if is_solution(current_state) {
          save(current_state);
          return;
      }
      for choice in choices {
          make(choice);          ← add choice to current_state
          backtrack(...);        ← recurse deeper
          undo(choice);          ← REMOVE it (backtrack!)
      }
  }
`

const SUBSETS_VISUAL = `
SUBSETS of [1, 2, 3] — recursion tree:

start with [], consider each number one by one

                      []
                    /    \\
              [1]            []
             /   \\          /  \\
          [1,2]  [1]      [2]   []
          /  \\   / \\      / \\   / \\
      [1,2,3][1,2][1,3][1] [2,3][2][3] []

Every node in this tree IS a valid subset!
So we collect the current list at EVERY node, not just leaves.

Walk: start at []
  → include 1 → [1]
     → include 2 → [1,2]
        → include 3 → [1,2,3] ✓ collect
        ← backtrack: remove 3 → [1,2]
     ← backtrack: remove 2 → [1]
     → include 3 (skip 2, already used) → [1,3] ✓ collect
     ← backtrack: remove 3 → [1]
  ← backtrack: remove 1 → []
  → include 2 → [2]
     → include 3 → [2,3] ✓ collect
     ← backtrack → [2]
  ← backtrack → []
  → include 3 → [3] ✓ collect
  ← backtrack → []

Final: [[], [1], [1,2], [1,2,3], [1,3], [2], [2,3], [3]]
`

const PERMS_VISUAL = `
PERMUTATIONS of [1,2,3] — recursion tree:

                        []
              /          |          \\
           [1]          [2]          [3]
          /   \\        /   \\        /   \\
       [1,2] [1,3]  [2,1] [2,3]  [3,1] [3,2]
         |     |      |     |      |     |
      [1,2,3][1,3,2][2,1,3][2,3,1][3,1,2][3,2,1]
         ✓     ✓      ✓     ✓      ✓     ✓

At each level: try EVERY remaining (unused) number
When path length == n: we have a complete permutation
`

const PARENS_VISUAL = `
GENERATE PARENTHESES n=2 — decision tree:

State: (open_count, close_count, current_string)

                       ("", 0, 0)
                      /           \\
             ("(", 1, 0)        ← can't add ')' yet, open=0
             /         \\
       ("((", 2, 0)    ("()", 1, 1)
           |           /         \\
       ("(()", 2, 1)  ("()(", 2, 1)  ("()(", ... already counted)
           |               |
       ("(())", 2, 2) ✓  ("()()", 2, 2) ✓

Rules at each step:
  add '(' if open < n
  add ')' if close < open  (can't close more than you've opened)
  base case: open == close == n → valid string, collect it
`

// ── Q1: Subsets ────────────────────────────────────────────────────────────
const q1Brute = `// Brute: iterative — for each new number, double all existing subsets
fn subsets_iterative(nums: &[i32]) -> Vec<Vec<i32>> {
    let mut result: Vec<Vec<i32>> = vec![vec![]];   // start with empty subset
    for &num in nums {
        let new_subsets: Vec<Vec<i32>> = result
            .iter()
            .map(|existing| {
                let mut s = existing.clone();
                s.push(num);                         // add a version WITH num
                s
            })
            .collect();
        result.extend(new_subsets);                  // add those new subsets
    }
    result
}`

const q1Opt = `fn subsets(nums: &[i32]) -> Vec<Vec<i32>> {
    let mut result: Vec<Vec<i32>> = Vec::new();
    let mut current: Vec<i32> = Vec::new();
    backtrack(nums, 0, &mut current, &mut result);
    result
}

fn backtrack(nums: &[i32], start: usize, current: &mut Vec<i32>, result: &mut Vec<Vec<i32>>) {
    result.push(current.clone());        // EVERY state is a valid subset → collect now
    for i in start..nums.len() {
        current.push(nums[i]);           // choose: include nums[i]
        backtrack(nums, i + 1, current, result); // recurse: only pick from nums[i+1] onward
        current.pop();                   // undo: backtrack (remove nums[i])
    }
}`

// ── Q2: Subsets With Duplicates ────────────────────────────────────────────
const q2Brute = `// Brute: generate all subsets, deduplicate by sorting each and using a HashSet
use std::collections::HashSet;

fn subsets_with_dups_brute(mut nums: Vec<i32>) -> Vec<Vec<i32>> {
    nums.sort();
    let mut seen: HashSet<Vec<i32>> = HashSet::new();
    let mut result: Vec<Vec<i32>> = Vec::new();
    let mut current: Vec<i32> = Vec::new();

    fn backtrack(nums: &[i32], start: usize, current: &mut Vec<i32>,
                 seen: &mut HashSet<Vec<i32>>, result: &mut Vec<Vec<i32>>) {
        if seen.insert(current.clone()) {
            result.push(current.clone());
        }
        for i in start..nums.len() {
            current.push(nums[i]);
            backtrack(nums, i + 1, current, seen, result);
            current.pop();
        }
    }

    backtrack(&nums, 0, &mut current, &mut seen, &mut result);
    result
}`

const q2Opt = `fn subsets_with_dups(mut nums: Vec<i32>) -> Vec<Vec<i32>> {
    nums.sort();                         // MUST sort first so duplicates are adjacent
    let mut result: Vec<Vec<i32>> = Vec::new();
    let mut current: Vec<i32> = Vec::new();
    backtrack(&nums, 0, &mut current, &mut result);
    result
}

fn backtrack(nums: &[i32], start: usize, current: &mut Vec<i32>, result: &mut Vec<Vec<i32>>) {
    result.push(current.clone());
    for i in start..nums.len() {
        // SKIP duplicates: if nums[i] == nums[i-1] and i > start,
        // we'd be starting the same branch we already explored
        if i > start && nums[i] == nums[i - 1] {
            continue;
        }
        current.push(nums[i]);
        backtrack(nums, i + 1, current, result);
        current.pop();
    }
}`

// ── Q3: Permutations ───────────────────────────────────────────────────────
const q3Brute = `// Brute: collect all permutations using the standard library's permutation iterator
// (itertools crate provides permutations; here we show a simple heap's algorithm)
fn permute_brute(nums: Vec<i32>) -> Vec<Vec<i32>> {
    let mut result: Vec<Vec<i32>> = Vec::new();
    let mut nums = nums;
    heap_permutations(nums.len(), &mut nums, &mut result);
    result
}

fn heap_permutations(k: usize, nums: &mut Vec<i32>, result: &mut Vec<Vec<i32>>) {
    if k == 1 {
        result.push(nums.clone());   // let the algorithm do the work
        return;
    }
    for i in 0..k {
        heap_permutations(k - 1, nums, result);
        if k % 2 == 0 {
            nums.swap(i, k - 1);
        } else {
            nums.swap(0, k - 1);
        }
    }
}`

const q3Opt = `fn permute(nums: Vec<i32>) -> Vec<Vec<i32>> {
    let mut result: Vec<Vec<i32>> = Vec::new();
    let mut current: Vec<i32> = Vec::new();
    let mut used = vec![false; nums.len()];
    backtrack(&nums, &mut used, &mut current, &mut result);
    result
}

fn backtrack(nums: &[i32], used: &mut Vec<bool>, current: &mut Vec<i32>,
             result: &mut Vec<Vec<i32>>) {
    if current.len() == nums.len() {     // used all numbers → complete permutation
        result.push(current.clone());
        return;
    }
    for i in 0..nums.len() {
        if used[i] { continue; }         // skip already-chosen elements
        used[i] = true;
        current.push(nums[i]);           // choose: pick nums[i]
        backtrack(nums, used, current, result);
        current.pop();                   // undo the choice
        used[i] = false;
    }
}`

// ── Q4: Letter Combinations of Phone Number ────────────────────────────────
const q4Brute = `// Brute: iterative — multiply out character lists (cartesian product)
fn letter_combinations_brute(digits: &str) -> Vec<String> {
    if digits.is_empty() { return vec![]; }
    let phone = |d: char| match d {
        '2' => "abc", '3' => "def", '4' => "ghi", '5' => "jkl",
        '6' => "mno", '7' => "pqrs", '8' => "tuv", '9' => "wxyz",
        _ => "",
    };
    let mut result: Vec<String> = vec![String::new()];
    for ch in digits.chars() {
        let letters = phone(ch);
        let mut next: Vec<String> = Vec::new();
        for existing in &result {
            for letter in letters.chars() {
                let mut s = existing.clone();
                s.push(letter);
                next.push(s);
            }
        }
        result = next;
    }
    result
}`

const q4Opt = `fn letter_combinations(digits: &str) -> Vec<String> {
    if digits.is_empty() { return vec![]; }
    let phone = |d: char| match d {
        '2' => "abc", '3' => "def", '4' => "ghi", '5' => "jkl",
        '6' => "mno", '7' => "pqrs", '8' => "tuv", '9' => "wxyz",
        _ => "",
    };
    let digit_chars: Vec<char> = digits.chars().collect();
    let mut result: Vec<String> = Vec::new();
    let mut current: Vec<char> = Vec::new();
    backtrack(&digit_chars, 0, &phone, &mut current, &mut result);
    result
}

fn backtrack(digits: &[char], index: usize, phone: &dyn Fn(char) -> &'static str,
             current: &mut Vec<char>, result: &mut Vec<String>) {
    if index == digits.len() {           // used all digits → complete combination
        result.push(current.iter().collect());
        return;
    }
    for letter in phone(digits[index]).chars() { // try each letter for this digit
        current.push(letter);                    // choose
        backtrack(digits, index + 1, phone, current, result); // recurse to next digit
        current.pop();                           // undo
    }
}`

// ── Q5: Generate Parentheses ───────────────────────────────────────────────
const q5Brute = `// Brute: generate all 2n-length strings, filter valid ones
fn generate_parentheses_brute(n: usize) -> Vec<String> {
    let mut result: Vec<String> = Vec::new();
    let mut current: Vec<char> = Vec::new();
    generate(n, &mut current, &mut result);
    result
}

fn generate(n: usize, current: &mut Vec<char>, result: &mut Vec<String>) {
    if current.len() == 2 * n {
        // check if it's valid
        let mut count: i32 = 0;
        let mut valid = true;
        for &c in current.iter() {
            if c == '(' { count += 1; } else { count -= 1; }
            if count < 0 { valid = false; break; }  // invalid at this point
        }
        if valid && count == 0 {
            result.push(current.iter().collect());
        }
        return;
    }
    current.push('(');
    generate(n, current, result);
    current.pop();
    current.push(')');
    generate(n, current, result);
    current.pop();
}`

const q5Opt = `fn generate_parentheses(n: usize) -> Vec<String> {
    let mut result: Vec<String> = Vec::new();
    let mut current: Vec<char> = Vec::new();
    backtrack(n, 0, 0, &mut current, &mut result);
    result
}

fn backtrack(n: usize, open: usize, close: usize,
             current: &mut Vec<char>, result: &mut Vec<String>) {
    if current.len() == 2 * n {          // used all n pairs → complete string
        result.push(current.iter().collect());
        return;
    }
    if open < n {                        // can still add an open paren
        current.push('(');
        backtrack(n, open + 1, close, current, result);
        current.pop();                   // undo
    }
    if close < open {                    // can add close paren only if it matches an open
        current.push(')');
        backtrack(n, open, close + 1, current, result);
        current.pop();                   // undo
    }
}`

// ── PRACTICE answers ───────────────────────────────────────────────────────
const pq1Code = `// Combination Sum — find all combinations that sum to target (reuse allowed)
fn combination_sum(mut candidates: Vec<i32>, target: i32) -> Vec<Vec<i32>> {
    candidates.sort();                   // sort so we can prune early
    let mut result: Vec<Vec<i32>> = Vec::new();
    let mut current: Vec<i32> = Vec::new();
    backtrack(&candidates, 0, target, &mut current, &mut result);
    result
}

fn backtrack(candidates: &[i32], start: usize, remaining: i32,
             current: &mut Vec<i32>, result: &mut Vec<Vec<i32>>) {
    if remaining == 0 {                  // hit the target exactly → valid combo
        result.push(current.clone());
        return;
    }
    for i in start..candidates.len() {
        if candidates[i] > remaining {
            break;                       // sorted, so all further are also too big
        }
        current.push(candidates[i]);
        // same i: can reuse candidates[i] (not i+1!)
        backtrack(candidates, i, remaining - candidates[i], current, result);
        current.pop();                   // undo
    }
}`

const pq2Code = `// Word Search — find if word exists in grid as a path
fn exist(board: &mut Vec<Vec<char>>, word: &str) -> bool {
    let rows = board.len();
    let cols = board[0].len();
    let word: Vec<char> = word.chars().collect();

    for r in 0..rows {
        for c in 0..cols {
            if backtrack(board, &word, r, c, 0) {  // try starting from every cell
                return true;
            }
        }
    }
    false
}

fn backtrack(board: &mut Vec<Vec<char>>, word: &[char],
             r: usize, c: usize, index: usize) -> bool {
    if index == word.len() { return true; }  // matched all characters → found it!
    if r >= board.len() || c >= board[0].len() { return false; } // bounds check
    if board[r][c] != word[index] { return false; }              // wrong character
    // mark as visited by temporarily replacing with a sentinel
    let temp = board[r][c];
    board[r][c] = '#';                   // can't revisit this cell in this path
    // try all 4 directions (use checked arithmetic to avoid underflow)
    let found = (r + 1 < board.len()    && backtrack(board, word, r + 1, c, index + 1))
             || (r > 0                  && backtrack(board, word, r - 1, c, index + 1))
             || (c + 1 < board[0].len() && backtrack(board, word, r, c + 1, index + 1))
             || (c > 0                  && backtrack(board, word, r, c - 1, index + 1));
    board[r][c] = temp;                  // undo: restore cell
    found
}`

const pq3Code = `// N-Queens — place n queens so none attack each other
fn solve_n_queens(n: usize) -> Vec<Vec<String>> {
    let mut result: Vec<Vec<String>> = Vec::new();
    // track which columns and diagonals are occupied
    let mut cols: std::collections::HashSet<i32> = std::collections::HashSet::new();
    let mut diag1: std::collections::HashSet<i32> = std::collections::HashSet::new(); // row - col
    let mut diag2: std::collections::HashSet<i32> = std::collections::HashSet::new(); // row + col
    let mut board: Vec<Vec<char>> = vec![vec!['.'; n]; n];

    backtrack(n, 0, &mut cols, &mut diag1, &mut diag2, &mut board, &mut result);
    result
}

fn backtrack(n: usize, row: usize,
             cols: &mut std::collections::HashSet<i32>,
             diag1: &mut std::collections::HashSet<i32>,
             diag2: &mut std::collections::HashSet<i32>,
             board: &mut Vec<Vec<char>>,
             result: &mut Vec<Vec<String>>) {
    if row == n {                        // placed queens in all n rows
        result.push(board.iter().map(|r| r.iter().collect()).collect());
        return;
    }
    for col in 0..n {
        let (r, c) = (row as i32, col as i32);
        // check if this cell is under attack
        if cols.contains(&c) || diag1.contains(&(r - c)) || diag2.contains(&(r + c)) {
            continue;
        }
        // place queen
        board[row][col] = 'Q';
        cols.insert(c);
        diag1.insert(r - c);
        diag2.insert(r + c);
        backtrack(n, row + 1, cols, diag1, diag2, board, result); // move to next row
        // remove queen (backtrack)
        board[row][col] = '.';
        cols.remove(&c);
        diag1.remove(&(r - c));
        diag2.remove(&(r + c));
    }
}`

const pq4Code = `// Sudoku Solver — fill in the board so each row/col/box has 1-9
fn solve_sudoku(board: &mut Vec<Vec<char>>) {
    backtrack(board);
}

fn is_valid(board: &Vec<Vec<char>>, row: usize, col: usize, num: char) -> bool {
    let box_r = 3 * (row / 3);
    let box_c = 3 * (col / 3);
    // check row, column, and 3x3 box
    for i in 0..9 {
        if board[row][i] == num { return false; }          // row conflict
        if board[i][col] == num { return false; }          // col conflict
        if board[box_r + i / 3][box_c + i % 3] == num { return false; } // box conflict
    }
    true
}

fn backtrack(board: &mut Vec<Vec<char>>) -> bool {
    for r in 0..9 {
        for c in 0..9 {
            if board[r][c] == '.' {          // find next empty cell
                for num in '1'..='9' {
                    if is_valid(board, r, c, num) {
                        board[r][c] = num;           // place the digit
                        if backtrack(board) {
                            return true;             // solution found downstream
                        }
                        board[r][c] = '.';           // undo (backtrack)
                    }
                }
                return false;            // no digit worked → backtrack further
            }
        }
    }
    true                                 // no empty cells → board is solved
}`

const pq5Code = `// Palindrome Partitioning — all ways to split string into palindrome parts
fn partition(s: &str) -> Vec<Vec<String>> {
    let s: Vec<char> = s.chars().collect();
    let mut result: Vec<Vec<String>> = Vec::new();
    let mut current: Vec<String> = Vec::new();
    backtrack(&s, 0, &mut current, &mut result);
    result
}

fn is_palindrome(s: &[char]) -> bool {
    let (mut l, mut r) = (0, s.len().wrapping_sub(1));
    while l < r && l < s.len() {
        if s[l] != s[r] { return false; }
        l += 1;
        r = r.wrapping_sub(1);
    }
    true
}

fn backtrack(s: &[char], start: usize, current: &mut Vec<String>,
             result: &mut Vec<Vec<String>>) {
    if start == s.len() {                // used the whole string → valid partition
        result.push(current.clone());
        return;
    }
    for end in (start + 1)..=s.len() {
        let substring = &s[start..end];
        if is_palindrome(substring) {    // only branch if it's a palindrome
            current.push(substring.iter().collect());
            backtrack(s, end, current, result); // recurse from where we left off
            current.pop();               // undo
        }
    }
}`

export default function BacktrackingContent() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>

      <Sub title="What is Backtracking?">
        <CodeBlock code={BT_WHAT_IS} lang="text" />
        <p style={{ lineHeight: 1.7, marginTop: 12 }}>
          Backtracking sounds fancy but it's just <strong>recursive trial and error
          with cleanup</strong>. You try a choice, go as deep as you can, and when you
          hit a dead end (or find a solution), you undo that choice and try the next one.
          The key line is always the one that removes your last choice before the loop
          moves on — that's the "back" in backtracking.
        </p>
        <Callout type="tip">
          <strong>Trigger phrases:</strong> "all subsets", "all permutations",
          "all combinations", "generate all valid", "find all ways to...".
          Any time the problem asks for every possible arrangement or selection →
          think backtracking.
        </Callout>
      </Sub>

      <Sub title="Subsets — recursion tree walkthrough">
        <CodeBlock code={SUBSETS_VISUAL} lang="text" />
        <Callout type="info">
          For subsets: collect the current path at <em>every</em> node (not just leaves),
          and always recurse with <code>start = i + 1</code> so you only look at numbers
          that come after the current one. This prevents duplicates like [1,2] and [2,1]
          from both appearing.
        </Callout>
      </Sub>

      <Sub title="Permutations — recursion tree walkthrough">
        <CodeBlock code={PERMS_VISUAL} lang="text" />
        <Callout type="info">
          For permutations: try <em>every remaining</em> number at each level (order matters),
          track which numbers are still available, and only collect at leaves (when you've
          used all numbers). Unlike subsets, [1,2] and [2,1] are DIFFERENT permutations.
        </Callout>
      </Sub>

      <Sub title="Generate Parentheses — decision tree walkthrough">
        <CodeBlock code={PARENS_VISUAL} lang="text" />
        <Callout type="info">
          Constraint-based backtracking: instead of generating all strings and filtering,
          only make <em>valid moves</em> at each step. Add <code>(</code> only when
          <code>open &lt; n</code>. Add <code>)</code> only when <code>close &lt; open</code>.
          This prunes the tree dramatically — every leaf is a valid string.
        </Callout>
      </Sub>

      <Sub title="Taught Questions">

        <QuestionCard
          num={1}
          title="Subsets (all subsets of a set)"
          difficulty="Medium"
          problem={`Given a set of distinct integers, return all possible subsets (power set). The solution set must not contain duplicate subsets.

Example: [1,2,3] → [[],[1],[2],[3],[1,2],[1,3],[2,3],[1,2,3]]`}
          brute={<>
            <BigOBadge time="O(n·2ⁿ)" space="O(n·2ⁿ)" />
            <CodeBlock code={q1Brute} lang="rust" />
            <Callout type="warn">Iterative doubling works but the backtracking approach generalizes better to subsets-with-duplicates, permutations, and combinations.</Callout>
          </>}
          optimized={<>
            <BigOBadge time="O(n·2ⁿ)" space="O(n)" />
            <CodeBlock code={q1Opt} lang="rust" />
            <Callout type="tip">
              <strong>Aha moment:</strong> Unlike most backtracking problems, you collect
              the current state at <em>every</em> call (including the empty set at the start).
              You don't wait for a leaf — every node in the recursion tree is a valid answer.
            </Callout>
            <Callout type="danger">
              <strong>Common mistake:</strong> Pushing <code>current</code> directly instead of
              <code>current.clone()</code>. Since <code>current</code> is a mutable Vec that
              gets modified as we backtrack, you must clone it when saving to results.
            </Callout>
          </>}
          answer="Backtrack: at each call push a clone of current, then loop from start to end. Push nums[i], recurse with i+1, then pop nums[i]."
        />

        <QuestionCard
          num={2}
          title="Subsets With Duplicates"
          difficulty="Medium"
          problem={`Given a collection of integers that might contain duplicates, return all possible unique subsets.

Example: [1,2,2] → [[],[1],[1,2],[1,2,2],[2],[2,2]]`}
          brute={<>
            <BigOBadge time="O(n·2ⁿ)" space="O(n·2ⁿ)" />
            <CodeBlock code={q2Brute} lang="rust" />
            <Callout type="warn">Using a HashSet to deduplicate works but wastes memory cloning Vecs as keys.</Callout>
          </>}
          optimized={<>
            <BigOBadge time="O(n·2ⁿ)" space="O(n)" />
            <CodeBlock code={q2Opt} lang="rust" />
            <Callout type="tip">
              <strong>Aha moment:</strong> Sort first so duplicates are adjacent. Then in the
              loop, if <code>nums[i] == nums[i-1]</code> AND <code>i &gt; start</code>, skip.
              Why <code>i &gt; start</code>? Because the first occurrence in this level is
              fine — we only skip the second time we'd pick the same value at the same depth.
            </Callout>
            <Callout type="danger">
              <strong>Common mistake:</strong> Writing <code>i &gt; 0</code> instead of
              <code>i &gt; start</code>. That's too aggressive — it would skip valid subsets
              that happen to start with the same number as a previous level.
            </Callout>
          </>}
          answer="Sort first. Same as Subsets but add: if i > start && nums[i] == nums[i-1] { continue } — skips duplicate branches at the same recursion level."
        />

        <QuestionCard
          num={3}
          title="Permutations"
          difficulty="Medium"
          problem={`Given a collection of distinct integers, return all possible permutations.

Example: [1,2,3] → [[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]`}
          brute={<>
            <BigOBadge time="O(n·n!)" space="O(n·n!)" />
            <CodeBlock code={q3Brute} lang="rust" />
          </>}
          optimized={<>
            <BigOBadge time="O(n·n!)" space="O(n)" />
            <CodeBlock code={q3Opt} lang="rust" />
            <Callout type="tip">
              <strong>Aha moment:</strong> Unlike subsets (where order doesn't matter),
              permutations care about order — so at each level you can try ANY remaining
              element, not just ones that come after the current index. That's why we use
              a <code>used: Vec&lt;bool&gt;</code> array and iterate the full list each time.
            </Callout>
            <Callout type="danger">
              <strong>Common mistake:</strong> Using <code>start</code> (like subsets) instead
              of a <code>used</code> flag. Subsets enforce "only pick forward" to avoid
              duplicates. Permutations need every remaining element to be an option.
            </Callout>
          </>}
          answer="Backtrack with a used[] array. At each level: try every index not in used, set used[i]=true, push to current, recurse, pop, set used[i]=false."
        />

        <QuestionCard
          num={4}
          title="Letter Combinations of a Phone Number"
          difficulty="Medium"
          problem={`Given a string of digits 2-9, return all possible letter combinations the number could represent (like a phone keypad).

Example: "23" → ["ad","ae","af","bd","be","bf","cd","ce","cf"]`}
          brute={<>
            <BigOBadge time="O(4ⁿ·n)" space="O(4ⁿ·n)" />
            <CodeBlock code={q4Brute} lang="rust" />
          </>}
          optimized={<>
            <BigOBadge time="O(4ⁿ·n)" space="O(n)" />
            <CodeBlock code={q4Opt} lang="rust" />
            <Callout type="tip">
              <strong>Aha moment:</strong> Each digit maps to 3-4 letters. Use an index
              into the digits slice to know which digit you're currently mapping. At each
              level, try every letter for <code>digits[index]</code>, then recurse to
              <code>index + 1</code>.
            </Callout>
            <Callout type="danger">
              <strong>Common mistake:</strong> Building the string with concatenation
              instead of a Vec&lt;char&gt; + pop. Concatenation creates a new String each
              time (extra allocation). Using a Vec and pushing/popping is cleaner and
              more efficient.
            </Callout>
          </>}
          answer="Backtrack with digit index. At each level: try each letter for digits[index], push to current Vec<char>, recurse to index+1, pop. When index == digits.len(), collect to String and save."
        />

        <QuestionCard
          num={5}
          title="Generate Parentheses"
          difficulty="Medium"
          problem={`Given n pairs of parentheses, generate all combinations of well-formed parentheses.

Example: n=3 → ["((()))","(()())","(())()","()(())","()()()"]`}
          brute={<>
            <BigOBadge time="O(2²ⁿ·n)" space="O(2²ⁿ·n)" />
            <CodeBlock code={q5Brute} lang="rust" />
            <Callout type="warn">Generating all 2^(2n) strings and filtering is massively wasteful. Constraint-aware backtracking only builds valid strings.</Callout>
          </>}
          optimized={<>
            <BigOBadge time="O(4ⁿ/√n)" space="O(n)" />
            <CodeBlock code={q5Opt} lang="rust" />
            <Callout type="tip">
              <strong>Aha moment:</strong> You only have two choices at each step:
              add <code>(</code> or add <code>)</code>. But you only add <code>(</code>
              if <code>open &lt; n</code>, and only add <code>)</code> if
              <code>close &lt; open</code>. These two rules guarantee every complete
              string is valid — no filtering needed.
            </Callout>
            <Callout type="danger">
              <strong>Common mistake:</strong> Allowing <code>close &gt;= open</code> — that
              creates invalid strings like <code>)(</code>. You can never close more than
              you've opened.
            </Callout>
          </>}
          answer="Backtrack with open and close counts. Push '(' if open < n. Push ')' if close < open. Collect when open == close == n."
        />

      </Sub>

      <Sub title="Practice Questions">
        <Callout type="info">These are classic interview problems. Each one is a variation of the same backtracking skeleton — try to identify WHAT the choices are and WHAT makes a solution valid before coding.</Callout>

        <QuestionCard
          num={6}
          title="Combination Sum"
          difficulty="Medium"
          practice
          problem={`Given an array of distinct integers and a target, find all unique combinations that sum to target. You may use each number unlimited times.

Example: candidates=[2,3,6,7], target=7 → [[2,2,3],[7]]`}
          hints={[
            "Backtrack with start index and remaining sum. When remaining == 0, you've found a valid combination.",
            "Unlike subsets, you can reuse the same number — so recurse with i (not i+1) to allow repetition.",
            "Sort first. If candidates[i] > remaining, break early — all larger candidates will also be too big.",
          ]}
          answer="Sort. Backtrack(start, remaining). Try each candidate from start: if remaining==0 collect, if candidate <= remaining push it and recurse with same i (allow reuse), pop."
          answerCode={pq1Code}
        />

        <QuestionCard
          num={7}
          title="Word Search"
          difficulty="Medium"
          practice
          problem={`Given a 2D grid of characters and a word, return true if the word exists in the grid as a connected path (horizontal/vertical, no revisiting cells).

Example: grid=[["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word="ABCCED" → true`}
          hints={[
            "Try starting from every cell. For each start, do DFS matching one character at a time.",
            "Mark cells as visited by temporarily replacing board[r][c] with '#'. Restore after recursion.",
            "Recurse in 4 directions (up/down/left/right). Return true as soon as any direction succeeds.",
          ]}
          answer="DFS from every cell. At each step match board[r][c] to word[index], mark as '#' to prevent revisiting, try all 4 neighbors for word[index+1], then restore the cell."
          answerCode={pq2Code}
        />

        <QuestionCard
          num={8}
          title="N-Queens"
          difficulty="Hard"
          practice
          problem={`Place n queens on an n×n chessboard so no two queens attack each other. Return all valid configurations.

Example: n=4 → [[".Q..","...Q","Q...","..Q."],["..Q.","Q...","...Q",".Q.."]]`}
          hints={[
            "Place one queen per row (backtrack row by row). Try each column in that row.",
            "Track which columns and diagonals (two kinds: '/' and '\\') are occupied using HashSets.",
            "For '/' diagonal: row - col is constant. For '\\' diagonal: row + col is constant.",
          ]}
          answer="Backtrack row by row. For each column, check if col, row-col, row+col are all free. Place queen, recurse to next row, remove queen. Collect when row == n."
          answerCode={pq3Code}
        />

        <QuestionCard
          num={9}
          title="Sudoku Solver"
          difficulty="Hard"
          practice
          problem={`Solve a Sudoku puzzle by filling in the empty cells. Each row, column, and 3×3 box must contain digits 1-9 with no repetition.`}
          hints={[
            "Scan for the first empty cell. Try digits '1'-'9'. If valid, place it and recurse.",
            "If recursion returns true, the board is solved. If no digit works, return false (trigger backtrack).",
            "Validity check: same digit must not appear in the same row, column, or 3×3 box.",
          ]}
          answer="Find empty cell, try '1'-'9'. If valid (row/col/box clear), place it and recurse. If recursion solves it, return true. Otherwise remove and try next digit. If none work, return false."
          answerCode={pq4Code}
        />

        <QuestionCard
          num={10}
          title="Palindrome Partitioning"
          difficulty="Medium"
          practice
          problem={`Given a string, partition it so every substring is a palindrome. Return all possible partitions.

Example: "aab" → [["a","a","b"],["aa","b"]]`}
          hints={[
            "Backtrack with a start index. At each step, try every possible first piece: s[start..end] for all end values.",
            "Only recurse deeper if s[start..end] is a palindrome. Skip non-palindromes entirely.",
            "When start == s.len(), you've cut the whole string into palindromes — collect the partition.",
          ]}
          answer="Backtrack(start, current). For each end from start+1 to s.len(): if s[start..end] is palindrome, push to current, recurse from end, pop. Collect when start == s.len()."
          answerCode={pq5Code}
        />
      </Sub>

    </div>
  )
}
