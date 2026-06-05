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
A BINARY TREE — visual reference:

           1          ← root
          / \\
         2   3
        / \\ / \\
       4  5 6  7     ← leaves

Root-to-leaf paths:
  1→2→4   (sum = 7)
  1→2→5   (sum = 8)
  1→3→6   (sum = 10)
  1→3→7   (sum = 11)

DFS explores one path ALL the way down before backtracking:
  visit 1 → go left → visit 2 → go left → visit 4 (leaf!) → BACKTRACK
          → go right → visit 5 (leaf!) → BACKTRACK → BACKTRACK
  → go right → visit 3 → go left → visit 6 (leaf!) → BACKTRACK
             → go right → visit 7 (leaf!)
`

const DFS_VISUAL = `
DFS PATH SUM — does any root-to-leaf path sum to 8?

           1  (remaining = 8-1 = 7)
          / \\
         2   3  (remaining = 7-2=5 or 7-3=4)
        / \\ / \\
       4  5 6  7

At node 4 (leaf): remaining = 5-4 = 1  ≠ 0  → NO
At node 5 (leaf): remaining = 5-5 = 0  = 0  → YES! found path 1→2→5
At node 6 (leaf): remaining = 4-6 = -2 ≠ 0  → NO
At node 7 (leaf): remaining = 4-7 = -3 ≠ 0  → NO

KEY: pass (target - node.val) down to children recursively
     when you hit a LEAF and remaining == 0, you've found a valid path
`

const nodeClass = `// TreeNode used in all problems
#[derive(Debug)]
struct TreeNode {
    val: i32,
    left: Option<Box<TreeNode>>,
    right: Option<Box<TreeNode>>,
}`

// ── Q1: Path Sum ──────────────────────────────────────────────────────────
const q1Brute = `// Brute: find ALL paths, check if any matches target
fn all_paths(node: &Option<Box<TreeNode>>) -> Vec<Vec<i32>> {
    match node {
        None => vec![],
        Some(n) => {
            if n.left.is_none() && n.right.is_none() {
                return vec![vec![n.val]];  // leaf → one path containing just this node
            }
            let mut paths = Vec::new();
            for p in all_paths(&n.left).into_iter().chain(all_paths(&n.right)) {
                let mut path = vec![n.val];
                path.extend(p);
                paths.push(path);
            }
            paths
        }
    }
}

fn has_path_sum_brute(root: &Option<Box<TreeNode>>, target: i32) -> bool {
    all_paths(root).iter().any(|p| p.iter().sum::<i32>() == target)
}`

const q1Opt = `fn has_path_sum(root: &Option<Box<TreeNode>>, target: i32) -> bool {
    match root {
        None => false,                    // empty tree → no path
        Some(node) => {
            // subtract current node from target as we go deeper
            let remaining = target - node.val;
            // reached a leaf — did we hit exactly 0 remaining?
            if node.left.is_none() && node.right.is_none() {
                return remaining == 0;
            }
            // try left subtree OR right subtree
            has_path_sum(&node.left, remaining) || has_path_sum(&node.right, remaining)
        }
    }
}`

// ── Q2: All Paths for a Sum ───────────────────────────────────────────────
const q2Brute = `// Brute: find all paths first, filter by sum
fn all_paths(node: &Option<Box<TreeNode>>) -> Vec<Vec<i32>> {
    match node {
        None => vec![],
        Some(n) => {
            if n.left.is_none() && n.right.is_none() {
                return vec![vec![n.val]];
            }
            let mut result = Vec::new();
            for p in all_paths(&n.left).into_iter().chain(all_paths(&n.right)) {
                let mut path = vec![n.val];   // prepend current node
                path.extend(p);
                result.push(path);
            }
            result
        }
    }
}

