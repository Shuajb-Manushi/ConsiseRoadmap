import type { TopicMeta } from "../../types";


export const backendMeta: TopicMeta[] = [
  {
    id: "db-relational-thinking",
    title: "Relational Thinking, Keys & Constraints",
    branch: "backend",
    stage: 1,
    required: true,
    difficulty: "intermediate",
    estimatedHours: 8,
    summary:
      "The relational model as a way of thinking before it's syntax: data as tables of rows, primary keys as identity, foreign keys as relationships, and constraints (NOT NULL, UNIQUE, CHECK, foreign keys) as invariants the database enforces for you — so bad data becomes impossible, not just discouraged.",
    prerequisiteIds: ["py-classes-types"],
  },
  {
    id: "db-sql",
    title: "SQL: Queries, Joins & Analysis",
    branch: "backend",
    stage: 2,
    required: true,
    difficulty: "intermediate",
    estimatedHours: 12,
    summary:
      "SQL as the language of data: CRUD, filtering and sorting, the join family (inner/left/right/full) and how to reason about them, aggregation with GROUP BY and HAVING, subqueries and CTEs for readable complexity, and a first look at window functions for running totals and rankings.",
    prerequisiteIds: ["db-relational-thinking"],
  },
  {
    id: "db-design-performance",
    title: "Normalization, Indexes, Transactions & Migrations",
    branch: "backend",
    stage: 3,
    required: true,
    difficulty: "advanced",
    estimatedHours: 12,
    summary:
      "Making databases correct and fast under real conditions: normalization (and deliberate denormalization), indexes and reading query plans (your BST/B-tree knowledge cashes in), transactions and ACID, concurrency anomalies and isolation levels, and schema migrations for evolving a database that already holds precious data.",
    prerequisiteIds: ["db-sql", "c-trees"],
  },
  {
    id: "db-api-design",
    title: "HTTP APIs & REST Design",
    branch: "backend",
    stage: 4,
    required: true,
    difficulty: "intermediate",
    estimatedHours: 8,
    summary:
      "Designing the contract before building the server: resources and URLs, HTTP methods and their semantics (and idempotency), status codes used correctly, request/response body design, error shapes, pagination and filtering, and versioning — the REST conventions that make an API predictable to everyone who uses it.",
    prerequisiteIds: ["py-http-apis", "db-sql"],
  },
  {
    id: "db-fastapi",
    title: "Building APIs with FastAPI",
    branch: "backend",
    stage: 5,
    required: true,
    difficulty: "advanced",
    estimatedHours: 16,
    summary:
      "Implementing your designed API for real: FastAPI with Pydantic models for validation, path/query/body parameters, dependency injection, connecting to PostgreSQL, structured error responses, and the automatic interactive docs. The Python, typing, testing, and database skills converge into a running service.",
    prerequisiteIds: ["db-api-design", "db-design-performance", "py-testing-cli"],
  },
  {
    id: "db-auth",
    title: "Authentication, Authorization & API Security",
    branch: "backend",
    stage: 6,
    required: true,
    difficulty: "advanced",
    estimatedHours: 14,
    summary:
      "Securing the service properly: authentication (proving who you are) vs. authorization (what you may do), password hashing done right (bcrypt/argon2, never your own), sessions vs. tokens (JWT) and their trade-offs, protecting routes, rate limiting, and the secure handling of credentials and secrets — using vetted libraries, never inventing crypto.",
    prerequisiteIds: ["db-fastapi", "cs-discrete-probability"],
  },
  {
    id: "db-backend-ops",
    title: "Backend Testing, Logging, Config & Background Work",
    branch: "backend",
    stage: 7,
    required: true,
    difficulty: "advanced",
    estimatedHours: 10,
    summary:
      "The operational maturity that makes a service maintainable: layered testing against a real test database, structured logging you can actually search, configuration and secrets via environment, and background/scheduled work done reliably — the concerns that separate a demo from something you'd trust in production.",
    prerequisiteIds: ["db-auth"],
  },
];
