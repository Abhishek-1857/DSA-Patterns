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
const q1Brute = `// Brute: check every cell, trace islands with recursive DFS
// (This IS essentially the optimal approach — shown separately for clarity)
fn num_islands_brute(grid: &mut Vec<Vec<char>>) -> i32 {
    let rows = grid.len();
    let cols = grid[0].len();
    let mut count = 0;

    for r in 0..rows {
        for c in 0..cols {
            if grid[r][c] == '1' {
                count += 1;
                // sink all connected land to avoid double-counting
                sink(grid, r, c, rows, cols);
            }
        }
    }
    count
}

fn sink(grid: &mut Vec<Vec<char>>, r: usize, c: usize, rows: usize, cols: usize) {
    if r >= rows || c >= cols || grid[r][c] != '1' {
        return;
    }
    grid[r][c] = '0';   // mark as visited by "sinking" it
    sink(grid, r + 1, c, rows, cols);
    if r > 0 { sink(grid, r - 1, c, rows, cols); }  // guard against underflow
    sink(grid, r, c + 1, rows, cols);
    if c > 0 { sink(grid, r, c - 1, rows, cols); }
}`

const q1Opt = `fn num_islands(grid: &mut Vec<Vec<char>>) -> i32 {
    let rows = grid.len();
    let cols = grid[0].len();
    let mut count = 0;

    for r in 0..rows {
        for c in 0..cols {
            if grid[r][c] == '1' {      // unvisited land cell → new island!
                count += 1;
                dfs(grid, r, c, rows, cols);  // sink the whole island
            }
        }
    }
    count
}

fn dfs(grid: &mut Vec<Vec<char>>, r: usize, c: usize, rows: usize, cols: usize) {
    // out of bounds or water or already visited → stop
    if r >= rows || c >= cols || grid[r][c] != '1' {
        return;
    }
    grid[r][c] = '#';               // mark as visited (any non-'1' value works)
    dfs(grid, r + 1, c, rows, cols);  // explore all 4 directions
    if r > 0 { dfs(grid, r - 1, c, rows, cols); }  // guard: r is usize, can't go below 0
    dfs(grid, r, c + 1, rows, cols);
    if c > 0 { dfs(grid, r, c - 1, rows, cols); }
}`

// ── Q2: Flood Fill ─────────────────────────────────────────────────────────
const q2Brute = `// Brute: BFS collecting all connected cells first, then update
use std::collections::{VecDeque, HashSet};

fn flood_fill_brute(image: &mut Vec<Vec<i32>>, sr: usize, sc: usize, color: i32) -> &Vec<Vec<i32>> {
    let original = image[sr][sc];
    if original == color {
        return image;                   // no change needed
    }
    let rows = image.len();
    let cols = image[0].len();
    let mut queue: VecDeque<(usize, usize)> = VecDeque::new();
    let mut cells_to_fill: Vec<(usize, usize)> = Vec::new();
    let mut visited: HashSet<(usize, usize)> = HashSet::new();

    queue.push_back((sr, sc));
    visited.insert((sr, sc));

    while let Some((r, c)) = queue.pop_front() {
        cells_to_fill.push((r, c));
        // check all 4 neighbors
        let neighbors = [
            (r + 1, c), (r, c + 1),
            (r.wrapping_sub(1), c), (r, c.wrapping_sub(1)),
        ];
        for (nr, nc) in neighbors {
            if nr < rows && nc < cols
                && image[nr][nc] == original
                && !visited.contains(&(nr, nc))
            {
                visited.insert((nr, nc));
                queue.push_back((nr, nc));
            }
        }
    }
    for (r, c) in cells_to_fill {
        image[r][c] = color;
    }
    image
}`

