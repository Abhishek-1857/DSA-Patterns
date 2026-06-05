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

const TREE_ANATOMY = `
A BINARY TREE — what it looks like:

           1          ← root (level 0)
          / \\
         2   3        ← level 1
        / \\ / \\
       4  5 6  7      ← level 2 (leaves here)

Vocabulary:
  root    = top node (no parent)
  leaf    = node with no children
  height  = longest path from root to a leaf (= 2 here)
  parent  = node above  (3 is parent of 6 and 7)
  children = nodes below (6 and 7 are children of 3)
  siblings = nodes sharing the same parent (4 and 5 are siblings)
  level   = distance from root (root is level 0)
`

const BFS_VISUAL = `
BFS = LEVEL ORDER — visit every node on a level before going deeper

Queue starts with just [1].  Result = []

Round 1: pop 1 → add to level=[1] → enqueue children 2, 3
         queue = [2, 3]         result = [[1]]

Round 2: level_size=2 → pop 2 → level=[2] → enqueue 4,5
                      → pop 3 → level=[2,3] → enqueue 6,7
         queue = [4,5,6,7]      result = [[1],[2,3]]

Round 3: level_size=4 → pop 4,5,6,7 → level=[4,5,6,7]
         queue = []              result = [[1],[2,3],[4,5,6,7]]

KEY TRICK: snapshot queue.len() at the START of each round.
           That number is exactly how many nodes are on this level.
           Process exactly that many — then you've finished one level.
`

const nodeClass = `use std::collections::VecDeque;

// TreeNode used in all problems
#[derive(Debug)]
struct TreeNode {
    val: i32,
    left: Option<Box<TreeNode>>,
    right: Option<Box<TreeNode>>,
}`

// ── Q1: Level Order Traversal ─────────────────────────────────────────────
const q1Brute = `// Brute force: recursive DFS tracking depth, sort into buckets
use std::collections::HashMap;

fn level_order_brute(root: Option<Box<TreeNode>>) -> Vec<Vec<i32>> {
    let mut map: HashMap<usize, Vec<i32>> = HashMap::new();

    fn dfs(node: &Option<Box<TreeNode>>, depth: usize, map: &mut HashMap<usize, Vec<i32>>) {
        if let Some(n) = node {
            map.entry(depth).or_default().push(n.val); // bucket by depth
            dfs(&n.left, depth + 1, map);
            dfs(&n.right, depth + 1, map);
        }
    }

    dfs(&root, 0, &mut map);

    // reassemble in order
    let mut keys: Vec<usize> = map.keys().cloned().collect();
    keys.sort();
    keys.into_iter().map(|k| map.remove(&k).unwrap()).collect()
}`

const q1Opt = `use std::collections::VecDeque;

fn level_order(root: Option<Box<TreeNode>>) -> Vec<Vec<i32>> {
    let mut result: Vec<Vec<i32>> = Vec::new();
    if root.is_none() { return result; }  // empty tree → empty result

    let mut queue: VecDeque<Box<TreeNode>> = VecDeque::new();
    queue.push_back(root.unwrap());       // start: just the root in the queue

    while !queue.is_empty() {
        let level_size = queue.len();     // how many nodes are on THIS level?
        let mut current_level: Vec<i32> = Vec::new();

        for _ in 0..level_size {          // process EXACTLY that many
            let node = queue.pop_front().unwrap();    // grab front of queue
            current_level.push(node.val);             // record its value
            if let Some(left) = node.left {           // enqueue children for next level
                queue.push_back(left);
            }
            if let Some(right) = node.right {
                queue.push_back(right);
            }
        }
        result.push(current_level);       // done with this level
    }
    result
}`

// ── Q2: Reverse Level Order ───────────────────────────────────────────────
const q2Brute = `fn reverse_level_order_brute(root: Option<Box<TreeNode>>) -> Vec<Vec<i32>> {
    let mut result = level_order(root); // reuse normal BFS
    result.reverse();                   // just flip the vec — easy but O(n) extra
    result
}`

