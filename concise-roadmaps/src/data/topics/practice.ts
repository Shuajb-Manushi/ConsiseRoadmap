import type { TopicDraft } from "../types";
import { R } from "../resourceCatalog";

export const practiceTopics: TopicDraft[] = [
  {
    id: "se-requirements",
    title: "Requirements & Acceptance Criteria",
    branch: "practice",
    stage: 1,
    required: true,
    difficulty: "intermediate",
    estimatedHours: 6,
    summary:
      "Turning wishes into buildable, verifiable specifications: user stories, acceptance criteria written as testable conditions, defining scope and explicit non-goals, and surfacing hidden assumptions before they become expensive. The disciplined front end of every successful project.",
    whyItMatters:
      "Most project failures are requirements failures, not coding failures — building the wrong thing correctly. The habit of pinning down 'done' before starting saves more time than any coding trick, and acceptance criteria become your tests and your definition of success.",
    prerequisiteIds: ["problem-decomposition"],
    concepts: [
      "User stories: who, what, why — value framed from the user's side",
      "Acceptance criteria as testable conditions (Given/When/Then)",
      "Scope and explicit non-goals; the power of writing down what you won't do",
      "Surfacing assumptions and unknowns early",
      "Slicing work into thin, shippable increments",
      "Traceability: criteria → tests → done",
    ],
    practicalUses: [
      "Starting any feature with a shared, verifiable definition of done",
      "Negotiating scope honestly instead of discovering it mid-build",
      "Deriving your test cases directly from acceptance criteria",
    ],
    lab: {
      title: "Specify a Real Feature End to End",
      scenario:
        "Take a genuinely underspecified request for one of your existing projects (e.g., 'add labels to the issue tracker') and produce a complete, professional specification — stories, acceptance criteria, non-goals, assumptions — then implement strictly to it and check each criterion.",
      outcome:
        "You can convert vague requests into buildable specs whose acceptance criteria double as your test plan and your definition of done.",
      requirements: [
        "At least three user stories with clear value statements",
        "Acceptance criteria in Given/When/Then form, each independently testable",
        "An explicit non-goals list (what this feature deliberately won't do)",
        "A documented assumptions/unknowns list with how you'd resolve each",
        "Implement to the spec, then verify every acceptance criterion, marking pass/fail",
        "A short retrospective: which criteria you'd missed without writing them down first",
      ],
      checkpoints: [
        "Each acceptance criterion is verifiable — you could automate it",
        "Non-goals prevented at least one scope creep temptation",
        "The implementation maps cleanly to criteria (no orphan features, no missing ones)",
      ],
      hints: [
        "If a criterion can't fail, it isn't a criterion — make each one falsifiable.",
        "Non-goals are as valuable as goals: they end the 'but what about…' spiral.",
        "Acceptance criteria are your tests in prose — you're doing test-driven planning.",
      ],
      validation: [
        "A classmate implements one story from your spec alone and matches your intent",
        "Every acceptance criterion has a corresponding verification (manual or automated)",
      ],
      solutionOutline: [
        "Requirements work converts ambiguity (expensive to discover late) into explicit, cheap-to-change text; acceptance criteria make 'done' objective.",
        "Non-goals and assumptions manage scope and risk directly — the two things that sink projects.",
        "Because criteria are testable, they flow straight into your test suite: specification and verification are the same artifact viewed twice.",
      ],
      extensions: [
        "Translate acceptance criteria into automated tests before implementing (true BDD)",
        "Estimate each story and compare with actual time spent",
      ],
    },
    resources: {
      primary: [
        { ...R.githubSkills, note: "Its issues/project-management courses model stories and criteria in practice." },
      ],
      alternatives: [
        { ...R.missingSemester, note: "The engineering-habits framing reinforces spec-before-code discipline." },
      ],
    },
    masteryChecks: [
      "Convert a one-line feature request into stories with testable acceptance criteria",
      "Write meaningful non-goals for a feature and explain their value",
      "Trace an acceptance criterion to the test that verifies it",
    ],
  },
  {
    id: "se-git-collaboration",
    title: "Collaborative Git: Branches, PRs & Conflicts",
    branch: "practice",
    stage: 2,
    required: true,
    difficulty: "intermediate",
    estimatedHours: 8,
    summary:
      "Git as a team sport: branching strategies, pull requests as the unit of change and review, resolving merge conflicts calmly, keeping history readable, and the collaboration workflow (feature branch → PR → review → merge) that virtually all professional software uses.",
    whyItMatters:
      "Solo Git keeps your work safe; collaborative Git is how all real software is built. Pull requests are where code is reviewed, discussed, and improved, and conflict resolution is a routine skill that panics the unprepared — mastering the team workflow is table stakes for any engineering job.",
    prerequisiteIds: ["git-github"],
    concepts: [
      "Branching strategies: feature branches, main protection, trunk-based ideas",
      "Pull requests: scoping a reviewable change, description, and self-review",
      "Merge conflicts: why they happen, reading conflict markers, resolving deliberately",
      "Keeping history clean: meaningful commits, when to squash, rebase vs. merge trade-offs",
      "Reviewing others' PRs and receiving reviews gracefully",
      "Remotes, forks, and the open-source contribution flow",
    ],
    practicalUses: [
      "Contributing to any team or open-source project",
      "Reviewing and being reviewed — the core social loop of engineering",
      "Untangling the merge conflicts that will absolutely happen",
    ],
    lab: {
      title: "Simulate a Team Workflow",
      scenario:
        "Run a realistic collaboration — ideally with a classmate, or by playing both roles across two clones: feature branches, pull requests with real descriptions, code review comments, deliberately engineered merge conflicts, and clean resolution, all on one of your existing repos.",
      outcome:
        "The professional Git workflow is routine: you branch, open reviewable PRs, review others, and resolve conflicts without stress.",
      requirements: [
        "Protect main; do all work on feature branches merged via PRs",
        "Open at least three PRs with proper descriptions linking to acceptance criteria; self-review each before requesting review",
        "Conduct a real code review on a partner's (or your alter-ego's) PR: at least three substantive comments, not just approvals",
        "Engineer and resolve at least two genuine merge conflicts (two branches editing the same lines), resolving deliberately and testing after",
        "Demonstrate both a squash-merge and a standard merge and articulate when each is appropriate",
        "Contribute one small real PR to an open-source project (typo fix, doc improvement, or a good-first-issue) end to end",
      ],
      checkpoints: [
        "PRs are appropriately scoped (reviewable in one sitting, one concern each)",
        "Conflict resolutions are correct and tested, not just 'accept theirs' guesses",
        "Your review comments are specific and constructive",
        "The open-source PR follows the project's contribution guidelines",
      ],
      hints: [
        "Small PRs get good reviews; giant PRs get rubber stamps. Scope ruthlessly.",
        "A conflict marker shows both sides — understand both changes before choosing; sometimes the answer is neither, but a combination.",
        "Review the code, not the coder: comment on specifics with reasoning, and receive comments as gifts.",
      ],
      validation: [
        "Every merge to main went through a PR; history is readable",
        "Post-conflict, tests pass — resolution didn't silently break anything",
        "The open-source PR is accepted or receives real maintainer feedback",
      ],
      solutionOutline: [
        "The feature-branch/PR workflow isolates work-in-progress, creates a review checkpoint, and keeps main always releasable — the social and technical backbone of team development.",
        "Conflicts are Git honestly reporting that two changes overlap and a human must decide; the calm move is to understand both intents and test the result.",
        "Squash vs. merge is a history-legibility choice: squash for a clean single-purpose change, merge to preserve meaningful sub-history — clarity for future readers is the criterion.",
      ],
      extensions: [
        "Set up a PR template and a CODEOWNERS file",
        "Practice an interactive rebase to tidy a messy branch before review (advanced, optional)",
      ],
    },
    resources: {
      primary: [
        { ...R.proGit, note: "Chapters on branching and distributed workflows — the canonical treatment." },
      ],
      alternatives: [
        { ...R.githubSkills, note: "Interactive PR, review, and merge-conflict courses inside real repos." },
      ],
    },
    masteryChecks: [
      "Scope, open, and self-review a well-described PR",
      "Resolve a real merge conflict and verify correctness afterward",
      "Give three substantive, constructive review comments on unfamiliar code",
    ],
  },
  {
    id: "se-clean-code",
    title: "Naming, Cohesion, Coupling & Refactoring",
    branch: "practice",
    stage: 3,
    required: true,
    difficulty: "intermediate",
    estimatedHours: 10,
    summary:
      "Writing code for the next human: naming that reveals intent, functions and modules with high cohesion and low coupling, clear interfaces, and refactoring — improving structure without changing behavior, safely, under the protection of tests. Plus procedural, OO, and functional styles as tools chosen per problem.",
    whyItMatters:
      "Code is read far more than written, and most professional work is changing existing code — so readability and low coupling directly determine how fast and safely a system can evolve. Refactoring skill (guarded by tests) is what keeps a codebase from ossifying into something no one dares touch.",
    prerequisiteIds: ["testing-fundamentals", "py-classes-types"],
    concepts: [
      "Naming: intention-revealing, consistent, honest names; when a name signals a design flaw",
      "Cohesion: a unit doing one thing; coupling: minimizing what units must know about each other",
      "Interfaces and information hiding (your opaque pointers and protocols, generalized)",
      "Refactoring under test: small behavior-preserving steps with green tests between",
      "Code smells as prompts (long functions, duplication, feature envy) — heuristics, not laws",
      "Procedural vs. OO vs. functional styles as situational tools, not identities",
    ],
    practicalUses: [
      "Making any codebase (including your own past work) easier to change",
      "Reducing bugs by reducing what each change can break",
      "Onboarding others (and future-you) faster",
    ],
    lab: {
      title: "Refactor Your Worst Code",
      scenario:
        "Take a genuinely messy piece of your own earlier work (there's a candidate — the first version of the file organizer or an early lab), pin its behavior with characterization tests, then refactor it in small safe steps into something you'd be proud to show, measuring the improvement.",
      outcome:
        "You can improve real code safely under test protection, you can name and address smells, and you've felt how coupling and cohesion determine changeability.",
      requirements: [
        "Choose a real messy module; document what makes it hard (specific smells, not 'it's bad')",
        "Write characterization tests capturing current behavior before changing anything (so you can refactor without fear)",
        "Refactor in small commits, tests green between each: rename for clarity, extract cohesive functions, reduce coupling, hide internals behind a clean interface",
        "Demonstrate a behavior-preserving change and prove behavior is preserved (tests still green)",
        "Where appropriate, shift a chunk between styles (e.g., a tangled procedural block to a small functional pipeline) and justify it",
        "A before/after write-up: complexity, coupling, and readability improvements, with concrete examples",
      ],
      checkpoints: [
        "Characterization tests exist before the first refactor and stay green throughout",
        "Each refactoring commit is small and behavior-preserving",
        "The public interface shrank and clarified; internals are hidden",
        "You can point to a specific future change that's now easy and was hard",
      ],
      hints: [
        "Refactoring means behavior stays identical — tests are what let you believe that. Write them first, even ugly ones.",
        "Rename relentlessly: if you need a comment to explain a name, the name is wrong.",
        "Reduce coupling by asking 'what does this really need to know?' — pass that, hide the rest.",
        "Don't refactor and add features in the same commit; separate the two so review and blame stay meaningful.",
      ],
      validation: [
        "Tests green at every commit (check the history)",
        "A classmate reads the after-version faster/with fewer questions than the before",
        "A new small feature is demonstrably easier to add post-refactor",
      ],
      solutionOutline: [
        "Refactoring is disciplined change: tests fix behavior, and each small step improves structure while keeping green — this is how large codebases stay malleable.",
        "Cohesion and coupling are the levers of changeability: high cohesion localizes understanding, low coupling localizes the blast radius of a change — the same dependency-direction concern you'll formalize in architecture.",
        "Styles (procedural/OO/functional) are tools: pick per problem (pipelines for transforms, objects for stateful entities, procedures for straight-line tasks) rather than by allegiance.",
      ],
      extensions: [
        "Measure cyclomatic complexity before/after with a tool",
        "Apply the same process to a piece of unfamiliar open-source code",
      ],
    },
    resources: {
      primary: [
        { ...R.reactLearn, note: "Its component-design guidance is a concrete, modern lesson in cohesion and interfaces." },
      ],
      alternatives: [
        { ...R.tsHandbook, note: "Type-driven design pushes you toward cohesive, well-interfaced code." },
        { ...R.missingSemester, note: "Its philosophy sections on writing maintainable code." },
      ],
    },
    masteryChecks: [
      "Identify three specific smells in a piece of code and propose targeted refactors",
      "Refactor safely under characterization tests, keeping behavior provably unchanged",
      "Justify a style choice (procedural/OO/functional) for a concrete problem",
    ],
  },
  {
    id: "se-testing-strategy",
    title: "Testing Strategy & Design for Testability",
    branch: "practice",
    stage: 4,
    required: true,
    difficulty: "advanced",
    estimatedHours: 10,
    summary:
      "Testing as a system, not scattered assertions: the testing pyramid, choosing unit vs. integration vs. end-to-end deliberately, test doubles (fakes, stubs, mocks) and their misuse, regression tests, and designing code to be testable in the first place — the seams and boundaries you've been building all along.",
    whyItMatters:
      "A test suite is an asset or a liability depending on its design: brittle, slow, or over-mocked tests get deleted; well-designed suites enable fearless change. Knowing what to test at which level — and how to design code so testing is easy — is a senior-level skill you can build now.",
    prerequisiteIds: ["se-clean-code", "py-testing-cli"],
    concepts: [
      "The testing pyramid: many fast unit tests, fewer integration, fewest e2e — and why",
      "Choosing the level: what each catches, what each costs",
      "Test doubles: fakes vs. stubs vs. mocks; the perils of over-mocking (testing the mock, not the code)",
      "Designing for testability: dependency injection, pure cores, seams (all recurring themes)",
      "Regression and characterization tests; tests as executable specification",
      "Test quality: reliability (no flakes), speed, clarity, and independence",
      "What not to test: framework internals, trivial getters, implementation details",
    ],
    practicalUses: [
      "Building suites that enable change instead of obstructing it",
      "Deciding fast where a given behavior should be tested",
      "Refactoring code to make a hard-to-test thing testable",
    ],
    lab: {
      title: "A Deliberate Test Strategy for the Full Stack",
      scenario:
        "For your issue tracker (frontend + backend), design and implement a coherent test strategy across levels: choose what belongs at unit/integration/e2e, use test doubles appropriately (and identify a place where mocking would be wrong), and refactor one hard-to-test piece to be testable.",
      outcome:
        "You can design a test strategy that maximizes confidence per unit of effort, use doubles judiciously, and refactor for testability — the difference between a suite that helps and one that hurts.",
      requirements: [
        "A written test strategy: what is tested at each level and why, for both frontend and backend",
        "Implement representative tests at each level: pure-logic unit tests, integration tests with a real test DB, and an e2e test through the API (and a component-level UI test)",
        "Use a test double correctly (e.g., fake the external notification service) and document one place where mocking would be a mistake (and test it for real instead)",
        "Find a hard-to-test piece (tangled I/O and logic), refactor to introduce a seam, and add the now-easy test",
        "Introduce a bug, confirm exactly one appropriate test catches it at the right level, and add it as a regression test",
        "Assess suite quality: run time, any flakes, independence (tests pass in any order)",
      ],
      checkpoints: [
        "The pyramid shape is respected (unit-heavy), justified by what each level catches",
        "The over-mocking pitfall is identified with a concrete example from your own suite",
        "The refactored piece is genuinely easier to test, and you can explain the seam",
        "Tests are order-independent and fast enough to run constantly",
      ],
      hints: [
        "Push logic into pure functions and I/O to the edges — then most tests are fast unit tests needing no doubles at all.",
        "Mock at architectural boundaries you own (your storage/transport seams), not deep internals. If a refactor breaks many mocks, they were testing implementation.",
        "e2e tests are precious but slow and flaky-prone: use a few for critical user journeys, not for edge cases (those belong lower).",
      ],
      validation: [
        "The full suite runs green, fast, and in random order",
        "The planted bug is caught by the right-level test, demonstrating your level choices",
        "A reviewer agrees the double usage is appropriate and the real-test choice is justified",
      ],
      solutionOutline: [
        "The pyramid optimizes confidence-per-second: unit tests are fast and precise, e2e tests are realistic but slow — the right mix catches most bugs cheaply and the critical journeys thoroughly.",
        "Testability is a design property, not an afterthought: the pure-core/edge-I/O structure and injectable seams you've built throughout are exactly what make testing easy — bad testability is a design smell.",
        "Test doubles isolate the unit under test from slow or nondeterministic collaborators; over-mocking inverts the value by coupling tests to implementation, so mock only at stable, owned boundaries.",
      ],
      extensions: [
        "Add property-based tests for a piece of logic and compare with example-based",
        "Add a mutation-testing pass to find weakly-tested code",
      ],
    },
    resources: {
      primary: [
        { ...R.pytestDocs, note: "For the mechanics of levels, fixtures, and doubles in Python." },
      ],
      alternatives: [
        { ...R.reactLearn, note: "For the frontend testing philosophy (behavior over implementation)." },
        { ...R.fastapiTutorial, note: "Its testing section for API-level and integration testing patterns." },
      ],
    },
    masteryChecks: [
      "Given a feature, decide what to test at each pyramid level and justify it",
      "Explain over-mocking with a concrete example and how to avoid it",
      "Refactor a hard-to-test function to introduce a seam and test it",
    ],
  },
  {
    id: "se-architecture",
    title: "Architecture: Boundaries, Dependencies & Patterns in Context",
    branch: "practice",
    stage: 5,
    required: true,
    difficulty: "advanced",
    estimatedHours: 12,
    summary:
      "Structuring systems at the module and service level: separating concerns into layers, controlling dependency direction (dependencies point toward stable abstractions), API contracts and versioning, and design patterns learned when a real problem summons them — never as a memorized catalog.",
    whyItMatters:
      "As systems grow, architecture — not clever functions — determines whether they stay changeable or collapse into a tangle. Understanding dependency direction and boundaries is what lets you swap a database, add a client, or replace a service without rewriting everything. Patterns learned in context stick; patterns memorized as trivia don't.",
    prerequisiteIds: ["se-testing-strategy", "db-backend-ops"],
    concepts: [
      "Separation of concerns and layering (you've built edge/core/storage repeatedly)",
      "Dependency direction: depend on abstractions; the dependency-inversion idea",
      "Boundaries and anti-corruption layers (your API client and storage protocols)",
      "API contracts and versioning; evolving interfaces without breaking consumers",
      "Cohesive modules with explicit, minimal interfaces",
      "Design patterns as named solutions to recurring problems — introduced when the problem appears",
      "Recognizing when architecture is over- or under-engineered for the context",
    ],
    practicalUses: [
      "Structuring a growing application so it stays changeable",
      "Making components swappable (mock↔real, one DB↔another)",
      "Communicating a system's shape to teammates",
    ],
    lab: {
      title: "Architect a Swappable System",
      scenario:
        "Refactor your issue tracker's backend toward clean boundaries: a domain core independent of frameworks and databases, with the web framework and the database as replaceable details behind interfaces — then prove it by swapping an implementation (e.g., a second storage backend) with zero changes to the core.",
      outcome:
        "You can structure a system so dependencies point the right way and details are swappable, and you can recognize which patterns genuinely help versus which add ceremony.",
      requirements: [
        "Identify layers: domain logic (rules), application (use cases), and infrastructure (web, DB) — and draw the dependency arrows",
        "Refactor so the domain core imports nothing from FastAPI or the DB driver; infrastructure depends on the core via interfaces (dependency inversion)",
        "Define a storage interface the core depends on; provide two implementations (e.g., PostgreSQL and in-memory) and swap them with only wiring changes",
        "Version an API change: introduce a breaking change behind a new version while keeping the old contract working, and document the migration",
        "Introduce exactly one design pattern because a real problem demanded it (e.g., a strategy for pluggable notification channels), and explain the problem it solved — resist adding others 'to be safe'",
        "A one-page architecture document with a dependency diagram and the rationale for each boundary",
      ],
      checkpoints: [
        "The domain core has zero framework/DB imports (grep to prove it)",
        "Swapping storage implementations touches only wiring, never the core",
        "Both API versions work simultaneously during the migration window",
        "The single pattern you added is justified by a concrete problem, not by pattern-collecting",
      ],
      hints: [
        "Dependency inversion: the core defines the interface it needs (Storage), and infrastructure implements it — so the arrow points from detail to abstraction, not the reverse.",
        "You've already done this in miniature (storage protocols, API client anti-corruption layer) — this scales the same idea to the whole app.",
        "Add a pattern only when duplication or a real variation point demands it. A strategy for two notification channels is justified; a factory for one thing is theater.",
        "Over-engineering is a real failure mode — match the architecture to the system's actual size and change rate.",
      ],
      validation: [
        "The storage swap is demonstrated live with the core untouched",
        "The versioning change keeps existing clients working (test both versions)",
        "A reviewer agrees the boundaries are justified and not over-built",
      ],
      solutionOutline: [
        "Layering with inward-pointing dependencies isolates the volatile (frameworks, databases) from the stable (domain rules), so details can change without disturbing the core — the deepest reason your code stays maintainable.",
        "Interfaces at boundaries make implementations swappable and testable; this is the generalization of every seam you've built (opaque pointers, protocols, injected sessions, mock APIs).",
        "Patterns are compressed solutions to recurring structural problems: valuable when the problem is present, ceremony when it isn't — which is why they must be learned in context.",
      ],
      extensions: [
        "Read about hexagonal/clean architecture and map your result onto it",
        "Identify one place you deliberately chose simplicity over a 'proper' pattern and defend it",
      ],
    },
    resources: {
      primary: [
        { ...R.fastapiTutorial, note: "Its bigger-applications and dependency sections show framework-level boundary structuring." },
      ],
      alternatives: [
        { ...R.reactLearn, note: "Frontend architecture (state placement, component boundaries) is the same discipline." },
        { ...R.ostep, note: "The OS is a masterclass in layered abstractions and boundaries." },
      ],
    },
    masteryChecks: [
      "Draw a system's layers and dependency arrows and identify a wrong-way dependency",
      "Design an interface that makes a component swappable and explain dependency inversion",
      "Name a pattern you used, the problem that summoned it, and when you'd not use it",
    ],
    securityNote:
      "Architecture defines trust boundaries: where untrusted input enters, where authorization is enforced, and what each component is allowed to reach. Clear boundaries make security review tractable; a tangled system hides the very seams where checks must live.",
  },
  {
    id: "se-ci-docker-deploy",
    title: "CI, Docker, Deployment & Documentation",
    branch: "practice",
    stage: 6,
    required: true,
    difficulty: "advanced",
    estimatedHours: 14,
    summary:
      "Getting software to users reliably and repeatedly: continuous integration with GitHub Actions (tests on every push), containers with Docker for reproducible environments (introduced now that you understand processes and networking), deployment fundamentals, and documentation that makes a project maintainable and handoff-able.",
    whyItMatters:
      "Code that isn't shipped and can't be reliably rebuilt isn't finished. CI catches breakage before it spreads, containers end 'works on my machine', and good documentation is what lets anyone (including future-you) run, understand, and extend a project. This closes the loop from idea to running software.",
    prerequisiteIds: ["se-architecture", "systems-processes"],
    concepts: [
      "Continuous integration: automated tests/lint/build on every push, fast feedback",
      "GitHub Actions: workflows, jobs, steps, caching, and matrix builds",
      "Containers vs. VMs; images, layers, and why containers are reproducible (built on process/namespace knowledge)",
      "Dockerfiles: building minimal, cached, secure images; docker-compose for multi-service local dev",
      "Deployment fundamentals: environments, config, and static vs. server hosting (this site is static!)",
      "Documentation: READMEs, runbooks, architecture notes, and handoff docs that actually help",
      "Reproducibility: pinned dependencies, lockfiles, and 'clone to running' in minimal steps",
    ],
    practicalUses: [
      "Every project gets tested automatically and rebuilt identically anywhere",
      "Deploying your full-stack app and this roadmap itself",
      "Handing a project to someone who can run it in ten minutes",
    ],
    lab: {
      title: "Ship the Issue Tracker for Real",
      scenario:
        "Take your full-stack issue tracker from 'runs locally' to 'shipped': a GitHub Actions pipeline running the full test suite and build on every push, a Dockerized backend + database via compose, a deployed instance (free tier), and documentation good enough that a stranger can run and understand it.",
      outcome:
        "You can build a CI pipeline, containerize a service reproducibly, deploy to the internet, and document a project for real handoff — the full path from code to production.",
      requirements: [
        "GitHub Actions workflow: on every push/PR, run linting, type-checking, and the full test suite (frontend and backend); fail the build on any failure; cache dependencies for speed",
        "A Dockerfile for the backend (minimal base, layered for cache efficiency, non-root user) and a docker-compose bringing up backend + PostgreSQL for one-command local dev",
        "Deploy the frontend as a static site (GitHub Pages — like this roadmap) and the backend to a free-tier host; document the deployment steps reproducibly",
        "Configuration via environment across environments; secrets injected securely (never in the image or repo)",
        "Documentation: a README (setup, scripts, architecture), a short runbook (how to deploy, how to roll back, where logs are), and a diagram",
        "Prove reproducibility: a fresh clone reaches a running local stack in a documented, minimal number of steps",
      ],
      checkpoints: [
        "A failing test blocks the pipeline (break one to prove it)",
        "docker-compose up brings the whole backend stack up from scratch",
        "The deployed app is reachable on the internet and functional",
        "A classmate follows your README from a clean machine and gets it running",
      ],
      hints: [
        "Order Dockerfile steps from least- to most-frequently-changed so dependency layers cache and only your code layer rebuilds — the same dependency-graph thinking as Make.",
        "Run containers as a non-root user; a container is a process with namespaces (your systems knowledge), not a security boundary you can be careless inside.",
        "Never bake secrets into an image or commit them — inject at runtime via environment/secret store. Images get shared and cached.",
        "Documentation you'll actually maintain is short and task-focused: how to run, how to deploy, how to debug — not an essay.",
      ],
      validation: [
        "CI is green on main and red when tests fail — verified both ways",
        "The compose stack and the deployed instance both work",
        "A stranger reproduces a running instance from your docs alone",
      ],
      solutionOutline: [
        "CI encodes your quality gates as automation that runs on every change, catching regressions immediately and keeping main releasable — the team-scale version of your local test discipline.",
        "Containers package an app with its environment into a reproducible image; because they're processes isolated by namespaces (systems-branch knowledge), they start fast and run identically everywhere, ending environment drift.",
        "Deployment plus documentation closes the loop: config-by-environment lets one build run anywhere, and honest docs make the system operable and transferable — the true definition of 'done'.",
      ],
      extensions: [
        "Add a CD step that deploys automatically on merge to main",
        "Add a container security scan to CI",
        "Multi-stage Docker build to shrink the final image",
      ],
    },
    resources: {
      primary: [
        { ...R.ghActions, note: "The workflow-syntax and quickstart docs — build the pipeline from these." },
        { ...R.dockerStart, note: "The official get-started path through images, compose, and best practices." },
      ],
      alternatives: [
        { ...R.fastapiTutorial, note: "Its deployment section for containerizing and running the service." },
        { ...R.missingSemester, note: "The CI/automation lecture for the underlying philosophy." },
      ],
    },
    masteryChecks: [
      "Write a CI workflow that gates merges on tests and type-checks",
      "Explain container reproducibility in terms of processes and images, and why secrets don't belong in them",
      "Document a project so a stranger runs it in under ten minutes",
    ],
    securityNote:
      "The pipeline and images are a supply-chain surface: pin actions and base images, never embed secrets, run as non-root, and scan dependencies. A compromised build step or leaked CI secret is a full breach — treat CI configuration as security-sensitive code.",
  },
];
