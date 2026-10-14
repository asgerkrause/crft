# Shared brand contract

Status: P0 frozen as `brand-system-1`, 2026-10-13; CR1 implemented locally with [recorded evidence and limits](CR1-EVIDENCE.md). Read [README](README.md) for authority, sequence, and acceptance ids.

## Purpose and ownership

One system should help people and agents understand a client's brand, choose meaningful roles, and preserve approved design across websites, slides, paper, and figures. Readable names alone are insufficient: each role needs its purpose, allowed use, derivation, source, and format support.

- Brand OS owns approved brand identity, voice, assets, role values, recipes, format profiles, and their machine-readable schema.
- CRFT owns browser CSS, native defaults, layout grammar, visual-role selectors, and adoption/verification tooling. It remains a strategy and reference, not a component library.
- AK skills consume a checked, versioned brand snapshot and own their output-specific layout and rendered acceptance.
- The client/product authority owns taste, content, composition, and accessibility acceptance. House values are an explicit house brand, never an implicit client fallback.

## Accepted direction from the conversation

- Name the system CRFT / `crft`. Avoid `--brand-*` and `--crft-*` prefixes in the public token vocabulary.
- Keep semantic HTML, native behavior, shallow CSS nesting, and landmarks. Use existing semantic owners before adding classes.
- Preserve the modular type-step engine. Compute endpoints from base sizes and ratios, then interpolate between the endpoints across one shared default web range.
- Preserve calculated spacing and color relationships when the relationship expresses an actual design decision.
- Support static, fluid, and mixed values through the same role API. Components do not select a separate fluid/static mode.
- Use readable typography names: display, h1, h2, h3, lead, body, small, label, caption. Drop dedicated visual h4/h5/h6 roles, not native heading elements.
- Use `font`, `size`, `weight`, `leading`, `tracking`, and `measure` for typography properties. Weight must be represented explicitly; variable fonts must be supported correctly.
- Preserve the meaning of bleed: `--bleed-x` is horizontal page breathing room and `--bleed-y` is vertical section breathing room.

## Typography roles

| Role | Job | Default scale step |
| --- | --- | --- |
| display | Major expressive statement | 5 |
| h1 | Primary heading treatment | 4 |
| h2 | Secondary heading treatment | 3 |
| h3 | Supporting heading treatment | 2 |
| lead | Introductory paragraph that establishes the subject | 1 |
| body | Main reading text | 0 |
| small | Smaller supporting text | -1 |
| label | Names a control, field, or category | -1 |
| caption | Explains a figure, image, or table | -1 |

Steps are brand-configurable defaults, not a mandate that all clients share the same hierarchy. Roles sharing a step can differ in family, weight, leading, tracking, case, features, and measure. `lead` replaces `lede`. A lead is not a generic larger-text utility.

Native headings receive their appropriate default treatment. Optional role classes such as `.display`, `.h1`, `.lead`, and `.caption` are for a meaningful visual role; inherited body text needs no class. Do not add an `fs` API merely to expose the calculation engine. Do not offer both class and attribute spellings for every typography role.

Native h4/h5/h6 remain valid for document hierarchy. P0 must settle their default mapping to existing visual roles and document it. Do not invent new public size families to avoid that decision. Existing Brand OS `quote` and `mono` consumers must be inventoried before migration: preserve their semantic job through an explicit mapping or justified extension, never silently erase it.

Example public properties:

```css
--body-font: ...;
--body-size: ...;
--body-weight: ...;
--body-leading: ...;
--body-tracking: ...;
--body-measure: ...;
```

Leading maps to `line-height`; tracking to `letter-spacing`; measure to text width, commonly expressed in `ch`. Display and heading roles use their own measures. Do not constrain the entire body element to paragraph measure. Preserve approved case and OpenType features in exports; exact property names for these remaining fields belong to P0's inventory.

## Weight and variable fonts

The correct CSS spelling and syntax are:

```css
font-weight: var(--body-weight);
font-variation-settings: "wght" var(--body-weight);
```

These two declarations must agree whenever explicit `wght` control is used. However, the standard `font-weight` property already controls the registered weight axis. Low-level `font-variation-settings` can override it, including through inheritance. Never claim both declarations are universally required by variable fonts.

Recommended target policy: use `font-weight` for ordinary weight selection, correctly declare each variable face's actual weight range in `@font-face`, and use explicit axes only for a font-specific need. Preserve approved custom axes and optical-sizing behavior. Do not blindly replace an existing axis list with `"wght"` and discard its other settings.

