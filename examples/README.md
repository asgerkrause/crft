---
status: handbook
canonical: false
scope: examples/**
---

# CRFT examples

These runnable specimens show decisions in context. They are evidence, not public API. When an example conflicts with `CRAFT.md`, `craft/**`, or `styles/**`, fix the example.

## Choose one

| Example | Use |
| --- | --- |
| [`foundations/`](foundations/) | Learn the semantic shell and public CSS roles |
| [`page-from-brief/`](page-from-brief/) | Turn a product argument into a page |
| [`page-from-reference/`](page-from-reference/) | Translate supplied visual evidence without false fidelity |
| [`product-interface/`](product-interface/) | Build native forms and truthful product states |
| [`branded-extension/`](branded-extension/) | Add scoped brand composition without expanding CRFT API |

Each directory contains:

- `markup.html`: semantic structure;
- `example.css`: one project-owned presentation;
- `README.md`: purpose, decisions, checks, and limits.

The examples assume the canonical CRFT tree loaded through `styles/global.css` in this repository. Consumer projects explicitly adopt the full framework for these specimens and put the prelude in their own CSS entry. Example styles use an explicit `project` layer for portability. Projects may use another coherent owner.

## Rules

- IDs appear only when fragments, native or ARIA relationships, behavior, integration, or stable external identity need them.
- Sections become named regions only when the landmark improves navigation.
- Numbered responsive grids sit below `section > .c`; intrinsic fit/fill grids need no named container.
- `o` always uses all large-medium-small positions.
- Public token names come from `styles/tokens.css`.
- Private properties never appear. `data-theme` selects only supplied light/dark schemes.
- `.btn`, `.crd`, and `.lnk` remain project conventions.
- Brand values belong in the copied token owner. Local campaign variations may be scoped.

## Verify

```sh
node scripts/check-system.mjs
```

Then render the chosen example at relevant sizes and states. Check source order, keyboard behavior, focus, contrast, reduced motion, and unsupported-feature fallbacks. Static confirmation does not prove strategy or rendered quality.
