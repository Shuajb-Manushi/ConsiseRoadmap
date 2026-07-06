import { useState } from "react";
import type { Route } from "../../lib/useHashRoute";
import type { GuidedPhase, SideBranch } from "../../data/phases";
import { guidedPhases, sumHours } from "../../data/phases";
import { topicMetaById } from "../../data/topics/lite";
import { branchById } from "../../data/branches";
import { milestonesLite } from "../../data/milestonesLite";
import { startHere } from "../../data/curriculum";

const milestoneById = new Map(milestonesLite.map((m) => [m.id, m]));

export function GuidedRoadmap({ navigate }: { navigate: (r: Route) => void }) {
  // First phase expanded by default.
  const [open, setOpen] = useState<Set<string>>(() => new Set([guidedPhases[0].id]));

  const toggle = (id: string) =>
    setOpen((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const expandAll = () => setOpen(new Set(guidedPhases.map((p) => p.id)));
  const collapseAll = () => setOpen(new Set());
  const allOpen = open.size === guidedPhases.length;

  return (
    <div className="guided">
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

      {/* Dominant start node */}
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

      <ol className="guided__phases">
        {guidedPhases.map((phase) => (
          <PhaseItem
            key={phase.id}
            phase={phase}
            expanded={open.has(phase.id)}
            onToggle={() => toggle(phase.id)}
            navigate={navigate}
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
}: {
  phase: GuidedPhase;
  expanded: boolean;
  onToggle: () => void;
  navigate: (r: Route) => void;
}) {
  const bodyId = `phase-body-${phase.id}`;
  const hours = sumHours(phase.topicIds);
  const topicN = phase.topicIds.length;

  return (
    <li className="phase">
      <div className="phase__node" aria-hidden="true">{phase.number}</div>
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
          </span>
          <span className="phase__toggle" aria-hidden="true">{expanded ? "−" : "+"}</span>
        </button>

        {expanded && (
          <div className="phase__body" id={bodyId}>
            <ol className="phase__topics">
              {phase.topicIds.map((id, i) => (
                <TopicCard key={id} id={id} index={i + 1} navigate={navigate} />
              ))}
            </ol>

            {(phase.milestoneIds ?? []).map((mid) => (
              <MilestoneCard key={mid} id={mid} navigate={navigate} />
            ))}

            {(phase.sideBranches ?? []).map((sb) => (
              <SideBranchBlock key={sb.id} sb={sb} navigate={navigate} />
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
}: {
  id: string;
  index: number;
  navigate: (r: Route) => void;
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
      {/* The topic action and prerequisite links are SIBLING controls — an
          interactive element must never nest inside another. */}
      <div
        className={`gtopic__card gtopic__card--${stateClass}`}
        style={{ ["--node-accent" as string]: `var(--b-${topic.branch})` }}
      >
        <button
          className="gtopic__btn"
          onClick={() => navigate({ name: "topic", id })}
        >
          <span className="gtopic__index" aria-hidden="true">{index}</span>
          <span className="gtopic__main">
            <span className="gtopic__title">{topic.title}</span>
            <span className="gtopic__summary">{topic.summary}</span>
            <span className="gtopic__tags">
              <span className={`vtag vtag--${stateClass}`}>
                {topic.required ? "Required" : "Optional"}
              </span>
              <span className="vtag">{topic.difficulty}</span>
              <span className="vtag">~{topic.estimatedHours}h</span>
            </span>
          </span>
        </button>
        {crossPrereqs.length > 0 && (
          <p className="gtopic__also">
            Also requires:{" "}
            {crossPrereqs.map((p, i) => (
              <span key={p.id}>
                {i > 0 && ", "}
                <a className="gtopic__also-link" href={`#/topic/${p.id}`}>
                  {p.title}
                </a>
              </span>
            ))}
          </p>
        )}
      </div>
    </li>
  );
}

function MilestoneCard({ id, navigate }: { id: string; navigate: (r: Route) => void }) {
  const m = milestoneById.get(id);
  if (!m) return null;
  return (
    <button className="gmilestone" onClick={() => navigate({ name: "milestone", id })}>
      <span className="gmilestone__tag">★ Milestone project</span>
      <span className="gmilestone__title">{m.title}</span>
      <span className="gmilestone__brief">{m.brief}</span>
      <span className="gmilestone__cta">Open project brief →</span>
    </button>
  );
}

function SideBranchBlock({
  sb,
  navigate,
}: {
  sb: SideBranch;
  navigate: (r: Route) => void;
}) {
  const [open, setOpen] = useState(false);
  const bodyId = `side-${sb.id}`;
  return (
    <div className="sidebranch">
      <button
        className="sidebranch__header"
        aria-expanded={open}
        aria-controls={bodyId}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="sidebranch__label">Side branch</span>
        <span className="sidebranch__title">{sb.title}</span>
        <span className="sidebranch__note">{sb.note}</span>
        <span className="sidebranch__toggle" aria-hidden="true">{open ? "−" : "+"}</span>
      </button>
      {open && (
        <div className="sidebranch__body" id={bodyId}>
          <ol className="phase__topics">
            {sb.topicIds.map((id, i) => (
              <TopicCard key={id} id={id} index={i + 1} navigate={navigate} />
            ))}
          </ol>
          {(sb.milestoneIds ?? []).map((mid) => (
            <MilestoneCard key={mid} id={mid} navigate={navigate} />
          ))}
        </div>
      )}
    </div>
  );
}
