import type { TopicMeta } from "../../types";


export const mobileMeta: TopicMeta[] = [
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
    prerequisiteIds: ["web-react", "web-typescript"],
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
    prerequisiteIds: ["mobile-react-native", "db-fastapi", "py-http-apis"],
  },
];