fn find_all_paths_brute(root: &Option<Box<TreeNode>>, target: i32) -> Vec<Vec<i32>> {
    all_paths(root)
        .into_iter()
        .filter(|p| p.iter().sum::<i32>() == target)
        .collect()
}`

const q2Opt = `fn find_all_paths(root: &Option<Box<TreeNode>>, target: i32) -> Vec<Vec<i32>> {
    let mut result: Vec<Vec<i32>> = Vec::new();
    let mut path: Vec<i32> = Vec::new();
    dfs(root, target, &mut path, &mut result);
    result
}

fn dfs(
    node: &Option<Box<TreeNode>>,
    remaining: i32,
    path: &mut Vec<i32>,
    result: &mut Vec<Vec<i32>>,
) {
    if let Some(n) = node {
        path.push(n.val);              // add this node to our running path
        let remaining = remaining - n.val;
        // if leaf AND remaining hit zero → valid path!
        if n.left.is_none() && n.right.is_none() && remaining == 0 {
            result.push(path.clone()); // clone — Vec is owned, must copy explicitly
        } else {
            dfs(&n.left, remaining, path, result);   // explore left
            dfs(&n.right, remaining, path, result);  // explore right
        }
        path.pop();                    // BACKTRACK: remove this node before returning to parent
    }
}`

// ── Q3: Sum of Path Numbers ───────────────────────────────────────────────
const q3Brute = `// Brute: collect all root-to-leaf path strings, convert to numbers, sum
fn all_path_strings(node: &Option<Box<TreeNode>>) -> Vec<String> {
    match node {
        None => vec![],
        Some(n) => {
            if n.left.is_none() && n.right.is_none() {
                return vec![n.val.to_string()];
            }
            let mut result = Vec::new();
            for p in all_path_strings(&n.left).into_iter().chain(all_path_strings(&n.right)) {
                result.push(format!("{}{}", n.val, p));
            }
            result
        }
    }
}

fn sum_numbers_brute(root: &Option<Box<TreeNode>>) -> i32 {
    all_path_strings(root)
        .iter()
        .map(|s| s.parse::<i32>().unwrap())
        .sum()
}`

const q3Opt = `fn sum_numbers(root: &Option<Box<TreeNode>>) -> i32 {
    dfs(root, 0)
}

fn dfs(node: &Option<Box<TreeNode>>, current_number: i32) -> i32 {
    match node {
        None => 0,
        Some(n) => {
            // shift current_number left one digit and add this node's value
            // e.g. path 1→2→3: at node 3, current_number = 1*100 + 2*10 + 3 = 123
            let current_number = current_number * 10 + n.val;
            // leaf → this is a complete number, return it
            if n.left.is_none() && n.right.is_none() {
                return current_number;
            }
            // recurse: sum up numbers from left and right subtrees
            dfs(&n.left, current_number) + dfs(&n.right, current_number)
        }
    }
}`

// ── Q4: Path with Maximum Sum ─────────────────────────────────────────────
const q4Brute = `// Brute: find all root-to-leaf paths, return max sum
fn all_paths(node: &Option<Box<TreeNode>>) -> Vec<Vec<i32>> {
    match node {
        None => vec![],
        Some(n) => {
            if n.left.is_none() && n.right.is_none() {
                return vec![vec![n.val]];
            }
            let mut result = Vec::new();
            for p in all_paths(&n.left).into_iter().chain(all_paths(&n.right)) {
                let mut path = vec![n.val];
                path.extend(p);
                result.push(path);
            }
            result
        }
    }
}

fn max_path_sum_root_to_leaf_brute(root: &Option<Box<TreeNode>>) -> i32 {
    let paths = all_paths(root);
    if paths.is_empty() {
        return 0;
    }
    paths.iter().map(|p| p.iter().sum::<i32>()).max().unwrap()
}`

const q4Opt = `fn max_path_sum_root_to_leaf(root: &Option<Box<TreeNode>>) -> i32 {
    dfs(root)
}