const q2Opt = `fn flood_fill(image: &mut Vec<Vec<i32>>, sr: usize, sc: usize, color: i32) {
    let original_color = image[sr][sc];
    if original_color == color {
        return;                         // already the target color, nothing to do
    }
    let rows = image.len();
    let cols = image[0].len();
    dfs_fill(image, sr, sc, original_color, color, rows, cols);
}

fn dfs_fill(
    image: &mut Vec<Vec<i32>>,
    r: usize, c: usize,
    original: i32, color: i32,
    rows: usize, cols: usize,
) {
    if r >= rows || c >= cols {
        return;
    }
    if image[r][c] != original {        // not the original color → stop
        return;
    }
    image[r][c] = color;                // paint this cell
    dfs_fill(image, r + 1, c, original, color, rows, cols);  // spread in all 4 directions
    if r > 0 { dfs_fill(image, r - 1, c, original, color, rows, cols); }
    dfs_fill(image, r, c + 1, original, color, rows, cols);
    if c > 0 { dfs_fill(image, r, c - 1, original, color, rows, cols); }
}`

// ── Q3: Clone Graph ────────────────────────────────────────────────────────
const q3Brute = `// Brute: two-pass — first collect all nodes, then recreate edges
// In Rust we use Rc<RefCell<Node>> for shared mutable graph nodes
use std::collections::{VecDeque, HashMap};
use std::rc::Rc;
use std::cell::RefCell;

#[derive(Debug)]
struct Node {
    val: i32,
    neighbors: Vec<Rc<RefCell<Node>>>,
}

fn clone_graph_brute(node: Option<Rc<RefCell<Node>>>) -> Option<Rc<RefCell<Node>>> {
    let node = node?;
    // pass 1: create clones for all nodes (keyed by val for simplicity)
    let mut clones: HashMap<i32, Rc<RefCell<Node>>> = HashMap::new();
    let mut queue: VecDeque<Rc<RefCell<Node>>> = VecDeque::new();
    let start_val = node.borrow().val;
    clones.insert(start_val, Rc::new(RefCell::new(Node { val: start_val, neighbors: vec![] })));
    queue.push_back(Rc::clone(&node));

    while let Some(curr) = queue.pop_front() {
        let curr_ref = curr.borrow();
        for nb in &curr_ref.neighbors {
            let nb_val = nb.borrow().val;
            if !clones.contains_key(&nb_val) {
                clones.insert(nb_val, Rc::new(RefCell::new(Node { val: nb_val, neighbors: vec![] })));
                queue.push_back(Rc::clone(nb));
            }
        }
    }
    // pass 2: wire neighbors
    let mut queue2: VecDeque<Rc<RefCell<Node>>> = VecDeque::new();
    queue2.push_back(Rc::clone(&node));
    let mut seen: HashSet<i32> = HashSet::new();
    // (wiring omitted for brevity — see optimized version for full Rust pattern)
    clones.get(&start_val).map(Rc::clone)
}`

const q3Opt = `// Clone Graph — DFS with a visited map (val → cloned node)
// Rust uses Rc<RefCell<Node>> for shared mutable references in a graph
use std::collections::HashMap;
use std::rc::Rc;
use std::cell::RefCell;

#[derive(Debug)]
struct Node {
    val: i32,
    neighbors: Vec<Rc<RefCell<Node>>>,
}

fn clone_graph(
    node: Option<Rc<RefCell<Node>>>,
    cloned: &mut HashMap<i32, Rc<RefCell<Node>>>,
) -> Option<Rc<RefCell<Node>>> {
    let node = node?;
    let val = node.borrow().val;

    if let Some(existing) = cloned.get(&val) {
        return Some(Rc::clone(existing));   // already cloned this node → return it
    }

    // create a new node with the same value
    let clone = Rc::new(RefCell::new(Node { val, neighbors: vec![] }));
    cloned.insert(val, Rc::clone(&clone));  // register BEFORE recursing (handles cycles!)

    let neighbors: Vec<Rc<RefCell<Node>>> = node.borrow().neighbors.iter()
        .filter_map(|nb| clone_graph(Some(Rc::clone(nb)), cloned))
        .collect();                         // recursively clone each neighbor
    clone.borrow_mut().neighbors = neighbors;

    Some(clone)
}`

