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

const GRAPH_ANATOMY = `
WHAT IS A GRAPH?

A graph is just nodes (circles) connected by edges (lines).

Undirected graph:         Directed graph (arrows):
   0 ── 1 ── 2               0 → 1 → 2
   |    |                    ↑       |
   3 ── 4                    4 ← 3 ←─┘

Nodes = vertices (the things)
Edges = connections between them

ADJACENCY LIST — most common in interviews:
  graph = {
    0: [1, 3],      ← node 0 connects to 1 and 3
    1: [0, 2, 4],   ← node 1 connects to 0, 2, 4
    2: [1],
    3: [0, 4],
    4: [1, 3]
  }
  Space: O(V + E)   ← great for sparse graphs

ADJACENCY MATRIX — good for dense graphs:
  matrix[i][j] = 1 means there's an edge from i to j
      0  1  2  3  4
  0 [ 0, 1, 0, 1, 0 ]
  1 [ 1, 0, 1, 0, 1 ]
  2 [ 0, 1, 0, 0, 0 ]
  3 [ 1, 0, 0, 0, 1 ]
  4 [ 0, 1, 0, 1, 0 ]
  Space: O(V²) — wasteful if few edges

GRID GRAPHS — the most common interview format:
  [[1,1,0],      The grid IS the graph. Each cell is a node.
   [1,0,0],      Neighbors = up, down, left, right.
   [0,0,1]]      No explicit adjacency list needed.
`

const BFS_DFS_COMPARE = `
BFS vs DFS — which to use?

         BFS (queue)                DFS (recursion/stack)
────────────────────────────────────────────────────────────
Level-by-level                 Goes as deep as possible first
Finds SHORTEST path            Finds A path (not shortest)
Uses a queue (deque)           Uses call stack (or explicit stack)
Good for: min steps, spread    Good for: cycle detection, all paths,
          shortest path          connectivity, island counting

BFS template:                  DFS template:
  visited = set()                visited = set()
  queue = deque([start])         def dfs(node):
  visited.add(start)               if node in visited: return
  while queue:                     visited.add(node)
    node = queue.popleft()         for neighbor in graph[node]:
    for nb in graph[node]:           dfs(neighbor)
      if nb not in visited:
        visited.add(nb)
        queue.append(nb)
`

// ── Q1: Number of Islands ──────────────────────────────────────────────────
const q1Brute = `# Brute: check every cell, trace islands with recursive DFS
# (This IS essentially the optimal approach — shown separately for clarity)
def num_islands_brute(grid):
    count = 0
    for r in range(len(grid)):
        for c in range(len(grid[0])):
            if grid[r][c] == '1':
                count += 1
                # sink all connected land to avoid double-counting
                def sink(r, c):
                    if r < 0 or r >= len(grid) or c < 0 or c >= len(grid[0]):
                        return
                    if grid[r][c] != '1':
                        return
                    grid[r][c] = '0'   # mark as visited by "sinking" it
                    sink(r+1,c); sink(r-1,c); sink(r,c+1); sink(r,c-1)
                sink(r, c)
    return count`

const q1Opt = `def num_islands(grid):
    if not grid:
        return 0
    rows, cols = len(grid), len(grid[0])
    count = 0

    def dfs(r, c):
        # out of bounds or water or already visited → stop
        if r < 0 or r >= rows or c < 0 or c >= cols or grid[r][c] != '1':
            return
        grid[r][c] = '#'               # mark as visited (any non-'1' value works)
        dfs(r+1, c)                    # explore all 4 directions
        dfs(r-1, c)
        dfs(r, c+1)
        dfs(r, c-1)

    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == '1':      # unvisited land cell → new island!
                count += 1
                dfs(r, c)              # sink the whole island
    return count`

// ── Q2: Flood Fill ─────────────────────────────────────────────────────────
const q2Brute = `# Brute: BFS collecting all connected cells first, then update
from collections import deque

def flood_fill_brute(image, sr, sc, color):
    original = image[sr][sc]
    if original == color:
        return image                   # no change needed
    rows, cols = len(image), len(image[0])
    queue = deque([(sr, sc)])
    cells_to_fill = []
    visited = set([(sr, sc)])
    while queue:
        r, c = queue.popleft()
        cells_to_fill.append((r, c))
        for dr, dc in [(1,0),(-1,0),(0,1),(0,-1)]:
            nr, nc = r+dr, c+dc
            if 0<=nr<rows and 0<=nc<cols and image[nr][nc]==original and (nr,nc) not in visited:
                visited.add((nr, nc))
                queue.append((nr, nc))
    for r, c in cells_to_fill:
        image[r][c] = color
    return image`