fn dfs(node: &Option<Box<TreeNode>>) -> i32 {
    match node {
        None => i32::MIN,             // no node → not a valid path
        Some(n) => {
            if n.left.is_none() && n.right.is_none() {
                return n.val;         // leaf → path is just this node
            }
            // take the better of left or right subtree, add current node
            let left_max = dfs(&n.left);
            let right_max = dfs(&n.right);
            // if one child is missing, don't pick i32::MIN
            if n.left.is_none() {
                return n.val + right_max;
            }
            if n.right.is_none() {
                return n.val + left_max;
            }
            n.val + left_max.max(right_max)
        }
    }
}`

// ── Q5: Diameter of Binary Tree ───────────────────────────────────────────
const q5Brute = `// Brute: at every node, diameter through that node = left_height + right_height
// O(n^2) because height() is called n times
fn height(node: &Option<Box<TreeNode>>) -> i32 {
    match node {
        None => 0,
        Some(n) => 1 + height(&n.left).max(height(&n.right)),
    }
}

fn diameter(node: &Option<Box<TreeNode>>) -> i32 {
    match node {
        None => 0,
        Some(n) => {
            // path through this node: go all the way left + all the way right
            let through_root = height(&n.left) + height(&n.right);
            // or maybe the longest path is entirely in left or right subtree
            through_root.max(diameter(&n.left)).max(diameter(&n.right))
        }
    }
}

fn diameter_of_binary_tree_brute(root: &Option<Box<TreeNode>>) -> i32 {
    diameter(root)
}`

const q5Opt = `fn diameter_of_binary_tree(root: &Option<Box<TreeNode>>) -> i32 {
    let mut max_diameter = 0;
    height(root, &mut max_diameter);
    max_diameter
}

fn height(node: &Option<Box<TreeNode>>, max_diameter: &mut i32) -> i32 {
    match node {
        None => 0,
        Some(n) => {
            let left_h = height(&n.left, max_diameter);
            let right_h = height(&n.right, max_diameter);
            // the diameter THROUGH this node = edges going left + edges going right
            *max_diameter = (*max_diameter).max(left_h + right_h);
            // return height of this subtree to the parent
            1 + left_h.max(right_h)
        }
    }
}`

// ── PRACTICE answers ──────────────────────────────────────────────────────
const pq1Code = `// Count Paths for a Sum — paths don't have to start at root or end at leaf
fn path_sum_count(root: &Option<Box<TreeNode>>, target: i32) -> i32 {
    traverse(root, target)
}

// count paths starting exactly at 'node' that sum to remaining
fn dfs(node: &Option<Box<TreeNode>>, remaining: i32) -> i32 {
    match node {
        None => 0,
        Some(n) => {
            let mut count = 0;
            if n.val == remaining {   // this node alone completes a path
                count += 1;
            }
            count += dfs(&n.left, remaining - n.val);
            count += dfs(&n.right, remaining - n.val);
            count
        }
    }
}

// try starting a path at every single node
fn traverse(node: &Option<Box<TreeNode>>, target: i32) -> i32 {
    match node {
        None => 0,
        Some(n) => {
            // paths starting at this node + paths starting in left or right subtree
            dfs(node, target) + traverse(&n.left, target) + traverse(&n.right, target)
        }
    }
}`

const pq2Code = `// Tree Path Sum II — all paths (any start, any end) summing to target
fn path_sum_all(root: &Option<Box<TreeNode>>, target: i32) -> Vec<Vec<i32>> {
    let mut result: Vec<Vec<i32>> = Vec::new();
    let mut current_path: Vec<i32> = Vec::new();
    // current_path holds the nodes on the path from root to current node
    dfs(root, target, &mut current_path, &mut result);
    result
}

fn dfs(
    node: &Option<Box<TreeNode>>,
    target: i32,
    current_path: &mut Vec<i32>,
    result: &mut Vec<Vec<i32>>,
) {
    if let Some(n) = node {
        current_path.push(n.val);
        // check all sub-paths ending at this node
        let mut path_sum = 0;
        for i in (0..current_path.len()).rev() {
            path_sum += current_path[i];
            if path_sum == target {
                result.push(current_path[i..].to_vec());  // found a valid sub-path
            }
        }
        dfs(&n.left, target, current_path, result);
        dfs(&n.right, target, current_path, result);
        current_path.pop();   // backtrack
    }
}`

const pq3Code = `// Flatten Binary Tree to Linked List — in-place, preorder
// Returns the tail of the flattened subtree
fn flatten(root: &mut Option<Box<TreeNode>>) {
    dfs(root);
}

