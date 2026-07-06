import type { TopicBody } from "../../types";
import { R } from "../../resourceCatalog";


export const backendBodies: Record<string, TopicBody> = {
  "db-relational-thinking": {
    whyItMatters:
      "Relational databases store most of the world's important data, and modeling it well is a durable skill that outlives any framework. Constraints in particular move correctness from hopeful application code into the one place that can truly guarantee it — a lesson that reshapes how you think about data integrity everywhere.",
    concepts: [
      "Tables, rows, columns, and types; a row as a fact",
      "Primary keys: identity, natural vs. surrogate keys",
      "Foreign keys: relationships and referential integrity",
      "Relationship cardinality: one-to-one, one-to-many, many-to-many (and the junction table)",
      "Constraints as enforced invariants: NOT NULL, UNIQUE, CHECK, DEFAULT",
      "NULL's real meaning (unknown) and its three-valued-logic surprises",
      "Modeling: from real-world entities to a schema",
    ],
    practicalUses: [
      "Designing the data model for any application",
      "Preventing entire bug classes via constraints instead of validation code",
      "Reading an existing schema and understanding the domain from it",
    ],
    lab: {
      title: "Design a Library Database",
      scenario:
        "Model a real domain — a lending library with books, copies, members, loans, and reservations — as a properly constrained relational schema. You'll design it on paper first (entities and relationships), then implement it in SQLite/PostgreSQL, and prove the constraints reject invalid data.",
      outcome:
        "You can turn a real domain into a normalized, constrained schema, and you've felt constraints catch bad data that application code would have let slip.",
      requirements: [
        "An entity-relationship sketch: entities, attributes, and relationships with cardinalities, before any SQL",
        "A schema with correct primary keys (justify surrogate vs. natural per table), foreign keys with sensible ON DELETE behavior, and appropriate NOT NULL/UNIQUE/CHECK constraints",
        "The many-to-many case handled with a junction table (e.g., books ↔ authors)",
        "Model the tricky rule: a copy can be on at most one active loan — decide how the schema enforces or supports it and explain the trade-off",
        "Attempt at least eight invalid operations (dangling foreign key, duplicate unique, null required, failed check) and confirm the database rejects each with the reason",
        "A written half-page: which invariants you enforced in the schema, which you left to the application, and why",
      ],
      checkpoints: [
        "The ER sketch matches the final schema (update whichever was wrong)",
        "Every foreign key has a deliberate ON DELETE choice you can defend",
        "All eight invalid operations are rejected by the database, not by hope",
        "You can explain a case where NULL's three-valued logic would surprise a naive query",
      ],
      hints: [
        "Start from the nouns (your decomposition training): each becomes a table; each relationship becomes a foreign key or junction table.",
        "Surrogate keys (auto id) avoid the pain of changing natural keys; natural keys prevent duplicates meaningfully. Choose per table, consciously.",
        "A CHECK constraint can enforce simple business rules (due_date > loan_date) — push invariants into the schema whenever the database can express them.",
      ],
      validation: [
        "Load sample data and run the invalid-operation battery; all rejected",
        "A classmate reads only your schema and correctly describes the domain's rules",
      ],
      solutionOutline: [
        "The relational model represents entities as tables and relationships as keys; good modeling makes the schema a precise, enforced description of the domain's rules.",
        "Constraints are invariants the database guarantees regardless of which application, script, or console touches the data — the single reliable place for integrity, which is why 'validate in the app' alone is insufficient.",
        "The many-to-many junction table and the one-active-loan rule show where the model's expressiveness ends and application logic (or advanced constraints) begins — a boundary worth naming explicitly.",
      ],
      extensions: [
        "Add a fines table and model the rules; watch complexity grow and normalization matter",
        "Draw the schema with a diagramming tool and compare with your hand sketch",
      ],
    },
    resources: {
      primary: [
        { ...R.cs50sql, url: "https://cs50.harvard.edu/sql/weeks/1/", guidance: "Watch Week 1 'Relating' (~1 h), then Week 2 'Designing' — keys, constraints, and schema design taught on real datasets." },
      ],
      alternatives: [],
      practice: [],
      extra: [
        { ...R.pgTutorial, guidance: "The data-definition and constraints chapters — concise and authoritative." },
        { ...R.opendsa, guidance: "For the underlying set/relation theory if you want the formal grounding." },
      ],
    },
    masteryChecks: [
      "Model a given domain (e.g., a course-enrollment system) into constrained tables from a description",
      "Explain the difference between enforcing a rule via constraint vs. application code, with trade-offs",
      "Predict which invalid inserts a given schema will reject and why",
    ],
    securityNote:
      "Constraints are a security control: a UNIQUE on email prevents account-takeover-by-duplicate, a foreign key prevents orphaned privilege grants. Data integrity and security overlap heavily — model defensively.",
  },
  "db-sql": {
    whyItMatters:
      "SQL is one of the highest-return skills in software — decades old, everywhere, and unlikely to be replaced. Being able to answer real questions of data directly (instead of pulling everything into application code and looping) is a force multiplier for backend, data, and even security work.",
    concepts: [
      "SELECT/INSERT/UPDATE/DELETE and the WHERE clause",
      "Sorting, limiting, and pagination (OFFSET's cost, keyset pagination idea)",
      "Joins: inner and outer, the mental model of matching rows, and when each is right",
      "Aggregation: GROUP BY, aggregate functions, HAVING vs. WHERE",
      "Subqueries and CTEs (WITH) for composing and clarifying queries",
      "Window functions: partitioning and ordering for rankings and running totals",
      "Set operations and NULL-aware querying",
    ],
    practicalUses: [
      "Answering product/business questions directly from data",
      "The data-access layer of every backend service",
      "Ad-hoc analysis and reporting without exporting to a spreadsheet",
    ],
    lab: {
      title: "Interrogate the Library Database",
      scenario:
        "Load your library schema with realistic sample data (hundreds of members, thousands of loans) and answer a battery of increasingly hard real questions purely in SQL — from 'who has overdue books' to 'each member's longest borrowing streak' — verifying every answer against a slow but obvious method.",
      outcome:
        "You can express complex questions as SQL fluently, reason about joins and aggregation confidently, and you've met window functions on a real need.",
      requirements: [
        "Seed realistic data (a generator script; reuse your Python skills)",
        "Basic tier: overdue loans, most-borrowed books, members with no loans (the LEFT JOIN ... IS NULL pattern)",
        "Aggregation tier: loans per month, average loan duration per genre, members exceeding a borrowing threshold (GROUP BY + HAVING)",
        "Composition tier: use CTEs to answer a two-step question readably (e.g., 'members whose favorite genre is X', where favorite requires a per-member aggregation first)",
        "Window tier: rank books by popularity within each genre; compute a running total of loans over time",
        "For at least four answers, cross-check with an independent method (a Python script iterating the same data) — SQL and Python must agree",
      ],
      checkpoints: [
        "The LEFT JOIN / IS NULL 'find the missing' pattern is understood, not copied",
        "You can explain the difference in results between WHERE and HAVING on a real query",
        "A CTE-based query is more readable than the equivalent nested subquery — you can show both",
        "A window-function ranking matches a hand-verified small case",
      ],
      hints: [
        "Read a join as: for each left row, find matching right rows; INNER drops non-matches, LEFT keeps them with NULLs. Draw two small tables and trace it.",
        "WHERE filters rows before grouping; HAVING filters groups after. Mixing them up is the classic aggregation bug.",
        "CTEs let you name intermediate results — write the hard query as a sequence of named steps, like functions.",
        "Window functions don't collapse rows (unlike GROUP BY): they compute across a 'window' while keeping every row. That distinction is the whole concept.",
      ],
      validation: [
        "Python cross-checks agree with SQL on four+ non-trivial questions",
        "Each query is readable (formatted, CTEs where they help) — a classmate can follow it",
        "Edge cases handled: members with zero loans appear where they should, NULLs don't silently drop rows",
      ],
      solutionOutline: [
        "SQL is declarative: you describe the result set's shape and constraints, and the engine plans the execution — freeing you from writing loops and letting the database optimize.",
        "Joins, aggregation, and windows are three composable tools: joins combine rows across tables, GROUP BY collapses rows into summaries, windows compute alongside rows — most reporting is a combination of these.",
        "The Python cross-check embodies the oracle-testing pattern (again): an obviously-correct slow method validating a fast/clever one.",
      ],
      extensions: [
        "Rewrite an OFFSET-paginated query as keyset pagination and reason about the performance difference (preview of indexing)",
        "Answer a question that genuinely needs a recursive CTE (e.g., a category tree) — connect to your graph/tree work",
      ],
    },
    resources: {
      primary: [
        { ...R.sqlbolt, guidance: "Complete lessons 1–12 in the browser — every clause practiced immediately against real tables. A couple of hours, permanently useful." },
      ],
      alternatives: [
        { ...R.cs50sql, url: "https://cs50.harvard.edu/sql/weeks/0/", guidance: "Week 0 'Querying' if you'd like a lecture treatment first." },
      ],
      practice: [
        { ...R.sqlMurderMystery, guidance: "Solve the mystery — it forces joins and filtering with real motivation." },
        { ...R.pgexercises, guidance: "The 'Basic' and 'Joins' exercise sets against a realistic schema." },
      ],
      extra: [
        { ...R.pgTutorial, guidance: "The querying, joins, and aggregate chapters — reference while you practice." },
      ],
    },
    masteryChecks: [
      "Write a multi-join, grouped query with HAVING from a plain-English question",
      "Explain inner vs. left join with a concrete case where the choice changes the answer",
      "Use a window function to compute a per-group ranking and explain why GROUP BY couldn't",
    ],
  },
  "db-design-performance": {
    whyItMatters:
      "This is where database knowledge becomes professional: the difference between a query that takes 10ms and 10s is usually one index, and the difference between a bank that loses money and one that doesn't is transactions done right. Migrations are how real systems change without downtime or data loss.",
    concepts: [
      "Normalization to 3NF: eliminating redundancy and update anomalies; when to denormalize on purpose",
      "Indexes as sorted structures (B-trees — your tree work): speeding reads, costing writes and space",
      "Reading EXPLAIN/query plans: sequential scan vs. index scan, and why an index was (or wasn't) used",
      "Transactions and ACID: atomicity and durability made concrete",
      "Concurrency anomalies (dirty/non-repeatable/phantom reads) and isolation levels",
      "Locking and deadlocks at the database level (echoing your concurrency work)",
      "Migrations: versioned, reversible schema changes on live data",
    ],
    practicalUses: [
      "Making a slow endpoint fast by adding the right index",
      "Ensuring money/inventory operations are correct under concurrency",
      "Evolving a production schema safely as requirements change",
    ],
    lab: {
      title: "Make It Correct, Then Make It Fast",
      scenario:
        "Take your library database to production quality: normalize a deliberately-denormalized version and observe the anomalies disappear; add indexes guided by query plans and measure the speedups; implement a checkout operation that's correct under concurrent access; and write a reversible migration that evolves the schema.",
      outcome:
        "You can diagnose and fix both correctness (transactions, normalization) and performance (indexes, plans) issues in a real database, and you can evolve a schema without fear.",
      requirements: [
        "Start from a denormalized table with redundancy; demonstrate an update anomaly, then normalize to 3NF and show the anomaly is now impossible",
        "Grow the data to a scale where a common query is slow; use EXPLAIN to see the sequential scan, add the right index, re-run EXPLAIN and the benchmark, and document the before/after (and the write-cost trade-off)",
        "Implement 'check out a copy' as a transaction that must not double-lend under concurrency: reproduce the race with two concurrent sessions, then fix it with appropriate locking/isolation and prove the race is gone",
        "Write a forward-and-reverse migration (add a column with backfill, or split a table) that could run on live data, and actually run it up and down",
        "A one-page report tying each fix to its concept: which anomaly, which plan change, which isolation level, and why",
      ],
      checkpoints: [
        "The update anomaly is demonstrated pre-normalization and structurally impossible post-normalization",
        "EXPLAIN shows index usage after your change, and the benchmark confirms the speedup",
        "The double-lend race is reproduced (two sessions) and then prevented — you can name the mechanism",
        "The migration runs up, then down, returning to the exact prior schema",
      ],
      hints: [
        "An index is a sorted copy of a column (a B-tree) pointing back to rows — that's why it speeds lookups/ranges and slows writes. Your tree knowledge is the intuition.",
        "EXPLAIN (ANALYZE) shows the actual plan and timing. 'Seq Scan' on a big table for a selective query is the smell; the fix is usually an index the planner will choose.",
        "The double-lend race: two transactions both read 'copy available', both proceed. SELECT ... FOR UPDATE or a higher isolation level serializes them. Reproduce it before fixing — unseen races aren't understood.",
        "Migrations must be reversible and safe on data that exists: add-then-backfill-then-constrain, never a destructive rewrite in one step.",
      ],
      validation: [
        "Concurrency test: scripted concurrent checkouts never double-lend after the fix (run it many times)",
        "The index's benefit is measured, and you can state its write-side cost",
        "Migration down/up round-trips the schema exactly (diff the definitions)",
      ],
      solutionOutline: [
        "Normalization removes redundancy so a fact lives in exactly one place, making update anomalies impossible by construction; denormalization trades that safety for read speed, done deliberately and locally.",
        "Indexes are the database's answer to your searching-and-sorting work: B-trees turning O(n) scans into O(log n) lookups, at the cost of maintenance on writes — the query planner chooses based on statistics, which EXPLAIN reveals.",
        "Transactions provide all-or-nothing atomicity and isolation from concurrent access; the anomalies and their isolation-level fixes are the database-level version of the races you produced in the Python concurrency lab.",
      ],
      extensions: [
        "Add a composite/partial index and reason about column order",
        "Deliberately cause a deadlock with two transactions locking in opposite order, observe the database's victim selection, and fix by consistent lock ordering",
      ],
    },
    resources: {
      primary: [
        { ...R.cs50sql, url: "https://cs50.harvard.edu/sql/weeks/5/", guidance: "Watch Week 5 'Optimizing' (~1 h): indexes, EXPLAIN, and transactions demonstrated on real queries. Rewatch Week 2 'Designing' for normalization." },
      ],
      alternatives: [],
      practice: [
        { ...R.pgexercises, guidance: "The 'Aggregates' set — then run EXPLAIN on your own slowest query and read the plan." },
      ],
      extra: [
        { ...R.pgTutorial, guidance: "The performance/EXPLAIN and transaction chapters, plus the official docs on indexes and isolation." },
        { ...R.ostep, guidance: "The concurrency and persistence chapters ground transactions and durability at the systems level." },
      ],
    },
    masteryChecks: [
      "Normalize a redundant table to 3NF and name the anomaly each step removes",
      "Read an EXPLAIN plan and predict whether an index will help a given query",
      "Explain a concurrency anomaly and the isolation level that prevents it",
    ],
  },
  "db-api-design": {
    whyItMatters:
      "You consumed APIs as a client; now you design them, and a well-designed API is a joy while a bad one is a decade of pain for everyone who integrates. These conventions are how frontends, mobile apps, and other services talk to your backend — getting them right is a core backend competency.",
    concepts: [
      "Resources and resource-oriented URLs (nouns, not verbs)",
      "HTTP methods and semantics: GET/POST/PUT/PATCH/DELETE, safety and idempotency",
      "Status codes as a precise vocabulary (200/201/204/400/401/403/404/409/422/500)",
      "Request and response body design; consistent error response shape",
      "Pagination, filtering, and sorting conventions",
      "Versioning strategies and backward compatibility",
      "Designing for the consumer: predictability, discoverability, good errors",
    ],
    practicalUses: [
      "The contract for your full-stack issue tracker",
      "Any service other code will call",
      "Evaluating and integrating third-party APIs more critically",
    ],
    lab: {
      title: "Design the Issue Tracker API (on Paper)",
      scenario:
        "Before writing a line of FastAPI, fully design the issue tracker's REST API as a specification: every resource, endpoint, method, request/response shape, status code, and error format — reviewed against the client needs of the React frontend you already built.",
      outcome:
        "You can design a coherent, conventional REST API that a frontend developer could build against from the spec alone — the professional practice of contract-first design.",
      requirements: [
        "Resource model: issues, comments, labels, users — with resource-oriented URL structure",
        "Full endpoint list: methods, paths, purpose; correct use of PUT vs PATCH and 201 vs 200 vs 204",
        "Request and response schemas for each endpoint (JSON shapes), including a single consistent error format across all failures",
        "Cross-cutting concerns: pagination for lists, filtering (by status/label/assignee), and sorting — with concrete query parameter design",
        "Status-code discipline: specify which codes each endpoint returns and for what (including 409 for conflicts, 422 for validation, 401 vs 403)",
        "Validate against the frontend: for each screen of your React app, confirm the API provides exactly what it needs — no over- or under-fetching gaps",
      ],
      checkpoints: [
        "URLs are noun-based and consistent; no verbs-in-paths like /createIssue",
        "Method and status-code choices are each justified against HTTP semantics",
        "The error shape is identical everywhere, with enough detail to render good UI",
        "Every frontend view maps cleanly to specified endpoints",
      ],
      hints: [
        "Idempotency matters: PUT and DELETE should be safe to retry; POST creating a resource is not. Design retries in mind.",
        "422 (validation) vs 400 (malformed) vs 409 (conflict) — precise codes let clients react correctly. Vague 400-for-everything is a smell.",
        "Design the error shape once and reuse it: { error: { code, message, details } } beats ad-hoc strings.",
        "Contract-first means the frontend and backend can be built in parallel against the spec — that's the point.",
      ],
      validation: [
        "A classmate acting as 'frontend dev' can describe how to build a feature from your spec alone",
        "Every endpoint's method/status choices survive a review against HTTP semantics",
        "No frontend screen needs data the API doesn't cleanly provide",
      ],
      solutionOutline: [
        "REST maps resources to URLs and operations to HTTP methods, giving a uniform, predictable interface — the conventions exist so consumers can guess correctly.",
        "Status codes are a shared vocabulary: using them precisely lets clients handle outcomes generically (retry 5xx, fix-and-resubmit 422, redirect-to-login 401) without bespoke logic per endpoint.",
        "Contract-first design decouples teams and surfaces disagreements on paper (cheap) instead of in integration (expensive) — the same value as decomposing before coding.",
      ],
      extensions: [
        "Document the API in OpenAPI format (FastAPI will generate it later — compare your hand-spec to its output)",
        "Design a v2 change that's backward compatible and one that isn't; articulate the migration",
      ],
    },
    resources: {
      primary: [
        { ...R.apisForBeginners, guidance: "Watch Units 1–2 (~1 h): what an API is and how HTTP verbs, URLs, and status codes combine — then design yours on paper." },
      ],
      alternatives: [],
      practice: [],
      extra: [
        { ...R.fastapiTutorial, guidance: "Its request/response and status-code sections model good REST conventions." },
        { ...R.mdnCurriculum, guidance: "The HTTP reference for method and status-code semantics." },
      ],
    },
    masteryChecks: [
      "Design endpoints for a new resource with correct methods, URLs, and status codes",
      "Explain idempotency and which methods must have it",
      "Choose between 400/401/403/404/409/422 for six concrete failure scenarios",
    ],
    securityNote:
      "API design is where authorization boundaries are drawn: every endpoint must answer 'who is allowed to do this?' Returning 404 instead of 403 for unauthorized access to hide existence, consistent error shapes that don't leak internals, and not trusting client-supplied IDs are all design-time security decisions.",
  },
  "db-fastapi": {
    whyItMatters:
      "This is where you become a backend engineer: a real, validated, documented API backed by a real database. FastAPI's design (types drive validation and docs) rewards everything you've learned about types and contracts, and the result is deployable software other programs depend on.",
    concepts: [
      "FastAPI routing; path, query, and body parameters typed",
      "Pydantic models: validation, serialization, and clear error messages at the boundary",
      "Dependency injection: shared resources (DB sessions), auth, and testability",
      "Database integration: connection/session management, parameterized queries, transactions in handlers",
      "Structured error handling: mapping exceptions to your designed error responses and status codes",
      "Auto-generated OpenAPI docs and why type-driven APIs stay honest",
      "Project structure for a growing service: routers, models, dependencies, config",
    ],
    practicalUses: [
      "The backend of your full-stack issue tracker",
      "Any service exposing data or logic over HTTP",
      "Internal tools and integrations at real jobs",
    ],
    lab: {
      title: "Implement the Issue Tracker API",
      scenario:
        "Build the FastAPI service from your paper spec, backed by PostgreSQL: full CRUD for issues, comments, and labels with validation, pagination, filtering, proper status codes and error shapes, dependency-injected database sessions, and a real test suite — matching the contract your React frontend expects.",
      outcome:
        "A running, tested, validated, documented backend service that your frontend can consume — you are now a full-stack developer with both halves genuinely understood.",
      requirements: [
        "Implement the endpoints from your design; Pydantic models mirror the request/response schemas you specified",
        "PostgreSQL integration with dependency-injected sessions; all queries parameterized (never string-built); write operations in transactions",
        "Validation via Pydantic returns your consistent error shape with 422; other errors mapped to the right codes (404, 409, etc.) via exception handlers",
        "Pagination, filtering, and sorting implemented per your spec",
        "A pytest suite hitting the API (via the test client) with a test database: happy paths, validation failures, not-found, and at least one concurrency-sensitive case",
        "Config via environment variables (DB URL, etc.), never hardcoded; the auto-docs (/docs) work and match your intent",
      ],
      checkpoints: [
        "The interactive docs at /docs let you exercise every endpoint",
        "Validation errors return your designed shape with helpful field-level detail",
        "The test suite runs against an isolated test database and is green in a fresh clone",
        "Filtering/pagination behave exactly as specified; edge cases (page past end, unknown filter) handled",
      ],
      hints: [
        "Let types do the work: Pydantic models are your boundary validators (the habit from earlier), and FastAPI generates docs from them — one source of truth.",
        "Dependency injection for the DB session makes handlers testable: override the dependency in tests to point at a test database.",
        "Parameterized queries everywhere — this is the SQL-injection defense you've been practicing since the sqlite CLI. Never build SQL with string formatting.",
        "Map your domain exceptions to HTTP in one place (exception handlers), keeping handlers clean and error responses consistent.",
      ],
      validation: [
        "Every endpoint from the spec exists and behaves; the frontend's needs are all met",
        "Test suite covers happy and sad paths; a planted injection attempt in a filter param does nothing (parameterization proven)",
        "Fresh clone + test database + one command runs the suite green",
      ],
      solutionOutline: [
        "FastAPI turns types into behavior: Pydantic models validate and serialize at the edge, the router maps HTTP to functions, and dependency injection supplies resources — your handlers become thin translators over pure logic, the layering you've used since the tsk CLI.",
        "The database session as an injected dependency is the seam that makes the service testable and the transactions correct — decision (handler logic) separated from resource (session lifecycle).",
        "Type-driven docs stay honest because they're generated from the same models that validate — drift between docs and reality becomes impossible, unlike hand-written docs.",
      ],
      extensions: [
        "Add background tasks for something slow (e.g., notification on issue creation)",
        "Add request logging middleware (preview of observability)",
        "Load-test one endpoint and use your indexing knowledge to fix the bottleneck",
      ],
    },
    resources: {
      primary: [
        { ...R.fastapiTutorial, guidance: "Work through 'First Steps' → 'Request Body' → the database sections in order, running every snippet. It reads like a course, not documentation — the reason it's the recommended start despite being 'docs'." },
      ],
      alternatives: [],
      practice: [],
      extra: [
        { ...R.pgTutorial, guidance: "For the database side of the integration." },
        { ...R.pytestDocs, guidance: "For structuring the API test suite with fixtures and a test database." },
      ],
    },
    masteryChecks: [
      "Implement a validated CRUD endpoint with correct status codes from a spec",
      "Explain how dependency injection makes the database layer testable",
      "Show that your queries are injection-safe and explain the mechanism",
    ],
    securityNote:
      "This service handles untrusted input on every request: Pydantic validation, parameterized queries, and correct authorization checks are the core defenses. Never trust client-supplied IDs for authorization ('can THIS user touch THIS issue?'), and never leak internal errors (stack traces, SQL) in responses.",
  },
  "db-auth": {
    whyItMatters:
      "Auth is the single most security-critical code in most applications and the most commonly botched — plaintext passwords, forgeable tokens, missing authorization checks. Doing it correctly (and knowing why each step matters) is both a professional necessity and the practical bridge into the security branch.",
    concepts: [
      "Authentication vs. authorization — distinct problems, distinct solutions",
      "Password hashing: bcrypt/argon2, salts, work factors, and why fast hashes and homemade crypto are dangerous",
      "Sessions vs. tokens (JWT): server state vs. self-contained claims, and the trade-offs",
      "Protecting endpoints; role/ownership-based authorization checks on every sensitive operation",
      "Rate limiting and lockout to resist brute force",
      "Secrets management: environment/secret stores, never in code or Git",
      "Common failures: broken authorization, session fixation, token leakage, timing attacks",
    ],
    practicalUses: [
      "Adding real login and permissions to your issue tracker",
      "Any application with users and protected data",
      "Evaluating whether a system's auth is trustworthy",
    ],
    lab: {
      title: "Add Secure Auth to the Issue Tracker",
      scenario:
        "Add authentication and authorization to your FastAPI service: user registration with proper password hashing, login issuing tokens, protected endpoints, ownership/role-based authorization (users can edit their own issues; admins can edit any), rate-limited login, and secrets kept out of the codebase — then test the abuse cases.",
      outcome:
        "You can implement authentication and authorization correctly using vetted libraries, and you understand the failure modes well enough to test for them — the foundation the security branch builds on.",
      requirements: [
        "Registration: passwords hashed with argon2/bcrypt via a maintained library (never a hand-rolled or fast hash), with a sensible work factor",
        "Login: verify hash, issue a token (JWT or session) with expiry; never reveal whether the username or password was wrong (uniform errors)",
        "Protected endpoints via a dependency that authenticates the request; unauthenticated access returns 401",
        "Authorization on every sensitive operation: ownership checks (edit own issue) and role checks (admin) — a user must not edit another's issue even by guessing IDs",
        "Rate limiting / lockout on login to resist brute force; demonstrate it triggering",
        "Secrets (token signing key, DB credentials) from environment/secret store only; a test that the app refuses to start with defaults in production mode",
        "Abuse-case tests: wrong password, expired token, tampered token, and the critical 'user A tries to edit user B's issue' (must be 403/404)",
      ],
      checkpoints: [
        "Passwords are never stored or logged in plaintext; the hash is verified correctly on login",
        "The 'edit someone else's issue' attack is blocked by an authorization check, not by obscurity",
        "A tampered/expired token is rejected; error messages don't leak which part failed",
        "Login rate limiting demonstrably slows/stops a scripted brute-force attempt",
      ],
      hints: [
        "Never invent crypto or hashing. Use a maintained library, use its defaults, keep it updated. 'Rolling your own' is the canonical security mistake.",
        "Authorization is checked per operation on the actual resource: 'is this authenticated user allowed to modify THIS specific issue?' — missing this (Broken Access Control) is OWASP's #1 for a reason.",
        "Uniform login errors ('invalid credentials') prevent username enumeration; distinct errors leak which accounts exist.",
        "Put the signing key and DB password in environment variables; committing them is a breach. Add a startup check that refuses insecure defaults.",
      ],
      validation: [
        "The full abuse-case test suite passes: wrong password, expired token, tampered token, cross-user access, brute-force lockout",
        "Grep confirms no secret or plaintext password in code, logs, or Git history",
        "A code review confirms every sensitive endpoint has an explicit authorization check",
      ],
      solutionOutline: [
        "Authentication establishes identity (hash verification → token); authorization gates actions (per-resource ownership/role checks) — conflating them, or doing auth-n but skipping auth-z, is the most common serious bug.",
        "Password hashing uses deliberately slow, salted algorithms so that even a database breach doesn't cheaply reveal passwords; the work factor is tuned to the probability/cost math you learned — attackers face infeasible brute-force.",
        "Secrets management and rate limiting close the operational gaps: credentials live outside the code, and brute force is throttled — defense in depth, using the probability reasoning from the CS branch.",
      ],
      extensions: [
        "Add refresh tokens and reason about the revocation trade-off vs. stateless JWTs",
        "Add password-strength and breached-password checks",
        "Take this into the security branch and attack it in an authorized local lab",
      ],
    },
    resources: {
      primary: [
        { ...R.portswigger, title: "PortSwigger Academy — Authentication", url: "https://portswigger.net/web-security/authentication", guidance: "Read the Authentication section and complete the first three apprentice labs — see auth break before you build it." },
      ],
      alternatives: [
        { ...R.fastapiTutorial, url: "https://fastapi.tiangolo.com/tutorial/security/", guidance: "The security tutorial (OAuth2 password flow, hashing, dependencies) is the build-side walkthrough of exactly this lab." },
      ],
      practice: [],
      extra: [
        { ...R.owasp, guidance: "The Broken Access Control and Cryptographic Failures entries — what you're defending against." },
      ],
    },
    masteryChecks: [
      "Explain authentication vs. authorization with an example of code that has one but not the other",
      "Describe why passwords use slow salted hashes and what a fast hash or no salt exposes",
      "Given an endpoint, enumerate the authorization checks it needs and the attacks they prevent",
    ],
    securityNote:
      "This entire topic is security-critical; treat every requirement as load-bearing. The two failures that dominate real breaches are broken access control (missing authorization checks) and cryptographic failures (bad password storage) — you are defending against OWASP's top entries directly here.",
  },
  "db-backend-ops": {
    whyItMatters:
      "Code that works once on your laptop and code that runs reliably for months are different things, and the gap is exactly this material. When something breaks at 2am, logs and config discipline are what let you diagnose it; background work is how real systems handle email, notifications, and slow jobs without blocking requests.",
    concepts: [
      "Testing layers: unit (logic), integration (with a test DB), and end-to-end (the API)",
      "Test databases and isolation: fixtures, transactions-per-test, and reproducibility",
      "Structured logging: levels, context, correlation, and logging as searchable events not print statements",
      "Configuration via environment; separating config from code; the twelve-factor idea",
      "Secrets handling in operations (rotation, least privilege)",
      "Background tasks and job queues: offloading slow work; retries and idempotency",
      "Health checks and readiness for deployment",
    ],
    practicalUses: [
      "Diagnosing production incidents from logs",
      "Confidently changing a service because tests cover it",
      "Sending emails/notifications and processing uploads without blocking users",
    ],
    lab: {
      title: "Operationalize the Issue Tracker",
      scenario:
        "Bring your service to production readiness: a layered test suite against a real test database, structured logging with request correlation, environment-based configuration for dev/test/prod, a health-check endpoint, and a background task (e.g., sending a notification on issue assignment) with retry and idempotency.",
      outcome:
        "You can make a service observable, configurable, well-tested, and capable of reliable background work — the operational skills that make software trustworthy over time.",
      requirements: [
        "Layered tests: pure-logic unit tests, integration tests against a disposable test database (isolated per test), and end-to-end API tests — all green in one command",
        "Structured logging (JSON or key-value) with levels and a request/correlation ID threaded through a request's log lines so you can trace one request end to end",
        "Configuration by environment with clear dev/test/prod separation; no secrets or environment assumptions in code; a documented config schema",
        "A health/readiness endpoint suitable for a deployment platform's checks",
        "A background task triggered by an event (issue assigned → notification), implemented with retry-on-failure and idempotency so a retry doesn't double-send",
        "Demonstrate diagnosing a planted failure using only the logs (no debugger) — write up the trail you followed",
      ],
      checkpoints: [
        "One command runs unit + integration + e2e tests, all isolated and reproducible",
        "A single request's logs can be filtered by its correlation ID to see its whole story",
        "The same code runs in dev and test purely by changing environment, no code edits",
        "The background task is idempotent: forcing a retry does not double-send (proven by test)",
      ],
      hints: [
        "Structured logs are searchable data, not prose: log events with fields (user_id, issue_id, correlation_id), and future-you can query them. This is the difference from scattered prints.",
        "Correlation IDs: generate one per request, attach to every log line and pass to background jobs — this is how you trace a request across a distributed system later.",
        "Idempotency for background work: design so 'do this again' is safe (check-if-already-done, or use a natural key). Retries are inevitable; make them harmless.",
        "Config: read the environment once into a validated settings object (Pydantic settings), and pass it explicitly — the injectable-dependency pattern again.",
      ],
      validation: [
        "The full layered suite passes in a fresh clone with a test database",
        "You produced a written incident diagnosis from logs alone",
        "The idempotency test proves a retried job doesn't duplicate its effect",
      ],
      solutionOutline: [
        "The testing pyramid (many fast unit tests, fewer integration, fewest e2e) balances confidence against speed; a real test database in integration tests catches the bugs mocks hide, while isolation keeps them reliable.",
        "Structured logging plus correlation IDs turns 'what happened?' from archaeology into a query — the foundation of observability, which the practice branch extends.",
        "Background work with retries and idempotency reflects a core distributed-systems truth: failures and retries are normal, so operations must be safe to repeat — the same idempotency you designed into your API methods.",
      ],
      extensions: [
        "Add basic metrics (request counts, latencies) alongside logs",
        "Introduce a real job queue and move the background task onto it",
        "Add a graceful-shutdown path that finishes in-flight requests",
      ],
    },
    resources: {
      primary: [
        { ...R.coreyLogging, guidance: "Watch 'Logging Basics', then the follow-up 'Logging Advanced' video on the same channel — then wire structured logging through the lab." },
      ],
      alternatives: [],
      practice: [],
      extra: [
        { ...R.fastapiTutorial, guidance: "Its testing, background-tasks, and settings/config sections cover the rest of this topic." },
        { ...R.pytestDocs, guidance: "For structuring the layered suite and database fixtures." },
        { ...R.ghActions, guidance: "Preview: run this whole suite automatically in CI (the practice branch does this)." },
      ],
    },
    masteryChecks: [
      "Explain the testing pyramid and place five example tests on it",
      "Design structured logging for a request flow so you could trace one request through it",
      "Explain why background work must be idempotent and give a concrete double-send it prevents",
    ],
    securityNote:
      "Logs are a security asset and a liability: they're essential for detecting and investigating attacks, but logging secrets, passwords, or full tokens creates a breach. Log events and identifiers, never credentials — and ensure config discipline keeps secrets out of both code and logs.",
  },
};
