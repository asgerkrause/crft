---
title: crft adoption and extension
status: canonical
owner: adopt
read_when: Copying crft, choosing a CSS owner, branding a copy, extending project CSS, migrating existing CSS, or applying upstream changes.
---

# Adoption and extension

crft can guide a project without becoming its stylesheet. Every adopted result is project-owned. crft does not merge or automatically upgrade owned files.

## Choose a mode

| Mode | Result | crft public hooks |
| --- | --- | --- |
| Strategy only | Semantic HTML and project CSS informed by crft guidance; no crft files | None |
| Local extraction | Only useful declarations, tokens, or relationships moved into an existing project stylesheet | None |
| Tokens only | Complete tokens.css, optionally copied by the script | Only retained live hooks from tokens.css |
| Explicit full adoption | tokens.css and crft.css requested with `--layers full` | Complete documented reference API |

Choose the least complete mode for each affected subsystem. A project may combine local extraction for one subsystem with tokens-only adoption for another; extraction itself grants no crft hooks. Do not infer copying from an adoption request. Do not default to the full tree on an existing site. Projects may later remove or simplify any subsystem they own; after simplification, live CSS—not the file name—defines the retained contract.

## Extract into an existing stylesheet

Local extraction is a project refactor, not a partial crft API:

1. inventory the semantic jobs, relationships, selectors, fallbacks, and browser constraints the project actually needs;
2. move only those declarations into the project’s existing CSS owner and naming strategy;
3. keep a calculated relationship only when the project uses that relationship;
4. delete unused tokens, scale members, ratios, formulas, private state, selectors, and dependencies;
5. verify the retained semantics, accessibility primitives, unsupported-feature fallbacks, and project behavior.

Static type is supported by literal final role sizes in a complete adopted type layer. A local extraction can instead retain only the project-owned semantic jobs it needs; remove unused ratios, formulas, state, and viewport dependencies. The same deletion test applies to spacing, color, layout, grid, and motion.

Extracted crft names do not grant crft markup hooks. Keep the result clearly project-owned. If that subsystem needs a framework hook, adopt the full framework; other subsystems may remain local extractions.

## Copy tokens or the full framework

The copier is an optional whole-layer convenience. Logical layers remain intact, but the physical selections are only tokens or full:

```sh
node scripts/copy-system.mjs --dry-run --layers tokens /absolute/path/to/project/styles
node scripts/copy-system.mjs --layers tokens --fonts /absolute/path/to/project/styles
node scripts/copy-system.mjs --layers full /absolute/path/to/project/styles
```

`--layers` is required and accepts exactly `tokens` or `full`. Former selections such as `tokens,type` or `grid` fail with guidance to use local extraction or full adoption. Tokens copies `tokens.css`; full copies `tokens.css` and `crft.css`. `--fonts` retains the optional final font-face section in `tokens.css` and copies adjacent `sans.woff` and `mono.woff`. Without it, that section and the assets are omitted. No separate fonts stylesheet exists.

The copier writes `crft-manifest.json` beside those files: semantic `contractVersion: 4`, physical `packagingVersion: 1`, source revision, copied logical layers, file hashes, and a contract snapshot. It does not copy `global.css`. It never merges, overwrites, edits the project CSS entry, or creates product presentation. A conflicting destination or an existing legacy layer package aborts the copy.

Dry run prints the file list and project-entry block. Put the printed prelude and imports at the top of the project's existing entrypoint. Full adoption uses:

```css
@layer reset, base, tokens, type, layout, grid, motion, utility, project;

@import "./tokens.css";
@import "./crft.css";
```

Tokens-only adoption omits the crft.css import. Canonical `styles/global.css` stays in this repository for the reference. Consumers own their entrypoints.

## Physical and logical owners

| File | Responsibility |
| --- | --- |
| `global.css` | Cascade prelude and imports; never copied into consumers |
| `tokens.css` | Editable brand foundations, role metadata, derived recipes, schemes/themes, reduced-motion substitutions and optional font faces |
| `crft.css` | Reset, native defaults, type application, landmarks/containers/stacks, grids, motion and screen-reader recovery |

The logical order stays `reset, base, tokens, type, layout, grid, motion, utility`. Font faces use the type layer inside tokens.css. Component-local private calculations stay beside framework rules. File presence alone does not prove retained public API after project simplification.

Tokens-only adoption permits retained public tokens, data-theme and data-accent. Painting and framework selectors require crft.css or project-owned CSS. Type role classes, l clamp, containers, stacks, grids and utilities require their retained logical layers in crft.css. A local extraction grants no crft hooks.

Brand OS v2 context exports are incompatible with crft v3 and v4. Stop before applying them.
Explicit migration moves type, spacing, radius, and font foundations to `:root`.
Keep deliberate local final role and layout values on separate semantic owners; remove context recipe rebinding.
Theme selectors permit colors only, including nested selectors and conditional rules.
Both `tokens.css` and `crft.css` carry the same semantic-version marker; mixed v2/v3 or v3/v4 pairs fail verification.
External Brand OS and consumer repositories remain unchanged.
A brnd kit reaches a crft project through its `adapters/crft.css`, loaded after crft's `tokens.css`. The adapter carries no `@font-face` rules: declare the kit's local fonts in project CSS. Loading the kit's `styles/brand.css` on the same page is not supported: both systems declare `--ak-*` names.

