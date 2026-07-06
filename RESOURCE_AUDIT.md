# Resource Audit — July 2026

A full audit of every recommended learning resource, driven by one goal: **a
beginner opening any topic should know exactly what to watch, read, or do
first** — not be handed a documentation homepage.

Every URL below was opened and verified during this audit (HTTP status, page
title, provider; YouTube links via the oEmbed API, which fails for deleted
videos). Re-run the check any time with:

```
npm run audit:resources
```

Audit run result (2026-07-04): **127 unique URLs — 125 OK, 2 harmless
redirects (`docs.pytest.org` → `/en/stable/`, `en.cppreference.com/w/c` →
`/c`), 0 broken, 0 requiring manual verification.**

## The new structure

Each topic now offers four tiers (`ResourceGroup` in `src/data/types.ts`):

1. **primary** (“Start learning here”) — one guided video, course, interactive
   tutorial, or lab, with exact instructions (which lecture, which chapters).
2. **alternatives** (“Try another explanation”) — a different teaching style.
3. **practice** (“Practice and visual tools”) — VisuAlgo, Compiler Explorer,
   Exercism, wargames. Tools that were previously presented as explanations
   (e.g. Compiler Explorer) now live here, after the explanation.
4. **extra** (“Extra reading & references”, collapsed by default) — books,
   official docs, manuals. Kept, not deleted — just no longer the front door.

Validation tests (`src/data/curriculum.test.ts`) enforce: every topic has a
primary; primaries must be video/course/interactive/lab unless listed in the
documented exception set; every URL is syntactically valid https; catalog ids
are unique and every topic resource maps to a catalog entry.

## Original catalog — decision per resource

| Resource | Decision | Reason | Verification |
|---|---|---|---|
| MIT Missing Semester | **Kept (primary)** | Now deep-links the exact lecture per topic (shell, editors, version control, debugging, metaprogramming, security) instead of the homepage. | 200, all six lecture URLs |
| Pro Git | **Demoted → extra** | Excellent book, but a wall of text as a first step. Learn Git Branching is the new primary. | 200 |
| GitHub Skills | **Kept (practice)**, URL updated | `skills.github.com` is now a client-side redirect page; canonical URL updated to `https://learn.github.com/` (“GitHub Learn”). | 200 |
| Beej's Guide to C | **Demoted → extra** | Great reference, but a large text; CS50x lectures teach the same material better first. Kept everywhere with chapter-level guidance. | 200 |
| GNU C Language Manual | **Removed** | Connection fails/times out consistently (`www.gnu.org/software/gnu-c-manual/`). Dead link must not stay recommended; cppreference + Beej cover the reference need. | fetch failed (repeated) |
| cppreference — C | **Demoted → extra** | Indispensable lookup, overwhelming as a lesson. | 200 (redirects to `/c`) |
| GDB Documentation | **Demoted → extra** | Manual, not a lesson. Primary is now the Missing Semester debugging lecture; Beej's Quick Guide to GDB added as the friendly alternative. | 200 |
| OSTEP (book) | **Demoted → extra** | Still the best OS book — but now paired with its author's CS 537 lecture videos as the guided primary. | 200 |
| Nand2Tetris | **Kept (primary for CPU/assembly, alternative elsewhere)** | Genuinely a guided course. | 200 |
| Compiler Explorer | **Kept → practice** | Exactly the requested change: a lab bench after an explanation, never the explanation. | 200 |
| VisuAlgo | **Kept, prominent (practice)** | Remains the recommended visualization for every data-structure/algorithm topic, with per-topic instructions (which visualization, Training mode). | 200 |
| OpenDSA | **Demoted → extra** (interactive textbook) | Good depth, but heavier than the new primaries. | 200 |
| MIT 6.042J | **Kept (primary for discrete math/probability)** | Real course with lecture videos and psets. | 200 |
| Official Python Tutorial | **Demoted → alternative/extra** | Authoritative but text-first; CS50P lectures are the new guided path. | 200 |
| Automate the Boring Stuff | **Demoted → alternative/extra** | Kept with chapter mapping. | 200 |
| pytest Documentation | **Demoted → extra** | Docs, not a lesson; CS50P Week 5 teaches pytest itself. | 200 |
| Exercism — Python Track | **Kept (practice)**, generalized | Single `exercism` catalog entry; topics deep-link the right track (Python, JS, TS, Rust, Go, C++). | 200, all track URLs |
| MDN Curriculum | **Demoted → extra** | A map, not a lesson. | 200 |
| MDN JavaScript Guide | **Demoted → extra** | Reference-quality; javascript.info is the guided primary. | 200 |
| TypeScript Handbook | **Demoted → extra** | Total TypeScript's free interactive Beginner tutorial is the new primary. | 200 |
| React — Learn | **Kept (primary)** | Genuinely an interactive, guided official tutorial — with exact section instructions added. | 200 |
| React Native — Environment Setup | **Demoted → extra**, title updated | Setup docs, not a lesson (page is now titled “Get Started with React Native”). | 200 |
| Expo Tutorial | **Kept (primary)** | Step-by-step official tutorial. | 200 |
| PostgreSQL Tutorial | **Demoted → extra** | Accurate but dry; SQLBolt + CS50 SQL are the guided path. | 200 |
| FastAPI Tutorial | **Kept (primary for db-fastapi via documented exception)** | Typed “documentation” but reads as a true sequenced tutorial; exception justified in the test file. Extra elsewhere. | 200 |
| Docker — Get Started | **Demoted → alternative** | freeCodeCamp/TechWorld-with-Nana video course is the new primary. | 200 |
| GitHub Actions docs | **Demoted → extra** | Docs; GitHub Skills courses are the hands-on path. | 200 |
| Beej's Guide to Network Programming | **Demoted → extra** | The classic reference stays, but Jacob Sorber's live-coded socket videos teach first. | 200 |
| Wireshark Documentation | **Demoted → extra** | Manual; Chris Greer's Wireshark lessons are the guided primary. | 200 |
| OWASP Top 10 | **Demoted → extra** | Catalog/reference, not a lesson. | 200 |
| PortSwigger Web Security Academy | **Kept (primary)** | Guided, legal, hands-on; db-auth now deep-links the Authentication section. | 200 |
| OverTheWire: Bandit | **Kept (primary/practice)** | Guided legal wargame, with level-range instructions. | 200 |
| pwn.college | **Kept (primary)** | University course with sanctioned infrastructure; module-level guidance added. | 200 |

