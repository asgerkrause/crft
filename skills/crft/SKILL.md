---
name: crft
description: Adopt, build, review, or migrate SNZ CRFT CSS and frontend strategy. Use when the repo is CRFT, the project has CRFT token/framework CSS, the user asks to copy or adopt CRFT, or they run /crft. Not for generic HTML or CSS unless CRFT is asked.
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

Choose the least complete mode per affected subsystem: strategy only, local extraction, tokens only, or explicit full adoption. Local extraction and tokens-only adoption may coexist; extraction itself grants no CRFT hooks. If full adoption was not authorized, ask before copying framework behavior. Never default to the full tree on an existing site.

Copy selections: `tokens` | `full`. Full copies tokens.css and crft.css with all logical layers. Tokens copies only tokens.css. Fonts and their token-file declarations copy only with `--fonts`. Former layer selections fail; use local extraction for individual behavior.

## Detect

1. Read project instructions and current source.
2. Adopted layers: inspect `tokens.css` and `crft.css` (or legacy `layers/*.css`) and which public selectors, tokens, and guarantees their live contents retain. File presence alone is not API after project simplification. A missing file or live hook is not API; local extraction does not grant it.
3. Strategy-only or no-layer work uses semantic HTML and project CSS. Do not invent CRFT hooks, tokens, Tailwind, or React into an HTML-first repo.
4. Read CRAFT.md and only its routed owners.

## Load

Read at most three owners unless the routed workflow requires more. Read live CSS before changing API. Adoption requires an observed-to-job inventory first.

## Copy

The copier is optional whole-layer convenience for tokens-only adoption or explicit full adoption:

```sh
node scripts/copy-system.mjs --dry-run --layers tokens <styles-dir>
```

It writes selected CSS and root crft-manifest.json (contractVersion 2, packagingVersion 1): never `global.css`, the project CSS entry, or a local extraction. Insert the printed prelude and `@import`s at the top of the project CSS file.

## Work

Prefer `calc()` on an existing public token over a new name restating the relationship.

Semantic HTML and native behavior before public CRFT API. For local extraction, move only observed semantic jobs and useful relationships into the project’s owner; drop unused families, ratios, formulas, private state, and dependencies. If fluid type is unnecessary, use literal role sizes in an adopted complete layer or project-owned static semantic type tokens in a local extraction.

Classes display/h1/h2/h3/lead/body/small/label/caption select visual roles. Native h4–h6 keep semantics and use h3. Containers use .c (optional sm/lg), vertical stacks .s, grids g/c/r/o, and l clamps lines. Hooks exist only with retained owning layers. Do not add a spacing, alignment, or display matrix.

Use ordinary font-weight and preserve supported custom axes; canonical axes exclude wght. Shared recipes rebind at :root and data-theme. Local final-role sizes/metadata may override; arbitrary nested foundation overrides are unsupported. Static role sizes are literal lengths. Read approved brand inputs before choosing recipes; missing client schemes and format mappings fail visibly.

Never put a class on `section`; section identity is `id` when it has a job. `data-skin` and `data-accent` remain canvas hooks. `.btn`, `.crd`, and `.lnk` remain project-owned. The full agent ban list lives in `CRAFT.md` Never and in the contract `bans`.

## Check

Checks are named commands: pass, fail, or not run. Repo: `node scripts/check-system.mjs`, `node --test scripts/*.test.mjs`. Consumer: `node scripts/check-project.mjs <styles-dir>` against `crft-manifest.json`. Rendered and judgment gates follow `craft/verify.md`. `/crft audit` is the Full CRFT system audit row in `CRAFT.md`: `craft/verify.md` first, the other owners in route order, then every gate.

## Stop

Do not invent product, design, brand, content, or accessibility acceptance. Also stop when ownership, live CSS, a hook’s complete layer, semantics, source order, keyboard, contrast, reduced motion, fallback, inventory conflict, or deletion safety cannot be established. If two heading treatments fight for one token, ask the project authority.

## Report

Outcome, layers present, owners read, public API used, residual project CSS, checks, rendered evidence, inventory gaps, limits, uncertainty.