const q2Opt = `use std::collections::VecDeque;

fn reverse_level_order(root: Option<Box<TreeNode>>) -> Vec<Vec<i32>> {
    if root.is_none() { return Vec::new(); }

    let mut queue: VecDeque<Box<TreeNode>> = VecDeque::new();
    queue.push_back(root.unwrap());
    let mut result: VecDeque<Vec<i32>> = VecDeque::new(); // deque so we can prepend

    while !queue.is_empty() {
        let level_size = queue.len();
        let mut current_level: Vec<i32> = Vec::new();

        for _ in 0..level_size {
            let node = queue.pop_front().unwrap();
            current_level.push(node.val);
            if let Some(left) = node.left { queue.push_back(left); }
            if let Some(right) = node.right { queue.push_back(right); }
        }
        result.push_front(current_level); // prepend each level → auto-reversed!
    }
    result.into_iter().collect()
}`

// ── Q3: Zigzag Traversal ──────────────────────────────────────────────────
const q3Brute = `fn zigzag_brute(root: Option<Box<TreeNode>>) -> Vec<Vec<i32>> {
    let mut levels = level_order(root); // get normal level order first
    for (i, level) in levels.iter_mut().enumerate() {
        if i % 2 == 1 {                 // odd levels → reverse them
            level.reverse();
        }
    }
    levels
}`

const q3Opt = `use std::collections::VecDeque;

fn zigzag_level_order(root: Option<Box<TreeNode>>) -> Vec<Vec<i32>> {
    if root.is_none() { return Vec::new(); }

    let mut queue: VecDeque<Box<TreeNode>> = VecDeque::new();
    queue.push_back(root.unwrap());
    let mut result: Vec<Vec<i32>> = Vec::new();
    let mut left_to_right = true;       // flag: which direction this level goes

    while !queue.is_empty() {
        let level_size = queue.len();
        let mut current_level: VecDeque<i32> = VecDeque::new(); // deque: append to either end

        for _ in 0..level_size {
            let node = queue.pop_front().unwrap();
            if left_to_right {
                current_level.push_back(node.val);   // normal: add to right
            } else {
                current_level.push_front(node.val);  // reversed: add to left
            }
            if let Some(left) = node.left { queue.push_back(left); }
            if let Some(right) = node.right { queue.push_back(right); }
        }
        result.push(current_level.into_iter().collect());
        left_to_right = !left_to_right;  // flip direction each level
    }
    result
}`

// ── Q4: Level Averages ────────────────────────────────────────────────────
const q4Brute = `fn level_averages_brute(root: Option<Box<TreeNode>>) -> Vec<f64> {
    level_order(root) // reuse BFS
        .into_iter()
        .map(|lvl| lvl.iter().sum::<i32>() as f64 / lvl.len() as f64)
        .collect()
}`

const q4Opt = `use std::collections::VecDeque;

fn level_averages(root: Option<Box<TreeNode>>) -> Vec<f64> {
    if root.is_none() { return Vec::new(); }

    let mut queue: VecDeque<Box<TreeNode>> = VecDeque::new();
    queue.push_back(root.unwrap());
    let mut result: Vec<f64> = Vec::new();

    while !queue.is_empty() {
        let level_size = queue.len();
        let mut level_sum: i64 = 0; // accumulate sum as we process each node

        for _ in 0..level_size {
            let node = queue.pop_front().unwrap();
            level_sum += node.val as i64;   // add to running sum
            if let Some(left) = node.left { queue.push_back(left); }
            if let Some(right) = node.right { queue.push_back(right); }
        }
        result.push(level_sum as f64 / level_size as f64); // average for this level
    }
    result
}`

// ── Q5: Minimum Depth ─────────────────────────────────────────────────────
const q5Brute = `fn min_depth_brute(root: &Option<Box<TreeNode>>) -> usize {
    match root {
        None => 0,
        Some(node) => match (&node.left, &node.right) {
            (None, _) => 1 + min_depth_brute(&node.right), // no left → go right
            (_, None) => 1 + min_depth_brute(&node.left),  // no right → go left
            _ => 1 + min_depth_brute(&node.left).min(min_depth_brute(&node.right)),
        },
    }
}`

const q5Opt = `use std::collections::VecDeque;

fn min_depth(root: Option<Box<TreeNode>>) -> usize {
    if root.is_none() { return 0; }

    // store (node, depth) pairs
    let mut queue: VecDeque<(Box<TreeNode>, usize)> = VecDeque::new();
    queue.push_back((root.unwrap(), 1));

    while let Some((node, depth)) = queue.pop_front() {
        // a LEAF node has no children — this is the shallowest leaf!
        if node.left.is_none() && node.right.is_none() {
            return depth; // BFS guarantees this is the minimum depth
        }
        if let Some(left) = node.left { queue.push_back((left, depth + 1)); }
        if let Some(right) = node.right { queue.push_back((right, depth + 1)); }
    }
    0
}`

