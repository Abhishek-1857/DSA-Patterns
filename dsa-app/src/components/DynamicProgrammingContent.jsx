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

const DP_WHAT_IS = `
DYNAMIC PROGRAMMING — "remember your past work so you don't repeat it"

The two ingredients that make DP possible:

1. OVERLAPPING SUBPROBLEMS
   The same smaller problem gets solved multiple times.
   Example: fib(5) needs fib(4) and fib(3).
            fib(4) needs fib(3) and fib(2).
            fib(3) is computed TWICE! (and fib(2) even more)

   Without DP:          With DP (memoize):
   fib(5)               fib(5)
   ├─ fib(4)            ├─ fib(4)
   │  ├─ fib(3)         │  ├─ fib(3)   ← compute once, store
   │  │  ├─ fib(2)      │  │  ├─ fib(2) ← compute once, store
   │  │  └─ fib(1)      │  │  └─ fib(1)
   │  └─ fib(2) ← DUPE  │  └─ fib(2)   ← LOOKUP (free!)
   └─ fib(3) ← DUPE     └─ fib(3)       ← LOOKUP (free!)

2. OPTIMAL SUBSTRUCTURE
   The best solution to a big problem is built from best solutions
   to smaller problems.
   Example: the shortest path from A→C goes through B.
            The A→B portion must itself be the shortest A→B path.
            (If there were a shorter A→B route, you'd use that instead.)

TWO STYLES:
  Top-down (memoization): write recursion, cache results in a Vec<Option<_>>
  Bottom-up (tabulation): fill a table from small to large, no recursion
`

// ── Q1: Fibonacci ─────────────────────────────────────────────────────────
const FIB_TABLE = `
FIBONACCI — table filling (bottom-up)

fib(n) = fib(n-1) + fib(n-2),  fib(0)=0, fib(1)=1

Fill left to right. Each cell = sum of previous two:

 n  │  0   1   2   3   4   5   6   7   8   9  10
────┼──────────────────────────────────────────────
fib │  0   1   1   2   3   5   8  13  21  34  55
         ↑   ↑   ↑
      base  base  0+1=1
              cases

To compute fib(5)=5: we only ever look one and two steps back.
Space optimization: only keep last two values → O(1) space.
`

const q1Brute = `// Naive recursion — O(2^n) time, recomputes everything
fn fib_naive(n: u64) -> u64 {
    if n <= 1 {
        return n;
    }
    fib_naive(n - 1) + fib_naive(n - 2)  // same subproblems solved many times
}`

const q1Opt = `// Top-down (memoization): cache results so each subproblem is solved once
fn fib_memo(n: usize, memo: &mut Vec<Option<i64>>) -> i64 {
    if n <= 1 { return n as i64; }         // base case
    if let Some(val) = memo[n] { return val; }  // already computed → free lookup
    let result = fib_memo(n - 1, memo) + fib_memo(n - 2, memo);
    memo[n] = Some(result);                // store for future calls
    result
}

// Bottom-up (tabulation): fill table left to right, no recursion at all
fn fib_tab(n: usize) -> i64 {
    if n <= 1 { return n as i64; }
    let mut prev2 = 0i64;  // fib(0)
    let mut prev1 = 1i64;  // fib(1)
    for _ in 2..=n {
        let curr = prev1 + prev2;  // fib(i) = fib(i-1) + fib(i-2)
        prev2 = prev1;             // slide the window
        prev1 = curr;
    }
    prev1  // fib(n)
}`

