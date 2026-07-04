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
  dominant “Start here” node through nine ordered phases. Each phase says why it comes
  now, its hours and branches, and a clear next direction; phases expand to reveal their
  ordered topics. Milestones sit next to the phase that unlocks them, cross-branch
  prerequisites appear inside cards as “Also requires…” links, and optional
  specializations hang off as restrained side branches. No pan/zoom canvas — just a
  clear direction, identical in structure on mobile (one clean column).
- **Browse all topics** — a toggle (an accessible segmented control) flips to the full
  catalog: every branch, topic, and milestone, with a branch jump list.
- **Rich topic pages** — summary, why-it-matters, prerequisites, core ideas, practical
  uses, a substantial hands-on **lab** (requirements, checkpoints, progressive hints,
  validation, solution architecture, extensions), mastery checks, a recommended
  resource with a “Don’t like this explanation?” alternatives section, a security note,
  and connections to later topics.
- **10 cross-branch milestone projects** with full briefs (no copy-paste source code).
- **Global search** (button or <kbd>Ctrl/Cmd</kbd>+<kbd>K</kbd>) over titles, concepts,
  languages, projects, and resource names, with branch / required / difficulty / hours
  filters.
- **Responsive, accessible, keyboard-navigable**, with optional dark mode.
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
    branches.ts         # the 11 branches and their accent colors
    resourceCatalog.ts  # the curated resource library (URLs live here once)
    topics/             # one file per branch; index.ts assembles + derives nextIds
    milestones.ts       # the 10 cross-branch capstone briefs
    curriculum.ts       # public aggregator (start point, totals, labels)
    search.ts           # search index + filterable query function
    *.test.ts           # data-integrity and search behavior tests
    phases.ts           # the guided learning path (ordered phases over topic ids)
  components/           # React UI
    roadmap/            # GuidedRoadmap, VerticalRoadmap (browse), Legend
    ViewSwitch, Header, SearchModal, TopicDetail, MilestoneDetail, ResourceLibrary, About
  lib/                  # hash router, theme + media-query hooks
  styles/               # global tokens + per-area CSS (custom properties)
```

**Key idea:** curriculum data is fully separate from UI and validated by tests. The
guided roadmap (`phases.ts`) and the browse catalog are two views of the same typed
data. `nextIds` are *derived* from `prerequisiteIds`, and the guided path's ordering is
tested to be a genuine topological sort of the prerequisite graph, so nothing can drift.

## Editing the curriculum

See [CONTRIBUTING.md](CONTRIBUTING.md) for the full guide. In short:

- Add or edit a topic in the appropriate `src/data/topics/<branch>.ts` file.
- Only maintain `prerequisiteIds`; `nextIds` are computed for you.
- Run `npm run test` — the integrity suite tells you (readably) if any id, reference,
  required field, resource, or milestone link is wrong, or if you introduced a cycle.

The curriculum philosophy (required vs. optional policy, milestone relationships) is in
[CURRICULUM.md](CURRICULUM.md).

## Testing

`npm run test` runs Vitest over `src/data/*.test.ts`, verifying: unique ids; every
prerequisite / next / milestone reference exists; the prerequisite graph is acyclic;
required fields are populated; required topics have a primary resource; every topic has
a lab and mastery checks; and that search indexes topics, concepts, projects, and
resources. A dedicated `guided.test.ts` verifies the guided roadmap: every topic id
exists, every topic appears exactly once, the phase ordering is a genuine topological
sort (no topic precedes a prerequisite), and every milestone sits at/after the phase
that unlocks it. `npm run build` additionally runs `tsc` for full type-checking.

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
