# Handoff Notes

For the next contributor. The product is **complete and working**: `npm install`,
`npm run dev`, `npm run test` (61 passing), `npm run build`, `npm run check:contrast`,
and `npm run audit:resources` all succeed. The app was verified rendering at desktop
and 320 px mobile widths, with the guided path (10 phases), browse view, topic and
milestone pages, and search all functional. This file records what the July 2026
remediation + Software Architecture effort changed, with evidence, plus genuine
remaining tasks.

## July 2026 remediation — completed, with evidence

All eight release-blocking items from the previous handoff were completed in one
coherent effort (toolchain → data split → accessibility/contrast → new branch → docs):

1. **Test toolchain upgraded.** Vitest 2.1.9 → **4.1.9** (the version `npm audit`
   recommended at implementation time; its peer range accepts Vite ^6, so Vite stayed
   at 6.4.3). `npm audit` now reports **0 vulnerabilities total** — dev and production.
   The `react() as never` cast in `vite.config.ts` was removed; the type clash is gone
   with aligned versions. Full suite and build green on the new runner.
2. **Search is a real accessible modal.** New `src/lib/useModal.ts` provides a focus
   trap (Tab/Shift+Tab cycle inside), makes everything outside the dialog `inert`,
   locks background scroll, and restores focus to the exact trigger on close — except
   when closing via navigation, where the route-focus handler takes over (verified:
   Escape returns focus to the header search button; Enter lands focus on `<main>`).
3. **One correct search interaction model.** The input is a `role="combobox"` with
   `aria-expanded`, `aria-autocomplete="list"`, and `aria-activedescendant` pointing at
   stable option ids (`sr-{kind}-{id}`); options are plain `role="option"` list items
   (no nested buttons); the empty state renders outside the listbox; a `role="status"`
   line announces counts. Arrow keys, Enter, pointer hover, and announcements agree.
4. **No nested interactive elements.** `GuidedRoadmap.tsx` topic cards are now a
   non-interactive wrapper containing the topic `<button>` and a **sibling** "Also
   requires" paragraph of real `<a href="#/topic/…">` anchors (hash routing makes
   plain anchors correct). The `role="link"`/`tabIndex`/`stopPropagation` hack is gone.
5. **WCAG AA contrast passes in both themes**, enforced by `npm run check:contrast`
   (`scripts/check-contrast.mjs` reads the actual hex values from `global.css` and
   checks 17 fg/bg pairs per theme). Changes: new `--accent-bg`/`--on-accent` tokens
   (light: white on `#b5401c` = 5.65:1; dark: near-black `#201509` on `#e8683c` =
   5.52:1 — the bright dark-mode orange is preserved by flipping the text dark instead
   of darkening the orange); light `--ink-faint` `#79715f` → `#6b634e`; dark
   `--orange-deep` `#cf5227` → `#e0602e`; `a:hover` and prerequisite-link hovers no
   longer use bare `--orange` as text; `.lab__label` no longer renders white-on-light
   in dark mode. `--orange` remains for decorative borders/rails/focus rings (3:1 UI
   floor, passes).
6. **SPA route focus is deterministic.** The roadmap early-return in `App.tsx` is gone:
   every route *change* (tracked via a previous-route ref; initial mount excluded)
   focuses `<main>` (`preventScroll`) and resets scroll. Verified for forward
   navigation, back to roadmap, and navigation out of search.
7. **Search never silently truncates.** The full result set is computed; rendering is
   paged at 40 with a truthful `"Showing 40 of N results"` status and a
   "Show all N results" button that reaches every match (verified live: 82-result
   query). Pure helpers in `src/lib/searchPaging.ts` are unit-tested.
8. **Curriculum meta/body split.** Topics are authored in two halves —
   `src/data/topics/meta/{branch}.ts` (eager: title, summary, hours, prerequisites) and
   `src/data/topics/body/{branch}.ts` (lazy: labs, resources, mastery checks) — joined
   by `topics/index.ts`, which **throws naming the offending id** on any mismatch
   (also covered by tests). Milestones are split the same way
   (`milestonesLite.ts` / `milestones.ts`). `TopicDetail`, `MilestoneDetail`,
   `ResourceLibrary`, and `SearchModal` are `React.lazy` chunks; search keeps its full
   haystack (lab text + resource titles) by living in the lazy graph.

**Bundle sizes (raw / gzip), measured from `dist/`:**

| | Before | After split (72 topics) | After adding the arch branch (78 topics) |
|---|---|---|---|
| Eager JS | 661.29 kB / 220.82 kB | 218.60 kB / 70.58 kB | **222.86 kB / 71.86 kB** |
| Lazy curriculum JS | — | 394.31 + 32.60 kB / 138.29 + 12.13 kB | 439.66 + 38.15 kB / 154.19 + 14.19 kB |

Adding ~45 kB raw of new curriculum prose moved the eager bundle by only ~1.3 kB gzip —
the split did its job. (Baseline: 49 tests before this effort, not the previously
claimed 33; 61 after.)

## Software Architecture branch — added

A dedicated **Software Architecture** branch (`arch`, berry accent `--b-arch: #a04b73`)
now sits as guided **phase 9** between Software-Engineering Practice (8) and Security
(renumbered 10). Seven required topics (~73 h), every lab evolving the learner's own
full-stack issue tracker with an escape hatch for divergent projects, and mini-ADRs
required from stage 2 onward:

1. `arch-modularity` — modularity, coupling/cohesion, dependency direction (audits the
   tracker's real dependency graph)
2. `arch-boundaries` — ports & adapters, dependency inversion (absorbs the retired
   `se-architecture` swappable-core lab and its trust-boundary security note)
3. `arch-data-contracts` — API versioning, data ownership, expand/migrate/contract
   schema evolution (absorbs se-architecture's API-versioning material)
4. `arch-system-shapes` — modular monolith vs. services vs. event-driven; extracts
   exactly one async seam with an ADR for why the rest stays a monolith
5. `arch-reliability` — timeouts, retries with backoff/jitter, idempotency, degraded
   modes, scripted failure drill
6. `arch-observability` — structured logs with correlation ids across the queue hop,
   golden signals, measure→fix→prove performance loop
7. `arch-evolution` — ADR log, fitness functions in CI, strangler-fig migration with
   the first slice executed

New milestone `m-architecture-evolution` ("Issue Tracker: Architecture Evolution",
phase 9, integrates arch/backend/practice) requires the decision log with explicit
quality attributes, enforced boundaries with tests at them, observability, a scripted
failure/recovery exercise, and an executed migration slice — and its non-goals forbid
gratuitous microservices/infrastructure.

**Consolidation:** `se-architecture` was removed from the practice branch (nothing
teaches the same material twice). Rewired: `se-ci-docker-deploy` prereqs →
`se-testing-strategy` + `systems-processes`; `opt-enterprise` and
`m-security-capstone.unlockedBy` → `arch-boundaries`; the `m-fullstack-issue-tracker`
brief no longer references "your architecture lab" (softened to testing-strategy
seams). Zero `se-architecture` references remain in `src/`.

**Resources:** 13 new catalog entries, every URL opened and verified 2026-07-06
(YouTube via oEmbed with exact title/channel recorded; see `RESOURCE_AUDIT.md` for the
per-resource decision table). All seven primaries are guided (video/course). Existing
anchors (Ousterhout, Ian Cooper, refactoring.guru, FastAPI docs, OSTEP, MIT 6.824,
SRE-adjacent) were reused with topic-specific guidance rather than duplicated.
`stripe.com` was added to the audit script's `MANUAL_HOSTS` (rate-limits scripts with
HTTP 429; verified by hand).

Totals now: **78 topics** (55–80 test bound), **12 branches**, **11 milestones**,
**10 guided phases**, catalog **108 entries**, **61 tests**.

## Concrete remaining tasks (nice-to-have)

1. **Add real screenshots.** `README.md` references `docs/screenshot-*.png` that don't
   exist yet. Run the dev server, capture the guided roadmap, a topic page, and the
   mobile roadmap, save them to `docs/`, and the README links light up.
   - Acceptance: three images exist and render in the README.

2. **DOM-level automated a11y tests.** The modal/focus behavior was verified manually
   and in a live browser this round (tests run in `environment: "node"`). If you want
   it regression-proof, add `jsdom` + `@testing-library/react` with a per-file
   `// @vitest-environment jsdom` SearchModal test (focus trap, activedescendant,
   restore-on-close). Deliberately not done in the same pass as the Vitest major
   upgrade.

3. **`craftinginterpreters.com` audit flake.** During the 2026-07-06 audit run this
   pre-existing URL failed with a network-level fetch error (as did `sourceware.org`,
   which verified fine minutes later). Both are almost certainly transient; re-run
   `npm run audit:resources` before assuming link rot.

4. **PWA / offline install** (explicitly deprioritized by the brief). If wanted, add
   `vite-plugin-pwa` with a manifest and service worker. The app is fully static and
   client-side, so this is straightforward.
   - Acceptance: installable, works offline after first load; tests unaffected.

## Known limitations (by design, not bugs)

- **No progress tracking / accounts / quizzes / streaks.** Intentional per the brief.
  Only theme and last-opened-topic are stored locally.
- **Dark mode** exists (toggle in the header) and is treated as optional polish; both
  themes pass the AA text-contrast check.
- **Resource links are not link-checked in CI.** `npm run audit:resources` is manual
  (network-dependent); bot-blocking hosts (`martinfowler.com`, `atlassian.com`,
  `learn.microsoft.com`, `stripe.com`) are flagged for manual verification, never
  auto-marked broken.
- **A brief "Loading…" flash** can appear on the first visit to a detail route or
  first search open while the lazy curriculum chunk loads — the deliberate cost of
  the small initial bundle. Chunks are shared, so it happens once.

## Where things live (quick map)

- Curriculum content & types: `src/data/` (see the README architecture section for the
  meta/body split).
- Eager curriculum index: `src/data/topics/lite.ts`; heavy join: `src/data/topics/index.ts`.
- Guided learning path (ordered phases): `src/data/phases.ts`.
- Guided roadmap UI: `src/components/roadmap/GuidedRoadmap.tsx`.
- Browse catalog: `src/components/roadmap/VerticalRoadmap.tsx`.
- Topic/milestone reading: `src/components/TopicDetail.tsx`, `MilestoneDetail.tsx` (lazy).
- Search: `src/data/search.ts` + `src/components/SearchModal.tsx` (lazy chunk).
- Modal accessibility: `src/lib/useModal.ts`; search paging: `src/lib/searchPaging.ts`.
- Contrast audit: `scripts/check-contrast.mjs` (`npm run check:contrast`).
- Resource audit: `scripts/audit-resources.mjs` (`npm run audit:resources`) + `RESOURCE_AUDIT.md`.
- Tests: `src/data/curriculum.test.ts`, `search.test.ts`, `guided.test.ts`,
  `src/lib/searchPaging.test.ts`.
- Deploy: `.github/workflows/deploy.yml` (enable Pages → Source: GitHub Actions).

All curriculum-integrity invariants are enforced by tests, so curriculum edits are safe:
a broken reference, cycle, missing field, unlinked milestone, or meta/body mismatch
fails `npm run test` with a message naming the exact id and field.
