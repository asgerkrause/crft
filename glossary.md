---
scope: craft
layer: glossary
triggers:
  - glossary
  - vocabulary
  - tokens
  - alpha
  - primitives
updated: 2026-07-03
---

# Craft glossary

Use this file when an agent needs canonical vocabulary before editing UI, tokens, CSS, components, or copy.

Related: `tokens`, `naming`, `styling`, `token-contract`.

## Token prefixes

| Prefix | Owns | Notes |
| --- | --- | --- |
| `--l-*` | layout structure | widths, grid internals, scroll offsets, layout z-config |
| `--s-*` | space and shape | padding, section rhythm, gaps, radius, border width |
| `--t-*` | typography | font families, sizes, weights, line heights, tracking, transforms, measure |
| `--c-*` | color | anchors, ramps, semantic roles, states, alpha roles |
| `--e-*` | element/component skin | buttons, cards, inputs, badges, chrome, component skins |
| `--m-*` | motion | durations and timing functions |
| `--i-*` | interaction state | hover, focus, pressed, expanded state math |
| `--z-*` | stack order | stacking tokens consumed by UI |

## Stable default token families

These names should usually exist in projects using craft:

- layout: `--l-mw`, `--l-mw-sm`, `--l-mw-lg`, `--l-gc`, `--l-cs`, `--l-rs`, `--l-or`, `--l-st`
- space/shape: `--s-py`, `--s-px`, `--s-ss`, `--s-gp`, `--s-pd`, `--s-br`, `--s-bw`, plus `-xl/-lg/-sm/-xs` where useful
- type: `--t-h0` … `--t-h6`, `--t-lg`, `--t-md`, `--t-sm`, and their `-fs`, `-ff`, `-fw`, `-lh`, `-ls`, `-mw`, `-tt` parts
- color: `--c-bg`, `--c-fg`, `--c-sur`, `--c-ink`, `--c-mut`, `--c-bor`, ramps, state roles, alpha roles
- motion: `--m-td`, `--m-td-f`, `--m-td-s`, `--m-tf`, `--m-tf-i`, `--m-tf-o`, `--m-tf-io`
- interaction: `--i-hov-t/f`, `--i-foc-t/f`, `--i-prs-t/f`, `--i-exp-t/f`

Values are project decisions. Docs should show token names without arbitrary literal values unless formula, `color-mix()`, or relationship is the lesson.

## Responsive token modes

Craft allows two responsive modes:

1. Fluid config: `--t-h1-fs-min/max` derive `--t-h1-fs` through `clamp()`.
2. Direct override: `--t-h1-fs` changes in media/container queries.

Consumed CSS uses final tokens like `--t-h1-fs`, `--s-gp`, and `--l-mw`. Components should not care whether values came from fluid math or direct overrides.

## Color vocabulary

- `neu` = neutral ramp.
- `acc` = accent.
- `sec` = secondary paired color.
- `bg` = page or region background.
- `fg` = page or region foreground.
- `sur` = surface.
- `ink` = strong readable text.
- `mut` = muted text.
- `bor` = border.
- `good`, `warn`, `bad` = state roles.
- `05` … `95` on `--c-bg-*` or `--c-fg-*` = alpha-style roles produced from semantic color and transparency.

## Element tokens

`--e-*` is allowed to vary by project more than core `--l-*`, `--s-*`, `--t-*`, and `--c-*` tokens. Use it for official primitives and repeated component skins.

Common starting set:

- `--e-head-*`
- `--e-foot-*`
- `--e-btn-*`
- `--e-crd-*`
- `--e-inp-*`
- `--e-bdg-*`

Add new `--e-*` only when element/component skin is reusable, themeable, or repeated. Use component-local custom properties for one-off art direction.

## Primitive vocabulary

- `.c` = container.
- `.w` = vertical rhythm wrapper.
- `.crd` = card primitive.
- `.btn` = button/link-as-button primitive.
- `.btns` = button group.
- `.lnk` = text link primitive.
- `.lnks` = link group.
- `[g]` = grid columns.
- `[c]` = column span.
- `[r]` = row span.
- `[o]` = visual order, exceptional because accessibility risk.

## Related topic map

- Tokens: `tokens`, `naming`, `token-contract`, `styling`.
- Typography: `tokens`, `styling`, `accessibility`.
- Grid/layout: `grid`, `sections`, `styling`, `accessibility`.
- Components: `components`, `tokens`, `naming`, `performance`.
- Forms: `forms`, `accessibility`, `copy`, `tokens`.
- Motion: `motion`, `performance`, `accessibility`.
- Navigation: `navigation`, `accessibility`, `motion`, `styling`.
