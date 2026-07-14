# Xuyuan Portfolio

This context describes how portfolio work is registered, grouped, and rendered without changing the authored case-study content.

## Language

**Project**:
A portfolio work entry containing its public story, media, metadata, ordering, and presentation choices.
_Avoid_: Item, entry

**Project Catalog**:
The single source for finding Projects, grouping them for the Work index, and resolving adjacent Projects.
_Avoid_: Project registry, project list

**Work Category**:
An editorial grouping used to organize Projects in the Work index.
_Avoid_: Project type, tag group

**Case Layout**:
The presentation adapter that renders a Project as its authored case-study or poster page.
_Avoid_: Template component, case renderer

**Scroll Behaviour**:
The portfolio-wide contract for smooth navigation, same-frame scroll subscriptions, and coordinated scroll locks with a native fallback.
_Avoid_: Lenis bus, scroll controller

**Four-Layer Structure** (defined in `skills/xuyuan-portfolio-naming`):
File-organization ladder — imports flow downhill only, files target ≤200 lines.
- **L0 Axiom (公理层)**: constants, tokens, types, copy, pure data (`data/`).
- **L1 Device (器件层)**: leaf components, utils, hooks (`components/ui/`, `lib/` helpers).
- **L2 Process (流程层)**: module-internal orchestration (case layouts, scroll controllers).
- **L3 Diplomacy (外交层)**: cross-module wiring — routes, shared buses, site chrome.
_Avoid_: tier, level (say "layer"; L-numbers are canonical)

**Frozen Giant**:
A legacy over-300-line file locked in `scripts/file-size-baseline.json`; it may only shrink (ratchet rule — extract what you touch).
_Avoid_: big file, legacy file

**Codemap**:
The generated routing index at `docs/agents/codemap.md` (`npm run codemap`) — read it instead of opening files to explore.
_Avoid_: file list, inventory
