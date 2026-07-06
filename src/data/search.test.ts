import { describe, it, expect } from "vitest";
import { searchCurriculum, searchDocs } from "./search";
import { topics } from "./topics";
import { milestones } from "./milestones";

describe("search index", () => {
  it("indexes every topic and milestone", () => {
    expect(searchDocs.length).toBe(topics.length + milestones.length);
  });

  it("finds topics by title", () => {
    const results = searchCurriculum("pointers");
    expect(results.some((r) => r.id === "c-pointers-arrays")).toBe(true);
  });

  it("finds topics by concept text", () => {
    // "birthday paradox" appears only in concept/lab text, not the title
    const results = searchCurriculum("birthday paradox");
    expect(results.some((r) => r.id === "cs-discrete-probability")).toBe(true);
  });

  it("finds topics by language / tool name", () => {
    expect(searchCurriculum("fastapi").some((r) => r.id === "db-fastapi")).toBe(true);
    expect(searchCurriculum("react").length).toBeGreaterThan(0);
  });

  it("finds topics by resource name", () => {
    // Valgrind is a resource-adjacent term appearing in the debugging tools topic
    const results = searchCurriculum("valgrind");
    expect(results.some((r) => r.id === "c-debug-tools")).toBe(true);
  });

  it("finds milestone projects", () => {
    const results = searchCurriculum("issue tracker");
    expect(results.some((r) => r.kind === "milestone")).toBe(true);
  });

  it("finds architecture topics by concept text", () => {
    expect(searchCurriculum("ports adapters").some((r) => r.id === "arch-boundaries")).toBe(true);
    expect(searchCurriculum("decision record").some((r) => r.id === "arch-evolution")).toBe(true);
    expect(searchCurriculum("idempotency").some((r) => r.id === "arch-reliability")).toBe(true);
  });

  it("finds architecture topics by resource name", () => {
    // "Modular Monoliths" is a resource title on the system-shapes topic
    const results = searchCurriculum("modular monolith");
    expect(results.some((r) => r.id === "arch-system-shapes")).toBe(true);
  });

  it("finds the architecture milestone", () => {
    const results = searchCurriculum("architecture evolution");
    expect(results.some((r) => r.id === "m-architecture-evolution" && r.kind === "milestone")).toBe(true);
  });

  it("applies the branch filter to the arch branch", () => {
    const results = searchCurriculum("", { branch: "arch" });
    expect(results.length).toBe(7);
    expect(results.every((r) => r.branch === "arch")).toBe(true);
  });

  it("requires all tokens to match (AND semantics)", () => {
    const results = searchCurriculum("hash table contact");
    expect(results.some((r) => r.id === "c-hash-tables")).toBe(true);
    // a nonsense combination matches nothing
    expect(searchCurriculum("pointers zzzznotarealword").length).toBe(0);
  });

  it("applies the branch filter", () => {
    const results = searchCurriculum("", { branch: "security" });
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((r) => r.branch === "security")).toBe(true);
  });

  it("applies the required/optional filter", () => {
    const optional = searchCurriculum("", { required: "optional" });
    expect(optional.length).toBeGreaterThan(0);
    expect(optional.every((r) => !r.required)).toBe(true);
  });

  it("applies the difficulty filter", () => {
    const foundation = searchCurriculum("", { difficulty: "foundation" });
    expect(foundation.every((r) => r.difficulty === "foundation")).toBe(true);
  });

  it("applies the max-hours filter", () => {
    const quick = searchCurriculum("", { maxHours: 6 });
    expect(quick.every((r) => r.estimatedHours <= 6)).toBe(true);
  });

  it("empty query returns everything", () => {
    expect(searchCurriculum("").length).toBe(searchDocs.length);
  });
});
