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

const MI_VISUAL = `// Merge Overlapping Intervals
// Input: [[1,3],[2,6],[8,10],[15,18]]
//
// Step 1: sort by start time (already sorted here).
//
// Step 2: walk through. Either extend the last merged interval or start new.
//
// Timeline view:
// [1,3]:  |===|
// [2,6]:    |=====|   start(2) ≤ last_end(3)  → OVERLAP → extend to [1,6]
// [8,10]:          |===|   start(8) > last_end(6) → NO OVERLAP → new interval
// [15,18]:                 |====|  start(15) > 10  → NO OVERLAP → new interval
//
// Result: [[1,6],[8,10],[15,18]] ✅
//
// Two intervals [a,b] and [c,d] overlap when: c ≤ b
// (new one starts before the current one ends)
// When they overlap: merged = [min(a,c), max(b,d)]`

// ─────────────────────────────────────────────────────────────
//  TAUGHT Q1 — Merge Overlapping Intervals
// ─────────────────────────────────────────────────────────────

const MI_Q1_BRUTE = `// Brute force: repeatedly scan for overlapping pairs and merge
fn merge_brute(mut intervals: Vec<[i32; 2]>) -> Vec<[i32; 2]> {
    loop {
        let mut changed = false;
        let mut result: Vec<[i32; 2]> = vec![];
        let mut skip = vec![false; intervals.len()];  // track which intervals were absorbed

        for i in 0..intervals.len() {
            if skip[i] { continue; }
            let mut current = intervals[i];  // copy to avoid mutation

            for j in (i + 1)..intervals.len() {
                if skip[j] { continue; }
                // do intervals[i] and intervals[j] overlap?
                if current[0] <= intervals[j][1] && intervals[j][0] <= current[1] {
                    current[0] = current[0].min(intervals[j][0]);  // expand start
                    current[1] = current[1].max(intervals[j][1]);  // expand end
                    skip[j] = true;    // mark j as merged into i
                    changed = true;
                }
            }
            result.push(current);
        }
        intervals = result;
        if !changed { break; }
    }
    intervals
    // Time: O(n²) per pass, multiple passes possible
    // Space: O(n)
}`

const MI_Q1_OPT = `// Optimized: sort by start, then single linear pass
fn merge(mut intervals: Vec<[i32; 2]>) -> Vec<[i32; 2]> {
    if intervals.is_empty() {
        return vec![];
    }

    intervals.sort_by_key(|iv| iv[0]);  // sort by start time

    let mut merged: Vec<[i32; 2]> = vec![intervals[0]];  // start with first interval

    for &interval in &intervals[1..] {  // walk through the rest
        let last = merged.last_mut().unwrap();
        let last_end = last[1];  // end time of last merged interval

        if interval[0] <= last_end {          // current starts before last ends → OVERLAP
            last[1] = last_end.max(interval[1]);  // extend the last interval
        } else {
            merged.push(interval);  // no overlap → start a new interval
        }
    }

    merged
    // Walk-through: [[1,3],[2,6],[8,10],[15,18]]
    // Start: merged=[[1,3]]
    // [2,6]:   2≤3 overlap  → extend → merged=[[1,6]]
    // [8,10]:  8>6 no overlap  → merged=[[1,6],[8,10]]
    // [15,18]: 15>10 no overlap → merged=[[1,6],[8,10],[15,18]] ✅
    // Time:  O(n log n) — dominated by sorting
    // Space: O(n) — result array
}`

// ─────────────────────────────────────────────────────────────
//  TAUGHT Q2 — Insert Interval
// ─────────────────────────────────────────────────────────────

const MI_Q2_BRUTE = `// Brute: add new interval to the list, sort, then merge (standard Q1)
fn insert_brute(mut intervals: Vec<[i32; 2]>, new_interval: [i32; 2]) -> Vec<[i32; 2]> {
    intervals.push(new_interval);              // just toss the new interval in
    intervals.sort_by_key(|iv| iv[0]);        // sort by start

    let mut merged: Vec<[i32; 2]> = vec![intervals[0]];
    for &iv in &intervals[1..] {
        let last = merged.last_mut().unwrap();
        if iv[0] <= last[1] {
            last[1] = last[1].max(iv[1]);  // overlap → extend
        } else {
            merged.push(iv);               // no overlap → new
        }
    }

    merged
    // Time:  O(n log n) — sorting dominates
    // Space: O(n)
}`

