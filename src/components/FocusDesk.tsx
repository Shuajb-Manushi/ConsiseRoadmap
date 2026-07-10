import type { Route } from "../lib/useHashRoute";
import { guidedTrunkIds, overallProgress, phaseOfTopic, resumeTargetId } from "../lib/progress";
import { useProgress } from "../lib/useProgress";
import { usePractice } from "../lib/usePractice";
import { topicMetaById } from "../data/topics/lite";
import "../styles/focus.css";

export function FocusDesk({ navigate }: { navigate: (route: Route) => void }) {
  const { done, recents } = useProgress();
  const practice = usePractice();
  const targetId = resumeTargetId(done, recents);
  const target = targetId ? topicMetaById.get(targetId) : null;
  const phase = targetId ? phaseOfTopic(targetId) : null;
  const overall = overallProgress(done);
  const pathIndex = targetId ? guidedTrunkIds.indexOf(targetId) : -1;
  const workedSteps = targetId
    ? [...practice.done].filter((id) => id.includes(`:${targetId}`)).length
    : 0;

  if (!target || !targetId) {
    return (
      <section className="focus-hero focus-hero--complete">
        <div className="container focus-hero__complete-inner">
          <p className="focus-kicker">The required path is complete</p>
          <h1>You built the foundation. Now choose with intent.</h1>
          <p>
            Revisit a milestone, take an optional branch, or use the full map to decide what
            your next real project needs.
          </p>
          <a className="btn btn--primary" href="#journey">Explore the journey</a>
        </div>
      </section>
    );
  }

  return (
    <section className="focus-hero" aria-labelledby="today-title">
      <div className="container focus-hero__rail" aria-label="Study context">
        <span>Today</span>
        <span>One honest hour</span>
        <span>~7 hours / week</span>
        <span>Private on this device</span>
      </div>
      <div className="container focus-hero__grid">
        <div className="focus-hero__main">
          <p className="focus-kicker">
            {phase ? `Phase ${phase.number} · ${phase.title}` : "Your current topic"}
          </p>
          <h1 id="today-title">
            <span className="focus-hero__quiet">Your next move:</span> {target.title}
          </h1>
          <p className="focus-hero__summary">{target.summary}</p>
          <div className="focus-hero__actions">
            <button
              className="btn btn--primary btn--large"
              onClick={() => navigate({ name: "session", id: targetId })}
            >
              Plan my next hour <span aria-hidden="true">→</span>
            </button>
            <button
              className="btn btn--quiet"
              onClick={() => navigate({ name: "topic", id: targetId })}
            >
              Open the full topic
            </button>
          </div>
          <p className="focus-hero__trust">
            No timer. No streak. Stop when the hour is useful—not when an app says so.
          </p>
        </div>

        <aside className="hour-card" aria-label="Shape of the next study hour">
          <div className="hour-card__head">
            <span>Your next hour</span>
            <strong>60 min</strong>
          </div>
          <ol className="hour-card__steps">
            <li>
              <span className="hour-card__num">01</span>
              <span><strong>Learn</strong><small>Build the mental model</small></span>
              <time>10–20m</time>
            </li>
            <li>
              <span className="hour-card__num">02</span>
              <span><strong>Build</strong><small>Reach one real lab checkpoint</small></span>
              <time>30–40m</time>
            </li>
            <li>
              <span className="hour-card__num">03</span>
              <span><strong>Prove</strong><small>Answer without your notes</small></span>
              <time>10m</time>
            </li>
          </ol>
          {workedSteps > 0 && (
            <p className="hour-card__memory">{workedSteps} session step{workedSteps === 1 ? "" : "s"} remembered here.</p>
          )}
        </aside>
      </div>

      <div className="container focus-horizon" aria-label="Your learning horizon">
        <div>
          <span className="focus-horizon__label">You are here</span>
          <strong>{pathIndex + 1} of {guidedTrunkIds.length} required topics</strong>
          <span>{overall.done} completed · progress is a memory aid</span>
        </div>
        <div>
          <span className="focus-horizon__label">Stay with this</span>
          <strong>~{target.estimatedHours}h curriculum estimate</strong>
          <span>One topic can span several weeks. That is normal.</span>
        </div>
        <div>
          <span className="focus-horizon__label">This week</span>
          <strong>Learn · build · prove · return</strong>
          <span>Seven useful hours, not seven boxes to clear.</span>
        </div>
      </div>
    </section>
  );
}
