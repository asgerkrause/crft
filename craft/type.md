---
title: CRFT type
status: canonical
owner: type
read_when: Choosing semantic or visual type roles, t flags, fonts, family, hierarchy, measure, wrapping, weight, or line clamp.
---

# Type

Semantic elements define document meaning. CRFT type roles define visual treatment. `styles/layers/type.css` owns the live selectors and fluid calculation. It consumes public foundations and role tokens from `tokens.css`.

## Roles

Native `h1`–`h6` elements receive their matching visual roles without an attribute. Use `t` only when presentation must differ from semantics.

Public visual values are `h0`, `h1`, `h2`, `h3`, `h4`, `h5`, `h6`, `lg`, `bd`, and `sm`. `h0` is a display role, not an HTML heading level.

```html
<section>
  <div c>
    <div s>
      <p t="sm mu">Release 1</p>
      <h2 t="h1">One router, focused owners</h2>
      <p t="lg">Find the rule without loading the whole system.</p>
    </div>
  </div>
</section>
```

`t` is a token list. Write one role, then optional color, transform, weight, and family flags. CSS matches each token with `~=`.

| Kind | Tokens | Rule |
| --- | --- | --- |
| Role | `h0` `h1` `h2` `h3` `h4` `h5` `h6` `lg` `bd` `sm` | At most one. Native `h1`–`h6` need no role token. |
| Color | `fg` `mu` `ac` `sc` | At most one. |
| Transform | `uc` `lc` `cp` `no` | At most one. |
| Weight | `lt` `rg` `bo` | At most one. Bold is `bo`, not `bd`. |
| Family | `sa` `se` `mo` `fb` `dp` | At most one. |

`bd` is the body role. `bo` is bold. `fb` is the body family. Do not add attributes `w` or `f`. Wrap stays `s="w"`. First/last stay on `o`. Lowercase is `t~="lc"`. Line clamp stays `l`.

```html
<strong t="bo">Deadline</strong>
<code t="mo">clamp()</code>
<p t="sm mu bo se">One attribute.</p>
```

Do not add `t` when inherited body type or the native heading role is correct. A paragraph, list item, blockquote, table, or control inherits body type unless its presentation needs an explicit role.

## Fluid scale

Body type and each native or explicit role interpolate between the shared viewport bounds. Heading roles use steps `5` through `-1`. Text roles use `1`, `0`, and `-1` for `lg`, `bd`, and `sm`.

The private calculation state lives on each type boundary. Projects change the public minimum size, maximum size, and ratio foundations instead of using private calculation properties. Spacing, padding, gaps, and radius remain static.

Two accessibility gates guard every retune of the foundations, enforced by `scripts/check-system.mjs`:

- **Zoom growth.** Every step keeps a positive rem term in its fluid formula, so a larger user font size always grows the type. Numerically, a step's minimum size times the maximum viewport must exceed its maximum size times the minimum viewport.
- **Doubling budget.** Steps `-1` through `1` (`sm`, `bd`, `lg`, and the small headings) keep their maximum at or below 2.5 times their minimum, so user font-size preference can still double the rendered text. Display steps `2` through `5` are exempt: large display type legitimately spans more, page zoom still scales it fully, and the zoom-growth gate above still applies to it.

Between the viewport bounds the growth from font-size preference is partial by design; it reaches full doubling where the rem clamp ends bind. The rendered suite verifies both behaviors.

## Cap trim

Where `text-box` is supported, headings and `[t]` roles trim to cap height and alphabetic baseline, so stack and grid gaps measure optical text edges instead of line-box leading. Unsupported browsers keep normal leading; do not compensate with negative margins. A bare paragraph opts in by carrying `t="bd"`.

## Line clamp

`l` truncates a text block to a fixed number of lines. Supported values are `1` through `4`. An empty `l` uses three lines. The complete text remains in the DOM.

```html
<p l="2">A long supporting sentence that must not push the following action off the first screen.</p>
```

Use clamp only when overflow is acceptable and the full meaning is available another way, such as a heading, caption, or details. Do not clamp a heading that is the only name of a region or control.

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

Font-family tokens route sans, serif, monospace, body, and display. Change a role’s default family through `--t-ff-bd` and `--t-ff-dp`. Use a `t` family flag when one run of text must differ from its role.

Set `font-weight` and `font-variation-settings: "wght"` to the same token. `font-weight` is the fallback. The `wght` axis interpolates on variable faces and on `a`, `button`, and `label` transitions. Do not set one without the other. Change a role’s default weight through `--t-*-fw`. Use a `t` weight flag when one run of text must differ from its role.

Optional SNZ faces live in `styles/layers/fonts.css` and the copied woffs. `type.css` does not load them. Copy fonts only with `--fonts`. Without faces, `--t-ff-sa` falls through to `system-ui`.

Projects may replace copied font files and family mappings when their license, formats, preload strategy, fallback metrics, and required weights are verified.

## Character and detail

Choose type character from product and brand evidence. Check line height, letter spacing, weight, transform, punctuation, numeric alignment, selection, and fallback behavior in context.

Store copy in natural case. Use a role token or a `t` transform flag for presentation. Use tabular numbers in project CSS when changing values would otherwise shift layout.

## Common mistakes

- Using `t="h2"` to repair an incorrect heading outline.
- Applying `t="h0"` as if it changed document semantics.
- Adding `t="bd"` when inherited body type is already correct.
- Setting direct `max-width` on a role element.
- Changing private fluid calculation properties.
- Using light weight for small operational text without rendered evidence.
- Setting `font-weight` without the matching `font-variation-settings: "wght"` token, or variation without `font-weight`.
- Writing `t="bd"` for bold. Bold is `bo`.
- Adding `w` or `f` attributes.
- Using `l` for lowercase, `s="w"` as weight, or `o` first as family.

## Verify

Inspect semantic headings and every `t` value. Test native inheritance, semantic headings with visual overrides, real long and short content, role measure, scoped token overrides, fallback fonts, loaded weights, zoom, text resize, localization, and wrapping without clipping. Confirm `body` remains unconstrained and each role consumes its matching measure token once. Confirm each weight sets `font-weight` and `font-variation-settings: "wght"` to the same token.
