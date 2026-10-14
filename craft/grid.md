---
title: CRFT Grid
status: canonical
owner: grid
read_when: Using g/c/r/o, intrinsic fit/fill, subgrid, or container fallbacks.
---

# Grid

The finite house HTML dialect is `g` / `c` / `r` / `o`. `.c` is a container class; `[c]` is a column-span attribute. Frameworks and validators must explicitly support these bare custom attributes.

| Hook | Values | Job |
| --- | --- | --- |
| `g` | Empty, N, L-M | Explicit tracks, 1–12; empty defaults to three |
| `c` | N, L-M | Direct-child column span, 1–12; zero fills the explicit row |
| `r` | N, L-M | Direct-child row span, 1–4 |
| `o` | Full L-M-S using f/a/l | Visual first/authored/last order |

Numbered grids query the nearest named `container` from `section > .c`. Medium and large thresholds match `--query-md` and `--query-lg` literals. Small/no-container/no-container-query-support remains stacked. A grid cannot be its own query boundary. Visual order never changes reading or keyboard order.

```html
<section>
  <div class="c">
    <div g="3-2"><article c="2-1">First</article><aside>Second</aside></div>
  </div>
</section>
```

## Intrinsic and subgrid modes

`fit`, `fit-sm`, `fit-lg` collapse empty repeated tracks. `fill`, `fill-sm`, `fill-lg` retain them. They work at every width without a named container; sm/lg change minimum item measure, not breakpoints. Fit does not stretch every incomplete final row. Numeric column spans are rejected in fit/fill; use ordinary placement or `c="0"`. Row spans remain bounded and must have tested placement.

`sg` uses the direct parent's tracks. Its children must fit the subgrid's own span, not the entire ancestor grid. Without subgrid support it uses the ordinary explicit-grid fallback; without container queries it stacks. Do not use sg below an intrinsic grid.

## Verify

Check span bounds at each responsive position, direct-parent ownership, nested grids, partial-span subgrids, c=0, malformed values, intrinsic modes with 1/2/7 items, narrow/wide widths, no-container fallback, meaningful source and focus order.
