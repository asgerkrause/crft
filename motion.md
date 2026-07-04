---
scope: craft
layer: motion
triggers:
  - motion
  - animation
  - transition
  - interaction state
  - reduced motion
updated: 2026-07-01
---

# Motion craft

Related: `performance`, `accessibility`, `tokens`, `styling`.

## One choreographed idea

ID: motion.one-system
Status: Default
Triggers: motion system, page motion, animation direction, polish
Use when: Designing motion across a page or component set.
Rule: One choreographed motion idea beats scattered effects. Motion should make hierarchy, affordance, navigation, or atmosphere clearer.
Tradeoff: Less novelty per component; stronger total feel.
Override: Campaign pages with deliberately maximal motion language.
Tiny example:
Good: page reveal + consistent button interaction.
Avoid: every card, image, heading, and badge moving differently.

## Motion tokens own timing

ID: motion.tokenized-motion
Status: Default
Triggers: duration, easing, transition tokens, animation timing
Use when: Adding transitions or animations.
Rule: Use `--m-td-*` for durations and `--m-tf-*` for easing. List transition properties explicitly.
Tradeoff: Cohesive feel; bespoke moments may need component-local vars.
Override: Existing project token names differ and migration is not in scope.
Tiny example:
Good: `transition: opacity var(--m-td) var(--m-tf-o), transform var(--m-td) var(--m-tf-o);`
Avoid: `transition: all <duration> ease;`

## Interaction tokens expose state math

ID: motion.interaction-tokens
Status: Default
Triggers: hover, focus, active, expanded, interaction state, i tokens
Use when: Styling interactive states.
Rule: Use `--i-hov-t/f`, `--i-foc-t/f`, `--i-prs-t/f`, and `--i-exp-t/f` to drive transforms, opacity, and visual state when it keeps CSS simpler.
Tradeoff: Requires setup in reset/base layer; components get consistent state math.
Override: Simple pseudo-class rule is clearer.
Tiny example:
Good: `transform: scale(calc(1 - .02 * var(--i-prs-t)));`
Avoid: duplicating active transform logic in every button variant.

## Motion must have purpose

ID: motion.has-purpose
Status: Default
Triggers: animation, polish, hover effect, scroll effect, decorative motion
Use when: Adding motion to UI.
Rule: Motion should clarify state, orient navigation, reveal hierarchy, or add intentional brand feel. Do not animate because a component exists.
Tradeoff: Quieter UI; fewer performance risks.
Override: Campaign/brand moment where motion is explicit art direction.
Tiny example:
Good: a disclosure icon rotates when expanded.
Avoid: every card floating on hover without information value.

## Reduced motion is mandatory

ID: motion.reduced-motion
Status: Must
Triggers: prefers-reduced-motion, animation, transition, scroll effect
Use when: Adding any non-trivial motion.
Rule: Honor `prefers-reduced-motion: reduce`. Reduce duration to near-zero or remove transform/scroll effects.
Tradeoff: Slightly more CSS; required for comfort.
Override: None.
Tiny example:
Good:
```css
@media (prefers-reduced-motion: reduce) {
  :root { --m-td: <near-zero>; }
}
```
Avoid: scroll/parallax effects with no reduced-motion path.

## Animate cheap properties

ID: motion.cheap-properties
Status: Default
Triggers: transform, opacity, layout animation, performance
Use when: Animating UI.
Rule: Prefer `transform` and `opacity`. Avoid animating layout-heavy properties unless the UI specifically needs intrinsic-size animation and browser support is considered.
Tradeoff: Better performance; less layout expressiveness.
Override: Native details/content-size animation that degrades safely.
Tiny example:
Good: `transform: translateY(...)`.
Avoid: animating `top`, `left`, `width`, or `height` for routine effects.