const q2Opt = `def flood_fill(image, sr, sc, color):
    original_color = image[sr][sc]
    if original_color == color:
        return image                   # already the target color, nothing to do

    rows, cols = len(image), len(image[0])

    def dfs(r, c):
        if r < 0 or r >= rows or c < 0 or c >= cols:
            return
        if image[r][c] != original_color:  # not the original color → stop
            return
        image[r][c] = color            # paint this cell
        dfs(r+1, c)                    # spread in all 4 directions
        dfs(r-1, c)
        dfs(r, c+1)
        dfs(r, c-1)

    dfs(sr, sc)
    return image`

// ── Q3: Clone Graph ────────────────────────────────────────────────────────
const q3Brute = `# Brute: two-pass — first collect all nodes, then recreate edges
from collections import deque

def clone_graph_brute(node):
    if not node:
        return None
    # pass 1: create clones for all nodes
    clones = {}
    queue = deque([node])
    clones[node] = Node(node.val)
    while queue:
        curr = queue.popleft()
        for nb in curr.neighbors:
            if nb not in clones:
                clones[nb] = Node(nb.val)
                queue.append(nb)
    # pass 2: wire neighbors
    for original, clone in clones.items():
        clone.neighbors = [clones[nb] for nb in original.neighbors]
    return clones[node]`

const q3Opt = `from collections import deque

def clone_graph(node):
    if not node:
        return None
    cloned = {}                        # maps original node → cloned node

    def dfs(n):
        if n in cloned:
            return cloned[n]           # already cloned this node → return it
        clone = Node(n.val)            # create a new node with the same value
        cloned[n] = clone              # register BEFORE recursing (handles cycles!)
        for nb in n.neighbors:
            clone.neighbors.append(dfs(nb))  # recursively clone each neighbor
        return clone

    return dfs(node)`

// ── Q4: Course Schedule ────────────────────────────────────────────────────
const q4Brute = `# Brute: try all topological orderings — O(V! * E)
def can_finish_brute(num_courses, prerequisites):
    from itertools import permutations
    graph = [[] for _ in range(num_courses)]
    for a, b in prerequisites:
        graph[b].append(a)             # b must come before a
    for order in permutations(range(num_courses)):
        pos = {v: i for i, v in enumerate(order)}
        valid = all(pos[b] < pos[a] for a, b in prerequisites)
        if valid:
            return True
    return False`

const q4Opt = `def can_finish(num_courses, prerequisites):
    # build adjacency list
    graph = [[] for _ in range(num_courses)]
    for a, b in prerequisites:
        graph[b].append(a)             # edge: b → a (b must come before a)

    # 0 = unvisited, 1 = currently in stack (cycle!), 2 = fully processed (safe)
    state = [0] * num_courses

    def has_cycle(course):
        if state[course] == 1:
            return True                # we're visiting this node again → cycle!
        if state[course] == 2:
            return False               # already fully processed → no cycle here
        state[course] = 1              # mark as "currently visiting"
        for next_course in graph[course]:
            if has_cycle(next_course):
                return True
        state[course] = 2              # fully done — no cycle found through here
        return False

    return not any(has_cycle(c) for c in range(num_courses))`

// ── Q5: Pacific Atlantic Water Flow ────────────────────────────────────────
const q5Brute = `# Brute: for every cell, BFS/DFS to check if water can reach both oceans
def pacific_atlantic_brute(heights):
    rows, cols = len(heights), len(heights[0])

    def can_reach(r, c, visited):
        queue = deque([(r, c)])
        visited.add((r, c))
        pacific = r == 0 or c == 0
        atlantic = r == rows-1 or c == cols-1
        while queue:
            cr, cc = queue.popleft()
            pacific = pacific or cr == 0 or cc == 0
            atlantic = atlantic or cr == rows-1 or cc == cols-1
            for dr, dc in [(1,0),(-1,0),(0,1),(0,-1)]:
                nr, nc = cr+dr, cc+dc
                if 0<=nr<rows and 0<=nc<cols and (nr,nc) not in visited and heights[nr][nc]<=heights[cr][cc]:
                    visited.add((nr,nc))
                    queue.append((nr,nc))
        return pacific, atlantic

    result = []
    for r in range(rows):
        for c in range(cols):
            p, a = can_reach(r, c, set())
            if p and a:
                result.append([r,c])
    return result`

