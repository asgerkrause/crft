---
scope: snz-craft
layer: tokens
triggers:
  - tokens
  - css variables
  - spacing
  - typography
  - colors
  - theme
  - radius
updated: 2026-05-28
---

# Token craft

## Read existing tokens first

ID: tokens.read-existing
Status: Must
Triggers: tokens, global css, tokens css, system css, theme, design system
Use when: Changing spacing, typography, color, radius, or theme values.
Rule: Read project `global.css`, `tokens.css`, `system.css`, or equivalent before changing tokens. Project tokens win over SNZ defaults.
Tradeoff: Slower start; avoids duplicate or conflicting token systems.
Override: None when touching existing tokenized UI.
Tiny example:
Good: extend `--gp-lg` if system uses `--gp` scale.
Avoid: adding `--space-6` beside coherent `--gp-*` tokens without reason.
Related: styling.tokens-first

## Choose fluid or static intentionally

ID: tokens.fluid-static
Status: Default
Triggers: fluid tokens, static tokens, clamp, responsive type, spacing scale, initialize tokens
Use when: Initializing or revising token system.
Rule: Do not assume fluid tokens. Fluid fits marketing, landing, editorial, portfolio work. Static fits apps, dashboards, component libraries.
Tradeoff: Fluid feels polished across screens; static is predictable for dense interfaces.
Override: User/project has explicit token strategy.
Tiny example:
Good: ask “fluid or static?” when initializing tokens.
Avoid: defaulting every project to `clamp()`.
Related: sections.page-rhythm

## Spacing tokens carry layout intent

ID: tokens.spacing-scale
Status: Default
Triggers: spacing, layout, gap, padding, radius, max width, section spacing, bleed
Use when: Applying layout, section, or component spacing.
Rule: Use semantic spacing tokens before new values: `--mw`, `--bx`, `--by`, `--ss`, `--gp`, `--pd`, `--br`, `--bw` and size variants.
Tradeoff: Rhythm stays coherent; sometimes a local value is clearer for art direction.
Override: Existing project token names differ.
Tiny example:
Good: `gap: var(--gp); padding: var(--pd); max-width: var(--mw);`
Avoid: `gap: 22px; padding: 31px; max-width: 1170px;`
Related: styling.tokens-first, sections.page-rhythm

## Type tokens map hierarchy

ID: tokens.type-hierarchy
Status: Default
Triggers: typography, font size, heading, h0, h1, h2, lead text, eyebrow
Use when: Styling headings, intros, captions, and metadata.
Rule: Use type tokens to express hierarchy: `--h0-fs`, `--h1-fs`, `--h2-fs`, `--h3-fs`, body sizes, captions, and eyebrow labels.
Tradeoff: Predictable hierarchy; one-off editorial moments may need exception.
Override: Project typography system differs or brand requires unusual scale.
Tiny example:
Good: hero display uses `--h0-fs`; section heading uses `--h2-fs`; caption uses small/meta token.
Avoid: arbitrary per-section font sizes.
Related: sections.page-rhythm

## Semantic colors adapt through theme

ID: tokens.semantic-colors
Status: Default
Triggers: colors, semantic colors, surface, ink, gray, border, accent, complementary, theme
Use when: Applying colors.
Rule: Prefer semantic tokens: `--s`, `--i`, `--t`, `--g`, `--b`, `--bs`, `--a`, `--a-i`, `--c`, `--c-i`, `--l`, `--d`.
Tradeoff: Theme adapts naturally; raw brand colors need mapping first.
Override: Project token names differ.
Tiny example:
Good: `background: var(--s); color: var(--i); border-color: var(--b);`
Avoid: repeating raw hex/hsl values throughout components.
Related: styling.theme-cascade

## Theme attributes belong on outer scope

ID: tokens.theme-attributes
Status: Default
Triggers: data-theme, theme, themed section, tone, invert, accent, brand, dark section
Use when: Applying section/page theme.
Rule: Apply theme to outer scope, usually `<section data-theme="...">`, so descendants adapt through tokens.
Tradeoff: Strong cascade; local exceptions need care.
Override: Component is portable and must carry its own theme boundary.
Tiny example:
Good: `<section data-theme="tone">` around complete region.
Avoid: manually theming every card inside unthemed section.
Related: styling.theme-cascade, sections.section-theme

## Motion tokens keep feel consistent

ID: tokens.motion-tokens
Status: Default
Triggers: motion tokens, transition duration, easing, animation, hover, state
Use when: Adding transitions/animations.
Rule: Use project motion tokens for duration/easing: `--td-*`, `--tf-*` or equivalents.
Tradeoff: Consistent feel; bespoke motion may need local custom property.
Override: Project has no motion tokens and motion is isolated.
Tiny example:
Good: `transition: opacity var(--td) var(--tf-o);`
Avoid: scattered `transition: all 0.37s ease;`
Related: motion.tokenized-motion
