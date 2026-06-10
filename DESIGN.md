---
version: 1.0
name: xuyuan-portfolio-design-analysis
description: "Reverse-engineered design spec of https://xuyuan.framer.website/ (the visual source of truth for this rebuild). An ink-wash (水墨) editorial canvas: white paper ground, near-black ink (#050505), one warm accent (#fe8411 persimmon orange, with #d4941e gold for dates/rules), and a red seal stamp (印章) as the recurring brand mark. Display type is Cormorant Garamond (300–500) at up to 168px; body copy is EB/Cormorant Garamond ~22px, often text-align: justify; UI microcopy is Murecho/Newsreader letterspaced uppercase. The page rhythm alternates paper-white sections with full-bleed black bands, decorated by cut-out photography of Chinese garden artifacts (roofs, screens, bamboo, rocks) pinned to viewport edges. All numbers below were measured off the live site at 1440×1000 (and verified at 1920) with the scripts/ probes."

colors:
  ink: "#050505"            # primary text + black bands (also #0a0a0a)
  paper: "#ffffff"
  accent: "#fe8411"         # nav active, hover, live-preview links
  gold: "#d4941e"           # detail-page divider rule, activity dates
  seal-red: "#7e1f17"       # red seal stamp artwork
  ink-muted: "rgba(10,10,10,0.48)"
  paper-muted: "rgba(255,255,255,0.65)"
  hairline: "#e5e5e5"       # light dividers; dark bands use rgba(255,255,255,0.28)
  card-glass: "rgba(16,16,16,0.84)"  # How-I-Work method cards (blur 28px behind)
  input-fill: "#e7e7e7"     # contact form fields (filled, radius 6)

typography:
  display-hero:        { family: Cormorant Garamond, size: 82px, weight: 300, usage: "home hero Welcome/欢迎/ようこそ at x=86, y=405/503/601" }
  display-page-title:  { family: Cormorant Garamond, size: 120px, usage: "case-study titles, SOLUTION banner (right-aligned)" }
  display-chapter:     { family: Cormorant Garamond, size: 112px, usage: "CHAPTER N banners (right-aligned, rule below); also the CTA marquee" }
  display-poster:      { family: Cormorant Garamond, size: 96px, usage: "poster titles (centered), HOW I WORK" }
  display-about:       { family: Cormorant Garamond, size: 168px, usage: "About Me. in the Hongyadong hero" }
  heading-section:     { family: Cormorant Garamond, size: 55px, usage: "about essay titles; 60px for PROJECT SUMMARY" }
  heading-tag:         { family: Cormorant Garamond, size: 48px, usage: "case section tags, 4px left bar" }
  heading-card:        { family: Cormorant Garamond, size: 44px, transform: uppercase, usage: "OBSERVE/BUILD/ALIGN" }
  body-serif:          { family: EB/Cormorant Garamond, size: 22px, lineHeight: 1.6, align: justify, usage: "all long-form copy" }
  body-emphasis:       { family: Cormorant Garamond, size: 25px, usage: "case section headlines" }
  page2-display:       { family: Cormorant Garamond, size: 72px, color: white, usage: "Hi, I'm Xuyuan… (centered, two lines)" }
  micro-upper:         { family: Murecho/Newsreader, size: 13-17px, tracking: 0.1-0.2em, transform: uppercase, usage: "nav, footer, labels, card kickers" }
  brush-logo:          { family: LiuJian Mao Cao, usage: "刘 栩源 brush mark in the black logo block" }

