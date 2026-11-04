---
title: crft
status: canonical
scope: frontend
---

# crft

crft owns this concrete system. General frontend and design judgment belong to the project or a companion design skill.

crft is the SNZ CSS, token, class, naming, and architecture strategy plus a reference structure. It documents semantic CSS constraints, accessibility primitives and fallbacks, adoption, migration, and verification.

crft owns its canonical reference CSS and documented contract. It does not own product strategy, design judgment, taste, brand, content, or product accessibility acceptance. Read this router first, then only the owners needed for the task.

## Authority

1. Accessibility, security, data safety, and explicit project constraints.
2. Product goals, brand, content, browser support, and current project source.
3. crft and the relevant owner documents.
4. Examples and visual references as evidence only.

Within the canonical reference, CSS owns live values, formulas, breakpoints, selectors, themes, and reduced-motion behavior. Documentation explains the reference decisions and use; the receiving project owns product decisions.

## Route

| Need | Owner |
| --- | --- |
| Recording supplied outcome, audience, content jobs, copy, and evidence | [`docs/brief.md`](docs/brief.md) |
| Applying supplied visual direction through hierarchy, rhythm, density, surfaces, and media | [`docs/composition.md`](docs/composition.md) |
| Semantics, landmarks, sections, source order, navigation, JavaScript | [`docs/html.md`](docs/html.md) |
| Buttons, links, cards, component boundaries and states | [`docs/components.md`](docs/components.md) |
| Native controls, labels, validation, async implementation, and recovery | [`docs/forms.md`](docs/forms.md) |
| Token names, semantic jobs, scales, public and private boundaries | [`docs/tokens.md`](docs/tokens.md) |
| Semantic color, schemes, themes, accents, feedback, contrast | [`docs/color.md`](docs/color.md) |
| Fonts, semantic roles, measure, hierarchy, wrapping, weight | [`docs/type.md`](docs/type.md) |
| Page chrome, sections, `.c` measure, `.s` stacks, spacing | [`docs/layout.md`](docs/layout.md) |
| Responsive `g` `c` `r` `o` attributes, container states, source order | [`docs/grid.md`](docs/grid.md) |
| Finite utility selectors and admission threshold | [`docs/utilities.md`](docs/utilities.md) |
| Motion roles, reduced motion, scrub, view transitions | [`docs/motion.md`](docs/motion.md) |
| Copying, CSS ownership, extension, migration, updates | [`docs/adopt.md`](docs/adopt.md) |
| Semantics, focus, keyboard, names, contrast, assistive technology | [`docs/accessibility.md`](docs/accessibility.md) |
| Media loading, fonts, runtime, stability, budgets | [`docs/performance.md`](docs/performance.md) |
| Deterministic, judgment, rendered gates and reporting | [`docs/verify.md`](docs/verify.md) |

## Common workflows

Read every owner in **Start with**. Use the route above for any omitted topic the task affects. Brief and composition record and apply project-supplied direction; they do not replace the project’s product or design authority.

| Workflow | Start with | Add when affected |
| --- | --- | --- |
| Page build | [Brief](docs/brief.md), [composition](docs/composition.md), [HTML](docs/html.md), [layout](docs/layout.md), [accessibility](docs/accessibility.md), [verification](docs/verify.md) | Components, forms, color, type, grid, motion, performance |
| Component | [Components](docs/components.md), [HTML](docs/html.md), [accessibility](docs/accessibility.md), [verification](docs/verify.md) | Forms, tokens, color, type, layout, motion |
| Form or product interface | [Forms](docs/forms.md), [components](docs/components.md), [HTML](docs/html.md), [accessibility](docs/accessibility.md), [verification](docs/verify.md) | Color, layout, grid, performance |
| CSS API or adoption | Affected CSS owner from the route, [tokens](docs/tokens.md), [adoption](docs/adopt.md), [verification](docs/verify.md) | Accessibility, performance |
| Full crft reference audit | [Verification](docs/verify.md), then the other 15 owners in route order | — |

A product task using crft reads its applicable workflow, not all 16 owners by default. Pick the row from the task. Do not default to page-build. A full crft reference audit reads all owners.

crft is the concrete CSS system and reference. `CRFT.md` is this router. `docs/` holds topic guidance.

## Decisions

