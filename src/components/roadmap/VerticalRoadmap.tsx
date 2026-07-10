import { useState } from "react";
import type { Route } from "../../lib/useHashRoute";
import { branches } from "../../data/branches";
import type { BranchId } from "../../data/types";
import { topicsLiteByBranch, topicMetaById } from "../../data/topics/lite";
import { milestonesLite } from "../../data/milestonesLite";
import { useProgress } from "../../lib/useProgress";
import { progressStore } from "../../lib/progressStore";
import { milestoneReadiness } from "../../lib/progress";

export type CompletionFilter = "all" | "remaining" | "completed";

/**
 * The mobile-first vertical roadmap. Branches become sections; topics are an
 * ordered spine within each. Prerequisites (including cross-branch) are shown
 * as inline references so the branching structure is preserved without a
 * pannable canvas. Also used on desktop as the accessible "browse all" list.
 */
export function VerticalRoadmap({
  navigate,
  branchFilter = "all",
  completionFilter = "all",
}: {
  navigate: (r: Route) => void;
  branchFilter?: BranchId | "all";
  completionFilter?: CompletionFilter;
}) {
  const { done } = useProgress();
  const [announce, setAnnounce] = useState("");

  const visibleBranches = branchFilter === "all"
    ? branches
    : branches.filter((branch) => branch.id === branchFilter);

  const matchesCompletion = (id: string) =>
    completionFilter === "all" ||
    (completionFilter === "completed") === done.has(id);

  const toggleDone = (id: string, title: string) => {
    progressStore.toggle(id);
    setAnnounce(
      progressStore.getSnapshot().done.has(id)
        ? `${title} marked complete.`
        : `${title} marked not complete.`
    );
  };

  const visibleMilestones = milestonesLite.filter((m) => matchesCompletion(m.id));
  const anyTopicVisible = visibleBranches.some((branch) =>
    (topicsLiteByBranch[branch.id] ?? []).some((t) => matchesCompletion(t.id))
  );
  const anythingVisible =
    anyTopicVisible || (branchFilter === "all" && visibleMilestones.length > 0);

  if (!anythingVisible) {
    return (
      <div className="vroadmap">
        <p className="visually-hidden" role="status" aria-live="polite">{announce}</p>
        <div className="vroadmap-empty paper">
          <p className="vroadmap-empty__title">
            {completionFilter === "completed"
              ? "Nothing completed here yet."
              : "Nothing left to do here — it's all complete."}
          </p>
          <p className="vroadmap-empty__hint">
            {completionFilter === "completed"
              ? "Mark topics complete with the ✓ on any card or topic page and they'll collect here."
              : "Switch the filter back to Everything to revisit what you've finished."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="vroadmap">
      <p className="visually-hidden" role="status" aria-live="polite">{announce}</p>

      {visibleBranches.map((branch) => {
        const list = (topicsLiteByBranch[branch.id] ?? [])
          .slice()
          .sort((a, b) => a.stage - b.stage)
          .filter((t) => matchesCompletion(t.id));
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
                const isDone = done.has(t.id);
                return (
                  <li key={t.id} className="vtopic">
                    {/* Topic button and completion toggle are SIBLINGS in a
                        non-interactive card wrapper — never nested. */}
                    <div
                      className={`vtopic__card vtopic__card--${stateClass} ${
                        isDone ? "vtopic__card--done" : ""
                      }`}
                    >
                      <button
                        className="vtopic__btn"
                        onClick={() => navigate({ name: "topic", id: t.id })}
                      >
                        <span className="vtopic__marker" aria-hidden="true" />
                        <span className="vtopic__main">
                          <span className="vtopic__title">{t.title}</span>
                          <span className="vtopic__summary">{t.summary}</span>
                          <span className="vtopic__tags">
                            {isDone && <span className="vtag vtag--done">Done</span>}
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
                      <button
                        className="check-toggle vtopic__check"
                        aria-pressed={isDone}
                        onClick={() => toggleDone(t.id, t.title)}
                      >
                        <span className="check-toggle__box" aria-hidden="true">✓</span>
                        <span className="visually-hidden">Completed: {t.title}</span>
                      </button>
                    </div>
                  </li>
                );
              })}
            </ol>
          </section>
        );
      })}

      {branchFilter === "all" && visibleMilestones.length > 0 && (
        <section className="vbranch vbranch--milestones" aria-labelledby="vb-milestones">
          <div className="vbranch__head">
            <span className="vbranch__rail vbranch__rail--milestone" aria-hidden="true" />
            <h3 id="vb-milestones" className="vbranch__name">Milestone Projects</h3>
            <p className="vbranch__tagline">
              Cross-branch capstones that turn theory into working software.
            </p>
          </div>
          <ol className="vbranch__list">
            {visibleMilestones.map((m) => {
              const readiness = milestoneReadiness(done, m);
              const isDone = done.has(m.id);
              return (
                <li key={m.id} className="vtopic">
                  <div className={`vtopic__card vtopic__card--milestone ${isDone ? "vtopic__card--done" : ""}`}>
                    <button
                      className="vtopic__btn"
                      onClick={() => navigate({ name: "milestone", id: m.id })}
                    >
                      <span className="vtopic__marker" aria-hidden="true" />
                      <span className="vtopic__main">
                        <span className="vtopic__title">{m.title}</span>
                        <span className="vtopic__summary">{m.brief}</span>
                        <span className={`vtopic__ready ${isDone || readiness.ready ? "vtopic__ready--go" : ""}`}>
                          {isDone
                            ? "Milestone complete"
                            : readiness.ready
                              ? "Ready to start — everything it needs is complete"
                              : `${readiness.done} of ${readiness.total} unlocking topics complete`}
                        </span>
                        <span className="vtopic__prereq">
                          Unlocked by: {readiness.entries.map((e) => e.title).join(", ")}
                        </span>
                      </span>
                    </button>
                    <button
                      className="check-toggle vtopic__check"
                      aria-pressed={isDone}
                      onClick={() => toggleDone(m.id, m.title)}
                    >
                      <span className="check-toggle__box" aria-hidden="true">✓</span>
                      <span className="visually-hidden">Completed: {m.title}</span>
                    </button>
                  </div>
                </li>
              );
            })}
          </ol>
        </section>
      )}
    </div>
  );
}
