---
title: CRFT layout
status: canonical
owner: layout
read_when: Structuring page chrome, sections, content containers, stacks, spacing relationships, or local layout boundaries.
---

# Layout

CRFT layout provides page-landmark spacing, content containers, stacks, and the boundary required by the responsive grid. CSS owns live measures and query thresholds.

## Page landmarks

Use page chrome as direct body children unless project truth requires another coherent shell:

```html
<body>
  <header>
    <nav aria-label="Primary">
      <div c>...</div>
    </nav>
  </header>

  <main>
    <section>
      <div c>
        <div s>
          <h2>Work</h2>
          ...
        </div>
      </div>
    </section>
  </main>

  <footer>
    <div c>...</div>
  </footer>
</body>
```

`body > header`, `body > main > section`, and `body > footer` receive shared block padding and inline bleed from `layout.css`. The header uses compact block padding. The footer preserves the larger lead-in and uses compact bottom padding. `main` clips horizontal overflow and, with the header and footer, receives a view-transition name. Section identity and region naming follow `html.md`; layout does not require either.

## Container

`c` sets full available width, content measure, vertical flow, and a structural gap. Narrow and wide measures derive from the default content width so one override changes the family coherently. Use:

- `c` for the default content measure;
- `c="sm"` for two-thirds of the default measure;
- `c="lg"` for four-thirds of the default measure.

`c` owns measure only. Do not put alignment on `c`. Place `c` only inside page landmarks. Header and footer containers remain intrinsic. The exact `section > [c]` relationship establishes the named inline-size query context `container`.

Do not apply containment to every `[c]`. Do not put a responsive `[g]` on the boundary itself. Grid and other responsive composition sit inside it.

Choose the smallest container that preserves the content relationship. A wide container is not a substitute for a deliberate grid or media composition.

## Stack

`s` creates a vertical flow with the public gap role. Flags compose one relationship:

| Hook | Operation |
| --- | --- |
| `s` | Vertical stack |
| `s="h"` | Horizontal stack |
| `s="w"` | Allow wrapping |
| `s="ct"` | Center children on the cross axis |
| `s="sb"` | Distribute available main-axis space between children |

```html
<section>
  <div c="sm">
    <div s>
      <h2>Actions</h2>
      <div s="h w sb">...</div>
    </div>
  </div>
</section>
```

Use a stack when one axis and one gap describe the relationship. Use grid for repeated columns or spans. Use direct project CSS for overlap, intrinsic tracks, sticky regions, or another local composition.

## Image frame

`.img-w` is the public media frame. It is a block that clips overflow. The image fills the inline size and keeps intrinsic height until project CSS supplies an aspect ratio, object fit, or focal point.

```html
<figure class="img-w">
  <img src="work.jpg" alt="Finished interface at the results step">
</figure>
```

Do not put radius, crop, or parallax on the image without a frame. Image scrub is an opt-in on this same wrapper; see [`motion.md`](motion.md).

## Property form

Use padding and margin shorthand when one declaration controls multiple sides. In two-value shorthand, the first value controls top and bottom and the second controls left and right. Use `*-block` or `*-inline` when both sides of one axis share a value. Use `*-top`, `*-right`, `*-bottom`, or `*-left` when one physical side changes.

## Spacing ownership

- Section spacing belongs to the page section owner.
- Flow rhythm belongs to the parent stack.
- Peer separation belongs to grid or stack gap.
- Internal breathing room belongs to component padding.
- One exceptional visual offset belongs to project composition.

Do not use child margins to repair a parent relationship. Avoid nesting stacks when one parent gap can express the same grouping.

## Responsive behavior

Container choice and stack wrapping follow content. Do not add a viewport breakpoint only to change a relationship already expressed by available container width.

At small widths, preserve source order, reachable controls, readable measure, media meaning, and non-overlapping targets. Project CSS may change a local composition when the public stack and grid do not own it.

## Common mistakes

- An ID added only to style a page section.
- `c` outside header, section, or footer page landmarks.
- A responsive grid placed on `section > [c]`.
- Containment applied to header or footer `[c]`.
- Alignment flags placed on `c` instead of `s`.
- Child margins used to create group rhythm.
- `s="sb"` used without available space or a clear distribution job.
- A new layout utility for one composition.

## Verify

Render default, narrow, and wide containers. Check intrinsic header and footer use, exact section query boundaries, nested sections where valid, stack direction and wrapping, source order, long content, zoom, safe spacing, and small-width overflow. Grid-specific acceptance belongs to [`grid.md`](grid.md).
