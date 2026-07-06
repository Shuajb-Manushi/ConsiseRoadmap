import type { TopicMeta } from "../../types";


export const cMeta: TopicMeta[] = [
  {
    id: "c-compilation",
    title: "Compilation, Linking, Headers & Libraries",
    branch: "c",
    stage: 1,
    required: true,
    difficulty: "foundation",
    estimatedHours: 8,
    summary:
      "The C build model in depth: the preprocessor as textual substitution, translation units, object files, the linker resolving symbols, header files as promises, and static vs. shared libraries. This is where 'undefined reference' and 'multiple definition' stop being mysteries.",
    prerequisiteIds: ["code-to-program"],
  },
  {
    id: "c-integers-bits",
    title: "Integers, Bits, Overflow & Undefined Behavior",
    branch: "c",
    stage: 2,
    required: true,
    difficulty: "foundation",
    estimatedHours: 8,
    summary:
      "What C's numbers actually are: fixed-width binary, two's complement for negatives, signed vs. unsigned semantics, integer promotion traps, overflow, and the crucial concept of undefined behavior — the contract C makes with you and what the compiler is allowed to do when you break it.",
    prerequisiteIds: ["c-compilation"],
  },
  {
    id: "c-pointers-arrays",
    title: "Pointers, Arrays, Strings & the Stack",
    branch: "c",
    stage: 3,
    required: true,
    difficulty: "intermediate",
    estimatedHours: 16,
    summary:
      "The heart of C. Memory as one big addressable array; pointers as addresses with types; arrays and their decay to pointers; C strings as byte runs with a terminator; pointer arithmetic; and how function calls really work — stack frames, local lifetimes, and why returning a pointer to a local is a bug. You know linked lists already; this makes you know why they work.",
    prerequisiteIds: ["c-compilation"],
  },
  {
    id: "c-heap-lifetime",
    title: "The Heap: malloc, Lifetime & Ownership",
    branch: "c",
    stage: 4,
    required: true,
    difficulty: "intermediate",
    estimatedHours: 14,
    summary:
      "Stack vs. heap as two lifetime models: automatic and scoped vs. manual and yours-to-manage. malloc/calloc/realloc/free, growth strategies for dynamic arrays, the four classic heap bugs (leak, double free, use-after-free, overflow), and ownership discipline — every allocation has exactly one owner responsible for freeing it.",
    prerequisiteIds: ["c-pointers-arrays"],
  },
  {
    id: "c-structs-callbacks",
    title: "Structs, Enums, Unions & Function Pointers",
    branch: "c",
    stage: 5,
    required: true,
    difficulty: "intermediate",
    estimatedHours: 10,
    summary:
      "Building real types: structs for records (and how they nest, point at each other, and pad in memory), enums for closed sets of states, unions for overlapping storage, and function pointers — passing behavior as data, which is how C does callbacks, dispatch tables, and plugins.",
    prerequisiteIds: ["c-pointers-arrays"],
  },
  {
    id: "c-modular-build",
    title: "Modular C, Makefiles & Project Structure",
    branch: "c",
    stage: 6,
    required: true,
    difficulty: "intermediate",
    estimatedHours: 8,
    summary:
      "Organizing a growing C codebase: module boundaries with public headers and private implementation, opaque pointers for real encapsulation, include hygiene, and Make — targets, dependencies, pattern rules, and incremental builds that recompile only what changed.",
    prerequisiteIds: ["c-structs-callbacks", "c-compilation"],
  },
  {
    id: "c-file-io",
    title: "File & Binary I/O, Errors & Defensive Parsing",
    branch: "c",
    stage: 7,
    required: true,
    difficulty: "intermediate",
    estimatedHours: 10,
    summary:
      "Working with data that outlives your process: FILE*, text vs. binary modes, fread/fwrite of structs and headers, seeking, endianness, and errno. Paired with the discipline that defines professional C: every input is untrusted until validated, every I/O call can fail, and errors propagate cleanly instead of being ignored.",
    prerequisiteIds: ["c-heap-lifetime"],
  },
  {
    id: "c-debug-tools",
    title: "GDB, Sanitizers, Valgrind & Compiler Warnings",
    branch: "c",
    stage: 8,
    required: true,
    difficulty: "intermediate",
    estimatedHours: 8,
    summary:
      "The professional C toolbelt: GDB for interrogating live and dead programs (breakpoints, watchpoints, stack traces, core dumps), AddressSanitizer and UBSan for making invisible memory errors loud, Valgrind for leaks, and treating compiler warnings as the free static analysis they are.",
    prerequisiteIds: ["c-heap-lifetime", "debugging-errors"],
  },
  {
    id: "c-lists-stacks-queues",
    title: "Linked Lists, Stacks & Queues in Practice",
    branch: "c",
    stage: 9,
    required: true,
    difficulty: "intermediate",
    estimatedHours: 14,
    summary:
      "You've written linked lists in class — now use them like an engineer: doubly-linked lists powering a playlist with cursors and reordering, stacks powering undo/redo, and queues powering a job scheduler. The point is matching each structure's shape to a real problem's shape.",
    prerequisiteIds: ["c-heap-lifetime", "c-structs-callbacks"],
  },
  {
    id: "c-hash-tables",
    title: "Hash Tables from Scratch",
    branch: "c",
    stage: 10,
    required: true,
    difficulty: "intermediate",
    estimatedHours: 12,
    summary:
      "The most useful data structure in practice: hash functions turning keys into indexes, collisions and why they're inevitable, chaining vs. open addressing, load factor and resizing, and the honest costs behind 'O(1) average'. Built by hand, because you'll use one in every language forever.",
    prerequisiteIds: ["c-lists-stacks-queues"],
  },
  {
    id: "c-trees",
    title: "Trees: Hierarchy & Ordered Search",
    branch: "c",
    stage: 11,
    required: true,
    difficulty: "intermediate",
    estimatedHours: 12,
    summary:
      "Trees for the two things they're unbeatable at: representing hierarchy (filesystems, documents, org charts) and keeping data ordered while staying fast to search (BSTs). Recursive structure, the four traversals and what each is for, BST insert/search/delete, and why unbalanced trees betray you.",
    prerequisiteIds: ["c-lists-stacks-queues"],
  },
  {
    id: "c-graphs",
    title: "Graphs: Relationships, Routes & Dependencies",
    branch: "c",
    stage: 12,
    required: true,
    difficulty: "advanced",
    estimatedHours: 12,
    summary:
      "The structure for 'things connected to things': modeling with adjacency lists, BFS and DFS as the two fundamental explorations, cycle detection, and topological sort — computing a valid order for dependent tasks, which is literally how Make, package managers, and this roadmap itself work.",
    prerequisiteIds: ["c-trees", "c-hash-tables"],
  },
];
