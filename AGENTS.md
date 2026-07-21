# Agent contract

## Scope

This repository is the complete seess CSS system. It provides tokens, type roles, layout primitives, responsive grid attributes, semantic skins, native defaults, progressive features, and a finite utility surface. It is not a component library.

`README.md` is the canonical system handbook. CSS is the sole source of values, formulas, breakpoints, selectors, skin mappings, and reduced-motion behavior. Documentation explains that source without replacing it.

## Entrypoint and ownership

Import `global.css` once. It declares this order:

```css
@layer base, tokens, type, layout, features, utility, project;
```

Ownership is one-to-one:

- `styles/base.css`: reset, document settings, native defaults, focus, and active document colors.
- `styles/tokens.css`: public values, formulas, semantic colors, skins, responsive scales, and reduced-motion policy.
- `styles/type.css`: bundled `sans.ttf` and `mono.ttf` `@font-face` registrations, then text, display, and heading roles. Registered `font-weight` drives variable `wght`; do not add `font-variation-settings`.
- `styles/layout.css`: structural spacing, the named `section > .c` query boundary, stacks, and `g/c/r/o` grid behavior.
- `styles/features.css`: optional disclosure, corner-shape, and scroll-motion behavior.
- `styles/utility.css`: finite public utilities.
- `styles/project.css`: product or site extensions in this canonical repository only; adopted copies remain unchanged.

Put a rule in the first file whose job fully explains it. Do not bypass `global.css`, create a second owner, or move a product component into the shared system.

## Public and private API

Public API consists only of:

1. The token names cataloged in `README.md`.
2. Documented type, layout, utility, and enhancement selectors.
3. `data-skin`, `data-accent`, `.img-w[data-scrub]`, `.img-w[data-scrub="reverse"]`, `g`, `c`, `r`, and `o`.
4. The named inline-size query context `container` established by `section > .c`.
5. Native element behavior guaranteed by `styles/base.css`.

These properties are private implementation state:

- `--l-gc`
- `--l-cs`
- `--l-rs`
- `--or`
- `--m-src-to`
- `--m-src-fr`
- `--m-plx`

Never use private properties in product CSS or public examples. The private reference shell may consume `--m-src-to` once in `reference/src/styles/reference.css` for its section scrub indicator; this exception does not create consumer API. `.btn` and `.card` are corner-shape enhancement targets, not implemented components.

## Implementation doctrine

Use this order:

1. Native semantic HTML and browser behavior.
2. Existing public element, attribute, class, or token.
3. Public token in one project-owned rule.
4. Intentional scoped token override.
5. One direct rule in the project layer.
6. Shared API addition only after repeated use proves a missing role.

Prefer deletion, reuse, and direct CSS over wrappers, flags, helper classes, JavaScript state styling, or new dependencies.

### Selectors and nesting

- Prefer elements, semantic attributes, ARIA state, `:has()`, and local structure before classes.
- Use native CSS nesting to keep state, variants, children, feature queries, and responsive rules with their owner.
- For local display hooks, compose a base class with a nested qualifier; do not use BEM `__` or `--` names.
- Keep nesting shallow; normally no more than three levels.
- Flatten when nesting mirrors the full DOM or obscures the public hook.
- Keep specificity flat. Avoid IDs and `!important` except the intentional hidden-state guarantee.
- In new or changed CSS, reserve `*-block` and `*-inline` property forms for padding and margin. Use `width`, `height`, `min-*`, `max-*`, `top`, `right`, `bottom`, `left`, and physical border properties for sizing, positioning, and edges. Existing declarations migrate only when touched.
- Type roles own their readable measure through `--t-*-mw`, all defaulting to `70ch`. Do not set `max-width` directly on headings or text-role elements. A proven exception overrides the matching token at the narrowest semantic boundary; `body` remains unconstrained.

### Naming

Use the established short grammar. A short name is acceptable only when it is repeated, searchable, and has one stable meaning. Do not add synonyms or unexplained abbreviations.

Use `data-skin` for semantic color context. `data-theme` is not part of this system.

### Grid

Reason only in large, medium, and small states resolved from the nearest ancestor `section > .c` inline size:

- Page layout uses `section > .c`, with grids and other composition inside that boundary.
- The exact `section > .c` structure establishes the fixed public query name `container`; applying containment to every `.c` breaks intrinsic header/footer uses.
- A responsive `[g]` must be a descendant of the boundary, not the same element.
- A grid without an ancestor `section > .c` remains in the small flex-column fallback.
- `g` accepts an empty value, one number, or `large-medium` numbers.
- `c` and `r` accept one number or `large-medium` numbers; omit the attribute for its default span.
- Each `c` position accepts `0` for a full row or `1` through `12`; each `r` position accepts `1` through `4`.
- One number applies on large and medium.
- Every grid becomes a flex column on small.
- Always author `o="L-M-S"` with all three large-medium-small positions using `f`, `a`, or `l`.
- Order changes presentation only; DOM and keyboard order must remain meaningful.
- Internal attribute-selector operators are implementation details and must not appear in public usage guidance.

