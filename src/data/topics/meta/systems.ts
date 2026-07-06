import type { TopicMeta } from "../../types";


export const systemsMeta: TopicMeta[] = [
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
    prerequisiteIds: ["c-debug-tools", "c-integers-bits"],
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
    prerequisiteIds: ["systems-architecture-asm", "py-concurrency"],
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
    prerequisiteIds: ["systems-processes", "c-heap-lifetime"],
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
    prerequisiteIds: ["systems-processes", "c-lists-stacks-queues"],
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
    prerequisiteIds: ["systems-concurrency", "web-how-internet-works", "c-file-io"],
  },
];
