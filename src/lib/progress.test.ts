import { describe, it, expect } from "vitest";
import {
  guidedTrunkIds,
  isKnownProgressId,
  phaseProgress,
  sideBranchProgress,
  overallProgress,
  progressCounts,
  milestoneReadiness,
  prereqProgress,
  nextUpId,
  resumeTargetId,
  phaseOfTopic,
  firstIncompletePhaseId,
  guidedNeighbors,
  serializeProgress,
  parseProgress,
} from "./progress";
import { progressStore } from "./progressStore";
import { guidedPhases } from "../data/phases";
import { topicMetaById, topicsLite } from "../data/topics/lite";
import { milestonesLite } from "../data/milestonesLite";

/**
 * Progress derivations run in node (no localStorage, no window) over the real
 * lite curriculum — the same data the UI uses, so these tests also guard the
 * assumptions the progress UI relies on (e.g. all trunk topics are required).
 */

const none: ReadonlySet<string> = new Set();

describe("guided trunk assumptions", () => {
  it("every trunk topic is required (so trunk % = required %)", () => {
    const optionalOnTrunk = guidedTrunkIds.filter((id) => !topicMetaById.get(id)?.required);
    expect(optionalOnTrunk, optionalOnTrunk.join(", ")).toEqual([]);
  });

  it("every optional topic lives on a side branch, not the trunk", () => {
    const trunk = new Set(guidedTrunkIds);
    const misplaced = topicsLite.filter((t) => !t.required && trunk.has(t.id));
    expect(misplaced.map((t) => t.id)).toEqual([]);
  });
});

describe("phase and overall progress", () => {
  const phase1 = guidedPhases[0];

  it("empty progress is 0% everywhere", () => {
    expect(phaseProgress(none, phase1)).toEqual({ done: 0, total: phase1.topicIds.length, pct: 0 });
    expect(overallProgress(none).done).toBe(0);
    expect(overallProgress(none).total).toBe(guidedTrunkIds.length);
  });

  it("counts only completed trunk topics of that phase", () => {
    const done = new Set([phase1.topicIds[0], phase1.topicIds[1], "not-a-real-id"]);
    const p = phaseProgress(done, phase1);
    expect(p.done).toBe(2);
    expect(p.pct).toBe(Math.round((2 / phase1.topicIds.length) * 100));
  });

  it("a fully completed phase reports 100%", () => {
    expect(phaseProgress(new Set(phase1.topicIds), phase1).pct).toBe(100);
  });

  it("milestones never count toward topic percentages", () => {
    const done = new Set(milestonesLite.map((m) => m.id));
    expect(overallProgress(done).done).toBe(0);
  });

  it("side branches are measured separately from the trunk", () => {
    const backend = guidedPhases.find((p) => p.id === "backend")!;
    const mobile = backend.sideBranches![0];
    const done = new Set(mobile.topicIds);
    expect(sideBranchProgress(done, mobile).pct).toBe(100);
    expect(phaseProgress(done, backend).done).toBe(0);
  });

  it("progressCounts separates topics from milestones", () => {
    const done = new Set([guidedTrunkIds[0], milestonesLite[0].id]);
    expect(progressCounts(done)).toEqual({ topics: 1, milestones: 1 });
  });
});

describe("milestone readiness", () => {
  it("reports each unlocking requirement with its completion state", () => {
    const m = milestonesLite.find((x) => x.id === "m-c-database")!;
    const done = new Set([m.unlockedBy[0]]);
    const r = milestoneReadiness(done, m);
    expect(r.total).toBe(m.unlockedBy.length);
    expect(r.done).toBe(1);
    expect(r.ready).toBe(false);
    expect(r.entries[0]).toMatchObject({ id: m.unlockedBy[0], done: true, kind: "topic" });
  });

  it("handles milestone ids inside unlockedBy (security capstone)", () => {
    const capstone = milestonesLite.find((x) => x.id === "m-security-capstone")!;
    expect(capstone.unlockedBy).toContain("m-fullstack-issue-tracker");
    const almostDone = new Set(capstone.unlockedBy.filter((id) => id !== "m-fullstack-issue-tracker"));
    const r = milestoneReadiness(almostDone, capstone);
    expect(r.ready).toBe(false);
    const missing = r.entries.find((e) => !e.done)!;
    expect(missing).toMatchObject({
      id: "m-fullstack-issue-tracker",
      kind: "milestone",
      title: "Full-Stack Issue Tracker",
    });
    expect(milestoneReadiness(new Set(capstone.unlockedBy), capstone).ready).toBe(true);
  });

  it("every milestone becomes ready when all its requirements are done", () => {
    for (const m of milestonesLite) {
      expect(milestoneReadiness(new Set(m.unlockedBy), m).ready).toBe(true);
    }
  });
});

describe("next up / resume", () => {
  it("suggests the very first guided topic for a fresh learner", () => {
    expect(nextUpId(none)).toBe(guidedTrunkIds[0]);
    expect(nextUpId(none)).toBe("code-to-program");
  });

  it("skips completed topics in guided order", () => {
    const done = new Set(guidedTrunkIds.slice(0, 3));
    expect(nextUpId(done)).toBe(guidedTrunkIds[3]);
  });

  it("returns null when the whole trunk is complete", () => {
    expect(nextUpId(new Set(guidedTrunkIds))).toBeNull();
  });

  it("resume prefers the last opened incomplete topic", () => {
    const recent = guidedTrunkIds[10];
    expect(resumeTargetId(none, [recent])).toBe(recent);
  });

  it("resume falls back to next-up when the recent topic is already done", () => {
    const recent = guidedTrunkIds[10];
    expect(resumeTargetId(new Set([recent]), [recent])).toBe(guidedTrunkIds[0]);
  });

  it("firstIncompletePhaseId points at the phase of the next topic", () => {
    expect(firstIncompletePhaseId(none)).toBe(guidedPhases[0].id);
    const phase1Done = new Set(guidedPhases[0].topicIds);
    expect(firstIncompletePhaseId(phase1Done)).toBe(guidedPhases[1].id);
    expect(firstIncompletePhaseId(new Set(guidedTrunkIds))).toBe(guidedPhases[0].id);
  });
});

