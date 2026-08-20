---
title: CRFT color
status: canonical
owner: color
read_when: Choosing semantic colors, branding palettes, applying skins or accents, representing feedback, or checking contrast.
---

# Color

Use semantic color roles before palette sources. `styles/layers/tokens.css` owns live mappings for both color schemes.

## Role model

Build color from outside inward:

1. Palette sources define available brand color.
2. Accent and feedback sources assign purpose.
3. A skin establishes the active canvas and foreground.
4. Semantic surface, border, muted, and accent roles style descendants.
5. Project CSS applies those roles to a component or composition.

Use `--c-bg`, `--c-fg`, `--c-sf`, `--c-bc`, and `--c-mu` for the active context. Use active accent roles for emphasis and component treatment. Use `--c-*-co` only for content on the matching solid source.

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
  <div c>
    <div s>
      <h2>Evidence</h2>
      <aside data-skin="tone">Nested context</aside>
    </div>
  </div>
</section>
```

A nested skin establishes a new semantic context. Descendants continue to consume the same semantic names. Use `data-skin`, never `data-theme`.

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
  <strong t="ac">Saved.</strong>
  Your draft remains available.
</p>
```

Descendants without `data-accent` inherit the current active route. Product CSS can apply active accent background, foreground, border, or solid-fill roles. `data-accent` does not create button, card, badge, or alert presentation.

Palette names are not supported accent routes because a swatch has no verified semantic contrast pair.

## Feedback

Use success, warning, and danger for truthful states. Pair color with text, icon, shape, or another non-color cue. Do not use feedback color as decorative emphasis.

A solid feedback surface uses its matching contrast-companion role. A subtle treatment uses the routed active accent roles within the current canvas.

## Brand ownership

Projects own copied palette and semantic mappings in `styles/layers/tokens.css`. Define both schemes, solid-content companions, muted content, borders, nested skins, and feedback pairs as one coherent system.

Campaign-only variation may override the same semantic roles at its narrowest project boundary. Do not introduce another token dialect.

See [`examples/branded-extension/`](../examples/branded-extension/) for scoped brand composition.

## Common mistakes

- Using `data-theme` instead of `data-skin`.
- Using a color-specific skin instead of combining `data-skin="accent"` with `data-accent`.
- Expecting `data-accent` to style a component.
- Using a palette swatch where a semantic role exists.
- Applying danger color to non-danger decoration.
- Assuming one foreground works on every accent and scheme.
- Using muted color as body text. `--c-mu` is a secondary tone and is not a WCAG AA body-text role.
- Communicating state through color alone.

## Verify

Render every skin in both schemes, including nested boundaries. Check active accent routes, solid-content companions, text and control contrast, focus indicators, disabled and feedback states, selection, placeholders, and meaning without color. Use rendered foreground and background pairs. Token names alone do not prove contrast. Do not treat `--c-mu` as an AA body-text pair.
