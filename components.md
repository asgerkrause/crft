---
scope: snz-craft
layer: components
triggers:
  - components
  - primitives
  - props
  - folders
  - cards
  - buttons
  - refactor
updated: 2026-05-28
---

# Components craft

## Extract when boundary earns itself

ID: components.extraction-threshold
Status: Default
Triggers: component, extract, reuse, complexity, primitive, design system, architecture
Use when: Deciding component boundaries.
Rule: Use hybrid extraction: small primitives plus larger components when useful. Avoid premature design systems; build reusable primitives when repetition is obvious.
Tradeoff: Fewer abstractions early; clearer reuse later.
Override: Existing system already provides component boundaries.
Tiny example:
Good: `Card` after third repeated card shape.
Avoid: `FeatureContentWrapper` for one section.
Related: frontend.extraction-rhythm, frontend.page-anatomy

## Prefer focused primitives

ID: components.primitives
Status: Default
Triggers: section, grid, container, card, button, link, media wrapper, primitive classes
Use when: Creating or recognizing reusable UI pieces.
Rule: Good primitives are focused: `Section`, `Grid`, `.c`, `.w`, `.crd`/`Card`, `.btn`/`Button`, `.lnk`/`Link`, media wrappers. Avoid god components.
Tradeoff: Primitives compose well; too many tiny primitives can obscure markup.
Override: Project uses plain markup or a different coherent primitive set.
Tiny example:
Good: `.crd`/`Card` owns surface/padding/radius; content remains slots/children.
Avoid: `UniversalSection` with dozens of visual and content props.
Related: styling.primitive-classes, frontend.deliberate-primitives

## Let CSS own visual state

ID: components.css-owns-visual-state
Status: Default
Triggers: state, visual state, aria-expanded, active, selected, js state, classes
Use when: Adding interactivity.
Rule: JS should manage state/attributes; CSS should handle visual states when possible.
Tradeoff: Less JS and better a11y hooks; complex animation sequencing may need JS.
Override: Framework state or animation library owns visual transition for good reason.
Tiny example:
Good: button toggles `aria-expanded`; CSS reads `:has([aria-expanded="true"])`.
Avoid: JS adding `.open` only for styling.
Related: styling.semantic-selectors, platform.small-js, navigation.header-menu

## Props stay explicit and concise

ID: components.explicit-props
Status: Default
Triggers: props, content object, variants, component api, cms, slots, children
Use when: Designing component APIs.
Rule: Prefer explicit concise props like `title`, `text`, `items`, `href`, `label`, `theme`, `size`. Use slots/children for layout primitives. Avoid broad `content` objects unless data comes from CMS/content files.
Tradeoff: Props stay readable; CMS-driven content may need object shapes.
Override: Existing data model or content collections already provide structured objects.
Tiny example:
Good: `<Card title={item.title} text={item.text} href={item.href} />` or `<article class="crd">…</article>` for plain markup.
Avoid: `<Card content={everything} variant="largeBlueThing" />`.
Related: naming.props-state

## Variants name purpose

ID: components.purposeful-variants
Status: Default
Triggers: variants, button variants, size, theme, props, visual trivia
Use when: Naming visual variants.
Rule: Keep variants small and named by purpose, not visual trivia.
Tradeoff: Variants remain semantic; some design systems may need visual names.
Override: Project design system already defines visual variant taxonomy.
Tiny example:
Good: `accent`, `secondary`, `danger`, `sm`, `lg`.
Avoid: `blueShadowRounded`, `leftIconBig`.
Related: naming.short-clear, tokens.semantic-colors

## Folder depth reduces scan cost

ID: components.folder-depth
Status: Default
Triggers: folders, component structure, ui folder, layout folder, global components
Use when: Organizing components.
Rule: Default to `components/global`, `components/ui`, `components/layout`, `components/media`, `components/text` when it reduces scan cost. Simpler projects can stay flat.
Tradeoff: Folders aid navigation; premature folders create ceremony.
Override: Project framework or existing convention differs.
Tiny example:
Good: add `components/media` when media wrappers repeat.
Avoid: seven empty folders in small site.
Related: frontend.refactor-boundary

## Refactor within task boundary

ID: components.refactor-boundary
Status: Default
Triggers: refactor, cleanup, scope, nearby code, component cleanup
Use when: Improving touched code.
Rule: Improve structure while touching code when it directly improves current task quality. Do not turn every task into cleanup.
Tradeoff: Maintains velocity and quality; deeper debt needs explicit task.
Override: User asks for refactor or current structure blocks safe change.
Tiny example:
Good: extract repeated button group while adding third use.
Avoid: rebuilding whole design system during nav fix.
Related: frontend.refactor-boundary
