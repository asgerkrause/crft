---
title: CRFT grid
status: canonical
owner: grid
read_when: Using g, x, y, or o attributes; choosing responsive spans; using auto-fit or subgrid; or checking container fallback.
---

# Grid

CRFT grid describes large, medium, and small states from the nearest ancestor `section > [c]` inline size. `styles/layers/grid.css` owns the live selectors. CSS owns the exact query thresholds and internal selector operators.

`--l-cq-md` is the medium threshold. `--l-cq-lg` is the large threshold. The `@container` queries keep matching literals because custom properties are not reliable in container conditions. Project CSS that must match a grid state copies those token values. Do not invent a second pair of breakpoints.

## Boundary and fallback

A responsive `[g]` must be a descendant of `section > [c]`, not the same element:

```html
<section>
  <div c>
    <div s>
      <h2>Work</h2>
      <div g="12-6">
        <article x="5-3">...</article>
        <aside x="7-3">...</aside>
      </div>
    </div>
  </div>
</section>
```

Large and medium use grid. Small is always a flex-column fallback. A grid without the named ancestor boundary remains in that stacked fallback. If container queries are unsupported, every `[g]` also remains stacked.

Grid presentation never changes DOM, reading, or keyboard meaning. IDs and region names are independent semantic decisions; grid does not require them.

## Grammar

| Attribute | Public values | Job |
| --- | --- | --- |
| `g` | Empty, `N`, or `L-M` | Parent column count |
| `x` | `N` or `L-M` | Child column span |
| `y` | `N` or `L-M` | Child row span |
| `o` | Complete `L-M-S` | Child presentation order |

For `g`, `x`, and `y`, one number applies at large and medium. Two positions describe large and medium. Small remains stacked.

- `g` column counts are `1` through `12`.
- `x` spans are `1` through `12`. `0` means a full row.
- `y` spans are `1` through `4`.
- Omit `x` or `y` for the default span.
- Every `o` value contains all three positions. Use `f` for first, `a` for authored, and `l` for last.

```html
<section>
  <div c>
    <h2>Comparison</h2>
    <div g="3-2">
      <article x="2-1" o="a-a-f">...</article>
      <aside x="1" o="a-a-l">...</aside>
    </div>
  </div>
</section>
```

Use `o` only when the authored source order remains meaningful at every size.

## Special parent modes

| Value | Job |
| --- | --- |
| `g="a-sm"` | Auto-fill narrow items |
| `g="a"` | Auto-fill default items |
| `g="a-lg"` | Auto-fill wide items |
| `g="sg"` | Use the ancestor grid tracks as a subgrid |

The special value names are `a-sm`, `a`, `a-lg`, and `sg`. Auto modes choose a repeated item measure. They do not define card presentation. Subgrid requires an applicable grid parent and keeps the small stacked fallback. If container queries work but subgrid does not, `g="sg"` retains the ordinary repeated grid declared for `[g]` at that container state.

## Selection

Use the grid when the composition needs repeated tracks, explicit spans, full rows, or shared subgrid alignment. Use a stack for one-dimensional flow. Use project CSS for masonry, overlap, intrinsic editorial tracks, sticky panes, or another local system not described by this grammar.

Do not expose internal prefix, suffix, or substring attribute-selector operators in public usage. Author only the documented values.

## Common mistakes

- Putting `g` on the `[c]` query boundary.
- Assuming a grid outside a page section becomes responsive.
- Writing three numeric positions for `g`, `x`, or `y`.
- Omitting a position from `o`.
- Using `x="0"` as a zero-width item instead of a full row.
- Using visual order to repair incorrect source order.
- Treating malformed values as supported fallback API.

## Verify

Check canonical and omitted positions at large, medium, and small container states across `c="sm"`, `c`, and `c="lg"`. Include nested section boundaries, intrinsic header/footer `[c]`, and no-container fallback. Verify nested grids, full rows, auto modes, subgrid, row spans, visual order, source order, keyboard order, long content, and malformed-value rejection.
