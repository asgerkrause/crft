---
name: crft
description: Adopt, build, review, or migrate SNZ CRFT CSS and frontend strategy. Use when the repo is CRFT, the project has styles/layers/, the user asks to copy or adopt CRFT, or they run /crft. Do not use for generic HTML or CSS unless they asked for CRFT.
---

# CRFT

CRFT is the system. `CRAFT.md` is the task router. `craft/` is topic owners.

## Ask

If the user did not name layers, ask before copying. Do not default to the full tree on an existing site.

`tokens` | `type` | `layout` | `grid` | `base` | `motion` | `utility` | `full`. Fonts only when asked (`--fonts`). `grid` needs layout. `type`, `layout`, `base`, and `motion` need tokens.

## Detect

1. Read project instructions and current source.
2. Adopted layers: which `layers/*.css` files exist. Live CSS is API. A missing file means that hook is not API.
3. No layers and no adopt ask: semantic HTML and local CSS only. Do not invent CRFT hooks, tokens, Tailwind, or React into an HTML-first repo.
4. When CRFT docs are available (`CRAFT.md` here, or `../../craft/` next to this skill), read the route table, then only the owners this task needs.

## Load

Open at most three `craft/*.md` files unless the matching workflow Start with list is longer or the user asked `/crft audit`. Inspect matching `styles/layers/*.css` before changing or documenting API.

`/crft adopt` and `/crft tokens`: inventory first (`craft/adopt.md`). Do not patch tokens until the observed-to-job table exists.

## Copy

```sh
node scripts/copy-system.mjs --dry-run --layers tokens <styles-dir>
```

The copier writes layer files only. It does not write `global.css` or edit the project CSS file. Insert the printed prelude and `@import`s at the top of the project CSS file.

## Work

Semantic HTML and native behavior before public CRFT API. Attributes `c`, `s`, `t`, `g`, `x`, `y`, `o`, `l` are composition API only when their layer exists. `t` carries role, color, transform, weight (`lt` `rg` `bo`), and family (`sa` `se` `mo` `fb` `dp`). Bold is `bo`, not `bd`. `l` is line clamp. `t~="lc"` is lowercase. Do not add `w` or `f` attributes. Do not add a spacing, alignment, or display matrix.

Never put a class on `section`. Section identity is `id` when it has a job. Do not style through IDs. `data-skin` and `data-accent` remain canvas hooks.

`.btn`, `.crd`, and `.lnk` remain project-owned.

## Stop

Stop when authority, ownership, live CSS, a hook’s layer file, accessibility, source order, keyboard, contrast, reduced motion, fallback, inventory conflict, or deletion safety cannot be established. If two heading treatments fight for one token, ask.

## Report

Outcome, layers present, owners read, public API used, residual project CSS, checks, rendered evidence, inventory gaps, limits, uncertainty.
