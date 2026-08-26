---
name: crft
description: Adopt, build, review, or migrate SNZ CRFT CSS and frontend strategy. Use when the repo is CRFT, the project has styles/layers/, the user asks to copy or adopt CRFT, or they run /crft. Not for generic HTML or CSS unless CRFT is asked.
---

# CRFT

CRFT is a CSS, token, class, naming, and architecture strategy plus a reference structure. It does not supply product strategy, design judgment, taste, or product accessibility acceptance. `CRAFT.md` routes tasks; `craft/` holds topic guidance.

## Start

Do not edit yet.

1. Inspect `CRAFT.md` Route; name the workflow row and every owner hit.
2. Read those owners and the matching live CSS; grep is not the owner.
3. Plan from that; stop if an owner is unread.

Spacing, padding, margin, gap, and property form always load `craft/layout.md`.

## Ask

Choose the least complete mode per affected subsystem: strategy only, local extraction, selected complete layers, or explicit full adoption. Local extraction and selected complete layers may coexist; extraction itself grants no CRFT hooks. If a mode copies layers the user did not name, ask. Never default to the full tree on an existing site.

Whole-layer names: `tokens` | `type` | `layout` | `grid` | `base` | `motion` | `utility` | `full`. Fonts only with `--fonts`. `type`, `layout`, and `base` need `tokens`; `grid` and `motion` need `tokens` and `layout`. Name dependencies explicitly; the copier does not add them.

## Detect

1. Read project instructions and current source.
2. Adopted layers: inspect which `layers/*.css` files exist and which public selectors, tokens, and guarantees their live contents retain. File presence alone is not API after project simplification. A missing file or live hook is not API; local extraction does not grant it.
3. Strategy-only or no-layer work uses semantic HTML and project CSS. Do not invent CRFT hooks, tokens, Tailwind, or React into an HTML-first repo.
4. When CRFT docs are available (`CRAFT.md` here, or `../../craft/` beside this skill), read the route table, then only the needed owners.

## Load

Open at most three `craft/*.md` files unless the matching workflow Start with list is longer or the user asked `/crft audit`. Inspect matching `styles/layers/*.css` before changing or documenting API.

`/crft adopt` and `/crft tokens`: inventory first (`craft/adopt.md`). Do not patch tokens until the observed-to-job table exists.

## Copy

The copier is optional whole-layer convenience for selected complete layers or explicit full adoption:

```sh
node scripts/copy-system.mjs --dry-run --layers tokens <styles-dir>
```

It writes layer files only: never `global.css`, the project CSS entry, or a local extraction. Insert the printed prelude and `@import`s at the top of the project CSS file.

## Work

Prefer `calc()` on an existing public token over a new name restating the relationship.

Semantic HTML and native behavior before public CRFT API. For local extraction, move only observed semantic jobs and useful relationships into the project’s owner; drop unused families, ratios, formulas, private state, and dependencies. If fluid type is unnecessary, use project-owned static semantic type tokens instead of copying `type.css`.

Attributes `c`, `s`, `t`, `g`, `x`, `y`, `o`, `l` are composition API only when their owning layer and live selector exist. `t` carries role, color, transform, weight (`lt` `rg` `bo`), and family (`sa` `se` `mo` `fb` `dp`). `l` is line clamp. `t~="lc"` is lowercase. Do not add a spacing, alignment, or display matrix.

Never put a class on `section`; section identity is `id` when it has a job. `data-skin` and `data-accent` remain canvas hooks. `.btn`, `.crd`, and `.lnk` remain project-owned. The full agent ban list lives in `CRAFT.md` Never and in the contract `bans`.

## Check

Checks are named commands: pass, fail, or not run. Repo: `node scripts/check-system.mjs`, `node --test scripts/*.test.mjs`. Consumer: `node scripts/check-project.mjs <styles-dir>` against `layers/crft-manifest.json`. Rendered and judgment gates follow `craft/verify.md`. `/crft audit` is the Full CRFT system audit row in `CRAFT.md`: `craft/verify.md` first, the other owners in route order, then every gate.

## Stop

Stop rather than inventing a product, design, taste, brand, content, or accessibility-acceptance decision. Also stop when ownership, live CSS, a hook’s complete layer, semantics, source order, keyboard, contrast, reduced motion, fallback, inventory conflict, or deletion safety cannot be established. If two heading treatments fight for one token, ask the project authority.

## Report

Outcome, layers present, owners read, public API used, residual project CSS, checks, rendered evidence, inventory gaps, limits, uncertainty.
