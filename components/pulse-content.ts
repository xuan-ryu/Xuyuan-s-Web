// Pulse case page — L0 specimen data: everything the layout draws but does
// not compose (traced to the Pulse system source, git-verified 2026-07-15).
// Confidentiality invariants live here with the data: teammates anonymous,
// tools as categories, no commit hashes, no package identity.

/* ---- screenshots ---- */
// Captured from the project's static file:// surfaces at 1440×1000.
export const SHOT_W = 1440;
export const SHOT_H = 1000;

/* ---- case map ---- */
// Two-part rail (owner structure 2026-07-14): Part 1 · Product, Part 2 ·
// Design engineering, plus the Reflection coda (part 0). Supporting
// subchapters share their parent's data-act so the rail stays calm.
export const acts = [
  { id: "act-product", label: "Product", part: 1 },
  { id: "act-surfaces", label: "My surfaces", part: 1 },
  { id: "act-look", label: "Design language", part: 1 },
  { id: "act-melee", label: "Fragmentation", part: 2 },
  { id: "act-bet", label: "Convergence", part: 2 },
  { id: "act-base", label: "System", part: 2 },
  { id: "act-skills", label: "Operating model", part: 2 },
  { id: "act-proof", label: "Proof", part: 2 },
  { id: "act-turn", label: "Reflection", part: 0 },
];

/* ---- fragmentation: the four melee sources ---- */
// Four prototypes with the same face and incompatible sources; each cell
// draws its source's characteristic UI idiom (tool categories, not brands).
export const meleeSources = [
  {
    kind: "canvas",
    made: "drawn in a design canvas",
    trace: "frames only — no code at all",
  },
  {
    kind: "builder",
    made: "an AI page-builder export",
    trace: "one file, styles inlined per node",
  },
  {
    kind: "chat",
    made: "pasted from a model chat",
    trace: "runs, but write-only to humans",
  },
  {
    kind: "image",
    made: "composited from images",
    trace: "screens as pictures — nothing wired",
  },
] as const;

/* ---- token sheet ---- */
// Semantic lightness ramps — tokens.css: same 10 stops per family
// (50–900; 300/400/800/900 were OKLab-interpolated in on 2026-07-14 for
// dark-theme duties — mid fills and deep surfaces).
export const ramps = [
  {
    role: "ready",
    base: "#49e0f5",
    stops: ["#f0fdff", "#e5fbff", "#b8f3fb", "#7ce8f7", "#65e4f6", "#49e0f5", "#0ea5b8", "#0d7685", "#0a5561", "#073a43"],
  },
  {
    role: "positive",
    base: "#43ba51",
    stops: ["#eff9f1", "#d5f0da", "#abe2b3", "#80d088", "#64c56d", "#43ba51", "#2e9d40", "#207d32", "#166628", "#0d531f"],
  },
  {
    role: "scheduled",
    base: "#3987f3",
    stops: ["#eff5fe", "#d7e6fd", "#b0cdfa", "#7daff8", "#5d9bf6", "#3987f3", "#1f6fe0", "#1a57b0", "#16468e", "#123771"],
  },
  {
    role: "risk",
    base: "#f19a08",
    stops: ["#fef6e7", "#fce7be", "#f7ce84", "#f5b75c", "#f3a93e", "#f19a08", "#cc7f06", "#a1640b", "#82510c", "#68400b"],
  },
  {
    role: "in progress",
    base: "#6366f1",
    stops: ["#f1f1fe", "#e2e3fc", "#c7c9f8", "#a5a8fa", "#8288f6", "#6366f1", "#4f46e5", "#4338ca", "#3a2eb6", "#3324a5"],
  },
  {
    role: "decline",
    base: "#ef4444",
    stops: ["#fef2f2", "#fde4e4", "#f9c9c9", "#f9938e", "#f56f6a", "#ef4444", "#dc2626", "#b91c1c", "#a01515", "#8a0e0e"],
  },
];

// Type scale — tokens.css --type-page-display: 64px, --type-h2: 28px, --fs-5: 15px.
// `size` is the specimen render size on the wide token-sheet board.
export const typeScale = [
  { px: 64, size: 52, role: "page display" },
  { px: 28, size: 28, role: "section" },
  { px: 15, size: 16, role: "body" },
];

// 8-based spacing rhythm — tokens.css --space-2/4/6/7/9.
export const spacingTicks = [8, 16, 24, 32, 48];

