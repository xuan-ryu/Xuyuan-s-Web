# Domain Docs

How the engineering skills should consume this repo's domain documentation when exploring the codebase.

## Layout

This repo uses a single-context domain-doc layout:

- `CONTEXT.md` at the repo root for project vocabulary, product concepts, and domain boundaries
- `docs/adr/` for architectural decision records

## Before exploring, read these

- `CONTEXT.md` at the repo root, if it exists
- Relevant ADRs in `docs/adr/`, if they exist

If these files do not exist, proceed silently. Do not flag their absence or suggest creating them upfront. Producer skills such as `/grill-with-docs` can create them lazily when terms or decisions get resolved.

## Use the glossary vocabulary

When output names a domain concept in an issue title, refactor proposal, hypothesis, or test name, use the term as defined in `CONTEXT.md`.

If the concept is not in the glossary yet, either reconsider whether the project uses that language or note it as a possible gap for `/grill-with-docs`.

## Flag ADR conflicts

If output contradicts an existing ADR, surface the conflict explicitly instead of silently overriding the decision.
