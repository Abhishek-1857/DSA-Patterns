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

const MS_WHAT_IS = `
MONOTONIC STACK — a stack that stays sorted (either all increasing or all decreasing)

Why? It lets you answer "what is the next greater/smaller element?" in O(1) per element.

DECREASING stack (for Next Greater Element):
  Process [2, 1, 2, 4, 3] left to right:

  push 2  → stack=[2]          nothing popped
  push 1  → stack=[2,1]        1 < 2, no pop needed
  see  2  → 2 > stack top (1): POP 1, answer for 1 is 2
         → 2 = stack top (2): POP 2, answer for first 2 is 2
         → push 2  stack=[2]
  see  4  → 4 > stack top (2): POP 2, answer for second 2 is 4
         → push 4  stack=[4]
  see  3  → 3 < 4, push 3  stack=[4,3]
  End: remaining [4,3] have no greater element to the right → answer = -1

Result: index 0→2, index 1→2, index 2→4, index 3→-1, index 4→-1

KEY INSIGHT: when you pop an element, the thing that caused the pop
             IS the answer for that element.
             "Who kicked me out of the stack? THAT's my next greater element."
`

const MS_TYPES = `
TWO FLAVORS:

DECREASING stack (top is smallest):
  → Use when looking for NEXT GREATER element
  → Pop when current > stack top
  → The popped element's answer = current element

INCREASING stack (top is largest):
  → Use when looking for NEXT SMALLER element
  → Pop when current < stack top
  → Used in "largest rectangle in histogram"

IN BOTH CASES: each element is pushed once and popped once → O(n) total
`

// ── Q1: Next Greater Element ───────────────────────────────────────────────
const q1Brute = `# Brute: for each element, scan right to find next greater — O(n^2)
def next_greater_element_brute(nums1, nums2):
    result = []
    for n in nums1:
        idx = nums2.index(n)          # find n in nums2
        found = -1
        for i in range(idx + 1, len(nums2)):
            if nums2[i] > n:
                found = nums2[i]      # first element to the right that is greater
                break
        result.append(found)
    return result`

const q1Opt = `def next_greater_element(nums1, nums2):
    # build a map: num → its next greater element in nums2
    stack = []                         # decreasing stack
    nge = {}                           # next_greater_element map

    for num in nums2:
        # current num is greater than top of stack → pop and record answer
        while stack and stack[-1] < num:
            smaller = stack.pop()
            nge[smaller] = num         # 'num' is the NGE of 'smaller'
        stack.append(num)

    # remaining elements in stack have no greater element to the right
    for num in stack:
        nge[num] = -1

    return [nge[n] for n in nums1]     # look up each nums1 element in the map`

// ── Q2: Daily Temperatures ─────────────────────────────────────────────────
const q2Brute = `# Brute: for each day, scan forward until finding a warmer day — O(n^2)
def daily_temperatures_brute(temperatures):
    n = len(temperatures)
    result = [0] * n
    for i in range(n):
        for j in range(i + 1, n):
            if temperatures[j] > temperatures[i]:
                result[i] = j - i      # days to wait
                break                  # found the first warmer day, stop
    return result`

const q2Opt = `def daily_temperatures(temperatures):
    n = len(temperatures)
    result = [0] * n
    stack = []                         # stores INDICES (not values) in decreasing order of temperature

    for i, temp in enumerate(temperatures):
        # current temp is warmer than the day at the top of the stack
        while stack and temperatures[stack[-1]] < temp:
            prev_idx = stack.pop()
            result[prev_idx] = i - prev_idx   # days waited = today's index - that day's index
        stack.append(i)                # push today's index

    # days left in stack never got a warmer day → result stays 0 (default)
    return result`

// ── Q3: Largest Rectangle in Histogram ────────────────────────────────────
const q3Brute = `# Brute: for each bar, expand left and right as far as height allows — O(n^2)
def largest_rectangle_brute(heights):
    n = len(heights)
    max_area = 0
    for i in range(n):
        min_height = heights[i]
        for j in range(i, n):
            min_height = min(min_height, heights[j])   # shrink to the shortest bar
            area = min_height * (j - i + 1)
            max_area = max(max_area, area)
    return max_area`

const q3Opt = `def largest_rectangle_in_histogram(heights):
    stack = []                         # increasing stack of indices
    max_area = 0
    heights = heights + [0]            # sentinel: force all bars to be popped at the end

    for i, h in enumerate(heights):
        # current bar is shorter → pop taller bars and compute their max area
        while stack and heights[stack[-1]] > h:
            height = heights[stack.pop()]         # height of the popped bar
            # width: from current position back to the new stack top
            width = i if not stack else i - stack[-1] - 1
            max_area = max(max_area, height * width)
        stack.append(i)

    return max_area`

