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

  def backtrack(choices, current_state):
      if is_solution(current_state):
          save(current_state)
          return
      for choice in choices:
          make(choice)          ← add choice to current_state
          backtrack(...)        ← recurse deeper
          undo(choice)          ← REMOVE it (backtrack!)
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
const q1Brute = `# Brute: iterative — for each new number, double all existing subsets
def subsets_iterative(nums):
    result = [[]]                        # start with empty subset
    for num in nums:
        new_subsets = []
        for existing in result:          # for every subset we have so far
            new_subsets.append(existing + [num])  # add a version WITH num
        result.extend(new_subsets)       # add those new subsets
    return result`

const q1Opt = `def subsets(nums):
    result = []

    def backtrack(start, current):
        result.append(list(current))     # EVERY state is a valid subset → collect now
        for i in range(start, len(nums)):
            current.append(nums[i])      # choose: include nums[i]
            backtrack(i + 1, current)    # recurse: only pick from nums[i+1] onward
            current.pop()                # undo: backtrack (remove nums[i])

    backtrack(0, [])
    return result`

// ── Q2: Subsets With Duplicates ────────────────────────────────────────────
const q2Brute = `# Brute: generate all subsets, convert to tuples, deduplicate with a set
def subsets_with_dups_brute(nums):
    nums.sort()
    result = set()
    def backtrack(start, current):
        result.add(tuple(current))
        for i in range(start, len(nums)):
            current.append(nums[i])
            backtrack(i + 1, current)
            current.pop()
    backtrack(0, [])
    return [list(t) for t in result]`

const q2Opt = `def subsets_with_dups(nums):
    nums.sort()                          # MUST sort first so duplicates are adjacent
    result = []

    def backtrack(start, current):
        result.append(list(current))
        for i in range(start, len(nums)):
            # SKIP duplicates: if nums[i] == nums[i-1] and i > start,
            # we'd be starting the same branch we already explored
            if i > start and nums[i] == nums[i - 1]:
                continue
            current.append(nums[i])
            backtrack(i + 1, current)
            current.pop()

    backtrack(0, [])
    return result`

// ── Q3: Permutations ───────────────────────────────────────────────────────
const q3Brute = `from itertools import permutations

def permute_brute(nums):
    return [list(p) for p in permutations(nums)]  # let Python do the work`

const q3Opt = `def permute(nums):
    result = []

    def backtrack(current, remaining):
        if not remaining:                # used all numbers → complete permutation
            result.append(list(current))
            return
        for i in range(len(remaining)):
            current.append(remaining[i])           # choose: pick remaining[i]
            # new remaining = everything except the chosen element
            backtrack(current, remaining[:i] + remaining[i+1:])
            current.pop()                          # undo the choice

    backtrack([], nums)
    return result`

// ── Q4: Letter Combinations of Phone Number ────────────────────────────────
const q4Brute = `# Brute: iterative — multiply out character lists
from itertools import product

def letter_combinations_brute(digits):
    if not digits:
        return []
    phone = {'2':'abc','3':'def','4':'ghi','5':'jkl',
             '6':'mno','7':'pqrs','8':'tuv','9':'wxyz'}
    groups = [phone[d] for d in digits]
    return [''.join(combo) for combo in product(*groups)]`

const q4Opt = `def letter_combinations(digits):
    if not digits:
        return []
    phone = {'2':'abc','3':'def','4':'ghi','5':'jkl',
             '6':'mno','7':'pqrs','8':'tuv','9':'wxyz'}
    result = []

    def backtrack(index, current):
        if index == len(digits):         # used all digits → complete combination
            result.append(''.join(current))
            return
        for letter in phone[digits[index]]:  # try each letter for this digit
            current.append(letter)           # choose
            backtrack(index + 1, current)    # recurse to next digit
            current.pop()                    # undo

    backtrack(0, [])
    return result`

