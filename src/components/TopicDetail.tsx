import { useEffect, useRef, useState } from "react";
import type { Topic, Resource } from "../data/types";
import type { Route } from "../lib/useHashRoute";
import { topicById } from "../data/topics";
import { branchById } from "../data/branches";
import { milestones } from "../data/milestones";
import { useProgress } from "../lib/useProgress";
import { progressStore } from "../lib/progressStore";
import { guidedNeighbors } from "../lib/progress";
import { RequiredChip, DifficultyChip, HoursChip, BranchChip, Disclosure } from "./ui";
import "../styles/detail.css";

export function TopicDetail({ id, navigate }: { id: string; navigate: (r: Route) => void }) {
  // The route guard checks existence against the lite index; the joined heavy
  // index is guaranteed consistent with it (topics/index.ts throws otherwise).
  const topic = topicById.get(id)!;
  const branch = branchById.get(topic.branch);
  const prereqs = topic.prerequisiteIds.map((id) => topicById.get(id)).filter(Boolean) as Topic[];
  const nexts = topic.nextIds.map((id) => topicById.get(id)).filter(Boolean) as Topic[];
  const relatedMilestones = milestones.filter((m) => m.unlockedBy.includes(topic.id));
  const primary = topic.resources.primary[0];
  const { done } = useProgress();
  const completed = done.has(topic.id);
  const neighbors = guidedNeighbors(topic.id);
  const prevTopic = neighbors.prevId ? topicById.get(neighbors.prevId) : null;
  const nextTopic = neighbors.nextId ? topicById.get(neighbors.nextId) : null;

  const detailRef = useRef<HTMLElement>(null);
  const planRef = useRef<HTMLElement>(null);
  const labRef = useRef<HTMLElement>(null);
  const masteryRef = useRef<HTMLElement>(null);
  const connectionsRef = useRef<HTMLElement>(null);
  const [readingProgress, setReadingProgress] = useState(0);
  const [copyStatus, setCopyStatus] = useState("");
  const [progressStatus, setProgressStatus] = useState("");

  const toggleCompleted = () => {
    progressStore.toggle(topic.id);
    setProgressStatus(
      progressStore.isDone(topic.id)
        ? `${topic.title} marked complete.`
        : `${topic.title} marked not complete.`
    );
  };
  const scrollTo = (ref: React.RefObject<HTMLElement>) =>
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  useEffect(() => {
    const updateProgress = () => {
      const detail = detailRef.current;
      if (!detail) return;
      const top = detail.getBoundingClientRect().top + window.scrollY;
      const available = Math.max(1, detail.offsetHeight - window.innerHeight * 0.7);
      const progress = Math.round(Math.min(100, Math.max(0, ((window.scrollY - top) / available) * 100)));
      setReadingProgress(progress);
    };

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, [id]);

  useEffect(() => {
    if (!copyStatus) return;
    const timeout = window.setTimeout(() => setCopyStatus(""), 2400);
    return () => window.clearTimeout(timeout);
  }, [copyStatus]);

  const copyLink = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(window.location.href);
      } else {
        const input = document.createElement("textarea");
        input.value = window.location.href;
        input.setAttribute("readonly", "");
        input.style.position = "fixed";
        input.style.opacity = "0";
        document.body.append(input);
        input.select();
        const copied = document.execCommand("copy");
        input.remove();
        if (!copied) throw new Error("Copy command was unavailable");
      }
      setCopyStatus("Link copied");
    } catch {
      setCopyStatus("Copy unavailable — use the address bar");
    }
  };

  return (
    <article className="container detail-page topic-detail" ref={detailRef}>
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
        <div className="detail-head__actions">
          <button className="btn btn--primary" onClick={() => navigate({ name: "session", id: topic.id })}>
            Plan my next hour →
          </button>
          <span>Turn this topic into one Learn → Build → Prove session.</span>
        </div>
      </header>

      <div className="topic-compass">
        <div className="topic-progress" aria-label={`${readingProgress}% of this topic read`}>
          <span className="topic-progress__label">{readingProgress}% read</span>
          <span className="topic-progress__track" aria-hidden="true">
            <span className="topic-progress__fill" style={{ width: `${readingProgress}%` }} />
          </span>
        </div>
        <nav className="topic-compass__nav" aria-label="On this page">
          <span className="topic-compass__label">On this page</span>
          <button onClick={() => scrollTo(planRef)}>Plan</button>
          <button onClick={() => scrollTo(labRef)}>Lab</button>
          <button onClick={() => scrollTo(masteryRef)}>Mastery</button>
          {(nexts.length > 0 || relatedMilestones.length > 0) && (
            <button onClick={() => scrollTo(connectionsRef)}>Next</button>
          )}
        </nav>
        <button
          className="complete-toggle complete-toggle--sm"
          aria-pressed={completed}
          onClick={toggleCompleted}
        >
          <span className="complete-toggle__box" aria-hidden="true">✓</span>
          Completed
        </button>
        <button className="topic-compass__copy" onClick={copyLink}>Copy link</button>
        <span className="topic-compass__status" role="status" aria-live="polite">{copyStatus}</span>
        <span className="visually-hidden" role="status" aria-live="polite">{progressStatus}</span>
      </div>

      <section className="detail-section detail-why">
        <h2>Why this matters</h2>
        <p>{topic.whyItMatters}</p>
      </section>

      {/* ---------- LEARNING PLAN ---------- */}
      <section className="detail-section learning-plan" aria-label="Your learning plan" ref={planRef}>
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
                {done.has(p.id) && (
                  <>
                    <span className="pill__done" aria-hidden="true">✓</span>
                    <span className="visually-hidden">(completed)</span>
                  </>
                )}
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
        <div className="mastery-complete">
          <p className="mastery-complete__hint">
            Built the lab and can honestly pass these checks? Record it — progress lives only in
            this browser.
          </p>
          <button className="complete-toggle" aria-pressed={completed} onClick={toggleCompleted}>
            <span className="complete-toggle__box" aria-hidden="true">✓</span>
            Completed
          </button>
        </div>
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
        <section className="detail-section connections" ref={connectionsRef}>
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
                    {done.has(m.id) && (
                      <>
                        <span className="pill__done" aria-hidden="true">✓</span>
                        <span className="visually-hidden">(completed)</span>
                      </>
                    )}
                  </button>
                ))}
              </div>
            </>
          )}
        </section>
      )}

      {(prevTopic || nextTopic) && (
        <nav className="topic-pager" aria-label="Guided path">
          {neighbors.label && <p className="topic-pager__pos">{neighbors.label} on the guided path</p>}
          {prevTopic ? (
            <button
              className="topic-pager__btn"
              onClick={() => navigate({ name: "topic", id: prevTopic.id })}
            >
              <span className="topic-pager__kicker">← Previous</span>
              <span className="topic-pager__title">{prevTopic.title}</span>
            </button>
          ) : (
            <span className="topic-pager__spacer" aria-hidden="true" />
          )}
          {nextTopic ? (
            <button
              className="topic-pager__btn topic-pager__btn--next"
              onClick={() => navigate({ name: "topic", id: nextTopic.id })}
            >
              <span className="topic-pager__kicker">Next →</span>
              <span className="topic-pager__title">{nextTopic.title}</span>
            </button>
          ) : (
            <button
              className="topic-pager__btn topic-pager__btn--next"
              onClick={() => navigate({ name: "roadmap" })}
            >
              <span className="topic-pager__kicker">End of the path →</span>
              <span className="topic-pager__title">Back to the roadmap</span>
            </button>
          )}
        </nav>
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
