# Codemap (generated)

Routing index — read THIS instead of opening files to explore. One line per
source file: layer (per `skills/xuyuan-portfolio-naming`) · line count
(⚠ = frozen giant over 300, only shrinks) · the file's own header
summary. Regenerate: `npm run codemap`. Do not edit by hand.

## app/

- `app/about/page.tsx` · L3 · 1261 ⚠ — About page — server component for the /about route: Hongyadong hero, then
- `app/contact/page.tsx` · L3 · 549 ⚠ — "Correspondence: the letter sheet" — the contact page composed as a letter:
- `app/design-system/page.tsx` · L3 · 327 ⚠ — mirrors the --text-* ladder in app/globals.css @theme — keep in sync
- `app/globals.css` · L3 · 4637 ⚠ — Self-hosted fonts + all media now live under public/media (see repo layout).
- `app/layout.tsx` · L3 · 111 — (no header comment)
- `app/not-found.tsx` · L3 · 21 — Uses the semantic system (label atom + Cta) rather than Tailwind utilities —
- `app/page.tsx` · L3 · 79 — (no header comment)
- `app/robots.ts` · L3 · 11 — /design-system is an internal working surface — routable, but not for
- `app/sitemap.ts` · L3 · 18 — (no header comment)
- `app/work/[slug]/page.tsx` · L3 · 64 — Case Layout is an explicit Project choice. The exhaustive registry keeps
- `app/work/page.tsx` · L3 · 673 ⚠ — /work — 检索, the printed catalogue index.

## components/

