---
name: seess-css-system
description: Adopt, build, migrate, translate, review, or extend UI with the seess CSS system. Use for its canonical CSS tree, global.css, tokens, data-skin, type roles, layout, grid grammar, progressive features, utilities, project-layer rules, or reference translation.
---

# seess CSS system

CSS is behavioral source; `README.md` is public handbook. Route to handbook sections, then inspect `global.css` and every affected CSS owner. Do not invent API, copy CSS values, or infer components from enhancement hooks.

## Route

- **Adopt:** `README.md#adopt`, then `#use`.
- **Build, translate, or extend:** `#system-decisions`, `#files-and-layers`, and the relevant API section.
- **Migrate:** `#migration`, `#extension`, and affected public API sections.
- **Review:** `#verification` and relevant owner; do not edit.
- **Color:** `#skins` and `#accent-routing`.
- **Type, layout, grid, features, or utilities:** matching handbook section.

Use the first viable option: native HTML/browser behavior, existing public API, public token in a project rule, scoped token override, direct project rule, then a shared API proposal only after repeated evidence.

## Contract boundaries

Supported explicit routes: `secondary`, `tertiary`, `success`, `warning`, and `danger`; omit `data-accent` for the default accent.

`data-skin` owns canvas context. `data-accent` routes tokens only. `o="L-M-S"` is complete visual-order grammar; type roles default to `70ch`; grids resolve from the named `container` boundary. Private properties and enhancement runtime state are never product API.

`styles/project.css` may be edited only in this canonical repository. Adopted files, including copied `styles/project.css`, stay byte-identical; consumer product rules live outside the copied tree in a consumer-owned `@layer project`.

## Adoption

```sh
node scripts/copy-system.mjs [--dry-run] <target>
```

Before copying, find the actual consumer CSS entrypoint and confirm the target is absent. Import adopted `global.css` exactly once. Keep existing consumer CSS active until a verified migration slice replaces it.

## Stop

Stop and ask when entrypoint ownership is ambiguous, the target exists, a change needs public CSS API or canonical CSS ownership not granted by the task, consumer behavior cannot be verified, or a proposed deletion lacks consumer search evidence.

## Verify and report

Run `node scripts/check-system.mjs`; when reference specimens change, run `cd reference && bun run test`. Verify the affected user-visible seam and applicable responsive, accessibility, reduced-motion, and fallback paths.

Report mode, files inspected or changed, API mapping, residual project rules, checks, assumptions, and remaining risk. Review reports state that no files changed.