fn dfs(node: &mut Option<Box<TreeNode>>) -> *mut Option<Box<TreeNode>> {
    match node {
        None => node as *mut _,             // return pointer to None for empty subtree
        Some(n) => {
            if n.left.is_none() && n.right.is_none() {
                return node as *mut _;      // leaf: it is its own tail
            }
            // flatten left and right subtrees, get their tails
            let left_tail = dfs(&mut n.left);
            let right_tail = dfs(&mut n.right);
            // if there's a left subtree, insert it between root and right subtree
            if n.left.is_some() {
                // left tail points to old right subtree
                // then move left subtree to the right, clear left pointer
                let old_right = n.right.take();
                let left = n.left.take();
                n.right = left;
                // SAFETY: left_tail points into our owned tree, valid for this scope
                unsafe { *left_tail = old_right; }
            }
            // return the overall tail (right tail if it exists, else left tail)
            if unsafe { (*right_tail).is_some() } {
                right_tail
            } else {
                left_tail
            }
        }
    }
}`

const pq4Code = `// Path Sum III — count paths summing to target (any start/end node)
// O(n) using prefix sums with a hashmap
use std::collections::HashMap;

fn path_sum_iii(root: &Option<Box<TreeNode>>, target: i32) -> i32 {
    let mut count = 0;
    // prefix_counts[s] = how many times we've seen prefix sum s on current path
    let mut prefix_counts: HashMap<i32, i32> = HashMap::new();
    prefix_counts.insert(0, 1);         // empty path has sum 0

    dfs(root, target, 0, &mut prefix_counts, &mut count);
    count
}

fn dfs(
    node: &Option<Box<TreeNode>>,
    target: i32,
    current_sum: i32,
    prefix_counts: &mut HashMap<i32, i32>,
    count: &mut i32,
) {
    if let Some(n) = node {
        let current_sum = current_sum + n.val;
        // how many prefixes can we remove to get a path summing to target?
        *count += prefix_counts.get(&(current_sum - target)).copied().unwrap_or(0);
        *prefix_counts.entry(current_sum).or_insert(0) += 1;   // add this prefix to the map
        dfs(&n.left, target, current_sum, prefix_counts, count);
        dfs(&n.right, target, current_sum, prefix_counts, count);
        *prefix_counts.entry(current_sum).or_insert(0) -= 1;   // backtrack: remove this prefix
    }
}`

const pq5Code = `// Binary Tree Maximum Path Sum — path can go through any nodes, any direction
fn max_path_sum(root: &Option<Box<TreeNode>>) -> i32 {
    let mut max_sum = i32::MIN;
    max_gain(root, &mut max_sum);
    max_sum
}

