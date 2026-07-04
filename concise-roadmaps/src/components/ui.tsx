import type { ReactNode } from "react";
import type { Difficulty } from "../data/types";
import { difficultyLabel } from "../data/curriculum";

export function RequiredChip({ required }: { required: boolean }) {
  return (
    <span className={`chip ${required ? "chip--required" : "chip--optional"}`}>
      {required ? "Required" : "Optional"}
    </span>
  );
}

export function DifficultyChip({ difficulty }: { difficulty: Difficulty }) {
  return <span className={`chip chip--${difficulty}`}>{difficultyLabel[difficulty]}</span>;
}

export function HoursChip({ hours }: { hours: number }) {
  return <span className="chip">~{hours}h</span>;
}

export function BranchChip({ name, color }: { name: string; color: string }) {
  return (
    <span className="chip">
      <span className="chip__dot" style={{ background: color }} aria-hidden="true" />
      {name}
    </span>
  );
}

/** Collapsible section used for hints, alternatives, solution outlines. */
export function Disclosure({
  summary,
  children,
  tone,
}: {
  summary: string;
  children: ReactNode;
  tone?: "default" | "warn" | "solution";
}) {
  return (
    <details className={`disclosure disclosure--${tone ?? "default"}`}>
      <summary>{summary}</summary>
      <div className="disclosure__body">{children}</div>
    </details>
  );
}
