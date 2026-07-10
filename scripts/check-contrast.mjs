// WCAG AA contrast audit for the theme tokens in src/styles/global.css.
// Run with: npm run check:contrast
//
// Reads the actual hex values out of global.css (so the check can't drift
// from the stylesheet) and verifies every foreground/background pair the UI
// puts text on. Text pairs must reach 4.5:1; decorative/UI pairs 3:1.
// Exits non-zero on any failure.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const cssPath = path.join(path.dirname(fileURLToPath(import.meta.url)), "../src/styles/global.css");
const css = fs.readFileSync(cssPath, "utf8");

/** Parse `--token: #hex;` declarations from a CSS block. */
function parseBlock(block) {
  const tokens = {};
  for (const m of block.matchAll(/--([\w-]+):\s*(#[0-9a-fA-F]{3,6}|var\(--[\w-]+\))\s*;/g)) {
    tokens[m[1]] = m[2];
  }
  return tokens;
}

const rootBlock = css.match(/:root\s*\{([\s\S]*?)\n\}/)?.[1];
const darkBlock = css.match(/\[data-theme="dark"\]\s*\{([\s\S]*?)\n\}/)?.[1];
if (!rootBlock || !darkBlock) {
  console.error("Could not find :root or [data-theme=\"dark\"] blocks in global.css");
  process.exit(1);
}

const light = parseBlock(rootBlock);
const dark = { ...light, ...parseBlock(darkBlock) };

/** Resolve var() references and shorthand hex. */
function resolve(tokens, name, depth = 0) {
  if (depth > 5) throw new Error(`token cycle at --${name}`);
  const v = tokens[name];
  if (!v) throw new Error(`unknown token --${name}`);
  const ref = v.match(/^var\(--([\w-]+)\)$/);
  if (ref) return resolve(tokens, ref[1], depth + 1);
  let hex = v.slice(1);
  if (hex.length === 3) hex = [...hex].map((c) => c + c).join("");
  return hex;
}

function luminance(hex) {
  const c = [0, 2, 4].map((i) => {
    const v = parseInt(hex.slice(i, i + 2), 16) / 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}

function ratio(fgHex, bgHex) {
  const [l1, l2] = [luminance(fgHex), luminance(bgHex)].sort((a, b) => b - a);
  return (l1 + 0.05) / (l2 + 0.05);
}

// [foreground token, background token, minimum ratio, where it appears]
const TEXT = 4.5;
const UI = 3.0;
const PAIRS = [
  ["ink", "canvas", TEXT, "body text"],
  ["ink", "paper", TEXT, "cards, phase content"],
  ["ink-soft", "canvas", TEXT, "secondary text"],
  ["ink-soft", "paper", TEXT, "secondary text on cards"],
  ["ink-soft", "canvas-deep", TEXT, "footer, lab panels"],
  ["ink-faint", "canvas", TEXT, "faint labels, search meta"],
  ["ink-faint", "paper", TEXT, "faint labels on cards"],
  ["ink-faint", "canvas-deep", TEXT, "footer meta"],
  ["orange-deep", "canvas", TEXT, "hero accent, links"],
  ["orange-deep", "paper", TEXT, "links on cards"],
  ["orange-deep", "canvas-deep", TEXT, "links on deep canvas"],
  ["on-accent", "accent-bg", TEXT, "start card, view switch, brand mark, plan steps"],
  ["inverse-fg", "inverse-bg", TEXT, "milestone cards"],
  ["inverse-muted", "inverse-bg", TEXT, "milestone card briefs"],
  ["orange", "inverse-bg", TEXT, "milestone card tag/CTA"],
  ["done", "canvas", TEXT, "completed labels, phase meters"],
  ["done", "canvas-deep", TEXT, "side-branch done counts"],
  ["done", "paper", TEXT, "completed labels on cards"],
  ["done", "done-tint", TEXT, "completed chip text on its tint"],
  ["paper", "done", TEXT, "check glyph on a completed fill"],
  ["ink", "done-tint", TEXT, "completion card body text"],
  // Decorative / large UI affordances (3:1 floor)
  ["orange", "canvas", UI, "focus rings, rails, borders"],
  ["line-strong", "canvas", 1.2, "hairlines (non-essential)"],
];

let failures = 0;
for (const theme of ["light", "dark"]) {
  const tokens = theme === "light" ? light : dark;
  console.log(`\n${theme.toUpperCase()} THEME`);
  for (const [fg, bg, min, where] of PAIRS) {
    const r = ratio(resolve(tokens, fg), resolve(tokens, bg));
    const ok = r >= min;
    if (!ok) failures++;
    console.log(
      `  ${ok ? "PASS" : "FAIL"}  --${fg} on --${bg}  ${r.toFixed(2)}:1  (min ${min})  ${where}`
    );
  }
}

if (failures > 0) {
  console.error(`\n${failures} contrast pair(s) below the required ratio.`);
  process.exit(1);
}
console.log("\nAll contrast pairs pass.");
