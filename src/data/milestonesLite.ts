import type { MilestoneLite } from "./types";


/**
 * Cross-branch capstone projects. Each is unlocked by specific topics and
 * integrates skills from multiple branches. These are detailed briefs, not
 * source code — the learning is in building them.
 */
export const milestonesLite: MilestoneLite[] = [
  {
    id: "m-c-database",
    title: "C Personal Database",
    unlockedBy: ["c-hash-tables", "c-file-io", "c-modular-build", "testing-fundamentals"],
    integrates: ["c", "start"],
    brief:
      "A single-file, persistent database engine in C: store, query, update, and delete records with fields, backed by a binary file format you design and a hash index for fast lookup. Your dynamic memory, file I/O, modular C, and data-structure skills converge into a real, useful program.",
  },
  {
    id: "m-c-search-engine",
    title: "C Text Search Engine",
    unlockedBy: ["c-hash-tables", "c-trees", "c-file-io", "cs-big-o"],
    integrates: ["c", "cs"],
    brief:
      "A search engine over a directory of text files: tokenize documents, build an inverted index (word → documents containing it), and answer multi-word queries ranked by relevance — with performance you measure. Hashing, dynamic structures, file traversal, and complexity analysis in one substantial system.",
  },
  {
    id: "m-python-automation",
    title: "Python Automation Toolkit",
    unlockedBy: ["py-files-stdlib", "py-testing-cli", "py-functions-errors"],
    integrates: ["python", "start"],
    brief:
      "A cohesive toolkit of file-automation utilities — organizer, duplicate detector, log analyzer — unified under one CLI, with the safety features that distinguish real automation: dry-run previews, undo journals, configuration, structured logging, and a real test suite. The tool you'll actually keep using.",
  },
  {
    id: "m-python-task-cli",
    title: "Python / SQLite Task CLI",
    unlockedBy: ["py-testing-cli", "py-classes-types", "db-relational-thinking"],
    integrates: ["python", "backend"],
    brief:
      "A polished task-manager CLI backed by SQLite: schema design with migrations, rich commands (add, list with filters, complete, stats), full test coverage, and proper packaging. The professional Python project skeleton, complete — bridging Python and databases.",
  },
  {
    id: "m-vanilla-web",
    title: "Vanilla Web Application",
    unlockedBy: ["web-dom-async", "web-css", "web-html-a11y"],
    integrates: ["web"],
    brief:
      "A complete, framework-free web application (an expense or inventory tracker) demonstrating mastery of the platform itself: semantic accessible HTML, responsive CSS, DOM manipulation, event handling, browser storage, and honest data states — proving you understand what frameworks abstract before relying on them.",
  },
  {
    id: "m-fullstack-issue-tracker",
    title: "Full-Stack Issue Tracker",
    unlockedBy: ["web-react", "db-fastapi", "db-auth", "se-ci-docker-deploy", "web-frontend-quality"],
    integrates: ["web", "backend", "practice"],
    brief:
      "The flagship project: a complete issue tracker with a React/TypeScript frontend, a FastAPI/PostgreSQL backend, real authentication and authorization, comprehensive testing, structured logging, CI, and deployment. The project that proves you're a full-stack engineer — and the throughline of the entire web and backend branches.",
  },
  {
    id: "m-networked-chat",
    title: "Networked Chat System",
    unlockedBy: ["systems-networking", "systems-concurrency", "cs-state-machines"],
    integrates: ["systems", "c"],
    brief:
      "A robust multi-client chat system (C or Python) with a deliberately designed protocol: concurrent clients, message framing, malformed-message resilience, and packet inspection with Wireshark. Networking, concurrency, and protocol design proven under adversarial conditions.",
  },
  {
    id: "m-http-server-c",
    title: "HTTP Server in C",
    unlockedBy: ["systems-networking", "c-file-io", "systems-concurrency", "cs-state-machines"],
    integrates: ["systems", "c", "web"],
    brief:
      "A working HTTP/1.1 server in C serving static files: parse requests, handle methods and status codes, serve files with correct content types, and enforce strict security limits — with concurrency as an extension. The project that connects your C, systems, and web knowledge into the thing that powers the web.",
  },
  {
    id: "m-react-native-companion",
    title: "React Native Companion",
    unlockedBy: ["mobile-app-data", "mobile-react-native", "db-fastapi"],
    integrates: ["mobile", "web", "backend"],
    brief:
      "An Expo/TypeScript mobile client for your existing issue-tracker backend, with the mobile-critical features: authentication with secure token storage, offline-capable browsing, optimistic creation with sync, and honest error/offline states. Proves your foundations extend to mobile without a separate beginner path.",
  },
  {
    id: "m-architecture-evolution",
    title: "Issue Tracker: Architecture Evolution",
    unlockedBy: ["arch-reliability", "arch-observability", "arch-evolution", "m-fullstack-issue-tracker"],
    integrates: ["arch", "backend", "practice"],
    brief:
      "The architecture capstone: take your shipped issue tracker through a complete architectural evolution — a decision log with explicit quality attributes, enforced boundaries with tests at them, real observability, a scripted failure/recovery exercise, and an executed first slice of an incremental migration. Proves architectural judgment on a living system, not on diagrams.",
  },
  {
    id: "m-security-capstone",
    title: "Secure Engineering Capstone",
    unlockedBy: ["sec-web-vulns", "sec-memory-crypto", "m-fullstack-issue-tracker", "arch-boundaries"],
    integrates: ["security", "backend", "web", "practice"],
    brief:
      "The culminating security project: take a complete application (your issue tracker or a purpose-built one), threat-model it, attack it in an authorized local environment, remediate every finding, and document the trade-offs — demonstrating secure engineering end to end, always within legal, authorized boundaries.",
  },
];

export const milestoneCount = milestonesLite.length;
