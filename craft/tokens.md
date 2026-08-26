---
title: CRFT tokens
status: canonical
owner: tokens
read_when: Finding a token, changing brand values, choosing semantic roles, creating local properties, or checking public and private boundaries.
---

# Tokens

`styles/layers/tokens.css` is the sole catalog and authority for public token values, token formulas, schemes, skins, responsive scales, and reduced-motion substitutions. Behavior owners may keep private calculation state. This file documents every public token name and its semantic job.

## Use and admission

Use the first complete option:

1. Existing semantic token with the required job.
2. Scoped override of that token when the job remains the same.
3. Local custom property for a repeated relationship inside one project owner.
4. Direct literal when the value is local and clearer than indirection.
5. New public token only after unrelated consumers prove one reusable system role.

Do not mirror every literal as a token. Do not use palette swatches where a semantic role exists. A token name must preserve semantic indirection and remain compatible with its complete family.

When a value is a relationship among existing tokens, write `calc()`. Do not add a public token that only restates that math. A page chrome band is `calc((var(--l-bl-y) * 2) + var(--l-hh))`, not `--page-chrome`. Add a token only when the job is independent.

Projects own copied token values. Put base brand values in the copied `styles/layers/tokens.css`. Keep campaign-only or component-only variation at its narrowest project boundary.

## Family grammar

| Family | Job |
| --- | --- |
| `--l-*` | Page and content layout roles |
| `--s-*` | Structural spacing scale |
| `--g-*` | Gaps between peers or stack children |
| `--p-*` | Internal padding |
| `--r-*` | Radius scale |
| `--b-*` | Border roles |
| `--c-*` | Palette sources, semantic color, skins, accents, and feedback |
| `--t-*` | Font, weight, scale, type role, and measure |
| `--m-*` | Motion timing functions and durations |

Scale families use `xs`, `sm`, the unsuffixed anchor, `lg`, and `xl`. Their `rt` member controls the family ratio. Change a complete family coherently.

Type-role suffixes have stable jobs: `lh` line height, `ls` letter spacing, `fw` font weight, `tt` text transform, and `mw` readable maximum measure. Fluid font size comes from the shared type foundations and the native or explicit `t` role.

## Public token index

The names between the index markers must exactly match declarations in `styles/layers/tokens.css`. Jobs are documented here. Values remain in CSS.

<!-- public-token-index:start -->

### Layout

| Tokens | Job |
| --- | --- |
| `--l-hh` | Shared header-height role for project composition |
| `--l-vp-min`, `--l-vp-max` | Shared minimum and maximum viewport bounds for responsive formulas |
| `--l-cw` | Default content measure; narrow and wide `c` variants derive from it |
| `--l-bl-x`, `--l-bl-y` | Page "bleed" x- and y axes |
| `--l-cq-md`, `--l-cq-lg` | Medium and large named container-query thresholds; grid queries must match these values |

### Structural scales

| Tokens | Job |
| --- | --- |
| `--s-rt` | Structural-spacing scale ratio |
| `--s`, `--s-xs`, `--s-sm`, `--s-lg`, `--s-xl` | Structural-spacing anchor and steps |
| `--g-rt` | Gap scale ratio |
| `--g`, `--g-xs`, `--g-sm`, `--g-lg`, `--g-xl` | Gap anchor and steps |
| `--p-rt` | Padding scale ratio |
| `--p`, `--p-xs`, `--p-sm`, `--p-lg`, `--p-xl` | Padding anchor and steps |
| `--r-rt` | Radius scale ratio |
| `--r`, `--r-xs`, `--r-sm`, `--r-lg`, `--r-xl` | Radius anchor and steps |
| `--b-wd` | Shared border width |

### Palette sources

| Tokens | Job |
| --- | --- |
| `--c-sw-red`, `--c-sw-ora`, `--c-sw-yel`, `--c-sw-lim`, `--c-sw-gre` | Warm and green palette sources for brand and semantic mapping |
| `--c-sw-cya`, `--c-sw-sky`, `--c-sw-blu`, `--c-sw-pur`, `--c-sw-pin`, `--c-sw-mag` | Cool and expressive palette sources for brand and semantic mapping |
| `--c-sw-li`, `--c-sw-da` | Fixed light and dark sources for schemes and contrast companions |

### Accent and feedback sources

| Tokens | Job |
| --- | --- |
| `--c-ac` | Active accent source; defaults to primary and changes through `data-accent` routing |
| `--c-sc`, `--c-tr` | Secondary and tertiary accent sources |
| `--c-ac-co` | Active solid-accent content role; defaults to the primary companion and changes with the active route |
| `--c-sc-co`, `--c-tr-co` | Contrasting content on solid secondary and tertiary accents |
| `--c-fb-su`, `--c-fb-wn`, `--c-fb-dn` | Success, warning, and danger feedback sources |
| `--c-fb-su-co`, `--c-fb-wn-co`, `--c-fb-dn-co` | Contrasting content on solid feedback sources |

