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

const TP_VISUAL = `# Two Pointers — find a pair summing to target in a SORTED array
# nums = [-2, -1, 0, 3, 5, 7],  target = 4
#
# Start:  [-2, -1,  0,  3,  5,  7]
#           L                   R     sum = -2+7 = 5  > 4  → R moves left
#
# Step 2: [-2, -1,  0,  3,  5,  7]
#           L              R          sum = -2+5 = 3  < 4  → L moves right
#
# Step 3: [-2, -1,  0,  3,  5,  7]
#               L          R          sum = -1+5 = 4  = 4  ✅ found!
#
# Why move R left when sum > target?
#   R points to the LARGEST available number. Moving it left gives us
#   the next-largest, reducing the sum.
# Why move L right when sum < target?
#   L points to the SMALLEST available number. Moving it right gives us
#   the next-smallest, increasing the sum.
# Sorted order guarantees: if no answer exists, L meets R and loop ends.`

// ─────────────────────────────────────────────────────────────
//  TAUGHT Q1 — Two Sum II (Sorted Array)
// ─────────────────────────────────────────────────────────────

const TP_Q1_BRUTE = `# Brute force: check every pair of numbers
def two_sum_brute(numbers, target):
    n = len(numbers)

    for i in range(n):               # pick the first number
        for j in range(i + 1, n):   # pick a second number after it
            if numbers[i] + numbers[j] == target:
                return [i + 1, j + 1]   # return 1-indexed positions

    return []   # problem guarantees exactly one solution exists
    # Time:  O(n²) — nested loops
    # Space: O(1)`

const TP_Q1_OPT = `# Two Pointers: squeeze from both ends toward the middle
def two_sum(numbers, target):
    left = 0                    # pointer at the smallest element
    right = len(numbers) - 1   # pointer at the largest element

    while left < right:
        current_sum = numbers[left] + numbers[right]  # try this pair

        if current_sum == target:
            return [left + 1, right + 1]   # 1-indexed, found it!
        elif current_sum < target:
            left += 1    # sum too small — move left to a bigger number
        else:
            right -= 1   # sum too big  — move right to a smaller number

    return []   # no solution (problem guarantees one exists)
    # WHY O(n): in the worst case, left and right meet after n steps.
    # WHY we never skip the answer: moving L right only increases sum;
    # moving R left only decreases it. So we always converge correctly.
    # Time:  O(n), Space: O(1)`

// ─────────────────────────────────────────────────────────────
//  TAUGHT Q2 — Remove Duplicates from Sorted Array
// ─────────────────────────────────────────────────────────────

const TP_Q2_BRUTE = `# Brute: collect unique values, copy them back — uses extra memory
def remove_duplicates_brute(nums):
    if not nums:
        return 0

    seen = []     # list of unique values we've collected so far
    prev = None   # previous value, to detect duplicates

    for num in nums:
        if num != prev:    # new unique value found
            seen.append(num)
            prev = num

    for i in range(len(seen)):   # write unique values back into nums
        nums[i] = seen[i]

    return len(seen)
    # Time:  O(n), Space: O(n) — the 'seen' list is the overhead`

const TP_Q2_OPT = `# Slow-fast two pointers: write pointer + read pointer — O(1) space
def remove_duplicates(nums):
    if not nums:
        return 0

    slow = 0   # "write pointer": position for the next unique element

    for fast in range(1, len(nums)):   # "read pointer" scans forward
        if nums[fast] != nums[slow]:   # found a new unique value!
            slow += 1                  # advance write position
            nums[slow] = nums[fast]    # write unique value here

    # nums[0 .. slow] now contains all unique elements in order
    return slow + 1   # number of unique elements
    # Walk-through on [1, 1, 2, 3, 3]:
    # fast=1: nums[1]=1 == nums[0]=1  → skip
    # fast=2: nums[2]=2 != nums[0]=1  → slow=1, nums[1]=2
    # fast=3: nums[3]=3 != nums[1]=2  → slow=2, nums[2]=3
    # fast=4: nums[4]=3 == nums[2]=3  → skip
    # return 3, nums = [1, 2, 3, ...] ✅
    # Time:  O(n), Space: O(1) — modifies in-place`

