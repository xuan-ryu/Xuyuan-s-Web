# Page art-direction wave — state ledger (2026-07-02)

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
| /work/pulse | done | **full QA ✓** | specimen document; values traced to the real Pulse repo (private Pulse repo); 2 iterations + reduced-motion/phone verified; copy trims deferred to owner pass |
| /work/froghire-ai | done | **interrupted** | triage ledger + affinity map + trade ledger; needs QA |
| /work/roper-center | done | **full QA ✓** | poll figures verified by frame-grabbing the project's own video (80/16/4 women's-status sample question, NOT the spec's assumed 45/52/4); keyboard-only GuessVsAmerica passed; composed connective copy flagged for owner review |
| /work/vr-education | done | **interrupted** | field folio + particle strip (40-sprite cap to verify) + public/media/vrmb/ derived assets |
| /work/vicino-ai | done | **interrupted** | --vicino-*→--text-* mapping, LayerMap SVGs, khaki retired; contrast probe (alpha ≥0.82) to verify |

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
