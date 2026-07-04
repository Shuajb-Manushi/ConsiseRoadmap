import { useRef } from "react";

export type ViewId = "guided" | "browse";

const OPTIONS: { id: ViewId; label: string }[] = [
  { id: "guided", label: "Guided roadmap" },
  { id: "browse", label: "Browse all topics" },
];

/**
 * A refined segmented control implemented as an ARIA tablist. An orange
 * indicator slides between the two options; selection is keyboard-driven with
 * arrow keys and respects prefers-reduced-motion (handled in CSS).
 */
export function ViewSwitch({
  value,
  onChange,
}: {
  value: ViewId;
  onChange: (v: ViewId) => void;
}) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const activeIndex = OPTIONS.findIndex((o) => o.id === value);

  const onKeyDown = (e: React.KeyboardEvent, index: number) => {
    let next = index;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = (index + 1) % OPTIONS.length;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp")
      next = (index - 1 + OPTIONS.length) % OPTIONS.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = OPTIONS.length - 1;
    else return;
    e.preventDefault();
    onChange(OPTIONS[next].id);
    refs.current[next]?.focus();
  };

  return (
    <div className="viewswitch" role="tablist" aria-label="Roadmap view">
      <span
        className="viewswitch__indicator"
        aria-hidden="true"
        style={{ transform: `translateX(${activeIndex * 100}%)` }}
      />
      {OPTIONS.map((opt, i) => (
        <button
          key={opt.id}
          ref={(el) => (refs.current[i] = el)}
          role="tab"
          id={`viewtab-${opt.id}`}
          aria-selected={value === opt.id}
          aria-controls={`viewpanel-${opt.id}`}
          tabIndex={value === opt.id ? 0 : -1}
          className={`viewswitch__tab ${value === opt.id ? "is-active" : ""}`}
          onClick={() => onChange(opt.id)}
          onKeyDown={(e) => onKeyDown(e, i)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
