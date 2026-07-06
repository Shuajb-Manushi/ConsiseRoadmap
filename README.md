# ConciseRoadmaps

A free, static, highly visual software-engineering learning roadmap — built for a
first-year student who knows **C through linked lists** and wants to become a
**self-sufficient software engineer**: strong CS and systems fundamentals, real
projects over passive study, and eventually ethical cybersecurity. Learn theory by
using it. Everything is unlocked, always.

This is **not** a course platform, dashboard, streak tracker, or game. It is a clear,
explorable map of what matters, why it matters, prerequisites, practical projects, and
trustworthy resources.

## Screenshots

> _Placeholder — add images to `docs/` and update these links._
>
> - `docs/screenshot-roadmap.png` — the interactive branching graph
> - `docs/screenshot-topic.png` — a topic reading page with its lab
> - `docs/screenshot-mobile.png` — the mobile vertical roadmap

## Highlights

- **Guided roadmap** — a single vertical learning tree that flows top-to-bottom from one
  dominant “Start here” node through ten ordered phases. Each phase says why it comes
  now, its hours and branches, and a clear next direction; phases expand to reveal their
  ordered topics. Milestones sit next to the phase that unlocks them, cross-branch
  prerequisites appear inside cards as “Also requires…” links, and optional
  specializations hang off as restrained side branches. No pan/zoom canvas — just a
  clear direction, identical in structure on mobile (one clean column).
- **Browse all topics** — a toggle (an accessible segmented control) flips to the full
  catalog: every branch, topic, and milestone, with a branch jump list.
- **Rich topic pages** — summary, why-it-matters, prerequisites, core ideas, practical
  uses, a substantial hands-on **lab** (requirements, checkpoints, progressive hints,
  validation, solution architecture, extensions), mastery checks, a **learning plan**
  (Learn → Build → Prove) with one verified guided resource and exact instructions,
  alternative explanations, practice tools, collapsed extra reading, a security note,
  and connections to later topics.
- **11 cross-branch milestone projects** with full briefs (no copy-paste source code).
- **Global search** (button or <kbd>Ctrl/Cmd</kbd>+<kbd>K</kbd>) — a fully accessible
  combobox dialog (focus-trapped, inert background, focus restored on close) over
  titles, concepts, languages, projects, and resource names, with branch / required /
  difficulty / hours filters. Result counts are always honest; every match is reachable
  via “Show all”.
- **Responsive, accessible, keyboard-navigable**, with optional dark mode. Both themes
  pass WCAG AA contrast for text (checked by `npm run check:contrast`); focus is
  managed deterministically on every route change.
- **Fast first load** — the initial bundle carries only code and a lightweight
  curriculum index (~72 kB gzip JS); the full topic/milestone prose loads lazily on
  detail routes and first search.
- **No backend, database, auth, telemetry, AI, or remote fetch.** Hash-based routing so
  it deploys anywhere static. No heavyweight diagram library — the roadmap is built from
  semantic HTML and CSS.

## Tech stack

Vite · React · TypeScript · CSS custom properties (no Tailwind) · Vitest.

## Getting started

```bash
npm install       # install dependencies
npm run dev       # start the dev server (Vite)
npm run test      # run the data + behavior tests (Vitest)
npm run build     # type-check and produce a static build in dist/
npm run preview   # preview the production build locally
```

Requires Node 18+ (developed on Node 24). No environment variables, services, or
secrets are needed.

## Architecture

