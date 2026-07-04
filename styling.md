---
scope: craft
layer: styling
triggers:
  - css
  - selector
  - nesting
  - layers
  - tokens
  - classes
updated: 2026-07-01
---

# Styling craft

Related: `tokens`, `token-contract`, `naming`, `components`, `accessibility`.

## Native CSS before tooling

ID: styling.native-css
Status: Default
Triggers: css, modern css, utilities, preprocessor, browser platform
Use when: Choosing styling tools or writing new UI CSS.
Rule: Prefer native CSS features before utilities, preprocessors, animation libraries, or JS layout: cascade layers, nesting, custom properties, container queries, logical properties, `:has()`, and `color-mix()`.
Tradeoff: Requires browser-platform fluency; fewer dependencies and less generated noise.
Override: Existing project uses a coherent styling system and migration is not in scope.
Tiny example:
Good: `:has([aria-expanded="true"])` for open-state styling.
Avoid: JS class choreography for every visual state.

## Progressive enhancement first

ID: styling.progressive-enhancement
Status: Must
Triggers: baseline, browser support, modern css, progressive enhancement
Use when: Using newer CSS features.
Rule: Modern CSS may enhance experience, but core content, navigation, forms, and readable layout must survive feature gaps.
Tradeoff: Sometimes needs fallback shape; experience stays robust.
Override: Internal prototypes with controlled browser target.
Tiny example:
Good: content remains readable if a decorative `color-mix()` enhancement differs.
Avoid: hiding primary navigation behind unsupported CSS behavior.

## Container queries for component response

ID: styling.container-queries
Status: Default
Triggers: container query, responsive component, card, component layout
Use when: Component layout depends on parent size.
Rule: Use container queries for component responsiveness. Use viewport media queries for page-level layout shifts.
Tradeoff: Component CSS becomes more portable; requires explicit container ownership.
Override: Global page choreography where viewport width is the real condition.
Tiny example:
Good: `.cards { container: cards / inline-size; } @container cards (width < <compact-threshold>) { ... }`
Avoid: viewport breakpoints for every card variant.

## Elements and state before classes

ID: styling.semantic-selectors
Status: Default
Triggers: css, selectors, classes, aria, data attributes, state styling, semantic html
Use when: Styling component structure or state.
Rule: Prefer elements, attributes, ARIA states, `:has()`, and local structure before adding classes.
Tradeoff: Markup stays truthful; selectors need care to avoid brittle deep chains.
Override: Existing component library owns class-based state coherently.
Tiny example:
Good: `header:has([aria-expanded="true"]) nav { opacity: 1; }`
Avoid: `.menu.is-open { opacity: 1; }`

## Tokens before hardcoded values

ID: styling.tokens-first
Status: Default
Triggers: tokens, spacing, color, radius, hardcoded values, css variables
Use when: Adding spacing, color, radius, type, border, or motion.
Rule: Use craft tokens first: `--l-*`, `--s-*`, `--t-*`, `--c-*`, `--e-*`, `--m-*`, `--i-*`, `--z-*`. Extend token engine before scattering hardcoded values.
Tradeoff: Consistency and theming improve; tiny one-offs take more thought.
Override: Prototype spike, isolated third-party embed, or explicit local art direction.
Tiny example:
Good: `padding: var(--s-pd); color: var(--c-mut); border-radius: var(--s-br);`
Avoid: `padding: <one-off>; color: <raw-color>; border-radius: <one-off>;`

## CSS ownership stays split by job

ID: styling.css-ownership
Status: Default
Triggers: global css, token source, reset baseline, component css, style ownership, css split
Use when: Organizing CSS or deciding where a rule belongs.
Rule: Keep CSS split by owner: token source owns tokens/theme/elements; reset baseline owns baseline; typography layer owns type; grid layer owns grid attributes; layout/primitive layer owns layout primitives; motion layer owns motion hooks. Component-specific selectors live with component CSS.
Tradeoff: More files; lower scan cost and cleaner ownership.
Override: Tiny one-file project where ownership is still obvious.
Tiny example:
Good: `.crd` primitive in primitive layer; `.testimonial` in component CSS.
Avoid: dumping `.faq`, `.slider`, or private roots into global CSS.

## Specificity budget stays low

