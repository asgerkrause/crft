---
scope: snz-craft
layer: grid
triggers:
  - grid
  - layout
  - columns
  - cards
  - responsive
  - subgrid
  - order
updated: 2026-05-28
---

# Grid craft

## Grid attributes over layout utility soup

ID: grid.attribute-system
Status: Default
Triggers: grid, layout, columns, g attribute, c attribute, r attribute, o attribute, utility classes
Use when: Building deliberate responsive layout.
Rule: Use attributes for grid behavior: `g` grid container, `c` column span, `r` row span, `o` responsive visual order.
Tradeoff: Markup stays compact and layout intent is visible; team must know attribute system.
Override: Project has coherent class/grid system already.
Tiny example:
Good:
```html
<div g="4-2">
  <article c="2-1">Featured</article>
  <article>Default</article>
</div>
```
Avoid: long chains of layout utility classes for the same local grid.
Related: frontend.deliberate-primitives, styling.primitive-classes

## Reason large medium small

ID: grid.breakpoints
Status: Default
Triggers: responsive, breakpoints, large medium small, mobile, columns
Use when: Choosing responsive grid behavior.
Rule: Always reason in large / medium / small. Large `>60rem` uses 12 columns by default. Medium `>30rem` uses 6. Small `≤30rem` stacks unless custom mobile grid is truly needed.
Tradeoff: Predictable responsive thinking; unusual designs may need local exceptions.
Override: Project breakpoint system differs.
Tiny example:
Good: `g="4-2"` = 4 columns large, 2 columns medium, stacked small.
Avoid: inventing breakpoint names per component.
Related: grid.large-medium-values, sections.card-groups

## Use explicit large-medium values

ID: grid.large-medium-values
Status: Default
Triggers: g values, c values, responsive attributes, large-medium, selector grid
Use when: Setting `g`, `c`, or `r` attributes.
Rule: Values use large-medium order. One value applies to both large and medium. Use explicit pairs for double digits; `g="12"` is ambiguous in selector-based systems.
Tradeoff: More characters, fewer selector bugs.
Override: Project implementation safely parses single double-digit values.
Tiny example:
Good: `g="12-6"`, `g="4-2"`, `c="6-3"`.
Avoid: `g="12"` when selectors might read digits separately.
Related: grid.attribute-system

## Span only when default is wrong

ID: grid.column-span
Status: Default
Triggers: column span, c attribute, full width, card grid, layout
Use when: Assigning child spans.
Rule: Children span 1 column by default. Add `[c]` only to override. Use `c="0"` for full row.
Tradeoff: Cleaner markup; featured items still get explicit spans.
Override: Project grid needs every child explicit for clarity.
Tiny example:
Good:
```html
<div g="12-6">
  <header c="0">Full row</header>
  <article c="6-3">Large</article>
  <article>Default</article>
</div>
```
Avoid: adding `c="1"` to every default child.
Related: sections.card-groups

## Row spans are rare

ID: grid.row-span
Status: Avoid
Triggers: row span, r attribute, masonry, tall card, unpredictable content
Use when: Considering row-spanning cards or panels.
Rule: Use `[r]` rarely and only when layout truly needs a card/panel to span rows. Avoid row spans when content height is unpredictable.
Tradeoff: Strong composition vs fragile content overflow.
Override: Editorial/art-directed layout with controlled content.
Tiny example:
Good: `<article r="2">Tall feature</article>` for fixed-content feature card.
Avoid: row spans on CMS content with unknown text length.
Related: sections.card-groups

## Visual order is last resort

ID: grid.visual-order
Status: Avoid
Triggers: order, responsive order, o attribute, source order, mobile order
Use when: Reordering layout across breakpoints.
Rule: Prefer source order that works everywhere. Use `[o]` sparingly for deliberate visual order changes.
Tradeoff: Visual flexibility can harm reading/focus order if abused.
Override: Art direction needs visual swap and DOM order remains accessible.
Tiny example:
Good: `o="-f"` only for first-on-small visual adjustment.
Avoid: reordering whole page sections through CSS.
Related: platform.semantic-html

## Subgrid aligns nested tracks

ID: grid.subgrid
Status: Default
Triggers: subgrid, nested grid, align tracks, g sg, cards
Use when: Nested children should align to parent grid tracks.
Rule: Use `g="sg"` when nested children need parent track alignment.
Tradeoff: Precise alignment; support/project grid implementation must allow it.
Override: Browser support or project grid system lacks subgrid.
Tiny example:
```html
<div g="12-6">
  <div g="sg" c="6-3">
    <article>Aligned child</article>
  </div>
</div>
```
Related: grid.attribute-system, sections.card-groups
