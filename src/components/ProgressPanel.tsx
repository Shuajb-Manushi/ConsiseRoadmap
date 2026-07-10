import { useRef, useState } from "react";
import type { Route } from "../lib/useHashRoute";
import { useProgress } from "../lib/useProgress";
import {
  overallProgress,
  progressCounts,
  resumeTargetId,
  phaseOfTopic,
} from "../lib/progress";
import { topicMetaById } from "../data/topics/lite";
import { milestoneCount } from "../data/curriculum";
import { ConfirmDialog } from "./ConfirmDialog";
import { usePractice } from "../lib/usePractice";
import { exportLearnerData, importLearnerData, resetLearnerData } from "../lib/learnerData";

/**
 * "Your progress" — a quiet paper panel that only exists once the learner has
 * done something: overall completion, a resume affordance, recently opened
 * topics, and the local-data utilities (export / import / reset). Everything
 * is stored in this browser only; the utilities make that portable.
 */
export function ProgressPanel({ navigate }: { navigate: (r: Route) => void }) {
  const { done, recents } = useProgress();
  const practice = usePractice();
  const [confirming, setConfirming] = useState(false);
  const [status, setStatus] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const overall = overallProgress(done);
  const counts = progressCounts(done);
  const started =
    done.size > 0 ||
    recents.length > 0 ||
    practice.done.size > 0 ||
    Object.keys(practice.notes).length > 0;
  if (!started) return null;

  const resumeId = resumeTargetId(done, recents);
  const resume = resumeId ? topicMetaById.get(resumeId) : null;
  const resumePhase = resumeId ? phaseOfTopic(resumeId) : null;
  const recentTopics = recents
    .map((id) => topicMetaById.get(id))
    .filter((t): t is NonNullable<typeof t> => !!t)
    .slice(0, 3);

  const exportProgress = () => {
    const blob = new Blob([exportLearnerData()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "concise-roadmaps-learner-data.json";
    a.click();
    URL.revokeObjectURL(url);
    setStatus("Progress, session checks, and journal exported as one JSON file.");
  };

  const importProgress = async (file: File | undefined) => {
    if (!file) return;
    const result = importLearnerData(await file.text());
    if (!result) {
      setStatus("That file isn't ConciseRoadmaps progress data — nothing was changed.");
    } else {
      const skipped =
        result.unknown > 0
          ? ` (${result.unknown} unknown id${result.unknown === 1 ? "" : "s"} skipped)`
          : "";
      const added = result.completedAdded + result.sessionStepsAdded + result.notesAdded;
      setStatus(
        added === 0
          ? `Nothing new to import—this browser already has that learner data${skipped}.`
          : `Imported ${result.completedAdded} completions, ${result.sessionStepsAdded} session checks, and ${result.notesAdded} journal entries${skipped}.`
      );
    }
    if (fileRef.current) fileRef.current.value = "";
  };

  const resetProgress = () => {
    resetLearnerData();
    setConfirming(false);
    setStatus("All progress erased from this browser.");
  };

  return (
    <section className="container progress-wrap" aria-label="Your progress">
      <div className="progress-panel paper">
        <div className="progress-panel__head">
          <span className="progress-panel__label">Your progress</span>
          <span className="progress-panel__counts">
            {overall.done} of {overall.total} required topics
            {counts.milestones > 0 &&
              ` · ${counts.milestones} of ${milestoneCount} milestones`}
          </span>
        </div>

        <div
          className="progress-meter"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={overall.total}
          aria-valuenow={overall.done}
          aria-label={`Required topics completed: ${overall.done} of ${overall.total}`}
        >
          <span className="progress-meter__fill" style={{ width: `${overall.pct}%` }} />
        </div>

        <div className="progress-panel__body">
          {resume ? (
            <button
              className="btn btn--primary progress-panel__resume"
              onClick={() => navigate({ name: "topic", id: resume.id })}
            >
              Continue: {resume.title} →
            </button>
          ) : (
            <p className="progress-panel__complete">
              Every required topic is complete. Extraordinary work — the side branches and
              milestone projects are all yours.
            </p>
          )}
          {resume && resumePhase && (
            <span className="progress-panel__phase">
              Phase {resumePhase.number} · {resumePhase.title}
            </span>
          )}
        </div>

        {recentTopics.length > 0 && (
          <p className="progress-panel__recents">
            <span className="progress-panel__recents-label">Recently opened</span>
            {recentTopics.map((t, i) => (
              <span key={t.id}>
                {i > 0 && <span aria-hidden="true"> · </span>}
                <a href={`#/topic/${t.id}`}>{t.title}</a>
              </span>
            ))}
          </p>
        )}

        <div className="progress-panel__tools">
          <span className="progress-panel__note">Progress, session checks, and journal stay here.</span>
          <button className="progress-tool" onClick={exportProgress}>
            Export
          </button>
          <button className="progress-tool" onClick={() => fileRef.current?.click()}>
            Import
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            className="visually-hidden"
            tabIndex={-1}
            aria-hidden="true"
            onChange={(e) => importProgress(e.target.files?.[0])}
          />
          <button className="progress-tool progress-tool--danger" onClick={() => setConfirming(true)}>
            Reset…
          </button>
        </div>
        <p className="progress-panel__status" role="status" aria-live="polite">
          {status}
        </p>
      </div>

      {confirming && (
        <ConfirmDialog
          title="Erase all progress?"
          body={`This removes ${done.size} completed item${done.size === 1 ? "" : "s"}, ${practice.done.size} session checks, and ${Object.keys(practice.notes).length} journal entries from this browser only. Export first if you want a backup.`}
          confirmLabel="Erase progress"
          onConfirm={resetProgress}
          onCancel={() => setConfirming(false)}
        />
      )}
    </section>
  );
}
