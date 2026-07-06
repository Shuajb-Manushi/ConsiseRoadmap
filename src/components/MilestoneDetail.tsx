import type { Route } from "../lib/useHashRoute";
import { topicById } from "../data/topics";
import { milestones } from "../data/milestones";
import { branchById } from "../data/branches";
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
  const unlocks = milestone.unlockedBy.map((id) => topicById.get(id)).filter(Boolean);

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
      </header>

      <section className="detail-section">
        <h2>Skills it integrates</h2>
        <p className="detail-hint">This project pulls together topics from across the roadmap:</p>
        <div className="pill-row">
          {unlocks.map((t) => t && (
            <button key={t.id} className="pill" onClick={() => navigate({ name: "topic", id: t.id })}>
              <span className="pill__dot" style={{ background: `var(--b-${t.branch})` }} />
              {t.title}
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