// ── Q2: 0/1 Knapsack ──────────────────────────────────────────────────────
const KNAPSACK_TABLE = `
0/1 KNAPSACK — 2D table filling

Items: weights=[2,3,4,5], values=[3,4,5,6], capacity=5

dp[i][w] = max value using first i items with weight limit w

       w=0  w=1  w=2  w=3  w=4  w=5
  i=0 │  0    0    0    0    0    0   ← no items: always 0
  i=1 │  0    0    3    3    3    3   ← item1 (w=2,v=3): fits at w≥2
  i=2 │  0    0    3    4    4    7   ← item2 (w=3,v=4): fits at w≥3
  i=3 │  0    0    3    4    5    7   ← item3 (w=4,v=5): fits at w≥4
  i=4 │  0    0    3    4    5    7   ← item4 (w=5,v=6): fits at w≥5

Reading dp[2][5]=7: use item1(v=3) + item2(v=4) = 7 ✓

For each cell dp[i][w]:
  - SKIP item i:  dp[i-1][w]             (pretend it doesn't exist)
  - TAKE item i:  dp[i-1][w - weight[i]] + value[i]  (if it fits)
  - Pick the MAX of these two options
`

const q2Brute = `// Brute: try every subset of items — O(2^n)
fn knapsack_brute(weights: &[usize], values: &[i32], capacity: usize) -> i32 {
    let n = weights.len();
    let mut best = 0;
    for mask in 0..(1u32 << n) {          // every binary subset 000...0 to 111...1
        let mut total_w = 0usize;
        let mut total_v = 0i32;
        for i in 0..n {
            if mask & (1 << i) != 0 {     // item i is included in this subset
                total_w += weights[i];
                total_v += values[i];
            }
        }
        if total_w <= capacity {
            best = best.max(total_v);
        }
    }
    best
}`

const q2Opt = `fn knapsack(weights: &[usize], values: &[i32], capacity: usize) -> i32 {
    let n = weights.len();
    // dp[i][w] = max value using first i items with weight capacity w
    let mut dp = vec![vec![0i32; capacity + 1]; n + 1];

    for i in 1..=n {                          // process each item one by one
        let w_i = weights[i - 1];             // current item's weight (1-indexed)
        let v_i = values[i - 1];              // current item's value
        for w in 0..=capacity {               // for each possible weight limit
            // option 1: skip this item
            let skip = dp[i - 1][w];
            // option 2: take this item (only if it fits)
            let take = if w >= w_i { dp[i - 1][w - w_i] + v_i } else { 0 };
            dp[i][w] = skip.max(take);        // pick whichever gives more value
        }
    }

    dp[n][capacity]  // max value using all n items within capacity
}`

// ── Q3: Longest Common Subsequence ────────────────────────────────────────
const LCS_TABLE = `
LONGEST COMMON SUBSEQUENCE (LCS) — 2D table

s1 = "ABCDE",  s2 = "ACE"   →  LCS = "ACE", length = 3

dp[i][j] = LCS length for s1[0..i-1] and s2[0..j-1]

     ""   A   C   E
""  │  0   0   0   0
A   │  0   1   1   1    ← 'A'=='A': dp[0][0]+1=1
B   │  0   1   1   1    ← 'B'!='A','C','E': copy max from left/above
C   │  0   1   2   2    ← 'C'=='C': dp[1][1]+1=2
D   │  0   1   2   2    ← 'D'!='A','C','E'
E   │  0   1   2   3    ← 'E'=='E': dp[3][2]+1=3

Answer: dp[5][3] = 3

Rule:
  if s1[i-1] == s2[j-1]:  dp[i][j] = dp[i-1][j-1] + 1  (both chars match!)
  else:                    dp[i][j] = max(dp[i-1][j], dp[i][j-1])
                                       (skip one char from either string)
`

const q3Brute = `// Brute: recursive without memoization — O(2^(m+n))
fn lcs_brute(s1: &[u8], s2: &[u8], i: usize, j: usize) -> usize {
    if i == 0 || j == 0 {
        return 0;
    }
    if s1[i - 1] == s2[j - 1] {
        1 + lcs_brute(s1, s2, i - 1, j - 1)   // match: take both
    } else {
        lcs_brute(s1, s2, i - 1, j)            // skip s1's char
            .max(lcs_brute(s1, s2, i, j - 1)) // skip s2's char
    }
}`

