import type { MilestoneLite, TopicLite } from "../data/types";
import { guidedPhases, type GuidedPhase, type SideBranch } from "../data/phases";
import { topicMetaById } from "../data/topics/lite";
import { milestonesLite } from "../data/milestonesLite";

/**
 * Pure progress derivations over the EAGER curriculum index. Everything here
 * takes an immutable set of completed ids (topics and milestones share one id
 * space) and returns display-ready facts: phase percentages, milestone
 * readiness, the next suggested topic, and prev/next neighbors along the
 * guided order. No storage, no DOM — node unit tests cover this module.
 *
 * Only REQUIRED trunk topics count toward phase and overall percentages;
 * optional side branches are reported separately so they never block 100%.
 */

export type DoneSet = ReadonlySet<string>;

const milestoneLiteById = new Map(milestonesLite.map((m) => [m.id, m]));

/** Every trunk topic id in guided order (all trunk topics are required). */
export const guidedTrunkIds: string[] = guidedPhases.flatMap((p) => p.topicIds);

/** All ids progress may legally contain: every topic and milestone id. */
export function isKnownProgressId(id: string): boolean {
  return topicMetaById.has(id) || milestoneLiteById.has(id);
}

export type Fraction = { done: number; total: number; pct: number };

function fraction(done: number, total: number): Fraction {
  return { done, total, pct: total === 0 ? 0 : Math.round((done / total) * 100) };
}

function countDone(ids: readonly string[], done: DoneSet): number {
  return ids.reduce((n, id) => n + (done.has(id) ? 1 : 0), 0);
}

/** Completion of a phase's required trunk topics. */
export function phaseProgress(done: DoneSet, phase: GuidedPhase): Fraction {
  return fraction(countDone(phase.topicIds, done), phase.topicIds.length);
}

/** Completion of an optional side branch, reported separately from the trunk. */
export function sideBranchProgress(done: DoneSet, sb: SideBranch): Fraction {
  return fraction(countDone(sb.topicIds, done), sb.topicIds.length);
}

/** Completion across every required trunk topic in the guided path. */
export function overallProgress(done: DoneSet): Fraction {
  return fraction(countDone(guidedTrunkIds, done), guidedTrunkIds.length);
}

/** How many completed ids are topics vs. milestones (for summaries). */
export function progressCounts(done: DoneSet): { topics: number; milestones: number } {
  let topics = 0;
  let milestones = 0;
  for (const id of done) {
    if (topicMetaById.has(id)) topics++;
    else if (milestoneLiteById.has(id)) milestones++;
  }
  return { topics, milestones };
}

export type ReadinessEntry = {
  id: string;
  kind: "topic" | "milestone";
  title: string;
  done: boolean;
};

export type MilestoneReadiness = {
  /** true when every unlocking topic AND milestone is complete. */
  ready: boolean;
  entries: ReadinessEntry[];
  done: number;
  total: number;
};

/**
 * Readiness of a milestone: its `unlockedBy` list may reference topics AND
 * other milestones (e.g. the security capstone requires the issue tracker).
 */
export function milestoneReadiness(done: DoneSet, m: MilestoneLite): MilestoneReadiness {
  const entries: ReadinessEntry[] = m.unlockedBy.map((id) => {
    const topic = topicMetaById.get(id);
    if (topic) return { id, kind: "topic", title: topic.title, done: done.has(id) };
    const milestone = milestoneLiteById.get(id);
    return {
      id,
      kind: "milestone",
      title: milestone?.title ?? id,
      done: done.has(id),
    };
  });
  const doneCount = entries.filter((e) => e.done).length;
  return {
    ready: doneCount === entries.length,
    entries,
    done: doneCount,
    total: entries.length,
  };
}

/** Completed / total prerequisites of a topic (for card display). */
export function prereqProgress(done: DoneSet, topic: Pick<TopicLite, "prerequisiteIds">): Fraction {
  return fraction(countDone(topic.prerequisiteIds, done), topic.prerequisiteIds.length);
}

