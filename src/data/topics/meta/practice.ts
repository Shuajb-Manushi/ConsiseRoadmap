import type { TopicMeta } from "../../types";


export const practiceMeta: TopicMeta[] = [
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
    prerequisiteIds: ["problem-decomposition"],
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
    prerequisiteIds: ["git-github"],
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
    prerequisiteIds: ["testing-fundamentals", "py-classes-types"],
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
    prerequisiteIds: ["se-clean-code", "py-testing-cli"],
  },
  {
    id: "se-ci-docker-deploy",
    title: "CI, Docker, Deployment & Documentation",
    branch: "practice",
    stage: 5,
    required: true,
    difficulty: "advanced",
    estimatedHours: 14,
    summary:
      "Getting software to users reliably and repeatedly: continuous integration with GitHub Actions (tests on every push), containers with Docker for reproducible environments (introduced now that you understand processes and networking), deployment fundamentals, and documentation that makes a project maintainable and handoff-able.",
    prerequisiteIds: ["se-testing-strategy", "systems-processes"],
  },
];
