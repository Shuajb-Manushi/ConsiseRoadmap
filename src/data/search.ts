import type { BranchId, Difficulty } from "./types";
import { topics } from "./topics";
import { milestones } from "./milestones";
import { branchById } from "./branches";

export type SearchResultKind = "topic" | "milestone";

export type SearchDoc = {
  id: string;
  kind: SearchResultKind;
  title: string;
  branch: BranchId | null;
  branchName: string;
  required: boolean;
  difficulty: Difficulty | null;
  estimatedHours: number;
  summary: string;
  /** Lowercased haystack of all searchable text. */
  haystack: string;
  /** Distinct tokens that matched, surfaced in the UI. */
  keywords: string[];
};

function build(): SearchDoc[] {
  const docs: SearchDoc[] = [];

  for (const t of topics) {
    const branchName = branchById.get(t.branch)?.name ?? t.branch;
    const parts = [
      t.title,
      t.summary,
      t.whyItMatters,
      ...t.concepts,
      ...t.practicalUses,
      ...t.masteryChecks,
      t.lab.title,
      t.lab.scenario,
      branchName,
      // resource names are searchable per the spec
      ...t.resources.primary.map((r) => r.title),
      ...t.resources.alternatives.map((r) => r.title),
      ...t.resources.practice.map((r) => r.title),
      ...t.resources.extra.map((r) => r.title),
    ];
    docs.push({
      id: t.id,
      kind: "topic",
      title: t.title,
      branch: t.branch,
      branchName,
      required: t.required,
      difficulty: t.difficulty,
      estimatedHours: t.estimatedHours,
      summary: t.summary,
      haystack: parts.join(" • ").toLowerCase(),
      keywords: dedupeKeywords([...t.concepts, ...t.practicalUses]),
    });
  }

  for (const m of milestones) {
    const branchNames = m.integrates.map((b) => branchById.get(b)?.name ?? b);
    const parts = [
      m.title,
      m.brief,
      ...m.requirements,
      ...m.architecture,
      ...branchNames,
    ];
    docs.push({
      id: m.id,
      kind: "milestone",
      title: m.title,
      branch: null,
      branchName: branchNames.join(", "),
      required: true,
      difficulty: null,
      estimatedHours: 0,
      summary: m.brief,
      haystack: parts.join(" • ").toLowerCase(),
      keywords: dedupeKeywords(branchNames),
    });
  }

  return docs;
}

function dedupeKeywords(items: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const item of items) {
    const key = item.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      out.push(item);
    }
  }
  return out.slice(0, 8);
}

export const searchDocs: SearchDoc[] = build();

export type SearchFilters = {
  branch?: BranchId | "all";
  required?: "all" | "required" | "optional";
  difficulty?: Difficulty | "all";
  maxHours?: number | null;
  /** Filter by local completion state; needs the `done` set to have effect. */
  completion?: "all" | "completed" | "remaining";
};

/**
 * Token-AND search: every whitespace-separated query token must appear
 * somewhere in the document. Empty query returns all docs (filtered).
 * `done` is the caller's local completion set — search data itself stays
 * progress-free so the index can be built once.
 */
export function searchCurriculum(
  query: string,
  filters: SearchFilters = {},
  done: ReadonlySet<string> = new Set()
): SearchDoc[] {
  const tokens = query.trim().toLowerCase().split(/\s+/).filter(Boolean);

  return searchDocs.filter((doc) => {
    if (filters.branch && filters.branch !== "all") {
      // milestones (branch null) only match the "all" branch filter
      if (doc.branch !== filters.branch) return false;
    }
    if (filters.required && filters.required !== "all") {
      const wantRequired = filters.required === "required";
      if (doc.required !== wantRequired) return false;
    }
    if (filters.difficulty && filters.difficulty !== "all") {
      if (doc.difficulty !== filters.difficulty) return false;
    }
    if (filters.maxHours != null) {
      if (doc.estimatedHours > filters.maxHours) return false;
    }
    if (filters.completion && filters.completion !== "all") {
      if ((filters.completion === "completed") !== done.has(doc.id)) return false;
    }
    return tokens.every((tok) => doc.haystack.includes(tok));
  });
}