const q3Opt = `fn lcs(s1: &str, s2: &str) -> usize {
    let s1 = s1.as_bytes();
    let s2 = s2.as_bytes();
    let (m, n) = (s1.len(), s2.len());
    // dp[i][j] = LCS length for s1[..i] and s2[..j]
    let mut dp = vec![vec![0usize; n + 1]; m + 1];  // (m+1)x(n+1) table, all zeros

    for i in 1..=m {
        for j in 1..=n {
            if s1[i - 1] == s2[j - 1] {           // characters match!
                dp[i][j] = dp[i - 1][j - 1] + 1;  // extend the LCS by 1
            } else {
                // no match: take the best we had without one of these chars
                dp[i][j] = dp[i - 1][j]            // skip s1[i-1]
                    .max(dp[i][j - 1]);             // skip s2[j-1]
            }
        }
    }

    dp[m][n]  // bottom-right = answer
}`

// ── Q4: Coin Change ────────────────────────────────────────────────────────
const COIN_TABLE = `
COIN CHANGE — 1D table filling

coins=[1,2,5], amount=11  →  minimum coins = 3 (5+5+1)

dp[a] = minimum coins to make amount a
dp[0] = 0  (0 coins needed to make amount 0)
dp[x] = infinity initially (impossible until proven otherwise)

Fill left to right for each amount:

amount: 0  1  2  3  4  5  6  7  8  9  10  11
  dp:   0  ∞  ∞  ∞  ∞  ∞  ∞  ∞  ∞  ∞   ∞   ∞   ← start

After coin=1:
        0  1  2  3  4  5  6  7  8  9  10  11

After coin=2:
        0  1  1  2  2  3  3  4  4  5   5   6

After coin=5:
        0  1  1  2  2  1  2  2  3  3   2   3   ← dp[11]=3 ✓

For each coin c, and each amount a >= c:
  dp[a] = min(dp[a], dp[a - c] + 1)
          "use one coin c, then solve the remaining amount a-c"
`

const q4Brute = `// Brute: try every combination recursively — O(amount^n) approximately
fn coin_change_brute(coins: &[i32], amount: i32) -> i32 {
    fn dfs(coins: &[i32], remaining: i32) -> i32 {
        if remaining == 0 { return 0; }
        if remaining < 0  { return i32::MAX; }
        let mut best = i32::MAX;
        for &coin in coins {
            let result = dfs(coins, remaining - coin);
            if result != i32::MAX {
                best = best.min(result + 1);  // +1 for this coin
            }
        }
        best
    }
    let result = dfs(coins, amount);
    if result == i32::MAX { -1 } else { result }
}`

const q4Opt = `fn coin_change(coins: &[i32], amount: i32) -> i32 {
    let amount = amount as usize;
    // dp[a] = minimum coins needed to make amount a
    let mut dp = vec![i32::MAX; amount + 1];
    dp[0] = 0;                              // base case: 0 coins to make amount 0

    for a in 1..=amount {                   // build up from amount 1 to target
        for &coin in coins {
            let c = coin as usize;
            if c <= a && dp[a - c] != i32::MAX {  // coin is small enough to use
                // use this coin once + best way to make up the rest
                dp[a] = dp[a].min(dp[a - c] + 1);
            }
        }
    }

    if dp[amount] == i32::MAX { -1 } else { dp[amount] }
}`

