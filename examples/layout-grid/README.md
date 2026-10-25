---
status: example
canonical: false
use_when: Teaching responsive explicit tracks, a featured span, and a full-row item in one grid.
not_for: A card component, implicit-track tricks, or a utility matrix.
crft_api: confirmed
---

# Responsive grid spans

One grid separates track count from direct-child spans. Read [`markup.html`](markup.html) and [`example.css`](example.css).

## Layout intent

```text
Large: 3 tracks           Medium: 2 tracks       Small / no query
+---------------+------+ +----------+----------+ +----------------+
| Featured (2)  | Note | | Featured | Note     | | Featured       |
+---------------+------+ +----------+----------+ +----------------+
| Full row (0)         | | Full row (0)        | | Note           |
+----------------------+ +---------------------+ +----------------+
                                                | Full-row note  |
                                                +----------------+
```

## Shared and project ownership

This runnable specimen loads the complete reference through `../../styles/global.css`. Consumers need explicit full adoption to use these hooks and own their CSS entry rather than copying `global.css`.

- Shared: `.c.lg`, `.s`, `g="3-2"`, `c="2-1"`, `c="0"`, native type, colors, landmark spacing, and stacked fallback.
- Project: item padding, dashed teaching borders, and a semantic surface. The articles are content, not a CRFT card API. No new class or token is needed.
- Boundary: `section > .c` is the named `container`; its descendant `[g]` owns tracks. Both articles and the full-row aside are direct grid children. Semantic section/aside roles describe content, not geometry.

## Tracks, spans, and order

At the current `60rem` large threshold, the grid has three tracks: the featured article uses two, and the supporting article uses one. From `30rem` to below `60rem`, two tracks each receive a one-track article. The zero span starts a fresh full row in both states. [`crft.css`](../../styles/crft.css) owns the exact thresholds and placements.

Below `30rem`, without a named container, or without container-query support, the grid stays a vertical flex flow. A narrow container in a wide viewport therefore stacks. No row span or visual order is needed. Source order remains featured article, supporting article, then complementary note with or without CSS.

## Checks

From the repository root:

```sh
node scripts/check-system.mjs
git diff --check
python3 -m http.server 4316 --bind 127.0.0.1
```

Open `/examples/layout-grid/markup.html`. Observe at 390, 900, and 1800 CSS pixels. Confirm one stacked flow, two equal medium tracks, then three large tracks with the featured item covering two. The aside must fill the grid width on its own row in either grid state. At 1800px, temporarily set `main` to `width: 420px; margin-inline: auto`: it must stack without overflow. Remove the named container to inspect fallback; disable author CSS to inspect headings and reading order. No interactive controls, media, or custom motion need separate states.

## Limits

This finite example does not teach subgrid, intrinsic fit/fill, row spans, or reordered interaction. Dashed borders reveal grouping rather than establish a shared component style. Product composition and accessibility acceptance remain project-owned.
