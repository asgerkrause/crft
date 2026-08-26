# CRFT agent contract

## Scope

CRFT is the SNZ CSS, token, class, naming, and architecture strategy plus a reference structure. Read `CRAFT.md`, then only the owners required by its route.

CRFT owns its canonical reference CSS and documented contract. It does not own product strategy, design judgment, taste, brand, content, or product accessibility acceptance.

Within the reference, CSS owns live values, formulas, breakpoints, selectors, skins, and reduced-motion behavior. Documentation explains decisions and use. Examples are evidence, not API.

CRFT is not a component library. `.btn`, `.crd`, and `.lnk` are project conventions. CRFT may document their project use, but must not add canonical styling, variants, tokens, markup contracts, or behavior.

## CSS ownership

This repository loads `styles/global.css` once. For each affected subsystem, consumers may use guidance only, extract project-owned parts into an existing stylesheet, copy selected complete layers, or explicitly adopt the full reference. Local extraction and selected complete layers may coexist; extraction itself grants no CRFT hooks. The copier supports the whole-layer modes only. Consumers do not copy `global.css`.

```css
@layer reset, base, tokens, type, layout, grid, motion, utility;
```

- `base.css`: `@layer reset` then `@layer base`. Reset strips the user agent without tokens. Base supplies native defaults, focus, active colors, disclosure animation, and squircle corners.
- `tokens.css`: all public tokens, semantic colors, skins, scales, and reduced motion.
- `fonts.css`: optional SNZ `@font-face` rules in `@layer type`.
- `type.css`: type roles, `t` flags, and `l`.
- `layout.css`: page spacing, `section > [c]`, stacks, and `.img-w`.
- `grid.css`: `g`, `x`, `y`, and `o`.
- `motion.css`: image scrub and view transitions.
- `utility.css`: `.sr` and `.sr.focusable`.

Put a shared rule in the first owner that fully explains it. Consumers own every result. Brand in a copied complete `tokens.css` or the project’s existing token owner. Keep product CSS in the project’s normal owner.

The complete-layer public API consists of live token names in `tokens.css`, documented selectors and attributes still present in their owning layer, the named `container` context, and retained native guarantees in `base.css`. File presence alone is not proof after project simplification. A local extraction grants none of these hooks. `craft/tokens.md` documents every exact public reference token name and job without copying live values.

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
- Use tokens by semantic job. Keep a calculated relationship only when the adopted strategy uses it; otherwise keep a local literal and delete unused token machinery.
- Use padding and margin shorthand when one declaration controls multiple sides.
- Use `*-block` or `*-inline` when both sides of one axis share a value. Use `*-top`, `*-right`, `*-bottom`, or `*-left` for one physical side.
- Set `font-weight` and `font-variation-settings: "wght"` to the same token. Do not set one without the other.
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

Choose the least complete mode for each affected subsystem before asking which layers to copy. The copier is optional whole-layer convenience. It writes requested layer files plus `layers/crft-manifest.json` (revision, hashes, contract snapshot) and refuses conflicts; it never merges, upgrades owned files, or writes `global.css`. `--fonts` is optional. `node scripts/emit-contract.mjs` prints the machine-readable contract. `node scripts/check-project.mjs <styles-dir>` verifies a consumer's CSS against its adopted contract.

For local extraction, keep only observed semantic jobs and useful relationships in the project’s existing owners. Remove unused token families, ratios, formulas, private state, selectors, and dependencies. Static project type must not retain the reference fluid machinery.

Preserve semantic elements, native controls, visible focus, labels, names, source order, screen-reader recovery, contrast, reduced motion, and unsupported-feature fallbacks. Product authority owns design and accessibility acceptance.

For every change:

1. Read the affected owners and live CSS.
2. Trace selectors, tokens, consumers, states, and fallbacks.
3. Make the smallest coherent owner-local change.
4. Update affected canonical guidance and specimens.
5. Search consumers before deletion.
6. Run applicable static, unit, copy, reference, and rendered checks.
7. Report evidence, limits, and remaining uncertainty.

Never commit, push, publish, deploy, rename a repository, or change production configuration without explicit current-user authority.
