---
scope: snz-craft
layer: naming
triggers:
  - naming
  - component names
  - props
  - state
  - handlers
  - abbreviations
updated: 2026-05-28
---

# Naming craft

## Short clear domain names

ID: naming.short-clear
Status: Default
Triggers: naming, components, variables, domain names, abbreviations, clever names
Use when: Naming components, props, state, utilities, or CSS primitives.
Rule: Use short, clear, domain-led names. Avoid clever abbreviations except established primitives.
Tradeoff: Names stay readable in markup; some domain ambiguity may need longer names.
Override: Project naming convention differs.
Tiny example:
Good: `Hero`, `Section`, `Grid`, `Card`, `Header`, `Footer`, `Testimonials`.
Avoid: `Block`, `Thing`, `ContentSection`, `Wrapper` unless truly generic.
Related: components.primitives

## Names should read well in markup

ID: naming.markup-readable
Status: Default
Triggers: markup names, component api, primitives, html readability
Use when: Naming UI primitives and components.
Rule: Prefer names that make markup scan like page structure, not implementation machinery.
Tradeoff: Human-readable markup sometimes hides lower-level detail.
Override: Library/framework naming constraints.
Tiny example:
Good: `<Section><Grid><Card /></Grid></Section>`.
Avoid: `<ContentWrapper><ItemRenderer /></ContentWrapper>`.
Related: frontend.page-anatomy, components.primitives

## Props and state stay concise

ID: naming.props-state
Status: Default
Triggers: props, state, handlers, names, boolean, active id, selected
Use when: Naming props, state, and handlers.
Rule: Prefer concise explicit names: `title`, `eyebrow`, `text`, `items`, `href`, `label`, `theme`, `size`, `isOpen`, `activeId`, `selected`, `openMenu`, `closeMenu`, `submitForm`.
Tradeoff: Short names need local context; add specificity when ambiguity exists.
Override: Domain has two similar concepts requiring explicit names.
Tiny example:
Good: `statusLabel` unless another status label exists nearby.
Avoid: `customerStatusLabel` when no ambiguity exists.
Related: components.explicit-props

## Established primitive abbreviations are allowed

ID: naming.primitive-abbreviations
Status: Default
Triggers: abbreviations, c, w, btn, crd, lnk, primitive classes
Use when: Naming global CSS primitives.
Rule: Short primitive abbreviations are acceptable when established and repeated: `.c`, `.w`, `.btn`, `.btns`, `.crd`, `.lnk`, `.lnks`.
Tradeoff: Compact markup; newcomers need file map/context.
Override: Existing project uses longer coherent names like `.container`, `.card`, `.button`.
Tiny example:
Good: `.btn` for button/link button primitive.
Avoid: inventing new unexplained abbreviations for one-off styling.
Related: styling.primitive-classes
