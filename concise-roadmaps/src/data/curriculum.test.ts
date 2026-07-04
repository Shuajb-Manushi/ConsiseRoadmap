import { describe, it, expect } from "vitest";
import { topics, topicById } from "./topics";
import { branches, branchById } from "./branches";
import { milestones } from "./milestones";
/**
 * These tests are the curriculum's integrity net. Failures are written to be
 * readable so a future contributor editing data can repair it without reading
 * the app code. If you add a topic and a test here goes red, the message tells
 * you exactly which id and field is wrong.
 */

describe("topic ids", () => {
  it("are unique", () => {
    const seen = new Map<string, number>();
    for (const t of topics) seen.set(t.id, (seen.get(t.id) ?? 0) + 1);
    const dupes = [...seen.entries()].filter(([, n]) => n > 1).map(([id]) => id);
    expect(dupes, `duplicate topic ids: ${dupes.join(", ")}`).toEqual([]);
  });

  it("are non-empty kebab-case", () => {
    const bad = topics.filter((t) => !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(t.id));
    expect(bad.map((t) => t.id), "ids must be kebab-case").toEqual([]);
  });
});

describe("prerequisite references", () => {
  it("all point to existing topics", () => {
    const problems: string[] = [];
    for (const t of topics) {
      for (const pre of t.prerequisiteIds) {
        if (!topicById.has(pre)) {
          problems.push(`topic "${t.id}" has unknown prerequisite "${pre}"`);
        }
      }
    }
    expect(problems, problems.join("\n")).toEqual([]);
  });

  it("no topic is its own prerequisite", () => {
    const self = topics.filter((t) => t.prerequisiteIds.includes(t.id));
    expect(self.map((t) => t.id), "topics listing themselves as prerequisite").toEqual([]);
  });
});

describe("nextIds (derived)", () => {
  it("all point to existing topics", () => {
    const problems: string[] = [];
    for (const t of topics) {
      for (const n of t.nextIds) {
        if (!topicById.has(n)) problems.push(`topic "${t.id}" -> unknown next "${n}"`);
      }
    }
    expect(problems, problems.join("\n")).toEqual([]);
  });

  it("are the inverse of prerequisiteIds", () => {
    // every next relationship must be backed by a prerequisite relationship
    const problems: string[] = [];
    for (const t of topics) {
      for (const n of t.nextIds) {
        const next = topicById.get(n)!;
        if (!next.prerequisiteIds.includes(t.id)) {
          problems.push(`"${t.id}".nextIds includes "${n}" but "${n}" doesn't list it as prerequisite`);
        }
      }
    }
    expect(problems, problems.join("\n")).toEqual([]);
  });
});

describe("prerequisite graph is acyclic", () => {
  it("has no cycles", () => {
    // DFS three-color cycle detection; report the actual cycle path.
    const WHITE = 0, GRAY = 1, BLACK = 2;
    const color = new Map<string, number>(topics.map((t) => [t.id, WHITE]));
    const stack: string[] = [];
    const found: { path: string[] | null } = { path: null };

    function visit(id: string): boolean {
      color.set(id, GRAY);
      stack.push(id);
      const t = topicById.get(id);
      if (t) {
        for (const pre of t.prerequisiteIds) {
          if (!topicById.has(pre)) continue; // handled by the reference test
          const c = color.get(pre);
          if (c === GRAY) {
            const from = stack.indexOf(pre);
            found.path = [...stack.slice(from), pre];
            return true;
          }
          if (c === WHITE && visit(pre)) return true;
        }
      }
      stack.pop();
      color.set(id, BLACK);
      return false;
    }

    for (const t of topics) {
      if (color.get(t.id) === WHITE && visit(t.id)) break;
    }
    expect(found.path, found.path ? `cycle: ${found.path.join(" -> ")}` : "").toBeNull();
  });
});

