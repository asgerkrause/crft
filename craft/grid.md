---
title: CRFT Grid
status: canonical
owner: grid
read_when: Using g/c/r/o, intrinsic fit/fill, subgrid, or container fallbacks.
---

# Grid

The finite house HTML dialect is `g` / `c` / `r` / `o`. `.c` is a container class; `[c]` is a column-span attribute. Frameworks and validators must explicitly support these bare custom attributes.

## Grid role

- **Purpose:** `[g]` arranges related direct children in tracks when space permits. It adds no landmark semantics; choose meaningful elements using [`html.md`](html.md#landmarks-and-regions).
- **Placement and nesting:** A numbered responsive grid is a descendant of the exact section query boundary owned by [`layout.md`](layout.md#container). It may sit inside a stack. Its items may be stacks or grids; `c`, `r`, and `o` describe an item relative to its direct `[g]` parent. A plain nested grid keeps querying the nearest named ancestor; it does not create another query boundary.
- **Spacing and alignment:** Full width, `--gap` for both row and column gaps, and full-width direct children. The fallback is a column flex layout; responsive explicit tracks share available width equally. Items default to one column and one row once tracks activate. Normal cross-axis stretching applies subject to item constraints. There is no shared text-centering rule; text alignment inherits.
- **Modifiers:** `g` selects the track count or one of the intrinsic/subgrid modes below. `c` and `r` select direct-child spans; `o` selects visual order. No alignment or spacing modifiers.
- **Responsive behavior:** Numbered grids follow the named-container states below. Intrinsic modes have their own width-driven behavior; subgrid has an explicit-grid fallback.
- **Minimal markup:** The example below shows every structural role together, including stacks used as grid items.

| Hook | Values | Job |
| --- | --- | --- |
| `g` | Empty, N, L-M | Explicit tracks, 1–12; empty defaults to three |
| `c` | N, L-M | Direct-child column span, 1–12; zero fills the explicit row |
| `r` | N, L-M | Direct-child row span, 1–4 |
| `o` | Full L-M-S using f/a/l | Visual first/authored/last order |

## Responsive states

Numbered grids query the nearest named `container` ancestor, not the viewport. Medium and large thresholds are CSS literals matching `--query-md` and `--query-lg` in `styles/tokens.css`; overriding a token alone does not change the query. [`layout.md`](layout.md#container) owns which element establishes that context. A grid cannot query itself, so putting `g` on the boundary element does not use that element's width.

| State | Numbered-grid behavior |
| --- | --- |
| Small: container below `--query-md` | Vertical stack; spans do not create tracks |
| Medium: container at least `--query-md`, below `--query-lg` | Use M from `g="L-M"`, `c="L-M"`, and `r="L-M"` |
| Large: container at least `--query-lg` | Use L from each pair |
| No named ancestor or no container-query support | Keep the vertical stack fallback |

A single N applies at both medium and large, not small. Empty `g` uses three tracks at both responsive states. Small always uses one column. `o` always spells all three positions as L-M-S; `f`, `a`, and `l` mean first, authored, and last. Its small-position order also applies to the flex fallback. Visual order never changes reading or keyboard order.

```html
<main>
  <section>
    <div class="c">
      <div class="s">
        <h1>Work</h1>
        <div g="3-2">
          <article class="s" c="2-1">
            <h2>Storefront</h2>
            <p>Product pages and checkout.</p>
          </article>
          <article class="s">
            <h2>Archive</h2>
            <p>A searchable collection.</p>
          </article>
        </div>
      </div>
    </div>
  </section>
</main>
```

Trace the example from outside inward: `main` owns primary-content semantics; its direct section receives page insets; `.c` bounds measure and establishes the named query context; the outer `.s` separates the heading and grid with `--gap`; `[g]` separates items with `--gap`; each `article.s` separates its own heading and paragraph. The container's `--space` would separate multiple direct child groups, but this container has only one. At small/no-container widths the articles stack. At medium there are two tracks and each article spans one; at large there are three tracks and the first article spans two. The article stacks remain vertical in every state.

## Intrinsic and subgrid modes

`fit`, `fit-sm`, `fit-lg` collapse empty repeated tracks. `fill`, `fill-sm`, `fill-lg` retain them. They work at every width without a named container; sm/lg change minimum item measure, not breakpoints. Fit does not stretch every incomplete final row. Numeric column spans are rejected in fit/fill; use ordinary placement or `c="0"`. Row spans remain bounded and must have tested placement.

`sg` uses the direct parent's tracks. Its children must fit the subgrid's own span, not the entire ancestor grid. Without subgrid support it uses the ordinary explicit-grid fallback; without container queries it stacks. Do not use sg below an intrinsic grid.

## Verify

Check span bounds at each responsive position, direct-parent ownership, nested grids, partial-span subgrids, c=0, malformed values, intrinsic modes with 1/2/7 items, narrow/wide widths, no-container fallback, meaningful source and focus order.
