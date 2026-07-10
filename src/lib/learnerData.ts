import { parseProgress } from "./progress";
import { progressStore } from "./progressStore";
import { practiceStore } from "./practiceStore";

export type LearnerDataImport = {
  completedAdded: number;
  sessionStepsAdded: number;
  notesAdded: number;
  unknown: number;
};

export function exportLearnerData(): string {
  const progress = progressStore.getSnapshot();
  return JSON.stringify(
    {
      version: 2,
      exportedAt: new Date().toISOString(),
      completed: [...progress.done].sort(),
      recents: [...progress.recents],
      practice: practiceStore.exportData(),
    },
    null,
    2
  );
}

export function importLearnerData(json: string): LearnerDataImport | null {
  let raw: unknown;
  try {
    raw = JSON.parse(json);
  } catch {
    return null;
  }
  const progress = parseProgress(json);
  if (!progress || typeof raw !== "object" || raw === null) return null;
  const before = progressStore.getSnapshot().done.size;
  progressStore.importJson(json);
  const completedAdded = progressStore.getSnapshot().done.size - before;
  const record = raw as { recents?: unknown; practice?: unknown };
  if (Array.isArray(record.recents)) {
    progressStore.importRecents(record.recents.filter((id): id is string => typeof id === "string"));
  }
  const practice = practiceStore.importData(record.practice);
  return {
    completedAdded,
    sessionStepsAdded: practice.stepsAdded,
    notesAdded: practice.notesAdded,
    unknown: progress.unknown,
  };
}

export function resetLearnerData(): void {
  progressStore.reset();
  practiceStore.reset();
}
