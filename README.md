---
scope: craft
layer: index
triggers:
  - craft
  - frontend
  - tokens
  - performance
  - design system
updated: 2026-07-03
---

# Craft

Frontend backbone for strategy-first, aesthetic-high, performance-native websites and interfaces.

Craft defines how frontend work should feel, scale, and stay maintainable across stacks. Project code, brand context, and local conventions decide final implementation details.

## Publish boundary

Craft is standalone source truth. It may reference files and topics inside this folder. It must not depend on external folders, local repo docs, private project names, implementation package docs, or generated build artifacts.

Implementation-specific docs belong with implementation packages. Craft names principles, token contracts, ownership boundaries, and browser-native defaults.

## Agent retrieval protocol

Agents should also follow `AGENTS.md` as machine-first operating contract for this folder.

1. Read this README.
2. Match task words to topic triggers.
3. Read matched topic file.
4. Read `Related:` topics only when rule depends on them.
5. Apply project context and existing safe local patterns before craft fallback.
6. Load full folder only for architecture review, migration, or source-truth work.

## Precedence

1. Project goal, scope, stack, and commands.
2. Project brand voice, audience, and visual direction.
3. Hard accessibility, security, performance, and data-loss rules.
4. Existing local pattern, unless weak, unsafe, or superseded by project contract.
5. Craft fallback doctrine.

## North star

1. Strategy never bends to decoration.
2. Aesthetics never get flattened for convenience.
3. Performance stays native by default.
4. Performance can bend only when client outcome earns cost.
5. Complexity must justify itself.

## Non-negotiables

- Strategy owns section order, hierarchy, and conversion path.
- Aesthetic ambition stays protected through type, rhythm, color, composition, media, and motion.
- CSS owns layout, theme, visual state, and motion whenever possible.
- JavaScript earns every byte.
- Components exist when boundaries earn themselves.
- Tokens carry system intent, not arbitrary values.
- Accessibility belongs to craft, not audit cleanup.
- Native platform comes before runtime ceremony or dependency weight.

## Example contract

Examples teach relationships and behavior, not prescribed visual values. Copy exact token names. Do not copy arbitrary values unless formula, `color-mix()`, `clamp()`, or browser relationship is the lesson.

## Core token contract

Default token names are stable. Values can change by project. Responsive implementation can use fluid `min/max` config or direct media-query overrides.

- `--l-*` layout
- `--s-*` space and shape
- `--t-*` typography
- `--c-*` color
- `--e-*` element and component skin
- `--m-*` motion
- `--i-*` interaction state
- `--z-*` stack order

`--e-*` tokens are intentionally more flexible than core layout/type/color tokens. They connect primitives and components to the backbone, but exact element sets can change by project.

## Topics

- `frontend.md` — strategy, page anatomy, aesthetic posture, extraction posture
- `performance.md` — runtime budget, JS/TS simplicity, media, motion, dependencies
- `tokens.md` — token naming, fluid/direct responsive systems, color, theme, elements
- `styling.md` — selectors, layers, ownership, modern CSS, specificity
- `components.md` — primitive/component boundaries and `--e-*`
- `grid.md` — grid attributes and layout tokens
- `motion.md` — motion tokens and interaction state
- `forms.md` — field tokens, validation colors, native forms
- `navigation.md` — header/menu/footer patterns
- `sections.md` — themed sections and page rhythm
- `accessibility.md` — semantic baseline, focus, contrast, forms
- `platform.md` — browser-native HTML/CSS/JS posture
- `naming.md` — names for tokens, props, classes, variants
- `examples.md` — composed platform-neutral patterns
- `copy.md` — UX copy boundaries
- `migration.md` — token migration and safe grep rules
- `glossary.md` — canonical vocabulary
- `token-contract.md` — canonical token and CSS ownership contract
- `implementation-bridge.md` — generic bridge from craft backbone to project implementation
