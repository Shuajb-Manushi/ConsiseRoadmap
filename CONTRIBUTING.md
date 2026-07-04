# Contributing to ConciseRoadmaps

Thanks for helping improve the roadmap! This guide shows how to add or correct topics
**without breaking references**. You don't need to touch any UI code to change the
curriculum — all content lives in `src/data`.

## Golden rules

1. **Run the tests** after any change: `npm run test`. They are written to fail with a
   readable message pointing at the exact id and field that's wrong.
2. **Every id is permanent-ish.** Other topics, milestones, and the derived graph
   reference ids. If you rename an id, update every `prerequisiteIds`, milestone
   `unlockedBy`, and the `startHere` pointer that used it (the tests will list them).
3. **Only maintain `prerequisiteIds`.** The reverse links (`nextIds`) are derived
   automatically in `src/data/topics/index.ts`. Never hand-write them.
4. **Keep it concise.** Topics are clusters, not textbook chapters. Prefer clarity and a
   great lab over exhaustive prose.

## Adding a topic

1. Open the branch file, e.g. `src/data/topics/python.ts`.
2. Copy an existing `TopicDraft` object as a template and edit every field. The shape is
   defined and documented in `src/data/types.ts`.
3. Give it a unique kebab-case `id` (e.g. `py-dataclasses`).
4. Set `prerequisiteIds` to existing topic ids. Set `stage` to its position in the
   branch (used for ordering). Choose `required`, `difficulty`, and an honest
   `estimatedHours`.
5. Fill the **lab** fully (requirements, checkpoints, hints, validation,
   solutionOutline, extensions) and the four resource tiers (`primary`,
   `alternatives`, `practice`, `extra`) plus some **mastery checks**. The primary
   must be a guided video/course/interactive tutorial/lab with exact instructions
   in `guidance` (“Watch Lecture 2, sections 1–4” — never “great introduction”).
   Books and docs go in `extra`. The tests enforce these.
6. Use resources from `src/data/resourceCatalog.ts` via the `R` object so URLs stay in
   one place: `{ ...R.cs50x, url: "…/weeks/4/", guidance: "topic-specific instructions" }`.
   If you need a new external resource, verify the URL actually loads, then add it to
   the catalog (title, url, type, provider, note) and to a purpose group, and run
   `npm run audit:resources`.
7. Run `npm run test`.

## Correcting a topic

Edit the object in place. If you change its `id`, follow rule 2. If you change
`prerequisiteIds`, the graph and `nextIds` update automatically. Re-run the tests.

## Adding or editing a milestone

Milestones live in `src/data/milestones.ts`. `unlockedBy` must reference existing topic
ids; `integrates` must reference existing branch ids. Fill `requirements`, `nonGoals`,
`architecture`, `checkpoints`, `tests`, `hints`, `solutionOutline`, and `extensions`.
Do **not** include full source code — the value is in the brief.

## Writing good labs and projects

- Build something meaningful. A pointers lab builds a dynamic text buffer, not
  “print a pointer.” Cluster tiny concepts into one substantial lab.
- Give **progressive hints** (readable one at a time) and a **solution architecture**
  that explains *how* a correct solution works — never paste-ready code.
- Include **validation** steps so a learner can check their own work.
- Add a `securityNote` wherever secure-engineering thinking is relevant.

## Resource policy

- Summarize concepts in your own words; **link** to the source, don't copy passages.
- Don't invent page titles that don't exist. Prefer the curated catalog.
- External links must be real and open safely (the UI adds `target="_blank"` +
  `rel="noopener noreferrer"`).

## Style

- TypeScript strict mode is on; `npm run build` must pass `tsc`.
- Match the existing formatting and the calm, direct editorial tone.
- Keep UI and data separate: data files must not import from `components/`.

## Before you open a PR

```bash
npm run test    # data integrity + search behavior
npm run build   # type-check + production build
```

Both must be green. Thank you!