// ── Q5: Longest Increasing Subsequence ────────────────────────────────────
const LIS_TABLE = `
LONGEST INCREASING SUBSEQUENCE (LIS)

nums = [10, 9, 2, 5, 3, 7, 101, 18]

dp[i] = length of LIS ending AT index i (must include nums[i])

Index:  0    1    2    3    4    5    6    7
nums: [10,   9,   2,   5,   3,   7, 101,  18]
  dp: [ 1,   1,   1,   ?,   ?,   ?,   ?,   ?]

dp[3]=? (nums[3]=5): which earlier elements are smaller than 5?
  nums[2]=2 < 5  →  dp[2]+1 = 2
  dp[3] = 2  (subsequence: [2, 5])

dp[4]=? (nums[4]=3): which earlier elements are smaller than 3?
  nums[2]=2 < 3  →  dp[2]+1 = 2
  dp[4] = 2  (subsequence: [2, 3])

dp[5]=? (nums[5]=7): earlier elements smaller than 7?
  nums[0]=10 ✗, nums[1]=9 ✗, nums[2]=2 ✓(dp=1+1=2)
  nums[3]=5 ✓(dp=2+1=3), nums[4]=3 ✓(dp=2+1=3)
  dp[5] = 3  (subsequence: [2, 5, 7] or [2, 3, 7])

Final dp: [1, 1, 1, 2, 2, 3, 4, 4]
Answer = max(dp) = 4  (e.g. [2, 3, 7, 101])
`

const q5Brute = `// Brute: check every subsequence — O(2^n)
fn lis_brute(nums: &[i32]) -> usize {
    let n = nums.len();
    let mut best = 1;
    for mask in 1u32..(1 << n) {
        let subseq: Vec<i32> = (0..n)
            .filter(|&i| mask & (1 << i) != 0)
            .map(|i| nums[i])
            .collect();
        // check if this subsequence is strictly increasing
        let is_increasing = subseq.windows(2).all(|w| w[0] < w[1]);
        if is_increasing {
            best = best.max(subseq.len());
        }
    }
    best
}`

const q5Opt = `fn lis(nums: &[i32]) -> usize {
    let n = nums.len();
    // dp[i] = length of longest increasing subsequence ending at index i
    let mut dp = vec![1usize; n];  // every element alone is a subsequence of length 1

    for i in 1..n {
        for j in 0..i {                    // look at all elements before i
            if nums[j] < nums[i] {         // nums[j] can extend a subsequence ending at j
                dp[i] = dp[i].max(dp[j] + 1);  // extend that subsequence
            }
        }
    }

    *dp.iter().max().unwrap_or(&0)  // longest LIS ending at any index
}`

// ── PRACTICE answers ───────────────────────────────────────────────────────
const pq1Code = `// House Robber — can't rob adjacent houses, maximize total
fn rob(nums: &[i32]) -> i32 {
    if nums.is_empty() { return 0; }
    if nums.len() == 1 { return nums[0]; }

    // dp[i] = max money robbing from houses 0..=i
    // At house i: either rob it (prev2 + nums[i]) or skip it (prev1)
    let mut prev2 = nums[0];                        // dp[i-2]: best up to two houses ago
    let mut prev1 = nums[0].max(nums[1]);           // dp[i-1]: best up to one house ago

    for i in 2..nums.len() {
        let curr = prev1                            // skip house i
            .max(prev2 + nums[i]);                 // rob house i (can't use adjacent)
        prev2 = prev1;
        prev1 = curr;
    }

    prev1
}`

const pq2Code = `// Climbing Stairs — reach step n using 1 or 2 steps at a time
// Identical to Fibonacci: ways(n) = ways(n-1) + ways(n-2)
fn climb_stairs(n: u32) -> u32 {
    if n <= 2 { return n; }
    let mut prev2 = 1u32;  // ways to reach step 1
    let mut prev1 = 2u32;  // ways to reach step 2
    for _ in 3..=n {
        let curr = prev1 + prev2;  // reach step i from step i-1 or step i-2
        prev2 = prev1;
        prev1 = curr;
    }
    prev1
}`

const pq3Code = `// Unique Paths — grid from top-left to bottom-right, only right or down
fn unique_paths(m: usize, n: usize) -> u64 {
    // dp[i][j] = number of unique paths to reach cell (i, j)
    let mut dp = vec![vec![1u64; n]; m];  // first row and column are all 1 (only one way)

    for i in 1..m {
        for j in 1..n {
            // reach (i,j) from above (i-1,j) or from left (i,j-1)
            dp[i][j] = dp[i - 1][j] + dp[i][j - 1];
        }
    }

    dp[m - 1][n - 1]  // bottom-right corner
}`

