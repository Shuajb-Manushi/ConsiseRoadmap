import { beforeEach, describe, expect, it } from "vitest";
import { exportLearnerData, importLearnerData, resetLearnerData } from "./learnerData";
import { practiceStore } from "./practiceStore";
import { progressStore } from "./progressStore";

describe("portable learner data", () => {
  beforeEach(() => resetLearnerData());

  it("exports and restores completions, session evidence, notes, and recents", () => {
    progressStore.toggle("code-to-program");
    progressStore.recordRecent("code-to-program");
    practiceStore.toggleStep("learn:code-to-program");
    practiceStore.setNote("code-to-program", "The linker resolves symbols.");

    const backup = exportLearnerData();
    resetLearnerData();
    const result = importLearnerData(backup);

    expect(result).toEqual({
      completedAdded: 1,
      sessionStepsAdded: 1,
      notesAdded: 1,
      unknown: 0,
    });
    expect(progressStore.isDone("code-to-program")).toBe(true);
    expect(progressStore.getSnapshot().recents).toEqual(["code-to-program"]);
    expect(practiceStore.getSnapshot().done.has("learn:code-to-program")).toBe(true);
    expect(practiceStore.getSnapshot().notes["code-to-program"]).toContain("linker");
  });

  it("accepts the previous completion-only export format", () => {
    const result = importLearnerData(
      JSON.stringify({ version: 1, completed: ["code-to-program"] })
    );
    expect(result?.completedAdded).toBe(1);
    expect(result?.sessionStepsAdded).toBe(0);
    expect(progressStore.isDone("code-to-program")).toBe(true);
  });
});
