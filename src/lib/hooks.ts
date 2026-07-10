import { useCallback, useEffect, useState } from "react";
import { flushSync } from "react-dom";

/** Reactive media query. */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia(query).matches : false
  );
  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);
  return matches;
}

export type Theme = "light" | "dark";
const THEME_KEY = "cr:theme";

/** Persisted light/dark theme, defaulting to the OS preference. */
export function useTheme(): [Theme, () => void] {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      const stored = localStorage.getItem(THEME_KEY) as Theme | null;
      if (stored === "light" || stored === "dark") return stored;
    } catch {
      /* ignore */
    }
    if (typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }
    return "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      /* ignore */
    }
  }, [theme]);

  // Theme switches cross-fade via the View Transitions API where available —
  // a progressive enhancement that reduced-motion users never see.
  const toggle = useCallback(() => {
    const flip = () => setTheme((t) => (t === "light" ? "dark" : "light"));
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduced && typeof document !== "undefined" && "startViewTransition" in document) {
      (document as Document & {
        startViewTransition: (cb: () => void) => void;
      }).startViewTransition(() => flushSync(flip));
    } else {
      flip();
    }
  }, []);

  return [theme, toggle];
}