const pq4Code = `// Edit Distance — minimum operations (insert/delete/replace) to convert s1 to s2
fn min_distance(s1: &str, s2: &str) -> usize {
    let s1 = s1.as_bytes();
    let s2 = s2.as_bytes();
    let (m, n) = (s1.len(), s2.len());
    // dp[i][j] = edit distance between s1[..i] and s2[..j]
    let mut dp = vec![vec![0usize; n + 1]; m + 1];

    for i in 0..=m { dp[i][0] = i; }  // delete all chars from s1 to reach empty s2
    for j in 0..=n { dp[0][j] = j; }  // insert all chars to build s2 from empty s1

    for i in 1..=m {
        for j in 1..=n {
            if s1[i - 1] == s2[j - 1] {
                dp[i][j] = dp[i - 1][j - 1];          // chars match: no operation needed
            } else {
                dp[i][j] = 1 + dp[i - 1][j - 1]      // replace s1[i-1] with s2[j-1]
                    .min(dp[i - 1][j])                 // delete s1[i-1]
                    .min(dp[i][j - 1]);                // insert s2[j-1] after position i
            }
        }
    }
    dp[m][n]
}`

const pq5Code = `// Partition Equal Subset Sum — can we split into two equal-sum subsets?
fn can_partition(nums: &[i32]) -> bool {
    let total: i32 = nums.iter().sum();
    if total % 2 != 0 { return false; }  // odd total can't be split into two equal halves
    let target = (total / 2) as usize;

    // dp[s] = true if some subset sums to exactly s
    let mut dp = vec![false; target + 1];
    dp[0] = true;                         // empty subset sums to 0

    for &num in nums {
        let num = num as usize;
        // iterate BACKWARD to avoid using the same num twice (0/1 knapsack trick)
        for s in (num..=target).rev() {
            dp[s] = dp[s] || dp[s - num];  // include num, or don't
        }
    }

    dp[target]  // can we reach exactly target?
}`

