import type { TopicBody } from "../../types";
import { R } from "../../resourceCatalog";

/**
 * Software Architecture topic bodies. The running system for every lab is the
 * learner's full-stack issue tracker (React + FastAPI + PostgreSQL, tested,
 * CI'd, and deployed in the practice phase). Each lab from stage 2 onward
 * requires a mini-ADR, so decision-recording is practiced continuously before
 * it is formalized in arch-evolution.
 */
export const archBodies: Record<string, TopicBody> = {
  "arch-modularity": {
    whyItMatters:
      "Every system you'll ever maintain got hard to change the same way: modules that know too much about each other. Cohesion, coupling, and dependency direction are the vocabulary for diagnosing that rot precisely — and the levers for reversing it. This is the foundation the rest of the branch builds on: you cannot draw a boundary (next topic) until you can see which dependencies are pointing the wrong way.",
    concepts: [
      "Separation of concerns: one module, one reason to change",
      "Cohesion (how much a module's parts belong together) and coupling (how much modules know about each other) as properties you can inspect, not vibes",
      "Deep modules: small interfaces hiding substantial implementations — and why shallow pass-through layers add cost without value",
      "Dependency direction: volatile details depend on stable policy, never the reverse",
      "Information leakage: when a design decision (a format, a schema, a library) is known by more modules than necessary",
      "The module dependency graph: extracting it from real code, spotting cycles and god modules",
      "Afferent/efferent coupling as a cheap metric — and its limits",
    ],
    practicalUses: [
      "Diagnosing why a 'small' change touches nine files",
      "Reviewing a PR for structural damage, not just correctness",
      "Deciding where a new feature's code should live before writing it",
    ],
    lab: {
      title: "Audit the Tracker's Module Graph",
      scenario:
        "Your issue tracker has been growing since the practice phase, and some changes have started to feel harder than they should. Before touching any architecture, get evidence: extract the backend's real module dependency graph, find the worst coupling problem (a cycle, a god module, or a wrong-way dependency), and fix exactly that one problem — measuring before and after. (If your tracker diverged from the milestone spec, any project of yours with 10+ modules works the same way.)",
      outcome:
        "You can extract a dependency graph from real code, name the specific coupling problem it shows using precise vocabulary, and improve it with a measured, test-protected refactor.",
      requirements: [
        "Generate the import/dependency graph of your backend (a small script walking imports is fine; so is an off-the-shelf tool) and render it visibly",
        "Annotate the graph: mark each module's role (domain rules, application flow, infrastructure) and highlight every dependency pointing from stable code toward volatile code",
        "Identify and document the single worst problem: a cycle, a god module imported by everything, or a domain module importing infrastructure",
        "Fix that one problem with a refactor protected by your existing test suite — no behavior change",
        "Re-generate the graph and record before/after: dependency counts on the affected modules and the number of files a representative change now touches",
        "Write a half-page note explaining the fix in cohesion/coupling/dependency-direction vocabulary",
      ],
      checkpoints: [
        "The dependency graph exists and is readable (nodes grouped by layer/role)",
        "The chosen problem is described precisely — which modules, which direction, why it hurts",
        "Tests pass before and after; the refactor changed structure, not behavior",
        "The before/after measurements show the coupling actually decreased",
      ],
      hints: [
        "In Python, a 30-line script using ast.walk over your source tree collecting Import/ImportFrom nodes gives you the graph; render it with graphviz or even indented text.",
        "Look for the module everything imports (a 'utils' or 'models' catch-all is the usual suspect) and for any import of the web framework or DB driver from code that makes business decisions.",
        "Fix direction problems by moving the decision, not by re-routing the import: if domain code imports infrastructure to get a value, pass the value in instead.",
        "Resist fixing everything. The lab is one measured improvement; the branch gives you six more labs for the rest.",
      ],
      validation: [
        "A reviewer (or you, a week later) can locate the fixed problem on both graphs without help",
        "A deliberately chosen 'typical change' (e.g., add a field to issues) touches fewer files than before, and you can say why",
      ],
      solutionOutline: [
        "The graph makes structure visible: most codebases have never been looked at this way, and the worst problems (cycles, god modules, wrong-way dependencies) are obvious once drawn.",
        "The fix follows dependency direction: stable policy (what an issue is, who may close it) must not import volatile detail (FastAPI, psycopg); inverting one such edge usually dissolves the cycle too.",
        "Measurement keeps the exercise honest — 'feels cleaner' is not a result; 'the issues module went from 11 dependents to 4 and the field-add change touched 3 files instead of 7' is.",
      ],
      extensions: [
        "Add the graph script to CI and fail the build on new cycles",
        "Compute afferent/efferent coupling per module and track it over the rest of the branch",
      ],
    },
    resources: {
      primary: [
        {
          ...R.ousterhoutTalk,
          guidance:
            "Watch in full (~1 h) before the lab: deep modules, information leakage, and 'complexity is anything that makes code hard to understand or change'. Then run the lab and find his warnings in your own graph.",
        },
      ],
      alternatives: [
        {
          ...R.codeAestheticNesting,
          guidance:
            "His short animated videos on abstraction and dependencies cover the same instincts at function scale, if a one-hour talk is a hard sell.",
        },
      ],
      practice: [],
      extra: [
        {
          ...R.refactoringGuru,
          guidance:
            "Use the code-smells catalog to put names on what your graph shows; read patterns as vocabulary, not prescriptions.",
        },
      ],
    },
    masteryChecks: [
      "Draw a module graph for a system you know, mark the layers, and point to every wrong-way dependency",
      "Explain deep vs. shallow modules with one example of each from your own code",
      "Given a change request, predict which modules it should touch — and diagnose the coupling when it touches more",
    ],
  },

  "arch-boundaries": {
    whyItMatters:
      "The single highest-leverage architectural move is a boundary: a domain core that owns the rules and knows nothing about frameworks, databases, or the web, connected to them through interfaces it defines. It's what makes systems testable without infrastructure, migratable without rewrites, and comprehensible without reading everything. You've built seams before (storage protocols, injected sessions, mock APIs); this scales the same idea to the whole application — and proves it works by swapping a real implementation.",
    concepts: [
      "Layers with inward-pointing dependencies: domain rules at the center, application flow around it, infrastructure at the edge",
      "Ports: interfaces the core defines for what it needs (storage, notification, clock) — named for intent, not technology",
      "Adapters: infrastructure implementations of ports; swappable because the core never imports them",
      "Dependency inversion: the arrow points from detail to abstraction — the mechanical trick that makes boundaries real",
      "Anti-corruption at the edge: translating external shapes (HTTP payloads, DB rows) into domain terms before they cross inward",
      "Design patterns as responses to forces: a strategy when behavior genuinely varies, a repository when storage must be swappable — never as ceremony",
      "Right-sizing: recognizing over-engineering; a boundary earns its keep only where change or testing pressure exists",
    ],
    practicalUses: [
      "Testing business rules in milliseconds with no database or web server",
      "Swapping infrastructure (a cache for a table, one provider for another) with wiring-only changes",
      "Letting two people work on 'the same feature' without touching the same files",
    ],
    lab: {
      title: "Architect a Swappable Core",
      scenario:
        "Refactor your issue tracker's backend toward clean boundaries: a domain core independent of FastAPI and PostgreSQL, with the web framework and the database as replaceable details behind ports — then prove it by adding a second storage implementation (in-memory) that the entire core cannot tell apart from the real one. Record the decision as your first mini-ADR. (Tracker diverged? Any CRUD service with rules — who may close an issue, what transitions are legal — works identically.)",
      outcome:
        "You can structure a system so dependencies point inward and details are swappable, justify each boundary from a concrete force, and recognize which patterns genuinely help versus which add ceremony.",
      requirements: [
        "Identify the layers — domain rules, application use-cases, infrastructure (web, DB) — and draw the intended dependency arrows before refactoring",
        "Refactor until the domain core imports nothing from FastAPI or the DB driver; prove it mechanically (a grep or your lab-1 graph script in CI)",
        "Define a storage port the core owns; provide two adapters (PostgreSQL and in-memory) that pass one shared contract-test suite",
        "Swap adapters with only wiring/configuration changes — zero edits inside the core",
        "Introduce exactly one design pattern because a real force demanded it (e.g., a strategy for pluggable notification channels) and name the force; resist adding others 'to be safe'",
        "Write a one-page mini-ADR: the boundary you chose, the alternatives you rejected, and the consequences you accept",
      ],
      checkpoints: [
        "The dependency check proves the core has zero framework/DB imports",
        "Both storage adapters pass the same contract tests",
        "The swap is demonstrated live: same test suite, different adapter, wiring-only diff",
        "The mini-ADR states context, decision, and consequences in under a page",
      ],
      hints: [
        "Dependency inversion, concretely: the core defines `Storage` (a Protocol/ABC), infrastructure implements it, and main() wires them — the arrow now points from psycopg-land toward the core.",
        "Write the contract tests against the port, then run the suite once per adapter; the in-memory adapter doubles as your fast test double forever after.",
        "Translate at the edge: FastAPI request models and DB rows stop at the adapter; the core speaks only its own types. If a Pydantic import appears in the core, the boundary leaked.",
        "The old rule of thumb stands: a factory for one thing is theater; a strategy for two real notification channels is justified.",
      ],
      validation: [
        "A reviewer can run the core's tests with no database running and both adapters' contract tests with one command each",
        "The one pattern you added is defensible in one sentence naming the force that summoned it",
      ],
      solutionOutline: [
        "Layering with inward dependencies isolates the volatile (frameworks, drivers) from the stable (domain rules), so details can change without disturbing the core — the deepest reason systems stay maintainable.",
        "Ports-and-adapters is dependency inversion made physical: the core owns the interface, infrastructure conforms to it, and the contract tests define exactly what any future adapter must honor.",
        "The mini-ADR is the habit that matters: every boundary is a bet, and recording the context and accepted costs is what lets a future maintainer (or future you) re-evaluate it honestly.",
      ],
      extensions: [
        "Read about hexagonal/clean architecture and map your result onto its terms — note where you deliberately did less",
        "Add a third adapter (SQLite file) and measure how long it takes now that the contract tests exist",
      ],
    },
    resources: {
      primary: [
        {
          ...R.cockburnHexagonal,
          guidance:
            "Watch the full keynote (~45 min) before refactoring: the pattern's inventor on why the core defines the ports and the outside world merely plugs in. Sketch your tracker's hexagon — ports on the inside edge, adapters outside — before writing code.",
        },
      ],
      alternatives: [
        {
          ...R.ianCooperTDD,
          guidance:
            "A different angle on the same boundary: test behaviors at the port, not implementation details inside — watch if your refactor keeps breaking tests that shouldn't care.",
        },
      ],
      practice: [],
      extra: [
        {
          ...R.fastapiTutorial,
          guidance:
            "Its 'bigger applications' and dependency-injection sections show the framework-side wiring for exactly this structure.",
        },
        {
          ...R.ostep,
          guidance:
            "The OS is a masterclass in layered abstraction: system calls are ports, drivers are adapters. Skim any chapter's interface/mechanism split with your architect hat on.",
        },
      ],
    },
    masteryChecks: [
      "Draw your system's layers and dependency arrows and defend each boundary from a concrete force (test speed, planned change, team split)",
      "Design a port that makes a component swappable and explain how dependency inversion reverses the import arrow",
      "Name a pattern you used, the force that summoned it, and a situation where using it would be over-engineering",
    ],
    securityNote:
      "Architecture defines trust boundaries: where untrusted input enters, where authorization is enforced, and what each component may reach. A clean edge is where validation and authentication checks live exactly once; a tangled system hides the very seams where those checks must sit, which is why security reviews of layered systems are tractable and reviews of tangles are not.",
  },

  "arch-data-contracts": {
    whyItMatters:
      "The moment an API has one consumer you don't control — your own mobile app counts — every change becomes a negotiation with the past. Contracts, versioning, and data ownership are how mature systems keep moving: you'll break an API deliberately and ship the break safely, and migrate a schema without stopping the system. This is also where 'who owns this data?' stops being philosophical: shared writable data is the tightest coupling there is.",
    concepts: [
      "An API as a promise: what compatibility means for requests, responses, and semantics",
      "Additive evolution first: the changes that never break anyone, and Postel's law at the boundary",
      "Versioning strategies — URL, header, date-pinned (Stripe-style) — and the maintenance cost each one buys you",
      "Deprecation as a process: telemetry on old-version usage, warnings, sunset dates",
      "Data ownership: one writer per fact; why two services writing one table couples them worse than any import",
      "Expand/migrate/contract: schema change as three deploys, so the system never stops",
      "Consumer-driven thinking: contract tests that fail when you break a client you forgot about",
    ],
    practicalUses: [
      "Shipping a breaking API change while old mobile clients keep working",
      "Migrating a production schema with zero downtime",
      "Deciding which service owns a new fact — before two of them fight over it",
    ],
    lab: {
      title: "Break the API Without Breaking Anyone",
      scenario:
        "Your issue tracker's API has a real consumer: its own frontend (and the React Native companion, if you built it). Product wants a genuinely breaking change — split the issue `assignee` string into a structured `assignees` list with roles. Ship it behind versioning while the old contract keeps working, then migrate the underlying schema with the expand/migrate/contract dance, and retire the old version deliberately. Record the versioning strategy as a mini-ADR. (No tracker? Any API of yours with a UI consumer works; the breaking change just needs to alter a response shape.)",
      outcome:
        "You can evolve a published contract and its underlying schema without an outage or a flag-day client update, and you can justify the versioning strategy you chose against its alternatives.",
      requirements: [
        "Write the contract down first: the old response shape, the new one, and why the change is genuinely breaking (not additive)",
        "Choose and implement a versioning mechanism (URL, header, or pinned default) — the old and new contracts must work simultaneously against one codebase",
        "Add a contract test per version that fails if that version's shape drifts",
        "Migrate the schema expand→migrate→contract: add the new structure, backfill, dual-write or translate at the boundary, and only then drop the old column — the API must stay up throughout",
        "Instrument usage of the old version (a counter or log is enough) and write the deprecation plan: warning, sunset date, removal criteria",
        "Mini-ADR: the strategy you chose, the two you rejected, and the maintenance cost you accepted",
      ],
      checkpoints: [
        "Both versions answer correctly at the same time, verified by contract tests",
        "The schema migration completes with the test suite green at every intermediate step",
        "Old-version usage is measurable, and the deprecation plan names its removal condition",
        "The translation between versions lives in one place (the adapter/edge), not scattered through the core",
      ],
      hints: [
        "Version translation is an adapter concern: the core speaks only the new domain shape; the old version's adapter converts at the edge. Your arch-boundaries structure makes this a small change — notice that.",
        "Expand/contract means the DB is briefly redundant on purpose: new column added and backfilled while the old still exists. The scary step (drop) becomes safe because nothing reads the old column anymore — prove that with the usage counter.",
        "Date-pinned versioning (read the Stripe article) is elegant but costs a translation layer per change; URL versioning is blunt but obvious. For one consumer, blunt is often honest.",
        "Write the failing contract test for the OLD version first — it's the client you're promising not to break.",
      ],
      validation: [
        "A client pinned to the old version survives the entire migration unchanged, demonstrated end-to-end",
        "A reviewer can follow the three schema phases in your migration files and say why each step was safe",
      ],
      solutionOutline: [
        "Compatibility is defined from the consumer's seat: a change is breaking if any existing client misbehaves. Contract tests per version turn that definition into something CI enforces.",
        "Versioning at the edge keeps the core clean: one internal model, thin translators per published version — the cost of each supported version is visible and bounded.",
        "Expand/migrate/contract works because every intermediate state is fully functional; downtime-free migration is just refusing to ever need two changes to be simultaneous.",
      ],
      extensions: [
        "Add a CI job that diffs the OpenAPI spec against the committed one and fails on undeclared breaking changes",
        "Design (on paper) how ownership would split if issue comments moved to a separate service — who owns which fact, and what API replaces the shared table",
      ],
    },
    resources: {
      primary: [
        {
          ...R.infoqApiEvolution,
          guidance:
            "Watch the talk (transcript on the same page if you prefer reading): evolution-first thinking, what actually constitutes a break, and the costs of each versioning escape hatch. Then decide your lab strategy — and defend it in the mini-ADR.",
        },
      ],
      alternatives: [
        {
          ...R.stripeVersioning,
          guidance:
            "The classic engineering write-up of date-based rolling versions: read after the talk to see one strategy pushed to its logical extreme, and note what it costs Stripe to run.",
        },
      ],
      practice: [],
      extra: [
        {
          ...R.pgTutorial,
          guidance:
            "The ALTER TABLE and transaction sections are your expand/contract toolbox — check what locks each step takes.",
        },
      ],
    },
    masteryChecks: [
      "Classify five API changes as breaking or additive and defend each classification from the consumer's perspective",
      "Plan an expand/migrate/contract schema change and state why every intermediate deploy is safe",
      "Explain data ownership: why one writer per fact, and what goes wrong when two services share a writable table",
    ],
    securityNote:
      "Version sprawl is attack surface: forgotten old API versions keep old bugs and old validation gaps alive long after the main path is fixed. A deprecation process with usage telemetry and real removal dates is a security control, not just hygiene.",
  },

  "arch-system-shapes": {
    whyItMatters:
      "'Should we do microservices?' is the wrong question, and this topic teaches the right one: what shape does this system, this team, and this failure budget actually need? Distribution buys independent deployment and scaling at the price of latency, partial failure, and operational load — you know those costs first-hand from the systems branch. Most systems are best served by a well-modularized monolith with carefully chosen asynchronous seams; the skill is choosing, and justifying, where those seams go.",
    concepts: [
      "The modular monolith: enforced module boundaries inside one deployable — most of the benefit, little of the cost",
      "What distribution really costs: network latency, partial failure, serialization, versioned deploys, on-call surface",
      "When services earn their keep: independent scaling, independent deploy cadence, team autonomy, isolation of risk",
      "Synchronous vs. asynchronous coupling: what a queue actually decouples (availability, rate) and what it doesn't (contracts)",
      "The four 'event-driven's: notification, event-carried state transfer, event sourcing, CQRS — and why conflating them hurts",
      "Delivery realities: at-least-once delivery, duplicates, ordering, and the consumer discipline they force",
      "Extraction criteria: how to tell one concern genuinely wants out of the monolith",
    ],
    practicalUses: [
      "Arguing a system's shape from requirements instead of fashion",
      "Extracting one genuinely asynchronous concern without destabilizing the rest",
      "Reading a vendor's 'event-driven' diagram and knowing which of the four meanings they intend",
    ],
    lab: {
      title: "One Seam, Deliberately",
      scenario:
        "Your issue tracker sends notifications (email or webhook) synchronously inside the request path — slow, failure-coupled, and rate-limited by someone else's server. Extract exactly that one concern behind a queue as an asynchronous worker, and write the ADR arguing why notifications leave the monolith and everything else stays. The ADR matters as much as the code. (Tracker diverged? Any request-path side effect — image resizing, report generation — is the same exercise.)",
      outcome:
        "You can identify a concern that genuinely wants asynchronous extraction, implement the seam with a queue and worker, and argue the shape decision — including why the rest stays a monolith — in writing.",
      requirements: [
        "Profile first: measure what the synchronous notification costs the request path (latency added, failure coupling) and record it",
        "Introduce a queue (Redis, RabbitMQ, or PostgreSQL LISTEN/NOTIFY — justify the pick) and move notification sending into a separate worker process",
        "The enqueue must go through a port in your domain core; the queue technology is an adapter, per arch-boundaries",
        "Handle delivery reality: the worker must survive duplicate messages (idempotent handling) and its own crash mid-message",
        "Measure after: request latency with the seam in place, and behavior when the notification target is down (requests must not fail)",
        "Write the shape ADR: why this concern is async, why the rest remains a modular monolith, and the extraction criteria a future concern must meet",
      ],
      checkpoints: [
        "Before/after latency numbers exist and the request path no longer waits on the external service",
        "Killing the worker loses no notifications (they drain when it returns); duplicates don't double-send visibly",
        "The core still has zero infrastructure imports — the queue is behind a port",
        "The ADR argues from measured forces, not from fashion, and names criteria for the next extraction",
      ],
      hints: [
        "This is event notification (Fowler's first meaning): the event says 'issue assigned', the worker decides what to do. You are not doing event sourcing — notice how much simpler that keeps things.",
        "At-least-once delivery means your worker WILL see duplicates. A processed-message id table (or idempotency key on the send) is the standard answer — you'll go deeper next topic.",
        "PostgreSQL as a queue (a jobs table + SKIP LOCKED, or LISTEN/NOTIFY) is a legitimate, boring choice for one worker — one less moving part is an architectural argument, not a cop-out.",
        "The ADR's strongest section is 'what would change our mind': list the signals (queue depth, deploy contention, team growth) that would justify the next extraction.",
      ],
      validation: [
        "A demo: requests stay fast and successful while the notification target is unreachable, and queued notifications deliver when it recovers",
        "A reviewer accepts the ADR's reasoning or argues with its forces — not with its buzzwords",
      ],
      solutionOutline: [
        "The seam works because notifications are fire-and-forget by nature: no caller awaits their result, so availability-coupling them to the request path was pure cost. That's the extraction criterion generalized: async seams belong where no one is waiting.",
        "The queue decouples availability and rate but not contracts — the message schema is now a published API between monolith and worker, subject to everything from arch-data-contracts.",
        "Keeping the rest a modular monolith is the deliberate half of the lab: with boundaries from arch-boundaries enforced inside one deployable, you retain refactorability and single-deploy simplicity that services would forfeit.",
      ],
      extensions: [
        "Add a dead-letter path for messages that fail repeatedly, with visibility into it",
        "Sketch (paper only) the full event-carried-state-transfer version and list what new problems it would buy you",
      ],
    },
    resources: {
      primary: [
        {
          ...R.simonBrownModularMonoliths,
          guidance:
            "Watch in full before the lab: enforced modularity inside one deployable, and why 'we can't build a structured monolith' dooms the microservices version too. Map his module arguments onto your tracker's graph from lab 1.",
        },
      ],
      alternatives: [
        {
          ...R.fowlerEventDriven,
          guidance:
            "Watch (~50 min) before or right after extracting the seam: which of the four event-driven patterns you just used (notification), and what the other three would cost.",
        },
      ],
      practice: [],
      extra: [
        {
          ...R.mit6824,
          guidance:
            "Lecture 1 is the honest price list of distribution: partial failure, unreliable networks, and why distributed systems are a last resort. Watch when tempted to split further.",
        },
      ],
    },
    masteryChecks: [
      "Given a feature list and team size, argue a shape (monolith, modular monolith, services, async seams) from forces and accept the costs out loud",
      "Distinguish the four meanings of event-driven and pick the right one for a stated problem",
      "State your extraction criteria: the measurable signals that would justify splitting the next concern out",
    ],
  },

  "arch-reliability": {
    whyItMatters:
      "The seam you built last topic created your first partial-failure zone: the tracker now keeps working when a dependency doesn't — if you designed for it. Real systems spend their lives in that zone. Timeouts, safe retries, idempotency, and graceful degradation are the difference between 'one dependency hiccupped' and 'everything is down'; and untested failure paths are failure paths that don't work. This topic makes failure a first-class, tested behavior of your system.",
    concepts: [
      "Timeouts as the first law: every remote call has one, chosen from the caller's budget, not the library default",
      "Retries that help vs. retry storms that amplify outages: bounded attempts, exponential backoff, jitter",
      "Idempotency: designing operations so retrying is always safe — keys, natural idempotency, dedup tables",
      "Failure modes of a call: slow, down, erroring, lying — and why 'slow' is the most dangerous",
      "Graceful degradation: deciding in advance what the system still does when each dependency is gone",
      "Backpressure and load shedding: refusing work early beats collapsing late",
      "Fault injection: testing failure paths deliberately (kill the DB, black-hole the API) instead of discovering them",
    ],
    practicalUses: [
      "Surviving a third-party outage with a degraded feature instead of a dead site",
      "Making 'just retry it' safe instead of a duplicate-payment generator",
      "Turning a 2 a.m. cascade into a bounded, alarmed, self-recovering blip",
    ],
    lab: {
      title: "Make the Seam Survive",
      scenario:
        "Harden last topic's notification pipeline and the tracker's other remote edges until failure is boring: timeouts everywhere, retries with backoff and idempotency, a degraded mode, and a scripted failure drill — kill the database mid-request, black-hole the notification target, crash the worker — with the system's observed behavior written down. Record the failure policy as a mini-ADR. (Any app of yours with a DB plus one external call can run the same drill.)",
      outcome:
        "You can enumerate a system's failure modes, implement the standard defenses, and prove with tests and a live drill that the system degrades and recovers the way you designed.",
      requirements: [
        "Inventory every remote call (DB, queue, notification target, anything else) and give each an explicit timeout with a one-line justification",
        "Implement retry with exponential backoff and jitter for the notification send; cap attempts and route exhausted messages to a visible dead-letter state",
        "Make retried operations idempotent end-to-end: an idempotency key (or dedup record) proves a duplicate send attempt cannot notify twice",
        "Define and implement one degraded mode (e.g., DB read replica down → read-only mode, or notification queue full → accept-and-warn) — a deliberate behavior, not an error page",
        "Write failure tests: fault-injecting unit/integration tests that assert timeout, retry, and dedup behavior",
        "Run the scripted drill (kill DB mid-request; black-hole the target; kill the worker mid-message) and write down observed vs. designed behavior, plus recovery steps",
      ],
      checkpoints: [
        "No remote call remains with a default/infinite timeout",
        "The retry policy is visible in logs during the drill: backoff spacing, capped attempts, dead-letter arrival",
        "The duplicate-attempt test proves idempotency at the observable-effect level (no double notification)",
        "The drill report shows the degraded mode engaging and the system recovering without manual data repair",
      ],
      hints: [
        "Pick timeouts from the caller's budget: if the request path must answer in 2 s, no dependency inside it may get more than a fraction of that. Sum the worst case — it must fit.",
        "Retrying a non-idempotent operation is how systems double-charge people. The order is always: make it idempotent, THEN retry it.",
        "Jitter is not optional garnish: synchronized retries from many callers are a self-inflicted DDoS (the SRE cascading-failures chapter shows the graph).",
        "For the drill, 'kill the DB' can be as simple as stopping the container while a request loop runs — the point is watching, not tooling.",
      ],
      validation: [
        "The failure tests run in CI and fail if someone removes a timeout or breaks dedup",
        "A reviewer following your drill script sees the same designed behaviors you documented",
      ],
      solutionOutline: [
        "Reliability is designed at the edges: every remote call is a place the world can hurt you, so every one gets a timeout, a retry policy (or a reason it has none), and a failure behavior chosen on purpose.",
        "Idempotency is what makes the rest legal: once a retry cannot double an effect, aggressive-but-bounded retrying with backoff and jitter turns transient failure into invisible noise instead of amplification.",
        "The drill is the test of the design, not the code: systems behave in failure the way they were designed to — or reveal that nobody designed it. Writing observed-vs-designed closes that loop.",
      ],
      extensions: [
        "Add a simple circuit breaker around the notification target and show it opening/closing in the drill",
        "Add queue-depth monitoring and a load-shedding threshold — refuse new notifications before the queue eats memory",
      ],
    },
    resources: {
      primary: [
        {
          ...R.bogardSixLines,
          guidance:
            "Watch in full before the lab: six lines calling a payment API, an email service, and a queue — and every way they betray you. List which of his failure modes your tracker shares; the lab fixes them.",
        },
      ],
      alternatives: [],
      practice: [],
      extra: [
        {
          ...R.sreBookCascading,
          guidance:
            "Read after the lab: how overload feeds back into collapse at Google scale, and why your backoff-and-jitter homework is what prevents it. Free online.",
        },
      ],
    },
    masteryChecks: [
      "Enumerate the failure modes of a remote call and the defense for each, including why 'slow' is worse than 'down'",
      "Design an idempotent version of a naturally non-idempotent operation and prove a retry is safe",
      "Choose a timeout budget for a three-dependency request path and defend the numbers",
    ],
    securityNote:
      "Availability is a security property, and failure handling is where attackers probe: unbounded retries and missing timeouts turn a small malicious load into an outage, and error paths often skip the authorization checks the happy path enforces. Test your failure paths with the same suspicion you test your inputs.",
  },

  "arch-observability": {
    whyItMatters:
      "You've now built a system with a worker, a queue, retries, and degraded modes — and without instrumentation, all of it is invisible until a user complains. Observability is how running systems answer questions: structured logs tell you why, metrics tell you what and how much, traces tell you where. And it changes how you do performance work: measurement first, then the fix, then proof — the same empirical discipline as your Big-O work, applied to a live system.",
    concepts: [
      "Structured logging: events as key-value data with consistent fields, not prose strings you'll regret grepping",
      "Correlation: one id per request flowing through API, queue, and worker — the thread that connects everything",
      "Metrics: counters, gauges, histograms; why latency lives in percentiles and never in averages",
      "Traces and spans: one request's journey across process boundaries, and context propagation",
      "The four golden signals: latency, traffic, errors, saturation — the minimum dashboard for any service",
      "Alerting on symptoms users feel, not on every cause; alert fatigue as a real failure mode",
      "Measure-first performance: profile, find the actual bottleneck, fix it, prove the delta — never optimize on suspicion",
    ],
    practicalUses: [
      "Answering 'why was this request slow?' with a trace instead of a shrug",
      "Watching a deploy's error rate instead of waiting for bug reports",
      "Killing a performance myth with a histogram",
    ],
    lab: {
      title: "See Inside, Then Make It Faster",
      scenario:
        "Instrument the issue tracker end to end — structured logs with a correlation id that survives the queue hop, golden-signal metrics, and a health endpoint — then use the telemetry to find the system's one real bottleneck under load, fix it, and prove the improvement with before/after numbers. The proof is the deliverable. (Any deployed app of yours works; the queue hop just makes correlation more interesting.)",
      outcome:
        "You can instrument a multi-process system so a single request is followable across boundaries, and you can run an honest measure→fix→prove performance loop on live telemetry.",
      requirements: [
        "Replace print/naive logging with structured logs (JSON or key-value) carrying: timestamp, level, event name, correlation id, and relevant domain ids",
        "Propagate a correlation id from HTTP request through the queue message into the worker's logs — one grep tells one request's whole story",
        "Expose metrics for the golden signals: request latency histogram, request/notification counters, error counters, queue depth as saturation",
        "Add a health endpoint reporting real readiness (DB reachable, queue reachable), suitable for a deploy check",
        "Generate load (a simple script is fine), identify the worst latency contributor from telemetry — not from intuition — and write the hypothesis down before fixing",
        "Fix the bottleneck and publish before/after: same load, p50/p95/p99 latency, with the numbers in your lab report and the decision in a mini-ADR if the fix changed structure",
      ],
      checkpoints: [
        "One correlation id retrieves a request's full story across API and worker logs",
        "The golden signals exist and move visibly under generated load",
        "The bottleneck hypothesis was written before the fix — and the telemetry confirmed or corrected it",
        "The before/after percentiles show a real improvement under identical load",
      ],
      hints: [
        "Python's logging supports structured output with a small formatter, and contextvars carries the correlation id across async boundaries without threading it through every signature.",
        "The id crosses the queue as message metadata — the worker adopts it as its own log context. That single design choice is most of 'distributed tracing' in miniature.",
        "Percentiles, always: an average of 80 ms hides the 3-second p99 your users scream about. Histograms first, then talk.",
        "Classic first bottlenecks in this stack: N+1 queries on the issue list, a missing index revealed by EXPLAIN, or synchronous work that belongs in the worker. Let the telemetry pick, not this hint.",
      ],
      validation: [
        "A reviewer picks any request id from your load run and reconstructs its path from logs alone",
        "The improvement replicates: rerunning the load script reproduces the after-numbers within noise",
      ],
      solutionOutline: [
        "Structured logs with correlation ids turn logging from prose into a queryable dataset — the difference between reading about the system and asking it questions.",
        "The golden signals are the minimum complete picture: latency and errors are what users feel, traffic is context, saturation (queue depth here) is the early warning the others lack.",
        "Measure→hypothesize→fix→re-measure is the entire discipline of performance work; the histogram protects you from optimizing the wrong thing, and the written hypothesis keeps you honest about whether you understood the system or got lucky.",
      ],
      extensions: [
        "Wire the metrics into a real dashboard (Grafana or similar) and recreate the golden signals visually",
        "Add OpenTelemetry spans over the same paths and compare what traces give you beyond correlated logs",
      ],
    },
    resources: {
      primary: [
        {
          ...R.otelCourse,
          guidance:
            "Watch the concepts sections first (observability, tracing, context propagation, metrics — the first half); the tool-specific backend parts are optional. Then implement the lab with plain structured logs and metrics before reaching for the full toolkit.",
        },
      ],
      alternatives: [
        {
          ...R.coreyLogging,
          guidance:
            "If the course moves too fast, this pair of videos rebuilds Python logging from basics — watch, then upgrade the format to structured key-value output as the lab requires.",
        },
      ],
      practice: [],
      extra: [
        {
          ...R.sreBookMonitoring,
          guidance:
            "Read Ch. 6 after instrumenting: the four golden signals and symptom-based alerting, from the team that named them. Check your dashboard against theirs. Free online.",
        },
      ],
    },
    masteryChecks: [
      "Design the log schema and correlation strategy for a two-process system and show how one request is reconstructed",
      "Explain p50/p95/p99 to someone who only knows averages, with a case where the average lies",
      "Run a measure→fix→prove loop on a real bottleneck and present the before/after honestly, including what you first guessed wrong",
    ],
    securityNote:
      "Logs are a breach's favorite dataset: never log secrets, tokens, or raw personal data — structured logging makes field-level redaction enforceable. The same telemetry that debugs performance also detects abuse (error-rate spikes, one client's anomalous traffic), so observability and security monitoring are one investment.",
  },

  "arch-evolution": {
    whyItMatters:
      "Architecture isn't a phase that ends; it's a stream of decisions made while the system runs. The engineers people trust with big systems are the ones who write decisions down (with their context, so they can be revisited honestly), keep documentation that doesn't lie, and replace old parts incrementally instead of betting the company on rewrites. You've written mini-ADRs for five labs; this topic makes the practice systematic — and uses it to plan and execute a real incremental migration.",
    concepts: [
      "ADRs: context, decision, status, consequences — one page, immutable once accepted, superseded rather than edited",
      "Decision hygiene: recording rejected alternatives and 'what would change our mind' triggers",
      "Documentation that stays true: generated or test-enforced beats hand-maintained; a diagram that lies is worse than none",
      "The strangler fig: route through a facade, grow the new implementation slice by slice, retire the old when traffic reaches zero",
      "Fitness functions: automated checks (your dependency-graph CI job) that guard architectural properties over time",
      "Reversibility: preferring decisions that are cheap to undo; recognizing genuine one-way doors",
      "The rewrite trap: why big-bang rewrites fail and incremental replacement wins",
    ],
    practicalUses: [
      "Onboarding someone into why the system is shaped this way — from the ADR log, not archaeology",
      "Replacing a crusty subsystem while shipping features the whole time",
      "Re-evaluating an old decision using its recorded context instead of relitigating from scratch",
    ],
    lab: {
      title: "The Decision Log & the First Slice",
      scenario:
        "Two deliverables. First: turn your five lab mini-ADRs into a real decision log — a consistent template, plus two retroactive ADRs for decisions your tracker embodies but nobody recorded (framework choice, database choice). Second: pick the crustiest corner of the tracker, write a strangler-fig migration plan with slices and rollback points, and execute the first slice — facade in place, new implementation serving part of the traffic, old path still working. (Any project with five-plus real decisions and one crusty corner qualifies.)",
      outcome:
        "You can run a decision-record practice that a team could adopt tomorrow, and you can plan and start an incremental replacement with explicit slices, measurements, and rollback points — instead of proposing a rewrite.",
      requirements: [
        "Adopt an ADR template (Nygard's or MADR), convert your five mini-ADRs to it, and number them in a docs/adr/ directory in version control",
        "Write two retroactive ADRs for unrecorded decisions the system embodies; mark their status honestly (accepted long ago, consequences now visible)",
        "Add one fitness function to CI that enforces a recorded decision (the no-framework-imports-in-core check from lab 2 is ideal) and reference it from the ADR it guards",
        "Choose the migration target and write the strangler plan: the facade/seam, ordered slices, the metric that proves each slice, and the rollback move per slice",
        "Execute slice one: facade routing between old and new paths, new implementation handling its share, both paths observable via your lab-6 telemetry",
        "Write the migration ADR, including the explicit criteria for finishing — and for abandoning — the migration",
      ],
      checkpoints: [
        "The ADR log reads coherently start to finish and a newcomer can reconstruct why the system is shaped this way",
        "The fitness function fails CI when its decision is violated (prove it once, deliberately)",
        "Slice one serves real traffic through the facade with the old path intact and telemetry distinguishing the two",
        "The plan's remaining slices each have a proof metric and a rollback move",
      ],
      hints: [
        "Read Nygard's original post before any template: the power is context and consequences, not formatting. An ADR that omits the rejected alternatives is a press release, not a record.",
        "Good retroactive-ADR candidates: 'FastAPI over Flask/Django', 'PostgreSQL over SQLite', 'monolith with one async seam'. You know the real reasons — write them before they're forgotten.",
        "A strangler facade can be tiny: a router function choosing old or new by feature flag, id range, or endpoint. The pattern is the incremental discipline, not the machinery.",
        "Migration criteria for abandoning matter as much as finishing: 'if slice two takes over N days or error rate rises above X, we roll back and stop' is what makes starting safe.",
      ],
      validation: [
        "A reviewer reads only the ADR log and correctly answers three 'why is it built this way?' questions",
        "Toggling the facade during a demo moves traffic between old and new paths with telemetry showing both healthy",
      ],
      solutionOutline: [
        "ADRs work because they capture context at decision time: the future reader learns not just what was decided but what pressures decided it — which is exactly what's needed to revisit the decision honestly when pressures change.",
        "Fitness functions turn key decisions from prose into enforcement: the dependency check doesn't drift, doesn't forget, and objects in CI the day someone violates the boundary ADR.",
        "The strangler fig wins over rewrites because every slice ships value, carries a rollback, and updates the plan with real information — the migration is never more than one slice from safety, which is why it actually finishes.",
      ],
      extensions: [
        "Complete slice two of the migration, updating the plan with what slice one taught you",
        "Add a docs/architecture.md whose diagram is checked against the dependency graph in CI — documentation that cannot silently lie",
      ],
    },
    resources: {
      primary: [
        {
          ...R.evolutionaryArchitectures,
          guidance:
            "Watch the book-club conversation (the authors, ~40 min): fitness functions, incremental change, and architecture as a continuing activity. Note every idea you've already practiced in this branch — then formalize them in the lab.",
        },
      ],
      alternatives: [
        {
          ...R.nygardADR,
          guidance:
            "The original ADR post — five minutes that define the format's soul (context and consequences). Read before adopting any template.",
        },
      ],
      practice: [
        {
          ...R.adrOrg,
          guidance:
            "After Nygard's post, pick a template here (MADR is a good default) and use it for the lab's decision log — templates and examples, ready to copy.",
        },
      ],
      extra: [
        {
          ...R.stranglerFig,
          guidance:
            "Fowler's short original on incremental replacement — read before writing your migration plan.",
        },
        {
          ...R.googleTechWriting,
          guidance:
            "If your ADRs come out mushy, this free course tightens technical prose in an afternoon.",
        },
      ],
    },
    masteryChecks: [
      "Write an ADR for a real decision including context, rejected alternatives, consequences, and revisit triggers — and have someone reconstruct the decision from it",
      "Plan a strangler-fig migration with slices, proof metrics, and rollback moves, and defend why it beats a rewrite",
      "Name a past decision you'd now reverse, and describe the incremental path back using its recorded context",
    ],
  },
};
