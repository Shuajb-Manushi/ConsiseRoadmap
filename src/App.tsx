import { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useHashRoute } from "./lib/useHashRoute";
import { useTheme } from "./lib/hooks";
import { Header } from "./components/Header";
import { RoadmapView } from "./components/RoadmapView";
import { About } from "./components/About";
import { topicMetaById } from "./data/topics/lite";
import { milestonesLite } from "./data/milestonesLite";
import "./styles/app.css";

// The detail routes, resource library, and search import the full curriculum
// (all topic bodies + the resource catalog). Loading them lazily keeps that
// prose out of the initial bundle; they share one curriculum chunk.
const TopicDetail = lazy(() =>
  import("./components/TopicDetail").then((m) => ({ default: m.TopicDetail }))
);
const StudySession = lazy(() =>
  import("./components/StudySession").then((m) => ({ default: m.StudySession }))
);
const MilestoneDetail = lazy(() =>
  import("./components/MilestoneDetail").then((m) => ({ default: m.MilestoneDetail }))
);
const ResourceLibrary = lazy(() =>
  import("./components/ResourceLibrary").then((m) => ({ default: m.ResourceLibrary }))
);
const SearchModal = lazy(() =>
  import("./components/SearchModal").then((m) => ({ default: m.SearchModal }))
);

function RouteFallback() {
  return (
    <div className="container detail-page route-fallback" aria-busy="true" aria-live="polite">
      <p className="route-fallback__eyebrow">Opening your learning material</p>
      <div className="route-fallback__line route-fallback__line--title" />
      <div className="route-fallback__line route-fallback__line--wide" />
      <div className="route-fallback__line route-fallback__line--medium" />
      <div className="route-fallback__panel">
        <div className="route-fallback__line route-fallback__line--short" />
        <div className="route-fallback__line route-fallback__line--wide" />
        <div className="route-fallback__line route-fallback__line--medium" />
      </div>
      <span className="visually-hidden">Loading…</span>
    </div>
  );
}

export function App() {
  const { route, navigate } = useHashRoute();
  const [theme, toggleTheme] = useTheme();
  const [searchOpen, setSearchOpen] = useState(false);
  const mainRef = useRef<HTMLElement>(null);

  // Global Ctrl/Cmd+K to open search.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === "Escape") setSearchOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Deterministic SPA focus: on EVERY route change (including returning to
  // the roadmap, forward/back, and invalid ids) move focus to <main> and
  // reset scroll. Skipped on initial mount so page load doesn't steal focus.
  const prevRouteRef = useRef(route);
  useEffect(() => {
    if (prevRouteRef.current === route) return; // initial mount
    prevRouteRef.current = route;
    mainRef.current?.focus({ preventScroll: true });
    mainRef.current?.scrollTo?.(0, 0);
    window.scrollTo(0, 0);
  }, [route]);

  const closeSearch = useCallback(() => setSearchOpen(false), []);

  return (
    <div className="app-shell">
      <a href="#main" className="skip-link">Skip to content</a>
      <Header
        route={route}
        navigate={navigate}
        onOpenSearch={() => setSearchOpen(true)}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      <main id="main" ref={mainRef} tabIndex={-1} className="app-main">
        <Suspense fallback={<RouteFallback />}>
          {route.name === "roadmap" && <RoadmapView navigate={navigate} />}
          {route.name === "session" && <SessionRoute id={route.id} navigate={navigate} />}
          {route.name === "topic" && <TopicRoute id={route.id} navigate={navigate} />}
          {route.name === "milestone" && <MilestoneRoute id={route.id} navigate={navigate} />}
          {route.name === "resources" && <ResourceLibrary navigate={navigate} />}
          {route.name === "about" && <About navigate={navigate} />}
        </Suspense>
      </main>

      <footer className="app-footer">
        <div className="container">
          <p>
            <strong>ConciseRoadmaps</strong> — a calm, practice-first path from C
            fundamentals to self-sufficient software engineering.
          </p>
          <p className="app-footer__meta">
            No account, no streaks, no telemetry. Your progress, session checks, and journal
            stay in this browser and can leave as one JSON file.
          </p>
        </div>
      </footer>

      {searchOpen && (
        <Suspense fallback={null}>
          <SearchModal onClose={closeSearch} navigate={navigate} />
        </Suspense>
      )}
    </div>
  );
}

function SessionRoute({ id, navigate }: { id: string; navigate: ReturnType<typeof useHashRoute>["navigate"] }) {
  if (!topicMetaById.has(id)) return <NotFound what={`topic "${id}"`} navigate={navigate} />;
  return <StudySession id={id} navigate={navigate} />;
}

function TopicRoute({ id, navigate }: { id: string; navigate: ReturnType<typeof useHashRoute>["navigate"] }) {
  if (!topicMetaById.has(id)) return <NotFound what={`topic "${id}"`} navigate={navigate} />;
  return <TopicDetail id={id} navigate={navigate} />;
}

function MilestoneRoute({ id, navigate }: { id: string; navigate: ReturnType<typeof useHashRoute>["navigate"] }) {
  if (!milestonesLite.some((m) => m.id === id)) {
    return <NotFound what={`milestone "${id}"`} navigate={navigate} />;
  }
  return <MilestoneDetail id={id} navigate={navigate} />;
}

function NotFound({ what, navigate }: { what: string; navigate: ReturnType<typeof useHashRoute>["navigate"] }) {
  return (
    <div className="container detail-page">
      <h1>Not found</h1>
      <p>We couldn't find {what}.</p>
      <button className="btn btn--primary" onClick={() => navigate({ name: "roadmap" })}>
        Back to the roadmap
      </button>
    </div>
  );
}