const q5Opt = `from collections import deque

def pacific_atlantic(heights):
    rows, cols = len(heights), len(heights[0])

    def bfs(starts):
        # reverse BFS: from the ocean, climb UP (water flows down)
        visited = set(starts)
        queue = deque(starts)
        while queue:
            r, c = queue.popleft()
            for dr, dc in [(1,0),(-1,0),(0,1),(0,-1)]:
                nr, nc = r+dr, c+dc
                if (0<=nr<rows and 0<=nc<cols
                        and (nr,nc) not in visited
                        and heights[nr][nc] >= heights[r][c]):  # can flow from here to ocean
                    visited.add((nr, nc))
                    queue.append((nr, nc))
        return visited

    # Pacific touches top row and left column
    pacific_starts = [(r, 0) for r in range(rows)] + [(0, c) for c in range(cols)]
    # Atlantic touches bottom row and right column
    atlantic_starts = [(r, cols-1) for r in range(rows)] + [(rows-1, c) for c in range(cols)]

    pacific_reachable  = bfs(pacific_starts)
    atlantic_reachable = bfs(atlantic_starts)

    # cells reachable from BOTH oceans are the answer
    return [[r, c] for r in range(rows) for c in range(cols)
            if (r, c) in pacific_reachable and (r, c) in atlantic_reachable]`

// ── PRACTICE answers ───────────────────────────────────────────────────────
const pq1Code = `from collections import deque

# Word Ladder — BFS for shortest transformation sequence
def ladder_length(beginWord, endWord, wordList):
    word_set = set(wordList)
    if endWord not in word_set:
        return 0
    queue = deque([(beginWord, 1)])    # (current_word, steps_taken)
    visited = {beginWord}

    while queue:
        word, steps = queue.popleft()
        for i in range(len(word)):
            for ch in 'abcdefghijklmnopqrstuvwxyz':
                next_word = word[:i] + ch + word[i+1:]
                if next_word == endWord:
                    return steps + 1   # found the end!
                if next_word in word_set and next_word not in visited:
                    visited.add(next_word)
                    queue.append((next_word, steps + 1))
    return 0                           # no transformation path exists`

const pq2Code = `from collections import deque

# Rotting Oranges — multi-source BFS from all rotten oranges simultaneously
def oranges_rotting(grid):
    rows, cols = len(grid), len(grid[0])
    queue = deque()
    fresh_count = 0

    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == 2:
                queue.append((r, c, 0))   # (row, col, minutes)
            elif grid[r][c] == 1:
                fresh_count += 1

    minutes = 0
    while queue:
        r, c, t = queue.popleft()
        for dr, dc in [(1,0),(-1,0),(0,1),(0,-1)]:
            nr, nc = r+dr, c+dc
            if 0<=nr<rows and 0<=nc<cols and grid[nr][nc] == 1:
                grid[nr][nc] = 2           # rot this orange
                fresh_count -= 1
                minutes = t + 1
                queue.append((nr, nc, t+1))

    return minutes if fresh_count == 0 else -1`

const pq3Code = `# Number of Connected Components — DFS counting components
def count_components(n, edges):
    graph = [[] for _ in range(n)]
    for a, b in edges:
        graph[a].append(b)
        graph[b].append(a)

    visited = set()
    count = 0

    def dfs(node):
        visited.add(node)
        for nb in graph[node]:
            if nb not in visited:
                dfs(nb)

    for node in range(n):
        if node not in visited:
            count += 1             # new component found
            dfs(node)

    return count`

const pq4Code = `# Graph Valid Tree — valid tree = connected + no cycle (n nodes, n-1 edges)
def valid_tree(n, edges):
    if len(edges) != n - 1:
        return False               # too many or too few edges for a tree

    graph = [[] for _ in range(n)]
    for a, b in edges:
        graph[a].append(b)
        graph[b].append(a)

    visited = set()

    def dfs(node, parent):
        visited.add(node)
        for nb in graph[node]:
            if nb == parent:
                continue           # skip the edge we came from (undirected graph)
            if nb in visited:
                return False       # cycle detected!
            if not dfs(nb, node):
                return False
        return True

    return dfs(0, -1) and len(visited) == n  # no cycle AND all nodes connected`

