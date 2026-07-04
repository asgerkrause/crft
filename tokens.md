---
scope: craft
layer: tokens
triggers:
  - tokens
  - css variables
  - spacing
  - typography
  - colors
  - theme
  - radius
updated: 2026-07-01
---

# Token craft

Related: `glossary`, `token-contract`, `naming`, `styling`, `accessibility`.

## Tokens carry strategy

ID: tokens.strategy-not-values
Status: Must
Triggers: tokens, design system, color, spacing, typography
Use when: Creating or judging tokens.
Rule: Tokens define relationships: rhythm, hierarchy, surface, contrast, state, motion, and primitive skin. Do not mirror every raw value as a token.
Tradeoff: Smaller token set; stronger meaning.
Override: Generated design-token import from an approved system.
Tiny example:
Good: `--s-ss` for section rhythm.
Avoid: `--space-special` because one section used a one-off value.

## Local var before global token

ID: tokens.local-before-global
Status: Default
Triggers: token creation, local variable, custom property, one-off art direction
Use when: A visual value appears once.
Rule: One-off art direction uses scoped local custom properties. Global tokens require repeated system value or primitive/theme ownership.
Tradeoff: Less global registry bloat; local art stays possible.
Override: Brand-critical value that must propagate through themes or primitives.
Tiny example:
Good: `#hero { --hero-media-opacity: .72; }`
Avoid: `--e-hero-video-overlay` in global tokens for one page.

## Read existing tokens first

ID: tokens.read-existing
Status: Must
Triggers: tokens, global css, token source, theme, design system
Use when: Changing spacing, typography, color, radius, theme, or motion.
Rule: Read project token source before changing values. If project has adopted craft tokens, use `--l-*`, `--s-*`, `--t-*`, `--c-*`, `--e-*`, `--m-*`, `--i-*`, `--z-*`. If project has not adopted craft tokens, preserve local pattern unless migration is explicit.
Tradeoff: Slower start; avoids mixed token languages.
Override: None for tokenized UI work.
Tiny example:
Good: extend `--s-gp` or `--s-gp-lg` in a craft project.
Avoid: adding a second spacing dialect beside craft tokens.

## Prefixed token language is default

ID: tokens.prefixed-contract
Status: Default
Triggers: token naming, css variables, design system, craft tokens, global tokens
Use when: Creating, migrating, or judging a token system.
Thinking: Category prefixes reduce ambiguity for humans and agents. `--s-*` always means space/shape; color uses `--c-*`; surface is `--c-bg` or `--c-sur`, not `--s`.
Rule: Prefer the craft contract: layout `--l-*`, space/shape `--s-*`, type `--t-*`, color `--c-*`, elements `--e-*`, motion `--m-*`, interaction `--i-*`, z-index `--z-*`.
Tradeoff: More verbose than old short tokens; safer to grep, classify, and migrate.
Override: Existing mature project uses another coherent system and migration is not in scope.
Tiny example:
Good: `background: var(--c-bg); color: var(--c-ink); gap: var(--s-gp); border-radius: var(--s-br);`
Avoid: old unprefixed surface/ink/gap tokens in craft code.

## Fluid tokens keep final names short

ID: tokens.fluid-min-max
Status: Default
Triggers: fluid tokens, clamp, responsive type, spacing scale, min max tokens
Use when: Initializing or revising layout rhythm and type for marketing, editorial, portfolio, and client sites.
Rule: Use min/max config tokens for fluid systems, but keep consumed tokens stable: `--s-gp-min/max` derive `--s-gp`; `--t-h1-fs-min/max` derive `--t-h1-fs`. Direct media-query overrides may skip `-min/-max`; consumed token names stay the same.
Tradeoff: More setup in `token source`; authored CSS stays clear.
Override: Dense app UI where fixed sizing is a deliberate project choice.
Tiny example:
Good: `gap: var(--s-gp);` with fluid `--s-gp` defined in token engine.
Avoid: component CSS using `clamp()` repeatedly for the same spacing job.

## Consumed token names stay stable

ID: tokens.consumed-stability
Status: Must
Triggers: token implementation, fluid tokens, media query tokens, responsive type, responsive spacing
Use when: Choosing between fluid config and direct responsive overrides.
Rule: Components consume stable final names like `--t-h1-fs`, `--s-gp`, and `--l-mw`. Projects may derive them from `-min/-max` config or override them directly in media/container queries.
Tradeoff: Implementation can vary; component CSS stays portable.
Override: None for craft-based tokenized UI.
Tiny example:
Good: `font-size: var(--t-h1-fs);`
Avoid: component CSS depending on `--t-h1-fs-min`.

## Space tokens carry layout intent

