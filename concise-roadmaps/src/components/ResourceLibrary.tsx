import { useMemo, useState } from "react";
import type { Route } from "../lib/useHashRoute";
import { R, resourceSubjects } from "../data/resourceCatalog";
import { topics } from "../data/topics";
import type { CatalogKey } from "../data/resourceCatalog";
import "../styles/pages.css";

// Which topics recommend a given catalog resource (matched by URL).
function buildUsage(): Map<string, { id: string; title: string }[]> {
  const byUrl = new Map<string, { id: string; title: string }[]>();
  for (const t of topics) {
    const all = [...t.resources.primary, ...t.resources.alternatives];
    const seen = new Set<string>();
    for (const r of all) {
      if (seen.has(r.url)) continue;
      seen.add(r.url);
      (byUrl.get(r.url) ?? byUrl.set(r.url, []).get(r.url)!).push({ id: t.id, title: t.title });
    }
  }
  return byUrl;
}

const TYPES = ["all", "documentation", "course", "book", "video", "lab", "reference"] as const;

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
          Every resource used across the roadmap, grouped by subject. These are hand-picked and
          trustworthy — free wherever possible. Each note says what the resource is best for.
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

      {resourceSubjects.map((subject) => {
        const entries = subject.keys
          .map((key) => ({ key, r: R[key as CatalogKey] }))
          .filter(({ r }) => {
            if (type !== "all" && r.type !== type) return false;
            if (!q) return true;
            return (r.title + " " + r.note + " " + r.type).toLowerCase().includes(q);
          });
        if (entries.length === 0) return null;
        return (
          <section key={subject.subject} className="reslib-subject">
            <h2>{subject.subject}</h2>
            <div className="reslib-grid">
              {entries.map(({ key, r }) => {
                const used = usage.get(r.url) ?? [];
                return (
                  <div key={key} className="reslib-card">
                    <div className="reslib-card__top">
                      <span className="reslib-card__type">{r.type}</span>
                      <a className="reslib-card__open" href={r.url} target="_blank" rel="noopener noreferrer">
                        Open ↗<span className="visually-hidden"> {r.title} (new tab)</span>
                      </a>
                    </div>
                    <h3 className="reslib-card__title">{r.title}</h3>
                    <p className="reslib-card__note">{r.note}</p>
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
