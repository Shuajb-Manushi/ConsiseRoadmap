import type { TopicLite, TopicMeta } from "../types";
import { startMeta } from "./meta/start";
import { cMeta } from "./meta/c";
import { csMeta } from "./meta/cs";
import { pythonMeta } from "./meta/python";
import { webMeta } from "./meta/web";
import { backendMeta } from "./meta/backend";
import { practiceMeta } from "./meta/practice";
import { archMeta } from "./meta/arch";
import { systemsMeta } from "./meta/systems";
import { mobileMeta } from "./meta/mobile";
import { securityMeta } from "./meta/security";
import { optionalMeta } from "./meta/optional";

/**
 * The EAGER curriculum index: titles, summaries, ordering, and the
 * prerequisite graph — everything the guided/browse cards, search-result
 * display, and route-existence checks need. The prose-heavy topic bodies live
 * in ./body/ and are joined in ./index.ts, which only lazily-loaded detail
 * routes and search import, keeping curriculum prose out of the initial bundle.
 */
const metas: TopicMeta[] = [
  ...startMeta,
  ...cMeta,
  ...csMeta,
  ...pythonMeta,
  ...webMeta,
  ...backendMeta,
  ...practiceMeta,
  ...archMeta,
  ...systemsMeta,
  ...mobileMeta,
  ...securityMeta,
  ...optionalMeta,
];

/**
 * Derive nextIds from prerequisiteIds: a topic's "next" topics are those that
 * list it as a prerequisite. Authors only maintain prerequisiteIds, so the two
 * directions can never drift out of sync.
 */
function withDerivedNext(list: TopicMeta[]): TopicLite[] {
  const nextMap = new Map<string, string[]>();
  for (const t of list) nextMap.set(t.id, []);
  for (const t of list) {
    for (const pre of t.prerequisiteIds) {
      const arr = nextMap.get(pre);
      // If a prerequisite id is unknown, we still record it so validation can
      // catch it later rather than silently dropping the relationship.
      if (arr) arr.push(t.id);
    }
  }
  return list.map((t) => ({ ...t, nextIds: nextMap.get(t.id) ?? [] }));
}

export const topicsLite: TopicLite[] = withDerivedNext(metas);

export const topicMetaById = new Map(topicsLite.map((t) => [t.id, t]));

export const topicsLiteByBranch = topicsLite.reduce<Record<string, TopicLite[]>>((acc, t) => {
  (acc[t.branch] ??= []).push(t);
  return acc;
}, {});

export const topicCount = topicsLite.length;

/** Total estimated hours across required topics — shown in the About page. */
export const totalRequiredHours = topicsLite
  .filter((t) => t.required)
  .reduce((sum, t) => sum + t.estimatedHours, 0);
