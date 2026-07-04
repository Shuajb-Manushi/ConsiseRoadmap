import type { TopicDraft } from "../types";
import { R } from "../resourceCatalog";

export const cTopics: TopicDraft[] = [
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
    whyItMatters:
      "Every C project bigger than one file lives or dies by this model, and it's the same model underneath C++, Rust, and every native library your Python or JavaScript will ever call. Engineers who understand linking can integrate any library; those who don't are stopped by the first build error.",
    prerequisiteIds: ["code-to-program"],
    concepts: [
      "Preprocessing: #include is literal paste, #define is literal substitution, and the dangers of both",
      "Translation units: each .c compiles alone, knowing only what its headers promise",
      "Declarations vs. definitions, and why headers hold the former",
      "Symbols and the linker: resolution, 'undefined reference', 'multiple definition'",
      "Include guards / #pragma once",
      "Static libraries (.a) vs. shared libraries (.so/.dll), and -l/-L flags",
    ],
    practicalUses: [
      "Splitting a growing program into files without breaking the build",
      "Linking against real libraries: math (-lm), SQLite, ncurses",
      "Reading anyone's build errors and knowing which file to open",
    ],
    lab: {
      title: "Build a Library, Then Link Against It",
      scenario:
        "Your string utilities from the testing lab deserve to be reusable. Package them as a proper static library with a public header, then consume that library from a separate program — exactly how real C libraries ship.",
      outcome:
        "You can structure, build, and consume a multi-file C library and diagnose the classic linker errors on sight.",
      requirements: [
        "Split utilities into str_utils.h (public declarations only) and str_utils.c, with an include guard",
        "Compile to an object file, archive it into libstrutils.a with ar, and link a separate demo program against it using -L and -l",
        "Trigger and screenshot/record all three classic failures: missing include guard (double inclusion), undefined reference (forgot to link), multiple definition (function body in header)",
        "Use gcc -E to show what the demo's source looks like after preprocessing, and identify your header's contents inside it",
      ],
      checkpoints: [
        "The demo builds knowing nothing about str_utils.c — only the header and the .a file",
        "You can explain why changing str_utils.c requires relinking but not recompiling the demo's .c file",
        "Each classic error's message is matched to its cause in your notes",
      ],
      hints: [
        "The linker searches libraries left to right: -lstrutils usually belongs after your .o files on the command line.",
        "'Multiple definition' means a definition (body) leaked into a header included twice — declarations are safe, definitions aren't.",
        "nm libstrutils.a lists the symbols inside; it makes linking feel much less magical.",
      ],
      validation: [
        "Delete all .o files and rebuild from a two-line script — the process is reproducible, not remembered",
        "Deliberately misspell a function in the demo and predict the exact error stage before compiling",
      ],
      solutionOutline: [
        "The header is the library's contract: types and function declarations only. The .c file is the private implementation.",
        "ar bundles object files; the linker pulls needed symbols from the archive at link time — 'static' means copied into your executable.",
        "Every 'undefined reference' is a promise (declaration) whose fulfiller (definition) was never handed to the linker; the fix is always 'compile it or link it'.",
      ],
      extensions: [
        "Rebuild as a shared library (-fPIC, -shared) and observe the executable shrink",
        "Add a version macro to the header and print it from the demo",
      ],
    },
    resources: {
      primary: [
        { ...R.cs50x, url: "https://cs50.harvard.edu/x/2025/weeks/2/", guidance: "Watch the first ~45 min of the Week 2 lecture — the four compilation stages (preprocess, compile, assemble, link) demonstrated live. Stop when it moves on to arrays, or keep watching as a refresher." },
      ],
      alternatives: [
        { ...R.cpuLand, guidance: "The chapters on ELF and exec explain what the linker's output actually is." },
      ],
      practice: [
        { ...R.godbolt, guidance: "Inspect what a translation unit exports — switch output to 'compile to binary' and view symbols." },
      ],
      extra: [
        { ...R.beejC, guidance: "The 'Multifile Projects' chapter covers exactly this workflow." },
        { ...R.cppref, guidance: "The preprocessor and linkage pages give the precise rules when you need them." },
      ],
    },
    masteryChecks: [
      "Given an 'undefined reference' error, name the two possible causes and the command-line fix for each",
      "Explain why headers contain declarations, and what breaks when a definition sneaks in",
      "Draw the full build graph for a 3-file project: sources, headers, objects, executable",
    ],
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
    whyItMatters:
      "Integer bugs are quietly behind an enormous share of real crashes and security vulnerabilities — buffer sizes that wrap to zero, comparisons that are always true, loops that never end. Understanding two's complement and UB is what separates C programmers from people who write C-shaped code.",
    prerequisiteIds: ["c-compilation"],
    concepts: [
      "Binary and hexadecimal fluency; bytes, words, and fixed widths (int8_t … int64_t)",
      "Two's complement: why -1 is all ones, and why INT_MIN has no positive twin",
      "Signed vs. unsigned: conversion rules, the -1 > 0u trap, size_t",
      "Overflow: unsigned wraps (defined), signed overflows (undefined)",
      "Undefined behavior as a contract: why the compiler may delete your safety check",
      "Bitwise operators (& | ^ ~ << >>) and masks, setting/clearing/testing bits",
    ],
    practicalUses: [
      "Choosing correct types for sizes, indexes, and file offsets (size_t, not int)",
      "Packing flags into a single integer — how file permissions and network headers work",
      "Recognizing why if (x + 1 < x) is not a valid overflow check for signed x",
    ],
    lab: {
      title: "Bit Detective",
      scenario:
        "You're building the foundations for the binary file inspector you'll write soon. First you need total confidence manipulating raw integer representations: printing them, dissecting them, and predicting arithmetic at the edges.",
      outcome:
        "You can predict the bit-level result of C integer operations before running them, and you can spot overflow and signedness bugs in code review.",
      requirements: [
        "Write print_bits(uint32_t) producing the exact binary representation using only shifts and masks",
        "Demonstrate two's complement: print the bits of small negatives and verify the invert-and-add-one rule",
        "Write predictions for 10 expressions mixing signed/unsigned and widths (e.g. (unsigned)-1, INT_MAX+1 behavior, -1 > 0u) — then verify, with the UB cases clearly labeled as unpredictable",
        "Implement a flags system: define 5 permission bits, then set, clear, toggle, and test them with masks",
        "Compile the signed-overflow example at -O0 and -O2 and document any behavior difference",
      ],
      checkpoints: [
        "print_bits works without any library formatting help",
        "At least 7 of your 10 predictions were correct — and you can explain the misses",
        "You can state from memory which overflow is defined (unsigned wrap) and which is UB (signed)",
      ],
      hints: [
        "To read bit i: (x >> i) & 1. To set: x |= (1u << i). To clear: x &= ~(1u << i). Everything else composes from these.",
        "In any comparison mixing signed and unsigned, the signed side is converted to unsigned. Now re-examine -1 > 0u.",
        "Use -fsanitize=undefined — it turns invisible UB into loud runtime reports.",
      ],
      validation: [
        "The UB sanitizer confirms your labeled-UB cases and stays silent on the defined ones",
        "A classmate quizzes you with 5 new expressions; you predict at least 4",
      ],
      solutionOutline: [
        "Two's complement makes addition hardware uniform: the same adder works for signed and unsigned, which is exactly why C leaves signed overflow undefined — different hardware historically disagreed.",
        "UB means the standard imposes no requirements: the compiler optimizes assuming it never happens, which is how overflow checks written after the fact get deleted.",
        "Masks work because AND extracts, OR inserts, XOR flips — every binary protocol and permission system is these three ideas.",
      ],
      extensions: [
        "Implement popcount (count set bits) three ways and compare with Compiler Explorer",
        "Read a CVE caused by integer overflow in an allocation size and trace the arithmetic",
      ],
    },
    resources: {
      primary: [
        { ...R.benEaterTwos, guidance: "Watch it fully, then predict the bit patterns of -1, -128, and 255 as int8 before checking yourself." },
      ],
      alternatives: [
        { ...R.nand2tetris, note: "Weeks 1–2 build binary arithmetic from gates — the deepest possible grounding." },
      ],
      practice: [
        { ...R.godbolt, guidance: "Compile if (x + 1 < x) at -O2 and watch the compiler delete it — undefined behavior made visible." },
      ],
      extra: [
        { ...R.beejC, guidance: "Chapters on types and bitwise operations; read the integer conversion rules twice." },
        { ...R.cppref, guidance: "The 'implicit conversions' and 'operator precedence' pages are the exact rules when in doubt." },
      ],
    },
    masteryChecks: [
      "Convert between decimal, binary, and hex for a byte without a calculator",
      "Explain to a classmate why size_t for a length prevents a class of bugs that int invites",
      "Given malloc(n * sizeof(item)), describe the overflow attack when n is attacker-controlled and the safe pattern",
    ],
    securityNote:
      "Integer overflow in size calculations is a classic exploit primitive: wrap a size to a small number, get a small buffer, then write past it. Whenever arithmetic feeds an allocation or index, check bounds before the arithmetic, not after.",
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
    whyItMatters:
      "Pointers are why C exists and why it's still everywhere: they are how data structures, strings, I/O buffers, and hardware access actually work. Every language you'll learn later (Python references, JavaScript objects, Rust borrows) is a managed answer to the problems you master here in the raw.",
    prerequisiteIds: ["c-compilation"],
    concepts: [
      "Addresses, & and *, pointer types, and NULL",
      "Pointer arithmetic: p+1 moves by sizeof(*p), and why void* can't be walked",
      "Arrays vs. pointers: decay, sizeof differences, passing arrays to functions",
      "C strings: char arrays, the '\\0' terminator, and the buffer-size discipline",
      "Bounds: why C checks nothing, and what out-of-bounds actually corrupts",
      "Stack frames: locals' lifetimes, scope vs. storage duration, dangling pointers to dead frames",
      "Ownership conventions: who may read, who may write, who must not keep the pointer",
      "Pointers to pointers, and out-parameters for returning multiple values",
    ],
    practicalUses: [
      "Every dynamic data structure — the linked lists you already wrote are pointer discipline applied",
      "Parsing: walking a buffer with a cursor pointer is how every parser works",
      "Passing large data to functions without copying it",
    ],
    lab: {
      title: "String Library From Scratch",
      scenario:
        "You may not use string.h. Rebuild the essential toolkit — length, copy, compare, find, tokenize — against buffers you manage yourself, then use it to build a word-frequency reporter for real text files. This is the lab that makes pointers permanent.",
      outcome:
        "Pointer arithmetic, termination, and bounds-checking become reflexes; you can predict what any pointer expression does and explain each string.h function's contract because you've honored it yourself.",
      requirements: [
        "Implement my_strlen, my_strcpy_s (with destination size — safer than the real one), my_strcmp, my_strstr, and my_strtok_r using only pointer operations",
        "Every writing function must take and respect a destination capacity; document each function's ownership contract in a header comment",
        "Demonstrate three failure modes in a sandbox program: missing terminator, off-by-one overflow, dangling pointer to a returned local — and explain what each corrupts",
        "Build word-count: read a text file into a buffer, tokenize with your functions, and report the 10 most frequent words (a fixed-size table is fine for now)",
        "Compile everything with -Wall -Wextra -fsanitize=address and keep it clean",
      ],
      checkpoints: [
        "my_strlen and my_strcmp pass your test harness including empty strings",
        "The sandbox program's overflow is caught and explained by AddressSanitizer, and you can interpret its report",
        "word-count produces correct counts on a file you can verify by hand",
      ],
      hints: [
        "Write my_strlen with a walking pointer, not an index — while (*p) p++; — and prove to yourself they're equivalent.",
        "For strstr, the naive nested loop is correct and fine; clarity beats cleverness here.",
        "strtok_r's contract (mutates the buffer, hands out pieces of it) is an ownership lesson in itself — write that contract down before implementing.",
      ],
      validation: [
        "Differential test: for thousands of random inputs, your functions agree with string.h",
        "ASan and -Wall report nothing on the final build",
        "You can state, for each function, who owns the memory of every parameter and return value",
      ],
      solutionOutline: [
        "All C string functions are one idiom: walk a pointer until a sentinel, doing work per byte. Length, copy, and compare differ only in the per-byte action.",
        "Safe copying means the destination's capacity travels with the pointer — in C that's a second parameter and a written convention; in Rust it becomes the type system.",
        "The word counter composes: slurp file → tokenize in place → for each token, linear-search a table of (word, count) — and its slowness at scale is your motivation for hash tables shortly.",
      ],
      extensions: [
        "Add my_strdup using malloc — your first taste of heap ownership before the next topic",
        "Make word-count case-insensitive and punctuation-tolerant; notice how parsing dominates the code",
      ],
    },
    resources: {
      primary: [
        { ...R.cs50x, url: "https://cs50.harvard.edu/x/2025/weeks/4/", guidance: "Watch the Week 4 'Memory' lecture (~2 h) in full — pointers, strings, and memory drawn out on stage. This is the single best pointer lecture available; then do the lab." },
      ],
      alternatives: [
        { ...R.mycodeschoolPointers, guidance: "Lessons 1–10 cover pointers, arrays, and strings at a slower, whiteboard-drawing pace." },
      ],
      practice: [
        { ...R.pythonTutor, guidance: "Switch the language to C and step through small pointer programs — watch the arrows move as p++ runs." },
        { ...R.godbolt, guidance: "Watch a[i] and *(a+i) compile to identical assembly — decay made visible." },
      ],
      extra: [
        { ...R.beejC, guidance: "The pointers and strings chapters — read with a compiler open, not on the couch." },
        { ...R.cppref, guidance: "The pointer and array pages state the decay rules with precision." },
      ],
    },
    masteryChecks: [
      "Explain the difference between char *s, char s[10], and char *s[10] with memory diagrams",
      "Predict what a function returning &local does and why it sometimes 'works'",
      "State the contract of any of your functions — parameters, ownership, failure behavior — from memory",
    ],
    securityNote:
      "Buffer overflows — writing past array bounds — remain among the most exploited bug classes in history. The habit you build here (capacity travels with every buffer, every write is bounded) is the direct defense, and you'll attack its absence later in the security branch.",
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
    whyItMatters:
      "The heap is how programs handle data whose size is unknown at compile time — which is nearly all interesting data. Manual memory management is also the source of the most severe vulnerability classes in real software; mastering it makes you both a capable C programmer and, later, someone who understands what memory-safe languages are protecting you from.",
    prerequisiteIds: ["c-pointers-arrays"],
    concepts: [
      "Stack vs. heap: allocation speed, lifetime rules, and size limits",
      "malloc/calloc/realloc/free contracts, and checking for NULL",
      "Lifetime: use-after-free, double free, and leaks as lifetime violations",
      "Ownership: one owner per allocation; transfer, borrow, and document",
      "Amortized growth: doubling capacity and why it makes append O(1) on average",
      "realloc's trap: the old pointer may be dead after a successful call",
      "sizeof discipline and calloc for zeroed memory",
    ],
    practicalUses: [
      "Reading files of any size, growing buffers as needed",
      "Every dynamic structure ahead — lists, tables, trees — sits on these calls",
      "Understanding garbage collectors and Rust's borrow checker as automations of these rules",
    ],
    lab: {
      title: "Dynamic Text Buffer with Undo",
      scenario:
        "Build the beating heart of a text editor: a gap-free dynamic buffer supporting insert, delete, load, save — plus multi-level undo. Sizes are unknown in advance, edits happen anywhere, and nothing may leak. This is the canonical 'why the heap exists' project.",
      outcome:
        "You can design and defend an ownership scheme, grow memory correctly under realloc, and ship a genuinely useful component with zero leaks under Valgrind/ASan.",
      requirements: [
        "A TextBuffer struct owning a heap block with separate length and capacity, with create/destroy functions",
        "insert(buf, pos, text) and delete(buf, pos, n) working at any valid position, growing capacity by doubling when needed",
        "load_file and save_file handling arbitrary file sizes",
        "Undo: a stack of reverse operations (insert's undo is delete and vice versa) with its own clear ownership of stored text",
        "A small interactive REPL (insert/delete/print/undo/save/quit) to drive it",
        "Zero errors under AddressSanitizer and zero leaks on every exit path, including error paths",
      ],
      checkpoints: [
        "Append 100,000 single characters in a loop — completes instantly, proving amortized growth works",
        "Insert into the middle preserves both halves (memmove, not memcpy, for overlapping ranges)",
        "Undo after a mixed edit sequence restores the exact original, byte for byte",
        "Force realloc to move the block (grow hugely) and confirm no stale pointer is used",
      ],
      hints: [
        "Store length and capacity separately; the invariant length <= capacity should be assert()ed everywhere.",
        "For insert: grow if needed, memmove the tail right, then copy the new text into the gap.",
        "Undo entries must own copies of deleted text — pointing into the buffer breaks the moment it reallocs.",
        "Write destroy() first and call it from every exit path; leaks are prevented at design time, not found later.",
      ],
      validation: [
        "valgrind (WSL) or -fsanitize=address,leak reports zero leaks after a scripted 1000-operation session",
        "A fuzz loop of random valid operations runs 100k iterations without crash or leak",
        "Saving and reloading a file round-trips exactly (diff the files)",
      ],
      solutionOutline: [
        "The buffer is {char *data; size_t len, cap} with one owner: the TextBuffer. Every function preserves the invariant and documents whether it can realloc (invalidating outside pointers).",
        "Undo is a second ownership domain: a dynamic stack of {op, pos, char *text, size_t n} where text is a heap copy owned by the undo stack, freed when popped or cleared.",
        "Doubling capacity gives amortized O(1) appends: total copies across n appends sum to less than 2n — this analysis returns formally in Big-O.",
        "Error paths are the leak factory: the pattern 'goto cleanup' with a single free-everything block keeps them airtight.",
      ],
      extensions: [
        "Add redo (a second stack, cleared on new edits)",
        "Replace the flat buffer with a gap buffer and measure the speedup for repeated inserts at a cursor",
        "Add save-on-crash via an atexit handler",
      ],
    },
    resources: {
      primary: [
        { ...R.cs50x, url: "https://cs50.harvard.edu/x/2025/weeks/4/", guidance: "Rewatch the second half of the Week 4 'Memory' lecture: malloc, free, valgrind, and the classic heap bugs demonstrated live." },
      ],
      alternatives: [
        { ...R.mycodeschoolPointers, guidance: "The dynamic-memory lessons (malloc/calloc/realloc/free) if you want the same ground at a slower pace." },
      ],
      practice: [],
      extra: [
        { ...R.beejC, guidance: "The 'Manual Memory Allocation' chapter — the realloc section especially." },
        { ...R.ostep, guidance: "Chapter 14 (Memory API) and 17 (Free-Space Management) show the allocator's side of the contract." },
        { ...R.cppref, guidance: "The malloc/realloc/free pages are the precise contracts; note what realloc does on failure." },
      ],
    },
    masteryChecks: [
      "Name the four classic heap bugs and write a 5-line example of each",
      "Explain why p = realloc(p, n) loses memory on failure and write the correct pattern",
      "Given any function in your buffer, state who owns every pointer it touches",
    ],
    securityNote:
      "Use-after-free and heap overflow are top-tier exploit primitives — attackers reshape the heap so your stale pointer points at data they control. The single-owner discipline plus 'NULL after free' removes most of this class at the source.",
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
    whyItMatters:
      "Structs are how C models the world, and function pointers are how C programs stay flexible: qsort's comparator, event handlers, driver interfaces, and state machines all use them. Together they're also the mechanical truth behind 'objects' and 'interfaces' in every higher-level language.",
    prerequisiteIds: ["c-pointers-arrays"],
    concepts: [
      "Struct definition, initialization, nesting, and passing by value vs. by pointer",
      "Memory layout: alignment, padding, and why field order changes sizeof",
      "Enums as named integer states; switch with enums and the -Wswitch safety net",
      "Unions and tagged unions: one storage, many interpretations, tag says which",
      "Function pointer syntax, typedefs to keep it readable, and calling through them",
      "Callbacks: qsort's comparator as the canonical example",
      "Dispatch tables: arrays of function pointers replacing switch ladders",
    ],
    practicalUses: [
      "Modeling any domain: users, packets, tokens, game entities",
      "Sorting anything with qsort by writing only the comparison",
      "Event-driven code: 'call this when that happens' is a stored function pointer",
    ],
    lab: {
      title: "Pluggable Expression Calculator",
      scenario:
        "Build a calculator that evaluates expressions like '3 + 4 * 2' — but architected the professional way: tokens as tagged unions, operators in a dispatch table so new operations can be added without touching the evaluator, and qsort exercised on real records.",
      outcome:
        "You can design typed data (tagged unions with enums), route behavior through function-pointer tables, and read any C codebase that uses callbacks — which is all of them.",
      requirements: [
        "A Token type: enum tag (NUMBER, OPERATOR, LPAREN…) + union payload, with an invariant comment stating which tag implies which union member",
        "A tokenizer turning an input string into a dynamic array of Tokens (reuse your growth pattern)",
        "An OperatorDef table: {symbol, precedence, function pointer} — evaluation consults the table, never a hard-coded switch on '+'",
        "Add an operator (e.g. '%' or '^') by adding one table row and one small function, changing nothing else — prove it with a diff",
        "Separately: define a struct Song array and sort it three ways (title, duration, year) with qsort and three comparators",
      ],
      checkpoints: [
        "sizeof(Token) is explained: you can account for every byte including padding",
        "'2 + 3 * 4' yields 14, '(2 + 3) * 4' yields 20 — precedence works via the table, not special cases",
        "The new-operator diff touches only the table and the new function",
        "All three qsort orderings verified, including a descending one",
      ],
      hints: [
        "typedef double (*BinOpFn)(double, double); — name the function-pointer type once and the syntax pain vanishes.",
        "For evaluation with precedence, two stacks (values, operators) suffice — the shunting-yard idea; don't reach for full parsing theory yet.",
        "qsort's comparator receives const void* — cast to your struct pointer type inside, and return negative/zero/positive.",
      ],
      validation: [
        "A test file of 20 expressions (including malformed ones, which must error cleanly rather than crash) all pass",
        "Accessing the wrong union member for a tag is caught by an assert in a debug helper you wrote",
        "ASan-clean, as always",
      ],
      solutionOutline: [
        "Tagged unions are C's sum types: the enum tag is the single source of truth for which union member is live, and every access goes through that check — this exact pattern becomes Rust enums and TypeScript discriminated unions.",
        "The dispatch table inverts control: the evaluator is generic machinery, and behavior lives in data. Adding features stops meaning editing core logic — that's the open/closed principle, discovered rather than memorized.",
        "qsort shows the callback contract: the library owns the algorithm, you own the meaning of 'less than'.",
      ],
      extensions: [
        "Add unary minus — notice how it stresses your token design",
        "Add variables (x = 5) with a simple name→value table, foreshadowing hash tables",
        "Inspect struct padding with offsetof and reorder fields to shrink Token",
      ],
    },
    resources: {
      primary: [
        { ...R.mycodeschoolPointers, guidance: "Watch the final lessons of the playlist — 'Function Pointers' and 'Function Pointers and Callbacks' — with a compiler open. They make qsort's design click." },
      ],
      alternatives: [],
      practice: [
        { ...R.godbolt, guidance: "See that calling through a function pointer is one indirect call instruction — no magic." },
      ],
      extra: [
        { ...R.beejC, guidance: "Structs, unions, and the function-pointers chapter — the typedef trick is in there." },
        { ...R.cppref, guidance: "qsort's page shows the exact comparator contract with examples." },
      ],
    },
    masteryChecks: [
      "Write the type of 'pointer to function taking two doubles returning double' without looking it up",
      "Explain padding: why struct {char c; int i;} is 8 bytes on your machine",
      "Describe how you'd add an entirely new token kind and what the tag invariant demands",
    ],
    securityNote:
      "Function pointers are prime attack targets: corrupt one (via a buffer overflow) and the attacker redirects execution. This is why exploit mitigations like CFI exist — and why keeping buffers and function pointers apart in your struct layouts is defense in depth.",
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
    whyItMatters:
      "Every project on this roadmap from here on is multi-file, and every serious C codebase you'll ever read (Linux, Git, Redis, CPython) is organized this way. Make's dependency-graph model also reappears in every modern build tool, CI pipeline, and even Docker layer caching.",
    prerequisiteIds: ["c-structs-callbacks", "c-compilation"],
    concepts: [
      "Module = header (contract) + source (implementation); one responsibility each",
      "Opaque pointers: declaring struct Foo in the header, defining it privately — clients can't touch fields",
      "Include hygiene: headers include what they use, sources include their own header first",
      "Make: targets, prerequisites, recipes; the timestamp comparison at its core",
      "Variables, pattern rules (%.o: %.c), and automatic variables ($@, $<)",
      "Phony targets: all, clean, test",
      "Header dependencies: why changing a header must rebuild its includers (-MMD)",
    ],
    practicalUses: [
      "Structuring every C project ahead: src/, include/, tests/, Makefile",
      "One-command builds and test runs for you and anyone who clones your repo",
      "Reading real-world Makefiles instead of being scared of them",
    ],
    lab: {
      title: "Productionize the Text Buffer",
      scenario:
        "Your text buffer works but lives in two giant files. Restructure it into a real project: proper modules, an opaque public API, a Makefile with incremental builds, and a test target — the skeleton you'll reuse for every C project after this.",
      outcome:
        "You have a project template with real encapsulation and a correct incremental build, and you understand every line of its Makefile.",
      requirements: [
        "Restructure into include/textbuf.h (opaque TextBuffer*), src/textbuf.c, src/undo.c, src/main.c, tests/",
        "The public header exposes only functions and the opaque type — verify a client file cannot access buf->len directly",
        "Write a Makefile from scratch: variables for CC/CFLAGS, pattern rule for objects in a build/ dir, and targets all, test, clean",
        "Use -MMD -MP generated dependency files so editing any header rebuilds exactly the right objects",
        "Prove incrementality: touch one .c and show only it recompiles; touch the header and show dependents recompile",
      ],
      checkpoints: [
        "make from a clean checkout builds everything; make again does nothing ('up to date')",
        "make test builds and runs the test harness, failing the build on test failure",
        "The opaque-pointer refactor forced at least one new accessor function — you can explain why that's good",
      ],
      hints: [
        "Start with a dumb explicit Makefile (every file listed), then refactor to pattern rules — same as any code.",
        "Recipes must be indented with a TAB, not spaces. Yes, really. Yes, still.",
        "The opaque idiom: header says 'typedef struct TextBuffer TextBuffer;' — the full struct lives only in the .c file.",
      ],
      validation: [
        "Delete build/ and rebuild — reproducible from scratch",
        "Introduce a compile error in one module: make stops there and a fix rebuilds minimally",
        "A classmate can clone, run make test, and add a test without asking you anything",
      ],
      solutionOutline: [
        "Make is a dependency graph evaluator: each target rebuilds iff any prerequisite is newer, recursively. Everything else is syntax over that one idea.",
        "Opaque pointers give C true encapsulation: clients compile against the promise, so you can change the struct freely — the same force behind interfaces and API versioning later.",
        "The -MMD flag makes the compiler emit the true header dependencies, closing the gap where Make would otherwise miss header edits.",
      ],
      extensions: [
        "Add make debug / make release with different flag sets",
        "Add a make check target running the fuzz loop under ASan",
        "Read Git's Makefile for 10 minutes and identify three ideas you now recognize",
      ],
    },
    resources: {
      primary: [
        { ...R.missingSemester, url: "https://missing.csail.mit.edu/2020/metaprogramming/", guidance: "Watch the build-systems half of the Metaprogramming lecture (~30 min) and do exercise 1 — writing a Makefile from scratch." },
      ],
      alternatives: [
        { ...R.makefileTutorial, guidance: "Work through 'Getting Started' and 'Targets' — run every example; it's built for exactly that." },
      ],
      practice: [],
      extra: [
        { ...R.beejC, guidance: "The multifile-projects chapter, plus Make coverage." },
      ],
    },
    masteryChecks: [
      "Explain, for a given change, exactly which files Make will rebuild and why",
      "Defend opaque pointers to a skeptic: what breaks when clients can see struct fields?",
      "Write a minimal 10-line Makefile for a new 3-file project from memory",
    ],
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
    whyItMatters:
      "Real programs live on files: configs, saves, databases, images, network payloads written to disk. And parsing untrusted bytes is where C programs historically get owned — the habits here (validate lengths before trusting them, check every return value) are the difference between software and a security incident.",
    prerequisiteIds: ["c-heap-lifetime"],
    concepts: [
      "FILE* lifecycle: fopen modes, fclose, and why unclosed files lose data",
      "Text I/O: fgets (never gets), line parsing, locale-independent thinking",
      "Binary I/O: fread/fwrite, records, file headers with magic numbers and versions",
      "fseek/ftell: random access and computing record offsets",
      "Endianness: why writing raw ints isn't portable, and byte-order functions",
      "errno, perror, and designing error returns (codes vs. sentinel values)",
      "Defensive parsing: length fields are claims, not facts — validate against file size and sane limits",
    ],
    practicalUses: [
      "Save/load for any application state",
      "Reading real formats: BMP headers, WAV chunks, archive indexes",
      "Every network protocol parser is this skill pointed at sockets instead of files",
    ],
    lab: {
      title: "Binary File Inspector",
      scenario:
        "Build a hex-dump-plus tool: given any file, print a classic hex/ASCII view; given known formats (start with BMP images), parse and display the header fields — dimensions, bit depth, data offset — while surviving hostile, truncated, and lying files without a single crash.",
      outcome:
        "Binary data holds no fear: you can open any file format specification and write a robust parser for it, and defensive validation is a reflex.",
      requirements: [
        "hexdump mode: 16 bytes per line, offset column, hex bytes, printable-ASCII gutter — for files of any size (buffered, not slurped)",
        "BMP mode: parse the 54-byte header, print each field with its meaning, and detect non-BMP files by magic number",
        "Validation everywhere: declared image size vs. actual file size, dimensions within sane limits, data offset inside the file — every violation is a clean error message, never a crash",
        "Build a truncation-fuzzer script: feed the inspector the same BMP cut at every length from 0 to full; zero crashes allowed",
        "Every fopen/fread/fseek checked; errors reach main() as codes and become messages with perror context",
      ],
      checkpoints: [
        "Hexdump of a known small file matches xxd's output",
        "A real photo's parsed dimensions match what your OS reports",
        "The truncation fuzzer completes clean under ASan",
        "A file claiming width=2 billion is rejected with a helpful message before any allocation",
      ],
      hints: [
        "Read the header into a struct field-by-field rather than fread-ing the whole struct — padding and endianness make the 'easy' way wrong.",
        "The golden rule of parsing: never allocate or loop based on an untrusted number you haven't bounded first.",
        "isprint() decides the ASCII gutter; everything else prints as '.'",
      ],
      validation: [
        "Byte-compare hexdump output with xxd on 5 diverse files",
        "The fuzzer script is in the repo and runs via make fuzz",
        "Code review checklist: every I/O return value is inspected — grep for fread and verify each",
      ],
      solutionOutline: [
        "The inspector is a loop over a fixed buffer (fread up to 16 bytes, print, repeat) — constant memory regardless of file size.",
        "Format parsing is: read magic → verify → read header fields individually (explicit little-endian assembly from bytes) → validate every field against physical reality (file size, limits) → only then trust it.",
        "Error strategy: leaf functions return int codes and set context; main translates to human messages. No exits from the middle of the library — cleanup stays possible.",
      ],
      extensions: [
        "Add WAV support and print duration from the header — a second format proves your architecture generalizes",
        "Add a --search mode finding a byte pattern's offsets",
        "Write a tiny format of your own (magic, version, records) with a writer and a round-trip test",
      ],
    },
    resources: {
      primary: [
        { ...R.cs50x, url: "https://cs50.harvard.edu/x/2025/weeks/4/", guidance: "Watch the file-I/O portion of the Week 4 lecture (the final third): fopen, fread, and parsing real file formats — exactly this lab's territory." },
      ],
      alternatives: [],
      practice: [],
      extra: [
        { ...R.beejC, guidance: "The File I/O chapters, including binary I/O." },
        { ...R.cppref, guidance: "fread/fseek/errno pages — the exact failure semantics live here." },
        { ...R.ostep, guidance: "The persistence chapters explain what the OS does beneath your fwrite." },
      ],
    },
    masteryChecks: [
      "Explain the difference between fread returning 0 and returning less than requested",
      "Given a new binary format's spec sheet, outline a robust parser's checks in order",
      "Spot the vulnerability: code that mallocs a size read from a file header, unvalidated",
    ],
    securityNote:
      "File parsers are a top attack surface — image and document parsers have yielded countless remote-code-execution bugs. The rule from this lab, 'a length field is a claim to verify, not a fact to trust,' is the core of secure parsing everywhere.",
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
    whyItMatters:
      "C's worst bugs are invisible: they corrupt memory silently and crash somewhere else, later. These tools make the invisible visible — the difference between debugging by superstition and debugging by observation. Every systems, embedded, and security role assumes fluency here.",
    prerequisiteIds: ["c-heap-lifetime", "debugging-errors"],
    concepts: [
      "Compiling for debug: -g, -Og, and why optimized code confuses debuggers",
      "GDB: run, break, next/step, print, backtrace, frame, watch",
      "Postmortem debugging: core dumps and finding where a crash happened after the fact",
      "AddressSanitizer: out-of-bounds and use-after-free caught at the guilty line",
      "UndefinedBehaviorSanitizer: overflow, bad shifts, null misuse",
      "Valgrind memcheck: leaks and uninitialized reads (in WSL)",
      "-Wall -Wextra -Werror as a habit, and reading warnings as bug predictions",
    ],
    practicalUses: [
      "Finding the line that corrupted memory instead of the line that crashed",
      "Certifying every lab in this roadmap leak-free before calling it done",
      "Watchpoints: 'tell me the instant this variable changes' for impossible-seeming bugs",
    ],
    lab: {
      title: "Crime Scene Investigation",
      scenario:
        "Take your text buffer or a data-structure lab and plant five distinct memory crimes in a branch: an off-by-one write, a use-after-free, a leak on an error path, an uninitialized read, and a signed overflow. Then solve each one with the right tool — chosen deliberately.",
      outcome:
        "You know which tool catches which crime, can drive GDB without the IDE, and every future lab ships with a sanitizer-clean certification because it's easy now.",
      requirements: [
        "For each planted bug: document which tools detect it, which stay silent, and why",
        "Use GDB to diagnose the use-after-free without sanitizers first: break, inspect, backtrace — then confirm with ASan and compare effort",
        "Set a watchpoint to catch the off-by-one at the moment of the corrupting write",
        "Produce and analyze a core dump: cause a crash, load the core in GDB, and identify the faulting line postmortem",
        "Run Valgrind in WSL on the leak version and interpret the leak report's stack trace",
        "Add sanitizer and warning flags to your project template's Makefile as a debug target",
      ],
      checkpoints: [
        "A completed tool-vs-bug matrix with 'why' notes",
        "backtrace output screenshotted at the moment of each diagnosis",
        "The watchpoint fired exactly at the guilty write, not at the crash",
        "Your Makefile template now has make debug with -g -fsanitize=address,undefined -Wall -Wextra",
      ],
      hints: [
        "ASan reports two stacks for use-after-free: where it was freed and where it was used — read both.",
        "watch buf->data[10] needs the variable in scope; break first, then set the watchpoint.",
        "ulimit -c unlimited enables core dumps in WSL; gdb ./app core loads one.",
        "Valgrind and ASan don't combine — one at a time.",
      ],
      validation: [
        "A classmate plants a sixth, secret bug; you find it in under 20 minutes using the matrix",
        "You can narrate a GDB session from memory: compile flags, launch, break, inspect, quit",
      ],
      solutionOutline: [
        "The tools partition the crime space: warnings catch what's provable at compile time; ASan instruments every memory access with redzones and quarantine; UBSan instruments arithmetic; Valgrind interprets the binary watching definedness; GDB observes anything but detects nothing by itself.",
        "The professional workflow: max warnings always → sanitizers during all development → GDB when you need to interrogate → Valgrind for final leak certification.",
        "Watchpoints use CPU debug registers — hardware watching an address for you, which is why they're magic for 'who is changing this?' bugs.",
      ],
      extensions: [
        "Learn gdb --args and conditional breakpoints (break if n > 100)",
        "Try rr (record and replay) in WSL for reverse debugging",
        "Read one real CVE writeup and identify which tool would have caught it in development",
      ],
    },
    resources: {
      primary: [
        { ...R.missingSemester, url: "https://missing.csail.mit.edu/2020/debugging-profiling/", guidance: "Watch the debuggers segment (GDB demoed live) and do the debugging exercises; you met the logging half back in Reading Errors." },
      ],
      alternatives: [
        { ...R.beejGdb, guidance: "A 30-minute read that gets GDB working under your fingers — do it at a terminal, not on the couch." },
      ],
      practice: [
        { ...R.godbolt, guidance: "Seeing the instrumented assembly ASan emits demystifies how it catches accesses." },
      ],
      extra: [
        { ...R.gdbDocs, guidance: "Keep the command reference open; learn 10 commands well rather than 100 vaguely." },
      ],
    },
    masteryChecks: [
      "Given a bug description, name the fastest tool to localize it and defend the choice",
      "Drive a full GDB session — breakpoints, stepping, printing struct fields through pointers — without notes",
      "Explain why a use-after-free can 'work fine' for months and what ASan changes",
    ],
    securityNote:
      "These are dual-use tools: the same GDB and memory-inspection skills you use to fix corruption are what security researchers use to understand and exploit it. Mastering them now is the foundation for the memory-safety security topics later.",
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
    whyItMatters:
      "These structures run the world quietly: OS schedulers are queues, every editor's undo is a stack, LRU caches are linked lists. Interviews test them, but more importantly, recognizing 'this problem is a queue' is a design skill that never expires.",
    prerequisiteIds: ["c-heap-lifetime", "c-structs-callbacks"],
    concepts: [
      "Singly vs. doubly linked lists: trade-offs in memory, complexity, and capability",
      "Sentinel nodes and why they delete half your edge cases",
      "Cursors: stable references into a mutating sequence — and when they invalidate",
      "Stack discipline (LIFO) and its natural fits: undo, parsing, call stacks",
      "Queue discipline (FIFO) and fairness: schedulers, buffers, message passing",
      "Ring buffers: a queue in an array, and why it's often better than nodes",
      "Choosing: array-backed vs. node-backed for each, with the real costs",
    ],
    practicalUses: [
      "Playlists, browser history, most-recently-used lists",
      "Undo/redo in every serious application",
      "Work queues: print jobs, download managers, thread pools later",
    ],
    lab: {
      title: "Playlist Manager + Job Queue",
      scenario:
        "Two connected builds. First: a music playlist manager (doubly-linked) with a play cursor, insert-anywhere, reorder, and history. Second: a simulated download manager where jobs queue up FIFO, get processed, and can be cancelled — with the queue as a ring buffer.",
      outcome:
        "Node manipulation under ownership discipline is second nature, and you've felt why doubly-linked beats singly for cursors, and why a ring buffer beats nodes for a bounded queue.",
      requirements: [
        "Playlist: doubly-linked list with sentinel; operations: append, insert-after-current, remove-current (cursor moves sensibly), move-track-up/down, print-from-current",
        "History: every played track pushes onto a stack; 'back' pops it — implement the stack over your own list or array, your call, but justify it",
        "Job queue: fixed-capacity ring buffer of job structs; enqueue, dequeue, cancel-by-id (mark-cancelled, skip on dequeue); reject enqueue when full with a clear error",
        "Both drive from a small command REPL and are ASan/leak-clean including on quit mid-state",
        "A written half-page comparing: what broke or got ugly when you tried each design choice's alternative",
      ],
      checkpoints: [
        "Removing the current track behaves correctly at head, tail, and single-element cases — sentinel earning its keep",
        "History correctly replays a listening session backwards",
        "The ring buffer wraps: fill, drain 3, add 3 — indexes wrap without moving memory",
        "Cancel of a mid-queue job doesn't shift anything — lazily skipped at dequeue",
      ],
      hints: [
        "Draw every list operation as boxes and arrows before coding; update pointers in an order that never orphans a node.",
        "Sentinel version: head and tail cases disappear because there is always a node before and after.",
        "Ring buffer: head, tail, and count (or leave one slot empty); index arithmetic is (i + 1) % capacity.",
      ],
      validation: [
        "A scripted session of 200 random valid operations on each structure runs leak-free",
        "Deliberately test the classic traps: remove last element, dequeue from empty, insert into empty",
        "Your comparison write-up names concrete costs (allocations per op, cache behavior), not vibes",
      ],
      solutionOutline: [
        "The playlist's cursor is why doubly-linked wins: O(1) remove-at-cursor needs the previous pointer that singly-linked can't give you.",
        "The undo/history stack works because reversal is inherently LIFO — the shape of the problem is the shape of the structure.",
        "The ring buffer wins for the job queue because capacity is naturally bounded (backpressure!) and array locality beats pointer chasing — a preview of why real systems love arrays.",
      ],
      extensions: [
        "Add shuffle that preserves the ability to un-shuffle (hint: store the permutation)",
        "Give jobs priorities and note how the queue starts wanting to be a heap — foreshadowing",
        "Save/load the playlist with your binary I/O skills",
      ],
    },
    resources: {
      primary: [
        { ...R.cs50x, url: "https://cs50.harvard.edu/x/2025/weeks/5/", guidance: "Watch the Week 5 'Data Structures' lecture (~2 h): linked lists built pointer by pointer on stage, with the classic orphaned-node mistakes shown live." },
      ],
      alternatives: [
        { ...R.fisetDS, guidance: "Use the chapter markers: the 'Linked List', 'Stack', and 'Queue' chapters (~90 min total) for a diagram-first treatment." },
      ],
      practice: [
        { ...R.visualgo, guidance: "Open the Linked List visualization — watch insert and remove animate before writing them, then quiz yourself in Training mode." },
      ],
      extra: [
        { ...R.opendsa, guidance: "The lists/stacks/queues chapters with interactive exercises." },
        { ...R.beejC, guidance: "For the C mechanics of nodes and pointers-to-pointers." },
      ],
    },
    masteryChecks: [
      "Implement remove-node in a doubly-linked list on a whiteboard, handling all positions",
      "For three scenarios (browser back button, print spooler, matched brackets), name the structure and justify it",
      "Explain when a dynamic array beats a linked list even for frequent insertion — and why (cache)",
    ],
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
    whyItMatters:
      "Python dicts, JavaScript objects, database indexes, caches, symbol tables in compilers, session stores — hash tables are the answer to 'find it fast by name' everywhere. Building one demystifies half the standard library of every language you'll ever use.",
    prerequisiteIds: ["c-lists-stacks-queues"],
    concepts: [
      "Hash functions: determinism, uniformity, and avalanche; FNV-1a as a solid default",
      "From hash to index: modulo table size, and why table size choice matters",
      "Collisions: pigeonhole makes them certain; chaining vs. open addressing responses",
      "Load factor, resizing, and rehashing every entry",
      "Deletion: trivial with chaining, tombstones with open addressing",
      "Key ownership: does the table copy keys or borrow them? (Decide and document)",
      "Average O(1) vs. worst O(n), and hash-flooding as the adversarial case",
    ],
    practicalUses: [
      "Lookup tables of every description: config, symbol tables, caches",
      "Deduplication: 'have I seen this before?' in one line",
      "Counting: the word-frequency problem from the strings lab, now at proper speed",
    ],
    lab: {
      title: "Indexed Contact Database",
      scenario:
        "Build a contact book that stays fast at 100,000 entries: hash-table index by name (and by phone — two indexes over one dataset), persistence to disk with your binary I/O, and a benchmark proving the point of the whole exercise against linear search.",
      outcome:
        "You own a working, resizing, leak-free hash table you actually understand — and a measured, visceral sense of what O(1) vs O(n) means at scale.",
      requirements: [
        "A generic-enough table: string key → void* value, with create/put/get/remove/destroy and documented key-ownership policy (recommend: table copies keys)",
        "FNV-1a hashing, chaining for collisions, and automatic resize at load factor 0.75 with full rehash",
        "The contact app: add/find/remove contacts, with two tables indexing the same contact records by name and phone — forcing you to think about shared ownership of records",
        "Persistence: save/load contacts in a binary format with a header (magic, version, count), rebuilding indexes on load",
        "Benchmark: generate 100k synthetic contacts; time find-by-name via table vs. linear array scan; report both and the ratio",
      ],
      checkpoints: [
        "Collision handling verified: force two known-colliding keys and confirm both retrievable",
        "Resize triggered under test: watch capacity jump and verify all entries survive rehash",
        "Both indexes stay consistent after removals — deleting a contact removes it from name and phone tables",
        "Benchmark shows the table beating linear scan by orders of magnitude at 100k",
      ],
      hints: [
        "Write and unit-test the table alone (with your C harness) before the contact app touches it.",
        "Resize: allocate a new bucket array, re-insert every entry using the new size's modulo, free the old buckets — entries rehash because index depends on table size.",
        "Two indexes over one record means the record has one owner (a master list) and the tables borrow — write this down before coding, it prevents the double-free.",
      ],
      validation: [
        "Unit tests: put/get/remove/update, collisions, resize, 10k random ops mirrored against a slow-but-obviously-correct array implementation",
        "ASan and Valgrind clean, including remove-heavy workloads",
        "Save → load → verify all 100k contacts findable by both keys",
      ],
      solutionOutline: [
        "The table is an array of bucket heads; each bucket a short linked list of {owned key copy, value, next}. put = hash → index → search chain → update or prepend.",
        "Resizing keeps chains short: at load 0.75, average chain length stays ~1, which is the entire 'O(1) average' claim — you'll verify it by counting.",
        "The two-index design teaches the pattern behind every database: data stored once, multiple access paths borrowing it — and index maintenance on every mutation.",
      ],
      extensions: [
        "Implement open addressing (linear probing + tombstones) and benchmark against chaining",
        "Track and print chain-length distribution — connect it to the probability topic later",
        "Add prefix search and notice hash tables can't do it — your motivation for trees, next",
      ],
    },
    resources: {
      primary: [
        { ...R.cs50x, url: "https://cs50.harvard.edu/x/2025/weeks/5/", guidance: "Rewatch the hash-table segment of the Week 5 lecture — chaining demonstrated with actual buckets and collisions." },
      ],
      alternatives: [
        { ...R.fisetDS, guidance: "The 'Hash Table' chapters: separate chaining and open addressing with diagrams (~1 h)." },
      ],
      practice: [
        { ...R.visualgo, guidance: "Open the Hash Table visualization — watch chaining and probing collide and resolve, then try Training mode." },
      ],
      extra: [
        { ...R.opendsa, guidance: "The hashing chapters, with exercises on probe sequences and load factor." },
      ],
    },
    masteryChecks: [
      "Explain why collisions are mathematically unavoidable and how chaining copes",
      "Walk through a resize by hand for a 4-bucket table growing to 8",
      "Given a workload (needs ordering? needs prefix search? pure lookup?), decide table vs. tree and defend it",
    ],
    securityNote:
      "Hash flooding is a real attack: an adversary who can predict your hash function sends thousands of colliding keys, degrading your table to O(n) and your service to a crawl. This is why languages randomize hash seeds — remember it when your keys come from strangers.",
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
    whyItMatters:
      "The filesystem you use daily, the DOM your browser renders, the JSON your APIs exchange, and the B-tree indexes inside every database are all trees. After hash tables, BSTs answer the questions hashing can't: 'in order', 'nearest', 'in this range'.",
    prerequisiteIds: ["c-lists-stacks-queues"],
    concepts: [
      "Tree vocabulary: root, leaf, depth, height — and trees as recursive structures",
      "N-ary trees for hierarchy: parent/child/sibling representations",
      "Traversals: pre-order (copy/serialize), post-order (free/size), in-order (sorted), level-order (BFS)",
      "BST invariant, insert, search, and the three deletion cases",
      "Balance: why sorted input degrades a BST to a list; awareness of AVL/red-black as the fix (concept, not implementation)",
      "Recursion vs. explicit stack for traversal — they're the same thing",
      "Serializing trees to disk and rebuilding them",
    ],
    practicalUses: [
      "Filesystem operations: du, find, and tree are all traversals",
      "Autocomplete and range queries: 'names between K and M'",
      "Parsing: your calculator's expressions secretly formed a tree — later compilers make it explicit",
    ],
    lab: {
      title: "Directory Tree Indexer",
      scenario:
        "Build a 'du + find' of your own: scan a real directory tree into an n-ary tree in memory, compute recursive sizes, answer queries — then add a BST index over file names so lookup doesn't require re-walking the hierarchy.",
      outcome:
        "Recursive tree thinking is natural, you've used both tree species for their true purposes on real data, and post-order freeing is burned in.",
      requirements: [
        "Scan a directory (opendir/readdir in WSL, or a manifest file on Windows) into nodes {name, size, is_dir, children}",
        "Compute total size per directory via post-order traversal; print the tree with indentation via pre-order (this is the tree command)",
        "Queries: find-by-name (full traversal), largest-N files (any approach), path-of(node) by walking parents",
        "Add a BST keyed on filename holding pointers into the n-ary tree; find-by-name now searches the BST — measure both on a big directory",
        "In-order traversal of the BST prints all files alphabetically — for free; explain why",
        "Free everything post-order; ASan-clean on trees of 50k+ nodes",
      ],
      checkpoints: [
        "Your computed sizes match du -sb (WSL) on a real directory",
        "The indented print visually matches tree's structure",
        "BST search beats full traversal measurably on 50k files",
        "Sorted-input degradation demonstrated: insert 10k sorted names, time the searches, explain the sadness",
      ],
      hints: [
        "Every tree function is: handle this node + recurse on children. If yours is longer than ~10 lines, you're fighting the shape.",
        "Post-order for sizes because a directory's size needs its children's sizes first — the traversal order is the data dependency.",
        "BST delete: leaf = snip; one child = splice; two children = swap with in-order successor, then delete that. Draw it before coding.",
      ],
      validation: [
        "Unit tests for BST ops including the two-children deletion case",
        "Sizes cross-checked against the OS on two different directories",
        "The 'free' traversal verified: Valgrind zero leaks on a large scan",
      ],
      solutionOutline: [
        "The n-ary tree mirrors the filesystem because the filesystem is a tree — scanning is one recursive function that reads a directory, creates a node, and recurses into subdirectories.",
        "The BST is a second access path (like the hash table's second index): hierarchy for structure, BST for ordered lookup — data structures composed, not chosen once.",
        "In-order traversal yields sorted order because the BST invariant is the sort, distributed across the structure.",
      ],
      extensions: [
        "Detect the largest duplicate-size candidates and check contents — previewing the Python duplicate-finder",
        "Serialize the scanned tree to your own binary format and reload it (pre-order with child counts)",
        "Read about B-trees and write one paragraph on why databases fatten tree nodes to page size",
      ],
    },
    resources: {
      primary: [
        { ...R.cs50x, url: "https://cs50.harvard.edu/x/2025/weeks/5/", guidance: "Watch the trees and tries segment of the Week 5 lecture — why hierarchy needs pointers, and what ordering buys you." },
      ],
      alternatives: [
        { ...R.fisetDS, guidance: "The 'Binary Search Tree' chapters, including all three deletion cases (~1 h)." },
      ],
      practice: [
        { ...R.visualgo, guidance: "BST page: run insert, search, and all three deletion cases in step mode before coding them." },
      ],
      extra: [
        { ...R.opendsa, guidance: "The trees chapters, with proofs and exercises for traversal orders." },
        { ...R.ostep, guidance: "The filesystem chapters show your lab's structure living inside the OS for real." },
      ],
    },
    masteryChecks: [
      "Write in-order traversal both recursively and with an explicit stack, and explain their equivalence",
      "Perform BST deletion (two-children case) on a whiteboard correctly",
      "For four query types (exact lookup, range, prefix, 'give me everything sorted'), pick hash table vs. BST and justify each",
    ],
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
    whyItMatters:
      "Maps, social networks, the internet, build systems, task schedulers, and dependency resolution are all graph problems. Recognizing 'this is a graph' converts many impossible-seeming problems into two standard traversals — and this very roadmap's prerequisite arrows are the data structure you're about to build.",
    prerequisiteIds: ["c-trees", "c-hash-tables"],
    concepts: [
      "Vertices, edges, directed/undirected, weighted/unweighted, and modeling choices",
      "Adjacency list vs. adjacency matrix: memory and access trade-offs",
      "BFS with a queue: reachability and fewest-hops paths",
      "DFS with recursion/stack: exhaustive exploration and structure discovery",
      "Cycle detection (directed): the three-color scheme",
      "Topological sort: ordering under dependencies; why cycles make it impossible",
      "Connected components; trees as the acyclic special case",
    ],
    practicalUses: [
      "Route finding: transit maps, network hops, game maps",
      "Build and package systems: what must compile before what",
      "'People you may know', crawlers, and dead-code detection are all traversals",
    ],
    lab: {
      title: "Course Prerequisite Planner",
      scenario:
        "Model your own university curriculum (or this roadmap's data!) as a directed graph of prerequisites. Load it from a file, answer real questions: what order can I take everything in? What does course X unlock? Someone added a circular prerequisite — find it and report the cycle.",
      outcome:
        "You can model a real domain as a graph, implement BFS/DFS/toposort from scratch, and you've built the algorithm that powers Make, npm, and this site's own roadmap layout.",
      requirements: [
        "Parse a text file of 'course -> prerequisite' pairs into an adjacency list (reuse your hash table for name → vertex id)",
        "DFS-based cycle detection reporting the actual cycle path, not just 'cycle exists'",
        "Topological sort (DFS post-order or Kahn's) producing a valid study order; refuse gracefully when cycles exist",
        "BFS 'unlocks' query: everything reachable from course X, grouped by distance (semesters away)",
        "'Critical path': the longest prerequisite chain, and why that bounds fastest completion",
        "All under your test harness with a known small graph whose answers you verified by hand",
      ],
      checkpoints: [
        "A hand-drawn 8-node graph's toposort matches your program's (any valid order — verify the property, not one answer)",
        "A planted A→B→C→A cycle is reported as that exact path",
        "The 'unlocks' output for a foundation course looks obviously right",
        "Works on a 500+ node generated graph without recursion blowing the stack (or you switched to iterative and say so)",
      ],
      hints: [
        "Vertex ids: hash table maps names to dense integers; all algorithms then work on int arrays — the standard trick.",
        "Three colors for cycle detection: white unvisited, gray in-progress, black done. A gray→gray edge is your cycle; walk the recursion path to print it.",
        "Kahn's algorithm is just: repeatedly remove vertices with zero remaining prerequisites — a queue and an in-degree array.",
        "Validating a toposort: for every edge u→v, u appears before v. Check that, not sameness with your hand answer.",
      ],
      validation: [
        "Property test: 100 random DAGs, every toposort output passes the edge-order check",
        "Cycle test: random graphs with one planted cycle — always found",
        "Leak-free on the 500-node graph including the error (cycle) path",
      ],
      solutionOutline: [
        "Adjacency list: array of edge-lists indexed by vertex id — your dynamic array and hash table composing into a new structure.",
        "BFS's queue explores by distance rings, which is why it finds fewest-hop paths; DFS's stack dives deep, which is why post-order finish times encode dependency order.",
        "Toposort via DFS: a vertex finishes only after everything it depends on — reverse finish order is a valid schedule. Kahn's is the same truth from the other end.",
      ],
      extensions: [
        "Add weights (course difficulty) and find the 'heaviest' path with a DAG longest-path pass",
        "Export to Graphviz DOT format and render your curriculum visually",
        "Dijkstra on a small weighted map — the bridge to the CS branch's shortest-paths topic",
      ],
    },
    resources: {
      primary: [
        { ...R.fisetGraphs, guidance: "Watch 'Graph Theory Introduction', the BFS and DFS chapters, and 'Topological Sort' (~2 h total). Skip shortest paths for now — the CS branch returns for them." },
      ],
      alternatives: [
        { ...R.mitMath, note: "The graph-theory lectures if you want the mathematical grounding early." },
      ],
      practice: [
        { ...R.visualgo, guidance: "Graph Traversal page: run BFS and DFS side by side on the same graph and predict each step." },
      ],
      extra: [
        { ...R.opendsa, guidance: "Graph chapters with formal treatment of traversal properties." },
      ],
    },
    masteryChecks: [
      "Model three scenarios (flight routes, #include relationships, social follows) as graphs: directed? weighted? what are the vertices?",
      "Explain why BFS finds shortest unweighted paths and DFS doesn't",
      "Hand-run Kahn's algorithm on a 6-node DAG and state what a nonempty remainder proves",
    ],
  },
];
