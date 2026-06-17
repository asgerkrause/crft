---
scope: snz-craft
layer: accessibility
triggers:
  - accessibility
  - a11y
  - focus
  - keyboard
  - headings
  - landmarks
  - labels
  - descriptions
  - contrast
  - reduced motion
updated: 2026-06-17
---

# Accessibility craft

Accessibility is not a separate polish pass. Use this as the entry point, then follow linked rule owners for implementation details.

## Start from native semantics

ID: accessibility.semantic-baseline
Status: Must
Triggers: accessibility, a11y, semantic html, aria, role, button, link, form, dialog, disclosure
Use when: Choosing markup or reviewing interactive UI.
Rule: Choose the correct native element first; add ARIA only when native semantics cannot express the behavior.
Tradeoff: Native constraints may shape visual design; accessibility and maintainability improve.
Override: Custom interaction is required and fully implements keyboard, focus, name, state, and announcement behavior.
Tiny example:
Good: `<button>` for actions, `<a>` for navigation, `<details><summary>` for disclosure.
Avoid: clickable `<div role="button">` when a real button works.
Related: platform.semantic-html, examples.disclosure, navigation.header-menu

## Keyboard and focus prove interaction

ID: accessibility.keyboard-focus
Status: Must
Triggers: keyboard, focus, tab, focus-visible, menu, modal, disclosure, interactive state
Use when: Adding or reviewing any interactive element.
Rule: Every interactive path must work with keyboard, show visible focus, and keep DOM order aligned with reading/task order.
Tradeoff: Interaction design may need simpler structure; users can navigate predictably.
Override: None for user-facing interactive UI.
Tiny example:
Good: tab reaches menu button, Enter/Space toggles it, focus ring remains visible, DOM order matches visual flow.
Avoid: hover-only menus, hidden focus outlines, visual reordering that changes meaning.
Related: platform.semantic-html, navigation.header-menu, grid.visual-order

## Names and descriptions stay connected

ID: accessibility.names-descriptions
Status: Must
Triggers: label, aria-label, aria-labelledby, aria-describedby, helper text, error text, icon button, form
Use when: UI needs an accessible name, hint, requirement, or error message.
Rule: Controls need clear accessible names; helper and error text must be programmatically connected when it changes task success.
Tradeoff: More explicit IDs/labels; screen reader context matches visual context.
Override: Framework component proves equivalent accessible name and description output.
Tiny example:
Good: visible `<label>` plus `aria-describedby="email-help email-error"` for field support text.
Avoid: icon-only button without a name, or visual error text not connected to the field.
Related: forms.labels-first, forms.connected-help-error, navigation.direct-labels

## Page structure is navigation

ID: accessibility.structure-navigation
Status: Default
Triggers: headings, heading order, landmarks, section, nav, main, aria-current, page structure
Use when: Building page shells, sections, navigation, or content hierarchy.
Rule: Use one clear page structure: meaningful landmarks, ordered headings, current-page state, and sections only when they have a real heading/job.
Tradeoff: Less decorative markup freedom; scanning and assistive navigation improve.
Override: Existing framework/layout component outputs correct structure.
Tiny example:
Good: `<main>` contains headed sections; primary nav uses `aria-label`; current link uses `aria-current="page"`.
Avoid: heading levels chosen only for size, or unlabelled duplicate nav regions.
Related: navigation.active-state, sections.page-rhythm, platform.semantic-html

## Contrast and state cannot rely on color alone

ID: accessibility.contrast-state
Status: Must
Triggers: contrast, color, state, error, success, disabled, selected, active, focus
Use when: Styling text, controls, status, or state changes.
Rule: Keep text/control contrast readable and pair color changes with shape, text, icon, attribute, or position when state matters.
Tradeoff: Visual system needs more than palette; meaning survives different displays and perception.
Override: Decorative non-informational color may be low contrast if it carries no meaning.
Tiny example:
Good: error state uses message text, `aria-invalid`, border/token change, and connected description.
Avoid: red-only error or active state with no text/semantic/state change.
Related: tokens.semantic-colors, forms.connected-help-error, styling.semantic-selectors

## Motion respects comfort

ID: accessibility.motion-comfort
Status: Must
Triggers: reduced motion, prefers-reduced-motion, animation, parallax, scroll, transition, vestibular
Use when: Adding non-trivial movement, scroll behavior, reveal effects, or looping animation.
Rule: Respect `prefers-reduced-motion`; reduce or remove motion that can distract, block task flow, or cause discomfort.
Tradeoff: More branches; motion remains purposeful and safe.
Override: None for motion that affects comfort.
Tiny example:
Good: parallax/reveal effects disable or simplify under `prefers-reduced-motion: reduce`.
Avoid: mandatory parallax, smooth scroll, or looping motion without reduced path.
Related: motion.reduced-motion, motion.motion-has-purpose, tokens.motion-tokens
