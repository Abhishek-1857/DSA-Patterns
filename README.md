# DSA Patterns — Interactive Learning Site

A fully interactive DSA study guide covering all 17 core coding interview patterns. Every pattern includes visual walkthroughs, taught questions with brute force + optimized solutions, and practice questions with hint reveals and countdown code answers.

Built with React + Vite. No backend. No accounts. Just open and learn.

---

## What's inside

**17 patterns, 170 problems**

| # | Pattern | What you learn |
|---|---------|----------------|
| 1 | Foundations | Arrays, Big O, pointers, mental models |
| 2 | Sliding Window | Fixed and variable window on arrays/strings |
| 3 | Two Pointers | Converging pointers on sorted arrays |
| 4 | Fast & Slow Pointers | Floyd's cycle detection (tortoise & hare) |
| 5 | Merge Intervals | Sort + scan for overlapping intervals |
| 6 | Cyclic Sort | Place numbers in their correct index in O(n) |
| 7 | In-place Reversal | Reverse linked list segments without extra memory |
| 8 | Tree BFS | Level-order traversal with a queue |
| 9 | Tree DFS | Path sums, diameter, all paths with recursion |
| 10 | Two Heaps | Streaming median, scheduling with min+max heaps |
| 11 | Backtracking | Subsets, permutations, N-Queens, Sudoku |
| 12 | Binary Search | Classic + rotated arrays + search on answer space |
| 13 | Top K Elements | Min-heap of size k, frequency sorting |
| 14 | K-way Merge | Merge sorted lists/arrays with a heap frontier |
| 15 | Dynamic Programming | Memoization, tabulation, table-filling visuals |
| 16 | Graph BFS/DFS | Islands, cycle detection, clone graph, water flow |
| 17 | Monotonic Stack | Next greater element, histogram, rain water |

Each pattern includes:
- **Concept explanation** with real-world analogies
- **ASCII visualizations** of how the algorithm works step by step
- **5 taught questions** — brute force + optimized solution, every line commented, aha moment, common mistake
- **5 practice questions** — hint system + 3-second countdown answer reveal with full commented code
- **Big O badges** for every solution

---

## Tech stack

- [React 19](https://react.dev) + [Vite 8](https://vitejs.dev)
- Zero external UI libraries — all components handbuilt
- Custom regex-based syntax highlighter for Python code blocks (no dependencies)
- CSS custom properties for the dark theme
- IntersectionObserver for active sidebar tracking

---

## Getting started

**Prerequisites:** Node.js 18+

```bash
# clone the repo
git clone https://github.com/your-username/dsa-website.git
cd dsa-website/dsa-app

# install dependencies
npm install

# start dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

```bash
# production build
npm run build

# preview production build locally
npm run preview
```

---

## Project structure

```
dsa-website/
└── dsa-app/
    ├── src/
    │   ├── App.jsx                    # root — wires all sections together
    │   ├── App.css                    # global dark theme + layout
    │   ├── data/
    │   │   └── sections.js            # section metadata (ids, titles, triggers)
    │   └── components/
    │       ├── Sidebar.jsx            # fixed left nav with progress checkboxes
    │       ├── SectionCard.jsx        # collapsible section wrapper
    │       ├── QuestionCard.jsx       # 3-tab card (Problem / Brute / Optimized)
    │       ├── CodeBlock.jsx          # syntax-highlighted code viewer
    │       ├── HintButton.jsx         # toggle hint reveal
    │       ├── AnswerButton.jsx       # 3-2-1 countdown then reveal answer + code
    │       ├── BigOBadge.jsx          # time/space complexity badge
    │       ├── CompletionSection.jsx  # progress tracker at the bottom
    │       ├── FoundationsContent.jsx
    │       ├── SlidingWindowContent.jsx
    │       ├── TwoPointersContent.jsx
    │       ├── FastSlowPointersContent.jsx
    │       ├── MergeIntervalsContent.jsx
    │       ├── CyclicSortContent.jsx
    │       ├── InPlaceReversalContent.jsx
    │       ├── TreeBFSContent.jsx
    │       ├── TreeDFSContent.jsx
    │       ├── TwoHeapsContent.jsx
    │       ├── BacktrackingContent.jsx
    │       ├── BinarySearchContent.jsx
    │       ├── TopKElementsContent.jsx
    │       ├── KWayMergeContent.jsx
    │       ├── DynamicProgrammingContent.jsx
    │       ├── GraphBFSDFSContent.jsx
    │       └── MonotonicStackContent.jsx
    ├── package.json
    └── vite.config.js
```

---

## License

MIT
