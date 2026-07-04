---
scope: craft
layer: tokens
triggers:
  - token contract
  - css ownership
  - design system
  - theme
updated: 2026-07-03
---

# Token and CSS ownership contract

Canonical craft contract for token names, CSS ownership, and theme flow. Implementation packages may translate this contract into their own files, build steps, or component syntax.

Related: `tokens`, `styling`, `naming`, `glossary`, `components`, `accessibility`.

## Source truth

Token names are backbone. Values are project decisions.

Core token families should be stable across craft-based builds:

- `--l-*` layout structure
- `--s-*` space and shape
- `--t-*` typography
- `--c-*` color
- `--m-*` motion
- `--i-*` interaction state
- `--z-*` stack order

`--e-*` is element/component skin. It is meant to be adaptable by project while still connecting UI to core token roles.

## Ownership layers by job

Use CSS ownership by responsibility, not by implementation file name.

| Owner | Owns |
| --- | --- |
| token source | core custom properties, theme outputs, motion/state tokens, element roles |
| reset baseline | element defaults, focus, body/html defaults |
| typography layer | type element rules and type utilities |
| grid layer | `[g]`, `[c]`, `[r]`, `[o]` behavior |
| layout/primitive layer | `.c`, `.w`, `.crd`, `.btns`, `.lnks`, tiny primitives |
| motion layer | view/scroll/page motion hooks |
| component-owned styles | component selectors, component variants, private component vars |
| utility layer | rare final-purpose utilities |

Exact files and build layers belong to implementation docs, not craft.

## Token decision tree

1. Is the value repeated, systemic, or themeable?
   - Yes: use or create a global token in correct family.
   - No: use component-local custom property.
2. Is the value layout structure?
   - Use `--l-*` or `--z-*`.
3. Is the value spacing, radius, or border width?
   - Use `--s-*`.
4. Is the value typography?
   - Use `--t-*`.
5. Is the value semantic color, ramp, state, or alpha role?
   - Use `--c-*`.
6. Is the value reusable primitive/component skin?
   - Use `--e-*`.
7. Is the value animation timing or interaction state?
   - Use `--m-*` or `--i-*`.
8. Is responsive behavior fluid or direct?
   - Either is valid. Components consume final tokens either way.

Pre-flight before adding a token:

- name family by job;
- check existing token source;
- avoid arbitrary values in docs/examples;
- prefer local var for one-off art direction;
- add `--e-*` only for reusable/themeable element or component skin.

## Default token names

### Layout

- `--l-mw`, `--l-mw-sm`, `--l-mw-lg`
- `--l-gc`, `--l-cs`, `--l-rs`, `--l-or`
- `--l-st`
- `--z-base`, `--z-head`, `--z-pop`, `--z-modal`, `--z-toast`

Use `--z-*` for consumed stack order. If a project uses layout config to derive stack tokens, keep consumed API as `--z-*`.

### Space and shape

- `--s-py`, `--s-px`, `--s-ss`, `--s-gp`, `--s-pd`
- `--s-br`, `--s-br-pill`
- `--s-bw`
- optional scale variants: `-xl`, `-lg`, `-sm`, `-xs`

### Typography

- families: `--t-ff-ss`, `--t-ff-se`, `--t-ff-mo`, `--t-ff-hand`, `--t-ff-display`
- features: `--t-ffs`
- weights: `--t-fw-l`, `--t-fw-r`, `--t-fw-b`
- hierarchy: `--t-h0` … `--t-h6`, `--t-lg`, `--t-md`, `--t-sm`
- parts: `-fs`, `-ff`, `-fw`, `-lh`, `-ls`, `-mw`, `-tt`

Example shape, value intentionally omitted:

```css
:root {
  --t-h1-fs: /* project value */;
  --t-h1-ff: /* project value */;
  --t-h1-fw: /* project value */;
  --t-h1-lh: /* project value */;
  --t-h1-ls: /* project value */;
  --t-h1-mw: /* project value */;
  --t-h1-tt: /* project value */;
  --t-h1: var(--t-h1-fw) var(--t-h1-fs) / var(--t-h1-lh) var(--t-h1-ff);
}
```

### Responsive token modes

Fluid mode uses editable config tokens and derived consumed tokens:

```css
:root {
  --s-gp-min: /* project value */;
  --s-gp-max: /* project value */;
  --s-gp: clamp(var(--s-gp-min) * 1rem, var(--s-gp-min) * 1rem + (var(--s-gp-max) - var(--s-gp-min)) * var(--l-fluid), var(--s-gp-max) * 1rem);
}
```

Direct mode skips `-min/-max` and overrides consumed tokens:

```css
:root {
  --t-h1-fs: /* project value */;
}

@media (width < 60rem) {
  :root {
    --t-h1-fs: /* project value */;
  }
}
```

Components consume `--t-h1-fs`, `--s-gp`, `--l-mw`, etc. They should not depend on whether token values come from fluid math or direct overrides.

### Color

Base semantic roles:

```txt
--c-bg   page or themed region background
--c-fg   page or themed region foreground
--c-sur  raised/subtle surface
--c-ink  strong readable text
--c-mut  muted text
--c-bor  border
```

Ramps:

- `--c-neu-*` neutral tones
- `--c-acc-*` accent tones
- `--c-sec-*` secondary paired tones
- `--c-bg-*` and `--c-fg-*` alpha roles

State colors:

- `--c-good-*`
- `--c-warn-*`
- `--c-bad-*`

Theme scopes remap `--c-bg`, `--c-fg`, `--c-sur`, `--c-ink`, `--c-mut`, and `--c-bor`. Components consume semantic roles or element tokens derived from them.

Formula examples are allowed because relationship is lesson:

```css
:root,
[data-theme] {
  --c-neu-50: color-mix(in srgb, var(--c-dark) 50%, var(--c-light));
  --c-bg-40: color-mix(in srgb, var(--c-bg) 40%, transparent);
}
```

### Motion and interaction

- `--m-tf-i`, `--m-tf-o`, `--m-tf-io`, `--m-tf`, optional expressive timing tokens
- `--m-td-sf`, `--m-td-f`, `--m-td`, `--m-td-s`, `--m-td-ss`
- `--i-hov-t/f`, `--i-foc-t/f`, `--i-prs-t/f`, `--i-exp-t/f`

Reduced motion must collapse duration and avoid uncomfortable transform/scroll effects.

### Element tokens

Allowed starter set:

- `--e-head-*`
- `--e-foot-*`
- `--e-btn-*`
- `--e-crd-*`
- `--e-inp-*`
- `--e-bdg-*`

`--e-*` tokens are theme-dependent skins. They may vary by project. Do not create global `--e-*` for one-off component internals.

Good:

```css
.btn.accent {
  --e-btn-sur: var(--c-acc-sur);
  --e-btn-ink: var(--c-acc-ink);
}
```

Avoid global element debt for one-off art direction:

```css
/* Avoid */
:root { --e-testimonial-avatar-ring: /* one-off value */; }
```

## Accessibility contract

Color roles that create foreground/background pairs must be checked as pairs across:

- default
- themed
- hover
- focus
- disabled/muted
- state feedback

Focus states, form errors, and async status must have semantic markup and visible/text feedback, not color alone.

## Authoring rule

Docs should show exact token names. Avoid arbitrary literal values in examples unless the value expresses relationship, formula, accessibility requirement, or browser behavior.

## Applied patterns

### Core token stable, value local

```css
:root {
  --t-h2-fs: /* project value */;
  --t-h2-lh: /* project value */;
  --s-gp: /* project value */;
}
```

Decision: names are contract; values are project-owned.

### Fluid implementation, stable consumption

```css
:root {
  --t-h2-fs-min: /* project value */;
  --t-h2-fs-max: /* project value */;
  --t-h2-fs: clamp(var(--t-h2-fs-min) * 1rem, var(--t-h2-fs-min) * 1rem + (var(--t-h2-fs-max) - var(--t-h2-fs-min)) * var(--l-fluid), var(--t-h2-fs-max) * 1rem);
}

h2 { font-size: var(--t-h2-fs); }
```

Decision: formula can vary; consumed token stays stable.

### Element token earned

```css
.badge {
  background: var(--e-bdg-sur);
  color: var(--e-bdg-ink);
  border-color: var(--e-bdg-bor);
}
```

Decision: `--e-bdg-*` is valid when badge is reusable/themeable.