// ─────────────────────────────────────────────────────────────
//  TAUGHT Q3 — Container With Most Water
// ─────────────────────────────────────────────────────────────

const TP_Q3_BRUTE = `# Brute force: try every pair of vertical lines
def max_area_brute(height):
    max_water = 0   # most water any container can hold
    n = len(height)

    for i in range(n):
        for j in range(i + 1, n):
            width = j - i                       # horizontal distance
            h = min(height[i], height[j])       # limited by the shorter line
            water = width * h                   # area = width × height
            max_water = max(max_water, water)   # keep the best

    return max_water
    # Time:  O(n²) — all pairs
    # Space: O(1)`

const TP_Q3_OPT = `# Two Pointers: always move the pointer at the shorter line
def max_area(height):
    left = 0                    # start from the left end
    right = len(height) - 1    # start from the right end
    max_water = 0

    while left < right:
        width = right - left                    # distance between lines
        h = min(height[left], height[right])    # limited by shorter line
        max_water = max(max_water, width * h)   # calculate and track

        # KEY INSIGHT: always move the shorter pointer.
        # Why? Width shrinks by 1 regardless of which we move.
        # The only hope of finding more water is a taller line.
        # The taller line is already the best it can be — keep it.
        # So we move the shorter pointer inward.
        if height[left] < height[right]:
            left += 1    # left is shorter, move it right
        else:
            right -= 1   # right is shorter (or equal), move it left

    return max_water
    # Time:  O(n), Space: O(1)`

// ─────────────────────────────────────────────────────────────
//  TAUGHT Q4 — 3Sum
// ─────────────────────────────────────────────────────────────

const TP_Q4_BRUTE = `# Brute force: try every triplet — O(n³)
def three_sum_brute(nums):
    result = set()   # set prevents duplicate triplets automatically
    n = len(nums)

    for i in range(n):
        for j in range(i + 1, n):
            for k in range(j + 1, n):
                if nums[i] + nums[j] + nums[k] == 0:  # sums to zero?
                    triplet = tuple(sorted([nums[i], nums[j], nums[k]]))
                    result.add(triplet)   # sorted tuple avoids duplicates

    return [list(t) for t in result]
    # Time:  O(n³) — three nested loops
    # Space: O(n)  — result set`

const TP_Q4_OPT = `# Sort the array, then fix one number and two-pointer the rest
def three_sum(nums):
    nums.sort()    # sorting enables two-pointer and duplicate skipping
    result = []

    for i in range(len(nums) - 2):    # fix the first number
        # skip duplicate values for the first number
        if i > 0 and nums[i] == nums[i - 1]:
            continue

        left = i + 1             # second pointer (just after i)
        right = len(nums) - 1   # third pointer (end of array)

        while left < right:
            total = nums[i] + nums[left] + nums[right]

            if total == 0:    # valid triplet!
                result.append([nums[i], nums[left], nums[right]])
                # skip duplicates for left and right
                while left < right and nums[left] == nums[left + 1]:
                    left += 1
                while left < right and nums[right] == nums[right - 1]:
                    right -= 1
                left += 1    # move both inward after recording
                right -= 1
            elif total < 0:
                left += 1    # sum too small — increase it
            else:
                right -= 1   # sum too big  — decrease it

    return result
    # Why sort first? It lets us:
    #   1. Use two pointers (need sorted order)
    #   2. Skip duplicates easily (dupes are adjacent after sorting)
    # Time:  O(n²) — O(n log n) sort + O(n²) nested traversal
    # Space: O(n)  — for the output (in-place pointers are O(1))`

// ─────────────────────────────────────────────────────────────
//  TAUGHT Q5 — Squares of a Sorted Array
// ─────────────────────────────────────────────────────────────