ID: styling.specificity-budget
Status: Must
Triggers: specificity, selector conflict, override, cascade
Use when: A style does not apply or conflicts with another rule.
Rule: Fix ownership, layer order, or token flow before increasing selector specificity.
Tradeoff: Slower conflict resolution; prevents cascade debt.
Override: Third-party embed override isolated to one boundary.
Tiny example:
Good: move component selector into component CSS layer.
Avoid: `body main section .card.card.card { ... }`

## Layers own cascade order

ID: styling.layer-order
Status: Default
Triggers: css layers, cascade, specificity, imports, generated css
Use when: Adding global or generated CSS.
Rule: Use layer order for cascade control. Do not fight component CSS with specificity hacks. Reserve late layers for component-owned and page-owned styles when an implementation needs them.
Tradeoff: Requires planning layer order; avoids selector escalation.
Override: None for craft-based projects.
Tiny example:
Good: `@layer settings, palette, theme, elements, reset, grid, typography, layout, primitives, motion, components, pages, utilities;`
Avoid: `body main section .card.card.card { ... }`

## Keep CSS nesting shallow

ID: styling.nesting-depth
Status: Default
Triggers: css nesting, nested css, selectors, section css, component css
Use when: Writing nested CSS.
Rule: Use native CSS nesting for locality, but cap normal nesting at 3 levels. Flatten or add a clearer hook if selector mirrors DOM too deeply.
Tradeoff: Local CSS remains readable.
Override: One extra level is acceptable for state + child + pseudo when clarity improves.
Tiny example:
Good: `details { &[open] { summary { ... } } }`
Avoid: `header { nav { ul { li { a { span { ... } } } } } }`

## Classes are durable primitives, not reflexes

ID: styling.primitive-classes
Status: Default
Triggers: classes, utility classes, primitive classes, c, w, crd, btn, lnk
Use when: Naming repeated styling hooks or deciding whether class is needed.
Rule: Use classes for durable primitives and repeated component patterns. Prefer semantic state/structure over one-off classes.
Tradeoff: Short primitives speed markup; too many utility classes create naming debt.
Override: Existing project naming is coherent and migration is not in scope.
Tiny example:
Good: `.c`, `.w`, `.crd`, `.btn`, `.btns`, `.lnk`, `.lnks`.
Avoid: `.menu-open`, `.section-inner-wrapper`, `.blue-card-2`.

## Theme scopes should cascade

ID: styling.theme-cascade
Status: Default
Triggers: data-theme, theme, dark mode, color override, themed section, tokens
Use when: Styling inside themed sections or color modes.
Rule: Put theme on outer scope and let descendants adapt through `--c-*` and `--e-*`. Avoid manual color overrides when tokens already handle it.
Tradeoff: Less local control; stronger consistency.
Override: Intentional art direction needs one local token-backed exception.
Tiny example:
Good: `<section data-theme="tone">` with children using `var(--c-bg)`, `var(--c-ink)`, `var(--e-btn-sur)`.
Avoid: setting raw backgrounds/text colors on every child.

## Grep custom properties safely

ID: styling.safe-grep
Status: Must
Triggers: grep, rg, find replace, token migration, --s, --t, --c
Use when: Searching or migrating CSS custom properties.
Rule: Use `rg -- 'pattern'` so patterns starting with `--` are not parsed as flags. Use boundary-aware regex for old short tokens.
Tradeoff: More typing; avoids false matches and broken commands.
Override: None for token work.
Tiny example:
Good: `rg -- 'var\(--s-gp\b' src`
Avoid: `rg --s-gp src` or broad replace of `s`/`t`/`c`.

## Applied patterns

### State through attributes

```html
<button type="button" aria-expanded="false" aria-controls="menu">Menu</button>
<nav id="menu">...</nav>
```

```css
header:has([aria-expanded="true"]) nav {
  opacity: 1;
  pointer-events: auto;
}
```

Decision: JS changes truthful state; CSS owns visual state.

### Specificity fix through ownership

```css
/* Prefer moving rule to component-owned CSS */
.card-title { color: var(--c-ink); }
```

Decision: move rule to correct owner before escalating selector specificity.

### Local art value without global token

```css
.feature {
  --feature-media-blend: /* project value */;
}
```

Decision: local property handles one-off art direction.
