import { isKnownProgressId, parseProgress, serializeProgress } from "./progress";

/**
 * Local-only progress state: one set of completed ids (topics + milestones)
 * plus a short list of recently opened topics. Persisted to localStorage when
 * available; falls back to in-memory state when it isn't (private browsing,
 * node tests), so the app never breaks without storage.
 *
 * Framework-free external store — React components consume it through
 * useProgress() (useSyncExternalStore), and it stays in the EAGER graph, so
 * it must only import lite curriculum data.
 */

const PROGRESS_KEY = "cr:progress";
const RECENT_KEY = "cr:recent";
const RECENT_LIMIT = 5;

export type ProgressSnapshot = {
  done: ReadonlySet<string>;
  recents: readonly string[];
};

function readStorage(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStorage(key: string, value: string | null): void {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  } catch {
    /* storage unavailable — keep the in-memory state */
  }
}

function loadDone(): Set<string> {
  const raw = readStorage(PROGRESS_KEY);
  if (!raw) return new Set();
  const parsed = parseProgress(raw);
  return new Set(parsed?.ids ?? []);
}

function loadRecents(): string[] {
  const raw = readStorage(RECENT_KEY);
  if (!raw) return [];
  try {
    const arr: unknown = JSON.parse(raw);
    if (!Array.isArray(arr)) return [];
    return arr
      .filter((id): id is string => typeof id === "string" && isKnownProgressId(id))
      .slice(0, RECENT_LIMIT);
  } catch {
    return [];
  }
}

let snapshot: ProgressSnapshot = { done: loadDone(), recents: loadRecents() };
const listeners = new Set<() => void>();

function commit(next: ProgressSnapshot): void {
  snapshot = next;
  for (const fn of listeners) fn();
}

function persistDone(done: ReadonlySet<string>): void {
  writeStorage(PROGRESS_KEY, done.size === 0 ? null : serializeProgress(done));
}

export const progressStore = {
  subscribe(fn: () => void): () => void {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },

  getSnapshot(): ProgressSnapshot {
    return snapshot;
  },

  isDone(id: string): boolean {
    return snapshot.done.has(id);
  },

  toggle(id: string): void {
    if (!isKnownProgressId(id)) return;
    const done = new Set(snapshot.done);
    done.has(id) ? done.delete(id) : done.add(id);
    persistDone(done);
    commit({ ...snapshot, done });
  },

  reset(): void {
    persistDone(new Set());
    writeStorage(RECENT_KEY, null);
    commit({ done: new Set(), recents: [] });
  },

  /** Merge valid topic ids into recents when importing a full learner backup. */
  importRecents(ids: readonly string[]): void {
    const recents = ids
      .filter((id) => isKnownProgressId(id))
      .filter((id, index, all) => all.indexOf(id) === index)
      .slice(0, RECENT_LIMIT);
    writeStorage(RECENT_KEY, JSON.stringify(recents));
    commit({ ...snapshot, recents });
  },

  /** Merge a parsed import into the current progress. Returns items added. */
  importJson(json: string): { added: number; total: number; unknown: number } | null {
    const parsed = parseProgress(json);
    if (!parsed) return null;
    const done = new Set(snapshot.done);
    let added = 0;
    for (const id of parsed.ids) {
      if (!done.has(id)) {
        done.add(id);
        added++;
      }
    }
    persistDone(done);
    commit({ ...snapshot, done });
    return { added, total: parsed.ids.length, unknown: parsed.unknown };
  },

  exportJson(): string {
    return serializeProgress(snapshot.done);
  },

  /** Record a visited topic at the front of the recents list. */
  recordRecent(id: string): void {
    if (!isKnownProgressId(id)) return;
    if (snapshot.recents[0] === id) return;
    const recents = [id, ...snapshot.recents.filter((r) => r !== id)].slice(0, RECENT_LIMIT);
    writeStorage(RECENT_KEY, JSON.stringify(recents));
    commit({ ...snapshot, recents });
  },
};

// Cross-tab sync: another tab changing progress updates this one live.
if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key === PROGRESS_KEY) commit({ ...snapshot, done: loadDone() });
    if (e.key === RECENT_KEY) commit({ ...snapshot, recents: loadRecents() });
  });
}
