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

KEY TRICK: snapshot len(queue) at the START of each round.
           That number is exactly how many nodes are on this level.
           Process exactly that many — then you've finished one level.
`

const nodeClass = `# TreeNode used in all problems
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right`

// ── Q1: Level Order Traversal ─────────────────────────────────────────────
const q1Brute = `# Brute force: recursive DFS tracking depth, sort into buckets
def level_order_brute(root):
    result = {}
    def dfs(node, depth):
        if not node:
            return
        result.setdefault(depth, []).append(node.val)  # bucket by depth
        dfs(node.left, depth + 1)
        dfs(node.right, depth + 1)
    dfs(root, 0)
    return [result[d] for d in sorted(result)]  # reassemble in order`

const q1Opt = `from collections import deque

def level_order(root):
    if not root:
        return []                   # empty tree → empty result
    queue = deque([root])           # start: just the root in the queue
    result = []
    while queue:
        level_size = len(queue)     # how many nodes are on THIS level?
        current_level = []
        for _ in range(level_size): # process EXACTLY that many
            node = queue.popleft()          # grab front of queue
            current_level.append(node.val)  # record its value
            if node.left:                   # enqueue children for next level
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        result.append(current_level)        # done with this level
    return result`

// ── Q2: Reverse Level Order ───────────────────────────────────────────────
const q2Brute = `def reverse_level_order_brute(root):
    result = level_order(root)   # reuse normal BFS
    return result[::-1]          # just flip the list — easy but O(n) extra`

const q2Opt = `from collections import deque

def reverse_level_order(root):
    if not root:
        return []
    queue = deque([root])
    result = deque()             # use a deque as the result so we can prepend
    while queue:
        level_size = len(queue)
        current_level = []
        for _ in range(level_size):
            node = queue.popleft()
            current_level.append(node.val)
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        result.appendleft(current_level)  # prepend each level → auto-reversed!
    return list(result)`

// ── Q3: Zigzag Traversal ──────────────────────────────────────────────────
const q3Brute = `def zigzag_brute(root):
    levels = level_order(root)   # get normal level order first
    for i in range(len(levels)):
        if i % 2 == 1:           # odd levels → reverse them
            levels[i] = levels[i][::-1]
    return levels`

const q3Opt = `from collections import deque

def zigzag_level_order(root):
    if not root:
        return []
    queue = deque([root])
    result = []
    left_to_right = True         # flag: which direction this level goes
    while queue:
        level_size = len(queue)
        current_level = deque()  # deque so we can append to either end
        for _ in range(level_size):
            node = queue.popleft()
            if left_to_right:
                current_level.append(node.val)        # normal: add to right
            else:
                current_level.appendleft(node.val)    # reversed: add to left
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        result.append(list(current_level))
        left_to_right = not left_to_right    # flip direction each level
    return result`

// ── Q4: Level Averages ────────────────────────────────────────────────────
const q4Brute = `def level_averages_brute(root):
    levels = level_order(root)   # reuse BFS
    return [sum(lvl) / len(lvl) for lvl in levels]`

const q4Opt = `from collections import deque

def level_averages(root):
    if not root:
        return []
    queue = deque([root])
    result = []
    while queue:
        level_size = len(queue)
        level_sum = 0            # accumulate sum as we process each node
        for _ in range(level_size):
            node = queue.popleft()
            level_sum += node.val    # add to running sum
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        result.append(level_sum / level_size)  # average for this level
    return result`

// ── Q5: Minimum Depth ─────────────────────────────────────────────────────
const q5Brute = `def min_depth_brute(root):
    if not root:
        return 0
    if not root.left:            # no left subtree → go right
        return 1 + min_depth_brute(root.right)
    if not root.right:           # no right subtree → go left
        return 1 + min_depth_brute(root.left)
    return 1 + min(min_depth_brute(root.left), min_depth_brute(root.right))`

const q5Opt = `from collections import deque

def min_depth(root):
    if not root:
        return 0
    queue = deque([(root, 1)])   # store (node, depth) pairs
    while queue:
        node, depth = queue.popleft()
        # a LEAF node has no children — this is the shallowest leaf!
        if not node.left and not node.right:
            return depth         # BFS guarantees this is the minimum depth
        if node.left:
            queue.append((node.left, depth + 1))
        if node.right:
            queue.append((node.right, depth + 1))
    return 0`

// ── PRACTICE answers ──────────────────────────────────────────────────────
const pq1Code = `from collections import deque

# Maximum Depth — count how many levels BFS produces
def max_depth(root):
    if not root:
        return 0
    queue = deque([root])
    depth = 0                    # increment after each level is processed
    while queue:
        depth += 1               # starting a new level
        for _ in range(len(queue)):
            node = queue.popleft()
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
    return depth                 # total levels = max depth`

const pq2Code = `from collections import deque

# Level Order Successor — return the node that comes right after 'key' in BFS order
def level_order_successor(root, key):
    if not root:
        return None
    queue = deque([root])
    while queue:
        node = queue.popleft()
        if node.left:
            queue.append(node.left)
        if node.right:
            queue.append(node.right)
        # after enqueueing children, check if WE were the key node
        # the next popleft() will give us the successor
        if node.val == key:
            return queue[0] if queue else None   # peek at front of queue
    return None`

const pq3Code = `from collections import deque

# Connect Level Order Siblings — set node.next to the next node on the same level
def connect_level_order_siblings(root):
    if not root:
        return
    queue = deque([root])
    while queue:
        prev = None              # previous node on this level
        for _ in range(len(queue)):
            node = queue.popleft()
            if prev:
                prev.next = node     # link previous node to current
            prev = node              # current becomes previous for next iteration
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        # prev.next is implicitly None (end of level) — that's correct`

