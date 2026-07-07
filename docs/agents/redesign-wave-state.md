# Page art-direction wave — state ledger (2026-07-02)

## Session 5 (2026-07-07, later) — full-site 4-dimension audit + fix wave

**Audit:** all 8 case pages reviewed (UI / narrative / animation / code) by 4
parallel agents. Hard checks passed site-wide (0 horizontal overflow at 1440
& 390, 0 console errors, image dims correct). Full findings in that session's
reports.

**Fixes applied (all landed, tsc/eslint clean, all pages 200):**
- PII: Roper ch1-3.png Drive grid REBUILT (names/recruitment sheets cropped
  out) + BONUS leak fixed: ch1-1.png Gantt ASSIGNED-TO column had six real
  teammate names, wiped per-scanline. FrogHire ch2-2/cover/ch2-1 PNGs: real
  account email + resume filenames painted over. NOTE: froghire mp4s
  (35MB) may still flash the email on-screen - check when compressing.
- Facts: VR year corrected to Winter Term Jan 2023 (owner-confirmed; the
  structured duration fields were wrong -> now 12/2022-1/2023). VR "Emperor"
  poster captioned as working title.
- No-JS: layout.tsx <noscript> forces [data-fade]/.text-reveal/.fx-rise
  visible (site read blank without JS).
- Narrative dedup: pulse (824 x2 -> console only; 10,180 3rd ref reworded),
  nyma (30-40/17-page eyebrows retired, etym read-line cut, archhead
  "only designer" cut, Turn inclusivity twin reworded), froghire (10 pairs:
  quotes live ONLY in marginalia/interlude; ledger sole teller of trade-offs
  + margin cross-ref artifact; Fig-09 re-plated natural ratio), roper
  ("evidence-based process" x3 -> once in s08 h2; deliverables once),
  vicino (flow-strip component DELETED, stage enumeration once), vr
  (premise x4 -> distinct angles), cloud (film caption now adds scenario/
  length/what-to-watch), hunger (captions -> provenance).
- Accent law: hunger pull-quote red -> gold (chop = one red); vicino static
  ambers -> gold (amber only on Run/generate/cues); nyma loop lit in trace
  not blue.
- InteractiveCue everywhere: roper guess module, cloud CfGate scrub, hunger
  loupe, vicino canvas/model-board (replacing ad-hoc invites).
- Final-state contract: vicino canvas idles COMPLETED (Run rewinds+replays);
  vrmb flight line default-drawn (hidden state motion-gated).
- CfFutures carousel reworked per owner: 4-equal-col tab grid, 4-segment
  progress bar column-aligned under tabs, active segment fills in persona
  color; head gap widened.
- Perf/assets: vicino big PNGs downscaled (2.9MB->230KB etc.), 6 unused
  vicino images+fields deleted, vr specimen 480->227KB, cloud carousel
  panels lazy. SKIPPED (no ffmpeg): hunger 27MB / roper 17.9MB / froghire
  35MB / vicino 21MB videos - install ffmpeg (winget install Gyan.FFmpeg).
- Dev-server note: Roper image-optimizer cache may serve stale WebP of the
  redacted PNGs until restart; disk files clean, prod unaffected.

## Session 4 (2026-07-07) — NEW case: Nyma "The Archive Thread" (slug `nyma`)

**New bespoke case page built end-to-end** from the owner's deck (slides
22-27) + the Smarttwigs archive (`S:\Smarttwigsigma`). The page steps
inside Nyma's own brand system (Pulse precedent): parchment stage #f2efea,
Ceramic Black bands, the manual's archival page furniture (mono
"Topic - / Page no. -" headers over drawn hairlines), Murecho as the page
voice. Case accent = Nyma's own law: Activation Blue #0d5eaf interactive-only
(--case-accent), Ceramic Yellow #cf882e static material trace (site gold
role), ONE seal-red moment = the red stitch at the Turn. Narrative:
inheritance -> thread (νήμα) -> rulebook -> pages -> codification -> handoff;
the Turn carries the νήμα discovery + the honest reflections.

