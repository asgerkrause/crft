---
scope: snz-craft
layer: navigation
triggers:
  - navigation
  - header
  - nav
  - menu
  - burger
  - aria-expanded
  - active link
updated: 2026-05-28
---

# Navigation craft

## Header menu uses semantic state

ID: navigation.header-menu
Status: Default
Triggers: header, nav, menu, burger, aria-expanded, responsive nav, mobile menu
Use when: Building responsive header navigation.
Rule: Use semantic header/nav/list/button. JS only toggles `aria-expanded`; CSS reads state from component root with `:has()`.
Tradeoff: Less JS and more truthful state; requires modern selector support.
Override: Existing nav library/framework owns menu state.
Tiny example:
Good:
```html
<header>
  <a href="/">Site</a>
  <button type="button" aria-expanded="false" aria-controls="nav" aria-label="Menu"></button>
  <nav id="nav">
    <menu>
      <li><a href="/">Home</a></li>
    </menu>
  </nav>
</header>
```
```css
header {
  &:has([aria-expanded="true"]) {
    menu {
      opacity: 1;
    }
  }
}
```
Avoid: JS toggling `.is-open` only for styling.
Related: styling.semantic-selectors, platform.semantic-html, motion.css-first

## Navigation labels stay direct

ID: navigation.direct-labels
Status: Default
Triggers: nav labels, menu labels, links, information architecture, header copy
Use when: Writing navigation labels.
Thinking: Nav is orientation, not brand poetry. User should predict destination before clicking.
Rule: Keep nav labels short and direct. Use `BRAND.md` vocabulary only when it improves recognition.
Tradeoff: Less expressive; clearer wayfinding.
Override: Brand/product uses established branded section names.
Tiny example:
Good: Work, Services, Pricing, About, Contact.
Avoid: vague clever labels users cannot predict.
Related: copy.nav-orientation, copy.brand-owns-voice, sections.copy-from-icp

## Active state follows current location

ID: navigation.active-state
Status: Default
Triggers: active link, aria-current, nav state, current page, menu state
Use when: Marking current navigation item.
Rule: Use `aria-current="page"` for current page links and style that attribute.
Tradeoff: Semantics and styling align; route logic must be correct.
Override: App router exposes equivalent active link component that outputs correct ARIA.
Tiny example:
Good: `a[aria-current="page"] { color: var(--a); }`
Avoid: `.active` without semantic current state.
Related: styling.semantic-selectors, platform.semantic-html
