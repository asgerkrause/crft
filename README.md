---
scope: craft
layer: index
updated: 2026-07-06
---

# Craft

Frontend contract for strategy-first, aesthetic-high, performance-native websites and interfaces.

## Canonical file

Read `CRAFT.md`. It is the source truth for tokens, themes, variants, primitives, composition, components, widgets, accessibility, performance, copy, and verification.

## Skills

Canonical skill sources live in `skills/`. Deterministic helpers live in `scripts/`. Installed Pi copies may mirror them under `~/.pi/agent/skills/` and `~/.pi/agent/scripts/`.

- `craft-init` — create project-local `CRAFT.md` / `DESIGN.md`.
- `craft-audit` — review UI/code against Craft.
- `craft-sync` — sync project Craft with global Craft.
- `craft-tokenize` — map local CSS variables/classes/themes into Craft registries.
- `craft-css-scaffold` — inject valid Craft CSS file structure without LLM-written boilerplate.

## Boundary

Craft is implementation-agnostic. Project code, brand context, accessibility/security/performance constraints, and local conventions decide final syntax and values.

## Verification

- `bun scripts/craft-css-scaffold.test.ts` — scaffold regression fixtures.

## Principle

One frontend task should need one Craft read: `CRAFT.md`.