// ── Q4: Course Schedule ────────────────────────────────────────────────────
const q4Brute = `// Brute: try all topological orderings — O(V! * E)
// (impractical; shown only to motivate the DFS approach)
fn can_finish_brute(num_courses: usize, prerequisites: &[(usize, usize)]) -> bool {
    // build adjacency list: b → a means b must come before a
    let mut graph: Vec<Vec<usize>> = vec![vec![]; num_courses];
    for &(a, b) in prerequisites {
        graph[b].push(a);
    }
    // generate all permutations and check each one — O(n! * E)
    let mut order: Vec<usize> = (0..num_courses).collect();
    loop {
        let pos: Vec<usize> = {
            let mut p = vec![0usize; num_courses];
            for (i, &v) in order.iter().enumerate() { p[v] = i; }
            p
        };
        if prerequisites.iter().all(|&(a, b)| pos[b] < pos[a]) {
            return true;
        }
        if !next_permutation(&mut order) { break; }
    }
    false
}
// NOTE: trying all orderings is completely impractical — O(V!) factorial time.`

const q4Opt = `fn can_finish(num_courses: usize, prerequisites: &[(usize, usize)]) -> bool {
    // build adjacency list: edge b → a (b must come before a)
    let mut graph: Vec<Vec<usize>> = vec![vec![]; num_courses];
    for &(a, b) in prerequisites {
        graph[b].push(a);
    }

    // 0 = unvisited, 1 = currently in stack (cycle!), 2 = fully processed (safe)
    let mut state: Vec<u8> = vec![0u8; num_courses];

    fn has_cycle(course: usize, graph: &Vec<Vec<usize>>, state: &mut Vec<u8>) -> bool {
        if state[course] == 1 {
            return true;                // we're visiting this node again → cycle!
        }
        if state[course] == 2 {
            return false;               // already fully processed → no cycle here
        }
        state[course] = 1;              // mark as "currently visiting"
        for &next_course in &graph[course] {
            if has_cycle(next_course, graph, state) {
                return true;
            }
        }
        state[course] = 2;              // fully done — no cycle found through here
        false
    }

    (0..num_courses).all(|c| !has_cycle(c, &graph, &mut state))
}`

// ── Q5: Pacific Atlantic Water Flow ────────────────────────────────────────
const q5Brute = `// Brute: for every cell, BFS to check if water can reach both oceans
use std::collections::VecDeque;

fn pacific_atlantic_brute(heights: &Vec<Vec<i32>>) -> Vec<Vec<usize>> {
    let rows = heights.len();
    let cols = heights[0].len();

    let can_reach = |start_r: usize, start_c: usize| -> (bool, bool) {
        let mut queue: VecDeque<(usize, usize)> = VecDeque::new();
        let mut visited = vec![vec![false; cols]; rows];
        queue.push_back((start_r, start_c));
        visited[start_r][start_c] = true;
        let mut pacific = start_r == 0 || start_c == 0;
        let mut atlantic = start_r == rows - 1 || start_c == cols - 1;

        while let Some((r, c)) = queue.pop_front() {
            pacific  = pacific  || r == 0       || c == 0;
            atlantic = atlantic || r == rows - 1 || c == cols - 1;
            let neighbors = [
                (r + 1, c), (r, c + 1),
                (r.wrapping_sub(1), c), (r, c.wrapping_sub(1)),
            ];
            for (nr, nc) in neighbors {
                if nr < rows && nc < cols && !visited[nr][nc]
                    && heights[nr][nc] <= heights[r][c]
                {
                    visited[nr][nc] = true;
                    queue.push_back((nr, nc));
                }
            }
        }
        (pacific, atlantic)
    };

    let mut result = vec![];
    for r in 0..rows {
        for c in 0..cols {
            let (p, a) = can_reach(r, c);
            if p && a { result.push(vec![r, c]); }
        }
    }
    result
}`

