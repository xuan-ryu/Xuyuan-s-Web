// File-size ratchet (naming skill's ≤200-line rule, mechanized).
//
// New source files must stay ≤ HARD_LIMIT lines. Legacy giants are frozen in
// scripts/file-size-baseline.json: they may only shrink. Run with --update
// after intentionally shrinking (or splitting) a baselined file to lower its
// ceiling. Exit 1 on any violation — wired into `npm run check`.
//
// Scope: app/ components/ lib/ data/ *.ts|*.tsx (scripts/ and docs are not
// render-path code and are exempt).

import { readdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(fileURLToPath(import.meta.url), "..", "..");
const BASELINE_PATH = join(ROOT, "scripts", "file-size-baseline.json");
const SCAN_DIRS = ["app", "components", "lib", "data"];
const HARD_LIMIT = 300; // hard ceiling for new files
const TARGET = 200; // soft target — warn only

function* walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(path);
    else if (/\.(ts|tsx)$/.test(entry.name)) yield path;
  }
}

function countLines(path) {
  const text = readFileSync(path, "utf8");
  return text.length === 0 ? 0 : text.split("\n").length;
}

const posix = (p) => relative(ROOT, p).replaceAll("\\", "/");

const sizes = new Map();
for (const dir of SCAN_DIRS) {
  if (!existsSync(join(ROOT, dir))) continue;
  for (const file of walk(join(ROOT, dir))) sizes.set(posix(file), countLines(file));
}

if (process.argv.includes("--update")) {
  const baseline = {};
  for (const [file, lines] of [...sizes].sort())
    if (lines > HARD_LIMIT) baseline[file] = lines;
  writeFileSync(BASELINE_PATH, JSON.stringify(baseline, null, 2) + "\n");
  console.log(
    `check-file-size: baseline updated — ${Object.keys(baseline).length} files over ${HARD_LIMIT} lines.`,
  );
  process.exit(0);
}

if (!existsSync(BASELINE_PATH)) {
  console.error("check-file-size: no baseline. Run `node scripts/check-file-size.mjs --update` once.");
  process.exit(1);
}
const baseline = JSON.parse(readFileSync(BASELINE_PATH, "utf8"));

const errors = [];
const warnings = [];
const shrunk = [];

for (const [file, lines] of [...sizes].sort()) {
  const frozen = baseline[file];
  if (frozen !== undefined) {
    if (lines > frozen)
      errors.push(`${file}: ${lines} lines — grew past its baseline of ${frozen} (ratchet: giants only shrink; extract what you touched)`);
    else if (lines < frozen) shrunk.push(`${file}: ${frozen} → ${lines}`);
  } else if (lines > HARD_LIMIT) {
    errors.push(`${file}: ${lines} lines — new files must stay ≤${HARD_LIMIT} (target ${TARGET}); split along layer seams (skills/xuyuan-portfolio-naming)`);
  } else if (lines > TARGET) {
    warnings.push(`${file}: ${lines} lines — over the ${TARGET}-line target (soft)`);
  }
}

// A baselined file that disappeared was split or renamed — that's the goal;
// --update clears the stale entry.
const gone = Object.keys(baseline).filter((f) => !sizes.has(f));

if (warnings.length) console.log(`check-file-size: ${warnings.length} file(s) over the soft ${TARGET}-line target.`);
for (const w of warnings) console.log(`  warn  ${w}`);
if (shrunk.length) {
  console.log(`check-file-size: ${shrunk.length} baselined file(s) shrank — run --update to lock in the lower ceiling:`);
  for (const s of shrunk) console.log(`  down  ${s}`);
}
if (gone.length) {
  console.log(`check-file-size: ${gone.length} baselined file(s) no longer exist — run --update to clean up:`);
  for (const g of gone) console.log(`  gone  ${g}`);
}
if (errors.length) {
  console.error(`check-file-size: FAIL — ${errors.length} violation(s):`);
  for (const e of errors) console.error(`  FAIL  ${e}`);
  process.exit(1);
}
console.log(`check-file-size: OK — ${sizes.size} files scanned, ${Object.keys(baseline).length} frozen giants.`);
