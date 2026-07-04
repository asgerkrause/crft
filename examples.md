---
scope: craft
layer: examples
triggers:
  - examples
  - snippets
  - patterns
  - tokens
updated: 2026-07-03
---

# Examples craft

Related: `tokens`, `token-contract`, `styling`, `components`, `accessibility`.

Examples show relationships, not prescribed visual values. Token names are exact; arbitrary values are omitted unless formula or relationship is the point.

Use this file after topic rules when application pattern is unclear. Do not load it by default for every task.

## Token examples

### Stable consumed token

```css
:root {
  --t-h1-fs: /* project value */;
  --t-h1-lh: /* project value */;
  --s-gp: /* project value */;
}

h1 { font-size: var(--t-h1-fs); line-height: var(--t-h1-lh); }
.stack { gap: var(--s-gp); }
```

Use when project sets values directly.

### Fluid derivation

```css
:root {
  --s-gp-min: /* project value */;
  --s-gp-max: /* project value */;
  --s-gp: clamp(var(--s-gp-min) * 1rem, var(--s-gp-min) * 1rem + (var(--s-gp-max) - var(--s-gp-min)) * var(--l-fluid), var(--s-gp-max) * 1rem);
}
```

Use when project wants fluid spacing. Consumers still use `--s-gp`.

### Theme color relationship

```css
[data-theme] {
  background: var(--c-bg);
  color: var(--c-fg);
}

[data-theme*="tone"] {
  --c-bg: var(--c-neu-05);
  --c-sur: var(--c-neu-00);
}
```

Use when section theme should cascade to descendants.

## Typography examples

### Heading token assembly

```css
:root {
  --t-h2-fs: /* project value */;
  --t-h2-fw: /* project value */;
  --t-h2-lh: /* project value */;
  --t-h2-ff: /* project value */;
  --t-h2: var(--t-h2-fw) var(--t-h2-fs) / var(--t-h2-lh) var(--t-h2-ff);
}

h2 { font: var(--t-h2); }
```

Use when shorthand helps keep type application consistent.

### Measure stays tokenized

```css
.prose {
  max-inline-size: var(--t-md-mw);
}
```

Use when readable line length matters.

## Component examples

### Tokenized card primitive

```css
.crd {
  background: var(--e-crd-sur);
  color: var(--e-crd-ink);
  border: var(--s-bw) solid var(--e-crd-bor);
  border-radius: var(--s-br);
  padding: var(--s-pd);
  display: flex;
  flex-direction: column;
  gap: var(--s-gp);
}
```

Use when repeated surface behavior earns a primitive.

### Button variant

```css
.btn {
  background: var(--e-btn-sur);
  color: var(--e-btn-ink);
  border: var(--s-bw) solid var(--e-btn-bor);
  border-radius: var(--s-br);
  padding: calc(var(--s-pd) * .5) var(--s-pd);
  transition: background var(--m-td) var(--m-tf-o), color var(--m-td) var(--m-tf-o), transform var(--m-td-f) var(--m-tf-o);
  transform: scale(calc(1 - .02 * var(--i-prs-t)));
}

.btn.accent {
  --e-btn-sur: var(--c-acc-sur);
  --e-btn-ink: var(--c-acc-ink);
  --e-btn-bor: transparent;
}
```

Use when variant should remap element tokens, not duplicate full button CSS.

## Grid examples

### Grid section

```html
<section data-theme="tone">
  <div class="c">
    <header class="w">
      <p class="t-sm">...</p>
      <h2>...</h2>
    </header>
    <div g="3-1">
      <article class="crd">...</article>
      <article class="crd">...</article>
      <article class="crd">...</article>
    </div>
  </div>
</section>
```

```css
[g] {
  display: grid;
  grid-template-columns: repeat(var(--l-gc), minmax(0, 1fr));
  gap: var(--s-gp);
}
```

Use when content is a repeated set with shared rhythm.

### Span hierarchy

```html
<div g="4-1">
  <article c="2-1">...</article>
  <article>...</article>
  <article>...</article>
</div>
```

Use span when one item has stronger content weight.

## Form examples

### Form field state

```css
label:has(> input:user-invalid) {
  --e-inp-sur: var(--c-bad-sur);
  --e-inp-ink: var(--c-bad-ink);
  --e-inp-bor: var(--c-bad-bor);
}

input {
  background: var(--e-inp-sur);
  color: var(--e-inp-ink);
  border: var(--s-bw) solid var(--e-inp-bor);
  border-radius: var(--s-br-sm);
  padding: var(--s-pd-sm) var(--s-pd);
}
```

Use when visual validation should follow token roles.

### Connected error markup

```html
<label for="email">Email</label>
<input id="email" name="email" type="email" aria-invalid="true" aria-describedby="email-error">
<p id="email-error">Enter a valid email address.</p>
```

Use when custom error text is rendered.

## Navigation examples

### Header disclosure

```html
<header>
  <nav id="primary-nav" aria-label="Primary">...</nav>
  <button type="button" aria-controls="primary-nav" aria-expanded="false" aria-label="Menu"></button>
</header>
```

```css
body > header {
  background: var(--e-head-sur);
  color: var(--e-head-ink);
  border-block-end: var(--s-bw) solid var(--e-head-bor);
  z-index: var(--z-head);
}

body > header:has([aria-expanded="true"]) nav {
  opacity: 1;
  pointer-events: auto;
}
```

Use when JS only toggles state and CSS handles presentation.

## Motion examples

### Pressed state math

```css
button {
  transform: scale(calc(1 - .02 * var(--i-prs-t)));
}

button:active {
  --i-prs-t: <active>;
  --i-prs-f: <inactive>;
}
```

Use when interaction state should be shared across variants.

### Reduced motion token collapse

```css
@media (prefers-reduced-motion: reduce) {
  :root {
    --m-td: <near-zero>;
    --m-td-f: <near-zero>;
    --m-td-s: <near-zero>;
  }
}
```

Use when motion is non-trivial and must respect comfort.
