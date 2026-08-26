---
title: CRFT composition
status: canonical
owner: composition
read_when: Applying supplied visual direction through hierarchy, rhythm, density, boundaries, media placement, or responsive composition.
---

# Composition

Composition translates project-approved direction and semantic structure into visible relationships. This owner records implementation constraints and evidence; it does not own visual judgment or taste.

## Direction

If project or design authority has not supplied direction, mark it blocked rather than deriving taste from CRFT. Describe supplied direction with implementable relationships:

- calm or dense;
- restrained or expressive;
- editorial or operational;
- continuous or segmented;
- image-led or text-led;
- precise or organic.

Tie each choice to product, audience, content, or brand evidence. A mood word without a structural consequence is not direction.

## Hierarchy

1. Establish one dominant anchor.
2. Group content that has one job.
3. Separate different jobs.
4. Align comparison and sequence.
5. Use asymmetry only when it strengthens priority or movement.
6. Use empty space to separate, focus, pace, or frame.

Use position, space, scale, contrast, alignment, media, and motion to express the rank defined in the brief. Do not make every section, title, surface, or action dominant.

Squint at the rendered page. The thesis, primary action, section groups, and supporting detail must remain distinguishable.

## Rhythm and density

Use CRFT spacing roles by relationship:

- section rhythm separates page jobs;
- stack rhythm groups one flow;
- peer gaps separate comparable items;
- padding creates an internal boundary.

The parent owns the relationship. Do not repair a parent composition with child margins.

Dense product interfaces may reduce whitespace when controls remain distinct, readable, reachable, and complete under zoom and localization. Marketing and editorial pages may use larger intervals when the space carries hierarchy or atmosphere.

## Surfaces and boundaries

Use a surface, border, radius, shadow, or spacing change only when it communicates grouping, affordance, hierarchy, or depth.

Start with spacing. Add one boundary signal when spacing is insufficient. Multiple signals must each have a job. A surface without a semantic or compositional boundary creates visual noise.

Cards are one possible project-owned surface. Their selection and anatomy belong to [`components.md`](components.md).

## Alignment and grid

Align related content to shared edges. Keep intentional exceptions scarce. Use the public grid when repeated columns and spans express the relationship. Use direct project CSS when the composition needs overlap, intrinsic sizing, editorial geometry, or another local relationship the grid does not own.

Visual order never repairs source order.

## Media

For each image or video, define:

- information or decorative role;
- dimensions and aspect ratio;
- crop, focal point, fit, and position;
- relationship to adjacent content;
- large, medium, and small placement;
- loading priority;
- alternative text.

Do not crop away proof, product meaning, captions, or controls. Decorative media must not compete with the thesis or action.

See [`examples/page-from-reference/`](../examples/page-from-reference/) for observed and inferred media decisions.

## Responsive composition

Design large, medium, and small behavior from content and evidence. At each state, check:

- thesis and action priority;
- source and focus order;
- type hierarchy and measure;
- group relationships and spacing;
- media crop and focal point;
- control reachability and overflow;
- density and motion fallback.

Hold a composition until its content stops fitting. Change the relationship, not only the dimensions. Use container queries for available component width and media queries for viewport or user preference.

## Common mistakes

- Applying cards, borders, shadows, and radii to every group.
- Using equal visual weight for primary and supporting content.
- Centering unrelated content without a shared axis.
- Adding asymmetry that changes reading or keyboard meaning.
- Treating medium behavior as observed when only large and small evidence exists.
- Creating a token or utility for one composition.

## Verify

Project or design authority decides whether a composition passes. CRFT review can verify that hierarchy matches the supplied brief, groups remain clear, type and media work with real content, responsive changes preserve meaning, and local art direction remains project-owned.

Review [`examples/page-from-brief/`](../examples/page-from-brief/) and [`examples/branded-extension/`](../examples/branded-extension/) for complete compositions, not reusable patterns.
