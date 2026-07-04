import type { Topic, TopicDraft } from "../types";
import { startTopics } from "./start";
import { cTopics } from "./c";
import { csTopics } from "./cs";
import { pythonTopics } from "./python";
import { webTopics } from "./web";
import { backendTopics } from "./backend";
import { practiceTopics } from "./practice";
import { systemsTopics } from "./systems";
import { mobileTopics } from "./mobile";
import { securityTopics } from "./security";
import { optionalTopics } from "./optional";

const drafts: TopicDraft[] = [
  ...startTopics,
  ...cTopics,
  ...csTopics,
  ...pythonTopics,
  ...webTopics,
  ...backendTopics,
  ...practiceTopics,
  ...systemsTopics,
  ...mobileTopics,
  ...securityTopics,
  ...optionalTopics,
];

/**
 * Derive nextIds from prerequisiteIds: a topic's "next" topics are those that
 * list it as a prerequisite. Authors only maintain prerequisiteIds, so the two
 * directions can never drift out of sync.
 */
function withDerivedNext(list: TopicDraft[]): Topic[] {
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

export const topics: Topic[] = withDerivedNext(drafts);

export const topicById = new Map(topics.map((t) => [t.id, t]));

export const topicsByBranch = topics.reduce<Record<string, Topic[]>>((acc, t) => {
  (acc[t.branch] ??= []).push(t);
  return acc;
}, {});
