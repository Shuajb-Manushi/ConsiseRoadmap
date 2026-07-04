import { useRef } from "react";
import type { Topic, Resource } from "../data/types";
import type { Route } from "../lib/useHashRoute";
import { topicById } from "../data/topics";
import { branchById, milestones } from "../data/curriculum";
import { RequiredChip, DifficultyChip, HoursChip, BranchChip, Disclosure } from "./ui";
import "../styles/detail.css";

export function TopicDetail({ topic, navigate }: { topic: Topic; navigate: (r: Route) => void }) {
  const branch = branchById.get(topic.branch);
  const prereqs = topic.prerequisiteIds.map((id) => topicById.get(id)).filter(Boolean) as Topic[];
  const nexts = topic.nextIds.map((id) => topicById.get(id)).filter(Boolean) as Topic[];
  const relatedMilestones = milestones.filter((m) => m.unlockedBy.includes(topic.id));
  const primary = topic.resources.primary[0];

  const labRef = useRef<HTMLElement>(null);
  const masteryRef = useRef<HTMLElement>(null);
  const scrollTo = (ref: React.RefObject<HTMLElement>) =>
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <article className="container detail-page topic-detail">
      <button className="detail-back" onClick={() => navigate({ name: "roadmap" })}>
        ← Back to roadmap
      </button>

      <header className="detail-head">
        <div className="detail-head__chips">
          {branch && <BranchChip name={branch.name} color={`var(--b-${branch.id})`} />}
          <RequiredChip required={topic.required} />
          <DifficultyChip difficulty={topic.difficulty} />
          <HoursChip hours={topic.estimatedHours} />
        </div>
        <h1>{topic.title}</h1>
        <p className="detail-summary">{topic.summary}</p>
      </header>

      <section className="detail-section detail-why">
        <h2>Why this matters</h2>
        <p>{topic.whyItMatters}</p>
      </section>

      {/* ---------- LEARNING PLAN ---------- */}
      <section className="detail-section learning-plan" aria-label="Your learning plan">
        <h2>Your learning plan</h2>
        <ol className="plan-steps">
          <li className="plan-step">
            <div className="plan-step__head">
              <span className="plan-step__label">Learn</span>
              <span className="plan-step__hint">Start with the recommended resource — it teaches; the references below can wait.</span>
            </div>
            {primary ? (
              <ResourceCard resource={primary} primary />
            ) : (
              <p className="detail-hint">No primary resource assigned yet — start from the lab below.</p>
            )}
            {topic.resources.primary.slice(1).map((r, i) => (
              <ResourceCard key={i} resource={r} primary />
            ))}
          </li>
          <li className="plan-step">
            <div className="plan-step__head">
              <span className="plan-step__label">Build</span>
              <span className="plan-step__hint">Do the practical lab — understanding is built, not watched.</span>
            </div>
            <button className="plan-step__jump" onClick={() => scrollTo(labRef)}>
              Go to the lab: {topic.lab.title} ↓
            </button>
          </li>
          <li className="plan-step">
            <div className="plan-step__head">
              <span className="plan-step__label">Prove</span>
              <span className="plan-step__hint">Check yourself against the mastery list before moving on.</span>
            </div>
            <button className="plan-step__jump" onClick={() => scrollTo(masteryRef)}>
              Go to the mastery checks ↓
            </button>
          </li>
        </ol>
      </section>

      {prereqs.length > 0 && (
        <section className="detail-section">
          <h2>Prerequisites</h2>
          <p className="detail-hint">Learn these first — they're what this topic builds on.</p>
          <div className="pill-row">
            {prereqs.map((p) => (
              <button key={p.id} className="pill" onClick={() => navigate({ name: "topic", id: p.id })}>
                <span className="pill__dot" style={{ background: `var(--b-${p.branch})` }} />
                {p.title}
              </button>
            ))}
          </div>
        </section>
      )}

      <div className="detail-grid">
        <section className="detail-section">
          <h2>Core ideas</h2>
          <ul className="tick-list">
            {topic.concepts.map((c, i) => <li key={i}>{c}</li>)}
          </ul>
        </section>
        <section className="detail-section">
          <h2>Where it's used</h2>
          <ul className="tick-list">
            {topic.practicalUses.map((u, i) => <li key={i}>{u}</li>)}
          </ul>
        </section>
      </div>

      {/* ---------- LAB ---------- */}
      <section className="detail-section lab" ref={labRef}>
        <div className="lab__label offset"><span>Practical lab</span></div>
        <h2 className="lab__title">{topic.lab.title}</h2>
        <p className="lab__scenario">{topic.lab.scenario}</p>
        <p className="lab__outcome"><strong>You'll come away able to:</strong> {topic.lab.outcome}</p>

        <div className="lab__block">
          <h3>Requirements</h3>
          <ul className="num-list">{topic.lab.requirements.map((r, i) => <li key={i}>{r}</li>)}</ul>
        </div>

        <div className="lab__block">
          <h3>Checkpoints</h3>
          <ul className="tick-list">{topic.lab.checkpoints.map((c, i) => <li key={i}>{c}</li>)}</ul>
        </div>

        <Disclosure summary={`Progressive hints (${topic.lab.hints.length}) — open one at a time when stuck`}>
          <ol className="hint-list">{topic.lab.hints.map((h, i) => <li key={i}>{h}</li>)}</ol>
        </Disclosure>

        <div className="lab__block">
          <h3>How to validate your work</h3>
          <ul className="tick-list">{topic.lab.validation.map((v, i) => <li key={i}>{v}</li>)}</ul>
        </div>

        <Disclosure summary="Solution architecture — how a correct solution works (read after attempting)" tone="solution">
          <ol className="num-list">{topic.lab.solutionOutline.map((s, i) => <li key={i}>{s}</li>)}</ol>
        </Disclosure>

        <div className="lab__block">
          <h3>Extensions</h3>
          <ul className="tick-list">{topic.lab.extensions.map((e, i) => <li key={i}>{e}</li>)}</ul>
        </div>
      </section>

      {/* ---------- MASTERY ---------- */}
      <section className="detail-section mastery" ref={masteryRef}>
        <h2>You've mastered this when you can…</h2>
        <ul className="tick-list tick-list--check">
          {topic.masteryChecks.map((m, i) => <li key={i}>{m}</li>)}
        </ul>
      </section>

      {topic.securityNote && (
        <aside className="security-note" role="note">
          <span className="security-note__label">Secure engineering</span>
          <p>{topic.securityNote}</p>
        </aside>
      )}

      {/* ---------- RESOURCES ---------- */}
      <section className="detail-section resources">
        <h2>Start learning here</h2>
        {primary ? (
          <ResourceCard resource={primary} primary />
        ) : (
          <p className="detail-hint">No primary resource assigned.</p>
        )}
        {topic.resources.primary.slice(1).map((r, i) => (
          <ResourceCard key={i} resource={r} primary />
        ))}

        {topic.resources.alternatives.length > 0 && (
          <>
            <h3 className="resources__subhead">Try another explanation</h3>
            <div className="resource-alts">
              {topic.resources.alternatives.map((r, i) => <ResourceCard key={i} resource={r} />)}
            </div>
          </>
        )}

        {topic.resources.practice.length > 0 && (
          <>
            <h3 className="resources__subhead">Practice and visual tools</h3>
            <div className="resource-alts">
              {topic.resources.practice.map((r, i) => <ResourceCard key={i} resource={r} />)}
            </div>
          </>
        )}

        {topic.resources.extra.length > 0 && (
          <Disclosure summary={`Extra reading & references (${topic.resources.extra.length})`}>
            <div className="resource-alts">
              {topic.resources.extra.map((r, i) => <ResourceCard key={i} resource={r} />)}
            </div>
          </Disclosure>
        )}
      </section>

      {/* ---------- CONNECTIONS ---------- */}
      {(nexts.length > 0 || relatedMilestones.length > 0) && (
        <section className="detail-section connections">
          <h2>Where this leads</h2>
          {nexts.length > 0 && (
            <>
              <p className="detail-hint">Topics that build on this one:</p>
              <div className="pill-row">
                {nexts.map((n) => (
                  <button key={n.id} className="pill" onClick={() => navigate({ name: "topic", id: n.id })}>
                    <span className="pill__dot" style={{ background: `var(--b-${n.branch})` }} />
                    {n.title}
                  </button>
                ))}
              </div>
            </>
          )}
          {relatedMilestones.length > 0 && (
            <>
              <p className="detail-hint" style={{ marginTop: "var(--s4)" }}>Milestone projects this unlocks:</p>
              <div className="pill-row">
                {relatedMilestones.map((m) => (
                  <button key={m.id} className="pill pill--milestone" onClick={() => navigate({ name: "milestone", id: m.id })}>
                    ★ {m.title}
                  </button>
                ))}
              </div>
            </>
          )}
        </section>
      )}
    </article>
  );
}

function ResourceCard({ resource, primary }: { resource: Resource; primary?: boolean }) {
  return (
    <a
      className={`resource-card ${primary ? "resource-card--primary" : ""}`}
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="resource-card__top">
        <span className="resource-card__type">{resource.type}</span>
        <span className="resource-card__ext" aria-hidden="true">↗</span>
      </div>
      <span className="resource-card__title">{resource.title}</span>
      {(resource.provider || resource.duration) && (
        <span className="resource-card__meta">
          {resource.provider}
          {resource.provider && resource.duration ? " · " : ""}
          {resource.duration}
        </span>
      )}
      <span className="resource-card__note">{resource.guidance ?? resource.note}</span>
      <span className="visually-hidden"> (opens in a new tab)</span>
    </a>
  );
}