Current CRFT requires the paired declarations. Changing that rule is an explicit migration across `AGENTS.md`, `CRAFT.md`, type guidance, live CSS, and checks; it must be approved as part of P0 and verified with the selected fonts. Until then, do not independently violate current project instructions. If pairing is retained, prove that inherited `wght` does not neutralize nested `strong`/`b`, control emphasis, or role changes. Test loaded variable faces, static fallbacks, intermediate weights, and unsupported axes. An `@supports` check alone does not prove a loaded font supports an axis.

Source: [MDN font-variation-settings](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/font-variation-settings).

## Fluid and static value model

Support a bounded set of forms: literal, alias, scale step, color mix, and fluid endpoints. Do not invent a general expression evaluator. Preserve recipes as well as resolved values in Brand OS context; a flattened token list cannot explain the system.

Default typography relationship:

```text
role minimum = base minimum × minimum ratio ^ role step
role maximum = base maximum × maximum ratio ^ role step
role size = interpolation between those endpoints across the shared range
```

Interpolate the endpoint sizes. Interpolating the base and ratio before exponentiation produces a different curve and must not be substituted silently.

Resolution order: approved explicit role size; otherwise approved explicit endpoints; otherwise endpoints derived from the role step. Endpoint overrides do not require changing all the other roles. Setting both bases and both ratios equal produces a static modular scale. Static exports should simplify unused fluid machinery. A static body with fluid display type and fluid gaps is valid.

Use explicit units in source data. A proposed CSS engine convention uses unitless rem magnitudes for arithmetic inputs. At a 16px root, `18.75` and `75` correspond to a 300–1200px range; `0.875` and `1.5` correspond to 14–24px bases. These are illustrative values, not house defaults or client approvals. Never force a fixed root font size to preserve that conversion.

Illustrative live CSS engine, not current public API:

```css
:root {
  --fluid-min: 18.75;
  --fluid-max: 75;
  --type-min: 0.875;
  --type-max: 1.5;
  --type-ratio-min: 1.2;
  --type-ratio-max: 1.4;
  --gap-min: 0.625;
  --gap-max: 1.5;

  --_fluid: clamp(
    0rem,
    (100vi - var(--fluid-min) * 1rem)
      / (var(--fluid-max) - var(--fluid-min)),
    1rem
  );

  --h1-min: calc(var(--type-min) * pow(var(--type-ratio-min), 4));
  --h1-max: calc(var(--type-max) * pow(var(--type-ratio-max), 4));
  --h1-size: calc(
    var(--h1-min) * 1rem
      + (var(--h1-max) - var(--h1-min)) * var(--_fluid)
  );
  --gap: calc(
    var(--gap-min) * 1rem
      + (var(--gap-max) - var(--gap-min)) * var(--_fluid)
  );
}
```

`--_fluid` is a private length from 0rem to 1rem, not a unitless fraction. Validate a strictly increasing input range. Type sizes and ratios must be positive; generated endpoints and enlargement behavior must be checked for every used step. Do not derive all leading and tracking from step number: font metrics, language, and content need independent approved values.

Use a viewport basis initially. A container-based recipe needs an actual component case and an explicit supported boundary. Fluid bounds, content width caps, and layout-query thresholds have different jobs. They may have an approved relationship, such as maximum content width plus two maximum gutters, but are not interchangeable.

Foundations and derived declarations must be evaluated at the same supported scope. Root changes affect root formulas; a descendant override of only an input does not rebuild inherited outputs. Brand/theme boundaries must rebind dependent recipes. A local final-role override is valid without a new scale. Define and test these boundaries rather than promising arbitrary nested reactivity.

