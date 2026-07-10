import { useCallback, useEffect, useState } from "react";
import { progressStore } from "./progressStore";

export type Route =
  | { name: "roadmap" }
  | { name: "session"; id: string }
  | { name: "topic"; id: string }
  | { name: "milestone"; id: string }
  | { name: "resources" }
  | { name: "about" };

function parseHash(): Route {
  const raw = window.location.hash.replace(/^#\/?/, "");
  const [head, param] = raw.split("/");
  switch (head) {
    case "session":
      return param ? { name: "session", id: param } : { name: "roadmap" };
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
    case "session":
      return `#/session/${route.id}`;
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
    const remember = (r: Route) => {
      if (r.name !== "topic") return;
      progressStore.recordRecent(r.id);
    };
    const onChange = () => {
      const next = parseHash();
      setRoute(next);
      remember(next);
    };
    window.addEventListener("hashchange", onChange);
    // normalize an empty hash on first load
    if (!window.location.hash) window.location.replace("#/roadmap");
    // a deep link straight to a topic counts as "recently opened" too
    remember(parseHash());
    return () => window.removeEventListener("hashchange", onChange);
  }, []);

  const navigate = useCallback((next: Route) => {
    window.location.hash = routeToHash(next);
  }, []);

  return { route, navigate };
}
