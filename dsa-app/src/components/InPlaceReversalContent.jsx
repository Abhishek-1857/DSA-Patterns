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

// Helper class shown once for context
const nodeClass = `# ListNode class used in all problems below
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next`

// ─── TAUGHT Q1: Reverse a Linked List ───────────────────────────────────────
const ipr1Brute = `# Brute force: collect all values, rebuild reversed
def reverse_list_brute(head):
    vals = []
    curr = head
    while curr:                  # pass 1: store all values
        vals.append(curr.val)
        curr = curr.next
    curr = head
    for v in reversed(vals):     # pass 2: fill in reverse order
        curr.val = v
        curr = curr.next
    return head`

const ipr1Opt = `# Optimised: three-pointer in-place flip
def reverse_list(head):
    prev = None                  # will become new tail (points to None)
    curr = head                  # walker starts at head
    while curr:
        nxt = curr.next          # SAVE next before we overwrite the pointer
        curr.next = prev         # flip the arrow
        prev = curr              # advance prev one step right
        curr = nxt               # advance curr one step right
    return prev                  # prev is now the new head`

// ─── TAUGHT Q2: Reverse a Sub-list ──────────────────────────────────────────
const ipr2Brute = `# Brute force: collect values, reverse the slice, rebuild
def reverse_between_brute(head, left, right):
    vals = []
    curr = head
    while curr:
        vals.append(curr.val)
        curr = curr.next
    # reverse just the slice [left-1 .. right-1]
    vals[left-1:right] = vals[left-1:right][::-1]
    curr = head
    for v in vals:
        curr.val = v
        curr = curr.next
    return head`

const ipr2Opt = `# Optimised: walk to position left, then reverse right-left+1 nodes
def reverse_between(head, left, right):
    if not head or left == right:
        return head
    dummy = ListNode(0)          # dummy node makes edge cases easier
    dummy.next = head
    prev = dummy
    # step 1: walk prev to the node just BEFORE position left
    for _ in range(left - 1):
        prev = prev.next
    curr = prev.next             # curr is the first node to reverse
    # step 2: reverse right-left times
    for _ in range(right - left):
        nxt = curr.next          # node to pull to the front of sublist
        curr.next = nxt.next     # remove nxt from its current position
        nxt.next = prev.next     # nxt's new next = current front of reversed part
        prev.next = nxt          # nxt becomes the new front
    return dummy.next`

// ─── TAUGHT Q3: Reverse Every K-element Sub-list ────────────────────────────
const ipr3Brute = `# Brute force: collect all values into chunks, reverse each
def reverse_k_group_brute(head, k):
    vals = []
    curr = head
    while curr:
        vals.append(curr.val)
        curr = curr.next
    # reverse every chunk of k
    result = []
    for i in range(0, len(vals), k):
        chunk = vals[i:i+k]
        if len(chunk) == k:      # only reverse full chunks
            result.extend(chunk[::-1])
        else:
            result.extend(chunk) # leftover stays as-is
    curr = head
    for v in result:
        curr.val = v
        curr = curr.next
    return head`

const ipr3Opt = `# Optimised: reverse k nodes at a time in-place, recurse on rest
def reverse_k_group(head, k):
    # check if we have at least k nodes remaining
    count = 0
    node = head
    while node and count < k:
        node = node.next
        count += 1
    if count < k:                # fewer than k nodes left → don't reverse
        return head
    # reverse exactly k nodes (same three-pointer trick)
    prev, curr = None, head
    for _ in range(k):
        nxt = curr.next
        curr.next = prev
        prev = curr
        curr = nxt
    # head is now the TAIL of the reversed group
    # recursively reverse the rest and attach
    head.next = reverse_k_group(curr, k)
    return prev                  # prev is the new head of this group`

// ─── TAUGHT Q4: Rotate a Linked List ────────────────────────────────────────
const ipr4Brute = `# Brute force: rotate one step at a time, k times
def rotate_right_brute(head, k):
    if not head or not head.next or k == 0:
        return head
    for _ in range(k):
        # find second-to-last node
        curr = head
        while curr.next.next:
            curr = curr.next
        last = curr.next         # last node
        curr.next = None         # detach last
        last.next = head         # attach at front
        head = last              # new head
    return head`

const ipr4Opt = `# Optimised: find the new tail, rewire two pointers
def rotate_right(head, k):
    if not head or not head.next:
        return head
    # step 1: find length and tail
    length = 1
    tail = head
    while tail.next:
        tail = tail.next
        length += 1
    # step 2: reduce k (rotating by length is a no-op)
    k = k % length
    if k == 0:
        return head              # nothing to do
    # step 3: find the new tail — it's at position (length - k - 1)
    new_tail = head
    for _ in range(length - k - 1):
        new_tail = new_tail.next
    new_head = new_tail.next     # node after new_tail becomes the new head
    new_tail.next = None         # cut the list here
    tail.next = head             # old tail connects to old head
    return new_head`

