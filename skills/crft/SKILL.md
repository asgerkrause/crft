---
name: crft
description: Adopt, build, review, or migrate SNZ CRFT CSS and frontend strategy. Use when the repo is CRFT, the project has styles/layers/, the user asks to copy or adopt CRFT, or they run /crft. Do not use for generic HTML or CSS unless they asked for CRFT.
---

# CRFT

CRFT is the system. `CRAFT.md` is the task router. `craft/` is topic owners.

## Start

Do not edit yet.

1. Inspect `CRAFT.md` Route. Name the workflow row and every owner this task hits.
2. Read those owners and matching live CSS. Grep is not the owner.
3. Plan the edit from that. Stop if a needed owner is unread.

Spacing, padding, margin, gap, and property form always load `craft/layout.md`.

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

Prefer `calc()` from an existing public token over a new name that restates the same relationship.

Semantic HTML and native behavior before public CRFT API. Attributes `c`, `s`, `t`, `g`, `x`, `y`, `o`, `l` are composition API only when their layer exists. `t` carries role, color, transform, weight (`lt` `rg` `bo`), and family (`sa` `se` `mo` `fb` `dp`). Bold is `bo`, not `bd`. `l` is line clamp. `t~="lc"` is lowercase. Do not add `w` or `f` attributes. Do not add a spacing, alignment, or display matrix.

Never put a class on `section`. Section identity is `id` when it has a job. Do not style through IDs. `data-skin` and `data-accent` remain canvas hooks.

`.btn`, `.crd`, and `.lnk` remain project-owned.

## Never

<!-- ban-index:start -->
never `*-block-start` or `*-inline-start` single-side longhands
never a class on `section`
never style through an ID selector
never `data-theme`; canvas is `data-skin`
never new spacing, alignment, or display utility matrices
never substring attribute selectors in documentation
never `w` or `f` attributes on `t`
never `bd` as a weight flag; bold is `bo`
never set `font-weight` without `font-variation-settings` wght or vice versa
never heading max-width; override the role's `--t-*-mw` token
Private properties are never consumed in product CSS; the full list is in the contract and craft/tokens.md.
<!-- ban-index:end -->

## Check

Named commands; the result is pass, fail, or not run. In this repo: `node scripts/check-system.mjs` and `node --test scripts/*.test.mjs`. In a consumer: `node scripts/check-project.mjs <styles-dir>` against `layers/crft-manifest.json`. Rendered and judgment gates follow `craft/verify.md`.

`/crft audit` is the Full CRFT system audit row in `CRAFT.md`: read `craft/verify.md`, then the other owners in route order, then run every gate.

## Stop

Stop when authority, ownership, live CSS, a hook’s layer file, accessibility, source order, keyboard, contrast, reduced motion, fallback, inventory conflict, or deletion safety cannot be established. If two heading treatments fight for one token, ask.

## Report

Outcome, layers present, owners read, public API used, residual project CSS, checks, rendered evidence, inventory gaps, limits, uncertainty.
