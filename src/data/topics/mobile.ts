import type { TopicDraft } from "../types";
import { R } from "../resourceCatalog";

export const mobileTopics: TopicDraft[] = [
  {
    id: "mobile-react-native",
    title: "React Native & Expo Fundamentals",
    branch: "mobile",
    stage: 1,
    required: false,
    difficulty: "advanced",
    estimatedHours: 14,
    summary:
      "Mobile apps reusing everything you know: React Native brings React's component model to native iOS/Android, with Expo removing the toolchain pain. The native component model (View/Text instead of div/span), Flexbox layout (your CSS knowledge, mostly transferring), navigation, and running on your own phone.",
    whyItMatters:
      "Mobile is where most users are, and React Native lets you build native apps with your existing React and TypeScript skills instead of learning Swift and Kotlin separately. Because it builds directly on the web branch, it's high-leverage — not a separate beginner path, but a reuse of hard-won foundations.",
    prerequisiteIds: ["web-react", "web-typescript"],
    concepts: [
      "React Native's model: same React, native components (View, Text, Pressable) instead of DOM",
      "Expo: managed toolchain, running on a real device via Expo Go, and the development loop",
      "Layout with Flexbox (default here) — your CSS Flexbox knowledge transfers with small differences",
      "Styling differences from web CSS (no cascade, style objects, density-independent units)",
      "Core components and lists (FlatList for performance)",
      "Platform differences (iOS vs. Android) and responsive/adaptive design for varied screens",
      "The debugging and fast-refresh workflow",
    ],
    practicalUses: [
      "Building cross-platform mobile apps from one codebase",
      "Extending web products to mobile with shared skills",
      "Prototyping app ideas on your own phone quickly",
    ],
    lab: {
      title: "A Native UI on Your Phone",
      scenario:
        "Get from zero to a real app running on your physical phone: set up Expo, build a multi-screen UI (a browsable list with a detail screen) using native components and Flexbox layout, styled well and responsive across screen sizes — reusing your component and TypeScript instincts.",
      outcome:
        "You have a working React Native development setup, an app running on your own device, and confidence that your React knowledge transfers to mobile with manageable differences.",
      requirements: [
        "Expo project in TypeScript; running on your physical phone via Expo Go",
        "A multi-screen app: a scrollable list (FlatList) of items and a detail screen, with navigation between them",
        "Layout with Flexbox; styling via style objects; a small reusable component set (your composition habits apply)",
        "Responsive/adaptive to different screen sizes and orientations; handles safe areas (notches)",
        "Typed props and state throughout; at least one component test where practical",
        "Document the setup steps and the specific differences from web React you encountered",
      ],
      checkpoints: [
        "The app runs on your real phone with fast refresh working",
        "Navigation between list and detail works smoothly",
        "Layout adapts to different device sizes without breaking",
        "You can list five concrete differences from web React you hit",
      ],
      hints: [
        "There's no div/CSS files: you compose View/Text and style with objects. Flexbox is the default layout (flexDirection defaults to column, unlike web) — the main surprise.",
        "FlatList (not map over an array) for long lists — it virtualizes for performance, a mobile necessity.",
        "Expo Go on your phone + the QR code is the fastest path to seeing real results; use it before any build tooling.",
      ],
      validation: [
        "The app is demonstrably running on a physical device",
        "Layout is correct on at least two different screen sizes",
        "Your notes accurately capture the web-vs-native differences",
      ],
      solutionOutline: [
        "React Native runs your React components but renders to native views instead of the DOM; the mental model (components, props, state, hooks) is identical, only the primitive components and styling API differ.",
        "Flexbox layout transfers almost directly from your CSS work, with a few defaults changed — most of your layout intuition is reusable.",
        "Expo abstracts the native build toolchains so you can focus on the app; the fast-refresh-on-device loop is what makes mobile development pleasant enough to iterate quickly.",
      ],
      extensions: [
        "Add a tab navigator alongside the stack navigator",
        "Add gestures or animation with the standard libraries",
      ],
    },
    resources: {
      primary: [
        { ...R.expoTutorial, guidance: "Do the tutorial start to finish — by the end you'll have a real app with navigation running on your own phone." },
      ],
      alternatives: [
        { ...R.fullStackOpen, url: "https://fullstackopen.com/en/part10/", guidance: "Part 10 sections a–b: React Native taught as a university course, if you want more rigor than the tutorial." },
      ],
      practice: [],
      extra: [
        { ...R.rnSetup, guidance: "The React Native environment guide for the toolchain details." },
        { ...R.reactLearn, guidance: "Revisit React fundamentals — they're 90% of what you need here." },
      ],
    },
    masteryChecks: [
      "Build a two-screen navigable app with a performant list from scratch",
      "Explain how React Native reuses React and where it differs (components, styling, layout defaults)",
      "Lay out a screen with Flexbox that adapts across device sizes",
    ],
  },
  {
    id: "mobile-app-data",
    title: "Mobile State, Storage, APIs & Offline",
    branch: "mobile",
    stage: 2,
    required: false,
    difficulty: "advanced",
    estimatedHours: 14,
    summary:
      "A real mobile app's data life: forms and state, local persistence, calling your own backend API, and — the mobile-specific challenge — handling flaky connectivity, offline states, and errors gracefully, plus device APIs, testing, and producing a build. This turns a UI into a dependable product.",
    whyItMatters:
      "Mobile apps live on unreliable networks in users' pockets — offline and error handling aren't polish, they're core requirements that distinguish real apps from demos. Connecting a mobile client to the backend you built completes the full-stack-plus-mobile picture with genuinely shared foundations.",
    prerequisiteIds: ["mobile-react-native", "db-fastapi", "py-http-apis"],
    concepts: [
      "Forms and state management in React Native (your React state discipline applies)",
      "Local storage: AsyncStorage/SQLite for on-device persistence",
      "Calling an API from mobile: the same fetch/async patterns, plus mobile network realities",
      "Offline and error states as first-class: caching, optimistic UI, retry, and honest 'you're offline' UX",
      "Device APIs (camera, location, notifications) with permissions handled respectfully",
      "Testing mobile logic and components; the build/distribution basics via Expo",
      "Security on mobile: secure storage for tokens, transport security, and least-privilege permissions",
    ],
    practicalUses: [
      "Building apps that work in elevators, tunnels, and rural areas",
      "Connecting mobile clients to real backends",
      "Shipping a testable, buildable app",
    ],
    lab: {
      title: "Issue Tracker Mobile Companion",
      scenario:
        "Build a React Native companion app for the FastAPI issue tracker you already built: browse and create issues from your phone, with authentication, local caching so it's usable offline, optimistic creation with sync-on-reconnect, and honest handling of every network failure — then produce a build.",
      outcome:
        "You can build a real, network-resilient mobile client for an existing backend, handling the offline and error realities that define production mobile apps — completing your full-stack-plus-mobile capability.",
      requirements: [
        "Authenticate against your issue tracker's API (secure token storage — not plain AsyncStorage for the token; use secure storage) and access protected endpoints",
        "Browse issues (cached locally so the list shows offline) and view details",
        "Create an issue with optimistic UI: it appears immediately, queues if offline, and syncs when connectivity returns — with conflict/failure handling",
        "Explicit offline/error/loading/empty states throughout (your web habit, now essential): a visible offline indicator, retry affordances, and no silent failures",
        "Handle one device API respectfully (e.g., attach a photo from the camera) with proper permission requests and graceful denial",
        "Tests for the data/sync logic and a produced build (Expo build) installable on a device",
      ],
      checkpoints: [
        "The app works in airplane mode for cached data and queues new issues",
        "Reconnecting syncs queued issues; failures are surfaced, not swallowed",
        "The auth token is in secure storage, and you can explain why plain storage is unsafe",
        "Every network operation has visible loading/error/offline handling",
      ],
      hints: [
        "Offline-first: read from local cache immediately, then reconcile with the server — the app should never show a blank screen because the network is slow.",
        "Optimistic creation needs a rollback path: if the sync ultimately fails, tell the user and let them retry — optimism without reconciliation is a lie.",
        "Tokens are credentials: use expo-secure-store (Keychain/Keystore), never plain AsyncStorage. This is the mobile version of your web token-storage lesson.",
        "Request permissions in context, explain why, and handle denial gracefully — respect is both ethical and required by app stores.",
      ],
      validation: [
        "Airplane-mode testing: browse cached, queue creates, then reconnect and verify sync",
        "The abuse/failure cases (expired token, server down mid-sync) are handled visibly",
        "A build installs and runs on a real device",
      ],
      solutionOutline: [
        "The app layers a local cache/queue over the API client: reads serve cache-then-network, writes go optimistic-then-sync — the network becomes an enhancement rather than a hard dependency, which is what 'works in a tunnel' requires.",
        "This reuses your web data-layer patterns (typed API client as an anti-corruption boundary, four data states) plus mobile-specific persistence and connectivity handling — the foundations transfer, the network realities are new.",
        "Security on mobile centers on secure token storage, transport security, and least-privilege permissions — the same principles as web, adapted to the device's trust model.",
      ],
      extensions: [
        "Add push notifications for issue assignments (ties to your backend background-task work)",
        "Add background sync so queued changes flush even when the app is closed",
        "Handle true edit conflicts (two devices editing one issue) with a resolution strategy",
      ],
    },
    resources: {
      primary: [
        { ...R.fullStackOpen, url: "https://fullstackopen.com/en/part10/", guidance: "Part 10 sections c–d: communicating with a server and testing — the data layer this lab needs, with exercises." },
      ],
      alternatives: [
        { ...R.expoTutorial, guidance: "The later tutorial chapters cover device storage and APIs the Expo way." },
      ],
      practice: [],
      extra: [
        { ...R.rnSetup, guidance: "For deeper platform and build details." },
        { ...R.owasp, guidance: "OWASP has mobile-specific guidance; the secure-storage and transport principles apply directly." },
      ],
    },
    masteryChecks: [
      "Design an offline-first data flow with optimistic writes and sync-on-reconnect",
      "Explain why tokens need secure storage on mobile and what plain storage exposes",
      "Handle a device permission request respectfully, including the denial path",
    ],
    securityNote:
      "Mobile devices are lost and stolen, and apps run in a less controlled environment than servers: store credentials in the platform secure enclave (Keychain/Keystore), enforce TLS, request minimal permissions, and never assume the client is trustworthy — the server must still authorize every action, exactly as your backend does.",
  },
];