const MI_Q2_OPT = `// Optimized: three-phase linear scan (no sorting needed — input is sorted!)
fn insert(intervals: Vec<[i32; 2]>, mut new_interval: [i32; 2]) -> Vec<[i32; 2]> {
    let mut result: Vec<[i32; 2]> = vec![];
    let mut i = 0;
    let n = intervals.len();

    // Phase 1: add all intervals that END before the new interval STARTS
    while i < n && intervals[i][1] < new_interval[0] {
        result.push(intervals[i]);  // this interval is entirely to the left
        i += 1;
    }

    // Phase 2: merge all intervals that OVERLAP with new_interval
    while i < n && intervals[i][0] <= new_interval[1] {
        // current interval overlaps (starts before new_interval ends)
        new_interval[0] = new_interval[0].min(intervals[i][0]);  // expand start
        new_interval[1] = new_interval[1].max(intervals[i][1]);  // expand end
        i += 1;
    }
    result.push(new_interval);  // add the (possibly expanded) merged interval

    // Phase 3: add all intervals that START after the new interval ENDS
    while i < n {
        result.push(intervals[i]);
        i += 1;
    }

    result
    // Key advantage: since input is already sorted, no sorting step needed!
    // Time:  O(n) — single linear scan
    // Space: O(n)
}`

// ─────────────────────────────────────────────────────────────
//  TAUGHT Q3 — Intervals Intersection
// ─────────────────────────────────────────────────────────────

const MI_Q3_BRUTE = `// Brute: check every pair from first_list and second_list
fn interval_intersection_brute(
    first_list: Vec<[i32; 2]>,
    second_list: Vec<[i32; 2]>,
) -> Vec<[i32; 2]> {
    let mut result: Vec<[i32; 2]> = vec![];

    for &a in &first_list {       // every interval in A
        for &b in &second_list {  // every interval in B
            // intersection: [max of starts, min of ends]
            let start = a[0].max(b[0]);
            let end   = a[1].min(b[1]);
            if start <= end {  // valid intersection (not empty)
                result.push([start, end]);
            }
        }
    }

    result
    // Time:  O(m * n) — all pairs
    // Space: O(m + n) — result
}`

const MI_Q3_OPT = `// Optimized: two pointers — one per list, advance the earlier-ending one
fn interval_intersection(
    first_list: Vec<[i32; 2]>,
    second_list: Vec<[i32; 2]>,
) -> Vec<[i32; 2]> {
    let mut result: Vec<[i32; 2]> = vec![];
    let mut i = 0;  // pointer into first_list
    let mut j = 0;  // pointer into second_list

    while i < first_list.len() && j < second_list.len() {
        let a = first_list[i];
        let b = second_list[j];

        // intersection = [max(starts), min(ends)]
        let start = a[0].max(b[0]);  // latest start = intersection start
        let end   = a[1].min(b[1]); // earliest end  = intersection end

        if start <= end {  // non-empty intersection?
            result.push([start, end]);
        }

        // advance the pointer whose interval ends SOONER
        // (the other interval might still intersect the next interval)
        if a[1] < b[1] {
            i += 1;  // A ends first → move A forward
        } else {
            j += 1;  // B ends first (or tie) → move B forward
        }
    }

    result
    // Walk-through: A=[[0,2],[5,10]], B=[[1,5],[8,12]]
    // i=0,j=0: [0,2]∩[1,5]=[1,2] ✅  a[1]=2 < b[1]=5 → i++
    // i=1,j=0: [5,10]∩[1,5]=[5,5] ✅ b[1]=5 < a[1]=10 → j++
    // i=1,j=1: [5,10]∩[8,12]=[8,10] ✅ a[1]=10 < b[1]=12 → i++
    // i=2: done. Result: [[1,2],[5,5],[8,10]] ✅
    // Time:  O(m + n), Space: O(m + n)
}`

// ─────────────────────────────────────────────────────────────
//  TAUGHT Q4 — Meeting Rooms II
// ─────────────────────────────────────────────────────────────

const MI_Q4_BRUTE = `// Brute: simulate assigning meetings to rooms one by one
fn min_meeting_rooms_brute(mut intervals: Vec<[i32; 2]>) -> usize {
    if intervals.is_empty() {
        return 0;
    }

    intervals.sort_by_key(|iv| iv[0]);  // sort by start time

    let mut rooms: Vec<i32> = vec![];  // each entry = end time of that room's current meeting

    for &iv in &intervals {
        let (start, end) = (iv[0], iv[1]);
        // try to find a room that's already free
        let mut found = false;
        for room in rooms.iter_mut() {
            if *room <= start {  // room finished by the time this meeting starts
                *room = end;    // reuse the room for this meeting
                found = true;
                break;
            }
        }
        if !found {
            rooms.push(end);  // no free room available → open a new one
        }
    }

    rooms.len()  // total rooms opened = minimum needed
    // Time:  O(n²) — for each meeting, scan all existing rooms
    // Space: O(n)
}`

