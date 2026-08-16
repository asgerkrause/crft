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
      <div class="c">...</div>
    </nav>
  </header>

  <main>
    <section>
      <div class="c">
        <div class="s">
          <h2>Work</h2>
          ...
        </div>
      </div>
    </section>
  </main>

  <footer>
    <div class="c">...</div>
  </footer>
</body>
```

`body > header`, `main > section`, and `body > footer` receive their owned block spacing from `layout.css`. Section identity and region naming follow `html.md`; layout does not require either.

## Container

`.c` sets full available width, content measure, inline page padding, vertical flow, and a structural gap. Use:

- `.c` for the default content measure;
- `.c.sm` for narrow reading or focused content;
- `.c.lg` for wide compositions.

Place `.c` only inside page landmarks. Header and footer containers remain intrinsic. The exact `section > .c` relationship establishes the named inline-size query context `container`.

Do not apply containment to every `.c`. Do not put a responsive `[g]` on the boundary itself. Grid and other responsive composition sit inside it.

Choose the smallest container that preserves the content relationship. A wide container is not a substitute for a deliberate grid or media composition.

## Stack

`.s` creates a vertical flow with the public gap role. Qualifiers compose one relationship:

| Hook | Operation |
| --- | --- |
| `.s` | Vertical stack |
| `.s.h` | Horizontal stack |
| `.s.w` | Allow wrapping |
| `.s.center` | Center children on the cross axis |
| `.s.sb` | Distribute available main-axis space between children |

```html
<section>
  <div class="c sm">
    <div class="s">
      <h2>Actions</h2>
      <div class="s h w sb">...</div>
    </div>
  </div>
</section>
```

Use a stack when one axis and one gap describe the relationship. Use grid for repeated columns or spans. Use direct project CSS for overlap, intrinsic tracks, sticky regions, or another local composition.

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
- `.c` outside header, section, or footer page landmarks.
- A responsive grid placed on `section > .c`.
- Containment applied to header or footer `.c`.
- Child margins used to create group rhythm.
- `.s.sb` used without available space or a clear distribution job.
- A new layout utility for one composition.

## Verify

Render default, narrow, and wide containers. Check intrinsic header and footer use, exact section query boundaries, nested sections where valid, stack direction and wrapping, source order, long content, zoom, safe spacing, and small-width overflow. Grid-specific acceptance belongs to [`grid.md`](grid.md).
