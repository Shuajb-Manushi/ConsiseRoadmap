import { useEffect, useState } from "react";
import type { Route } from "../lib/useHashRoute";
import type { FocusStep } from "../lib/focusPlan";
import { createFocusPlan } from "../lib/focusPlan";
import { topicById } from "../data/topics";
import { branchById } from "../data/branches";
import { usePractice } from "../lib/usePractice";
import { practiceStore } from "../lib/practiceStore";
import { useProgress } from "../lib/useProgress";
import { progressStore } from "../lib/progressStore";
import "../styles/focus.css";

export function StudySession({ id, navigate }: { id: string; navigate: (route: Route) => void }) {
  const topic = topicById.get(id)!;
  const branch = branchById.get(topic.branch);
  const practice = usePractice();
  const { done: completedTopics } = useProgress();
  // Freeze the three tasks for this visit. Checks should visibly stay checked;
  // the next unfinished checkpoint is chosen when the learner returns.
  const [sessionPlan] = useState(() => createFocusPlan(topic, practiceStore.getSnapshot().done));
  const plan = {
    ...sessionPlan,
    steps: sessionPlan.steps.map((step) => ({ ...step, done: practice.done.has(step.id) })) as typeof sessionPlan.steps,
    readyToComplete: createFocusPlan(topic, practice.done).readyToComplete,
  };
  const [note, setNote] = useState(practice.notes[id] ?? "");
  const [status, setStatus] = useState("");
  const completed = completedTopics.has(id);

  useEffect(() => setNote(practiceStore.getSnapshot().notes[id] ?? ""), [id]);

  const toggleStep = (step: FocusStep) => {
    practiceStore.toggleStep(step.id);
    setStatus(`${step.phase} step marked ${practiceStore.getSnapshot().done.has(step.id) ? "done" : "not done"}.`);
  };

  const saveNote = (value: string) => {
    setNote(value);
    practiceStore.setNote(id, value);
    setStatus(value.trim() ? "Journal saved on this device." : "Journal entry cleared.");
  };

  const toggleTopic = () => {
    progressStore.toggle(id);
    setStatus(progressStore.isDone(id) ? "Topic marked complete." : "Topic marked not complete.");
  };

  return (
    <article className="session-page">
      <div className="container session-shell">
        <nav className="session-back" aria-label="Leave focus session">
          <button onClick={() => navigate({ name: "roadmap" })}>← Today</button>
          <button onClick={() => navigate({ name: "topic", id })}>Full topic</button>
        </nav>

        <header className="session-head">
          <div>
            <p className="focus-kicker">Focus session · {branch?.name}</p>
            <h1>{topic.title}</h1>
            <p>{topic.lab.outcome}</p>
          </div>
          <div className="session-head__stamp" aria-label="Session length">
            <strong>60</strong>
            <span>useful minutes</span>
          </div>
        </header>

        <div className="session-principle" role="note">
          <strong>One rule:</strong> attempt before hints. The plan remembers your checks and
          journal locally, but only you decide whether you understand.
        </div>

        <ol className="session-steps" aria-label="Learn, build, prove">
          {plan.steps.map((step, index) => (
            <li key={step.id} className={`session-step session-step--${step.phase}`}>
              <div className="session-step__rail" aria-hidden="true">
                <span>{String(index + 1).padStart(2, "0")}</span>
              </div>
              <div className="session-step__body">
                <div className="session-step__head">
                  <div>
                    <span className="session-step__phase">{step.phase}</span>
                    <h2>{step.title}</h2>
                  </div>
                  <time>{step.minutes} min</time>
                </div>
                <p className="session-step__instruction">{step.instruction}</p>

                {step.phase === "learn" && topic.resources.primary[0] && (
                  <a
                    className="session-resource"
                    href={topic.resources.primary[0].url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span>Primary guide</span>
                    <strong>{topic.resources.primary[0].title}</strong>
                    <small>{topic.resources.primary[0].provider} · opens in a new tab ↗</small>
                  </a>
                )}

                {step.phase === "build" && (
                  <div className="session-lab-context">
                    <p><strong>{topic.lab.title}</strong> · {topic.lab.scenario}</p>
                    <details>
                      <summary>Stuck after a real attempt? Reveal one hint</summary>
                      <p>{topic.lab.hints[Math.min(plan.checkpointIndex ?? 0, topic.lab.hints.length - 1)]}</p>
                    </details>
                  </div>
                )}

                {step.phase === "prove" && (
                  <p className="session-prove-note">
                    Say it aloud, sketch it, or write it below. Recognition is not recall.
                  </p>
                )}

                <button
                  className="session-check"
                  aria-pressed={step.done}
                  onClick={() => toggleStep(step)}
                >
                  <span aria-hidden="true">✓</span>
                  {step.done ? "Done for this pass" : `I did the ${step.phase} step`}
                </button>
              </div>
            </li>
          ))}
        </ol>

        <section className="session-journal" aria-labelledby="journal-title">
          <div className="session-journal__intro">
            <p className="focus-kicker">Build journal</p>
            <h2 id="journal-title">Leave a note for your future self.</h2>
            <p>What surprised you? Where are you stuck? What will you try first next time?</p>
          </div>
          <label htmlFor="session-note">Notes for {topic.title}</label>
          <textarea
            id="session-note"
            value={note}
            maxLength={12000}
            onChange={(event) => saveNote(event.target.value)}
            placeholder="I expected… / I discovered… / Next I will…"
            rows={8}
          />
          <span>{note.length.toLocaleString()} / 12,000 · saved only in this browser</span>
        </section>

        <section className={`session-close ${plan.readyToComplete ? "session-close--ready" : ""}`}>
          <div>
            <p className="focus-kicker">Close the loop</p>
            <h2>{plan.readyToComplete ? "The evidence is here." : "Stopping is part of the work."}</h2>
            <p>
              {plan.readyToComplete
                ? "You have checked every lab checkpoint, validation step, and mastery prompt. Mark complete only if that matches your honest judgment."
                : "Keep the topic open across as many sessions as it needs. Your next visit will advance to the first unfinished piece."}
            </p>
          </div>
          <div className="session-close__actions">
            <button className="btn" onClick={() => navigate({ name: "roadmap" })}>Return to today</button>
            <button className="complete-toggle" aria-pressed={completed} onClick={toggleTopic}>
              <span className="complete-toggle__box" aria-hidden="true">✓</span>
              {completed ? "Topic completed" : "Mark topic complete"}
            </button>
          </div>
        </section>
        <p className="visually-hidden" role="status" aria-live="polite">{status}</p>
      </div>
    </article>
  );
}
