---
scope: craft
layer: grid
triggers:
  - grid
  - columns
  - layout
  - spans
  - order
updated: 2026-07-01
---

# Grid craft

Related: `tokens`, `styling`, `sections`, `accessibility`.

## Attribute grid stays default

ID: grid.attribute-grid
Status: Default
Triggers: grid, columns, spans, responsive grid, g attribute, c attribute
Use when: Creating simple responsive layout in `craft`-style markup.
Rule: Keep durable grid attributes: `[g]` for grid columns, `[c]` for span, `[r]` for row span, `[o]` for visual order. Token internals use `--l-*` and spacing uses `--s-*`.
Tradeoff: Markup stays short; attribute syntax needs documentation.
Override: Existing project uses another coherent layout system.
Tiny example:
Good:
```html
<div g="4-2">
  <article c="2-1">Feature</article>
  <article>Small item</article>
</div>
```
Avoid: rebuilding grid with many utility classes.

## Grid internals use layout tokens

ID: grid.layout-tokens
Status: Default
Triggers: --l-gc, --l-cs, --l-rs, --l-or, grid internals
Use when: Implementing or maintaining grid CSS.
Rule: Use `--l-gc` for columns, `--l-cs` for column span, `--l-rs` for row span, and `--l-or` for visual order. Use `--s-gp` for grid gaps.
Tradeoff: Slightly more verbose than old short vars; safer to grep and reason about.
Override: None for craft code.
Tiny example:
Good: `grid-template-columns: repeat(var(--l-gc), minmax(0, 1fr)); gap: var(--s-gp);`
Avoid: old unprefixed grid internals in craft code.

## Mobile stacks before breakpoint choreography

ID: grid.mobile-stack
Status: Default
Triggers: mobile grid, responsive layout, breakpoints, columns
Use when: Making sections responsive.
Rule: Default small screens to stack. Use split attribute values like `g="4-2"`, `c="6-3"` for medium/large differences.
Tradeoff: Predictable responsive behavior; art-directed layouts may need local CSS.
Override: Component has a strong visual reason to preserve columns on small screens.
Tiny example:
Good: `[g] { display: grid; } @media (width < <stack-threshold>) { [g] { display: flex; flex-direction: column; } }`
Avoid: many breakpoint classes for simple card grids.

## Visual order stays exceptional

ID: grid.visual-order
Status: Default
Triggers: order, visual order, accessibility, grid order
Use when: Reordering grid children.
Rule: Use `[o]` only for visual refinement that does not break reading or focus order.
Tradeoff: Layout flexibility; misuse harms accessibility.
Override: None when keyboard or reading order becomes confusing.
Tiny example:
Good: moving decorative media after copy on small screens.
Avoid: visually moving the primary CTA before its heading while DOM order says otherwise.

## Applied patterns

### Basic grid

```html
<div g="3-1">
  <article class="crd">...</article>
  <article class="crd">...</article>
  <article class="crd">...</article>
</div>
```

Decision: grid attributes handle common responsive columns without utility sprawl.

### Span only when meaning changes

```html
<article c="2-1">...</article>
```

Decision: span supports content hierarchy, not decoration noise.

### Visual order caution

```html
<img o="2" alt="">
<div o="1">...</div>
```

Decision: only safe when DOM reading/focus order still makes sense.
