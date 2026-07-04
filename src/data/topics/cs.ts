import type { TopicDraft } from "../types";
import { R } from "../resourceCatalog";

export const csTopics: TopicDraft[] = [
  {
    id: "cs-data-representation",
    title: "Data Representation: Text, Numbers & Bytes",
    branch: "cs",
    stage: 1,
    required: true,
    difficulty: "foundation",
    estimatedHours: 8,
    summary:
      "Everything is bytes; meaning is interpretation. Beyond C's integers: text encodings (ASCII, UTF-8, and mojibake), floating point and why 0.1 + 0.2 misbehaves, colors as packed bytes, Boolean algebra as the layer beneath if-statements, and hex fluency as the lingua franca of low-level work.",
    whyItMatters:
      "Encoding bugs (garbled text, corrupted files, wrong-looking floats) waste enormous engineering time precisely because most developers never learned that bytes have no inherent meaning. This literacy underlies file formats, networking, cryptography, and every 'weird character' bug you'll ever fix.",
    prerequisiteIds: ["c-integers-bits"],
    concepts: [
      "Interpretation: the same 4 bytes as int, float, chars, or a color",
      "ASCII, Latin-1, and UTF-8: variable-length encoding and why it won",
      "Code points vs. bytes vs. glyphs; where 'string length' gets slippery",
      "IEEE-754 floating point: sign/exponent/mantissa, precision loss, and never using == on floats",
      "Boolean algebra: AND/OR/NOT laws, De Morgan, truth tables, and simplifying conditions",
      "Endianness revisited across formats and networks",
    ],
    practicalUses: [
      "Fixing mojibake: diagnosing double-encoded or mis-decoded text",
      "Knowing when float is fine (graphics) and criminal (money)",
      "Simplifying a gnarly if-condition with De Morgan instead of guessing",
    ],
    lab: {
      title: "The Interpretation Machine",
      scenario:
        "Extend your binary file inspector into an interpretation tool: for any offset in any file, display the bytes as every plausible meaning — integers of each width and endianness, float, UTF-8 decoded text, and RGB color — then use it to explore real files and explain three famous byte-level phenomena.",
      outcome:
        "You can look at raw bytes and read meaning into them deliberately, decode UTF-8 by hand, and explain floating-point surprises from the bit level up.",
      requirements: [
        "interpret <file> <offset>: print the next bytes as u8/u16/u32 (both endiannesses), i32, f32, UTF-8 text run, and #RRGGBB",
        "A hand-written UTF-8 decoder: byte patterns → code points, with clean errors on invalid sequences (no library decoding)",
        "Float explorer: for inputs like 0.1, 0.5, 16777217.0, print the exact bit fields and explain which are exact and why",
        "Demonstrate and document three phenomena: 0.1+0.2 != 0.3; a text file readable as Latin-1 but broken as UTF-8; the same u16 differing across endianness in a real format",
        "Boolean workout: take five convoluted conditions from your past code, build truth tables, and simplify each with algebra — verify by exhaustive testing",
      ],
      checkpoints: [
        "Your UTF-8 decoder handles 1–4 byte sequences and rejects overlong encodings",
        "You can state why 16777217 is the first integer f32 cannot represent",
        "Each simplified condition proven equivalent by brute-force over inputs",
      ],
      hints: [
        "UTF-8's design: leading byte's high bits announce sequence length; continuation bytes all start 10. Decode with masks and shifts you already own.",
        "f32 has 23 mantissa bits + 1 implicit — integers need ≤ 24 bits to be exact. That's the 16777217 story.",
        "De Morgan: !(a && b) == !a || !b. Push the ! inward until the condition reads like English.",
      ],
      validation: [
        "Decode a UTF-8 file containing emoji and accented characters; cross-check code points against a reference table",
        "Your f32 bit-field printout matches an online IEEE-754 visualizer for 5 values",
      ],
      solutionOutline: [
        "The interpreter reads N bytes once and formats them many ways — driving home that interpretation, not storage, creates meaning.",
        "UTF-8 decoding is a state machine over byte classes (another quiet state-machine preview) built from your bitwise toolkit.",
        "Floating point is scientific notation in binary with fixed budget: everything surprising follows from finite mantissa bits.",
      ],
      extensions: [
        "Add UTF-16 decoding and find a BOM in a real Windows file",
        "Implement float comparison with relative epsilon and test its edge cases",
      ],
    },
    resources: {
      primary: [
        { ...R.cs50x, url: "https://cs50.harvard.edu/x/2025/weeks/0/", guidance: "Watch the representation segment of the Week 0 lecture (first ~40 min): binary, ASCII, Unicode, RGB — everything is bytes plus an agreed interpretation." },
      ],
      alternatives: [
        { ...R.benEaterTwos, guidance: "The negative-numbers half of this topic, from the master of bit-level explanation." },
        { ...R.nand2tetris, note: "Weeks 1–3: Boolean logic and arithmetic built from gates — representation from first principles." },
      ],
      practice: [],
      extra: [
        { ...R.cppref, guidance: "The numeric-limits and floating-point pages for exact C-side guarantees." },
      ],
    },
    masteryChecks: [
      "Hand-decode a 3-byte UTF-8 sequence to its code point",
      "Explain to a classmate why money must never be a float, with the bit-level reason",
      "Simplify !(!(a || b) || (c && !c)) and prove it",
    ],
    securityNote:
      "Encoding confusion is an attack vector: overlong UTF-8 sequences and mixed-encoding tricks have bypassed real security filters that compared bytes instead of canonical meaning. Canonicalize before validating — always.",
  },
  {
    id: "cs-big-o",
    title: "Big-O as an Engineering Tool",
    branch: "cs",
    stage: 2,
    required: true,
    difficulty: "foundation",
    estimatedHours: 8,
    summary:
      "Complexity analysis as a practical instrument, not exam trivia: reading growth rates from code shape, the common classes and where they come from, amortized analysis (your doubling buffer, formalized), why constants and cache sometimes beat asymptotics at real sizes — and measurement as the final arbiter.",
    whyItMatters:
      "Big-O is the vocabulary of every performance conversation, every library doc ('O(log n) insertion'), and every interview. More practically: it lets you predict, before writing code, whether your approach survives 10 million records — a superpower disguised as math.",
    prerequisiteIds: ["c-lists-stacks-queues"],
    concepts: [
      "Growth classes: O(1), O(log n), O(n), O(n log n), O(n²), O(2ⁿ) — and code shapes producing each",
      "Counting what dominates: loops, nested loops, halving, and recursion",
      "Best / average / worst case — and which one to care about, when",
      "Amortized analysis: why your doubling text buffer's append is O(1)",
      "Space complexity, and time-space trade-offs (your hash index: memory for speed)",
      "The asterisk: constants, cache locality, and small-n reality — measure before optimizing",
    ],
    practicalUses: [
      "Choosing structures by workload: reading '100k lookups/sec' and knowing a list dies",
      "Reading library documentation's complexity guarantees meaningfully",
      "Explaining why your code got 100× slower when data got 10× bigger",
    ],
    lab: {
      title: "Predict, Then Measure",
      scenario:
        "You've built the structures — now become the scientist. For each operation across your dynamic array, linked list, hash table, and BST, predict the complexity class, then measure across sizes from 1k to 1M and publish a report where theory meets a real machine — including the places where theory loses.",
      outcome:
        "Complexity analysis becomes something you trust because you tested it, and you gain the professional habit of predicting before measuring and measuring before optimizing.",
      requirements: [
        "A benchmark harness in C: timing helpers, warm-up runs, medians over repeats, sizes doubling from 1k to 1M",
        "Predictions written first, in a table, with one-line reasons — this is the commitment device",
        "Measure: array append (amortized) vs. linked prepend; array index vs. list walk; hash get vs. BST search vs. array linear scan; BST search on random vs. sorted-inserted data",
        "Plot or tabulate time vs. n; classify observed growth by ratio-when-doubled (O(n) doubles, O(n²) quadruples, O(log n) barely moves)",
        "Find and explain at least one theory-defying result (small-n crossover or cache effect) — e.g. linear scan beating BST at n=50",
      ],
      checkpoints: [
        "Doubling ratios in your data actually discriminate the classes",
        "The amortized O(1) append shows up as flat per-element cost with periodic spikes",
        "The sorted-insert BST measurably degrades to O(n) — the balance lesson made physical",
        "Your surprise finding has a written explanation involving constants or cache",
      ],
      hints: [
        "Time many operations per measurement and divide — single operations are below clock resolution.",
        "Prevent the compiler optimizing your benchmark away: use results (accumulate into a volatile).",
        "Ratio test: t(2n)/t(n) ≈ 2 → linear; ≈ 4 → quadratic; ≈ 1 → constant-ish or log.",
      ],
      validation: [
        "Predictions table graded against measurements — misses annotated with what you learned",
        "A classmate can reproduce your numbers within noise using your harness and README",
      ],
      solutionOutline: [
        "Big-O describes the shape of scaling, not speed: your measurements recover the shape via doubling ratios, which is robust to machine differences.",
        "Amortized analysis sums the true cost of occasional expensive operations over many cheap ones — the doubling buffer's copies total < 2n over n appends.",
        "Where theory 'fails' it doesn't: O-notation discards constants, and caches make constants differ by 100×. Both models are true; scale decides which dominates.",
      ],
      extensions: [
        "Add your ring buffer vs. node queue to the benchmark — quantify the cache story",
        "Benchmark hash table at load factors 0.5 / 0.9 / no-resize and connect to chain length",
      ],
    },
    resources: {
      primary: [
        { ...R.cs50x, url: "https://cs50.harvard.edu/x/2025/weeks/3/", guidance: "Watch the Week 3 'Algorithms' lecture (~2 h): linear vs. binary search and sorting growth rates, demonstrated with actual humans as array elements." },
      ],
      alternatives: [
        { ...R.fisetDS, guidance: "The 'Complexity Analysis' chapter at the start of the course — Big-O in 30 minutes with worked examples." },
      ],
      practice: [
        { ...R.visualgo, guidance: "Sorting page: race bubble sort against merge sort on 50, then 500 elements — growth rates made visceral." },
      ],
      extra: [
        { ...R.opendsa, guidance: "The algorithm-analysis chapters — rigorous but readable, with exercises." },
        { ...R.mitMath, guidance: "Asymptotics lectures for the formal definitions behind the notation." },
      ],
    },
    masteryChecks: [
      "Classify 6 code snippets by complexity from shape alone, including a halving loop and a nested loop",
      "Explain amortized O(1) append to a classmate using the doubling argument",
      "Given a spec ('sorted output, 10M items, memory tight'), reason to a structure choice via complexity",
    ],
  },
  {
    id: "cs-recursion",
    title: "Recursion & the Call Stack",
    branch: "cs",
    stage: 3,
    required: true,
    difficulty: "intermediate",
    estimatedHours: 10,
    summary:
      "Recursion as structural thinking: solve for the smallest case, trust the recursive call, combine. The call stack as the machine reality (you've seen frames in GDB), base cases and progress as the two proof obligations, when recursion is natural (trees, divide-and-conquer, backtracking) versus when a loop or explicit stack serves better.",
    whyItMatters:
      "Trees, parsers, filesystem walkers, sorting algorithms, and backtracking search are all naturally recursive — you already used it in the tree labs. Deep comfort with recursion (including converting it away when needed) unlocks half of classic algorithms and all of compilers later.",
    prerequisiteIds: ["c-pointers-arrays", "cs-big-o"],
    concepts: [
      "Base case and recursive case; termination as 'provable progress toward base'",
      "The leap of faith: assume the recursive call is correct, verify the combine step",
      "Call-stack mechanics: frames, depth limits, and stack overflow",
      "Divide and conquer: recursion where subproblems shrink multiplicatively",
      "Backtracking: try, recurse, undo — systematic search of choice trees",
      "Recursion ↔ iteration: tail calls, explicit stacks, and memoization for overlapping subproblems",
    ],
    practicalUses: [
      "Anything tree- or graph-shaped: traversal, size, search, rendering",
      "Generating combinations/permutations for testing and puzzles",
      "Parsing nested structures — JSON, expressions, file formats",
    ],
    lab: {
      title: "Backtracking Puzzle Engine",
      scenario:
        "Build a solver that cracks two classic constraint puzzles — N-Queens and Sudoku — with one shared idea: recursive backtracking. Then instrument it: count calls, track depth, visualize the search unfolding, and convert one solver to an explicit stack to prove you understand what the machine does.",
      outcome:
        "You can design recursive solutions with confidence (base case, progress, combine), implement backtracking for real search problems, and translate between recursion and explicit stacks at will.",
      requirements: [
        "N-Queens: count all solutions for N=4..10; print one solution as a board",
        "Sudoku: solve real puzzles read from a file; report unsolvable ones cleanly",
        "Shared discipline in both: choose, recurse, un-choose — the undo must restore state exactly",
        "Instrumentation: recursive call count and max depth reported per solve; compare easy vs. hard Sudoku",
        "Convert N-Queens to an explicit-stack iterative version; verify identical solution counts",
        "A stack-overflow demo: unbounded recursion, observe the crash, explain frame accumulation via GDB backtrace",
      ],
      checkpoints: [
        "N=8 yields exactly 92 solutions — the classic check",
        "Sudoku solver verified against puzzles with known unique solutions",
        "Call counts show pruning power: early constraint checks slash the number dramatically (measure with checks disabled vs. enabled)",
        "Iterative N-Queens matches recursive counts for all N tested",
      ],
      hints: [
        "N-Queens state: one array, queens[row] = col. Placement legality is a scan of prior rows — O(1) with three 'attacked' bitmasks if you want elegance.",
        "The undo step is where backtracking bugs live: whatever choose mutated, un-choose must exactly revert.",
        "Explicit-stack conversion: the stack holds 'where I am in whose loop' — a frame struct of (row, next column to try).",
      ],
      validation: [
        "Solution counts for N=4..10 match published values",
        "A Sudoku with two solutions is detected as non-unique if you add the check (extension), or at minimum solved consistently",
        "ASan-clean; no board state leaks between solves",
      ],
      solutionOutline: [
        "Backtracking is DFS over the tree of partial solutions; constraint checks prune subtrees, which is why early checking wins exponentially.",
        "The recursion template: if complete → report; for each legal choice → apply, recurse, revert. Everything else is problem-specific detail.",
        "The explicit-stack version manually stores what the language stores automatically — proving frames are just data, which is also why deep recursion can exhaust the stack.",
      ],
      extensions: [
        "Add memoization to a Fibonacci/grid-paths warm-up and measure the exponential→linear collapse — the dynamic-programming gateway",
        "Solve a small maze with backtracking, then with BFS, and articulate when each wins",
      ],
    },
    resources: {
      primary: [
        { ...R.cs50x, url: "https://cs50.harvard.edu/x/2025/weeks/3/", guidance: "Rewatch the recursion segment of the Week 3 lecture, then draw the full call tree for factorial(4) by hand before opening the lab." },
      ],
      alternatives: [],
      practice: [
        { ...R.pythonTutor, guidance: "Step through a recursive function and watch frames stack and unwind — the single best recursion aid there is." },
        { ...R.visualgo, guidance: "The recursion-tree visualizations for divide-and-conquer intuition." },
      ],
      extra: [
        { ...R.opendsa, guidance: "The recursion chapters with visual call-tree exercises." },
      ],
    },
    masteryChecks: [
      "State the two proof obligations of any recursive function and check them on your Sudoku solver",
      "Convert a given recursive function to an explicit stack version on paper",
      "Explain to a classmate why memoization helps overlapping subproblems but not N-Queens",
    ],
  },
  {
    id: "cs-search-sort",
    title: "Searching & Sorting with Trade-offs",
    branch: "cs",
    stage: 4,
    required: true,
    difficulty: "intermediate",
    estimatedHours: 12,
    summary:
      "The classic algorithms as a study in trade-offs: binary search (and its off-by-one minefield), insertion sort's small-n virtue, merge sort's guaranteed n log n and stability, quicksort's cache-friendly speed and worst-case sting, heaps for top-K without full sorting. Implemented, measured, and chosen — never memorized.",
    whyItMatters:
      "Sorting and searching underlie databases, deduplication, ranking, and scheduling. You'll rarely reimplement them at work — but choosing correctly among them (and knowing why your language's sort is a hybrid) is routine, and binary search's invariant discipline transfers to countless 'find the boundary' problems.",
    prerequisiteIds: ["cs-big-o", "cs-recursion"],
    concepts: [
      "Binary search on arrays and on answers ('find the smallest x such that…'); invariant-driven correctness",
      "Insertion sort: O(n²) yet the right choice for small or nearly-sorted data",
      "Merge sort: divide-and-conquer, stability, O(n) extra space",
      "Quicksort: partitioning, pivot choice, average n log n vs. worst n², in-place advantage",
      "Heaps and heapsort; top-K via a bounded heap",
      "Stability: when equal elements' order matters (multi-key sorting)",
      "Why real sorts are hybrids (introsort, Timsort) — theory meeting engineering",
    ],
    practicalUses: [
      "Top-K queries: '10 largest files' from your tree indexer, done right",
      "Multi-key ordering: sort by artist then album — stability in action",
      "Binary search on answers: 'largest image size that fits the memory budget'",
    ],
    lab: {
      title: "The Sorting Bake-Off",
      scenario:
        "Build a small algorithms library (binary search, insertion, merge, quick, heap + top-K) with your test harness, then run a rigorous bake-off across data shapes — random, sorted, reversed, few-unique, nearly-sorted — and write the engineering memo: which algorithm for which situation, backed by your numbers.",
      outcome:
        "You've implemented the canon once (permanently demystifying it), and you own an evidence-based decision guide written by you, for you.",
      requirements: [
        "Binary search returning found-index or insertion point, tested exhaustively on boundaries (empty, one, two, target absent/below/above)",
        "Insertion, merge, and quicksort over your qsort-style interface (void*, size, comparator) so one test suite drives all",
        "A binary heap with push/pop, heapsort, and top-K that never holds more than K items",
        "Bake-off: all sorts × all five data shapes × sizes 1k–1M; medians of repeats; results tabulated",
        "Quicksort's worst case triggered deliberately (sorted input, first-element pivot), then fixed (median-of-three or random pivot) and re-measured",
        "The memo: one page, concrete recommendations with numbers ('insertion sort wins below n≈64 — which is why real libraries switch to it there')",
      ],
      checkpoints: [
        "All sorts pass an identical property suite: output is a sorted permutation of input (checked, not eyeballed)",
        "Stability verified: merge stable, quicksort not — demonstrated with two-field records",
        "The nearly-sorted shape shows insertion sort's superpower clearly",
        "Top-K at n=1M beats full-sort-then-take measurably",
      ],
      hints: [
        "Binary search: maintain the invariant 'answer, if present, is in [lo, hi)' and every line follows. Most bugs are ambient doubt about whether hi is inclusive.",
        "Merge sort: get merge() perfect alone first — it's 90% of the algorithm.",
        "Quicksort partition: Lomuto is easier to get right; Hoare is faster. Start Lomuto.",
        "Heap as array: children of i at 2i+1, 2i+2; sift-down is the whole trick.",
      ],
      validation: [
        "Property test: 10k random arrays per sort, verified sorted-permutation each time",
        "Binary search fuzz: random sorted arrays and targets, cross-checked against linear scan",
        "The deliberate quicksort n² spike is visible in your data, then gone after the fix",
      ],
      solutionOutline: [
        "One comparator-driven interface makes algorithms interchangeable — the same design that made qsort general, now yours.",
        "The bake-off's lesson is that 'best algorithm' is underspecified: data shape, size, stability needs, and memory budget select the winner — which is why production sorts are adaptive hybrids.",
        "Top-K with a min-heap of size K: stream elements, replace the minimum when beaten — O(n log K), the pattern behind every leaderboard.",
      ],
      extensions: [
        "Implement introsort's switch (quick→heap on depth, →insertion on small n) and joust with qsort",
        "Binary-search-on-answers: solve 'minimum ship capacity' style problem with your search skeleton",
      ],
    },
    resources: {
      primary: [
        { ...R.cs50x, url: "https://cs50.harvard.edu/x/2025/weeks/3/", guidance: "Watch the Week 3 lecture in full if you haven't — its sorting comparisons are exactly this lab's subject matter." },
      ],
      alternatives: [],
      practice: [
        { ...R.visualgo, guidance: "Use the Sorting visualization in Training mode: predict each algorithm's next step, then implement the bake-off." },
        { ...R.godbolt, guidance: "Compare your quicksort's codegen against qsort for a constant-factor reality check." },
      ],
      extra: [
        { ...R.opendsa, guidance: "Sorting chapters with the analysis behind every claim your memo makes." },
      ],
    },
    masteryChecks: [
      "Write correct binary search on a whiteboard, stating the invariant at each line",
      "Given four scenarios (log timestamps nearly sorted; 10M ints, memory tight; multi-key report; top-100 of a stream), pick and defend",
      "Explain stability with a concrete two-key example and name which of your sorts have it",
    ],
  },
  {
    id: "cs-graphs-paths",
    title: "Graph Algorithms: Traversal & Shortest Paths",
    branch: "cs",
    stage: 5,
    required: true,
    difficulty: "intermediate",
    estimatedHours: 12,
    summary:
      "From graph structure (built in C) to graph algorithms as products: BFS shortest-hops formalized, Dijkstra with a priority queue for weighted routes, understanding why greedy works there (and when it doesn't — negative weights), plus connectivity and a taste of union-find. Anchored by building a real route planner.",
    whyItMatters:
      "Google Maps, network routing, game AI pathfinding, dependency resolution with costs — shortest path is among the most deployed algorithm families in existence. Dijkstra also introduces the priority-queue-driven greedy pattern that recurs across scheduling and optimization.",
    prerequisiteIds: ["c-graphs", "cs-search-sort"],
    concepts: [
      "BFS revisited: why the queue's distance rings prove minimal hops",
      "Weighted graphs: when hop count lies and edge costs matter",
      "Dijkstra: the frontier, greedy extraction, relaxation, and the no-negative-weights caveat",
      "Priority queues (your heap) as Dijkstra's engine; complexity with and without one",
      "Path reconstruction via parent pointers",
      "Union-find for connectivity questions (concept + small implementation)",
      "A* as informed Dijkstra (concept level, for the curious)",
    ],
    practicalUses: [
      "Route planning on real map data",
      "Network hop analysis: 'how many routers between me and the server'",
      "Game pathfinding and puzzle solving (states as vertices, moves as edges)",
    ],
    lab: {
      title: "City Route Planner",
      scenario:
        "Build a command-line route planner over a real(istic) road network — nodes are intersections, edges have travel-time weights. Load a map file, answer fastest-route queries with turn-by-turn output, compare against fewest-intersections routes, and prove your implementation against brute force.",
      outcome:
        "You've shipped the algorithm behind every navigation app, understand exactly why it works, and have connected heaps, graphs, and correctness testing into one artifact.",
      requirements: [
        "Map file format: nodes with names, edges with weights; parse defensively (your file-I/O discipline)",
        "BFS mode: fewest intersections between A and B, path printed via parent-pointer reconstruction",
        "Dijkstra mode: fastest route using your binary heap as the priority queue; total time plus per-segment breakdown",
        "Show a case where BFS and Dijkstra disagree (few long roads vs. many short ones) and explain it in the README",
        "Correctness proof: on random graphs ≤ 12 nodes, enumerate all simple paths by brute force and verify Dijkstra matches the true optimum, 1000 trials",
        "Handle disconnected queries ('no route exists') gracefully",
      ],
      checkpoints: [
        "A hand-checkable 10-node map gives the obviously correct route",
        "The BFS-vs-Dijkstra disagreement case is demonstrated, not just asserted",
        "Brute-force cross-check passes 1000/1000",
        "Priority-queue version measurably beats a linear-scan-for-minimum version on a 10k-node generated map",
      ],
      hints: [
        "Dijkstra's loop: pop nearest unfinalized node, mark final, relax its edges (improve neighbors' tentative distances). Nodes may enter the heap multiple times — skip stale pops (dist check).",
        "Parent pointers: whenever you improve dist[v] via u, set parent[v] = u; reconstruct by walking back from target.",
        "Generate test maps as grids with random weights — easy to visualize, easy to brute-force at small size.",
      ],
      validation: [
        "The 1000-trial brute-force comparison is in your test target, not a one-off",
        "Fuzz the map parser with truncated/garbage files — no crashes",
        "Leak-free with the heap under churn",
      ],
      solutionOutline: [
        "Dijkstra is greedy BFS with a priority queue: BFS's 'rings of equal hops' become 'rings of equal cost', and the greedy choice is safe because with non-negative weights, the nearest frontier node can't be improved later.",
        "The heap turns 'find minimum tentative distance' from O(n) to O(log n) — your bake-off instincts predicted the win before you measured it.",
        "The brute-force cross-check is the professional pattern for algorithm verification: an obviously-correct slow oracle validating a fast implementation on small inputs.",
      ],
      extensions: [
        "Implement A* with straight-line-distance heuristic on grid maps and measure explored-node reduction",
        "Add negative-weight detection and read about Bellman-Ford — why does Dijkstra's proof break?",
        "Kruskal's MST with your union-find: 'cheapest way to connect all districts'",
      ],
    },
    resources: {
      primary: [
        { ...R.fisetGraphs, guidance: "Watch the 'Dijkstra's Algorithm' chapter plus the BFS shortest-path chapter (~1 h). The Bellman-Ford chapter is optional depth." },
      ],
      alternatives: [
        { ...R.mitMath, note: "Graph theory lectures for the underlying formalism." },
      ],
      practice: [
        { ...R.visualgo, guidance: "Single-Source Shortest Paths page: step Dijkstra by hand on a small graph before implementing it." },
      ],
      extra: [
        { ...R.opendsa, guidance: "Graph algorithm chapters with the correctness argument spelled out." },
      ],
    },
    masteryChecks: [
      "Hand-execute Dijkstra on a 6-node weighted graph, showing the frontier at each step",
      "Explain precisely where the correctness argument uses non-negative weights",
      "Model a sliding-puzzle as a graph problem: what are vertices, edges, and what does BFS find?",
    ],
  },
  {
    id: "cs-state-machines",
    title: "State Machines",
    branch: "cs",
    stage: 6,
    required: true,
    difficulty: "intermediate",
    estimatedHours: 8,
    summary:
      "Finite state machines as the master pattern for 'behavior over time': states, events, transitions, and the discipline of making illegal states unrepresentable. From lexers and protocol handlers to UI flows and game AI — plus the regex connection: patterns are state machines in costume.",
    whyItMatters:
      "An enormous share of production bugs are informal state machines gone wrong — booleans multiplying (isLoading, isError, isRetrying…) until impossible combinations occur. Engineers who reach for explicit FSMs write network code, parsers, and UIs that visibly can't reach nonsense states.",
    prerequisiteIds: ["c-structs-callbacks"],
    concepts: [
      "States, events, transitions, initial and accepting states; drawing the diagram first",
      "Transition tables vs. switch statements vs. function-pointer-per-state",
      "Illegal states unrepresentable: one enum beats five booleans",
      "Guard conditions and actions on transitions",
      "FSMs recognize patterns: the regex connection (concept: every regex compiles to an FSM)",
      "Where FSMs run the world: TCP's state diagram, lexers, vending machines, UI flows",
    ],
    practicalUses: [
      "Tokenizers/lexers: your calculator's tokenizer, done rigorously",
      "Protocol handling: connection lifecycle in the networking labs ahead",
      "UI flow control later in React: loading/success/error as states, not boolean soup",
    ],
    lab: {
      title: "Tokenizer + Connection Simulator",
      scenario:
        "Two FSMs, one pattern. First: a rigorous tokenizer for a small config-file language (numbers, strings with escapes, identifiers, comments) as an explicit table-driven machine. Second: simulate a TCP-like connection lifecycle (closed → listening → connected → closing…) that rejects illegal events — the skeleton of every network program you'll write.",
      outcome:
        "You can design behavior as states and transitions, implement machines three ways and choose between them, and you'll never again model a lifecycle with scattered booleans.",
      requirements: [
        "Draw both machines' diagrams first; the tokenizer's states include in-string and in-escape (the subtle ones)",
        "Tokenizer: explicit state enum + transition function; input is consumed byte by byte; strings with \\\" escapes and comments handled; malformed input produces positioned errors ('unterminated string at line 3')",
        "Connection sim: transition table (state × event → state or REJECT); a REPL fires events; illegal events are rejected with the current state named",
        "Implement the connection machine twice: switch-based and table-driven; write a paragraph on which you'd maintain and why",
        "Property: the tokenizer never crashes on any byte sequence — fuzz it with random bytes to prove it",
      ],
      checkpoints: [
        "The diagram was drawn before code, and final code matches it (update whichever was wrong)",
        "Tokenizer handles the trap cases: escape at end of input, unterminated string, comment at EOF",
        "Connection sim: connect-when-closed rejected, data-before-handshake rejected — nonsense is unreachable",
        "Random-byte fuzzing: zero crashes over 1M bytes",
      ],
      hints: [
        "The in-escape state is why FSMs beat ad-hoc parsing: 'what does this byte mean' depends only on the state, never on scattered flags.",
        "Table-driven: a 2D array [state][event_class] → next state; classify each input byte into an event class first.",
        "If you find yourself adding a boolean next to the state enum — that boolean is smuggled state; fold it in as new states.",
      ],
      validation: [
        "A test file of 25 valid and invalid config lines yields exactly the expected token stream / errors",
        "Every state × event cell in the connection table is deliberately either a transition or REJECT — no accidents (assert exhaustiveness)",
      ],
      solutionOutline: [
        "An FSM is (states, events, transition function, start state): the code is a loop pulling events and indexing the transition — all behavior complexity lives in a reviewable table, not tangled control flow.",
        "The tokenizer works because 'meaning of the next byte' is fully determined by state — this is exactly how real lexers, JSON parsers, and your UTF-8 decoder operate.",
        "The connection machine previews the systems branch: TCP is literally specified as this diagram, and your socket code later will mirror it.",
      ],
      extensions: [
        "Compile a tiny regex subset (literals, *, |) to an NFA — see the pattern-machine equivalence with your own hands",
        "Add timeouts to the connection sim as timer events — states now expire, like real protocols",
      ],
    },
    resources: {
      primary: [
        { ...R.mitStateMachines, guidance: "Watch the lecture. It leans mathematical, but its invariant-thinking is exactly what makes your tokenizer and connection simulator correct." },
      ],
      alternatives: [],
      practice: [
        { ...R.regexone, guidance: "Every regex you write is a finite automaton — do lessons 1–10 and notice the state transitions you're describing." },
      ],
      extra: [
        { ...R.opendsa, guidance: "The finite-automata chapters connect the practice to the theory." },
        { ...R.ostep, guidance: "Preview the TCP discussion — see a production state machine specified as a diagram." },
      ],
    },
    masteryChecks: [
      "Design an FSM diagram for a traffic light with pedestrian button, no code",
      "Refactor a given three-boolean 'status' mess into one enum and a transition table",
      "Explain why 'unterminated string' detection is trivial with an FSM and error-prone without",
    ],
  },
  {
    id: "cs-discrete-probability",
    title: "Discrete Math & Probability for Engineers",
    branch: "cs",
    stage: 7,
    required: true,
    difficulty: "intermediate",
    estimatedHours: 14,
    summary:
      "The math that keeps paying: sets and relations (the theory beneath databases and types), combinatorics (how many cases must I test?), proof techniques including induction (why your recursion is correct), and probability where engineers actually meet it — hash collisions, the birthday paradox, randomized testing, and reasoning about reliability.",
    whyItMatters:
      "This is deliberately taught beside code you've written: induction is recursion's proof, the birthday paradox is your hash table's collision reality, combinatorics bounds your test coverage, and probability underlies everything from load balancing to why password entropy matters. It's also the foundation cryptography stands on later.",
    prerequisiteIds: ["cs-big-o", "testing-fundamentals"],
    concepts: [
      "Sets, subsets, unions/intersections; relations and functions — the vocabulary of SQL joins and type systems to come",
      "Counting: product rule, permutations, combinations; how many inputs does exhaustive testing need?",
      "Pigeonhole principle (you met it in hash collisions) and its surprising uses",
      "Induction: proving loop invariants and recursive correctness — formalizing the 'leap of faith'",
      "Discrete probability: sample spaces, independence, expected value",
      "Birthday paradox → hash collision probabilities → why 128-bit IDs don't collide in practice",
      "Expected-value reasoning: average-case analysis, randomized algorithms, reliability estimates",
    ],
    practicalUses: [
      "Sizing hash tables and ID spaces with collision math instead of vibes",
      "Estimating test coverage: how many random tests to hit a rare branch?",
      "Reading security claims ('2^128 operations') with real understanding",
    ],
    lab: {
      title: "Probability Meets Your Hash Table",
      scenario:
        "A three-part investigation using code as the laboratory. (1) Verify the birthday paradox empirically and against the formula. (2) Measure your own hash table's collision behavior against theoretical prediction. (3) Use combinatorics to design — and prove the size of — a randomized test suite for your sorting library.",
      outcome:
        "Probability becomes a tool you compute with, not folklore; you can predict collision rates, reason about randomized testing, and write a small induction proof about your own code.",
      requirements: [
        "Birthday simulator (C or on paper + code): for group sizes 10–60, simulate 10k trials each, plot collision probability, overlay the analytic formula — they should hug",
        "Hash collision study: insert n random keys into your table (resizing disabled, m buckets); measure empty buckets and max chain length; compare with expectation (n/m per bucket, Poisson-ish spread) for three load factors",
        "Combinatorics workout: compute (by hand, shown) the number of distinct orderings of 10 elements, why 100 random 10-element arrays can't cover them, and how many trials give 99% confidence of hitting at least one 'reverse-sorted-ish' hard case you define",
        "Induction proof, written: your dynamic array's doubling append does ≤ 2n copies total for n appends — base case, hypothesis, step",
        "One page connecting each result to an engineering decision you'd now make differently",
      ],
      checkpoints: [
        "Simulated birthday curve matches theory within noise; the ~23-people-50% landmark reproduced",
        "Hash measurements match prediction well at load 0.5 and visibly degrade at load 4 — as computed",
        "The induction proof survives a skeptical classmate reading it aloud",
      ],
      hints: [
        "Birthday probability: P(no collision) = ∏(1 − i/365); compute iteratively, no factorials needed.",
        "For the hash study, use your FNV-1a on random strings — and consider what would break if keys were adversarial (tie to hash flooding).",
        "Induction on 'total copies after n appends ≤ 2n': the step case splits on whether append n triggers a resize.",
      ],
      validation: [
        "Formulas implemented twice (simulation vs. closed form) agree — self-validating science",
        "A classmate can predict your table's max chain length at a new load factor using your write-up, and the measurement confirms it",
      ],
      solutionOutline: [
        "The birthday paradox is pigeonhole made quantitative: collision probability grows with pairs (~k²/2m), not items — which is why 23 people suffice for 365 days and why UUID128 never collides.",
        "Balls-into-bins is the hash table's true model: expected chain length is the load factor, and the spread explains why 'average O(1)' hides occasional longer probes.",
        "Induction is the proof shape of both loops and recursion — the invariant is the hypothesis; you've been using it informally since the binary-search lab.",
      ],
      extensions: [
        "Compute how many random 64-bit IDs a system can issue before 1% collision risk — then check how real systems choose ID sizes",
        "Prove by induction that your BST's in-order traversal visits nodes in sorted order",
      ],
    },
    resources: {
      primary: [
        { ...R.mitMath, guidance: "Watch the lecture videos for the counting and probability units (permutations, combinations, conditional probability) and do those units' problem sets." },
      ],
      alternatives: [],
      practice: [
        { ...R.visualgo, guidance: "Hashing visualization — the balls-into-bins story, animated." },
      ],
      extra: [
        { ...R.opendsa, guidance: "Its analysis chapters ground the same math in data-structure behavior." },
      ],
    },
    masteryChecks: [
      "Derive the ~23-person birthday result from the product formula on paper",
      "Predict expected collisions for n keys in m buckets and verify empirically",
      "Write a clean induction proof for a loop invariant in code you wrote this month",
    ],
    securityNote:
      "Cryptography is applied probability: key sizes, collision resistance, and 'computationally infeasible' are exactly the calculations you did here at larger exponents. When you later evaluate 'is this token guessable?', this is the math you'll use.",
  },
];