const pq4Code = `from collections import deque

# Right View — last node at each level is visible from the right
def right_side_view(root):
    if not root:
        return []
    queue = deque([root])
    result = []
    while queue:
        level_size = len(queue)
        for i in range(level_size):
            node = queue.popleft()
            if i == level_size - 1:       # last node in this level
                result.append(node.val)   # it's visible from the right
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
    return result`

const pq5Code = `from collections import deque

# Populating Next Right Pointers — same as Connect Level Order Siblings
# Works on any binary tree (not just perfect ones)
def connect(root):
    if not root:
        return root
    queue = deque([root])
    while queue:
        prev = None
        for _ in range(len(queue)):
            node = queue.popleft()
            if prev:
                prev.next = node         # point previous node to current
            prev = node
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        # last node on each level already has .next = None by default
    return root`

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
          The magic line is <code>level_size = len(queue)</code> captured at the
          start of each while-loop iteration. That number freezes how many nodes
          are on the current level, so the inner for-loop processes exactly one level
          at a time — even as we're adding the next level's nodes to the queue.
        </Callout>
      </Sub>

      <Sub title="TreeNode class (used in all problems)">
        <CodeBlock code={nodeClass} lang="python" />
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
            <CodeBlock code={q1Brute} lang="python" />
            <Callout type="warn">DFS works but you end up visiting nodes out of level order and re-sorting — BFS visits them in level order naturally.</Callout>
          </>}
          optimized={<>
            <BigOBadge time="O(n)" space="O(n)" />
            <CodeBlock code={q1Opt} lang="python" />
            <Callout type="tip">
              <strong>Aha moment:</strong> Snapshot <code>level_size = len(queue)</code>
              before the inner loop. That's the exact node count for this level — process
              only that many. The children you add during that loop belong to the NEXT level.
            </Callout>
            <Callout type="danger">
              <strong>Common mistake:</strong> Using <code>while queue</code> as the inner
              loop too — that processes ALL remaining nodes, not just one level.
            </Callout>
          </>}
          answer="BFS with a queue. Snapshot len(queue) at the start of each outer loop iteration — that's how many nodes to process for the current level."
        />

        <QuestionCard
          num={2}
          title="Reverse Level Order Traversal"
          difficulty="Easy"
          problem={`Return the level-order traversal of a binary tree from bottom to top (leaves first, root last).

Example: same tree as above → [[15,7],[9,20],[3]]`}
          brute={<>
            <BigOBadge time="O(n)" space="O(n)" />
            <CodeBlock code={q2Brute} lang="python" />
          </>}
          optimized={<>
            <BigOBadge time="O(n)" space="O(n)" />
            <CodeBlock code={q2Opt} lang="python" />
            <Callout type="tip">
              <strong>Aha moment:</strong> Use a <code>deque</code> as your result and
              call <code>appendleft</code> instead of <code>append</code> for each level.
              That inserts each new level at the front — you get reverse order for free
              without an extra reversal pass.
            </Callout>
            <Callout type="danger">
              <strong>Common mistake:</strong> Reversing the entire result list at the end is
              fine, but prepending with <code>appendleft</code> is cleaner and avoids
              an extra O(n) pass.
            </Callout>
          </>}
          answer="Standard BFS, but append each level to the FRONT of a result deque using appendleft — bottom-up order for free."
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
            <CodeBlock code={q3Brute} lang="python" />
          </>}
          optimized={<>
            <BigOBadge time="O(n)" space="O(n)" />
            <CodeBlock code={q3Opt} lang="python" />
            <Callout type="tip">
              <strong>Aha moment:</strong> Build each level into a <code>deque</code>.
              On left-to-right levels, <code>append</code> to the right (normal).
              On right-to-left levels, <code>appendleft</code> — values land in reversed
              order automatically. Flip a boolean after each level.
            </Callout>
            <Callout type="danger">
              <strong>Common mistake:</strong> Reversing the node-processing ORDER instead
              of the output order. The queue always goes left child first, right child second —
              never change that. Only change where in the output list you INSERT the value.
            </Callout>
          </>}
          answer="BFS with a left_to_right flag. Build each level into a deque: append normally when True, appendleft when False. Flip the flag after each level."
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
            <CodeBlock code={q4Brute} lang="python" />
          </>}
          optimized={<>
            <BigOBadge time="O(n)" space="O(n)" />
            <CodeBlock code={q4Opt} lang="python" />
            <Callout type="tip">
              <strong>Aha moment:</strong> Instead of collecting all values and averaging at
              the end, keep a running <code>level_sum</code> as you pop each node.
              Divide by <code>level_size</code> at the end of the inner loop — you already
              know the count.
            </Callout>
            <Callout type="danger">
              <strong>Common mistake:</strong> Dividing by <code>len(queue)</code> at the
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
            <CodeBlock code={q5Brute} lang="python" />
            <Callout type="warn">Recursive DFS visits the entire tree — even when the min-depth leaf is near the top. BFS stops the moment it finds a leaf.</Callout>
          </>}
          optimized={<>
            <BigOBadge time="O(n)" space="O(n)" />
            <CodeBlock code={q5Opt} lang="python" />
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
            "Peek at the front of the queue with queue[0] — don't pop it.",
          ]}
          answer="Standard BFS. After popping a node and enqueueing its children, check if it was the key — if so, return queue[0] (the next node in line)."
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