- `components/about-dark-pin.tsx` · · · 45 — Bottom-pin offset for the About dark→activities cover. The dark band is
- `components/case-next.tsx` · L3 · 137 — Shared "next case" close for the case pages: label, title, and a cover
- `components/case-study-layout.tsx` · · · 153 — Mirrors the Framer "case study" template (vicino-ai, froghire-ai,
- `components/chunk-guard.tsx` · · · 65 — Deploy-skew guard. Every deploy invalidates the previous build's hashed
- `components/cloud-futures-case-layout.tsx` · L2 · 3366 ⚠ — Cloud Support Futures — a Cornell × Google Cloud sponsored studio.
- `components/cloud-futures-interactives.tsx` · L1 · 578 ⚠ — Interactive beats for the Cloud Support Futures case page. Styles live in
- `components/cloud-futures-scroll.tsx` · L2 · 210 — Scroll spine for the Cloud Support Futures page: the fixed case rail
- `components/contact-form.tsx` · · · 174 — (no header comment)
- `components/fade-reveal.tsx` · L3 · 60 — One observer pass for both reveal vocabularies:
- `components/featured-gate.tsx` · L3 · 1096 ⚠ — Garden Window — an editorial index whose preview fills a wide opening
- `components/fg-lotus-layer.tsx` · L1 · 393 ⚠ — ONE lotus arrangement, shared by the moon-gate crossing and the koi pond's
- `components/fg-window-sync.ts` · · · 53 — useFgWindowSync — locks the Selected Work index (.fg-list) to its settled
- `components/footer.tsx` · · · 63 — Full-bleed ink colophon on the site grid: a mono eyebrow + the email as the
- `components/froghire-affinity-map.tsx` · L1 · 245 — Chapter 1, S4 figure: the six real complaints from the FrogHire bug log
- `components/froghire-case-layout.tsx` · L2 · 1650 ⚠ — FrogHire.ai — the triage ledger.
- `components/froghire-trade-ledger.tsx` · · · 171 — The Trade Ledger closes Chapter 2 and is the SOLE teller of the four
- `components/gsap-reveal.tsx` · · · 88 — GSAP-powered masked text reveal (RevealText markup:
- `components/header.tsx` · L3 · 280 — 40px: past this the top scrim (globals .content-nav::before) fades in
- `components/hero-scene.tsx` · · · 3252 ⚠ — Home hero — the full-page ink-mountain WebGL scene plus the night "page 2"
- `components/hongyadong.tsx` · · · 1755 ⚠ — Home intro — the Hongyadong night-scene stage: a sticky 100vh canvas
- `components/how-decor-parallax.tsx` · · · 50 — Live How-I-Work decor drift (measured at 1440x1000): the black screen and
- `components/hunger-loupe-frame.tsx` · · · 111 — pre-compressed background for the loupe (native-width JPEG, not the
- `components/hunger-poster-layout.tsx` · L2 · 1070 ⚠ — "The 1942 Edition" (spec-hunger1942): the project printed its own broadsheet,
- `components/koi-how-overlay.tsx` · L1 · 450 ⚠ — Reveal immediately (lite-scenes mode: there is no pond to feed).
- `components/koi-pond-lazy.tsx` · L1 · 10 — Code-split the heavy WebGL koi scene out of the home page's initial bundle.
- `components/koi-pond.tsx` · · · 2383 ⚠ — Home hero — the ink koi pond: a self-contained 2D-canvas island rendering
- `components/loader.tsx` · L3 · 419 ⚠ — module-scope: survives client-side route changes / tab switches, but
- `components/nyma-case-layout.tsx` · L2 · 3898 ⚠ — Nyma — "The Archive Thread". The one case page that steps inside Nyma's
- `components/nyma-drafts.tsx` · L1 · 58 — Nyma case page — the two AI drafts as papers on a desk (L1 interactive).
- `components/nyma-flow-screens.tsx` · · · 219 — Nyma case page — the onboarding flow strip (Pl. 16).
- `components/nyma-flow-styles.ts` · · · 288 — Nyma case page — scoped CSS for the onboarding flow strip (L0 string;
- `components/nyma-interactives.tsx` · L1 · 457 ⚠ — Nyma case page — the two hands-on specimens. Styles live in the page's
- `components/nyma-phone.tsx` · L1 · 536 ⚠ — Nyma case page — the mobile commerce prototype (Pl. 16).
- `components/nyma-scroll.tsx` · L2 · 350 ⚠ — Nyma case page — scroll choreography controller (renders null).
- `components/nyma-strip-drag.ts` · · · 50 — Nyma case page — mouse grab-drag panning for the horizontal strips
- `components/nyma-system-board.tsx` · L1 · 48 — Nyma case page — THE codified design-system page, rendered live (L1
- `components/page-transition.tsx` · · · 192 — Ink-curtain route transition, ported from the live site: the veil rises
- `components/poster-layout.tsx` · · · 152 — Mirrors the Framer "poster" template (hunger1942, vr-education): centered
- `components/pulse-assembly-styles.ts` · · · 249 — Pulse case page — diagram-assembly styles (L0, css string).
- `components/pulse-case-layout.tsx` · L2 · 3406 ⚠ — Pulse case page — L2 composer (white editorial, product-first).
- `components/pulse-component-browser.tsx` · L1 · 520 ⚠ — ── The live component browser (Fig. 10), recreated as a real interactive
- `components/pulse-content.ts` · · · 210 — Pulse case page — L0 specimen data: everything the layout draws but does
- `components/pulse-creative-brief.tsx` · L1 · 204 — ── The Creative Brief (Fig. 19), made genuinely editable — the caption
- `components/pulse-fork-styles.ts` · · · 177 — Pulse case page — fork styles (L0, css string).
- `components/pulse-part-switch.tsx` · · · 154 — Pulse case page — the fork: two doors into the case (L1, client).
- `components/pulse-ramp-board.tsx` · L1 · 83 — ── The six semantic ramps, made copyable stop by stop (L1, client).
- `components/pulse-scroll.tsx` · L2 · 230 — Pulse case page — scroll choreography controller (renders null).
- `components/pulse-shot-pair.tsx` · · · 45 — Pulse case page — labeled before/after evidence pair (L1, server).
- `components/pulse-spec-styles.ts` · · · 158 — Pulse case page — token-sheet styles (L0, css string).
- `components/pulse-token-chips.tsx` · L1 · 87 — ── The hero token chips (Fig. 01), made copyable — a design system's tokens
- `components/roof-transition.tsx` · · · 96 — Live composition: two roof artworks, each rendered twice. The pieces drift
- `components/roper-case-layout.tsx` · L2 · 1401 ⚠ — "The Ledger and the Weathervane" — Roper Center's bespoke case layout
- `components/roper-checkpoint-diagram.tsx` · · · 77 — The signature decision as a two-lane hairline diagram (spec-roper.json
- `components/roper-guess-vs-america.tsx` · · · 125 — The product's predict-then-reveal loop rebuilt in portfolio ink
- `components/roper-poll-data.ts` · · · 32 — The prototype's own sample question — the ONE shared constant that feeds
- `components/smooth-scroll.tsx` · L2 · 60 — The original Framer site ships Lenis smooth scrolling — the inertia is a
- `components/text-reveal.tsx` · · · 66 — (no header comment)
- `components/value-card.tsx` · · · 318 ⚠ — When false the card is purely informational: no pointer tilt/scale/press,
- `components/vicino-audience-viz.tsx` · L1 · 330 ⚠ — Station-02 visualization: who actually uses the product, and why the real gap
- `components/vicino-case-layout.tsx` · L2 · 3548 ⚠ — Vicino case page — server-rendered layout (case-layout family).
- `components/vicino-checkpoint-viz.tsx` · L1 · 375 ⚠ — Station visualization: why the product inserts a cheap image-preview layer
- `components/vicino-intervention-viz.tsx` · L1 · 418 ⚠ — Station visualization: every generation stage has two halves — what the AI
- `components/vicino-model-board.tsx` · L1 · 532 ⚠ — Station-04 (Block B) interactive: the owner's own PDR *schematic*, rebuilt
- `components/vicino-pipeline-viz.tsx` · L1 · 380 ⚠ — Chapter 1-2 visualization: the same creative depth of a traditional film
- `components/vicino-workflow-canvas.tsx` · L1 · 710 ⚠ — Coordinate space of the node stage. Re-spaced from the old 900x640 board so
- `components/vrmb-flight-line.tsx` · · · 115 — The measured "flight line" for the VR Monarch Butterfly folio: a 1px accent
- `components/vrmb-particle-strip.tsx` · L1 · 243 — The coda strip for the VR Monarch Butterfly folio: a quiet canvas where a
- `components/vrmb-poster-layout.tsx` · L2 · 1176 ⚠ — VR Monarch Butterfly — "a naturalist's field folio for a virtual migration"
- `components/wordmark.tsx` · · · 157 — Saira Condensed ExtraLight, -10% tracking, glyph outlines (opentype.js). The
- `components/work-index-plate.tsx` · · · 103 — The catalogue "plate" — the print pulled from the portfolio sleeve on row
- `components/work-particle-background.tsx` · · · 173 — (no header comment)

## components/ui/

- `components/ui/case-map.tsx` · L1 · 197 — Accent for the progress fill + active row; defaults to the case accent.
- `components/ui/cta.tsx` · L1 · 73 — emphasis ladder — solid (primary) → line (secondary) → quiet (contextual)
- `components/ui/interactive-cue.css` · L1 · 20 — (no header comment)
- `components/ui/interactive-cue.tsx` · L1 · 27 — A concise, consistent "this is interactive" hint for the case pages. One short
- `components/ui/offscreen-video.tsx` · L1 · 81 — visible share of the element that starts playback
- `components/ui/outcome-band.css` · L1 · 134 — (no header comment)
- `components/ui/outcome-band.tsx` · L1 · 52 — Outcome band — the recruiter's at-a-glance row (audit #1 request):

## data/

- `data/about.ts` · L0 · 185 — About-page content — the single source for /about copy. The narrative runs
- `data/project-catalog.ts` · L0 · 82 — (no header comment)
- `data/projects.ts` · L0 · 1143 ⚠ — Project data transcribed verbatim from the Framer export
- `data/site.ts` · L0 · 56 — NBSP inside "AI product" keeps it together so the black-page title breaks as

## lib/

- `lib/css-sanitize.ts` · L1/L3 · 4 — (no header comment)
- `lib/scroll-behavior.ts` · L1/L3 · 129 — Skip the native fallback when the motion only works with smooth scroll.

