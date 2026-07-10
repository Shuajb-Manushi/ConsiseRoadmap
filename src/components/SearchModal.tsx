import { useEffect, useMemo, useRef, useState } from "react";
import type { Route } from "../lib/useHashRoute";
import type { BranchId, Difficulty } from "../data/types";
import { searchCurriculum, type SearchFilters, type SearchDoc } from "../data/search";
import { branches } from "../data/branches";
import { useModal } from "../lib/useModal";
import { useProgress } from "../lib/useProgress";
import { SEARCH_PAGE_SIZE, visibleSlice, resultsStatus } from "../lib/searchPaging";
import "../styles/search.css";

const HOUR_OPTIONS = [
  { label: "Any length", value: null },
  { label: "≤ 6h", value: 6 },
  { label: "≤ 10h", value: 10 },
  { label: "≤ 16h", value: 16 },
];

/** Stable DOM id for a result option, used by aria-activedescendant. */
function optionId(doc: SearchDoc): string {
  return `sr-${doc.kind}-${doc.id}`;
}

export function SearchModal({
  onClose,
  navigate,
}: {
  onClose: () => void;
  navigate: (r: Route) => void;
}) {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<SearchFilters>({
    branch: "all",
    required: "all",
    difficulty: "all",
    maxHours: null,
    completion: "all",
  });
  const { done } = useProgress();
  const [active, setActive] = useState(0);
  const [visibleCount, setVisibleCount] = useState(SEARCH_PAGE_SIZE);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const { ref: overlayRef, suppressRestore } = useModal<HTMLDivElement>();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // The FULL result set — never silently truncated. Only rendering is paged.
  const results = useMemo(() => searchCurriculum(query, filters, done), [query, filters, done]);
  const visible = visibleSlice(results, visibleCount);

  useEffect(() => {
    setActive(0);
    setVisibleCount(SEARCH_PAGE_SIZE);
  }, [query, filters]);

  const go = (index: number) => {
    const doc = visible[index];
    if (!doc) return;
    // Closing because of navigation: the route-focus handler owns focus next,
    // not the button that opened the search.
    suppressRestore();
    navigate(doc.kind === "topic" ? { name: "topic", id: doc.id } : { name: "milestone", id: doc.id });
    onClose();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, visible.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      go(active);
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  // keep the active item scrolled into view
  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(`[data-index="${active}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const patch = (p: Partial<SearchFilters>) => setFilters((f) => ({ ...f, ...p }));

  const activeDoc = visible[active];
  const status = resultsStatus(results.length, visible.length);

  return (
    <div className="search-overlay" onMouseDown={onClose} role="presentation" ref={overlayRef}>
      <div
        className="search-modal"
        onMouseDown={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Search the curriculum"
        onKeyDown={onKeyDown}
      >
        <div className="search-input-row">
          <span className="search-input-row__icon" aria-hidden="true">⌕</span>
          <input
            ref={inputRef}
            className="search-input"
            type="text"
            placeholder="Search topics, concepts, projects, resources…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            role="combobox"
            aria-label="Search query"
            aria-expanded={visible.length > 0}
            aria-haspopup="listbox"
            aria-autocomplete="list"
            aria-controls="search-results"
            aria-activedescendant={activeDoc ? optionId(activeDoc) : undefined}
          />
          <button className="btn btn--sm btn--ghost" onClick={onClose} aria-label="Close search">Esc</button>
        </div>

        <div className="search-filters" role="group" aria-label="Filters">
          <label className="search-filter">
            <span>Branch</span>
            <select
              value={filters.branch}
              onChange={(e) => patch({ branch: e.target.value as BranchId | "all" })}
            >
              <option value="all">All branches</option>
              {branches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </label>
          <label className="search-filter">
            <span>Type</span>
            <select
              value={filters.required}
              onChange={(e) => patch({ required: e.target.value as SearchFilters["required"] })}
            >
              <option value="all">Required & optional</option>
              <option value="required">Required only</option>
              <option value="optional">Optional only</option>
            </select>
          </label>
          <label className="search-filter">
            <span>Difficulty</span>
            <select
              value={filters.difficulty}
              onChange={(e) => patch({ difficulty: e.target.value as Difficulty | "all" })}
            >
              <option value="all">Any level</option>
              <option value="foundation">Foundation</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </label>
          <label className="search-filter">
            <span>Progress</span>
            <select
              value={filters.completion}
              onChange={(e) => patch({ completion: e.target.value as SearchFilters["completion"] })}
            >
              <option value="all">Any progress</option>
              <option value="remaining">Still to do</option>
              <option value="completed">Completed</option>
            </select>
          </label>
          <label className="search-filter">
            <span>Hours</span>
            <select
              value={filters.maxHours ?? ""}
              onChange={(e) => patch({ maxHours: e.target.value === "" ? null : Number(e.target.value) })}
            >
              {HOUR_OPTIONS.map((o) => (
                <option key={o.label} value={o.value ?? ""}>{o.label}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="search-results-meta" role="status" aria-live="polite">
          {status}
        </div>

        {results.length === 0 && (
          <div className="search-empty">No matches. Try fewer or different words.</div>
        )}

        <ul
          className="search-results"
          id="search-results"
          ref={listRef}
          role="listbox"
          aria-label="Search results"
        >
          {visible.map((doc, i) => (
            <li
              key={`${doc.kind}:${doc.id}`}
              id={optionId(doc)}
              role="option"
              aria-selected={i === active}
              data-index={i}
              className={`search-result ${i === active ? "is-active" : ""}`}
              onClick={() => go(i)}
              onMouseMove={() => setActive(i)}
            >
              <span className="search-result__top">
                <span className={`search-result__kind search-result__kind--${doc.kind}`}>
                  {doc.kind === "milestone" ? "★ Milestone" : doc.branchName}
                </span>
                {doc.difficulty && <span className="search-result__diff">{doc.difficulty}</span>}
                {doc.estimatedHours > 0 && <span className="search-result__diff">~{doc.estimatedHours}h</span>}
              </span>
              <span className="search-result__title">
                {doc.title}
                {done.has(doc.id) && (
                  <>
                    <span className="search-result__done" aria-hidden="true"> ✓</span>
                    <span className="visually-hidden"> (completed)</span>
                  </>
                )}
              </span>
              <span className="search-result__summary">{doc.summary}</span>
            </li>
          ))}
        </ul>

        {results.length > visible.length && (
          <button
            className="btn btn--sm search-show-all"
            onClick={() => setVisibleCount(results.length)}
          >
            Show all {results.length} results
          </button>
        )}

        <div className="search-foot">
          <span><kbd>↑</kbd><kbd>↓</kbd> navigate</span>
          <span><kbd>↵</kbd> open</span>
          <span><kbd>Esc</kbd> close</span>
        </div>
      </div>
    </div>
  );
}
