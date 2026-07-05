# Page art-direction wave — state ledger (2026-07-02)

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
