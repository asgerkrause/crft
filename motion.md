---
scope: snz-craft
layer: motion
triggers:
  - motion
  - animation
  - transition
  - hover
  - scroll
  - reduced motion
  - microinteraction
updated: 2026-05-28
---

# Motion craft

## Motion needs a job

ID: motion.motion-has-purpose
Status: Default
Triggers: motion, animation, interaction, transition, scroll, reveal, hover, polish
Use when: Adding or reviewing motion.
Thinking: Motion should clarify state, guide attention, express brand, reveal hierarchy, or make interaction feel responsive.
Rule: If motion does none of those jobs, skip it.
Tradeoff: Interface stays calm; expressive brands may need stronger motion moments.
Override: Brand/concept explicitly calls for expressive motion.
Tiny example:
Good: menu fades/slides to clarify open state.
Avoid: looping decorative movement that competes with content.
Related: sections.one-strong-move, tokens.motion-tokens

## Brand sets motion intensity

ID: motion.brand-intensity
Status: Must
Triggers: brand motion, expressive motion, subtle motion, interaction feel, ui polish
Use when: Choosing motion feel for client-facing UI.
Thinking: Craft defines motion discipline; `BRAND.md` defines emotional range.
Rule: Minimal by default. Expressive only when brand/concept supports it. If no brand context, use calm hi-fi wireframe feel.
Tradeoff: Prevents generic wow effects; may feel restrained unless brand asks for more.
Override: Prototype explicitly explores motion direction.
Tiny example:
Good: one signature transition matching brand energy.
Avoid: generic scroll reveals everywhere.
Related: frontend.brand-led-ui, sections.one-strong-move

## CSS first for simple state

ID: motion.css-first
Status: Default
Triggers: css transition, animation, state transition, js animation, hover, aria-expanded
Use when: Animating simple UI state.
Rule: Use CSS transitions/animations for simple state. Use JS only for sequencing, scroll, physics, or measurement.
Tradeoff: Simpler code; JS gives more control for complex choreography.
Override: Animation library already owns sequence or accessibility behavior.
Tiny example:
Good: `[aria-expanded]` changes opacity/transform through CSS.
Avoid: JS setting inline styles for basic hover/open states.
Related: components.css-owns-visual-state, styling.semantic-selectors

## Respect reduced motion

ID: motion.reduced-motion
Status: Must
Triggers: prefers-reduced-motion, reduced motion, accessibility, animation, parallax, scroll
Use when: Adding non-trivial motion, scroll effects, or parallax.
Rule: Respect `prefers-reduced-motion`; reduce or remove motion that can distract or cause discomfort.
Tradeoff: More branches; accessibility improves.
Override: None for motion that affects comfort.
Tiny example:
Good:
```css
@media (prefers-reduced-motion: reduce) {
  * {
    scroll-behavior: auto;
  }
}
```
Avoid: mandatory parallax/looping motion with no reduced path.
Related: platform.semantic-html

## Tokenize timing and easing

ID: motion.tokenized-motion
Status: Default
Triggers: duration, easing, transition tokens, td, tf, hover, animation timing
Use when: Defining transition feel.
Rule: Use motion tokens for duration/easing. Prefer `--td-sf`, `--td-f`, `--td`, `--td-s`, `--td-sl` and `--tf-i`, `--tf-o`, `--tf-io` or project equivalents.
Tradeoff: Cohesive feel; bespoke moments may define local token.
Override: Project token names differ.
Tiny example:
Good: `transition: transform var(--td) var(--tf-o);`
Avoid: `transition: all .3s ease;`
Related: tokens.motion-tokens
