---
scope: snz-craft
layer: sections
triggers:
  - sections
  - hero
  - cta
  - cards
  - feature section
  - page rhythm
  - copy
updated: 2026-05-28
---

# Sections craft

## Page rhythm carries hierarchy

ID: sections.page-rhythm
Status: Default
Triggers: section rhythm, page spacing, hero, landing page, hierarchy, layout
Use when: Building or polishing page sections.
Thinking: Hierarchy should come from section order, spacing, type, and content weight before decoration.
Rule: Use clear section rhythm and purposeful spacing. Hero, proof, feature groups, and CTA should each have distinct job.
Tradeoff: Restrained pages can feel plain without strong content or one visual move.
Override: Brand direction calls for dense editorial or maximal structure.
Tiny example:
Good: large hero, tighter proof strip, generous feature section, focused CTA.
Avoid: every section same padding, same heading size, same card treatment.
Related: tokens.spacing-scale, frontend.page-anatomy

## Copy starts from ICP state

ID: sections.copy-from-icp
Status: Must
Triggers: cta, headline, button copy, landing page copy, ux copy, empty state, form copy
Use when: Writing user-facing copy.
Thinking: Before writing, identify what ICP believes, needs, fears, and wants next. Use `BRAND.md` for tone and vocabulary. Craft supplies thinking process, not final voice.
Rule: Write copy from user state and desired next step, not from what company wants to say.
Tradeoff: Slower than clever phrasing; more likely to convert and feel relevant.
Override: If no `BRAND.md`, ask or use neutral professional copy.
Tiny example:
Good: ICP state = knows problem, doubts effort. Heading job = reduce risk. CTA job = name low-friction next step.
Avoid: starting from internal feature list or borrowing SNZ/studio voice.
Related: frontend.brand-led-ui, navigation.direct-labels, forms.submit-states

## One strong move beats many effects

ID: sections.one-strong-move
Status: Default
Triggers: visual polish, hero, landing page, cards, effects, gradients, shadows, blobs
Use when: Interface feels flat or generic.
Thinking: Elevation comes from deliberate contrast and hierarchy, not stacked decoration.
Rule: Add one deliberate visual move before stacking gradients, shadows, icons, animation, and blobs.
Tradeoff: Cleaner, more premium feel; may need stronger brand asset/content to carry energy.
Override: `BRAND.md` explicitly calls for expressive/maximal visual language.
Tiny example:
Good: stronger heading rhythm + one accent border or media treatment.
Avoid: gradient background + floating blobs + hover shadows + icon confetti.
Related: motion.motion-has-purpose, tokens.semantic-colors

## Card groups need content logic

ID: sections.card-groups
Status: Default
Triggers: cards, feature cards, grid cards, pricing cards, testimonials, content groups
Use when: Designing repeated card sections.
Thinking: Cards should represent comparable things or deliberate contrast. Grid is not substitute for information architecture.
Rule: Group cards by user decision, not arbitrary content length. Use grid spans only to signal real hierarchy.
Tradeoff: Better scanning; may require copy/content edits.
Override: CMS feed or chronological content determines order.
Tiny example:
Good: one featured card spans wider because it is primary path.
Avoid: random masonry purely to fill space.
Related: grid.column-span, grid.row-span, components.primitives

## Theme belongs to section job

ID: sections.section-theme
Status: Default
Triggers: section theme, data-theme, tone section, invert, accent section, cta theme
Use when: Choosing section theme or background.
Thinking: Theme change should mark a shift in job: proof, contrast, CTA, or brand moment.
Rule: Apply `data-theme` on outer section/container when section needs a distinct role. Let tokens cascade.
Tradeoff: Clear page landmarks; too many theme shifts fragment page.
Override: Brand direction uses frequent color blocking.
Tiny example:
Good: CTA uses `data-theme="accent"` to signal action zone.
Avoid: alternating themes every section without content reason.
Related: tokens.theme-attributes, styling.theme-cascade
