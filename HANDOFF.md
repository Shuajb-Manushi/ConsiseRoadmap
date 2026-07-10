# Product handoff — July 10, 2026

ConciseRoadmaps is complete and working as a learner-first study instrument. This file
describes the current product, the reasoning behind the reimagining, the evidence used
to verify it, and the next highest-leverage work.

## What changed

### 1. The roadmap now starts with today

The inherited product opened with a large curriculum overview. It was accurate but
asked a fresh learner to orient inside 78 topics before receiving a concrete action.
The new `FocusDesk` inverts that order:

- selects the best current topic from completion + recency state;
- names its phase and exact place on the 70-topic required trunk;
- turns it into a visible 60-minute Learn → Build → Prove rhythm;
- normalizes that a 6–12 hour topic can span several weeks;
- shows the full tested journey only after the next action is clear.

A fresh learner can identify the topic and click “Plan my next hour” from the first
viewport. The original guided and browse views remain intact below it.

### 2. Focus sessions turn content into evidence

The new `StudySession` route (`#/session/:topicId`) uses the topic’s real content—never
generated filler:

- the verified primary resource and exact guidance for Learn;
- the first unfinished lab checkpoint, then validation list, for Build;
- the first unfinished mastery check for Prove;
- one progressive hint behind an explicit “after a real attempt” disclosure;
- a private per-topic build journal;
- an honest topic-completion control, separate from the hour’s checklist.

The pure `createFocusPlan` engine gives a fresh session 20/30/10 minutes and later
sessions 10/40/10. Tasks are frozen for the current visit so checking an item never
makes the UI jump. Returning to the session advances to the next authentic checkpoint.

### 3. Privacy now covers the new learning data

`practiceStore.ts` persists session checks and journal text locally, with the same
memory fallback and cross-tab behavior as progress. `learnerData.ts` creates a v2 JSON
backup containing:

- completed topics and milestones;
- recent topics;
- focus-session evidence;
- journal entries.

The importer still accepts the previous v1 completion-only file. Reset erases every
one of these surfaces. The redundant `cr:last-topic` key was removed, so there is no
orphaned local learner data.

### 4. The interface became a workbench

The editorial paper language remains, but the first viewport is now a high-contrast
ink-and-orange study desk: oversized topic typography, a concrete hour card, and a
three-part learning horizon. The session view uses the same visual grammar with a
single reading column, fixed task hierarchy, and a generous build-journal surface.

The header vocabulary now matches learner intent: **Today, Journey, Library, Method**.
Both themes still use the tested token system. The 320 px version collapses cleanly
without page-level horizontal overflow.

## What was deliberately kept

- All 78 topic clusters, ids, prerequisite relationships, labs, mastery checks, and
  summaries
- All 11 milestone briefs and their no-paste-ready-code policy
- The ten-phase topological guided order and optional side branches
- The resource catalog and audit trail—no titles, providers, durations, or URLs were
  invented or changed
- Search, resource library, full topic pages, milestone pages, browse filters, theme,
  completion controls, and progress derivations
- Static, local-first architecture with no account, backend, AI tutor, or telemetry
- Keyboard, screen-reader, reduced-motion, and two-theme contrast guarantees

## What was rejected this round

- **In-browser compilers/WASM.** Impressive, but maintaining trustworthy C, Python,
  JavaScript, and SQL runtimes would have displaced work on orientation and practice.
  The first hour was the higher-leverage problem.
- **An LLM tutor.** The existing AI creed is strong, but a production tutor needs a
  carefully enforced critique/quiz boundary, explicit network disclosure, and an
  offline fallback. Shipping a thin chat wrapper would weaken learner dignity.
- **Streaks, XP, deadlines, and scheduled notifications.** They conflict with the
  product’s memory-aid model and a seven-hour week that will naturally fluctuate.
- **A backend/account system.** No collaboration or sync requirement justified moving
  private notes off the learner’s device.
- **A PWA in this pass.** Useful, but less important than proving the new session loop.
  The current static architecture makes it a contained next step.

## Verification evidence

Completed against the production build:

- `npm run test` — 99 passing tests across 7 files
- `npm run build` — strict TypeScript + Vite production build
- `npm run check:contrast` — every declared text/UI pair passes in both themes
- Browser-driven desktop verification of Today → session → check all three tasks →
  journal save → return → next session advancement
- Browser-driven 320 × 800 verification with no document-level horizontal overflow
- Fresh screenshots captured from the real finished app into `docs/`
- Private Sites deployment saved from the exact validated commit and published at
  `https://concise-roadmaps-study.besnikmanushi.chatgpt.site`

The focus machinery adds eight tests covering exact 60-minute composition, real
resource/checkpoint/mastery selection, checkpoint → validation advancement, stored
step validation, local fallback/reset, v2 round-trip, and v1 import compatibility.

## Exact commands

```bash
npm install
npm run dev
npm run test
npm run check:contrast
npm run build
npm run preview
```

Optional network audit:

```bash
npm run audit:resources
```

## Important files

- `src/components/FocusDesk.tsx` — first-viewport orientation
- `src/components/StudySession.tsx` — the active learning workspace
- `src/lib/focusPlan.ts` — pure session-selection logic
- `src/lib/practiceStore.ts` — session evidence + journal persistence
- `src/lib/learnerData.ts` — complete export/import/reset boundary
- `src/lib/progress.ts` — required-trunk and milestone progress logic
- `src/data/phases.ts` — guided topological order
- `src/data/topics/` — split curriculum source of truth
- `scripts/check-contrast.mjs` — theme token audit
- `scripts/prepare-sites.mjs` — generated static-asset Worker entry for private hosting
- `.openai/hosting.json` — opaque Sites project identity only

## If another week were available

1. **Retrieval queue.** Schedule completed mastery checks for learner-controlled review
   using a transparent Leitner-style model—no streak, no guilt, and a “why today?”
   explanation for every prompt.
2. **Lab evidence attachments.** Let the learner store a local path/reference, commit
   hash, or short test transcript beside each checkpoint, included in export.
3. **Offline install.** Add a small, testable service worker and manifest; pre-cache the
   shell plus curriculum chunks and clearly report offline resource-link limitations.
4. **DOM accessibility regression tests.** Add focused tests for session check states,
   journal labels, route focus, and export/reset dialogs in addition to the existing
   browser verification.
5. **Skill snapshot.** A private, editable “I can explain / build / debug” snapshot that
   uses produced evidence, not time or self-rating alone, to help choose optional paths.

The next contributor should preserve the core constraint introduced here: a focus
session may select and stage curriculum truth, but it must never invent an exercise,
mark understanding on the learner’s behalf, or turn elapsed time into mastery.