## New resources added (all opened and verified)

**Anchor courses reused across many topics** (per instructions, a few excellent
courses with topic-specific deep links instead of 70 unrelated creators):

- **CS50x 2025** (Harvard) — weeks 0–5 deep-linked as primaries for
  problem decomposition, data representation, compilation, pointers/memory,
  heap, file I/O, algorithms/Big-O/recursion/sorting, lists/hash tables/trees.
  Verified: course page + each week page (titles confirmed, e.g. “Week 4 Memory”).
- **CS50P — Python** (Harvard) — weeks 0, 3, 5, 6, 8 deep-linked for the Python
  branch and testing fundamentals. Verified per-week.
- **CS50 SQL** (Harvard) — weeks 0, 1, 5 for relational thinking, SQL, and
  performance. Verified per-week.
- **CS 537 lecture videos** (Remzi Arpaci-Dusseau, UW–Madison) — OSTEP's author
  teaching processes, virtual memory, and concurrency. Verified.
- **William Fiset via freeCodeCamp** — Data Structures course (`RBSGKlAvoiM`)
  and Graph Theory course (`09_LlHjoEiY`), chapter-guided. oEmbed-verified
  titles/channel.

**Individual videos/courses** (oEmbed- or page-verified, title + provider):
Ben Eater two's complement (`4qH4unVtJkE`); mycodeschool Pointers playlist;
Code.org “How the Internet Works” series (note: the channel currently displays
as “CodeAI” after a rename — videos confirmed live); Practical Networking
Fundamentals playlist; Corey Schafer requests / threading / multiprocessing /
asyncio / logging; freeCodeCamp “APIs for Beginners” (Craig Dennis);
“A Philosophy of Software Design” (Ousterhout, Talks at Google); CodeAesthetic
“Why You Shouldn't Nest Your Code”; Ian Cooper “TDD, Where Did It All Go
Wrong”; TechWorld-with-Nana Docker course (freeCodeCamp); “Wireshark with
Chris Greer” playlist (David Bombal's channel); Adam Shostack “World's
Shortest Threat Modeling Course”; Jacob Sorber socket client & multithreaded
server; MIT 6.1200J Lecture 4 (State Machines); VS Code intro videos;
Comprehensive Rust (Google); Java Programming MOOC (Univ. of Helsinki);
C# path (Microsoft Learn); fast.ai; MIT 6.824/6.5840; Full Stack Open
(parts 1, 5, 10); web.dev Learn HTML / Learn CSS; javascript.info (+ /document);
Total TypeScript Beginner tutorial; learncpp.com; Godot “Your first 2D game”;
MDN Learn modules (HTML/CSS/JS); Google Technical Writing One.

**Interactive/practice**: Learn Git Branching, Python Tutor, SQLBolt,
PostgreSQL Exercises, SQL Murder Mystery, RegexOne, Flexbox Froggy, Grid
Garden, CryptoHack, Rustlings, A Tour of Go, Learn GDScript From Zero.

**Extra reading added**: Beej's Quick Guide to GDB, Putting the “You” in CPU
(cpu.land), Makefile Tutorial by Example, The Rust Book, Go by Example,
Refactoring.Guru, The Practical Test Pyramid (martinfowler.com), Crafting
Interpreters, Atlassian user-stories guide.

## Documented exceptions (primary is not a video/course/lab)

- **db-fastapi** — the official FastAPI tutorial (type “documentation”) is a
  genuinely sequenced, run-every-snippet guided tutorial; the best free start.
- **se-requirements** — no genuinely good free video/course on requirements
  writing was found; Atlassian's user-stories article (with template) is the
  honest best pick, with Google Technical Writing One as the alternative.

## Honest gaps and caveats

- **cs-state-machines**: the MIT 6.1200J lecture is mathematically flavored
  (invariants) rather than engineering-FSM-focused. It is a real, verified
  state-machines lecture from a top course; no better free *video* fit was found.
- **c-structs-callbacks**: no single excellent free video covers structs +
  enums + unions + function pointers together. The mycodeschool function-pointer
  lessons cover the hardest part; structs remain covered by Beej chapters in extra.
- **opt-frontiers** is a survey topic: the primary (fast.ai) plus alternatives
  (MIT 6.824, Crafting Interpreters) are interest-dependent by design.
- **Durations** are stated only where reliably known and always as
  approximations; they are omitted where they could not be verified.
- Hosts that block automated requests are reported as
  `manual verification required` by the audit script, never auto-marked broken
  (`martinfowler.com`, `atlassian.com`, `learn.microsoft.com` are pre-listed;
  all three responded 200 in the final run anyway).

## Software Architecture branch — July 2026 addition

The new `arch` branch (7 topics + the `m-architecture-evolution` milestone)
was resourced under the same standard. Every URL below was opened and verified
on 2026-07-06 (YouTube via the oEmbed API — exact title and channel recorded;
other hosts via direct fetch — page title and author confirmed). The retired
`se-architecture` topic's resources were redistributed, not orphaned.

### New resources added

| Resource | Used by | Exact URL | Verification |
|---|---|---|---|
| The Hexagonal — Ports & Adapters Architecture (keynote) | arch-boundaries (primary) | https://www.youtube.com/watch?v=ChUlRa0xsWo | oEmbed: "The Hexagonal - Ports & Adapters Architecture \| Alistair Cockburn \| SAG 2025" (iSAQB) |
| Modular Monoliths (GOTO 2018) | arch-system-shapes (primary) | https://www.youtube.com/watch?v=5OjqD-ow8GE | oEmbed: "Modular Monoliths • Simon Brown • GOTO 2018" (GOTO Conferences) |
| The Many Meanings of Event-Driven Architecture | arch-system-shapes (alternative) | https://www.youtube.com/watch?v=STKCRSUsyP0 | oEmbed: "The Many Meanings of Event-Driven Architecture • Martin Fowler • GOTO 2017" (GOTO Conferences) |
| API Evolution without Versioning (QCon) | arch-data-contracts (primary) | https://www.infoq.com/presentations/api-evolution-versioning/ | HTTP 200; speaker Brandon Byars; free video + transcript |
| APIs as infrastructure (Stripe versioning) | arch-data-contracts (alternative) | https://stripe.com/blog/api-versioning | Fetched: title + author (Brandur Leach) confirmed. stripe.com rate-limits scripts (HTTP 429) → added to MANUAL_HOSTS |
| Six Little Lines of Fail | arch-reliability (primary) | https://www.youtube.com/watch?v=j7ftSg6Uy1w | oEmbed: "Jimmy Bogard - Six Little Lines of Fail" (DevConf PL) |
| OpenTelemetry Course — Understand Software Performance | arch-observability (primary) | https://www.youtube.com/watch?v=r8UvWSX3KA8 | oEmbed: "OpenTelemetry Course - Understand Software Performance" (freeCodeCamp.org) |
| SRE Book Ch. 6: Monitoring Distributed Systems | arch-observability (extra) | https://sre.google/sre-book/monitoring-distributed-systems/ | HTTP 200; free online (CC BY-NC-ND) |
| SRE Book Ch. 22: Addressing Cascading Failures | arch-reliability (extra) | https://sre.google/sre-book/addressing-cascading-failures/ | HTTP 200; free online (CC BY-NC-ND) |
| Building Evolutionary Architectures (GOTO Book Club) | arch-evolution (primary) | https://www.youtube.com/watch?v=m2ZlX1je3as | oEmbed: "Building Evolutionary Architectures • Rebecca Parsons, Neal Ford & James Lewis • GOTO 2023" (GOTO Conferences) |
| Documenting Architecture Decisions (Nygard) | arch-evolution (alternative) | https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions | HTTP 200; title + author confirmed |
| Architectural Decision Records (adr.github.io) | arch-evolution (practice) | https://adr.github.io/ | HTTP 200; templates/examples hub. Placed in practice deliberately: used after Nygard's post teaches the why |
| Strangler Fig Application (Fowler) | arch-evolution (extra) | https://martinfowler.com/bliki/StranglerFigApplication.html | HTTP 200 this run; martinfowler.com stays in MANUAL_HOSTS |

### Reused catalog entries (topic-specific guidance written per use)

- `ousterhoutTalk` → arch-modularity primary (was se-architecture's primary).
- `codeAestheticNesting` → arch-modularity alternative.
- `refactoringGuru` → arch-modularity extra (smell vocabulary framing).
- `ianCooperTDD` → arch-boundaries alternative (behavior-at-the-port angle).
- `fastapiTutorial`, `ostep` → arch-boundaries extra (kept from se-architecture).
- `pgTutorial` → arch-data-contracts extra (ALTER TABLE / locks for expand-contract).
- `mit6824` → arch-system-shapes extra (lecture 1 as the price list of distribution).
- `coreyLogging` → arch-observability alternative (Python logging on-ramp).
- `googleTechWriting` → arch-evolution extra (tightening ADR prose).

### se-architecture consolidation

- The topic was **removed from the practice branch** and its material absorbed:
  the "Architect a Swappable System" lab moved (adapted) into `arch-boundaries`;
  its API-versioning requirement grew into the `arch-data-contracts` lab; its
  trust-boundary security note moved to `arch-boundaries`. No catalog entry was
  orphaned (the purpose-group test enforces this).
- Dependents rewired: `se-ci-docker-deploy` → `se-testing-strategy`;
  `opt-enterprise` and `m-security-capstone` → `arch-boundaries`.

### Audit run (2026-07-06, after the branch was added)

**108 unique URLs — 105 OK, 2 harmless redirects (unchanged pytest/cppreference),
1 flagged manual (`stripe.com`, verified by hand as above), and 1 transient
fetch failure: `craftinginterpreters.com` timed out from this network during
the run (pre-existing entry, reachable historically; re-check before assuming
link rot — `sourceware.org` showed the same transient behavior and verified
fine moments later).**

## Numbers

- Original catalog resources audited: **33** → kept as primary/practice **11**,
  demoted to alternative/extra **21**, removed **1** (GNU C manual, dead link).
- New verified resources added: **62** (July 2026 audit) + **13** (architecture
  branch) — catalog now **108 entries**.
- Topics: **78** (72 − se-architecture + 7 architecture topics), all with at
  least one verified primary; all architecture primaries are guided
  (video/course); **2** topics use the documented exceptions above.
