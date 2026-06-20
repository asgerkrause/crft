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
updated: 2026-06-19
---

# Token craft

## Read existing tokens first

ID: tokens.read-existing
Status: Must
Triggers: tokens, global css, tokens css, system css, theme, design system
Use when: Changing spacing, typography, color, radius, or theme values.
Rule: Read project `global.css`, `tokens.css`, `system.css`, or equivalent before changing tokens. Project tokens win when already coherent; otherwise move toward the SNZ short token contract.
Tradeoff: Slower start; avoids duplicate or conflicting token systems.
Override: None when touching existing tokenized UI.
Tiny example:
Good: extend `--gp` or `--gp-*` if the project uses SNZ spacing tokens.
Avoid: adding `--space-6` beside coherent `--gp` tokens without reason.
Related: styling.tokens-first

## SNZ short token contract is default

ID: tokens.snz-contract
Status: Default
Triggers: token naming, css variables, design system, snz tokens, global tokens, system css
Use when: Creating, migrating, or judging a token system.
Thinking: Short tokens make daily authoring fast when the legend is stable. Config stays tiny; engine can be verbose; components consume semantic output.
Rule: Prefer the SNZ contract: layout `--mw`, `--bx`, `--by`, `--ss`, `--gp`, `--pd`, `--br`, `--bw`, `--gc`; weights `--fw-l`, `--fw-r`, `--fw-b`; type families `--md-*`, `--lg-*`, `--sm-*`, `--h0-*`…`--h6-*`; color config `--l`, `--d`, `--a`, `--ai`, `--c`, `--ci`; semantic output `--s`, `--i`, `--t`, `--b`, `--g`.
Tradeoff: Requires learning the legend; once learned, markup/CSS stays much smaller.
Override: Existing project has a mature coherent token system and migration would add risk without gain.
Tiny example:
Good: `background: var(--s); color: var(--i); gap: var(--gp); border-radius: var(--br);`
Avoid: `--color-surface`, `--text-primary`, `--space-md`, and `--gp` mixed in one project.
Related: styling.tokens-first, styling.css-ownership

## Choose fluid or static intentionally

ID: tokens.fluid-static
Status: Default
Triggers: fluid tokens, static tokens, clamp, responsive type, spacing scale, initialize tokens
Use when: Initializing or revising token system.
Rule: Use fluid tokens for marketing, landing, editorial, portfolio, and client sites. Use static tokens for dense apps, dashboards, and component libraries only when predictability beats fluid rhythm.
Tradeoff: Fluid feels polished across screens; static is simpler for dense interfaces.
Override: User/project has explicit token strategy.
Tiny example:
Good: `--gp-min`, `--gp-max` derive fluid `--gp` for landing pages.
Avoid: defaulting every dashboard control size to `clamp()`.
Related: sections.page-rhythm

## Spacing tokens carry layout intent

ID: tokens.spacing-scale
Status: Default
Triggers: spacing, layout, gap, padding, radius, max width, section spacing, bleed
Use when: Applying layout, section, or component spacing.
Rule: Use layout tokens by job: `--mw` max width, `--bx` inline page bleed, `--by` block section bleed, `--ss` section/container rhythm, `--gp` global gap, `--pd` component padding, `--br` radius, `--bw` border width, `--gc` grid columns.
Tradeoff: Rhythm stays coherent; art direction can still define local component vars.
Override: Existing project token names differ and are coherent.
Tiny example:
Good: `.c { max-width: var(--mw); padding-inline: var(--bx); gap: var(--ss); }`
Avoid: `padding: 31px; max-width: 1170px; gap: 22px;`
Related: styling.tokens-first, sections.page-rhythm

## Type tokens map hierarchy

ID: tokens.type-hierarchy
Status: Default
Triggers: typography, font size, font weight, heading, h0, h1, h2, lead text, eyebrow
Use when: Styling headings, intros, captions, and metadata.
Rule: Use full type families: `--md-fs/fw/ls/lh/mw`, `--lg-fs/fw/ls/lh/mw`, `--sm-fs/fw/ls/lh/mw`, and `--h0-*`…`--h6-*` for `fs`, `fw`, `ls`, `lh`, `mw`, optional `ff` and `tt`. Use base weights `--fw-l`, `--fw-r`, `--fw-b` instead of literals.
Tradeoff: Predictable hierarchy; one-off editorial moments may need a local variable.
Override: Brand typography requires an unusual, documented scale.
Tiny example:
Good: `h2 { font-size: var(--h2-fs); font-weight: var(--h2-fw); letter-spacing: var(--h2-ls); }`
Avoid: arbitrary per-section font sizes or `font-weight: 600` scattered through components.
Related: sections.page-rhythm

## Semantic colors adapt through theme

ID: tokens.semantic-colors
Status: Default
Triggers: colors, semantic colors, surface, ink, gray, border, accent, complementary, theme
Use when: Applying colors.
Rule: Components should consume semantic tokens: `--s` surface, `--i` ink, `--t` tone, `--b` border, `--g` gray/muted, plus `--a/--ai` accent and `--c/--ci` complement when action/contrast needs it. Configure anchors with `--l`, `--d`, `--a`, `--ai`, `--c`, `--ci`.
Tradeoff: Theme adapts naturally; raw brand colors need mapping first.
Override: Project token names differ and are coherent.
Tiny example:
Good: `background: var(--s); color: var(--i); border-color: var(--b);`
Avoid: repeating raw hex/hsl values throughout components.
Related: styling.theme-cascade

## Theme attributes belong on outer scope

ID: tokens.theme-attributes
Status: Default
Triggers: data-theme, theme, themed section, tone, invert, accent, dark section
Use when: Applying section/page theme.
Rule: Apply theme to outer scope, usually `<section data-theme="...">`, so descendants adapt through tokens. Default theme names: `tone`, `invert`, `accent`.
Tradeoff: Strong cascade; local exceptions need care.
Override: Component is portable and must carry its own theme boundary.
Tiny example:
Good: `<section data-theme="accent">` for a CTA/action zone.
Avoid: `data-theme="brand"` as a default name or manually theming every card inside an unthemed section.
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
