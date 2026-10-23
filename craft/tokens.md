---
title: CRFT tokens
status: canonical
owner: tokens
read_when: Finding a token, changing brand values, choosing semantic roles, creating local properties, or checking public and private boundaries.
---

# Tokens

Within the complete CRFT reference, `styles/tokens.css` is the sole catalog and authority for public token values, formulas, schemes, skins, responsive scales, and reduced-motion substitutions. Behavior owners may keep private calculation state. This file documents every public reference token name and its semantic job; it does not prescribe a project’s token inventory or values.

## Use and admission

Use the first complete option:

1. Existing semantic token with the required job.
2. Scoped override of that token when the job remains the same.
3. Local custom property for a repeated relationship inside one project owner.
4. Direct literal when the value is local and clearer than indirection.
5. New public token only after unrelated consumers prove one reusable system role.

Do not mirror every literal as a token. Do not use palette swatches where a semantic role exists. A public CRFT token name must preserve semantic indirection and remain compatible with its complete reference family.

Keep a calculated value when the relationship itself is useful and adopted. Do not add a public token that only restates existing math. A page chrome band is `calc((var(--bleed-y) * 2) + var(--header))`, not `--page-chrome`. Use a direct project value when no durable relationship exists.

Projects own copied token values and local extracts. A copied complete `tokens.css` keeps its public contract; a local extraction keeps only the semantic jobs and relationships the project uses. A copied project does not owe CRFT a complete token family after it intentionally re-homes that family into project CSS. Put base brand values in the selected project owner and keep campaign-only or component-only variation at its narrowest boundary.

## Names and scope

Public names describe jobs: canvas, text, body-size, bleed-x, gap, padding, radius, duration. Font, size, weight, leading, tracking, measure, case, features, axes, and optical-sizing are role metadata. Scale ratios are independent. Fluid arithmetic inputs are unitless rem magnitudes; final sizes are lengths.

Recipes rebind at :root and data-theme boundaries. The `--on-*` companions resolve at :root only; a source retuned at a theme or other descendant boundary redeclares its companion there. Skin/accent boundaries rebind color dependencies only. Local final role overrides are supported; arbitrary descendant foundation overrides are not. Private calculation names begin --_; existing grid/motion private names remain private even when a declaration appears in tokens.css.

A public token lands in tokens.css, this exact index, the live reference catalog, and meaningful contract checks. CSS owns values. Product extensions use explicit --x-* or locally declared properties.

## Public token index

The names between the index markers must exactly match declarations in `styles/tokens.css`. Jobs are documented here. Values remain in CSS.

<!-- public-token-index:start -->