const TP_Q5_BRUTE = `# Brute: square every element, then sort — O(n log n)
def sorted_squares_brute(nums):
    squares = [num * num for num in nums]  # square each element
    squares.sort()                          # sort (negatives are now positive)
    return squares
    # Problem: [-4,-1,0,3,10] → squares [16,1,0,9,100] → sorted [0,1,9,16,100]
    # Sorting fixes the disorder caused by negatives squaring to large positives.
    # Time:  O(n log n), Space: O(n)`

const TP_Q5_OPT = `# Two Pointers: largest squares come from the ends of a sorted array
def sorted_squares(nums):
    n = len(nums)
    result = [0] * n   # pre-allocate result array (fill from the back)
    left = 0            # pointer at the most-negative (smallest) value
    right = n - 1       # pointer at the most-positive (largest) value
    pos = n - 1         # fill result from the last position backward

    while left <= right:
        left_sq  = nums[left]  * nums[left]   # square of leftmost
        right_sq = nums[right] * nums[right]  # square of rightmost

        if left_sq > right_sq:    # left square is the bigger one
            result[pos] = left_sq  # place it at the back of result
            left += 1              # move left pointer inward
        else:                      # right square is bigger (or equal)
            result[pos] = right_sq
            right -= 1             # move right pointer inward

        pos -= 1   # next position to fill (one step toward the front)

    return result
    # WHY fill from back? The largest squares come from the extremes
    # (either the most-negative or most-positive end). Comparing both
    # ends and placing the bigger one last gives us sorted order for free.
    # Time:  O(n), Space: O(n) — output array only`

// ─────────────────────────────────────────────────────────────
//  PRACTICE Q1 — Move Zeroes
// ─────────────────────────────────────────────────────────────

const TP_P1_CODE = `def move_zeroes(nums):
    slow = 0   # "write pointer": position for next non-zero element

    # first pass: compact all non-zeros to the front
    for fast in range(len(nums)):
        if nums[fast] != 0:          # found a non-zero value
            nums[slow] = nums[fast]  # write it at the slow position
            slow += 1                # advance write pointer

    # second pass: fill remaining positions with zeros
    while slow < len(nums):
        nums[slow] = 0   # overwrite leftover values with 0
        slow += 1

    # modifies nums in-place — no return needed
    # Time: O(n), Space: O(1)`

// ─────────────────────────────────────────────────────────────
//  PRACTICE Q2 — Reverse String
// ─────────────────────────────────────────────────────────────

const TP_P2_CODE = `def reverse_string(s):
    left = 0             # pointer at the beginning
    right = len(s) - 1  # pointer at the end

    while left < right:               # keep going until pointers cross
        s[left], s[right] = s[right], s[left]  # swap characters
        left += 1                     # move left inward
        right -= 1                    # move right inward

    # s is modified in-place — no return needed
    # Time: O(n), Space: O(1)`

// ─────────────────────────────────────────────────────────────
//  PRACTICE Q3 — Valid Palindrome
// ─────────────────────────────────────────────────────────────

const TP_P3_CODE = `def is_palindrome(s):
    # clean: keep only alphanumeric characters, all lowercase
    cleaned = [c.lower() for c in s if c.isalnum()]

    left = 0                     # start pointer
    right = len(cleaned) - 1    # end pointer

    while left < right:
        if cleaned[left] != cleaned[right]:   # mismatch!
            return False
        left += 1    # move inward
        right -= 1

    return True   # all characters matched from both ends

    # Example: "A man, a plan, a canal: Panama"
    # cleaned = ['a','m','a','n','a','p','l','a','n','a','c','a','n','a','l','p','a','n','a','m','a']
    # Two pointers → all match → True ✅
    # Time: O(n), Space: O(n) for cleaned list`

// ─────────────────────────────────────────────────────────────
//  PRACTICE Q4 — Trapping Rain Water
// ─────────────────────────────────────────────────────────────

