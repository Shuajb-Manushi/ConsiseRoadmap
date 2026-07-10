import { describe, expect, it } from "vitest";
import { topicById } from "../data/topics";
import { createFocusPlan, focusStepTopicId } from "./focusPlan";
import { parsePracticeData, practiceStore } from "./practiceStore";

const topic = topicById.get("code-to-program")!;

describe("focus plan", () => {
  it("turns a fresh topic into an exact Learn → Build → Prove hour", () => {
    const plan = createFocusPlan(topic, new Set());
    expect(plan.totalMinutes).toBe(60);
    expect(plan.steps.map((step) => step.phase)).toEqual(["learn", "build", "prove"]);
    expect(plan.steps.reduce((sum, step) => sum + step.minutes, 0)).toBe(60);
    expect(plan.steps[0].instruction).toBe(topic.resources.primary[0].guidance);
    expect(plan.steps[1].instruction).toBe(topic.lab.checkpoints[0]);
    expect(plan.steps[2].instruction).toBe(topic.masteryChecks[0]);
  });

  it("advances to the next real checkpoint and shifts time toward building", () => {
    const done = new Set([
      `learn:${topic.id}`,
      `build:${topic.id}:0`,
      `prove:${topic.id}:0`,
    ]);
    const plan = createFocusPlan(topic, done);
    expect(plan.steps.map((step) => step.minutes)).toEqual([10, 40, 10]);
    expect(plan.checkpointIndex).toBe(1);
    expect(plan.masteryIndex).toBe(1);
    expect(plan.steps[1].instruction).toBe(topic.lab.checkpoints[1]);
  });

  it("moves from checkpoints into the curriculum's validation list", () => {
    const done = new Set<string>([`learn:${topic.id}`]);
    topic.lab.checkpoints.forEach((_, index) => done.add(`build:${topic.id}:${index}`));
    const plan = createFocusPlan(topic, done);
    expect(plan.checkpointIndex).toBeNull();
    expect(plan.steps[1].id).toBe(`validate:${topic.id}:0`);
    expect(plan.steps[1].instruction).toBe(topic.lab.validation[0]);
  });

  it("recognizes only supported step families", () => {
    expect(focusStepTopicId("build:code-to-program:2")).toBe("code-to-program");
    expect(focusStepTopicId("anything:code-to-program:2")).toBeNull();
  });
});

describe("practice data", () => {
  it("drops unknown steps and notes while keeping valid learner work", () => {
    expect(
      parsePracticeData({
        steps: ["learn:code-to-program", "build:ghost:0"],
        notes: { "code-to-program": "My model", ghost: "no" },
      })
    ).toEqual({
      steps: ["learn:code-to-program"],
      notes: { "code-to-program": "My model" },
    });
  });

  it("works without localStorage and resets all session data", () => {
    practiceStore.toggleStep("learn:code-to-program");
    practiceStore.setNote("code-to-program", "Compilation is a pipeline.");
    expect(practiceStore.getSnapshot().done.has("learn:code-to-program")).toBe(true);
    expect(practiceStore.getSnapshot().notes["code-to-program"]).toContain("pipeline");
    practiceStore.reset();
    expect(practiceStore.getSnapshot().done.size).toBe(0);
    expect(practiceStore.getSnapshot().notes).toEqual({});
  });
});