| Token | Job |
| --- | --- |
| `--accent` | Accent semantic color role |
| `--accent-border` | Accent border semantic color role |
| `--accent-surface` | Accent surface semantic color role |
| `--accent-text` | Accent text semantic color role |
| `--bleed-x` | Horizontal page breathing room |
| `--bleed-y` | Vertical section breathing room |
| `--body-axes` | Body role font variation settings excluding wght |
| `--body-case` | Body role text transform |
| `--body-features` | Body role OpenType feature settings |
| `--body-font` | Body role font family |
| `--body-leading` | Body role line height |
| `--body-max` | Body role maximum endpoint in rem magnitudes |
| `--body-measure` | Body role readable measure |
| `--body-min` | Body role minimum endpoint in rem magnitudes |
| `--body-optical-sizing` | Body role optical sizing policy |
| `--body-size` | Body role final font size; literal override takes precedence |
| `--body-step` | Body role integer modular-scale exponent |
| `--body-tracking` | Body role letter spacing |
| `--body-weight` | Body role ordinary font weight |
| `--border` | Semantic border color |
| `--border-width` | Border thickness |
| `--canvas` | Active canvas |
| `--canvas-base` | Approved scheme canvas foundation |
| `--caption-axes` | Caption role font variation settings excluding wght |
| `--caption-case` | Caption role text transform |
| `--caption-features` | Caption role OpenType feature settings |
| `--caption-font` | Caption role font family |
| `--caption-leading` | Caption role line height |
| `--caption-max` | Caption role maximum endpoint in rem magnitudes |
| `--caption-measure` | Caption role readable measure |
| `--caption-min` | Caption role minimum endpoint in rem magnitudes |
| `--caption-optical-sizing` | Caption role optical sizing policy |
| `--caption-size` | Caption role final font size; literal override takes precedence |
| `--caption-step` | Caption role integer modular-scale exponent |
| `--caption-tracking` | Caption role letter spacing |
| `--caption-weight` | Caption role ordinary font weight |
| `--content-max` | Default content measure |
| `--control` | Native control height for buttons, inputs, selects, and textareas |
| `--danger` | Danger semantic color role |
| `--display-axes` | Display role font variation settings excluding wght |
| `--display-case` | Display role text transform |
| `--display-features` | Display role OpenType feature settings |
| `--display-font` | Display role font family |
| `--display-leading` | Display role line height |
| `--display-max` | Display role maximum endpoint in rem magnitudes |
| `--display-measure` | Display role readable measure |
| `--display-min` | Display role minimum endpoint in rem magnitudes |
| `--display-optical-sizing` | Display role optical sizing policy |
| `--display-size` | Display role final font size; literal override takes precedence |
| `--display-step` | Display role integer modular-scale exponent |
| `--display-tracking` | Display role letter spacing |
| `--display-weight` | Display role ordinary font weight |
| `--duration` | duration motion timing |
| `--duration-lg` | duration-lg motion timing |
| `--duration-sm` | duration-sm motion timing |
| `--duration-xl` | duration-xl motion timing |
| `--duration-xs` | duration-xs motion timing |
| `--ease-glide` | glide timing function |
| `--ease-in` | in timing function |
| `--ease-in-out` | in-out timing function |
| `--ease-out` | out timing function |
| `--ease-spring` | spring timing function |
| `--fluid-max` | Shared maximum viewport bound in rem magnitudes |
| `--fluid-min` | Shared minimum viewport bound in rem magnitudes |
| `--font` | Body font foundation |
| `--font-display` | Display font foundation |
| `--font-mono` | Monospace font stack |
| `--font-sans` | Sans font stack |
| `--font-serif` | Serif font stack |
| `--gap` | gap scale member |
| `--gap-lg` | gap lg scale member |
| `--gap-ratio` | gap ratio scale ratio |
| `--gap-sm` | gap sm scale member |
| `--gap-xl` | gap xl scale member |
| `--gap-xs` | gap xs scale member |
| `--h1-axes` | H1 role font variation settings excluding wght |
| `--h1-case` | H1 role text transform |
| `--h1-features` | H1 role OpenType feature settings |
| `--h1-font` | H1 role font family |
| `--h1-leading` | H1 role line height |
| `--h1-max` | H1 role maximum endpoint in rem magnitudes |
| `--h1-measure` | H1 role readable measure |
| `--h1-min` | H1 role minimum endpoint in rem magnitudes |
| `--h1-optical-sizing` | H1 role optical sizing policy |
| `--h1-size` | H1 role final font size; literal override takes precedence |
| `--h1-step` | H1 role integer modular-scale exponent |
| `--h1-tracking` | H1 role letter spacing |
| `--h1-weight` | H1 role ordinary font weight |
| `--h2-axes` | H2 role font variation settings excluding wght |
| `--h2-case` | H2 role text transform |
| `--h2-features` | H2 role OpenType feature settings |
| `--h2-font` | H2 role font family |
| `--h2-leading` | H2 role line height |
| `--h2-max` | H2 role maximum endpoint in rem magnitudes |
| `--h2-measure` | H2 role readable measure |
| `--h2-min` | H2 role minimum endpoint in rem magnitudes |
| `--h2-optical-sizing` | H2 role optical sizing policy |
| `--h2-size` | H2 role final font size; literal override takes precedence |
| `--h2-step` | H2 role integer modular-scale exponent |
| `--h2-tracking` | H2 role letter spacing |
| `--h2-weight` | H2 role ordinary font weight |
| `--h3-axes` | H3 role font variation settings excluding wght |
| `--h3-case` | H3 role text transform |
| `--h3-features` | H3 role OpenType feature settings |
| `--h3-font` | H3 role font family |
| `--h3-leading` | H3 role line height |
| `--h3-max` | H3 role maximum endpoint in rem magnitudes |
| `--h3-measure` | H3 role readable measure |
| `--h3-min` | H3 role minimum endpoint in rem magnitudes |
| `--h3-optical-sizing` | H3 role optical sizing policy |
| `--h3-size` | H3 role final font size; literal override takes precedence |
| `--h3-step` | H3 role integer modular-scale exponent |
| `--h3-tracking` | H3 role letter spacing |
| `--h3-weight` | H3 role ordinary font weight |
| `--header` | Shared header height |
| `--label-axes` | Label role font variation settings excluding wght |
| `--label-case` | Label role text transform |
| `--label-features` | Label role OpenType feature settings |
| `--label-font` | Label role font family |
| `--label-leading` | Label role line height |
| `--label-max` | Label role maximum endpoint in rem magnitudes |
| `--label-measure` | Label role readable measure |
| `--label-min` | Label role minimum endpoint in rem magnitudes |
| `--label-optical-sizing` | Label role optical sizing policy |
| `--label-size` | Label role final font size; literal override takes precedence |
| `--label-step` | Label role integer modular-scale exponent |
| `--label-tracking` | Label role letter spacing |
| `--label-weight` | Label role ordinary font weight |
| `--lead-axes` | Lead role font variation settings excluding wght |
| `--lead-case` | Lead role text transform |
| `--lead-features` | Lead role OpenType feature settings |
| `--lead-font` | Lead role font family |
| `--lead-leading` | Lead role line height |
| `--lead-max` | Lead role maximum endpoint in rem magnitudes |
| `--lead-measure` | Lead role readable measure |
| `--lead-min` | Lead role minimum endpoint in rem magnitudes |
| `--lead-optical-sizing` | Lead role optical sizing policy |
| `--lead-size` | Lead role final font size; literal override takes precedence |
| `--lead-step` | Lead role integer modular-scale exponent |
| `--lead-tracking` | Lead role letter spacing |
| `--lead-weight` | Lead role ordinary font weight |
| `--lift` | Native overlay entry distance |
| `--muted` | Opaque readable secondary text |
| `--on-accent` | Contrasting content on solid accent |
| `--on-danger` | Contrasting content on solid danger |
| `--on-secondary` | Contrasting content on solid secondary |
| `--on-success` | Contrasting content on solid success |
| `--on-tertiary` | Contrasting content on solid tertiary |
| `--on-warning` | Contrasting content on solid warning |
| `--padding` | padding scale member |
| `--padding-lg` | padding lg scale member |
| `--padding-ratio` | padding ratio scale ratio |
| `--padding-sm` | padding sm scale member |
| `--padding-xl` | padding xl scale member |
| `--padding-xs` | padding xs scale member |
| `--palette-blue` | Blue palette input; no feedback approval implied |
| `--palette-dark` | Dark palette input; no feedback approval implied |
| `--palette-green` | Green palette input; no feedback approval implied |
| `--palette-light` | Light palette input; no feedback approval implied |
| `--palette-orange` | Orange palette input; no feedback approval implied |
| `--palette-purple` | Purple palette input; no feedback approval implied |
| `--palette-red` | Red palette input; no feedback approval implied |
| `--palette-yellow` | Yellow palette input; no feedback approval implied |
| `--query-lg` | Large container threshold |
| `--query-md` | Medium container threshold |
| `--radius` | radius scale member |
| `--radius-lg` | radius lg scale member |
| `--radius-ratio` | radius ratio scale ratio |
| `--radius-sm` | radius sm scale member |
| `--radius-xl` | radius xl scale member |
| `--radius-xs` | radius xs scale member |
| `--secondary` | Secondary semantic color role |
| `--secondary-border` | Secondary border semantic color role |
| `--secondary-surface` | Secondary surface semantic color role |
| `--secondary-text` | Secondary text semantic color role |
| `--small-axes` | Small role font variation settings excluding wght |
| `--small-case` | Small role text transform |
| `--small-features` | Small role OpenType feature settings |
| `--small-font` | Small role font family |
| `--small-leading` | Small role line height |
| `--small-max` | Small role maximum endpoint in rem magnitudes |
| `--small-measure` | Small role readable measure |
| `--small-min` | Small role minimum endpoint in rem magnitudes |
| `--small-optical-sizing` | Small role optical sizing policy |
| `--small-size` | Small role final font size; literal override takes precedence |
| `--small-step` | Small role integer modular-scale exponent |
| `--small-tracking` | Small role letter spacing |
| `--small-weight` | Small role ordinary font weight |
| `--space` | space scale member |
| `--space-lg` | space lg scale member |
| `--space-ratio` | space ratio scale ratio |
| `--space-sm` | space sm scale member |
| `--space-xl` | space xl scale member |
| `--space-xs` | space xs scale member |
| `--success` | Success semantic color role |
| `--surface` | Subtle surface on the active canvas |
| `--tertiary` | Tertiary semantic color role |
| `--tertiary-border` | Tertiary border semantic color role |
| `--tertiary-surface` | Tertiary surface semantic color role |
| `--tertiary-text` | Tertiary text semantic color role |
| `--text` | Active readable foreground |
| `--text-base` | Approved scheme foreground foundation |
| `--transition-blur` | blur for navigation view transitions |
| `--transition-duration` | duration for navigation view transitions |
| `--transition-in-x` | in x for navigation view transitions |
| `--transition-in-y` | in y for navigation view transitions |
| `--transition-out-x` | out x for navigation view transitions |
| `--transition-out-y` | out y for navigation view transitions |
| `--type-max` | Maximum base text size in rem magnitudes |
| `--type-min` | Minimum base text size in rem magnitudes |
| `--type-ratio-max` | Maximum type ratio |
| `--type-ratio-min` | Minimum type ratio |
| `--warning` | Warning semantic color role |
| `--weight` | Ordinary font weight |
| `--weight-bold` | Strong emphasis weight |
| `--weight-light` | Light font weight |

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
- Setting a heading’s `max-width` instead of its matching `--ROLE-measure` token.
- Using private grid or scrub state in project CSS.
- Copying token values into documentation.
- Preserving an unused ratio, formula, private property, or family member only to resemble CRFT.

## Verify

Search every consumer before renaming or deleting a token. Check all skins, accents, schemes, responsive states, type roles, motion preference, and copied project ownership affected by a change. Run `node scripts/check-system.mjs` to compare this index with live declarations.

Theme font inputs are --font, --font-display, --font-mono and weight foundations. Raw sans/serif convenience aliases resolve at root. Derived role font/weight aliases rebind at themes; reapply root final role font/weight exceptions at that boundary or below it. Literal leading/tracking/measure/case/features/axes/optical-sizing metadata inherits through themes. Theme colors use semantic colors and palette-light/dark scheme bases; arbitrary palette changes do not automatically reroute semantic colors.
