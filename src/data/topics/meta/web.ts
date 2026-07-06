import type { TopicMeta } from "../../types";


export const webMeta: TopicMeta[] = [
  {
    id: "web-how-internet-works",
    title: "How the Internet & the Web Actually Work",
    branch: "web",
    stage: 1,
    required: true,
    difficulty: "foundation",
    estimatedHours: 8,
    summary:
      "The end-to-end story before writing web code: a URL typed, DNS resolving a name to an address, TCP establishing a connection, TLS securing it, HTTP carrying request and response, and the browser turning bytes into pixels. Client/server model, the request/response cycle, and where your code will eventually sit.",
    prerequisiteIds: ["terminal-filesystems"],
  },
  {
    id: "web-html-a11y",
    title: "Semantic HTML, Forms & Accessibility",
    branch: "web",
    stage: 2,
    required: true,
    difficulty: "foundation",
    estimatedHours: 8,
    summary:
      "HTML as meaning, not decoration: semantic elements that describe structure, forms done right (labels, validation, fieldsets), and accessibility as a first-class requirement — because the semantic markup that helps screen readers is the same markup that helps search engines, your CSS, and your future self.",
    prerequisiteIds: ["web-how-internet-works"],
  },
  {
    id: "web-css",
    title: "CSS: Box Model, Layout & Responsive Design",
    branch: "web",
    stage: 3,
    required: true,
    difficulty: "intermediate",
    estimatedHours: 12,
    summary:
      "CSS with a mental model instead of guesswork: the box model, the cascade and specificity, modern layout with Flexbox and Grid, responsive design via fluid layouts and media queries, custom properties for maintainable theming, and the discipline that keeps stylesheets from rotting into chaos.",
    prerequisiteIds: ["web-html-a11y"],
  },
  {
    id: "web-javascript",
    title: "JavaScript: The Language",
    branch: "web",
    stage: 4,
    required: true,
    difficulty: "intermediate",
    estimatedHours: 16,
    summary:
      "JavaScript as a real language, learned properly to avoid its famous traps: values and types (and coercion), functions and closures (you know these from Python), objects and prototypes, arrays and their functional methods, modules, and error handling. The foundation for the DOM, async, TypeScript, and React that follow.",
    prerequisiteIds: ["web-css", "py-core"],
  },
  {
    id: "web-dom-async",
    title: "DOM, Events, Async & Fetch",
    branch: "web",
    stage: 5,
    required: true,
    difficulty: "intermediate",
    estimatedHours: 12,
    summary:
      "Making pages live: selecting and manipulating the DOM, the event model (bubbling, delegation), the event loop and why JS is single-threaded-but-async, Promises and async/await (your Python async intuition transfers), fetch for talking to servers with real failure handling, and browser storage.",
    prerequisiteIds: ["web-javascript"],
  },
  {
    id: "web-typescript",
    title: "TypeScript: Practical Type Design",
    branch: "web",
    stage: 6,
    required: true,
    difficulty: "intermediate",
    estimatedHours: 10,
    summary:
      "TypeScript as JavaScript with a checked contract layer: basic and composite types, interfaces vs. type aliases, unions and the discriminated-union pattern (your C tagged unions return, now type-checked), generics for reusable code, narrowing, and the practical wisdom of typing at boundaries without fighting the checker.",
    prerequisiteIds: ["web-javascript", "py-classes-types"],
  },
  {
    id: "web-react",
    title: "React: Components, State & Data",
    branch: "web",
    stage: 7,
    required: true,
    difficulty: "advanced",
    estimatedHours: 20,
    summary:
      "React with a solid foundation beneath it (you built state→render by hand): components and props, state and the rules of hooks, composition, effects (and when NOT to use them), controlled forms, client-side routing, and handling loading/error/empty states as a matter of course. TypeScript throughout.",
    prerequisiteIds: ["web-dom-async", "web-typescript"],
  },
  {
    id: "web-frontend-quality",
    title: "Frontend Testing, Accessibility & Browser Security",
    branch: "web",
    stage: 8,
    required: true,
    difficulty: "advanced",
    estimatedHours: 10,
    summary:
      "Making frontends trustworthy: testing components by behavior (Testing Library's user-centric approach), accessibility carried into components (focus management, ARIA when needed, keyboard support), and the browser security model — same-origin policy, CORS, XSS and CSRF concepts, safe HTML, and secure handling of tokens in the browser.",
    prerequisiteIds: ["web-react"],
  },
];
