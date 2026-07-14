---
name: xuyuan-portfolio-comments
description: Comment conventions for the Xuyuan portfolio repo — mandatory file-header summaries, grep-able section banners for slice-reading, what earns an inline comment (constraints, landmines, provenance) and what is banned (narration, changelogs, shipped-CSS leaks). Read before writing or editing any source file's comments, adding a new component, or working inside the large legacy files.
---

# Comment Conventions

Companion to `skills/xuyuan-portfolio-naming/SKILL.md` (small, well-named
files); comments are the second half of the same token-economy contract:
they let an agent **skip** a file from its header or **slice** it by banner
instead of reading it whole.

Two readers, always: a future agent (token-metered, navigating by Grep/Read)
and a public-repo visitor (this repo's source AND history are public).

## File header — the file's 摘要 (mandatory for L2/L3)

Every L2/L3 file, and any file over ~100 lines, opens with a `//` block
(after `"use client"`/imports is fine) covering, in 2–10 lines:

1. What this file is and which module/layer it belongs to.
2. The contract or invariants it upholds (lifecycle, cleanup, progressive
   enhancement, ordering).
3. What it deliberately does NOT do (so nobody "completes" it).

Written so an agent reading only lines 1–30 can decide skip-or-continue —
a good header pays for itself every session. House example,
`components/pulse-scroll.tsx`:

```
// Pulse case page — scroll choreography controller (renders null).
//
// One client mount drives every scripted moment on the page via selectors
// scoped to `.pulse-case-page`; the layout itself stays a server component.
// ...
// Progressive-enhancement contract (reduced-motion + no-JS correctness):
// the SERVER MARKUP IS THE FINAL STATE. ...
```

Small L0/L1 files: one line suffices (`// The site's single call-to-action
affordance: …`).

## Section banners — make slice-reading possible

Any file over ~150 lines gets a banner comment at each logical section:

```
/* ---- moment 3: skills ladder ---- */
```

so an agent can Grep the banner text, then Read with offset/limit instead of
paying for the whole file. Rules: banner text is unique within the file,
grep-friendly (plain words, no decoration that varies), and matches the
vocabulary used in the file header. In the legacy giants, ADD banners to any
section you touch — that's part of the ratchet rule.

## What earns an inline comment

Only constraints the code cannot show:

- **Landmines** — hard-won gotchas at the exact site
  (`// never scale the observed host to zero — IO stops firing`).
- **Provenance** — why a magic value is exempt from tokens
  (`// measured-Framer geometry literal`).
- **Ordering / lifecycle requirements** — why this runs before that,
  what must be cleaned up together.
- **Why not the obvious way** — when the natural implementation was tried
  and fails (`// ScrollTrigger's own snap stalls under smooth scroll — glide
  via the scroll bus instead`).
- **JSDoc on exported props/params** that aren't self-evident, in the
  `components/ui/cta.tsx` style:
  `/** emphasis ladder — solid (primary) → line (secondary) → quiet */`.

## Banned

- **Narration** — restating the next line, the loop, or the type
  (`// increment counter`, `// map over projects`).
- **Changelog comments** — dates, "fixed", "updated per review", author
  tags. Git owns history; these cost tokens on every read forever.
- **Commented-out code.** Delete it; git remembers.
- **TODO without a home** — a TODO must name an issue or the engineering
  skill's deferred backlog; otherwise do it or drop it.
- **Confidentiality leaks** (public repo, history included): no teammate
  names, internal repo names, local paths, drive links, or a product's
  internal component/file names — anywhere, but especially inside
  `dangerouslySetInnerHTML` CSS template literals, whose `/* comments */`
  ship verbatim to view-source. Strip at injection or keep provenance notes
  as `//` TSX comments outside the literal (mechanics in the engineering
  skill).

## Style

- English, sentence case, terse; match the surrounding file's density.
- When editing existing code, don't strip headers/banners/landmine comments
  you didn't write — they are load-bearing navigation for the next agent.
