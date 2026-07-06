#!/usr/bin/env node
/**
 * Network audit of every resource URL in the curriculum.
 *
 * Usage: npm run audit:resources
 *
 * This is deliberately NOT part of `npm test`: external sites can be slow,
 * flaky, or temporarily down, and that should never fail a code change.
 *
 * - Extracts every `url: "https://..."` from src/data/resourceCatalog.ts and
 *   src/data/topics/*.ts (topic files may deep-link into catalog resources).
 * - YouTube watch/playlist URLs are verified via the oEmbed endpoint, which
 *   confirms the video/playlist actually exists (a plain GET succeeds even
 *   for deleted videos).
 * - Other URLs get a GET with a browser User-Agent, following redirects,
 *   15 s timeout, at most 6 requests in flight.
 * - Hosts known to reject automated clients while working fine in a browser
 *   are reported as MANUAL (verification required), not BROKEN.
 *
 * Exit code: 1 only if any URL is BROKEN.
 */
import { readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const TIMEOUT_MS = 15000;
const CONCURRENCY = 6;
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36";

/** Hosts that commonly block bots/scripts but work in a real browser. */
const MANUAL_HOSTS = new Set([
  "martinfowler.com",
  "www.atlassian.com",
  "learn.microsoft.com",
  // stripe.com rate-limits scripted requests with HTTP 429.
  "stripe.com",
]);

function collectUrls() {
  const files = [
    join(root, "src/data/resourceCatalog.ts"),
    ...readdirSync(join(root, "src/data/topics"))
      .filter((f) => f.endsWith(".ts"))
      .map((f) => join(root, "src/data/topics", f)),
  ];
  const byUrl = new Map(); // url -> [files]
  for (const f of files) {
    const src = readFileSync(f, "utf8");
    for (const m of src.matchAll(/url:\s*"(https:\/\/[^"]+)"/g)) {
      const list = byUrl.get(m[1]) ?? [];
      list.push(f.slice(root.length + 1));
      byUrl.set(m[1], list);
    }
  }
  return byUrl;
}

function isYouTube(u) {
  const { hostname, pathname } = new URL(u);
  return /(^|\.)youtube\.com$/.test(hostname) && (pathname === "/watch" || pathname === "/playlist");
}

async function timedFetch(url, opts = {}) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    return await fetch(url, {
      redirect: "follow",
      signal: ctrl.signal,
      headers: { "User-Agent": UA, Accept: "text/html,application/json,*/*" },
      ...opts,
    });
  } finally {
    clearTimeout(t);
  }
}

async function check(url) {
  try {
    if (isYouTube(url)) {
      const res = await timedFetch(
        `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`
      );
      if (res.ok) {
        const j = await res.json();
        return { status: "OK", detail: `oEmbed: "${j.title}" (${j.author_name})` };
      }
      return { status: "BROKEN", detail: `oEmbed HTTP ${res.status} — video/playlist may be gone` };
    }
    const res = await timedFetch(url);
    if (res.ok) {
      const moved = res.url !== url ? ` → ${res.url}` : "";
      return { status: moved ? "REDIRECT" : "OK", detail: `HTTP ${res.status}${moved}` };
    }
    if (MANUAL_HOSTS.has(new URL(url).hostname)) {
      return { status: "MANUAL", detail: `HTTP ${res.status} — host blocks automation; open in a browser to verify` };
    }
    // 403/429 anywhere usually means bot-blocking rather than a dead page.
    if (res.status === 403 || res.status === 429) {
      return { status: "MANUAL", detail: `HTTP ${res.status} — likely bot-blocked; verify in a browser` };
    }
    return { status: "BROKEN", detail: `HTTP ${res.status}` };
  } catch (e) {
    if (MANUAL_HOSTS.has(new URL(url).hostname)) {
      return { status: "MANUAL", detail: `${e.name}: request failed — host blocks automation; verify in a browser` };
    }
    return { status: "BROKEN", detail: `${e.name}: ${e.message}` };
  }
}

const byUrl = collectUrls();
const urls = [...byUrl.keys()].sort();
console.log(`Auditing ${urls.length} unique resource URLs (timeout ${TIMEOUT_MS / 1000}s, concurrency ${CONCURRENCY})…\n`);

const results = new Map();
let i = 0;
await Promise.all(
  Array.from({ length: CONCURRENCY }, async () => {
    while (i < urls.length) {
      const u = urls[i++];
      results.set(u, await check(u));
    }
  })
);

const order = { BROKEN: 0, MANUAL: 1, REDIRECT: 2, OK: 3 };
const rows = urls
  .map((u) => ({ url: u, ...results.get(u) }))
  .sort((a, b) => order[a.status] - order[b.status] || a.url.localeCompare(b.url));

const counts = { OK: 0, REDIRECT: 0, MANUAL: 0, BROKEN: 0 };
for (const r of rows) {
  counts[r.status]++;
  const mark = { OK: "✓", REDIRECT: "→", MANUAL: "?", BROKEN: "✗" }[r.status];
  console.log(`${mark} ${r.status.padEnd(8)} ${r.url}`);
  console.log(`             ${r.detail}`);
}

console.log(
  `\nSummary: ${counts.OK} ok, ${counts.REDIRECT} redirected, ${counts.MANUAL} need manual verification, ${counts.BROKEN} broken.`
);
if (counts.MANUAL > 0) {
  console.log("MANUAL entries are not failures — open them in a browser to confirm.");
}
if (counts.BROKEN > 0) {
  console.error("\nBroken URLs found — fix them in src/data/resourceCatalog.ts or the topic files.");
  process.exit(1);
}
