import type { TopicMeta } from "../../types";

/**
 * Software Architecture: turning working code into systems that stay
 * changeable, reliable, and observable. Every lab evolves the full-stack
 * issue tracker built in the practice phase, so decisions are made against
 * a real, learner-owned codebase — never a greenfield diagram.
 */
export const archMeta: TopicMeta[] = [
  {
    id: "arch-modularity",
    title: "Modularity, Coupling & Dependency Direction",
    branch: "arch",
    stage: 1,
    required: true,
    difficulty: "advanced",
    estimatedHours: 10,
    summary:
      "Why some codebases stay easy to change and others rot: separation of concerns, cohesion and coupling as measurable properties, deep modules with small interfaces, and dependency direction — the rule that volatile code depends on stable code, never the reverse. Measured on your own issue tracker, not on slides.",
    prerequisiteIds: ["se-clean-code", "se-testing-strategy"],
  },
  {
    id: "arch-boundaries",
    title: "Boundaries, Ports & Adapters",
    branch: "arch",
    stage: 2,
    required: true,
    difficulty: "advanced",
    estimatedHours: 12,
    summary:
      "Architecture's core move: a domain core that knows nothing about frameworks or databases, talking to the world through ports (interfaces it defines) implemented by adapters (details it never imports). Dependency inversion made physical — proven by swapping an implementation with zero changes to the core.",
    prerequisiteIds: ["arch-modularity", "db-backend-ops"],
  },
  {
    id: "arch-data-contracts",
    title: "API Contracts, Versioning & Data Ownership",
    branch: "arch",
    stage: 3,
    required: true,
    difficulty: "advanced",
    estimatedHours: 10,
    summary:
      "Interfaces you've published are promises: evolving an API without breaking consumers, versioning strategies and their real costs, which component owns which data (and why shared databases couple everything), and migrating a schema while the system keeps running.",
    prerequisiteIds: ["arch-boundaries", "db-api-design", "db-design-performance"],
  },
  {
    id: "arch-system-shapes",
    title: "Modular Monolith, Services & Event-Driven Designs",
    branch: "arch",
    stage: 4,
    required: true,
    difficulty: "advanced",
    estimatedHours: 10,
    summary:
      "Choosing a system's shape as a trade-off, not a fashion: what a well-modularized monolith buys you, what distribution actually costs (latency, partial failure, operational load), when a queue genuinely decouples, and the four different things people mean by 'event-driven'.",
    prerequisiteIds: ["arch-data-contracts", "py-concurrency", "systems-networking"],
  },
  {
    id: "arch-reliability",
    title: "Reliability & Failure Handling",
    branch: "arch",
    stage: 5,
    required: true,
    difficulty: "advanced",
    estimatedHours: 10,
    summary:
      "Designing for the moment dependencies misbehave: timeouts everywhere, retries that don't amplify outages, idempotency so retries are safe, graceful degradation instead of collapse — and failure paths exercised by tests, not discovered in production.",
    prerequisiteIds: ["arch-system-shapes"],
  },
  {
    id: "arch-observability",
    title: "Observability, Performance & Scalability Trade-offs",
    branch: "arch",
    stage: 6,
    required: true,
    difficulty: "advanced",
    estimatedHours: 11,
    summary:
      "Seeing inside a running system: structured logs, metrics, and traces as three views of one request; the four golden signals; and the discipline of measuring before optimizing — finding a real bottleneck, fixing it, and proving the fix with numbers instead of vibes.",
    prerequisiteIds: ["arch-reliability", "cs-big-o"],
  },
  {
    id: "arch-evolution",
    title: "Decision Records & Evolving a Living System",
    branch: "arch",
    stage: 7,
    required: true,
    difficulty: "advanced",
    estimatedHours: 10,
    summary:
      "Architecture as an ongoing activity: recording decisions with their context and consequences (ADRs), documentation that stays true, the strangler-fig pattern for incremental replacement, and reversing a decision that turned out wrong — without a rewrite.",
    prerequisiteIds: ["arch-observability", "se-git-collaboration"],
  },
];
