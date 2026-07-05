# scripts/

Browser tooling for visually verifying the React/Next.js rebuild of the
portfolio against the live Framer baseline (`https://xuyuan.framer.website`),
plus the CJK font-subsetting pipeline. All Playwright scripts assume the dev
server is already running at `http://localhost:3000` (`npm run dev`) — they
never start one.

Run everything from the repo root, e.g. `node scripts/capture-one.mjs ...`.
Screenshot output conventionally goes to `audit-screenshots/`, which is
gitignored.

## Shared helper: `_pw.mjs`

Every Playwright script imports from `scripts/_pw.mjs` instead of carrying its
own bootstrap. Exports:

| Export | What it does |
| --- | --- |
| `launchBrowser(opts)` | `chromium.launch()` with a working `executablePath` resolved automatically (see below). Extra launch options pass through. |
| `resolveChromiumExecutable()` | The resolver behind `launchBrowser`: `PW_EXEC` env var first, then the highest `chromium-<rev>` in the ms-playwright cache (`%LOCALAPPDATA%/ms-playwright` or `PLAYWRIGHT_BROWSERS_PATH`, checking `chrome-win64/chrome.exe` then `chrome-win/chrome.exe`), else `null` (playwright's bundled default). |
| `loadPlaywright()` | Imports the project-local `playwright`, falling back to the throwaway install at `%TEMP%/xuyuan-pw-tools`. |
| `DEFAULT_VIEWPORT` | `{ width: 1440, height: 1000 }` — the Framer desktop canvas size used by most scripts. |
| `skipLoader(pageOrContext, extraKeys?)` | Adds an init script that sets `sessionStorage["skip-loader"] = "1"` (plus any `extraKeys`, e.g. `"loader-shown"`) so the site skips its intro loader. |
| `preScroll(page, { step=500, delay=150, returnToTop=true })` | Gentle full-page scroll to trigger lazy loads / appear effects before capturing. |
| `routeName(route)` | Filename slug: `"/"` → `home`, `"/work/vicino-ai"` → `work__vicino-ai`. |

Conventions:

- **`PW_EXEC`** — set to an absolute `chrome.exe` path to force a specific
  browser build (`PW_EXEC=<absolute chrome.exe path> node scripts/...`). Needed when
  the installed `playwright` package and the browser cache revisions drift
  (that drift is exactly why `launchBrowser` exists).
- **skip-loader** — capture/measure scripts skip the intro loader by default;
  `capture-loader.mjs` and `selfcheck.mjs` deliberately do NOT, because they
  observe the loader itself.
- **Viewports** — desktop default is 1440×1000 (Framer canvas); several
  scripts accept a `[width]` arg (owner's screen is 1536px); mobile scripts
  use 390×844 @2x.

## Kept scripts

| Script | What it does / how to run |
| --- | --- |
| `selfcheck.mjs` | Smoke-test localhost:3000: loader-timeline screenshots + JS-error sweep. `node scripts/selfcheck.mjs` |
| `capture-migration-matrix.mjs` | Full matrix: live Framer vs local React × desktop/mobile × all routes → `audit-screenshots/matrix/`. `npm run audit:screenshots` |
| `capture-one.mjs` | One URL at several scroll offsets. `node scripts/capture-one.mjs <url> <outPrefix> <y1,y2,...> [width] [height]` |
| `capture-fullpage.mjs` | Full-page screenshot after pre-scroll. `node scripts/capture-fullpage.mjs <url> <outFile> [width]` |
| `capture-viewport-pair.mjs` | Live vs react at an arbitrary viewport. `node scripts/capture-viewport-pair.mjs <outDir> <width> <height> "<routes>" "<y1,y2,...>"` |
| `capture-live-vs-react.mjs` | Live vs react desktop captures at a per-route scroll plan. `node scripts/capture-live-vs-react.mjs [outDirName]` |
| `capture-mobile-one.mjs` | One URL at 390×844 @2x. `node scripts/capture-mobile-one.mjs <url> <outPrefix> <y1,y2,...>` |
| `capture-mobile-pair.mjs` | Live vs react at mobile width (per-route plan). `node scripts/capture-mobile-pair.mjs <outDirName>` |
| `capture-nav-transition.mjs` | Click a nav link, capture transition frames. `node scripts/capture-nav-transition.mjs <url> <linkText> <outPrefix>` |
| `capture-loader.mjs` | Frames of the intro loader (not skipped). `node scripts/capture-loader.mjs <url> <outPrefix> [width]` |
| `capture-how.mjs` | Screenshots of the home How-I-Work section. `node scripts/capture-how.mjs <url> <outPrefix> [width]` |
| `measure-page.mjs` | Print a page's scrollHeight. `node scripts/measure-page.mjs <url>` |
| `measure-featured.mjs` | Bounding boxes of Featured-section decor assets. `node scripts/measure-featured.mjs <url> [width]` |
| `measure-how-decor.mjs` | How-I-Work decor boxes at a fixed scroll. `node scripts/measure-how-decor.mjs <url> <scrollY> [width]` |
| `measure-roof.mjs` | Roof-transition piece boxes at a fixed scroll. `node scripts/measure-roof.mjs <url> <scrollY> [width]` |
| `collect-cjk.cjs` | Scan `data/ components/ app/` for CJK chars → `scripts/brush-subset-chars.txt`. `node scripts/collect-cjk.cjs` |
| `subset-brush-font.cjs` | Subset the brush font to latin + collected CJK (see known issue below). `node scripts/subset-brush-font.cjs` |
| `brush-subset-chars.txt` | Data file produced by `collect-cjk.cjs`, consumed by `subset-brush-font.cjs`. |

## archive/

`scripts/archive/` holds one-off probes/repros from the Framer→React
migration (June 2026): `probe-*`, `repro-*`, `debug-*`, `list-*`, `extract-*`,
`count-canvas`, `scan-text-fx`. They are kept for reference only and were NOT
refactored onto `_pw.mjs` — they still carry their own bootstrap, several
target the long-gone migration dev servers on ports 4000/4101, and at least
two probe selectors/log lines that no longer exist in the source
(`probe-patch.mjs`'s `.roof-wall-patch`, `probe-points.mjs`'s `[hero] points`
console log). Don't expect them to run as-is.

## Font-subsetting pipeline — known issues

1. `subset-brush-font.cjs` requires the `subset-font` package, which is NOT a
   declared dependency in `package.json` (it was installed ad hoc when the
   subset was made). Running it today fails at `require("subset-font")` until
   the package is installed.
2. The original brush font source is gone: the script overwrites
   `public/fonts/liujian-mao-cao.woff2` **in place**, so the shipped file is
   already the subset output. Re-running the pipeline can only subset the
   subset — if new CJK glyphs are ever added to the site copy, the full
   original font must be re-obtained first.

Documented as-is on purpose; do not "fix" by re-subsetting the current file.
