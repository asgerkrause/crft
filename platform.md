---
scope: craft
layer: platform
triggers:
  - platform
  - html
  - css
  - javascript
  - browser api
updated: 2026-07-01
---

# Platform craft

Related: `performance`, `accessibility`, `styling`, `forms`.

## Browser does more than JavaScript

ID: platform.browser-capabilities
Status: Must
Triggers: javascript, html, css, browser api, interaction
Use when: Adding behavior or frontend infrastructure.
Rule: Use native HTML/CSS capabilities before custom JS: forms, disclosure, focus, scroll behavior, media loading, responsive images, CSS state, and CSS animation.
Tradeoff: Less custom control; better performance and reliability.
Override: Product UI behavior that native platform cannot express cleanly.
Tiny example:
Good: native form validation plus accessible error text.
Avoid: custom validation system for simple required fields.

## JavaScript earns runtime cost

ID: platform.js-earns-cost
Status: Must
Triggers: javascript, typescript, runtime, hydration, client state
Use when: Deciding whether to add JS/TS.
Rule: JS/TS exists for behavior, data, lifecycle, analytics, or interaction that HTML/CSS cannot own cleanly.
Tradeoff: More restraint; faster pages.
Override: Real app state, async UI, or complex interaction.
Tiny example:
Good: tiny `initImagePreview(root)` enhancement.
Avoid: app shell for static landing page sections.

## Browser platform first

ID: platform.platform-first
Status: Default
Triggers: javascript, css, dependency, browser api
Use when: Choosing implementation approach.
Rule: Try semantic HTML, CSS, and browser APIs before adding dependency or runtime ceremony.
Tradeoff: Less abstraction; more direct knowledge required.
Override: Complex state, data sync, or animation sequencing earns a library.
Tiny example:
Good: `<details>` for disclosure when it fits.
Avoid: installing accordion dependency for static FAQ.

## Semantic HTML before ARIA

ID: platform.semantic-html
Status: Must
Triggers: html, aria, semantic html, accessibility, button, link, form
Use when: Marking up UI.
Rule: Use correct HTML element before adding ARIA. Accessibility starts with DOM order, labels, focus, and semantics.
Tradeoff: Less arbitrary markup; better baseline.
Override: None when native element exists.
Tiny example:
Good: `<a href="/work/">Work</a>` for navigation.
Avoid: `<button onclick="location.href='/work/'">Work</button>`.

## CSS owns presentation

ID: platform.css-first
Status: Default
Triggers: css, js, visual state, animation, styling
Use when: Styling state or behavior.
Rule: Let CSS handle visual state when HTML/ARIA attributes expose truth. JS should toggle state, not paint styles.
Tradeoff: CSS selectors need care; JS stays smaller.
Override: Complex animation timeline or canvas/WebGL work.
Tiny example:
Good: `[aria-expanded="true"]` drives menu icon transform.
Avoid: JS setting inline styles for open/closed state.

## No inline styles except token escape hatches

ID: platform.no-inline-styles
Status: Default
Triggers: inline style, style attr, component props, css variables
Use when: Passing per-instance visual values.
Rule: Avoid inline styles. If local component patterns require per-instance sizing or art direction, limit inline style to custom property assignment and keep property documented.
Tradeoff: Better CSP/cache/style ownership; fewer arbitrary overrides.
Override: Existing `craft` component API uses a small token escape hatch like logo size.
Tiny example:
Good: `style="--logo-size: <value>"` when component owns `--logo-size`.
Avoid: `style="color:<raw-color>;padding:<one-off>"`.

## Small modules over systems

ID: platform.small-modules
Status: Default
Triggers: app.ts, browser module, site js, typescript
Use when: Writing site JS.
Rule: Site JS should be small named functions with explicit init points. No app shell, registry, store, or state system unless product UI earns it.
Tradeoff: Less architecture; easier performance and debugging.
Override: Stateful app surfaces with repeated interactions across routes.
Tiny example:
Good: `initMenu(root)` and `initImagePreview(root)`.
Avoid: plugin manager for two interactions.

## Performance default is no runtime

ID: platform.no-runtime-default
Status: Default
Triggers: hydration, dependency, runtime, static ui
Use when: Choosing runtime model.
Rule: Default to no hydration, no client runtime, no animation library, and no dependency for one interaction.
Tradeoff: Custom small code may be needed; output stays fast.
Override: Framework project with real stateful UI needs runtime.
Tiny example:
Good: CSS hover/focus animation.
Avoid: animation package for button polish.

## Small JS has cleanup

ID: platform.small-js
Status: Default
Triggers: event listener, timer, animation frame, component script
Use when: Adding component scripts.
Rule: Add event listeners carefully and return cleanup when component lifecycle supports it. Guard loops/media with activity/visibility when available.
Tradeoff: More boilerplate; fewer leaks after navigation.
Override: One-shot static enhancement with no persistent listener.
Tiny example:
Good: `return () => button.removeEventListener('click', onClick)`.
Avoid: repeated listeners after every route swap.
