import type { TopicDraft } from "../types";
import { R } from "../resourceCatalog";

// The optional branch is intentionally lighter on full lab detail: these are
// "choose by interest" specializations. Each explains why you'd pick it and
// which prerequisites transfer, with a representative project rather than a
// full multi-checkpoint lab. No good engineer needs all of these.

export const optionalTopics: TopicDraft[] = [
  {
    id: "opt-rust",
    title: "Rust: Memory Safety Without a GC",
    branch: "optional",
    stage: 1,
    required: false,
    difficulty: "advanced",
    estimatedHours: 20,
    summary:
      "A systems language that guarantees memory safety at compile time via ownership and borrowing — the very rules you learned to follow manually in C, now enforced by the compiler. Increasingly the choice for new systems software where both safety and performance matter.",
    whyItMatters:
      "Rust eliminates entire bug classes (use-after-free, data races) that you fought manually in C, without a garbage collector's overhead. It's growing fast in systems, security, and infrastructure work. Choose it if you loved the C and systems branches but want the compiler to enforce the discipline you learned.",
    prerequisiteIds: ["c-heap-lifetime", "systems-concurrency"],
    concepts: [
      "Ownership and borrowing: your C ownership conventions, now compiler-enforced",
      "The borrow checker: why it rejects code, and how it prevents whole bug classes",
      "Lifetimes, references, and move semantics",
      "Enums and pattern matching (your tagged unions, first-class)",
      "Fearless concurrency: data races prevented at compile time",
      "The ecosystem: cargo, crates, and the tooling",
    ],
    practicalUses: [
      "New systems software where safety and speed both matter",
      "Security-sensitive components",
      "CLI tools and performance-critical services",
    ],
    lab: {
      title: "Port a C Project to Rust",
      scenario:
        "Take one of your C data-structure or systems projects (the text buffer, a data structure library, or the mini-shell) and rewrite it in Rust, letting the borrow checker teach you where your C had latent ownership issues.",
      outcome:
        "You can write safe Rust, you understand ownership/borrowing deeply (having seen it enforce what you did by hand), and you can judge when Rust is the right tool.",
      requirements: [
        "Reimplement a substantial C project in idiomatic Rust",
        "Use enums and pattern matching where you used tagged unions in C",
        "Let the borrow checker guide you; document at least three places it caught an issue your C version had (or could have had)",
        "Use cargo, write tests, and handle errors with Result",
        "Write a comparison: what Rust enforced that C left to discipline",
      ],
      checkpoints: [
        "The Rust version passes tests equivalent to your C version's",
        "You can explain a borrow-checker rejection and why the rule exists",
        "Pattern matching replaces your C tag-checking cleanly",
      ],
      hints: [
        "Fighting the borrow checker means you're doing something your C version did unsafely — listen to it rather than fighting it.",
        "Your C ownership conventions (one owner, document borrows) are literally Rust's rules — you already think this way.",
        "Start small; ownership clicks through experience, not explanation.",
      ],
      validation: [
        "Feature parity with the C version, verified by tests",
        "Your write-up correctly maps Rust rules to your C practices",
      ],
      solutionOutline: [
        "Rust's ownership model formalizes and enforces the manual discipline of your C heap work: one owner, explicit borrows, no use-after-free — the compiler proves at build time what you verified with Valgrind.",
        "Pattern matching on enums makes the tagged-union pattern safe and exhaustive, the same 'illegal states unrepresentable' goal from your FSM and TypeScript work.",
        "Rust is the right tool when you need C-level control with guaranteed safety; it's not a replacement for everything, and the transferable prerequisite is exactly your C memory and concurrency knowledge.",
      ],
      extensions: [
        "Explore async Rust for a networked version",
        "Build a small CLI tool you'd actually use",
      ],
    },
    resources: {
      primary: [
        { ...R.comprehensiveRust, guidance: "Work through days 1–3 (fundamentals through ownership, borrowing, and traits), doing each exercise as you reach it." },
      ],
      alternatives: [],
      practice: [
        { ...R.rustlings, guidance: "Run it alongside the course — fix broken Rust until the borrow checker feels like a colleague." },
        { ...R.exercism, title: "Exercism — Rust Track", url: "https://exercism.org/tracks/rust", guidance: "Small mentored exercises once rustlings is done." },
      ],
      extra: [
        { ...R.rustBook, guidance: "The canonical deep reference — read the ownership and traits chapters after the course." },
      ],
    },
    masteryChecks: [
      "Explain ownership and borrowing and map them to your C conventions",
      "Explain a borrow-checker rejection and the bug it prevents",
      "Judge when Rust is the right choice over C or a GC'd language",
    ],
  },
  {
    id: "opt-go",
    title: "Go: Services & Networking",
    branch: "optional",
    stage: 2,
    required: false,
    difficulty: "intermediate",
    estimatedHours: 16,
    summary:
      "A simple, fast, statically-typed language built for networked services and concurrency, with goroutines and channels making concurrent code approachable. A pragmatic choice for backend services, CLI tools, and infrastructure (Docker and Kubernetes are written in it).",
    whyItMatters:
      "Go trades some expressiveness for simplicity, fast compilation, and excellent concurrency — a very productive combination for backend and infrastructure work. Choose it if you enjoyed the backend and networking branches and want a language purpose-built for servers.",
    prerequisiteIds: ["systems-networking", "db-fastapi"],
    concepts: [
      "Go's deliberate simplicity and static typing",
      "Goroutines and channels: concurrency as a first-class, approachable feature",
      "The standard library's strong networking and HTTP support",
      "Interfaces and Go's structural typing",
      "Error handling as explicit values (echoing your C return-code discipline)",
      "Tooling: fast builds, formatting, and a batteries-included stdlib",
    ],
    practicalUses: [
      "Backend services and APIs",
      "CLI and infrastructure tools",
      "High-concurrency networked systems",
    ],
    lab: {
      title: "Rebuild a Service in Go",
      scenario:
        "Reimplement a networked service you've built (a simple version of the chat server, or a small HTTP API) in Go, using goroutines and channels for concurrency and comparing the experience to C and Python.",
      outcome:
        "You can write idiomatic Go services and judge when its simplicity-and-concurrency trade-off is the right fit.",
      requirements: [
        "Build a concurrent networked service using goroutines and channels",
        "Use Go's standard library for HTTP or TCP",
        "Handle errors explicitly the Go way",
        "Compare the concurrency model to your pthreads and asyncio experience",
      ],
      checkpoints: [
        "The service handles concurrent connections correctly",
        "Channels coordinate goroutines without explicit locks where possible",
        "You can articulate Go's trade-offs vs. C and Python",
      ],
      hints: [
        "Channels let goroutines communicate instead of sharing memory — 'share memory by communicating', which sidesteps many of the races you fought in C.",
        "Go's simplicity is the point; resist importing habits that fight it.",
      ],
      validation: [
        "Concurrent load handled correctly without races",
        "Idiomatic error handling throughout",
      ],
      solutionOutline: [
        "Goroutines are cheap concurrent tasks and channels coordinate them, offering a higher-level, safer concurrency model than raw threads — your systems-concurrency understanding explains why it helps.",
        "Go's explicit error-value handling echoes your C discipline, and its strong networking stdlib makes services quick to build.",
        "Choose Go for networked services and tooling where its simplicity and concurrency pay off; the transferable prerequisites are your networking and backend knowledge.",
      ],
      extensions: [
        "Deploy the Go service in a minimal container (Go's static binaries shine here)",
        "Add graceful shutdown and structured logging",
      ],
    },
    resources: {
      primary: [
        { ...R.goTour, guidance: "Complete the full tour in the browser (~4 h), running and modifying every example — then port the lab." },
      ],
      alternatives: [],
      practice: [
        { ...R.exercism, title: "Exercism — Go Track", url: "https://exercism.org/tracks/go", guidance: "The Go track's early exercises cement the syntax fast." },
      ],
      extra: [
        { ...R.goByExample, guidance: "Annotated runnable examples for everything the Tour showed." },
        { ...R.dockerStart, guidance: "Go and container infrastructure go hand in hand." },
      ],
    },
    masteryChecks: [
      "Build a concurrent Go service with goroutines and channels",
      "Explain Go's concurrency model vs. threads and async",
      "Judge when Go's trade-offs make it the right choice",
    ],
  },
  {
    id: "opt-enterprise",
    title: "Java / C# & Enterprise Ecosystems",
    branch: "optional",
    stage: 3,
    required: false,
    difficulty: "intermediate",
    estimatedHours: 16,
    summary:
      "Mature, statically-typed, object-oriented languages with vast ecosystems dominating large enterprise systems, Android (Java/Kotlin), and Windows/games (C#). Strong tooling, established patterns, and a lot of jobs. Choose based on the ecosystem you want to enter.",
    whyItMatters:
      "A huge share of existing enterprise software runs on the JVM or .NET, and these skills open many jobs. The OOP concepts transfer directly from your Python and TypeScript work. Choose Java for JVM/Android/enterprise, C# for .NET/Windows/Unity game development.",
    prerequisiteIds: ["py-classes-types", "se-architecture"],
    concepts: [
      "Strong static typing and mature OOP (your class knowledge, formalized further)",
      "The vast standard libraries and frameworks (Spring, .NET)",
      "Build tooling and package ecosystems (Maven/Gradle, NuGet)",
      "Established enterprise patterns and their trade-offs",
      "The JVM / CLR runtime model",
      "Where each dominates: Java (enterprise, Android), C# (Windows, Unity)",
    ],
    practicalUses: [
      "Enterprise backend systems",
      "Android development (Java/Kotlin)",
      "Windows apps and Unity games (C#)",
    ],
    lab: {
      title: "Build a Small Service in Java or C#",
      scenario:
        "Pick the ecosystem matching your goals and build a small typed application or service (e.g., a REST API with Spring Boot or ASP.NET), experiencing the tooling and patterns of the enterprise world.",
      outcome:
        "You can work in a JVM or .NET codebase and judge when these ecosystems are the right choice.",
      requirements: [
        "Build a small typed service or app in Java or C#",
        "Use the ecosystem's standard framework and build tooling",
        "Apply OOP and architecture concepts you already know",
        "Reflect on the ecosystem's strengths and ceremony vs. Python/Go",
      ],
      checkpoints: [
        "The application builds and runs with the standard tooling",
        "You've used the mainstream framework idiomatically",
        "You can articulate when this ecosystem fits",
      ],
      hints: [
        "Your Python/TypeScript OOP transfers directly — the concepts are the same, the ceremony differs.",
        "Choose the ecosystem by destination: Android → Java/Kotlin, Windows/Unity → C#, general enterprise → either.",
      ],
      validation: [
        "A working application using the standard framework",
        "A reasoned comparison to ecosystems you know",
      ],
      solutionOutline: [
        "Java and C# formalize the OOP you learned, backed by huge mature ecosystems and strong tooling — the learning curve is mostly ecosystem and ceremony, not concepts.",
        "The choice is ecosystem-driven: you learn one to enter a specific world (enterprise JVM, Android, .NET, Unity), and your architecture and OOP knowledge transfers wholesale.",
      ],
      extensions: [
        "Explore Kotlin (modern JVM) or F# (functional .NET)",
        "For C#, try a small Unity project if games interest you",
      ],
    },
    resources: {
      primary: [
        { ...R.moocFiJava, guidance: "Choosing Java: do Parts 1–7 of 'Java Programming I' — exercise-driven with automatic grading." },
        { ...R.csharpPath, guidance: "Choosing C#: complete this Microsoft Learn path with its in-browser exercises. Pick one language, not both." },
      ],
      alternatives: [],
      practice: [],
      extra: [
        { ...R.tsHandbook, guidance: "Your typed-OOP foundation transfers; type-thinking carries straight into Java and C#." },
      ],
    },
    masteryChecks: [
      "Build a small service in Java or C# with the standard framework",
      "Explain the JVM/CLR runtime model at a high level",
      "Judge which ecosystem fits a given goal",
    ],
  },
  {
    id: "opt-cpp",
    title: "C++ Where the Domain Demands It",
    branch: "optional",
    stage: 4,
    required: false,
    difficulty: "advanced",
    estimatedHours: 20,
    summary:
      "C with vastly more power and complexity: RAII, classes, templates, the STL, and modern smart pointers for safer memory management. The language of game engines, high-performance computing, and much existing systems software. Learn it when a specific domain requires it.",
    whyItMatters:
      "C++ dominates performance-critical domains (game engines, trading, graphics, large native codebases) and isn't going away. Your C foundation is the prerequisite; C++ adds abstraction and safety mechanisms on top. Choose it when your target domain (games, HPC, specific engines) demands it — not as a default.",
    prerequisiteIds: ["c-structs-callbacks", "se-clean-code"],
    concepts: [
      "RAII: resource lifetime tied to scope (your manual cleanup, automated)",
      "Classes, constructors/destructors, and value semantics",
      "Smart pointers (unique_ptr, shared_ptr): safer ownership than raw C pointers",
      "Templates and generic programming",
      "The STL: containers and algorithms (the structures you built, standardized)",
      "Modern C++ practices vs. legacy C-with-classes",
    ],
    practicalUses: [
      "Game engines and real-time graphics",
      "High-performance and scientific computing",
      "Large existing native codebases",
    ],
    lab: {
      title: "Modernize a C Project with Modern C++",
      scenario:
        "Take a C data-structure project and rewrite it in modern C++ using RAII, smart pointers, templates, and the STL — experiencing how C++ automates the memory discipline you did by hand.",
      outcome:
        "You can write modern (not legacy) C++, use RAII and smart pointers for safer memory, and judge when C++ is warranted.",
      requirements: [
        "Rewrite a C project using RAII and smart pointers instead of manual malloc/free",
        "Use STL containers and algorithms where you'd hand-rolled structures",
        "Write at least one template for generic code (your void* generics, type-safe)",
        "Compare memory-safety and expressiveness to your C version",
      ],
      checkpoints: [
        "No raw new/delete or malloc/free — RAII and smart pointers manage memory",
        "STL replaces hand-rolled structures appropriately",
        "A template provides type-safe genericity",
      ],
      hints: [
        "RAII means destructors free resources automatically — the cleanup you did manually in C, guaranteed by scope.",
        "Prefer modern C++ (smart pointers, STL, value semantics) over 'C with classes'; the modern subset is far safer.",
        "unique_ptr expresses single ownership — literally your C ownership convention as a type.",
      ],
      validation: [
        "Feature parity with the C version, memory-safe by construction",
        "Clean under sanitizers with no manual memory management",
      ],
      solutionOutline: [
        "RAII and smart pointers automate the ownership discipline of your C heap work: destructors and unique_ptr/shared_ptr enforce cleanup and single/shared ownership that you tracked manually.",
        "Templates and the STL give type-safe generics and battle-tested versions of the structures you built by hand — your from-scratch experience is exactly what lets you use them wisely.",
        "C++ is warranted when a domain demands its performance and control (games, HPC, existing codebases); your C foundation transfers directly and is the reason to learn C first.",
      ],
      extensions: [
        "Explore move semantics and perfect forwarding",
        "Try a small graphics or game project if that's your interest",
      ],
    },
    resources: {
      primary: [
        { ...R.learncpp, guidance: "Chapters 1–13 (basics through classes), skimming what C already taught you; do the quizzes — they catch C habits." },
      ],
      alternatives: [],
      practice: [
        { ...R.exercism, title: "Exercism — C++ Track", url: "https://exercism.org/tracks/cpp", guidance: "Mentor feedback here catches C-isms in your C++." },
        { ...R.godbolt, guidance: "Invaluable for seeing what C++ abstractions compile to — often nothing." },
      ],
      extra: [
        { ...R.cppref, guidance: "cppreference covers C++ too — the standard-library reference to keep open." },
      ],
    },
    masteryChecks: [
      "Rewrite a C structure in modern C++ with RAII and smart pointers",
      "Explain RAII in terms of your C manual cleanup",
      "Judge when C++ is the right tool over C or a higher-level language",
    ],
  },
  {
    id: "opt-gamedev",
    title: "Game Development & Godot",
    branch: "optional",
    stage: 5,
    required: false,
    difficulty: "intermediate",
    estimatedHours: 18,
    summary:
      "Interactive real-time software with its own delightful challenges: the game loop, rendering, input, physics, and state — using Godot, a free and open-source engine. A fun way to apply your math (vectors, state machines) and see immediate visual results.",
    whyItMatters:
      "Game development is engaging and applies real CS (linear algebra, state machines, performance, physics) to visible, interactive results. Godot is free, open-source, and beginner-friendly. Choose it for enjoyment and to exercise your math and systems knowledge in a creative context — a great motivator.",
    prerequisiteIds: ["cs-state-machines", "cs-discrete-probability"],
    concepts: [
      "The game loop: update and render every frame",
      "Coordinate systems and vectors (your linear-algebra touchpoints, applied)",
      "State machines for game entities (your FSM work, in a fun context)",
      "Input handling, collision, and simple physics",
      "Scenes, nodes, and Godot's composition model",
      "Performance thinking under a frame budget",
    ],
    practicalUses: [
      "Building games and interactive experiences",
      "Simulations and visualizations",
      "Applying math and systems knowledge creatively",
    ],
    lab: {
      title: "Build a Complete Small Game",
      scenario:
        "Build a small but complete game in Godot (e.g., a 2D arcade game) with a game loop, player input, entity state machines, collision, and a win/lose flow — finished and playable.",
      outcome:
        "You can build a complete small game, and you've applied vectors, state machines, and performance thinking to real-time interactive software.",
      requirements: [
        "A complete, playable game with a clear objective and win/lose states",
        "Entity behavior driven by state machines (your FSM knowledge)",
        "Vector math for movement and collision",
        "Input handling and a frame-rate-independent game loop",
        "Polish: a start screen, score, and restart",
      ],
      checkpoints: [
        "The game is complete and playable start to finish",
        "State machines drive entity behavior clearly",
        "Movement uses vectors correctly and is frame-rate independent",
      ],
      hints: [
        "Frame-rate independence: multiply movement by delta time so the game plays the same on fast and slow machines.",
        "Your state-machine work is perfect for enemy/player behavior — model states and transitions explicitly.",
        "Finish a tiny game rather than starting a huge one; 'complete and small' beats 'ambitious and abandoned'.",
      ],
      validation: [
        "The game is playable and completable by someone else",
        "Behavior is correct and frame-rate independent",
      ],
      solutionOutline: [
        "A game is a loop that reads input, updates state (entities, physics, score), and renders — every frame; delta-time scaling keeps it consistent across hardware.",
        "State machines model entity behavior cleanly (your CS-branch skill in a creative setting), and vector math handles movement and collision.",
        "Choose game dev for motivation and to apply math/systems knowledge visibly; Godot's free, approachable engine removes the barriers.",
      ],
      extensions: [
        "Add particle effects, sound, and juice",
        "Try a simple multiplayer feature (ties to your networking knowledge)",
      ],
    },
    resources: {
      primary: [
        { ...R.godotFirst2D, guidance: "Build the whole tutorial game first; only then start your own — the discipline pays off." },
      ],
      alternatives: [
        { ...R.learnGdscript, guidance: "An interactive in-browser app teaching GDScript from zero, if the scripting side feels shaky." },
      ],
      practice: [],
      extra: [
        { ...R.mitMath, guidance: "For the vector math that game movement and collision use." },
        { ...R.visualgo, guidance: "For the algorithms and state machines that power game logic." },
      ],
    },
    masteryChecks: [
      "Build a complete small game with a game loop and state machines",
      "Explain frame-rate independence and implement it",
      "Apply vector math to movement and collision",
    ],
  },
  {
    id: "opt-frontiers",
    title: "Frontiers: Embedded, Compilers, Cloud, ML & Distributed Systems",
    branch: "optional",
    stage: 6,
    required: false,
    difficulty: "advanced",
    estimatedHours: 20,
    summary:
      "A signpost to deeper specializations, each a career in itself, with guidance on why you'd choose them and which of your foundations transfer: embedded systems (C on microcontrollers), compilers/interpreters (build a language), cloud infrastructure (scaling systems), data science and machine learning (Python-based), and advanced distributed systems.",
    whyItMatters:
      "These are directions to grow after the core roadmap, not requirements. Each builds on foundations you'll have: embedded on your C/systems work, compilers on your parsing/trees/state-machines, cloud on your deployment work, ML on your Python and math, distributed systems on your networking and concurrency. Choose by genuine interest — no one masters all of them.",
    prerequisiteIds: ["cs-state-machines", "systems-networking", "se-ci-docker-deploy"],
    concepts: [
      "Embedded systems: C on microcontrollers, real-time constraints, hardware interfaces (builds on C/systems)",
      "Compilers/interpreters: lexing, parsing, ASTs, and code generation (builds on your tokenizer, trees, state machines)",
      "Cloud infrastructure: scaling, orchestration, and managed services (builds on deployment/Docker)",
      "Data science & ML: Python, numpy/pandas, and models — theory through practice (builds on Python and your discrete math/probability)",
      "Advanced distributed systems: consensus, replication, and fault tolerance (builds on networking/concurrency)",
      "How to evaluate and enter a specialization deliberately",
    ],
    practicalUses: [
      "Choosing a deep specialization aligned with your interests",
      "Understanding what each field requires before committing",
      "Seeing how the core roadmap's foundations transfer forward",
    ],
    lab: {
      title: "Sample a Frontier — Build a Tiny Interpreter",
      scenario:
        "Sample one frontier to feel it. The recommended entry point: build a tiny interpreter for a calculator-or-small language — your tokenizer (state machines), parser (recursion/trees), and evaluator (tree traversal) finally compose into a working language. Or substitute an equivalent starter project in another frontier that draws you.",
      outcome:
        "You've experienced a specialization deeply enough to decide whether to pursue it, and you've seen your core foundations compose into something you might have thought was 'advanced'.",
      requirements: [
        "Build a working interpreter: tokenizer → parser (to an AST) → evaluator, for a small language with variables, arithmetic, and maybe conditionals",
        "Reuse your prior work: the tokenizer is your state-machine lab; the AST is your tree work; evaluation is tree traversal; the whole thing is your calculator, grown up",
        "OR: substitute a starter project in embedded (blink-and-sense on a microcontroller), ML (train and evaluate a simple model on real data), or cloud (deploy an auto-scaling service) if that frontier calls you more",
        "Write a reflection on the frontier: what it requires, what you loved or didn't, and whether to go deeper",
      ],
      checkpoints: [
        "The interpreter correctly evaluates programs in your small language",
        "You can point to which prior lab each stage descends from",
        "Your reflection is an honest go/no-go on pursuing the specialization",
      ],
      hints: [
        "The interpreter is the payoff of the whole roadmap: tokenizer (FSM) + parser (recursion/trees) + evaluator (traversal) — you already built every piece.",
        "Parsing with precedence: recursive descent or the shunting-yard idea from your calculator lab.",
        "Sampling beats committing blind: build one real thing in a frontier before deciding it's your path.",
      ],
      validation: [
        "Your chosen frontier project actually works",
        "You can connect its pieces to foundations you already built",
      ],
      solutionOutline: [
        "An interpreter composes skills you already have: lexing is a state machine, parsing builds a tree via recursion, and evaluation traverses that tree — the 'advanced' project is your foundations combined, which is the roadmap's whole thesis.",
        "Each frontier extends a specific foundation (embedded←systems, compilers←parsing/trees, cloud←deployment, ML←Python/math, distributed←networking/concurrency), so entering one is deepening what you have, not starting over.",
        "The deliberate move is to sample one frontier with a real project, then decide — no engineer masters all of them, and choosing by genuine interest is how depth and motivation are sustained.",
      ],
      extensions: [
        "Grow the interpreter: functions, closures, a REPL",
        "Sample a second frontier and compare which pulls you",
      ],
    },
    resources: {
      primary: [
        { ...R.fastaiCourse, guidance: "If machine learning calls you: do lessons 1–2 and train your first real model this week." },
      ],
      alternatives: [
        { ...R.mit6824, guidance: "If distributed systems call you: watch lectures 1–3 and attempt the first lab." },
        { ...R.craftingInterpreters, guidance: "If languages call you: build the tree-walking interpreter in part II, chapter by chapter." },
      ],
      practice: [],
      extra: [
        { ...R.nand2tetris, guidance: "Its back half builds a compiler and VM — the canonical from-scratch language project." },
        { ...R.ostep, guidance: "For the systems grounding embedded and distributed work build on." },
      ],
    },
    masteryChecks: [
      "Build a working tiny interpreter and connect each stage to a prior lab",
      "Explain which foundations transfer to a chosen frontier",
      "Make a reasoned decision about which specialization (if any) to pursue",
    ],
  },
];
