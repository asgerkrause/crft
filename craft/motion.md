---
title: CRFT motion
status: canonical
owner: motion
read_when: Adding motion, image scrub, view transitions, reduced-motion behavior, or unsupported-feature fallback.
---

# Motion

Motion must explain state, hierarchy, navigation, affordance, or atmosphere. A complete static result comes first. `styles/crft.css` owns opt-in scrub and view transitions. Native disclosure, dialog, and popover animation live in the base layer of `crft.css`; see [`html.md`](html.md). CSS owns live timing and reduced-motion substitutions.

## Decision

Before motion, record:

1. What changes?
2. Why must the change animate?
3. How often will users trigger or encounter it?
4. Which properties move or fade?
5. What is the complete static result?
6. What remains under reduced motion?
7. What happens when the feature is unsupported?

Frequent operational actions need less motion than rare explanatory moments. Do not delay essential content or interaction. List transition properties. Do not use `transition: all`.

Use one motion idea per surface. Keep entry, state change, and exit related. Motion never carries meaning alone.

## Motion roles

Use duration and timing tokens by semantic job. The duration family moves from shortest feedback to longest deliberate transition. Timing roles distinguish in, out, in-out, glide, and spring-like movement.

Project motion uses public tokens in project CSS. Add a local property for a component relationship that no shared role owns.

Reduced motion remaps the shared timing roles and durations in `tokens.css`. Position or parallax motion must still be removed or bypassed when the resulting tiny duration is not a complete reduced-motion experience. Reduced transparency sets `--transition-blur` to zero, so blur never carries a required state.

## Native overlays

`dialog` and `[popover]` fade and lift in by `--lift` over `--duration` when opened, and out when closed, through `@starting-style` and discrete `display` and `overlay` transitions. The modal backdrop fades with them. Without support the overlay appears and disappears instantly. Project CSS may retune the tokens; do not add a second overlay entrance.

## Header elevation

A sticky header that separates from content once content passes under it is a project decision, not a reference default. The complete recipe, all from public tokens:

```css
@layer project {
  html {
    scroll-padding-top: var(--header);
  }

  body > header {
    position: sticky;
    top: 0;
    z-index: 1;
    min-height: var(--header);
  }

  @supports (animation-timeline: scroll()) {
    @media (prefers-reduced-motion: no-preference) {
      @keyframes header-elevate {
        to {
          background: color-mix(in srgb, var(--canvas) 85%, transparent);
          border-bottom: var(--border-width) solid var(--border);
        }
      }

      body > header {
        animation: header-elevate linear both;
        animation-timeline: scroll();
        animation-range: 0 var(--header);
      }
    }
  }
}
```

`scroll-padding-top` keeps anchors and focused controls below the header. Set `inset` explicitly when the project positions the header elsewhere. Add backdrop blur only behind a reduced-transparency gate.

## Image scrub

The public image enhancement is:

```html
<figure class="img-w" data-scrub>
  <img src="work.jpg" alt="Finished interface at the results step">
</figure>
```

Use `data-scrub="reverse"` to reverse travel. Apply the hook only when the wrapper has a deliberate height and crop in project CSS.

CRFT activates scrub only when view timelines are supported and the user has not requested reduced motion. Otherwise the image remains static. The generic `[data-scrub]` rule supplies internal progress to this public image hook. It is not a separate documented consumer feature.

Do not scrub proof that must remain fully visible, interactive media, text, or controls.

## View transitions

When view transitions are supported, same-origin navigations cross-fade `main` using the public `--transition-*` tokens. Header and footer keep their names so chrome can stay stable. Reduced motion removes every view-transition animation, including the root cross-fade. Without support, navigation is instantaneous.

Project CSS may retune the public view-transition tokens. Do not invent a second navigation motion language.

## Progressive stagger

A repeated project composition can use `sibling-index()` when source order is the intended sequence. The function is Baseline newly available, not yet widely available, so the complete result remains static and the motion stays inside both feature and reduced-motion gates:

```css
@layer project {
  @supports (animation-delay: calc(1ms * sibling-index())) {
    @media (prefers-reduced-motion: no-preference) {
      .issue {
        animation-delay: calc((sibling-index() - 1) * var(--duration-sm));
      }
    }
  }
}
```

Use the index only when every sibling belongs to the same sequence. Do not use it to repair source order or delay essential content. Use `sibling-count()` only when the total number of siblings changes a real calculation; do not add it only to demonstrate a new function.

See [`examples/branded-extension/`](../examples/branded-extension/) for a complete static result with a project-owned stagger enhancement.

## Split text

Prefer intact text with the type role’s wrapping behavior. CSS cannot reliably address rendered lines because line breaks change with width, fonts, content, language, and user settings.

Word, character, or line splitting is project JavaScript, not CRFT API. Use it only when a signature motion earns the lifecycle cost. Preserve one coherent accessible reading, selection, copy, search, and translation result. Recompute after relevant font, size, and content changes. Remove decorative fragmentation under reduced motion when the static text is sufficient. Clean up generated nodes and observers when the view is replaced.

Do not hand-author spans around every word or copy a text-splitting component into CRFT. Two unrelated project uses with accessibility and lifecycle evidence are the minimum trigger to reconsider shared guidance.

## Project interaction

Project-owned buttons, cards, menus, overlays, and navigation may use motion when behavior and frequency justify it. Gate pointer-only hover movement for devices that support hover. Keep focus treatment immediate and visible.

JavaScript motion must own lifecycle, interruption, cancellation, and teardown. Prefer CSS when native state and a transition express the behavior.

## Common mistakes

- Adding motion because a surface appears empty without it.
- Animating a frequent keyboard action.
- Using motion as the only state or progress signal.
- Applying `data-scrub` without the public `.img-w` wrapper contract.
- Assuming support or reduced-motion behavior is identical to the enhanced path.
- Using `sibling-index()` without a complete static fallback and both feature gates.
- Splitting text without font, resize, content, selection, localization, and assistive-technology evidence.
- Animating layout properties when a simpler static or transform result is available.
- Adding `.btn` or `.crd` to canonical motion or base selectors.

## Verify

Test the static result first. Then test supported motion, rapid repeated input, keyboard input, reduced motion, unsupported-feature fallback, content growth, sibling changes, scroll direction, and visibility of essential media. Confirm console and performance behavior for any JavaScript-owned interaction.
