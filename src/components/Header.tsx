import type { Route } from "../lib/useHashRoute";
import type { Theme } from "../lib/hooks";

type NavFn = (route: Route) => void;

export function Header({
  route,
  navigate,
  onOpenSearch,
  theme,
  onToggleTheme,
}: {
  route: Route;
  navigate: NavFn;
  onOpenSearch: () => void;
  theme: Theme;
  onToggleTheme: () => void;
}) {
  const isCurrent = (name: Route["name"]) => (route.name === name ? "page" : undefined);
  const goToJourney = () => {
    navigate({ name: "roadmap" });
    window.setTimeout(
      () => document.getElementById("journey")?.scrollIntoView({ behavior: "smooth" }),
      50
    );
  };

  return (
    <header className="header">
      <div className="header__inner">
        <button className="brand" onClick={() => navigate({ name: "roadmap" })} aria-label="ConciseRoadmaps home">
          <span className="brand__mark" aria-hidden="true">cr/</span>
          <span className="brand__name">Concise<span>Roadmaps</span></span>
        </button>

        <button className="header__search" onClick={onOpenSearch} aria-label="Open search (Control or Command + K)">
          <span aria-hidden="true">⌕</span>
          <span className="header__search-label">Search topics…</span>
          <kbd>Ctrl K</kbd>
        </button>

        <nav className="header__nav" aria-label="Primary">
          <button className="navlink" aria-current={route.name === "roadmap" || route.name === "session" ? "page" : undefined} onClick={() => navigate({ name: "roadmap" })}>
            Today
          </button>
          <button className="navlink" onClick={goToJourney}>
            Journey
          </button>
          <button className="navlink" aria-current={isCurrent("resources")} onClick={() => navigate({ name: "resources" })}>
            Library
          </button>
          <button className="navlink" aria-current={isCurrent("about")} onClick={() => navigate({ name: "about" })}>
            Method
          </button>
          <button
            className="icon-btn"
            onClick={onToggleTheme}
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
            title={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
          >
            {theme === "light" ? "☾" : "☀"}
          </button>
        </nav>
      </div>
    </header>
  );
}
