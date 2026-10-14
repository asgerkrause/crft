# CRFT implementation handoff — CR1

Repository: `/Users/krause/dev/repos/crft`.
Read [README](README.md) and [contract](contract.md) first. Status: CR1 implemented locally under P0 `brand-system-1`; integrated checks pass. See current [three-file evidence and limits](CORE3-EVIDENCE.md); [CR1 evidence](CR1-EVIDENCE.md) is historical. Delivery status is tracked in [PR #7](https://github.com/sanitizestudio/crft/pull/7).

## Outcome

The CRFT reference demonstrates the shared brand contract with live endpoint calculations, static values, semantic type roles, minimal classes, and the g/c/r/o grid grammar. Two synthetic brands use the same markup. The public contract, documentation, copier, consumer checker, and examples agree.

P0 dependency satisfied: `contract.md` freezes inventory, font policy, scope rules, fixture shape, and version transition as `brand-system-1`. CRFT goes first as a browser proof; it must not invent a competing long-term brand schema.

## Pre-migration baseline (historical)

- `styles/layers/type.css` already derives fluid typography from body-size and ratio endpoints, using steps 5 through -1 and shared viewport bounds. Native headings are included in the calculation boundary.
- `styles/layers/tokens.css` owns public tokens, independent space/gap/padding/radius ratios, colors, and role metadata. Current type role sizes are calculated in the type layer rather than exposed as independent public role-size tokens.
- `styles/layers/layout.css` uses `[c]`, `[s]`, and `section > [c]`; grid uses g/x/y/o. Current auto modes a/a-sm/a-lg are auto-fill.
- Current complete type adoption is fluid; static typography is documented as project extraction. The proposed contract makes static and fluid first-class behind one role interface.
- Existing rules enforce paired font-weight/wght and forbid data-theme. The proposal intentionally revisits these; migrate their guidance and gates together after approval.
- History: `8504d0d` has older class typography and g/c/r/o; `f84c88d` introduces type attributes while keeping older containers/grid; `88ef1ed` makes the broader attribute migration. Read via git show, not checkout/reset.
- Installed `/Users/krause/.agents/skills/crft` points to this repository's `skills/crft`. There is no observed `/Users/krause/dev/repos/ak/skills/crft`; do not create a duplicate skill there.

## Owns and source route

Read `AGENTS.md` and `CRAFT.md`, then the CSS API/adoption route: affected type, tokens, layout, grid, color owners, plus adoption and verification. Read matching live CSS before editing.

Candidate scope, narrowed by actual consumer searches:

- `styles/global.css`, `styles/tokens.css`, and `styles/crft.css`; logical layers keep their existing jobs.
- `CRAFT.md`, affected `craft/*.md`, `AGENTS.md`, and `skills/crft/SKILL.md` for approved contract changes. Source skill edits become live through the existing symlink.
- `scripts/emit-contract.mjs`, `check-system.mjs`, `check-project.mjs`, `copy-system.mjs`, `build-dist.mjs`, and their existing tests when contract/adoption behavior changes.
- `reference/src/sections/`, other reference consumers found by search, `reference/tests/`, reference checks, and `examples/`.

Do not edit Brand OS or AK implementation in this unit. Do not add canonical button/card/link styling, new dependencies, production changes, or a universal component library. Preserve source-order and accessibility behavior while removing obsolete flags.

## Work

1. Inventory every current public token/hook and its consumers. Produce an old → new → removed/mapped/local table. Decide native h4/h5/h6 fallbacks and removed t-flag replacements before deletion. Do not replace an old utility matrix with a new one.
2. Implement shared-range endpoint math with readable public foundations and role outputs. Preserve independent family ratios, explicit endpoints, and final-role overrides. Rebind calculations at documented scopes. Keep private state private. Use fixture brand inputs rather than introducing a second authoritative schema.
3. Implement native type defaults and limited role classes. Use lead, leading, tracking, weight, and measure consistently. Apply the P0 font policy, retaining brand axes, emphasis, fallback behavior, and range declarations.
4. Restore the minimal class/container and g/c/r/o grammar. Add six intrinsic fit/fill modes; validate spans against their direct parent's tracks. Keep numbered-grid stacked fallback and source-order guarantees. Test nested grids and subgrid behavior.
5. Migrate semantic colors, theme/skin/accent contexts, layout tokens, reduced-motion consumers, and retained native defaults coherently. Do not silently preserve known unreadable muted-text treatment as a new approved semantic role.
6. Update public inventories, manifests, copier behavior, consumer validation, documentation, and specimens in the same coherent change. The checker must validate exact approved names and supported project extensions, not merely the old abbreviated-prefix regex. Preserve optional adoption and local extraction; do not require every project to copy the full tree.
7. Demonstrate fluid, static, and mixed outputs with two synthetic brands and the same page structure. Record endpoint values and role mappings in a compact fixture handoff for BO1.

## Acceptance and verification

CR1 covers A1–A4, the browser part of A6, and CRFT parts of A7/A8. Implement meaningful regression tests for changed behavior, not snapshots that merely repeat declarations.

Run from the repository root:

```sh
node scripts/check-system.mjs
node --test scripts/*.test.mjs
node scripts/emit-contract.mjs
bun run build
```

Run from `reference/`:

```sh
bun run test
bun run test:rendered
```

Inspect package scripts again before running; these were present at handoff time. Test copier/consumer compatibility in disposable targets using existing tests, never by overwriting an existing client stylesheet.

Rendered acceptance must include:

- Every used type step at/below/inside/above bounds; changed root font sizes, browser zoom, 200% enlargement, narrow reflow, long multilingual headings, and font fallbacks. Positive rem terms or a numeric ratio budget alone do not establish accessibility.
- Static-only and mixed profiles with no accidental viewport dependency in static outputs.
- Root foundation changes, supported context changes, and local final-role overrides. A test must expose a stale inherited formula if a boundary fails to rebind it.
- Fit/fill with 1, 2, and 7 items at narrow/wide widths; c=0; invalid numeric spans; nested grids; numbered no-container fallback; meaningful focus order with visual ordering.
- Native details[open], custom disclosure state, visible focus, reduced motion, scheme/skin/accent nesting, and actual text contrast without unjustified exemptions.
- Variable weights and nested strong/b under the selected axis policy, static fallback weights, custom axes preservation, and genuine font-loading evidence.

## Deliver to BO1

Record exact revision, final public role/selector inventory, unit conventions, two synthetic recipe inputs, expected endpoint/static outputs, permitted scope overrides, migration table, and support targets. Separate source checks from rendered facts and human design acceptance. Report deviations from `contract.md` to the coordinator before changing downstream expectations.

CR1 is implemented and verified; PR #7 records its delivery status. Use [current three-file evidence](CORE3-EVIDENCE.md) and its exact hashes to identify this handoff, and preserve its verification limits.
