---
title: crft Layout
status: canonical
owner: layout
read_when: Structuring page chrome, containers, stacks, or spacing.
---

# Layout

These layout contracts describe the retained layout layer in `styles/crft.css`, using public values from `styles/tokens.css`. [`html.md`](html.md#landmarks-and-regions) owns semantic landmarks, sections, headings, and IDs. Layout roles do not create landmark semantics. [`grid.md`](grid.md) owns grids and responsive attribute grammar.

## Page landmarks and sections

- **Purpose:** Page landmarks organize shared chrome and primary content. Sections divide that content into thematic units; their layout owns the full-width canvas and section rhythm, outside the content measure.
- **Placement and nesting:** Use `body > header`, `body > main > section`, and `body > footer`. The default insets below depend on those exact relationships. A nested section does not receive the outer section padding. A local `header` inside a section does not receive page-header styling.
- **Spacing and alignment:** `body` is a column flex layout. Page header, direct main sections, and page footer receive `padding: var(--bleed-y) var(--bleed-x)`, with the exceptions below. No shared rule centers their text or arranges navigation horizontally.

| Owner | Other layout defaults |
| --- | --- |
| `body > header` | Block padding becomes `--padding`; view-transition name is `header` |
| `body > main` | Full width, minimum height `100svh`, horizontal overflow clipped, view-transition name `main`; no shared padding or gap |
| `body > main > section` | Shared insets only; ordinary block flow without a shared child gap |
| `body > footer` | Bottom padding becomes `--padding`; top remains `--bleed-y`; view-transition name is `footer` |

- **Modifiers:** No shared layout modifiers. Do not put a class on `section`. Purposeful IDs and canvas hooks follow [`html.md`](html.md#landmarks-and-regions); they do not select a different spacing layout.
- **Responsive behavior:** These rules have no breakpoint switch. `--bleed-x` supplies horizontal page breathing room and `--bleed-y` supplies section rhythm at every width unless the project overrides them. Print production bleed is a separate format field.
- **Minimal markup:** [`html.md` page shape](html.md#page-shape) shows the page landmarks with one section. An inner `.c` bounds content without narrowing the section's canvas.

## Container

- **Purpose:** `.c` bounds content measure and separates major child groups.
- **Placement and nesting:** Place `.c` inside page landmarks. It can contain semantic elements, stacks, or grids. Use `.s` for a nested peer group instead of another `.c` unless that group needs its own content measure.
- **Spacing and alignment:** Column flex layout, `width: 100%`, `max-width: var(--content-max)`, `margin-inline: auto`, and `gap: var(--space)`. It adds no padding. Direct children use normal flex cross-axis stretching, subject to their own width and measure limits. Text alignment inherits.
- **Modifiers:** `.c.sm` caps the measure at two-thirds of `--content-max`; `.c.lg` caps it at four-thirds. Use at most one width modifier. Neither changes padding, gap, alignment, or responsive thresholds.
- **Responsive behavior:** The box fills available width up to its measure. Only `section > .c` establishes the named `container` context through `container: container / inline-size`. This is a direct-child selector, including for nested sections. A wrapper between the section and `.c` prevents that boundary; a nested `.s` does not create a new one. A direct `header > .c` or `footer > .c` has no named query context of its own. Responsive grids belong below the boundary, never on the boundary element itself; see [`grid.md`](grid.md#responsive-states).
- **Minimal markup:** A section containing `<div class="c"><h2>Work</h2><p>Selected projects.</p></div>`. Add `sm` or `lg` to that same class list when the content needs a different measure.

## Stack

- **Purpose:** `.s` groups peers in a vertical flow.
- **Placement and nesting:** Use an existing semantic owner when it can own the group, such as `<article class="s">`; otherwise use a `div`. Never add `.s` to a section. A stack may contain another stack or a grid. Each nested stack owns only its direct-child spacing and alignment.
- **Spacing and alignment:** Column flex layout with `gap: var(--gap)`, no added padding or margins, and normal cross-axis stretching subject to child width and measure limits. Text alignment inherits; `align-items` does not.
- **Modifiers:** None. Horizontal actions, wrapping, alignment, sticky stacks, and stagger belong in bounded project CSS; there is no generic modifier matrix.
- **Responsive behavior:** Stacks stay vertical at every width. Nesting does not introduce a breakpoint, a content-max measure, or a named query context.
- **Minimal markup:** `<div class="s"><p>First peer.</p><p>Second peer.</p></div>`. An outer stack treats an inner stack as one child; the inner stack separates its own peers independently.

## Spacing and centering

Structural parent rhythm uses `--space` on `.c`; peer separation uses `--gap` on `.s` and grids; internal breathing room uses `--padding` where a rule calls for it. Each scale keeps its own ratio. Changing one scale does not change the others. A gap separates direct children only, with no leading or trailing gap. Nesting groups does not flatten their spacing into one rhythm.

`.c` centers its own box through automatic inline margins. That does not center its child boxes or text. `text-align` inherits through descendants unless another rule overrides it; native controls explicitly use start-aligned text in the base layer. `align-items` acts on a flex container's direct children and does not inherit into nested stacks. Center text and child boxes separately when both are intended. Type-role measure limits still apply; change a heading's `--ROLE-measure` token rather than its `max-width`.

There is no shared `.center` hook. This bounded project example centers the container's direct children and the two nested intro stacks:

```html
<main class="work-page">
  <section>
    <div class="c sm">
      <h1>Work</h1>
      <div class="s">
        <h2>Selected projects</h2>
        <div class="s">
          <p>Recent work and the decisions behind it.</p>
          <a href="/projects">View projects</a>
        </div>
      </div>
    </div>
  </section>
</main>
```

```css
.work-page > section > .c {
  text-align: center;
}

.work-page > section > .c,
.work-page > section > .c > .s,
.work-page > section > .c > .s > .s {
  align-items: center;
}
```

The page-scope class and selectors belong to that project, not crft's public API. A new nested flex owner needs its own bounded alignment rule if its children should also center. Do not turn this example into a shared modifier or utility matrix without a separate API decision supported by unrelated consumers.

Shared scale recipes resolve at `:root` only; themes never rebind spacing or radius. Semantic owners may set final `--gap`, `--padding`, `--radius`, and derived scale values directly. These local values do not recompute inherited scale members.

## Media

`.img-w` clips a media frame. Its image fills available width with intrinsic height. Crop, aspect ratio, focal point, and product radius are local decisions. Image scrub remains an opt-in enhancement in the motion layer of crft.css.

## Property form

Use padding and margin shorthand for multiple sides. Use *-block or *-inline for both sides of one axis. One physical side uses top/right/bottom/left. Never use *-block-start or *-inline-start single-side longhands.

## Verify

Trace page insets, container `--space`, and each stack/grid `--gap` separately. Test default/narrow/wide containers, exact section boundaries, header/footer without a named context, no-container fallback, nested stacks and grids, direct-child versus inherited alignment, source order, long content, zoom, and small-width overflow. Keep section classes and styling-only IDs out of markup.
