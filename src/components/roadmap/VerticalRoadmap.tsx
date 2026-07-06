import type { Route } from "../../lib/useHashRoute";
import { branches } from "../../data/branches";
import { topicsLiteByBranch, topicMetaById } from "../../data/topics/lite";
import { milestonesLite } from "../../data/milestonesLite";

/**
 * The mobile-first vertical roadmap. Branches become sections; topics are an
 * ordered spine within each. Prerequisites (including cross-branch) are shown
 * as inline references so the branching structure is preserved without a
 * pannable canvas. Also used on desktop as the accessible "browse all" list.
 */
export function VerticalRoadmap({ navigate }: { navigate: (r: Route) => void }) {
  return (
    <div className="vroadmap">
      {branches.map((branch) => {
        const list = (topicsLiteByBranch[branch.id] ?? []).slice().sort((a, b) => a.stage - b.stage);
        if (list.length === 0) return null;
        return (
          <section
            key={branch.id}
            className="vbranch"
            style={{ ["--node-accent" as string]: `var(--b-${branch.id})` }}
            aria-labelledby={`vb-${branch.id}`}
          >
            <div className="vbranch__head">
              <span className="vbranch__rail" aria-hidden="true" />
              <h3 id={`vb-${branch.id}`} className="vbranch__name">
                {branch.name}
                {branch.optional && <span className="vbranch__optional"> · optional</span>}
              </h3>
              <p className="vbranch__tagline">{branch.tagline}</p>
            </div>

            <ol className="vbranch__list">
              {list.map((t) => {
                const prereqs = t.prerequisiteIds
                  .map((id) => topicMetaById.get(id))
                  .filter((x): x is NonNullable<typeof x> => !!x);
                const stateClass = branch.optional ? "later" : t.required ? "required" : "optional";
                return (
                  <li key={t.id} className="vtopic">
                    <button
                      className={`vtopic__btn vtopic__btn--${stateClass}`}
                      onClick={() => navigate({ name: "topic", id: t.id })}
                    >
                      <span className="vtopic__marker" aria-hidden="true" />
                      <span className="vtopic__main">
                        <span className="vtopic__title">{t.title}</span>
                        <span className="vtopic__summary">{t.summary}</span>
                        <span className="vtopic__tags">
                          <span className={`vtag vtag--${stateClass}`}>
                            {branch.optional ? "Later" : t.required ? "Required" : "Optional"}
                          </span>
                          <span className="vtag">{t.difficulty}</span>
                          <span className="vtag">~{t.estimatedHours}h</span>
                        </span>
                        {prereqs.length > 0 && (
                          <span className="vtopic__prereq">
                            Needs: {prereqs.map((p) => p.title).join(", ")}
                          </span>
                        )}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </section>
        );
      })}

      <section className="vbranch vbranch--milestones" aria-labelledby="vb-milestones">
        <div className="vbranch__head">
          <span className="vbranch__rail vbranch__rail--milestone" aria-hidden="true" />
          <h3 id="vb-milestones" className="vbranch__name">Milestone Projects</h3>
          <p className="vbranch__tagline">
            Cross-branch capstones that turn theory into working software.
          </p>
        </div>
        <ol className="vbranch__list">
          {milestonesLite.map((m) => (
            <li key={m.id} className="vtopic">
              <button
                className="vtopic__btn vtopic__btn--milestone"
                onClick={() => navigate({ name: "milestone", id: m.id })}
              >
                <span className="vtopic__marker" aria-hidden="true" />
                <span className="vtopic__main">
                  <span className="vtopic__title">{m.title}</span>
                  <span className="vtopic__summary">{m.brief}</span>
                  <span className="vtopic__prereq">
                    Unlocked by: {m.unlockedBy
                      .map((id) => topicMetaById.get(id)?.title ?? id)
                      .join(", ")}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