## Packaging migration

Semantic contractVersion 3 is a breaking scope change. `packagingVersion: 1` identifies the new flat package independently. The checker still accepts previously supported legacy layer packages with semantic v1 or v2 and no packagingVersion. It rejects unknown versions, mismatched versions, missing required fields/files, and mixed flat/layer layouts. Manual complete copies remain supported without a manifest; source files determine packaging and vocabulary. A legacy manifest or layer package takes precedence over project-owned root tokens.css. A root crft.css or root adoption manifest alongside legacy layers is explicit mixed-package evidence and fails.

Migrate an old copied package in an empty target after preserving project-owned changes. Compare brand and framework changes explicitly, adjust entry imports and font URLs, then remove superseded files only after consumer search and rendered checks. Do not combine old layers with the flat package. The copier never upgrades owned files.

## Extension order

Use the first complete option:

1. Existing coherent project owner.
2. Semantic HTML and native behavior.
3. Existing public crft element, attribute, class, or token.
4. Public token in one project rule.
5. Scoped token override when the semantic job remains the same.
6. One direct project rule.
7. Small JavaScript behavior.
8. Shared crft API after unrelated consumers prove the role.

Prefer deletion, reuse, and direct CSS over wrappers, flags, helper classes, JavaScript state styling, or new dependencies.

`.btn`, `.crd`, and `.lnk` remain project conventions. Their presentation belongs in project CSS.

## Breaking replacement

crft provides no in-place compatibility upgrade from the earlier frontend package. Preserve the old project CSS and migrate one complete slice at a time. For tokens-only adoption or full adoption, copy into an empty target and do not load old and new canonical layers together. Strategy-only and local-extraction work stays in the project’s existing owners.

crft contractVersion 3 is a breaking replacement. Recorded manifests without a version are legacy v1. The checker validates the matching vocabulary, rejects unknown versions, missing fields, and old/new mixtures. No compatibility aliases ship.

