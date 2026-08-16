---
title: CRFT type
status: canonical
owner: type
read_when: Choosing semantic or visual type roles, fonts, hierarchy, measure, wrapping, weight, or type overrides.
---

# Type

Semantic elements define document meaning. CRFT type roles define visual treatment. `styles/layers/type.css` owns the live selectors and consumes role tokens from `tokens.css`.

## Roles

Public visual aliases are:

- `.h0`, `.h1`, `.h2`, `.h3`, `.h4`, `.h5`, and `.h6`;
- `.t-lg`, `.t-bd`, and `.t-sm`.

`.h0` is a display role, not an HTML heading level. Use the correct `h1`–`h6` element first, then add a visual alias only when the composition needs another presentation.

```html
<section>
  <div class="c">
    <div class="s">
      <p class="t-sm c-mu">Release 1</p>
      <h2 class="h1">One router, focused owners</h2>
      <p class="t-lg">Find the rule without loading the whole system.</p>
    </div>
  </div>
</section>
```

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

Do not set `max-width` directly on headings or text-role elements. `body` remains unconstrained.

CRFT balances headings and uses pretty wrapping for body roles. Verify long words, URLs, product names, labels, and translated content. Add a local overflow rule only where real content needs it.

## Fonts and weight

`styles/layers/type.css` registers bundled `sans.ttf` and `mono.ttf` as variable-weight families. Font-family tokens route sans, serif, monospace, body, and display roles.

Use normal `font-weight`. Do not use `font-variation-settings` for the registered weight axis. Use the finite font-family and weight utilities only for stable operations.

Projects may replace copied font files and family mappings when their license, formats, preload strategy, fallback metrics, and required weights are verified.

## Character and detail

Choose type character from product and brand evidence. Check line height, letter spacing, weight, transform, punctuation, numeric alignment, selection, and fallback behavior in context.

Store copy in natural case. Use a role token or the finite transform utilities for presentation. Use tabular numbers in project CSS when changing values would otherwise shift layout.

## Common mistakes

- Using `.h2` to repair an incorrect heading outline.
- Applying `.h0` as if it were a semantic heading.
- Setting direct `max-width` on a role element.
- Adding one-off font sizes without checking the scale.
- Using light weight for small operational text without rendered evidence.
- Loading a font without checking fallback, layout shift, and required glyphs.
- Using `font-variation-settings` for weight.

## Verify

Inspect semantic headings and all visual aliases. Test real long and short content, role measure, scoped token overrides, fallback fonts, loaded weights, both schemes, zoom, text resize, localization, and wrapping without clipping. Confirm `body` remains unconstrained and each role consumes its matching measure token once.
