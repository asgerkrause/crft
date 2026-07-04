---
scope: craft
layer: components
triggers:
  - components
  - primitives
  - props
  - cards
  - buttons
  - element tokens
updated: 2026-07-01
---

# Components craft

Related: `tokens`, `naming`, `styling`, `performance`, `accessibility`.

## Component is boundary, not folder

ID: components.boundary-not-folder
Status: Must
Triggers: component, folder, abstraction, extraction
Use when: Deciding whether to create a component.
Rule: Component earns itself through reuse, state, complexity, authoring clarity, or primitive ownership. Do not componentize every wrapper.
Tradeoff: Some duplication remains; structure stays readable.
Override: Starter systems require stable primitives for authors.
Tiny example:
Good: `Card` owns repeated surface/padding/radius behavior.
Avoid: `HeroInnerContentWrapper` for one layout div.

## Slots over configuration

ID: components.slots-over-config
Status: Default
Triggers: slots, props, config object, layout component
Use when: Designing component APIs.
Rule: Layout components accept content through slots/children. Props stay explicit and concise. Avoid object-shaped config unless a data source requires it.
Tradeoff: Markup remains visible; complex CMS records may need structure.
Override: Data-driven collections already provide object records.
Tiny example:
Good: `<Card><h3>Fast</h3><p>Static output.</p></Card>`.
Avoid: `<Card config={everything} />`.

## Extract when boundary earns itself

ID: components.extraction-threshold
Status: Default
Triggers: component, extract, reuse, complexity, primitive, design system
Use when: Deciding component boundaries.
Rule: Use hybrid extraction: stable primitives plus larger components when repetition or complexity earns them. Avoid premature design-system sprawl.
Tradeoff: Fewer abstractions early; clearer reuse later.
Override: Existing project already provides coherent component boundaries.
Tiny example:
Good: `Card` after repeated card shape.
Avoid: `FeatureContentWrapper` for one section.

## Primitive set stays small

ID: components.primitive-set-small
Status: Default
Triggers: primitives, design system, section, grid, card, button
Use when: Adding shared building blocks.
Rule: Prefer a small durable primitive set: Section, Grid, Card, Button, Link, Image, Form fields, and simple wrappers. New primitives need repeated ownership.
Tradeoff: Fewer abstractions; stronger composition.
Override: Product UI library with broader interaction needs.
Tiny example:
Good: `Section` + `Grid` + `Card` compose a feature area.
Avoid: separate primitive for every visual wrapper.

## Prefer focused primitives

ID: components.primitives
Status: Default
Triggers: section, grid, container, card, button, link, media wrapper, primitive classes
Use when: Creating or recognizing reusable UI pieces.
Rule: Good primitives are focused: `Section`, `Grid`, `.c`, `.w`, `.crd`/`Card`, `.btn`/`Button`, `.lnk`/`Link`, media wrappers. Avoid god components.
Tradeoff: Primitives compose well; too many tiny pieces can obscure markup.
Override: Project uses plain markup or a different coherent primitive set.
Tiny example:
Good: `.crd` owns surface/padding/radius; content remains slots/children.
Avoid: `UniversalSection` with dozens of visual and content props.

## Official primitives use `--e-*`

ID: components.element-tokens
Status: Default
Triggers: button tokens, card tokens, input tokens, badge tokens, header tokens, footer tokens
Use when: Styling shared primitives or regions.
Rule: Official primitives and regions use element tokens: `--e-btn-*`, `--e-crd-*`, `--e-inp-*`, `--e-bdg-*`, `--e-head-*`, `--e-foot-*`. Private component details use component-local vars.
Tradeoff: Central themes can skin primitives; one-off `--e-*` creates global debt.
Override: Component detail is not a shared primitive or theme target.
Tiny example:
Good: `.btn.ghost { --e-btn-sur: transparent; --e-btn-ink: var(--c-ink); }`
Avoid: `--e-pricing-feature-icon-glow`.

## CSS owns visual state

ID: components.css-owns-visual-state
Status: Default
Triggers: state, visual state, aria-expanded, active, selected, js state, classes
Use when: Adding interactivity.
Rule: JS manages truthful state/attributes; CSS handles visual state using attributes, `:has()`, and `--i-*` tokens when possible.
Tradeoff: Less JS and better accessibility hooks; complex sequencing may still need JS.
Override: Framework state or animation library owns visual transition for good reason.
Tiny example:
Good: button toggles `aria-expanded`; CSS reads `[aria-expanded="true"]` and `--i-exp-t`.
Avoid: JS adding `.open` only for styling.

## Props stay explicit and concise

ID: components.explicit-props
Status: Default
Triggers: props, content object, variants, component api, cms, slots, children
Use when: Designing component APIs.
Rule: Prefer explicit concise props like `title`, `text`, `items`, `href`, `label`, `theme`, `size`. Use slots/children for layout primitives.
Tradeoff: Props stay readable; CMS-driven content may need object shapes.
Override: Existing data model already provides structured objects.
Tiny example:
Good: `<Card><h3>Fast</h3><p>Static output.</p></Card>`.
Avoid: `<Card content={everything} variant="largeBlueThing" />`.

## Variants name purpose

ID: components.purposeful-variants
Status: Default
Triggers: variants, button variants, size, theme, props, visual trivia
Use when: Naming visual variants.
Rule: Keep variants small and named by purpose: `tone`, `accent`, `secondary`, `ghost`, `outlined`, `sm`, `lg`.
Tradeoff: Variants stay semantic; some design systems may need visual names.
Override: Project design system already defines another taxonomy.
Tiny example:
Good: `variant="accent"`, `size="lg"`.
Avoid: `variant="blueShadowRounded"`.

## Refactor within task boundary

ID: components.refactor-boundary
Status: Default
Triggers: refactor, cleanup, scope, nearby code, component cleanup
Use when: Improving touched component code.
Rule: Improve structure while touching code only when it directly improves current task quality. Do not turn token work into component API redesign.
Tradeoff: Maintains velocity and quality.
Override: Current structure blocks safe migration.
Tiny example:
Good: centralize shared button skin while migrating `Button` and `Submit`.
Avoid: rebuilding all form APIs during color-token migration.

## Applied patterns

### Primitive earned by repetition

```html
<article class="crd">...</article>
<article class="crd">...</article>
<article class="crd">...</article>
```

Decision: repeated surface/padding/radius earns `.crd` or `Card` primitive.

### Slot content over config

```html
<Card>
  <h3>...</h3>
  <p>...</p>
</Card>
```

Decision: content remains visible; component owns surface only.

### Avoid shallow wrapper

```html
<!-- Avoid extracting one-off wrapper component -->
<div class="hero-copy">...</div>
```

Decision: keep inline until reuse, state, or complexity earns boundary.