fn max_gain(node: &Option<Box<TreeNode>>, max_sum: &mut i32) -> i32 {
    match node {
        None => 0,
        Some(n) => {
            // only take positive contributions from children
            let left_gain = max_gain(&n.left, max_sum).max(0);
            let right_gain = max_gain(&n.right, max_sum).max(0);
            // price of the path that PASSES THROUGH this node as the top
            let price_through = n.val + left_gain + right_gain;
            *max_sum = (*max_sum).max(price_through);  // update global max
            // return max gain if we CONTINUE upward (can only go one direction)
            n.val + left_gain.max(right_gain)
        }
    }
}`

export default function TreeDFSContent() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>

      <Sub title="What does a binary tree look like?">
        <CodeBlock code={TREE_ANATOMY} lang="text" />
      </Sub>

      <Sub title="What is Tree DFS?">
        <p style={{ lineHeight: 1.7 }}>
          Imagine exploring a maze by always choosing to go as deep as possible down
          one corridor before backtracking and trying another. That's DFS — dive all
          the way to a leaf, then backtrack and try another branch. For binary trees,
          DFS is almost always written as a recursive function because the call stack
          handles the "backtracking" for you automatically when a function returns.
        </p>
        <Callout type="tip">
          <strong>Trigger phrases:</strong> "root to leaf path", "path sum", "all paths",
          "diameter", "flatten to list", "maximum path". Any problem about tracking a
          running value as you travel from root to leaf → DFS with a parameter.
        </Callout>
      </Sub>

      <Sub title="How DFS works — ASCII walkthrough">
        <CodeBlock code={DFS_VISUAL} lang="text" />
        <Callout type="tip">
          The core DFS template: subtract the current node's value from the target and
          recurse. At a leaf, check if what's left equals zero. That pattern solves most
          path-sum problems with almost no modification.
        </Callout>
      </Sub>

      <Sub title="TreeNode struct (used in all problems)">
        <CodeBlock code={nodeClass} lang="rust" />
      </Sub>

      <Sub title="Taught Questions">

        <QuestionCard
          num={1}
          title="Path Sum (does a path exist?)"
          difficulty="Easy"
          problem={`Given a binary tree and a target sum, determine if the tree has a root-to-leaf path such that the sum of values along the path equals target.

Example: target=22
        5
       / \\
      4   8
     /   / \\
    11  13   4
   /  \\       \\
  7    2       1
→ True (path: 5→4→11→2)`}
          brute={<>
            <BigOBadge time="O(n)" space="O(n)" />
            <CodeBlock code={q1Brute} lang="rust" />
            <Callout type="warn">Collecting all paths wastes memory — you just need a yes/no answer.</Callout>
          </>}
          optimized={<>
            <BigOBadge time="O(n)" space="O(h)" />
            <CodeBlock code={q1Opt} lang="rust" />
            <Callout type="tip">
              <strong>Aha moment:</strong> Pass <code>remaining = target - node.val</code>
              down to the children. At a leaf, if remaining equals 0, you've found a valid
              path. The recursion is doing all the bookkeeping — no list needed.
            </Callout>
            <Callout type="danger">
              <strong>Common mistake:</strong> Checking <code>remaining == 0</code> at
              internal nodes — that would count paths that don't reach a leaf. Only
              check at leaf nodes (both children are None).
            </Callout>
          </>}
          answer="DFS subtracting node.val from remaining at each step. At a leaf: return remaining == 0. At internal nodes: return left OR right subtree result."
        />

        <QuestionCard
          num={2}
          title="All Paths for a Sum"
          difficulty="Medium"
          problem={`Return all root-to-leaf paths where the sum of values equals the target.

Example: target=23, same tree → [[5,4,11,3],[5,8,4,5]] (or similar)`}
          brute={<>
            <BigOBadge time="O(n·h)" space="O(n·h)" />
            <CodeBlock code={q2Brute} lang="rust" />
          </>}
          optimized={<>
            <BigOBadge time="O(n·h)" space="O(h)" />
            <CodeBlock code={q2Opt} lang="rust" />
            <Callout type="tip">
              <strong>Aha moment:</strong> Use a <code>path</code> Vec that grows
              as you go deeper and shrinks as you backtrack (<code>path.pop()</code>).
              This one Vec tracks the current path without allocating at every node.
            </Callout>
            <Callout type="danger">
              <strong>Common mistake:</strong> Pushing <code>path</code> directly
              to result — since it's a mutable Vec, you'll store a reference that changes.
              Always push <code>path.clone()</code> (a copy).
            </Callout>
          </>}
          answer="DFS with path Vec and remaining. At leaf with remaining==0, push a CLONE of path to result. Pop the current node on backtrack."
        />

        <QuestionCard
          num={3}
          title="Sum of Path Numbers"
          difficulty="Medium"
          problem={`Each root-to-leaf path in a tree represents a number (e.g., 1→2→3 = 123). Return the sum of all such numbers.

Example:
    1
   / \\
  2   3
