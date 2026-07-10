import type { Topic } from "../data/types";

export type FocusPhase = "learn" | "build" | "prove";

export type FocusStep = {
  id: string;
  phase: FocusPhase;
  minutes: number;
  title: string;
  instruction: string;
  done: boolean;
};

export type FocusPlan = {
  topicId: string;
  totalMinutes: 60;
  steps: [FocusStep, FocusStep, FocusStep];
  checkpointIndex: number | null;
  masteryIndex: number | null;
  readyToComplete: boolean;
};

function firstIncomplete(prefix: string, items: readonly string[], done: ReadonlySet<string>) {
  const index = items.findIndex((_, i) => !done.has(`${prefix}:${i}`));
  return index === -1 ? null : index;
}

/**
 * Turn a large curriculum topic into one calm, honest hour. The plan advances
 * through the topic's real lab checkpoints and mastery checks; it never
 * invents exercises or treats time spent as proof of understanding.
 */
export function createFocusPlan(topic: Topic, done: ReadonlySet<string>): FocusPlan {
  const learned = done.has(`learn:${topic.id}`);
  const checkpointPrefix = `build:${topic.id}`;
  const validationPrefix = `validate:${topic.id}`;
  const masteryPrefix = `prove:${topic.id}`;
  const checkpointIndex = firstIncomplete(checkpointPrefix, topic.lab.checkpoints, done);
  const validationIndex = firstIncomplete(validationPrefix, topic.lab.validation, done);
  const masteryIndex = firstIncomplete(masteryPrefix, topic.masteryChecks, done);

  const buildId = checkpointIndex !== null
    ? `${checkpointPrefix}:${checkpointIndex}`
    : validationIndex !== null
      ? `${validationPrefix}:${validationIndex}`
      : `lab-ready:${topic.id}`;
  const buildTitle = checkpointIndex !== null
    ? `Reach checkpoint ${checkpointIndex + 1}`
    : validationIndex !== null
      ? `Validate the lab · check ${validationIndex + 1}`
      : "Audit the finished lab";
  const buildInstruction = checkpointIndex !== null
    ? topic.lab.checkpoints[checkpointIndex]
    : validationIndex !== null
      ? topic.lab.validation[validationIndex]
      : "Run the complete validation list once more and write down any failure you cannot explain.";

  const proveId = masteryIndex !== null ? `${masteryPrefix}:${masteryIndex}` : `mastery-ready:${topic.id}`;
  const proveInstruction = masteryIndex !== null
    ? topic.masteryChecks[masteryIndex]
    : "Explain the hardest design decision from the lab without looking at your notes.";

  const learnId = learned
    ? `review:${topic.id}:${checkpointIndex ?? validationIndex ?? "done"}`
    : `learn:${topic.id}`;

  const steps: [FocusStep, FocusStep, FocusStep] = [
    {
      id: learnId,
      phase: "learn",
      minutes: learned ? 10 : 20,
      title: learned ? "Retrieve before reviewing" : "Build the mental model",
      instruction: learned
        ? "Without notes, write three things you remember. Then revisit only the gaps in the primary resource."
        : topic.resources.primary[0]?.guidance ?? "Use the primary resource until you can state the central idea in your own words.",
      done: done.has(learnId),
    },
    {
      id: buildId,
      phase: "build",
      minutes: learned ? 40 : 30,
      title: buildTitle,
      instruction: buildInstruction,
      done: done.has(buildId),
    },
    {
      id: proveId,
      phase: "prove",
      minutes: 10,
      title: masteryIndex !== null ? `Mastery check ${masteryIndex + 1}` : "Teach it back",
      instruction: proveInstruction,
      done: done.has(proveId),
    },
  ];

  return {
    topicId: topic.id,
    totalMinutes: 60,
    steps,
    checkpointIndex,
    masteryIndex,
    readyToComplete:
      learned &&
      checkpointIndex === null &&
      validationIndex === null &&
      masteryIndex === null,
  };
}

/** A stored focus step must belong to a real topic and a known step family. */
export function focusStepTopicId(stepId: string): string | null {
  const match = stepId.match(/^(?:learn|review|build|validate|prove|lab-ready|mastery-ready):([^:]+)(?::.*)?$/);
  return match?.[1] ?? null;
}