// ─── TAUGHT Q5: Reverse Alternating K-element Sub-list ──────────────────────
const ipr5Brute = `# Brute force: collect values, reverse alternating chunks
def reverse_alternate_k_groups_brute(head, k):
    vals = []
    curr = head
    while curr:
        vals.append(curr.val)
        curr = curr.next
    result = []
    i = 0
    flip = True                  # alternate: reverse, skip, reverse, skip...
    while i < len(vals):
        chunk = vals[i:i+k]
        if flip:
            result.extend(chunk[::-1])
        else:
            result.extend(chunk)
        i += k
        flip = not flip
    curr = head
    for v in result:
        curr.val = v
        curr = curr.next
    return head`

const ipr5Opt = `# Optimised: reverse k nodes, skip k nodes, repeat in-place
def reverse_alternate_k_groups(head, k):
    curr = head
    prev = None
    while curr:
        # --- PHASE 1: reverse k nodes ---
        last_of_reversed = curr  # will be the tail of this reversed chunk
        nxt = None
        i = 0
        while curr and i < k:
            nxt = curr.next
            curr.next = prev
            prev = curr
            curr = nxt
            i += 1
        # connect: whoever came before → new front of reversed chunk
        if prev is not None:
            # last_of_reversed.next still points into old list; we'll set it below
            pass
        # new head of reversed chunk is prev; last_of_reversed is its tail
        last_of_reversed.next = curr   # tail of reversed → start of skip section
        if head == last_of_reversed:   # first iteration: update overall head
            head = prev
        # --- PHASE 2: skip k nodes (don't reverse these) ---
        prev = last_of_reversed        # prev is now the tail of reversed chunk
        i = 0
        while curr and i < k:
            prev = curr
            curr = curr.next
            i += 1
    return head`

// ─── PRACTICE answers ────────────────────────────────────────────────────────
const pq1Code = `# Swap Nodes in Pairs — reverse every 2-node group
def swap_pairs(head):
    dummy = ListNode(0)
    dummy.next = head
    prev = dummy
    while prev.next and prev.next.next:
        # identify the two nodes to swap
        first = prev.next
        second = prev.next.next
        # rewire: prev → second → first → (rest)
        first.next = second.next   # first skips over second
        second.next = first        # second points back to first
        prev.next = second         # prev now leads into second
        prev = first               # advance prev to first (now trailing)
    return dummy.next`

const pq2Code = `# Reverse Nodes in k-Group (same as Taught Q3)
def reverse_k_group(head, k):
    # count if we have k nodes
    node, count = head, 0
    while node and count < k:
        node = node.next
        count += 1
    if count < k:
        return head              # don't reverse incomplete group
    # reverse k nodes
    prev, curr = None, head
    for _ in range(k):
        nxt = curr.next
        curr.next = prev
        prev = curr
        curr = nxt
    head.next = reverse_k_group(curr, k)  # recursively handle rest
    return prev`

const pq3Code = `# Odd Even Linked List — gather odds first, then evens
def odd_even_list(head):
    if not head:
        return head
    odd = head                   # pointer walking odd-indexed nodes (1,3,5...)
    even = head.next             # pointer walking even-indexed nodes (2,4,6...)
    even_head = even             # save even list start for later
    while even and even.next:
        odd.next = even.next     # odd skips over even to next odd
        odd = odd.next           # advance odd pointer
        even.next = odd.next     # even skips over odd to next even
        even = even.next         # advance even pointer
    odd.next = even_head         # attach even list after all odds
    return head`

const pq4Code = `# Reverse Linked List II — same as Taught Q2
def reverse_between(head, left, right):
    dummy = ListNode(0)
    dummy.next = head
    prev = dummy
    for _ in range(left - 1):   # walk to node just before 'left'
        prev = prev.next
    curr = prev.next             # first node to reverse
    for _ in range(right - left):
        nxt = curr.next          # node to move to front
        curr.next = nxt.next     # detach nxt
        nxt.next = prev.next     # nxt points to current front
        prev.next = nxt          # nxt is now new front
    return dummy.next`

