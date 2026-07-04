import { useCallback, useEffect, useRef, useState } from "react";
import { useHashRoute } from "./lib/useHashRoute";
import { useTheme } from "./lib/hooks";
import { Header } from "./components/Header";
import { SearchModal } from "./components/SearchModal";
import { RoadmapView } from "./components/RoadmapView";
import { TopicDetail } from "./components/TopicDetail";
import { MilestoneDetail } from "./components/MilestoneDetail";
import { ResourceLibrary } from "./components/ResourceLibrary";
import { About } from "./components/About";
import { topicById } from "./data/topics";
import { milestones } from "./data/milestones";
import "./styles/app.css";

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

  // Move focus to the main heading on route change (SPA accessibility).
  useEffect(() => {
    if (route.name === "roadmap") return; // roadmap manages its own focus
    mainRef.current?.focus();
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
        {route.name === "roadmap" && <RoadmapView navigate={navigate} />}
        {route.name === "topic" && <TopicRoute id={route.id} navigate={navigate} />}
        {route.name === "milestone" && <MilestoneRoute id={route.id} navigate={navigate} />}
        {route.name === "resources" && <ResourceLibrary navigate={navigate} />}
        {route.name === "about" && <About navigate={navigate} />}
      </main>

      <footer className="app-footer">
        <div className="container">
          <p>
            <strong>ConciseRoadmaps</strong> — a free, static, practice-first path
            from C fundamentals to self-sufficient software engineering. Learn theory
            by using it. Everything is unlocked.
          </p>
          <p className="app-footer__meta">
            No accounts, no tracking, no backend. Built with React, TypeScript,
            and @xyflow/react.
          </p>
        </div>
      </footer>

      {searchOpen && <SearchModal onClose={closeSearch} navigate={navigate} />}
    </div>
  );
}

function TopicRoute({ id, navigate }: { id: string; navigate: ReturnType<typeof useHashRoute>["navigate"] }) {
  const topic = topicById.get(id);
  if (!topic) return <NotFound what={`topic "${id}"`} navigate={navigate} />;
  return <TopicDetail topic={topic} navigate={navigate} />;
}

function MilestoneRoute({ id, navigate }: { id: string; navigate: ReturnType<typeof useHashRoute>["navigate"] }) {
  const milestone = milestones.find((m) => m.id === id);
  if (!milestone) return <NotFound what={`milestone "${id}"`} navigate={navigate} />;
  return <MilestoneDetail milestone={milestone} navigate={navigate} />;
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
