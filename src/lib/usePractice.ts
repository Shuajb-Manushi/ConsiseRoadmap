import { useSyncExternalStore } from "react";
import { practiceStore, type PracticeSnapshot } from "./practiceStore";

export function usePractice(): PracticeSnapshot {
  return useSyncExternalStore(
    practiceStore.subscribe,
    practiceStore.getSnapshot,
    practiceStore.getSnapshot
  );
}
