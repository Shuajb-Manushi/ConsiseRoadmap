import { useSyncExternalStore } from "react";
import { progressStore, type ProgressSnapshot } from "./progressStore";

/**
 * Reactive view of local progress. Components anywhere in the tree (eager or
 * lazy chunks) share the same external store, so a toggle on a detail page
 * updates the roadmap immediately without prop drilling.
 */
export function useProgress(): ProgressSnapshot {
  return useSyncExternalStore(
    progressStore.subscribe,
    progressStore.getSnapshot,
    progressStore.getSnapshot
  );
}
