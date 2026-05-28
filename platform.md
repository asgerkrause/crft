---
scope: snz-craft
layer: platform
triggers:
  - html
  - css
  - javascript
  - browser api
  - semantic html
  - native css
  - platform
updated: 2026-05-28
---

# Platform craft

Modern frontend defaults. If platform already does it, let it.

## Platform before library

ID: platform.platform-first
Status: Default
Triggers: library, framework, dependency, browser api, vanilla js, platform, native
Use when: Choosing between platform feature and dependency/abstraction.
Rule: Try semantic HTML, CSS, and browser APIs before adding library or framework ceremony.
Tradeoff: Less code and less dependency surface; some complex interactions still deserve a library.
Override: Project already depends on suitable library, accessibility would be weaker, or deadline favors proven abstraction.
Tiny example:
Good: `<dialog>`, `popover`, `<details>`, `AbortController`, `URLPattern` when supported.
Avoid: adding modal/dropdown/fetch utility packages for trivial platform behavior.
Related: components.extraction-threshold, navigation.header-menu

## Syntax baseline

ID: platform.syntax-baseline
Status: Default
Triggers: native css nesting, css, has, container queries, oklch, hsl, color-mix, logical properties
Use when: Writing modern frontend code.
Rule: Use modern platform syntax: native CSS nesting, `:has()`, container queries, logical properties, `color-mix()`, and authored `hsl()`/`oklch()` where project support allows.
Tradeoff: Cleaner code and fewer JS hooks; browser support must match project target.
Override: Legacy browser target or project toolchain forbids feature.
Tiny example:
Good:
```css
.card {
  container-type: inline-size;

  &:has(a:hover) {
    border-color: color-mix(in hsl, var(--a), var(--b));
  }
}
```
Avoid: JS class toggles and breakpoint-only layout when CSS can derive state/space.
Related: styling.semantic-selectors, styling.nesting-depth

## Use right element before ARIA

ID: platform.semantic-html
Status: Must
Triggers: html, aria, semantic html, accessibility, button, link, dialog, details, search
Use when: Markup choice affects behavior or accessibility.
Rule: Use correct HTML element before adding ARIA. Accessibility starts with labels, DOM order, focus, motion preferences, and semantics.
Tradeoff: Native constraints shape design; custom UI has higher implementation burden.
Override: Native element cannot meet required interaction and custom pattern is fully accessible.
Tiny example:
Good: `<button>` for actions, `<a>` for navigation, `<search>` around search forms, `<details><summary>` for disclosure.
Avoid: clickable `<div>` with ARIA trying to imitate native controls.
Related: forms.labels-first, navigation.header-menu

## Cascade over override

ID: platform.cascade-over-override
Status: Default
Triggers: cascade, specificity, !important, css layers, reset, utilities, override
Use when: Organizing CSS or fixing style conflicts.
Rule: Use cascade layers and low-specificity selectors before stronger overrides. Keep specificity flat; avoid IDs, `!important`, and long descendant chains.
Tradeoff: Requires system thinking; prevents specificity wars.
Override: Third-party CSS or emergency hotfix may need isolated override with comment.
Tiny example:
Good: reset → base → layout → components → utilities; `:where()` for broad low-specificity selectors.
Avoid: `#app main .section .card .title { ... !important; }`
Related: styling.nesting-depth, styling.theme-cascade

## JavaScript stays small and cancellable

ID: platform.small-js
Status: Default
Triggers: javascript, event listeners, fetch, async, abortcontroller, custom elements, state
Use when: Adding browser behavior.
Rule: Use browser APIs, ES modules, `async`/`await`, `AbortController`, optional chaining, nullish coalescing, and readable loops. Keep toolchain small.
Tradeoff: Less abstraction; larger stateful flows may need framework patterns.
Override: Project framework already owns state/effects, or library improves accessibility/reliability.
Tiny example:
Good: JS toggles `aria-expanded`; CSS reads state.
Avoid: JS calculating visual state that CSS can derive.
Related: styling.semantic-selectors, navigation.header-menu

## Drop legacy defaults

ID: platform.drop-legacy
Status: Avoid
Triggers: var, jquery, lodash, webpack, polyfill, iife, bind, arguments, json clone
Use when: Reviewing or adding foundational code.
Rule: Avoid `var`, `arguments`, IIFEs, old `apply`/`bind`, jQuery/Lodash for trivial platform features, CSS preprocessors as default, Webpack by default, evergreen polyfill bloat, JSON clone tricks.
Tradeoff: Modern platform code is simpler; older codebases may still require compatibility.
Override: Existing legacy project constraint or browser support requirement.
Tiny example:
Good: `structuredClone(value)`, `toSorted()`, `AbortController`.
Avoid: `JSON.parse(JSON.stringify(value))` for deep clone.
Related: platform.small-js
