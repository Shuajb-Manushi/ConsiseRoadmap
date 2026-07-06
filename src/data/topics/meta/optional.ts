import type { TopicMeta } from "../../types";


// The optional branch is intentionally lighter on full lab detail: these are
// "choose by interest" specializations. Each explains why you'd pick it and
// which prerequisites transfer, with a representative project rather than a
// full multi-checkpoint lab. No good engineer needs all of these.
export const optionalMeta: TopicMeta[] = [
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
    prerequisiteIds: ["c-heap-lifetime", "systems-concurrency"],
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
    prerequisiteIds: ["systems-networking", "db-fastapi"],
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
    prerequisiteIds: ["py-classes-types", "arch-boundaries"],
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
    prerequisiteIds: ["c-structs-callbacks", "se-clean-code"],
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
    prerequisiteIds: ["cs-state-machines", "cs-discrete-probability"],
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
    prerequisiteIds: ["cs-state-machines", "systems-networking", "se-ci-docker-deploy"],
  },
];
