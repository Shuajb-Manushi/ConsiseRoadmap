import type { TopicBody } from "../../types";
import { R } from "../../resourceCatalog";


export const pythonBodies: Record<string, TopicBody> = {
  "py-core": {
    whyItMatters:
      "Python is the language of automation, scripting, backend services, security tooling, and data work — the highest-leverage second language possible. Learning it through the C lens ('a dict is my hash table with a garbage collector') makes you dangerous in a week instead of a semester.",
    concepts: [
      "Names bind to objects: id(), aliasing, and mutation vs. rebinding — pointer intuition transferred",
      "Mutable vs. immutable types, and the mutable-default-argument trap",
      "list = your dynamic array; dict = your hash table; set; tuple — with the costs you already know",
      "Slicing, negative indexes, and copies vs. views",
      "Comprehensions as loop expressions; when they clarify and when they obscure",
      "Iterators and the protocol behind for; generators and yield for lazy sequences",
      "Truthiness, None, and equality (==) vs. identity (is)",
    ],
    practicalUses: [
      "Everything in this branch: file wrangling, log analysis, API clients, test tooling",
      "Prototyping an idea in an evening that would take a week in C",
      "Reading the enormous world of existing Python: tools, exploits, scripts, notebooks",
    ],
    lab: {
      title: "Re-speak Your C in Python",
      scenario:
        "Translate greatest-hits from your C labs into idiomatic Python — word frequency, the contact index, top-K — then investigate the runtime itself: prove aliasing behavior, benchmark dict against your mental model, and use generators to process a file too big to slurp.",
      outcome:
        "Python fluency grounded in your C mental model, awareness of the classic beginner traps (which you'll sidestep via aliasing knowledge), and a felt sense of the productivity trade.",
      requirements: [
        "Word-frequency reporter in ≤ 25 idiomatic lines (dict + comprehension + sorted with key=), matching your C version's output on the same file",
        "Aliasing lab: predict-then-run 10 snippets involving list aliasing, copy vs deepcopy, mutable default args, and is vs == — written predictions first, C-style memory diagrams for each",
        "Contact index: dict-of-dataclasses port of your C hash-table app, with the two-index (name, phone) design — note what ownership discipline evaporated",
        "Generator pipeline: process a 1GB synthetic log lazily (generate it first) — count error lines and extract timestamps with O(1) memory; prove memory stays flat",
        "Micro-benchmark: dict lookup vs. list scan at 1M entries with time.perf_counter — connect the numbers to your C hash-table benchmark",
      ],
      checkpoints: [
        "Word counts byte-identical with your C tool on the same input",
        "At least 8/10 aliasing predictions correct — misses explained with diagrams",
        "The generator version's memory verified flat (watch the process in Task Manager or tracemalloc)",
        "You can articulate what Python is doing that free() used to be for",
      ],
      hints: [
        "Every Python variable is a void* with a refcount — rebinding moves the pointer, mutation writes through it. All 10 puzzles fall to this.",
        "collections.Counter is the standard-library answer to word counting — write it manually first, then discover Counter and appreciate it.",
        "yield turns a function into a resumable frame — your explicit-stack recursion knowledge explains exactly how.",
      ],
      validation: [
        "Run your predictions file as an executable test: assertions, not vibes",
        "The pipeline handles the 1GB file without MemoryError on your machine",
      ],
      solutionOutline: [
        "Python objects live in a heap arena with reference-counted lifetimes: variables are typed-at-runtime references, so aliasing behavior is pointer behavior with safety rails.",
        "dict is open-addressing hash table (you built chaining; same theory, different collision response) — O(1) average, resize at load threshold, insertion-ordered since 3.7.",
        "Generators are stack frames the runtime pauses and resumes — lazy evaluation making 'process infinite/huge streams' the same code as small lists.",
      ],
      extensions: [
        "Read CPython's listobject growth factor and compare with your doubling choice",
        "Implement your own range-like iterator class to touch __iter__/__next__ directly",
      ],
    },
    resources: {
      primary: [
        { ...R.cs50p, url: "https://cs50.harvard.edu/python/weeks/0/", guidance: "Skim the Week 0–2 lectures at higher speed — you already program; you're watching for how Python does it. Slow down wherever Python surprises you (names vs. boxes, truthiness, for-else)." },
      ],
      alternatives: [
        { ...R.pyTutorial, guidance: "Sections 3–5 and 9.9+ (data structures, iterators) — a faster text route for a C programmer." },
      ],
      practice: [
        { ...R.pythonTutor, guidance: "Step through list-aliasing examples and watch two names point at one object — the C-to-Python mental shift, visualized." },
        { ...R.exercism, title: "Exercism — Python Track", url: "https://exercism.org/tracks/python", guidance: "A dozen small exercises to make the syntax automatic." },
      ],
      extra: [
        { ...R.automate, guidance: "Chapters 1–6 if you prefer learning via little automation tasks." },
      ],
    },
    masteryChecks: [
      "Explain, with a memory diagram, why appending to a list inside a function is visible to the caller but rebinding isn't",
      "Choose list vs. dict vs. set for five lookup/membership scenarios with complexity justification",
      "Rewrite a nested loop as a comprehension and a comprehension back into loops",
    ],
  },
  "py-functions-errors": {
    whyItMatters:
      "Exceptions replace C's 'check every return code' with enforced, non-ignorable errors — understanding both models makes you better at each. Closures and decorators are ubiquitous in real Python (Flask/FastAPI routes, pytest fixtures), and module hygiene is what separates scripts from software.",
    concepts: [
      "Argument forms: positional, keyword, defaults (evaluated once!), *args/**kwargs",
      "First-class functions and closures: functions capturing environment — function pointers plus state",
      "Decorators as wrap-and-replace; writing one dispels the magic",
      "Modules, packages, __init__.py, absolute imports, and the __name__ == '__main__' idiom",
      "Exceptions: try/except/else/finally, exception hierarchy, catching narrowly",
      "Raising with intent: custom exception classes, chaining (raise ... from), and never except: pass",
      "Context managers: with as RAII — the file-closing guarantee C made you do manually",
    ],
    practicalUses: [
      "Structuring any tool bigger than one file",
      "Error strategies for scripts that must not silently lie (automation that 'worked' but didn't)",
      "Reading framework code: decorators and context managers are everywhere",
    ],
    lab: {
      title: "A Retry/Timing Toolkit",
      scenario:
        "Build a small utilities package you'll genuinely reuse: @timed (log a function's duration), @retry(times, exceptions) (re-attempt flaky operations with backoff), and a context manager for atomic file writes (write temp, rename on success). Package it properly and exercise every error path.",
      outcome:
        "Closures, decorators, context managers, and exception design stop being framework magic — you've built the same machinery frameworks are made of, in a package with a real structure.",
      requirements: [
        "A package layout: toolkit/ with modules, importable from a sibling script; no sys.path hacks",
        "@timed via closure; preserves the wrapped function's name (discover functools.wraps by needing it)",
        "@retry(times=3, on=(OSError,), backoff=0.1): parameterized decorator (the three-layer onion), re-raising the last error after exhaustion with context intact",
        "atomic_write(path) context manager: temp file + os.replace on clean exit; temp removed on exception — prove both paths with tests",
        "A custom exception hierarchy (ToolkitError base) and a demo script showing narrow catching vs. the evils of bare except",
        "Every behavior asserted in a test script, including: default-arg trap demonstration, retry counts, atomicity under injected failure",
      ],
      checkpoints: [
        "@retry actually re-raises after N failures — verified with a deliberately flaky function using a call counter",
        "Interrupting an atomic write (raise mid-block) leaves the original file untouched",
        "help(wrapped_function) shows the right name and docstring",
        "Imports work from outside the package directory",
      ],
      hints: [
        "A parameterized decorator is a function returning a decorator returning a wrapper — write the three defs with honest names before compressing.",
        "The closure captures loop variables by reference, not value — the classic lambda-in-loop bug is worth triggering on purpose here.",
        "Context manager: either a class with __enter__/__exit__ or @contextlib.contextmanager with one yield — do it both ways once.",
      ],
      validation: [
        "Kill -9 (or raise) during a write: original file intact, temp cleaned",
        "Retry telemetry: exactly N attempts, exponential delays measured",
        "A fresh terminal can pip install -e the package and import it",
      ],
      solutionOutline: [
        "Decorators are just call-time composition: f = deco(f) — everything else is closures carrying configuration inward.",
        "Exception design mirrors your C error-code discipline: leaf raises specific types, boundaries translate to user messages; the difference is the runtime enforces propagation.",
        "Atomic write works because rename within a filesystem is atomic at the OS level — a systems fact (you'll meet it again in OSTEP) wrapped in a Python idiom.",
      ],
      extensions: [
        "Add @memoize and connect it to the dynamic-programming idea from recursion",
        "Add logging integration to @timed instead of print — previewing observability",
      ],
    },
    resources: {
      primary: [
        { ...R.cs50p, url: "https://cs50.harvard.edu/python/weeks/3/", guidance: "Watch the Week 3 'Exceptions' lecture (~1 h), then the Week 4 'Libraries' lecture for modules and imports — the two pillars of this topic." },
      ],
      alternatives: [
        { ...R.pyTutorial, guidance: "Sections 4 (functions), 6 (modules), 8 (errors) — then write the lab." },
      ],
      practice: [
        { ...R.exercism, title: "Exercism — Python Track", url: "https://exercism.org/tracks/python", guidance: "Do a few exercises using exceptions and higher-order functions." },
      ],
      extra: [
        { ...R.automate, guidance: "Its functions and debugging chapters teach the same material by doing." },
        { ...R.pytestDocs, guidance: "Peek at fixtures — you'll recognize decorators and context managers immediately." },
      ],
    },
    masteryChecks: [
      "Write a parameterized decorator on a whiteboard without notes",
      "Explain what finally guarantees that 'code after the call' doesn't, with a concrete failure",
      "Design the exception hierarchy for a downloader tool: what's caught where, and what reaches the user",
    ],
    securityNote:
      "except: pass is a security anti-pattern, not just a style crime: swallowing errors hides tampering, failed validations, and attack probes. Handle what you expect, let the rest crash loudly into logs.",
  },
  "py-files-stdlib": {
    whyItMatters:
      "This toolset is Python's actual superpower: 90% of real-world automation is 'walk files, parse formats, transform, write results'. Engineers fluent here automate away hours weekly; it's also the substrate of the data pipelines, security tooling, and build scripts you'll meet everywhere.",
    concepts: [
      "pathlib.Path: joining, globbing, stat, walking trees — the OO filesystem",
      "Text encodings in practice: always specify encoding='utf-8'; bytes vs. str as a type boundary",
      "JSON: nested dict/list ↔ text; schema-less means validate-on-read",
      "CSV's deceptive difficulty (quoting, delimiters) and why you use the module, not split(',')",
      "Regular expressions: literal classes, quantifiers, groups, and restraint — parse formats with parsers, patterns with regex",
      "hashlib, shutil, collections, itertools, datetime — the discovery habit: check the stdlib first",
    ],
    practicalUses: [
      "Bulk file operations: organize, rename, deduplicate, report",
      "Reading/writing the config and export formats every tool speaks",
      "Log extraction: pull structure out of text with groups",
    ],
    lab: {
      title: "Safe File Organizer + Duplicate Detector",
      scenario:
        "Build the tool everyone wants: point it at a messy folder (Downloads…) and it sorts files into category folders by rules — but engineered with production paranoia: dry-run by default, a JSON undo journal that can reverse everything, collision handling, and a duplicate finder using size-then-hash that never deletes without explicit confirmation.",
      outcome:
        "A tool you will actually keep using, built with the two habits that distinguish safe automation — preview before mutation, journal for reversal — plus hashing and JSON in muscle memory.",
      requirements: [
        "Rules in a JSON config: extension/pattern → destination; config validated on load with helpful errors",
        "Dry-run default: prints the full plan ('would move X → Y'); --execute actually moves",
        "Undo journal: every executed run writes moves.json (timestamp, src, dst); undo command replays it in reverse, handling already-missing files gracefully",
        "Name collisions: never overwrite — suffix strategy (report (1).pdf), tested",
        "Duplicate detector: group by size first, then hashlib.sha256 in chunks (never slurp) — report groups with wasted bytes; optional interactive delete keeps newest, requires typed confirmation",
        "Regex extraction task: pull dates from mixed filenames (report_2024-03-01.pdf, IMG20240301.jpg) into ISO form for a rename suggestion — with a tested pattern set",
      ],
      checkpoints: [
        "Dry-run output on a synthetic messy folder (build a fixture generator!) matches exactly what --execute then does",
        "undo restores the fixture to byte-identical state (verify with a before/after manifest hash)",
        "Duplicate groups verified: planted duplicates found; different-content-same-size files NOT falsely grouped",
        "Chunked hashing memory stays flat on a 2GB fixture file",
      ],
      hints: [
        "Build the fixture generator first — testable automation needs reproducible mess.",
        "Size-first grouping makes hashing rare: only same-size files can be duplicates. This is your 'cheap filter before expensive check' pattern from Big-O.",
        "os.replace vs shutil.move semantics across devices differ — read the docs and note which you need (discovery habit, exercised).",
      ],
      validation: [
        "A pytest-style test (even simple asserts) runs organize→verify→undo→verify on the fixture in CI-able form",
        "Malformed config, unreadable file, and full-disk (simulate with a tiny tmpfs in WSL if adventurous) all produce clean errors, never partial silent damage",
      ],
      solutionOutline: [
        "The architecture is plan-then-apply: rule evaluation produces a list of Move objects (pure, testable); execution is a dumb loop over the plan with journaling — separating decision from mutation is what makes dry-run and undo nearly free.",
        "The journal is an append-only log — the same idea as database write-ahead logging, met here in miniature.",
        "Duplicate detection is a two-stage filter cascade (size → hash), an instance of the universal cheap-test-first optimization pattern.",
      ],
      extensions: [
        "Add a --watch mode with polling — your first long-running tool",
        "Emit an HTML report of duplicates (string templates now; real templates later)",
      ],
    },
    resources: {
      primary: [
        { ...R.cs50p, url: "https://cs50.harvard.edu/python/weeks/6/", guidance: "Watch Week 6 'File I/O' (~1 h), then Week 7 'Regular Expressions' (~1 h) — the two halves of this topic, taught brilliantly." },
      ],
      alternatives: [
        { ...R.automate, guidance: "The files, organizing, and pattern-matching chapters map 1:1 to this lab." },
      ],
      practice: [
        { ...R.regexone, guidance: "Lessons 1–15: each regex concept practiced against live test strings — do this before writing the duplicate detector's patterns." },
      ],
      extra: [
        { ...R.pyTutorial, guidance: "Sections 10–11 tour the stdlib modules used here." },
        { ...R.pytestDocs, guidance: "tmp_path fixture docs — purpose-built for testing exactly this kind of tool." },
      ],
    },
    masteryChecks: [
      "Walk a tree and produce {extension: total_bytes} in under 10 lines from memory",
      "Explain why CSV needs a parser (quoting) with a concrete breaking example for split(',')",
      "Write the regex for ISO dates and defend each character; state one place regex is the wrong tool",
    ],
    securityNote:
      "Path traversal is the classic automation vulnerability: filenames containing ../ can escape your target directory when joined naively. Resolve paths and verify they remain under the intended root before any move/delete — your organizer should include this check.",
  },
  "py-classes-types": {
    whyItMatters:
      "Real Python codebases (FastAPI ahead, every serious library) are typed and class-structured — but the industry's scars show in the advice: shallow hierarchies, composition, protocols. Type hints specifically transform Python from 'runs then crashes' to 'checked before running', and they're how your editor becomes intelligent.",
    concepts: [
      "Classes: __init__, methods, instances — self as the explicit this",
      "@dataclass for record types: your C structs, with free equality and repr",
      "Dunder methods: __repr__, __eq__, __len__, __iter__ — making objects speak the language",
      "Composition over inheritance: has-a beats is-a; where a single level of inheritance genuinely helps",
      "Protocols/duck typing: 'accepts anything with .read()' formalized",
      "Type hints: parameters, returns, Optional, Union, generics (list[int], dict[str, User])",
      "Running a type checker and treating its errors as the gift they are",
    ],
    practicalUses: [
      "Modeling domains: the Task, Contact, Issue types of every app ahead",
      "Library API design people can guess without docs",
      "Editor superpowers and refactoring safety via types",
    ],
    lab: {
      title: "A Typed Ledger Library",
      scenario:
        "Design a small personal-finance ledger library (accounts, transactions, categories, queries) — no UI, pure model — fully typed, mypy-clean in strict mode, with dataclasses, at least one protocol, zero inheritance-for-code-reuse, and dunder methods that make it pleasant in the REPL. It becomes the backing model for a later CLI.",
      outcome:
        "You can design typed Python APIs deliberately — choosing dataclass vs class, composition vs inheritance, protocol vs concrete — and you have the mypy habit installed permanently.",
      requirements: [
        "Types: Transaction (frozen dataclass), Account, Ledger; money as int cents (you know why floats are banned)",
        "Ledger API: add, balance(account), filter by date-range/category/predicate, monthly summaries — all fully type-hinted including a Callable predicate parameter",
        "A Storage protocol (save/load) with two implementations: JSONStorage and InMemoryStorage — the Ledger composes a Storage, inherits nothing",
        "Dunders: __repr__ everywhere useful, __eq__ semantics decided consciously, Ledger __len__ and __iter__",
        "mypy --strict passes; include one deliberately-wrong call in a comment showing the error it catches",
        "Docstrings on the public API written as contracts (params, returns, raises)",
      ],
      checkpoints: [
        "A REPL session reads naturally: len(ledger), for tx in ledger, repr shows real info",
        "Swapping JSONStorage → InMemoryStorage in tests requires zero Ledger changes — composition's payoff, demonstrated",
        "mypy catches a category typo bug you plant (str vs enum decision — make it and defend it)",
        "Frozen dataclass rejects mutation, and you can say why immutable transactions are right",
      ],
      hints: [
        "Start with the data (your decomposition training): what are the nouns, which are immutable, what invariants hold?",
        "A Protocol class with method signatures + ... is all duck typing formalized needs; the implementations don't even import it.",
        "If you're tempted to subclass Ledger for 'SavingsLedger', put the varying behavior in a composed strategy instead — feel the difference.",
      ],
      validation: [
        "A test suite (plain asserts fine; pytest next topic) covering balance math, filters, and both storages round-tripping",
        "mypy --strict in your make/test script, failing the build on type errors",
        "A classmate uses the library from its docstrings alone to answer 'total food spending in March'",
      ],
      solutionOutline: [
        "The design rule: dataclasses for values (Transaction), classes for entities with identity and behavior (Ledger), protocols for capabilities (Storage) — three tools, three jobs.",
        "Composition wins because change is multiplicative with inheritance (deep trees ossify) and additive with delegation — the same dependency-direction idea you'll formalize in architecture later.",
        "Type hints are machine-checked documentation: the same contracts you wrote in C headers, now enforced by tooling instead of discipline.",
      ],
      extensions: [
        "Add a CSVStorage third implementation as the protocol's stress test",
        "Add __add__ for merging ledgers and decide its semantics carefully",
        "Try pyright instead of mypy and compare the experience",
      ],
    },
    resources: {
      primary: [
        { ...R.cs50p, url: "https://cs50.harvard.edu/python/weeks/8/", guidance: "Watch the Week 8 'Object-Oriented Programming' lecture (~1.5 h) — classes, properties, and dunder methods with live coding." },
      ],
      alternatives: [
        { ...R.pyTutorial, guidance: "Section 9 (classes), then the typing docs linked from it." },
      ],
      practice: [
        { ...R.exercism, title: "Exercism — Python Track", url: "https://exercism.org/tracks/python", guidance: "The OO-focused exercises, with mentor feedback on design." },
      ],
      extra: [
        { ...R.tsHandbook, guidance: "Surprisingly useful cross-training: TypeScript's handbook teaches type-thinking that transfers straight back to Python hints." },
      ],
    },
    masteryChecks: [
      "Decide dataclass vs. class vs. dict for five data-modeling scenarios and justify",
      "Explain composition over inheritance with a concrete refactor you performed here",
      "Read a mypy error about Optional and fix the design (not just add an assert)",
    ],
  },
  "py-testing-cli": {
    whyItMatters:
      "This is the difference between 'scripts on my machine' and software: reproducible environments, tested behavior, and installable tools. Every Python job assumes this toolchain, and your later FastAPI work builds directly on pytest and packaging discipline.",
    concepts: [
      "venv: interpreter isolation; requirements/lockfiles; never pip install into the system",
      "pytest: discovery, plain asserts with rich introspection, fixtures as typed setup/teardown, parametrize for table-driven tests, tmp_path",
      "Test organization: tests/ mirroring src/; naming as documentation",
      "argparse: positional/optional args, subcommands (git-style), --help as UI",
      "Exit codes and stderr vs stdout — CLIs as good citizens in pipelines",
      "pyproject.toml, src layout, entry points: pip install -e . and your command exists",
    ],
    practicalUses: [
      "Every future Python project starts from this template",
      "CLI tools your future team actually adopts because --help is good",
      "The test style (fixtures, parametrize) you'll use on FastAPI services",
    ],
    lab: {
      title: "Task CLI, Test-First, over SQLite",
      scenario:
        "Build 'tsk' — a task manager CLI (add, list with filters, done, stats) storing data in SQLite via the stdlib sqlite3 module — developed test-first with pytest, packaged with an entry point so pip install -e . puts tsk on your PATH. This artifact grows into the Python/SQLite milestone.",
      outcome:
        "A complete professional project skeleton you'll clone forever: src layout, pytest suite with fixtures, argparse subcommands, SQLite persistence, and editable-install packaging — all wired together and green.",
      requirements: [
        "src layout: src/tsk/{cli.py, core.py, storage.py}; core logic importable and tested without invoking the CLI",
        "pytest suite ≥ 25 tests: parametrized filter cases, a fixture providing a temp database per test (tmp_path), and CLI-level tests via the runner function",
        "Subcommands: add 'title' [--due --tag], list [--all --tag --overdue], done ID, stats — argparse with helpful --help for each",
        "SQLite storage: schema created on first run, parameterized queries only (no string-built SQL, ever), a schema_version table from day one",
        "Correct citizenship: machine-readable stdout (--json flag), human errors to stderr, exit codes (0 ok, 1 user error, 2 unexpected)",
        "pyproject.toml with entry point; a fresh venv proves install-and-run from zero",
      ],
      checkpoints: [
        "A test written before its feature at least five times — keep the commit history as proof",
        "The temp-db fixture means tests never touch your real data and run in any order",
        "tsk list --overdue --json | python -m json.tool works (pipeline-clean stdout)",
        "Deleting the venv and rebuilding from pyproject.toml takes two commands",
      ],
      hints: [
        "Separate parse → command dispatch → core call: main() should be ~15 lines, everything real in testable functions.",
        "Parametrize is the table-driven testing you did in C, with better ergonomics: one test function, many cases.",
        "sqlite3 placeholders: cursor.execute('... WHERE tag = ?', (tag,)) — this habit IS the SQL-injection defense, formed now, before the web.",
      ],
      validation: [
        "pytest -q green in a fresh clone + venv on the first try (the real reproducibility test)",
        "Coverage of the sad paths: done on missing ID, malformed due date, empty list — all tested",
        "A classmate installs it, uses --help only, and completes three tasks without asking you anything",
      ],
      solutionOutline: [
        "The layering (cli → core → storage) is the miniature of every service you'll build: transport parsing at the edge, pure logic in the middle, persistence behind an interface — testable at each seam.",
        "Fixtures are composable setup with lifetime management — the RAII/context-manager idea powering test isolation.",
        "Entry points make Python packaging click: the console_scripts table maps a command name to a function, and pip generates the shim.",
      ],
      extensions: [
        "Add tsk export --csv and property-test the round trip",
        "Add mypy --strict and pytest to a single make check / check.py gate — your pre-CI CI",
      ],
    },
    resources: {
      primary: [
        { ...R.cs50p, url: "https://cs50.harvard.edu/python/weeks/5/", guidance: "Watch the Week 5 'Unit Tests' lecture (~45 min) — it teaches pytest itself. The lab then goes further with fixtures and parametrize." },
      ],
      alternatives: [],
      practice: [
        { ...R.exercism, title: "Exercism — Python Track", url: "https://exercism.org/tracks/python", guidance: "Practice test-first: write the tests before the solution on your next three exercises." },
      ],
      extra: [
        { ...R.pytestDocs, guidance: "'Get started' through fixtures and parametrize — the exact features this lab uses." },
        { ...R.pyTutorial, guidance: "The venv and modules sections for the environment side." },
        { ...R.automate, guidance: "Its CLI-adjacent chapters if argparse feels abstract." },
      ],
    },
    masteryChecks: [
      "Explain to a classmate why venvs exist, with the two-projects-conflicting-versions story",
      "Write a parametrized pytest for a date parser from memory",
      "Design the subcommand grammar for a note-taking CLI: commands, flags, exit codes",
    ],
    securityNote:
      "Two habits formed here are security-critical later: parameterized SQL queries (the injection defense) and pinned dependencies (the supply-chain defense). Treat requirements files as a security artifact — you'll audit them in the security branch.",
  },
  "py-http-apis": {
    whyItMatters:
      "Almost every modern program is an API client of something. This is also your ground-level view of HTTP before you build servers: engineers who've handled timeouts, 429s, and malformed responses as clients design far better APIs as authors.",
    concepts: [
      "Request anatomy: method, URL, headers, body; response: status, headers, body",
      "Status code families and what to actually do about 3xx/4xx/5xx",
      "JSON APIs: parsing defensively — the response is untrusted input",
      "Timeouts always; retries with backoff for transient failures only (5xx yes, 400 no)",
      "Pagination patterns: page/cursor; iterating a full collection politely",
      "Secrets: API keys via environment variables, never in code or Git",
      "Testing clients: injecting a fake transport; recording real responses as fixtures",
    ],
    practicalUses: [
      "Pulling data from any service: GitHub, weather, university systems",
      "Health-checking and monitoring scripts",
      "The client half of every full-stack project ahead",
    ],
    lab: {
      title: "GitHub Repo Analyzer",
      scenario:
        "Build a CLI (extend your tsk skeleton pattern) that analyzes any GitHub user's public repositories via the REST API: language breakdown, most-starred repos, commit cadence — with pagination handled, failures retried sensibly, an offline test suite, and the API token kept out of Git forever.",
      outcome:
        "You can integrate any documented HTTP API confidently, your error handling covers reality (slow, flaky, lying servers), and your client code is tested without touching the network.",
      requirements: [
        "Use urllib (stdlib) or requests (justify the dependency in README) behind your own thin ApiClient class — one place for base URL, auth header, timeout, retry",
        "Endpoints: user repos (paginated — follow Link headers or page params until exhausted), languages per repo, recent commits",
        "Timeout on every request; @retry (yours!) on 5xx/connection errors with backoff; 403-rate-limit handled by reading the reset header and telling the user",
        "Token from GITHUB_TOKEN env var; a check that refuses to run with a token pasted as an argument (teach yourself the lesson)",
        "Tests: ApiClient accepts an injectable transport function; suite runs fully offline against recorded JSON fixtures, covering success, 404, 429, malformed JSON, and truncated pagination",
        "Output: a clean terminal report plus --json; nonzero exit on failure",
      ],
      checkpoints: [
        "A user with >100 repos (pick a big org) is fully paginated — count matches their profile",
        "Unplugging Wi-Fi mid-run produces a clean retry-then-fail message, not a traceback",
        "The offline suite passes on a machine with no network (prove it: airplane mode)",
        "git log -p shows no token ever committed",
      ],
      hints: [
        "Design the transport seam first: fetch(request) -> response as an injectable function. Real one uses the network; tests use a dict of canned responses.",
        "Record fixtures by running once against the real API and saving bodies to tests/fixtures/*.json — now reality regression-tests you.",
        "The retry decision table (which codes, how many times, what backoff) belongs in one documented place, not scattered ifs.",
      ],
      validation: [
        "Fixture tests: assert not just parsing but behavior — e.g., 429 triggers exactly the wait path",
        "A malformed-JSON fixture produces your error type with context, not a raw ValueError from the guts",
        "Rate-limit courtesy verified: no more than N requests/second even when paginating hard",
      ],
      solutionOutline: [
        "The ApiClient is an anti-corruption layer: the app speaks in your types (Repo, CommitStats); translation from HTTP/JSON happens in one testable place — the same boundary discipline as your storage protocols.",
        "The transport seam is dependency injection in its simplest form, and it's what makes 'test the untestable' routine.",
        "Retry-with-backoff works because transient failures cluster: spacing attempts exponentially rides out blips without hammering a struggling server (which is also the polite-citizen behavior rate limits enforce).",
      ],
      extensions: [
        "Cache responses on disk with ETag/If-None-Match conditional requests — HTTP's built-in caching, experienced",
        "Add concurrent per-repo fetching after the concurrency topic — measure the speedup",
      ],
    },
    resources: {
      primary: [
        { ...R.coreyRequests, guidance: "Watch it fully, typing along — requests, JSON, and error handling. Then hit one real public API before starting the GitHub analyzer." },
      ],
      alternatives: [
        { ...R.apisForBeginners, guidance: "Units 1–2 explain HTTP and APIs from zero if you want the broader story first." },
      ],
      practice: [],
      extra: [
        { ...R.fastapiTutorial, guidance: "Skim 'First Steps' to see the server's view of the same requests you're sending." },
      ],
    },
    masteryChecks: [
      "Narrate a full request/response cycle including headers for an authenticated JSON GET",
      "Given five status codes (200, 301, 404, 429, 503), state the correct client behavior for each",
      "Explain the transport-injection test pattern and why 'tests that hit the real API' fail as a strategy",
    ],
    securityNote:
      "API responses are untrusted input — parse defensively — and API keys are credentials: environment variables, never source. Also verify TLS is on (https) and never disable certificate verification to 'fix' an error; that converts a config problem into a man-in-the-middle vulnerability.",
  },
  "py-concurrency": {
    whyItMatters:
      "Sequential fetching of 200 URLs takes 200× too long — concurrency is how real tools, scrapers, servers, and pipelines achieve throughput. Knowing which model fits which workload (and which bugs each invites) is a distinguishing mark of engineers who've moved past tutorials.",
    concepts: [
      "I/O-bound vs CPU-bound: the diagnosis that selects the tool",
      "Threads: concurrent waiting; the GIL's actual meaning; ThreadPoolExecutor",
      "Race conditions in Python: check-then-act on shared state; locks as the blunt fix",
      "Processes: true parallelism for CPU work; serialization costs at the boundary",
      "async/await: an event loop, cooperative yielding, and the colored-function trade-off",
      "Backpressure and bounded concurrency: semaphores, pool sizes — courtesy and stability",
      "Choosing: sequential until proven slow; then the simplest model that fits",
    ],
    practicalUses: [
      "Concurrent HTTP fetching: checkers, scrapers, API mirrors",
      "Parallel file hashing (your duplicate detector, accelerated)",
      "Understanding FastAPI's async nature before writing servers",
    ],
    lab: {
      title: "Concurrent Website Status Checker",
      scenario:
        "Build 'pulse': feed it 200 URLs, get a status report (up/down, latency, status code) — implemented four ways: sequential, threaded, async, and (for a CPU-heavy checksum variant) process pool. Measure everything, break shared state on purpose, fix it, and write the decision memo.",
      outcome:
        "You've felt the 40× speedup, produced and fixed a real race condition, and can choose a concurrency model from workload evidence rather than fashion.",
      requirements: [
        "Sequential baseline with clean per-URL timeout handling — correctness first",
        "Threaded version: ThreadPoolExecutor, bounded workers, results collected safely; identical output modulo order",
        "Async version: asyncio with a semaphore capping concurrent connections; same report",
        "Race demonstration: a naive shared counter updated check-then-act style across threads loses updates under load — show the wrong count reproducibly, then fix with a lock, then fix better by eliminating sharing (per-worker results merged after)",
        "CPU variant: checksum a directory of large files sequential vs threads vs processes — threads must NOT help here; explain via the GIL",
        "Benchmark table: all versions × workloads, wall-clock medians; a one-page memo of recommendations",
      ],
      checkpoints: [
        "Threaded and async versions within noise of each other, both ~an-order-of-magnitude over sequential on 200 URLs",
        "The race produces visibly wrong counts (run enough iterations) before the fix and never after",
        "Process pool beats threads decisively on the CPU workload; threads ≈ sequential there",
        "Bounded concurrency verified: never more than N sockets in flight",
      ],
      hints: [
        "Executor.map keeps result order; as_completed gives you progress — try both, note the difference.",
        "The race needs load to show: many threads, many increments, tiny critical section. If it 'works', increase iterations — absence of failure isn't absence of race.",
        "The best lock is no shared state: workers return values, the main thread aggregates — the functional pattern that makes most locking unnecessary.",
      ],
      validation: [
        "All four versions produce the same set of results on a fixed URL list (order-independent comparison, in tests)",
        "The benchmark script reruns end-to-end with one command and regenerates the table",
        "Ctrl+C mid-run: pools shut down cleanly, partial results reported — no hung process",
      ],
      solutionOutline: [
        "I/O concurrency wins because waiting overlaps: 200 one-second waits become ~max(wait) with 200 in flight — threads and async both achieve this, differing in mechanics (preemptive OS threads vs cooperative event loop).",
        "The GIL serializes Python bytecode execution, so CPU-bound threads take turns (no speedup) while I/O-bound threads release it during waits (full speedup) — the entire mystery in one sentence.",
        "Races are timing-dependent interleavings of read-modify-write; locks force atomicity, but restructuring to share nothing removes the hazard class — a preview of the systems branch's deeper treatment.",
      ],
      extensions: [
        "Add retry-on-failure to the async version without breaking the semaphore bound",
        "Stream results as they complete into a live-updating terminal display",
        "Port the checker's core to your GitHub analyzer for concurrent repo fetching",
      ],
    },
    resources: {
      primary: [
        { ...R.coreyThreading, guidance: "Step 1: threads and ThreadPoolExecutor — watch and type along." },
        { ...R.coreyMultiprocessing, guidance: "Step 2: processes for CPU-bound work, and why the GIL makes the difference." },
        { ...R.coreyAsyncio, guidance: "Step 3: async/await and the event loop, explained with animations. Then build the checker all three ways." },
      ],
      alternatives: [],
      practice: [],
      extra: [
        { ...R.ostep, guidance: "The concurrency chapters — the formal grounding for the races you just produced." },
        { ...R.pyTutorial, guidance: "The stdlib docs for concurrent.futures and asyncio — read ThreadPoolExecutor's examples." },
      ],
    },
    masteryChecks: [
      "Diagnose five workloads as I/O- or CPU-bound and prescribe the model with one-line reasons",
      "Explain the GIL's effect on both workload types without hedging",
      "Spot the race in a 10-line snippet (check-then-act on a dict) and give both fixes (lock; restructure)",
    ],
    securityNote:
      "Unbounded concurrency pointed at someone else's server is indistinguishable from a denial-of-service attack. The semaphore in this lab is an ethical requirement, not just engineering hygiene — rate limits and politeness are part of authorized-use discipline.",
  },
};