// ── Q4: Trapping Rain Water ────────────────────────────────────────────────
const q4Brute = `# Brute: for each position, find max height to left and right — O(n^2)
def trap_brute(height):
    n = len(height)
    total = 0
    for i in range(1, n - 1):
        left_max  = max(height[:i+1])    # tallest wall on the left
        right_max = max(height[i:])      # tallest wall on the right
        # water at position i = min of both walls - ground level
        water = min(left_max, right_max) - height[i]
        total += max(0, water)
    return total`

const q4Opt = `def trap(height):
    stack = []                         # decreasing stack of indices
    total = 0

    for i, h in enumerate(height):
        # current bar is taller than stack top → water may be trapped
        while stack and height[stack[-1]] < h:
            bottom = stack.pop()       # the "valley floor" between two walls
            if not stack:
                break                  # no left wall → no water can be trapped
            left_wall  = stack[-1]
            right_wall = i
            # water trapped in this "bucket":
            width  = right_wall - left_wall - 1
            water_height = min(height[left_wall], height[right_wall]) - height[bottom]
            total += width * water_height
        stack.append(i)

    return total`

// ── Q5: Sum of Subarray Minimums ───────────────────────────────────────────
const q5Brute = `# Brute: for every subarray, find the minimum — O(n^3)
def sum_subarray_mins_brute(arr):
    MOD = 10**9 + 7
    total = 0
    n = len(arr)
    for i in range(n):
        for j in range(i, n):
            total += min(arr[i:j+1])   # min of each subarray
    return total % MOD`

const q5Opt = `def sum_subarray_mins(arr):
    MOD = 10**9 + 7
    n = len(arr)
    total = 0
    stack = []                         # monotonic increasing stack of indices

    # For each element arr[i], count subarrays where arr[i] is the minimum.
    # arr[i] is the min of subarrays between its "previous smaller" and "next smaller" neighbors.
    # Use a sentinel 0 at start and end to simplify boundary handling.
    arr = [0] + arr + [0]

    for i in range(len(arr)):
        while stack and arr[stack[-1]] > arr[i]:
            mid = stack.pop()
            left  = stack[-1]          # index of previous smaller element
            right = i                  # index of next smaller element
            # number of subarrays where arr[mid] is the minimum:
            left_count  = mid - left   # subarrays starting after 'left'
            right_count = right - mid  # subarrays ending before 'right'
            total += arr[mid] * left_count * right_count
        stack.append(i)

    return total % MOD`

// ── PRACTICE answers ───────────────────────────────────────────────────────
const pq1Code = `# Next Greater Element II — circular array, use modulo trick
def next_greater_elements_ii(nums):
    n = len(nums)
    result = [-1] * n
    stack = []                         # decreasing stack of indices

    # iterate TWICE to simulate circular behavior
    for i in range(2 * n):
        idx = i % n                    # wrap around with modulo
        while stack and nums[stack[-1]] < nums[idx]:
            popped = stack.pop()
            result[popped] = nums[idx] # current element is NGE for the popped index
        if i < n:
            stack.append(idx)          # only push indices from the first pass
    return result`

const pq2Code = `# Remove K Digits — remove k digits to make smallest possible number
def remove_k_digits(num, k):
    stack = []                         # increasing stack (we want smallest digits first)
    for digit in num:
        # if current digit is smaller than top, pop the top (it makes number larger)
        while k and stack and stack[-1] > digit:
            stack.pop()
            k -= 1                     # used one removal
        stack.append(digit)
    # if we still have removals left, remove from the end (largest digits are at end)
    result = stack[:len(stack)-k]
    # strip leading zeros
    return ''.join(result).lstrip('0') or '0'`

const pq3Code = `# 132 Pattern — find i<j<k with nums[i] < nums[k] < nums[j]
def find132pattern(nums):
    stack = []                         # decreasing stack
    k_val = float('-inf')              # nums[k]: the "3" in 132, tracked as second-largest popped

    # iterate RIGHT TO LEFT
    for num in reversed(nums):
        if num < k_val:
            return True                # found nums[i] < k_val (which is < some earlier nums[j])
        while stack and stack[-1] < num:
            k_val = stack.pop()        # this popped value can be our "2" (nums[k])
        stack.append(num)
    return False`

