---
title: CRFT
status: canonical
scope: frontend
---

# CRFT

CRFT is the SNZ frontend design and CSS system. It owns strategy, design judgment, semantic structure, CSS, accessibility, performance, and verification.

Read this router first. Then read only the owners needed for the task.

## Authority

1. Accessibility, security, data safety, and explicit project constraints.
2. Product goals, brand, content, browser support, and current project source.
3. CRFT and the relevant owner documents.
4. Examples and visual references as evidence only.

CSS owns live values, formulas, breakpoints, selectors, skins, and reduced-motion behavior. Documentation owns decisions and use.

## Route

| Need | Owner |
| --- | --- |
| Outcome, audience, page argument, content jobs, copy | [`craft/brief.md`](craft/brief.md) |
| Visual hierarchy, rhythm, density, surfaces, media | [`craft/composition.md`](craft/composition.md) |
| Semantics, landmarks, sections, source order, navigation, JavaScript | [`craft/html.md`](craft/html.md) |
| Buttons, links, cards, component boundaries and states | [`craft/components.md`](craft/components.md) |
| Controls, labels, validation, async and product states | [`craft/forms.md`](craft/forms.md) |
| Token names, semantic jobs, scales, public and private boundaries | [`craft/tokens.md`](craft/tokens.md) |
| Semantic color, schemes, skins, accents, feedback, contrast | [`craft/color.md`](craft/color.md) |
| Fonts, roles, measure, hierarchy, wrapping, weight | [`craft/type.md`](craft/type.md) |
| Page chrome, sections, `c` measure, `s` stacks, spacing | [`craft/layout.md`](craft/layout.md) |
| Responsive `g` `x` `y` `o` attributes, container states, source order | [`craft/grid.md`](craft/grid.md) |
| Finite utility selectors and admission threshold | [`craft/utilities.md`](craft/utilities.md) |
| Motion roles, reduced motion, scrub, view transitions | [`craft/motion.md`](craft/motion.md) |
| Copying, CSS ownership, extension, migration, updates | [`craft/adopt.md`](craft/adopt.md) |
| Semantics, focus, keyboard, names, contrast, assistive technology | [`craft/accessibility.md`](craft/accessibility.md) |
| Media loading, fonts, runtime, stability, budgets | [`craft/performance.md`](craft/performance.md) |
| Deterministic, judgment, rendered gates and reporting | [`craft/verify.md`](craft/verify.md) |

## Common workflows

Read every owner in **Start with**. Use the route above for any omitted topic the task affects.

| Workflow | Start with | Add when affected |
| --- | --- | --- |
| Page build | [Brief](craft/brief.md), [composition](craft/composition.md), [HTML](craft/html.md), [layout](craft/layout.md), [accessibility](craft/accessibility.md), [verification](craft/verify.md) | Components, forms, color, type, grid, motion, performance |
| Component | [Components](craft/components.md), [HTML](craft/html.md), [accessibility](craft/accessibility.md), [verification](craft/verify.md) | Forms, tokens, color, type, layout, motion |
| Form or product interface | [Forms](craft/forms.md), [components](craft/components.md), [HTML](craft/html.md), [accessibility](craft/accessibility.md), [verification](craft/verify.md) | Color, layout, grid, performance |
| CSS API or adoption | Affected CSS owner from the route, [tokens](craft/tokens.md), [adoption](craft/adopt.md), [verification](craft/verify.md) | Accessibility, performance |
| Full CRFT system audit | [Verification](craft/verify.md), then the other 15 owners in route order | — |

A complete product build reads its applicable workflow, not all 16 owners by default. A full CRFT system audit reads all owners.

## Decisions

CRFT is a breaking replacement for the earlier frontend package. It keeps the CSS system, routed guidance, copier, contract checker, examples, and rendered reference. It intentionally does not ship a product CLI, consumer analyzer, automatic audit, or generated migration plan. Adoption remains copy-and-own and uses explicit comparison. [`craft/adopt.md`](craft/adopt.md) owns the replacement procedure and exact public-name migrations. There are no compatibility aliases.

