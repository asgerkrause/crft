---
status: example
canonical: false
use_when: Separating a centered container from centered text, nested stacks, and wrapping action or link groups.
not_for: A shared centering modifier, alignment matrix, or button component API.
crft_api: confirmed
---

# Centered content

The first section centers its container while leaving its content start-aligned. The second centers the content through bounded project rules. Read [`markup.html`](markup.html) and [`example.css`](example.css).

## Layout intent

```text
Centered box, start content     Centered box and content
+-------------------------+     +-------------------------+
| Heading                 |     |         Heading         |
| Copy                    |     |          Copy           |
| [Action] Link           |     |     Nested stack        |
+-------------------------+     |     [Action] Link       |
                                |    Link Link Link       |
                                +-------------------------+
Narrow: groups wrap; each link's text may also wrap.
```

## Shared and project ownership

This runnable specimen loads the complete reference through `../../styles/global.css`. Consumers need explicit full adoption for the shared hooks and own their CSS entry; they do not copy `global.css`.

- Shared: `.c` centers the container with automatic inline margins; `.s` supplies vertical flow. Native headings, type measures, base focus geometry, semantic colors, accent skin, and motion preferences remain shared.
- Project: `.centered` is this specimen's bounded composition role. `.btns` and `.lnks` wrap related navigation choices. `.btn` and `.lnk` own link presentation, hit areas, and states. None is public CRFT API.
- Boundary: both `.c` elements are direct children of their sections, establishing the named `container` context. The only ID is the real comparison fragment target; the related links use local recipe destinations.

## Centering and focus decisions

`text-align: center` inherits, but `align-items` does not. Centering `.centered` alone positions its direct children; it cannot align the children inside either nested `.s`. Explicit `.centered > header` and `.centered > .s` rules center those children too. The wrapping horizontal groups separately use `justify-content: center`. Keep these local relationships; do not infer a generic `.s` modifier.

The filled links navigate, so they remain anchors with meaningful destinations. The base focus outline follows `currentColor`, which is the fill's contrast companion on `.btn` and can disappear against the surrounding canvas. This project explicitly uses:

```css
.btn:focus-visible { outline-color: var(--text); }
```

The base still owns outline width and offset. The project keeps the ring on the surrounding canvas and verifies both schemes on base and accent canvases. Hover and active underline add a non-color cue without changing contrast pairs. Text and groups can wrap; no fixed height or no-wrap rule hides long names.

## Checks

From the repository root:

```sh
node scripts/check-system.mjs
node --test scripts/check-system.test.mjs
git diff --check
python3 -m http.server 4316 --bind 127.0.0.1
```

Open `/examples/layout-centered/markup.html`. Observe at 390, 900, and 1800 CSS pixels. At 1800px, temporarily set `main` to `width: 420px; margin-inline: auto`: nested stacks and both horizontal groups must remain centered and wrap without overflow. Tab through all seven links in source order. Confirm both filled links have an unclipped visible ring with at least 3:1 contrast against their adjacent base or accent canvas in light and dark schemes. Disable author CSS: comparison, explanation, actions, then related navigation must still make sense.

## Limits

This example supplies one local composition and link treatment, not a reusable component contract. It retains current reference brand values. It adds no motion; base transitions keep the reference reduced-motion substitutions. Browser evidence does not replace project accessibility acceptance or assistive-technology testing.
