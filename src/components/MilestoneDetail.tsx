import { useState } from "react";
import type { Route } from "../lib/useHashRoute";
import { topicById } from "../data/topics";
import { milestones } from "../data/milestones";
import { branchById } from "../data/branches";
import { useProgress } from "../lib/useProgress";
import { progressStore } from "../lib/progressStore";
import { milestoneReadiness } from "../lib/progress";
import { BranchChip, Disclosure } from "./ui";
import "../styles/detail.css";

export function MilestoneDetail({
  id,
  navigate,
}: {
  id: string;
  navigate: (r: Route) => void;
}) {
  // The route guard checks existence against milestonesLite; milestones.ts
  // throws at load if the lite and heavy halves ever disagree.
  const milestone = milestones.find((m) => m.id === id)!;
  const { done } = useProgress();
  const completed = done.has(milestone.id);
  // unlockedBy may contain milestone ids too (e.g. the security capstone
  // requires the issue tracker) — readiness resolves both kinds.
  const readiness = milestoneReadiness(done, milestone);
  const [progressStatus, setProgressStatus] = useState("");

  const toggleCompleted = () => {
    progressStore.toggle(milestone.id);
    setProgressStatus(
      progressStore.isDone(milestone.id)
        ? `${milestone.title} marked complete.`
        : `${milestone.title} marked not complete.`
    );
  };

  return (
    <article className="container detail-page topic-detail">
      <button className="detail-back" onClick={() => navigate({ name: "roadmap" })}>
        ← Back to roadmap
      </button>

      <header className="detail-head">
        <div className="detail-head__chips">
          <span className="chip chip--required">★ Milestone project</span>
          {milestone.integrates.map((b) => {
            const branch = branchById.get(b);
            return branch ? <BranchChip key={b} name={branch.name} color={`var(--b-${b})`} /> : null;
          })}
        </div>
        <h1>{milestone.title}</h1>
        <p className="detail-summary">{milestone.brief}</p>
        <div className="milestone-complete">
          <button className="complete-toggle" aria-pressed={completed} onClick={toggleCompleted}>
            <span className="complete-toggle__box" aria-hidden="true">✓</span>
            Completed
          </button>
          <span className="visually-hidden" role="status" aria-live="polite">{progressStatus}</span>
        </div>
      </header>

      <section className="detail-section">
        <h2>Skills it integrates</h2>
        <p
          className={`milestone-readiness ${
            completed || readiness.ready ? "milestone-readiness--go" : ""
          }`}
        >
          {completed
            ? "You've completed this milestone."
            : readiness.ready
              ? "Ready to start — everything this project needs is complete."
              : `${readiness.done} of ${readiness.total} things it builds on are complete — you can start anytime; everything is unlocked.`}
        </p>
        <div className="pill-row">
          {readiness.entries.map((e) => (
            <button
              key={e.id}
              className={`pill ${e.kind === "milestone" ? "pill--milestone" : ""}`}
              onClick={() =>
                navigate(
                  e.kind === "milestone"
                    ? { name: "milestone", id: e.id }
                    : { name: "topic", id: e.id }
                )
              }
            >
              {e.kind === "milestone" ? (
                <span aria-hidden="true">★ </span>
              ) : (
                <span
                  className="pill__dot"
                  style={{ background: `var(--b-${topicById.get(e.id)?.branch ?? "start"})` }}
                />
              )}
              {e.title}
              {e.done && (
                <>
                  <span className="pill__done" aria-hidden="true">✓</span>
                  <span className="visually-hidden">(completed)</span>
                </>
              )}
            </button>
          ))}
        </div>
      </section>

      <div className="detail-grid">
        <section className="detail-section">
          <h2>Requirements</h2>
          <ul className="num-list">{milestone.requirements.map((r, i) => <li key={i}>{r}</li>)}</ul>
        </section>
        <section className="detail-section">
          <h2>Non-goals</h2>
          <p className="detail-hint">Deliberately out of scope, so the project stays finishable.</p>
          <ul className="cross-list">{milestone.nonGoals.map((n, i) => <li key={i}>{n}</li>)}</ul>
        </section>
      </div>

      <section className="detail-section">
        <h2>Suggested architecture</h2>
        <ul className="tick-list">{milestone.architecture.map((a, i) => <li key={i}>{a}</li>)}</ul>
      </section>

      <section className="detail-section">
        <h2>Staged checkpoints</h2>
        <ul className="tick-list">{milestone.checkpoints.map((c, i) => <li key={i}>{c}</li>)}</ul>
      </section>

      <section className="detail-section">
        <h2>Testing expectations</h2>
        <ul className="tick-list">{milestone.tests.map((t, i) => <li key={i}>{t}</li>)}</ul>
      </section>

      <Disclosure summary={`Progressive hints (${milestone.hints.length})`}>
        <ol className="hint-list">{milestone.hints.map((h, i) => <li key={i}>{h}</li>)}</ol>
      </Disclosure>

      <Disclosure summary="Solution outline — how a correct solution is structured (read after attempting)" tone="solution">
        <ol className="num-list">{milestone.solutionOutline.map((s, i) => <li key={i}>{s}</li>)}</ol>
      </Disclosure>

      <section className="detail-section">
        <h2>Extensions</h2>
        <ul className="tick-list">{milestone.extensions.map((e, i) => <li key={i}>{e}</li>)}</ul>
      </section>
    </article>
  );
}