**Files:** data/projects.ts (nyma entry, order 1, legacy orders bumped +1;
featured:false so Home untouched), components/nyma-case-layout.tsx (scoped
CSS, final-state markup), nyma-scroll.tsx (GSAP over lenis-bus: thread-fill
scrub down the rail, IO center-band rail states, hairline draws, counters,
moodboard strip scrub >=769px, wall column drift, page-walks-itself frames,
manual fan-open, loop light-up), nyma-interactives.tsx (NymaDirections
4-voice board, NymaColorRoles lot-card spotlight - both InteractiveCue'd),
registered in bespokeLayouts + workGroups(uiux). Assets:
public/media/work/nyma/ (39 PNGs from the archive - brandmanual pages, Fates
crop, vase, 4 moodboard slices, competitive board, 8 wall mocks 900w,
onboarding/design-system tall walks, mobile rows, 2 AI-draft section crops,
cover) + fonts/ murecho 400/500/700 (page-scoped @font-face "Murecho Nyma" -
the site murecho-latin.woff2 is a STATIC 300 declared 300-600; the hero
wordmark deliberately stays the light 300, like the manual's).

**Owner feedback applied same session:** AI-draft pair re-cropped to
DISTINCT sections (colorful commerce rows vs mono Platform-Advantages),
asymmetric 7/5 grid + per-draft argument notes (near-identical hero shots
had "no contrast", blurred top of draft B was confusing); whole page scaled
up (hero band 42vw / word 19vw, claims -> 60px, wall 3->2 cols of 8 plates,
strip 46vw, pagescroll 68vh, phones full-row, etym νήμα 10vw).

**Owner feedback round 2 (same session):** (a) INCLUSIVITY is the design
thesis - many Nyma decisions existed to hold unrelated styles in one system.
Copy updated (rulebook +hospitality para, pages +same-shell sentence, Turn
+inclusivity line) and a THIRD interactive added: NymaWardrobes ("three
wardrobes, one shell" - Luxury/Designer/Vintage swap on an unmoving lot
card, changes/never-changes ledger) as Pl. 11 in ch4; later plates
renumbered 12-17. (b) TYPE = thin + regular, bold nearly absent from the
brand: claims/turn/next/etym/ledger/tally demoted 500->300, working
headings 400, ladder 64/48 at 300 (hover step 500), loop-node mono 400;
Murecho Nyma family now 300/400/500 (700 file removed); mono 700 kept only
for the manual's own bolded header slot + product-idiom prices.

**Confidentiality:** Bidlab agency credit + mock PII (Raritan NJ address,
bank last-4) cropped out of every shipped plate; empty source txts
(NYMA BRANDING / OLD DESIGN EVALUATION) flagged to owner. QA: tsc clean,
desktop section shots + /work row verified; Greek νήμα protected from
text-transform uppercasing. Remaining nits: phone-viewport deep pass and
reduced-motion/keyboard pass not yet run this session.

## Session 3 (2026-07-04) — Pulse "Studio Bloom" rework + Vicino viz pass

**Pulse page fully rebuilt (owner-directed).** The ink/paper specimen document
AND its scroll page-turn are retired; the page now adopts Pulse's own light
stage (#f4f7f7 + soft cyan blooms, glass bentos, white cards) — an
owner-sanctioned departure from the paper editorial ground, scoped to this
page. Narrative is the owner's 9-act causal chain (melee → bet → look →
wake-up → rescue → base → skills → interface → product → Turn), copy in
data/projects.ts. Choreography in components/pulse-scroll.tsx (GSAP
ScrollTrigger over lenis-bus; server markup is always final state — reduce
and no-JS read a finished page). One persistent run-log rail (single spine,
scroll-driven states). One-typeface rule (owner 字体统一): everything Manrope
w/ tabular numerals; real mono ONLY for literal code (commit ticker, JSON
editor). H1 + next-title de-condensed on this page only. Page-local
.pulse-navscrim fades content under the transparent fixed nav.

**Numbers re-verified against the private Pulse repo git history (2026-07-04):**
peak file = 10,180 lines (rev 5652305 root index.html — the old 13,020 claim
did NOT survive audit and is corrected everywhere); 824 commits over 5 weeks,
308 structural; 40 handoff components (37 React); 1,905 net dead lines
(commit-subject verbatim). New evidence media in public/media/work/pulse/:
accent-study, cyan-experiment, foundations-color, pulse-app-onboarding
(cropped — Vicino wordmark removed). foundations-handbook.png +
component-preview.png deleted (orphaned); components/band-stack.tsx DELETED
(page-turn dead code, zero importers).

**QA state:** lint/tsc clean; zero console errors; phone load-at-bottom bug
fixed; brief focus-steal fixed (preventScroll + no pre-focus); reduced-motion
full-content pass; keyboard pass. Vicino checkpoint/intervention vizzes being
redrawn as diagrams (pipeline loop + dual-lane timeline) per owner
text-density feedback — see that session's report for status.

## Session 2 status (2026-07-02 evening) — latest first

Home + all case pages are redesigned, committed, and confidentiality-cleaned.
Latest commit at handoff: `0e7ae23`. Recent arc (newest first): codex batch
(0e7ae23), Vicino PDR-schematic board + declassify (1e822c1), Pulse declassify
(12cfcfc), Vicino product-faithful board (7962cc8), lotus arrival (1bc0cec),
Pulse standard arc (652af61), Vicino four-rooms (d26196c), home night-ending
(1e2f52d).

**Confidentiality (owner decision — portfolio is public): DONE + grep-verified
zero.** No commit hashes, no teammate real names, npm genericized (can't be
reverse-engineered — incl. react-playground.png recaptured to @your-org/react),
internal PRD paraphrased (verbatim rules + the "Detail PRD" board image removed;
439KB asset deleted). Prototype product screenshots kept (owner OK). If any
future edit re-introduces real material, re-run the sweep: grep for commit
hashes, `internal-package`, teammate names (a teammate/a teammate/a teammate/a teammate), `internal-doc`,
`internal-doc`, the drift quote.

**Two refinements IN FLIGHT at handoff** (background agents; each owns disjoint
files; commit their output after a grep + tsc + screenshot check):
1. Vicino board — dock the Sidebar to the right (product-faithful inspector),
   it was cramped in the center cluster. Files: components/vicino-model-board.tsx,
   vicino-case-layout.tsx.
2. About page transitions — make ACTIVITIES & LEADERSHIP cover the dark section
   like the shutter→dark page-turn (fix inverted sticky: `.abf-dark` should pin,
   `.abf-vita-sec` should be the relative cover), and remove the color band at
   the top of VOICES. File: app/about/page.tsx (all styles embedded there).

**Wave 2 — DONE (2026-07-03):** globals.css dead-CSS purge (5683→4346, −23%,
render-neutral, committed); confidentiality re-verified (react-playground
serves @your-org/react, zero internal-package anywhere); froghire/vrmb eyeball QA
passed (render clean, 0 console errors); isolated worktree `next build` green —
14/14 static pages, all routes prerendered, exit 0. globals.css is now 4346
lines, down from 7986 at the start of the whole engineering effort (−46%).

**Only owner-side items remain (need Xuyuan, not code):** Pulse cover/preview
media; production domain + OG/sitemap/robots (metadataBase is still the
`https://xuyuan.liu` placeholder); lotus size/petal-palette eyeball; moon-gate
scroll feel. Nothing else is blocking.

---

Wave 1 (9 parallel page builds) was interrupted by the session usage limit
(resets 3am America/New_York). All work is on disk and committed; `tsc` clean,
all 10 routes render 200 with zero console errors. Specs live in the session
scratchpad (`specs/spec-*.json`) — if gone, regenerate from the
`page-art-direction` workflow journal or re-run its Study phase.

## Per-page status

| Page | Build | Agent QA | Notes |
| --- | --- | --- | --- |
| /contact | done | **full QA ✓** | letter sheet; mailto contract intact; seal aspect deviation documented |
| /work | done | **full QA ✓** | catalogue index; card view + WebGL deleted; keyboard parity verified |
| /work/hunger1942 | done | **full QA ✓** | broadsheet; loupe shipped (hover/fine-pointer only); adjacent-nav reused |
| /about | done | **interrupted** | film-roll rebuild; needs QA pass |
| /work/pulse | done | **full QA ✓** | specimen document; values traced to the private Pulse repo; 2 iterations + reduced-motion/phone verified; copy trims deferred to owner pass |
| /work/froghire-ai | done | **interrupted** | triage ledger + affinity map + trade ledger; needs QA |
| /work/roper-center | done | **full QA ✓** | poll figures verified by frame-grabbing the project's own video (80/16/4 women's-status sample question, NOT the spec's assumed 45/52/4); keyboard-only GuessVsAmerica passed; composed connective copy flagged for owner review |
| /work/vr-education | done | **interrupted** | field folio + particle strip (40-sprite cap to verify) + public/media/vrmb/ derived assets |
| /work/vicino-ai | done | **interrupted** | --vicino-*→--text-* mapping, LayerMap SVGs, khaki retired; contrast probe (alpha ≥0.82) to verify |

## Owner-directed follow-ups (2026-07-02 evening, specs from the owner)

1. **Koi feed UI**: redesign the "Why not feed the fish?" pill AND fix the
   dock behavior — after the first click it should shrink/dock to the side;
   today it stays centered (koi-pond.tsx, feed intro UI around the
   feedIntroAppear keyframes). Verify with real clicks.
2. **How I Work over the pond**: after ~2-3 feeds, the "How I Work" title +
   the three ValueCards surface ON the koi pond itself (fade in over the
   water); the separate home-how screens/vase/bamboo collage section is then
   REMOVED from app/page.tsx. The current screens form is preserved at git
   tag `backup/home-how-screens` (checkout that tag to recover the section
   markup + its globals.css rules). Wire: koi-pond exposes a feed-count
   callback (or DOM event) → home page mounts the cards overlay.
3. **Pulse case material expansion** (owner sanction for pulse copy edits in
   data/projects.ts): source material = the private prototype repo
   AND the private Pulse repo. Add interactive pages/components
   as evidence (screenshots or embedded specimens). Narrative arc to write
   from the owner's own git commit history + work history, five beats:
   (a) starting to explore a code design-system component library;
   (b) discovering messy team code quality → starting engineering
   standardization; (c) shipping fast HTML/React demos the team could use;
   (d) refactoring the mess into a maintainable component library, up to npm
   packaging; (e) serving non-coding designers throughout — Figma export and
   easy hand-around previews. Mine the private Pulse repo git log for real
   dates/commit subjects; screenshots of the component library/handoff pages
   can be captured from that repo's own preview surfaces.

## Resume checklist (Wave 2)

1. QA the six interrupted pages against their specs: viewport screenshots
   (1536 + 390, slow pre-scroll, NOT fullPage), reduced-motion, keyboard
   (roper Reveal, hunger CTAs), offscreen pause probes (vrmb particles,
   vicino canvas), contrast probe on vicino body copy.
2. Family coherence sweep across all 9: one red moment per page,
   gold=static/amber=interactive, condensed H1 voice, indices-as-metadata.
3. globals.css orphan deletion (orchestrator-only; lists below). Then
   delete orphaned components: work-card.tsx, work-view-controls.tsx,
   work-particle-background.tsx (text-reveal.tsx STAYS — /about may still
   use it; verify first).
4. Worktree `next build` + full lint. Before/after gallery. Split commits.
5. Deferred owner sign-offs: data/projects.ts + about.ts copy edits
   (chapter retitles, dedupes, plate captions), contact Service options,
   docs/design-system.md Forms-contract line, Pulse cover/preview media.

## globals.css deletion lists (from completed agents' reports)

### /work (line numbers vs pre-wave globals.css)
- Whole blocks: 712-775 (.project-card family), 864-908 (work header/grid),
  910-1590 (strict Framer work-index overlay incl. view controls/particles),
  4288-4344 (work detail grid pass' index rules).
- Selector removals from shared rules: 2571, 2583, 2584, 2594, 2615-2619,
  2671, 2682-2683, 2734, 2762, 2814, 2824-2826, 4279, 4860, 4873-4879,
  4929, 4936-4974, 5139, 5146, 5169/5175/5181, 5195-5203.

### /contact
- ~L2137-2200 (.form-group input/select/textarea resets, .contact-hero,
  .contact-card*, .contact-portrait*, .contact-form, .form-row, .form-group*)
- ~L2829-2997 (.contact-page family: hero/title/grid/intro/card/portrait/
  form-section/submit:active/[aria-invalid]/form-error/form-status)
- Media blocks ~L3010-3039 (max-1079) and ~L3088-3112 (max-809) contact rules.

### /about
- List lost with the interrupted agent — re-derive by cross-greping .about-*
  selectors against the rebuilt app/about/page.tsx before deleting anything.

Line numbers shift after each deletion — locate by selector, delete
bottom-up, pixel-verify per batch (the dead-CSS-purge playbook).