const pq5Code = `# Split Linked List in Parts — divide into k chunks, largest first
def split_list_to_parts(head, k):
    # step 1: count total length
    length = 0
    curr = head
    while curr:
        length += 1
        curr = curr.next
    # step 2: calculate chunk sizes
    base_size = length // k      # minimum size of each part
    extra = length % k           # first 'extra' parts get one more node
    result = []
    curr = head
    for i in range(k):
        part_head = curr         # start of this chunk
        # this chunk is base_size long, +1 if we still have extra to distribute
        chunk_size = base_size + (1 if i < extra else 0)
        # walk to end of chunk
        for _ in range(chunk_size - 1):
            if curr:
                curr = curr.next
        # cut off this chunk from the rest
        if curr:
            curr.next, curr = None, curr.next
        result.append(part_head)
    return result`

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

      <Sub title="ListNode class (used in all problems)">
        <CodeBlock code={nodeClass} lang="python" />
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
            <CodeBlock code={ipr1Brute} lang="python" />
            <Callout type="warn">Stores all values — misses the point of "in-place".</Callout>
          </>}
          optimized={<>
            <BigOBadge time="O(n)" space="O(1)" />
            <CodeBlock code={ipr1Opt} lang="python" />
            <Callout type="tip">
              <strong>Aha moment:</strong> Three pointers is all you need. After the loop,
              <code>prev</code> lands on the last node — which becomes the new head.
              <code>curr</code> is always <code>None</code> at the end.
            </Callout>
            <Callout type="danger">
              <strong>Common mistake:</strong> Writing <code>curr.next = prev</code> BEFORE
              saving <code>nxt = curr.next</code>. You'll lose the rest of the list!
              Always save first.
            </Callout>
          </>}
          answer="Three pointers: prev=None, curr=head. Each iteration: save next, flip arrow, advance both. Return prev at the end."
        />

        <QuestionCard
          num={2}
          title="Reverse a Sub-list"
          difficulty="Medium"
          problem={`Given a linked list and positions left and right, reverse the nodes from position left to right (1-indexed). Return the modified list.

Example: 1→2→3→4→5, left=2, right=4 → 1→4→3→2→5`}
          brute={<>
            <BigOBadge time="O(n)" space="O(n)" />
            <CodeBlock code={ipr2Brute} lang="python" />
          </>}
          optimized={<>
            <BigOBadge time="O(n)" space="O(1)" />
            <CodeBlock code={ipr2Opt} lang="python" />
            <Callout type="tip">
              <strong>Aha moment:</strong> Instead of three-pointer walking, use a "pull to
              front" trick: grab the node after <code>curr</code>, yank it to just after
              <code>prev</code>, repeat. This reverses the sublist one node at a time.
            </Callout>
            <Callout type="danger">
              <strong>Common mistake:</strong> Off-by-one walking to <code>left</code>.
              You want <code>prev</code> to stop at position <code>left-1</code> (the node
              BEFORE the reversal starts), so loop <code>left-1</code> times.
            </Callout>
          </>}
          answer="Walk prev to position left-1, then pull the node after curr to front of sublist, right-left times."
        />

        <QuestionCard
          num={3}
          title="Reverse Every K-element Sub-list"
          difficulty="Medium"
          problem={`Given a linked list, reverse every k nodes as a group. If the last group has fewer than k nodes, leave them as-is.

Example: 1→2→3→4→5→6→7→8, k=3 → 3→2→1→6→5→4→7→8`}
          brute={<>
            <BigOBadge time="O(n)" space="O(n)" />
            <CodeBlock code={ipr3Brute} lang="python" />
          </>}
          optimized={<>
            <BigOBadge time="O(n)" space="O(1)" />
            <CodeBlock code={ipr3Opt} lang="python" />
            <Callout type="tip">
              <strong>Aha moment:</strong> First check you have k nodes before committing to
              reverse. Then use the standard three-pointer reversal on exactly k nodes.
              The old head of the group becomes the tail after reversal — attach the
              recursion result there.
            </Callout>
            <Callout type="danger">
              <strong>Common mistake:</strong> Forgetting to check if there are k nodes left
              before reversing. Reversing a partial group at the end is wrong — leave it as-is.
            </Callout>
          </>}
          answer="Count k nodes first (return unchanged if fewer). Reverse k nodes, set head.next = recurse(rest, k), return prev."
        />

        <QuestionCard
          num={4}
          title="Rotate a Linked List"
          difficulty="Medium"
          problem={`Given a linked list and integer k, rotate the list to the right by k places.

Example: 1→2→3→4→5, k=2 → 4→5→1→2→3`}
          brute={<>
            <BigOBadge time="O(n·k)" space="O(1)" />
            <CodeBlock code={ipr4Brute} lang="python" />
            <Callout type="warn">O(n·k) — terrible when k is huge.</Callout>
          </>}
          optimized={<>
            <BigOBadge time="O(n)" space="O(1)" />
            <CodeBlock code={ipr4Opt} lang="python" />
            <Callout type="tip">
              <strong>Aha moment:</strong> Rotating by length is a no-op. So first reduce
              k modulo length. Then the new head is at position <code>length - k</code>
              from the start — just rewire two pointers.
            </Callout>
            <Callout type="danger">
              <strong>Common mistake:</strong> Forgetting <code>k = k % length</code>.
              If k equals the list length, nothing should change — but a naive rotation
              would do n swaps.
            </Callout>
          </>}
          answer="Find length + tail, reduce k mod length, find new tail at position length-k-1, cut and rewire."
        />

        <QuestionCard
          num={5}
          title="Reverse Alternating K-element Sub-list"
          difficulty="Hard"
          problem={`Given a linked list and k, reverse k nodes, skip k nodes, reverse k nodes, skip k nodes... and so on.

Example: 1→2→3→4→5→6→7→8, k=2 → 2→1→3→4→6→5→7→8`}
          brute={<>
            <BigOBadge time="O(n)" space="O(n)" />
            <CodeBlock code={ipr5Brute} lang="python" />
          </>}
          optimized={<>
            <BigOBadge time="O(n)" space="O(1)" />
            <CodeBlock code={ipr5Opt} lang="python" />
            <Callout type="tip">
              <strong>Aha moment:</strong> Two phases per iteration — reverse k nodes (using
              the standard three-pointer trick), then advance k nodes without touching them.
              Track the tail of the reversed chunk so you can properly connect it to the
              skipped section.
            </Callout>
            <Callout type="danger">
              <strong>Common mistake:</strong> Losing the connection between the reversed chunk
              and the skipped section. Set <code>last_of_reversed.next = curr</code> right
              after the reversal loop to bridge the gap.
            </Callout>
          </>}
          answer="Alternate between: reverse k nodes (three-pointer), skip k nodes (just advance). Carefully reconnect the reversed tail to the skip section each time."
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
            "Use a dummy head so you don't need to special-case the start.",
            "Each iteration: identify the pair (first, second), rewire: prev→second→first→rest.",
          ]}
          answer="Dummy head + loop: each step grab two nodes, rewire second→first, advance prev to first."
          answerCode={pq1Code}
        />

        <QuestionCard
          num={7}
          title="Reverse Nodes in k-Group"
          difficulty="Hard"
          practice
          problem={`Reverse the nodes of a linked list k at a time. If the remaining nodes are fewer than k, leave them as-is.

Example: 1→2→3→4→5, k=2 → 2→1→4→3→5`}
          hints={[
            "Count k nodes ahead first — if fewer than k remain, return head unchanged.",
            "Reverse exactly k nodes with the three-pointer approach.",
            "Set head.next = recurse on the remaining list, then return the new head (prev).",
          ]}
          answer="Count k, reverse k, attach recursion result to old head (now tail), return prev."
          answerCode={pq2Code}
        />

        <QuestionCard
          num={8}
          title="Odd Even Linked List"
          difficulty="Medium"
          practice
          problem={`Rearrange a linked list so all odd-indexed nodes come first, then all even-indexed nodes. 1-indexed. Do it in O(1) space.

Example: 1→2→3→4→5 → 1→3→5→2→4`}
          hints={[
            "Two separate pointer chains — one collecting odd-index nodes, one even-index.",
            "Walk both pointers simultaneously, skipping alternate nodes.",
            "At the end, link the tail of the odd chain to the head of the even chain.",
          ]}
          answer="odd and even pointers walk together skipping alternately; at the end odd.next = even_head."
          answerCode={pq3Code}
        />

        <QuestionCard
          num={9}
          title="Reverse Linked List II"
          difficulty="Medium"
          practice
          problem={`Reverse a linked list from position left to right (1-indexed) in one pass.

Example: 1→2→3→4→5, left=2, right=4 → 1→4→3→2→5`}
          hints={[
            "Walk to the node just before position left (use a dummy head to simplify).",
            "Then repeatedly pull the node after curr to just after prev — right-left times.",
            "You don't need to do a full three-pointer reversal; the 'pull to front' trick handles it in one pointer setup.",
          ]}
          answer="Dummy head, walk prev to left-1, then pull nxt = curr.next to front of sublist, right-left times."
          answerCode={pq4Code}
        />

        <QuestionCard
          num={10}
          title="Split Linked List in Parts"
          difficulty="Medium"
          practice
          problem={`Split a linked list into k consecutive parts. Parts should be as equal in length as possible — earlier parts are larger if sizes differ. Return an array of k heads (use null for empty parts).

Example: 1→2→3→4→5→6→7→8→9→10, k=3 → [[1,2,3,4],[5,6,7],[8,9,10]]`}
          hints={[
            "First count the total length of the list.",
            "base_size = length // k, extra = length % k. The first 'extra' parts get base_size+1 nodes.",
            "Walk the list, cut after each chunk by setting curr.next = None, then advance curr.",
          ]}
          answer="Count length, compute base_size and extra, then cut the list into chunks of the right sizes."
          answerCode={pq5Code}
        />
      </Sub>

    </div>
  )
}
