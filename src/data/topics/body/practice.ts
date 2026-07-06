import type { TopicBody } from "../../types";
import { R } from "../../resourceCatalog";


export const practiceBodies: Record<string, TopicBody> = {
  "se-requirements": {
    whyItMatters:
      "Most project failures are requirements failures, not coding failures — building the wrong thing correctly. The habit of pinning down 'done' before starting saves more time than any coding trick, and acceptance criteria become your tests and your definition of success.",
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
        { ...R.atlassianUserStories, guidance: "Read it fully (~15 min), then write this lab's user stories with its template before touching anything else. (An article as the primary is a deliberate exception — no free video teaches this better.)" },
      ],
      alternatives: [
        { ...R.googleTechWriting, guidance: "Acceptance criteria are technical writing — this short course sharpens exactly that." },
      ],
      practice: [
        { ...R.githubSkills, guidance: "The issues and project-planning courses model stories and criteria inside a real repository." },
      ],
      extra: [],
    },
    masteryChecks: [
      "Convert a one-line feature request into stories with testable acceptance criteria",
      "Write meaningful non-goals for a feature and explain their value",
      "Trace an acceptance criterion to the test that verifies it",
    ],
  },
  "se-git-collaboration": {
    whyItMatters:
      "Solo Git keeps your work safe; collaborative Git is how all real software is built. Pull requests are where code is reviewed, discussed, and improved, and conflict resolution is a routine skill that panics the unprepared — mastering the team workflow is table stakes for any engineering job.",
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
        { ...R.learnGitBranching, guidance: "Complete the 'Remote' lessons — push, pull, fetch, and rebase animated. This is the collaboration model, visualized." },
      ],
      alternatives: [
        { ...R.missingSemester, url: "https://missing.csail.mit.edu/2020/version-control/", guidance: "The Git lecture's data-model-first approach makes merge conflicts unscary." },
      ],
      practice: [
        { ...R.githubSkills, guidance: "Do 'Review pull requests' and 'Resolve merge conflicts' — inside real repositories." },
      ],
      extra: [
        { ...R.proGit, guidance: "Chapters on branching and distributed workflows — the canonical written treatment." },
      ],
    },
    masteryChecks: [
      "Scope, open, and self-review a well-described PR",
      "Resolve a real merge conflict and verify correctness afterward",
      "Give three substantive, constructive review comments on unfamiliar code",
    ],
  },
  "se-clean-code": {
    whyItMatters:
      "Code is read far more than written, and most professional work is changing existing code — so readability and low coupling directly determine how fast and safely a system can evolve. Refactoring skill (guarded by tests) is what keeps a codebase from ossifying into something no one dares touch.",
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
        { ...R.codeAestheticNesting, guidance: "Watch this, then his naming and abstraction videos (~40 min total) — then open your own worst code and start the lab." },
      ],
      alternatives: [
        { ...R.ousterhoutTalk, guidance: "The deeper design philosophy behind the same instincts (~1 h)." },
      ],
      practice: [],
      extra: [
        { ...R.refactoringGuru, guidance: "Put names to the smells you found and the refactorings you applied." },
      ],
    },
    masteryChecks: [
      "Identify three specific smells in a piece of code and propose targeted refactors",
      "Refactor safely under characterization tests, keeping behavior provably unchanged",
      "Justify a style choice (procedural/OO/functional) for a concrete problem",
    ],
  },
  "se-testing-strategy": {
    whyItMatters:
      "A test suite is an asset or a liability depending on its design: brittle, slow, or over-mocked tests get deleted; well-designed suites enable fearless change. Knowing what to test at which level — and how to design code so testing is easy — is a senior-level skill you can build now.",
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
        { ...R.ianCooperTDD, guidance: "Watch in full (~1 h). The thesis — test behaviors through public APIs, not implementation details — is this topic's core, and it will save you from brittle suites." },
      ],
      alternatives: [],
      practice: [],
      extra: [
        { ...R.testPyramid, guidance: "The essay version of the strategy, with concrete service examples." },
        { ...R.pytestDocs, guidance: "For the mechanics of levels, fixtures, and doubles in Python." },
        { ...R.fastapiTutorial, guidance: "Its testing section for API-level and integration testing patterns." },
      ],
    },
    masteryChecks: [
      "Given a feature, decide what to test at each pyramid level and justify it",
      "Explain over-mocking with a concrete example and how to avoid it",
      "Refactor a hard-to-test function to introduce a seam and test it",
    ],
  },
  "se-ci-docker-deploy": {
    whyItMatters:
      "Code that isn't shipped and can't be reliably rebuilt isn't finished. CI catches breakage before it spreads, containers end 'works on my machine', and good documentation is what lets anyone (including future-you) run, understand, and extend a project. This closes the loop from idea to running software.",
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
        { ...R.dockerFullCourse, guidance: "Watch through the docker-compose chapter (roughly the first two-thirds); the closing chapters are optional." },
      ],
      alternatives: [
        { ...R.dockerStart, guidance: "The official hands-on path through images, compose, and best practices — if you prefer doing over watching." },
      ],
      practice: [
        { ...R.githubSkills, guidance: "The GitHub Actions courses — build a real CI workflow inside a real repository." },
      ],
      extra: [
        { ...R.ghActions, guidance: "The workflow-syntax and quickstart docs — build the pipeline from these." },
        { ...R.fastapiTutorial, guidance: "Its deployment section for containerizing and running the service." },
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
};