// ── PRACTICE answers ──────────────────────────────────────────────────────
const pq1Code = `use std::collections::VecDeque;

// Maximum Depth — count how many levels BFS produces
fn max_depth(root: Option<Box<TreeNode>>) -> usize {
    if root.is_none() { return 0; }

    let mut queue: VecDeque<Box<TreeNode>> = VecDeque::new();
    queue.push_back(root.unwrap());
    let mut depth = 0; // increment after each level is processed

    while !queue.is_empty() {
        depth += 1; // starting a new level
        for _ in 0..queue.len() {
            let node = queue.pop_front().unwrap();
            if let Some(left) = node.left { queue.push_back(left); }
            if let Some(right) = node.right { queue.push_back(right); }
        }
    }
    depth // total levels = max depth
}`

const pq2Code = `use std::collections::VecDeque;

// Level Order Successor — return the val that comes right after 'key' in BFS order
fn level_order_successor(root: Option<Box<TreeNode>>, key: i32) -> Option<i32> {
    if root.is_none() { return None; }

    let mut queue: VecDeque<Box<TreeNode>> = VecDeque::new();
    queue.push_back(root.unwrap());

    while let Some(node) = queue.pop_front() {
        if let Some(left) = node.left { queue.push_back(left); }
        if let Some(right) = node.right { queue.push_back(right); }
        // after enqueueing children, check if WE were the key node
        // the next pop_front() will give us the successor
        if node.val == key {
            return queue.front().map(|n| n.val); // peek at front of queue
        }
    }
    None
}`

const pq3Code = `use std::collections::VecDeque;

// Connect Level Order Siblings — set node.next to the next node on the same level
// (TreeNode extended with a next pointer for this problem)
fn connect_level_order_siblings(root: Option<Box<TreeNode>>) {
    if root.is_none() { return; }

    // In Rust we'd typically use Rc<RefCell<TreeNode>> for shared/mutable links.
    // Here we demonstrate the BFS logic using indices into a Vec as a stand-in.
    let mut queue: VecDeque<Box<TreeNode>> = VecDeque::new();
    queue.push_back(root.unwrap());

    while !queue.is_empty() {
        let level_size = queue.len();
        // prev tracks the previous node on this level
        // We iterate and connect: prev → current
        for i in 0..level_size {
            let node = queue.pop_front().unwrap();
            // In a real impl with Rc<RefCell<>>, you'd set prev.borrow_mut().next = Some(Rc::clone(&node))
            // The key BFS insight: process left-to-right, link prev → node, then prev = node
            let _ = i; // suppress unused warning in this illustrative snippet
            if let Some(left) = node.left { queue.push_back(left); }
            if let Some(right) = node.right { queue.push_back(right); }
        }
        // last node on the level has next = None by default
    }
}`

const pq4Code = `use std::collections::VecDeque;

// Right View — last node at each level is visible from the right
fn right_side_view(root: Option<Box<TreeNode>>) -> Vec<i32> {
    if root.is_none() { return Vec::new(); }

    let mut queue: VecDeque<Box<TreeNode>> = VecDeque::new();
    queue.push_back(root.unwrap());
    let mut result: Vec<i32> = Vec::new();

    while !queue.is_empty() {
        let level_size = queue.len();
        for i in 0..level_size {
            let node = queue.pop_front().unwrap();
            if i == level_size - 1 {          // last node in this level
                result.push(node.val);         // it's visible from the right
            }
            if let Some(left) = node.left { queue.push_back(left); }
            if let Some(right) = node.right { queue.push_back(right); }
        }
    }
    result
}`