const q5Opt = `use std::collections::VecDeque;

fn pacific_atlantic(heights: &Vec<Vec<i32>>) -> Vec<Vec<usize>> {
    let rows = heights.len();
    let cols = heights[0].len();

    // reverse BFS: from the ocean, climb UP (water flows down)
    let bfs = |starts: Vec<(usize, usize)>| -> Vec<Vec<bool>> {
        let mut visited = vec![vec![false; cols]; rows];
        let mut queue: VecDeque<(usize, usize)> = VecDeque::new();
        for (r, c) in starts {
            visited[r][c] = true;
            queue.push_back((r, c));
        }
        while let Some((r, c)) = queue.pop_front() {
            let neighbors = [
                (r + 1, c), (r, c + 1),
                (r.wrapping_sub(1), c), (r, c.wrapping_sub(1)),
            ];
            for (nr, nc) in neighbors {
                if nr < rows && nc < cols && !visited[nr][nc]
                    && heights[nr][nc] >= heights[r][c]  // can flow from here to ocean
                {
                    visited[nr][nc] = true;
                    queue.push_back((nr, nc));
                }
            }
        }
        visited
    };

    // Pacific touches top row and left column
    let pacific_starts: Vec<(usize, usize)> =
        (0..rows).map(|r| (r, 0)).chain((0..cols).map(|c| (0, c))).collect();
    // Atlantic touches bottom row and right column
    let atlantic_starts: Vec<(usize, usize)> =
        (0..rows).map(|r| (r, cols - 1)).chain((0..cols).map(|c| (rows - 1, c))).collect();

    let pacific_reachable  = bfs(pacific_starts);
    let atlantic_reachable = bfs(atlantic_starts);

    // cells reachable from BOTH oceans are the answer
    let mut result = vec![];
    for r in 0..rows {
        for c in 0..cols {
            if pacific_reachable[r][c] && atlantic_reachable[r][c] {
                result.push(vec![r, c]);
            }
        }
    }
    result
}`

// ── PRACTICE answers ───────────────────────────────────────────────────────
const pq1Code = `use std::collections::{VecDeque, HashSet};

// Word Ladder — BFS for shortest transformation sequence
fn ladder_length(begin_word: &str, end_word: &str, word_list: Vec<String>) -> i32 {
    let word_set: HashSet<String> = word_list.into_iter().collect();
    if !word_set.contains(end_word) {
        return 0;
    }
    let mut queue: VecDeque<(String, i32)> = VecDeque::new();
    let mut visited: HashSet<String> = HashSet::new();
    queue.push_back((begin_word.to_string(), 1));   // (current_word, steps_taken)
    visited.insert(begin_word.to_string());

    while let Some((word, steps)) = queue.pop_front() {
        let chars: Vec<char> = word.chars().collect();
        for i in 0..chars.len() {
            for ch in 'a'..='z' {
                if ch == chars[i] { continue; }
                let mut next_chars = chars.clone();
                next_chars[i] = ch;
                let next_word: String = next_chars.into_iter().collect();
                if next_word == end_word {
                    return steps + 1;               // found the end!
                }
                if word_set.contains(&next_word) && !visited.contains(&next_word) {
                    visited.insert(next_word.clone());
                    queue.push_back((next_word, steps + 1));
                }
            }
        }
    }
    0                                               // no transformation path exists
}`

const pq2Code = `use std::collections::VecDeque;

// Rotting Oranges — multi-source BFS from all rotten oranges simultaneously
fn oranges_rotting(grid: &mut Vec<Vec<i32>>) -> i32 {
    let rows = grid.len();
    let cols = grid[0].len();
    let mut queue: VecDeque<(usize, usize, i32)> = VecDeque::new();  // (row, col, minutes)
    let mut fresh_count = 0;

    for r in 0..rows {
        for c in 0..cols {
            if grid[r][c] == 2 {
                queue.push_back((r, c, 0));
            } else if grid[r][c] == 1 {
                fresh_count += 1;
            }
        }
    }

    let mut minutes = 0;
    while let Some((r, c, t)) = queue.pop_front() {
        let neighbors = [
            (r + 1, c), (r, c + 1),
            (r.wrapping_sub(1), c), (r, c.wrapping_sub(1)),
        ];
        for (nr, nc) in neighbors {
            if nr < rows && nc < cols && grid[nr][nc] == 1 {
                grid[nr][nc] = 2;           // rot this orange
                fresh_count -= 1;
                minutes = t + 1;
                queue.push_back((nr, nc, t + 1));
            }
        }
    }

    if fresh_count == 0 { minutes } else { -1 }
}`

