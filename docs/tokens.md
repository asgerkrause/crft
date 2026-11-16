---
title: crft tokens
status: canonical
owner: tokens
read_when: Finding a token, changing brand values, choosing semantic roles, creating local properties, or checking public and private boundaries.
---

# Tokens

Within the complete crft reference, `styles/tokens.css` is the sole catalog and authority for public token values, formulas, schemes, themes, responsive scales, and reduced-motion substitutions. Behavior owners may keep private calculation state. This file documents every public reference token name and its semantic job; it does not prescribe a project’s token inventory or values.

## Use and admission

Use the first complete option:

1. Existing semantic token with the required job.
2. Scoped override of that token when the job remains the same.
3. Local custom property for a repeated relationship inside one project owner.
4. Direct literal when the value is local and clearer than indirection.
5. New public token only after unrelated consumers prove one reusable system role.

Do not mirror every literal as a token. Do not use palette swatches where a semantic role exists. A public crft token name must preserve semantic indirection and remain compatible with its complete reference family.

Keep a calculated value when the relationship itself is useful and adopted. Do not add a public token that only restates existing math. A page chrome band is `calc((var(--ak-bleed-y) * 2) + var(--ak-header-height))`, not a new `--ak-page-chrome` token. Use a direct project value when no durable relationship exists.

Projects own copied token values and local extracts. A copied complete `tokens.css` keeps its public contract; a local extraction keeps only the semantic jobs and relationships the project uses. A copied project does not owe crft a complete token family after it intentionally re-homes that family into project CSS. Put base brand values in the selected project owner and keep campaign-only or component-only variation at its narrowest boundary.

## Names and scope

Every public token starts with `--ak-`, so a crft name cannot collide with a token from another CSS library. Names use lowercase words joined by single hyphens. The only abbreviations are the steps `xs`, `sm`, `md`, `lg`, `xl`, the bounds `min` and `max`, the axes `x` and `y`, and the roles `h1`, `h2`, `h3`.

Public names describe jobs: `--ak-canvas`, `--ak-text`, `--ak-body-size`, `--ak-bleed-x`. Each scale (space, gap, padding, radius, duration) has an explicit `md` base step; no bare family name is a token. The multiplier between the steps of a scale is its `scale` token, such as `--ak-gap-scale`. Scale multipliers are independent. Family, size, weight, leading, tracking, measure, case, features, axes, and optical-sizing are role metadata. Fluid arithmetic inputs are unitless rem magnitudes; final sizes are lengths.

The type roles are display, h1, h2, h3, lead, body, small, label, caption, and stat. Each role has the same token set: `--ak-ROLE-step`, `--ak-ROLE-family`, `--ak-ROLE-weight`, `--ak-ROLE-leading`, `--ak-ROLE-tracking`, `--ak-ROLE-measure`, `--ak-ROLE-case`, `--ak-ROLE-features`, `--ak-ROLE-axes`, `--ak-ROLE-optical-sizing`, `--ak-ROLE-size-min`, `--ak-ROLE-size-max`, and `--ak-ROLE-size`.

