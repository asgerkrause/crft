---
scope: craft
layer: naming
triggers:
  - naming
  - tokens
  - classes
  - props
  - variants
updated: 2026-07-01
---

# Naming craft

Related: `glossary`, `tokens`, `token-contract`, `styling`.

## Token prefixes name category

ID: naming.token-prefixes
Status: Must
Triggers: token name, css variable, prefix, design system
Use when: Naming custom properties.
Rule: Use official prefixes by job: `l` layout, `s` space/shape, `t` type, `c` color, `e` element, `m` motion, `i` interaction, `z` z-index.
Tradeoff: More verbose; clear category ownership.
Override: Project has not adopted craft tokens.
Tiny example:
Good: `--s-gp`, `--c-bg`, `--e-btn-sur`.
Avoid: `--gap`, `--surface`, `--buttonColor`.

## Color role abbreviations stay fixed

ID: naming.color-roles
Status: Default
Triggers: color names, semantic colors, accent, complement, neutral
Use when: Naming color tokens.
Rule: Use `neu`, `acc`, `sec`, `bg`, `fg`, `sur`, `ink`, `mut`, `bor`, `good`, `warn`, `bad`. Use `sec` for paired secondary color roles.
Tradeoff: Short names require legend; consistent once learned.
Override: Client-facing copy can use plain words.
Tiny example:
Good: `--c-sec-sur`, `--c-bad-bor`.
Avoid: `--c-secondaryColor`, `--c-errorBorder`, `--c-mutedText`.

## Classes stay short and rare

ID: naming.short-clear
Status: Default
Triggers: class names, primitive classes, private hooks
Use when: Naming classes.
Rule: Use short durable primitives and concise private hooks. Avoid BEM and verbose wrapper names in `craft`-style code.
Tradeoff: Requires shared legend; markup stays clean.
Override: Existing project class convention differs.
Tiny example:
Good: `.c`, `.w`, `.crd`, `.btn`, `.lnk`, `.brg`.
Avoid: `.section-inner-wrapper`, `.button__text-wrapper--animated`.

## Variants name purpose

ID: naming.variants
Status: Default
Triggers: variant names, props, class variants
Use when: Naming component variants.
Rule: Use purpose or role names: `tone`, `accent`, `secondary`, `ghost`, `outlined`, `sm`, `lg`. Avoid visual trivia.
Tradeoff: Less pixel-specific naming; easier theme changes.
Override: Client design system has approved visual variant names.
Tiny example:
Good: `color="accent"`.
Avoid: `color="greenRounded"`.

## Props are literal

ID: naming.props-state
Status: Default
Triggers: props, attributes, component api, state names
Use when: Naming component attrs/props.
Rule: Prefer literal concise props: `title`, `label`, `href`, `theme`, `size`, `variant`, `items`, `name`, `required`.
Tradeoff: Fewer abstractions; CMS data may need structured names.
Override: Existing data source requires field names.
Tiny example:
Good: `<Button href="/contact/" label="Contact" />`.
Avoid: `<Button config={buttonData} visualIntent="primaryBig" />`.