### Tokens and utilities

A public token must represent a reusable system role, preserve semantic indirection, follow the existing grammar, and remain compatible with its complete family.

A utility is admitted only when unrelated markup needs the same stable operation, existing API cannot express it, `styles/utility.css` clearly owns it, and accessibility can be verified.

Use `data-accent` to route accent roles without painting a boundary or supplying component styling. Supported explicit routes: `secondary`, `tertiary`, `success`, `warning`, and `danger`; omit `data-accent` for the default accent. Palette swatches are not supported values because they lack verified contrast pairs.

One-off values, component details, arbitrary responsive variants, and aliases remain project-owned. The public font-family utilities are `.f-sa`, `.f-se`, `.f-mo`, `.f-bd`, and `.f-dp`; weights use `.w-lt`, `.w-rg`, and `.w-bd`.

## Accessibility and progressive behavior

Preserve:

- semantic elements and native controls;
- visible `:focus-visible` treatment;
- labels, names, descriptions, and meaningful source order;
- `.sr` and keyboard-restorable `.sr.focusable` behavior;
- disabled, hidden, dialog, target, placeholder, and selection behavior;
- readable text wrapping and sufficient contrast;
- reduced-motion policy;
- useful fallback when subgrid, disclosure animation, corner shape, or scroll-linked animation is unsupported.

Do not communicate meaning through color or motion alone.

## Adoption and migration

Use `node scripts/copy-system.mjs [--dry-run] <target>` to adopt the complete system into a new isolated directory. The explicit target must not exist, and its parent must already exist and be writable. The script copies `global.css`, both fonts, and all seven `styles/*.css` owners byte-for-byte. It must resolve source files from this repository, claim the target exclusively, clean up partial output, and never merge, overwrite, upgrade, or edit an application entrypoint.

After copying, import the adopted `global.css` exactly once from the consumer's actual CSS entrypoint. Keep the adopted system files unchanged, including copied `styles/project.css`; put product or component rules outside the copied tree in a consumer-owned `@layer project`. The copy command is a one-time adoption tool, not a project dependency or build step. For analyzer invocation, JSON evidence, exit semantics, read-only limits, and current-checkout comparison, use `README.md#analyzer-tooling`.

When existing CSS must migrate:

1. Adopt without deleting or disabling existing CSS.
2. Inventory reset, token, type, layout, utility, component, responsive, and state ownership.
3. Classify each rule as native behavior, existing public seess API, project-owned residual, or unproven shared-system candidate.
4. Migrate one complete user-visible slice, including applicable states and responsive behavior.
5. Verify semantics, source order, keyboard behavior, contrast, reduced motion, and large/medium/small rendering.
6. Search every consumer before deleting replaced selectors, variables, files, or generated CSS.

Never treat a product component as a failed migration. Preserve the smallest direct project-layer rule when the shared system does not own that presentation.

## Change workflow

1. Read `README.md`, `global.css`, and every affected owner before editing.
2. Trace the complete selector, token, attribute, consumer, and fallback path.
3. Classify the change as public API, private implementation, or project extension.
4. Make the smallest coherent change at the owner.
5. Update every public explanation and live specimen affected by the change.
6. Search for stale names, paths, selectors, and consumers before deletion.
7. Run static and rendered verification.
8. Report exact files, behavior, evidence, and remaining risk.

Keep the canonical CSS system and copied adoption artifact free of dependencies, runtime, and build steps. The isolated `reference/` site may own a locked Astro development toolchain used only to build and verify its static reference; it is never copied by `scripts/copy-system.mjs`, imported by consumers, or allowed to own system values, formulas, breakpoints, selectors, or behavior. Do not add generated documentation, copied token declarations, or a component registry.

## Verification

Run:

```sh
node scripts/check-system.mjs
```

For grid changes, verify canonical and omitted positions at large, medium, and small container states across `section > .c.sm`, `section > .c`, `section > .c.lg`, nested `section > .c` boundaries, intrinsic header/footer `.c` uses, and the no-container stacked fallback, including nested grids, full-row spans, auto-fit, subgrid, and visual order.

For type-role changes, verify semantic elements and aliases resolve to their matching maximum-width tokens, long content wraps without clipping, scoped token overrides work, and `body` remains unconstrained.

For color changes, verify every skin in both schemes and nested boundaries. For feature changes, verify support, fallback, keyboard behavior, and reduced motion. For public changes, confirm CSS, `README.md`, this contract, the local skill, and checker agree.

Never commit, push, publish, or deploy without explicit authority.
