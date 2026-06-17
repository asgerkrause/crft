---
scope: snz-craft
layer: copy
triggers:
  - copy
  - content
  - ux copy
  - cta
  - empty state
  - error state
  - success state
  - form copy
  - nav labels
updated: 2026-06-17
---

# Copy craft

## Voice belongs to brand

ID: copy.brand-owns-voice
Status: Must
Triggers: brand voice, tone, user-facing copy, ux copy, product copy, client copy
Use when: Writing or reviewing copy users will see.
Thinking: Craft gives structure and defaults. `BRAND.md` owns final voice, vocabulary, audience nuance, and positioning.
Rule: Use craft to decide copy job, clarity, and state coverage; use `BRAND.md` for final phrasing and tone.
Tradeoff: Keeps process reusable without leaking SNZ/studio voice.
Override: Internal tooling or prototypes with no client-facing surface may use neutral professional copy.
Tiny example:
Good: Define job = reduce risk; final words come from `BRAND.md`.
Avoid: Reusing craft examples as client brand voice.
Related: sections.copy-from-icp

## CTAs name next step

ID: copy.cta-job
Status: Default
Triggers: cta, button copy, link copy, hero action, conversion, call to action
Use when: Writing primary or secondary actions.
Thinking: CTA should answer what happens next and why user can trust taking that step now.
Rule: Name the user action or outcome, not internal business desire. Primary CTA should be specific; secondary CTA should reduce uncertainty.
Tradeoff: Clearer conversion path; less room for clever brand language.
Override: Product has established action vocabulary users already know.
Tiny example:
Good: Book consult, View pricing, See work, Start free trial.
Avoid: Submit, Learn more, Get started everywhere with no context.
Related: sections.copy-from-icp, navigation.direct-labels

## State copy reduces uncertainty

ID: copy.state-feedback
Status: Default
Triggers: empty state, error state, success state, loading state, confirmation, toast, alert
Use when: Writing UI states after something is missing, pending, failed, or complete.
Thinking: State copy should explain what happened, what it means, and what user can do next.
Rule: Empty states suggest first useful action. Errors name fix or next support path. Success states confirm outcome and next step.
Tradeoff: More copy than terse labels; fewer dead ends.
Override: Security or privacy requirements limit detail.
Tiny example:
Good: No projects yet. Create one to start tracking work.
Avoid: Empty. Error. Done.
Related: forms.submit-states, forms.connected-help-error

## Form copy helps completion

ID: copy.form-guidance
Status: Default
Triggers: form labels, helper text, error copy, validation copy, placeholder, field copy
Use when: Writing labels, helper text, placeholders, validation, or form errors.
Thinking: Form copy should help users complete task accurately with minimal doubt.
Rule: Labels name requested information. Helper text clarifies format, use, or privacy. Error copy says what to fix. Placeholder never carries required meaning.
Tradeoff: Clear forms can feel less minimal; completion and accessibility improve.
Override: Existing design system field component sets copy pattern that meets accessibility rules.
Tiny example:
Good: Label `Work email`; helper `Used for project updates only.`; error `Enter a valid work email.`
Avoid: Placeholder-only `Email` plus vague `Invalid` error.
Related: forms.labels-first, forms.connected-help-error

## Navigation copy orients

ID: copy.nav-orientation
Status: Default
Triggers: nav labels, menu labels, information architecture, header copy, footer links
Use when: Naming navigation items or persistent wayfinding.
Thinking: Navigation copy is map language. Recognition beats persuasion.
Rule: Use short labels that predict destination. Save campaign or brand phrasing for page headings and CTAs.
Tradeoff: Less expressive navigation; faster scanning.
Override: Branded destination names are already learned by audience.
Tiny example:
Good: Services, Work, Pricing, Contact.
Avoid: Clever labels that hide destination.
Related: navigation.direct-labels
