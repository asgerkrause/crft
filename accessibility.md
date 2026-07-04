---
scope: craft
layer: accessibility
triggers:
  - accessibility
  - a11y
  - focus
  - labels
  - contrast
updated: 2026-07-01
---

# Accessibility craft

Related: `platform`, `forms`, `navigation`, `motion`, `tokens`.

## Start from native semantics

ID: accessibility.semantic-baseline
Status: Must
Triggers: accessibility, semantic html, aria, button, link, form, dialog, disclosure
Use when: Creating interactive or structural UI.
Rule: Choose correct native element first. Add ARIA only when native semantics cannot express behavior.
Tradeoff: Less custom markup freedom; more reliable UI.
Override: None.
Tiny example:
Good: `<button type="button" aria-expanded="false">Menu</button>`.
Avoid: `<div role="button" onclick="...">`.

## Focus stays visible

ID: accessibility.focus-visible
Status: Must
Triggers: focus, outline, keyboard, focus-visible
Use when: Styling focus states.
Rule: Never remove focus outline without a visible replacement. Use `:focus-visible`, `--s-bw`, and `--c-acc` or equivalent token-backed focus color.
Tradeoff: Visible focus may affect visual polish; keyboard access wins.
Override: None.
Tiny example:
Good: `outline: var(--s-bw) solid var(--c-acc); outline-offset: calc(var(--s-bw) * 2);`
Avoid: `outline: none;`.

## Structure order remains meaningful

ID: accessibility.structure-order
Status: Must
Triggers: DOM order, grid order, visual order, headings, sections
Use when: Reordering layout or composing sections.
Rule: DOM order, reading order, heading order, and focus order should remain understandable without CSS.
Tradeoff: Some art-directed layouts need compromise; clarity wins.
Override: Decorative media can move visually if content order remains clear.
Tiny example:
Good: heading before cards before CTA.
Avoid: visually first CTA whose DOM position comes after unrelated content.

## Contrast uses semantic color roles

ID: accessibility.color-contrast
Status: Must
Triggers: contrast, colors, theme, muted text, buttons
Use when: Defining or applying colors.
Rule: Ensure text and interactive controls meet WCAG AA contrast. Test themed states, hover/focus, disabled/muted, and accent surfaces.
Tradeoff: Some subtle palettes need adjustment.
Override: Large decorative non-text only.
Tiny example:
Good: `--e-btn-sur` and `--e-btn-ink` tested as a pair.
Avoid: `--c-mut` on `--c-sur` without contrast check.

## Form errors need more than color

ID: accessibility.state-feedback
Status: Must
Triggers: error, invalid, validation, status, aria-live
Use when: Showing errors or async status.
Rule: Pair token-backed visual state with text. Use `aria-invalid`, connected descriptions, or `aria-live` where appropriate.
Tradeoff: More markup; accessible feedback.
Override: Native validation bubble owns message.
Tiny example:
Good: `border-color: var(--c-bad-bor)` plus text “Enter a valid email.”
Avoid: red border only.

## Motion comfort is accessibility

ID: accessibility.motion-comfort
Status: Must
Triggers: reduced motion, parallax, scroll animation, transition
Use when: Adding motion.
Rule: Honor `prefers-reduced-motion`; avoid unavoidable parallax, large zooms, or long autoplaying movement.
Tradeoff: Fewer flashy effects; better comfort.
Override: None for essential UI.
Tiny example:
Good: reduced duration tokens under media query.
Avoid: scroll-jacked motion with no opt-out.
