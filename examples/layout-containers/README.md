---
status: example
canonical: false
use_when: Comparing narrow, default, and wide container limits independently of content alignment.
not_for: A new container API, brand tuning, or a complete page design.
crft_api: confirmed
---

# Container measures

Three sections expose the same relationship at three maximum measures. Read [`markup.html`](markup.html) and [`example.css`](example.css).

## Layout intent

```text
Enough available width       Narrow available width
    +----------------+       +----------------+
    | .c.sm          |       | .c.sm          |
    +----------------+       +----------------+
  +--------------------+     +----------------+
  | .c                 |     | .c             |
  +--------------------+     +----------------+
+------------------------+   +----------------+
| .c.lg                  |   | .c.lg          |
+------------------------+   +----------------+
```

The outline marks the container, not the paragraph's type measure. Automatic inline margins center each box; its text remains start-aligned.

## Shared and project ownership

This runnable repository specimen loads the complete reference through `../../styles/global.css`. A consumer needs explicit full adoption to use these hooks; it owns its CSS entry rather than copying `global.css`.

- Shared: landmark padding, `.c`, `.c.sm`, `.c.lg`, `.s`, type roles, semantic colors, and native guarantees.
- Project: the dashed outline and its offset. The outline does not change box or query width. No token is overridden.
- Boundary: each exact `section > .c` establishes the named `container` context, even though this recipe needs no grid. A container inside a header or footer would remain intrinsic.

## Maximum-width saturation

Live values belong to [`tokens.css`](../../styles/tokens.css) and [`crft.css`](../../styles/crft.css). With the current `--content-max` of `100rem`, narrow caps at two-thirds, default at `100rem`, and wide at four-thirds. These are ceilings, not requested widths.

At 390px and 900px with the default root size, available width after page padding and scrollbar space is below every ceiling: all three boxes have the same width. At 1800px, narrow and default reach their ceilings while wide is still viewport-constrained. Only a viewport with room beyond the wide ceiling plus page padding separates all three maximum widths fully. A narrow host inside a wide viewport constrains all three again. Keep the current brand foundations; do not retune `--content-max` just to force a difference into a screenshot.

## Checks

From the repository root:

```sh
node scripts/check-system.mjs
git diff --check
python3 -m http.server 4316 --bind 127.0.0.1
```

Open `/examples/layout-containers/markup.html`. Observe at 390, 900, and 1800 CSS pixels. At 1800px, temporarily set `main` to `width: 420px; margin-inline: auto` in browser tools: every outlined container must shrink with that host. Confirm equal side margins, readable wrapping, and no overflow. Disable author CSS and read narrow, default, then wide. No IDs or interactive controls are needed.

## Limits

This teaches maximum measure, not a responsive column state or a product spacing recommendation. Figures are schematic; root size, page padding, and scrollbar allocation affect the viewport at which a ceiling becomes visible. Product design and accessibility acceptance remain project-owned.
