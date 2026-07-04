---
scope: craft
layer: agent-contract
updated: 2026-07-04
---

# Craft agent contract

Use this file as machine-first operating contract for this standalone craft folder.

## Goal

Apply craft as universal frontend source truth: strategy-first, aesthetic-high, performance-native, accessible, tokenized, implementation-agnostic UI guidance.

## Source boundary

- This folder is self-contained.
- Internal references are required and valid.
- Do not require external folders, local paths, private project names, implementation package docs, or generated build artifacts.
- Project context may override craft only when project goal, brand, accessibility, security, performance, or existing safe local pattern demands it.

## Retrieval order

1. Read `README.md` for boundary and topic map.
2. Read only topic file(s) matching task triggers.
3. Read `Related:` files when rule depends on them.
4. Use `glossary.md` when token/primitive/color/state vocabulary is unclear.
5. Use `token-contract.md` before creating or judging tokens.
6. Use `implementation-bridge.md` when applying craft inside a project structure.
7. Use `examples.md` only when application pattern is unclear or output shape matters.

Do not load every file by default. Full-folder review is for architecture, migration, source-truth edits, or explicit audit.

## Machine index

| Task trigger | Read first | Add if needed |
| --- | --- | --- |
| tokens, variables, theme, color | `tokens.md`, `token-contract.md` | `glossary.md`, `naming.md`, `accessibility.md` |
| type, font, heading, measure | `tokens.md`, `token-contract.md` | `styling.md`, `accessibility.md` |
| component, card, button, primitive | `components.md` | `tokens.md`, `naming.md`, `examples.md` |
| grid, columns, span, layout | `grid.md` | `sections.md`, `styling.md`, `accessibility.md` |
| section, hero, CTA, page rhythm | `sections.md`, `frontend.md` | `tokens.md`, `copy.md`, `grid.md` |
| CSS, selectors, cascade, layers | `styling.md` | `token-contract.md`, `components.md` |
| motion, transition, interaction | `motion.md` | `performance.md`, `accessibility.md` |
| form, input, validation, error | `forms.md` | `accessibility.md`, `copy.md`, `tokens.md` |
| nav, header, menu, footer | `navigation.md` | `accessibility.md`, `motion.md`, `tokens.md` |
| runtime, JS, dependency, media | `performance.md`, `platform.md` | `motion.md`, `frontend.md` |
| copy, CTA text, errors, states | `copy.md` | `forms.md`, `sections.md`, `accessibility.md` |
| project implementation mapping | `implementation-bridge.md` | project local agent contract |
| migration, old tokens, grep | `migration.md` | `tokens.md`, `token-contract.md`, `styling.md` |

## How to apply rules

- Treat `Status: Must` as blocking unless project constraints make it impossible.
- Treat `Status: Default` as preferred path; override only with stated reason.
- Use `Rule` for decision, `Tradeoff` for cost, `Override` for escape hatch.
- Use `Tiny example` for immediate syntax shape.
- Use `Applied patterns` / `examples.md` for realistic usage context.

## Example handling

Examples teach relationships and behavior, not prescribed values.

- Copy exact token names.
- Do not copy arbitrary visual values from examples.
- Keep formulas like `clamp()` and `color-mix()` when relationship is the lesson.
- Prefer realistic, independent examples over long scenario chains.
- If example conflicts with a rule, rule wins.

## Token rules

- Core token families should stay stable: `--l-*`, `--s-*`, `--t-*`, `--c-*`, `--m-*`, `--i-*`, `--z-*`.
- `--e-*` is flexible element/component skin; add only for reusable, themeable, or repeated primitives/components.
- Components consume final tokens like `--t-h1-fs`, `--s-gp`, and `--l-mw`.
- Projects may use fluid `-min/-max` derivation or direct media/container overrides.

## Output expectations

When using craft in implementation:

- Name which topic files informed decision.
- Preserve semantic HTML and accessible state.
- Prefer CSS/token/native platform before JS/runtime/dependency.
- Keep component boundaries earned by reuse, state, complexity, or authoring clarity.
- Verify visible behavior for UI/token/style changes.

## Verification for craft edits

Before claiming craft docs publish-ready, run equivalent checks:

```sh
find . -type f | sort
rg -n "<banned-external-or-private-reference-pattern>" .
```

Also verify:

- no hidden publish artifacts;
- all `Related:` refs point to internal files;
- examples avoid arbitrary literal values unless formula/relationship matters.
