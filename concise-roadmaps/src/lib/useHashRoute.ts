import { useCallback, useEffect, useState } from "react";

export type Route =
  | { name: "roadmap" }
  | { name: "topic"; id: string }
  | { name: "milestone"; id: string }
  | { name: "resources" }
  | { name: "about" };

const LAST_TOPIC_KEY = "cr:last-topic";

function parseHash(): Route {
  const raw = window.location.hash.replace(/^#\/?/, "");
  const [head, param] = raw.split("/");
  switch (head) {
    case "topic":
      return param ? { name: "topic", id: param } : { name: "roadmap" };
    case "milestone":
      return param ? { name: "milestone", id: param } : { name: "roadmap" };
    case "resources":
      return { name: "resources" };
    case "about":
      return { name: "about" };
    case "":
    case "roadmap":
      return { name: "roadmap" };
    default:
      return { name: "roadmap" };
  }
}

export function routeToHash(route: Route): string {
  switch (route.name) {
    case "roadmap":
      return "#/roadmap";
    case "topic":
      return `#/topic/${route.id}`;
    case "milestone":
      return `#/milestone/${route.id}`;
    case "resources":
      return "#/resources";
    case "about":
      return "#/about";
  }
}

export function useHashRoute() {
  const [route, setRoute] = useState<Route>(() => parseHash());

  useEffect(() => {
    const onChange = () => {
      const next = parseHash();
      setRoute(next);
      if (next.name === "topic") {
        try {
          localStorage.setItem(LAST_TOPIC_KEY, next.id);
        } catch {
          /* storage may be unavailable; non-critical */
        }
      }
    };
    window.addEventListener("hashchange", onChange);
    // normalize an empty hash on first load
    if (!window.location.hash) window.location.replace("#/roadmap");
    return () => window.removeEventListener("hashchange", onChange);
  }, []);

  const navigate = useCallback((next: Route) => {
    window.location.hash = routeToHash(next);
  }, []);

  return { route, navigate };
}

export function getLastTopicId(): string | null {
  try {
    return localStorage.getItem(LAST_TOPIC_KEY);
  } catch {
    return null;
  }
}
