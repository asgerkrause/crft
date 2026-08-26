---
title: CRFT adoption and extension
status: canonical
owner: adopt
read_when: Copying CRFT, choosing a CSS owner, branding a copy, extending project CSS, migrating existing CSS, or applying upstream changes.
---

# Adoption and extension

CRFT can guide a project without becoming its stylesheet. Every adopted result is project-owned. CRFT does not merge or automatically upgrade owned files.

## Choose a mode

| Mode | Result | CRFT public hooks |
| --- | --- | --- |
| Strategy only | Semantic HTML and project CSS informed by CRFT guidance; no CRFT files | None |
| Local extraction | Only useful declarations, tokens, or relationships moved into an existing project stylesheet | None |
| Selected complete layers | Explicit layer files and their declared dependencies, optionally copied by the script | Only retained live hooks from copied layers |
| Explicit full adoption | Every behavior layer requested with `--layers full` | Complete documented reference API |

Choose the least complete mode for each affected subsystem. A project may combine local extraction for one subsystem with selected complete layers for another; extraction itself grants no CRFT hooks. Do not infer copying from an adoption request. Do not default to the full tree on an existing site. Projects may later remove or simplify any subsystem they own; after simplification, live CSS—not the file name—defines the retained contract.

## Extract into an existing stylesheet

Local extraction is a project refactor, not a partial CRFT API:

1. inventory the semantic jobs, relationships, selectors, fallbacks, and browser constraints the project actually needs;
2. move only those declarations into the project’s existing CSS owner and naming strategy;
3. keep a calculated relationship only when the project uses that relationship;
4. delete unused tokens, scale members, ratios, formulas, private state, selectors, and dependencies;
5. verify the retained semantics, accessibility primitives, unsupported-feature fallbacks, and project behavior.

If a project needs static type, define only its project-owned semantic type sizes and roles. Do not preserve `--t-fs-min`, `--t-fs-max`, `--t-rt-min`, `--t-rt-max`, `--t-st`, `--t-fs-lo`, `--t-fs-hi`, `--t-fs-sl`, or viewport dependencies solely to resemble the reference fluid scale. Apply the same deletion test to spacing, gap, padding, radius, color, layout, grid, and motion families.

Extracted CRFT names do not grant CRFT markup hooks. Keep the result clearly project-owned. If that subsystem needs a CRFT hook, adopt the complete layer that owns it; other subsystems may remain local extractions.

## Copy complete layers

The copier is an optional whole-layer convenience for selected complete layers or explicit full adoption. Ask which layers to copy only after the project chooses one of those modes.

```sh
node scripts/copy-system.mjs --dry-run --layers tokens /absolute/path/to/project/styles
node scripts/copy-system.mjs --layers tokens,type --fonts /absolute/path/to/project/styles
node scripts/copy-system.mjs --layers full /absolute/path/to/project/styles
```

`--layers` is required. Names are `tokens`, `type`, `layout`, `grid`, `base`, `motion`, `utility`, or `full`. Dependencies are not filled in. `type`, `layout`, and `base` need `tokens`. `grid` and `motion` need `tokens` and `layout`. `--fonts` copies `layers/fonts.css` plus `sans.woff` and `mono.woff`.

The copier writes requested files under the target `layers/` directory plus one adoption record, `layers/crft-manifest.json`: the source revision, copied layers, file hashes, and a contract snapshot of public tokens, private properties, skins, accents, and layer dependencies. It does not copy `global.css`. It never merges, overwrites, edits the project CSS file, copies skills, or creates project presentation. Any listed destination that already exists, including an existing manifest, aborts the whole publish.

A real copy also writes `layers/crft-manifest.json`: the source revision, copied layers, file hashes, and a contract snapshot of public tokens, private properties, skins, accents, and layer dependencies. The manifest is the adoption record. `node scripts/check-project.mjs <styles-dir>` reads it and checks project CSS for private-property use, banned single-side logical longhands, unknown CRFT-family tokens, and missing layer dependencies.

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
| `base.css` | `@layer reset` then `@layer base`: reset strips the user agent without tokens; base supplies native defaults, focus, active colors, disclosure animation, and squircle corners |
| `tokens.css` | Public tokens, semantic colors, skins, scales, and reduced motion |
| `fonts.css` | Optional SNZ `@font-face` rules in `@layer type` |
| `type.css` | Type roles, `t` flags, and `l` |
| `layout.css` | Page spacing, `c` measure, `s` stacks, and `.img-w` |
| `grid.css` | Attribute grid grammar |
| `motion.css` | Image scrub and view transitions |
| `utility.css` | Finite public utilities |

A copied layer permits only the hooks retained in its live project-owned contents; the file name alone is not proof after simplification. Tokens-only may use retained public tokens, `data-skin`, and `data-accent`. Do not use `t` or `l` without their live `type.css` selectors. Do not use `g` without the live layout boundary and grid selectors.

A token subset placed in an existing stylesheet is a local extraction. Keep only semantic jobs and relationships the project uses; do not call it a copied CRFT layer or use CRFT markup hooks on that basis.

Do not add a spacing, alignment, border, or wrap utility matrix. Attributes are the finite composition API. Classes are the override and use-case layer. Unrelated markup that needs a stable operation still has to pass the admission tests in [`utilities.md`](utilities.md).