const TP_P4_CODE = `def trap(height):
    if not height:
        return 0

    left = 0                 # left pointer
    right = len(height) - 1 # right pointer
    left_max = 0             # max height seen from the left so far
    right_max = 0            # max height seen from the right so far
    water = 0                # total water trapped

    while left < right:
        if height[left] < height[right]:
            # left side is the bottleneck (shorter side)
            if height[left] >= left_max:
                left_max = height[left]       # new left max — no water trapped here
            else:
                water += left_max - height[left]  # water fills to left_max
            left += 1
        else:
            # right side is the bottleneck (shorter side)
            if height[right] >= right_max:
                right_max = height[right]     # new right max — no water here
            else:
                water += right_max - height[right]  # water fills to right_max
            right -= 1

    return water
    # Key insight: at each position, water level = min(left_max, right_max).
    # Two pointers let us process whichever side is shorter first,
    # guaranteeing we always know the correct max for that side.
    # Time: O(n), Space: O(1)`

// ─────────────────────────────────────────────────────────────
//  PRACTICE Q5 — Boats to Save People
// ─────────────────────────────────────────────────────────────

const TP_P5_CODE = `def num_rescue_boats(people, limit):
    people.sort()            # sort by weight — lightest to heaviest
    left = 0                 # pointer to lightest person
    right = len(people) - 1 # pointer to heaviest person
    boats = 0                # number of boats used

    while left <= right:
        # can the lightest and heaviest share one boat?
        if people[left] + people[right] <= limit:
            left += 1   # lightest person boards (together with heaviest)

        # heaviest person always takes a boat (alone or shared)
        right -= 1      # heaviest boards a boat regardless
        boats += 1      # one more boat dispatched

    return boats
    # GREEDY LOGIC: always try to pair the heaviest with the lightest.
    # If they fit together, great — you saved a boat.
    # If not, heaviest goes alone (no one lighter can help them).
    # Time:  O(n log n) for sort, O(n) for scan → O(n log n) overall
    # Space: O(1)`

// ─────────────────────────────────────────────────────────────
//  MAIN EXPORT
// ─────────────────────────────────────────────────────────────

