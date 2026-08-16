---
title: CRFT adoption and extension
status: canonical
owner: adopt
read_when: Copying CRFT, choosing a CSS owner, branding a copy, extending project CSS, migrating existing CSS, or applying upstream changes.
---

# Adoption and extension

CRFT CSS is dependency-free copied source. The receiving project owns its copy. CRFT does not merge or automatically upgrade owned files.

## Copy

Run a dry run before the copy:

```sh
node scripts/copy-system.mjs --dry-run /absolute/path/to/project/styles
node scripts/copy-system.mjs /absolute/path/to/project/styles
```

The copier validates the complete source and destination before publishing nine files:

```text
styles/
  global.css
  sans.ttf
  mono.ttf
  layers/
    base.css
    tokens.css
    type.css
    layout.css
    features.css
    utility.css
```

An existing target directory is allowed only when all nine destinations are absent. Any conflict aborts before the intended copy. The copier never merges, overwrites, injects an import, copies skills, or creates project presentation.

Load `styles/global.css` once from the project’s existing CSS entrypoint.

## Layer owners

`styles/global.css` declares this order:

```css
@layer base, tokens, type, layout, features, utility;
```

| Owner | Responsibility |
| --- | --- |
| `base.css` | Reset, document settings, native defaults, focus, and active colors |
| `tokens.css` | Public tokens, semantic colors, skins, scales, and reduced motion |
| `type.css` | Bundled fonts and type roles |
| `layout.css` | Page spacing, containers, stacks, and grid grammar |
| `features.css` | Progressive disclosure, native corners, and image scrub |
| `utility.css` | Finite public utilities |

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
| Repository entrypoint `global.css` | Canonical source `styles/global.css`; copy it through the copier |
| Flat `styles/{base,tokens,type,layout,features,utility}.css` | `styles/layers/{base,tokens,type,layout,features,utility}.css` |
| `styles/project.css` | The receiving project’s existing CSS owner |
| `.hd` and `--t-hd-*` | `.h0` and `--t-h0-*` |
| `--f-*` font families | `--t-ff-*` |
| `--w-*` font weights | `--t-fw-*` |
| `--h-h` | `--l-hh` |
| `--l-bl-h`, `--l-bl-v` | `--l-bl-x`, `--l-bl-y` |
| `--s-ba`, `--g-ba`, `--p-ba`, `--r-ba`, `--t-ba` | `--s`, `--g`, `--p`, `--r`, `--t` |
| `--s-sc`, `--g-sc`, `--p-sc`, `--r-sc`, `--t-sc` | `--s-rt`, `--g-rt`, `--p-rt`, `--r-rt`, `--t-rt` |
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

When adopting the routed accent-canvas contract, replace removed color-specific skins explicitly:

```html
<!-- Before -->
<section data-skin="secondary">…</section>

<!-- After -->
<section data-skin="accent" data-accent="secondary">…</section>
```

Use the same replacement for `tertiary`. The new boundary routes both the canvas treatment and active descendant accent roles; verify that behavior before adoption.

## Migrate existing CSS

1. Copy CRFT without deleting or disabling existing CSS.
2. Inventory reset, tokens, type, layout, utilities, components, responsive rules, and state.
3. Classify each rule as native behavior, existing public CRFT API, project-owned CSS, or unproven shared-system candidate.
4. Migrate one complete user-visible slice, including states and responsive behavior.
5. Verify semantics, source order, keyboard behavior, contrast, motion, and large-medium-small rendering.
6. Search every consumer before deleting replaced selectors, variables, files, or generated CSS.

A direct product component rule is not a failed migration. Preserve the smallest project-owned rule when CRFT does not own that presentation.

## Common mistakes

- Copying into a directory with conflicting destination files.
- Editing CRFT source when only one product needs a rule.
- Scattering base brand values through product CSS.
- Treating the copied system as an automatically managed dependency.
- Blindly replacing a project-owned copy during an update.
- Adding another token, utility, or component dialect beside CRFT.

## Verify

Run the dry run, copy into a disposable target, and compare all nine files byte-for-byte. Confirm the project imports `global.css` once, CSS layer order remains intact, brand values have one owner, product CSS remains project-owned, and no source file was merged or overwritten.