export default function DynamicProgrammingContent() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>

      <Sub title="What is Dynamic Programming?">
        <CodeBlock code={DP_WHAT_IS} lang="text" />
        <p style={{ lineHeight: 1.7, marginTop: 12 }}>
          DP sounds scary but the core idea is simple: <strong>don't solve the same
          problem twice</strong>. If you've already figured out the best way to make
          change for $7, and now you need the best way for $8, just check what you
          stored for $7 and add one coin. That stored result is your "table" or "memo".
        </p>
        <Callout type="tip">
          <strong>Trigger phrases:</strong> "maximum/minimum", "count ways", "longest/shortest",
          "is it possible". If the problem asks for an optimal value across many choices
          and choices overlap → DP.
        </Callout>
        <Callout type="info">
          <strong>The 3-step DP recipe:</strong> (1) Define what <code>dp[i]</code>
          (or <code>dp[i][j]</code>) means. (2) Write the recurrence: how does
          <code>dp[i]</code> depend on smaller subproblems? (3) Identify base cases
          (the smallest inputs you can answer directly). Fill the table, return the answer.
        </Callout>
      </Sub>

      <Sub title="Taught Questions">

        <QuestionCard
          num={1}
          title="Fibonacci (top-down vs bottom-up)"
          difficulty="Easy"
          problem={`Compute the nth Fibonacci number. fib(0)=0, fib(1)=1, fib(n)=fib(n-1)+fib(n-2).

Example: fib(10) = 55`}
          brute={<>
            <BigOBadge time="O(2ⁿ)" space="O(n)" />
            <CodeBlock code={q1Brute} lang="rust" />
            <Callout type="warn">Exponential time — fib(50) takes trillions of calls. The same subproblems get recalculated over and over.</Callout>
          </>}
          optimized={<>
            <BigOBadge time="O(n)" space="O(1) bottom-up" />
            <CodeBlock code={LIS_TABLE.includes('fib') ? '' : ''} lang="text" />
            <CodeBlock code={FIB_TABLE} lang="text" />
            <CodeBlock code={q1Opt} lang="rust" />
            <Callout type="tip">
              <strong>Aha moment:</strong> Memoization turns the tree into a straight line —
              each unique subproblem is solved exactly once. Bottom-up goes even further:
              since fib(n) only needs the previous two values, you can ditch the table
              entirely and use just two variables. O(1) space!
            </Callout>
            <Callout type="danger">
              <strong>Common mistake:</strong> In Rust, use <code>Vec&lt;Option&lt;i64&gt;&gt;</code>
              for the memo table, initialized with <code>vec![None; n + 1]</code>.
              Pattern-match with <code>if let Some(val) = memo[n]</code> to retrieve
              cached results safely.
            </Callout>
          </>}
          answer="Top-down: recurse + cache in Vec<Option<i64>>. Bottom-up: loop from 2 to n keeping only prev two values. Both O(n) time; bottom-up is O(1) space."
        />

        <QuestionCard
          num={2}
          title="0/1 Knapsack"
          difficulty="Medium"
          problem={`Given items with weights and values, and a weight capacity, find the maximum total value you can carry. Each item can be used at most once.

Example: weights=[2,3,4,5], values=[3,4,5,6], capacity=5 → 7 (items 0+1: weight 2+3=5, value 3+4=7)`}
          brute={<>
            <BigOBadge time="O(2ⁿ)" space="O(n)" />
            <CodeBlock code={q2Brute} lang="rust" />
            <Callout type="warn">Checking every subset is 2^n — fine for n=20, terrible for n=40+.</Callout>
          </>}
          optimized={<>
            <BigOBadge time="O(n·W)" space="O(n·W)" />
            <CodeBlock code={KNAPSACK_TABLE} lang="text" />
            <CodeBlock code={q2Opt} lang="rust" />
            <Callout type="tip">
              <strong>Aha moment:</strong> At each cell <code>dp[i][w]</code> you make
              one binary decision: take item i or skip it. "Take it" means you had
              <code>w - weight[i]</code> capacity before and gained its value.
              "Skip it" means the answer is the same as without this item.
              Just take the max of those two options.
            </Callout>
            <Callout type="danger">
              <strong>Common mistake:</strong> Forgetting the guard <code>if w &gt;= w_i</code>
              before computing the "take" option. If the item is heavier than current
              capacity, you can't take it — skip is the only option.
            </Callout>
          </>}
          answer="dp[i][w] = max(skip item i = dp[i-1][w], take item i = dp[i-1][w-weight[i]]+value[i]). Fill row by row. Answer at dp[n][capacity]."
        />

        <QuestionCard
          num={3}
          title="Longest Common Subsequence"
          difficulty="Medium"
          problem={`Given two strings, find the length of their longest common subsequence (characters don't need to be contiguous).

Example: s1="ABCDE", s2="ACE" → 3 (LCS = "ACE")`}
          brute={<>
            <BigOBadge time="O(2^(m+n))" space="O(m+n)" />
            <CodeBlock code={q3Brute} lang="rust" />
          </>}
          optimized={<>
            <BigOBadge time="O(m·n)" space="O(m·n)" />
            <CodeBlock code={LCS_TABLE} lang="text" />
            <CodeBlock code={q3Opt} lang="rust" />
            <Callout type="tip">
              <strong>Aha moment:</strong> When the characters match (<code>s1[i-1] == s2[j-1]</code>),
              you extend the diagonal cell by 1 — that's free progress. When they don't match,
              you take the better of "ignore last char of s1" or "ignore last char of s2".
              These two rules together fill the whole table correctly.
            </Callout>
            <Callout type="danger">
              <strong>Common mistake:</strong> 0-indexing confusion. The table is (m+1)×(n+1)
              with a row and column of zeros as base cases. When filling cell (i, j),
              you're comparing bytes at <code>s1[i-1]</code> and <code>s2[j-1]</code>
              via <code>as_bytes()</code>.
            </Callout>
          </>}
          answer="dp[i][j]: if chars match, dp[i-1][j-1]+1. Else max(dp[i-1][j], dp[i][j-1]). Fill the (m+1)×(n+1) table. Answer at dp[m][n]."
        />

        <QuestionCard
          num={4}
          title="Coin Change"
          difficulty="Medium"
          problem={`Given coins of certain denominations and a total amount, find the minimum number of coins needed to make that amount. Return -1 if impossible.

Example: coins=[1,2,5], amount=11 → 3 (5+5+1)`}
          brute={<>
            <BigOBadge time="O(amount^n)" space="O(amount)" />
            <CodeBlock code={q4Brute} lang="rust" />
            <Callout type="warn">Exponential without memoization — tries every combination of coins repeatedly.</Callout>
          </>}
          optimized={<>
            <BigOBadge time="O(amount · n)" space="O(amount)" />
            <CodeBlock code={COIN_TABLE} lang="text" />
            <CodeBlock code={q4Opt} lang="rust" />
            <Callout type="tip">
              <strong>Aha moment:</strong> The key insight is that <code>dp[a]</code> only
              depends on <code>dp[a - coin]</code> for each coin. So you can fill
              left-to-right, and each cell reuses values you've already computed.
              It's like climbing stairs — to reach step 11, you could have come from step
              10 (coin=1), step 9 (coin=2), or step 6 (coin=5).
            </Callout>
            <Callout type="danger">
              <strong>Common mistake:</strong> Initializing dp[0] = i32::MAX instead of 0.
              The base case is "0 coins to make amount 0". Without this, nothing propagates
              correctly through the table.
            </Callout>
          </>}
          answer="dp[0]=0, dp[1..amount]=i32::MAX. For each amount a, for each coin c: dp[a] = dp[a].min(dp[a-c]+1). Return dp[amount] or -1 if still i32::MAX."
        />

        <QuestionCard
          num={5}
          title="Longest Increasing Subsequence"
          difficulty="Medium"
          problem={`Find the length of the longest strictly increasing subsequence in an array.

Example: [10,9,2,5,3,7,101,18] → 4 (e.g. [2,3,7,101])`}
          brute={<>
            <BigOBadge time="O(2ⁿ)" space="O(n)" />
            <CodeBlock code={q5Brute} lang="rust" />
          </>}
          optimized={<>
            <BigOBadge time="O(n²)" space="O(n)" />
            <CodeBlock code={LIS_TABLE} lang="text" />
            <CodeBlock code={q5Opt} lang="rust" />
            <Callout type="tip">
              <strong>Aha moment:</strong> <code>dp[i]</code> means "the LIS that MUST
              end at index i". To compute it, look at every earlier index j where
              <code>nums[j] &lt; nums[i]</code> — you could extend that subsequence by
              appending <code>nums[i]</code>. Take the maximum of all those options.
              The answer is the overall max across all dp values.
            </Callout>
            <Callout type="danger">
              <strong>Common mistake:</strong> Returning <code>dp[n-1]</code> instead of
              <code>*dp.iter().max().unwrap()</code>. The longest subsequence doesn't have
              to END at the last index — it could end anywhere in the array.
            </Callout>
          </>}
          answer="dp[i]=1 initially (each element alone). For each i, for each j<i: if nums[j]<nums[i]: dp[i] = dp[i].max(dp[j]+1). Return *dp.iter().max().unwrap()."
        />

      </Sub>

      <Sub title="Practice Questions">
        <Callout type="info">
          For each problem: (1) define what dp[i] means, (2) write the recurrence
          before you code, (3) identify base cases. The code almost writes itself after that.
        </Callout>

        <QuestionCard
          num={6}
          title="House Robber"
          difficulty="Medium"
          practice
          problem={`You are a robber. Houses are in a line and adjacent houses have alarms connected — you can't rob two adjacent houses. Maximize stolen money.

Example: [2,7,9,3,1] → 12 (rob houses 0, 2, 4: 2+9+1=12)`}
          hints={[
            "dp[i] = max money robbing from houses 0 through i.",
            "At house i, you either rob it (prev2 + nums[i]) or skip it (prev1). Take the max.",
            "Only need the previous two dp values — use two variables instead of a full array.",
          ]}
          answer="dp[i] = dp[i-1].max(dp[i-2] + nums[i]). Optimize to two variables: prev2, prev1. Return prev1."
          answerCode={pq1Code}
        />

        <QuestionCard
          num={7}
          title="Climbing Stairs"
          difficulty="Easy"
          practice
          problem={`You're climbing n stairs. Each time you can climb 1 or 2 steps. How many distinct ways to reach the top?

Example: n=5 → 8`}
          hints={[
            "To reach stair n, you came from stair n-1 (took 1 step) or stair n-2 (took 2 steps).",
            "So ways(n) = ways(n-1) + ways(n-2). Sound familiar?",
            "This is exactly Fibonacci! Base cases: ways(1)=1, ways(2)=2.",
          ]}
          answer="Identical to Fibonacci: ways(n) = ways(n-1) + ways(n-2). Two variables, loop from 3 to n."
          answerCode={pq2Code}
        />

        <QuestionCard
          num={8}
          title="Unique Paths"
          difficulty="Medium"
          practice
          problem={`A robot is on an m×n grid at the top-left. It can only move right or down. How many unique paths reach the bottom-right?

Example: m=3, n=7 → 28`}
          hints={[
            "dp[i][j] = number of ways to reach cell (i, j).",
            "To reach (i,j) you came from (i-1,j) or (i,j-1). So dp[i][j] = dp[i-1][j] + dp[i][j-1].",
            "Base cases: the entire first row and first column are 1 (only one way to reach any cell in them — go straight across or straight down).",
          ]}
          answer="dp[i][j] = dp[i-1][j] + dp[i][j-1]. First row and column all 1s. Fill left-to-right, top-to-bottom. Return dp[m-1][n-1]."
          answerCode={pq3Code}
        />

        <QuestionCard
          num={9}
          title="Edit Distance"
          difficulty="Hard"
          practice
          problem={`Given two strings, return the minimum number of operations (insert, delete, replace a character) to convert one into the other.

Example: s1="horse", s2="ros" → 3`}
          hints={[
            "dp[i][j] = edit distance between s1[..i] and s2[..j].",
            "If s1[i-1]==s2[j-1]: dp[i][j] = dp[i-1][j-1] (no operation needed for matching chars).",
            "If they differ: dp[i][j] = 1 + min(dp[i-1][j-1] replace, dp[i-1][j] delete, dp[i][j-1] insert).",
          ]}
          answer="2D table. Match: copy diagonal. Mismatch: 1 + min(replace=diagonal, delete=above, insert=left). Base: dp[i][0]=i, dp[0][j]=j."
          answerCode={pq4Code}
        />

        <QuestionCard
          num={10}
          title="Partition Equal Subset Sum"
          difficulty="Medium"
          practice
          problem={`Given an integer array, determine if it can be partitioned into two subsets with equal sums.

Example: [1,5,11,5] → True (subsets [1,5,5] and [11])`}
          hints={[
            "Equal partition means each half sums to total/2. If total is odd, impossible immediately.",
            "Reduce to: can any subset sum to total/2? This is a 0/1 knapsack problem.",
            "dp[s] = true if some subset sums to s. For each num, iterate s backward from target to num: dp[s] |= dp[s-num].",
          ]}
          answer="If total is odd: false. Otherwise: 0/1 knapsack — dp[s] = can we reach sum s? Iterate nums; for each, update dp backward. Return dp[total/2]."
          answerCode={pq5Code}
        />
      </Sub>

    </div>
  )
}
