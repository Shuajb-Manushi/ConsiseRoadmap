import { describe, it, expect } from "vitest";
import {
  guidedPhases,
  flattenGuided,
  guidedMilestonePlacements,
  knownMilestoneIds,
} from "./phases";
import { topics, topicById } from "./topics";
import { milestones } from "./milestones";

/**
 * Integrity net for the GUIDED roadmap. Messages name the exact id/phase so a
 * contributor editing phases.ts can repair it without reading UI code.
 */

describe("guided roadmap — topic references", () => {
  it("every referenced topic id exists", () => {
    const problems: string[] = [];
    for (const e of flattenGuided()) {
      if (!topicById.has(e.topicId)) {
        problems.push(`phase "${e.phaseId}" references unknown topic "${e.topicId}"`);
      }
    }
    expect(problems, problems.join("\n")).toEqual([]);
  });

  it("every topic appears exactly once", () => {
    const counts = new Map<string, number>();
    for (const e of flattenGuided()) counts.set(e.topicId, (counts.get(e.topicId) ?? 0) + 1);
    const dupes = [...counts.entries()].filter(([, n]) => n > 1).map(([id]) => id);
    expect(dupes, `topics listed more than once: ${dupes.join(", ")}`).toEqual([]);
  });

  it("includes every curriculum topic (all reachable)", () => {
    const inGuided = new Set(flattenGuided().map((e) => e.topicId));
    const missing = topics.filter((t) => !inGuided.has(t.id)).map((t) => t.id);
    expect(missing, `topics missing from the guided roadmap: ${missing.join(", ")}`).toEqual([]);
  });

  it("includes every REQUIRED topic exactly once", () => {
    const flat = flattenGuided();
    const requiredIds = new Set(topics.filter((t) => t.required).map((t) => t.id));
    const problems: string[] = [];
    for (const id of requiredIds) {
      const n = flat.filter((e) => e.topicId === id).length;
      if (n !== 1) problems.push(`required topic "${id}" appears ${n} times (expected 1)`);
    }
    expect(problems, problems.join("\n")).toEqual([]);
  });
});

describe("guided roadmap — ordering is a topological sort", () => {
  it("no topic appears before one of its required prerequisites", () => {
    const flat = flattenGuided();
    const indexOf = new Map(flat.map((e, i) => [e.topicId, i]));
    const problems: string[] = [];
    for (const e of flat) {
      const topic = topicById.get(e.topicId);
      if (!topic) continue;
      for (const pre of topic.prerequisiteIds) {
        if (!indexOf.has(pre)) continue; // unknown prereqs caught elsewhere
        if (indexOf.get(pre)! > indexOf.get(e.topicId)!) {
          problems.push(
            `"${e.topicId}" appears before its prerequisite "${pre}" (fix phase order in phases.ts)`
          );
        }
      }
    }
    expect(problems, problems.join("\n")).toEqual([]);
  });
});

describe("guided roadmap — milestones", () => {
  it("every placed milestone id exists", () => {
    const problems = guidedMilestonePlacements()
      .filter((p) => !knownMilestoneIds.has(p.milestoneId))
      .map((p) => `unknown milestone "${p.milestoneId}"`);
    expect(problems, problems.join("\n")).toEqual([]);
  });

  it("every milestone is placed exactly once", () => {
    const placed = guidedMilestonePlacements().map((p) => p.milestoneId);
    const counts = new Map<string, number>();
    for (const id of placed) counts.set(id, (counts.get(id) ?? 0) + 1);
    const problems: string[] = [];
    for (const m of milestones) {
      const n = counts.get(m.id) ?? 0;
      if (n !== 1) problems.push(`milestone "${m.id}" is placed ${n} times (expected 1)`);
    }
    expect(problems, problems.join("\n")).toEqual([]);
  });

  it("each milestone's unlocking topics all appear at or before its phase", () => {
    const flat = flattenGuided();
    const phaseOfTopic = new Map(flat.map((e) => [e.topicId, e.phaseIndex]));
    const placements = new Map(guidedMilestonePlacements().map((p) => [p.milestoneId, p.phaseIndex]));
    const problems: string[] = [];
    for (const m of milestones) {
      const mPhase = placements.get(m.id);
      if (mPhase == null) continue;
      for (const dep of m.unlockedBy) {
        // milestones can be unlocked by other milestones; only check topics here
        if (!topicById.has(dep)) continue;
        const depPhase = phaseOfTopic.get(dep);
        if (depPhase == null) {
          problems.push(`milestone "${m.id}" needs "${dep}" which is not in the guided roadmap`);
        } else if (depPhase > mPhase) {
          problems.push(
            `milestone "${m.id}" (phase ${mPhase}) is placed before its unlocking topic "${dep}" (phase ${depPhase})`
          );
        }
      }
    }
    expect(problems, problems.join("\n")).toEqual([]);
  });
});

describe("guided roadmap — phases", () => {
  it("phase numbers are sequential and unique", () => {
    const numbers = guidedPhases.map((p) => p.number);
    expect(numbers).toEqual(numbers.map((_, i) => i + 1));
  });

  it("every phase has required copy fields", () => {
    const problems: string[] = [];
    for (const p of guidedPhases) {
      if (!p.title.trim()) problems.push(`${p.id}: empty title`);
      if (!p.whyNow.trim()) problems.push(`${p.id}: empty whyNow`);
      if (!p.nextDirection.trim()) problems.push(`${p.id}: empty nextDirection`);
      if (p.topicIds.length === 0) problems.push(`${p.id}: no topics`);
      if (p.branches.length === 0) problems.push(`${p.id}: no branches`);
    }
    expect(problems, problems.join("\n")).toEqual([]);
  });
});
