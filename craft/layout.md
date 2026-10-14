---
title: CRFT Layout
status: canonical
owner: layout
read_when: Structuring page chrome, containers, stacks, or spacing.
---

# Layout

Page landmarks own shared breathing room: body > header, body > main > section, and body > footer. `--bleed-x` is horizontal page breathing room; `--bleed-y` is section rhythm. Print production bleed is a separate format field.

## Container

`.c` uses the content-max measure and structural space gap. `.c.sm` and `.c.lg` derive two-thirds and four-thirds measures. Place containers inside page landmarks. Only `section > .c` establishes the named `container` context. A numbered responsive grid belongs inside that boundary. Header/footer containers remain intrinsic.

```html
<section>
  <div class="c sm">
    <h2>Work</h2>
    <div class="s"><p>First</p><p>Second</p></div>
  </div>
</section>
```

## Stack and media

`.s` is a vertical flow using `--gap`. Prefer an existing semantic owner when it safely owns the relationship. Horizontal actions, wrapping, alignment, sticky stacks, and stagger belong in bounded project CSS; there is no generic modifier matrix. The structural parent rhythm uses `--space`; peer separation uses `--gap`; internal breathing room uses `--padding`. Each scale keeps its own ratio.

`.img-w` clips a media frame. Its image fills available width with intrinsic height. Crop, aspect ratio, focal point, and product radius are local decisions. Image scrub remains an opt-in enhancement in the motion layer of crft.css.

## Property form

Use padding and margin shorthand for multiple sides. Use *-block or *-inline for both sides of one axis. One physical side uses top/right/bottom/left. Never use *-block-start or *-inline-start single-side longhands.

## Verify

Test default/narrow/wide containers, exact section boundaries, intrinsic header/footer, no-container fallback, nested grids, source order, long content, zoom, and small-width overflow. Keep section classes and styling-only IDs out of markup.
