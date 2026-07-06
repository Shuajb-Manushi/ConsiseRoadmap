# Curriculum Philosophy

This document explains *why* the roadmap is shaped the way it is: the branch structure,
the required-vs-optional policy, and how milestone projects tie everything together. If
you're editing content, read this first so your additions fit the whole.

## The learner and the destination

The roadmap is designed for one concrete person: a first-year student who knows **C
through linked lists**, basic HTML/CSS, functions and intro algorithms, and their
Windows + VS Code + terminal environment, with ~7 study hours a week. The destination:

- A **self-sufficient** engineer who can build ideas without depending on AI to think.
- Strong **computer-science and systems fundamentals**.
- Eventually capable in **ethical cybersecurity**.
- Someone who learns **theory through practical use**, not isolated academia.

Every decision below serves that person and that destination.

## Core principle: theory through practice

Concepts are introduced next to the code that needs them. Pointers are taught by
building a dynamic text buffer; the birthday paradox is met while measuring your own
hash table’s collisions; induction is proved on a loop you wrote. There are no
“print a pointer” exercises — tiny concepts are clustered into meaningful labs so the
learner always understands *why* something exists.

## The branches

Ordered roughly by dependency, though the graph is the real structure:

0. **Start Here & Developer Tools** — how programs run, terminals + WSL, VS Code, Git,
   debugging, testing, decomposition, responsible AI use.
1. **C & Memory** — compilation, integers/UB, pointers, the heap, structs, modular C,
   file I/O, debugging tools, then data structures (lists → hash tables → trees →
   graphs) each via a real system.
2. **Applied CS & Mathematics** — representation, Big-O, recursion, searching/sorting,
   graph algorithms, state machines, discrete math + probability — each beside code.
3. **Python & Automation** — a second language for real automation, tested and packaged.
4. **Web Foundations** — how the web works, HTML/a11y, CSS, JS, DOM/async, TypeScript,
   React, frontend testing + browser security.
5. **Databases & Backend** — relational thinking, SQL, indexing/transactions,
   FastAPI/PostgreSQL, auth, and backend operations.
6. **Software Engineering Practice** — requirements, collaborative Git, clean code,
   testing strategy, CI/Docker/deploy.
7. **Software Architecture** — modularity and dependency direction, boundaries and
   ports/adapters, API contracts and data ownership, choosing a system's shape,
   reliability, observability, and evolving a system with decision records — every
   lab evolves the learner's own issue tracker.
8. **Systems & Networking** — assembly, processes, virtual memory, concurrency, sockets.
9. **Mobile Development** *(optional)* — React Native after the web foundations.
10. **Security & Ethical Hacking** — secure mindset first, then Linux, web (OWASP),
    memory + crypto, and network/reversing/supply-chain — always in authorized labs.
11. **Optional Specializations** *(later)* — Rust, Go, Java/C#, C++, game dev, and
    frontiers (embedded, compilers, cloud, ML, distributed).

Security thinking is **integrated throughout** (see the `securityNote` on many topics),
not confined to the security branch — the dedicated branch is for depth.

## Recommended path

Start at `code-to-program` and continue from existing C knowledge into memory,
debugging, data structures, Git, and Linux. Begin Python **after** the C memory
foundation — do not restart from variables. The web, backend, and practice branches
interleave naturally (the full-stack milestone is their shared goal). Systems deepens
the C/OS understanding. Security and the optional branches come once foundations exist.

## Required vs. optional policy

- **Required (`required: true`)** — core to becoming a well-rounded engineer. These form
  the spine; the total is guidance-only hours, not a deadline.
- **Optional (`required: false`)** — valuable but situational; skippable without breaking
  the path.
- **Later / specialization** — everything in the `mobile` and `optional` branches (marked
  `optional` at the branch level). Chosen by genuine interest; **no engineer needs them
  all.** The UI renders these three states distinctly (solid / dashed / dotted).

Difficulty (`foundation` / `intermediate` / `advanced`) and `estimatedHours` are honest
guidance to help planning, never gates.

## Milestone projects

Eleven cross-branch capstones turn accumulated theory into working software. Each declares
`unlockedBy` (the topics it needs) and `integrates` (the branches it spans), and appears
as a distinct node in the graph. They are detailed **briefs** — requirements, non-goals,
architecture, checkpoints, tests, progressive hints, and a solution outline — never
paste-ready source, because the learning is in the building.

The flagship arc: **C Personal Database** and **C Text Search Engine** (C + CS) →
**Python Automation Toolkit** and **Python/SQLite Task CLI** (Python + backend) →
**Vanilla Web Application** → **Full-Stack Issue Tracker** (the web/backend/practice
convergence) → **Networked Chat System** and **HTTP Server in C** (systems) →
**React Native Companion** (mobile) → **Secure Engineering Capstone** (which
threat-models and attacks the learner’s *own* full-stack app in an authorized lab).

## Editing guidance

When adding content, ask: does this serve self-sufficiency and CS/systems depth? Is the
theory anchored by a real project? Is a prerequisite relationship (not just topical
adjacency) the reason for each `prerequisiteIds` entry? Keep the required spine lean and
push nice-to-haves to optional. See [CONTRIBUTING.md](CONTRIBUTING.md) for mechanics.
