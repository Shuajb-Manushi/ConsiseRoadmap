/**
 * Curriculum data model. All curriculum content lives in src/data and is
 * plain typed data — no UI imports. Tests in src/data/*.test.ts validate
 * referential integrity so contributors can edit safely.
 */

export type BranchId =
  | "start"
  | "c"
  | "cs"
  | "python"
  | "web"
  | "backend"
  | "practice"
  | "systems"
  | "mobile"
  | "security"
  | "optional";

export type Difficulty = "foundation" | "intermediate" | "advanced";

export type ResourceType =
  | "documentation"
  | "course"
  | "book"
  | "video"
  | "interactive"
  | "lab"
  | "article"
  | "reference";

/** Resource types allowed as a topic's primary learning resource. */
export const guidedTypes: ResourceType[] = ["video", "course", "interactive", "lab"];

export type Resource = {
  /** Catalog key; lets deep-linked variants aggregate back to one entry. */
  id?: string;
  title: string;
  url: string;
  type: ResourceType;
  /** What this resource is / teaches. */
  note: string;
  /** Who publishes or teaches it. */
  provider?: string;
  /** Approximate time commitment, only when reliably known. */
  duration?: string;
  /** Exact action for the learner: which lecture, section, or exercises. */
  guidance?: string;
  /** Who this resource suits best (shown in the Resource Library). */
  audience?: string;
};

export type ResourceGroup = {
  /** One best starting resource: a guided video, course, tutorial, or lab. */
  primary: Resource[];
  /** Optional different-style explanations, shown behind "Try another explanation". */
  alternatives: Resource[];
  /** Interactive labs, visualizations, and exercise platforms. */
  practice: Resource[];
  /** Docs, books, manuals, and references — collapsed by default. */
  extra: Resource[];
};

export type PracticalLab = {
  title: string;
  /** The realistic situation the lab simulates. */
  scenario: string;
  /** What the learner will have built and understood at the end. */
  outcome: string;
  requirements: string[];
  /** Staged checkpoints, in order. */
  checkpoints: string[];
  /** Progressive hints — read one at a time, only when stuck. */
  hints: string[];
  /** How to check the work is actually correct. */
  validation: string[];
  /** How a correct solution is architected — not source code. */
  solutionOutline: string[];
  extensions: string[];
};

export type Topic = {
  id: string;
  title: string;
  branch: BranchId;
  /** Position within the branch progression (1-based). Used for ordering. */
  stage: number;
  /** false = optional / choose-if-relevant. */
  required: boolean;
  difficulty: Difficulty;
  /** Honest guidance, not a deadline. ~7 study hours per week assumed. */
  estimatedHours: number;
  /** Concise explanation of what this is. */
  summary: string;
  /** Why a working engineer reaches for this. */
  whyItMatters: string;
  prerequisiteIds: string[];
  /** Core ideas covered by the cluster. */
  concepts: string[];
  /** Where this shows up in real software. */
  practicalUses: string[];
  lab: PracticalLab;
  resources: ResourceGroup;
  /** "You have mastered this when you can…" */
  masteryChecks: string[];
  /** Secure-engineering note, where relevant. */
  securityNote?: string;
  /** Topics that list this one as a prerequisite. Derived — do not author. */
  nextIds: string[];
};

/** Authors write TopicDraft; nextIds are derived in topics/index.ts. */
export type TopicDraft = Omit<Topic, "nextIds">;

export type Branch = {
  id: BranchId;
  name: string;
  tagline: string;
  /** Restrained accent used for the branch in the map and lists. */
  color: string;
  order: number;
  /** true = clearly marked as optional/later specialization. */
  optional?: boolean;
};

export type MilestoneProject = {
  id: string;
  title: string;
  /** Topic ids that must be understood before starting. */
  unlockedBy: string[];
  /** Branch ids whose skills the project integrates. */
  integrates: BranchId[];
  brief: string;
  requirements: string[];
  /** Explicitly out of scope, to keep the project finishable. */
  nonGoals: string[];
  architecture: string[];
  checkpoints: string[];
  /** What the project's tests should cover. */
  tests: string[];
  hints: string[];
  solutionOutline: string[];
  extensions: string[];
};
