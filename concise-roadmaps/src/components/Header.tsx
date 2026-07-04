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

  return (
    <header className="header">
      <div className="header__inner">
        <button className="brand" onClick={() => navigate({ name: "roadmap" })} aria-label="ConciseRoadmaps home">
          <span className="brand__mark" aria-hidden="true">C</span>
          <span className="brand__name">ConciseRoadmaps</span>
        </button>

        <button className="header__search" onClick={onOpenSearch} aria-label="Open search (Control or Command + K)">
          <span aria-hidden="true">⌕</span>
          <span className="header__search-label">Search topics…</span>
          <kbd>Ctrl K</kbd>
        </button>

        <nav className="header__nav" aria-label="Primary">
          <button className="navlink" aria-current={isCurrent("roadmap")} onClick={() => navigate({ name: "roadmap" })}>
            Roadmap
          </button>
          <button className="navlink" aria-current={isCurrent("resources")} onClick={() => navigate({ name: "resources" })}>
            Resources
          </button>
          <button className="navlink" aria-current={isCurrent("about")} onClick={() => navigate({ name: "about" })}>
            About
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