Put a shared rule in the first owner that fully explains it. Brand values belong in a copied complete `tokens.css` or the project’s existing token owner for local extraction. Edit another copied owner only when the project intentionally changes that system behavior.

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

CRFT provides no in-place compatibility upgrade from the earlier frontend package. Preserve the old project CSS and migrate one complete slice at a time. For selected complete layers or full adoption, copy into an empty target and do not load old and new canonical layers together. Strategy-only and local-extraction work stays in the project’s existing owners.

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
| `--t-h0-fs`–`--t-sm-fs` | No required CRFT replacement; adopt the complete fluid `type` layer only when that strategy fits, otherwise use project-owned static semantic type tokens |
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

A copied project does not follow CRFT automatically. `layers/crft-manifest.json` records the adopted revision and file hashes, and `node scripts/check-project.mjs <styles-dir>` verifies project CSS against the recorded contract: private-property use, single-side logical longhands, unknown CRFT-family tokens, and missing layer dependencies. To adopt a later upstream change:

1. compare the project copy with the intended CRFT revision recorded in the manifest;
2. identify project-owned brand and behavior changes;
3. apply one owner’s change at a time;
4. resolve meaning instead of replacing the file blindly;
5. run project and CRFT acceptance for the affected behavior;
6. record the adopted revision in the project’s normal dependency or decision record if useful.

Do not overwrite consumer-owned files with the copy script.

Container queries are required for a responsive grid. Match `--l-cq-md` and `--l-cq-lg` when project CSS must share a grid state. Do not put custom properties in `@container` conditions.

In the complete reference, `--l-bl-y` is the section-rhythm role. Project or design authority selects its value from approved direction and content evidence. A local extraction keeps that token or relationship only when the project needs the role.

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

1. Choose strategy only, local extraction, selected complete layers, or explicit full adoption from observed project needs.
2. Inventory the site before editing project tokens or copied `tokens.css`.
3. For a whole-layer mode, name every layer and dependency explicitly, then copy without deleting or disabling existing CSS. For local extraction, edit the existing project owner instead.
4. Classify each rule as native behavior, adopted complete-layer API, project-owned CSS, or unproven shared-system candidate.
5. Migrate one complete user-visible slice, including states and responsive behavior.
6. Verify semantics, source order, keyboard behavior, contrast, motion, and large-medium-small rendering.
7. Search every consumer before deleting replaced selectors, variables, files, or generated CSS.

A direct product component rule is not a failed migration. Preserve the smallest project-owned rule when CRFT does not own that presentation.

### Inventory

Do not patch copied `tokens.css` or a project token owner for local extraction until this table exists. Every row needs a source. Missing evidence is `gap`, not a guessed value.

| Observed | Source | Viewport or state | CRFT job | Action |
| --- | --- | --- | --- | --- |
| `h1` 2.5rem / 1.1 / 500 | project CSS and computed at 1280 | large | `--t-h1-lh`, `--t-h1-fw`, native `h1` | map |
| `.hero h1` 56px | computed at 1280 only | large | `h0` or scoped override | scope |
| body color | computed + `body` rule | light | `--c-fg` | map |
| `.card { padding: 13px }` | one component | — | none | local |

Actions: `map` writes the selected token owner. `scope` overrides at a boundary. `local` stays as a direct project rule. `gap` has no evidence.

Collect from source CSS always: custom properties, headings, body, colors, spacing clusters, font stacks, class grammar. Collect computed styles from the running page when a URL exists, at two widths. If the site cannot be rendered, mark computed cells `gap`.

In the complete reference `type` layer, there is no `--t-h1-fs`; heading size uses `--t-fs-min`, `--t-fs-max`, `--t-rt-min`, and `--t-rt-max`. Do not reverse-engineer `--t-st`; it is private. A local static extraction should instead define only project-owned semantic type sizes and omit the fluid foundations and private state. Weight flags on the complete `t` API are `lt`, `rg`, and `bo` only. Bold is `bo`, not `bd`.

Show the table before the patch. If two heading treatments fight for one token, stop and ask.

## Common mistakes

- Treating the copier as the required adoption path.
- Copying the full tree onto an existing site without asking.
- Preserving an unused subsystem, token family, ratio, formula, or private property only to resemble CRFT.
- Copying `global.css` into the project.
- Copying into a directory with conflicting destination files.
- Editing CRFT source when only one product needs a rule.
- Scattering base brand values through product CSS.
- Filling tokens from one computed `h1`.
- Treating the copied system as an automatically managed dependency.
- Blindly replacing a project-owned copy during an update.
- Adding another token, utility, or component dialect beside an adopted complete layer without a project need.

## Verify

For strategy-only work, confirm no CRFT files or hooks were introduced. For local extraction, confirm every retained declaration has an observed project job, no absent complete-layer hook is used, and unused families, formulas, private state, selectors, and dependencies are gone. For whole-layer copy, run the dry run for the requested layers, copy into a disposable target, and compare those files byte-for-byte. Confirm `global.css` was not added, the project entry has the prelude and imports, brand values have one owner, product CSS remains project-owned, and no source file was merged or overwritten.
