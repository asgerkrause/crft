---
status: example
canonical: false
use_when: Comparing equal and asymmetric copy-first text/media splits with a stacked small-container result.
not_for: Visual reordering, a media component API, or a full marketing page.
crft_api: confirmed
---

# Copy-first splits

Two small splits keep explanation before supporting media at every size. Read [`markup.html`](markup.html) and [`example.css`](example.css).

## Layout intent

```text
Large container         Medium container        Small / no query
+---------+---------+   +---------+---------+   +----------------+
| Copy 1  | Media 1 |   | Copy 1  | Media 1 |   | Copy 1         |
| 1 of 2 | 1 of 2  |   | 1 of 2 | 1 of 2  |   | Media 1        |
+---------+---------+   +---------+---------+   +----------------+
+-------+-----------+   +---------+---------+   +----------------+
| Copy 2| Media 2   |   | Copy 2  | Media 2 |   | Copy 2         |
| 5/12  | 7/12      |   | 3/6     | 3/6     |   | Media 2        |
+-------+-----------+   +---------+---------+   +----------------+
```

## Shared and project ownership

This runnable specimen loads the complete reference through `../../styles/global.css`. Consumers explicitly adopt the full framework for these hooks and own their CSS entry rather than copying `global.css`.

- Shared: `.c.lg`, `.s`, `g="2"`, `g="12-6"`, and direct-child spans `c="5-3"` / `c="7-3"`; native type, colors, media fallback, and landmark spacing.
- Project: cross-axis alignment of each split and full-width figure images. There is no crop, motion, new class, or token override.
- Boundary: each grid is a descendant of its own exact `section > .c`, never on the query boundary itself. Spans belong to that grid's direct children.

## Container states and media

The nearest named `container` selects the state. Current live thresholds are `30rem` for medium and `60rem` for large; [`crft.css`](../../styles/crft.css) owns these literals. The equal split uses two tracks in either grid state. The asymmetric split uses twelve tracks at large size and six at medium size. All spans fit their direct parent at both positions.

Below `30rem`, without a named boundary, or without container-query support, the numbered grids remain vertical flex flows. A wide viewport does not make a narrow container large. No `o` attribute changes visual or reading order: explanation, image, and caption always stay in that order.

Both figures reuse the repository's local [`placehold.svg`](../../reference/src/assets/placehold.svg) at its intrinsic `1005` by `1005` dimensions. It is a decorative teaching placeholder, so `alt=""` avoids announcing meaningless texture; the caption explains its role. Replace it with suitable informative alternative text when the real media conveys information. Dimensions reserve space; intrinsic height and full-width scaling preserve the square without clipping.

## Checks

From the repository root:

```sh
node scripts/check-system.mjs
git diff --check
python3 -m http.server 4316 --bind 127.0.0.1
```

Open `/examples/layout-split/markup.html`. Observe at 390, 900, and 1800 CSS pixels: stacked, equal medium, then equal/asymmetric large. At 1800px, temporarily set `main` to `width: 420px; margin-inline: auto`; both splits must stack. Check no horizontal overflow and loaded local media. Remove the named container in browser tools to inspect the stacked fallback. Disable author CSS and read each explanation before its figure and caption. No interactive controls or custom animation need separate states.

## Limits

This demonstrates layout relationships, not final content, media art direction, or a product spacing recommendation. Container state depends on available content width, not viewport width. Product semantics, real image descriptions, and accessibility acceptance remain project-owned.
