---
title: crft Type
status: canonical
owner: type
read_when: Choosing semantic roles, native typography, fonts, weight, measure, or static and fluid recipes.
---

# Type

Semantic elements define document meaning. Fluid type is a reference strategy, not a project requirement. Static, fluid, and mixed recipes use the same public role interface.

## Roles

| Role | Job | Default step |
| --- | --- | --- |
| `.display` | Major expressive statement | 5 |
| `.h1` | Primary heading | 4 |
| `.h2` | Secondary heading | 3 |
| `.h3` | Supporting heading | 2 |
| `.lead` | Introductory paragraph | 1 |
| `.body` | Main reading text | 0 |
| `.small` | Supporting text | -1 |
| `.label` | Control or category name | -1 |
| `.caption` | Explanation of a figure | -1 |

Native h1/h2/h3 match their roles. Native h4/h5/h6 use h3 without changing document hierarchy. Native small, label, and figcaption use their corresponding roles. Controls inherit body type unless the project intentionally chooses another role. Explicit classes override native treatment; inherited body needs no class.

Every role exposes font, size, weight, leading, tracking, measure, case, features, axes, and optical-sizing tokens. Override `--ROLE-measure`, not heading max-width. Body is unconstrained; paragraphs use body measure. Roles consume final tokens at the element so local final-size and metadata overrides work.

Heading measures default to `none`, so headings and role-styled controls use their layout's available width.
Set an optional heading measure on its hero or editorial owner; keep content caps and fluid bounds separate.
Disclosure rows own label wrapping and icon layout, including emergency word breaks when enlarged text cannot fit.

```html
<section>
  <div class="c">
    <h2 class="h1">Meaning before treatment</h2>
    <p class="lead">An introduction establishes the subject.</p>
  </div>
</section>
```

## Recipes and scope

`tokens.css` owns role steps, endpoint calculations, and final sizes. Minimum = type-min × type-ratio-min raised to the role step; maximum uses the corresponding maximum inputs. Interpolate endpoints, not the base or ratio. Fluid bounds and endpoint inputs are unitless rem magnitudes; final size is a length. Explicit final size wins, then explicit endpoints, then derived step endpoints.

Type, spacing, and radius recipes resolve at `:root` only. Change foundations there. Arbitrary descendant foundation overrides are unsupported because inherited custom-property outputs are already resolved. Local final role-size or metadata overrides belong on separate semantic owners, never theme selectors. The pow enhancement is feature-gated; readable static sizes remain without it. Static recipes supply literal lengths with no viewport dependency. Equal bases and ratios also produce a constant modular result.

Keep independent approved leading, tracking, case, features, and measure. The canonical recipe and synthetic brand fixtures require positive ordered endpoints and a maximum/minimum ratio at most 2.5.
They also require positive zoom growth across their viewport bounds. Literal role sizes take precedence over endpoints.
Positive rem terms and ratio limits are source checks, not proof of accessible enlargement. Test every used step at/below/inside/above bounds, user root sizes, browser zoom, 200% enlargement, narrow reflow, and multilingual content.

Font and weight foundations resolve at root. Final role sizes and metadata inherit through themes without rebinding.
Separate semantic owners support local final role overrides. The v3 change removes theme-local foundation recipes.
Brand OS v2 context exports are incompatible; migrate explicitly before applying them.

## Fonts and weight

Use ordinary `font-weight`. Canonical axes must not contain wght: an inherited low-level weight axis can neutralize nested strong/b. Explicit font-specific wght outside the reference must synchronize weight and preserve all other axes. Role axes and features map to font-variation-settings and font-feature-settings; optical-sizing maps to font-optical-sizing. Case uses native text-transform syntax.

Optional bundled sans and mono faces live in tokens.css with their actual 100–900 weight ranges. sans also supports opsz 14–32. `sans` and `mono` are not CSS generic keywords, so quoted and unquoted names select the same bundled face; the generic fallbacks remain `sans-serif` and `monospace`. Verify loaded fonts, intermediate weights, nested emphasis, static fallback, and supported axes. A computed axis list alone is not proof of a loaded supporting face. Native code/pre and blockquote keep their meanings; x-mono/x-quote are project extensions, not canonical size roles.

## Cap trim and clamp

Where supported, headings and role classes trim to cap height and alphabetic baseline; otherwise normal leading remains. `l` supports empty (three lines) or 1–4. Full text remains in the DOM. Use clamp only when complete meaning is available elsewhere; never truncate the sole name of a control or region.

## Verify

Check native/class precedence, body inheritance, root-only recipes and local final overrides, role measure, loaded fonts, axes, emphasis, wrap, root-size changes, zoom and fallbacks. Reference fixtures are synthetic browser evidence; product authority owns design and accessibility acceptance.