crft is a breaking replacement for the earlier frontend package. It keeps the CSS reference, routed guidance, optional whole-layer copier, contract checker, examples, and rendered reference. It intentionally does not ship a product CLI, consumer analyzer, automatic audit, or generated migration plan. Deterministic contract tooling stays inside that boundary: `scripts/emit-contract.mjs` derives the machine-readable contract, the copier records an adoption manifest, and a consumer runs `scripts/check-project.mjs` explicitly against its own CSS. Adoption may use strategy only, local project extraction, tokens-only adoption, or explicit full adoption. Every result is project-owned and uses explicit comparison. [`docs/adopt.md`](docs/adopt.md) owns the replacement procedure and exact public-name migrations. There are no compatibility aliases.

Use the extension order owned by [`docs/adopt.md`](docs/adopt.md): semantic HTML and existing owners before public crft API, public tokens before scoped overrides, and one direct project rule before any new shared API.

Keep DOM, reading, heading, and keyboard order meaningful without CSS. Direct `main > section` requires a meaningful, nonempty, unique ID. Other IDs need a fragment, relationship, or behavior purpose. Name a section as a region only when that landmark improves navigation.

Keep product presentation project-owned. Prefer a semantic element, native attribute, public crft hook, or bounded structural selector before a class. Add a class for a stable component, page scope, behavior, or visual role that structure cannot safely own. Add no dependency without a material capability or risk reduction.

`.btn`, `.crd`, and `.lnk` are project naming conventions. crft does not style or implement them.

## Public hook grammar

Hooks require their owning complete layer and retained live selectors. Local extraction grants no crft API. Role classes provide intentional visual treatment. Attributes provide g/c/r/o grids and l clamp. Classes .c and .s own content measure and vertical flow. Do not add margin, padding, gap, radius, align, or justify attributes.

<!-- public-hook-index:start -->

| Hook | Owner | Job |
| --- | --- | --- |
| `.display` | type | Documented type role |
| `.h1` | type | Documented type role |
| `.h2` | type | Documented type role |
| `.h3` | type | Documented type role |
| `.lead` | type | Documented type role |
| `.body` | type | Documented type role |
| `.small` | type | Documented type role |
| `.label` | type | Documented type role |
| `.caption` | type | Documented type role |
| `l` | type | Documented type role |
| `.c` | layout | Documented layout role |
| `.c.sm` | layout | Documented layout role |
| `.c.lg` | layout | Documented layout role |
| `.s` | layout | Documented layout role |
| `container` | layout | Documented layout role |
| `.img-w` | layout | Documented layout role |
| `g` | grid | Documented grid role |
| `c` | grid | Documented grid role |
| `r` | grid | Documented grid role |
| `o` | grid | Documented grid role |
| `fit` | grid | Documented grid role |
| `fit-sm` | grid | Documented grid role |
| `fit-lg` | grid | Documented grid role |
| `fill` | grid | Documented grid role |
| `fill-sm` | grid | Documented grid role |
| `fill-lg` | grid | Documented grid role |
| `sg` | grid | Documented grid role |
| `data-theme` | color | Documented color role |
| `data-accent` | color | Documented color role |
| `data-scrub` | motion | Documented motion role |
| `.sr` | utilities | Documented utilities role |
| `.sr.focusable` | utilities | Documented utilities role |
| `.squircle` | utilities | Documented utilities role |

<!-- public-hook-index:end -->

## Never

<!-- ban-index:start -->
never *-block-start or *-inline-start single-side longhands
never a class on section
never style through an ID selector
never new spacing, alignment, or display utility matrices
never substring attribute selectors in documentation
never explicit wght in canonical role axes; ordinary weight uses font-weight
never heading max-width; override the role's --ROLE-measure token
Private properties including --_ calculations never appear in product CSS.
<!-- ban-index:end -->

## Evidence

Label material claims:

- **Observed:** present in source or supplied evidence.
- **Inferred:** a defensible choice not proved by evidence.
- **Unknown:** evidence cannot answer it.
- **Blocked:** authority or evidence is missing.

## Completion

Pass each applicable gate:

1. **Deterministic:** repository and contract checks.
2. **Project judgment:** project authority decides strategy, hierarchy, design, copy, and product accessibility acceptance; crft checks that implementation evidence and ownership are explicit.
3. **Rendered:** relevant sizes, states, keyboard path, contrast, motion, media, console, and network.

Report failed, blocked, and unverified gates. Confidence does not replace evidence.