// ── Q5: Generate Parentheses ───────────────────────────────────────────────
const q5Brute = `# Brute: generate all 2n-length strings, filter valid ones
def generate_parentheses_brute(n):
    result = []
    def generate(s):
        if len(s) == 2 * n:
            # check if it's valid
            count = 0
            for c in s:
                if c == '(':
                    count += 1
                else:
                    count -= 1
                if count < 0:
                    return               # invalid at this point
            result.append(s)
            return
        generate(s + '(')
        generate(s + ')')
    generate('')
    return result`

const q5Opt = `def generate_parentheses(n):
    result = []

    def backtrack(current, open_count, close_count):
        if len(current) == 2 * n:       # used all n pairs → complete string
            result.append(''.join(current))
            return
        if open_count < n:              # can still add an open paren
            current.append('(')
            backtrack(current, open_count + 1, close_count)
            current.pop()              # undo
        if close_count < open_count:   # can add close paren only if it matches an open
            current.append(')')
            backtrack(current, open_count, close_count + 1)
            current.pop()              # undo

    backtrack([], 0, 0)
    return result`

// ── PRACTICE answers ───────────────────────────────────────────────────────
const pq1Code = `# Combination Sum — find all combinations that sum to target (reuse allowed)
def combination_sum(candidates, target):
    result = []
    candidates.sort()                    # sort so we can prune early

    def backtrack(start, current, remaining):
        if remaining == 0:               # hit the target exactly → valid combo
            result.append(list(current))
            return
        for i in range(start, len(candidates)):
            if candidates[i] > remaining:
                break                    # sorted, so all further are also too big
            current.append(candidates[i])
            # same i: can reuse candidates[i] (not i+1!)
            backtrack(i, current, remaining - candidates[i])
            current.pop()               # undo

    backtrack(0, [], target)
    return result`

const pq2Code = `# Word Search — find if word exists in grid as a path
def exist(board, word):
    rows, cols = len(board), len(board[0])

    def backtrack(r, c, index):
        if index == len(word):           # matched all characters → found it!
            return True
        if r < 0 or r >= rows or c < 0 or c >= cols:
            return False                 # out of bounds
        if board[r][c] != word[index]:
            return False                 # wrong character
        # mark as visited by temporarily replacing with a sentinel
        temp = board[r][c]
        board[r][c] = '#'               # can't revisit this cell in this path
        # try all 4 directions
        found = (backtrack(r+1, c, index+1) or
                 backtrack(r-1, c, index+1) or
                 backtrack(r, c+1, index+1) or
                 backtrack(r, c-1, index+1))
        board[r][c] = temp              # undo: restore cell
        return found

    for r in range(rows):
        for c in range(cols):
            if backtrack(r, c, 0):      # try starting from every cell
                return True
    return False`

const pq3Code = `# N-Queens — place n queens so none attack each other
def solve_n_queens(n):
    result = []
    # track which columns and diagonals are occupied
    cols = set()
    diag1 = set()    # row - col is constant on a '/' diagonal
    diag2 = set()    # row + col is constant on a '\\' diagonal
    board = [['.' for _ in range(n)] for _ in range(n)]

    def backtrack(row):
        if row == n:                     # placed queens in all n rows
            result.append([''.join(r) for r in board])
            return
        for col in range(n):
            # check if this cell is under attack
            if col in cols or (row-col) in diag1 or (row+col) in diag2:
                continue
            # place queen
            board[row][col] = 'Q'
            cols.add(col)
            diag1.add(row - col)
            diag2.add(row + col)
            backtrack(row + 1)           # move to next row
            # remove queen (backtrack)
            board[row][col] = '.'
            cols.remove(col)
            diag1.remove(row - col)
            diag2.remove(row + col)

    backtrack(0)
    return result`

