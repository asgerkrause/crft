---
scope: snz-craft
layer: styling
triggers:
  - css
  - selector
  - nesting
  - state styling
  - aria
  - classes
  - tokens
updated: 2026-05-28
---

# Styling craft

## Elements and state before classes

ID: styling.semantic-selectors
Status: Default
Triggers: css, selectors, classes, aria, data attributes, state styling, semantic html
Use when: Styling component structure or state.
Rule: Prefer elements, attributes, ARIA states, `:has()`, and local structure before adding classes.
Tradeoff: Markup stays truthful and CSS follows semantics; selectors need care to avoid brittle deep chains.
Override: Existing component library or project convention already owns class-based state.
Tiny example:
Good:
```css
header {
  &:has([aria-expanded="true"]) {
    menu {
      opacity: 1;
    }
  }
}
```
Avoid:
```css
.menu.is-open {
  opacity: 1;
}
```
Related: platform.syntax-baseline, navigation.header-menu, styling.nesting-depth

## Keep CSS nesting shallow

ID: styling.nesting-depth
Status: Default
Triggers: css nesting, nested css, selectors, section css, component css
Use when: Writing nested CSS.
Rule: Use native CSS nesting for locality, but cap at 3 levels. If selector needs deeper nesting, flatten it or add a clearer hook.
Tradeoff: Local CSS remains readable without recreating DOM tree in selectors.
Override: One extra level is acceptable for state + child + pseudo/variant when it improves clarity.
Tiny example:
Good:
```css
header {
  &:has([aria-expanded="true"]) {
    menu {
      opacity: 1;
    }
  }
}
```
Avoid:
```css
header {
  nav {
    div {
      ul {
        li a {
          color: currentColor;
        }
      }
    }
  }
}
```
Related: platform.syntax-baseline, styling.semantic-selectors

## Classes are durable primitives, not reflexes

ID: styling.primitive-classes
Status: Default
Triggers: classes, utility classes, primitive classes, c, w, crd, btn, lnk
Use when: Naming repeated styling hooks or deciding whether class is needed.
Rule: Use classes for durable primitives and repeated component patterns; avoid classes for one-off state or structure when semantic selectors work.
Tradeoff: Short primitives speed markup; too many one-off classes create naming debt.
Override: Follow existing project naming, including longer equivalents like `.card`, if coherent.
Tiny example:
Good: `.c`, `.w`, `.crd`, `.btn`, `.btns`, `.lnk`, `.lnks` for repeated primitives.
Avoid: `.section-inner-wrapper`, `.menu-open`, `.blue-card-2` for local one-off needs.
Related: components.primitives, naming.short-clear

## Tokens before hardcoded values

ID: styling.tokens-first
Status: Default
Triggers: tokens, spacing, color, radius, hardcoded values, css variables, custom properties
Use when: Adding spacing, color, radius, type, or motion values.
Rule: Use project tokens first. Extend existing token system before hardcoding values. Prefer CSS custom properties for theme-aware values.
Tradeoff: Consistency and theming improve; tiny one-off values may take more thought.
Override: Prototype spike, isolated third-party embed, or project has no token system and user did not ask to create one.
Tiny example:
Good: `padding: var(--pd); color: var(--g); border-radius: var(--br);`
Avoid: `padding: 27px; color: #777; border-radius: 13px;`
Related: tokens.spacing-scale, tokens.semantic-colors

## Theme scopes should cascade

ID: styling.theme-cascade
Status: Default
Triggers: data-theme, theme, dark mode, color override, themed section, tokens
Use when: Styling inside themed sections or color modes.
Rule: Put theme on outer scope and let descendants adapt through tokens. Avoid manual color overrides inside `data-theme` scopes when tokens already handle it.
Tradeoff: Less local control, more system consistency.
Override: Intentional art direction needs one local exception and remains token-backed.
Tiny example:
Good: `<section data-theme="tone">` with descendants using `var(--s)`, `var(--i)`, `var(--g)`.
Avoid: setting custom text/background colors on every child inside themed scope.
Related: tokens.theme-attributes, sections.section-theme