/** The first incomplete required trunk topic in guided order, or null when done. */
export function nextUpId(done: DoneSet): string | null {
  return guidedTrunkIds.find((id) => !done.has(id)) ?? null;
}

/**
 * The best topic to resume with: the most recently opened topic if it is
 * still incomplete, otherwise the first incomplete trunk topic.
 */
export function resumeTargetId(done: DoneSet, recents: readonly string[]): string | null {
  const recent = recents.find((id) => topicMetaById.has(id) && !done.has(id));
  return recent ?? nextUpId(done);
}

/** The guided phase a topic id belongs to (trunk or side branch), if any. */
export function phaseOfTopic(topicId: string): GuidedPhase | null {
  for (const phase of guidedPhases) {
    if (phase.topicIds.includes(topicId)) return phase;
    for (const sb of phase.sideBranches ?? []) {
      if (sb.topicIds.includes(topicId)) return phase;
    }
  }
  return null;
}

/** The first phase with an incomplete trunk topic (used to auto-expand). */
export function firstIncompletePhaseId(done: DoneSet): string {
  for (const phase of guidedPhases) {
    if (phase.topicIds.some((id) => !done.has(id))) return phase.id;
  }
  return guidedPhases[0].id;
}

export type GuidedNeighbors = {
  prevId: string | null;
  nextId: string | null;
  /** Human position within the sequence, e.g. "Phase 4 · 2 of 5". */
  label: string | null;
};

/**
 * Previous/next topic along the guided order. Trunk topics step through the
 * trunk only; side-branch topics step within their own side branch, so an
 * optional detour never hijacks the main path.
 */
export function guidedNeighbors(topicId: string): GuidedNeighbors {
  const trunkIndex = guidedTrunkIds.indexOf(topicId);
  if (trunkIndex !== -1) {
    const phase = phaseOfTopic(topicId)!;
    const inPhase = phase.topicIds.indexOf(topicId);
    return {
      prevId: trunkIndex > 0 ? guidedTrunkIds[trunkIndex - 1] : null,
      nextId: trunkIndex < guidedTrunkIds.length - 1 ? guidedTrunkIds[trunkIndex + 1] : null,
      label: `Phase ${phase.number} · ${inPhase + 1} of ${phase.topicIds.length}`,
    };
  }
  for (const phase of guidedPhases) {
    for (const sb of phase.sideBranches ?? []) {
      const i = sb.topicIds.indexOf(topicId);
      if (i === -1) continue;
      return {
        prevId: i > 0 ? sb.topicIds[i - 1] : null,
        nextId: i < sb.topicIds.length - 1 ? sb.topicIds[i + 1] : null,
        label: `${sb.title} (optional) · ${i + 1} of ${sb.topicIds.length}`,
      };
    }
  }
  return { prevId: null, nextId: null, label: null };
}

/* ---------- serialization (export / import / storage) ---------- */

export type ProgressFile = {
  version: 1;
  exportedAt: string;
  completed: string[];
};

export function serializeProgress(done: DoneSet): string {
  const file: ProgressFile = {
    version: 1,
    exportedAt: new Date().toISOString(),
    completed: [...done].sort(),
  };
  return JSON.stringify(file, null, 2);
}

export type ParsedProgress = { ids: string[]; unknown: number };

/**
 * Parse a progress JSON payload (import or storage). Unknown ids — from a
 * newer or edited curriculum — are counted and dropped rather than crashing
 * or polluting the counts. Returns null when the payload isn't progress data.
 */
export function parseProgress(json: string): ParsedProgress | null {
  let raw: unknown;
  try {
    raw = JSON.parse(json);
  } catch {
    return null;
  }
  if (typeof raw !== "object" || raw === null) return null;
  const completed = (raw as { completed?: unknown }).completed;
  if (!Array.isArray(completed)) return null;
  const ids: string[] = [];
  let unknown = 0;
  for (const id of completed) {
    if (typeof id !== "string") return null;
    if (isKnownProgressId(id)) ids.push(id);
    else unknown++;
  }
  return { ids, unknown };
}