const pq4Code = `# Maximum Width Ramp — find max j-i where nums[i] <= nums[j]
def max_width_ramp(nums):
    n = len(nums)
    # build a decreasing stack of indices (candidates for i)
    stack = []
    for i in range(n):
        if not stack or nums[stack[-1]] > nums[i]:
            stack.append(i)            # only push if strictly smaller (potential left endpoint)

    # scan from right: find the rightmost j that pairs with each stack element
    max_width = 0
    for j in range(n - 1, -1, -1):
        while stack and nums[stack[-1]] <= nums[j]:
            max_width = max(max_width, j - stack.pop())
        if not stack:
            break                      # all candidates exhausted
    return max_width`

const pq5Code = `# Online Stock Span — count consecutive days with price <= today's price
class StockSpanner:
    def __init__(self):
        # stack of (price, span) — decreasing in price
        self.stack = []

    def next(self, price):
        span = 1                       # today counts as 1
        # absorb all previous days with price <= today
        while self.stack and self.stack[-1][0] <= price:
            _, prev_span = self.stack.pop()
            span += prev_span          # add that day's span (it accumulated previous days too)
        self.stack.append((price, span))
        return span`

export default function MonotonicStackContent() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>

      <Sub title="What is a Monotonic Stack?">
        <p style={{ lineHeight: 1.7 }}>
          A monotonic stack is just a regular stack with one extra rule: before pushing
          a new element, pop everything that violates the sort order. If you want a
          <em>decreasing</em> stack (largest at bottom), pop anything smaller than the
          new element before pushing it. If you want an <em>increasing</em> stack
          (smallest at bottom), pop anything larger.
        </p>
        <p style={{ lineHeight: 1.7, marginTop: 8 }}>
          The genius trick: <strong>the moment you pop an element, you know its answer</strong>.
          Whatever caused the pop is the "next greater" (or "next smaller") element
          for whatever you just popped. This turns O(n²) "scan right for each element"
          into O(n) "process each element at most twice".
        </p>
        <Callout type="tip">
          <strong>Trigger phrases:</strong> "next greater element", "next smaller element",
          "daily temperatures", "largest rectangle", "trapping rain water", "span".
          Anytime you're looking for the nearest element that's bigger or smaller than
          the current one → monotonic stack.
        </Callout>
      </Sub>

      <Sub title="How it works — step by step trace">
        <CodeBlock code={MS_WHAT_IS} lang="text" />
        <CodeBlock code={MS_TYPES} lang="text" />
      </Sub>

      <Sub title="Taught Questions">

        <QuestionCard
          num={1}
          title="Next Greater Element"
          difficulty="Easy"
          problem={`Given nums1 (a subset of nums2), for each element in nums1 find the next greater element in nums2 (first element to its right that is larger). Return -1 if none exists.

Example: nums1=[4,1,2], nums2=[1,3,4,2] → [-1,3,-1]`}
          brute={<>
            <BigOBadge time="O(m·n)" space="O(1)" />
            <CodeBlock code={q1Brute} lang="python" />
          </>}
          optimized={<>
            <BigOBadge time="O(m+n)" space="O(n)" />
            <CodeBlock code={q1Opt} lang="python" />
            <Callout type="tip">
              <strong>Aha moment:</strong> Process nums2 once with a monotonic stack to build
              an NGE map, then look up each nums1 element. The stack stays decreasing: when
              a new element is larger than the top, the top finally has its answer — the new
              element is its NGE. Pop it and record the answer before pushing the new element.
            </Callout>
            <Callout type="danger">
              <strong>Common mistake:</strong> Forgetting to handle elements left in the stack
              after the loop ends. Those elements never found a greater element — map them to -1.
            </Callout>
          </>}
          answer="Decreasing stack over nums2. When current > stack top: pop, record nge[top]=current. After loop, remaining stack elements → nge=-1. Look up each nums1 element."
        />

        <QuestionCard
          num={2}
          title="Daily Temperatures"
          difficulty="Medium"
          problem={`Given an array of daily temperatures, return an array where each element tells how many days you have to wait until a warmer temperature. Return 0 if no warmer day exists.

Example: [73,74,75,71,69,72,76,73] → [1,1,4,2,1,1,0,0]`}
          brute={<>
            <BigOBadge time="O(n²)" space="O(1)" />
            <CodeBlock code={q2Brute} lang="python" />
          </>}
          optimized={<>
            <BigOBadge time="O(n)" space="O(n)" />
            <CodeBlock code={q2Opt} lang="python" />
            <Callout type="tip">
              <strong>Aha moment:</strong> Store <em>indices</em> in the stack, not values.
              When today's temperature is warmer than the temperature at the stack top's index,
              the answer for that day is <code>today_idx - popped_idx</code>.
              The index difference IS the number of days to wait.
            </Callout>
            <Callout type="danger">
              <strong>Common mistake:</strong> Pushing temperatures instead of indices.
              You need indices to compute the distance. Always push indices; access values
              via <code>temperatures[stack[-1]]</code>.
            </Callout>
          </>}
          answer="Decreasing stack of indices. When temperatures[i] > temperatures[stack top]: pop, answer[top] = i - top. Push i. Remaining stack → answer stays 0."
        />

        <QuestionCard
          num={3}
          title="Largest Rectangle in Histogram"
          difficulty="Hard"
          problem={`Given an array of bar heights, find the area of the largest rectangle that fits within the histogram.

Example: heights=[2,1,5,6,2,3] → 10`}
          brute={<>
            <BigOBadge time="O(n²)" space="O(1)" />
            <CodeBlock code={q3Brute} lang="python" />
          </>}
          optimized={<>
            <BigOBadge time="O(n)" space="O(n)" />
            <CodeBlock code={q3Opt} lang="python" />
            <Callout type="tip">
              <strong>Aha moment:</strong> Use an <em>increasing</em> stack (for next smaller
              element). When bar i is shorter than the stack top, the top bar can no longer
              extend rightward — compute its maximum rectangle area. Width extends from the
              new stack top (left boundary) to i (right boundary). Add a sentinel height 0
              at the end to flush everything out of the stack.
            </Callout>
            <Callout type="danger">
              <strong>Common mistake:</strong> Computing width as <code>i - stack[-1]</code>
              after popping. The correct width is <code>i - stack[-1] - 1</code> if the stack
              is non-empty (the new top is the left boundary, exclusive). If the stack is
              empty after popping, width = i (the bar extends all the way to index 0).
            </Callout>
          </>}
          answer="Increasing stack + sentinel 0 at end. When heights[i] less than heights[stack top]: pop, width = i - new_top - 1 (or i if stack empty), area = height * width. Track max."
        />

        <QuestionCard
          num={4}
          title="Trapping Rain Water"
          difficulty="Hard"
          problem={`Given elevation heights, compute how much water can be trapped after raining.

Example: [0,1,0,2,1,0,1,3,2,1,2,1] → 6`}
          brute={<>
            <BigOBadge time="O(n²)" space="O(1)" />
            <CodeBlock code={q4Brute} lang="python" />
          </>}
          optimized={<>
            <BigOBadge time="O(n)" space="O(n)" />
            <CodeBlock code={q4Opt} lang="python" />
            <Callout type="tip">
              <strong>Aha moment:</strong> Think in terms of "buckets". A valley between two
              taller bars traps water. Use a decreasing stack: when the current bar is taller
              than the top, a bucket just got closed on the right. The water in it = width ×
              (min of the two walls - valley floor). The stack gives you the left wall
              automatically as the new top after popping the valley floor.
            </Callout>
            <Callout type="danger">
              <strong>Common mistake:</strong> Popping but then finding the stack is now empty —
              that means there's no left wall, so no water can be trapped for this valley.
              Always check <code>if not stack: break</code> after popping.
            </Callout>
          </>}
          answer="Decreasing stack. When height[i] > height[stack top]: pop the valley floor, compute water = width * (min(left_wall, right_wall) - floor). Add to total."
        />

        <QuestionCard
          num={5}
          title="Sum of Subarray Minimums"
          difficulty="Medium"
          problem={`Given an array, find the sum of minimum values of every subarray. Return result modulo 10^9+7.

Example: arr=[3,1,2,4] → 17  (mins: 3,1,1,1,1,2,1,2,1,4 = 17)`}
          brute={<>
            <BigOBadge time="O(n³)" space="O(1)" />
            <CodeBlock code={q5Brute} lang="python" />
          </>}
          optimized={<>
            <BigOBadge time="O(n)" space="O(n)" />
            <CodeBlock code={q5Opt} lang="python" />
            <Callout type="tip">
              <strong>Aha moment:</strong> Instead of finding the minimum of each subarray,
              ask: "how many subarrays have this element as their minimum?" For element at
              index i, find the "previous smaller" (left) and "next smaller" (right) using a
              monotonic stack. The count of subarrays where it's the min = (i - left) * (right - i).
              Multiply by its value and sum up — that's the total contribution.
            </Callout>
            <Callout type="danger">
              <strong>Common mistake:</strong> Off-by-one with equal elements. If two adjacent
              elements are equal, only one should "claim" the subarrays — use strict comparison
              on one side. Add sentinel 0s at both ends to handle boundaries cleanly.
            </Callout>
          </>}
          answer="For each element: find previous smaller (left) and next smaller (right) using monotonic stack. Contribution = arr[i] * (i-left) * (right-i). Sum all contributions."
        />

      </Sub>

      <Sub title="Practice Questions">
        <Callout type="info">All five are monotonic stack in disguise. Before coding, decide: do I need a decreasing or increasing stack? Am I storing values or indices?</Callout>

        <QuestionCard
          num={6}
          title="Next Greater Element II"
          difficulty="Medium"
          practice
          problem={`Find the next greater element for each element in a CIRCULAR array (after the last element, wrap around to the first).

Example: [1,2,1] → [2,-1,2]`}
          hints={[
            "Simulate circularity by iterating through the array twice (length 2n).",
            "Use modulo to wrap indices: i % n gives the real index.",
            "Only push indices during the first pass (i < n). During the second pass, only pop to resolve answers.",
          ]}
          answer="Decreasing stack. Loop i from 0 to 2n: idx = i%n. Pop while nums[stack top] < nums[idx], record answer. Only push if i < n."
          answerCode={pq1Code}
        />

        <QuestionCard
          num={7}
          title="Remove K Digits"
          difficulty="Medium"
          practice
          problem={`Given a string of digits and integer k, remove k digits to make the smallest possible number. Return the result as a string (no leading zeros).

Example: num="1432219", k=3 → "1219"`}
          hints={[
            "Greedy: to make the number smallest, remove a digit when the next digit is smaller than it.",
            "Maintain an increasing stack. When current digit < stack top AND k > 0: pop the top (remove that digit), decrement k.",
            "After the loop: if k > 0, remove from the end. Strip leading zeros.",
          ]}
          answer="Increasing stack. For each digit: while stack top > current and k > 0: pop (k--). Push current. Trim last k elements. Strip leading zeros."
          answerCode={pq2Code}
        />

        <QuestionCard
          num={8}
          title="132 Pattern"
          difficulty="Medium"
          practice
          problem={`Given an array, return true if there exist indices i < j < k such that nums[i] < nums[k] < nums[j].

Example: [3,1,4,2] → true  (1 < 2 < 4)`}
          hints={[
            "Scan from right to left. Maintain a decreasing stack.",
            "Track k_val = the largest value that has been popped (this is our candidate for nums[k], the '2' in the 132 pattern).",
            "When you see nums[i] < k_val while scanning left, you've found the pattern — nums[i] is the '1'.",
          ]}
          answer="Right-to-left scan. Decreasing stack tracks candidates for nums[j]. k_val = max popped value = candidate for nums[k]. Return True if any nums[i] < k_val."
          answerCode={pq3Code}
        />

        <QuestionCard
          num={9}
          title="Maximum Width Ramp"
          difficulty="Medium"
          practice
          problem={`A ramp in an array is a pair (i, j) with i < j and nums[i] <= nums[j]. Find the maximum j - i.

Example: [6,0,8,2,1,5] → 4  (i=1, j=5, 0<=5)`}
          hints={[
            "Build a decreasing stack of indices from left to right — these are potential left endpoints (smaller nums[i] = better left boundary).",
            "Then scan from RIGHT to LEFT. For each j, pop stack elements where nums[stack top] <= nums[j] — those form valid ramps. Track max j - popped.",
            "Stop scanning when the stack is empty (all candidates exhausted).",
          ]}
          answer="Decreasing stack of indices (left candidates). Right-to-left scan: while stack top is valid (nums[top] <= nums[j]), pop and update max(j - top). Track max width."
          answerCode={pq4Code}
        />

        <QuestionCard
          num={10}
          title="Online Stock Span"
          difficulty="Medium"
          practice
          problem={`Design a StockSpanner class. next(price) returns the span — the number of consecutive days (ending today) where the price was <= today's price.

Example: [100,80,60,70,60,75,85] → [1,1,1,2,1,4,6]`}
          hints={[
            "Each day, you want to know how many consecutive previous days had price <= today.",
            "Maintain a decreasing stack of (price, span) pairs. When today's price >= stack top price: absorb its span into today's span, pop it.",
            "The span you accumulate = all the days that top had already absorbed, plus that day itself.",
          ]}
          answer="Decreasing stack of (price, span). Each next(price): span=1, pop and add spans while stack top price <= price. Push (price, total_span). Return span."
          answerCode={pq5Code}
        />
      </Sub>

    </div>
  )
}