layout:
  desktop-design-width: 1440
  anchoring: |
    Framer pins each element individually — there is no single max-width page
    container. Verified behaviors when the viewport grows 1440 → 1920 (+480):
      * viewport-center pinned (+240): roof-transition artwork, the whole
        How-I-Work composition, page-2 title, hero "Hi I'm Xuyuan" block.
      * left-edge pinned (+0): garden tree, rocks, grass, both roof strips,
        about/work big titles, footer socials-left.
      * right-edge pinned (+480): both bamboo cut-outs, VIEW ALL PROJECTS,
        hero seal + vertical text, footer socials-right.
      * fractional pin (left:% + translateX(-same %)): featured window units
        (unit A 83.63%, unit B 16.27% of free space).
      * stretch with fixed insets: koi frame (~190px each side), footer card,
        activities card.
  page-flow-1440: |
    home:  hero scene (0–~880) → black page2 (~880–2090) → roof transition
           (2090–3377, pieces at rel y -1 and 352) → featured (head 472px +
           stage; window A top 40, window B top 1450; garden decor 1896–2765)
           → koi frame (doc 6878–8092, 1214px tall) → How-I-Work stage
           (1840px: title y82, cards y393/927/1427 at x192/608/192, 640px wide)
           → marquee CTA → footer.
    about: Hongyadong root 1944px (sticky stage 100vh, releases at scroll 944)
           → photo/koan/bio → What Changed + 5×4 logo wall (cells 100×94,
           pitch 282/114, wall 1228px centered) → black band (Shutter essay +
           460×818 Kyoto video at x960 + How I Work essay + dojo wall, photos
           154px wide at x 0/178/356/534/712/890/1068/1246, tops staggered
           0/0/139/156/29/213/0/99) → activities card → testimonials (369×272
           photos) → habits (240×360) → marquee CTA → footer.

scroll-choreography:
  home-hero: |
    No pinning. Hero copy scrolls away naturally and fades out
    (opacity ≈ 1 − 1.55 × scrollY/viewportH; 0.60 @300, 0.06 @600).
    The quote line hugs the fold (top edge y≈963) and fades with the rest.
    Black page-2 body fades in over scrollY 900→1200. Canvas mountains
    dissolve into a star field across the same range (three.js, fixed).
  about-hongyadong: |
    Root 1944px, stage sticky at top:0 (100vh). Title block starts 124px low
    (y=348) and slides up 144px during the first 200px of scroll, resting at
    y=204 until the stage releases at scrollY≈944. Signature (XUYUAN LIU +
    hometown note) reveals at progress ≈ 0.7 (scrollY≈480) with a staggered
    char/word animation. Text colors crossfade ink→paper as the canvas
    ignites to the night scene.
  detail-pages: plain document flow; reveal-on-scroll fades only.

templates:
  work-case:   "vicino-ai / froghire-ai / roper-center — title band → cover →
                black summary (meta grid + verbatim paragraphs) → SOLUTION
                banner → Most Memorable Moment (+ 16:9 prototype videos,
                two halves + one wide) → CHAPTER banners with tagged
                two-column sections, each closing on a full-width figure.
                No sidebar, no overview, no prev/next."
  work-poster: "hunger1942 / vr-education — centered title + lede → tall
                poster image → black about/details card (red seal,
                PROJECT/CLIENT/YEAR/SERVICES/LIVE PREVIEW rows) → justified
                essays → tall gallery → prev/next thumbnails (120×88)."

recurring-motifs:
  - red seal stamp (ntwL7wUkSslvYCLMnzXaIuQu8zU.png) — nav block, contact
    card, poster details, marquee separator, footer center
  - LET'S WORK TOGETHER marquee (112px serif, seal between repetitions,
    black GET IN TOUCH button pinned center) closes home and about
  - footer: black rounded inset card on white, noise texture, socials in the
    top corners, centered seal, nav row, © Xuyuan Liu
  - ink brush strokes (RJnh8cLkwy27PD5vycbXZbYjcQA.png) behind glass cards
  - garden cut-outs always bleed off the viewport edge (negative offsets)

verification-workflow: |
  All geometry above is reproducible with the audit scripts:
    list-imgs-range.mjs / list-text-range.mjs <url> <yMin> <yMax> [width]
    measure-featured.mjs <url> [width]      — featured decor + window nums
    probe-scroll.mjs <url> "<texts>" "<ys>" — scroll choreography sampling
    capture-one.mjs / capture-live-vs-react.mjs — screenshot matrices
  Compare live (xuyuan.framer.website) against http://127.0.0.1:4000 at both
  1440 and 1920 before and after any layout change.
---

# Xuyuan portfolio — original site design notes

This file documents the design system of the original Framer site so the
Next.js rebuild can be checked against explicit, measured rules rather than
screenshots alone. See the YAML above for tokens, anchoring, geometry, and
scroll choreography. The export package (`../export-...`) is the asset and
copy source; the live site is the behavioral source of truth.
