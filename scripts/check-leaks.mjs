// Confidentiality check (public repo — source AND history ship).
//
// Three rules, exit 1 on any hit:
//   A. every `__html:` injection must run through stripCssComments(...) —
//      its comments reach view-source verbatim — unless the line (or one of
//      the 3 lines above) carries `leak-ok: <reason>`.
//   B. generic leak patterns anywhere in source/docs: Google Drive/Docs and
//      Figma links, Windows/user absolute paths. Same `leak-ok:` escape.
//   C. optional PRIVATE denylist at <workspace>/leak-denylist.local.txt
//      (one case-insensitive substring per line, # comments) — kept OUTSIDE
//      the git repo on purpose: the names being checked for must never be
//      committed. Silently skipped when absent (e.g. in CI).

import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(fileURLToPath(import.meta.url), "..", "..");
const DENYLIST_PATH = join(ROOT, "..", "leak-denylist.local.txt");
const SCAN_DIRS = ["app", "components", "lib", "data", "docs", "skills"];
const EXTENSIONS = /\.(ts|tsx|css|md|mjs|json)$/;

const GENERIC_PATTERNS = [
  [/drive\.google\.com|docs\.google\.com/i, "Google Drive/Docs link"],
  [/figma\.com\/(file|design|board|proto)/i, "Figma link"],
  [/[A-Za-z]:[\\/]Users[\\/]/, "Windows user path"],
  [/[\\/]Users[\\/]Admin/i, "local user path"],
  [/Xuyuan[ %]20?Web/i, "workspace folder name"],
];

function* walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(path);
    else if (EXTENSIONS.test(entry.name)) yield path;
  }
}

const denylist = existsSync(DENYLIST_PATH)
  ? readFileSync(DENYLIST_PATH, "utf8")
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l && !l.startsWith("#"))
  : null;

const hits = [];
const posix = (p) => relative(ROOT, p).replaceAll("\\", "/");
const isSelf = (rel) => rel === "scripts/check-leaks.mjs";

for (const dir of SCAN_DIRS) {
  if (!existsSync(join(ROOT, dir))) continue;
  for (const file of walk(join(ROOT, dir))) {
    const rel = posix(file);
    if (isSelf(rel)) continue;
    const lines = readFileSync(file, "utf8").split("\n");
    const excused = (i) =>
      lines.slice(Math.max(0, i - 3), i + 1).some((l) => l.includes("leak-ok:"));

    const isCode = /\.tsx?$/.test(rel);
    lines.forEach((line, i) => {
      // rule A — unsanitized __html injection (code only; docs may cite it)
      if (isCode && /__html:/.test(line)) {
        const window = lines.slice(i, i + 2).join(" ");
        if (!window.includes("stripCssComments(") && !excused(i))
          hits.push(`${rel}:${i + 1}  __html without stripCssComments() — served comments leak (add sanitizer or \`leak-ok: <reason>\`)`);
      }
      // rule B — generic patterns
      for (const [pattern, label] of GENERIC_PATTERNS)
        if (pattern.test(line) && !excused(i))
          hits.push(`${rel}:${i + 1}  ${label}: ${line.trim().slice(0, 90)}`);
      // rule C — private denylist
      if (denylist)
        for (const term of denylist)
          if (line.toLowerCase().includes(term.toLowerCase()))
            hits.push(`${rel}:${i + 1}  private denylist term "${term[0]}${"*".repeat(term.length - 1)}"`);
    });
  }
}

if (hits.length) {
  console.error(`check-leaks: FAIL — ${hits.length} hit(s):`);
  for (const h of hits) console.error(`  FAIL  ${h}`);
  process.exit(1);
}
console.log(
  `check-leaks: OK (denylist ${denylist ? `${denylist.length} term(s)` : "absent — skipped"}).`,
);
