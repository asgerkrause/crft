---
title: CRFT color
status: canonical
owner: color
read_when: Choosing semantic colors, branding palettes, applying skins or accents, representing feedback, or checking contrast.
---

# Color

Use semantic color roles before palette sources. `styles/tokens.css` owns live mappings for both color schemes.

## Role model

Build color from outside inward:

1. Palette sources define available brand color.
2. Accent and feedback sources assign purpose.
3. A skin establishes the active canvas and foreground.
4. Semantic surface, border, muted, and accent roles style descendants.
5. Project CSS applies those roles to a component or composition.

Use `--canvas`, `--text`, `--surface`, `--border`, and `--muted` for the active context. Use active accent roles for emphasis and component treatment. Use `--on-accent`, `--on-secondary`, `--on-tertiary`, or the matching `--on-success`/`--on-warning`/`--on-danger` role only for content on the matching solid source.

Do not apply palette swatches directly when a semantic role expresses the job.

## Skins

`data-skin` establishes a canvas boundary:

| Value | Context |
| --- | --- |
| omitted | Inherit the current semantic context |
| empty | Reset to the base semantic context |
<!-- skin-value-index:start -->
| `tone` | Restrained tonal canvas |
| `invert` | Inverted base canvas |
| `accent` | Active-accent-tinted canvas |
<!-- skin-value-index:end -->

```html
<section data-skin="accent" data-accent="secondary">
  <div class="c">
    <div class="s">
      <h2>Evidence</h2>
      <aside data-skin="tone">Nested context</aside>
    </div>
  </div>
</section>
```

A nested skin establishes a new semantic context. Descendants continue to consume the same semantic names. Use `data-theme` with `light` or `dark` for an approved overall scheme; data-skin selects a local canvas from that scheme. Skins are non-cumulative: invert inside invert remains inverted, and tone inside accent selects scheme tone. Dependent roles recompute against the resulting canvas and routed accent. Missing client dark data is a missing capability, never permission to invent an inversion.

Skin chooses the canvas treatment. Accent chooses its active color route. Combine `data-skin="accent"` with a supported `data-accent` value when the canvas needs that route. The combined boundary also routes active accent roles for descendants. Use feedback routes only for a truthful success, warning, or danger context.

Apply a skin only at a meaningful canvas boundary. Do not recolor descendants one by one.

## Accent routing

`data-accent` changes the active accent family without painting a boundary:

| Value | Route |
| --- | --- |
| omitted | Inherit the current active accent; the root context defaults to primary |
<!-- accent-value-index:start -->
| `secondary` | Secondary accent |
| `tertiary` | Tertiary accent |
| `success` | Success feedback |
| `warning` | Warning feedback |
| `danger` | Danger feedback |
<!-- accent-value-index:end -->

```html
<p data-accent="success">
  <strong>Saved.</strong>
  Your draft remains available.
</p>
```

Descendants without `data-accent` inherit the current active route. Product CSS can apply active accent background, foreground, border, or solid-fill roles. `data-accent` does not create button, card, badge, or alert presentation.

Palette names are not supported accent routes because a swatch has no verified semantic contrast pair.

## Feedback

Use success, warning, and danger for truthful states. Pair color with text, icon, shape, or another non-color cue. Do not use feedback color as decorative emphasis.

A solid feedback surface uses its matching contrast-companion role. A subtle treatment uses the routed active accent roles within the current canvas.

## Solid-content companions

Each `--on-*` companion follows its source live: black or white, whichever has the higher WCAG contrast against the solid color. `contrast-color()` makes the pick where supported. Elsewhere, a relative color flips at XYZ luminance 0.1791, where black and white tie. A static brand pair remains where relative color is unsupported. Retuning `--accent` or `--success` retunes its companion, and `data-accent` routes carry it. The worst case over every sRGB source is 4.58:1. Pure black and white are deliberate: CSS cannot turn a source's lightness into a choice between two brand colors. Override an `--on-*` token in project CSS when the brand needs a specific pair, then verify the rendered contrast.

## Brand ownership

Projects own copied palette and semantic mappings in `styles/tokens.css`. Define both schemes, muted content, borders, nested skins, and feedback pairs as one coherent system; solid-content companions derive unless overridden.

Campaign-only variation may override the same semantic roles at its narrowest project boundary. Do not introduce another token dialect.

See [`examples/branded-extension/`](../examples/branded-extension/) for scoped brand composition.

## Common mistakes

- Inventing a dark client scheme when only light inputs were approved.
- Using a color-specific skin instead of combining `data-skin="accent"` with `data-accent`.
- Expecting `data-accent` to style a component.
- Using a palette swatch where a semantic role exists.
- Applying danger color to non-danger decoration.
- Assuming one foreground works on every accent and scheme.
- Assuming a mix percentage proves contrast. Muted is opaque readable secondary text and must pass on canvas and surface.
- Communicating state through color alone.

## Contrast preferences

`prefers-contrast: more` strengthens `--muted` and `--border` contrast on every canvas so secondary text and borders stay legible. `forced-colors: active` gives controls a system border and outline; system colors then replace the palette. Both are reference guarantees; product CSS must not undo them.

## Verify

Render every skin in both schemes, including nested boundaries. Check active accent routes, solid-content companions, text and control contrast, focus indicators, disabled and feedback states, selection, placeholders, and meaning without color. Use rendered foreground and background pairs. Token names alone do not prove contrast. Verify muted against actual canvas and surface backgrounds without exemptions.
