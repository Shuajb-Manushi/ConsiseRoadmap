import type { TopicBody } from "../../types";
import { R } from "../../resourceCatalog";


export const startBodies: Record<string, TopicBody> = {
  "code-to-program": {
    whyItMatters:
      "Every confusing error you will ever see — 'undefined reference', 'segmentation fault', 'module not found' — happens at a specific step of this pipeline. Engineers who know which step failed fix problems in minutes; everyone else pastes errors into search boxes and hopes.",
    concepts: [
      "Source code vs. machine code vs. bytecode",
      "Compile step vs. link step vs. run step, and which errors belong to each",
      "Compilers (C) vs. interpreters (Python) vs. JIT engines (JavaScript)",
      "Executables, processes, and what the OS does when you run one",
      "Why the same C file can produce different binaries on different machines",
    ],
    practicalUses: [
      "Diagnosing whether a bug is a compile error, a linker error, or a runtime crash",
      "Understanding why a program built on your laptop fails on a friend's machine",
      "Reading build output from any tool — Code::Blocks, gcc, npm, or an IDE",
    ],
    lab: {
      title: "Anatomy of a Build",
      scenario:
        "You maintain a small C program and someone reports it 'doesn't work'. Before you can fix anything, you need to see every stage of its life with your own eyes.",
      outcome:
        "You can name each build stage, produce its intermediate files on purpose, and classify any error message by the stage that produced it.",
      requirements: [
        "Take a working 2-file C program (main.c + helpers.c) and build it from the terminal with gcc, not the IDE",
        "Produce and inspect the preprocessed output (gcc -E), the assembly (gcc -S), and the object files (gcc -c)",
        "Break the program three ways on purpose: a syntax error, a missing function definition (link error), and a division by zero (runtime error)",
        "Write a short table mapping each error message to the pipeline stage that emitted it",
      ],
      checkpoints: [
        "gcc main.c helpers.c -o app builds and runs from the terminal",
        "You can open the .s assembly file and point to your main function",
        "You can explain why the missing-definition error mentions 'undefined reference' instead of a line number",
      ],
      hints: [
        "Use gcc -Wall -Wextra from the very first build — warnings are free bug reports.",
        "The linker never sees your source code. That's why its errors talk about symbols, not lines.",
        "Paste a tiny function into Compiler Explorer to see the assembly with syntax highlighting.",
      ],
      validation: [
        "Delete the executable, rebuild only from .o files with gcc main.o helpers.o -o app — it should link without recompiling",
        "Your error table correctly assigns all three failures to preprocessing/compiling, linking, or runtime",
      ],
      solutionOutline: [
        "The pipeline is: preprocessor (textual #include/#define expansion) → compiler (one .c to one .o) → linker (merge .o files, resolve symbols) → loader (OS maps the executable into a process).",
        "Compile errors reference files and lines because the compiler has the source; link errors reference symbols because the linker only has object files.",
        "Runtime errors are the OS or CPU objecting while the program executes — the build tools are long gone by then.",
      ],
      extensions: [
        "Compare gcc -O0 and -O2 assembly for a small loop in Compiler Explorer",
        "Run the same source through clang and diff the warnings",
      ],
    },
    resources: {
      primary: [
        { ...R.cs50x, url: "https://cs50.harvard.edu/x/2025/weeks/1/", guidance: "Watch the Week 1 'C' lecture (~2 h). Pay special attention to the opening segment on how source becomes a running program; the rest doubles as your C refresher." },
      ],
      alternatives: [
        { ...R.cpuLand, guidance: "Read chapters 1–3 — the 'what actually happens when you run a program' story, with pictures." },
        { ...R.nand2tetris, note: "If you want the full from-transistors story, this course builds the whole stack." },
      ],
      practice: [
        { ...R.godbolt, guidance: "Paste a 5-line C program, map every source line to its assembly, then switch to -O2 and watch it change." },
      ],
      extra: [
        { ...R.beejC, guidance: "Chapters 1–2: how C programs are built and run." },
      ],
    },
    masteryChecks: [
      "Given an unfamiliar error message, name the pipeline stage that produced it and justify why",
      "Explain to a classmate why C needs a link step but a Python script doesn't",
      "Build a two-file program entirely from the terminal without an IDE",
    ],
  },
  "terminal-filesystems": {
    whyItMatters:
      "Every serious tool — compilers, Git, Python, Docker, SSH — is a terminal program first and a GUI second. Engineers who are fluent in the shell automate in seconds what takes others an afternoon of clicking, and Linux fluency is non-negotiable for backend, systems, and security work.",
    concepts: [
      "Files, directories, absolute and relative paths, and the working directory",
      "PATH and environment variables — how the shell finds programs",
      "Processes: what 'running a program' means, exit codes, foreground vs. background",
      "Redirection (>, <, 2>) and pipes (|) — composing small programs",
      "Windows (PowerShell) vs. Linux (bash) conventions, and WSL as the bridge",
      "Permissions and file ownership on Linux (read/write/execute for user/group/other)",
    ],
    practicalUses: [
      "Running compilers, test suites, and Git without leaving the keyboard",
      "Chaining tools: search a log, filter it, count matches — one line, no program written",
      "Working on remote servers over SSH, where there is no GUI at all",
    ],
    lab: {
      title: "Shell Survival Course",
      scenario:
        "You've been handed a messy project folder — hundreds of files, logs mixed with source, no structure. Clean it up and answer questions about it using only the terminal, first on Windows, then inside WSL.",
      outcome:
        "You can navigate, inspect, search, and reorganize any directory tree from the shell on both Windows and Linux, and you have a working WSL Ubuntu installation for the rest of this roadmap.",
      requirements: [
        "Install WSL with an Ubuntu distribution and update its packages",
        "From bash: create a practice tree of at least 20 files across nested folders using mkdir, touch, and echo with redirection",
        "Using only the shell, find every file containing a given word, count lines in all .log files, and move all logs into a logs/ directory",
        "Demonstrate PATH: write a one-line script, make it executable with chmod, put it on PATH, and run it by name from anywhere",
        "Show the same navigation basics in PowerShell so you can operate in both worlds",
      ],
      checkpoints: [
        "wsl opens Ubuntu and pwd/ls/cd feel automatic",
        "You can explain the difference between ./run.sh and run.sh, and why the first works",
        "grep -r, wc -l, and a pipe combining them produce the counts you expect",
      ],
      hints: [
        "man <command> and <command> --help are always available — reading them is a skill, practice it.",
        "Tab completion and Ctrl+R (history search) will double your speed immediately.",
        "Your Windows drive is at /mnt/c inside WSL — but keep projects in the Linux filesystem for speed.",
      ],
      validation: [
        "Close the terminal, reopen it, and redo the search-and-count task from memory in under two minutes",
        "echo $PATH shows your script directory, and which yourscript resolves to it",
      ],
      solutionOutline: [
        "The shell is a REPL around the OS: it parses your line, finds the program via PATH, forks a process, and wires its input/output streams.",
        "Redirection and pipes work because every process has standard input, output, and error streams the shell can reconnect before launch.",
        "WSL runs a real Linux userspace, so everything you learn there transfers directly to servers and security labs.",
      ],
      extensions: [
        "Learn a terminal text editor (nano is fine, vim if curious) well enough to edit a config file over SSH",
        "Start OverTheWire Bandit — it is exactly this material, gamified and legal",
      ],
    },
    resources: {
      primary: [
        { ...R.missingSemester, url: "https://missing.csail.mit.edu/2020/course-shell/", guidance: "Watch 'Course Overview + The Shell' (~50 min) and complete every exercise at the bottom; then do the 'Shell Tools and Scripting' lecture the same way." },
      ],
      alternatives: [],
      practice: [
        { ...R.bandit, guidance: "Solve levels 0–10 — each level forces exactly one new shell skill. Many people find this stickier than lectures." },
      ],
      extra: [],
    },
    masteryChecks: [
      "Find all files modified in the last day containing a keyword, without touching a GUI",
      "Explain what happens, step by step, when you type gcc and press Enter",
      "Fix a 'command not found' error by reasoning about PATH rather than reinstalling things",
    ],
    securityNote:
      "Almost every real intrusion investigation happens in a terminal. The permissions model you learn here (users, groups, execute bits) is literally the first layer of defense on every Linux server.",
  },
  "vscode-workflow": {
    whyItMatters:
      "You will spend thousands of hours in your editor. A ten-percent speed-up here compounds more than almost any other investment, and the debugger integration replaces printf-guesswork with direct observation.",
    concepts: [
      "Workspaces and folder-based projects instead of loose files",
      "Command palette, go to definition, find references, rename symbol",
      "Integrated terminal and tasks — building without leaving the editor",
      "launch.json and the visual debugger for C and Python",
      "The Remote-WSL extension: editing Linux files with a Windows UI",
      "Choosing extensions deliberately: C/C++, Python, and little else to start",
    ],
    practicalUses: [
      "Navigating a codebase you didn't write — the core activity of every real job",
      "Setting breakpoints and inspecting variables instead of sprinkling printf",
      "Refactoring safely with rename-symbol instead of find-and-replace",
    ],
    lab: {
      title: "Editor Bootcamp on a Real Codebase",
      scenario:
        "Clone a small open-source C project you've never seen. Your task is not to change it — it's to learn to move through it like someone who has worked there for a year.",
      outcome:
        "You navigate by symbol rather than by scrolling, build and debug from inside the editor, and have a lean, deliberate VS Code setup connected to WSL.",
      requirements: [
        "Open a cloned project as a workspace inside WSL via the Remote-WSL extension",
        "Using only keyboard navigation, find where a particular function is defined and every place it is called",
        "Create a build task that compiles the project with warnings on, triggered by a keyboard shortcut",
        "Configure launch.json, set a breakpoint, and inspect a struct's fields while paused",
        "Write down your ten most-used shortcuts and actually memorize five",
      ],
      checkpoints: [
        "Ctrl+P, Ctrl+Shift+P, F12 (definition), and Shift+F12 (references) are in muscle memory",
        "The project builds from a VS Code task and errors are clickable",
        "You hit a breakpoint and watched a variable change across steps",
      ],
      hints: [
        "If go-to-definition doesn't work in C, the C/C++ extension needs to know your include paths — check c_cpp_properties.json.",
        "The debugger needs -g in your compile flags; without debug symbols it has nothing to show you.",
        "Resist installing themes and AI autocomplete for now — learn to see the code yourself first.",
      ],
      validation: [
        "Time yourself: from 'where is function X defined?' to cursor-on-definition should take under five seconds",
        "You can pause a running program and explain the current call stack from the debugger sidebar",
      ],
      solutionOutline: [
        "VS Code is a shell around language servers: the C/C++ and Python extensions run analyzers that power navigation, so configuration means telling the analyzer how your project builds.",
        "Tasks wrap terminal commands; launch configurations wrap debugger invocations — both are just JSON files you check into the repo.",
        "Remote-WSL runs the analyzers inside Linux, so the editor sees exactly what the compiler sees.",
      ],
      extensions: [
        "Learn snippet creation for boilerplate you type often",
        "Try a week with the mouse unplugged for editing tasks",
      ],
    },
    resources: {
      primary: [
        { ...R.vscodeIntroVideos, guidance: "Watch 'Getting started', 'Code editing', and 'Debugging' (~30 min total), pausing to try each shortcut in your own editor." },
      ],
      alternatives: [
        { ...R.missingSemester, url: "https://missing.csail.mit.edu/2020/editors/", guidance: "The Editors (Vim) lecture — a different philosophy of editor mastery; the 'invest in your tools' argument applies to VS Code too." },
      ],
      practice: [],
      extra: [
        { ...R.gdbDocs, guidance: "VS Code's C debugger drives GDB underneath — knowing GDB explains what the UI is doing." },
      ],
    },
    masteryChecks: [
      "Open an unfamiliar repository and produce a one-paragraph tour of its structure in ten minutes",
      "Debug a crashing C program using breakpoints only — no printf added",
      "Justify every extension you have installed in one sentence each",
    ],
  },
  "git-github": {
    whyItMatters:
      "Git ends the era of project_final_v2_REAL.c. Every experiment becomes reversible, every bug becomes traceable to the change that caused it, and GitHub is simultaneously your backup, your portfolio, and how all collaborative software development works.",
    concepts: [
      "Repository, working tree, staging area (index), and commit — the four places code lives",
      "Commits as snapshots with parent pointers, forming a history graph",
      "Branches as movable pointers; HEAD as 'where you are'",
      "Remotes: clone, push, pull, and how origin relates to your local repo",
      "Writing commit messages that explain why, not what",
      ".gitignore and keeping build artifacts out of history",
      "Undoing things safely: restore, revert, and when reset is dangerous",
    ],
    practicalUses: [
      "Trying a risky refactor on a branch and throwing it away without consequence",
      "Using git log and git diff to answer 'what changed since it last worked?'",
      "Publishing every roadmap project to GitHub as a growing portfolio",
    ],
    lab: {
      title: "Version-Control Your Actual Work",
      scenario:
        "Take your current C coursework — real files you care about — and put them under Git from scratch, then simulate the disasters Git exists to prevent: a bad change, a lost file, and a fork in direction.",
      outcome:
        "Git is your default reflex for any project, you can recover from the common disasters calmly, and your work lives on GitHub.",
      requirements: [
        "Initialize a repo over existing coursework, write a .gitignore for compiled artifacts, and make an initial commit",
        "Make at least ten meaningful commits over a week of normal work, each with a message explaining why",
        "Break something on purpose, then recover: restore a deleted file, and revert a bad commit that's already committed",
        "Create a branch for an experimental feature, develop it, and merge it back",
        "Create a GitHub repository, push everything, and verify the history renders online",
      ],
      checkpoints: [
        "git status is something you run reflexively and can always explain",
        "git log --oneline --graph shows a history with at least one merged branch",
        "Your GitHub profile shows the repository with a README",
      ],
      hints: [
        "Commit far more often than feels natural — small commits are what make history useful.",
        "If you're afraid a command might destroy work, run git status and git stash first; almost nothing is truly lost in Git.",
        "git diff --staged before each commit is the professional's proofread.",
      ],
      validation: [
        "Clone your own repo into a second folder and confirm it builds — this proves .gitignore and the history are complete",
        "For a random past commit, explain from its message alone why the change was made",
      ],
      solutionOutline: [
        "Git's object store keeps every version of every file as content-addressed snapshots; commits tie a snapshot to a parent, author, and message.",
        "The staging area exists so a commit can be a curated change, not just 'everything I touched today'.",
        "Branching is cheap because a branch is a 41-byte pointer file — this is why professionals branch for everything.",
      ],
      extensions: [
        "Complete the GitHub Skills 'Introduction to GitHub' course",
        "Learn git bisect and use it to find a planted bug in ~7 steps instead of 100",
      ],
    },
    resources: {
      primary: [
        { ...R.learnGitBranching, guidance: "Complete the 'Main: Introduction Sequence' and the first 'Remote' lessons — type every command yourself and watch the commit graph respond." },
      ],
      alternatives: [
        { ...R.missingSemester, url: "https://missing.csail.mit.edu/2020/version-control/", guidance: "Watch the Version Control lecture (~1.5 h) — it teaches the data model first, which many find clarifying." },
      ],
      practice: [
        { ...R.githubSkills, guidance: "Do the 'Introduction to GitHub' course — you learn inside a real repository." },
      ],
      extra: [
        { ...R.proGit, guidance: "Chapters 1–3 — the clearest explanation of the Git model in print. Read after the interactive lessons." },
      ],
    },
    masteryChecks: [
      "Draw the commit graph of your repo from memory, then check it against git log --graph",
      "Explain the difference between restore, revert, and reset, and when each destroys work",
      "Recover a 'lost' commit using the reflog",
    ],
    securityNote:
      "Never commit secrets — API keys, passwords, tokens. Git history is forever: deleting the file in a later commit does not remove it from history, and bots scan public GitHub for leaked keys within minutes.",
  },
  "debugging-errors": {
    whyItMatters:
      "Professional engineers spend more time understanding failing code than writing new code. A reliable debugging method is the single biggest difference between someone who is stuck for days and someone who is stuck for twenty minutes — and it's what makes you independent of AI and forum answers.",
    concepts: [
      "Reading errors fully: the first error (not the last), the exact file/line, and what the words literally claim",
      "Reproduce first: a bug you can't trigger on demand can't be fixed with confidence",
      "Hypothesis → experiment → observation loops, written down when the bug is hard",
      "Bisection: cutting the search space in half — by code region, by input size, by commit",
      "Minimal reproducible examples: deleting everything irrelevant until only the bug remains",
      "Reading documentation: reference vs. tutorial vs. examples, and finding the authoritative source",
    ],
    practicalUses: [
      "Turning a vague 'it crashes sometimes' report into a one-line reproduction",
      "Localizing a fault to ten lines of a thousand-line program in a few experiments",
      "Answering your own questions from docs faster than a forum could",
    ],
    lab: {
      title: "The Bug Hunt Protocol",
      scenario:
        "You receive three broken C programs (write them yourself from working code, or have a classmate sabotage yours): one crashes, one gives wrong answers, one hangs. Fix all three — but the deliverable is your written debugging log, not the fix.",
      outcome:
        "You own a written, repeatable protocol for approaching any failure, and you've practiced it until it's faster than guessing.",
      requirements: [
        "For each bug, write the log before touching code: observed behavior, expected behavior, reproduction steps",
        "Record every hypothesis and the experiment that confirmed or killed it — no silent edits",
        "Use bisection at least once: comment out or isolate half the logic to localize the fault",
        "Reduce one bug to a minimal reproduction of fewer than 15 lines",
        "For one fix, cite the specific documentation section that proves your fix is correct, not just lucky",
      ],
      checkpoints: [
        "Bug #1's log shows at least one hypothesis that turned out wrong — and how the experiment revealed it",
        "The hanging program's cause is identified by reasoning, not by random restarts",
        "Each fix is one or two lines once the cause is actually understood",
      ],
      hints: [
        "Say the error message out loud, word by word. 'Segmentation fault' means memory you don't own — that already excludes half your hypotheses.",
        "Change exactly one thing per experiment. Two changes means an uninterpretable result.",
        "For the hang: what is the loop condition, and can you prove it eventually becomes false?",
      ],
      validation: [
        "A classmate can follow your log and reach the same conclusion without seeing your fix",
        "You can state, for each bug, the moment the search space collapsed and why",
      ],
      solutionOutline: [
        "The protocol: (1) reproduce reliably, (2) read the error literally, (3) state expected vs. actual, (4) hypothesize the smallest cause consistent with evidence, (5) run the cheapest discriminating experiment, (6) loop.",
        "Bisection works because localization, not cleverness, is the bottleneck — halving suspicion space beats inspecting lines in order.",
        "Writing the log feels slow and is not: it prevents re-testing dead hypotheses and reveals patterns in your own reasoning.",
      ],
      extensions: [
        "Redo the hunt using only the VS Code debugger — no print statements allowed",
        "Keep a personal 'bug journal' of every real bug for a month; note which protocol step found it",
      ],
    },
    resources: {
      primary: [
        { ...R.missingSemester, url: "https://missing.csail.mit.edu/2020/debugging-profiling/", guidance: "Watch the first half of 'Debugging and Profiling' (~40 min — debuggers and logging) and do exercises 1–3. Profiling can wait." },
      ],
      alternatives: [],
      practice: [
        { ...R.pythonTutor, guidance: "Paste code you don't fully understand and step it line by line — train yourself to predict before observing." },
      ],
      extra: [
        { ...R.gdbDocs, guidance: "When you're ready to drive the debugger from the terminal, the manual's 'Sample GDB session' is the fastest start." },
      ],
    },
    masteryChecks: [
      "Given a stranger's bug report, produce a reproduction script before proposing any cause",
      "Explain why 'I changed something and it works now' is a failure, not a success",
      "Find the authoritative documentation page for a standard-library function in under a minute",
    ],
  },
  "testing-fundamentals": {
    whyItMatters:
      "Tests convert 'I think it works' into 'I can prove which parts work'. They are also how professionals refactor: with a test suite, improving code is safe; without one, every change is a gamble. Learning this before frameworks means you'll understand what pytest and Vitest automate later.",
    concepts: [
      "Assertions: crashing loudly at the exact point expectations break",
      "Arrange–Act–Assert structure for a test case",
      "Boundary analysis: empty, one, many, maximum, malformed",
      "Regression tests: every fixed bug gets a test so it can never silently return",
      "Testable design: small functions with inputs and outputs beat giant main()s",
      "What tests can't do: prove absence of bugs, replace thinking about the spec",
    ],
    practicalUses: [
      "Catching a bug at your desk instead of during your professor's demo",
      "Refactoring a working program without re-verifying everything by hand",
      "Documenting behavior: a test file is an always-accurate usage example",
    ],
    lab: {
      title: "A Test Harness in Pure C",
      scenario:
        "You have a small library of string utilities (write them: trim, split-count, integer parsing with error reporting). Build a tiny test harness for it — assert macro, test registry, pass/fail summary — with no external framework.",
      outcome:
        "You understand exactly what test frameworks do, because you built the essential 20% yourself — and your utilities now have a real safety net.",
      requirements: [
        "Write an ASSERT_EQ-style macro that reports file, line, expected, and actual on failure and keeps counting",
        "Write at least 20 test cases across the three utilities, deliberately covering empty input, boundaries, and malformed input",
        "Make the harness print a final summary: N passed, M failed, and exit nonzero on any failure",
        "Introduce a bug into trim on purpose and confirm exactly the right tests fail with readable messages",
        "Fix a real bug the tests find (they will), and keep its regression test",
      ],
      checkpoints: [
        "The harness runs all tests even after one fails",
        "Test names read like sentences: parse_rejects_leading_garbage",
        "At least three tests target inputs you initially didn't think of (add them after boundary analysis)",
      ],
      hints: [
        "A macro can use __FILE__ and __LINE__ to report its own location — that's the whole trick.",
        "The inputs most worth testing are the ones that feel 'too weird to happen'. They happen.",
        "If a function is hard to test, that's the function's fault — split I/O from logic.",
      ],
      validation: [
        "Running the suite twice gives identical results (no hidden state between tests)",
        "A classmate can add a new test case in under two minutes by copying the pattern",
        "The exit code is usable: your suite could gate a build script",
      ],
      solutionOutline: [
        "The harness is a table of {name, function pointer} pairs, a runner loop, and counters — frameworks add discovery, fixtures, and reporting on top of exactly this.",
        "Boundary-first test selection finds most bugs with few cases because bugs cluster at edges of loops, allocations, and parsing.",
        "Exiting nonzero on failure is what makes tests automatable later in CI.",
      ],
      extensions: [
        "Add a 'run only tests matching a substring' filter — you've just invented test selection",
        "Time each test and flag slow ones — you've just invented profiling hooks",
      ],
    },
    resources: {
      primary: [
        { ...R.cs50p, url: "https://cs50.harvard.edu/python/weeks/5/", guidance: "Watch the Week 5 'Unit Tests' lecture (~45 min). It's taught in Python, but every idea — arrange-act-assert, edge cases, one behavior per test — transfers directly to the C harness you'll build." },
      ],
      alternatives: [],
      practice: [],
      extra: [
        { ...R.beejC, guidance: "The macros and function-pointer sections give you the tools the harness needs." },
        { ...R.pytestDocs, guidance: "Skim 'How to write tests' to see where this vocabulary reappears in Python later." },
      ],
    },
    masteryChecks: [
      "List the boundary cases for 'parse a date string' without running anything",
      "Explain why a passing test suite doesn't prove the program is correct — and why tests are still worth it",
      "Turn a bug report into a failing test before fixing the bug",
    ],
    securityNote:
      "Security testing is testing with a hostile imagination: the 'malformed input' cases you write here are exactly the inputs attackers try first. Keeping abuse cases in every suite is a core secure-engineering habit.",
  },
  "problem-decomposition": {
    whyItMatters:
      "The gap between students and engineers is rarely syntax — it's that engineers turn fog into a precise list of small, checkable pieces before coding. And your stated goal is independence: AI that writes your code steals exactly the practice hours this roadmap exists to give you.",
    concepts: [
      "Requirements: rewriting a vague ask as verifiable statements",
      "Data before operations: choosing what to represent usually decides the difficulty",
      "Operations as small named functions with clear inputs and outputs",
      "Edge cases as a first-class list, not an afterthought",
      "Walking through your plan on paper with a tiny example before coding",
      "AI protocol: explain-back rule, review-after-attempt rule, and never pasting code you can't derive",
    ],
    practicalUses: [
      "Starting any assignment with a 15-minute plan that halves total time",
      "Splitting a project with a teammate along clean data/operation boundaries",
      "Using an AI to critique your finished solution and quiz you — the two uses that make you stronger",
    ],
    lab: {
      title: "Spec First, Code Second",
      scenario:
        "Take a deliberately vague brief — 'make a program that manages a small library's book lending' — and produce a full decomposition and paper design before a single line of C.",
      outcome:
        "You have a reusable decomposition template and the experience of watching a fuzzy problem become a set of small, obviously-implementable functions.",
      requirements: [
        "Write 10+ requirements as testable sentences ('a member cannot borrow more than 3 books' — not 'handle borrowing')",
        "Design the data: what structs, what fields, what types, what invariants must always hold",
        "List the operations as function signatures with one-line contracts, before any bodies",
        "Enumerate 12+ edge cases (book already borrowed, unknown member, empty library, duplicate registration…)",
        "Trace two full scenarios by hand on paper through your design, then — and only then — implement the two most interesting operations in C",
      ],
      checkpoints: [
        "Every requirement is checkable: you could write a test for it",
        "Your edge-case list includes at least two you found only during the paper trace",
        "The C implementation required no design changes (or you documented why the design was wrong)",
      ],
      hints: [
        "If a requirement contains 'etc.' or 'handle properly', it isn't a requirement yet.",
        "When stuck on data design, write the operations first — the data they need becomes obvious.",
        "The paper trace feels childish and finds real design errors nearly every time. Do it honestly.",
      ],
      validation: [
        "Give a classmate only your spec (no conversation) — they should implement one operation compatibly",
        "Check each edge case: does the design make it impossible, an error, or a crash?",
      ],
      solutionOutline: [
        "Decomposition works because it converts one unbounded question into many bounded ones, each answerable in minutes.",
        "Invariants ('loan count never exceeds 3') become if-checks at the boundaries of your API — that's where validation code comes from.",
        "The AI protocol: attempt fully → ask AI to review and find flaws → explain every suggestion back in your own words → re-implement from understanding, never from the transcript.",
      ],
      extensions: [
        "Redo the exercise for a program you already wrote — find what the design phase would have caught",
        "Ask an AI to attack your spec with edge cases you missed, then decide which ones are real",
      ],
    },
    resources: {
      primary: [
        { ...R.cs50x, url: "https://cs50.harvard.edu/x/2025/weeks/0/", guidance: "Watch the Week 0 lecture (~2 h) — it is entirely about decomposing problems into precise computational steps. Ignore that the language is Scratch; the discipline is the point." },
      ],
      alternatives: [
        { ...R.mitMath, note: "The first proof lectures train the same muscle: making claims precise enough to verify." },
      ],
      practice: [],
      extra: [],
    },
    masteryChecks: [
      "Turn any vague one-sentence request into 8+ testable requirements in fifteen minutes",
      "State your personal AI rules and honestly report a week of following them",
      "Explain why 'the AI's code worked' can still mean you failed the exercise",
    ],
  },
};
