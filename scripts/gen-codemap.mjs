// Generates docs/agents/codemap.md — the ~1k-token routing index of all
// source files (naming skill's "route from one page, not from opening
// files"). One line per file: path · layer guess · line count · first
// header-comment sentence. Regenerate with `npm run codemap` after adding,
// splitting, or renaming files; CI does not enforce freshness (yet).

import { readdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(fileURLToPath(import.meta.url), "..", "..");
const OUT = join(ROOT, "docs", "agents", "codemap.md");
const SCAN_DIRS = ["app", "components", "lib", "data"];
const HARD_LIMIT = 300;

function* walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(path);
    else if (/\.(ts|tsx|css)$/.test(entry.name)) yield path;
  }
}

// Layer heuristic per the naming skill; "·" when the path alone can't tell.
function guessLayer(file) {
  if (file.startsWith("data/")) return "L0";
  if (file.startsWith("components/ui/")) return "L1";
  if (file.startsWith("lib/")) return "L1/L3";
  if (file.startsWith("app/")) return "L3";
  if (/-(case-layout|poster-layout|scroll)\.tsx$/.test(file)) return "L2";
  if (/-(viz|map|board|canvas|interactives|lazy|phone|demo|strip|overlay|layer|browser|chips|brief|drafts)\.tsx$/.test(file)) return "L1";
  if (/^components\/(header|loader|smooth-scroll|featured-gate|case-next|fade-reveal)/.test(file)) return "L3";
  return "·";
}

// First sentence of the file's header comment (searched in the first ~40
// lines, skipping directives/imports) — this is why headers are mandatory.
function summary(path) {
  const lines = readFileSync(path, "utf8").split("\n").slice(0, 40);
  for (const raw of lines) {
    const line = raw.trim();
    const m = line.match(/^(?:\/\/|\/\*+|\*)\s*(.+?)\s*(?:\*\/)?$/);
    if (!m) continue;
    const text = m[1].replace(/^[-=\s*]+$/, "");
    if (!text || /^(eslint|@ts-|prettier|biome)/.test(text)) continue;
    return text.length > 110 ? text.slice(0, 107) + "…" : text;
  }
  return "(no header comment)";
}

const rows = [];
for (const dir of SCAN_DIRS) {
  if (!existsSync(join(ROOT, dir))) continue;
  for (const file of walk(join(ROOT, dir))) {
    const rel = relative(ROOT, file).replaceAll("\\", "/");
    const lineCount = readFileSync(file, "utf8").split("\n").length;
    rows.push({ rel, lineCount, layer: guessLayer(rel), summary: summary(file) });
  }
}
rows.sort((a, b) => a.rel.localeCompare(b.rel));

const bySection = new Map();
for (const row of rows) {
  const section = row.rel.split("/").slice(0, row.rel.startsWith("components/ui/") ? 2 : 1).join("/");
  if (!bySection.has(section)) bySection.set(section, []);
  bySection.get(section).push(row);
}

let md = `# Codemap (generated)

Routing index — read THIS instead of opening files to explore. One line per
source file: layer (per \`skills/xuyuan-portfolio-naming\`) · line count
(⚠ = frozen giant over ${HARD_LIMIT}, only shrinks) · the file's own header
summary. Regenerate: \`npm run codemap\`. Do not edit by hand.

`;
for (const [section, sectionRows] of bySection) {
  md += `## ${section}/\n\n`;
  for (const { rel, lineCount, layer, summary: text } of sectionRows) {
    const flag = lineCount > HARD_LIMIT ? " ⚠" : "";
    md += `- \`${rel}\` · ${layer} · ${lineCount}${flag} — ${text}\n`;
  }
  md += "\n";
}

writeFileSync(OUT, md);
console.log(`gen-codemap: wrote ${relative(ROOT, OUT)} — ${rows.length} files.`);