const MI_Q4_OPT = `// Optimized: sort starts and ends separately, two pointers
fn min_meeting_rooms(intervals: &[[i32; 2]]) -> i32 {
    if intervals.is_empty() {
        return 0;
    }

    let mut starts: Vec<i32> = intervals.iter().map(|iv| iv[0]).collect();
    let mut ends:   Vec<i32> = intervals.iter().map(|iv| iv[1]).collect();
    starts.sort_unstable();  // all start times sorted
    ends.sort_unstable();    // all end times sorted

    let mut rooms = 0;      // rooms currently in use
    let mut max_rooms = 0;  // peak rooms needed at any moment
    let mut end_ptr = 0;    // pointer into ends — tracks earliest available room

    for &start in &starts {            // process each meeting in order
        if start < ends[end_ptr] {     // new meeting starts before any room frees
            rooms += 1;                // allocate a new room
        } else {
            end_ptr += 1;              // a room freed up (don't increment rooms)
        }
        max_rooms = max_rooms.max(rooms);  // track peak usage
    }

    max_rooms
    // KEY INSIGHT: we don't care WHICH room freed up, just WHETHER one did.
    // ends[end_ptr] = the earliest a room becomes available.
    // If start < that time → no room free → need one more.
    // If start >= that time → one room just freed → reuse it (end_ptr++).
    // Walk-through: [[0,30],[5,10],[15,20]]
    // starts=[0,5,15], ends=[10,20,30], end_ptr=0
    // start=0:  0 < ends[0]=10  → rooms=1, max=1
    // start=5:  5 < ends[0]=10  → rooms=2, max=2
    // start=15: 15 ≥ ends[0]=10 → end_ptr=1, rooms=2, max=2 (reuse!)
    // Answer: 2 ✅
    // Time:  O(n log n), Space: O(n)
}`

// ─────────────────────────────────────────────────────────────
//  TAUGHT Q5 — Employee Free Time
// ─────────────────────────────────────────────────────────────

const MI_Q5_BRUTE = `// Brute: mark every working minute, then find gaps
fn employee_free_time_brute(schedule: Vec<Vec<[i32; 2]>>) -> Vec<[i32; 2]> {
    // flatten all intervals from all employees
    let mut all_ivs: Vec<[i32; 2]> = vec![];
    for employee in &schedule {
        for &interval in employee {  // each interval is [start, end]
            all_ivs.push(interval);
        }
    }

    if all_ivs.is_empty() {
        return vec![];
    }

    // find the time boundaries
    let t_start = all_ivs.iter().map(|iv| iv[0]).min().unwrap();
    let t_end   = all_ivs.iter().map(|iv| iv[1]).max().unwrap();

    // mark every minute that someone is working
    let mut busy = vec![false; (t_end + 1) as usize];
    for &iv in &all_ivs {
        for t in iv[0]..iv[1] {  // mark working minutes
            busy[t as usize] = true;
        }
    }

    // collect consecutive free blocks
    let mut free: Vec<[i32; 2]> = vec![];
    let mut i = t_start;
    while i < t_end {
        if !busy[i as usize] {  // found a free minute
            let mut j = i;
            while j < t_end && !busy[j as usize] {
                j += 1;  // extend the free block
            }
            free.push([i, j]);  // free interval [i, j]
            i = j;
        } else {
            i += 1;
        }
    }

    free
    // Time:  O(T * n) where T = max end time — terrible for large T
    // Space: O(T)
}`

const MI_Q5_OPT = `// Optimized: flatten + sort + merge + find gaps
fn employee_free_time(schedule: Vec<Vec<[i32; 2]>>) -> Vec<[i32; 2]> {
    // Step 1: collect all working intervals from all employees
    let mut all_ivs: Vec<[i32; 2]> = vec![];
    for employee in &schedule {
        for &iv in employee {
            all_ivs.push(iv);  // copy each [start, end]
        }
    }

    // Step 2: sort all intervals by start time
    all_ivs.sort_by_key(|iv| iv[0]);

    // Step 3: merge overlapping working intervals (same as Q1)
    let mut merged: Vec<[i32; 2]> = vec![all_ivs[0]];
    for &iv in &all_ivs[1..] {
        let last = merged.last_mut().unwrap();
        if iv[0] <= last[1] {                  // overlap
            last[1] = last[1].max(iv[1]);      // extend
        } else {
            merged.push(iv);                   // new interval
        }
    }

    // Step 4: find gaps between consecutive merged intervals
    // each gap [merged[i-1][1], merged[i][0]] is a free-time block
    let mut free_time: Vec<[i32; 2]> = vec![];
    for i in 1..merged.len() {
        let gap_start = merged[i - 1][1];  // previous interval's end
        let gap_end   = merged[i][0];      // current interval's start
        free_time.push([gap_start, gap_end]);
    }

    free_time
    // Walk-through: [[[1,3],[6,7]],[[2,4]],[[2,5],[9,12]]]
    // Flatten: [[1,3],[6,7],[2,4],[2,5],[9,12]]
    // Sort:    [[1,3],[2,4],[2,5],[6,7],[9,12]]
    // Merge:   [[1,5],[6,7],[9,12]]
    // Gaps:    [5,6] and [7,9] ✅
    // Time:  O(n log n), Space: O(n)
}`

// ─────────────────────────────────────────────────────────────
//  PRACTICE ANSWERS
// ─────────────────────────────────────────────────────────────

