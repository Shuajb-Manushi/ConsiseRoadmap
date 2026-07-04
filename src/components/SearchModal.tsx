import { useEffect, useMemo, useRef, useState } from "react";
import type { Route } from "../lib/useHashRoute";
import type { BranchId, Difficulty } from "../data/types";
import { searchCurriculum, type SearchFilters } from "../data/search";
import { branches } from "../data/branches";
import "../styles/search.css";

const HOUR_OPTIONS = [
  { label: "Any length", value: null },
  { label: "≤ 6h", value: 6 },
  { label: "≤ 10h", value: 10 },
  { label: "≤ 16h", value: 16 },
];

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
  });
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const results = useMemo(() => searchCurriculum(query, filters).slice(0, 40), [query, filters]);

  useEffect(() => {
    setActive(0);
  }, [query, filters]);

  const go = (index: number) => {
    const doc = results[index];
    if (!doc) return;
    navigate(doc.kind === "topic" ? { name: "topic", id: doc.id } : { name: "milestone", id: doc.id });
    onClose();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
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

  return (
    <div className="search-overlay" onMouseDown={onClose} role="presentation">
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
            aria-label="Search query"
            aria-controls="search-results"
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

        <div className="search-results-meta" aria-live="polite">
          {results.length} {results.length === 1 ? "result" : "results"}
        </div>

        <ul className="search-results" id="search-results" ref={listRef} role="listbox" aria-label="Results">
          {results.length === 0 && (
            <li className="search-empty">No matches. Try fewer or different words.</li>
          )}
          {results.map((doc, i) => (
            <li key={`${doc.kind}:${doc.id}`} role="option" aria-selected={i === active} data-index={i}>
              <button
                className={`search-result ${i === active ? "is-active" : ""}`}
                onClick={() => go(i)}
                onMouseEnter={() => setActive(i)}
              >
                <span className="search-result__top">
                  <span className={`search-result__kind search-result__kind--${doc.kind}`}>
                    {doc.kind === "milestone" ? "★ Milestone" : doc.branchName}
                  </span>
                  {doc.difficulty && <span className="search-result__diff">{doc.difficulty}</span>}
                  {doc.estimatedHours > 0 && <span className="search-result__diff">~{doc.estimatedHours}h</span>}
                </span>
                <span className="search-result__title">{doc.title}</span>
                <span className="search-result__summary">{doc.summary}</span>
              </button>
            </li>
          ))}
        </ul>

        <div className="search-foot">
          <span><kbd>↑</kbd><kbd>↓</kbd> navigate</span>
          <span><kbd>↵</kbd> open</span>
          <span><kbd>Esc</kbd> close</span>
        </div>
      </div>
    </div>
  );
}
