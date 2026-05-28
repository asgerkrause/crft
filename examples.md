---
scope: snz-craft
layer: examples
triggers:
  - examples
  - pattern
  - disclosure
  - accordion
  - header
  - responsive nav
  - section pattern
updated: 2026-05-28
---

# Craft examples

Full patterns compose multiple craft rules. Copy structure, not exact visual. CSS is partial by design.

## Disclosure / accordion

ID: examples.disclosure
Status: Default
Triggers: disclosure, accordion, details, summary, faq, open state
Use when: Building FAQ/disclosure behavior.
Rule: Prefer native `<details>` before custom accordion JS. Use CSS and native state first.
Tradeoff: Native behavior is robust; custom animation needs progressive enhancement care.
Override: Design requires interaction native details cannot provide accessibly.
Tiny example:
Good:
```html
<details name="faq">
  <summary>
    <span>Question</span>
    <span class="icn" aria-hidden="true"></span>
  </summary>
  <p>Answer.</p>
</details>
```
```css
@supports selector(details::details-content) {
  details {
    overflow: hidden;

    &::details-content {
      block-size: 0;
      opacity: 0;
      transition:
        block-size var(--td) var(--tf-o),
        opacity var(--td) var(--tf-o);
      transition-behavior: allow-discrete;
    }

    &:open {
      &::details-content {
        block-size: auto;
        opacity: 1;
      }
    }
  }
}
```
Avoid: custom JS accordion before trying native behavior.
Related: platform.semantic-html, motion.css-first, tokens.motion-tokens

## Responsive header menu

ID: examples.responsive-header
Status: Default
Triggers: header, responsive nav, menu, burger, aria-expanded, navigation example
Use when: Building full header/nav pattern.
Rule: Header uses semantic structure. Button toggles `aria-expanded`. CSS reads state with `:has()`.
Tradeoff: Strong semantic baseline; project may need framework-specific route handling.
Override: Existing nav component already handles a11y/state correctly.
Tiny example:
Good:
```html
<header>
  <div class="c">
    <a href="/">Site</a>
    <button type="button" aria-expanded="false" aria-controls="nav" aria-label="Menu"></button>
    <nav id="nav" aria-label="Primary">
      <menu>
        <li><a href="/">Home</a></li>
        <li><a href="/work/">Work</a></li>
        <li><a href="/contact/">Contact</a></li>
      </menu>
    </nav>
  </div>
</header>
```
```css
body > header {
  position: sticky;
  inset-block-start: 0;
  z-index: 1000;
  background: var(--s);
  border-block-end: var(--bw) solid var(--b);

  menu {
    display: flex;
    gap: var(--gp);
    list-style: none;
    margin: 0;
    padding: 0;
  }

  @media (max-width: 48rem) {
    menu {
      opacity: 0;
      pointer-events: none;
      transition: opacity var(--td) var(--tf-o);
    }

    &:has([aria-expanded="true"]) {
      menu {
        opacity: 1;
        pointer-events: auto;
      }
    }
  }
}
```
Avoid: `.nav.is-open` as sole source of truth.
Related: navigation.header-menu, styling.semantic-selectors, motion.css-first

## Section with card grid

ID: examples.section-card-grid
Status: Default
Triggers: section, card grid, cards, features, cta, layout example
Use when: Building common feature/card section.
Rule: Use section job, container, grid, and tokenized cards. Spans signal hierarchy only when content needs it.
Tradeoff: Predictable structure; highly art-directed pages may need custom layout.
Override: Project has established section/card primitives.
Tiny example:
Good:
```html
<section id="features" data-theme="tone">
  <div class="c">
    <header>
      <p class="eb">Features</p>
      <h2>What changes for user</h2>
      <p>Short lead that frames decision.</p>
    </header>
    <div g="3-2">
      <article class="crd">
        <h3>Outcome</h3>
        <p>Why it matters.</p>
      </article>
    </div>
  </div>
</section>
```
Avoid: generic card grid with no hierarchy or section job.
Related: sections.card-groups, grid.attribute-system, tokens.spacing-scale
