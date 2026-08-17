---
title: CRFT components
status: canonical
owner: components
read_when: Designing or reviewing buttons, links, cards, component boundaries, variants, states, or project-owned component CSS.
---

# Components

CRFT is not a component library. This file defines how project components use the stack without promoting their presentation into shared CRFT API.

`.btn`, `.crd`, and `.lnk` are project naming conventions for button, card, and link presentation. Projects own their CSS, markup contract, variants, behavior, and framework components.

## Component threshold

Start with semantic HTML and local composition. Extract a framework component when reuse, state, complexity, or authoring clarity earns it.

A framework component does not become CRFT API. Propose shared CRFT API only after unrelated consumers prove one stable role that an existing element, attribute, class, or token cannot express.

Use public tokens by semantic job in project CSS. Keep component-only relationships in local custom properties or direct declarations.

## Buttons and links

Use a button for an action. Use a link with `href` for navigation so open-in-new-tab, copy-address, history, and browser behavior remain available.

A button or prominent link needs:

- an action or destination name;
- a hit area suitable for its context;
- a visible interactive boundary or established placement;
- content alignment and icon spacing;
- text wrapping or a proven no-wrap constraint;
- default, hover where supported, active, focus, disabled or unavailable, and pending treatment when applicable;
- a non-motion response under reduced motion;
- sufficient contrast in each skin and state.

Use one primary action group per decision area. Secondary actions must remain available without competing with the primary action. A destructive action names its effect and must not rely on danger color alone.

```html
<div class="s h w">
  <a class="lnk" href="/guide">Read the guide</a>
  <button class="btn" type="button">Save draft</button>
</div>
```

```css
@layer project {
  .btn,
  .lnk {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--g-sm);
    min-height: 2.75rem;
    padding: var(--p-sm) var(--p);
    border: var(--b-wd) solid var(--c-ac);
    border-radius: var(--r);
  }

  .btn {
    color: var(--c-ac-co);
    background: var(--c-ac);
  }
}
```

This is project CSS, not a CRFT component recipe. Change its dimensions and treatment from product evidence.

Inline links must remain identifiable in surrounding prose. Preserve an underline or another verified non-color cue unless placement and context make the link unambiguous.

## Cards

Use a card when one surface groups one object, task, or decision and the boundary improves scanning or interaction. Do not wrap every section or text group in a card.

A card defines:

- one primary job or object;
- heading and accessible relationship;
- content order before visual layout;
- one intentional boundary combination;
- action placement and click target;
- media crop and dimensions when present;
- default, hover, selected, disabled, pending, empty, and error states that apply;
- behavior when content grows or actions wrap.

```html
<article class="crd s">
  <p t="sm" class="c-mu">Release</p>
  <h3>CRFT documentation</h3>
  <p>Sixteen focused owners with one task router.</p>
  <a class="lnk" href="/releases/crft">Review release</a>
</article>
```

Do not make an entire card clickable when it contains nested controls. A single-destination card may use one explicit link with a project-owned expanded hit area if focus, text selection, and nested interaction remain correct.

## Visual boundary

Start with spacing. Add a surface, border, radius, or shadow only when it shows grouping, affordance, hierarchy, selection, or depth. Avoid applying all signals by default.

A selected card needs truthful state such as `aria-selected`, `aria-pressed`, a checked control, or application state appropriate to the widget. CSS must not invent state from color alone.

## State ownership

HTML or application data owns state. Component CSS reads native attributes, ARIA state, or explicit application data. JavaScript owns behavior and async lifecycle.

Pending actions retain a stable accessible name, expose progress where useful, prevent duplicate effects, and report success or failure. Forms add the requirements in [`forms.md`](forms.md).

## Common mistakes

- Styling an anchor as a button while removing navigation behavior.
- Making every action primary.
- Disabling a button before users can discover validation errors.
- A card boundary with no grouping or interaction job.
- A clickable card containing another link or button.
- Creating CRFT component tokens or variants from one project.
- Copying the example CSS as a fixed component contract.

## Verify

Test semantics, names, keyboard path, focus, pointer and touch targets, every applicable state, long and translated labels, icons, nested controls, both color schemes, reduced motion, and project ownership. Confirm canonical CRFT CSS contains no `.btn`, `.crd`, or `.lnk` rules.