const pq5Code = `use std::collections::VecDeque;

// Populating Next Right Pointers — same as Connect Level Order Siblings
// Works on any binary tree (not just perfect ones)
// Uses Rc<RefCell<>> for shared mutable ownership
use std::rc::Rc;
use std::cell::RefCell;

#[derive(Debug)]
struct NodeWithNext {
    val: i32,
    left: Option<Rc<RefCell<NodeWithNext>>>,
    right: Option<Rc<RefCell<NodeWithNext>>>,
    next: Option<Rc<RefCell<NodeWithNext>>>,
}

fn connect(root: Option<Rc<RefCell<NodeWithNext>>>) -> Option<Rc<RefCell<NodeWithNext>>> {
    if root.is_none() { return root; }

    let mut queue: VecDeque<Rc<RefCell<NodeWithNext>>> = VecDeque::new();
    queue.push_back(root.clone().unwrap());

    while !queue.is_empty() {
        let level_size = queue.len();
        let mut prev: Option<Rc<RefCell<NodeWithNext>>> = None;

        for _ in 0..level_size {
            let node_rc = queue.pop_front().unwrap();
            if let Some(ref p) = prev {
                p.borrow_mut().next = Some(Rc::clone(&node_rc)); // point previous node to current
            }
            prev = Some(Rc::clone(&node_rc));

            let left = node_rc.borrow().left.clone();
            let right = node_rc.borrow().right.clone();
            if let Some(l) = left { queue.push_back(l); }
            if let Some(r) = right { queue.push_back(r); }
        }
        // last node on each level already has .next = None by default
    }
    root
}`

