// Maps problem title → LeetCode URL
// QuestionCard strips "Q# · " / "P# · " prefixes before lookup
export const LC_LINKS = {
  // Sliding Window
  'Maximum Sum Subarray of Size K':               null,
  'Longest Substring Without Repeating Characters': 'https://leetcode.com/problems/longest-substring-without-repeating-characters/',
  'Minimum Size Subarray Sum':                    'https://leetcode.com/problems/minimum-size-subarray-sum/',
  'Longest Substring with K Distinct Characters': 'https://leetcode.com/problems/longest-substring-with-at-most-k-distinct-characters/',
  'Permutation in String':                        'https://leetcode.com/problems/permutation-in-string/',
  'Maximum Average Subarray I':                   'https://leetcode.com/problems/maximum-average-subarray-i/',
  'Longest Repeating Character Replacement':      'https://leetcode.com/problems/longest-repeating-character-replacement/',
  'Max Consecutive Ones III':                     'https://leetcode.com/problems/max-consecutive-ones-iii/',
  'Minimum Window Substring':                     'https://leetcode.com/problems/minimum-window-substring/',
  'Sliding Window Maximum':                       'https://leetcode.com/problems/sliding-window-maximum/',

  // Two Pointers
  'Two Sum II — Input Array Is Sorted':           'https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/',
  'Remove Duplicates from Sorted Array':          'https://leetcode.com/problems/remove-duplicates-from-sorted-array/',
  'Container With Most Water':                    'https://leetcode.com/problems/container-with-most-water/',
  '3Sum':                                         'https://leetcode.com/problems/3sum/',
  'Squares of a Sorted Array':                    'https://leetcode.com/problems/squares-of-a-sorted-array/',
  'Move Zeroes':                                  'https://leetcode.com/problems/move-zeroes/',
  'Reverse String':                               'https://leetcode.com/problems/reverse-string/',
  'Valid Palindrome':                             'https://leetcode.com/problems/valid-palindrome/',
  'Trapping Rain Water':                          'https://leetcode.com/problems/trapping-rain-water/',
  'Boats to Save People':                         'https://leetcode.com/problems/boats-to-save-people/',

  // Fast & Slow Pointers
  'Linked List Cycle Detection':                  'https://leetcode.com/problems/linked-list-cycle/',
  'Find the Middle of a Linked List':             'https://leetcode.com/problems/middle-of-the-linked-list/',
  'Happy Number':                                 'https://leetcode.com/problems/happy-number/',
  'Find the Duplicate Number':                    'https://leetcode.com/problems/find-the-duplicate-number/',
  'Linked List Cycle II — Find Start of Cycle':  'https://leetcode.com/problems/linked-list-cycle-ii/',
  'Palindrome Linked List':                       'https://leetcode.com/problems/palindrome-linked-list/',
  'Reorder List':                                 'https://leetcode.com/problems/reorder-list/',
  'Find All Duplicates in an Array':              'https://leetcode.com/problems/find-all-duplicates-in-an-array/',
  'Circular Array Loop':                          'https://leetcode.com/problems/circular-array-loop/',

  // Merge Intervals
  'Merge Overlapping Intervals':                  'https://leetcode.com/problems/merge-intervals/',
  'Insert Interval':                              'https://leetcode.com/problems/insert-interval/',
  'Intervals Intersection':                       'https://leetcode.com/problems/interval-list-intersections/',
  'Meeting Rooms II — Minimum Conference Rooms':  'https://leetcode.com/problems/meeting-rooms-ii/',
  'Employee Free Time':                           'https://leetcode.com/problems/employee-free-time/',
  'Meeting Rooms I — Can Attend All Meetings?':   'https://leetcode.com/problems/meeting-rooms/',
  'Minimum Number of Arrows to Burst Balloons':   'https://leetcode.com/problems/minimum-number-of-arrows-to-burst-balloons/',
  'Non-Overlapping Intervals':                    'https://leetcode.com/problems/non-overlapping-intervals/',
  'Car Pooling':                                  'https://leetcode.com/problems/car-pooling/',
  'Partition Labels':                             'https://leetcode.com/problems/partition-labels/',

  // Cyclic Sort
  'Find the Missing Number':                      'https://leetcode.com/problems/missing-number/',
  'Find All Missing Numbers':                     'https://leetcode.com/problems/find-all-numbers-disappeared-in-an-array/',
  'Set Mismatch':                                 'https://leetcode.com/problems/set-mismatch/',
  'First Missing Positive':                       'https://leetcode.com/problems/first-missing-positive/',
  'K Missing Positive Numbers':                   'https://leetcode.com/problems/kth-missing-positive-number/',

  // In-place Reversal
  'Reverse a Linked List':                        'https://leetcode.com/problems/reverse-linked-list/',
  'Rotate a Linked List':                         'https://leetcode.com/problems/rotate-list/',
  'Swap Nodes in Pairs':                          'https://leetcode.com/problems/swap-nodes-in-pairs/',
  'Reverse Nodes in k-Group':                     'https://leetcode.com/problems/reverse-nodes-in-k-group/',
  'Odd Even Linked List':                         'https://leetcode.com/problems/odd-even-linked-list/',
  'Reverse Linked List II':                       'https://leetcode.com/problems/reverse-linked-list-ii/',
  'Split Linked List in Parts':                   'https://leetcode.com/problems/split-linked-list-in-parts/',

  // Tree BFS
  'Binary Tree Level Order Traversal':            'https://leetcode.com/problems/binary-tree-level-order-traversal/',
  'Reverse Level Order Traversal':                'https://leetcode.com/problems/binary-tree-level-order-traversal-ii/',
  'Zigzag Level Order Traversal':                 'https://leetcode.com/problems/binary-tree-zigzag-level-order-traversal/',
  'Level Averages in a Binary Tree':              'https://leetcode.com/problems/average-of-levels-in-binary-tree/',
  'Minimum Depth of Binary Tree':                 'https://leetcode.com/problems/minimum-depth-of-binary-tree/',
  'Maximum Depth of Binary Tree':                 'https://leetcode.com/problems/maximum-depth-of-binary-tree/',
  'Connect Level Order Siblings':                 'https://leetcode.com/problems/populating-next-right-pointers-in-each-node/',
  'Right View of a Binary Tree':                  'https://leetcode.com/problems/binary-tree-right-side-view/',
  'Populating Next Right Pointers':               'https://leetcode.com/problems/populating-next-right-pointers-in-each-node/',

  // Tree DFS
  'Path Sum (does a path exist?)':               'https://leetcode.com/problems/path-sum/',
  'All Paths for a Sum':                          'https://leetcode.com/problems/path-sum-ii/',
  'Sum of Path Numbers':                          'https://leetcode.com/problems/sum-root-to-leaf-numbers/',
  'Diameter of Binary Tree':                      'https://leetcode.com/problems/diameter-of-binary-tree/',
  'Count Paths for a Sum':                        'https://leetcode.com/problems/path-sum-iii/',
  'Flatten Binary Tree to Linked List':           'https://leetcode.com/problems/flatten-binary-tree-to-linked-list/',
  'Path Sum III':                                 'https://leetcode.com/problems/path-sum-iii/',
  'Binary Tree Maximum Path Sum':                 'https://leetcode.com/problems/binary-tree-maximum-path-sum/',

  // Two Heaps
  'Find the Median of a Number Stream':           'https://leetcode.com/problems/find-median-from-data-stream/',
  'Sliding Window Median':                        'https://leetcode.com/problems/sliding-window-median/',
  'Maximize Capital (IPO)':                       'https://leetcode.com/problems/ipo/',
  'Meeting Rooms III':                            'https://leetcode.com/problems/meeting-rooms-iii/',
  'Kth Largest Element in a Stream':              'https://leetcode.com/problems/kth-largest-element-in-a-stream/',
  'Find Median from Data Stream':                 'https://leetcode.com/problems/find-median-from-data-stream/',
  'Task Scheduler':                               'https://leetcode.com/problems/task-scheduler/',
  'Reorganize String':                            'https://leetcode.com/problems/reorganize-string/',
  'K Closest Points to Origin':                   'https://leetcode.com/problems/k-closest-points-to-origin/',

  // Backtracking
  'Permutations':                                 'https://leetcode.com/problems/permutations/',
  'Letter Combinations of a Phone Number':        'https://leetcode.com/problems/letter-combinations-of-a-phone-number/',
  'Generate Parentheses':                         'https://leetcode.com/problems/generate-parentheses/',
  'Combination Sum':                              'https://leetcode.com/problems/combination-sum/',
  'Word Search':                                  'https://leetcode.com/problems/word-search/',
  'N-Queens':                                     'https://leetcode.com/problems/n-queens/',
  'Sudoku Solver':                                'https://leetcode.com/problems/sudoku-solver/',
  'Palindrome Partitioning':                      'https://leetcode.com/problems/palindrome-partitioning/',

  // Binary Search
  'Binary Search (Classic)':                      'https://leetcode.com/problems/binary-search/',
  'Find Smallest Letter Greater Than Target':     'https://leetcode.com/problems/find-smallest-letter-greater-than-target/',
  'Find First and Last Position of Element':      'https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/',
  'Search in Rotated Sorted Array':               'https://leetcode.com/problems/search-in-rotated-sorted-array/',
  'Find Minimum in Rotated Sorted Array':         'https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/',
  'Guess Number Higher or Lower':                 'https://leetcode.com/problems/guess-number-higher-or-lower/',
  'Sqrt(x)':                                      'https://leetcode.com/problems/sqrtx/',
  'Find Peak Element':                            'https://leetcode.com/problems/find-peak-element/',
  'Koko Eating Bananas':                          'https://leetcode.com/problems/koko-eating-bananas/',
  'Find in Mountain Array':                       'https://leetcode.com/problems/find-in-mountain-array/',

  // Top K Elements
  'Kth Largest Element in an Array':              'https://leetcode.com/problems/kth-largest-element-in-an-array/',
  'Top K Frequent Elements':                      'https://leetcode.com/problems/top-k-frequent-elements/',
  'Sort Characters by Frequency':                 'https://leetcode.com/problems/sort-characters-by-frequency/',
  'Kth Smallest Element in a Sorted Matrix':      'https://leetcode.com/problems/kth-smallest-element-in-a-sorted-matrix/',
  'Find K Pairs with Smallest Sums':              'https://leetcode.com/problems/find-k-pairs-with-smallest-sums/',
  'Frequency Sort':                               'https://leetcode.com/problems/sort-characters-by-frequency/',
  'Top K Frequent Words':                         'https://leetcode.com/problems/top-k-frequent-words/',

  // K-way Merge
  'Merge K Sorted Lists':                         'https://leetcode.com/problems/merge-k-sorted-lists/',
  'Smallest Range Covering Elements from K Lists': 'https://leetcode.com/problems/smallest-range-covering-elements-from-k-lists/',
  'Kth Smallest Prime Fraction':                  'https://leetcode.com/problems/k-th-smallest-prime-fraction/',
  'Merge Sorted Array':                           'https://leetcode.com/problems/merge-sorted-array/',

  // Dynamic Programming
  'Fibonacci (top-down vs bottom-up)':            'https://leetcode.com/problems/fibonacci-number/',
  'Coin Change':                                  'https://leetcode.com/problems/coin-change/',
  'House Robber':                                 'https://leetcode.com/problems/house-robber/',
  'Climbing Stairs':                              'https://leetcode.com/problems/climbing-stairs/',
  'Unique Paths':                                 'https://leetcode.com/problems/unique-paths/',
  'Edit Distance':                                'https://leetcode.com/problems/edit-distance/',

  // Graph BFS/DFS
  'Number of Islands':                            'https://leetcode.com/problems/number-of-islands/',
  'Flood Fill':                                   'https://leetcode.com/problems/flood-fill/',
  'Clone Graph':                                  'https://leetcode.com/problems/clone-graph/',
  'Course Schedule (Cycle Detection)':            'https://leetcode.com/problems/course-schedule/',
  'Pacific Atlantic Water Flow':                  'https://leetcode.com/problems/pacific-atlantic-water-flow/',
  'Word Ladder':                                  'https://leetcode.com/problems/word-ladder/',
  'Rotting Oranges':                              'https://leetcode.com/problems/rotting-oranges/',
  'Number of Connected Components':               'https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/',
  'Graph Valid Tree':                             'https://leetcode.com/problems/graph-valid-tree/',
  'Surrounded Regions':                           'https://leetcode.com/problems/surrounded-regions/',

  // Monotonic Stack
  'Next Greater Element':                         'https://leetcode.com/problems/next-greater-element-i/',
  'Daily Temperatures':                           'https://leetcode.com/problems/daily-temperatures/',
  'Largest Rectangle in Histogram':               'https://leetcode.com/problems/largest-rectangle-in-histogram/',
  'Next Greater Element II':                      'https://leetcode.com/problems/next-greater-element-ii/',
  'Remove K Digits':                              'https://leetcode.com/problems/remove-k-digits/',
  'Maximum Width Ramp':                           'https://leetcode.com/problems/maximum-width-ramp/',
  'Online Stock Span':                            'https://leetcode.com/problems/online-stock-span/',
  'Sum of Subarray Minimums':                     'https://leetcode.com/problems/sum-of-subarray-minimums/',
}

// Strip "Q1 · " or "P1 · " prefix before lookup
export function getLcUrl(title) {
  const normalized = title.replace(/^[QP]\d+\s*·\s*/, '').trim()
  return LC_LINKS[normalized] || LC_LINKS[title] || null
}
