import type { Difficulty } from "./types";
import { branches, branchById } from "./branches";
import { topics, topicById, topicsByBranch } from "./topics";
import { milestones } from "./milestones";
import { R, resourceSubjects } from "./resourceCatalog";

export { branches, branchById, topics, topicById, topicsByBranch, milestones, R, resourceSubjects };

/** The learner's customized starting point. */
export const startHere = {
  topicId: "code-to-program",
  headline: "You know C up to linked lists. Here's the path to self-sufficient engineer.",
  guidance:
    "Continue from your C knowledge into memory, debugging, data structures, Git, and Linux. Begin Python after the C memory foundation — don't restart from variables. Everything is unlocked; follow prerequisites, not a fixed schedule.",
};

export const difficultyOrder: Record<Difficulty, number> = {
  foundation: 0,
  intermediate: 1,
  advanced: 2,
};

export const difficultyLabel: Record<Difficulty, string> = {
  foundation: "Foundation",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

/** Total estimated hours across required topics — shown in the About page. */
export const totalRequiredHours = topics
  .filter((t) => t.required)
  .reduce((sum, t) => sum + t.estimatedHours, 0);

export const topicCount = topics.length;
export const milestoneCount = milestones.length;
