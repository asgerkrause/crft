---
scope: craft
layer: performance
triggers:
  - performance
  - javascript
  - typescript
  - media
  - motion
  - dependency
updated: 2026-07-03
---

# Performance craft

Related: `platform`, `motion`, `frontend`, `accessibility`.

## Performance is craft

ID: performance.is-craft
Status: Must
Triggers: performance, polish, quality, frontend
Use when: judging frontend quality or adding visual/interactive weight.
Rule: Treat speed as part of perceived quality. Protect first render, interaction latency, scroll smoothness, and readable layout before adding enhancement weight.
Tradeoff: Some aesthetic ideas need implementation discipline before they ship.
Override: None for core readability, navigation, or interaction.
Tiny example:
Good: optimize media, CSS, and runtime before cutting visual concept.
Avoid: calling a page premium while it feels heavy, delayed, or fragile.

## Strategy decides tradeoffs

ID: performance.strategy-tradeoff
Status: Must
Triggers: aesthetic, media, animation, client priority, tradeoff
Use when: deciding whether aesthetic weight is worth performance cost.
Rule: Keep aesthetic weight only when it strengthens positioning, trust, desire, product clarity, or conversion. Optimize implementation first; reduce visual ambition only when cost harms strategy, access, or conversion.
Tradeoff: Campaign moments may carry heavier art direction; routine decoration should not.
Override: None for decoration that does not support page job.
Tiny example:
Good: keep a strong hero video if it defines brand moment; compress, size, poster, and defer around it.
Avoid: removing memorable art direction before removing avoidable runtime waste.

## JavaScript earns every byte

ID: performance.js-budget
Status: Must
Triggers: javascript, typescript, hydration, dependency, interaction
Use when: adding JS/TS, hydration, or runtime behavior.
Rule: Use zero-runtime sections by default. Add JS/TS only for behavior, data, lifecycle, analytics, or interaction that HTML/CSS cannot own cleanly.
Tradeoff: Product UI with real shared state, async data, or complex interaction may earn runtime.
Override: Real app state or complex interaction that native platform cannot express safely.
Tiny example:
Good: disclosure uses native state or ARIA toggle; CSS owns visuals.
Avoid: JS for layout, styling toggles, scroll theater, or class choreography.

## TypeScript stays small

ID: performance.ts-simple
Status: Default
Triggers: typescript, browser code, module, event listener
Use when: writing browser TypeScript.
Rule: Browser TypeScript should be small, explicit, and local: named functions, direct DOM queries, typed event boundaries, and clear init points.
Tradeoff: Framework/product UI can use stack-native patterns when they reduce risk.
Override: Stateful app surfaces with repeated interactions across routes.
Tiny example:
Good: `initImagePreview(root)` beats a client-side component system for image hover preview.
Avoid: abstract managers, plugin systems, observers, or stores for one page interaction.

## Dependency budget is strict

ID: performance.dependency-budget
Status: Must
Triggers: dependency, package, library, animation, carousel, form
Use when: considering a frontend dependency.
Rule: A new frontend dependency must beat native platform, existing helper, and a small local function.
Tradeoff: Specialized media, maps, payments, auth, or complex editor surfaces may earn dependency weight.
Override: Dependency removes real risk or complexity that local code should not own.
Tiny example:
Good: native scroll plus CSS snap before carousel library.
Avoid: installing package for accordion, tabs, reveal animation, or basic form validation.

## Motion budget protects main thread

ID: performance.motion-budget
Status: Default
Triggers: motion, animation, scroll, parallax, transition
Use when: adding motion or scroll effects.
Rule: One strong motion system beats scattered effects. Animate cheap properties and avoid main-thread pressure.
Tradeoff: Intentional art direction can use heavier motion when isolated, measured, and accessible.
Override: Campaign/brand moments where heavier motion is explicit and contained.
Tiny example:
Good: route transition plus button microinteraction beats every card animating independently.
Avoid: parallax and scroll scrubbing that make reading or input feel worse.

## Media carries purpose

ID: performance.media-budget
Status: Must
Triggers: image, video, background media, poster, loading
Use when: adding images, video, background media, or poster assets.
Rule: Media must carry mood, proof, product clarity, or brand texture, then be sized, compressed, prioritized, and given fallbacks.
Tradeoff: Immersive campaign moments may load heavier first media when it is core experience.
Override: None when media creates layout shift or blocks core content.
Tiny example:
Good: hero video with poster, compression, and reduced-motion fallback.
Avoid: decorative full-bleed media with no strategic job.