describe("guided neighbors (prev/next navigation)", () => {
  it("first trunk topic has no previous; last has no next", () => {
    const first = guidedNeighbors(guidedTrunkIds[0]);
    expect(first.prevId).toBeNull();
    expect(first.nextId).toBe(guidedTrunkIds[1]);
    const last = guidedNeighbors(guidedTrunkIds[guidedTrunkIds.length - 1]);
    expect(last.nextId).toBeNull();
  });

  it("steps across phase boundaries on the trunk", () => {
    const lastOfPhase1 = guidedPhases[0].topicIds[guidedPhases[0].topicIds.length - 1];
    expect(guidedNeighbors(lastOfPhase1).nextId).toBe(guidedPhases[1].topicIds[0]);
  });

  it("side-branch topics navigate within their branch only", () => {
    const backend = guidedPhases.find((p) => p.id === "backend")!;
    const mobile = backend.sideBranches![0];
    const first = guidedNeighbors(mobile.topicIds[0]);
    expect(first.prevId).toBeNull();
    expect(first.nextId).toBe(mobile.topicIds[1]);
    expect(first.label).toContain("optional");
    const last = guidedNeighbors(mobile.topicIds[mobile.topicIds.length - 1]);
    expect(last.nextId).toBeNull();
  });

  it("labels trunk topics with their phase position", () => {
    const secondOfPhase1 = guidedPhases[0].topicIds[1];
    expect(guidedNeighbors(secondOfPhase1).label).toBe(
      `Phase 1 · 2 of ${guidedPhases[0].topicIds.length}`
    );
  });

  it("phaseOfTopic finds trunk and side topics, null for unknown ids", () => {
    expect(phaseOfTopic(guidedTrunkIds[0])?.id).toBe(guidedPhases[0].id);
    expect(phaseOfTopic("mobile-react-native")?.id).toBe("backend");
    expect(phaseOfTopic("nope")).toBeNull();
  });
});

describe("prerequisite progress", () => {
  it("reports completed / total prerequisites", () => {
    const withPrereqs = topicsLite.find((t) => t.prerequisiteIds.length >= 2)!;
    const done = new Set([withPrereqs.prerequisiteIds[0]]);
    const p = prereqProgress(done, withPrereqs);
    expect(p.done).toBe(1);
    expect(p.total).toBe(withPrereqs.prerequisiteIds.length);
  });
});

describe("serialization", () => {
  it("round-trips through export and parse", () => {
    const done = new Set([guidedTrunkIds[0], guidedTrunkIds[1], milestonesLite[0].id]);
    const parsed = parseProgress(serializeProgress(done));
    expect(parsed).not.toBeNull();
    expect(new Set(parsed!.ids)).toEqual(done);
    expect(parsed!.unknown).toBe(0);
  });

  it("drops and counts unknown ids instead of failing", () => {
    const json = JSON.stringify({ version: 1, completed: ["code-to-program", "ghost-topic"] });
    expect(parseProgress(json)).toEqual({ ids: ["code-to-program"], unknown: 1 });
  });

  it("rejects malformed payloads", () => {
    expect(parseProgress("not json")).toBeNull();
    expect(parseProgress("42")).toBeNull();
    expect(parseProgress(JSON.stringify({ completed: "nope" }))).toBeNull();
    expect(parseProgress(JSON.stringify({ completed: [7] }))).toBeNull();
  });

  it("isKnownProgressId accepts topics and milestones, rejects junk", () => {
    expect(isKnownProgressId("code-to-program")).toBe(true);
    expect(isKnownProgressId("m-c-database")).toBe(true);
    expect(isKnownProgressId("bogus")).toBe(false);
  });
});

describe("progress store without localStorage (node)", () => {
  it("toggles, imports, exports, and resets purely in memory", () => {
    expect(progressStore.getSnapshot().done.size).toBe(0);

    progressStore.toggle("code-to-program");
    expect(progressStore.isDone("code-to-program")).toBe(true);
    progressStore.toggle("bogus-id"); // ignored
    expect(progressStore.getSnapshot().done.size).toBe(1);

    const imported = progressStore.importJson(
      JSON.stringify({ version: 1, completed: ["code-to-program", "git-github", "ghost"] })
    );
    expect(imported).toEqual({ added: 1, total: 2, unknown: 1 });

    const exported = parseProgress(progressStore.exportJson())!;
    expect(new Set(exported.ids)).toEqual(new Set(["code-to-program", "git-github"]));

    progressStore.recordRecent("git-github");
    progressStore.recordRecent("code-to-program");
    progressStore.recordRecent("code-to-program"); // deduped
    expect(progressStore.getSnapshot().recents).toEqual(["code-to-program", "git-github"]);

    let notified = 0;
    const unsub = progressStore.subscribe(() => notified++);
    progressStore.reset();
    unsub();
    expect(notified).toBe(1);
    expect(progressStore.getSnapshot().done.size).toBe(0);
    expect(progressStore.getSnapshot().recents).toEqual([]);
  });
});