Sources: [MDN pow()](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/pow), [CSS custom properties](https://www.w3.org/TR/css-variables-1/).

## Layout, grid, and native state

| Token | Job |
| --- | --- |
| --bleed-x | Horizontal page breathing room |
| --bleed-y | Vertical page-section breathing room |
| --content-max | Maximum content width |
| --space | Structural spacing between content groups |
| --gap | Separation between peers |
| --padding | Internal spacing within an element |
| --radius | Corner radius |
| --border-width | Border or stroke thickness |

Keep independent scale relationships where jobs differ. Do not force padding, gap, and radius through a single ratio. Shared size members use xs/sm/unsuffixed/lg/xl only where consumers need them. Print production bleed is a separate `print-bleed` field; never map `--bleed-x/y` to trim overflow.

Preserve page landmarks and the proposed `section > .c` named container boundary. `.c` is the content container; `.c.sm` and `.c.lg` are measure variants. `.s` is an optional stack when a semantic owner cannot safely own the flow. No section classes by default, IDs only for real relationships or identity, and no generic alignment/spacing/weight/color utility matrix.

Grid uses g/c/r/o: grid, column span, row span, visual order. `.c` is a class and `[c]` a grid attribute; this is a deliberate distinction. Bare custom attributes are a house HTML dialect requiring explicit validator/framework handling; do not claim standards validation automatically accepts them.

- `g`: empty/default, N, L-M, fit, fit-sm, fit-lg, fill, fill-sm, fill-lg, and retained subgrid mode where supported.
- `c`: N or L-M; zero means full row. Spans must fit the parent's explicit tracks at each responsive position.
- `r`: N or L-M row spans within the bounded supported range.
- `o`: full L-M-S using f/a/l. Exceptional visual ordering must retain meaningful reading and keyboard order.
- Numbered grids retain a documented small/no-container stacked fallback. Preserve current proven thresholds initially unless content evidence changes them.
- Fit/fill use intrinsic sizing at all widths; sm/lg change the minimum item width, not breakpoints. Fit collapses empty repeated tracks; fill retains them. Fit does not stretch every incomplete final row automatically.
- In fit/fill, initially reject numeric column spans; allow normal placement and c=0 full row. Retain row spans only with tested placement. Validate direct grid items without accidentally targeting nested grids.

Native state owns state styling: details uses `[open]`; custom disclosure buttons use truthful `aria-expanded` plus their relationship and behavior. Never use localized `aria-label` text as a styling identifier. Prefer bounded direct-child structure and shallow nesting over extra hooks.

Source: [MDN repeat()](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/repeat).

## Color, themes, and motion

Expose semantic color jobs. Reuse current Brand OS meanings for canvas, surface, text, muted, border, accent, and on-accent; P0 freezes the exact complete name map (earlier discussion also considered text-muted). Optional secondary and feedback roles require approved inputs. Decorative generated hues do not establish success, warning, or danger semantics.

Keep approved color-mix relationships and a finite palette. Do not restore a full percentage catalog without consumers. Readable muted text must pass on the actual supported backgrounds; a mix percentage alone proves no contrast. Keep transparent decorative tones distinct from readable text roles. Theme/skin boundaries recompute dependent colors; accent changes cannot leave stale derived surfaces.

Proposed separation: data-theme selects an approved overall scheme; data-skin changes local canvas context; data-accent routes an approved accent. Current CRFT bans data-theme, so that is an explicit documented migration, not an existing hook. Missing dark themes are not permission to invent approved inversions.

Retain only useful motion roles and real reduced-motion substitutions. Preserve native interaction behavior and unsupported-feature fallbacks. The old large easing catalog and empty reduced-motion block are not targets to reproduce.

## Formats, assets, and client understanding

Web consumes live recipes. Paper and Slides consume approved static format profiles with explicit units and geometry. Format resolution is: approved exact value, otherwise an approved adaptation recipe, otherwise a named missing-mapping failure. Same-aspect-ratio scaling is allowed only by an approved profile relationship; matching aspect ratio alone is insufficient.

A static profile can define its own base and ratio while retaining shared role steps. Explicit format role values always win. Do not sample an arbitrary web viewport, shrink text to fit, or silently use house values. Template slot names such as cover/title/statement need explicit mappings to brand roles; equal sizes do not establish semantic equivalence.

Resolve family, size, weight, leading, tracking, measure, case, features, and supported axes as applicable. Preserve licensed font assets and report unsupported axes or embedding capabilities. Browser CSS units are not a replacement for physical print calibration. Geometry changes must recompute slots, pagination, figures, and inspection bounds.

Skills read approved brand voice, audience, composition, and identity before selecting layouts or writing content. Brand rules outrank house taste. The contract describes a common language, not a common visual style.

## Approved three-file packaging — core3

AK explicitly approved this migration on 2026-10-13. This section supersedes physical-layer selection guidance in the original freeze. It does not change semantic contractVersion 2, role names, recipes, supported scopes, or layer precedence.

- `styles/global.css` contains the cascade prelude and imports `./tokens.css` and `./crft.css`.
- `styles/tokens.css` owns editable brand foundations, role metadata, derived recipes, schemes/skins, reduced-motion substitutions, and optional brand font faces.
- `styles/crft.css` owns framework behavior in preserved reset/base/type/layout/grid/motion/utility layers. Local private calculations remain beside their rules.

The new flat package uses `packagingVersion: 1` independently of semantic `contractVersion: 2`. Copy selections are exactly `--layers tokens` or `--layers full`. Tokens copies tokens.css; full also copies crft.css. Optional `--fonts` retains the final marked face declarations in tokens.css and copies adjacent WOFF assets. The default copy omits both. No duplicate layer implementation or separate fonts stylesheet remains.

The root crft-manifest.json records both versions, source revision, copied logical layers, hashes and a semantic contract snapshot. Consumers keep their own CSS entrypoint; the copier only prints the required prelude/imports. Previous v1/v2 layer-directory packages without packagingVersion remain deliberately checkable. Unknown versions and mixed physical layouts fail. Former selective behavior-layer requests fail explicitly; use project-owned local extraction or full adoption.

Brand OS context v3 continues to declare cssContractVersion 2. Its token-only projection belongs in the adopted tokens.css owner, replacing approved brand inputs/recipes/outputs while retaining every required framework token and context/reduced-motion behavior. Keep optional font faces and asset URLs correct for that owner. Do not load competing house outputs afterward or export framework selectors. Token completeness and reduced-motion projection are BO1 responsibilities; CRFT packaging checks do not establish that a replacement export is complete.

AK web guidance consumes these physical owners and unchanged semantic roles. Paper and Slides still use approved static profiles, independently of CSS packaging. No downstream source was changed by core3.

Current proof and hashes are in [CORE3-EVIDENCE.md](CORE3-EVIDENCE.md) and [CORE3-SHA256.json](CORE3-SHA256.json). [CR1-EVIDENCE.md](CR1-EVIDENCE.md) and CR1-SHA256.json remain historical evidence for the preserved pre-packaging implementation.

## Original P0 decision checklist — resolved by brand-system-1 below

The coordinator owns these; do not scatter them across workers:

1. Exact remaining public inventory and migrations, including muted/text-muted, case/features, header/control names, and existing quote/mono uses. Recommend existing clear names where they already fit.
2. Native h4/h5/h6 visual fallback. Recommend mapping to an existing supporting-heading treatment, with explicit role overrides for project needs; do not delete native semantics.
3. Variable-font weight policy. Recommend standard font-weight by default, explicit synchronized axes when justified; approve the current paired-rule migration together with its tests.
4. Data schema representation of recipes and format role mappings, CSS input units, scope boundaries, and version transition. Prefer existing Brand OS schema/types and extensions over another token format.
5. Browser/export support targets and fallback requirements. Experimental features are optional enhancements, not hidden prerequisites.

Do not reopen accepted role names, bleed meaning, shared fluid range, or step calculations just to prefer another naming style. Change those only with a concrete consumer failure and AK's decision.


## P0 freeze — brand-system-1

Authority: AK assigned this session P0 coordination and CR1 implementation on 2026-10-13. This section resolves the open decisions above and takes precedence over proposal wording. Source baseline: CRFT `7358c7ef477a0b1890951bc8f967b2bea00f28b1`. BO1 and AK1 implementation remain outside CR1. This is a contract decision, not rendered evidence or client design approval.

### Names and migration

- Typography roles and steps are exactly the nine in the table above. Native h1/h2/h3 use their matching role; native h4/h5/h6 use h3. Explicit role classes override native treatment. `.body` is available for an intentional body-role override; inherited body needs no class. Native `small`, `label`, and `figcaption` use small, label, and caption respectively. Label does not force every control to use label type.
- Every role exposes `font`, `size`, `weight`, `leading`, `tracking`, `measure`, `case`, `features`, `axes`, and `optical-sizing`. CSS case values use native `text-transform` syntax; source enum upper/lower/title maps explicitly to uppercase/lowercase/capitalize. Features use CSS `font-feature-settings`; axes use `font-variation-settings` and must not contain wght. Ordinary weight uses `font-weight`; remove the unconditional paired-wght rule from CRFT instructions, CSS, and gates. Explicit font-specific wght outside the reference must synchronize weight and preserve all other axes.
- Scale foundations: `--fluid-min`, `--fluid-max`, `--type-min`, `--type-max`, `--type-ratio-min`, `--type-ratio-max`. Each role has `--ROLE-step`, `--ROLE-min`, `--ROLE-max`, and final `--ROLE-size`. Arithmetic inputs are unitless rem magnitudes; size outputs are lengths. Final size overrides win; explicit endpoint overrides beat derived step endpoints. Static recipes produce literal lengths without viewport dependence.
- Font foundations: `--font`, `--font-display`, `--font-mono`, `--font-sans`, `--font-serif`; weights `--weight`, `--weight-bold`, `--weight-light`. Existing role families map explicitly: h0→display, lg→lead, bd→body, sm→small, h4/h5/h6→h3. Their old role-specific customizations require reconciliation rather than last-write-wins.
- Layout: `--bleed-x`, `--bleed-y`, `--content-max`, `--header`, `--control`, `--query-md`, `--query-lg`. Keep query thresholds 30rem/60rem, independent of fluid bounds. Scale families `--space`, `--gap`, `--padding`, `--radius` each retain independent `-ratio` and xs/sm/lg/xl members. Border thickness is `--border-width`.
- Color: `--canvas`, `--surface`, `--text`, `--muted`, `--border`, `--accent`, `--on-accent`, `--secondary`, `--on-secondary`, `--tertiary`, `--on-tertiary`, `--success`, `--on-success`, `--warning`, `--on-warning`, `--danger`, `--on-danger`. Retain used accent/secondary/tertiary `-surface`, `-text`, and `-border` relationships. Palette inputs use `--palette-NAME`, including light/dark. Palette colors never imply feedback approval. Muted is opaque readable text, checked on canvas and surface.
- Motion names expand by job: duration with xs/sm/lg/xl; ease-in/ease-out/ease-in-out/ease-glide/ease-spring; lift; transition-blur/transition-in-x/transition-in-y/transition-out-x/transition-out-y/transition-duration. Keep only consumed roles, real reduced-motion values, and gated enhancements.
- `.c`, `.c.sm`, `.c.lg`, `.s` replace container and stack attributes. No generic alignment, spacing, weight, family, transform, or color modifier matrix. Existing flags migrate to semantic elements, bounded structure, or named project roles. Keep `l`, `.img-w`, `.sr`, `.sr.focusable`, data-scrub, and the named container. Grid uses g/c/r/o as proposed; `sg` remains subgrid. Invalid spans are checker failures; fit/fill numeric spans fail, `c="0"` spans all explicit columns.
- Brand OS quote and mono are observed in its contract and specimen. Preserve them as explicit project extensions `x-quote`/`x-mono`, including their full properties and jobs; do not equate quotation with lead or code with small. No canonical CRFT quote/mono size roles. Native blockquote/code/pre and project CSS keep those semantics.

### Scope and formats

Supported scale-recipe boundaries are `:root` and `[data-theme]`; rebind all derived scale declarations there. Literal role metadata (leading, tracking, measure, case, features, axes, optical-sizing) inherits through themes; themes do not reset it to house defaults. Derived role font/weight outputs rebind from semantic font/weight foundations; a final root role font/weight exception must be reapplied on or below a new theme boundary. Theme font inputs are font/font-display/font-mono and weight foundations; raw font-sans/font-serif convenience aliases resolve at root. Theme color inputs are semantic colors and palette-light/palette-dark scheme foundations; arbitrary palette-swatches alone do not reroute inherited semantic inputs. Every exposed supported boundary must document this distinction. Skin and accent boundaries rebind color dependencies only. A local final-role override is supported; an arbitrary descendant foundation override is not. Role consumption must resolve local final-size/metadata overrides at the element, including class overrides of native roles. Private calculation names begin `--_` or retain the documented existing private grid/motion names; they are never public tokens even when declared in tokens.css.

`data-theme="light|dark"` selects supplied schemes. Reference ships explicit synthetic light/dark schemes. Missing client dark data is a missing capability, never an inferred inversion. `data-skin="invert|tone|accent"` remains local canvas treatment; data-accent retains secondary/tertiary/success/warning/danger. Skin selection is non-cumulative: invert/tone/accent select from current scheme foundations, preserving existing behavior; invert inside invert remains inverted, and tone inside accent selects scheme tone. Dependent surface/muted/accent roles recompute against the resulting local canvas and routed accent. Color scheme alone must not leave stale semantic values.

Brand OS retains its DTCG source files and existing brand-os extensions. BO1 extends that owner rather than adopting CRFT fixtures as a production schema. Bounded recipe tags are literal, alias, step, mix, and fluid; dimensional operands carry explicit value/unit pairs, aliases name a role, steps name a scale and integer exponent, mixes name operands and a percentage, and fluid names endpoints plus the shared range. Cycles, nonpositive sizes/ratios, nonincreasing ranges, unsupported units, and missing mappings fail. Typography recipes live in the existing typography extension; format profiles retain explicit geometry and role mappings. Exact approved format values win over approved adaptation recipes; no viewport sampling. Source recipes and resolved values both survive context export.

CR1 fixtures are versioned test inputs, not another schema: `{ contractVersion: 1, id, description, foundations, roles, scales, colors, fonts, expected }`. Dimensional fixture inputs use `{ value, unit }`; role entries carry step plus optional endpoints or literal size, with metadata. Expected values record min/max rem endpoints and static rem outputs. Fixtures demonstrate a fluid brand, a contrasting static brand, and a mixed override using the same role selectors and markup. Paper/slide mappings stay BO1's explicit format owner; CR1 must not fabricate cross-format proof.

### Versions, support, and proof

CRFT emitted contracts and adoption manifests gain `contractVersion: 2`; absent version denotes legacy v1 for explicit legacy checking. The checker validates recorded v1 or v2 with its matching vocabulary, rejects unknown future versions and missing required contract fields, and rejects mixing adopted legacy and new canonical hooks/tokens. Project extensions use explicit `--x-*` or locally declared properties; misspelled undeclared new public tokens fail. Keep conflict-safe copier semantics and all four adoption modes.

BO1's next context version is 3 (current source emits 2); its exact schema release remains BO1-owned. AK must reject unsupported context capabilities/version rather than discard new fields silently. No compatibility aliases in the CRFT v2 CSS.

Browser target: current Chromium, Firefox, and WebKit implementations available to the project. Record actual versions tested; unsupported/uninstalled engines are unverified, not passes. CSS nesting/layers/container queries are required for the full enhanced reference; numbered grids remain stacked without container queries. Intrinsic modes work without a named container. pow-dependent live formulas require a feature gate with readable static fallback. Animation timelines, subgrid, cap trim, disclosure interpolation, and squircle corners are optional enhancements. Font tests use actual bundled faces and a static fallback; custom axes preservation needs either a loaded supporting face or an explicitly limited source/computed-style check.

Verification retains independent source, browser, and human design gates. Positive rem terms and growth ratios alone are insufficient. Deliver all checks and fixture values with exact file hashes when no commit is authorized. No commit, publish, dependency install, or cross-repository implementation is included in this freeze.

### Exact legacy token map

Every one of the 154 public baseline tokens is accounted for below. This is a migration map, not aliases. New role outputs/properties are specified above. `canvas-base` and `text-base` retain explicit scheme foundations used by local skins. Existing public values are reference inputs only.

| Old | New | Action |
| --- | --- | --- |
| `--b-wd` | `--border-width` | Map |
| `--c-ac` | `--accent` | Map |
| `--c-ac-bc` | `--accent-border` | Map |
| `--c-ac-bg` | `--accent-surface` | Map |
| `--c-ac-co` | `--on-accent` | Map |
| `--c-ac-fg` | `--accent-text` | Map |
| `--c-bc` | `--border` | Map |
| `--c-bg` | `--canvas` | Map |
| `--c-bg-base` | `--canvas-base` | Map |
| `--c-fb-dn` | `--danger` | Map |
| `--c-fb-dn-co` | `--on-danger` | Map |
| `--c-fb-su` | `--success` | Map |
| `--c-fb-su-co` | `--on-success` | Map |
| `--c-fb-wn` | `--warning` | Map |
| `--c-fb-wn-co` | `--on-warning` | Map |
| `--c-fg` | `--text` | Map |
| `--c-fg-base` | `--text-base` | Map |
| `--c-mu` | `--muted` | Map |
| `--c-sc` | `--secondary` | Map |
| `--c-sc-bc` | `--secondary-border` | Map |
| `--c-sc-bg` | `--secondary-surface` | Map |
| `--c-sc-co` | `--on-secondary` | Map |
| `--c-sc-fg` | `--secondary-text` | Map |
| `--c-sf` | `--surface` | Map |
| `--c-sw-blu` | `--palette-blue` | Map |
| `--c-sw-cya` | `--palette-cyan` | Map |
| `--c-sw-da` | `--palette-dark` | Map |
| `--c-sw-gre` | `--palette-green` | Map |
| `--c-sw-li` | `--palette-light` | Map |
| `--c-sw-lim` | `--palette-lime` | Map |
| `--c-sw-mag` | `--palette-magenta` | Map |
| `--c-sw-ora` | `--palette-orange` | Map |
| `--c-sw-pin` | `--palette-pink` | Map |
| `--c-sw-pur` | `--palette-purple` | Map |
| `--c-sw-red` | `--palette-red` | Map |
| `--c-sw-sky` | `--palette-sky` | Map |
| `--c-sw-yel` | `--palette-yellow` | Map |
| `--c-tr` | `--tertiary` | Map |
| `--c-tr-bc` | `--tertiary-border` | Map |
| `--c-tr-bg` | `--tertiary-surface` | Map |
| `--c-tr-co` | `--on-tertiary` | Map |
| `--c-tr-fg` | `--tertiary-text` | Map |
| `--g` | `--gap` | Map |
| `--g-lg` | `--gap-lg` | Map |
| `--g-rt` | `--gap-ratio` | Map |
| `--g-sm` | `--gap-sm` | Map |
| `--g-xl` | `--gap-xl` | Map |
| `--g-xs` | `--gap-xs` | Map |
| `--l-bl-x` | `--bleed-x` | Map |
| `--l-bl-y` | `--bleed-y` | Map |
| `--l-ch` | `--control` | Map |
| `--l-cq-lg` | `--query-lg` | Map |
| `--l-cq-md` | `--query-md` | Map |
| `--l-cw` | `--content-max` | Map |
| `--l-hh` | `--header` | Map |
| `--l-vp-max` | `--fluid-max` | Convert baseline pixel magnitude to rem magnitude (divide by 16); do not fix user root size |
| `--l-vp-min` | `--fluid-min` | Convert baseline pixel magnitude to rem magnitude (divide by 16); do not fix user root size |
| `--m-lift` | `--lift` | Map |
| `--m-td` | `--duration` | Map |
| `--m-td-f` | `--duration-sm` | Map |
| `--m-td-s` | `--duration-lg` | Map |
| `--m-td-sf` | `--duration-xs` | Map |
| `--m-td-ss` | `--duration-xl` | Map |
| `--m-tf-g` | `--ease-glide` | Map |
| `--m-tf-i` | `--ease-in` | Map |
| `--m-tf-io` | `--ease-in-out` | Map |
| `--m-tf-o` | `--ease-out` | Map |
| `--m-tf-s` | `--ease-spring` | Map |
| `--m-vt-blur` | `--transition-blur` | Map |
| `--m-vt-d` | `--transition-duration` | Map |
| `--m-vt-i-x` | `--transition-in-x` | Map |
| `--m-vt-i-y` | `--transition-in-y` | Map |
| `--m-vt-o-x` | `--transition-out-x` | Map |
| `--m-vt-o-y` | `--transition-out-y` | Map |
| `--p` | `--padding` | Map |
| `--p-lg` | `--padding-lg` | Map |
| `--p-rt` | `--padding-ratio` | Map |
| `--p-sm` | `--padding-sm` | Map |
| `--p-xl` | `--padding-xl` | Map |
| `--p-xs` | `--padding-xs` | Map |
| `--r` | `--radius` | Map |
| `--r-lg` | `--radius-lg` | Map |
| `--r-rt` | `--radius-ratio` | Map |
| `--r-sm` | `--radius-sm` | Map |
| `--r-xl` | `--radius-xl` | Map |
| `--r-xs` | `--radius-xs` | Map |
| `--s` | `--space` | Map |
| `--s-lg` | `--space-lg` | Map |
| `--s-rt` | `--space-ratio` | Map |
| `--s-sm` | `--space-sm` | Map |
| `--s-xl` | `--space-xl` | Map |
| `--s-xs` | `--space-xs` | Map |
| `--t-bd-fw` | `--body-weight` | Map |
| `--t-bd-lh` | `--body-leading` | Map |
| `--t-bd-ls` | `--body-tracking` | Map |
| `--t-bd-mw` | `--body-measure` | Map |
| `--t-bd-tt` | `--body-case` | Map |
| `--t-ff-bd` | `--font` | Map |
| `--t-ff-dp` | `--font-display` | Map |
| `--t-ff-mo` | `--font-mono` | Map |
| `--t-ff-sa` | `--font-sans` | Map |
| `--t-ff-se` | `--font-serif` | Map |
| `--t-fs-max` | `--type-max` | Convert baseline pixel magnitude to rem magnitude (divide by 16); do not fix user root size |
| `--t-fs-min` | `--type-min` | Convert baseline pixel magnitude to rem magnitude (divide by 16); do not fix user root size |
| `--t-fw-bd` | `--weight-bold` | Map |
| `--t-fw-lt` | `--weight-light` | Map |
| `--t-fw-rg` | `--weight` | Map |
| `--t-h0-fw` | `--display-weight` | Map |
| `--t-h0-lh` | `--display-leading` | Map |
| `--t-h0-ls` | `--display-tracking` | Map |
| `--t-h0-mw` | `--display-measure` | Map |
| `--t-h0-tt` | `--display-case` | Map |
| `--t-h1-fw` | `--h1-weight` | Map |
| `--t-h1-lh` | `--h1-leading` | Map |
| `--t-h1-ls` | `--h1-tracking` | Map |
| `--t-h1-mw` | `--h1-measure` | Map |
| `--t-h1-tt` | `--h1-case` | Map |
| `--t-h2-fw` | `--h2-weight` | Map |
| `--t-h2-lh` | `--h2-leading` | Map |
| `--t-h2-ls` | `--h2-tracking` | Map |
| `--t-h2-mw` | `--h2-measure` | Map |
| `--t-h2-tt` | `--h2-case` | Map |
| `--t-h3-fw` | `--h3-weight` | Map |
| `--t-h3-lh` | `--h3-leading` | Map |
| `--t-h3-ls` | `--h3-tracking` | Map |
| `--t-h3-mw` | `--h3-measure` | Map |
| `--t-h3-tt` | `--h3-case` | Map |
| `--t-h4-fw` | `--h3-weight` | Remove dedicated role; reconcile existing customization with h3 or project-local role |
| `--t-h4-lh` | `--h3-leading` | Remove dedicated role; reconcile existing customization with h3 or project-local role |
| `--t-h4-ls` | `--h3-tracking` | Remove dedicated role; reconcile existing customization with h3 or project-local role |
| `--t-h4-mw` | `--h3-measure` | Remove dedicated role; reconcile existing customization with h3 or project-local role |
| `--t-h4-tt` | `--h3-case` | Remove dedicated role; reconcile existing customization with h3 or project-local role |
| `--t-h5-fw` | `--h3-weight` | Remove dedicated role; reconcile existing customization with h3 or project-local role |
| `--t-h5-lh` | `--h3-leading` | Remove dedicated role; reconcile existing customization with h3 or project-local role |
| `--t-h5-ls` | `--h3-tracking` | Remove dedicated role; reconcile existing customization with h3 or project-local role |
| `--t-h5-mw` | `--h3-measure` | Remove dedicated role; reconcile existing customization with h3 or project-local role |
| `--t-h5-tt` | `--h3-case` | Remove dedicated role; reconcile existing customization with h3 or project-local role |
| `--t-h6-fw` | `--h3-weight` | Remove dedicated role; reconcile existing customization with h3 or project-local role |
| `--t-h6-lh` | `--h3-leading` | Remove dedicated role; reconcile existing customization with h3 or project-local role |
| `--t-h6-ls` | `--h3-tracking` | Remove dedicated role; reconcile existing customization with h3 or project-local role |
| `--t-h6-mw` | `--h3-measure` | Remove dedicated role; reconcile existing customization with h3 or project-local role |
| `--t-h6-tt` | `--h3-case` | Remove dedicated role; reconcile existing customization with h3 or project-local role |
| `--t-lg-fw` | `--lead-weight` | Map |
| `--t-lg-lh` | `--lead-leading` | Map |
| `--t-lg-ls` | `--lead-tracking` | Map |
| `--t-lg-mw` | `--lead-measure` | Map |
| `--t-lg-tt` | `--lead-case` | Map |
| `--t-rt-max` | `--type-ratio-max` | Map |
| `--t-rt-min` | `--type-ratio-min` | Map |
| `--t-sm-fw` | `--small-weight` | Map |
| `--t-sm-lh` | `--small-leading` | Map |
| `--t-sm-ls` | `--small-tracking` | Map |
| `--t-sm-mw` | `--small-measure` | Map |
| `--t-sm-tt` | `--small-case` | Map |

P0 consumer evidence: Brand OS `src/contract.ts` names muted/header/control, quote/mono; `src/schema.ts` owns case/features and DTCG typography extension; `src/context.ts` emits version 2. Its local checkout has no resolvable HEAD, so source hashes below bind inspected files. No Brand OS implementation was changed.

- Brand OS `src/contract.ts`: SHA-256 `a28f75160178510902f56660ea570adf03db7984a43995a65b4d4f923f3b55da`.
- Brand OS `src/schema.ts`: SHA-256 `b75442ab8e8cfe1f54af843aa71c8b51654c275d8cd5d837d67d4e70b4f0f081`.
- Brand OS `src/context.ts`: SHA-256 `7ccc6eb25eb2c9368c0761608394aa79103ecae49f2fabf495fb6d04429a0bf7`.
- Brand OS `src/specimen.ts`: SHA-256 `8bd5a444195c33066f097bd69249d845e2898f17191d5873115629ef547eb12f`.
