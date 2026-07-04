---
scope: craft
layer: sections
triggers:
  - sections
  - hero
  - cta
  - theme
  - page rhythm
updated: 2026-07-01
---

# Sections craft

Related: `frontend`, `grid`, `tokens`, `copy`, `accessibility`.

## Section order is strategy

ID: sections.order-strategy
Status: Must
Triggers: section order, landing page, narrative, conversion
Use when: Arranging page regions.
Rule: Section order should move the visitor through a strategic sequence: context, desire, proof, mechanism, trust, action. Change order only when content logic improves.
Tradeoff: Less template-driven composition; stronger persuasion.
Override: Editorial or portfolio pages may prioritize exploration over conversion.
Tiny example:
Good: problem → distinctive answer → proof → process → CTA.
Avoid: feature grid before visitor knows why it matters.

## Sections need a job

ID: sections.job
Status: Default
Triggers: section, hero, features, cta, landing page
Use when: Creating page regions.
Rule: Each `<section>` should have a clear content job and usually a heading. Use plain `<div>` when markup is only layout inside a larger section.
Tradeoff: Cleaner outline; not every visual box becomes a landmark.
Override: Decorative full-bleed art region with no standalone meaning.
Tiny example:
Good: `<section id="features"><div class="c"><h2>...</h2></div></section>`.
Avoid: nested sections for every row/card.

## Page rhythm uses space tokens

ID: sections.page-rhythm
Status: Default
Triggers: page rhythm, section padding, spacing, container gap
Use when: Spacing major regions.
Rule: Use `--s-py` for section block padding, `--s-px` for inline page padding, `--s-ss` for container/section rhythm, and `--s-gp` for inner gaps.
Tradeoff: Consistent rhythm; one-off art direction needs local token-backed exception.
Override: Special hero or campaign moment with documented local vars.
Tiny example:
Good: `section { padding: var(--s-py) var(--s-px); }`
Avoid: per-section arbitrary pixel padding.

## Theme scopes own section color

ID: sections.section-theme
Status: Default
Triggers: data-theme, themed section, accent section, invert section, tone section
Use when: A section needs a different surface/color role.
Rule: Put `data-theme` on the section or nearest meaningful container. Descendants consume `--c-*` and `--e-*` roles.
Tradeoff: Strong cascade; local exceptions require care.
Override: Component must be portable and carry its own theme boundary.
Tiny example:
Good: `<section data-theme="accent">` with `.btn` using `--e-btn-*`.
Avoid: manually recoloring every card inside the section.

## Section aesthetics serve the job

ID: sections.aesthetic-job
Status: Default
Triggers: section design, visual system, art direction, layout
Use when: Choosing a section’s visual treatment.
Rule: Visual treatment must amplify the section job. Use scale, contrast, density, media, or motion to make meaning easier to feel and scan.
Tradeoff: Less decoration; stronger hierarchy.
Override: Atmospheric brand interlude where emotion is the job.
Tiny example:
Good: dense proof section feels archival and credible.
Avoid: identical card rhythm for proof, features, process, and CTA.

## Hero has one strong move

ID: sections.hero-focus
Status: Default
Triggers: hero, landing page, above fold, motion, layout
Use when: Designing hero sections.
Rule: Give hero one dominant visual/content move. Support it with clean hierarchy, one primary CTA group, and restrained motion.
Tradeoff: Less decorative clutter; stronger first impression.
Override: Campaign page intentionally uses editorial density.
Tiny example:
Good: headline + proof line + CTA + one visual system move.
Avoid: five competing animations, badges, stats, and CTAs above the fold.

## CTA sections use accent roles

ID: sections.cta-accent
Status: Default
Triggers: cta, accent section, conversion, button group
Use when: Building call-to-action zones.
Rule: CTA sections should usually use `data-theme="accent"` or local `--c-acc-*` mapping, with concise copy and clear primary action.
Tradeoff: Conversion zone becomes visually distinct; overuse weakens accent meaning.
Override: Brand direction avoids accent zones.
Tiny example:
Good: one accent CTA near page close.
Avoid: every section themed accent.