const MI_P1_CODE = `fn can_attend_meetings(mut intervals: Vec<[i32; 2]>) -> bool {
    if intervals.is_empty() {
        return true;
    }

    intervals.sort_by_key(|iv| iv[0]);  // sort by start time

    for i in 1..intervals.len() {
        // does meeting i start before meeting i-1 ends?
        if intervals[i][0] < intervals[i - 1][1] {
            return false;  // conflict! can't attend both
        }
    }

    true  // no conflicts found
    // Time: O(n log n), Space: O(1)
}`

const MI_P2_CODE = `fn find_min_arrow_shots(mut points: Vec<[i32; 2]>) -> i32 {
    if points.is_empty() {
        return 0;
    }

    points.sort_by_key(|p| p[1]);  // sort by END position (right boundary)

    let mut arrows = 1;                   // always need at least one arrow
    let mut arrow_pos = points[0][1];     // shoot at the rightmost edge of first balloon

    for &p in &points[1..] {
        if p[0] > arrow_pos {             // this balloon starts after the current arrow
            arrows += 1;                  // need a new arrow
            arrow_pos = p[1];             // aim at the rightmost edge of this balloon
        }
        // else: current arrow (at arrow_pos) already bursts this balloon
    }

    arrows
    // WHY sort by end? Shooting at the END of a balloon catches all
    // balloons that overlap with it (they all started before its end).
    // Greedy: always shoot at the end of the current unpopped balloon.
    // Time: O(n log n), Space: O(1)
}`

const MI_P3_CODE = `fn erase_overlap_intervals(mut intervals: Vec<[i32; 2]>) -> i32 {
    if intervals.is_empty() {
        return 0;
    }

    intervals.sort_by_key(|iv| iv[1]);  // sort by END time

    let mut count = 0;                         // number of intervals removed
    let mut last_end = intervals[0][1];        // end of the last interval we kept

    for &iv in &intervals[1..] {
        if iv[0] < last_end {           // overlap with last kept interval
            count += 1;                 // remove current (it ends later, since sorted by end)
            // last_end stays: we keep the interval with smaller end (already kept)
        } else {
            last_end = iv[1];           // no overlap → keep this interval
        }
    }

    count
    // GREEDY: always keep the interval with the earliest end time.
    // This leaves maximum room for future intervals.
    // Count of removals = n - count of kept intervals.
    // Time: O(n log n), Space: O(1)
}`

const MI_P4_CODE = `fn car_pooling(trips: Vec<[i32; 3]>, capacity: i32) -> bool {
    // convert each trip into two events:
    // (location, +passengers) when people board at 'from'
    // (location, -passengers) when people leave at 'to'
    let mut events: Vec<(i32, i32)> = vec![];
    for &trip in &trips {
        let (num_passengers, from_loc, to_loc) = (trip[0], trip[1], trip[2]);
        events.push((from_loc,  num_passengers));  // boarding
        events.push((to_loc,   -num_passengers));  // leaving
    }

    events.sort();  // sort by location (dropoffs before pickups at same spot)

    let mut current = 0;  // passengers currently in the car
    for &(_, change) in &events {
        current += change;
        if current > capacity {  // at this location, we're over capacity
            return false;
        }
    }

    true  // never exceeded capacity at any point
    // Time: O(n log n), Space: O(n)
}`

const MI_P5_CODE = `fn partition_labels(s: &str) -> Vec<i32> {
    let s: Vec<char> = s.chars().collect();

    // find the last index (position) where each character appears
    let mut last = std::collections::HashMap::new();
    for (i, &c) in s.iter().enumerate() {
        last.insert(c, i);
    }
    // e.g., for "ababcbacadef": a→8, b→5, c→7, d→9, e→10, f→11

    let mut partitions: Vec<i32> = vec![];  // sizes of each partition
    let mut start = 0usize;  // start index of the current partition
    let mut end = 0usize;    // farthest right we must extend the current partition

    for (i, &c) in s.iter().enumerate() {
        end = end.max(*last.get(&c).unwrap());  // must include the last occurrence of c

        if i == end {  // we've covered all occurrences up to 'end'
            partitions.push((end - start + 1) as i32);  // record this partition's size
            start = i + 1;  // next partition starts right after
        }
    }

    partitions
    // Example: s="ababcbacadefegdehijhklij"
    // 'a' last at 8 → partition must extend to at least 8
    // 'b' last at 5 → already covered, 'c' last at 7 → covered
    // At i=8: i==end → partition size = 8-0+1 = 9
    // Continue from index 9... and so on.
    // Time: O(n), Space: O(1) — 'last' has at most 26 entries
}`

// ─────────────────────────────────────────────────────────────
//  MAIN EXPORT
// ─────────────────────────────────────────────────────────────

