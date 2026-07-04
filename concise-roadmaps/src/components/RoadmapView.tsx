import { useState } from "react";
import type { Route } from "../lib/useHashRoute";
import { Legend } from "./roadmap/Legend";
import { VerticalRoadmap } from "./roadmap/VerticalRoadmap";
import { GuidedRoadmap } from "./roadmap/GuidedRoadmap";
import { ViewSwitch, type ViewId } from "./ViewSwitch";
import { startHere, topicCount, milestoneCount, totalRequiredHours, branches } from "../data/curriculum";
import "../styles/roadmap.css";

export function RoadmapView({ navigate }: { navigate: (r: Route) => void }) {
  const [view, setView] = useState<ViewId>("guided");

  return (
    <div className="roadmap-view">
      <section className="roadmap-hero">
        <div className="container">
          <p className="roadmap-hero__kicker">A practice-first path · everything unlocked</p>
          <h1 className="roadmap-hero__title">
            <span className="roadmap-hero__accent">From C fundamentals</span> to a
            self-sufficient software engineer.
          </h1>
          <p className="roadmap-hero__lede">{startHere.guidance}</p>
          <div className="roadmap-hero__actions">
            <button
              className="btn btn--primary"
              onClick={() => navigate({ name: "topic", id: startHere.topicId })}
            >
              Start here →
            </button>
            <button className="btn" onClick={() => navigate({ name: "about" })}>
              How to use this
            </button>
          </div>
          <dl className="roadmap-hero__stats">
            <div><dt>{topicCount}</dt><dd>topic clusters</dd></div>
            <div><dt>{branches.length}</dt><dd>branches</dd></div>
            <div><dt>{milestoneCount}</dt><dd>milestone projects</dd></div>
            <div><dt>~{Math.round(totalRequiredHours)}</dt><dd>required hours (guidance)</dd></div>
          </dl>
        </div>
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
              The full curriculum as an ordered catalog — every branch, topic, and milestone.
              Jump to a branch or scan the lot.
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
          <VerticalRoadmap navigate={navigate} />
        </section>
      )}
    </div>
  );
}
