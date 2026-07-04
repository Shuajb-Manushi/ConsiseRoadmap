import { useMemo, useState } from "react";
import type { Route } from "../lib/useHashRoute";
import { R, resourcePurposes } from "../data/resourceCatalog";
import { topics } from "../data/topics";
import type { CatalogKey } from "../data/resourceCatalog";
import type { Resource } from "../data/types";
import "../styles/pages.css";

// Which topics recommend a given catalog resource (matched by catalog id,
// so deep-linked variants still count toward their canonical entry).
function buildUsage(): Map<string, { id: string; title: string }[]> {
  const byKey = new Map<string, { id: string; title: string }[]>();
  for (const t of topics) {
    const all = [
      ...t.resources.primary,
      ...t.resources.alternatives,
      ...t.resources.practice,
      ...t.resources.extra,
    ];
    const seen = new Set<string>();
    for (const r of all) {
      const key = r.id ?? r.url;
      if (seen.has(key)) continue;
      seen.add(key);
      (byKey.get(key) ?? byKey.set(key, []).get(key)!).push({ id: t.id, title: t.title });
    }
  }
  return byKey;
}

const TYPES = ["all", "course", "video", "interactive", "lab", "book", "documentation", "article", "reference"] as const;

export function ResourceLibrary({ navigate }: { navigate: (r: Route) => void }) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState<(typeof TYPES)[number]>("all");
  const usage = useMemo(() => buildUsage(), []);

  const q = query.trim().toLowerCase();

  return (
    <div className="container page">
      <button className="detail-back" onClick={() => navigate({ name: "roadmap" })}>← Back to roadmap</button>
      <header className="page-head">
        <h1>Resource Library</h1>
        <p className="page-lede">
          Every resource used across the roadmap, grouped by how you should use it: guided
          courses and videos to learn from, interactive tools to practice with, and references
          to look things up in. All hand-picked, verified, and free unless labelled otherwise.
          Links open in a new tab.
        </p>
      </header>

      <div className="reslib-controls">
        <input
          className="reslib-search"
          type="search"
          placeholder="Filter resources…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Filter resources"
        />
        <div className="reslib-types" role="group" aria-label="Filter by type">
          {TYPES.map((t) => (
            <button
              key={t}
              className={`reslib-type ${type === t ? "is-active" : ""}`}
              onClick={() => setType(t)}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {resourcePurposes.map((group) => {
        const entries = group.keys
          .map((key) => ({ key, r: R[key as CatalogKey] as Resource }))
          .filter(({ r }) => {
            if (type !== "all" && r.type !== type) return false;
            if (!q) return true;
            return (r.title + " " + r.note + " " + r.type + " " + (r.provider ?? "") + " " + (r.audience ?? ""))
              .toLowerCase()
              .includes(q);
          });
        if (entries.length === 0) return null;
        return (
          <section key={group.purpose} className="reslib-subject">
            <h2>{group.purpose}</h2>
            <p className="reslib-blurb">{group.blurb}</p>
            <div className="reslib-grid">
              {entries.map(({ key, r }) => {
                const used = usage.get(r.id ?? r.url) ?? [];
                return (
                  <div key={key} className="reslib-card">
                    <div className="reslib-card__top">
                      <span className="reslib-card__type">{r.type}</span>
                      <a className="reslib-card__open" href={r.url} target="_blank" rel="noopener noreferrer">
                        Open ↗<span className="visually-hidden"> {r.title} (new tab)</span>
                      </a>
                    </div>
                    <h3 className="reslib-card__title">{r.title}</h3>
                    {(r.provider || r.duration) && (
                      <p className="reslib-card__meta">
                        {r.provider}
                        {r.provider && r.duration ? " · " : ""}
                        {r.duration}
                      </p>
                    )}
                    <p className="reslib-card__note">{r.note}</p>
                    {r.audience && <p className="reslib-card__audience">Best for: {r.audience}</p>}
                    {used.length > 0 && (
                      <details className="reslib-card__used">
                        <summary>Used in {used.length} {used.length === 1 ? "topic" : "topics"}</summary>
                        <div className="reslib-card__used-list">
                          {used.slice(0, 12).map((u) => (
                            <button key={u.id} className="pill" onClick={() => navigate({ name: "topic", id: u.id })}>
                              {u.title}
                            </button>
                          ))}
                        </div>
                      </details>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