/* ---- commit stream ---- */
// Commit-style subjects, paraphrased from the repo's real flavor; no
// hashes, no names. Two rows drift on scrub.
export const tickerRows: string[][] = [
  [
    "refac(css): purge dead legacy classes — DOM-verified",
    "fix: restore hover states lost in migration",
    "prettier: normalize every touched file",
    "migrate: analytics onto shared tokens",
    "split: home monolith into partials",
    "refac(tokens): make card surfaces solid",
    "verify: reconcile inventory and preview",
  ],
  [
    "chore: repair the lint config",
    "refac(campaign): build-time concat the bundles",
    "fix: re-align layout drift against capture",
    "rename: class names people can read",
    "clean: cut dead code, not carry it",
    "docs: write the rule where the AI loads it",
    "ci: fail the pipeline on hand-edited output",
  ],
];

/* ---- CI guard ---- */
// The jobs that protect the canonical HTML library on every merge. The
// pipeline's later publish/pages jobs ship the SEPARATE npm package, which
// the story introduces later — so they're not shown here.
export const ciSteps: Array<[string, string]> = [
  ["verify", "inventory ↔ preview ↔ board"],
  ["tokens", "drift advisory"],
  ["generated", "hand-edit guard"],
  ["contrast", "AA gate on text pairs"],
];

/* ---- the system sweep: before/after pairs (2.4 living rules) ---- */
// Pages the newest waves rewrote, captured from the repo's own surfaces —
// reference/prototypes = before, the current app = after; sidebars and the
// assistant dock are cropped out of frame (naming stays out of shot).
export const sweepPairs = [
  {
    fig: "2.10",
    caption: "Analytics — the chart canon applied to an existing report",
    before: {
      src: "/media/work/pulse/analytics-before.png",
      alt: "The early Analytics report: serif display heading, warm paper ground, green sparklines, and platform bars each in a different color",
      label: "Before · one-off visual rules",
      note: "serif display · decorative color · off-system charts",
      w: 1220,
      h: 900,
    },
    after: {
      src: "/media/work/pulse/analytics-after.png",
      alt: "Analytics rebuilt on the system: one typeface, cyan mono-hue charts, tokenized surfaces, and the same weekly report structure",
      label: "After · the semantic system applied",
      note: "one voice · mono-cyan charts · tokenized surfaces",
      w: 1220,
      h: 900,
    },
  },
  {
    fig: "2.11",
    caption:
      "Signal — one-off colors and controls replaced by the semantic system",
    before: {
      src: "/media/work/pulse/signal-before.png",
      alt: "The early Signal feed: pill-shaped tabs, a pink alert banner, and status chips in one-off colors",
      label: "Before · one-off visual rules",
      note: "pink alert · bespoke pills · one-off chips",
      w: 1190,
      h: 878,
    },
    after: {
      src: "/media/work/pulse/signal-after.png",
      alt: "Signal on the system: the alert banner in semantic amber, tokenized segmented controls, and status chips on the compact scale",
      label: "After · the semantic system applied",
      note: "amber = risk · tokenized controls · one chip scale",
      w: 1220,
      h: 900,
    },
  },
];

/* ---- proof: the generated-UI tells ---- */
// How generated UI gives itself away, read against the campaign after-shot;
// each row names the tell and the base rule that forbids it.
export const proofTells: Array<[string, string]> = [
  ["a second voice", "one typeface · tabular numerals"],
  ["decorative color", "six semantic ramps · color only with meaning"],
  ["loud hierarchy", "size · spacing · tone — no bold, no border chrome"],
  ["off-scale gaps", "8-based rhythm · every value on the token scale"],
];

/* ---- the Turn: Create-with-AI gate steps ---- */
// Human checkpoints are the page's one seal-red moment (the Turn's spine).
export const gateSteps = [
  { label: "Goal", note: "a goal and an optional note", human: false },
  { label: "Assets", note: "uploaded or picked from the brand vault", human: false },
  { label: "Brief", note: "editable fields, budget shown", human: true },
  { label: "Generate", note: "runs only after the brief is approved", human: false },
  { label: "Review", note: "content gate signs off the creative", human: true },
  { label: "Publish", note: "a person releases — always", human: true },
];

/* ---- verbatim quotables (verified against the repo, 2026-07-04) ---- */
export const doctrineQuote =
  "Build the link that doesn’t exist, then delete the copies.";
export const fileQuote =
  "Preserve file:// support because designers may open this export directly.";
