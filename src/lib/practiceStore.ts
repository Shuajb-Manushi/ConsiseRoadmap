import { focusStepTopicId } from "./focusPlan";
import { topicMetaById } from "../data/topics/lite";

const PRACTICE_KEY = "cr:practice";

export type PracticeSnapshot = {
  done: ReadonlySet<string>;
  notes: Readonly<Record<string, string>>;
};

export type PracticeData = {
  steps: string[];
  notes: Record<string, string>;
};

function validStep(id: string): boolean {
  const topicId = focusStepTopicId(id);
  return topicId !== null && topicMetaById.has(topicId);
}

export function parsePracticeData(value: unknown): PracticeData {
  if (typeof value !== "object" || value === null) return { steps: [], notes: {} };
  const raw = value as { steps?: unknown; notes?: unknown };
  const steps = Array.isArray(raw.steps)
    ? raw.steps.filter((id): id is string => typeof id === "string" && validStep(id))
    : [];
  const notes: Record<string, string> = {};
  if (typeof raw.notes === "object" && raw.notes !== null) {
    for (const [topicId, note] of Object.entries(raw.notes)) {
      if (topicMetaById.has(topicId) && typeof note === "string" && note.trim()) {
        notes[topicId] = note.slice(0, 12000);
      }
    }
  }
  return { steps: [...new Set(steps)], notes };
}

function load(): PracticeSnapshot {
  try {
    const raw = localStorage.getItem(PRACTICE_KEY);
    if (!raw) return { done: new Set(), notes: {} };
    const parsed = parsePracticeData(JSON.parse(raw));
    return { done: new Set(parsed.steps), notes: parsed.notes };
  } catch {
    return { done: new Set(), notes: {} };
  }
}

let snapshot: PracticeSnapshot = load();
const listeners = new Set<() => void>();

function persist(next: PracticeSnapshot): void {
  try {
    const data: PracticeData = { steps: [...next.done].sort(), notes: { ...next.notes } };
    if (data.steps.length === 0 && Object.keys(data.notes).length === 0) {
      localStorage.removeItem(PRACTICE_KEY);
    } else {
      localStorage.setItem(PRACTICE_KEY, JSON.stringify(data));
    }
  } catch {
    /* localStorage is optional; keep the in-memory copy */
  }
}

function commit(next: PracticeSnapshot): void {
  snapshot = next;
  for (const listener of listeners) listener();
}

export const practiceStore = {
  subscribe(listener: () => void): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  getSnapshot(): PracticeSnapshot {
    return snapshot;
  },
  toggleStep(id: string): void {
    if (!validStep(id)) return;
    const done = new Set(snapshot.done);
    done.has(id) ? done.delete(id) : done.add(id);
    const next = { ...snapshot, done };
    persist(next);
    commit(next);
  },
  setNote(topicId: string, note: string): void {
    if (!topicMetaById.has(topicId)) return;
    const notes = { ...snapshot.notes };
    const clean = note.slice(0, 12000);
    if (clean.trim()) notes[topicId] = clean;
    else delete notes[topicId];
    const next = { ...snapshot, notes };
    persist(next);
    commit(next);
  },
  exportData(): PracticeData {
    return { steps: [...snapshot.done].sort(), notes: { ...snapshot.notes } };
  },
  importData(value: unknown): { stepsAdded: number; notesAdded: number } {
    const parsed = parsePracticeData(value);
    const done = new Set(snapshot.done);
    let stepsAdded = 0;
    for (const id of parsed.steps) {
      if (!done.has(id)) {
        done.add(id);
        stepsAdded++;
      }
    }
    const notes = { ...snapshot.notes };
    let notesAdded = 0;
    for (const [topicId, note] of Object.entries(parsed.notes)) {
      if (!notes[topicId]) notesAdded++;
      notes[topicId] = note;
    }
    const next = { done, notes };
    persist(next);
    commit(next);
    return { stepsAdded, notesAdded };
  },
  reset(): void {
    const next = { done: new Set<string>(), notes: {} };
    persist(next);
    commit(next);
  },
};

if (typeof window !== "undefined") {
  window.addEventListener("storage", (event) => {
    if (event.key === PRACTICE_KEY) commit(load());
  });
}
