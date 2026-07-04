---
scope: craft
layer: navigation
triggers:
  - header
  - nav
  - menu
  - aria-expanded
  - footer
updated: 2026-07-01
---

# Navigation craft

Related: `accessibility`, `motion`, `tokens`, `styling`.

## Header and footer are element regions

ID: navigation.region-tokens
Status: Default
Triggers: header, footer, e-head, e-foot, region tokens
Use when: Styling global site chrome.
Rule: Use `--e-head-*` for header skin and dimensions, `--e-foot-*` for footer skin. Use `--z-head` for fixed/sticky header stacking.
Tradeoff: Site chrome becomes themeable; region tokens should stay few.
Override: One-off landing page with no reusable chrome.
Tiny example:
Good: `background: var(--e-head-sur); color: var(--e-head-ink); border-color: var(--e-head-bor);`
Avoid: header-private color vars when same role exists globally.

## Header menu uses semantic state

ID: navigation.header-menu
Status: Default
Triggers: menu, mobile nav, aria-expanded, disclosure, hamburger
Use when: Building responsive header menus.
Rule: Use a real `<button>` with `aria-controls` and `aria-expanded`. JS toggles state; CSS reads `[aria-expanded="true"]`, `:has()`, and `--i-exp-*`.
Tradeoff: Strong semantic baseline; CSS needs careful selectors.
Override: Framework router/menu component already owns equivalent semantics.
Tiny example:
Good: `<button aria-expanded="false" aria-controls="primary-nav">Menu</button>`.
Avoid: clickable div or `.is-open` without ARIA.

## Nav lists stay semantic

ID: navigation.semantic-list
Status: Default
Triggers: nav, ul, menu list, links, current page
Use when: Marking up navigation.
Rule: Use `<nav aria-label>`, list markup, and real links. Active route uses `aria-current="page"`.
Tradeoff: Slightly more markup; better navigation semantics.
Override: Extremely small inline link pair where list adds no value.
Tiny example:
Good: `<a aria-current="page" href="/work/">Work</a>`.
Avoid: `.active` class as only current state.

## Mobile overlays do not trap accidentally

ID: navigation.mobile-overlay
Status: Default
Triggers: mobile menu, overlay, fixed nav, pointer events, focus
Use when: Menu covers page content.
Rule: When menu is open, prevent background interaction and keep focus order understandable. Close on Escape when JS owns disclosure behavior.
Tradeoff: More behavior checks; avoids inaccessible overlays.
Override: Menu is inline and does not cover or obscure content.
Tiny example:
Good: `body:has(header [aria-expanded="true"]) :is(main, footer) { pointer-events: none; }` plus truthful button state.
Avoid: visual overlay that leaves hidden links/focusable content active.

## Applied patterns

### Menu disclosure

```html
<header>
  <button type="button" aria-controls="primary-nav" aria-expanded="false">Menu</button>
  <nav id="primary-nav" aria-label="Primary">...</nav>
</header>
```

Decision: button state is semantic; CSS reads `[aria-expanded]`.

### Current route

```html
<nav aria-label="Primary">
  <ul>
    <li><a href="/" aria-current="page">Home</a></li>
  </ul>
</nav>
```

Decision: route state is semantic, not only visual.

### Overlay safety

```css
body:has(header [aria-expanded="true"]) main {
  pointer-events: none;
}
```

Decision: covered background should not remain interactive.
