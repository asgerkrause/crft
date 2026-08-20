---
title: CRFT adoption and extension
status: canonical
owner: adopt
read_when: Copying CRFT, choosing a CSS owner, branding a copy, extending project CSS, migrating existing CSS, or applying upstream changes.
---

# Adoption and extension

CRFT CSS is dependency-free copied source. The receiving project owns its copy. CRFT does not merge or automatically upgrade owned files.

## Copy

Ask which layers to copy. Do not default to the full tree on an existing site.

```sh
node scripts/copy-system.mjs --dry-run --layers tokens /absolute/path/to/project/styles
node scripts/copy-system.mjs --layers tokens,type --fonts /absolute/path/to/project/styles
node scripts/copy-system.mjs --layers full /absolute/path/to/project/styles
```

`--layers` is required. Names are `tokens`, `type`, `layout`, `grid`, `base`, `motion`, `utility`, or `full`. Dependencies are not filled in. `type`, `layout`, and `base` need `tokens`. `grid` and `motion` need `tokens` and `layout`. `--fonts` copies `layers/fonts.css` plus `sans.woff` and `mono.woff`.

The copier writes requested files under the target `layers/` directory. It does not copy `global.css`. It never merges, overwrites, edits the project CSS file, copies skills, or creates project presentation. Any listed destination that already exists aborts the whole publish.

Dry run prints the file list and the project-entry block. Put that prelude and those `@import`s at the top of the project’s real CSS file:

```css
@layer reset, base, tokens, type, layout, grid, motion, utility, project;

@import "./layers/tokens.css";
```

Canonical `styles/global.css` stays in the CRFT repository for the reference. Consumers do not copy it.

## Layer owners

Canonical `styles/global.css` declares this order:

```css
@layer reset, base, tokens, type, layout, grid, motion, utility;
```

| Owner | Responsibility |
| --- | --- |
| `base.css` | `@layer reset` then `@layer base`: neutralize the user agent, then native defaults, focus, active colors, disclosure animation, and squircle corners |
| `tokens.css` | Public tokens, semantic colors, skins, scales, and reduced motion |
| `fonts.css` | Optional SNZ `@font-face` rules in `@layer type` |
| `type.css` | Type roles, `t` flags, and `l` |
| `layout.css` | Page spacing, `c` measure, `s` stacks, and `.img-w` |
| `grid.css` | Attribute grid grammar |
| `motion.css` | Image scrub and view transitions |
| `utility.css` | Finite public utilities |

A copied layer is the only permission to use its hooks. Tokens-only may use `var(--*)`, `data-skin`, and `data-accent`. Do not use `t` or `l` without `type.css`. Do not use `g` without `layout.css` and `grid.css`.

A hand-copied `tokens.css` used as a brand sheet is a local extract. Do not call it CRFT and do not use CRFT markup hooks.

Do not add a spacing, alignment, border, or wrap utility matrix. Attributes are the finite composition API. Classes are the override and use-case layer. Unrelated markup that needs a stable operation still has to pass the admission tests in [`utilities.md`](utilities.md).

Put a shared rule in the first owner that fully explains it. Brand values belong in copied `tokens.css`. Edit another copied owner only when the project intentionally changes that system behavior.

Keep product presentation in the project’s normal CSS owner and layer structure. CRFT does not require `project.css`, a branded directory, or a special component registry.

## Extension order

Use the first complete option:

1. Existing coherent project owner.
2. Semantic HTML and native behavior.
3. Existing public CRFT element, attribute, class, or token.
4. Public token in one project rule.
5. Scoped token override when the semantic job remains the same.
6. One direct project rule.
7. Small JavaScript behavior.
8. Shared CRFT API after unrelated consumers prove the role.

Prefer deletion, reuse, and direct CSS over wrappers, flags, helper classes, JavaScript state styling, or new dependencies.

