import type { TopicDraft } from "../types";
import { R } from "../resourceCatalog";

export const webTopics: TopicDraft[] = [
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
    whyItMatters:
      "You'll spend years building on this stack; a wrong mental model here causes confusion forever ('why is it slow?', 'why cross-origin errors?', 'what is a cookie?'). Understanding the layers also means understanding where security lives — TLS, origins, headers — before you can misconfigure them.",
    prerequisiteIds: ["terminal-filesystems"],
    concepts: [
      "Client/server and the request/response cycle",
      "URLs dissected: scheme, host, port, path, query, fragment",
      "DNS: names → IP addresses, and caching layers",
      "TCP: reliable ordered bytes (the guarantees you'll rely on and later build on)",
      "TLS/HTTPS: what encryption and certificates actually protect, and against whom",
      "HTTP anatomy revisited from the browser side: methods, status, headers, bodies",
      "The browser pipeline: HTML → DOM, CSS → styles, render, and the network waterfall",
    ],
    practicalUses: [
      "Reading DevTools' Network tab to diagnose any web problem",
      "Understanding latency, caching, and why a page is slow",
      "Reasoning about where data is exposed vs. protected",
    ],
    lab: {
      title: "Trace a Page, End to End",
      scenario:
        "Become the packet detective: for a real website, document every step from keystroke to rendered pixel using actual tools — dig/nslookup for DNS, curl for raw HTTP, the browser DevTools Network tab for the full waterfall — and produce an annotated map of what happened and how long each stage took.",
      outcome:
        "The abstract stack becomes concrete because you observed each layer with real tools, and DevTools' Network tab becomes a diagnostic instrument you can read fluently.",
      requirements: [
        "Resolve a domain with dig/nslookup; document the A record, TTL, and what caching implies",
        "Fetch a page with curl -v: capture and annotate the full request and response headers, identify the TLS handshake lines, and read the status + content-type",
        "In DevTools Network: reload with cache disabled, screenshot the waterfall, and annotate DNS/connect/TLS/TTFB/download for the main document and identify the three slowest resources",
        "Compare http vs https for a site that supports both (or explain via curl what changes) — what is now unreadable to a network eavesdropper?",
        "A one-page diagram: keystroke → DNS → TCP → TLS → HTTP → parse → render, with your measured numbers annotated",
      ],
      checkpoints: [
        "You can point to the exact bytes of an HTTP request and name each part",
        "Your waterfall annotations correctly distinguish connection setup from download time",
        "You can explain what the certificate proved and what it didn't",
      ],
      hints: [
        "curl -v shows the request (>) and response (<) lines separately — read the direction markers.",
        "TTFB (time to first byte) mostly reflects server think-time + network round trips; large download time is bandwidth. Different problems, different fixes.",
        "DNS TTL explains why a site change 'took a while to show up' — caching at every layer.",
      ],
      validation: [
        "A classmate can follow your diagram and reproduce your DNS + curl findings",
        "You correctly predict which resource is the render bottleneck before revealing the waterfall",
      ],
      solutionOutline: [
        "The layers compose: DNS (name→address) → TCP (a reliable byte pipe) → TLS (encrypt that pipe, authenticate the server) → HTTP (structured messages over the pipe) → browser (parse+render). Each layer trusts the one below and serves the one above.",
        "The waterfall visualizes serialization vs. parallelism: connection setup is per-origin overhead; understanding it explains most 'why slow' questions.",
        "HTTPS protects confidentiality and integrity in transit and authenticates the server — it does not protect data at rest or vouch for the site's honesty.",
      ],
      extensions: [
        "Explore HTTP/2 multiplexing in the waterfall — why fewer connections but more parallel streams",
        "Use Wireshark (preview of systems branch) to see the TCP handshake packets directly",
      ],
    },
    resources: {
      primary: [
        { ...R.codeOrgInternet, guidance: "Watch all eight short videos in order (~45 min): wires, IP & DNS, packets, HTTP, encryption. Then do the trace lab with the vocabulary fresh." },
      ],
      alternatives: [
        { ...R.practicalNetworking, guidance: "Lessons 1–3 (hosts, networks, OSI model) if you want more technical depth than the series." },
      ],
      practice: [],
      extra: [
        { ...R.beejNet, guidance: "For the TCP/IP layer from the programmer's side — you'll build on it in systems." },
        { ...R.mdnCurriculum, guidance: "The 'how the web works' modules as a text refresher." },
      ],
    },
    masteryChecks: [
      "Narrate what happens between pressing Enter on a URL and seeing the page, naming each protocol",
      "Read a DevTools waterfall and identify whether a slow page is DNS, connection, server, or bandwidth bound",
      "Explain to a non-technical friend what the padlock icon does and doesn't guarantee",
    ],
    securityNote:
      "Everything not under HTTPS is readable and modifiable by anyone on the network path — coffee-shop Wi-Fi, ISPs, governments. This is the foundation for the web-security topics later; the same understanding that reads a TLS handshake is what evaluates whether a connection is safe.",
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
    whyItMatters:
      "Accessible, semantic HTML is a professional and often legal baseline, and it's the substrate everything else styles and scripts. Getting structure right first means CSS and JavaScript become easy; getting it wrong means fighting your own markup forever. Screen-reader users are real users you're choosing whether to serve.",
    prerequisiteIds: ["web-how-internet-works"],
    concepts: [
      "Document structure: landmarks (header/nav/main/footer), headings as an outline, sectioning",
      "Semantic elements over div soup: article, section, figure, time, button vs. div",
      "Forms: label association, input types, required/pattern, fieldset/legend, the submit model",
      "Accessibility: the accessibility tree, alt text, focus order, and keyboard operability",
      "ARIA sparingly: the first rule is 'use the right HTML element instead'",
      "Progressive enhancement: it works without JavaScript, then gets better with it",
    ],
    practicalUses: [
      "Every web page and app you'll build sits on this",
      "Forms — the primary way users give applications data",
      "Meeting accessibility requirements without a costly retrofit",
    ],
    lab: {
      title: "An Accessible Multi-Page Info Site",
      scenario:
        "Build a small static information site (3–4 pages: home, a topic explainer, a contact form, an about page) that is fully semantic, keyboard-navigable, and screen-reader-friendly — verified with real accessibility tooling and by actually navigating it with your eyes closed.",
      outcome:
        "Semantic, accessible HTML is your default, you can operate and test a site by keyboard and screen reader, and you understand why structure precedes style.",
      requirements: [
        "Correct landmark structure and a single logical heading outline per page (verified with a heading-outline tool)",
        "A real contact form: associated labels, appropriate input types, native validation (required, type=email, pattern), grouped with fieldset/legend, and a clear focus order",
        "Every image has meaningful alt (or empty alt if decorative — and you can explain which and why)",
        "Full keyboard operability: Tab through every interactive element in a sensible order, visible focus styles, no keyboard traps",
        "Run an automated audit (Lighthouse or axe DevTools) and reach zero accessibility errors; then do a manual pass the audit can't check (does the tab order make sense? do links make sense out of context?)",
        "The site works fully with JavaScript disabled (there isn't any yet — prove you didn't need it for structure)",
      ],
      checkpoints: [
        "Lighthouse/axe accessibility score has zero errors (not just a high number — zero errors)",
        "You navigated the whole site with keyboard only and completed the form",
        "The heading outline reads as a sensible table of contents with no skipped levels",
        "Turning off CSS still shows a readable, ordered document — proof of semantic structure",
      ],
      hints: [
        "If you reach for a div and add a click handler in your head, stop — you almost always want a button or a.",
        "A label wrapping or for-linked to its input is the single highest-value accessibility habit. Do it every time.",
        "Test focus styles by never touching the mouse for ten minutes. The frustration you feel is what some users feel always.",
      ],
      validation: [
        "axe DevTools reports zero violations on every page",
        "A classmate completes your form using only the keyboard, first try",
        "The CSS-disabled view is still fully usable",
      ],
      solutionOutline: [
        "Semantic HTML builds the accessibility tree for free: browsers derive roles, names, and structure from correct elements, which assistive tech reads — so 'accessible' is mostly 'used the right elements'.",
        "Forms work via the native submit model: labels connect text to controls for both clicking and screen readers, and native validation catches errors before any script runs.",
        "Progressive enhancement layers capability: meaning (HTML) → presentation (CSS) → behavior (JS), each independently functional, which is why structure must be right first.",
      ],
      extensions: [
        "Add a skip-to-content link and test it by keyboard",
        "Try an actual screen reader (NVDA is free on Windows) and navigate by headings and landmarks",
      ],
    },
    resources: {
      primary: [
        { ...R.webDevHTML, guidance: "Work through the modules in order; don't skip 'Forms' and 'Accessibility' — they're this lab's core. Each module ends with a self-check." },
      ],
      alternatives: [
        { ...R.mdnLearnHtml, guidance: "MDN's guided HTML module with assessments, if you prefer MDN's voice." },
      ],
      practice: [],
      extra: [
        { ...R.mdnCurriculum, guidance: "The structure and semantics modules as a coverage checklist." },
      ],
    },
    masteryChecks: [
      "Mark up a given article (title, sections, an image, a quote, a date) with correct semantic elements from memory",
      "Explain when alt='' is correct and when it's a bug",
      "Build a validated, labeled form and operate it entirely by keyboard",
    ],
    securityNote:
      "Client-side validation (required, pattern) is a usability feature, not a security control — it's trivially bypassed. Every rule enforced in the browser must be re-enforced on the server, a principle you'll apply directly when you build APIs.",
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
    whyItMatters:
      "CSS is where 'looks broken' lives, and undisciplined CSS is one of the most demoralizing experiences in the field — endless !important wars. A real model (cascade, box, flow, Flex/Grid) turns layout from fighting into designing, and responsive skill is non-negotiable when most traffic is mobile.",
    prerequisiteIds: ["web-html-a11y"],
    concepts: [
      "The box model: content, padding, border, margin; box-sizing: border-box as sanity",
      "The cascade, specificity, and inheritance — why a rule 'doesn't apply' (it's being overridden)",
      "Normal flow, then Flexbox (1D) and Grid (2D): choosing between them",
      "Responsive design: fluid sizing, min/max, media queries, mobile-first thinking",
      "Custom properties (CSS variables) for theming and consistency",
      "Maintainable CSS: naming conventions, component thinking, avoiding specificity wars",
      "Units that scale (rem, %, fr, clamp) vs. brittle pixels",
    ],
    practicalUses: [
      "Every interface's layout and responsiveness",
      "Design systems: variables driving consistent color, spacing, type",
      "Fixing 'why is this element here?' by reasoning about flow and box",
    ],
    lab: {
      title: "Responsive Layout System from Scratch",
      scenario:
        "Restyle your accessible info site into a polished, fully responsive design using a small design system you define — spacing scale, type scale, color tokens as custom properties — with a Grid-based page layout, Flexbox components, and correct behavior from 320px phones to wide desktops. No framework, no CSS reset library you didn't write.",
      outcome:
        "You can build a responsive layout deliberately (not by trial and error), you own a reusable set of design tokens and layout patterns, and the cascade is a tool rather than an adversary.",
      requirements: [
        "Define design tokens as custom properties: a spacing scale, a modular type scale, and a color palette — used everywhere, magic numbers nowhere",
        "Page layout with CSS Grid (header/main/sidebar/footer areas that reflow at breakpoints); component layouts with Flexbox",
        "Mobile-first: base styles for narrow screens, media queries adding complexity upward — verified at 320px, 768px, and 1280px",
        "A responsive navigation that adapts (e.g., stacks or collapses) without JavaScript where possible",
        "box-sizing reset and a deliberate specificity strategy (flat, class-based) — zero !important in the final stylesheet",
        "The whole thing degrades gracefully: readable and usable even if a single stylesheet fails to load",
      ],
      checkpoints: [
        "Resizing from 320px to 1280px shows intentional layout changes, never broken overflow or horizontal scroll",
        "Changing one color token restyles the whole site consistently",
        "DevTools shows your specificity is flat — you can trace why any rule wins",
        "The type scale creates a clear visual hierarchy (a stranger can see what's a heading)",
      ],
      hints: [
        "Grid for the page skeleton (2D: rows and columns), Flex for rows-of-things (1D). Reaching for the wrong one is 80% of layout pain.",
        "Design mobile-first: it's easier to add space than to claw it back, and min-width media queries layer cleanly.",
        "clamp(min, preferred, max) gives fluid typography in one line — a modern superpower.",
        "When a style 'won't apply', open DevTools computed styles: something more specific is winning. Fix specificity, don't add !important.",
      ],
      validation: [
        "Test at real breakpoints in DevTools device mode; no horizontal scrollbar at any width",
        "Lighthouse: no new accessibility regressions, good contrast ratios (your color tokens must pass WCAG AA)",
        "A one-property theme change (e.g., --color-accent) demonstrably cascades everywhere",
      ],
      solutionOutline: [
        "Design tokens as custom properties create a single source of truth for the visual language — the same DRY principle as constants in code, applied to design.",
        "Grid and Flex handle different dimensionalities; using each for its job eliminates the float/position hacks that made old CSS miserable.",
        "Mobile-first + min-width queries means each breakpoint only adds, never fights, previous rules — keeping the cascade predictable and specificity flat.",
      ],
      extensions: [
        "Add a dark theme by swapping token values under prefers-color-scheme — proof the token architecture pays off",
        "Build a reusable card and button component with only classes; document their modifiers",
      ],
    },
    resources: {
      primary: [
        { ...R.webDevCSS, guidance: "Do the modules through 'Grid' before the lab; the later modules (functions, transitions) can wait until you need them." },
      ],
      alternatives: [
        { ...R.mdnLearnCss, guidance: "MDN's guided CSS module — selectors, box model, and layout with challenges." },
      ],
      practice: [
        { ...R.flexboxFroggy, guidance: "All 24 levels before writing the layout system — flexbox becomes muscle memory." },
        { ...R.gridGarden, guidance: "All 28 levels — the grid half of the same muscle memory." },
      ],
      extra: [],
    },
    masteryChecks: [
      "Explain why an element is where it is using box model + flow, on a layout you didn't write",
      "Choose Grid vs. Flexbox for five layout tasks and justify each",
      "Build a three-breakpoint responsive layout from a sketch without trial-and-error flailing",
    ],
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
    whyItMatters:
      "JavaScript runs every browser and much of the backend — it's unavoidable and, learned haphazardly, a source of endless subtle bugs (== vs ===, this, hoisting). A solid model here, built on your C and Python foundations, makes the entire frontend stack tractable instead of mysterious.",
    prerequisiteIds: ["web-css", "py-core"],
    concepts: [
      "Values, types, and the coercion traps; === over ==; null vs undefined",
      "Functions: declarations, expressions, arrow functions, closures, and this (the famous confusion, resolved)",
      "Objects and prototypes: the prototype chain as JS's inheritance mechanism",
      "Arrays and functional methods: map/filter/reduce/find — your comprehensions, JS-style",
      "Destructuring, spread/rest, template literals, optional chaining — modern ergonomics",
      "ES modules: import/export, and how the browser loads them",
      "Errors: try/catch, throwing, and error objects",
    ],
    practicalUses: [
      "All browser interactivity",
      "Node-based tooling, scripts, and later backends",
      "Reading the vast existing JavaScript ecosystem",
    ],
    lab: {
      title: "Vanilla Expense Tracker (Logic Layer)",
      scenario:
        "Build the complete logic core of an expense tracker in pure JavaScript modules — no framework, no DOM yet — with categories, transactions, budgets, and query/summary functions, thoroughly exercised in the console and with a lightweight test approach. This becomes the brain of a real app in the next topic.",
      outcome:
        "You can write correct, modern, modular JavaScript with confidence around its traps, and you have a tested logic layer ready to attach to a UI.",
      requirements: [
        "ES modules: a transactions module, a budgets module, a summaries module — clean imports/exports",
        "Money as integer cents (the lesson persists across languages); dates handled carefully",
        "Functional data pipeline: filter by date/category, reduce to totals, group by month — using array methods, not manual loops, where they clarify",
        "Query API: balance, spending-by-category, over-budget categories, monthly trend — pure functions of the data",
        "Deliberately confront traps in a documented 'gotchas' test file: === vs ==, floating-point (proving why cents), this in a method extracted as a callback, and array-method immutability vs. mutation",
        "A tiny assert-based test runner (echoing your C harness) validating the query functions on fixed data",
      ],
      checkpoints: [
        "Summaries computed with map/filter/reduce match hand-verified totals",
        "Your gotchas file demonstrates each trap firing and the correct code beside it",
        "Modules import cleanly and the logic runs in the browser console and in Node",
        "Query functions are pure — same input, same output, no hidden state",
      ],
      hints: [
        "Prefer immutable transforms: methods like map/filter return new arrays; mutating methods (sort, splice) surprise people — know which is which.",
        "The this confusion: an object method passed as a callback loses its this. Arrow functions or bind fix it — but understand why before reaching for the fix.",
        "reduce is your Swiss army knife for summaries; write one grouping reduce by hand to truly get it.",
      ],
      validation: [
        "The test runner passes on a fixed dataset with hand-computed expected values",
        "Running the same modules in Node and browser gives identical results (portable logic)",
        "Each documented gotcha has a passing test showing the correct behavior",
      ],
      solutionOutline: [
        "Keeping logic in framework-free modules is deliberate: pure functions of data are trivially testable and portable, and separating them from the DOM (next topic) is the same edge/core/storage layering you've used everywhere.",
        "Array methods express your comprehension and reduce instincts from Python; the functional pipeline (filter→map→reduce) is the readable path from raw transactions to summaries.",
        "JavaScript's traps are learnable rules, not chaos: strict equality, integer money, and understanding this dissolve the majority of beginner bugs.",
      ],
      extensions: [
        "Add recurring-transaction expansion (generate instances from a rule) — a small state generator",
        "Convert the test runner to run in CI-style via Node with a nonzero exit on failure",
      ],
    },
    resources: {
      primary: [
        { ...R.jsInfo, guidance: "Part 1, chapters 1–9 (fundamentals through objects). Do the tasks at the end of every chapter — they're the point." },
      ],
      alternatives: [
        { ...R.mdnLearnJs, guidance: "MDN's guided scripting module — the same ground in a different voice." },
      ],
      practice: [
        { ...R.exercism, title: "Exercism — JavaScript Track", url: "https://exercism.org/tracks/javascript", guidance: "Small exercises to build fluency between lab sessions." },
      ],
      extra: [
        { ...R.mdnJs, guidance: "The authoritative language reference — lookup, not first read." },
      ],
    },
    masteryChecks: [
      "Predict the output of tricky coercion and this snippets and explain each",
      "Rewrite an imperative loop as a map/filter/reduce pipeline and back, choosing the clearer form",
      "Explain closures in JS and give a real use (a counter factory, a memoizer)",
    ],
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
    whyItMatters:
      "This is the bridge from static pages to applications — and understanding the DOM and event loop directly is what makes React (which abstracts them) comprehensible rather than magical. Async/await and fetch are how every frontend gets its data, and doing them right (loading, error, empty states) is what separates toys from tools.",
    prerequisiteIds: ["web-javascript"],
    concepts: [
      "The DOM as a live tree; querying, creating, and updating nodes",
      "Events: listeners, the event object, bubbling/capturing, and delegation for efficiency",
      "The event loop: call stack, task/microtask queues — why a long loop freezes the page",
      "Promises: pending/fulfilled/rejected; then/catch and the async/await sugar",
      "fetch: requests, response handling, JSON, and the ok/status distinction",
      "Handling reality: loading, success, empty, and error states as first-class UI",
      "Storage: localStorage/sessionStorage and their limits and hazards",
    ],
    practicalUses: [
      "Any interactive UI before/without a framework",
      "Fetching and displaying API data with proper states",
      "Understanding what React's virtual DOM and effects actually manage",
    ],
    lab: {
      title: "Wire the Expense Tracker to a UI (and an API)",
      scenario:
        "Give your expense-tracker logic a real interface with vanilla JS: render transactions to the DOM, add/edit/delete via events (using delegation), persist to localStorage, and then fetch category metadata (or exchange rates) from a public API — handling loading, empty, error, and success states explicitly. No framework.",
      outcome:
        "You can build a real interactive, data-driven app with plain JavaScript — which means you'll understand exactly what React does for you when you adopt it next.",
      requirements: [
        "Render the transaction list and summaries from your logic modules into the DOM; re-render correctly on every change",
        "Add/edit/delete transactions via a form and list actions, using event delegation on the list container (one listener, not N)",
        "Persist state to localStorage; reload restores it; handle corrupt/absent storage gracefully",
        "Fetch supplementary data from a public API with fetch + async/await: show a loading indicator, handle network failure and non-ok responses with a visible error state, and an empty state when there's no data",
        "Never block the UI: demonstrate understanding by explaining (and avoiding) a long synchronous loop that would freeze rendering",
        "Escape all user-provided text when inserting into the DOM (textContent, not innerHTML) — and explain the attack you're preventing",
      ],
      checkpoints: [
        "Adding a transaction updates list and summaries without a full page reload",
        "Event delegation handles dynamically-added rows (add a row, its delete button works — proving delegation)",
        "Killing the network shows your error state, not a broken page or a silent failure",
        "Reload preserves data; manually corrupting localStorage shows a clean recovery, not a crash",
      ],
      hints: [
        "Render as a function of state: on any change, recompute and re-render the affected part. This is the mental model React formalizes — build it by hand now.",
        "Event delegation: attach one listener to the parent, check event.target — it survives dynamic content and scales.",
        "async/await over fetch: remember fetch only rejects on network failure; a 404 is a resolved response with ok === false. Check both.",
        "Use textContent for user data. innerHTML with user input is how XSS happens — you'll attack this deliberately in the security branch.",
      ],
      validation: [
        "Manual test matrix: add/edit/delete, reload, offline fetch, empty data — each shows the right state",
        "No use of innerHTML with untrusted data (grep your code); a planted <script> in a description renders inert",
        "The app stays responsive during data fetches (loading state visible, page interactive)",
      ],
      solutionOutline: [
        "The architecture is state → render: a single source-of-truth state object, a render function that projects it to DOM, and event handlers that mutate state then re-render — literally the model React implements with a virtual DOM diff for efficiency.",
        "Event delegation exploits bubbling: one handler on a stable ancestor serves any number of descendants, present or future.",
        "The four data states (loading/empty/error/success) are not optional polish — they're the honest representation of asynchronous reality, and building them by hand cements why every serious data UI needs them.",
      ],
      extensions: [
        "Add optimistic updates for adds (show immediately, reconcile on save) and handle the rollback case",
        "Measure a render with the Performance tab; make it faster by updating only changed rows",
      ],
    },
    resources: {
      primary: [
        { ...R.jsInfo, url: "https://javascript.info/document", guidance: "Part 2: work through 'Document' and 'Introduction to Events', plus Part 1's 'Promises, async/await' chapter and the 'Network requests: Fetch' chapter." },
      ],
      alternatives: [
        { ...R.mdnLearnJs, guidance: "The DOM-scripting, events, and network-request lessons for a guided path." },
      ],
      practice: [],
      extra: [
        { ...R.mdnJs, guidance: "The DOM, events, and async/Promises sections — then the Fetch API page, as reference." },
      ],
    },
    masteryChecks: [
      "Explain the event loop with a concrete example of why a busy loop freezes the UI",
      "Implement event delegation and articulate its advantage over per-element listeners",
      "Handle a fetch with all four states correctly, including the 404-is-not-an-exception subtlety",
    ],
    securityNote:
      "innerHTML with untrusted data is the number-one source of cross-site scripting (XSS). Default to textContent; when you must render HTML, sanitize with a vetted library. This exact vulnerability is one you'll exploit and then defend in the security branch — build the safe habit now.",
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
    whyItMatters:
      "TypeScript has largely won frontend and much of backend Node — it's the professional default, and this very roadmap app is written in it. Types catch a whole class of bugs before runtime and make large codebases navigable; your C and Python-typing background makes this the easy part.",
    prerequisiteIds: ["web-javascript", "py-classes-types"],
    concepts: [
      "Primitive, array, object, and function types; type inference doing most of the work",
      "interface vs. type; optional and readonly properties",
      "Union and intersection types; literal types",
      "Discriminated unions: the tagged-union pattern with exhaustive switch checking",
      "Generics: typing containers and functions over any type (your void* collection, safely)",
      "Narrowing: typeof, in, instanceof, and custom type guards",
      "Practical stance: strict mode, typing boundaries, and avoiding any as a lifestyle",
    ],
    practicalUses: [
      "Every React and Node project you'll write from here",
      "Modeling API responses and app state with types that prevent bugs",
      "Refactoring large code safely — the compiler finds every break",
    ],
    lab: {
      title: "Type the Expense Tracker Properly",
      scenario:
        "Port your expense-tracker logic modules to strict TypeScript: model the domain with precise types, represent transaction kinds as a discriminated union, write a generic utility or two, type the API responses, and reach zero any (except at genuinely untyped boundaries, explicitly marked). Configure the project with tsc in strict mode.",
      outcome:
        "You design types deliberately — unions, generics, guards — and you experience types catching real bugs during the port, which is the moment TypeScript sells itself.",
      requirements: [
        "A strict tsconfig (strict: true, noUncheckedIndexedAccess on); build with tsc",
        "Domain types: a Transaction discriminated union (e.g., Expense | Income | Transfer with a kind tag) so each variant has exactly its valid fields",
        "Exhaustive handling: a summary function that switches on kind, with a never-typed default that makes forgetting a case a compile error",
        "At least one meaningful generic: a typed groupBy<T, K> or a Result<T, E> type for your query functions' errors",
        "Type the external API's JSON with an interface and a validating parse function at the boundary (untyped in, typed out) — explain why runtime validation is still needed despite types",
        "Custom type guard(s) for narrowing untrusted data; zero implicit any in the final build",
      ],
      checkpoints: [
        "The discriminated union prevents an impossible state you can name (e.g., income with a transfer-destination)",
        "Removing a case from the summary switch produces a compile error via the never check",
        "The generic utility works for at least two different element types with full inference",
        "tsc --strict is clean; each any is at a boundary and commented with why",
      ],
      hints: [
        "Discriminated unions are your C tagged unions with the compiler enforcing the tag invariant — the pattern you already know, now free of runtime asserts.",
        "The never trick: in the switch default, assign the value to a const of type never; if a case is unhandled, the type won't be never and it fails to compile. Exhaustiveness for free.",
        "Types are compile-time only — they vanish at runtime, so data crossing the boundary (fetch, localStorage) still needs a real validating parse. This is the key mental model.",
      ],
      validation: [
        "tsc with strict mode passes; intentionally breaking a type (wrong field) is caught",
        "The port surfaced at least one latent bug from your JS version — document it",
        "The boundary validator rejects malformed API data at runtime, complementing the compile-time types",
      ],
      solutionOutline: [
        "TypeScript adds a checked contract layer over JavaScript: types describe intent, tsc verifies it, and everything erases at runtime — hence types for correctness plus validation for trust at boundaries.",
        "Discriminated unions + exhaustive switches make illegal states unrepresentable and forgotten cases uncompilable — the same 'make bad states impossible' goal as your FSM and tagged-union work, now enforced by tooling.",
        "Generics let one implementation serve many types with full type safety — your C void* collection's ambition, achieved without casts or danger.",
      ],
      extensions: [
        "Adopt a Result type throughout and compare with exceptions — when is each clearer?",
        "Explore a small zod-style runtime validator (or write a tiny one) to unify the type and the boundary check",
      ],
    },
    resources: {
      primary: [
        { ...R.totalTsBeginners, guidance: "Complete all 18 exercises — each is a failing snippet you make pass, with a video explanation after. Free; ignore the site's paid courses." },
      ],
      alternatives: [],
      practice: [
        { ...R.exercism, title: "Exercism — TypeScript Track", url: "https://exercism.org/tracks/typescript", guidance: "The TypeScript track exercises after the tutorial." },
      ],
      extra: [
        { ...R.tsHandbook, guidance: "'Everyday Types' through 'Narrowing' and 'Generics' cover this lab — the reference behind the exercises." },
        { ...R.mdnJs, guidance: "For any JS behavior the types are describing — keep it alongside." },
      ],
    },
    masteryChecks: [
      "Model a domain with a discriminated union and prove an illegal state won't compile",
      "Explain why types don't remove the need for runtime validation of external data",
      "Write a generic function with a constraint and use it on two types",
    ],
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
    whyItMatters:
      "React is the dominant way to build interactive UIs, and it's this very site's framework. Having built the DOM/state/render loop manually, you'll understand React as a principled automation of it rather than incantations — which is the difference between fighting React and flowing with it.",
    prerequisiteIds: ["web-dom-async", "web-typescript"],
    concepts: [
      "Components as functions of props → UI; composition over configuration",
      "State with useState; the render-on-change model you built by hand, formalized",
      "The rules of hooks and why they exist (order-based identity)",
      "useEffect for synchronizing with the outside world — and the common overuse to avoid",
      "Controlled inputs and form handling",
      "Client-side routing (hash-based here, for static hosting) and route-driven views",
      "Data fetching with proper loading/error/empty states; lifting state and passing callbacks",
      "Lists and keys; derived state vs. stored state",
    ],
    practicalUses: [
      "Every modern interactive frontend, including this roadmap",
      "The React frontend of your full-stack issue tracker",
      "Component thinking that transfers to React Native (mobile branch)",
    ],
    lab: {
      title: "Issue Tracker Frontend (React + TypeScript)",
      scenario:
        "Build the frontend of an issue tracker in React and TypeScript: a list of issues with filtering and search, a detail view via routing, create/edit forms (controlled), and data loading from a mock API module with full loading/error/empty handling. It's designed to later connect to the real FastAPI backend you'll build.",
      outcome:
        "You can build a real multi-view React application with typed components, sensible state management, routing, and honest data states — and you understand the machinery underneath because you built it manually first.",
      requirements: [
        "Typed components throughout: props interfaces, typed state, typed API data (reuse your boundary-validation habit)",
        "Issue list with client-side search and filter (by status, label); derived filtering, not duplicated state",
        "Routing to an issue detail view and a create/edit form (hash-based routing so it deploys statically)",
        "Controlled forms with validation and clear error display; submit calls the (mock) API",
        "A data layer module returning promises; every fetch site renders loading, error, empty, and success states",
        "Correct list keys; no state that could be derived; effects only where truly synchronizing with something external (document each effect's justification)",
        "At least a few component tests (Vitest + Testing Library) for a pure component and a stateful interaction",
      ],
      checkpoints: [
        "Navigating to /#/issues/42 deep-links to that issue (routing works on refresh — the static-hosting test)",
        "Search filters live without a network call; results derive from state",
        "Disabling the mock API's success path shows real error UI, not a blank screen",
        "You can point to every useEffect and justify it (or removed ones that were syncing derived data)",
      ],
      hints: [
        "You already built state→render by hand; React just diffs the virtual DOM for you. Think 'UI is a function of state' and most confusion dissolves.",
        "Most useEffects beginners write are wrong: if you can compute it during render from props/state, don't put it in an effect. Effects are for external systems (network, subscriptions, DOM APIs).",
        "Controlled inputs: value comes from state, onChange updates state. One-way data flow, always.",
        "Keys must be stable identity (an id), never the array index for reorderable lists — a subtle bug factory.",
      ],
      validation: [
        "Vitest + Testing Library tests pass, covering rendering, a filter interaction, and a form submission",
        "Deep-linking and refresh work (hash routing verified)",
        "The loading/error/empty states are each reachable and correct (toggle the mock API to prove it)",
      ],
      solutionOutline: [
        "React formalizes your manual loop: components declare UI as a function of props/state, and React reconciles the real DOM to match — you build declaratively and React handles the imperative updates you were doing by hand.",
        "The data layer is (again) a boundary: a module of async functions returning typed data, swappable from mock to real FastAPI later without touching components — the anti-corruption layer pattern, recurring.",
        "State discipline (single source of truth, derive don't duplicate, effects only for external sync) is what keeps React apps predictable; violating it is the root of most React bugs.",
      ],
      extensions: [
        "Add optimistic updates on create with rollback on failure",
        "Extract a reusable useFetch<T> hook encapsulating the four states — feel the abstraction earn itself",
        "Add keyboard navigation and an accessibility pass (your a11y skills apply to components too)",
      ],
    },
    resources: {
      primary: [
        { ...R.reactLearn, guidance: "Work through 'Describing the UI' → 'Managing State', trying every interactive sandbox; finish with 'Thinking in React' before the lab." },
      ],
      alternatives: [
        { ...R.fullStackOpen, url: "https://fullstackopen.com/en/part1/", guidance: "Parts 1–2 teach the same material as a rigorous university course with graded exercises." },
      ],
      practice: [],
      extra: [
        { ...R.tsHandbook, guidance: "For typing components and props precisely." },
      ],
    },
    masteryChecks: [
      "Explain 'UI is a function of state' and connect it to the manual render loop you built",
      "Identify unnecessary useEffects in a snippet and refactor to derived values",
      "Design the component tree and state placement for a small feature before coding it",
    ],
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
    whyItMatters:
      "A frontend that isn't tested, accessible, and security-aware isn't professional — and these are exactly the areas beginners skip and seniors insist on. The browser security model in particular is widely misunderstood, causing both real vulnerabilities and hours lost to confusing CORS errors.",
    prerequisiteIds: ["web-react"],
    concepts: [
      "Testing behavior not implementation: queries by role/label, user events, avoiding brittle tests",
      "What to test: logic, states, interactions, accessibility — and what not to (framework internals)",
      "Accessibility in components: managing focus, roles, keyboard interaction, announcing changes",
      "Same-origin policy and CORS: what they protect and why the errors appear",
      "XSS revisited: contexts, why frameworks auto-escape, and where they don't (dangerouslySetInnerHTML)",
      "CSRF concept and why SameSite cookies and tokens exist",
      "Token storage in the browser: the localStorage-vs-cookie trade-offs and their real risks",
    ],
    practicalUses: [
      "Shipping React apps you can refactor without fear",
      "Passing accessibility and security review",
      "Debugging CORS in minutes instead of hours",
    ],
    lab: {
      title: "Harden and Certify the Issue Tracker",
      scenario:
        "Take your React issue tracker and bring it to professional standard: a real component test suite, an accessibility audit and remediation, and a documented security review covering XSS, the origin model, and token handling — including deliberately introducing and then fixing an XSS in a controlled way.",
      outcome:
        "You can test, make accessible, and security-review a frontend to a professional bar, and the browser security model is concrete rather than folklore.",
      requirements: [
        "Component tests (Vitest + Testing Library): query by role/label, simulate real user interactions, cover the loading/error/empty/success states and a form validation path — no snapshot-only tests",
        "Accessibility: full keyboard operability of the app (including the routing and forms), focus management on route/view changes, and an axe audit reaching zero violations",
        "XSS exercise (controlled): render an issue description via dangerouslySetInnerHTML to demonstrate the vulnerability with a harmless <img onerror> or script payload, confirm it fires, then fix it (default escaping / sanitize) and confirm inert — write up the mechanism",
        "A CORS demonstration: explain (and show via a request) why the browser blocks a cross-origin call the server didn't permit, and what header fixes it — connect to your FastAPI backend's future config",
        "A short security note: how you'd handle auth tokens in this SPA and the trade-offs (XSS exposure of localStorage vs. CSRF exposure of cookies), referencing what you'll implement server-side",
      ],
      checkpoints: [
        "Tests pass and fail for the right reasons (break a feature, watch the right test go red)",
        "axe reports zero violations; keyboard-only operation completes every workflow",
        "The XSS payload demonstrably executes before the fix and is inert after — you can explain exactly why",
        "You can articulate the origin of a CORS error and its correct fix without guessing",
      ],
      hints: [
        "Testing Library's guiding principle: test what the user experiences (roles, labels, text), not internal state or class names — such tests survive refactors.",
        "Focus management: when the view changes via routing, move focus to the new heading; screen-reader users otherwise get lost. This is the most-missed a11y detail in SPAs.",
        "React escapes by default — that's why XSS is hard in React until someone reaches for dangerouslySetInnerHTML. Treat that prop as a loaded weapon.",
        "CORS is enforced by the browser, not the server — the server merely declares who's allowed. The error is the browser refusing to hand your JS a response it didn't sanction.",
      ],
      validation: [
        "The XSS write-up correctly identifies the injection context and the defense",
        "A classmate operates the app keyboard-only and via a screen reader without getting stuck",
        "Your CORS explanation matches what you'll actually configure on the FastAPI side",
      ],
      solutionOutline: [
        "Behavior-focused tests couple to the contract (what users do and see), not the implementation, which is why they enable rather than obstruct refactoring.",
        "SPA accessibility is mostly focus and announcement management on top of the semantic habits from earlier — the framework doesn't do it for you.",
        "The browser security model is a set of trust boundaries: same-origin isolates sites, escaping isolates data from code (XSS defense), and SameSite/tokens isolate intent (CSRF defense). Each error message maps to one of these boundaries doing its job.",
      ],
      extensions: [
        "Add a Content-Security-Policy meta tag and observe it blocking inline scripts — defense in depth against XSS",
        "Write a test that would have caught a real bug you hit earlier",
      ],
    },
    resources: {
      primary: [
        { ...R.fullStackOpen, url: "https://fullstackopen.com/en/part5/", guidance: "Part 5 sections a–b: testing React components properly. Sections c–d (end-to-end testing) are optional but recommended." },
      ],
      alternatives: [],
      practice: [
        { ...R.portswigger, guidance: "The XSS and CSRF labs — legal, hands-on browser-security practice (and a preview of the security branch)." },
      ],
      extra: [
        { ...R.owasp, guidance: "The XSS and CSRF entries — authoritative descriptions of what you're defending against." },
        { ...R.reactLearn, guidance: "React's docs on escaping and the dangers of dangerouslySetInnerHTML." },
      ],
    },
    masteryChecks: [
      "Write a Testing Library test that asserts behavior and survives an internal refactor",
      "Explain same-origin policy and CORS well enough to fix a CORS error from first principles",
      "Describe the XSS mechanism and both the framework default and manual defenses",
    ],
    securityNote:
      "This topic is the frontend half of secure engineering; its concepts (XSS, CSRF, origins, token storage) recur throughout the security branch's OWASP work. The habit of treating all rendered data as potentially hostile is the throughline.",
  },
];
