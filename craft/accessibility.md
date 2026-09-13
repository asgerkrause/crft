---
title: CRFT accessibility
status: canonical
owner: accessibility
read_when: Building or accepting semantics, keyboard behavior, focus, accessible names, contrast, status announcements, zoom, or assistive-technology behavior.
---

# Accessibility

Accessibility is an implementation and verification boundary for CRFT guidance and adopted CSS. Semantic implementation belongs to the relevant topic owner. This file documents reusable primitives, fallbacks, and evidence prompts; the product owns its requirements, target standards, assistive-technology scope, and acceptance.

## Native first

Use the correct native element before ARIA or custom behavior. Native links, buttons, controls, labels, fieldsets, headings, lists, tables, details, and dialogs provide semantics and behavior that CSS cannot recreate.

ARIA supplements missing semantics. It must remain truthful and synchronized with visible and application state. No ARIA is better than incorrect ARIA.

Structure details belong to [`html.md`](html.md). Form relationships belong to [`forms.md`](forms.md).

## Required experience

Verify:

- useful landmarks and headings;
- one visible primary `main`;
- unique purposeful IDs, valid fragments, and valid native and ARIA ID references;
- intentional region landmarks without excessive section naming;
- logical DOM, reading, heading, and focus order;
- visible `:focus-visible` treatment against every adjacent canvas;
- complete keyboard operation for every pointer action;
- accessible names, descriptions, labels, and alternative text;
- truthful current, expanded, selected, checked, invalid, busy, disabled, and hidden state;
- understandable loading, error, success, empty, offline, unavailable, and recovery states;
- WCAG AA text, control, and focus-indicator contrast where applicable;
- meaning independent of color, position, sound, and motion;
- useful zoom, text resize, wrapping, target, and reflow behavior;
- reduced-motion and unsupported-feature results;
- announced material status without duplicate or disruptive output.

Automated checks do not replace keyboard, browser, zoom, or assistive-technology review.

## Focus and keyboard

Do not remove the base focus indicator without a verified replacement. Focus must remain visible across skins, schemes, surfaces, and sticky or clipped regions.

Tab follows source order between controls. Composite widgets implement the established keyboard pattern for that widget. Escape closes dismissible overlays. Opening and closing overlays moves and restores focus when the product flow requires it. Covered background content must not remain interactive.

Never use positive `tabindex` to repair source order. CRFT grid ordering changes presentation only.

## Names and announcements

Visible label text must participate in the accessible name. Icon-only controls need a specific name. Decorative media and icons stay out of the accessibility tree. Informative media describes purpose, not appearance alone.

Use connected descriptions for field constraints and errors. Use a stable status region for routine async results. Reserve urgent announcement for a failure that requires immediate attention. Keep visible recovery text available after announcement.

## Color, motion, and media

Color requires a redundant text, icon, shape, or pattern cue when it carries state or instruction. Measure the rendered foreground and background pair in the actual skin and state.

Reduced motion preserves information, state, and task completion. Remove parallax and unnecessary position movement. Autoplaying or timed content needs the applicable pause, stop, or extension behavior.

Alternative text follows the media’s purpose. Decorative media uses an empty alternative. Captions and nearby text must not create unnecessary duplicate announcements.

## Zoom and content stress

The interface must remain usable with browser zoom, text resize, narrow width, long labels, translated text, user font settings, and dynamic status text. Do not clip essential content or actions with fixed dimensions. Preserve a reachable task path when controls wrap or regions scroll.

## Links

`base.css` removes link underlines globally so navigation and component links can own their affordance, and restores an underline for links inside `p`, `li`, `dd`, `td`, and `figcaption`, where a link sits in running text and color alone would not distinguish it. Keep that distinction when a project restyles inline links.

## Screen-reader utility

Use `.sr` for content that must remain available to assistive technology but not visually rendered. Use `.sr.focusable` when keyboard focus must restore it, such as a skip link. Never leave a visually hidden interactive control focused and invisible.

## Common mistakes

- A clickable non-interactive element with incomplete keyboard support.
- A focus ring removed for visual polish.
- `aria-label` replacing useful visible text.
- State shown only through color, motion, or icon shape.
- A visual grid order that changes task meaning.
- Disabled controls with no explanation or alternative.
- Error text not connected to its field.
- A motion fallback that removes content.
- Calling an automated scan complete accessibility verification.

## Verify

Complete the primary task with keyboard only. Inspect the accessibility tree and names. Exercise every applicable state and overlay. Test zoom, text resize, narrow reflow, both color schemes, every skin, reduced motion, and unsupported features. Product authority selects target standards, task coverage, and assistive technologies. Record untested combinations as not verified, not passed; CRFT evidence alone cannot mark product accessibility accepted.