describe("required fields are populated", () => {
  const nonEmpty = (s: string | undefined) => typeof s === "string" && s.trim().length > 0;

  it("every topic has core text fields", () => {
    const problems: string[] = [];
    for (const t of topics) {
      if (!nonEmpty(t.title)) problems.push(`${t.id}: empty title`);
      if (!nonEmpty(t.summary)) problems.push(`${t.id}: empty summary`);
      if (!nonEmpty(t.whyItMatters)) problems.push(`${t.id}: empty whyItMatters`);
      if (t.estimatedHours <= 0) problems.push(`${t.id}: estimatedHours must be > 0`);
      if (!branchById.has(t.branch)) problems.push(`${t.id}: unknown branch "${t.branch}"`);
      if (t.concepts.length === 0) problems.push(`${t.id}: no concepts`);
      if (t.practicalUses.length === 0) problems.push(`${t.id}: no practicalUses`);
    }
    expect(problems, problems.join("\n")).toEqual([]);
  });

  it("every topic has a complete practical lab", () => {
    const problems: string[] = [];
    for (const t of topics) {
      const l = t.lab;
      if (!l) { problems.push(`${t.id}: missing lab`); continue; }
      if (!nonEmpty(l.title)) problems.push(`${t.id}: lab has no title`);
      if (!nonEmpty(l.scenario)) problems.push(`${t.id}: lab has no scenario`);
      if (!nonEmpty(l.outcome)) problems.push(`${t.id}: lab has no outcome`);
      if (l.requirements.length === 0) problems.push(`${t.id}: lab has no requirements`);
      if (l.checkpoints.length === 0) problems.push(`${t.id}: lab has no checkpoints`);
      if (l.hints.length === 0) problems.push(`${t.id}: lab has no hints`);
      if (l.validation.length === 0) problems.push(`${t.id}: lab has no validation steps`);
      if (l.solutionOutline.length === 0) problems.push(`${t.id}: lab has no solution outline`);
    }
    expect(problems, problems.join("\n")).toEqual([]);
  });

  it("every topic has mastery checks", () => {
    const problems = topics.filter((t) => t.masteryChecks.length === 0).map((t) => t.id);
    expect(problems, `topics without mastery checks: ${problems.join(", ")}`).toEqual([]);
  });
});

describe("resources", () => {
  it("required topics have at least one primary resource", () => {
    const problems = topics
      .filter((t) => t.required && t.resources.primary.length === 0)
      .map((t) => t.id);
    expect(problems, `required topics missing a primary resource: ${problems.join(", ")}`).toEqual([]);
  });

  it("every resource has a title, url, and note", () => {
    const problems: string[] = [];
    for (const t of topics) {
      for (const r of [...t.resources.primary, ...t.resources.alternatives]) {
        if (!r.title?.trim()) problems.push(`${t.id}: resource with empty title`);
        if (!/^https?:\/\//.test(r.url)) problems.push(`${t.id}: resource "${r.title}" has a non-http url`);
        if (!r.note?.trim()) problems.push(`${t.id}: resource "${r.title}" has no note`);
      }
    }
    expect(problems, problems.join("\n")).toEqual([]);
  });
});

describe("branches", () => {
  it("have unique ids and orders", () => {
    const ids = new Set(branches.map((b) => b.id));
    expect(ids.size).toBe(branches.length);
    const orders = new Set(branches.map((b) => b.order));
    expect(orders.size, "branch orders must be distinct").toBe(branches.length);
  });

  it("every branch has at least one topic", () => {
    const empty = branches.filter((b) => !topics.some((t) => t.branch === b.id));
    expect(empty.map((b) => b.id), `branches with no topics: ${empty.map((b) => b.id).join(", ")}`).toEqual([]);
  });
});

describe("milestones", () => {
  it("have unique ids", () => {
    const ids = milestones.map((m) => m.id);
    expect(new Set(ids).size, "duplicate milestone ids").toBe(ids.length);
  });

  it("reference only existing topics in unlockedBy", () => {
    const problems: string[] = [];
    for (const m of milestones) {
      for (const id of m.unlockedBy) {
        const known = topicById.has(id) || milestones.some((x) => x.id === id);
        if (!known) problems.push(`milestone "${m.id}" unlockedBy unknown "${id}"`);
      }
    }
    expect(problems, problems.join("\n")).toEqual([]);
  });

  it("integrate only existing branches", () => {
    const problems: string[] = [];
    for (const m of milestones) {
      for (const b of m.integrates) {
        if (!branchById.has(b)) problems.push(`milestone "${m.id}" integrates unknown branch "${b}"`);
      }
    }
    expect(problems, problems.join("\n")).toEqual([]);
  });

  it("have complete briefs", () => {
    const problems: string[] = [];
    for (const m of milestones) {
      if (!m.brief?.trim()) problems.push(`${m.id}: empty brief`);
      if (m.requirements.length === 0) problems.push(`${m.id}: no requirements`);
      if (m.checkpoints.length === 0) problems.push(`${m.id}: no checkpoints`);
      if (m.tests.length === 0) problems.push(`${m.id}: no tests`);
      if (m.solutionOutline.length === 0) problems.push(`${m.id}: no solution outline`);
      if (m.nonGoals.length === 0) problems.push(`${m.id}: no non-goals`);
    }
    expect(problems, problems.join("\n")).toEqual([]);
  });

  it("span multiple branches (as cross-cutting capstones)", () => {
    const singleBranch = milestones.filter((m) => m.integrates.length < 1);
    expect(singleBranch.map((m) => m.id), "milestones must integrate at least one branch").toEqual([]);
  });
});

describe("curriculum scope", () => {
  it("has 55-70 substantial topic clusters", () => {
    expect(topics.length).toBeGreaterThanOrEqual(55);
    expect(topics.length).toBeLessThanOrEqual(80);
  });

  it("has at least the ten required milestones", () => {
    expect(milestones.length).toBeGreaterThanOrEqual(10);
  });
});
