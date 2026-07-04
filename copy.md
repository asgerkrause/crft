---
scope: craft
layer: copy
triggers:
  - copy
  - ux writing
  - buttons
  - forms
  - errors
updated: 2026-07-01
---

# Copy craft

Related: `forms`, `accessibility`, `sections`.

## Brand voice beats craft defaults

ID: copy.brand-first
Status: Must
Triggers: copy, UX strings, brand voice, client-facing text
Use when: Writing user-facing copy.
Rule: Use project brand source for client/product voice. `craft` gives structure, not brand personality.
Tradeoff: Less generic consistency; better fit.
Override: No brand file exists.
Tiny example:
Good: match client vocabulary.
Avoid: importing SANITIZE studio tone into client UI.

## Buttons name the action

ID: copy.cta-specificity
Status: Default
Triggers: button copy, CTA, link label, action label
Use when: Writing CTAs or action labels.
Rule: Button/link labels should name the action or destination. Avoid vague labels when context is not enough.
Tradeoff: Longer labels; clearer intent.
Override: Repeated card links where visible title supplies context.
Tiny example:
Good: `Book a Call`, `View Components`, `Download Guide`.
Avoid: `Learn More` everywhere.

## Form guidance is concrete

ID: copy.form-guidance
Status: Default
Triggers: form label, placeholder, helper text, input copy
Use when: Writing form labels/help/errors.
Rule: Labels state the field. Helper text explains constraints. Placeholders show examples only when helpful.
Tradeoff: More copy; fewer failed submissions.
Override: Ultra-simple field with obvious expected input.
Tiny example:
Good: label `Work Email`; helper `Use your company email.`
Avoid: placeholder as the only label.

## Error messages include fix

ID: copy.error-fix
Status: Default
Triggers: error message, validation, empty state, failure
Use when: Writing errors.
Rule: State what happened and how to fix it. Keep direct.
Tradeoff: Slightly longer errors; more useful recovery.
Override: Native validation message is acceptable and accurate.
Tiny example:
Good: `Enter a valid email address.`
Avoid: `Invalid input.`

## State feedback is announced

ID: copy.state-feedback
Status: Default
Triggers: loading, saving, sending, success, failure, aria-live
Use when: Writing async UI states.
Rule: Use short status text and connect it to `aria-live` when status changes without navigation.
Tradeoff: More state copy; clearer feedback.
Override: Full page navigation handles feedback.
Tiny example:
Good: `Sending…`, `Message sent.`, `Could not send. Try again.`
Avoid: spinner with no text.
