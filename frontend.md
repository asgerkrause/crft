---
scope: craft
layer: frontend
triggers:
  - frontend
  - page
  - section
  - extraction
  - implementation
updated: 2026-07-01
---

# Frontend craft

Related: `sections`, `performance`, `components`, `platform`, `accessibility`.

## Strategy before layout

ID: frontend.strategy-first
Status: Must
Triggers: strategy, landing page, page structure, section order, conversion
Use when: Shaping a page or interface.
Rule: Define the page job before composing sections. Every region must advance awareness, trust, clarity, proof, conversion, or product understanding.
Tradeoff: Fewer decorative sections; stronger narrative.
Override: Experimental brand studies may explore form first, then must resolve back to strategy.
Tiny example:
Good: hero promise → proof → mechanism → offer → CTA.
Avoid: sections added because a template expects them.

## Hero is thesis

ID: frontend.hero-thesis
Status: Default
Triggers: hero, landing page, first screen, visual direction
Use when: Designing above-fold experience.
Rule: Hero must make the page’s core argument through headline, visual system, composition, media, or interaction. Avoid generic SaaS hero defaults unless the brief truly earns them.
Tradeoff: Requires sharper positioning; produces more memorable pages.
Override: Utility pages where speed and clarity matter more than brand impression.
Tiny example:
Good: subject-specific type, crop, object, demo, or material language leads the hero.
Avoid: centered headline, vague subcopy, gradient blob, generic dashboard card.

## Aesthetic risk earns memorability

ID: frontend.aesthetic-risk
Status: Default
Triggers: visual design, premium, brand, art direction, landing page
Use when: Creating important client-facing pages.
Rule: Take one intentional aesthetic risk: type scale, crop, rhythm, color tension, material texture, motion moment, layout break, or interaction. Risk must support strategy.
Tradeoff: More judgment; less template safety.
Override: Conservative brand/legal context where trust depends on restraint.
Tiny example:
Good: oversized editorial type because authority is the message.
Avoid: loud effect that competes with offer clarity.

## Structure is meaning

ID: frontend.structure-meaning
Status: Default
Triggers: information architecture, labels, cards, grids, dividers, numbering
Use when: Organizing content.
Rule: Numbering, labels, dividers, cards, grids, and section breaks must encode content logic. Decoration without meaning is noise.
Tradeoff: Less ornamental clutter; stronger scanning.
Override: Pure atmospheric brand moments may use structure as texture.
Tiny example:
Good: numbered steps only for ordered process.
Avoid: `01 / 02 / 03` markers on unrelated feature cards.

## HTML-first posture

ID: frontend.html-first
Status: Default
Triggers: landing page, static site, frontend, implementation posture
Use when: Building static or mostly content-led interfaces.
Rule: Start with semantic HTML, tokenized CSS, and small vanilla JS only when behavior earns it. No runtime ceremony for static UI.
Tradeoff: Less runtime abstraction; stronger output and fewer dependencies.
Override: App-level state or product UI needs shared runtime state.
Tiny example:
Good: route HTML + component tags + CSS layers.
Avoid: SPA state for static marketing page sections.

## Page anatomy stays simple

ID: frontend.page-anatomy
Status: Default
Triggers: page layout, section composition, landing page
Use when: Composing pages.
Rule: Use shell chrome, route-owned sections, `.c` containers, `.w` rhythm wrappers, grid attributes, and focused components. Avoid block taxonomy sprawl.
Tradeoff: Fast authoring; complex page systems may need presets.
Override: Repeated content pattern earns a component.
Tiny example:
Good: `<Section><div class="w"><h1>...</h1><Button /></div></Section>`.
Avoid: `HeroHeadingWrapperContentInner`.

## Extraction follows repetition

ID: frontend.extraction-rhythm
Status: Default
Triggers: extract component, reusable pattern, duplication
Use when: Deciding whether to create component.
Rule: Keep markup inline until repetition, state, or complexity earns extraction. Extract primitives before god sections.
Tradeoff: Less abstraction up front; occasional duplication acceptable.
Override: Starter systems need stable built-ins for authors.
Tiny example:
Good: extract `Feature` after third repeated feature item.
Avoid: extracting every two-line layout wrapper.

## Refactor stays inside task

ID: frontend.refactor-boundary
Status: Default
Triggers: cleanup, refactor, adjacent improvement, scope
Use when: Improving touched frontend code.
Rule: Clean structure when it directly improves current task safety or quality. Do not turn token updates into broad UI redesign.
Tradeoff: Maintains velocity; deeper debt needs explicit task.
Override: Current structure blocks correct implementation.
Tiny example:
Good: move shared button vars while editing button tokens.
Avoid: redesigning all navigation while renaming spacing vars.

## Translate craft into local idioms

ID: frontend.local-idioms
Status: Default
Triggers: stack, implementation, local patterns, migration
Use when: Applying craft inside an existing project.
Rule: Preserve semantics, token logic, CSS ownership, accessibility, and performance posture. Use the project’s existing safe idioms; do not force sample syntax over local truth.
Tradeoff: Less one-size-fits-all syntax; stronger project fit.
Override: Explicit migration or standardization task.
Tiny example:
Good: small interactive enhancement only when interaction earns hydration.
Avoid: client runtime for static marketing sections.

## Verify visible behavior

ID: frontend.visible-verification
Status: Default
Triggers: visual UI, CSS change, component change, token change
Use when: Changing UI, tokens, or component styles.
Rule: Pair static checks with at least one visible route/component pass when output changes. Token changes need broad component gallery coverage.
Tradeoff: More time; catches cascade bugs.
Override: Docs-only change.
Tiny example:
Good: run checks and inspect changed routes/components.
Avoid: claiming token migration done from grep only.
