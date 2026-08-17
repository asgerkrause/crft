---
title: CRFT type
status: canonical
owner: type
read_when: Choosing semantic or visual type roles, fonts, hierarchy, measure, wrapping, weight, or type overrides.
---

# Type

Semantic elements define document meaning. CRFT type roles define visual treatment. `styles/layers/type.css` owns the live selectors and fluid calculation. It consumes public foundations and role tokens from `tokens.css`.

## Roles

Native `h1`–`h6` elements receive their matching visual roles without an attribute. Use `t` only when presentation must differ from semantics.

Public visual values are `h0`, `h1`, `h2`, `h3`, `h4`, `h5`, `h6`, `lg`, `bd`, and `sm`. `h0` is a display role, not an HTML heading level.

```html
<section>
  <div class="c">
    <div class="s">
      <p t="sm" class="c-mu">Release 1</p>
      <h2 t="h1">One router, focused owners</h2>
      <p t="lg">Find the rule without loading the whole system.</p>
    </div>
  </div>
</section>
```

Do not add `t` when inherited body type or the native heading role is correct. A paragraph, list item, blockquote, table, or control inherits body type unless its presentation needs an explicit role.

## Fluid scale

Body type and each native or explicit role interpolate between the shared viewport bounds. Heading roles use steps `5` through `-1`. Text roles use `1`, `0`, and `-1` for `lg`, `bd`, and `sm`.

The private calculation state lives on each type boundary. Projects change the public minimum size, maximum size, and ratio foundations instead of using private calculation properties. Spacing, padding, gaps, and radius remain static.

## Hierarchy

Map visual roles to the page hierarchy established by the brief. A child heading must not accidentally overpower its parent. Adjacent semantic levels may share a visual role when spacing, weight, or context preserves the relationship.

Use few families, sizes, and weights. Real content must prove each role. Do not choose a heading element for its default size.

## Measure and wrapping

Every heading and text role owns readable measure through its matching `--t-*-mw` token. Override that token at the narrowest semantic boundary:

```css
@layer project {
  #release {
    --t-h1-mw: 18ch;
    --t-lg-mw: 42ch;
  }
}
```

Do not set `max-width` directly on headings or type-role elements. `body` remains unconstrained.

CRFT balances headings and uses pretty wrapping for body roles. Verify long words, URLs, product names, labels, and translated content. Add a local overflow rule only where real content needs it.

## Fonts and weight

`styles/layers/type.css` registers bundled `sans.ttf` and `mono.ttf` as variable-weight families. Font-family tokens route sans, serif, monospace, body, and display roles.

Use normal `font-weight`. Do not use `font-variation-settings` for the registered weight axis. Use the finite font-family and weight utilities only for stable operations.

Projects may replace copied font files and family mappings when their license, formats, preload strategy, fallback metrics, and required weights are verified.

## Character and detail

Choose type character from product and brand evidence. Check line height, letter spacing, weight, transform, punctuation, numeric alignment, selection, and fallback behavior in context.

Store copy in natural case. Use a role token or the finite transform utilities for presentation. Use tabular numbers in project CSS when changing values would otherwise shift layout.

## Common mistakes

- Using `t="h2"` to repair an incorrect heading outline.
- Applying `t="h0"` as if it changed document semantics.
- Adding `t="bd"` when inherited body type is already correct.
- Setting direct `max-width` on a role element.
- Changing private fluid calculation properties.
- Using light weight for small operational text without rendered evidence.
- Using `font-variation-settings` for weight.

## Verify

Inspect semantic headings and every `t` value. Test native inheritance, semantic headings with visual overrides, real long and short content, role measure, scoped token overrides, fallback fonts, loaded weights, zoom, text resize, localization, and wrapping without clipping. Confirm `body` remains unconstrained and each role consumes its matching measure token once.
