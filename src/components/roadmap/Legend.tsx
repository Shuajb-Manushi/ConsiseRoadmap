import { branches } from "../../data/branches";

export function Legend() {
  return (
    <div className="legend paper">
      <div className="legend__group">
        <span className="legend__heading">Topic type</span>
        <span className="legend__item"><span className="legend__swatch legend__swatch--required" />Required</span>
        <span className="legend__item"><span className="legend__swatch legend__swatch--optional" />Optional</span>
        <span className="legend__item"><span className="legend__swatch legend__swatch--later" />Later / specialization</span>
        <span className="legend__item"><span className="legend__swatch legend__swatch--milestone" />Milestone project</span>
        <span className="legend__item"><span className="legend__swatch legend__swatch--done" aria-hidden="true">✓</span>Completed (local)</span>
      </div>
      <div className="legend__group">
        <span className="legend__heading">Branches</span>
        {branches.map((b) => (
          <span key={b.id} className="legend__item">
            <span className="legend__dot" style={{ background: `var(--b-${b.id})` }} />
            {b.name}
          </span>
        ))}
      </div>
    </div>
  );
}
