import type { TopicMeta } from "../../types";


export const csMeta: TopicMeta[] = [
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
    prerequisiteIds: ["c-integers-bits"],
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
    prerequisiteIds: ["c-lists-stacks-queues"],
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
    prerequisiteIds: ["c-pointers-arrays", "cs-big-o"],
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
    prerequisiteIds: ["cs-big-o", "cs-recursion"],
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
    prerequisiteIds: ["c-graphs", "cs-search-sort"],
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
    prerequisiteIds: ["c-structs-callbacks"],
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
    prerequisiteIds: ["cs-big-o", "testing-fundamentals"],
  },
];
