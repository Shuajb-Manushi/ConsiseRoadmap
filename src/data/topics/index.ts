import type { Topic, TopicBody } from "../types";
import { topicsLite } from "./lite";
import { startBodies } from "./body/start";
import { cBodies } from "./body/c";
import { csBodies } from "./body/cs";
import { pythonBodies } from "./body/python";
import { webBodies } from "./body/web";
import { backendBodies } from "./body/backend";
import { practiceBodies } from "./body/practice";
import { archBodies } from "./body/arch";
import { systemsBodies } from "./body/systems";
import { mobileBodies } from "./body/mobile";
import { securityBodies } from "./body/security";
import { optionalBodies } from "./body/optional";

/**
 * The HEAVY curriculum: full Topic objects joined from the eager metas
 * (./lite.ts) and the prose bodies (./body/). Import this only from
 * lazily-loaded modules (detail routes, search, the resource library) and
 * tests — importing it eagerly pulls all curriculum prose into the initial
 * bundle. List views should use ./lite.ts instead.
 */
const bodies: Record<string, TopicBody> = {
  ...startBodies,
  ...cBodies,
  ...csBodies,
  ...pythonBodies,
  ...webBodies,
  ...backendBodies,
  ...practiceBodies,
  ...archBodies,
  ...systemsBodies,
  ...mobileBodies,
  ...securityBodies,
  ...optionalBodies,
};

export const topics: Topic[] = topicsLite.map((lite) => {
  const body = bodies[lite.id];
  if (!body) {
    throw new Error(
      `Topic "${lite.id}" has a meta entry (topics/meta/) but no body (topics/body/)`
    );
  }
  return { ...lite, ...body };
});

{
  const liteIds = new Set(topicsLite.map((t) => t.id));
  for (const id of Object.keys(bodies)) {
    if (!liteIds.has(id)) {
      throw new Error(
        `Topic body "${id}" (topics/body/) has no matching meta entry (topics/meta/)`
      );
    }
  }
}

export const topicById = new Map(topics.map((t) => [t.id, t]));

export const topicsByBranch = topics.reduce<Record<string, Topic[]>>((acc, t) => {
  (acc[t.branch] ??= []).push(t);
  return acc;
}, {});