The second table maps legacy v1 names to contract 3 names. A project that moves to the current contract then applies the [contract 3 to contract 4 map](#migrate-contract-3-to-contract-4).

| Legacy hook | Current action |
| --- | --- |
| t roles h0/h1/h2/h3/lg/bd/sm | .display/.h1/.h2/.h3/.lead/.body/.small |
| t roles h4/h5/h6 | Native semantics remain; visual h3 fallback; reconcile old customizations |
| t color/weight/family/transform flags | Semantic elements or bounded project CSS; no replacement modifier matrix |
| c container, c=sm/lg | .c, .c.sm, .c.lg |
| s stack and flags | .s for vertical flow; local owners for other relationships |
| x/y spans | c/r spans, validated against direct parent tracks |
| a/a-sm/a-lg | fill/fill-sm/fill-lg; intrinsic at all widths |
| paired wght rule | Ordinary font-weight; preserve supported custom axes |
| data-theme prohibition | Color-only invert/tone/accent; document CSS color-scheme chooses light/dark |

| Legacy v1 | Contract 3 | Action |
| --- | --- | --- |
| `--b-wd` | `--border-width` | Map |
| `--c-ac` | `--accent` | Map |
| `--c-ac-bc` | `--accent-border` | Map |
| `--c-ac-bg` | `--accent-surface` | Map |
| `--c-ac-co` | `--on-accent` | Map |
| `--c-ac-fg` | `--accent-text` | Map |
| `--c-bc` | `--border` | Map |
| `--c-bg` | `--canvas` | Map |
| `--c-bg-base` | `--canvas-base` | Map |
| `--c-fb-dn` | `--danger` | Map |
| `--c-fb-dn-co` | `--on-danger` | Map |
| `--c-fb-su` | `--success` | Map |
| `--c-fb-su-co` | `--on-success` | Map |
| `--c-fb-wn` | `--warning` | Map |
| `--c-fb-wn-co` | `--on-warning` | Map |
| `--c-fg` | `--text` | Map |
| `--c-fg-base` | `--text-base` | Map |
| `--c-mu` | `--muted` | Map |
| `--c-sc` | `--secondary` | Map |
| `--c-sc-bc` | `--secondary-border` | Map |
| `--c-sc-bg` | `--secondary-surface` | Map |
| `--c-sc-co` | `--on-secondary` | Map |
| `--c-sc-fg` | `--secondary-text` | Map |
| `--c-sf` | `--surface` | Map |
| `--c-sw-blu` | `--palette-blue` | Map |
| `--c-sw-cya` | none | Remove; keep a project-local `--x-*` swatch if the brand still needs it |
| `--c-sw-da` | `--palette-dark` | Map |
| `--c-sw-gre` | `--palette-green` | Map |
| `--c-sw-li` | `--palette-light` | Map |
| `--c-sw-lim` | none | Remove; keep a project-local `--x-*` swatch if the brand still needs it |
| `--c-sw-mag` | none | Remove; keep a project-local `--x-*` swatch if the brand still needs it |
| `--c-sw-ora` | `--palette-orange` | Map |
| `--c-sw-pin` | none | Remove; keep a project-local `--x-*` swatch if the brand still needs it |
| `--c-sw-pur` | `--palette-purple` | Map |
| `--c-sw-red` | `--palette-red` | Map |
| `--c-sw-sky` | none | Remove; keep a project-local `--x-*` swatch if the brand still needs it |
| `--c-sw-yel` | `--palette-yellow` | Map |
| `--c-tr` | `--tertiary` | Map |
| `--c-tr-bc` | `--tertiary-border` | Map |
| `--c-tr-bg` | `--tertiary-surface` | Map |
| `--c-tr-co` | `--on-tertiary` | Map |
| `--c-tr-fg` | `--tertiary-text` | Map |
| `--g` | `--gap` | Map |
| `--g-lg` | `--gap-lg` | Map |
| `--g-rt` | `--gap-ratio` | Map |
| `--g-sm` | `--gap-sm` | Map |
| `--g-xl` | `--gap-xl` | Map |
| `--g-xs` | `--gap-xs` | Map |
| `--l-bl-x` | `--bleed-x` | Map |
| `--l-bl-y` | `--bleed-y` | Map |
| `--l-ch` | `--control` | Map |
| `--l-cq-lg` | `--query-lg` | Map |
| `--l-cq-md` | `--query-md` | Map |
| `--l-cw` | `--content-max` | Map |
| `--l-hh` | `--header` | Map |
| `--l-vp-max` | `--fluid-max` | Convert baseline pixel magnitude to rem magnitude (divide by 16); do not fix user root size |
| `--l-vp-min` | `--fluid-min` | Convert baseline pixel magnitude to rem magnitude (divide by 16); do not fix user root size |
| `--m-lift` | `--lift` | Map |
| `--m-td` | `--duration` | Map |
| `--m-td-f` | `--duration-sm` | Map |
| `--m-td-s` | `--duration-lg` | Map |
| `--m-td-sf` | `--duration-xs` | Map |
| `--m-td-ss` | `--duration-xl` | Map |
| `--m-tf-g` | `--ease-glide` | Map |
| `--m-tf-i` | `--ease-in` | Map |
| `--m-tf-io` | `--ease-in-out` | Map |
| `--m-tf-o` | `--ease-out` | Map |
| `--m-tf-s` | `--ease-spring` | Map |
| `--m-vt-blur` | `--transition-blur` | Map |
| `--m-vt-d` | `--transition-duration` | Map |
| `--m-vt-i-x` | `--transition-in-x` | Map |
| `--m-vt-i-y` | `--transition-in-y` | Map |
| `--m-vt-o-x` | `--transition-out-x` | Map |
| `--m-vt-o-y` | `--transition-out-y` | Map |
| `--p` | `--padding` | Map |
| `--p-lg` | `--padding-lg` | Map |
| `--p-rt` | `--padding-ratio` | Map |
| `--p-sm` | `--padding-sm` | Map |
| `--p-xl` | `--padding-xl` | Map |
| `--p-xs` | `--padding-xs` | Map |
| `--r` | `--radius` | Map |
| `--r-lg` | `--radius-lg` | Map |
| `--r-rt` | `--radius-ratio` | Map |
| `--r-sm` | `--radius-sm` | Map |
| `--r-xl` | `--radius-xl` | Map |
| `--r-xs` | `--radius-xs` | Map |
| `--s` | `--space` | Map |
| `--s-lg` | `--space-lg` | Map |
| `--s-rt` | `--space-ratio` | Map |
| `--s-sm` | `--space-sm` | Map |
| `--s-xl` | `--space-xl` | Map |
| `--s-xs` | `--space-xs` | Map |
| `--t-bd-fw` | `--body-weight` | Map |
| `--t-bd-lh` | `--body-leading` | Map |
| `--t-bd-ls` | `--body-tracking` | Map |
| `--t-bd-mw` | `--body-measure` | Map |
| `--t-bd-tt` | `--body-case` | Map |
| `--t-ff-bd` | `--font` | Map |
| `--t-ff-dp` | `--font-display` | Map |
| `--t-ff-mo` | `--font-mono` | Map |
| `--t-ff-sa` | `--font-sans` | Map |
| `--t-ff-se` | `--font-serif` | Map |
| `--t-fs-max` | `--type-max` | Convert baseline pixel magnitude to rem magnitude (divide by 16); do not fix user root size |
| `--t-fs-min` | `--type-min` | Convert baseline pixel magnitude to rem magnitude (divide by 16); do not fix user root size |
| `--t-fw-bd` | `--weight-bold` | Map |
| `--t-fw-lt` | `--weight-light` | Map |
| `--t-fw-rg` | `--weight` | Map |
| `--t-h0-fw` | `--display-weight` | Map |
| `--t-h0-lh` | `--display-leading` | Map |
| `--t-h0-ls` | `--display-tracking` | Map |
| `--t-h0-mw` | `--display-measure` | Map |
| `--t-h0-tt` | `--display-case` | Map |
| `--t-h1-fw` | `--h1-weight` | Map |
| `--t-h1-lh` | `--h1-leading` | Map |
| `--t-h1-ls` | `--h1-tracking` | Map |
| `--t-h1-mw` | `--h1-measure` | Map |
| `--t-h1-tt` | `--h1-case` | Map |
| `--t-h2-fw` | `--h2-weight` | Map |
| `--t-h2-lh` | `--h2-leading` | Map |
| `--t-h2-ls` | `--h2-tracking` | Map |
| `--t-h2-mw` | `--h2-measure` | Map |
| `--t-h2-tt` | `--h2-case` | Map |
| `--t-h3-fw` | `--h3-weight` | Map |
| `--t-h3-lh` | `--h3-leading` | Map |
| `--t-h3-ls` | `--h3-tracking` | Map |
| `--t-h3-mw` | `--h3-measure` | Map |
| `--t-h3-tt` | `--h3-case` | Map |
| `--t-h4-fw` | `--h3-weight` | Remove dedicated role; reconcile existing customization with h3 or project-local role |
| `--t-h4-lh` | `--h3-leading` | Remove dedicated role; reconcile existing customization with h3 or project-local role |
| `--t-h4-ls` | `--h3-tracking` | Remove dedicated role; reconcile existing customization with h3 or project-local role |
| `--t-h4-mw` | `--h3-measure` | Remove dedicated role; reconcile existing customization with h3 or project-local role |
| `--t-h4-tt` | `--h3-case` | Remove dedicated role; reconcile existing customization with h3 or project-local role |
| `--t-h5-fw` | `--h3-weight` | Remove dedicated role; reconcile existing customization with h3 or project-local role |
| `--t-h5-lh` | `--h3-leading` | Remove dedicated role; reconcile existing customization with h3 or project-local role |
| `--t-h5-ls` | `--h3-tracking` | Remove dedicated role; reconcile existing customization with h3 or project-local role |
| `--t-h5-mw` | `--h3-measure` | Remove dedicated role; reconcile existing customization with h3 or project-local role |
| `--t-h5-tt` | `--h3-case` | Remove dedicated role; reconcile existing customization with h3 or project-local role |
| `--t-h6-fw` | `--h3-weight` | Remove dedicated role; reconcile existing customization with h3 or project-local role |
| `--t-h6-lh` | `--h3-leading` | Remove dedicated role; reconcile existing customization with h3 or project-local role |
| `--t-h6-ls` | `--h3-tracking` | Remove dedicated role; reconcile existing customization with h3 or project-local role |
| `--t-h6-mw` | `--h3-measure` | Remove dedicated role; reconcile existing customization with h3 or project-local role |
| `--t-h6-tt` | `--h3-case` | Remove dedicated role; reconcile existing customization with h3 or project-local role |
| `--t-lg-fw` | `--lead-weight` | Map |
| `--t-lg-lh` | `--lead-leading` | Map |
| `--t-lg-ls` | `--lead-tracking` | Map |
| `--t-lg-mw` | `--lead-measure` | Map |
| `--t-lg-tt` | `--lead-case` | Map |
| `--t-rt-max` | `--type-ratio-max` | Map |
| `--t-rt-min` | `--type-ratio-min` | Map |
| `--t-sm-fw` | `--small-weight` | Map |
| `--t-sm-lh` | `--small-leading` | Map |
| `--t-sm-ls` | `--small-tracking` | Map |
| `--t-sm-mw` | `--small-measure` | Map |
| `--t-sm-tt` | `--small-case` | Map |

Live values also changed. Do not copy values from this table. Read the current CSS and [`tokens.md`](tokens.md), then verify each adopted role. Search every consumer of an earlier name before removal. crft provides no aliases for the earlier contract.

## Migrate contract 3 to contract 4

crft contractVersion 4 renames every public token. Each public name now starts with `--ak-`, so a crft token cannot collide with a token from another CSS library such as Tailwind or shadcn. No compatibility aliases ship: an earlier name is not declared as a second name. Private properties keep their names.

A contract 4 adoption fails when its adopted `tokens.css` declares a contract 3 name. If that name belongs to another library (for example shadcn's `--border`), declare it in project CSS, not in the adopted `tokens.css`.

The rename follows these rules:

- Each scale (space, gap, padding, radius, duration) has an explicit `md` base step. The bare family name is no longer a token: `--gap` becomes `--ak-gap-md`.
- The multiplier between scale steps is `scale`, not `ratio`: `--gap-ratio` becomes `--ak-gap-scale`, and `--type-ratio-min` becomes `--ak-type-scale-min`.
- Role tokens use `family`, `size-min`, and `size-max`: `--ROLE-font` becomes `--ak-ROLE-family`, `--ROLE-min` becomes `--ak-ROLE-size-min`, and `--ROLE-max` becomes `--ak-ROLE-size-max`.
- Three tokens are removed: `--lift`, `--query-md`, and `--query-lg`. Replace each use with the literal in the table.
- A tenth type role, `stat`, is new. It adds the `.stat` class and the `--ak-stat-*` tokens. No earlier name maps to it.

Values, formulas, selectors, themes, contrast companions, static fallbacks, and reduced-motion behavior do not change. `@container` conditions cannot read custom properties, so the grid thresholds were always the literals `30rem` and `60rem`.

To migrate a copied project, rename every declaration and every `var()` use in the copied `tokens.css`, the copied `crft.css`, and project CSS in one change. Then set the marker in both copied files to `/* crft semantic contract: 4. */` and record `contractVersion: 4` with the new contract in `crft-manifest.json`. A mixed v3/v4 pair fails verification. The copier does not upgrade owned files; copy into an empty target to compare. The checker continues to validate a project that stays on contract 1, 2, or 3 against its recorded vocabulary.

| Contract 3 | Contract 4 | Action |
| --- | --- | --- |
| `--accent` | `--ak-accent` | Rename |
| `--accent-border` | `--ak-accent-border` | Rename |
| `--accent-surface` | `--ak-accent-surface` | Rename |
| `--accent-text` | `--ak-accent-text` | Rename |
| `--bleed-x` | `--ak-bleed-x` | Rename |
| `--bleed-y` | `--ak-bleed-y` | Rename |
| `--body-axes` | `--ak-body-axes` | Rename |
| `--body-case` | `--ak-body-case` | Rename |
| `--body-features` | `--ak-body-features` | Rename |
| `--body-font` | `--ak-body-family` | Rename |
| `--body-leading` | `--ak-body-leading` | Rename |
| `--body-max` | `--ak-body-size-max` | Rename |
| `--body-measure` | `--ak-body-measure` | Rename |
| `--body-min` | `--ak-body-size-min` | Rename |
| `--body-optical-sizing` | `--ak-body-optical-sizing` | Rename |
| `--body-size` | `--ak-body-size` | Rename |
| `--body-step` | `--ak-body-step` | Rename |
| `--body-tracking` | `--ak-body-tracking` | Rename |
| `--body-weight` | `--ak-body-weight` | Rename |
| `--border` | `--ak-border` | Rename |
| `--border-width` | `--ak-border-width` | Rename |
| `--canvas` | `--ak-canvas` | Rename |
| `--canvas-base` | `--ak-canvas-base` | Rename |
| `--caption-axes` | `--ak-caption-axes` | Rename |
| `--caption-case` | `--ak-caption-case` | Rename |
| `--caption-features` | `--ak-caption-features` | Rename |
| `--caption-font` | `--ak-caption-family` | Rename |
| `--caption-leading` | `--ak-caption-leading` | Rename |
| `--caption-max` | `--ak-caption-size-max` | Rename |
| `--caption-measure` | `--ak-caption-measure` | Rename |
| `--caption-min` | `--ak-caption-size-min` | Rename |
| `--caption-optical-sizing` | `--ak-caption-optical-sizing` | Rename |
| `--caption-size` | `--ak-caption-size` | Rename |
| `--caption-step` | `--ak-caption-step` | Rename |
| `--caption-tracking` | `--ak-caption-tracking` | Rename |
| `--caption-weight` | `--ak-caption-weight` | Rename |
| `--content-max` | `--ak-content-width` | Rename |
| `--control` | `--ak-control-height` | Rename |
| `--danger` | `--ak-danger` | Rename |
| `--display-axes` | `--ak-display-axes` | Rename |
| `--display-case` | `--ak-display-case` | Rename |
| `--display-features` | `--ak-display-features` | Rename |
| `--display-font` | `--ak-display-family` | Rename |
| `--display-leading` | `--ak-display-leading` | Rename |
| `--display-max` | `--ak-display-size-max` | Rename |
| `--display-measure` | `--ak-display-measure` | Rename |
| `--display-min` | `--ak-display-size-min` | Rename |
| `--display-optical-sizing` | `--ak-display-optical-sizing` | Rename |
| `--display-size` | `--ak-display-size` | Rename |
| `--display-step` | `--ak-display-step` | Rename |
| `--display-tracking` | `--ak-display-tracking` | Rename |
| `--display-weight` | `--ak-display-weight` | Rename |
| `--duration` | `--ak-duration-md` | Rename |
| `--duration-lg` | `--ak-duration-lg` | Rename |
| `--duration-sm` | `--ak-duration-sm` | Rename |
| `--duration-xl` | `--ak-duration-xl` | Rename |
| `--duration-xs` | `--ak-duration-xs` | Rename |
| `--ease-glide` | `--ak-ease-glide` | Rename |
| `--ease-in` | `--ak-ease-in` | Rename |
| `--ease-in-out` | `--ak-ease-in-out` | Rename |
| `--ease-out` | `--ak-ease-out` | Rename |
| `--ease-spring` | `--ak-ease-spring` | Rename |
| `--fluid-max` | `--ak-viewport-max` | Rename |
| `--fluid-min` | `--ak-viewport-min` | Rename |
| `--font` | `--ak-font-body` | Rename |
| `--font-display` | `--ak-font-display` | Rename |
| `--font-mono` | `--ak-font-mono` | Rename |
| `--font-sans` | `--ak-font-sans` | Rename |
| `--font-serif` | `--ak-font-serif` | Rename |
| `--gap` | `--ak-gap-md` | Rename |
| `--gap-lg` | `--ak-gap-lg` | Rename |
| `--gap-ratio` | `--ak-gap-scale` | Rename |
| `--gap-sm` | `--ak-gap-sm` | Rename |
| `--gap-xl` | `--ak-gap-xl` | Rename |
| `--gap-xs` | `--ak-gap-xs` | Rename |
| `--h1-axes` | `--ak-h1-axes` | Rename |
| `--h1-case` | `--ak-h1-case` | Rename |
| `--h1-features` | `--ak-h1-features` | Rename |
| `--h1-font` | `--ak-h1-family` | Rename |
| `--h1-leading` | `--ak-h1-leading` | Rename |
| `--h1-max` | `--ak-h1-size-max` | Rename |
| `--h1-measure` | `--ak-h1-measure` | Rename |
| `--h1-min` | `--ak-h1-size-min` | Rename |
| `--h1-optical-sizing` | `--ak-h1-optical-sizing` | Rename |
| `--h1-size` | `--ak-h1-size` | Rename |
| `--h1-step` | `--ak-h1-step` | Rename |
| `--h1-tracking` | `--ak-h1-tracking` | Rename |
| `--h1-weight` | `--ak-h1-weight` | Rename |
| `--h2-axes` | `--ak-h2-axes` | Rename |
| `--h2-case` | `--ak-h2-case` | Rename |
| `--h2-features` | `--ak-h2-features` | Rename |
| `--h2-font` | `--ak-h2-family` | Rename |
| `--h2-leading` | `--ak-h2-leading` | Rename |
| `--h2-max` | `--ak-h2-size-max` | Rename |
| `--h2-measure` | `--ak-h2-measure` | Rename |
| `--h2-min` | `--ak-h2-size-min` | Rename |
| `--h2-optical-sizing` | `--ak-h2-optical-sizing` | Rename |
| `--h2-size` | `--ak-h2-size` | Rename |
| `--h2-step` | `--ak-h2-step` | Rename |
| `--h2-tracking` | `--ak-h2-tracking` | Rename |
| `--h2-weight` | `--ak-h2-weight` | Rename |
| `--h3-axes` | `--ak-h3-axes` | Rename |
| `--h3-case` | `--ak-h3-case` | Rename |
| `--h3-features` | `--ak-h3-features` | Rename |
| `--h3-font` | `--ak-h3-family` | Rename |
| `--h3-leading` | `--ak-h3-leading` | Rename |
| `--h3-max` | `--ak-h3-size-max` | Rename |
| `--h3-measure` | `--ak-h3-measure` | Rename |
| `--h3-min` | `--ak-h3-size-min` | Rename |
| `--h3-optical-sizing` | `--ak-h3-optical-sizing` | Rename |
| `--h3-size` | `--ak-h3-size` | Rename |
| `--h3-step` | `--ak-h3-step` | Rename |
| `--h3-tracking` | `--ak-h3-tracking` | Rename |
| `--h3-weight` | `--ak-h3-weight` | Rename |
| `--header` | `--ak-header-height` | Rename |
| `--label-axes` | `--ak-label-axes` | Rename |
| `--label-case` | `--ak-label-case` | Rename |
| `--label-features` | `--ak-label-features` | Rename |
| `--label-font` | `--ak-label-family` | Rename |
| `--label-leading` | `--ak-label-leading` | Rename |
| `--label-max` | `--ak-label-size-max` | Rename |
| `--label-measure` | `--ak-label-measure` | Rename |
| `--label-min` | `--ak-label-size-min` | Rename |
| `--label-optical-sizing` | `--ak-label-optical-sizing` | Rename |
| `--label-size` | `--ak-label-size` | Rename |
| `--label-step` | `--ak-label-step` | Rename |
| `--label-tracking` | `--ak-label-tracking` | Rename |
| `--label-weight` | `--ak-label-weight` | Rename |
| `--lead-axes` | `--ak-lead-axes` | Rename |
| `--lead-case` | `--ak-lead-case` | Rename |
| `--lead-features` | `--ak-lead-features` | Rename |
| `--lead-font` | `--ak-lead-family` | Rename |
| `--lead-leading` | `--ak-lead-leading` | Rename |
| `--lead-max` | `--ak-lead-size-max` | Rename |
| `--lead-measure` | `--ak-lead-measure` | Rename |
| `--lead-min` | `--ak-lead-size-min` | Rename |
| `--lead-optical-sizing` | `--ak-lead-optical-sizing` | Rename |
| `--lead-size` | `--ak-lead-size` | Rename |
| `--lead-step` | `--ak-lead-step` | Rename |
| `--lead-tracking` | `--ak-lead-tracking` | Rename |
| `--lead-weight` | `--ak-lead-weight` | Rename |
| `--lift` | none | Remove; use the literal `0.75rem`. The overlay entry distance does not change |
| `--muted` | `--ak-text-muted` | Rename |
| `--on-accent` | `--ak-on-accent` | Rename |
| `--on-danger` | `--ak-on-danger` | Rename |
| `--on-secondary` | `--ak-on-secondary` | Rename |
| `--on-success` | `--ak-on-success` | Rename |
| `--on-tertiary` | `--ak-on-tertiary` | Rename |
| `--on-warning` | `--ak-on-warning` | Rename |
| `--padding` | `--ak-padding-md` | Rename |
| `--padding-lg` | `--ak-padding-lg` | Rename |
| `--padding-ratio` | `--ak-padding-scale` | Rename |
| `--padding-sm` | `--ak-padding-sm` | Rename |
| `--padding-xl` | `--ak-padding-xl` | Rename |
| `--padding-xs` | `--ak-padding-xs` | Rename |
| `--palette-blue` | `--ak-palette-blue` | Rename |
| `--palette-dark` | `--ak-palette-dark` | Rename |
| `--palette-green` | `--ak-palette-green` | Rename |
| `--palette-light` | `--ak-palette-light` | Rename |
| `--palette-orange` | `--ak-palette-orange` | Rename |
| `--palette-purple` | `--ak-palette-purple` | Rename |
| `--palette-red` | `--ak-palette-red` | Rename |
| `--palette-yellow` | `--ak-palette-yellow` | Rename |
| `--query-lg` | none | Remove; no replacement. `@container` conditions use the literal `60rem` |
| `--query-md` | none | Remove; no replacement. `@container` conditions use the literal `30rem` |
| `--radius` | `--ak-radius-md` | Rename |
| `--radius-lg` | `--ak-radius-lg` | Rename |
| `--radius-ratio` | `--ak-radius-scale` | Rename |
| `--radius-sm` | `--ak-radius-sm` | Rename |
| `--radius-xl` | `--ak-radius-xl` | Rename |
| `--radius-xs` | `--ak-radius-xs` | Rename |
| `--secondary` | `--ak-secondary` | Rename |
| `--secondary-border` | `--ak-secondary-border` | Rename |
| `--secondary-surface` | `--ak-secondary-surface` | Rename |
| `--secondary-text` | `--ak-secondary-text` | Rename |
| `--small-axes` | `--ak-small-axes` | Rename |
| `--small-case` | `--ak-small-case` | Rename |
| `--small-features` | `--ak-small-features` | Rename |
| `--small-font` | `--ak-small-family` | Rename |
| `--small-leading` | `--ak-small-leading` | Rename |
| `--small-max` | `--ak-small-size-max` | Rename |
| `--small-measure` | `--ak-small-measure` | Rename |
| `--small-min` | `--ak-small-size-min` | Rename |
| `--small-optical-sizing` | `--ak-small-optical-sizing` | Rename |
| `--small-size` | `--ak-small-size` | Rename |
| `--small-step` | `--ak-small-step` | Rename |
| `--small-tracking` | `--ak-small-tracking` | Rename |
| `--small-weight` | `--ak-small-weight` | Rename |
| `--space` | `--ak-space-md` | Rename |
| `--space-lg` | `--ak-space-lg` | Rename |
| `--space-ratio` | `--ak-space-scale` | Rename |
| `--space-sm` | `--ak-space-sm` | Rename |
| `--space-xl` | `--ak-space-xl` | Rename |
| `--space-xs` | `--ak-space-xs` | Rename |
| `--success` | `--ak-success` | Rename |
| `--surface` | `--ak-surface` | Rename |
| `--tertiary` | `--ak-tertiary` | Rename |
| `--tertiary-border` | `--ak-tertiary-border` | Rename |
| `--tertiary-surface` | `--ak-tertiary-surface` | Rename |
| `--tertiary-text` | `--ak-tertiary-text` | Rename |
| `--text` | `--ak-text` | Rename |
| `--text-base` | `--ak-text-base` | Rename |
| `--transition-blur` | `--ak-view-transition-blur` | Rename |
| `--transition-duration` | `--ak-view-transition-duration` | Rename |
| `--transition-in-x` | `--ak-view-transition-in-x` | Rename |
| `--transition-in-y` | `--ak-view-transition-in-y` | Rename |
| `--transition-out-x` | `--ak-view-transition-out-x` | Rename |
| `--transition-out-y` | `--ak-view-transition-out-y` | Rename |
| `--type-max` | `--ak-type-size-max` | Rename |
| `--type-min` | `--ak-type-size-min` | Rename |
| `--type-ratio-max` | `--ak-type-scale-max` | Rename |
| `--type-ratio-min` | `--ak-type-scale-min` | Rename |
| `--warning` | `--ak-warning` | Rename |
| `--weight` | `--ak-weight-regular` | Rename |
| `--weight-bold` | `--ak-weight-bold` | Rename |
| `--weight-light` | `--ak-weight-light` | Rename |

## Accessibility defaults update

Re-pin explicitly; copied projects do not receive these changes automatically. Public names and the contract digest are unchanged.
At a 16px root in horizontal writing, compare these previous and current defaults:

| Default | Previous | Current |
| --- | --- | --- |
| Body at 320px | 14px | 16px |
| Display at 320px | 28.16px | 39.81px |
| Display at 1440px | 96.98px | 90.50px |
| Section block padding at 390px | 192px | 64px |

The type recipe and static fallbacks changed together. Independent spacing scales did not change.
Button and field edges are darker; invalid fields retain danger color with sufficient edge contrast.
Fields use `max(1rem, 1em)`: 16px at a 16px root, retaining larger inherited text and explicit role overrides.
Disclosure focus no longer clips at `details`; animated `::details-content` retains its clip.
Text adjustment includes the WebKit prefix. Removing `overscroll-behavior: none` restores native scroll-boundary behavior, including pull-to-refresh where supported.
Compare project-owned overrides and verify their rendered states before updating the recorded revision and framework hash.

## Intentional updates

A copied project does not follow crft automatically. `crft-manifest.json` records the adopted revision and file hashes, and `node scripts/check-project.mjs <styles-dir>` verifies project CSS against the recorded contract: private-property use, single-side logical longhands, unknown or mixed-version public tokens, and missing layer dependencies. For flat packages, a recorded `files["crft.css"]` hash is checked byte-for-byte, including whitespace and comments.
Formatting copied framework CSS changes its hash. Keep project rules separate; refresh the hash only after an intentional, verified update.
Editable `tokens.css` has no integrity restriction. No manifest or no framework hash means no framework-integrity check.
Tokens-only and legacy layer packages also lack this flat-framework check; structural validation still runs.
Manual complete copies remain supported. To adopt a later upstream change:

1. compare the project copy with the intended crft revision recorded in the manifest;
2. identify project-owned brand and behavior changes;
3. apply one owner’s change at a time;
4. resolve meaning instead of replacing the file blindly;
5. run project and crft acceptance for the affected behavior;
6. record the adopted revision in the project’s normal dependency or decision record if useful.

Do not overwrite consumer-owned files with the copy script.

Container queries are required for a responsive grid. Use the literals `30rem` and `60rem` when project CSS must share a grid state. Do not put custom properties in `@container` conditions.

In the complete reference, `--ak-bleed-y` is the section-rhythm role. Project or design authority selects its value from approved direction and content evidence. A local extraction keeps that token or relationship only when the project needs the role.

Scrub, view transitions, the opt-in `.squircle` corner, and disclosure animation stay optional. The base layer no longer sets `corner-shape`. Explicit full adopters add `.squircle` per element. Strategy-only, local-extraction, and tokens-only projects have no `.squircle` hook, so they use a project rule; the former global look is `*, *::before, *::after { corner-shape: squircle; }`.

## Migrate semantic v2 explicitly

Replace old `data-skin` canvas hooks with `data-theme="invert|tone|accent"`.
Remove light/dark `data-theme` selectors and attributes; use document CSS `color-scheme` instead.
Keep `data-accent` routes unchanged. There are no automatic upgrades or compatibility aliases.
Move type, spacing, and radius foundations and recipes to `:root`; preserve local final role overrides.
Give direct `main > section` meaningful, nonempty, unique IDs. Nested IDs still need purpose.
Review old Brand OS context output before migration; the fixture adapter rejects v1, v2, and v3 inputs visibly.
Manual v3 and v4 copies retain the semantic-version marker in `tokens.css`; unmarked copies retain v2 validation.
The CSS checker rejects v2 hooks and non-root recipes in v3 and v4; it does not validate consumer markup or intent.

## Migrate existing CSS

1. Choose strategy only, local extraction, tokens-only adoption, or explicit full adoption from observed project needs.
2. Inventory the site before editing project tokens or copied `tokens.css`.
3. For a whole-layer mode, choose tokens or full explicitly, then copy without deleting or disabling existing CSS. For local extraction, edit the existing project owner instead.
4. Classify each rule as native behavior, adopted complete-layer API, project-owned CSS, or unproven shared-system candidate.
5. Migrate one complete user-visible slice, including states and responsive behavior.
6. Verify semantics, source order, keyboard behavior, contrast, motion, and large-medium-small rendering.
7. Search every consumer before deleting replaced selectors, variables, files, or generated CSS.

A direct product component rule is not a failed migration. Preserve the smallest project-owned rule when crft does not own that presentation.

### Inventory

Do not patch copied `tokens.css` or a project token owner for local extraction until this table exists. Every row needs a source. Missing evidence is `gap`, not a guessed value.

| Observed | Source | Viewport or state | crft job | Action |
| --- | --- | --- | --- | --- |
| `h1` 2.5rem / 1.1 / 500 | project CSS and computed at 1280 | large | `--ak-h1-leading`, `--ak-h1-weight`, native `h1` | map |
| `.hero h1` 56px | computed at 1280 only | large | `.display` or scoped override | scope |
| body color | computed + `body` rule | light | `--ak-text` | map |
| `.card { padding: 13px }` | one component | — | none | local |

Actions: `map` writes the selected token owner. `scope` overrides at a boundary. `local` stays as a direct project rule. `gap` has no evidence.

Collect from source CSS always: custom properties, headings, body, colors, spacing clusters, font stacks, class grammar. Collect computed styles from the running page when a URL exists, at two widths. If the site cannot be rendered, mark computed cells `gap`.

Final role sizes use --ak-ROLE-size; explicit lengths win over endpoints and step recipes. Inventory existing role customizations before collapsing h4/h5/h6 to h3. Shared-scale inputs belong at root only. Public hook presence follows live adopted CSS.

Show the table before the patch. If two heading treatments fight for one token, stop and ask.

## Common mistakes

- Treating the copier as the required adoption path.
- Copying the full tree onto an existing site without [full-adoption approval](../SKILL.md#ask).
- Preserving an unused subsystem, token family, ratio, formula, or private property only to resemble crft.
- Copying `global.css` into the project.
- Copying into a directory with conflicting destination files.
- Editing crft source when only one product needs a rule.
- Scattering base brand values through product CSS.
- Filling tokens from one computed `h1`.
- Treating the copied system as an automatically managed dependency.
- Blindly replacing a project-owned copy during an update.
- Adding another token, utility, or component dialect beside an adopted complete layer without a project need.

## Verify

For strategy-only work, confirm no crft files or hooks were introduced. For local extraction, confirm every retained declaration has an observed project job, no absent complete-layer hook is used, and unused families, formulas, private state, selectors, and dependencies are gone. For whole-layer copy, run the dry run for the requested layers, copy into a disposable target, and compare copied framework bytes and token bytes after optional font omission. Confirm `global.css` was not added, the project entry has the prelude and imports, brand values have one owner, product CSS remains project-owned, and no source file was merged or overwritten.
