import { describe, it, expect } from "vitest";
import { SEARCH_PAGE_SIZE, visibleSlice, resultsStatus } from "./searchPaging";

describe("search paging", () => {
  const items = Array.from({ length: 123 }, (_, i) => i);

  it("renders one page but never hides the true total in the status", () => {
    const visible = visibleSlice(items, SEARCH_PAGE_SIZE);
    expect(visible.length).toBe(40);
    expect(resultsStatus(items.length, visible.length)).toBe("Showing 40 of 123 results");
  });

  it("reports the plain count once everything is visible", () => {
    const visible = visibleSlice(items, items.length);
    expect(visible.length).toBe(123);
    expect(resultsStatus(items.length, visible.length)).toBe("123 results");
  });

  it("does not truncate result sets at or under the page size", () => {
    expect(visibleSlice(items.slice(0, 40), SEARCH_PAGE_SIZE).length).toBe(40);
    expect(resultsStatus(40, 40)).toBe("40 results");
    expect(resultsStatus(1, 1)).toBe("1 result");
  });

  it("announces empty result sets", () => {
    expect(visibleSlice([], SEARCH_PAGE_SIZE)).toEqual([]);
    expect(resultsStatus(0, 0)).toBe("No matches");
  });

  it("expanding the visible count reaches every match", () => {
    const expanded = visibleSlice(items, 123);
    expect(expanded).toEqual(items);
  });
});