→ 12 + 13 = 25`}
          brute={<>
            <BigOBadge time="O(n)" space="O(n)" />
            <CodeBlock code={q3Brute} lang="rust" />
          </>}
          optimized={<>
            <BigOBadge time="O(n)" space="O(h)" />
            <CodeBlock code={q3Opt} lang="rust" />
            <Callout type="tip">
              <strong>Aha moment:</strong> Instead of building a string and converting,
              keep a running integer: <code>current_number = current_number * 10 + n.val</code>.
              Multiplying by 10 "shifts" the existing digits left to make room for the new digit.
            </Callout>
            <Callout type="danger">
              <strong>Common mistake:</strong> Returning <code>0</code> for a None node and
              adding that to the leaf result. Since both children call the function, a leaf
              with one None child would count the leaf twice. Guard with the leaf check first.
            </Callout>
          </>}
          answer="DFS passing current_number = current_number * 10 + n.val. At a leaf, return current_number. Otherwise return sum of left and right subtree results."
        />

        <QuestionCard
          num={4}
          title="Path with Maximum Sum (root to leaf)"
          difficulty="Medium"
          problem={`Find the root-to-leaf path with the maximum sum and return that sum.

Example:
      1
     / \\
    2   3
   / \\
  4   5
→ max path is 1→2→5, sum = 8`}
          brute={<>
            <BigOBadge time="O(n)" space="O(n)" />
            <CodeBlock code={q4Brute} lang="rust" />
          </>}
          optimized={<>
            <BigOBadge time="O(n)" space="O(h)" />
            <CodeBlock code={q4Opt} lang="rust" />
            <Callout type="tip">
              <strong>Aha moment:</strong> Each call returns the max sum reachable from
              that node to a leaf. A node's contribution is its own value plus whichever
              child gives the bigger sum. This bubbles the best answer all the way up to root.
            </Callout>
            <Callout type="danger">
              <strong>Common mistake:</strong> Returning <code>n.val + left_max.max(right_max)</code>
              when one child is None — you'd pick <code>i32::MIN</code>. Use
              explicit checks for missing children.
            </Callout>
          </>}
          answer="DFS returning max sum reachable to a leaf. At each node: node.val + max(left_max, right_max). Handle missing children explicitly."
        />

        <QuestionCard
          num={5}
          title="Diameter of Binary Tree"
          difficulty="Easy"
          problem={`The diameter of a tree is the length of the longest path between any two nodes (doesn't have to go through the root). Return the number of edges in the longest path.

Example:
      1
     / \\
    2   3
   / \\
  4   5
→ 3 (path: 4→2→1→3 or 5→2→1→3)`}
          brute={<>
            <BigOBadge time="O(n²)" space="O(h)" />
            <CodeBlock code={q5Brute} lang="rust" />
            <Callout type="warn">Calling height() at every node means O(n) work per node = O(n²) total. We can do both in one pass.</Callout>
          </>}
          optimized={<>
            <BigOBadge time="O(n)" space="O(h)" />
            <CodeBlock code={q5Opt} lang="rust" />
            <Callout type="tip">
              <strong>Aha moment:</strong> At every node, the diameter <em>through that node</em>
              is <code>left_height + right_height</code>. While computing heights (bottom-up),
              also update a global max diameter. One DFS pass does both jobs simultaneously.
            </Callout>
            <Callout type="danger">
              <strong>Common mistake:</strong> Confusing diameter with height. The diameter
              through a node is left_height + right_height (two separate arms). The height
              returned upward is 1 + max(left, right) (only the longer arm).
            </Callout>
          </>}
          answer="DFS computing height bottom-up. At each node, update max_diameter = max(max_diameter, left_h + right_h). Return height = 1 + max(left_h, right_h) upward."
        />

      </Sub>

      <Sub title="Practice Questions">
        <Callout type="info">Try each one yourself first. Hints nudge you; answer reveals after 3 seconds with full commented code.</Callout>

        <QuestionCard
          num={6}
          title="Count Paths for a Sum"
          difficulty="Medium"
          practice
          problem={`Count the number of paths in a binary tree that sum to target. A path can start and end at any node (doesn't have to go root-to-leaf).

Example: target=8
        10
       /  \\
      5   -3
     / \\    \\
    3   2   11
   / \\   \\
  3  -2   1
→ 3 (paths: 5→3, 5→2→1, -3→11)`}
          hints={[
            "Try starting a fresh DFS from every single node — that covers all possible starting points.",
            "dfs(node, remaining) counts paths starting at 'node' that sum to remaining. traverse(node) calls dfs at every node.",
            "At each node in dfs: if node.val == remaining, count it. Then recurse left and right with remaining - node.val.",
          ]}
          answer="Two-layer recursion: traverse every node as a potential path start, then run dfs from each start counting paths that hit the target."
          answerCode={pq1Code}
        />

        <QuestionCard
          num={7}
          title="Tree Path Sum II"
          difficulty="Medium"
          practice
          problem={`Find all paths in a binary tree that sum to target. A path can start and end at any node (not just root-to-leaf).

Example: target=12, tree above → [[7,5],[1,2,5,10-but-partial...]] (find all sub-paths)`}
          hints={[
            "DFS keeping the current root-to-node path in a Vec. At each node, scan backward through the path checking all sub-paths ending at this node.",
            "A sub-path from index i to current node = sum of current_path[i..].",
            "Backtrack (pop) after returning from both children.",
          ]}
          answer="DFS with current_path Vec. At each node, scan backwards through current_path summing values — whenever the sum hits target, record that subpath slice."
          answerCode={pq2Code}
        />

        <QuestionCard
          num={8}
          title="Flatten Binary Tree to Linked List"
          difficulty="Medium"
          practice
          problem={`Flatten a binary tree to a linked list in-place, using the right pointers. The order should match preorder traversal (root → left → right).

Example:
    1          1→2→3→4→5→6 (using right pointers)
   / \\
  2   5
 / \\   \\
3   4   6`}
          hints={[
            "Think DFS post-order: flatten left subtree, flatten right subtree, then merge.",
            "After flattening both, insert the flattened left subtree between root and flattened right subtree.",
            "You need to know the TAIL of the flattened left subtree to attach the right subtree to it.",
          ]}
          answer="DFS returning the tail of each flattened subtree. Insert flattened left between root and right, set left=None, return the rightmost tail."
          answerCode={pq3Code}
        />

        <QuestionCard
          num={9}
          title="Path Sum III"
          difficulty="Medium"
          practice
          problem={`Count paths (starting and ending at any node) that sum to target. Must be O(n).

Example: same as Count Paths — but solve it in O(n) instead of O(n²).`}
          hints={[
            "Think prefix sums — the same trick from subarray sum problems.",
            "Track a running current_sum from root to the current node. A valid path ends here if (current_sum - target) was seen as a prefix sum earlier.",
            "Use a HashMap counting how many times each prefix sum has appeared. Backtrack by decrementing the count when leaving a node.",
          ]}
          answer="DFS with prefix sum HashMap. count += prefix_counts[current_sum - target] at each node. Backtrack by decrementing prefix_counts[current_sum] after recursion."
          answerCode={pq4Code}
        />

        <QuestionCard
          num={10}
          title="Binary Tree Maximum Path Sum"
          difficulty="Hard"
          practice
          problem={`Find the maximum path sum in a binary tree. The path can start and end at any node and does not need to pass through the root. Negative values are possible.

Example:
   -10
   /  \\
  9   20
     /  \\
    15   7
→ 42 (path: 15→20→7)`}
          hints={[
            "At each node, the path through it has sum: node.val + left_gain + right_gain. Update a global max with this.",
            "But when RETURNING a gain to the parent, you can only extend in ONE direction (left OR right, not both). Return node.val + max(left_gain, right_gain).",
            "Ignore negative contributions: if left_gain < 0, use 0 instead (don't extend that way).",
          ]}
          answer="DFS returning max gain going one direction. At each node update global max with node.val + left_gain + right_gain. Clamp negative gains to 0."
          answerCode={pq5Code}
        />
      </Sub>

    </div>
  )
}