const pq4Code = `# Sudoku Solver — fill in the board so each row/col/box has 1-9
def solve_sudoku(board):
    def is_valid(row, col, num):
        # check row, column, and 3x3 box
        box_r, box_c = 3 * (row // 3), 3 * (col // 3)
        for i in range(9):
            if board[row][i] == num:    return False   # row conflict
            if board[i][col] == num:    return False   # col conflict
            if board[box_r + i//3][box_c + i%3] == num: return False  # box conflict
        return True

    def backtrack():
        for r in range(9):
            for c in range(9):
                if board[r][c] == '.':       # find next empty cell
                    for num in '123456789':
                        if is_valid(r, c, num):
                            board[r][c] = num        # place the digit
                            if backtrack():
                                return True          # solution found downstream
                            board[r][c] = '.'        # undo (backtrack)
                    return False             # no digit worked → backtrack further
        return True                          # no empty cells → board is solved

    backtrack()`

const pq5Code = `# Palindrome Partitioning — all ways to split string into palindrome parts
def partition(s):
    result = []

    def is_palindrome(sub):
        return sub == sub[::-1]

    def backtrack(start, current):
        if start == len(s):              # used the whole string → valid partition
            result.append(list(current))
            return
        for end in range(start + 1, len(s) + 1):
            substring = s[start:end]
            if is_palindrome(substring): # only branch if it's a palindrome
                current.append(substring)
                backtrack(end, current)  # recurse from where we left off
                current.pop()            # undo

    backtrack(0, [])
    return result`

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
            <CodeBlock code={q1Brute} lang="python" />
            <Callout type="warn">Iterative doubling works but the backtracking approach generalizes better to subsets-with-duplicates, permutations, and combinations.</Callout>
          </>}
          optimized={<>
            <BigOBadge time="O(n·2ⁿ)" space="O(n)" />
            <CodeBlock code={q1Opt} lang="python" />
            <Callout type="tip">
              <strong>Aha moment:</strong> Unlike most backtracking problems, you collect
              the current state at <em>every</em> call (including the empty set at the start).
              You don't wait for a leaf — every node in the recursion tree is a valid answer.
            </Callout>
            <Callout type="danger">
              <strong>Common mistake:</strong> Appending <code>current</code> instead of
              <code>list(current)</code>. Since <code>current</code> is a mutable list that
              gets modified as we backtrack, you must copy it when saving to results.
            </Callout>
          </>}
          answer="Backtrack: at each call append a copy of current, then loop from start to end. Include nums[i], recurse with i+1, then remove nums[i]."
        />

        <QuestionCard
          num={2}
          title="Subsets With Duplicates"
          difficulty="Medium"
          problem={`Given a collection of integers that might contain duplicates, return all possible unique subsets.

Example: [1,2,2] → [[],[1],[1,2],[1,2,2],[2],[2,2]]`}
          brute={<>
            <BigOBadge time="O(n·2ⁿ)" space="O(n·2ⁿ)" />
            <CodeBlock code={q2Brute} lang="python" />
            <Callout type="warn">Using a set to deduplicate works but wastes memory converting lists to tuples.</Callout>
          </>}
          optimized={<>
            <BigOBadge time="O(n·2ⁿ)" space="O(n)" />
            <CodeBlock code={q2Opt} lang="python" />
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
          answer="Sort first. Same as Subsets but add: if i > start and nums[i] == nums[i-1]: skip (continue). This skips duplicate branches at the same recursion level."
        />

        <QuestionCard
          num={3}
          title="Permutations"
          difficulty="Medium"
          problem={`Given a collection of distinct integers, return all possible permutations.

Example: [1,2,3] → [[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]`}
          brute={<>
            <BigOBadge time="O(n·n!)" space="O(n·n!)" />
            <CodeBlock code={q3Brute} lang="python" />
          </>}
          optimized={<>
            <BigOBadge time="O(n·n!)" space="O(n)" />
            <CodeBlock code={q3Opt} lang="python" />
            <Callout type="tip">
              <strong>Aha moment:</strong> Unlike subsets (where order doesn't matter),
              permutations care about order — so at each level you can try ANY remaining
              element, not just ones that come after the current index. That's why we pass
              the full <code>remaining</code> list and remove the chosen element from it.
            </Callout>
            <Callout type="danger">
              <strong>Common mistake:</strong> Using <code>start</code> (like subsets) instead
              of removing the chosen element from the pool. Subsets enforce "only pick forward"
              to avoid duplicates. Permutations need every remaining element to be an option.
            </Callout>
          </>}
          answer="Backtrack with a remaining pool. At each level: try every element in remaining, add to current, recurse with remaining minus that element, undo."
        />

        <QuestionCard
          num={4}
          title="Letter Combinations of a Phone Number"
          difficulty="Medium"
          problem={`Given a string of digits 2-9, return all possible letter combinations the number could represent (like a phone keypad).

Example: "23" → ["ad","ae","af","bd","be","bf","cd","ce","cf"]`}
          brute={<>
            <BigOBadge time="O(4ⁿ·n)" space="O(4ⁿ·n)" />
            <CodeBlock code={q4Brute} lang="python" />
          </>}
          optimized={<>
            <BigOBadge time="O(4ⁿ·n)" space="O(n)" />
            <CodeBlock code={q4Opt} lang="python" />
            <Callout type="tip">
              <strong>Aha moment:</strong> Each digit maps to 3-4 letters. Use an index
              into the digits string to know which digit you're currently mapping. At each
              level, try every letter for <code>digits[index]</code>, then recurse to
              <code>index + 1</code>.
            </Callout>
            <Callout type="danger">
              <strong>Common mistake:</strong> Building the string with concatenation
              (<code>current + letter</code>) instead of a list + pop. Concatenation creates
              a new string each time (extra allocation). Using a list and appending/popping
              is cleaner and more efficient.
            </Callout>
          </>}
          answer="Backtrack with digit index. At each level: try each letter for digits[index], append to current list, recurse to index+1, pop. When index == len(digits), join and save."
        />

        <QuestionCard
          num={5}
          title="Generate Parentheses"
          difficulty="Medium"
          problem={`Given n pairs of parentheses, generate all combinations of well-formed parentheses.

Example: n=3 → ["((()))","(()())","(())()","()(())","()()()"]`}
          brute={<>
            <BigOBadge time="O(2²ⁿ·n)" space="O(2²ⁿ·n)" />
            <CodeBlock code={q5Brute} lang="python" />
            <Callout type="warn">Generating all 2^(2n) strings and filtering is massively wasteful. Constraint-aware backtracking only builds valid strings.</Callout>
          </>}
          optimized={<>
            <BigOBadge time="O(4ⁿ/√n)" space="O(n)" />
            <CodeBlock code={q5Opt} lang="python" />
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
          answer="Backtrack with open_count and close_count. Add '(' if open < n. Add ')' if close < open. Collect when open == close == n."
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
          answer="Sort. Backtrack(start, remaining). Try each candidate from start: if remaining==0 collect, if candidate <= remaining add it and recurse with same i (allow reuse), undo."
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
            "Recurse in 4 directions (up/down/left/right). Return True as soon as any direction succeeds.",
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
            "Track which columns and diagonals (two kinds: '/' and '\\') are occupied using sets.",
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
            "Scan for the first empty cell. Try digits 1-9. If valid, place it and recurse.",
            "If recursion returns True, the board is solved. If no digit works, return False (trigger backtrack).",
            "Validity check: same digit must not appear in the same row, column, or 3×3 box.",
          ]}
          answer="Find empty cell, try '1'-'9'. If valid (row/col/box clear), place it and recurse. If recursion solves it, return True. Otherwise remove and try next digit. If none work, return False."
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
            "Backtrack with a start index. At each step, try every possible first piece: s[start:end] for all end values.",
            "Only recurse deeper if s[start:end] is a palindrome. Skip non-palindromes entirely.",
            "When start == len(s), you've cut the whole string into palindromes — collect the partition.",
          ]}
          answer="Backtrack(start, current). For each end from start+1 to len(s): if s[start:end] is palindrome, add to current, recurse from end, pop. Collect when start == len(s)."
          answerCode={pq5Code}
        />
      </Sub>

    </div>
  )
}
