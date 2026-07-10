import { useState } from "react";
import type { Route } from "../../lib/useHashRoute";
import type { GuidedPhase, SideBranch } from "../../data/phases";
import { guidedPhases, sumHours } from "../../data/phases";
import { topicMetaById } from "../../data/topics/lite";
import { branchById } from "../../data/branches";
import { milestonesLite } from "../../data/milestonesLite";
import { startHere } from "../../data/curriculum";
import { useProgress } from "../../lib/useProgress";
import { progressStore } from "../../lib/progressStore";
import {
  type DoneSet,
  phaseProgress,
  sideBranchProgress,
  overallProgress,
  milestoneReadiness,
  nextUpId,
  resumeTargetId,
  firstIncompletePhaseId,
  phaseOfTopic,
} from "../../lib/progress";

const milestoneById = new Map(milestonesLite.map((m) => [m.id, m]));

export function GuidedRoadmap({ navigate }: { navigate: (r: Route) => void }) {
  // Expand the phase the learner is actually in (first phase when fresh).
  const [open, setOpen] = useState<Set<string>>(
    () => new Set([firstIncompletePhaseId(progressStore.getSnapshot().done)])
  );
  const { done, recents } = useProgress();
  const [announce, setAnnounce] = useState("");
  const nextUp = nextUpId(done);
  const overall = overallProgress(done);

  const toggle = (id: string) =>
    setOpen((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const expandAll = () => setOpen(new Set(guidedPhases.map((p) => p.id)));
  const collapseAll = () => setOpen(new Set());
  const allOpen = open.size === guidedPhases.length;

  /** Toggle completion + polite announcement with the new phase totals. */
  const toggleDone = (topicId: string, title: string) => {
    progressStore.toggle(topicId);
    const now = progressStore.getSnapshot().done;
    const phase = phaseOfTopic(topicId);
    const suffix = phase
      ? ` Phase ${phase.number}: ${phaseProgress(now, phase).done} of ${phase.topicIds.length} topics complete.`
      : "";
    setAnnounce(
      now.has(topicId)
        ? `${title} marked complete.${suffix}`
        : `${title} marked not complete.${suffix}`
    );
  };

  const toggleMilestoneDone = (id: string, title: string) => {
    progressStore.toggle(id);
    setAnnounce(
      progressStore.getSnapshot().done.has(id)
        ? `Milestone ${title} marked complete.`
        : `Milestone ${title} marked not complete.`
    );
  };

  const resumeId = resumeTargetId(done, recents);
  const resumeTopic = resumeId ? topicMetaById.get(resumeId) : null;
  const started = overall.done > 0;

  return (
    <div className="guided">
      <p className="visually-hidden" role="status" aria-live="polite">{announce}</p>

      <div className="guided__toolbar">
        <p className="guided__intro">
          Follow the trunk top to bottom. Each phase builds on the one above — expand a phase
          to see its topics in order.
        </p>
        <button
          className="guided__expand-all"
          onClick={allOpen ? collapseAll : expandAll}
        >
          {allOpen ? "Collapse all" : "Expand all"}
        </button>
      </div>

      {/* Dominant start node — becomes the resume node once progress exists. */}
      {started && resumeTopic ? (
        <button
          className="guided-start"
          onClick={() => navigate({ name: "topic", id: resumeTopic.id })}
        >
          <span className="guided-start__kicker">Continue where you left off</span>
          <span className="guided-start__title">{resumeTopic.title}</span>
          <span className="guided-start__sub">
            {overall.done} of {overall.total} required topics complete — pick the path back up
            right here.
          </span>
          <span className="guided-start__cta">Resume this topic →</span>
        </button>
      ) : started ? (
        <div className="guided-start guided-start--complete" role="note">
          <span className="guided-start__kicker">Trunk complete</span>
          <span className="guided-start__title">Every required topic is done</span>
          <span className="guided-start__sub">
            The optional side branches and any remaining milestone projects are all yours.
          </span>
        </div>
      ) : (
        <button
          className="guided-start"
          onClick={() => navigate({ name: "topic", id: startHere.topicId })}
        >
          <span className="guided-start__kicker">Start here</span>
          <span className="guided-start__title">You know C to linked lists</span>
          <span className="guided-start__sub">
            Begin with how programs run and your developer tools, then follow the path down.
          </span>
          <span className="guided-start__cta">Open the first topic →</span>
        </button>
      )}

      <ol className="guided__phases">
        {guidedPhases.map((phase) => (
          <PhaseItem
            key={phase.id}
            phase={phase}
            expanded={open.has(phase.id)}
            onToggle={() => toggle(phase.id)}
            navigate={navigate}
            done={done}
            nextUp={nextUp}
            onToggleDone={toggleDone}
            onToggleMilestoneDone={toggleMilestoneDone}
          />
        ))}
      </ol>
    </div>
  );
}

function PhaseItem({
  phase,
  expanded,
  onToggle,
  navigate,
  done,
  nextUp,
  onToggleDone,
  onToggleMilestoneDone,
}: {
  phase: GuidedPhase;
  expanded: boolean;
  onToggle: () => void;
  navigate: (r: Route) => void;
  done: DoneSet;
  nextUp: string | null;
  onToggleDone: (id: string, title: string) => void;
  onToggleMilestoneDone: (id: string, title: string) => void;
}) {
  const bodyId = `phase-body-${phase.id}`;
  const hours = sumHours(phase.topicIds);
  const topicN = phase.topicIds.length;
  const progress = phaseProgress(done, phase);
  const complete = progress.pct === 100;

  return (
    <li className="phase">
      <div className={`phase__node ${complete ? "phase__node--done" : ""}`} aria-hidden="true">
        {complete ? "✓" : phase.number}
      </div>
      <div className="phase__content">
        <button
          className="phase__header"
          aria-expanded={expanded}
          aria-controls={bodyId}
          onClick={onToggle}
        >
          <span className="phase__kicker">Phase {phase.number}</span>
          <span className="phase__title">{phase.title}</span>
          <span className="phase__why">{phase.whyNow}</span>
          <span className="phase__meta">
            {phase.branches.map((b) => {
              const branch = branchById.get(b);
              return branch ? (
                <span key={b} className="phase__branch">
                  <span className="phase__branch-dot" style={{ background: `var(--b-${b})` }} />
                  {branch.name}
                </span>
              ) : null;
            })}
            <span className="phase__count">{topicN} topics · ~{hours}h</span>
            {progress.done > 0 && (
              <span className={`phase__done ${complete ? "phase__done--complete" : ""}`}>
                <span className="phase__done-track" aria-hidden="true">
                  <span className="phase__done-fill" style={{ width: `${progress.pct}%` }} />
                </span>
                {progress.done}/{progress.total} done
              </span>
            )}
          </span>
          <span className="phase__toggle" aria-hidden="true">{expanded ? "−" : "+"}</span>
        </button>

        {expanded && (
          <div className="phase__body" id={bodyId}>
            <ol className="phase__topics">
              {phase.topicIds.map((id, i) => (
                <TopicCard
                  key={id}
                  id={id}
                  index={i + 1}
                  navigate={navigate}
                  done={done.has(id)}
                  doneSet={done}
                  isNext={id === nextUp}
                  onToggleDone={onToggleDone}
                />
              ))}
            </ol>

            {(phase.milestoneIds ?? []).map((mid) => (
              <MilestoneCard
                key={mid}
                id={mid}
                navigate={navigate}
                done={done}
                onToggleDone={onToggleMilestoneDone}
              />
            ))}

            {(phase.sideBranches ?? []).map((sb) => (
              <SideBranchBlock
                key={sb.id}
                sb={sb}
                navigate={navigate}
                done={done}
                onToggleDone={onToggleDone}
                onToggleMilestoneDone={onToggleMilestoneDone}
              />
            ))}

            <p className="phase__next">
              <span className="phase__next-label">Next</span> {phase.nextDirection}
            </p>
          </div>
        )}
      </div>
    </li>
  );
}

function TopicCard({
  id,
  index,
  navigate,
  done,
  doneSet,
  isNext,
  onToggleDone,
}: {
  id: string;
  index: number;
  navigate: (r: Route) => void;
  done: boolean;
  doneSet: DoneSet;
  isNext: boolean;
  onToggleDone: (id: string, title: string) => void;
}) {
  const topic = topicMetaById.get(id);
  if (!topic) return null;
  // Cross-branch prerequisites become small "Also requires" links.
  const crossPrereqs = topic.prerequisiteIds
    .map((p) => topicMetaById.get(p))
    .filter((p): p is NonNullable<typeof p> => !!p && p.branch !== topic.branch);
  const stateClass = topic.required ? "required" : "optional";

  return (
    <li className="gtopic">
      {/* The topic action, the completion toggle, and the prerequisite links
          are SIBLING controls — an interactive element must never nest inside
          another. */}
      <div
        className={[
          "gtopic__card",
          `gtopic__card--${stateClass}`,
          done ? "gtopic__card--done" : "",
          isNext ? "gtopic__card--next" : "",
        ].join(" ")}
        style={{
          ["--node-accent" as string]: `var(--b-${topic.branch})`,
          ["--reveal-index" as string]: index,
        }}
      >
        <div className="gtopic__row">
          <button
            className="gtopic__btn"
            onClick={() => navigate({ name: "topic", id })}
          >
            <span className="gtopic__index" aria-hidden="true">{index}</span>
            <span className="gtopic__main">
              <span className="gtopic__title">{topic.title}</span>
              <span className="gtopic__summary">{topic.summary}</span>
              <span className="gtopic__tags">
                {isNext && <span className="vtag vtag--next">Up next</span>}
                {done && <span className="vtag vtag--done">Done</span>}
                <span className={`vtag vtag--${stateClass}`}>
                  {topic.required ? "Required" : "Optional"}
                </span>
                <span className="vtag">{topic.difficulty}</span>
                <span className="vtag">~{topic.estimatedHours}h</span>
              </span>
            </span>
          </button>
          <button
            className="check-toggle gtopic__check"
            aria-pressed={done}
            onClick={() => onToggleDone(id, topic.title)}
          >
            <span className="check-toggle__box" aria-hidden="true">✓</span>
            <span className="visually-hidden">Completed: {topic.title}</span>
          </button>
        </div>
        {crossPrereqs.length > 0 && (
          <p className="gtopic__also">
            Also requires:{" "}
            {crossPrereqs.map((p, i) => (
              <span key={p.id}>
                {i > 0 && ", "}
                <a
                  className={`gtopic__also-link ${doneSet.has(p.id) ? "gtopic__also-link--done" : ""}`}
                  href={`#/topic/${p.id}`}
                >
                  {p.title}
                  {doneSet.has(p.id) && (
                    <>
                      <span aria-hidden="true"> ✓</span>
                      <span className="visually-hidden"> (completed)</span>
                    </>
                  )}
                </a>
              </span>
            ))}
          </p>
        )}
      </div>
    </li>
  );
}

function MilestoneCard({
  id,
  navigate,
  done,
  onToggleDone,
}: {
  id: string;
  navigate: (r: Route) => void;
  done: DoneSet;
  onToggleDone: (id: string, title: string) => void;
}) {
  const m = milestoneById.get(id);
  if (!m) return null;
  const readiness = milestoneReadiness(done, m);
  const completed = done.has(id);
  const readyLine = completed
    ? "Milestone complete"
    : readiness.ready
      ? "Ready to start — everything it needs is complete"
      : `${readiness.done} of ${readiness.total} unlocking topics complete`;

  return (
    <div className={`gmilestone-wrap ${completed ? "gmilestone-wrap--done" : ""}`}>
      <button className="gmilestone" onClick={() => navigate({ name: "milestone", id })}>
        <span className="gmilestone__tag">★ Milestone project</span>
        <span className="gmilestone__title">{m.title}</span>
        <span className="gmilestone__brief">{m.brief}</span>
        <span
          className={`gmilestone__ready ${
            completed || readiness.ready ? "gmilestone__ready--go" : ""
          }`}
        >
          {readyLine}
        </span>
        <span className="gmilestone__cta">Open project brief →</span>
      </button>
      <button
        className="check-toggle gmilestone__check"
        aria-pressed={completed}
        onClick={() => onToggleDone(id, m.title)}
      >
        <span className="check-toggle__box" aria-hidden="true">✓</span>
        <span className="visually-hidden">Completed: {m.title}</span>
      </button>
    </div>
  );
}

function SideBranchBlock({
  sb,
  navigate,
  done,
  onToggleDone,
  onToggleMilestoneDone,
}: {
  sb: SideBranch;
  navigate: (r: Route) => void;
  done: DoneSet;
  onToggleDone: (id: string, title: string) => void;
  onToggleMilestoneDone: (id: string, title: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const bodyId = `side-${sb.id}`;
  const progress = sideBranchProgress(done, sb);
  return (
    <div className="sidebranch">
      <button
        className="sidebranch__header"
        aria-expanded={open}
        aria-controls={bodyId}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="sidebranch__label">Side branch · optional</span>
        <span className="sidebranch__title">{sb.title}</span>
        <span className="sidebranch__note">
          {sb.note}
          {progress.done > 0 && (
            <span className="sidebranch__done"> {progress.done}/{progress.total} done</span>
          )}
        </span>
        <span className="sidebranch__toggle" aria-hidden="true">{open ? "−" : "+"}</span>
      </button>
      {open && (
        <div className="sidebranch__body" id={bodyId}>
          <ol className="phase__topics">
            {sb.topicIds.map((id, i) => (
              <TopicCard
                key={id}
                id={id}
                index={i + 1}
                navigate={navigate}
                done={done.has(id)}
                doneSet={done}
                isNext={false}
                onToggleDone={onToggleDone}
              />
            ))}
          </ol>
          {(sb.milestoneIds ?? []).map((mid) => (
            <MilestoneCard
              key={mid}
              id={mid}
              navigate={navigate}
              done={done}
              onToggleDone={onToggleMilestoneDone}
            />
          ))}
        </div>
      )}
    </div>
  );
}
