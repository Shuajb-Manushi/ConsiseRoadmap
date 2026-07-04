import type { BranchId } from "../data/types";

/** Maps a branch id to its CSS custom-property accent color. */
export function branchVar(branch: BranchId): string {
  return `var(--b-${branch})`;
}
