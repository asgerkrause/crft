---
scope: snz-craft
layer: frontend
triggers:
  - frontend
  - page
  - section
  - anatomy
  - extraction
  - component structure
  - landing page
updated: 2026-05-28
---

# Frontend craft

## Page anatomy first

ID: frontend.page-anatomy
Status: Default
Triggers: page, landing page, hero, sections, content groups, cta, footer, anatomy
Use when: Starting or reshaping a page.
Thinking: Understand page flow before componentizing. User should be able to scan purpose, proof, offer, action.
Rule: Build page anatomy first: hero, sections, grids, content groups, media, CTA, footer. Extract only after rhythm or complexity appears.
Tradeoff: Keeps flow visible; may duplicate tiny markup briefly.
Override: Existing app architecture requires route-level component composition.
Tiny example:
Good: page file shows major section order; complex/reused areas move to components.
Avoid: every small one-off text block extracted before page story is clear.
Related: sections.page-rhythm, components.extraction-threshold

## Inline until extraction earns itself

ID: frontend.extraction-rhythm
Status: Default
Triggers: extract component, componentization, inline markup, reuse, refactor, page file
Use when: Deciding whether markup becomes component.
Rule: Keep markup inline while it is clearer. Extract when reuse, complexity, or page rhythm makes component boundary useful.
Tradeoff: Avoids premature design systems; large files need periodic trimming.
Override: Repeated component already exists or team/project convention expects extraction.
Tiny example:
Good: one-off simple feature row stays local; reusable card list becomes `Card`/`Grid`.
Avoid: `ContentSection`, `Wrapper`, `Block` components with vague props for one instance.
Related: components.extraction-threshold, naming.short-clear

## Deliberate primitives beat wrapper stacks

ID: frontend.deliberate-primitives
Status: Default
Triggers: wrappers, primitives, container, section, grid, card, layout, component structure
Use when: Building layout scaffolding.
Rule: Prefer deliberate primitives like `Section`, `.c`, `.w`, `Grid`/`[g]`, `.crd`/`Card`, `.btn`/`Button`, media wrappers over ad hoc nested wrappers.
Tradeoff: Stable primitives speed future work; primitives should not become ceremony.
Override: Small static page can use plain semantic markup directly.
Tiny example:
Good: `<section><div class="c w"><div g="3-1">...</div></div></section>`.
Avoid: `<div class="outer"><div class="inner"><div class="content-wrap">...`.
Related: components.primitives, grid.attribute-system, styling.primitive-classes

## Brand controls density and mood

ID: frontend.brand-led-ui
Status: Must
Triggers: brand, visual direction, density, mood, landing page, client copy, ui polish
Use when: Making visual, copy, or interaction choices for client-facing UI.
Thinking: Craft supplies decision process; `BRAND.md` supplies audience, tone, density, mood, vocabulary, and visual direction.
Rule: Check `BRAND.md` before client-facing copy/visual decisions. Do not import SNZ/studio voice as client voice.
Tradeoff: Slower than guessing; prevents brand mismatch.
Override: If no `BRAND.md`, ask or use neutral professional copy.
Tiny example:
Good: choose CTA language from ICP state and brand vocabulary.
Avoid: defaulting to studio tone because craft has strong preferences.
Related: sections.copy-from-icp, sections.one-strong-move

## Clean nearby mess only when it matters

ID: frontend.refactor-boundary
Status: Default
Triggers: refactor, cleanup, nearby mess, implementation quality, scope drift
Use when: Touching code that has adjacent problems.
Rule: Improve nearby structure only when it directly improves current task quality. Avoid broad cleanup drift.
Tradeoff: Keeps quality rising without hijacking scope.
Override: User asks for refactor/audit, or broken structure blocks safe implementation.
Tiny example:
Good: rename one misleading prop while editing component.
Avoid: reorganizing whole component tree during copy tweak.
Related: components.refactor-boundary