`.btn`, `.crd`, and `.lnk` remain project conventions. Their presentation belongs in project CSS.

## Breaking replacement

CRFT does not support an in-place upgrade from the earlier frontend package. Preserve the old project CSS, copy CRFT into an empty target, and migrate one complete slice at a time. Do not load the old and new canonical layers together.

| Earlier contract | CRFT contract or action |
| --- | --- |
| Repository entrypoint `global.css` | Canonical source `styles/global.css`; do not copy it. Print the prelude into the project CSS entry |
| Flat `styles/{base,tokens,type,layout,features,utility}.css` | `styles/layers/{base,tokens,type,layout,grid,motion,utility}.css`; `reset` lives in `base.css` |
| `styles/layers/features.css` | Native disclosure and corners in `base.css`; scrub and view transitions in `motion.css` |
| Grid rules in `layout.css` | `styles/layers/grid.css` |
| `styles/project.css` | The receiving project’s existing CSS owner |
| `.hd`, `.h0`–`.h6`, and `.t-lg`/`.t-bd`/`.t-sm` | `t="h0"`–`t="h6"` and `t="lg"`/`t="bd"`/`t="sm"`; native headings need no attribute |
| `.c`, `.c.sm`, `.c.lg` | `c`, `c="sm"`, `c="lg"` |
| `.s` plus modifier classes | `s` plus space-separated flags `h`, `w`, `ct`, `sb` |
| Grid span `[c]` / `[r]` | `[x]` / `[y]` |
| `.c-fg` `.c-mu` `.c-ac` `.c-sc` | `t` color flags `fg` `mu` `ac` `sc` |
| `.tt-uc` `.tt-lc` `.tt-cp` `.tt-no` | `t` transform flags `uc` `lc` `cp` `no` |
| `.f-*` | `t` family flags `sa`, `se`, `mo`, `fb`, `dp` |
| `.w-*` | `t` weight flags `lt`, `rg`, `bo`. Bold is `bo`, not `bd`. |
| `data-clamp` | `l`; empty `l` is three lines |
| `--t-h0-fs`–`--t-sm-fs` | No direct replacement; use the native or explicit `t` role and fluid type foundations |
| `--f-*` font families | `--t-ff-*` |
| `--w-*` font weights | `--t-fw-*` |
| `--h-h` | `--l-hh` |
| `--l-cw-sm`, `--l-cw-lg` | No direct replacement; `c="sm"` and `c="lg"` derive from `--l-cw` |
| `--l-bl-h`, `--l-bl-v` | `--l-bl-x`, `--l-bl-y` |
| `--s-ba`, `--g-ba`, `--p-ba`, `--r-ba` | `--s`, `--g`, `--p`, `--r` |
| `--s-sc`, `--g-sc`, `--p-sc`, `--r-sc` | `--s-rt`, `--g-rt`, `--p-rt`, `--r-rt` |
| `--t-ba`, `--t-sc`, `--t`, `--t-rt` | `--t-fs-min`, `--t-fs-max`, `--t-rt-min`, and `--t-rt-max` |
| `--c-su`, `--c-wn`, `--c-dn` | `--c-fb-su`, `--c-fb-wn`, `--c-fb-dn` |
| `--c-su-fg`, `--c-wn-fg`, `--c-dn-fg` | `--c-fb-su-co`, `--c-fb-wn-co`, `--c-fb-dn-co` |
| `data-skin="secondary"` or `data-skin="tertiary"` | `data-skin="accent"` plus the matching `data-accent` value |
| Consumer analyzer, automatic audit, and migration-plan CLI | No CRFT replacement. Inventory consumers, compare revisions, migrate explicitly, and run project acceptance. |

Live values also changed. Do not copy values from this table. Read the current CSS and [`tokens.md`](tokens.md), then verify each adopted role. Search every consumer of an earlier name before removal. CRFT provides no aliases for the earlier contract.

## Intentional updates