const pq3Code = `// Number of Connected Components — DFS counting components
fn count_components(n: usize, edges: &[(usize, usize)]) -> usize {
    let mut graph: Vec<Vec<usize>> = vec![vec![]; n];
    for &(a, b) in edges {
        graph[a].push(b);
        graph[b].push(a);
    }

    let mut visited = vec![false; n];
    let mut count = 0;

    for node in 0..n {
        if !visited[node] {
            count += 1;                // new component found
            dfs(node, &graph, &mut visited);
        }
    }
    count
}

fn dfs(node: usize, graph: &Vec<Vec<usize>>, visited: &mut Vec<bool>) {
    visited[node] = true;
    for &nb in &graph[node] {
        if !visited[nb] {
            dfs(nb, graph, visited);
        }
    }
}`

const pq4Code = `// Graph Valid Tree — valid tree = connected + no cycle (n nodes, n-1 edges)
fn valid_tree(n: usize, edges: &[(usize, usize)]) -> bool {
    if edges.len() != n - 1 {
        return false;               // too many or too few edges for a tree
    }

    let mut graph: Vec<Vec<usize>> = vec![vec![]; n];
    for &(a, b) in edges {
        graph[a].push(b);
        graph[b].push(a);
    }

    let mut visited = vec![false; n];

    fn dfs(
        node: usize,
        parent: Option<usize>,
        graph: &Vec<Vec<usize>>,
        visited: &mut Vec<bool>,
    ) -> bool {
        visited[node] = true;
        for &nb in &graph[node] {
            if Some(nb) == parent {
                continue;           // skip the edge we came from (undirected graph)
            }
            if visited[nb] {
                return false;       // cycle detected!
            }
            if !dfs(nb, Some(node), graph, visited) {
                return false;
            }
        }
        true
    }

    dfs(0, None, &graph, &mut visited) && visited.iter().all(|&v| v)
    // no cycle AND all nodes connected
}`

const pq5Code = `// Surrounded Regions — DFS from border O's, flip everything else
fn solve(board: &mut Vec<Vec<char>>) {
    let rows = board.len();
    let cols = board[0].len();

    // step 1: mark all O's connected to any border as 'S' (safe)
    for r in 0..rows {
        for c in 0..cols {
            let on_border = r == 0 || r == rows - 1 || c == 0 || c == cols - 1;
            if on_border && board[r][c] == 'O' {
                dfs_mark(board, r, c, rows, cols);
            }
        }
    }

    // step 2: flip remaining O's to X (they're surrounded), restore S's to O
    for r in 0..rows {
        for c in 0..cols {
            match board[r][c] {
                'O' => board[r][c] = 'X',   // truly surrounded → capture
                'S' => board[r][c] = 'O',   // safe → restore
                _   => {}
            }
        }
    }
}

fn dfs_mark(board: &mut Vec<Vec<char>>, r: usize, c: usize, rows: usize, cols: usize) {
    if r >= rows || c >= cols || board[r][c] != 'O' {
        return;
    }
    board[r][c] = 'S';                      // mark as "safe" (connected to border)
    dfs_mark(board, r + 1, c, rows, cols);
    if r > 0 { dfs_mark(board, r - 1, c, rows, cols); }
    dfs_mark(board, r, c + 1, rows, cols);
    if c > 0 { dfs_mark(board, r, c - 1, rows, cols); }
}`

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
            <CodeBlock code={q1Brute} lang="rust" />
          </>}
          optimized={<>
            <BigOBadge time="O(m·n)" space="O(m·n)" />
            <CodeBlock code={q1Opt} lang="rust" />
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
            <CodeBlock code={q2Brute} lang="rust" />
          </>}
          optimized={<>
            <BigOBadge time="O(m·n)" space="O(m·n)" />
            <CodeBlock code={q2Opt} lang="rust" />
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
            <CodeBlock code={q3Brute} lang="rust" />
          </>}
          optimized={<>
            <BigOBadge time="O(V+E)" space="O(V)" />
            <CodeBlock code={q3Opt} lang="rust" />
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
            <CodeBlock code={q4Brute} lang="rust" />
            <Callout type="warn">Trying all orderings is completely impractical — O(V!) factorial time.</Callout>
          </>}
          optimized={<>
            <BigOBadge time="O(V+E)" space="O(V)" />
            <CodeBlock code={q4Opt} lang="rust" />
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
            <CodeBlock code={q5Brute} lang="rust" />
          </>}
          optimized={<>
            <BigOBadge time="O(m·n)" space="O(m·n)" />
            <CodeBlock code={q5Opt} lang="rust" />
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
