/**
 * Pure helpers for search-result paging. The search modal never silently
 * truncates: it renders a page of results, states "Showing X of N results",
 * and offers a control to reveal the rest. Pure so node tests can pin the
 * behavior without a DOM.
 */

export const SEARCH_PAGE_SIZE = 40;

/** The slice of results currently rendered. */
export function visibleSlice<T>(results: T[], visibleCount: number): T[] {
  return results.slice(0, Math.max(0, visibleCount));
}

/**
 * The status line shown above the results and announced via aria-live.
 * Always reflects the TRUE total, even when only a page is rendered.
 */
export function resultsStatus(total: number, visible: number): string {
  if (total === 0) return "No matches";
  if (visible < total) return `Showing ${visible} of ${total} results`;
  return `${total} ${total === 1 ? "result" : "results"}`;
}