export default function MergeIntervalsContent() {
  return (
    <div className="found-content">

      {/* ══════════════════════════════════════════ */}
      {/*  PATTERN INTRO                            */}
      {/* ══════════════════════════════════════════ */}
      <Sub num="★" title="What is Merge Intervals?">
        <p className="found-p">
          An interval is just a range with a start and an end — like a meeting from
          2pm to 4pm. Merge Intervals problems give you a bunch of these ranges and
          ask you to combine the overlapping ones, or find gaps, or figure out how
          many are happening at the same time. The core trick that unlocks all of them
          is one simple move: <strong>sort by start time first</strong>.
        </p>
        <p className="found-p">
          Once sorted, any two intervals that might overlap are <em>adjacent</em> in the
          list. You only ever need to check the current interval against the last merged one.
          That turns a potentially O(n²) &quot;compare everything with everything&quot; problem into
          a clean O(n) linear scan — after a single O(n log n) sort.
        </p>

        <Callout type="analogy">
          <strong>Scheduling your day.</strong> You have these blocks: 9–11am, 10–12pm,
          2–3pm, 2:30–4pm. You can&apos;t look at all possible pairs to find overlaps —
          that&apos;s slow. Instead: sort by start time. Now walk through in order.
          9–11 and 10–12 start close together → they overlap → merge to 9–12.
          Next is 2–3 → doesn&apos;t overlap with 9–12 → new block.
          2:30–4 starts before 3 → overlaps → merge to 2–4.
          Final schedule: 9–12 and 2–4. Done in one pass.
        </Callout>

        <Callout type="tip" icon="🎯" label="When to use Merge Intervals">
          <ul style={{ margin: '8px 0 0 16px', lineHeight: 2.2 }}>
            <li>&quot;<strong>overlapping intervals</strong>&quot; or &quot;merge ranges&quot;</li>
            <li>&quot;<strong>meeting rooms</strong>&quot; or &quot;minimum rooms/resources needed&quot;</li>
            <li>&quot;<strong>schedule conflict</strong>&quot; or &quot;can person attend all meetings&quot;</li>
            <li>&quot;<strong>free time</strong>&quot; or &quot;gaps between intervals&quot;</li>
            <li>&quot;<strong>insert interval</strong>&quot; into a sorted list</li>
          </ul>
        </Callout>

        <Callout type="warning">
          <strong>Sort first — always.</strong> The most common mistake is trying to merge
          without sorting. If the list isn&apos;t sorted by start time, you can&apos;t just compare
          adjacent pairs — an interval far to the right might actually overlap with your
          current one. Sorting makes the adjacent-comparison guarantee hold.
        </Callout>

        <p className="found-p">
          Here&apos;s the merge algorithm traced on a concrete example:
        </p>
        <CodeBlock code={MI_VISUAL} lang="rust" />
      </Sub>

      {/* ══════════════════════════════════════════ */}
      {/*  TAUGHT QUESTIONS                         */}
      {/* ══════════════════════════════════════════ */}
      <Sub num="①" title="Taught Questions — Learn by Example">

        <QuestionCard
          title="Q1 · Merge Overlapping Intervals"
          difficulty="Medium"
          bruteComplexity="O(n²)"
          optComplexity="O(n log n)"
          optSpaceComplexity="O(n)"
          problem={<>
            Given an array of intervals where <code style={{fontFamily:'monospace',color:'var(--code-blue)'}}>intervals[i] = [start, end]</code>, merge all overlapping intervals and return the result.<br /><br />
            <strong>Examples:</strong><br />
            [[1,3],[2,6],[8,10],[15,18]] → <span style={{color:'var(--green)'}}>[[1,6],[8,10],[15,18]]</span><br />
            [[1,4],[4,5]] → <span style={{color:'var(--green)'}}>[[1,5]]</span> (touching at 4 = overlap)<br /><br />
            <strong>When do two intervals overlap?</strong> [a,b] and [c,d] overlap when c ≤ b. Merged result: [min(a,c), max(b,d)].
          </>}
          hint="Sort by start time. Walk through the sorted list. For each interval: if it overlaps with the last merged one (start ≤ last_end), extend the last merged interval. Otherwise, start a new one."
          answer="After sorting, overlapping intervals are adjacent. Walk forward: if current.start ≤ last_merged.end, extend. Otherwise push a new interval. One pass, O(n). Total: O(n log n) for sort + O(n) for scan."
          bruteCode={MI_Q1_BRUTE}
          optCode={MI_Q1_OPT}
          lang="rust"
        />

        <QuestionCard
          title="Q2 · Insert Interval"
          difficulty="Medium"
          bruteComplexity="O(n log n)"
          optComplexity="O(n)"
          optSpaceComplexity="O(n)"
          problem={<>
            Given a list of <strong>non-overlapping sorted intervals</strong> and a <code style={{fontFamily:'monospace',color:'var(--code-blue)'}}>newInterval</code>, insert the new interval and merge if necessary. Return the result in sorted order.<br /><br />
            <strong>Examples:</strong><br />
            intervals=[[1,3],[6,9]], newInterval=[2,5] → <span style={{color:'var(--green)'}}>[[1,5],[6,9]]</span><br />
            intervals=[[1,2],[3,5],[6,7],[8,10],[12,16]], newInterval=[4,8] → <span style={{color:'var(--green)'}}>[[1,2],[3,10],[12,16]]</span><br /><br />
            <strong>Key advantage:</strong> the input is already sorted! No sorting step needed.
          </>}
          hint="Three phases: (1) add all intervals that end before newInterval starts, (2) merge all overlapping intervals into newInterval by expanding its boundaries, (3) add all remaining intervals after."
          answer="Since input is sorted, you can identify three non-overlapping regions in one linear scan: 'before' (no overlap), 'overlapping' (merge into newInterval), 'after' (no overlap). O(n) — no sort needed."
          bruteCode={MI_Q2_BRUTE}
          optCode={MI_Q2_OPT}
          lang="rust"
        />

        <QuestionCard
          title="Q3 · Intervals Intersection"
          difficulty="Medium"
          bruteComplexity="O(m·n)"
          optComplexity="O(m+n)"
          optSpaceComplexity="O(m+n)"
          problem={<>
            Given two lists of sorted non-overlapping intervals <code style={{fontFamily:'monospace',color:'var(--code-blue)'}}>firstList</code> and <code style={{fontFamily:'monospace',color:'var(--code-blue)'}}>secondList</code>, return their <strong>intersection</strong>.<br /><br />
            <strong>Example:</strong><br />
            A=[[0,2],[5,10],[13,23]], B=[[1,5],[8,12],[15,24]]<br />
            → <span style={{color:'var(--green)'}}>[[1,2],[5,5],[8,10],[15,23]]</span><br /><br />
            <strong>Intersection formula:</strong> [a,b] ∩ [c,d] = [max(a,c), min(b,d)] — valid when max(a,c) ≤ min(b,d).
          </>}
          hint="Two pointers — i into A, j into B. Check each pair for intersection. After checking, advance whichever interval ends sooner. It can't intersect the CURRENT other interval anymore, but might intersect the NEXT one."
          answer="The pair (A[i], B[j]) either intersects or doesn't. Either way, advance the pointer whose interval ends sooner — that interval is done forever (all future intervals start after it). O(m+n) total steps."
          bruteCode={MI_Q3_BRUTE}
          optCode={MI_Q3_OPT}
          lang="rust"
        />

        <QuestionCard
          title="Q4 · Meeting Rooms II — Minimum Conference Rooms"
          difficulty="Medium"
          bruteComplexity="O(n²)"
          optComplexity="O(n log n)"
          optSpaceComplexity="O(n)"
          problem={<>
            Given an array of meeting time intervals <code style={{fontFamily:'monospace',color:'var(--code-blue)'}}>[[start, end], ...]</code>, find the <strong>minimum number of conference rooms</strong> required to schedule all meetings without conflicts.<br /><br />
            <strong>Examples:</strong><br />
            [[0,30],[5,10],[15,20]] → <span style={{color:'var(--green)'}}>2</span><br />
            [[7,10],[2,4]] → <span style={{color:'var(--green)'}}>1</span> (no overlap)<br /><br />
            <strong>Intuition:</strong> the answer = maximum number of meetings happening at the same time at any point.
          </>}
          hint="Sort starts and ends separately. Walk through starts one by one. At each new meeting start: if the earliest-ending meeting has already ended (ends[end_ptr] ≤ start), reuse that room (end_ptr++). Otherwise, add a new room."
          answer="We only care WHETHER a room is free, not which one. ends[end_ptr] = earliest time any room becomes free. If new meeting starts after ends[end_ptr] → reuse that room. If not → new room. Track the peak. O(n log n) time."
          bruteCode={MI_Q4_BRUTE}
          optCode={MI_Q4_OPT}
          lang="rust"
        />

        <QuestionCard
          title="Q5 · Employee Free Time"
          difficulty="Hard"
          bruteComplexity="O(T·n)"
          optComplexity="O(n log n)"
          optSpaceComplexity="O(n)"
          problem={<>
            Given a list of employees&apos; working schedules (each employee has a list of non-overlapping intervals sorted by start time), find all intervals of <strong>free time</strong> for all employees combined — times when <em>no one</em> is working.<br /><br />
            <strong>Example:</strong><br />
            schedule = [[[1,3],[6,7]], [[2,4]], [[2,5],[9,12]]]<br />
            → <span style={{color:'var(--green)'}}>[[5,6],[7,9]]</span><br /><br />
            <strong>Insight:</strong> free time = gaps between the merged working intervals of all employees.
          </>}
          hint="Flatten all employees' intervals into one list → sort → merge (same as Q1) → find gaps between consecutive merged intervals. Free time slots are exactly the spaces between merged intervals."
          answer="Employee Free Time = Q1 applied to everyone together. Collect all intervals, sort by start, merge overlaps. The gaps between consecutive merged intervals are the free time windows. The 'hard' part is recognizing that's all it is."
          bruteCode={MI_Q5_BRUTE}
          optCode={MI_Q5_OPT}
          lang="rust"
        />

      </Sub>

      {/* ══════════════════════════════════════════ */}
      {/*  PRACTICE QUESTIONS                       */}
      {/* ══════════════════════════════════════════ */}
      <Sub num="②" title="Practice Questions — Try These Yourself">

        <Callout type="tip">
          All five of these are variations on the same core idea: sort, scan, compare with
          a neighbor or a boundary. The hard part is recognizing <em>which</em> variant
          applies. Attempt first, then reveal the solution.
        </Callout>

        <QuestionCard
          title="P1 · Meeting Rooms I — Can Attend All Meetings?"
          difficulty="Easy"
          bruteComplexity="O(n²)"
          optComplexity="O(n log n)"
          optSpaceComplexity="O(1)"
          problem={<>
            Given an array of meeting time intervals, determine if a person can attend <strong>all meetings</strong> (no two meetings overlap).<br /><br />
            <strong>Examples:</strong><br />
            [[0,30],[5,10],[15,20]] → <span style={{color:'var(--red)'}}>False</span> ([0,30] and [5,10] overlap)<br />
            [[7,10],[2,4]] → <span style={{color:'var(--green)'}}>True</span><br />
            [[13,15],[1,13]] → <span style={{color:'var(--green)'}}>True</span> (touching at 13 is OK if start ≥ end)
          </>}
          hint="Sort by start time. Then just check each consecutive pair: if intervals[i][0] < intervals[i-1][1], there's a conflict. One condition, one loop."
          answer="Sort by start. Walk through: if any meeting starts strictly before the previous one ends → conflict → False. If you finish the loop cleanly → True. O(n log n) time, O(1) space."
          answerCode={MI_P1_CODE}
          bruteCode={`// O(n²): check every pair
fn can_attend_brute(intervals: &[[i32; 2]]) -> bool {
    for i in 0..intervals.len() {
        for j in (i + 1)..intervals.len() {
            let (a, b) = (intervals[i][0], intervals[i][1]);
            let (c, d) = (intervals[j][0], intervals[j][1]);
            if a < d && c < b {  // overlap condition
                return false;
            }
        }
    }
    true
}`}
          optCode={MI_P1_CODE}
          lang="rust"
        />

        <QuestionCard
          title="P2 · Minimum Number of Arrows to Burst Balloons"
          difficulty="Medium"
          bruteComplexity="O(n²)"
          optComplexity="O(n log n)"
          optSpaceComplexity="O(1)"
          problem={<>
            Balloons are fixed on a wall. Each balloon spans <code style={{fontFamily:'monospace',color:'var(--code-blue)'}}>points[i] = [x_start, x_end]</code>. An arrow shot vertically at position x bursts all balloons that span x. Find the <strong>minimum number of arrows</strong> needed to burst all balloons.<br /><br />
            <strong>Examples:</strong><br />
            [[10,16],[2,8],[1,6],[7,12]] → <span style={{color:'var(--green)'}}>2</span><br />
            [[1,2],[3,4],[5,6],[7,8]] → <span style={{color:'var(--green)'}}>4</span> (no overlaps)
          </>}
          hint="Sort by END position. Shoot at the end of the first balloon (catches all overlapping ones). If the next balloon starts after that shot, you need a new arrow. Greedy: one arrow at the rightmost edge of the current group."
          answer="Sort by end. Arrow at points[0][1] bursts all balloons starting ≤ that position. If a balloon starts after the current arrow position, it needs a new arrow (aimed at its end). O(n log n) time, O(1) space."
          answerCode={MI_P2_CODE}
          bruteCode={`// O(n²): try all possible shot positions (conceptual — impractical for large ranges)
fn min_arrows_brute(points: &[[i32; 2]]) -> usize {
    // worst case: one arrow per balloon
    let best = points.len();
    // standard approach is sort + greedy; this is just conceptual
    best
}`}
          optCode={MI_P2_CODE}
          lang="rust"
        />

        <QuestionCard
          title="P3 · Non-Overlapping Intervals"
          difficulty="Medium"
          bruteComplexity="O(n²)"
          optComplexity="O(n log n)"
          optSpaceComplexity="O(1)"
          problem={<>
            Given an array of intervals, find the <strong>minimum number of intervals to remove</strong> to make the rest non-overlapping.<br /><br />
            <strong>Examples:</strong><br />
            [[1,2],[2,3],[3,4],[1,3]] → <span style={{color:'var(--green)'}}>1</span> (remove [1,3])<br />
            [[1,2],[1,2],[1,2]] → <span style={{color:'var(--green)'}}>2</span> (remove two of the three)<br />
            [[1,2],[2,3]] → <span style={{color:'var(--green)'}}>0</span> (no overlap; touching at 2 is fine)
          </>}
          hint="Sort by END time. Greedily keep the interval with the earliest end (it leaves the most room for the next one). When you see an overlap, remove the current interval (it ends later than the one you kept)."
          answer="Sort by end. Keep the interval that ends earliest. When a conflict appears, the one ending later is the one to remove (it's greedily worse). count++ for each removal, last_end unchanged. O(n log n) time, O(1) space."
          answerCode={MI_P3_CODE}
          bruteCode={`// O(n²): try removing each interval, check if rest is valid
fn erase_overlap_brute(intervals: Vec<[i32; 2]>) -> usize {
    let is_valid = |ivs: &[[i32; 2]]| -> bool {
        let mut sorted = ivs.to_vec();
        sorted.sort_by_key(|iv| iv[0]);
        for i in 1..sorted.len() {
            if sorted[i][0] < sorted[i - 1][1] {
                return false;
            }
        }
        true
    };
    for i in 0..intervals.len() {
        let rest: Vec<[i32; 2]> = intervals[..i].iter()
            .chain(intervals[i + 1..].iter())
            .copied()
            .collect();
        if is_valid(&rest) {
            return 1;  // found one removal that works
        }
    }
    0
}`}
          optCode={MI_P3_CODE}
          lang="rust"
        />

        <QuestionCard
          title="P4 · Car Pooling"
          difficulty="Medium"
          bruteComplexity="O(n²)"
          optComplexity="O(n log n)"
          optSpaceComplexity="O(n)"
          problem={<>
            A car with <code style={{fontFamily:'monospace',color:'var(--code-blue)'}}>capacity</code> seats. Given trips <code style={{fontFamily:'monospace',color:'var(--code-blue)'}}>[[numPassengers, from, to], ...]</code>, check if it&apos;s possible to pick up and drop off all passengers without exceeding capacity at any point.<br /><br />
            <strong>Examples:</strong><br />
            trips=[[2,1,5],[3,3,7]], capacity=4 → <span style={{color:'var(--red)'}}>False</span> (2+3=5 &gt; 4 from mile 3–5)<br />
            trips=[[2,1,5],[3,3,7]], capacity=5 → <span style={{color:'var(--green)'}}>True</span>
          </>}
          hint="Convert each trip into two events: (from_location, +passengers) and (to_location, -passengers). Sort by location. Process events in order, tracking running passenger count. If ever > capacity, return False."
          answer="Event-based approach: boarding = +passengers at from_location, alighting = -passengers at to_location. Sort events by location. Running sum of passengers must never exceed capacity. O(n log n) time, O(n) space."
          answerCode={MI_P4_CODE}
          bruteCode={`// O(n²): simulate at each unique location
fn car_pooling_brute(trips: &[[i32; 3]], capacity: i32) -> bool {
    let mut locs: Vec<i32> = trips.iter()
        .flat_map(|t| [t[1], t[2]])
        .collect();
    locs.sort_unstable();
    locs.dedup();
    for loc in locs {
        let passengers: i32 = trips.iter()
            .filter(|t| t[1] <= loc && loc < t[2])
            .map(|t| t[0])
            .sum();
        if passengers > capacity {
            return false;
        }
    }
    true
}`}
          optCode={MI_P4_CODE}
          lang="rust"
        />

        <QuestionCard
          title="P5 · Partition Labels"
          difficulty="Medium"
          bruteComplexity="O(n²)"
          optComplexity="O(n)"
          optSpaceComplexity="O(1)"
          problem={<>
            Given a string <code style={{fontFamily:'monospace',color:'var(--code-blue)'}}>s</code>, partition it into as many parts as possible so that <strong>each letter appears in at most one part</strong>. Return the list of partition sizes.<br /><br />
            <strong>Example:</strong><br />
            s=&quot;ababcbacadefegdehijhklij&quot;<br />
            → <span style={{color:'var(--green)'}}>[ 9, 7, 8 ]</span><br />
            <em>&quot;ababcbaca&quot; + &quot;defegde&quot; + &quot;hijhklij&quot;</em><br /><br />
            <strong>Interval connection:</strong> each character defines an interval from first to last occurrence. A partition boundary appears when we&apos;ve closed all currently-open character intervals.
          </>}
          hint="First pass: find the last occurrence of each character. Second pass: track the farthest right you must go (max of last[c] for all c seen). When current index equals that farthest point, you've found a partition boundary."
          answer="Each character defines an interval [first_occurrence, last_occurrence]. We must include all occurrences of any character we've seen. 'end' tracks the farthest last_occurrence seen so far. When i==end, cut here — no character in this partition appears later. O(n) time."
          answerCode={MI_P5_CODE}
          bruteCode={`// O(n²): try each possible partition point
fn partition_labels_brute(s: &str) -> Vec<i32> {
    let s: Vec<char> = s.chars().collect();
    let mut result = vec![];
    let mut start = 0usize;
    while start < s.len() {
        let mut end = start;
        loop {
            // extend end if any char in s[start..=end] appears after end
            let chars_seen: std::collections::HashSet<char> =
                s[start..=end].iter().copied().collect();
            let new_end = chars_seen.iter()
                .map(|&c| s.iter().rposition(|&x| x == c).unwrap())
                .max()
                .unwrap_or(end);
            if new_end == end {
                result.push((end - start + 1) as i32);
                start = end + 1;
                break;
            }
            end = new_end;
        }
    }
    result
}`}
          optCode={MI_P5_CODE}
          lang="rust"
        />

      </Sub>

    </div>
  )
}