### Semantic canvas and routed color

| Tokens | Job |
| --- | --- |
| `--c-bg-base`, `--c-fg-base` | Scheme-aware base canvas and foreground sources |
| `--c-bg`, `--c-fg` | Active canvas and foreground |
| `--c-sf`, `--c-bc`, `--c-mu` | Active surface, border, and secondary muted-content tone |
| `--c-ac-bg`, `--c-ac-fg`, `--c-ac-bc` | Active accent’s subtle background, foreground, and border roles |
| `--c-sc-bg`, `--c-sc-fg`, `--c-sc-bc` | Secondary accent’s subtle background, foreground, and border roles |
| `--c-tr-bg`, `--c-tr-fg`, `--c-tr-bc` | Tertiary accent’s subtle background, foreground, and border roles |

### Type foundations

| Tokens | Job |
| --- | --- |
| `--t-ff-sa`, `--t-ff-se`, `--t-ff-mo` | Sans, serif, and monospace font families |
| `--t-ff-bd`, `--t-ff-dp` | Body and display font-family roles |
| `--t-fw-lt`, `--t-fw-rg`, `--t-fw-bd` | Light, regular, and bold weight roles for `font-weight` and the `wght` axis |
| `--t-fs-min`, `--t-fs-max` | Minimum and maximum body-size foundations for fluid type |
| `--t-rt-min`, `--t-rt-max` | Minimum and maximum ratios for the fluid type scale |

### Heading roles

| Tokens | Job |
| --- | --- |
| `--t-h0-lh`, `--t-h0-ls`, `--t-h0-fw`, `--t-h0-tt`, `--t-h0-mw` | Display role line height, spacing, weight, transform, and measure |
| `--t-h1-lh`, `--t-h1-ls`, `--t-h1-fw`, `--t-h1-tt`, `--t-h1-mw` | Heading-one role properties |
| `--t-h2-lh`, `--t-h2-ls`, `--t-h2-fw`, `--t-h2-tt`, `--t-h2-mw` | Heading-two role properties |
| `--t-h3-lh`, `--t-h3-ls`, `--t-h3-fw`, `--t-h3-tt`, `--t-h3-mw` | Heading-three role properties |
| `--t-h4-lh`, `--t-h4-ls`, `--t-h4-fw`, `--t-h4-tt`, `--t-h4-mw` | Heading-four role properties |
| `--t-h5-lh`, `--t-h5-ls`, `--t-h5-fw`, `--t-h5-tt`, `--t-h5-mw` | Heading-five role properties |
| `--t-h6-lh`, `--t-h6-ls`, `--t-h6-fw`, `--t-h6-tt`, `--t-h6-mw` | Heading-six role properties |

### Text roles

| Tokens | Job |
| --- | --- |
| `--t-lg-lh`, `--t-lg-ls`, `--t-lg-fw`, `--t-lg-tt`, `--t-lg-mw` | Large-text role properties |
| `--t-bd-lh`, `--t-bd-ls`, `--t-bd-fw`, `--t-bd-tt`, `--t-bd-mw` | Body-text role properties |
| `--t-sm-lh`, `--t-sm-ls`, `--t-sm-fw`, `--t-sm-tt`, `--t-sm-mw` | Small-text role properties |

### Motion

| Tokens | Job |
| --- | --- |
| `--m-tf-i`, `--m-tf-o`, `--m-tf-io` | In, out, and in-out timing functions |
| `--m-tf-g`, `--m-tf-s` | Glide and spring-like timing functions |
| `--m-td-sf`, `--m-td-f`, `--m-td`, `--m-td-s`, `--m-td-ss` | Successive motion durations from shortest to longest |
| `--m-vt-blur`, `--m-vt-i-y`, `--m-vt-i-x`, `--m-vt-o-y`, `--m-vt-o-x`, `--m-vt-d` | Page view-transition blur, incoming and outgoing offsets, and duration |

<!-- public-token-index:end -->

## Private state

Never use these properties in product CSS or public examples:

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

They are implementation state for public grid, type, and motion hooks. Their presence does not create public API.

## Common mistakes

- Using a palette swatch for component text when a semantic role exists.
- Adding a token for one literal or one composition.
- Overriding one scale member without checking the family.
- Setting a heading’s `max-width` instead of its matching `--t-*-mw` token.
- Using private grid or scrub state in project CSS.
- Copying token values into documentation.

## Verify

Search every consumer before renaming or deleting a token. Check all skins, accents, schemes, responsive states, type roles, motion preference, and copied project ownership affected by a change. Run `node scripts/check-system.mjs` to compare this index with live declarations.
