import { useState } from "react";
import type { Route } from "../lib/useHashRoute";
import { Legend } from "./roadmap/Legend";
import { VerticalRoadmap, type CompletionFilter } from "./roadmap/VerticalRoadmap";
import { GuidedRoadmap } from "./roadmap/GuidedRoadmap";
import { ViewSwitch, type ViewId } from "./ViewSwitch";
import { ProgressPanel } from "./ProgressPanel";
import { FocusDesk } from "./FocusDesk";
import { topicCount, milestoneCount, totalRequiredHours, branches } from "../data/curriculum";
import type { BranchId } from "../data/types";
import "../styles/roadmap.css";

export function RoadmapView({ navigate }: { navigate: (r: Route) => void }) {
  const [view, setView] = useState<ViewId>("guided");
  const [branchFilter, setBranchFilter] = useState<BranchId | "all">("all");
  const [completionFilter, setCompletionFilter] = useState<CompletionFilter>("all");

  return (
    <div className="roadmap-view">
      <FocusDesk navigate={navigate} />

      <ProgressPanel navigate={navigate} />

      <section className="container journey-head" id="journey">
        <div>
          <p className="focus-kicker">The whole journey</p>
          <h2>See where today fits—without carrying the whole map at once.</h2>
          <p>
            The prerequisite graph is the truth. The guided path is one calm way through it.
            Everything stays unlocked, so a real project can pull you sideways when it should.
          </p>
        </div>
        <dl className="journey-stats">
          <div><dt>{topicCount}</dt><dd>topic clusters</dd></div>
          <div><dt>{branches.length}</dt><dd>branches</dd></div>
          <div><dt>{milestoneCount}</dt><dd>real projects</dd></div>
          <div><dt>~{Math.round(totalRequiredHours)}h</dt><dd>guidance, never a deadline</dd></div>
        </dl>
      </section>

      <section className="container roadmap-switch-wrap" aria-label="Choose how to view the roadmap">
        <ViewSwitch value={view} onChange={setView} />
      </section>

      <section className="container roadmap-legend-wrap">
        <Legend />
      </section>

      {view === "guided" ? (
        <section
          className="container roadmap-panel view-enter"
          id="viewpanel-guided"
          role="tabpanel"
          aria-labelledby="viewtab-guided"
          key="guided"
        >
          <GuidedRoadmap navigate={navigate} />
        </section>
      ) : (
        <section
          className="container roadmap-panel view-enter"
          id="viewpanel-browse"
          role="tabpanel"
          aria-labelledby="viewtab-browse"
          key="browse"
        >
          <div className="browse-head">
            <h2>Browse every topic</h2>
            <p className="browse-head__note">
              The full curriculum as an ordered catalog. Focus on one branch when you want a
              smaller, calmer reading list, or scan the full path and its milestones.
            </p>
            <div className="browse-filter" role="group" aria-label="Filter topics by branch">
              <button
                className={`browse-filter__button ${branchFilter === "all" ? "is-active" : ""}`}
                aria-pressed={branchFilter === "all"}
                onClick={() => setBranchFilter("all")}
              >
                All branches
              </button>
              {branches.map((branch) => (
                <button
                  key={branch.id}
                  className={`browse-filter__button ${branchFilter === branch.id ? "is-active" : ""}`}
                  aria-pressed={branchFilter === branch.id}
                  onClick={() => setBranchFilter(branch.id)}
                >
                  <span
                    className="browse-filter__dot"
                    style={{ background: `var(--b-${branch.id})` }}
                    aria-hidden="true"
                  />
                  {branch.name}
                </button>
              ))}
            </div>
            <div className="browse-filter browse-filter--completion" role="group" aria-label="Filter topics by completion">
              {(
                [
                  ["all", "Everything"],
                  ["remaining", "Still to do"],
                  ["completed", "Completed"],
                ] as const
              ).map(([value, label]) => (
                <button
                  key={value}
                  className={`browse-filter__button ${completionFilter === value ? "is-active" : ""}`}
                  aria-pressed={completionFilter === value}
                  onClick={() => setCompletionFilter(value)}
                >
                  {label}
                </button>
              ))}
            </div>
            <p className="browse-filter__status" role="status">
              {(branchFilter === "all"
                ? "Showing every branch and milestone project"
                : `Showing ${branches.find((branch) => branch.id === branchFilter)?.name ?? "this branch"}`) +
                (completionFilter === "all"
                  ? "."
                  : completionFilter === "remaining"
                    ? " — hiding what you've completed."
                    : " — only what you've completed.")}
            </p>
            <nav className="branch-jump" aria-label="Jump to branch">
              {branches.map((b) => (
                <a key={b.id} className="branch-jump__link" href={`#/roadmap`} onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(`vb-${b.id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}>
                  <span className="branch-jump__dot" style={{ background: `var(--b-${b.id})` }} />
                  {b.name}
                </a>
              ))}
            </nav>
          </div>
          <VerticalRoadmap
            navigate={navigate}
            branchFilter={branchFilter}
            completionFilter={completionFilter}
          />
        </section>
      )}
    </div>
  );
}
