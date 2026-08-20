# CRFT agent contract

## Scope

CRFT is the complete SNZ frontend design and CSS system. Read `CRAFT.md`, then only the owners required by its route.

CSS owns live values, formulas, breakpoints, selectors, skins, and reduced-motion behavior. Documentation owns decisions and use. Examples are evidence, not API.

CRFT is not a component library. `.btn`, `.crd`, and `.lnk` are project conventions. CRFT may document their project use, but must not add canonical styling, variants, tokens, markup contracts, or behavior.

## CSS ownership

This repository loads `styles/global.css` once. Consumers copy selected `layers/*.css` files and put the printed prelude in their own CSS entry. They do not copy `global.css`.

```css
@layer reset, base, tokens, type, layout, grid, motion, utility;
```

- `base.css`: `@layer reset` then `@layer base`. Neutralize the user agent, then native defaults, focus, active colors, disclosure animation, and squircle corners.
- `tokens.css`: all public tokens, semantic colors, skins, scales, and reduced motion.
- `fonts.css`: optional SNZ `@font-face` rules in `@layer type`.
- `type.css`: type roles, `t` flags, and `l`.
- `layout.css`: page spacing, `section > [c]`, stacks, and `.img-w`.
- `grid.css`: `g`, `x`, `y`, and `o`.
- `motion.css`: image scrub and view transitions.
- `utility.css`: `.sr` and `.sr.focusable`.

Put a shared rule in the first owner that fully explains it. Consumers own their copy. Brand in `tokens.css`. Keep product CSS in the project’s normal owner.

Public API consists of token names declared in `tokens.css`, documented selectors and attributes, the named `container` context, and native guarantees in `base.css`. `craft/tokens.md` documents every exact public token name and job without copying live values.

These properties are private:

- `--l-gc`
- `--l-cs`
- `--l-rs`
- `--or`
- `--m-src-to`
- `--m-src-fr`
- `--m-plx`
- `--t-st`
- `--t-fs-lo`
- `--t-fs-hi`
- `--t-fs-sl`

Never use them in product CSS or public examples. The isolated reference may consume `--m-src-to` for its section indicator.

## Implementation

Use the first complete option:

1. Existing project owner.
2. Semantic HTML and native behavior.
3. Existing public CRFT API.
4. Public token in project CSS.
5. Scoped token override.
6. One direct project rule.
7. Small JavaScript behavior.
8. Shared API after unrelated consumers prove the role.

Prefer deletion, reuse, and direct code over wrappers, flags, helper classes, state styling, and dependencies.

## HTML and CSS

- Use `body > header` with navigation, `body > main > section`, and `body > footer` unless project truth requires another coherent structure.
- Add an `id` only for a fragment, native or ARIA relationship, behavior, integration, or stable external identity. Keep every ID unique and non-empty.
- Give a section a useful heading when its content has one. Add `aria-labelledby` only when the section should become a useful named region. Do not put a class on `section`.
- Place `c` only inside page landmarks. `section > [c]` establishes the named query context.
- Keep DOM, reading, heading, and keyboard order meaningful without CSS.
- Prefer semantic elements, native attributes, ARIA state, `:has()`, and bounded local structure before classes. Add a class only for a stable component, page scope, behavior, or visual role that structure cannot safely own.
- Keep nesting shallow and specificity flat.
- Use tokens by semantic job. Keep local literals and formulas local.
- Use padding and margin shorthand when one declaration controls multiple sides.
- Use `*-block` or `*-inline` when both sides of one axis share a value. Use `*-top`, `*-right`, `*-bottom`, or `*-left` for one physical side.
- Use normal `font-weight`, not `font-variation-settings`.
- Override a type role’s `--t-*-mw` token instead of setting heading or text-role `max-width`.

## Grid and color

A responsive `[g]` is a descendant of `section > [c]`, not the boundary itself. Without that ancestor it stays stacked.

- `g`: empty, `N`, `L-M`, or a documented special mode.
- `x`: `N` or `L-M`; `0` means full row and `1`–`12` are spans.
- `y`: `N` or `L-M`; spans are `1`–`4`.
- `o`: always full `L-M-S` using `f`, `a`, or `l`.

Visual order does not change source order.

Use `data-skin` for canvas context. Use `data-accent` to route `secondary`, `tertiary`, `success`, `warning`, or `danger`. Color and motion never carry meaning alone.

## Adoption and quality

```sh
node scripts/copy-system.mjs --dry-run --layers tokens <absolute-target>
node scripts/copy-system.mjs --layers full <absolute-target>
```

Ask which layers to copy. The copier writes those layer files and refuses conflicts. It never merges, upgrades owned files, or writes `global.css`. `--fonts` is optional.

Preserve semantic elements, native controls, visible focus, labels, names, source order, screen-reader recovery, contrast, reduced motion, and unsupported-feature fallbacks.

For every change:

1. Read the affected owners and live CSS.
2. Trace selectors, tokens, consumers, states, and fallbacks.
3. Make the smallest coherent owner-local change.
4. Update affected canonical guidance and specimens.
5. Search consumers before deletion.
6. Run applicable static, unit, copy, reference, and rendered checks.
7. Report evidence, limits, and remaining uncertainty.

Never commit, push, publish, deploy, rename a repository, or change production configuration without explicit current-user authority.