Use the first complete option:

1. Existing coherent project owner.
2. Semantic HTML and native behavior.
3. Existing public CRFT API.
4. Public token in project CSS.
5. Scoped token override.
6. One direct project rule.
7. Small JavaScript behavior.
8. Shared CRFT API after unrelated consumers prove the role.

Keep DOM, reading, heading, and keyboard order meaningful without CSS. Add an ID only when a fragment, native or ARIA relationship, behavior, integration, or stable external identity needs it. Name a section as a region only when that landmark improves navigation.

Keep product presentation project-owned. Prefer a semantic element, native attribute, public CRFT hook, or bounded structural selector before a class. Add a class for a stable component, page scope, behavior, or visual role that structure cannot safely own. Add no dependency without a material capability or risk reduction.

`.btn`, `.crd`, and `.lnk` are project naming conventions. CRFT does not style or implement them.

## Public hook grammar

Attributes are the finite CRFT composition API. Classes are the override and use-case layer.

| Kind | Owns |
| --- | --- |
| Attribute | Finite composition: `c`, `s`, `t`, `g`, `x`, `y`, `o`, `l` |
| `data-*` | Inherited canvas or opt-in: `data-skin`, `data-accent`, `data-scrub` |
| Class | Override, recovery, or product use case: `.img-w`, `.sr`, `.btn`, `.crd` |
| Token | Scales used in CSS. Never a markup matrix |

Positions use hyphens (`g="12-6"`, `x="5-3"`, `o="f-a-l"`). Flags use spaces (`t="sm mu"`, `s="h sm ct"`, `c="sm ct"`). CSS matches flags with `~=`. Do not document substring operators. Do not add margin, padding, gap, radius, align, or justify attributes.

<!-- public-hook-index:start -->

| Hook | Owner | Job |
| --- | --- | --- |
| `c` | layout | Content measure |
| `c="sm"` | layout | Narrow measure |
| `c="lg"` | layout | Wide measure |
| `c="ct"` | layout | Center container children |
| `s` | layout | Stack |
| `s="h"` | layout | Horizontal stack |
| `s="w"` | layout | Wrapping stack |
| `s="ct"` | layout | Cross-axis center |
| `s="sb"` | layout | Space-between |
| `s="xs"` | layout | Tight stack gap |
| `s="sm"` | layout | Small stack gap |
| `s="lg"` | layout | Large stack gap |
| `s="xl"` | layout | Extra-large stack gap |
| `container` | layout | Named query context |
| `.img-w` | layout | Media frame |
| `t` | type | Role plus optional color and transform flags |
| `l` | type | Line clamp |
| `g` | grid | Parent column count |
| `x` | grid | Child column span |
| `y` | grid | Child row span |
| `o` | grid | Child visual order |
| `a-sm` | grid | Auto-fill narrow items |
| `a` | grid | Auto-fill default items |
| `a-lg` | grid | Auto-fill wide items |
| `sg` | grid | Ancestor subgrid |
| `data-skin` | color | Canvas boundary |
| `data-accent` | color | Accent route |
| `data-scrub` | motion | Image scrub |
| `.sr` | utilities | Screen-reader content |
| `.sr.focusable` | utilities | Restorable screen-reader content |

<!-- public-hook-index:end -->

## Evidence

Label material claims:

- **Observed:** present in source or supplied evidence.
- **Inferred:** a defensible choice not proved by evidence.
- **Unknown:** evidence cannot answer it.
- **Blocked:** authority or evidence is missing.

## Completion

Pass each applicable gate:

1. **Deterministic:** repository and contract checks.
2. **Judgment:** strategy, hierarchy, design, ownership, copy, and accessibility.
3. **Rendered:** relevant sizes, states, keyboard path, contrast, motion, media, console, and network.

Report failed, blocked, and unverified gates. Confidence does not replace evidence.