```
src/
  data/                 # all curriculum content + types (no UI imports)
    types.ts            # Topic / Lab / Resource / Milestone / Branch interfaces
    branches.ts         # the 12 branches and their accent colors
    resourceCatalog.ts  # the curated resource library (URLs live here once)
    topics/
      meta/             # one file per branch: the EAGER half (title, summary,
                        #   hours, prerequisites) that list views and search need
      body/             # one file per branch: the LAZY half (labs, resources,
                        #   mastery checks) loaded only on detail routes/search
      lite.ts           # eager index over metas (+ derived nextIds, totals)
      index.ts          # heavy join of meta+body into full Topics (lazy chunks
                        #   and tests only; throws on any meta/body mismatch)
    milestonesLite.ts   # eager milestone cards (id, title, brief, unlockedBy)
    milestones.ts       # the 11 full cross-branch capstone briefs (lazy join)
    curriculum.ts       # eager public aggregator (start point, totals, labels)
    search.ts           # search index + filterable query function (lazy chunk)
    *.test.ts           # data-integrity and search behavior tests
    phases.ts           # the guided learning path (ordered phases over topic ids)
  components/           # React UI
    roadmap/            # GuidedRoadmap, VerticalRoadmap (browse), Legend
    ViewSwitch, Header, SearchModal, TopicDetail, MilestoneDetail, ResourceLibrary, About
  lib/                  # hash router, theme hooks, modal a11y, search paging
  styles/               # global tokens + per-area CSS (custom properties)
```

**Key idea:** curriculum data is fully separate from UI and validated by tests. The
guided roadmap (`phases.ts`) and the browse catalog are two views of the same typed
data. `nextIds` are *derived* from `prerequisiteIds`, and the guided path's ordering is
tested to be a genuine topological sort of the prerequisite graph, so nothing can drift.
Each topic is authored in two halves — eager meta and lazy body — joined by
`topics/index.ts`, which throws (and tests fail) if the halves ever disagree, so the
bundle split can't silently lose content.

## Editing the curriculum

See [CONTRIBUTING.md](CONTRIBUTING.md) for the full guide. In short:

- Add or edit a topic's lightweight half in `src/data/topics/meta/<branch>.ts`
  (title, summary, hours, prerequisites) and its content half in
  `src/data/topics/body/<branch>.ts` (lab, resources, mastery checks), keyed by
  the same topic id.
- Only maintain `prerequisiteIds`; `nextIds` are computed for you.
- Run `npm run test` — the integrity suite tells you (readably) if any id, reference,
  required field, resource, or milestone link is wrong, or if you introduced a cycle.

The curriculum philosophy (required vs. optional policy, milestone relationships) is in
[CURRICULUM.md](CURRICULUM.md).

## Testing

`npm run test` runs Vitest over `src/data/*.test.ts`, verifying: unique ids; every
prerequisite / next / milestone reference exists; the prerequisite graph is acyclic;
required fields are populated; every topic has a guided primary resource (video,
course, interactive tutorial, or lab — documented exceptions aside) with valid https
URLs, a lab, and mastery checks; the resource catalog has unique ids and URLs; and that search indexes topics, concepts, projects, and
resources. A dedicated `guided.test.ts` verifies the guided roadmap: every topic id
exists, every topic appears exactly once, the phase ordering is a genuine topological
sort (no topic precedes a prerequisite), and every milestone sits at/after the phase
that unlocks it. `npm run build` additionally runs `tsc` for full type-checking.

`npm run audit:resources` (optional, network) opens every resource URL with timeouts
and limited concurrency, verifies YouTube links via oEmbed, and reports dead links —
kept separate from `npm run test` because external sites can be temporarily down.
See `RESOURCE_AUDIT.md` for the latest full audit.

## Deploying to GitHub Pages

The build is relocatable (`base: "./"` in `vite.config.ts`) and uses hash routing, so
no server rewrites are needed.

**Manual:**

```bash
npm run build
# publish the dist/ folder to the gh-pages branch, e.g. with:
npx gh-pages -d dist
```

Then in your repo: **Settings → Pages → Build and deployment → Deploy from a branch →
`gh-pages` / root**.

**Automated (optional):** a ready workflow lives at
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml). Enable **Settings →
Pages → Source: GitHub Actions**, and every push to `main` will test, build, and
publish. See [HANDOFF.md](HANDOFF.md) for anything outstanding.

## License

[MIT](LICENSE) — free to use, adapt, and share.
