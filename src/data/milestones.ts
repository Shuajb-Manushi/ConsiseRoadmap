import type { MilestoneBody, MilestoneProject } from "./types";
import { milestonesLite } from "./milestonesLite";


/**
 * Cross-branch capstone projects. Each is unlocked by specific topics and
 * integrates skills from multiple branches. These are detailed briefs, not
 * source code — the learning is in building them.
 */
const milestoneBodies: Record<string, MilestoneBody> = {
  "m-c-database": {
    requirements: [
      "A record type with several typed fields (e.g., a contacts or inventory database)",
      "CRUD operations: create, read (by key and by scan/filter), update, delete",
      "Persistence: a binary file format with a header (magic, version, record count) that you design and validate defensively",
      "A hash index (in memory, rebuilt on load) for O(1) lookup by primary key",
      "A command REPL or CLI for all operations",
      "Robust input validation and error handling; no crashes on malformed input or files",
      "A test suite (your C harness) covering CRUD, persistence round-trips, and edge cases",
    ],
    nonGoals: [
      "SQL or a query language (a few fixed queries suffice)",
      "Concurrency or multi-user access",
      "B-tree on-disk indexing (in-memory hash index is enough)",
    ],
    architecture: [
      "Layered: a storage module (file format read/write), an index module (hash table over records), and a command/CLI module — clean interfaces between them",
      "Records stored sequentially in the file; the in-memory hash index maps keys to file offsets (or to in-memory records loaded at startup)",
      "The file format's header enables version checks and integrity validation on load",
      "All the ownership discipline from your heap and structures labs applies: one owner per allocation, clean teardown",
    ],
    checkpoints: [
      "Records persist across program restarts (round-trip verified)",
      "Lookup by key uses the hash index, not a linear scan (measurable at scale)",
      "Deletion and update maintain both the file and the index consistently",
      "The database survives malformed/truncated files with clean errors",
      "Leak-free under Valgrind/ASan across a full session including error paths",
    ],
    tests: [
      "CRUD operations produce correct results, including edge cases (missing key, duplicate key)",
      "Persistence round-trip: save, reload, verify all records intact",
      "Malformed-file handling: truncated and corrupt files are rejected cleanly",
      "Index consistency after a sequence of mixed operations",
    ],
    hints: [
      "Design the file format on paper first (like your binary-inspector lab): header, then records. Validate every field on load.",
      "Decide your key-ownership policy explicitly: does the index own keys, or point into records? Document it.",
      "Rebuild the index from the file on startup — this keeps the on-disk format simple and the index an implementation detail.",
      "Build storage and index modules independently with their own tests before wiring the CLI.",
    ],
    solutionOutline: [
      "The storage module owns the file format: it reads/writes records and the header, validating everything (your defensive-parsing discipline). The index module owns the hash table mapping keys to records/offsets, rebuilt on load. The CLI module orchestrates them.",
      "CRUD flows through the layers: a command parses input, the index locates the record, the storage module reads/writes the file, and the index stays consistent — the same edge/core/storage layering you've used everywhere.",
      "Persistence plus an in-memory index is the essential database idea in miniature: durable storage for correctness, an index for speed — you'll recognize it scaled up in PostgreSQL.",
    ],
    extensions: [
      "Add a secondary index on another field (two indexes over one dataset, like your hash-table lab)",
      "Add a simple free-list to reuse space from deleted records",
      "Add a compaction command that rewrites the file without deleted records",
    ],
  },
  "m-c-search-engine": {
    requirements: [
      "Recursively traverse a directory, reading all text files",
      "Tokenize documents (words, case-folded, punctuation-stripped) using your string-handling skills",
      "Build an inverted index: a hash table from each word to the list of documents (and positions/counts) containing it",
      "Answer queries: single-word, multi-word (AND semantics), ranked by a simple relevance score (e.g., term frequency)",
      "Measure and report performance: index build time, query time, and how they scale with corpus size",
      "A query REPL; robust handling of empty/huge/binary files",
      "Tests for tokenization, indexing, and query correctness",
    ],
    nonGoals: [
      "Natural-language understanding or stemming beyond basic normalization",
      "A web interface (CLI is fine)",
      "Persistence of the index (rebuild on startup is acceptable)",
    ],
    architecture: [
      "A tokenizer module (your state-machine/string work), an index module (inverted index over hash tables and dynamic lists), and a query module",
      "The inverted index maps word → posting list (documents + term frequency); building it is one pass over all tokens",
      "Query evaluation intersects posting lists for multi-word AND, then ranks by accumulated term frequency",
      "Complexity is explicit: you can state the cost of building and querying in terms of corpus and query size",
    ],
    checkpoints: [
      "Indexing a directory of documents produces a correct word→documents mapping (spot-checkable)",
      "Multi-word queries return only documents containing all terms",
      "Results are ranked sensibly (a document mentioning a term more ranks higher)",
      "Performance is measured and the scaling explained via Big-O",
      "Handles a large corpus without excessive memory or crashes",
    ],
    tests: [
      "Tokenization: correct words from tricky inputs (punctuation, case, empty)",
      "Index correctness: known documents appear for known words",
      "Query correctness: AND semantics and ranking on a small verifiable corpus",
      "Robustness: empty files, binary files, and huge files handled",
    ],
    hints: [
      "The inverted index is the same hash-table-of-lists idea as your contact index and adjacency lists — you've built the pieces.",
      "Store term frequency in the posting list to enable ranking; positions enable phrase search later.",
      "Multi-word AND is a posting-list intersection — sort or hash for efficiency, and reason about the cost.",
      "Benchmark deliberately (your Big-O lab discipline): report build and query times across corpus sizes.",
    ],
    solutionOutline: [
      "Tokenization turns documents into normalized word streams; the inverted index accumulates, per word, which documents contain it and how often — a single pass builds the whole structure.",
      "Query evaluation intersects the posting lists of the query terms (AND) and ranks by summed term frequency — the core of how real search engines work, minus the scale and sophistication.",
      "The system composes your data structures (hash tables, dynamic lists) with complexity analysis: you can state and measure why it's fast, which is the point of the CS branch.",
    ],
    extensions: [
      "Add phrase queries using stored positions",
      "Add TF-IDF ranking (connect to your probability/statistics work)",
      "Persist the index to disk and reload it (your file-format skills)",
    ],
  },
  "m-python-automation": {
    requirements: [
      "A unified CLI with subcommands: organize, dedupe, analyze-logs (and more as desired)",
      "File organizer with rule-based sorting, dry-run default, and a reversible undo journal",
      "Duplicate detector using size-then-hash, with safe (confirmation-required) deletion",
      "Log analyzer producing useful reports (error rates, top messages, time ranges) from real log files",
      "Configuration via a config file; structured logging of the toolkit's own actions",
      "A comprehensive pytest suite with fixtures generating test file trees (tmp_path)",
      "Packaged with an entry point so it installs via pip",
    ],
    nonGoals: [
      "A GUI (CLI only)",
      "Cloud or network features",
      "Real-time watching (a one-shot run is enough, though watching is an extension)",
    ],
    architecture: [
      "A plan-then-apply core: each tool computes a plan (pure, testable) before mutating anything, enabling dry-run and undo nearly for free",
      "Shared infrastructure: config loading, logging, and the undo-journal mechanism used across tools",
      "A CLI layer (argparse subcommands) over testable core functions — the tsk layering, scaled up",
      "Undo journals are append-only logs (write-ahead-logging in miniature)",
    ],
    checkpoints: [
      "Dry-run output exactly matches what execution then does",
      "Undo fully reverses an executed run (verified with before/after manifests)",
      "Duplicate detection is correct and never deletes without confirmation",
      "The log analyzer produces correct reports on real logs",
      "The full pytest suite passes in a fresh clone with generated fixtures",
    ],
    tests: [
      "Organizer: plan correctness, execution, and undo round-trip on a generated tree",
      "Dedupe: correct grouping (no false positives on same-size different-content files)",
      "Log analyzer: correct stats on a known log fixture",
      "Safety: dry-run mutates nothing; undo restores exactly",
    ],
    hints: [
      "Reuse and unify your earlier file-organizer and duplicate-detector labs under one CLI and shared infrastructure.",
      "The plan-then-apply pattern is what makes dry-run and undo cheap — keep planning pure and side-effect-free.",
      "Build fixture generators so tests create reproducible messy trees; testable automation needs reproducible inputs.",
      "Path-traversal safety: resolve and bound all paths under the target root before any mutation.",
    ],
    solutionOutline: [
      "Each tool follows plan-then-apply: pure functions compute a list of intended operations (testable, previewable), and a separate execution step performs them with journaling — dry-run and undo fall out of this separation naturally.",
      "Shared infrastructure (config, logging, undo journal) keeps the tools consistent and the codebase DRY; the CLI is a thin layer over tested core functions.",
      "The safety features (dry-run, undo, confirmation) embody the automation discipline that separates trustworthy tools from dangerous scripts — the same defensive mindset as the rest of the roadmap.",
    ],
    extensions: [
      "Add a --watch mode for continuous organizing",
      "Add an HTML report output for the log analyzer",
      "Add more tools sharing the same infrastructure",
    ],
  },
  "m-python-task-cli": {
    requirements: [
      "A well-designed SQLite schema with a schema_version/migrations mechanism from day one",
      "Commands: add (with due dates, tags, priority), list (filter by status/tag/overdue, sort), done, delete, stats",
      "Parameterized queries throughout (never string-built SQL)",
      "Machine-readable output (--json) and human output; correct exit codes and stderr usage",
      "A migration system that can evolve the schema on an existing database without data loss",
      "Comprehensive pytest suite with per-test isolated databases",
      "Packaged with an entry point (pip install -e .)",
    ],
    nonGoals: [
      "A server or sync (local SQLite only)",
      "A GUI or TUI (plain CLI)",
      "Multi-user support",
    ],
    architecture: [
      "Layered: cli (argparse) → core (task logic, pure where possible) → storage (SQLite with migrations) — the tsk skeleton, matured",
      "Migrations are versioned scripts applied in order, tracked in a schema_version table",
      "The storage layer exposes typed operations; core logic is testable independent of the CLI",
      "Configuration (database path) via environment/flags",
    ],
    checkpoints: [
      "A fresh database is created and migrated automatically on first run",
      "Migrations evolve an existing database without losing data (test up-migration on populated DB)",
      "Filters and sorting work correctly, including edge cases (no tasks, invalid dates)",
      "--json output is valid and pipeline-friendly",
      "The test suite runs green in a fresh clone with isolated test databases",
    ],
    tests: [
      "CRUD and filtering via parametrized tests",
      "Migration application on empty and populated databases",
      "CLI-level tests for output format and exit codes",
      "Injection-safety: a malicious tag value cannot alter queries",
    ],
    hints: [
      "This grows directly from your tsk CLI lab — bring migrations and richer commands to production quality.",
      "Migrations: number them, track applied versions in a table, apply pending ones in order on startup. This is how real schema evolution works.",
      "Parameterized queries are your injection defense and a non-negotiable habit — verify it with a malicious-input test.",
      "Isolated per-test databases (tmp_path) keep tests fast, independent, and safe.",
    ],
    solutionOutline: [
      "The layered structure (cli/core/storage) keeps logic testable and SQL contained; migrations make the schema evolvable, tracked in a version table and applied in order — the professional pattern for changing a database that holds real data.",
      "Parameterized queries and typed operations make the storage layer both safe and clear; the core logic's purity makes most tests fast unit tests.",
      "This project cements the bridge from scripting to software: schema design, migrations, testing, and packaging are exactly the maturity the backend branch builds on.",
    ],
    extensions: [
      "Add recurring tasks",
      "Add an export/import (CSV/JSON) with round-trip tests",
      "Add a down-migration (rollback) capability",
    ],
  },
  "m-vanilla-web": {
    requirements: [
      "Semantic, accessible HTML (landmarks, forms with labels, keyboard operable, zero axe violations)",
      "Responsive CSS using your design-token system; works from mobile to desktop",
      "Full interactivity in vanilla JS: add/edit/delete with event delegation, rendering as a function of state",
      "Persistence via localStorage with graceful handling of absent/corrupt data",
      "Proper states: loading (if fetching anything), empty, success, and error",
      "Safe rendering: all user text via textContent, no XSS via innerHTML",
      "No framework, no build step required (or a minimal one) — the platform, directly",
    ],
    nonGoals: [
      "A backend (localStorage persistence only)",
      "A framework (that's the point — none)",
      "User accounts",
    ],
    architecture: [
      "State → render: a single source-of-truth state object, a render function projecting it to DOM, and event handlers mutating state then re-rendering — the model React later automates",
      "Modules: logic (pure, your JS lab), rendering, and storage — separated and testable",
      "Event delegation for dynamic content; one listener per container",
      "Accessibility and responsiveness built in from the start, not retrofitted",
    ],
    checkpoints: [
      "The app is fully functional: add/edit/delete, persisted across reloads",
      "It's accessible (keyboard, screen reader, zero axe violations) and responsive",
      "Rendering derives entirely from state; no ad-hoc DOM patching",
      "User input is safely rendered (a planted <script> is inert)",
      "Empty/error/success states all reachable and correct",
    ],
    tests: [
      "Logic module tested with assertions on a fixed dataset",
      "Manual accessibility pass (keyboard + axe) documented",
      "State→render correctness on a sequence of operations",
      "XSS-safety: user-provided text cannot execute",
    ],
    hints: [
      "This unifies your HTML, CSS, JS, and DOM labs into one polished artifact.",
      "Build state→render by hand deliberately — experiencing it is what makes React click later.",
      "Event delegation handles dynamically added items with one listener; use it.",
      "textContent for all user data. This is your XSS defense at the platform level.",
    ],
    solutionOutline: [
      "The state→render architecture is the heart: all UI derives from one state object, changes flow through handlers that mutate state and re-render, and event delegation handles dynamic content — building this manually reveals exactly what React's virtual DOM automates.",
      "Separating logic, rendering, and storage into modules keeps each testable and swappable, the same layering discipline as everywhere else.",
      "Accessibility, responsiveness, and safe rendering built in from the start prove platform mastery — you can build for the web with or without a framework, which is what makes framework choices informed rather than default.",
    ],
    extensions: [
      "Add charts using the Canvas API (no library)",
      "Add import/export of data as JSON",
      "Add a service worker for offline use (preview of PWAs)",
    ],
  },
  "m-fullstack-issue-tracker": {
    requirements: [
      "React/TypeScript frontend: issue list with search/filter, detail views, create/edit forms, all four data states, routing (hash-based for static hosting)",
      "FastAPI/PostgreSQL backend: full CRUD, validation, pagination/filtering, correct status codes and error shapes — matching your API design",
      "Authentication and authorization: secure password hashing, tokens, protected endpoints, ownership/role checks on every sensitive action",
      "Comprehensive testing: frontend component tests, backend unit/integration/e2e tests, all green in CI",
      "Structured logging with request correlation; configuration via environment; secrets never in code",
      "CI pipeline (GitHub Actions) running all tests/checks on every push; deployed (frontend static, backend on a free tier)",
      "Security verified: the app defends against injection, XSS, and broken access control (tested in the security branch)",
    ],
    nonGoals: [
      "Real-time updates (polling is fine; websockets are an extension)",
      "Advanced features (labels/comments are enough; not a full GitHub clone)",
      "Horizontal scaling (single instance is fine)",
    ],
    architecture: [
      "Clean layering front and back: React components over a typed data-layer (anti-corruption boundary); FastAPI handlers over core logic over a storage interface",
      "The frontend's data layer is swappable from mock to real API without touching components",
      "Business logic separated from the framework and database behind testable seams (your testing-strategy lab); the Software Architecture phase will later harden these into full boundaries",
      "Auth as a cross-cutting concern via dependency injection; authorization checked per resource",
      "CI encodes all quality gates; deployment is reproducible and configured by environment",
    ],
    checkpoints: [
      "The frontend and backend are integrated: real data flows end to end",
      "Authentication works and authorization prevents cross-user access (tested)",
      "The full test suite (frontend + backend) is green in CI",
      "The app is deployed and reachable on the internet",
      "Security testing confirms defenses against injection, XSS, and broken access control",
    ],
    tests: [
      "Backend: unit (logic), integration (test DB), e2e (API) — happy and sad paths, including auth abuse cases",
      "Frontend: component tests for states, interactions, and forms",
      "Security: injection, XSS, and access-control attacks are defeated (from the security branch)",
      "CI runs everything on every push and gates merges",
    ],
    hints: [
      "This is the culmination of the web and backend branches — you build it incrementally across those branches, not all at once.",
      "Contract-first: your API design (paper spec) lets frontend and backend proceed in parallel against the agreed contract.",
      "Keep the domain core framework-independent so both testing and future change stay easy.",
      "Authorization on every sensitive action is non-negotiable — broken access control is OWASP #1; test it explicitly.",
    ],
    solutionOutline: [
      "The system layers cleanly on both sides: React components over a typed, swappable data layer; FastAPI over a framework-independent domain core over a storage interface — the boundaries you practiced make each half testable and evolvable.",
      "Auth is authentication (identity via hashed passwords and tokens) plus authorization (per-resource ownership/role checks), applied as cross-cutting concerns; getting authorization right on every action is the security crux.",
      "Testing, CI, logging, and deployment turn it from a demo into software: quality gates run automatically, the system is observable, and it's reproducibly deployed — this is what 'full-stack engineer' actually means, and the security branch then proves the defenses hold.",
    ],
    extensions: [
      "Add real-time updates via websockets or polling",
      "Add the React Native companion (mobile milestone)",
      "Add comments, labels, and search improvements",
    ],
  },
  "m-networked-chat": {
    requirements: [
      "A server handling many concurrent clients (threads or async/select) and broadcasting messages",
      "A concurrent client (send and receive simultaneously)",
      "A designed protocol with explicit framing (length-prefixed), a documented message format, and a version/type field",
      "Resilience: partial reads reassembled, oversized/malformed messages rejected without crashing, clients disconnecting handled gracefully",
      "Concurrency safety: shared client state protected correctly (your synchronization discipline)",
      "Wireshark analysis of a session: handshake, framing, and payloads identified",
      "A malicious-client test that cannot crash or hang the server",
    ],
    nonGoals: [
      "Encryption from scratch (use TLS via a library as an extension; never hand-roll)",
      "Persistence of message history",
      "A GUI (terminal clients are fine)",
    ],
    architecture: [
      "The server multiplexes clients (thread-per-client or select/poll); a shared, synchronized client registry enables broadcast",
      "Each connection is handled as a small state machine (connecting, active, closing) — your FSM work",
      "Length-prefixed framing turns TCP's byte stream into discrete messages; all input is validated and bounded",
      "Concurrency primitives protect the shared client list (your job-queue lab's discipline)",
    ],
    checkpoints: [
      "Multiple clients chat concurrently with correct broadcast",
      "A message split across TCP segments reassembles correctly",
      "Malformed/oversized messages are rejected without affecting the server or other clients",
      "No races on shared client state (ThreadSanitizer clean if C)",
      "Wireshark confirms the protocol matches the spec",
    ],
    tests: [
      "Concurrent clients and rapid messages: no corruption, no leaks, no races",
      "Malicious client (garbage, truncated, oversized frames): server survives",
      "Disconnect handling: abrupt client loss doesn't disrupt others",
      "Framing: partial reads reassembled correctly",
    ],
    hints: [
      "TCP is a byte stream — framing is mandatory. This is the #1 networking mistake; length-prefix every message.",
      "Never trust the length prefix: bound it before reading/allocating (defensive parsing over the wire).",
      "Model each connection as a state machine; disconnection is a normal event.",
      "Protect the shared client registry with your synchronization skills — broadcast touches shared state.",
    ],
    solutionOutline: [
      "The server multiplexes concurrent clients and broadcasts via a synchronized shared registry; length-prefixed framing reconstructs messages from TCP's stream, and every frame is validated and bounded — the intersection of your networking, concurrency, and defensive-parsing skills.",
      "Treating each connection as a state machine and all input as hostile is what makes the server robust against malformed data and abrupt disconnects — a security property as much as a correctness one.",
      "Wireshark closes the loop: you designed the protocol and now observe it on the wire, making the abstract concrete and demonstrating why framing and validation matter.",
    ],
    extensions: [
      "Add rooms/channels and private messages",
      "Add TLS via a vetted library (never hand-rolled) and re-inspect",
      "Add a UDP presence/heartbeat feature and contrast reliability",
    ],
  },
  "m-http-server-c": {
    requirements: [
      "Accept TCP connections and parse HTTP/1.1 requests (request line, headers) as a robust state machine",
      "Serve static files from a document root with correct Content-Type and Content-Length",
      "Correct status codes: 200, 404, 400 (malformed request), 405 (bad method), 403/400 for path-traversal attempts",
      "Strict security: reject path traversal (../ escaping the document root), bound request sizes, timeout slow clients",
      "Robust parsing: partial reads, malformed requests, and hostile input handled without crashing",
      "Tested against real browsers and curl, plus a malicious-request test suite",
      "Concurrency (thread-per-connection or select) as a documented extension",
    ],
    nonGoals: [
      "HTTPS/TLS from scratch (a library-based extension at most)",
      "Dynamic content/CGI (static files suffice; dynamic is an extension)",
      "Full HTTP/1.1 compliance (a robust subset is the goal)",
    ],
    architecture: [
      "A connection handler that reads a request, parses it via an HTTP state machine, resolves and validates the path, and writes a response",
      "Request parsing is a state machine over the byte stream (request line → headers → done), with all input bounded and validated",
      "Path resolution canonicalizes and confirms the target stays within the document root (the critical security check)",
      "File serving reuses your file-I/O discipline; responses are built with correct headers",
    ],
    checkpoints: [
      "Real browsers and curl successfully fetch files served by your server",
      "Correct status codes for found, not-found, malformed, and forbidden requests",
      "Path-traversal attempts (../../etc/passwd) are blocked before any file access",
      "Malformed and oversized requests are rejected without crashing",
      "Serves a large file correctly (buffered, not slurped)",
    ],
    tests: [
      "Valid requests for existing/missing files return correct responses",
      "Malformed requests (bad request line, huge headers) are rejected cleanly",
      "Path traversal is blocked (a security test suite)",
      "Content-Type and Content-Length are correct for various file types",
    ],
    hints: [
      "HTTP request parsing is a state machine over a byte stream — your FSM and framing skills apply directly.",
      "Path traversal is THE security bug here: canonicalize the path and verify it's still under the document root before opening anything. This is your file-organizer path-safety lesson, exposed to the internet.",
      "Bound everything: request size, header count, line length. An unbounded server is a DoS waiting to happen.",
      "Test with real curl and browsers early — they'll send things your hand-tests won't.",
    ],
    solutionOutline: [
      "The server accepts connections, parses each HTTP request as a bounded state machine, validates the requested path stays within the document root, and serves the file with correct headers — combining your networking, systems, parsing, and file-I/O skills.",
      "Security is central and internet-facing: path-traversal prevention, bounded input, and timeouts defend against the attacks every exposed server faces — this is where your defensive habits become load-bearing.",
      "Building the thing that serves the web demystifies it completely: an HTTP server is a socket loop, a parser, a path check, and file I/O — all pieces you've built, now composed.",
    ],
    extensions: [
      "Add concurrency (thread-per-connection or an event loop) and measure throughput",
      "Add keep-alive connections",
      "Add TLS via a library (never hand-rolled)",
      "Add simple dynamic routes",
    ],
  },
  "m-react-native-companion": {
    requirements: [
      "An Expo/TypeScript app authenticating against your issue-tracker API with secure token storage (secure enclave, not plain storage)",
      "Browse and view issues, cached locally for offline access",
      "Create issues with optimistic UI, queuing when offline and syncing on reconnect",
      "Explicit loading/error/offline/empty states throughout with retry affordances",
      "One device API used respectfully (e.g., camera for attachments) with proper permissions",
      "Tests for the data/sync logic and a produced build installable on a device",
    ],
    nonGoals: [
      "Reimplementing the backend (reuse the existing one)",
      "Full feature parity with the web app (core flows suffice)",
      "Publishing to app stores (a device build is enough)",
    ],
    architecture: [
      "A local cache/queue layered over a typed API client (reusing the web data-layer patterns)",
      "Reads serve cache-then-network; writes go optimistic-then-sync with reconciliation",
      "Secure token storage via the platform enclave; all transport over TLS",
      "React Native components reusing your React composition and state discipline",
    ],
    checkpoints: [
      "The app authenticates and accesses protected endpoints securely",
      "Cached data is browsable offline (airplane-mode tested)",
      "Offline-created issues queue and sync on reconnect, with failures surfaced",
      "The token is in secure storage; every network op has visible state handling",
      "A build installs and runs on a real device",
    ],
    tests: [
      "Data/sync logic: cache reads, queue behavior, reconciliation",
      "Offline/error handling: airplane mode, expired token, server down mid-sync",
      "Secure token storage verified",
      "Optimistic create with rollback on failure",
    ],
    hints: [
      "Reuse your web data-layer patterns — the typed API client and four data states transfer; the network realities and secure storage are the new parts.",
      "Offline-first: read cache immediately, reconcile with server after. Never show a blank screen because the network is slow.",
      "Tokens go in the secure enclave (expo-secure-store), never plain AsyncStorage — the mobile version of your web token-storage lesson.",
      "Optimistic writes need a rollback path; optimism without reconciliation is a lie to the user.",
    ],
    solutionOutline: [
      "The app layers a local cache and write-queue over a typed API client: reads are cache-then-network and writes are optimistic-then-sync, making the network an enhancement rather than a hard dependency — which is what mobile connectivity demands.",
      "Security centers on secure token storage, TLS, and least-privilege permissions, with the server still authorizing every action (the client is never trusted).",
      "This proves the roadmap's thesis for mobile: your React, TypeScript, API, and security foundations transfer wholesale; mobile adds offline resilience and device concerns, not a new beginning.",
    ],
    extensions: [
      "Add push notifications (ties to backend background tasks)",
      "Add background sync",
      "Handle true edit conflicts between devices",
    ],
  },
  "m-architecture-evolution": {
    requirements: [
      "A decision log: your branch mini-ADRs consolidated to one template, plus retroactive ADRs for the unrecorded founding decisions — every ADR naming the quality attributes (changeability, reliability, observability, latency) it trades between",
      "Explicit quality-attribute targets for the system, written down and measurable (e.g., p95 read latency under load, zero lost notifications through a worker restart, core testable with no infrastructure)",
      "Enforced boundaries: the domain core free of framework/DB imports, checked mechanically in CI (a fitness function), with contract tests at every port — storage adapters and the queue seam",
      "Automated tests at the right levels: fast core tests with no infrastructure, adapter contract tests per implementation, failure-mode tests (timeout, retry, duplicate delivery), and at least one end-to-end path",
      "Working observability: structured logs with a correlation id crossing the queue hop, golden-signal metrics, and a health endpoint — demonstrated by reconstructing one request's full story",
      "A scripted failure/recovery exercise: kill the database mid-request and the worker mid-message, black-hole the notification target; document designed vs. observed behavior and the recovery steps",
      "A migration/evolution plan for one real upcoming change, strangler-fig style with slices, proof metrics, and rollback moves — and the first slice executed behind a facade",
      "A final architecture document: the module/dependency map as built, the ADR index, and the criteria a future maintainer should use to revisit the big decisions",
    ],
    nonGoals: [
      "Splitting into microservices (one async seam is the correct amount of distribution here)",
      "Adopting new infrastructure for its own sake (no Kubernetes, no service mesh, no second database)",
      "A big-bang rewrite of any component (the migration plan must be incremental or it fails the brief)",
      "Dashboards beyond the golden signals (observability is judged by questions you can answer, not panels)",
    ],
    architecture: [
      "The tracker as evolved through the branch: domain core behind ports; PostgreSQL, FastAPI, and the queue as adapters; one asynchronous worker for notifications",
      "CI as the architecture's guardian: the dependency fitness function, contract tests per adapter, and failure-mode tests all gate merges",
      "Telemetry as a first-class component: logs/metrics designed with the same care as the API contract",
      "The strangler facade routing between old and new implementations of the migrated corner, observable per path",
    ],
    checkpoints: [
      "The ADR log reads coherently and a newcomer can answer 'why is it shaped this way?' from it alone",
      "The fitness function and contract tests fail CI when deliberately violated (demonstrate once)",
      "The failure drill runs from a script and the system degrades and recovers as designed, with no manual data repair",
      "One request's story — API through queue to worker — is reconstructed from telemetry in under a minute",
      "The first migration slice serves real traffic with the old path intact and a working rollback toggle",
      "Every quality-attribute target is either met with evidence or has a written, honest gap analysis",
    ],
    tests: [
      "Core domain tests run with no database or network and stay fast (that speed is itself an architectural assertion)",
      "One contract-test suite passes against every adapter of each port",
      "Failure-mode tests: timeout enforcement, bounded retry with backoff, duplicate-delivery idempotency, dead-letter routing",
      "An end-to-end test covering the full path including the async hop",
      "The CI fitness function: no framework/DB imports inside the core, no new dependency cycles",
    ],
    hints: [
      "Start from the quality attributes, not the code: write the targets first, then audit which ones the current system already meets — that gap list is your work plan.",
      "The failure drill script is the most valuable artifact for a reviewer: make it runnable by someone else (`./drill.sh` with numbered scenarios beats prose instructions).",
      "Retroactive ADRs feel awkward to write; do them anyway. The discipline of honestly recording a years-old decision's consequences is the judgment this milestone exists to prove.",
      "If a requirement tempts you toward new infrastructure, re-read the non-goals: the brief rewards restraint with evidence over ambition with diagrams.",
    ],
    solutionOutline: [
      "The milestone integrates the whole branch: modularity gives the map, boundaries give the enforceable structure, contracts govern the edges, the chosen shape stays a modular monolith with one seam, reliability and observability make it survivable and visible, and the ADR log plus migration plan make it evolvable.",
      "Architectural judgment shows up as restraint under pressure: explicit quality attributes turn taste into testable claims, and non-goals turn 'we could' into 'we deliberately won't'.",
      "The failure drill and the migration slice are the two proofs that can't be faked on paper: one shows the system behaves as designed when reality misbehaves, the other shows the architecture can change while it runs — which is the whole point of having one.",
    ],
    extensions: [
      "Execute the migration's second slice and update the plan with what the first taught you",
      "Add a lightweight architecture diagram generated from the real dependency graph, so the docs cannot drift",
      "Run the failure drill against the deployed instance (not just locally) and reconcile any behavioral differences",
    ],
  },
  "m-security-capstone": {
    requirements: [
      "A complete application to secure (your full-stack issue tracker is ideal)",
      "A thorough threat model: assets, adversaries, trust boundaries, and attack surface (your mindset lab, applied fully)",
      "An authorized security assessment: attack YOUR OWN application in a local environment across the OWASP categories and any memory/dependency issues",
      "Remediation of every finding, with re-testing to confirm closure",
      "Defense in depth: input validation, authorization on every action, secure auth, dependency auditing, security headers",
      "A professional security report: methodology, findings, remediations, residual risks, and trade-offs",
      "Explicit confirmation that all testing is on your own application in an authorized local environment",
    ],
    nonGoals: [
      "Attacking any system you don't own (strictly prohibited)",
      "Novel vulnerability research (applying known classes is the goal)",
      "A formal audit or certification",
    ],
    architecture: [
      "The application under test plus a documented, isolated local testing environment",
      "Layered defenses mapped to threats: validation at boundaries, authorization per resource, secure auth and secrets, dependency and transport security",
      "A repeatable assessment process: threat model → test each class → remediate → re-test → document",
      "Security integrated into the architecture (boundaries where checks live), not bolted on",
    ],
    checkpoints: [
      "The threat model is complete and drives the assessment",
      "Each OWASP category (and relevant memory/dependency issues) is tested against your own app",
      "Every finding is remediated and re-tested to confirmation",
      "Defense in depth is demonstrable (multiple layers, not a single control)",
      "The report is professional and honest about residual risk",
    ],
    tests: [
      "Injection, XSS, and broken-access-control attacks are defeated (verified by attempting them)",
      "Authentication/session robustness against the known failure modes",
      "Dependency audit is clean or risks documented and mitigated",
      "Automated security regression tests added to the suite",
    ],
    hints: [
      "This integrates the entire security branch with your flagship app — threat model first, then attack your own system methodically, then fix and re-test.",
      "Only your own application, in an authorized local environment. This is the absolute, non-negotiable boundary of all security work.",
      "Defense in depth: no single control is enough. Layer validation, authorization, secure auth, dependency hygiene, and headers.",
      "Write the report as a professional would: methodology, findings with severity, remediations, and honest residual risk — this is a portfolio piece.",
    ],
    solutionOutline: [
      "The capstone runs the full secure-engineering loop: a threat model identifies what to protect and where; an authorized assessment against your own app tests each vulnerability class; remediation with re-testing closes findings; and defense in depth ensures no single failure is catastrophic.",
      "It integrates everything — the app you built (web/backend), the architecture that places security boundaries, and the security branch's offensive and defensive knowledge — proving you can engineer securely, not just code.",
      "The ethical frame is the foundation: all testing is on your own application in an isolated, authorized environment, and the professional report demonstrates the responsible, documented practice that distinguishes a security engineer from an attacker.",
    ],
    extensions: [
      "Add continuous security testing to CI (dependency scanning, security regression tests)",
      "Conduct a peer review: exchange threat models with a classmate (on your own apps only)",
      "Practice responsible disclosure norms by writing a mock disclosure report",
    ],
  },
};

export const milestones: MilestoneProject[] = milestonesLite.map((lite) => {
  const body = milestoneBodies[lite.id];
  if (!body) {
    throw new Error(`Milestone "${lite.id}" has a lite entry but no body in milestones.ts`);
  }
  return { ...lite, ...body };
});

{
  const liteIds = new Set(milestonesLite.map((m) => m.id));
  for (const id of Object.keys(milestoneBodies)) {
    if (!liteIds.has(id)) {
      throw new Error(`Milestone body "${id}" has no matching entry in milestonesLite.ts`);
    }
  }
}