ID: tokens.space-scale
Status: Default
Triggers: spacing, layout, gap, padding, radius, section spacing, border width
Use when: Applying layout, section, or component spacing.
Rule: Use tokens by job: `--l-mw` max width, `--s-px` inline page padding, `--s-py` section block padding, `--s-ss` section/container rhythm, `--s-gp` gap, `--s-pd` component padding, `--s-br` radius, `--s-bw` border width.
Tradeoff: Rhythm stays coherent; art direction can still define component-local vars.
Override: Existing project token names differ and migration is not approved.
Tiny example:
Good: `.c { max-inline-size: var(--l-mw); gap: var(--s-ss); }`
Avoid: old unprefixed layout/rhythm tokens in craft code.

## Type tokens map hierarchy

ID: tokens.type-hierarchy
Status: Default
Triggers: typography, font size, font weight, heading, h0, lead text, eyebrow
Use when: Styling headings, intros, captions, and metadata.
Rule: Use `--t-md-*`, `--t-lg-*`, `--t-sm-*`, and `--t-h0-*` … `--t-h6-*` for `fs`, `fw`, `ff`, `ls`, `lh`, `tt`, `mw`. Use `--t-fw-l/r/b` instead of literals.
Tradeoff: Predictable hierarchy; unusual brand moments may need documented local vars.
Override: Brand typography requires a documented exception.
Tiny example:
Good: `font-size: var(--t-h2-fs); font-weight: var(--t-h2-fw);`
Avoid: old unprefixed heading tokens or literal weights in craft code.

## Contrast pairs are tokens too

ID: tokens.contrast-pairs
Status: Must
Triggers: color, contrast, foreground, background, theme, accent
Use when: Creating foreground/background roles or element skins.
Rule: Color tokens that create foreground/background pairs must be judged as pairs across default, themed, hover, focus, disabled, and muted states.
Tradeoff: Some subtle palettes need stronger contrast.
Override: Decorative non-text surfaces only.
Tiny example:
Good: `--e-btn-sur` and `--e-btn-ink` tested together.
Avoid: choosing `--c-mut` on `--c-sur` by taste alone.

## Semantic colors adapt through theme

ID: tokens.semantic-colors
Status: Default
Triggers: colors, semantic colors, surface, ink, border, accent, secondary, theme
Use when: Applying colors.
Rule: Components consume semantic color roles: `--c-bg`, `--c-fg`, `--c-sur`, `--c-ink`, `--c-mut`, `--c-bor`, plus `--c-acc-*`, `--c-sec-*`, and state roles when purpose requires them.
Tradeoff: Theme scopes become strong; raw brand colors must map into anchors first.
Override: Project has a coherent non-craft color system and migration is not approved.
Tiny example:
Good: `background: var(--c-sur); color: var(--c-ink); border-color: var(--c-bor);`
Avoid: raw hex values or old unprefixed color roles in component CSS.

## Element tokens skin primitives

ID: tokens.element-primitives
Status: Default
Triggers: element tokens, e tokens, button tokens, card tokens, input tokens, badge tokens
Use when: Styling official reusable primitives or regions.
Rule: Use `--e-*` only for shared primitives and site regions. Components may override `--e-btn-*`, `--e-crd-*`, `--e-inp-*`, or `--e-bdg-*` locally for variants.
Tradeoff: Central theming becomes easier; overusing `--e-*` for one-offs creates global registry debt.
Override: Private component detail that does not need cross-site theming.
Tiny example:
Good: `.btn.accent { --e-btn-sur: var(--c-acc-sur); }`
Avoid: `--e-testimonial-avatar-ring` for one component.

## Theme attributes belong on outer scope

ID: tokens.theme-attributes
Status: Default
Triggers: data-theme, theme, dark mode, themed section, tone, invert, accent
Use when: Applying section/page theme.
Rule: Apply theme on outer scope, usually `<section data-theme="...">`, so descendants adapt through `--c-*` and `--e-*` tokens.
Tradeoff: Less local color control; stronger system consistency.
Override: Component is portable and must carry its own theme boundary.
Tiny example:
Good: `<section data-theme="accent">` with descendants using `--c-bg`, `--c-ink`, `--e-btn-*`.
Avoid: manually coloring every child inside a themed section.

## Applied patterns

### Token choice: repeated rhythm

Use when multiple sections share rhythm.

```css
:root {
  --s-ss: /* project value */;
  --s-gp: /* project value */;
}

section { padding-block: var(--s-ss); }
.grid { gap: var(--s-gp); }
```

Decision: global `--s-*` is earned because rhythm repeats.

### Token choice: one-off art direction

```css
.hero {
  --hero-media-opacity: /* project value */;
}

.hero img { opacity: var(--hero-media-opacity); }
```

Decision: local custom property wins; no global `--e-hero-*` debt.

### Responsive mode: direct override

```css
:root { --t-h1-fs: /* project value */; }

@media (width < 60rem) {
  :root { --t-h1-fs: /* project value */; }
}

h1 { font-size: var(--t-h1-fs); }
```

Decision: component consumes final token; no dependency on `-min/-max`.
