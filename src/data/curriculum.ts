import type { Difficulty } from "./types";
import { branches, branchById } from "./branches";
import { topicCount, totalRequiredHours } from "./topics/lite";
import { milestoneCount } from "./milestonesLite";

/**
 * The EAGER public aggregator: branch metadata, the start point, labels, and
 * derived totals. Deliberately free of curriculum prose — the heavy topic and
 * milestone bodies live behind ./topics/index.ts and ./milestones.ts, which
 * only lazily-loaded routes and tests import.
 */
export { branches, branchById, topicCount, totalRequiredHours, milestoneCount };

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