export default function TwoPointersContent() {
  return (
    <div className="found-content">

      {/* ══════════════════════════════════════════ */}
      {/*  PATTERN INTRO                            */}
      {/* ══════════════════════════════════════════ */}
      <Sub num="★" title="What is Two Pointers?">
        <p className="found-p">
          Two pointers means using two index variables that move through a sorted array
          (or string) simultaneously. Instead of a nested loop that checks every possible
          pair — O(n²) — you use two &quot;fingers&quot; that intelligently converge based on
          whether the current sum is too big, too small, or just right.
        </p>
        <p className="found-p">
          The <strong>critical requirement</strong>: the array must be <strong>sorted</strong>.
          Sorting gives you a guarantee — if the left pointer points to the smallest
          unused value and the right pointer points to the largest, you can decide which
          direction to move with just one comparison. No backtracking, no re-scanning.
        </p>

        <Callout type="analogy">
          <strong>Squeezing a water balloon from both ends.</strong> You start with two
          hands at opposite ends and slowly squeeze inward. If the balloon bulges too
          much on one side (sum too big), ease up on that end (move the right pointer left).
          If it&apos;s too flat (sum too small), push harder from the other side (move the left
          pointer right). You converge on the right pressure from both ends at once —
          no need to try every combination.
        </Callout>

        <Callout type="tip" icon="🎯" label="When to use Two Pointers">
          Look for these patterns:
          <ul style={{ margin: '8px 0 0 16px', lineHeight: 2.2 }}>
            <li>&quot;<strong>sorted array</strong>&quot; + &quot;find pair / triplet that sums to target&quot;</li>
            <li>&quot;<strong>remove duplicates in-place</strong>&quot; or &quot;compact array&quot;</li>
            <li>&quot;<strong>reverse</strong> in-place&quot; or &quot;palindrome check&quot;</li>
            <li>&quot;two indices moving toward each other&quot; (container, trapping water)</li>
          </ul>
        </Callout>

        <Callout type="warning">
          <strong>Two Pointers only works on sorted input</strong> (or problems where
          position relative to the ends is meaningful, like Container With Most Water).
          If the array isn&apos;t sorted, sort it first — and remember to factor in the
          O(n log n) sorting cost when calculating overall complexity.
        </Callout>

        <p className="found-p">
          Here&apos;s Two Pointers traced on the classic Two Sum II problem:
        </p>
        <CodeBlock code={TP_VISUAL} lang="python" />
      </Sub>

      {/* ══════════════════════════════════════════ */}
      {/*  TAUGHT QUESTIONS                         */}
      {/* ══════════════════════════════════════════ */}
      <Sub num="①" title="Taught Questions — Learn by Example">

        <QuestionCard
          title="Q1 · Two Sum II — Input Array Is Sorted"
          difficulty="Easy"
          bruteComplexity="O(n²)"
          optComplexity="O(n)"
          optSpaceComplexity="O(1)"
          problem={<>
            Given a <strong>1-indexed sorted array</strong> <code style={{fontFamily:'monospace',color:'var(--code-blue)'}}>numbers</code> and integer <code style={{fontFamily:'monospace',color:'var(--code-blue)'}}>target</code>, return indices of two numbers that sum to target. Each input has exactly one solution, and you may not use the same element twice.<br /><br />
            <strong>Examples:</strong><br />
            numbers=[2,7,11,15], target=9 → <span style={{color:'var(--green)'}}>[1,2]</span><br />
            numbers=[2,3,4], target=6 → <span style={{color:'var(--green)'}}>[1,3]</span><br /><br />
            <strong>Brute idea:</strong> Try every pair i,j. O(n²).<br />
            <strong>Optimized idea:</strong> One pointer at the start, one at the end. Sorted order means: if sum &gt; target move right left; if sum &lt; target move left right.
          </>}
          hint="L starts at index 0 (smallest), R starts at the last index (largest). When sum < target, you need a bigger number — which pointer do you move? When sum > target, you need a smaller number — which one moves?"
          answer="Since the array is sorted, L+R sum tells us exactly which pointer to move. Too small → move L right (get a bigger left value). Too big → move R left (get a smaller right value). Guaranteed to converge on the answer."
          bruteCode={TP_Q1_BRUTE}
          optCode={TP_Q1_OPT}
          lang="python"
        />

        <QuestionCard
          title="Q2 · Remove Duplicates from Sorted Array"
          difficulty="Easy"
          bruteComplexity="O(n)"
          optComplexity="O(n)"
          optSpaceComplexity="O(1)"
          problem={<>
            Given a <strong>sorted</strong> array <code style={{fontFamily:'monospace',color:'var(--code-blue)'}}>nums</code>, remove duplicates <strong>in-place</strong> so each unique element appears once. Return the count of unique elements. The actual values beyond that count don&apos;t matter.<br /><br />
            <strong>Example:</strong><br />
            nums=[1,1,2,3,3] → return <span style={{color:'var(--green)'}}>3</span>, nums=[1,2,3,...]<br /><br />
            <strong>The challenge:</strong> O(1) extra space — no creating a new array. Both the brute and optimized are O(n) time, but the optimized uses O(1) space vs O(n).
          </>}
          hint="Use a slow and a fast pointer. Fast scans for new unique values. When it finds one (nums[fast] != nums[slow]), slow moves forward one step and takes that value."
          answer="Slow pointer is the 'write head' — it marks the end of the unique portion. Fast pointer scans ahead. When fast finds a value different from slow, slow advances and writes the new unique value. No extra array needed."
          bruteCode={TP_Q2_BRUTE}
          optCode={TP_Q2_OPT}
          lang="python"
        />

        <QuestionCard
          title="Q3 · Container With Most Water"
          difficulty="Medium"
          bruteComplexity="O(n²)"
          optComplexity="O(n)"
          optSpaceComplexity="O(1)"
          problem={<>
            Given array <code style={{fontFamily:'monospace',color:'var(--code-blue)'}}>height</code> representing vertical lines, find two lines that together with the x-axis forms a container with the <strong>most water</strong>.<br /><br />
            <strong>Example:</strong><br />
            height=[1,8,6,2,5,4,8,3,7] → <span style={{color:'var(--green)'}}>49</span><br />
            <em>Lines at index 1 (height 8) and index 8 (height 7): width=7, water=7×7=49</em><br /><br />
            <strong>Key formula:</strong> area = width × min(height[L], height[R])
          </>}
          hint="Start L and R at the ends (max width). Each step, you must reduce width by 1. Your only hope of gaining water is finding a taller line. Which pointer should you move — the taller or the shorter?"
          answer="Always move the shorter pointer. Why? Width decreases by 1 regardless. Moving the taller pointer can only decrease or maintain height — but moving the shorter pointer might find something taller. Greedy and proven correct."
          bruteCode={TP_Q3_BRUTE}
          optCode={TP_Q3_OPT}
          lang="python"
        />

        <QuestionCard
          title="Q4 · 3Sum"
          difficulty="Medium"
          bruteComplexity="O(n³)"
          optComplexity="O(n²)"
          optSpaceComplexity="O(n)"
          problem={<>
            Given array <code style={{fontFamily:'monospace',color:'var(--code-blue)'}}>nums</code>, return all unique triplets <code style={{fontFamily:'monospace',color:'var(--code-blue)'}}>[ nums[i], nums[j], nums[k] ]</code> such that i ≠ j ≠ k and the sum equals zero.<br /><br />
            <strong>Examples:</strong><br />
            nums=[-1,0,1,2,-1,-4] → <span style={{color:'var(--green)'}}>[[-1,-1,2],[-1,0,1]]</span><br />
            nums=[0,1,1] → <span style={{color:'var(--green)'}}>[]</span><br /><br />
            <strong>Hard part:</strong> avoiding duplicate triplets. Sorting first solves this — skip repeated values for the fixed pointer, and skip while L/R point to same value after recording a triplet.
          </>}
          hint="Sort the array first. Fix nums[i] in an outer loop, then run two pointers on the rest of the array. Skip duplicate values for i (check nums[i]==nums[i-1]). Same for L and R after finding a valid triplet."
          answer="Sort + fix one + two-pointer. Sorting enables both the two-pointer logic AND easy duplicate skipping (dupes are adjacent). For each fixed i, L and R converge to find all pairs. Total: O(n²) which beats O(n³) brute."
          bruteCode={TP_Q4_BRUTE}
          optCode={TP_Q4_OPT}
          lang="python"
        />

        <QuestionCard
          title="Q5 · Squares of a Sorted Array"
          difficulty="Easy"
          bruteComplexity="O(n log n)"
          optComplexity="O(n)"
          optSpaceComplexity="O(n)"
          problem={<>
            Given a <strong>sorted</strong> array <code style={{fontFamily:'monospace',color:'var(--code-blue)'}}>nums</code> (may contain negatives), return an array of the <strong>squares of each number, sorted in non-decreasing order</strong>.<br /><br />
            <strong>Examples:</strong><br />
            nums=[-4,-1,0,3,10] → <span style={{color:'var(--green)'}}>[0,1,9,16,100]</span><br />
            nums=[-7,-3,2,3,11] → <span style={{color:'var(--green)'}}>[4,9,9,49,121]</span><br /><br />
            <strong>Why brute fails:</strong> squaring breaks the sorted order (-4 becomes 16, larger than 10 squared = 100? No, but -4² = 16 while -1² = 1). Simply squaring and sorting is O(n log n) — can we do O(n)?
          </>}
          hint="The largest squares come from the two ends of the sorted array (the most negative and the most positive). Start both pointers at the ends, compare squares, and fill result from the back."
          answer="The largest squared value is always at one of the two ends. L points to the most-negative (biggest square on left), R points to most-positive (biggest square on right). Compare, fill result from the back. O(n) time."
          bruteCode={TP_Q5_BRUTE}
          optCode={TP_Q5_OPT}
          lang="python"
        />

      </Sub>

      {/* ══════════════════════════════════════════ */}
      {/*  PRACTICE QUESTIONS                       */}
      {/* ══════════════════════════════════════════ */}
      <Sub num="②" title="Practice Questions — Try These Yourself">

        <Callout type="tip">
          Attempt each problem yourself first. Use the hint only if you&apos;re stuck after
          a few minutes. Click <strong>Reveal Answer</strong> when ready — the countdown
          gives you one final moment to think.
        </Callout>

        <QuestionCard
          title="P1 · Move Zeroes"
          difficulty="Easy"
          bruteComplexity="O(n)"
          optComplexity="O(n)"
          optSpaceComplexity="O(1)"
          problem={<>
            Given array <code style={{fontFamily:'monospace',color:'var(--code-blue)'}}>nums</code>, move all zeros to the end <strong>in-place</strong> while maintaining the relative order of the non-zero elements.<br /><br />
            <strong>Example:</strong><br />
            nums=[0,1,0,3,12] → <span style={{color:'var(--green)'}}>[1,3,12,0,0]</span><br /><br />
            <strong>Constraint:</strong> minimize the total number of operations.
          </>}
          hint="Use a slow pointer as the 'write position' for non-zeros. Fast pointer scans all elements. When fast finds a non-zero, write it at slow and advance slow. After fast is done, fill the rest with zeros."
          answer="Same slow/fast idea as Remove Duplicates. Compact all non-zeros to the front, then fill the tail with zeros. Two separate passes, both O(n). Total: O(n) time, O(1) space."
          answerCode={TP_P1_CODE}
          bruteCode={`# O(n): collect non-zeros, append zeros — uses extra space\ndef brute(nums):\n    non_zeros = [x for x in nums if x != 0]\n    zeros = [0] * (len(nums) - len(non_zeros))\n    result = non_zeros + zeros\n    for i in range(len(nums)):\n        nums[i] = result[i]`}
          optCode={TP_P1_CODE}
          lang="python"
        />

        <QuestionCard
          title="P2 · Reverse String"
          difficulty="Easy"
          bruteComplexity="O(n)"
          optComplexity="O(n)"
          optSpaceComplexity="O(1)"
          problem={<>
            Write a function that reverses a string. The input is given as an array of characters <code style={{fontFamily:'monospace',color:'var(--code-blue)'}}>s</code>. You must do it <strong>in-place with O(1) extra memory</strong>.<br /><br />
            <strong>Example:</strong><br />
            s=[&quot;h&quot;,&quot;e&quot;,&quot;l&quot;,&quot;l&quot;,&quot;o&quot;] → <span style={{color:'var(--green)'}}>[&quot;o&quot;,&quot;l&quot;,&quot;l&quot;,&quot;e&quot;,&quot;h&quot;]</span>
          </>}
          hint="Place L at index 0 and R at the last index. Swap s[L] and s[R], then move both inward. Stop when L meets or crosses R."
          answer="Classic two-pointer reversal. L from the left, R from the right. Swap, move both inward, repeat until they meet. n/2 swaps total. O(n) time, O(1) space."
          answerCode={TP_P2_CODE}
          bruteCode={`# Using Python built-in (doesn't satisfy in-place requirement)\ndef brute(s):\n    s[:] = s[::-1]  # slice reversal creates a copy, then assigns`}
          optCode={TP_P2_CODE}
          lang="python"
        />

        <QuestionCard
          title="P3 · Valid Palindrome"
          difficulty="Easy"
          bruteComplexity="O(n)"
          optComplexity="O(n)"
          optSpaceComplexity="O(1)"
          problem={<>
            Given string <code style={{fontFamily:'monospace',color:'var(--code-blue)'}}>s</code>, return true if it is a palindrome — after converting all uppercase to lowercase and removing all non-alphanumeric characters.<br /><br />
            <strong>Examples:</strong><br />
            &quot;A man, a plan, a canal: Panama&quot; → <span style={{color:'var(--green)'}}>True</span><br />
            &quot;race a car&quot; → <span style={{color:'var(--red)'}}>False</span><br />
            &quot; &quot; → <span style={{color:'var(--green)'}}>True</span> (empty after cleaning = palindrome)
          </>}
          hint="Clean the string first (alphanumeric only, lowercase). Then two pointers: L from start, R from end. Compare characters. If any mismatch → False. If L meets R without mismatch → True."
          answer="Clean then two-pointer compare from both ends. If all characters match from start-to-middle and end-to-middle, it's a palindrome. O(n) time. Space is O(n) for the cleaned list — can be made O(1) with in-place pointer checks."
          answerCode={TP_P3_CODE}
          bruteCode={`# Build cleaned string and compare to its reverse\ndef brute(s):\n    cleaned = ''.join(c.lower() for c in s if c.isalnum())\n    return cleaned == cleaned[::-1]  # O(n) time, O(n) space`}
          optCode={TP_P3_CODE}
          lang="python"
        />

        <QuestionCard
          title="P4 · Trapping Rain Water"
          difficulty="Hard"
          bruteComplexity="O(n²)"
          optComplexity="O(n)"
          optSpaceComplexity="O(1)"
          problem={<>
            Given array <code style={{fontFamily:'monospace',color:'var(--code-blue)'}}>height</code> representing an elevation map, compute how much water it can trap after raining.<br /><br />
            <strong>Example:</strong><br />
            height=[0,1,0,2,1,0,1,3,2,1,2,1] → <span style={{color:'var(--green)'}}>6</span><br />
            <em>Water fills the valleys between the taller bars.</em><br /><br />
            <strong>Key formula:</strong> water at position i = min(max_left, max_right) - height[i]
          </>}
          hint="Water at any position is determined by the shorter of the two surrounding walls: min(left_max, right_max). Two pointers: process whichever side is shorter first — you already know that side's max is the bottleneck."
          answer="If height[left] < height[right], the left side is the bottleneck. Process left: water = left_max - height[left] (or update left_max if higher). Then advance left. Mirror for right side. O(n) time, O(1) space — no precomputed arrays."
          answerCode={TP_P4_CODE}
          bruteCode={`# O(n²): for each position, scan left and right for max heights\ndef brute(height):\n    water = 0\n    for i in range(len(height)):\n        left_max = max(height[:i+1])   # O(n)\n        right_max = max(height[i:])    # O(n)\n        water += min(left_max, right_max) - height[i]\n    return water`}
          optCode={TP_P4_CODE}
          lang="python"
        />

        <QuestionCard
          title="P5 · Boats to Save People"
          difficulty="Medium"
          bruteComplexity="O(n²)"
          optComplexity="O(n log n)"
          optSpaceComplexity="O(1)"
          problem={<>
            Given array <code style={{fontFamily:'monospace',color:'var(--code-blue)'}}>people</code> (weights) and integer <code style={{fontFamily:'monospace',color:'var(--code-blue)'}}>limit</code>, each boat carries at most 2 people with combined weight ≤ limit. Return the <strong>minimum number of boats</strong> needed.<br /><br />
            <strong>Examples:</strong><br />
            people=[1,2], limit=3 → <span style={{color:'var(--green)'}}>1</span><br />
            people=[3,2,2,1], limit=3 → <span style={{color:'var(--green)'}}>3</span><br />
            people=[3,5,3,4], limit=5 → <span style={{color:'var(--green)'}}>4</span>
          </>}
          hint="Sort people by weight. Always try to pair the heaviest person (R) with the lightest (L). If they fit together, both board. If not, the heaviest goes alone. Either way, the heaviest always boards."
          answer="Greedy two-pointer on sorted array. Heaviest always takes a boat. Try pairing with lightest — if they fit, both go (L++). If not, heaviest goes alone. Either way R-- and boats++. Sort first: O(n log n)."
          answerCode={TP_P5_CODE}
          bruteCode={`# O(n²): try pairing every heaviest person with everyone else\ndef brute(people, limit):\n    people.sort()\n    used = [False] * len(people)\n    boats = 0\n    for i in range(len(people)-1, -1, -1):\n        if used[i]: continue\n        used[i] = True\n        boats += 1\n        for j in range(len(people)):\n            if not used[j] and people[j]+people[i] <= limit:\n                used[j] = True\n                break\n    return boats`}
          optCode={TP_P5_CODE}
          lang="python"
        />

      </Sub>

    </div>
  )
}