Contract 4 has no token for the overlay entry distance or the container-query thresholds. The framework uses the literals `0.75rem`, `30rem`, and `60rem`; see [adoption](adopt.md#migrate-contract-3-to-contract-4).

Type, spacing, and radius recipes resolve at :root only. Themes and accent routes rebind color dependencies only.
The `--ak-on-*` companions resolve at :root; retuning a descendant source requires its companion there.
Local final role sizes and metadata remain supported. V3 deliberately removes v2 theme-local foundation recipes.
Private --_ calculations and existing grid/motion private names remain private.

A public token lands in tokens.css, this exact index, the live reference catalog, and meaningful contract checks. CSS owns values. Product extensions use explicit --x-* or locally declared properties. Do not declare a project property with the `--ak-` prefix.

## Public token index

The names between the index markers must exactly match declarations in `styles/tokens.css`. Jobs are documented here. Values remain in CSS.

<!-- public-token-index:start -->

| Token | Job |
| --- | --- |
| `--ak-accent` | Accent semantic color role |
| `--ak-accent-border` | Accent border semantic color role |
| `--ak-accent-surface` | Accent surface semantic color role |
| `--ak-accent-text` | Accent text semantic color role |
| `--ak-bleed-x` | Horizontal page breathing room |
| `--ak-bleed-y` | Vertical section breathing room |
| `--ak-body-axes` | Body role font variation settings excluding wght |
| `--ak-body-case` | Body role text transform |
| `--ak-body-family` | Body role font family |
| `--ak-body-features` | Body role OpenType feature settings |
| `--ak-body-leading` | Body role line height |
| `--ak-body-measure` | Body role readable measure |
| `--ak-body-optical-sizing` | Body role optical sizing policy |
| `--ak-body-size` | Body role final font size; literal override takes precedence |
| `--ak-body-size-max` | Body role maximum endpoint in rem magnitudes |
| `--ak-body-size-min` | Body role minimum endpoint in rem magnitudes |
| `--ak-body-step` | Body role integer modular-scale exponent |
| `--ak-body-tracking` | Body role letter spacing |
| `--ak-body-weight` | Body role ordinary font weight |
| `--ak-border` | Semantic border color |
| `--ak-border-width` | Border thickness |
| `--ak-canvas` | Active canvas |
| `--ak-canvas-base` | Approved scheme canvas foundation |
| `--ak-caption-axes` | Caption role font variation settings excluding wght |
| `--ak-caption-case` | Caption role text transform |
| `--ak-caption-family` | Caption role font family |
| `--ak-caption-features` | Caption role OpenType feature settings |
| `--ak-caption-leading` | Caption role line height |
| `--ak-caption-measure` | Caption role readable measure |
| `--ak-caption-optical-sizing` | Caption role optical sizing policy |
| `--ak-caption-size` | Caption role final font size; literal override takes precedence |
| `--ak-caption-size-max` | Caption role maximum endpoint in rem magnitudes |
| `--ak-caption-size-min` | Caption role minimum endpoint in rem magnitudes |
| `--ak-caption-step` | Caption role integer modular-scale exponent |
| `--ak-caption-tracking` | Caption role letter spacing |
| `--ak-caption-weight` | Caption role ordinary font weight |
| `--ak-content-width` | Default content measure |
| `--ak-control-height` | Native control height for buttons, inputs, selects, and textareas |
| `--ak-danger` | Danger semantic color role |
| `--ak-display-axes` | Display role font variation settings excluding wght |
| `--ak-display-case` | Display role text transform |
| `--ak-display-family` | Display role font family |
| `--ak-display-features` | Display role OpenType feature settings |
| `--ak-display-leading` | Display role line height |
| `--ak-display-measure` | Display role readable measure |
| `--ak-display-optical-sizing` | Display role optical sizing policy |
| `--ak-display-size` | Display role final font size; literal override takes precedence |
| `--ak-display-size-max` | Display role maximum endpoint in rem magnitudes |
| `--ak-display-size-min` | Display role minimum endpoint in rem magnitudes |
| `--ak-display-step` | Display role integer modular-scale exponent |
| `--ak-display-tracking` | Display role letter spacing |
| `--ak-display-weight` | Display role ordinary font weight |
| `--ak-duration-lg` | Motion duration lg step |
| `--ak-duration-md` | Motion duration base step |
| `--ak-duration-sm` | Motion duration sm step |
| `--ak-duration-xl` | Motion duration xl step |
| `--ak-duration-xs` | Motion duration xs step |
| `--ak-ease-glide` | Glide timing function |
| `--ak-ease-in` | In timing function |
| `--ak-ease-in-out` | In-out timing function |
| `--ak-ease-out` | Out timing function |
| `--ak-ease-spring` | Spring timing function |
| `--ak-font-body` | Body font foundation |
| `--ak-font-display` | Display font foundation |
| `--ak-font-mono` | Monospace font stack |
| `--ak-font-sans` | Sans font stack |
| `--ak-font-serif` | Serif font stack |
| `--ak-gap-lg` | Gap scale lg step |
| `--ak-gap-md` | Gap scale base step |
| `--ak-gap-scale` | Gap scale multiplier between steps |
| `--ak-gap-sm` | Gap scale sm step |
| `--ak-gap-xl` | Gap scale xl step |
| `--ak-gap-xs` | Gap scale xs step |
| `--ak-h1-axes` | H1 role font variation settings excluding wght |
| `--ak-h1-case` | H1 role text transform |
| `--ak-h1-family` | H1 role font family |
| `--ak-h1-features` | H1 role OpenType feature settings |
| `--ak-h1-leading` | H1 role line height |
| `--ak-h1-measure` | H1 role readable measure |
| `--ak-h1-optical-sizing` | H1 role optical sizing policy |
| `--ak-h1-size` | H1 role final font size; literal override takes precedence |
| `--ak-h1-size-max` | H1 role maximum endpoint in rem magnitudes |
| `--ak-h1-size-min` | H1 role minimum endpoint in rem magnitudes |
| `--ak-h1-step` | H1 role integer modular-scale exponent |
| `--ak-h1-tracking` | H1 role letter spacing |
| `--ak-h1-weight` | H1 role ordinary font weight |
| `--ak-h2-axes` | H2 role font variation settings excluding wght |
| `--ak-h2-case` | H2 role text transform |
| `--ak-h2-family` | H2 role font family |
| `--ak-h2-features` | H2 role OpenType feature settings |
| `--ak-h2-leading` | H2 role line height |
| `--ak-h2-measure` | H2 role readable measure |
| `--ak-h2-optical-sizing` | H2 role optical sizing policy |
| `--ak-h2-size` | H2 role final font size; literal override takes precedence |
| `--ak-h2-size-max` | H2 role maximum endpoint in rem magnitudes |
| `--ak-h2-size-min` | H2 role minimum endpoint in rem magnitudes |
| `--ak-h2-step` | H2 role integer modular-scale exponent |
| `--ak-h2-tracking` | H2 role letter spacing |
| `--ak-h2-weight` | H2 role ordinary font weight |
| `--ak-h3-axes` | H3 role font variation settings excluding wght |
| `--ak-h3-case` | H3 role text transform |
| `--ak-h3-family` | H3 role font family |
| `--ak-h3-features` | H3 role OpenType feature settings |
| `--ak-h3-leading` | H3 role line height |
| `--ak-h3-measure` | H3 role readable measure |
| `--ak-h3-optical-sizing` | H3 role optical sizing policy |
| `--ak-h3-size` | H3 role final font size; literal override takes precedence |
| `--ak-h3-size-max` | H3 role maximum endpoint in rem magnitudes |
| `--ak-h3-size-min` | H3 role minimum endpoint in rem magnitudes |
| `--ak-h3-step` | H3 role integer modular-scale exponent |
| `--ak-h3-tracking` | H3 role letter spacing |
| `--ak-h3-weight` | H3 role ordinary font weight |
| `--ak-header-height` | Shared header height |
| `--ak-label-axes` | Label role font variation settings excluding wght |
| `--ak-label-case` | Label role text transform |
| `--ak-label-family` | Label role font family |
| `--ak-label-features` | Label role OpenType feature settings |
| `--ak-label-leading` | Label role line height |
| `--ak-label-measure` | Label role readable measure |
| `--ak-label-optical-sizing` | Label role optical sizing policy |
| `--ak-label-size` | Label role final font size; literal override takes precedence |
| `--ak-label-size-max` | Label role maximum endpoint in rem magnitudes |
| `--ak-label-size-min` | Label role minimum endpoint in rem magnitudes |
| `--ak-label-step` | Label role integer modular-scale exponent |
| `--ak-label-tracking` | Label role letter spacing |
| `--ak-label-weight` | Label role ordinary font weight |
| `--ak-lead-axes` | Lead role font variation settings excluding wght |
| `--ak-lead-case` | Lead role text transform |
| `--ak-lead-family` | Lead role font family |
| `--ak-lead-features` | Lead role OpenType feature settings |
| `--ak-lead-leading` | Lead role line height |
| `--ak-lead-measure` | Lead role readable measure |
| `--ak-lead-optical-sizing` | Lead role optical sizing policy |
| `--ak-lead-size` | Lead role final font size; literal override takes precedence |
| `--ak-lead-size-max` | Lead role maximum endpoint in rem magnitudes |
| `--ak-lead-size-min` | Lead role minimum endpoint in rem magnitudes |
| `--ak-lead-step` | Lead role integer modular-scale exponent |
| `--ak-lead-tracking` | Lead role letter spacing |
| `--ak-lead-weight` | Lead role ordinary font weight |
| `--ak-on-accent` | Contrasting content on solid accent |
| `--ak-on-danger` | Contrasting content on solid danger |
| `--ak-on-secondary` | Contrasting content on solid secondary |
| `--ak-on-success` | Contrasting content on solid success |
| `--ak-on-tertiary` | Contrasting content on solid tertiary |
| `--ak-on-warning` | Contrasting content on solid warning |
| `--ak-padding-lg` | Padding scale lg step |
| `--ak-padding-md` | Padding scale base step |
| `--ak-padding-scale` | Padding scale multiplier between steps |
| `--ak-padding-sm` | Padding scale sm step |
| `--ak-padding-xl` | Padding scale xl step |
| `--ak-padding-xs` | Padding scale xs step |
| `--ak-palette-blue` | Blue palette input; no feedback approval implied |
| `--ak-palette-dark` | Dark palette input; no feedback approval implied |
| `--ak-palette-green` | Green palette input; no feedback approval implied |
| `--ak-palette-light` | Light palette input; no feedback approval implied |
| `--ak-palette-orange` | Orange palette input; no feedback approval implied |
| `--ak-palette-purple` | Purple palette input; no feedback approval implied |
| `--ak-palette-red` | Red palette input; no feedback approval implied |
| `--ak-palette-yellow` | Yellow palette input; no feedback approval implied |
| `--ak-radius-lg` | Radius scale lg step |
| `--ak-radius-md` | Radius scale base step |
| `--ak-radius-scale` | Radius scale multiplier between steps |
| `--ak-radius-sm` | Radius scale sm step |
| `--ak-radius-xl` | Radius scale xl step |
| `--ak-radius-xs` | Radius scale xs step |
| `--ak-secondary` | Secondary semantic color role |
| `--ak-secondary-border` | Secondary border semantic color role |
| `--ak-secondary-surface` | Secondary surface semantic color role |
| `--ak-secondary-text` | Secondary text semantic color role |
| `--ak-small-axes` | Small role font variation settings excluding wght |
| `--ak-small-case` | Small role text transform |
| `--ak-small-family` | Small role font family |
| `--ak-small-features` | Small role OpenType feature settings |
| `--ak-small-leading` | Small role line height |
| `--ak-small-measure` | Small role readable measure |
| `--ak-small-optical-sizing` | Small role optical sizing policy |
| `--ak-small-size` | Small role final font size; literal override takes precedence |
| `--ak-small-size-max` | Small role maximum endpoint in rem magnitudes |
| `--ak-small-size-min` | Small role minimum endpoint in rem magnitudes |
| `--ak-small-step` | Small role integer modular-scale exponent |
| `--ak-small-tracking` | Small role letter spacing |
| `--ak-small-weight` | Small role ordinary font weight |
| `--ak-space-lg` | Space scale lg step |
| `--ak-space-md` | Space scale base step |
| `--ak-space-scale` | Space scale multiplier between steps |
| `--ak-space-sm` | Space scale sm step |
| `--ak-space-xl` | Space scale xl step |
| `--ak-space-xs` | Space scale xs step |
| `--ak-stat-axes` | Stat role font variation settings excluding wght |
| `--ak-stat-case` | Stat role text transform |
| `--ak-stat-family` | Stat role font family |
| `--ak-stat-features` | Stat role OpenType feature settings |
| `--ak-stat-leading` | Stat role line height |
| `--ak-stat-measure` | Stat role readable measure |
| `--ak-stat-optical-sizing` | Stat role optical sizing policy |
| `--ak-stat-size` | Stat role final font size; literal override takes precedence |
| `--ak-stat-size-max` | Stat role maximum endpoint in rem magnitudes |
| `--ak-stat-size-min` | Stat role minimum endpoint in rem magnitudes |
| `--ak-stat-step` | Stat role integer modular-scale exponent |
| `--ak-stat-tracking` | Stat role letter spacing |
| `--ak-stat-weight` | Stat role ordinary font weight |
| `--ak-success` | Success semantic color role |
| `--ak-surface` | Subtle surface on the active canvas |
| `--ak-tertiary` | Tertiary semantic color role |
| `--ak-tertiary-border` | Tertiary border semantic color role |
| `--ak-tertiary-surface` | Tertiary surface semantic color role |
| `--ak-tertiary-text` | Tertiary text semantic color role |
| `--ak-text` | Active readable foreground |
| `--ak-text-base` | Approved scheme foreground foundation |
| `--ak-text-muted` | Opaque readable secondary text |
| `--ak-type-scale-max` | Maximum type scale multiplier between steps |
| `--ak-type-scale-min` | Minimum type scale multiplier between steps |
| `--ak-type-size-max` | Maximum base text size in rem magnitudes |
| `--ak-type-size-min` | Minimum base text size in rem magnitudes |
| `--ak-view-transition-blur` | blur for navigation view transitions |
| `--ak-view-transition-duration` | duration for navigation view transitions |
| `--ak-view-transition-in-x` | in x for navigation view transitions |
| `--ak-view-transition-in-y` | in y for navigation view transitions |
| `--ak-view-transition-out-x` | out x for navigation view transitions |
| `--ak-view-transition-out-y` | out y for navigation view transitions |
| `--ak-viewport-max` | Shared maximum viewport bound in rem magnitudes |
| `--ak-viewport-min` | Shared minimum viewport bound in rem magnitudes |
| `--ak-warning` | Warning semantic color role |
| `--ak-weight-bold` | Strong emphasis weight |
| `--ak-weight-light` | Light font weight |
| `--ak-weight-regular` | Regular font weight |

<!-- public-token-index:end -->

## Private state

Never use --_ private calculations or these properties in product CSS or public examples:

- `--l-gc`
- `--l-cs`
- `--l-rs`
- `--or`
- `--m-src-to`
- `--m-src-fr`
- `--m-plx`

They are implementation state for public grid, and motion hooks. Their presence does not create public API.

## Common mistakes

- Using a palette swatch for component text when a semantic role exists.
- Adding a token for one literal or one composition.
- Overriding one scale member without checking the family.
- Setting a heading’s `max-width` instead of its matching `--ak-ROLE-measure` token.
- Using private grid or scrub state in project CSS.
- Copying token values into documentation.
- Preserving an unused ratio, formula, private property, or family member only to resemble crft.

## Verify

Search every consumer before renaming or deleting a token. Check all themes, accents, schemes, responsive states, type roles, motion preference, and copied project ownership affected by a change. Run `node scripts/check-system.mjs` to compare this index with live declarations.

Font and weight foundations resolve at root. Themes preserve inherited final role values.
