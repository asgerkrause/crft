# CR1 implementation evidence

Contract: `brand-system-1`, frozen by P0 on 2026-10-13 under AK's explicit instruction to take P0 and implement CR1. Source base: `7358c7ef477a0b1890951bc8f967b2bea00f28b1`. Implementation is local and uncommitted; this is not a release revision. Final file hashes are recorded in `CR1-SHA256.json`.

## BO1 handoff

- [Frozen contract](contract.md): approved shared decisions, supported scopes, font policy, fixture shape and exact 154-token migration inventory.
- [Public inventory](../../reference/fixtures/public-contract.json): emitted CRFT contract v2, including 221 public tokens and 8 private properties. CSS remains authoritative.
- [Fixture guide](../../reference/fixtures/README.md), [fluid brand](../../reference/fixtures/fluid.json), [static brand](../../reference/fixtures/static.json), [mixed profile](../../reference/fixtures/mixed.json): synthetic inputs and expected numeric endpoint/static values. These are bounded browser proof fixtures; BO1 owns the production schema.
- [Fixture adapter](../../reference/fixtures/recipes.mjs): validates explicit dimensions and emits CSS. It is not a shared production scale engine.
- [Type](../../craft/type.md), [grid](../../craft/grid.md), [layout](../../craft/layout.md), [color](../../craft/color.md), and [adoption/migration](../../craft/adopt.md): canonical usage and migration guidance.

Roles: display, h1, h2, h3, lead, body, small, label and caption. Steps are 5, 4, 3, 2, 1, 0, −1, −1 and −1. Native h4–h6 use the h3 treatment while preserving heading semantics. Explicit role classes override native roles.

Inputs express fluid bounds and type endpoints as unitless rem magnitudes; ratios and steps are unitless. Final role sizes are lengths. Fixture dimensions carry explicit `{ value, unit }`; tracking uses em and measure uses ch. Final size overrides endpoints; explicit endpoints override step derivation. Independent space, gap, padding and radius relationships remain independent.

Containers use `.c`, `.c.sm` and `.c.lg`; stacks use `.s`. Grids use g/c/r/o; six intrinsic fit/fill modes work without a named container. Numbered grids use `section > .c` and remain stacked without the query context. Spans belong to their direct parent. The checker rejects removed attributes and invalid/mixed contracts rather than silently translating them.

Root and `[data-theme]` rebind derived recipes. Literal role metadata inherits. Theme font foundations and weight inputs rebind; final role font/weight exceptions must be reapplied at the theme or below. Arbitrary descendant foundation changes are unsupported; final local role overrides work. Theme colors consume semantic inputs and palette-light/dark; arbitrary palette swatches do not automatically reroute inherited semantic inputs. Skins choose a canvas from the current scheme without cumulative transformations. Standard font-weight preserves nested emphasis; canonical axes exclude wght and preserve other axes.

## Verification

Checks ran in `/Users/krause/dev/repos/crft` after integrating the reviewed worktree:

| Check | Result |
| --- | --- |
| `node scripts/check-system.mjs` | PASS — 221 public tokens, 8 private properties, 8 layers |
| `node --test scripts/*.test.mjs` | PASS — 106 tests, zero failures or skips; includes copier/consumer/manifest regressions |
| `node scripts/emit-contract.mjs` | PASS — v2 output exactly matches the saved public-contract fixture |
| `bun run build` | PASS — standalone distribution |
| reference `bun run test` | PASS — 2 routes, 13 sections, 44 fixtures, 221 tokens; no hydrated islands |
| reference `bun run test:rendered` | PASS — 23 Chromium tests, including axe without exemptions |
| Strict TypeScript on `reference/src/data.ts` | PASS — existing installed compiler; strict, noUncheckedIndexedAccess, exactOptionalPropertyTypes, noEmit, skipLibCheck, esnext/bundler |
| `git diff --check` | PASS |
| Independent source review and focused follow-up | PASS after contrast and subgrid corrections |

The browser suite covers all roles at five widths and three root sizes, static/equal-foundation/mixed output, theme and final overrides, loaded fonts and emphasis, intrinsic modes, full/partial responsive subgrids, unsupported-feature fallbacks, keyboard/disclosures, skin/accent contexts, motion and enlargement. Exact logs are `integrated-*.log` in the Team directory below.

The strict compiler command uses `/Users/krause/dev/repos/ak/node_modules/typescript/bin/tsc`; no dependency was added. It checks the changed TypeScript data owner, not every Astro template.

Coordinator inspected `/brands/` at desktop and 320px. Fluid and static brands use the same page markup with distinct family, hierarchy, spacing and color. The narrow specimen had no horizontal overflow or page errors. This is rendered engineering evidence, not product design acceptance.

A separate Chromium color probe measured muted text on canvas and surface across light/dark × four skins × six accents (96 combinations): minimum contrast 5.1897:1, no failures. Loaded font metadata was inspected from the bundled WOFF files: SNZ Sans supports weight 100–900 and opsz 14–32; SNZ Mono supports weight 100–900.

## Review and agent record

Native Codex workers: `/root/cr1` (implementation) and `/root/cr1_review` (fresh-context source review), coordinated by `/root`. No Herdr pane was created: the live route check returned `pane_not_found`. Native worker status was verified with the collaboration tool; no claim is made about their visibility in the application UI.

Team assignments, reports, check logs and screenshots are retained at `/Users/krause/.local/state/ak/team/crft-brand-system-1/`. The implementation worktree is `/Users/krause/.local/state/ak/worktrees/crft/cr1-brand-system`.

Review identified a missing theme boundary in `prefers-contrast: more`; the selector was corrected and a regression added. Review also identified a possible full-row subgrid custom-property cycle. Chromium reproduced the expected six-column fallback through registered-property inheritance. The implementation now explicitly inherits full-row parent tracks, eliminating the cycle; native/fallback and medium/large responsive span regressions pass. The focused follow-up review passed. Both workers were observed completed and their exact reports reconciled before release.

## Limits

Rendered evidence targets installed Chromium 149.0.7827.55. Firefox and WebKit were not installed and were not tested. Unsupported pow, subgrid and container-query paths are simulated in Chromium by disabling their declarations; this is not evidence from older browser engines.

200% root text enlargement, narrow multilingual reflow and CDP pinch zoom are covered. Desktop browser zoom remains unverified. Axe passes without exemptions, but human accessibility acceptance, assistive-technology sessions and product design acceptance are not established.

BO1, AK1 and INT1 remain separate, unimplemented units. No paper/slide output, cross-format acceptance, client migration, commit, push or deployment is included. The weakest remaining assumption is cross-format hierarchy: real brands may need explicit format-specific values rather than shared ratios.