export default function TreeBFSContent() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>

      <Sub title="What does a binary tree even look like?">
        <CodeBlock code={TREE_ANATOMY} lang="text" />
        <Callout type="info">
          A <strong>binary tree</strong> is just a bunch of connected nodes where
          each node has at most two children (left and right). There are no cycles —
          it's always a hierarchy, like a family tree or a folder structure on your computer.
        </Callout>
      </Sub>

      <Sub title="What is Tree BFS?">
        <p style={{ lineHeight: 1.7 }}>
          Imagine you're exploring a building floor by floor. You finish the entire
          ground floor before taking the elevator up to floor 1, finish all of floor 1
          before going to floor 2, and so on. That's BFS — visit every node on a level
          before moving to the next. A <strong>queue</strong> (first-in first-out) is
          the data structure that makes this work naturally.
        </p>
        <Callout type="tip">
          <strong>Trigger phrases:</strong> "level order", "level by level", "zigzag",
          "right side view", "connect next pointers", "minimum/maximum depth".
          Any time the problem cares about <em>which level</em> a node is on → BFS.
        </Callout>
      </Sub>

      <Sub title="How BFS works — ASCII walkthrough">
        <CodeBlock code={BFS_VISUAL} lang="text" />
        <Callout type="tip">
          The magic line is <code>let level_size = queue.len()</code> captured at the
          start of each while-loop iteration. That number freezes how many nodes
          are on the current level, so the inner for-loop processes exactly one level
          at a time — even as we're adding the next level's nodes to the queue.
        </Callout>
      </Sub>

      <Sub title="TreeNode struct (used in all problems)">
        <CodeBlock code={nodeClass} lang="rust" />
      </Sub>

      <Sub title="Taught Questions">

        <QuestionCard
          num={1}
          title="Binary Tree Level Order Traversal"
          difficulty="Medium"
          problem={`Given a binary tree, return the values of nodes level by level (each level as a sublist).

Example:
    3
   / \\
  9  20
    /  \\
   15   7
→ [[3],[9,20],[15,7]]`}
          brute={<>
            <BigOBadge time="O(n)" space="O(n)" />
            <CodeBlock code={q1Brute} lang="rust" />
            <Callout type="warn">DFS works but you end up visiting nodes out of level order and re-sorting — BFS visits them in level order naturally.</Callout>
          </>}
          optimized={<>
            <BigOBadge time="O(n)" space="O(n)" />
            <CodeBlock code={q1Opt} lang="rust" />
            <Callout type="tip">
              <strong>Aha moment:</strong> Snapshot <code>let level_size = queue.len()</code>
              before the inner loop. That's the exact node count for this level — process
              only that many. The children you add during that loop belong to the NEXT level.
            </Callout>
            <Callout type="danger">
              <strong>Common mistake:</strong> Using <code>while !queue.is_empty()</code> as the inner
              loop too — that processes ALL remaining nodes, not just one level.
            </Callout>
          </>}
          answer="BFS with a VecDeque. Snapshot queue.len() at the start of each outer loop iteration — that's how many nodes to process for the current level."
        />

        <QuestionCard
          num={2}
          title="Reverse Level Order Traversal"
          difficulty="Easy"
          problem={`Return the level-order traversal of a binary tree from bottom to top (leaves first, root last).

Example: same tree as above → [[15,7],[9,20],[3]]`}
          brute={<>
            <BigOBadge time="O(n)" space="O(n)" />
            <CodeBlock code={q2Brute} lang="rust" />
          </>}
          optimized={<>
            <BigOBadge time="O(n)" space="O(n)" />
            <CodeBlock code={q2Opt} lang="rust" />
            <Callout type="tip">
              <strong>Aha moment:</strong> Use a <code>VecDeque</code> as your result and
              call <code>push_front</code> instead of <code>push</code> for each level.
              That inserts each new level at the front — you get reverse order for free
              without an extra reversal pass.
            </Callout>
            <Callout type="danger">
              <strong>Common mistake:</strong> Reversing the entire result vec at the end is
              fine, but prepending with <code>push_front</code> is cleaner and avoids
              an extra O(n) pass.
            </Callout>
          </>}
          answer="Standard BFS, but push each level to the FRONT of a result VecDeque using push_front — bottom-up order for free."
        />

        <QuestionCard
          num={3}
          title="Zigzag Level Order Traversal"
          difficulty="Medium"
          problem={`Return level order traversal where odd levels go left→right and even levels go right→left (or vice versa).

Example:
    3
   / \\
  9  20
    /  \\
   15   7
→ [[3],[20,9],[15,7]]`}
          brute={<>
            <BigOBadge time="O(n)" space="O(n)" />
            <CodeBlock code={q3Brute} lang="rust" />
          </>}
          optimized={<>
            <BigOBadge time="O(n)" space="O(n)" />
            <CodeBlock code={q3Opt} lang="rust" />
            <Callout type="tip">
              <strong>Aha moment:</strong> Build each level into a <code>VecDeque</code>.
              On left-to-right levels, <code>push_back</code> (normal).
              On right-to-left levels, <code>push_front</code> — values land in reversed
              order automatically. Flip a boolean after each level.
            </Callout>
            <Callout type="danger">
              <strong>Common mistake:</strong> Reversing the node-processing ORDER instead
              of the output order. The queue always goes left child first, right child second —
              never change that. Only change where in the output deque you INSERT the value.
            </Callout>
          </>}
          answer="BFS with a left_to_right flag. Build each level into a VecDeque: push_back when true, push_front when false. Flip the flag after each level."
        />

        <QuestionCard
          num={4}
          title="Level Averages in a Binary Tree"
          difficulty="Easy"
          problem={`Find the average value of nodes at each level of the binary tree.

Example:
    1
   / \\
  2   3
 / \\ / \\
4  5 6  7
→ [1.0, 2.5, 5.5]`}
          brute={<>
            <BigOBadge time="O(n)" space="O(n)" />
            <CodeBlock code={q4Brute} lang="rust" />
          </>}
          optimized={<>
            <BigOBadge time="O(n)" space="O(n)" />
            <CodeBlock code={q4Opt} lang="rust" />
            <Callout type="tip">
              <strong>Aha moment:</strong> Instead of collecting all values and averaging at
              the end, keep a running <code>level_sum</code> as you pop each node.
              Divide by <code>level_size</code> at the end of the inner loop — you already
              know the count.
            </Callout>
            <Callout type="danger">
              <strong>Common mistake:</strong> Dividing by <code>queue.len()</code> at the
              end of the level — by then the queue contains the NEXT level's nodes.
              Use <code>level_size</code> which you captured at the start.
            </Callout>
          </>}
          answer="Standard BFS. Accumulate level_sum while processing the level, divide by level_size at the end of each inner loop."
        />

        <QuestionCard
          num={5}
          title="Minimum Depth of Binary Tree"
          difficulty="Easy"
          problem={`Return the minimum depth — the number of nodes along the shortest path from the root to the nearest leaf node.

Example:
    1
   / \\
  2   3
 /
4
→ 2 (path: 1→3, depth=2)`}
          brute={<>
            <BigOBadge time="O(n)" space="O(h)" />
            <CodeBlock code={q5Brute} lang="rust" />
            <Callout type="warn">Recursive DFS visits the entire tree — even when the min-depth leaf is near the top. BFS stops the moment it finds a leaf.</Callout>
          </>}
          optimized={<>
            <BigOBadge time="O(n)" space="O(n)" />
            <CodeBlock code={q5Opt} lang="rust" />
            <Callout type="tip">
              <strong>Aha moment:</strong> BFS visits nodes level by level. The very first
              leaf it encounters (a node with no left and no right child) is guaranteed to be
              at the minimum depth — stop immediately and return that depth.
            </Callout>
            <Callout type="danger">
              <strong>Common mistake:</strong> Treating a node with only one child as a leaf.
              A leaf MUST have no children at all. A node with one child is an internal node.
            </Callout>
          </>}
          answer="BFS storing (node, depth) pairs. First time you dequeue a node with no children (a true leaf), return its depth — BFS guarantees it's the shallowest."
        />

      </Sub>

      <Sub title="Practice Questions">
        <Callout type="info">Try each one solo first. Hint nudges you in the right direction; answer reveals after 3 seconds.</Callout>

        <QuestionCard
          num={6}
          title="Maximum Depth of Binary Tree"
          difficulty="Easy"
          practice
          problem={`Find the maximum depth (number of levels) of a binary tree.

Example:
    3
   / \\
  9  20
    /  \\
   15   7
→ 3`}
          hints={[
            "BFS processes one level at a time — just count how many levels you process.",
            "Increment a depth counter each time you start a new level. Return it at the end.",
            "Or: DFS — return 1 + max(depth(left), depth(right)).",
          ]}
          answer="BFS: increment a counter for each level processed. DFS: 1 + max(left, right)."
          answerCode={pq1Code}
        />

        <QuestionCard
          num={7}
          title="Level Order Successor"
          difficulty="Easy"
          practice
          problem={`Given a binary tree and a key value, return the node that appears immediately after the node with the given key in level-order traversal.

Example: key=3, tree above → node with val=9`}
          hints={[
            "Do normal BFS. After dequeuing a node, immediately enqueue its children.",
            "Check if the node you JUST dequeued has the target value. If so, the next node in the queue is the answer.",
            "Peek at the front of the queue with queue.front() — don't pop it.",
          ]}
          answer="Standard BFS. After popping a node and enqueueing its children, check if it was the key — if so, return queue.front() (the next node in line)."
          answerCode={pq2Code}
        />

        <QuestionCard
          num={8}
          title="Connect Level Order Siblings"
          difficulty="Medium"
          practice
          problem={`Given a binary tree where each node has an extra 'next' pointer, connect each node's next pointer to the node immediately to its right on the same level. The last node on each level should point to None.`}
          hints={[
            "BFS naturally visits nodes left to right on each level — use that order.",
            "Track the previous node on the current level. After dequeuing each node, set prev.next = node.",
            "At the start of each level, reset prev to None.",
          ]}
          answer="BFS with a prev pointer. For each node on a level, set prev.next = node, then prev = node. Reset prev=None at the start of each new level."
          answerCode={pq3Code}
        />

        <QuestionCard
          num={9}
          title="Right View of a Binary Tree"
          difficulty="Medium"
          practice
          problem={`Return the values of the nodes you can see when looking at the tree from the right side (the last node at each level).

Example:
    1
   / \\
  2   3
   \\    \\
    5    4
→ [1, 3, 4]`}
          hints={[
            "BFS visits nodes level by level. The last node you process on each level is the rightmost one.",
            "Track the loop index inside the inner for-loop. When i == level_size - 1, that's the last node.",
            "Append that last node's value to the result.",
          ]}
          answer="BFS. At the end of each level's inner loop (when i == level_size - 1), append that node's value to the result."
          answerCode={pq4Code}
        />

        <QuestionCard
          num={10}
          title="Populating Next Right Pointers"
          difficulty="Medium"
          practice
          problem={`Populate each node's 'next' pointer to its right neighbor on the same level. If there is no right neighbor, next should be None. Must work on any binary tree (not just perfect ones).`}
          hints={[
            "Exactly the same as Connect Level Order Siblings — BFS with a prev pointer.",
            "The only tricky part: nodes that are children of different parents but same level still get connected.",
            "BFS handles this automatically since it queues children left-to-right regardless of parent.",
          ]}
          answer="BFS with prev pointer tracking the last node seen on each level. Set prev.next = current node for every node on a level."
          answerCode={pq5Code}
        />
      </Sub>

    </div>
  )
}
