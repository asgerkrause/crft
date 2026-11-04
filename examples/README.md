---
status: handbook
canonical: false
scope: examples/**
---

# crft examples

These runnable specimens show decisions in context. They are evidence, not public API. When an example conflicts with `CRFT.md`, `crft/**`, or `styles/**`, fix the example.

## Start small

Read the [semantic structure](../docs/html.md#landmarks-and-regions), [layout roles](../docs/layout.md), and [grid contract](../docs/grid.md), then choose one focused specimen:

| Example | Source | Project CSS | Explanation |
| --- | --- | --- | --- |
| Minimal page shell | [HTML](page-shell/markup.html) | [CSS](page-shell/example.css) | [Landmarks, flow, and query boundary](page-shell/README.md) |
| Container measures | [HTML](layout-containers/markup.html) | [CSS](layout-containers/example.css) | [Narrow, default, and wide limits](layout-containers/README.md) |
| Centered content | [HTML](layout-centered/markup.html) | [CSS](layout-centered/example.css) | [Text, nested stacks, and wrapping groups](layout-centered/README.md) |
| Copy-first splits | [HTML](layout-split/markup.html) | [CSS](layout-split/example.css) | [Equal and asymmetric text/media layouts](layout-split/README.md) |
| Responsive grid spans | [HTML](layout-grid/markup.html) | [CSS](layout-grid/example.css) | [Tracks, featured spans, and full rows](layout-grid/README.md) |

Landmarks describe document meaning; containers, stacks, and grids describe layout. The focused recipes isolate those relationships without prescribing a product design. Their `.centered`, `.btns`, `.lnks`, `.btn`, and `.lnk` classes are project-owned conventions, not crft API.

## Worked examples

These existing full-page specimens combine more decisions:

| Example | Use |
| --- | --- |
| [`foundations/`](foundations/) | Combine public roles with proof tiles, actions, and native FAQ |
| [`page-from-brief/`](page-from-brief/) | Turn a product argument into a page |
| [`page-from-reference/`](page-from-reference/) | Translate supplied visual evidence without false fidelity |
| [`product-interface/`](product-interface/) | Build native forms and truthful product states |
| [`branded-extension/`](branded-extension/) | Add scoped brand composition without expanding crft API |

Each directory contains:

- `markup.html`: semantic structure;
- `example.css`: one project-owned presentation;
- `README.md`: purpose, decisions, checks, and limits.

## Loading and adoption

Serve the repository root to open a specimen's `markup.html`. In this repository, each document loads `styles/global.css` once, followed by its project-owned `example.css`. The entry declares the layer order and imports `tokens.css` and `crft.css`.

Consumers do not copy `global.css`. These specimens use framework hooks, so reproducing them requires explicit full adoption and the prelude/imports in the project's existing CSS entry. Replace the repository stylesheet link with that consumer-owned entry. Keep example presentation in the project's normal CSS owner; the specimens use a later `project` layer. See [adoption modes and entry setup](../docs/adopt.md#copy-tokens-or-the-full-framework).

Strategy-only, local extraction, and tokens-only adoption remain valid choices, but they do not grant framework hooks such as `.c`, `.s`, or `[g]`. Rework the affected layout in project CSS when choosing those modes. Example styles use an explicit `project` layer for portability. Projects may use another coherent owner.

## Rules

- Direct `main > section` elements require meaningful unique IDs. Nested sections need IDs only for useful relationships.
- Sections become named regions only when the landmark improves navigation.
- Numbered responsive grids sit below `section > .c`; intrinsic fit/fill grids need no named container.
- `o` always uses all large-medium-small positions.
- Public token names come from `styles/tokens.css`.
- Private properties never appear. `data-theme="invert|tone|accent"` changes colors only. Root `color-scheme` selects light/dark.
- `.btn`, `.crd`, `.lnk`, and optional `.btns`/`.lnks` groups remain [project conventions](../docs/components.md).
- Brand values belong in the copied token owner. Typography and spacing recipes belong on root. Local final-role tokens may be scoped.

## Verify

```sh
node scripts/check-system.mjs
node --test scripts/*.test.mjs
git diff --check
```

Then render the chosen example at relevant sizes and states. Check source order, keyboard behavior, focus, contrast, reduced motion, and unsupported-feature fallbacks. Static confirmation does not prove strategy or rendered quality.

Run `bun run dev` from `reference/`, then open `/examples/` or `/brands/`.
