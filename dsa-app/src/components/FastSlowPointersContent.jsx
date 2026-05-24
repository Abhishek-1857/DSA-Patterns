import CodeBlock from './CodeBlock'
import BigOBadge from './BigOBadge'
import QuestionCard from './QuestionCard'

function Sub({ num, title, children }) {
  return (
    <div className="found-sub">
      <div className="found-sub-hdr">
        <span className="found-sub-num">{num}</span>
        <h2 className="found-sub-title">{title}</h2>
      </div>
      <div className="found-sub-body">{children}</div>
    </div>
  )
}

function Callout({ type = 'analogy', icon, label, children }) {
  const defaults = {
    analogy: { icon: '🗣️', label: 'Real-life analogy' },
    tip:     { icon: '💡', label: 'Quick tip' },
    warning: { icon: '⚠️', label: 'Common mistake' },
    note:    { icon: '📝', label: 'Note' },
  }
  const d = defaults[type]
  return (
    <div className={`callout ${type}`}>
      <span className="callout-label">{icon ?? d.icon} {label ?? d.label}</span>
      <div className="callout-body">{children}</div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
//  ASCII WALKTHROUGH
// ─────────────────────────────────────────────────────────────

const FSP_VISUAL = `# Fast & Slow Pointers — detecting a cycle (Floyd's Tortoise & Hare)
# List:  1 → 2 → 3 → 4 → 5
#                    ↑           ↓
#                    └───────────┘   (node 5 points back to node 3)
#
# Both start at head (node 1):
#
# Step 0:  slow=1,  fast=1
# Step 1:  slow=2,  fast=3   (slow: 1→2,  fast: 1→3)
# Step 2:  slow=3,  fast=5   (slow: 2→3,  fast: 3→5)
# Step 3:  slow=4,  fast=4   (slow: 3→4,  fast: 5→3→4 via cycle)
#          slow == fast  ✅  CYCLE DETECTED
#
# No-cycle: 1 → 2 → 3 → None
# Step 1:  slow=2,  fast=3
# Step 2:  slow=3,  fast=None  (fast.next was None → loop exits)
# fast fell off the end → NO CYCLE`

// ─────────────────────────────────────────────────────────────
//  TAUGHT Q1 — Linked List Cycle Detection
// ─────────────────────────────────────────────────────────────

const FSP_Q1_BRUTE = `# class ListNode:
#   def __init__(self, val=0, next=None):
#     self.val = val; self.next = next

# Brute force: store every visited node in a set
def has_cycle_brute(head):
    visited = set()           # set of all nodes we've seen
    current = head            # pointer starting at the head

    while current:            # walk until we reach None (end)
        if current in visited:    # seen this node before?
            return True           # yes — it's part of a cycle!
        visited.add(current)      # mark node as visited
        current = current.next    # advance to next node

    return False  # reached None = no cycle
    # Time:  O(n) — visit each node once
    # Space: O(n) — store every node in the set`

const FSP_Q1_OPT = `# Floyd's Cycle Detection: two pointers at different speeds
def has_cycle(head):
    slow = head   # tortoise: 1 step per iteration
    fast = head   # hare:     2 steps per iteration

    while fast and fast.next:   # fast needs at least 2 nodes ahead
        slow = slow.next         # slow hops once
        fast = fast.next.next    # fast hops twice

        if slow == fast:         # they landed on the same node!
            return True          # a cycle must exist

    return False   # fast fell off the end → no cycle
    # WHY they always meet in a cycle:
    # Each iteration, fast gains exactly 1 step on slow.
    # The gap shrinks by 1 every iteration → gap must reach 0.
    # When gap = 0, they're at the same node: cycle confirmed.
    # Time:  O(n), Space: O(1) — no set, no extra memory`

// ─────────────────────────────────────────────────────────────
//  TAUGHT Q2 — Find the Middle of a Linked List
// ─────────────────────────────────────────────────────────────

const FSP_Q2_BRUTE = `# Brute force: count nodes, then walk to position n//2
def find_middle_brute(head):
    count = 0
    current = head
    while current:        # first pass: count all nodes
        count += 1
        current = current.next

    # second pass: walk exactly count//2 steps
    middle_idx = count // 2   # 0-based index of the middle node
    current = head
    for _ in range(middle_idx):
        current = current.next

    return current   # the middle node
    # Works correctly but needs TWO full passes.
    # Time:  O(n), Space: O(1)`

const FSP_Q2_OPT = `# Single pass: when fast reaches the end, slow is at the middle
def find_middle(head):
    slow = head   # moves 1 step — will land at the middle
    fast = head   # moves 2 steps — will land at or past the end

    while fast and fast.next:   # fast needs 2 nodes available
        slow = slow.next        # slow: +1
        fast = fast.next.next   # fast: +2

    return slow   # slow covered half the distance fast did = middle
    # Walk-through (odd length): 1→2→3→4→5
    #   iter1: slow=2, fast=3
    #   iter2: slow=3, fast=5
    #   iter3: fast.next=None → stop. slow=3 ✅
    #
    # Walk-through (even length): 1→2→3→4
    #   iter1: slow=2, fast=3
    #   iter2: slow=3, fast=None (4.next=None) → stop. slow=3 ✅
    #   (returns SECOND middle for even-length lists)
    # Time:  O(n), Space: O(1) — single pass`

// ─────────────────────────────────────────────────────────────
//  TAUGHT Q3 — Happy Number
// ─────────────────────────────────────────────────────────────

const FSP_Q3_BRUTE = `# Brute force: store each number in a set to detect the cycle
def is_happy_brute(n):
    def sum_of_squares(num):
        total = 0
        while num > 0:
            digit = num % 10         # extract last digit
            total += digit * digit   # square it and add
            num //= 10               # chop off last digit
        return total

    seen = set()   # numbers we've already visited in the sequence

    while n != 1:
        if n in seen:      # seen this number before → infinite loop
            return False   # it's an unhappy number
        seen.add(n)        # mark as seen
        n = sum_of_squares(n)   # compute the next number in sequence

    return True   # reached 1 → happy number! ✅
    # Example: 19 → 82 → 68 → 100 → 1  (happy)
    # Time:  O(log n) per step, bounded sequence length
    # Space: O(log n) — set grows with sequence`

const FSP_Q3_OPT = `# Floyd's on the number sequence — detect cycle without a set
def is_happy(n):
    def get_next(num):
        total = 0
        while num > 0:
            digit = num % 10         # last digit
            total += digit * digit   # add its square
            num //= 10               # remove last digit
        return total

    slow = n                   # moves 1 step: slow = f(slow)
    fast = get_next(n)         # moves 2 steps: fast = f(f(fast))

    # stop when fast reaches 1 (happy) or slow meets fast (cycle)
    while fast != 1 and slow != fast:
        slow = get_next(slow)              # one step
        fast = get_next(get_next(fast))    # two steps

    return fast == 1   # if fast landed on 1 → happy; else → cycle
    # KEY INSIGHT: the number sequence is like a linked list.
    # n → get_next(n) → get_next(get_next(n)) → ...
    # Unhappy numbers form a cycle that NEVER reaches 1.
    # Fast/slow detects that cycle. If fast hits 1, we're done.
    # Time:  O(log n), Space: O(1) — no set needed`

// ─────────────────────────────────────────────────────────────
//  TAUGHT Q4 — Find the Duplicate Number
// ─────────────────────────────────────────────────────────────

const FSP_Q4_BRUTE = `# Brute force: use a set to find the number we've seen twice
def find_duplicate_brute(nums):
    seen = set()
    for num in nums:
        if num in seen:    # this number appeared before!
            return num     # it's the duplicate
        seen.add(num)
    return -1   # guaranteed to have a duplicate, won't reach here
    # Time:  O(n), Space: O(n) — set stores n values`

const FSP_Q4_OPT = `# Floyd's on the array — treat it as a linked list
# nums[i] is the "next pointer" from node i to node nums[i].
# A duplicate value means two different nodes point to the same next.
# That creates a cycle — and the duplicate is the cycle entry!

def find_duplicate(nums):
    # Phase 1: find where fast and slow meet (inside the cycle)
    slow = nums[0]          # start: follow first "pointer"
    fast = nums[0]

    while True:
        slow = nums[slow]              # follow one link
        fast = nums[nums[fast]]        # follow two links
        if slow == fast:               # they met inside the cycle
            break

    # Phase 2: find the cycle ENTRY POINT (= the duplicate number)
    # Math fact: dist(head→entry) == dist(meeting_point→entry)
    slow = nums[0]          # reset slow to the very start
    # fast stays at the meeting point

    while slow != fast:
        slow = nums[slow]   # both move one step at a time
        fast = nums[fast]

    return slow   # where they converge = cycle entry = duplicate
    # Walk-through: [1,3,4,2,2]
    # Treat as: 0→1→3→2→4→2 (node i jumps to nums[i])
    # Node 4→2 and 2→4→2 both create edges into node 2 → cycle at 2
    # Time:  O(n), Space: O(1) — no sorting, no extra array`

// ─────────────────────────────────────────────────────────────
//  TAUGHT Q5 — Linked List Cycle II (start of cycle)
// ─────────────────────────────────────────────────────────────

const FSP_Q5_BRUTE = `# Brute force: first repeated node in a set = cycle entry
def detect_cycle_brute(head):
    visited = set()
    current = head

    while current:
        if current in visited:   # visited before → this IS the cycle start
            return current
        visited.add(current)
        current = current.next

    return None   # no cycle found
    # Time:  O(n), Space: O(n)`

const FSP_Q5_OPT = `# Floyd's two-phase: detect cycle, then locate its entry
def detect_cycle(head):
    slow = head
    fast = head
    found_cycle = False

    # Phase 1: detect cycle and find meeting point
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:         # met inside the cycle
            found_cycle = True
            break

    if not found_cycle:
        return None   # no cycle

    # Phase 2: find cycle entry point
    # Reset slow to head. Both pointers now move 1 step at a time.
    # They will meet exactly at the cycle start.
    slow = head
    while slow != fast:
        slow = slow.next   # 1 step
        fast = fast.next   # 1 step

    return slow   # cycle entry node

    # WHY Phase 2 works (the math):
    # Let F = steps from head to cycle entry
    # Let D = steps from cycle entry to meeting point
    # Let C = cycle length
    # When they meet: fast traveled F + D + C (one full loop + D extra)
    # fast = 2 × slow → F+D+C = 2(F+D) → C-D = F
    # So from the meeting point, (C-D) more steps = F steps = cycle entry ✅
    # Time:  O(n), Space: O(1)`

// ─────────────────────────────────────────────────────────────
//  PRACTICE ANSWERS
// ─────────────────────────────────────────────────────────────

const FSP_P1_CODE = `# Palindrome Linked List — find middle, reverse second half, compare
def is_palindrome(head):
    # Step 1: find the middle node using slow/fast pointers
    slow, fast = head, head
    while fast and fast.next:
        slow = slow.next        # slow ends at the middle
        fast = fast.next.next

    # Step 2: reverse the second half of the list in-place
    prev = None
    curr = slow               # start reversal from the middle
    while curr:
        next_node = curr.next  # save next before overwriting
        curr.next = prev       # reverse the pointer
        prev = curr            # advance prev
        curr = next_node       # advance curr
    # prev is now the head of the reversed second half

    # Step 3: compare first half (head) and reversed second half (prev)
    left, right = head, prev
    while right:               # second half may be shorter (odd-length list)
        if left.val != right.val:
            return False       # mismatch → not a palindrome
        left = left.next
        right = right.next

    return True
    # Time: O(n), Space: O(1) — no stack or extra array`

const FSP_P2_CODE = `# Reorder List: L0→L1→...→Ln  becomes  L0→Ln→L1→Ln-1→...
def reorder_list(head):
    if not head:
        return

    # Step 1: find the middle
    slow, fast = head, head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next

    # Step 2: reverse the second half
    prev = None
    curr = slow.next      # second half starts after the middle
    slow.next = None      # cut the list in half (important!)
    while curr:
        tmp = curr.next
        curr.next = prev
        prev = curr
        curr = tmp
    # prev = head of reversed second half

    # Step 3: interleave first half and reversed second half
    first, second = head, prev
    while second:
        tmp1, tmp2 = first.next, second.next
        first.next = second   # insert from second into first
        second.next = tmp1    # link second node back to first half
        first = tmp1          # advance first
        second = tmp2         # advance second
    # Time: O(n), Space: O(1)`

const FSP_P3_CODE = `# Find All Duplicates: use sign of nums[index] as a visited marker
def find_duplicates(nums):
    result = []

    for num in nums:
        index = abs(num) - 1          # map value → 0-based index

        if nums[index] < 0:           # index already marked → value seen before
            result.append(abs(num))   # this value appears twice
        else:
            nums[index] = -nums[index]   # mark index as "visited" (negate value)

    return result
    # Why it works: value k "lives at" index k-1.
    # First visit to k: negate nums[k-1].
    # Second visit to k: nums[k-1] is already negative → duplicate!
    # Walk-through: [4,3,2,7,8,2,3,1]
    # num=4: negate nums[3]=7  → ...,-7,...
    # num=3: negate nums[2]=2  → ...,-2,-7,...
    # num=2: negate nums[1]=3  → ...,-3,-2,-7,...
    # num=7: negate nums[6]=3  → ...,-3,...
    # num=2: nums[1]=-3 < 0 → result=[2]
    # num=3: nums[2]=-2 < 0 → result=[2,3] ✅
    # Time: O(n), Space: O(1) — result doesn't count as extra`

const FSP_P4_CODE = `# Circular Array Loop: fast/slow with direction constraint
def circular_array_loop(nums):
    n = len(nums)

    def next_idx(i):
        return (i + nums[i]) % n   # circular jump (wrap around)

    for i in range(n):
        slow, fast = i, i

        # direction must stay consistent: all values same sign
        while (nums[slow] * nums[fast] > 0 and
               nums[slow] * nums[next_idx(fast)] > 0):
            slow = next_idx(slow)
            fast = next_idx(next_idx(fast))

            if slow == fast:                   # cycle detected!
                if slow == next_idx(slow):     # single-element self-loop → invalid
                    break
                return True

    return False
    # Time: O(n²) — for each starting point, we run fast/slow
    # Space: O(1)`

const FSP_P5_CODE = `# Smallest Missing Positive: cyclic sort, then find first mismatch
def first_missing_positive(nums):
    n = len(nums)

    # cyclic sort: place value k at index k-1
    i = 0
    while i < n:
        correct = nums[i] - 1   # where does nums[i] belong?
        # only move values in the valid range [1..n]
        # and skip if already in correct place (avoids infinite loop)
        if 1 <= nums[i] <= n and nums[correct] != nums[i]:
            nums[i], nums[correct] = nums[correct], nums[i]  # swap
        else:
            i += 1   # already correct or out of range

    # find the first index where the value is wrong
    for i in range(n):
        if nums[i] != i + 1:   # position i should hold value i+1
            return i + 1       # i+1 is the smallest missing positive

    return n + 1   # all 1..n present → answer is n+1
    # Example: [3,4,-1,1] → after cyclic sort: [1,-1,3,4]
    # index 0: nums[0]=1=0+1 ✅
    # index 1: nums[1]=-1 ≠ 2 → return 2 ✅
    # Time: O(n), Space: O(1) — in-place sort`

// ─────────────────────────────────────────────────────────────
//  MAIN EXPORT
// ─────────────────────────────────────────────────────────────

export default function FastSlowPointersContent() {
  return (
    <div className="found-content">

      {/* ══════════════════════════════════════════ */}
      {/*  PATTERN INTRO                            */}
      {/* ══════════════════════════════════════════ */}
      <Sub num="★" title="What is Fast &amp; Slow Pointers?">
        <p className="found-p">
          Fast &amp; Slow Pointers — also called Floyd&apos;s Tortoise and Hare — is a trick
          where you send two pointers through a linked list (or array) at different
          speeds. The slow pointer moves one step at a time, the fast pointer moves two.
          If there&apos;s a loop somewhere, the fast pointer will eventually lap the slow one
          and they&apos;ll be at the same node. If there&apos;s no loop, fast just falls off the end.
        </p>
        <p className="found-p">
          The magic is that you get cycle detection — something that would normally
          require O(n) extra memory (a visited-set) — for <strong>completely free</strong>,
          using only two pointer variables. No extra memory at all.
        </p>

        <Callout type="analogy">
          <strong>Two runners on a circular track.</strong> If the track loops (cycle),
          the faster runner will eventually lap the slower one — they&apos;ll meet again
          somewhere on the track. If the track is a straight road (no cycle), the faster
          runner just finishes first and they never meet again. You can tell whether a
          track is circular just by watching whether the runners ever overlap.
        </Callout>

        <Callout type="tip" icon="🎯" label="When to use Fast &amp; Slow Pointers">
          <ul style={{ margin: '8px 0 0 16px', lineHeight: 2.2 }}>
            <li>&quot;<strong>linked list cycle</strong>&quot; or &quot;detect loop&quot;</li>
            <li>&quot;<strong>find the middle</strong> of a linked list&quot;</li>
            <li>&quot;<strong>palindrome linked list</strong>&quot; (find middle, reverse, compare)</li>
            <li>&quot;<strong>find duplicate</strong> without extra space&quot; (array as linked list)</li>
            <li>Any problem where the sequence might loop back on itself</li>
          </ul>
        </Callout>

        <p className="found-p">
          Here&apos;s the algorithm traced step-by-step on a list with a cycle:
        </p>
        <CodeBlock code={FSP_VISUAL} lang="python" />
      </Sub>

      {/* ══════════════════════════════════════════ */}
      {/*  TAUGHT QUESTIONS                         */}
      {/* ══════════════════════════════════════════ */}
      <Sub num="①" title="Taught Questions — Learn by Example">

        <QuestionCard
          title="Q1 · Linked List Cycle Detection"
          difficulty="Easy"
          bruteComplexity="O(n)"
          optComplexity="O(n)"
          optSpaceComplexity="O(1)"
          problem={<>
            Given the head of a linked list, determine if the list has a <strong>cycle</strong> in it (some node&apos;s <code style={{fontFamily:'monospace',color:'var(--code-blue)'}}>next</code> pointer points back to a previous node). Return <strong>True</strong> if there&apos;s a cycle, <strong>False</strong> otherwise.<br /><br />
            <strong>Examples:</strong><br />
            1→2→3→4→2 (cycle back to 2) → <span style={{color:'var(--green)'}}>True</span><br />
            1→2→3→4→None → <span style={{color:'var(--red)'}}>False</span><br /><br />
            <strong>Note:</strong> Both brute and optimized are O(n) time. The difference is space: O(n) for the set vs O(1) for fast/slow.
          </>}
          hint="Fast moves 2 steps, slow moves 1. If they ever point to the same node, there's a cycle. If fast reaches None, there's no cycle."
          answer="The aha moment: in a cycle, fast gains 1 step on slow per iteration. The gap between them shrinks by 1 each step — it MUST eventually hit zero. When it does, they're at the same node. O(1) space, no set needed."
          bruteCode={FSP_Q1_BRUTE}
          optCode={FSP_Q1_OPT}
          lang="python"
        />

        <QuestionCard
          title="Q2 · Find the Middle of a Linked List"
          difficulty="Easy"
          bruteComplexity="O(n)"
          optComplexity="O(n)"
          optSpaceComplexity="O(1)"
          problem={<>
            Given the head of a singly linked list, return the <strong>middle node</strong>. If there are two middle nodes (even length), return the <strong>second</strong> middle.<br /><br />
            <strong>Examples:</strong><br />
            1→2→3→4→5 → <span style={{color:'var(--green)'}}>node 3</span><br />
            1→2→3→4→5→6 → <span style={{color:'var(--green)'}}>node 4</span> (second of the two middles)<br /><br />
            <strong>Challenge:</strong> Can you do it in a single pass? The brute force needs two passes (count, then walk to count//2).
          </>}
          hint="When fast reaches the end, slow has moved half as far. For even-length: fast.next becomes None and slow lands on the second middle — that's exactly what we want."
          answer="Fast moves 2x as fast as slow. When fast covers n steps, slow covers n/2 steps = the middle. One pass through the list, no counting. For even-length lists, slow naturally lands on the second middle."
          bruteCode={FSP_Q2_BRUTE}
          optCode={FSP_Q2_OPT}
          lang="python"
        />

        <QuestionCard
          title="Q3 · Happy Number"
          difficulty="Easy"
          bruteComplexity="O(log n)"
          optComplexity="O(log n)"
          optSpaceComplexity="O(1)"
          problem={<>
            A <strong>happy number</strong> is defined by this process: replace n with the sum of squares of its digits, repeat. If n eventually reaches 1, it&apos;s happy. If it loops forever without reaching 1, it&apos;s not.<br /><br />
            <strong>Example:</strong><br />
            19 → 1²+9²=82 → 8²+2²=68 → 6²+8²=100 → 1²+0+0=1 ✅ → <span style={{color:'var(--green)'}}>True</span><br />
            2 → 4 → 16 → 37 → 58 → 89 → 145 → 42 → 20 → 4 (cycle!) → <span style={{color:'var(--red)'}}>False</span><br /><br />
            <strong>Key insight:</strong> unhappy numbers always fall into the cycle starting at 4. The number sequence is effectively a linked list that can loop.
          </>}
          hint="Treat the sequence as a linked list: n → get_next(n) → get_next(get_next(n)) → ... Use fast/slow on this 'list'. If fast reaches 1, happy. If fast meets slow (before reaching 1), cycle detected — unhappy."
          answer="The number sequence either terminates at 1 or enters a cycle. Floyd's fast/slow detects cycles in O(1) space — no set needed. If fast == 1 → happy. If fast == slow (and not 1) → stuck in a cycle → unhappy."
          bruteCode={FSP_Q3_BRUTE}
          optCode={FSP_Q3_OPT}
          lang="python"
        />

        <QuestionCard
          title="Q4 · Find the Duplicate Number"
          difficulty="Medium"
          bruteComplexity="O(n)"
          optComplexity="O(n)"
          optSpaceComplexity="O(1)"
          problem={<>
            Given an array of n+1 integers where each integer is in the range <strong>[1, n]</strong>, find the <strong>one duplicate number</strong>. You must solve it without modifying the array and using only O(1) extra space.<br /><br />
            <strong>Examples:</strong><br />
            [1,3,4,2,2] → <span style={{color:'var(--green)'}}>2</span><br />
            [3,1,3,4,2] → <span style={{color:'var(--green)'}}>3</span><br /><br />
            <strong>The twist:</strong> every solution using O(n) space (sort, set, etc.) is easy. Can you use Floyd&apos;s to do O(1) space? The constraint &quot;values in [1,n]&quot; is the hint.
          </>}
          hint="Treat the array as a linked list: node i points to node nums[i]. Values in [1,n] means every value is a valid index → every node has a next. A duplicate value = two nodes with the same next = a cycle!"
          answer="Two-phase Floyd's. Phase 1: find where slow and fast meet (inside the cycle). Phase 2: reset slow to nums[0], advance both 1 step at a time. Where they next meet = cycle entry = the duplicate. All in O(n) time, O(1) space."
          bruteCode={FSP_Q4_BRUTE}
          optCode={FSP_Q4_OPT}
          lang="python"
        />

        <QuestionCard
          title="Q5 · Linked List Cycle II — Find Start of Cycle"
          difficulty="Medium"
          bruteComplexity="O(n)"
          optComplexity="O(n)"
          optSpaceComplexity="O(1)"
          problem={<>
            Given the head of a linked list that <strong>may have a cycle</strong>, return the <strong>node where the cycle begins</strong>. If there&apos;s no cycle, return None.<br /><br />
            <strong>Example:</strong><br />
            1→2→3→4→5→3 (cycle starts at node 3) → <span style={{color:'var(--green)'}}>node 3</span><br /><br />
            <strong>Two-phase algorithm:</strong><br />
            Phase 1: detect the cycle and find the meeting point (Q1).<br />
            Phase 2: reset slow to head, keep fast at meeting point. Move both 1 step until they meet. That meeting point is the cycle start.
          </>}
          hint="After Phase 1, don't just return True — keep the meeting point. Then reset slow to head. Advance both 1 step until slow==fast. The math guarantees they meet exactly at the cycle entry."
          answer="Floyd's tells us: distance(head→cycle_entry) equals distance(meeting_point→cycle_entry). So after finding the meeting point, reset one pointer to head, move both at speed 1 — they converge at the cycle entry. Proven by the math in the code comments."
          bruteCode={FSP_Q5_BRUTE}
          optCode={FSP_Q5_OPT}
          lang="python"
        />

      </Sub>

      {/* ══════════════════════════════════════════ */}
      {/*  PRACTICE QUESTIONS                       */}
      {/* ══════════════════════════════════════════ */}
      <Sub num="②" title="Practice Questions — Try These Yourself">

        <Callout type="tip">
          Each of these builds on the core fast/slow idea — finding middles, detecting
          structure, or using index-as-pointer tricks. Attempt first, then reveal.
        </Callout>

        <QuestionCard
          title="P1 · Palindrome Linked List"
          difficulty="Easy"
          bruteComplexity="O(n)"
          optComplexity="O(n)"
          optSpaceComplexity="O(1)"
          problem={<>
            Given the head of a singly linked list, return <strong>true</strong> if it is a palindrome (reads the same forward and backward).<br /><br />
            <strong>Examples:</strong><br />
            1→2→2→1 → <span style={{color:'var(--green)'}}>True</span><br />
            1→2 → <span style={{color:'var(--red)'}}>False</span><br /><br />
            <strong>Challenge:</strong> O(n) time and O(1) space. No copying nodes into an array.
          </>}
          hint="Three steps: (1) find the middle using slow/fast, (2) reverse the second half in-place, (3) compare the first half and the reversed second half node by node."
          answer="Find middle → reverse second half → compare both halves. Three passes over the list, but each is O(n). Total O(n) time, O(1) space. Classic fast/slow + reversal combo."
          answerCode={FSP_P1_CODE}
          bruteCode={`# O(n) time, O(n) space: copy values to a list, check palindrome\ndef is_palindrome_brute(head):\n    vals = []\n    while head:          # collect all values into a list\n        vals.append(head.val)\n        head = head.next\n    return vals == vals[::-1]  # compare to reversed version`}
          optCode={FSP_P1_CODE}
          lang="python"
        />

        <QuestionCard
          title="P2 · Reorder List"
          difficulty="Medium"
          bruteComplexity="O(n)"
          optComplexity="O(n)"
          optSpaceComplexity="O(1)"
          problem={<>
            Given a linked list L0→L1→...→Ln, reorder it in-place to: <strong>L0→Ln→L1→Ln-1→L2→Ln-2→...</strong><br /><br />
            <strong>Example:</strong><br />
            1→2→3→4 → <span style={{color:'var(--green)'}}>1→4→2→3</span><br />
            1→2→3→4→5 → <span style={{color:'var(--green)'}}>1→5→2→4→3</span><br /><br />
            <strong>Key observation:</strong> the pattern is &quot;take from front, take from back, alternate.&quot; To get the back half efficiently: find middle, reverse second half, then interleave.
          </>}
          hint="Three steps: (1) find middle with slow/fast, (2) reverse the second half, (3) merge first half and reversed second half by alternating nodes."
          answer="Same three steps as Palindrome Linked List — but instead of comparing, we interleave. Split at middle, reverse second half, then merge: first→second→first→second... O(n) time, O(1) space."
          answerCode={FSP_P2_CODE}
          bruteCode={`# O(n) time, O(n) space: put nodes in a list, rebuild\ndef reorder_list_brute(head):\n    nodes = []\n    curr = head\n    while curr:        # collect all node objects\n        nodes.append(curr)\n        curr = curr.next\n    l, r = 0, len(nodes) - 1\n    while l < r:       # rebuild connections\n        nodes[l].next = nodes[r]\n        l += 1\n        if l == r: break\n        nodes[r].next = nodes[l]\n        r -= 1\n    nodes[l].next = None`}
          optCode={FSP_P2_CODE}
          lang="python"
        />

        <QuestionCard
          title="P3 · Find All Duplicates in an Array"
          difficulty="Medium"
          bruteComplexity="O(n)"
          optComplexity="O(n)"
          optSpaceComplexity="O(1)"
          problem={<>
            Given an array of n integers where each value is in <strong>[1, n]</strong>, some elements appear <strong>twice</strong> and some once. Find all elements that appear twice.<br /><br />
            <strong>Example:</strong><br />
            [4,3,2,7,8,2,3,1] → <span style={{color:'var(--green)'}}>[2, 3]</span><br /><br />
            <strong>Constraint:</strong> O(n) time, O(1) extra space — no set, no sorting.
          </>}
          hint="The constraint 'values in [1,n]' means every value is a valid index. Use the SIGN of nums[abs(num)-1] as a visited flag: negate on first visit, detect the negative on second visit."
          answer="For each number n, look at nums[n-1]. Negate it to mark 'visited'. If it's already negative, n appeared before → it's a duplicate. Uses sign bits as a free hash map. O(n) time, O(1) space."
          answerCode={FSP_P3_CODE}
          bruteCode={`# O(n) time, O(n) space: use a set\ndef find_duplicates_brute(nums):\n    seen = set()\n    result = []\n    for num in nums:\n        if num in seen:\n            result.append(num)  # seen before → duplicate\n        seen.add(num)\n    return result`}
          optCode={FSP_P3_CODE}
          lang="python"
        />

        <QuestionCard
          title="P4 · Circular Array Loop"
          difficulty="Medium"
          bruteComplexity="O(n²)"
          optComplexity="O(n²)"
          optSpaceComplexity="O(1)"
          problem={<>
            Given a circular array <code style={{fontFamily:'monospace',color:'var(--code-blue)'}}>nums</code> of non-zero integers (value = jump amount), detect if there is a cycle. A cycle must: (1) have &gt;1 element, (2) all elements in the cycle move in the same direction (all positive or all negative jumps).<br /><br />
            <strong>Examples:</strong><br />
            [2,-1,1,2,2] → <span style={{color:'var(--green)'}}>True</span> (cycle: 0→2→3→0)<br />
            [-1,2] → <span style={{color:'var(--red)'}}>False</span> (direction changes)
          </>}
          hint="Apply fast/slow from each starting index. Enforce direction consistency: all values in the cycle path must share the same sign. Stop if direction flips or if slow==fast after just 1 step (self-loop)."
          answer="For each start, run fast/slow. Direction consistency check: nums[slow] * nums[next_idx(fast)] must be positive (same sign). If slow==fast, verify it's not a 1-element self-loop. Return True if a valid cycle is found."
          answerCode={FSP_P4_CODE}
          bruteCode={`# O(n²) brute: follow each starting position, track visited path\ndef circular_array_loop_brute(nums):\n    n = len(nums)\n    for i in range(n):\n        seen = set()\n        idx = i\n        direction = nums[i] > 0\n        while True:\n            if nums[idx] > 0 != direction: break  # direction changed\n            if idx in seen:\n                return len(seen) > 1  # cycle found, check length\n            seen.add(idx)\n            idx = (idx + nums[idx]) % n\n    return False`}
          optCode={FSP_P4_CODE}
          lang="python"
        />

        <QuestionCard
          title="P5 · Find the Smallest Missing Positive"
          difficulty="Hard"
          bruteComplexity="O(n log n)"
          optComplexity="O(n)"
          optSpaceComplexity="O(1)"
          problem={<>
            Given an unsorted integer array <code style={{fontFamily:'monospace',color:'var(--code-blue)'}}>nums</code>, return the <strong>smallest missing positive integer</strong>.<br /><br />
            <strong>Examples:</strong><br />
            [1,2,0] → <span style={{color:'var(--green)'}}>3</span><br />
            [3,4,-1,1] → <span style={{color:'var(--green)'}}>2</span><br />
            [7,8,9,11,12] → <span style={{color:'var(--green)'}}>1</span><br /><br />
            <strong>Challenge:</strong> O(n) time, O(1) space. The answer must be in [1, n+1]. So put each number at its &quot;correct&quot; position first.
          </>}
          hint="The answer is always in [1, n+1]. Do a cyclic sort: put number k at index k-1 (only for values in [1,n]). Then scan for the first index where nums[i] != i+1 — that's the missing positive."
          answer="Cyclic sort places each value in its correct slot. One swap per element on average → O(n) total. After sorting, the first position that doesn't have its expected value reveals the answer. O(n) time, O(1) space."
          answerCode={FSP_P5_CODE}
          bruteCode={`# O(n log n): sort then find first gap\ndef first_missing_positive_brute(nums):\n    nums = sorted(set(nums))   # sort and deduplicate\n    missing = 1\n    for num in nums:\n        if num == missing:\n            missing += 1       # this positive is present, check next\n    return missing`}
          optCode={FSP_P5_CODE}
          lang="python"
        />

      </Sub>

    </div>
  )
}
