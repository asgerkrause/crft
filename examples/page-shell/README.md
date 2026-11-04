---
status: example
canonical: false
use_when: Starting a complete HTML document with page landmarks and a section/container boundary.
not_for: A product design, component kit, or tokens-only adoption.
crft_api: confirmed
---

# Page shell

Read [`markup.html`](markup.html) and [`example.css`](example.css). The document contains a skip link, header with navigation, one main with one headed section, and footer. All navigation uses real fragments in this document.

## Layout intent

The same single-column structure applies at 390, 900, and 1800 CSS pixels. Navigation wraps when needed; content keeps its measure.

```text
Skip to content (visible on keyboard focus)
+------------------------------------------+
| header                                   |
|   .c.s: page name, nav: Content / Notes   |
+------------------------------------------+
| main #main                               |
|   section                                |
|     .c.s: named container, vertical flow  |
|       h1 #content                        |
|       paragraph                          |
+------------------------------------------+
| footer #notes                            |
|   .c: page notes                         |
+------------------------------------------+
```

Landmarks provide document meaning. `.c` provides content measure and structural flow; `.s` uses the peer gap for related content in the header and section. These layout roles do not replace semantic elements. The only project rules reduce section/footer spacing and let the navigation list wrap.

## Query boundary

The exact `section > .c` relationship establishes the named `container` inline-size query context. Future responsive descendants would query the available width inside this container, rather than the viewport. Header and footer `.c` elements provide measure and flow but remain intrinsic: they do not establish that named context.

This shell needs no grid or container query. If content later needs a responsive `[g]`, put it inside the section's `.c`, on a descendant rather than on the boundary itself. Without an eligible ancestor or container-query support, crft's responsive grid stays stacked. The heading and paragraph here remain in normal flow without query support.

## CSS ownership

In this repository, the document loads `../../styles/global.css` exactly once as its crft entry, followed by the project-owned `example.css`. The crft entry declares the layer order and imports `tokens.css` and `crft.css`; the example declares its later `project` layer.

A consumer must explicitly adopt the full framework to use this shell's `.c`, `.s`, and `.sr.focusable` hooks. Consumers do not copy `global.css`. After full adoption, put the prelude and imports in the project's existing CSS entry, with paths relative to that entry:

```css
@layer reset, base, tokens, type, layout, grid, motion, utility, project;

@import "./tokens.css";
@import "./crft.css";
```

Replace the repository crft link with one link to that consumer-owned entry. Keep the small presentation rules in the project's normal CSS owner. Strategy-only, local extraction, and tokens-only adoption do not grant these framework hooks; see [`docs/adopt.md`](../../docs/adopt.md).

## Verify

Serve the repository root with an existing static server and open `/examples/page-shell/markup.html`.

```sh
node scripts/check-system.mjs
git diff --check
```

- Render at 390, 900, and 1800 CSS pixels. Confirm readable landmarks, wrapping navigation, and no horizontal overflow.
- From a fresh load, Tab to the skip link. It must become visible with a focus indicator. Enter must focus `main` and set the `#main` fragment.
- Reload and Tab through the skip link, Content, and Notes in source order. Activate both navigation links; each must reach its named target with visible focus. Target `tabindex="-1"` permits fragment focus without adding extra Tab stops.
- Disable every author stylesheet. Confirm the skip link becomes ordinary visible text, the navigation list and heading remain useful, fragments still focus their targets, and header/main/footer keep their reading order.
- Check the supplied light and dark schemes, focus contrast, narrow reflow, and reduced motion. This shell adds no motion or JavaScript.

## Limits

This is a structural starting point, not a product design or accessibility acceptance. Product copy, routes, branding, additional sections, and browser/assistive-technology support remain project-owned. It demonstrates a real query boundary but no responsive grid states. Canonical CSS and guidance own the contract; this example adds no public API.
