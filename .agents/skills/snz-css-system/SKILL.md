---
name: snz-css-system
description: Adopt, build, migrate, translate, review, or extend UI using the SNZ CSS system. Use for installing the complete CSS tree, global.css, tokens, data-skin, type roles, layout primitives, g/c/r/o grid attributes, native CSS nesting, progressive features, utilities, project-layer rules, or visual-reference translation. Do not use for unrelated frontend systems.
---

# SNZ CSS system

Use the repository handbook as the public contract and CSS as behavioral source. Do not invent API, copy values, or infer components from enhancement hooks.

## Route

Read only the handbook sections needed for the task:

- Installation or first use: `README.md#adopt` and `README.md#use`
- Existing CSS migration: `README.md#migration`
- System choice or new UI: `README.md#system-decisions`
- Ownership or cascade: `README.md#files-and-layers`
- Token or naming work: `README.md#naming` and `README.md#public-tokens`
- Private/public boundary: `README.md#internal-properties`
- Color context: `README.md#skins`
- Type hierarchy: `README.md#type`
- Containers and stacks: `README.md#layout`
- Responsive composition: `README.md#grid-grammar`
- Browser baseline or native behavior: `README.md#base-guarantees` and `README.md#browser-policy`
- Browser enhancement or motion: `README.md#features`
- Utility work: `README.md#utilities`
- Product-specific behavior: `README.md#extension`
- Required evidence: `README.md#verification`

Then inspect `global.css` and every affected CSS owner.

## Modes

Classify the task:

- **Adopt:** copy the complete system into a project where it is absent and integrate one entrypoint.
- **Build:** create UI using the current public contract.
- **Migrate:** replace existing styling while preserving behavior.
- **Translate:** map an approved visual reference into semantic system roles.
- **Extend:** change the shared CSS contract after admission criteria pass.
- **Review:** inspect source, API, behavior, or evidence without editing.

Keep evidence and gates separate when modes overlap. For adoption plus migration, adopt without removing existing CSS, integrate once, migrate, verify, then delete replaced CSS last.

## Decision path

Choose the first option that preserves the requirement:

1. Native semantic HTML and browser behavior.
2. Existing public selector or attribute.
3. Existing public token in a project rule.
4. Intentional scoped token override.
5. One direct project-layer rule.
6. Shared token, utility, selector, or grammar change only after repeated evidence.
7. Preserve an existing project-specific rule when migration would create a false abstraction.

## Adoption

Before copying, find the consumer's actual CSS entrypoint and confirm the system is not already present. If entrypoint ownership is ambiguous, stop and ask instead of adding a second import.

From the source repository run:

```sh
node scripts/copy-system.mjs [--dry-run] <target>
```

Treat `<target>` as the new isolated SNZ root. The target must not exist, and its parent must already exist and be writable. The command copies `global.css`, both fonts, and all seven `styles/*.css` owners byte-for-byte. It claims the target exclusively and does not merge, overwrite, upgrade, or edit consumer files.

After copying:

1. Import the adopted `global.css` exactly once from the actual consumer entrypoint.
2. Keep existing application CSS active during initial adoption.
3. Keep the copied system files unchanged.
4. Put product and component rules in a separate consumer-owned `@layer project`.
5. Verify the resolved import, font requests, layer order, and an existing rendered page before migrating rules.

Do not recreate the system files, paste token declarations, or infer an import path from framework conventions.

## Mapping

Map by role before appearance:

- **Color:** background, foreground, surface, border, muted, accent, status, then palette.
- **Type:** semantic hierarchy first; visual role second; matching `--t-*-mw` measure inherited automatically.
- **Rhythm:** section spacing, compact gap, internal padding, layout boundary, radius.
- **Layout:** container, stack, grid parent, direct-child span, row span, visual order.
- **Skin:** semantic context on an outer boundary; never a brand or component name.
- **Motion:** purpose, supported feature, tokenized timing, reduced path.

Keep unmatched product details in `styles/project.css` or a later consumer-owned `project` layer rather than forcing a near match.

## Grid

Use the author grammar, never its internal selector implementation:

- Page layout uses `section > .c`, with the grid inside that boundary.
- The exact `section > .c` structure establishes the fixed named inline-size query context `container`; applying containment to every `.c` breaks intrinsic header/footer uses.
- `[g]` must be a descendant because a container cannot query itself.
- Large, medium, and small resolve from the nearest `section > .c`; without one, `[g]` remains a flex column.
- Bare `g`: default columns on large and medium.
- `g/c/r="N"`: one value for large and medium.
- `g/c/r="L-M"`: separate large and medium values.
- Each `c` position accepts `0` for a full row or `1` through `12`; each `r` position accepts `1` through `4`.
- Omit `c` or `r` for its default span; do not author either attribute empty.
- `g` also has the documented auto-fit and subgrid modes.
- Small grids are flex columns.
- Always author all three positions as `o="L-M-S"` using `f`, `a`, or `l`.
- Visual order cannot replace meaningful DOM and keyboard order.

## CSS shape

- Use native nesting for local state, children, variants, feature queries, and responsive behavior.
- Keep nesting shallow and flatten when it obscures ownership.
- In new or changed CSS, use `*-block` and `*-inline` property forms only for padding and margin. Use physical properties for sizing, positioning, and edges; migrate existing declarations only when touched.
- Prefer semantic attributes and ARIA state before classes.
- Keep JavaScript out of visual state when CSS can derive it.
- Use the established short naming grammar; do not add aliases.
- Reuse the public `.f-sa`, `.f-se`, `.f-mo`, `.f-bd`, `.f-dp`, `.w-lt`, `.w-rg`, and `.w-bd` utilities before adding font-family or weight rules.
- Let each type role own `max-width` through its matching `--t-*-mw` token, default `70ch`. Do not set the property directly on headings or text-role elements; use a scoped role-token override only for a proven composition exception. Never constrain `body`.
- Use `data-accent="accent|secondary|tertiary|success|warning|danger"` to route the existing accent family without changing canvas roles or adding component styling. Use only documented semantic values; palette swatches lack verified contrast pairs.
- Use bare `.img-w[data-scrub]` for default scroll-linked image movement and `data-scrub="reverse"` only for the inverse direction. Runtime progress properties remain private.
- Never use private runtime properties in product code.
- `data-skin` is the color-context API; do not introduce `data-theme`.

## Migration

When the system is absent, complete Adoption first without deleting or disabling existing CSS.

1. Inventory reset, token, type, layout, utility, component, responsive, and state ownership.
2. Classify every affected rule as native behavior, existing public SNZ API, project-owned residual, or unproven shared-system candidate.
3. Map by semantic role, not similar names or literal values.
4. Migrate one complete user-visible slice with its markup, default presentation, responsive behavior, applicable states, accessibility, and reduced-motion path.
5. Preserve the smallest direct project-layer rule when SNZ does not own a product or component detail.
6. Search every consumer before deleting replaced selectors, variables, files, or generated CSS.

Before removing old behavior, verify:

1. Semantics and document structure.
2. Required visual result.
3. Large, medium, and small behavior.
4. Hover, focus, open, selected, disabled, error, loading, and other applicable states.
5. Keyboard, focus recovery, names, descriptions, contrast, and reduced motion.
6. Cascade layer, specificity, inheritance, and skin boundaries.
7. Unsupported-feature fallback.
8. Every consumer of removed selectors, variables, files, and generated CSS.

## Shared API admission

Admit shared API only when:

- existing public API cannot express the role;
- unrelated consumers need the same semantic operation;
- one production file clearly owns it;
- naming fits the stable grammar;
- accessibility and fallback behavior are known;
- handbook and checker can verify it.

Otherwise keep it project-owned.

## Verification

Run `node scripts/check-system.mjs`, then verify behavior at the user-visible seam affected by the task.

For public changes, require agreement across CSS, `README.md`, `AGENTS.md`, this skill, the checker, and live specimens. For grid changes, test all three container states in `section > .c.sm`, `section > .c`, `section > .c.lg`, nested `section > .c` boundaries, intrinsic header/footer `.c` uses, plus the no-container stacked fallback. For type-measure changes, test every semantic role and alias, long wrapping, scoped token overrides, and unconstrained `body`. For skins, test nested contexts and both color schemes. For features, test unsupported and reduced-motion paths.

## Report

State:

- mode used;
- adopted target and integrated entrypoint when applicable;
- exact owners inspected or changed;
- requirement-to-API mappings;
- project-specific residuals;
- checks and rendered evidence;
- assumptions and remaining risk.

A review report must state that no files changed.
