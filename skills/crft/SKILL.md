---
name: crft
description: Adopt, build, review, or migrate SNZ CRFT CSS and frontend strategy. Use when the repo is CRFT, the project has styles/layers/, the user asks to copy or adopt CRFT, or they run /crft. Do not use for generic HTML or CSS unless they asked for CRFT.
---

# CRFT

CRFT is a CSS, token, class, naming, and architecture strategy plus a reference structure. It does not supply product strategy, design judgment, taste, or product accessibility acceptance. `CRAFT.md` is the task router. `craft/` holds topic guidance.

## Ask

Choose the least complete mode for each affected subsystem before asking for layers: strategy only, local extraction, selected complete layers, or explicit full adoption. Local extraction and selected complete layers may coexist, but extraction itself grants no CRFT hooks. Do not turn an adopt request into a copy request. If a chosen mode copies layers and the user did not name them, ask. Never default to the full tree on an existing site.

Whole-layer names are `tokens` | `type` | `layout` | `grid` | `base` | `motion` | `utility` | `full`. Fonts only when asked (`--fonts`). `type`, `layout`, and `base` need `tokens`; `grid` and `motion` need both `tokens` and `layout`. Name dependencies explicitly; the copier does not add them.

## Detect

1. Read project instructions and current source.
2. Adopted layers: inspect which `layers/*.css` files exist and which public selectors, tokens, and guarantees their live contents retain. File presence alone is not API after project simplification. A missing file or live hook means that hook is not API; a local extraction does not grant it.
3. Strategy-only or no-layer work uses semantic HTML and project CSS. Do not invent CRFT hooks, tokens, Tailwind, or React into an HTML-first repo.
4. When CRFT docs are available (`CRAFT.md` here, or `../../craft/` next to this skill), read the route table, then only the owners this task needs.

## Load

Open at most three `craft/*.md` files unless the matching workflow Start with list is longer or the user asked `/crft audit`. Inspect matching `styles/layers/*.css` before changing or documenting API.

`/crft adopt` and `/crft tokens`: inventory first (`craft/adopt.md`). Do not patch tokens until the observed-to-job table exists.

## Copy

Use the copier only for selected complete layers or explicit full adoption:

```sh
node scripts/copy-system.mjs --dry-run --layers tokens <styles-dir>
```

The copier is optional whole-layer convenience. It writes layer files only. It does not write `global.css`, edit the project CSS file, or perform local extraction. Insert the printed prelude and `@import`s at the top of the project CSS file.

## Work

Semantic HTML and native behavior before public CRFT API. For local extraction, move only observed semantic jobs and useful relationships into the project’s existing owner; remove unused families, ratios, formulas, private state, and dependencies. If fluid type is unnecessary, use project-owned static semantic type tokens instead of copying `type.css`.

Attributes `c`, `s`, `t`, `g`, `x`, `y`, `o`, `l` are composition API only when their owning layer and live selector exist. `t` carries role, color, transform, weight (`lt` `rg` `bo`), and family (`sa` `se` `mo` `fb` `dp`). Bold is `bo`, not `bd`. `l` is line clamp. `t~="lc"` is lowercase. Do not add `w` or `f` attributes. Do not add a spacing, alignment, or display matrix.

Never put a class on `section`. Section identity is `id` when it has a job. Do not style through IDs. `data-skin` and `data-accent` remain canvas hooks.

`.btn`, `.crd`, and `.lnk` remain project-owned.

## Stop

Stop rather than inventing a product, design, taste, brand, content, or accessibility-acceptance decision. Also stop when ownership, live CSS, a hook’s complete layer, semantic behavior, source order, keyboard, contrast, reduced motion, fallback, inventory conflict, or deletion safety cannot be established. If two heading treatments fight for one token, ask the project authority.

## Report

Outcome, layers present, owners read, public API used, residual project CSS, checks, rendered evidence, inventory gaps, limits, uncertainty.