const pq5Code = `from collections import deque

# Surrounded Regions — DFS/BFS from border O's, flip everything else
def solve(board):
    rows, cols = len(board), len(board[0])

    def dfs(r, c):
        if r < 0 or r >= rows or c < 0 or c >= cols or board[r][c] != 'O':
            return
        board[r][c] = 'S'          # mark as "safe" (connected to border)
        dfs(r+1,c); dfs(r-1,c); dfs(r,c+1); dfs(r,c-1)

    # step 1: mark all O's connected to any border as 'S' (safe)
    for r in range(rows):
        for c in range(cols):
            if (r in [0, rows-1] or c in [0, cols-1]) and board[r][c] == 'O':
                dfs(r, c)

    # step 2: flip remaining O's to X (they're surrounded), restore S's to O
    for r in range(rows):
        for c in range(cols):
            if board[r][c] == 'O':
                board[r][c] = 'X'  # truly surrounded → capture
            elif board[r][c] == 'S':
                board[r][c] = 'O'  # safe → restore`

export default function GraphBFSDFSContent() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>

      <Sub title="What is a Graph?">
        <CodeBlock code={GRAPH_ANATOMY} lang="text" />
        <Callout type="info">
          Most graph problems in interviews are actually <strong>grid problems</strong> —
          a 2D array where each cell is a node and its neighbors are up/down/left/right.
          You rarely need to build an explicit adjacency list. The grid IS the graph.
        </Callout>
      </Sub>

      <Sub title="BFS vs DFS — when to use which">
        <CodeBlock code={BFS_DFS_COMPARE} lang="text" />
        <Callout type="tip">
          <strong>Trigger phrases:</strong> "connected components", "number of islands",
          "shortest path", "can you reach", "cycle detection", "all paths".
          Rule of thumb: shortest path or level-by-level spread → BFS.
          Connectivity, cycle detection, exhaustive search → DFS.
        </Callout>
      </Sub>

      <Sub title="Taught Questions">

        <QuestionCard
          num={1}
          title="Number of Islands"
          difficulty="Medium"
          problem={`Given a 2D grid of '1's (land) and '0's (water), count the number of islands. An island is surrounded by water and formed by connecting adjacent lands horizontally or vertically.

Example:
11110
11010
11000
00000
→ 1 island`}
          brute={<>
            <BigOBadge time="O(m·n)" space="O(m·n)" />
            <CodeBlock code={q1Brute} lang="python" />
          </>}
          optimized={<>
            <BigOBadge time="O(m·n)" space="O(m·n)" />
            <CodeBlock code={q1Opt} lang="python" />
            <Callout type="tip">
              <strong>Aha moment:</strong> Every time you find a '1' you haven't visited,
              that's the start of a new island. Use DFS to "sink" the entire island
              (mark every connected cell as visited) so you don't count it again.
              Total work = O(m·n) because every cell is visited at most twice.
            </Callout>
            <Callout type="danger">
              <strong>Common mistake:</strong> Forgetting to mark cells visited BEFORE
              pushing neighbors to the queue/stack. Without this, you'll push the same cell
              many times and recurse infinitely.
            </Callout>
          </>}
          answer="For each unvisited '1': increment count, DFS to mark all connected '1's as visited. Total count = number of islands."
        />

        <QuestionCard
          num={2}
          title="Flood Fill"
          difficulty="Easy"
          problem={`Starting from pixel (sr, sc), replace the color of all connected pixels that have the same original color as (sr, sc) with the new color. Return the modified image.

Example: image=[[1,1,1],[1,1,0],[1,0,1]], sr=1, sc=1, color=2 → [[2,2,2],[2,2,0],[2,0,1]]`}
          brute={<>
            <BigOBadge time="O(m·n)" space="O(m·n)" />
            <CodeBlock code={q2Brute} lang="python" />
          </>}
          optimized={<>
            <BigOBadge time="O(m·n)" space="O(m·n)" />
            <CodeBlock code={q2Opt} lang="python" />
            <Callout type="tip">
              <strong>Aha moment:</strong> This is exactly Number of Islands but instead of
              counting, you're painting. DFS from (sr, sc), paint every cell with the
              original color to the new color. The only tricky case: if original already
              equals new color, return immediately or you'll loop forever.
            </Callout>
            <Callout type="danger">
              <strong>Common mistake:</strong> Not checking <code>original_color == color</code>
              at the start. If they're the same, DFS would keep revisiting painted cells
              (they still match original_color) causing infinite recursion.
            </Callout>
          </>}
          answer="Check if original == new color (return early if so). DFS from (sr, sc): paint each cell matching original_color, recurse in 4 directions."
        />

        <QuestionCard
          num={3}
          title="Clone Graph"
          difficulty="Medium"
          problem={`Given a reference to a node in a connected undirected graph, return a deep copy (clone) of the graph. Each node has a val and a list of neighbors.`}
          brute={<>
            <BigOBadge time="O(V+E)" space="O(V)" />
            <CodeBlock code={q3Brute} lang="python" />
          </>}
          optimized={<>
            <BigOBadge time="O(V+E)" space="O(V)" />
            <CodeBlock code={q3Opt} lang="python" />
            <Callout type="tip">
              <strong>Aha moment:</strong> The visited map does double duty — it both
              prevents infinite loops (graphs can have cycles) AND maps original nodes to
              their clones. Register the clone in the map BEFORE recursing into neighbors;
              otherwise a cycle would cause infinite recursion.
            </Callout>
            <Callout type="danger">
              <strong>Common mistake:</strong> Creating a new clone every time you visit a
              node. Without the map, a node with two edges pointing to it creates two
              separate clones — breaking the graph structure.
            </Callout>
          </>}
          answer="DFS with a cloned={} map. For each node: if already cloned, return it. Else create clone, add to map, then recursively clone all neighbors and attach."
        />

        <QuestionCard
          num={4}
          title="Course Schedule (Cycle Detection)"
          difficulty="Medium"
          problem={`There are numCourses courses (0 to n-1). Prerequisites[i] = [a, b] means you must take course b before a. Return true if you can finish all courses (no cycles).

Example: numCourses=2, prerequisites=[[1,0]] → true
Example: numCourses=2, prerequisites=[[1,0],[0,1]] → false (cycle!)`}
          brute={<>
            <BigOBadge time="O(V! · E)" space="O(V)" />
            <CodeBlock code={q4Brute} lang="python" />
            <Callout type="warn">Trying all orderings is completely impractical — O(V!) factorial time.</Callout>
          </>}
          optimized={<>
            <BigOBadge time="O(V+E)" space="O(V)" />
            <CodeBlock code={q4Opt} lang="python" />
            <Callout type="tip">
              <strong>Aha moment:</strong> The 3-color trick: unvisited (0), currently being
              explored (1), fully done (2). If DFS reaches a node marked 1, you've found a
              cycle — you're back on a path you're currently walking. Mark 2 when you fully
              finish a node so future visits skip it without false cycle alerts.
            </Callout>
            <Callout type="danger">
              <strong>Common mistake:</strong> Using a simple visited set (True/False).
              That can't distinguish "currently in the DFS path" from "already fully
              processed". You need 3 states to correctly detect back-edges (cycles).
            </Callout>
          </>}
          answer="Build adjacency list. DFS with state[] (0=unvisited, 1=visiting, 2=done). If you reach state 1: cycle found. Mark 2 when done. No cycle = can finish all courses."
        />

        <QuestionCard
          num={5}
          title="Pacific Atlantic Water Flow"
          difficulty="Medium"
          problem={`Given a height matrix, water can flow to adjacent cells with equal or lower height. Water can flow off the left/top edge (Pacific) or right/bottom edge (Atlantic). Return all cells from which water can reach BOTH oceans.`}
          brute={<>
            <BigOBadge time="O(m²·n²)" space="O(m·n)" />
            <CodeBlock code={q5Brute} lang="python" />
          </>}
          optimized={<>
            <BigOBadge time="O(m·n)" space="O(m·n)" />
            <CodeBlock code={q5Opt} lang="python" />
            <Callout type="tip">
              <strong>Aha moment:</strong> Instead of flowing water DOWN from each cell,
              reverse the problem: start from each ocean's border and climb UP (only move
              to cells with equal or greater height). BFS from all Pacific border cells
              gives you every cell that can drain to Pacific. Do the same for Atlantic.
              The intersection is your answer.
            </Callout>
            <Callout type="danger">
              <strong>Common mistake:</strong> Flowing water forward (downhill) from each
              cell. That requires restarting DFS for every cell — O(m²n²). Reverse BFS
              from borders runs in O(mn) total.
            </Callout>
          </>}
          answer="Reverse BFS: from Pacific borders climb uphill, mark reachable cells. Same from Atlantic borders. Intersection = cells that drain to both."
        />

      </Sub>

      <Sub title="Practice Questions">
        <Callout type="info">Graph problems look scary but they all reduce to the same 3 steps: build the graph (or use the grid directly), track visited, BFS or DFS from the right starting points.</Callout>

        <QuestionCard
          num={6}
          title="Word Ladder"
          difficulty="Hard"
          practice
          problem={`Transform beginWord to endWord by changing one letter at a time. Each intermediate word must be in the word list. Return the length of the shortest transformation sequence (0 if impossible).

Example: beginWord="hit", endWord="cog", wordList=["hot","dot","dog","lot","log","cog"] → 5`}
          hints={[
            "Model each word as a node; two words are connected if they differ by exactly one letter. Shortest path → BFS.",
            "From the current word, try replacing each character with every letter a-z. If the resulting word is in wordList and unvisited, add it to the queue.",
            "Return steps+1 when you reach endWord. Return 0 if queue empties without finding it.",
          ]}
          answer="BFS. From each word, generate all one-letter variants. If variant is in wordList and unvisited, add to queue. Return step count when endWord is reached."
          answerCode={pq1Code}
        />

        <QuestionCard
          num={7}
          title="Rotting Oranges"
          difficulty="Medium"
          practice
          problem={`In a grid: 0=empty, 1=fresh orange, 2=rotten orange. Each minute, rotten oranges spread to adjacent fresh ones. Return min minutes until no fresh remain, or -1 if impossible.

Example: [[2,1,1],[1,1,0],[0,1,1]] → 4`}
          hints={[
            "Multi-source BFS: start all rotten oranges in the queue simultaneously (minute 0).",
            "Each BFS step = one minute passing. Spread rot to all adjacent fresh oranges.",
            "Track fresh_count. When it hits 0, return current time. If still > 0 after BFS, return -1.",
          ]}
          answer="Seed BFS queue with all rotten oranges at time 0. Each pop rots adjacent fresh oranges and adds them to queue. Return final time or -1 if any fresh remain."
          answerCode={pq2Code}
        />

        <QuestionCard
          num={8}
          title="Number of Connected Components"
          difficulty="Medium"
          practice
          problem={`Given n nodes and a list of undirected edges, return the number of connected components.

Example: n=5, edges=[[0,1],[1,2],[3,4]] → 2`}
          hints={[
            "Build adjacency list from edges. DFS from each unvisited node, marking all reachable nodes visited.",
            "Each DFS call that starts from an unvisited node = one new component.",
            "Alternatively: Union-Find (DSU) — merge nodes that share an edge, count distinct roots.",
          ]}
          answer="DFS from each unvisited node (increment count each time). Or Union-Find: merge connected pairs, count distinct roots."
          answerCode={pq3Code}
        />

        <QuestionCard
          num={9}
          title="Graph Valid Tree"
          difficulty="Medium"
          practice
          problem={`Given n nodes (0 to n-1) and a list of undirected edges, return true if they form a valid tree (connected + no cycles).

Example: n=5, edges=[[0,1],[0,2],[0,3],[1,4]] → true`}
          hints={[
            "A tree with n nodes has exactly n-1 edges. Check that first — wrong edge count instantly fails.",
            "DFS the graph checking for cycles (if you reach an already-visited node that isn't your parent, it's a cycle).",
            "Also check that all n nodes are visited (if not, the graph is disconnected — not a tree).",
          ]}
          answer="Prereq: len(edges)==n-1. Then DFS with parent tracking: if we reach a visited node that isn't our parent, it's a cycle. Valid tree = no cycle + all nodes visited."
          answerCode={pq4Code}
        />

        <QuestionCard
          num={10}
          title="Surrounded Regions"
          difficulty="Medium"
          practice
          problem={`Given a board of 'X' and 'O', capture all 'O' regions surrounded by 'X' (flip them to 'X'). 'O's connected to the border are NOT captured.

Example:
XXXX    XXXX
XOOX → XXXX
XXOX    XXOX
XOXX    XOXX`}
          hints={[
            "Any 'O' connected to a border 'O' is safe — it can't be surrounded.",
            "DFS/BFS from every border 'O', marking all connected 'O's as safe ('S').",
            "Then flip all remaining 'O's to 'X' (surrounded), and restore 'S' back to 'O'.",
          ]}
          answer="DFS from all border O's marking them 'S'. Then: O → X (captured), S → O (restored), X stays X."
          answerCode={pq5Code}
        />
      </Sub>

    </div>
  )
}
