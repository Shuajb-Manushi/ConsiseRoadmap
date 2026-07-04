import type { TopicDraft } from "../types";
import { R } from "../resourceCatalog";

export const systemsTopics: TopicDraft[] = [
  {
    id: "systems-architecture-asm",
    title: "CPU, Assembly & Calling Conventions",
    branch: "systems",
    stage: 1,
    required: true,
    difficulty: "advanced",
    estimatedHours: 12,
    summary:
      "What your C actually becomes: registers, the instruction cycle, a readable subset of x86-64 assembly, the stack at the instruction level, and calling conventions — how arguments, returns, and the call stack really work. You've seen assembly in Compiler Explorer; now you can read it.",
    whyItMatters:
      "Understanding the machine beneath your code demystifies performance, undefined behavior, and — crucially for your goals — memory-corruption security. Reading assembly is the ground truth when high-level reasoning runs out, and it's the entry ticket to reverse engineering and low-level security work.",
    prerequisiteIds: ["c-debug-tools", "c-integers-bits"],
    concepts: [
      "CPU model: registers, ALU, the fetch-decode-execute cycle, the program counter",
      "A readable x86-64 subset: mov, arithmetic, cmp/jmp, call/ret",
      "The stack at instruction level: push/pop, the stack pointer, stack frames",
      "Calling conventions: argument registers, return values, caller/callee-saved, the return address on the stack",
      "Mapping C to assembly: locals, loops, and function calls in Compiler Explorer",
      "How optimization transforms code; why -O2 assembly barely resembles the source",
    ],
    practicalUses: [
      "Understanding performance and what the compiler really does",
      "Debugging at the disassembly level when source-level fails",
      "The foundation for reverse engineering and memory-corruption security",
    ],
    lab: {
      title: "Read the Machine",
      scenario:
        "Systematically build assembly literacy: take small C functions (arithmetic, a loop, a recursive call, a struct access) and, in Compiler Explorer and GDB, trace exactly how each maps to instructions and how the stack evolves across a function call — culminating in diagramming a stack frame at the moment of a call.",
      outcome:
        "You can read a function's disassembly, follow the stack across calls, and explain how arguments, locals, and return addresses are laid out — the literacy underpinning low-level debugging and security.",
      requirements: [
        "For five small C functions, produce and annotate the assembly (Compiler Explorer), explaining each instruction's role",
        "In GDB, single-step through a function call at the instruction level (stepi), watching registers and the stack pointer change",
        "Diagram a stack frame precisely at the point of a nested call: arguments, saved return address, saved base pointer, locals — and verify it against GDB's actual memory",
        "Trace a recursive call two levels deep and show the stack of frames growing (connect to your recursion lab)",
        "Compare -O0 and -O2 assembly for one function and explain two specific optimizations the compiler made",
      ],
      checkpoints: [
        "You can point to the instruction that reads a function's first argument and say which register",
        "Your hand-drawn stack frame matches GDB's memory layout",
        "The recursion's growing frame stack is visible in GDB backtrace and matches your diagram",
        "You correctly identified real optimizations in the -O2 output",
      ],
      hints: [
        "Start at -O0 where assembly tracks source closely; only tackle -O2 once the basics are solid.",
        "The return address is pushed by call and popped by ret — this single fact is the seed of stack-smashing attacks you'll study later.",
        "info registers and x/ (examine memory) in GDB let you see the stack frame's bytes directly.",
      ],
      validation: [
        "A classmate quizzes you on an unseen small function's assembly; you explain the argument passing and return",
        "Your stack-frame diagram is verified byte-accurate against the debugger",
      ],
      solutionOutline: [
        "The CPU executes a simple loop (fetch, decode, execute) over instructions that move data between registers and memory; C's abstractions (variables, calls, loops) all compile down to this.",
        "The calling convention is a contract: which registers hold arguments and returns, who preserves what, and where the return address lives — understanding it is what makes cross-function debugging and exploitation comprehensible.",
        "Stack frames are the runtime realization of your recursion and scope knowledge: each call pushes a frame, return pops it, and corrupting a frame's return address is the mechanism behind classic exploits.",
      ],
      extensions: [
        "Hand-write a tiny assembly function and call it from C",
        "Work through the early Nand2Tetris machine-language material for the from-gates view",
      ],
    },
    resources: {
      primary: [
        { ...R.nand2tetris, guidance: "Part I, projects 4–5 (machine language, computer architecture): build the CPU that runs the assembly you're about to read." },
      ],
      alternatives: [
        { ...R.cpuLand, guidance: "Chapters 1–4: syscalls, privilege rings, and program execution — the modern-x86 story in plain language." },
      ],
      practice: [
        { ...R.godbolt, guidance: "Your primary lab bench — C in, annotated assembly out, for every experiment here." },
      ],
      extra: [
        { ...R.ostep, guidance: "The mechanism chapters connect this to how the OS manages execution." },
      ],
    },
    masteryChecks: [
      "Read a small function's assembly and explain argument passing, the loop, and the return",
      "Diagram a stack frame and locate the return address",
      "Explain why -O2 assembly can look nothing like the source, with an example",
    ],
    securityNote:
      "The return address sitting on the stack is the target of classic stack-buffer-overflow exploits: overflow a local buffer, overwrite the saved return address, redirect execution. This topic is the mechanical prerequisite for understanding — and defending against — memory-corruption attacks.",
  },
  {
    id: "systems-processes",
    title: "Processes, Threads, Scheduling & Signals",
    branch: "systems",
    stage: 2,
    required: true,
    difficulty: "advanced",
    estimatedHours: 12,
    summary:
      "How the OS runs many programs on limited hardware: processes and their isolation, threads and shared memory, the scheduler creating the illusion of simultaneity, system calls as the boundary to the kernel, process creation (fork/exec), and signals for asynchronous events. The concepts behind everything from your terminal to Docker.",
    whyItMatters:
      "Every program is a process; understanding process/thread models, scheduling, and system calls explains performance, concurrency behavior, containers, and much of security. This is the OS knowledge that turns 'the computer does stuff' into a precise mental model you can reason and debug with.",
    prerequisiteIds: ["systems-architecture-asm", "py-concurrency"],
    concepts: [
      "Processes: isolated address spaces, the process table, PIDs, and lifecycle",
      "Threads: shared memory within a process; the trade-offs vs. processes (your Python concurrency, explained)",
      "Scheduling: time-slicing, context switches, and the illusion of parallelism",
      "System calls: the user/kernel boundary and how programs ask the OS for things",
      "Process creation: fork/exec and how shells launch programs",
      "Signals: asynchronous notifications, handlers, and their subtleties",
      "Inter-process communication: pipes and their kin",
    ],
    practicalUses: [
      "Understanding what containers isolate and what they don't",
      "Diagnosing performance and concurrency behavior in real systems",
      "Building tools that launch and coordinate processes (your mini-shell)",
    ],
    lab: {
      title: "Build a Mini Shell",
      scenario:
        "Implement a real (if minimal) Unix shell in C: read commands, fork and exec to run programs, wait for them, support pipes (cmd1 | cmd2) via process creation and file-descriptor plumbing, background jobs with &, and correct signal handling (Ctrl+C interrupts the child, not the shell). This is the OS lab that makes processes concrete.",
      outcome:
        "You understand process creation, the fork/exec model, file descriptors, pipes, and signals from having built them — the terminal you use daily is no longer mysterious.",
      requirements: [
        "A REPL that parses a command line into program + arguments and runs it via fork + exec, waiting for completion and reporting exit status",
        "Pipes: cmd1 | cmd2 wiring the first's stdout to the second's stdin via pipe() and dup2() (your file-descriptor and I/O knowledge applied)",
        "Background execution with & (don't wait; reap finished children without zombies)",
        "Signal handling: Ctrl+C (SIGINT) terminates the running foreground child but returns you to the prompt, not killing the shell",
        "A few built-ins that must run in the shell process itself (cd, exit) — and an explanation of why they can't be external programs",
        "Robust error handling: unknown command, exec failure, malformed pipeline — clean messages, no crashes",
      ],
      checkpoints: [
        "Running ls -l | grep .c | wc -l produces the right answer through your pipe plumbing",
        "Ctrl+C during a long-running child returns to the prompt with the shell alive",
        "Background jobs run without blocking the prompt and don't leave zombies",
        "cd actually changes the shell's directory (proving why it's a built-in)",
      ],
      hints: [
        "fork() returns twice: 0 in the child, the child's PID in the parent. This is the concept that unlocks the whole lab — internalize it.",
        "For a pipe: create the pipe, fork both commands, dup2 the pipe ends onto stdin/stdout in the children, close unused ends everywhere (leaked FDs cause hangs).",
        "cd must be a built-in because a child process changing directory can't affect the parent shell — separate address spaces, your process-isolation lesson made tangible.",
        "Reap children (waitpid with WNOHANG for background) or you accumulate zombies.",
      ],
      validation: [
        "A battery of pipelines and background jobs behaves like a real shell",
        "No zombie processes accumulate (check with ps)",
        "Signals and built-ins behave correctly; the shell survives everything you throw at it",
      ],
      solutionOutline: [
        "fork/exec is the Unix creation model: fork duplicates the process, exec replaces its program image — the shell forks itself and the child becomes the command, which is why the shell survives to prompt again.",
        "Pipes are kernel buffers connecting one process's stdout to another's stdin; dup2 redirects file descriptors before exec, so the launched program is none the wiser — the elegant composition behind every command line.",
        "Signals deliver asynchronous events; correct handling (foreground child receives SIGINT, shell continues) requires understanding process groups — the machinery your terminal uses invisibly.",
      ],
      extensions: [
        "Add output/input redirection (> and <)",
        "Add job control (fg/bg, listing jobs)",
        "Handle multi-stage pipelines of arbitrary length",
      ],
    },
    resources: {
      primary: [
        { ...R.cs537videos, guidance: "Watch the Virtualization videos on processes, the process API (fork/exec), and scheduling — they track the OSTEP chapters one-for-one." },
      ],
      alternatives: [],
      practice: [],
      extra: [
        { ...R.ostep, guidance: "The virtualization/processes chapters and the API (fork/exec) chapter map directly to this lab." },
        { ...R.beejC, guidance: "For the C systems-call mechanics." },
      ],
    },
    masteryChecks: [
      "Explain fork/exec and why a child's directory change can't affect the parent",
      "Describe how a pipe connects two processes at the file-descriptor level",
      "Explain what a context switch costs and why threads and processes differ in isolation",
    ],
    securityNote:
      "Process isolation (separate address spaces) is a fundamental security boundary — and privilege management around fork/exec matters: a program that execs with elevated privileges or inherits sensitive file descriptors can be exploited. Containers build on exactly these primitives, which is why understanding them clarifies what containers do and don't protect.",
  },
  {
    id: "systems-memory-vm",
    title: "Virtual Memory, Pages & Protection",
    branch: "systems",
    stage: 3,
    required: true,
    difficulty: "advanced",
    estimatedHours: 10,
    summary:
      "The illusion that each process owns all of memory: virtual vs. physical addresses, pages and page tables, the MMU's translation, memory protection (why a segfault is the hardware defending a boundary), and the layout of a process's address space — stack, heap, code, data — that you've been living in since C.",
    whyItMatters:
      "Virtual memory explains segfaults, memory protection, why processes can't corrupt each other, and much of performance (cache, TLB, page faults). It's also central to memory-corruption security: exploits and their mitigations (ASLR, NX) are all about the address space you'll finally see whole here.",
    prerequisiteIds: ["systems-processes", "c-heap-lifetime"],
    concepts: [
      "Virtual vs. physical addresses; why every process sees the same address range privately",
      "Pages, page tables, and the MMU translating addresses in hardware",
      "The process address space map: code, data, heap (grows up), stack (grows down), shared libraries",
      "Memory protection: read/write/execute permissions per page; the segfault as enforcement",
      "Page faults: demand paging and the cost of a miss",
      "The TLB and locality: why access patterns dominate performance (your Big-O asterisk, explained)",
      "Security-relevant mechanisms: NX (no-execute) and ASLR at a conceptual level",
    ],
    practicalUses: [
      "Understanding and fixing segfaults from first principles",
      "Reasoning about performance via locality and paging",
      "Grasping memory-corruption exploits and their mitigations",
    ],
    lab: {
      title: "Map Your Address Space",
      scenario:
        "Investigate the memory of your own running programs: print addresses of stack variables, heap allocations, globals, and functions to reconstruct the address-space map by hand; observe it change (or not) under ASLR; deliberately trigger and diagnose protection faults; and measure the performance cost of poor locality.",
      outcome:
        "The abstract address space becomes a map you've drawn from real addresses, segfaults become comprehensible boundary violations, and you can reason about locality-driven performance.",
      requirements: [
        "A program printing addresses of: a local, a heap allocation, a global, a static, a function, and a shared-library function — organize them into an address-space map and explain the ordering",
        "Run it several times with ASLR on and observe which addresses move; explain what ASLR randomizes and why (security)",
        "Deliberately cause distinct faults — null dereference, write to a read-only page (e.g., a string literal), execute non-executable data — and diagnose each with GDB, explaining which protection was violated",
        "On Linux, inspect /proc/self/maps to see the real, authoritative address-space layout and reconcile it with your printed addresses",
        "Locality experiment: traverse a large 2D array row-major vs. column-major, measure the dramatic time difference, and explain it via pages/cache/TLB (closing the loop on your Big-O measurements)",
      ],
      checkpoints: [
        "Your hand-drawn map matches /proc/self/maps in ordering and regions",
        "You can state which protection each deliberate fault violated",
        "ASLR's effect is observed and explained in security terms",
        "The row- vs. column-major timing gap is large and correctly explained",
      ],
      hints: [
        "Stack addresses are high, heap lower, code lower still (typically) — print and sort to see the map.",
        "A string literal lives in a read-only page; writing through a char* to it faults — a concrete protection demonstration.",
        "Row-major traversal touches consecutive memory (cache/TLB friendly); column-major jumps by a row-length each step, thrashing caches — same asymptotic complexity, vastly different constant, exactly your Big-O asterisk.",
      ],
      validation: [
        "The /proc/self/maps reconciliation is correct",
        "Each fault is diagnosed with the right violated permission",
        "The locality benchmark's explanation correctly invokes paging/cache behavior",
      ],
      solutionOutline: [
        "Virtual memory gives each process a private address space that the MMU translates to physical frames via page tables; this is why processes are isolated and why the same virtual address means different things in different processes.",
        "Page-level permissions let the hardware enforce boundaries: a segfault is the MMU catching an access that violates a page's read/write/execute rights — protection as a hardware feature, not a courtesy.",
        "Locality dominates real performance because translation (TLB) and caching reward accessing nearby memory; two algorithms with identical Big-O can differ by 10x from access patterns alone.",
      ],
      extensions: [
        "Read about how the heap allocator requests pages from the OS (brk/mmap) — connect to your malloc lab",
        "Explore huge pages and their performance effect",
      ],
    },
    resources: {
      primary: [
        { ...R.cs537videos, guidance: "Watch the address-spaces, paging, and TLB videos in the Virtualization section." },
      ],
      alternatives: [
        { ...R.cpuLand, guidance: "The memory chapters tell the same story with cartoons and real /proc output." },
      ],
      practice: [
        { ...R.godbolt, guidance: "Not for VM directly, but useful for seeing memory-access instructions." },
      ],
      extra: [
        { ...R.ostep, guidance: "The entire virtual-memory section — paging, page tables, TLB, and protection." },
        { ...R.nand2tetris, guidance: "For the hardware side of memory addressing." },
      ],
    },
    masteryChecks: [
      "Draw the address-space map and explain each region's purpose and growth direction",
      "Explain a segfault in terms of pages and permissions",
      "Explain how locality can make same-complexity code 10x faster or slower",
    ],
    securityNote:
      "Memory protection, NX, and ASLR are the mitigations that make memory-corruption exploitation hard: NX stops executing injected data, ASLR hides where things are. Understanding the address space here is the direct prerequisite for the security branch's memory-corruption topic — you'll see both the attacks and why these defenses work.",
  },
  {
    id: "systems-concurrency",
    title: "Concurrency: Races, Locks & Synchronization",
    branch: "systems",
    stage: 4,
    required: true,
    difficulty: "advanced",
    estimatedHours: 12,
    summary:
      "Concurrency at the systems level, where the hazards are real and unforgiving: shared-memory threads, race conditions and why they're insidious, mutexes and condition variables, deadlock and its prevention, and the deep lesson that correct concurrent code requires disciplined design, not luck. The rigorous grounding beneath your Python concurrency experience.",
    whyItMatters:
      "Concurrency bugs are among the hardest in software — nondeterministic, timing-dependent, and often invisible in testing until they cause a production disaster. Understanding synchronization primitives and hazards at the C/threads level, where nothing protects you, builds judgment that makes you careful and correct everywhere.",
    prerequisiteIds: ["systems-processes", "c-lists-stacks-queues"],
    concepts: [
      "Threads sharing memory; the data race defined precisely (unsynchronized access, at least one write)",
      "Why races are insidious: nondeterminism, rare interleavings, passing tests that lie",
      "Mutexes: mutual exclusion and critical sections",
      "Condition variables: waiting for state without busy-spinning; the producer/consumer pattern",
      "Deadlock: the four conditions and prevention (especially consistent lock ordering)",
      "Atomicity and why read-modify-write needs protection (your Python race, at the metal)",
      "Design over locking: minimizing shared mutable state as the real solution",
    ],
    practicalUses: [
      "Writing correct multithreaded servers and tools",
      "Diagnosing the worst category of production bugs",
      "Reasoning about concurrency in any language, from a position of real understanding",
    ],
    lab: {
      title: "Thread-Safe Job Queue & the Bugs Around It",
      scenario:
        "Build a thread-safe producer/consumer job queue in C with pthreads: multiple producers enqueue work, multiple consumers process it, using a mutex and condition variables. Then deliberately create and diagnose the classic hazards — a data race, a deadlock, a lost wakeup — and fix each, proving correctness under stress.",
      outcome:
        "You can write correct concurrent code with mutexes and condition variables, recognize and fix the classic hazards, and you've earned a healthy respect for concurrency that makes you careful for life.",
      requirements: [
        "A bounded thread-safe queue (your ring buffer, now shared) with enqueue/dequeue protected by a mutex; condition variables for 'not full' and 'not empty' so producers/consumers wait correctly instead of busy-looping",
        "Multiple producer and consumer threads processing thousands of jobs; a verifiable invariant (e.g., every produced job consumed exactly once — checked with atomic counters or post-hoc)",
        "Deliberately introduce and demonstrate a data race (drop a lock around a shared counter): show the wrong result under stress, then fix and show correctness",
        "Deliberately create a deadlock (two locks acquired in opposite orders by two threads): observe the hang, diagnose it (GDB thread backtraces), and fix via consistent lock ordering",
        "Demonstrate and fix a lost-wakeup/spurious-wakeup bug by using the correct while-loop condition check around cond_wait",
        "A stress test running many threads for a long time with no lost or duplicated jobs and no deadlock",
      ],
      checkpoints: [
        "The unsynchronized-counter race produces visibly wrong totals under load, then never after the fix",
        "The deadlock hangs reproducibly and is diagnosed from thread backtraces",
        "Condition waits use while (not if) — you can explain the spurious-wakeup reason",
        "The final stress test: every job consumed exactly once, no hangs, over millions of operations",
      ],
      hints: [
        "A data race needs contention to appear — many threads, tight loops, and enough iterations. 'It worked' with two iterations proves nothing.",
        "Always cond_wait in a while loop rechecking the condition: wakeups can be spurious, and state can change between signal and wake. if is a classic bug.",
        "Deadlock prevention: impose a global lock ordering and always acquire in that order. Your GDB thread backtraces will show each thread blocked on the lock the other holds.",
        "The deepest fix is often less sharing: a queue with one lock is simpler and safer than fine-grained locking you'll get wrong.",
      ],
      validation: [
        "ThreadSanitizer (-fsanitize=thread) reports no races on the final version",
        "The stress test's job-accounting invariant holds over a long run",
        "Each hazard was demonstrated failing before its fix (keep the commits)",
      ],
      solutionOutline: [
        "A data race is unsynchronized concurrent access with a write; mutexes create critical sections where access is exclusive, restoring the atomicity that read-modify-write needs — the metal-level version of your Python counter race.",
        "Condition variables let threads sleep until state changes, avoiding busy-waiting; the while-loop recheck handles spurious wakeups and races between signal and wake — a subtlety that separates correct from almost-correct.",
        "Deadlock arises when threads hold-and-wait in a cycle; consistent lock ordering breaks the cycle, and minimizing shared mutable state avoids the whole problem — design beats locking.",
      ],
      extensions: [
        "Add a work-stealing variant and reason about its added complexity",
        "Replace some locking with atomic operations and measure the difference",
        "Reproduce and explain the ABA problem conceptually",
      ],
    },
    resources: {
      primary: [
        { ...R.cs537videos, guidance: "Watch the Concurrency videos: threads, locks, and condition variables — then plant this lab's bugs deliberately." },
      ],
      alternatives: [
        { ...R.sorberServer, guidance: "A compact live-coding take: real threads around real work, with the classic mistakes shown." },
      ],
      practice: [
        { ...R.godbolt, guidance: "See how atomic operations compile — demystifying lock-free code." },
      ],
      extra: [
        { ...R.ostep, guidance: "The concurrency section — locks, condition variables, and common bugs — is the canonical treatment." },
        { ...R.beejC, guidance: "For the pthreads API mechanics." },
      ],
    },
    masteryChecks: [
      "Define a data race precisely and explain why it can pass tests yet fail in production",
      "Explain why cond_wait belongs in a while loop with a concrete failure otherwise",
      "State the deadlock conditions and how consistent lock ordering prevents it",
    ],
    securityNote:
      "Race conditions are a security bug class, not just a correctness one: TOCTOU (time-of-check-to-time-of-use) races let attackers slip between a permission check and the action it guards. The synchronization discipline here is also a security discipline.",
  },
  {
    id: "systems-networking",
    title: "Sockets, TCP/UDP & Protocol Design",
    branch: "systems",
    stage: 5,
    required: true,
    difficulty: "advanced",
    estimatedHours: 16,
    summary:
      "Network programming from the socket up: the sockets API, TCP (reliable streams) vs. UDP (fast datagrams) and when each fits, ports and addressing, the client/server pattern in code, handling concurrent connections, and designing your own application protocol — including the framing and validation that make it robust and safe.",
    whyItMatters:
      "Everything networked — web servers, databases, games, chat, your future backends — is built on sockets. Writing a socket server yourself demystifies the entire networked world you've been consuming, and designing a protocol teaches the framing and input-validation rigor that networked security depends on.",
    prerequisiteIds: ["systems-concurrency", "web-how-internet-works", "c-file-io"],
    concepts: [
      "The sockets API: socket, bind, listen, accept, connect, send, recv",
      "TCP vs. UDP: reliable ordered stream vs. fast unreliable datagrams; choosing per use",
      "Addresses, ports, and byte order (your endianness knowledge returns)",
      "The client/server model in code; handling multiple clients (threads, select/poll)",
      "Protocol design: message framing (length-prefix or delimiter), because TCP is a stream, not messages",
      "Robust parsing of network input: partial reads, malformed messages, and hostile senders",
      "Graceful connection lifecycle and error handling (your state-machine work applies)",
    ],
    practicalUses: [
      "Building network servers and clients of any kind",
      "Understanding how every networked application actually communicates",
      "The foundation for network security and protocol analysis",
    ],
    lab: {
      title: "Concurrent TCP Chat Server",
      scenario:
        "Build a multi-client chat system in C: a server accepting many simultaneous clients, broadcasting messages between them, with a deliberately designed length-prefixed protocol, robust handling of partial reads and malformed/hostile messages, and clean handling of clients disconnecting. Inspect your own traffic with Wireshark.",
      outcome:
        "You can build concurrent network servers and clients, design and implement a robust wire protocol, and you understand networked communication from the socket up — plus you've watched your own packets on the wire.",
      requirements: [
        "A TCP server handling multiple concurrent clients (threads or select/poll — choose and justify), broadcasting each message to all others",
        "A client that connects, sends, and displays incoming messages concurrently with user input",
        "A designed protocol: length-prefixed framing (because TCP is a byte stream, not messages), a documented message format, and a version/type field for extensibility",
        "Robust receive handling: loop until a full frame arrives (partial reads are normal), enforce a maximum message size, and reject malformed frames without crashing — treat every byte as hostile",
        "Graceful lifecycle: clients joining/leaving are announced; a client crash or abrupt disconnect doesn't take down the server or others",
        "Capture a session in Wireshark: identify the TCP handshake, your length prefixes, and message payloads on the wire",
      ],
      checkpoints: [
        "Multiple clients chat simultaneously; messages broadcast correctly",
        "A message split across two TCP segments still reassembles into one frame (partial-read handling proven)",
        "A malformed or oversized frame from a hostile client is rejected without crashing the server",
        "Wireshark shows your handshake, length prefixes, and payloads as designed",
      ],
      hints: [
        "TCP delivers a byte stream, not your messages — one recv can return half a message or two messages. Framing (length prefix) is mandatory, not optional; this is the #1 beginner networking bug.",
        "Never trust the length prefix blindly: bound it (max message size) before allocating or reading, exactly like your defensive file-parsing lab.",
        "Handle each client's connection lifecycle as a small state machine; disconnections (recv returns 0) are normal events, not errors.",
        "select/poll multiplexes many sockets in one thread; threads are simpler to reason about but scale differently. Either is fine — justify your choice.",
      ],
      validation: [
        "Stress test with many concurrent clients and rapid messages: no crashes, no message corruption, no leaks",
        "A malicious-client script sending garbage, oversized, and truncated frames cannot crash or hang the server",
        "The Wireshark capture matches your protocol spec exactly",
      ],
      solutionOutline: [
        "The server loops accepting connections and servicing them concurrently (a thread per client, or select/poll multiplexing); broadcasting is iterating clients and sending — the concurrency discipline from the previous lab keeps shared client state safe.",
        "Length-prefixed framing solves TCP's stream nature: read the fixed-size length, then loop recv until that many bytes arrive, then process one message — the same 'a length field is a claim to validate' rule as your binary parser, now over the network.",
        "Robust servers treat all network input as hostile: bounded sizes, validated frames, and lifecycle handled as states — this is where networking meets security, and sloppiness here is how servers get exploited.",
      ],
      extensions: [
        "Add a UDP variant for a 'presence/heartbeat' feature and contrast the reliability difference",
        "Add rooms/channels and private messages",
        "Add TLS via a library (never hand-rolled) and re-inspect — the payloads are now encrypted",
      ],
    },
    resources: {
      primary: [
        { ...R.sorberWebClient, guidance: "Step 1: watch and code along — socket(), connect(), send(), recv() from nothing." },
        { ...R.sorberServer, guidance: "Step 2: the server side — bind, listen, accept, and a thread per connection." },
      ],
      alternatives: [
        { ...R.practicalNetworking, guidance: "If TCP/UDP concepts feel shaky, the protocol lessons cover ports and handshakes first." },
      ],
      practice: [],
      extra: [
        { ...R.beejNet, guidance: "The definitive free sockets guide — this lab is essentially its capstone; keep it open as the reference." },
        { ...R.wireshark, guidance: "For the packet-inspection portion." },
        { ...R.ostep, guidance: "For the OS mechanisms (file descriptors, select) beneath the sockets." },
      ],
    },
    masteryChecks: [
      "Explain why TCP needs message framing despite being 'reliable'",
      "Write the accept/recv/send loop structure for a concurrent server from memory",
      "Explain how you'd make a server robust against a client sending deliberately malformed data",
    ],
    securityNote:
      "Network servers are exposed to everyone; every byte received is attacker-controlled. The discipline here — bounded reads, validated framing, no trust in length fields, robust lifecycle handling — is exactly what prevents the buffer overflows and denial-of-service bugs that plague network code. This lab is a security lab as much as a systems one.",
  },
];