A copied project does not follow CRFT automatically. To adopt a later upstream change:

1. compare the project copy with the intended CRFT revision;
2. identify project-owned brand and behavior changes;
3. apply one owner’s change at a time;
4. resolve meaning instead of replacing the file blindly;
5. run project and CRFT acceptance for the affected behavior;
6. record the adopted revision in the project’s normal dependency or decision record if useful.

Do not overwrite consumer-owned files with the copy script.

Container queries are required for a responsive grid. Match `--l-cq-md` and `--l-cq-lg` when project CSS must share a grid state. Do not put custom properties in `@container` conditions.

`--l-bl-y` is the section rhythm. Keep the copied editorial interval for marketing pages. Set a tighter value in the copied `tokens.css` for a product interface. That is a brand override, not a new hook.

Scrub, view transitions, squircle corners, and disclosure animation stay optional.

When adopting the routed accent-canvas contract, replace removed color-specific skins explicitly:

```html
<!-- Before -->
<section data-skin="secondary">…</section>

<!-- After -->
<section data-skin="accent" data-accent="secondary">…</section>
```

Use the same replacement for `tertiary`. The new boundary routes both the canvas treatment and active descendant accent roles; verify that behavior before adoption.

## Migrate existing CSS

1. Ask which layers to copy. Copy those files without deleting or disabling existing CSS.
2. Inventory the site before writing `tokens.css`.
3. Classify each rule as native behavior, existing public CRFT API, project-owned CSS, or unproven shared-system candidate.
4. Migrate one complete user-visible slice, including states and responsive behavior.
5. Verify semantics, source order, keyboard behavior, contrast, motion, and large-medium-small rendering.
6. Search every consumer before deleting replaced selectors, variables, files, or generated CSS.

A direct product component rule is not a failed migration. Preserve the smallest project-owned rule when CRFT does not own that presentation.

### Inventory

Do not patch copied `tokens.css` until this table exists. Every row needs a source. Missing evidence is `gap`, not a guessed value.

| Observed | Source | Viewport or state | CRFT job | Action |
| --- | --- | --- | --- | --- |
| `h1` 2.5rem / 1.1 / 500 | project CSS and computed at 1280 | large | `--t-h1-lh`, `--t-h1-fw`, native `h1` | map |
| `.hero h1` 56px | computed at 1280 only | large | `h0` or scoped override | scope |
| body color | computed + `body` rule | light | `--c-fg` | map |
| `.card { padding: 13px }` | one component | — | none | local |

Actions: `map` writes the copied token. `scope` overrides at a boundary. `local` stays in project CSS. `gap` has no evidence.

Collect from source CSS always: custom properties, headings, body, colors, spacing clusters, font stacks, class grammar. Collect computed styles from the running page when a URL exists, at two widths. If the site cannot be rendered, mark computed cells `gap`.

There is no `--t-h1-fs`. Heading size is `--t-fs-min`, `--t-fs-max`, `--t-rt-min`, and `--t-rt-max`. Do not reverse-engineer `--t-st`. That property is private. Weight flags on `t` are `lt`, `rg`, and `bo` only. Bold is `bo`, not `bd`.

Show the table before the patch. If two heading treatments fight for one token, stop and ask.

## Common mistakes

- Copying the full tree onto an existing site without asking.
- Copying `global.css` into the project.
- Copying into a directory with conflicting destination files.
- Editing CRFT source when only one product needs a rule.
- Scattering base brand values through product CSS.
- Filling tokens from one computed `h1`.
- Treating the copied system as an automatically managed dependency.
- Blindly replacing a project-owned copy during an update.
- Adding another token, utility, or component dialect beside CRFT.

## Verify

Run the dry run for the requested layers. Copy into a disposable target and compare those files byte-for-byte. Confirm `global.css` was not added, the project entry has the prelude and imports, brand values have one owner, product CSS remains project-owned, and no source file was merged or overwritten.
