---
name: Craft
version: alpha
status: canonical
scope: frontend
layer: contract
description: Strategy-first, aesthetic-high, performance-native frontend contract.
values: project-owned
rule_style: bullet-first
appendices: []
skills:
  [craft-init, craft-audit, craft-sync, craft-tokenize, craft-css-scaffold]
tokens:
  layout:
    [--l-mw, --l-mw-sm, --l-mw-lg, --l-fluid, --l-gc, --l-cs, --l-rs, --l-or, --l-st]
  stack:
    [--z-base, --z-head, --z-pop, --z-modal, --z-toast]
  space:
    [--s-py, --s-px, --s-ss, --s-gp, --s-gp-xl, --s-gp-lg, --s-gp-sm, --s-gp-xs, --s-pd, --s-pd-lg, --s-pd-sm, --s-br, --s-br-sm, --s-br-pill, --s-bw]
  type:
    [--t-ff-ss, --t-ff-se, --t-ff-mo, --t-ff-display, --t-ff-hand, --t-ffs, --t-fw-l, --t-fw-r, --t-fw-b, --t-h0, --t-h1, --t-h2, --t-h3, --t-h4, --t-h5, --t-h6, --t-lg, --t-md, --t-sm]
  color:
    [--c-bg, --c-fg, --c-sur, --c-ink, --c-mut, --c-bor, --c-acc, --c-sec, --c-neu-*, --c-acc-*, --c-sec-*, --c-good-*, --c-warn-*, --c-bad-*]
  element:
    [--e-btn-*, --e-crd-*, --e-inp-*, --e-bdg-*, --e-head-*, --e-foot-*]
  motion:
    [--m-td-sf, --m-td-f, --m-td, --m-td-s, --m-td-ss, --m-tf-i, --m-tf-o, --m-tf-io, --m-tf-s, --m-tf, --sp-t, --sp-f, --sp-ft]
  interaction:
    [--i-hov-t, --i-hov-f, --i-foc-t, --i-foc-f, --i-prs-t, --i-prs-f, --i-exp-t, --i-exp-f]
themes:
  [default, tone, accent, secondary, invert]
primitives:
  [.c, .w, .crd, .btn, .btns, .lnk, .lnks, .img-w, .eb]
utilities:
  type: [.t-lg, .t-md, .t-sm, .fw-l, .fw-r, .fw-b]
  color: [.c-ink, .c-mut, .c-acc, .c-sec, .c-bg]
layout_attrs:
  [g, c, r, o]
motion_attrs:
  [data-scrub, data-scroll]
button_variants:
  [base, tone, accent, accent-tone, secondary, secondary-tone, ghost, outlined, sm, lg]
card_variants:
  [default, outlined, ghost, accent, invert]
private_hooks:
  [.brg, .icn, .tabs]
updated: 2026-07-06
---

# Craft

## Use

- Read this file first for frontend/UI work.
- Treat this file as source truth for Craft vocabulary, defaults, and hard constraints.
- Use project goal, brand, accessibility, security, performance, and existing safe local patterns over Craft when stricter or better fit.
- Project values are allowed; project vocabulary drift needs reason.
- Examples teach structure, token names, and ownership; examples do not prescribe visual values.
- If a class, variant, data theme, token family, or hook is not listed here, do not add it without local reason.

## Overview

- Strategy owns page order, hierarchy, and conversion path.
- Aesthetic ambition stays protected through type, rhythm, color, composition, media, and motion.
- Performance stays native by default.
- Complexity earns itself.
- Accessibility belongs to craft, not audit cleanup.
- Tokens carry system intent, not arbitrary values.
- Components exist when boundaries earn themselves.
- CSS owns layout, theme, visual state, and motion whenever possible.
- JavaScript earns every byte.

## Non-negotiables

- Use semantic HTML first. Add ARIA only where native semantics end.
- Keep DOM order, reading order, heading order, and focus order understandable without CSS.
- Keep focus visible. Never remove outlines without a token-backed visible replacement.
- Keep zoom enabled. Never use `user-scalable=no` or `maximum-scale=1`.
- Honor `prefers-reduced-motion`.
- Meet WCAG AA contrast for text and controls across themes and states.
- Pair error/invalid state with text, not color alone.
- Allow paste and autofill in form fields.
- Avoid dependencies for accordions, tabs, reveals, carousels, or basic validation.
- Verify visible behavior when UI output changes.

## Signature

- View source should read like an outline.
- CSS should show tokens, not scattered literals.
- Static sections ship no runtime.
- Theme changes happen at outer scope, not child-by-child.
- One visual move should make a page memorable.
- Keyboard navigation should work without a special audit pass.

## Token contract

- Token names are contract. Values are project-owned.
- Scaffolded CSS may include neutral starter values so output is valid; those values are installer defaults, not Craft canon.
- Components consume final names: `--t-h1-fs`, `--s-gp`, `--l-mw`.
- Components must not depend on `-min/-max` config or inline `clamp()`.
- Line-height tokens are fixed values. Never use `lh-min`, `lh-max`, or `clamp()` for line-height.
- Fluid token engines are optional, not required Craft infrastructure.
- Projects may use final static tokens without min/max config.
- Missing `-min/-max` variables are acceptable when project scale does not need a fluid system.
- Projects may derive final tokens with fluid config, media queries, container queries, static values, or generated design-token import.
- Use local custom properties for one-off art direction.
- Create global tokens only for repeated, systemic, or themeable roles.
- Use `--e-*` only for shared primitives and site regions.
- Private hooks use local vars, not global `--e-*`: `--brg-*`, `--tab-*`, `--dia-*`.
- Do not mirror every raw value as a token.
- Do not add a second token dialect beside Craft in a Craft-owned project.

## Token decision tree

1. Repeated, systemic, or themeable? Use global token.
2. One-off art direction? Use local var.
3. Layout/grid/order? Use `--l-*`.
4. Stack order? Use `--z-*`.
5. Spacing/radius/border width? Use `--s-*`.
6. Type? Use `--t-*`.
7. Semantic color/state/alpha? Use `--c-*`.
8. Shared primitive/region skin? Use `--e-*`.
9. Timing/easing? Use `--m-*`.
10. Interactive state math? Use `--i-*`.

## CSS scaffold contract

- Use `craft-css-scaffold` when a project needs Craft CSS files injected instead of hand-written by an LLM.
- Scaffold shape is split by owner: import shell, `system.css`, `reset.css`, `grid.css`, `type.css`, `wrappers.css`, `motion.css`, optional `site.css`.
- Generated CSS must be valid on first run; no blank custom properties.
- Starter values are neutral defaults, not canonical Craft taste.
- Existing files are preserved unless explicit overwrite is approved.
- `static` mode writes final tokens directly.
- `fluid` mode writes min/max config plus derived final tokens.
- `auto` mode only chooses fluid when existing CSS clearly uses fluid token config; otherwise static.
- Structural math is allowed: `calc()`, `clamp()`, `color-mix()`, interaction vars, and scrub vars.
- Brand/project values must come from project source truth or explicit notes.
- App/layout CSS import may be patched only when the script finds one clear target; unclear targets get manual import instructions.

## Layout and stack tokens

| Token | Owns | Default consumer |
| --- | --- | --- |
| `--l-mw` | default content max width | `.c` |
| `--l-mw-sm` | narrow content max width | `.c.sm`, prose/CTA sections |
| `--l-mw-lg` | wide content max width | `.c.lg`, visual-heavy sections |
| `--l-fluid` | normalized fluid interpolation factor | token derivation only |
| `--l-gc` | grid column count | `[g]` |
| `--l-cs` | column span | `[c]` |
| `--l-rs` | row span | `[r]` |
| `--l-or` | visual order | `[o]` |
| `--l-st` | start/placement position | special grid placement |
| `--z-base` | normal document stacking | base layers |
| `--z-head` | sticky/fixed header | header/nav |
| `--z-pop` | popovers/menus/tooltips | floating UI |
| `--z-modal` | modal dialogs | `dialog`, modal shells |
| `--z-toast` | transient top layer notices | toast/status UI |

## Space and shape tokens

| Token | Owns | Default consumer |
| --- | --- | --- |
| `--s-py` | section block padding | `section` |
| `--s-px` | viewport/section inline padding | `section`, page shell |
| `--s-ss` | major blocks inside container | `.c` gap |
| `--s-gp-xl` | large nested group separation | `.w.gp-xl` |
| `--s-gp-lg` | medium-large nested group separation | `.w.gp-lg` |
| `--s-gp` | related element rhythm | `.w`, `[g]`, `.crd` |
| `--s-gp-sm` | tight control rhythm | `.btns`, compact labels |
| `--s-gp-xs` | extra-tight internal detail | optional compact components |
| `--s-pd` | default component padding | `.crd`, `.btn`, fields |
| `--s-pd-lg` | large component padding | hero cards, feature panels |
| `--s-pd-sm` | compact component padding | small buttons, inputs |
| `--s-br` | default radius | cards, buttons, inputs |
| `--s-br-sm` | compact radius | inputs, small controls |
| `--s-br-pill` | pill radius | pill buttons, badges |
| `--s-bw` | border/outline width | borders, focus rings, icon strokes |

## Typography tokens

| Token | Owns | Default consumer |
| --- | --- | --- |
| `--t-ff-ss` | sans family | default UI/prose |
| `--t-ff-se` | serif family | editorial/brand moments |
| `--t-ff-mo` | mono family | code, data, tabular figures |
| `--t-ff-display` | display family | high-impact headings |
| `--t-ff-hand` | hand/organic family | rare brand accent |
| `--t-ffs` | font feature settings | global/type utilities |
| `--t-fw-l` | light weight | low-emphasis type |
| `--t-fw-r` | regular weight | prose/default UI |
| `--t-fw-b` | bold/strong weight | headings/actions/emphasis |
| `--t-h0` | largest display heading shorthand | rare hero/page title |
| `--t-h1`…`--t-h6` | heading shorthands | headings |
| `--t-h*-fs` | heading font size | heading assembly |
| `--t-h*-ff` | heading font family | heading assembly |
| `--t-h*-fw` | heading weight | heading assembly |
| `--t-h*-lh` | heading line height | heading assembly; fixed value only, never min/max or clamp |
| `--t-h*-ls` | heading letter spacing | heading assembly |
| `--t-h*-mw` | heading measure | heading wrappers |
| `--t-h*-tt` | heading transform | heading assembly |
| `--t-lg` / `--t-md` / `--t-sm` | body text shorthands | prose, labels, UI text |
| `--t-*-mw` | prose measure | `.w p`, prose blocks |

## Color tokens

| Token | Owns | Default consumer |
| --- | --- | --- |
| `--c-bg` | page or themed region background | body, `[data-theme]` |
| `--c-fg` | default foreground on current bg | body, `[data-theme]` |
| `--c-sur` | raised/subtle surface | cards, inputs, panels |
| `--c-ink` | strong readable text/icons | headings, primary text |
| `--c-mut` | muted readable text/icons | metadata, helper copy |
| `--c-bor` | border/divider color | borders, rules |
| `--c-acc` | accent text/icon anchor | `.c-acc`, links/focus when project maps it |
| `--c-sec` | secondary text/icon anchor | `.c-sec`, secondary accents when project maps it |
| `--c-neu-*` | neutral source ramp | theme source only |
| `--c-acc-*` | accent source ramp | accent themes/actions/focus |
| `--c-sec-*` | secondary source ramp | secondary themes/actions |
| `--c-bg-*` | bg alpha overlays | overlays, glass, dividers |
| `--c-fg-*` | fg alpha overlays | hover/focus overlays, borders |
| `--c-acc-sur/ink/bor` | accent surface pair | accent buttons/sections |
| `--c-sec-sur/ink/bor` | secondary surface pair | secondary buttons/sections |
| `--c-good-sur/ink/bor` | success feedback pair | success states |
| `--c-warn-sur/ink/bor` | warning feedback pair | warning states |
| `--c-bad-sur/ink/bor` | error/destructive pair | errors/destructive actions |

## Element tokens

| Token family | Owns | Default consumer |
| --- | --- | --- |
| `--e-btn-sur/ink/bor` | button surface/text/border | `.btn`; remap same vars in hover/active/disabled selectors |
| `--e-crd-sur/ink/bor` | card surface/text/border | `.crd`; variants and themed ancestor scopes remap same vars |
| `--e-inp-sur/ink/bor` | input surface/text/border | inputs, selects, textareas |
| `--e-inp-plh` | placeholder text | inputs/textareas |
| `--e-bdg-sur/ink/bor` | badge/eyebrow surface/text/border | `.eb`, badges |
| `--e-head-sur/ink/bor` | header surface/text/border | site header |
| `--e-foot-sur/ink/bor` | footer surface/text/border | site footer |

## Motion and interaction tokens

| Token | Owns | Default consumer |
| --- | --- | --- |
| `--m-td-sf` | super-fast duration | press/focus microstates |
| `--m-td-f` | fast duration | hover/active controls |
| `--m-td` | default duration | component transitions |
| `--m-td-s` | slow duration | reveals/panels |
| `--m-td-ss` | slower duration | page/hero motion |
| `--m-tf-i` | ease in | entering/exiting detail |
| `--m-tf-o` | ease out | most UI transitions |
| `--m-tf-io` | ease in-out | bidirectional motion |
| `--m-tf-s` | spring/snappy easing | small controls/icons |
| `--m-tf` | default easing | fallback transition |
| `--i-hov-t/f` | hover state math | hover transforms/opacity |
| `--i-foc-t/f` | focus state math | focus visuals |
| `--i-prs-t/f` | pressed state math | active button transforms |
| `--i-exp-t/f` | expanded state math | disclosure/menu visuals |
| `--i-hov-t=0`, `--i-hov-f=1` | default non-hover pair | root/default interaction state |
| `--i-hov-t=1`, `--i-hov-f=0` | hover/focus pair | `:is(:hover, :focus-visible)` |
| `--sp-t` | scroll progress 0 → 1 | `[data-scrub]` consumers |
| `--sp-f` | inverse scroll progress 1 → 0 | `[data-scrub]` consumers |
| `--sp-ft` | in-out scroll progress 0 → 1 → 0 | `[data-scrub]` consumers |

## Scroll scrub motion

- Use `[data-scrub]` as the canonical CSS scroll-progress utility.
- Implement it in the motion layer with `@supports (animation-timeline: view())`.
- `[data-scrub]` sets existing progress vars: `--sp-t`, `--sp-f`, `--sp-ft`.
- Components consume those vars; they do not create per-component progress systems.
- Use component-local vars for effect amount, e.g. `--plx` on `.img-w[data-scrub]`.
- Keep scrub effects decorative; content and layout must work without `animation-timeline` support.
- Use cheap properties (`transform`, `opacity`) for scrubbed effects.
- Reduce or remove scrub transforms under `prefers-reduced-motion` when movement is noticeable.
- Use `data-scroll="hero"` only when a named view timeline/scope is needed.

Canonical scrub engine:

```css
@supports (animation-timeline: view()) {
  @property --sp-t { syntax: '<number>'; inherits: true; initial-value: 0; }
  @property --sp-f { syntax: '<number>'; inherits: true; initial-value: 1; }
  @property --sp-ft { syntax: '<number>'; inherits: true; initial-value: 0; }

  @keyframes sp-t { from { --sp-t: 0; } to { --sp-t: 1; } }
  @keyframes sp-f { from { --sp-f: 1; } to { --sp-f: 0; } }
  @keyframes sp-ft { 0%, 100% { --sp-ft: 0; } 50% { --sp-ft: 1; } }

  [data-scrub] {
    animation: sp-t linear both, sp-f linear both, sp-ft linear both;
    animation-timeline: view();
    animation-range: entry 0% exit 100%;
  }
}
```

Image scrub pattern:

```css
@supports (animation-timeline: view()) {
  .img-w[data-scrub] { --plx: 8vh; }
  .img-w[data-scrub] img {
    height: calc(100% + var(--plx));
    margin-top: calc(var(--plx) * -1);
    transform: translateY(calc(var(--plx) * var(--sp-t)));
  }
}
```

## Data themes

| Theme | Apply with | Meaning | Maps |
| --- | --- | --- | --- |
| default | no attr | page baseline | project base `--c-*`, `--e-*` |
| tone | `data-theme="tone"` | subtle contrast band | neutral surface roles into `--c-bg/sur/bor` |
| accent | `data-theme="accent"` | CTA/high-emphasis band | accent roles into `--c-bg/fg/sur/ink/bor` |
| secondary | `data-theme="secondary"` | alternate brand/support band | remap current `--c-*` roles from secondary source roles |
| invert | `data-theme="invert"` | high-contrast inverted band | remap current `--c-bg/fg/sur/ink/mut/bor` roles to inverted pairs |

- Apply theme on the outer scope, usually `<section data-theme="...">`.
- Themes remap current `--c-*` and `--e-*` variables in scope; they do not create theme-specific variables.
- Descendants adapt through the same `--c-*` and `--e-*` names.
- Do not recolor every child by hand.
- Do not add theme names outside the registry without project reason.
- Feedback states (`good`, `warn`, `bad`) are state roles, not section themes by default.

## Type utilities

| Utility | Maps to | Use |
| --- | --- | --- |
| `.t-lg` | `--t-lg-*` | lead/body emphasis |
| `.t-md` | `--t-md-*` | default prose/UI text |
| `.t-sm` | `--t-sm-*` | metadata/helper text |
| `.fw-l` | `--t-fw-l` | light emphasis |
| `.fw-r` | `--t-fw-r` | normal weight |
| `.fw-b` | `--t-fw-b` | strong weight |

- Use `.t-*` only. Never `.f-*`.
- Balance short headings.
- Use pretty wrapping on prose blocks when supported.
- Keep prose measure tokenized with `--t-*-mw`.

## Color utilities

| Utility | Maps to | Use |
| --- | --- | --- |
| `.c-ink` | `--c-ink` | strong text/icon |
| `.c-mut` | `--c-mut` | muted text/icon |
| `.c-acc` | `--c-acc` or project accent role | accent text/icon |
| `.c-sec` | `--c-sec` or project secondary role | secondary text/icon |
| `.c-bg` | `--c-bg` | rare explicit bg-colored text/icon |

- Keep color utilities sparse.
- Prefer scoped theme + element tokens over repeated color utilities.

## Layout attributes

| Attr | Job | Values | Example |
| --- | --- | --- | --- |
| `g` | grid columns | `L` or `L-M`, `sg` subgrid, `a` auto, `a-sm` compact auto, `a-lg` wide auto | `g="3-2"`, `g="a"` |
| `c` | column span | `L` or `L-M`, `0` full row | `c="2-1"` |
| `r` | row span | `L` or `L-M` | `r="2"` |
| `o` | visual order | `f` first, `a` auto, `l` last | `o="f-f-a"` |

- Values read large → medium/small.
- Small screens stack by default.
- `g="a"`, `g="a-sm"`, and `g="a-lg"` use CSS auto-fit with minimum tracks of `20rem`, `10rem`, and `30rem`.
- Use `[o]` only when reading/focus order remains understandable.
- Use `[c]` for column span; `.c` for container; `.c-ink` for color utility.

## Primitive registry

| Primitive | Owns | Notes |
| --- | --- | --- |
| `.c` | section/container max width and major rhythm | direct child of `section`; never nested |
| `.c.sm` | narrow container | prose, compact CTA |
| `.c.lg` | wide container | visual-heavy sections |
| `.c.center` | center self and direct children | do not repeat `.w.center` inside |
| `.w` | related vertical group | headings/prose/buttons groups |
| `.w.h` | horizontal group | stacks on small screens |
| `.w.center` | center one subgroup | only when parent `.c` is not centered |
| `.w.gp-xl` / `.w.gp-lg` | larger nested group separation | avoid margins |
| `.crd` | card surface/padding/radius/rhythm | use `--e-crd-*` |
| `.btn` | link/button visual primitive | use `--e-btn-*` |
| `.btns` | button group | tight gap, wrapping allowed |
| `.lnk` | text link | semantic link styling |
| `.lnks` | link group | related text links |
| `.img-w` | media wrapper | aspect/crop/overflow ownership |
| `.eb` | eyebrow/badge label | use badge/type tokens |

## Component variants

- Use `variant` for component visual treatment and class mapping.
- Use `theme` only for scoped `data-theme` token remaps.
- Do not name a component visual attr `color`; color is CSS property/token language, not component API language.

## Button variants

| Variant | Meaning | Token behavior |
| --- | --- | --- |
| `.btn` | default action | consumes `--e-btn-*` defaults |
| `.btn.tone` | lower-emphasis/tone-aware action | softer surface/border; still readable |
| `.btn.accent` | primary/high-emphasis action | maps `--e-btn-*` to `--c-acc-*` pair |
| `.btn.accent.tone` | subtle accent action | accent border/text/surface, lower fill |
| `.btn.secondary` | secondary brand/action | maps to `--c-sec-*` pair |
| `.btn.secondary.tone` | subtle secondary action | secondary border/text/surface, lower fill |
| `.btn.ghost` | low-emphasis action | transparent/near-transparent surface |
| `.btn.outlined` | neutral bordered action | transparent surface, visible border |
| `.btn.sm` | compact size | size only; no color meaning |
| `.btn.lg` | large size | size only; no color meaning |
| `.btn[disabled]`, `.btn[aria-disabled="true"]` | unavailable action | remap current `--e-btn-*`, no hover/press affordance |

- Button labels name action or destination.
- One view should have one strongest primary action.
- Size variants never encode importance by themselves.
- State order: default → hover → active → focus-visible → disabled.
- States remap existing `--e-btn-sur/ink/bor` in the selector; do not add `--e-btn-hov-*`, `--e-btn-act-*`, or `--e-btn-dis-*`.
- Links that navigate may look like buttons; they remain `<a href>`.
- Actions that mutate state use `<button>`.

## Card variants

| Variant | Meaning | Token behavior |
| --- | --- | --- |
| `.crd` | default surface | consumes `--e-crd-*` defaults |
| `.crd.outlined` | bordered neutral surface | transparent/subtle surface with visible border |
| `.crd.ghost` | lowest-emphasis grouping | transparent surface, minimal chrome |
| `.crd.accent` | high-emphasis card | maps `--e-crd-*` to accent pair |
| `.crd.invert` | contrast card | maps `--e-crd-*` to inverted pair |

- Card uses `variant`, not `theme`, for component visuals.
- Linked cards may use the same `.crd` variants; keep accessible link text in card content.
- Use outer `data-theme` when a whole section changes semantic color roles.

## Button interactive slots

- Use `.btn-vis-w` for decorative visual media/icon slot.
- Use `.btn-txt-w` for text-mask motion when the label has a duplicate motion layer.
- Mark decorative visual/text motion layers `aria-hidden="true"`; keep the button/link accessible name on the root.
- Use `--i-hov-t` and `--i-hov-f` to drive icon/text/image motion from one state source.
- Do not add hover-specific classes or hover-specific variables for icon/text motion.
- Use duplicate inline children for slot-slide effects only when overflow masking is the intended visual.
- Use `:has(.btn-vis-w)` to adjust button padding/gap when a visual slot exists.
- Under reduced motion, remove visual-slot transforms and transitions.

Canonical interactive button structure:

```html
<a class="btn" href="..." aria-label="Book a call">
  <span class="btn-vis-w" aria-hidden="true"><span>→</span><span>→</span></span>
  <span class="btn-txt-w" aria-hidden="true"><span>Book a call</span><span>Book a call</span></span>
</a>
```

Canonical interactive button motion:

```css
:where(a, button) { --i-hov-t: 0; --i-hov-f: 1; }
:where(a, button):is(:hover, :focus-visible) { --i-hov-t: 1; --i-hov-f: 0; }

.btn-vis-w,
.btn-txt-w { overflow: hidden; }

.btn-vis-w :is(span, i, b, svg) {
  transform: translateX(calc(100% * var(--i-hov-t)));
  transition: transform var(--m-td-s) var(--m-tf-s), color var(--m-td-s) var(--m-tf-s);
}

.btn-vis-w :is(img, picture) {
  transform: scale(calc(1 + .2 * var(--i-hov-f)));
  transition: transform var(--m-td-f) var(--m-tf-o);
}

.btn-txt-w span {
  transform: translateY(calc(var(--i-hov-t) * -100%));
  transition: transform var(--m-td-s) var(--m-tf-s), color var(--m-td-s) var(--m-tf-s);
}

@media (prefers-reduced-motion: reduce) {
  .btn-vis-w :is(span, i, b, svg, img, picture),
  .btn-txt-w span {
    transform: none;
    transition: none;
  }
}
```

## Composition rules

- Use `section > .c > groups`.
- Use `.c` once per section. Never nest `.c`.
- Use `.c` only as container, not rhythm wrapper.
- Use `.w` for typographic or related vertical groups.
- Use `[g]`, `[c]`, `[r]`, `[o]` for responsive structure.
- Use classes for containers, wrappers, primitives, and modifiers.
- Use attributes for layout grammar.
- Use one content job per `<section>` and usually a heading.
- Use plain `<div>` for layout-only groups inside a section.
- Avoid bare `<div>` without class or attribute job.
- Avoid nested sections for rows or cards.
- Use gap tokens for page rhythm and component rhythm, not child margins.

Canonical section:

```html
<section data-theme="tone">
  <div class="c">
    <div class="w">
      <p class="eb">...</p>
      <h2>...</h2>
      <p class="t-lg">...</p>
    </div>
    <div g="3-2">
      <article class="crd">...</article>
    </div>
  </div>
</section>
```

## Section strategy

- Section order moves visitors through context, desire, proof, mechanism, trust, action.
- Change section order only when content logic improves.
- Hero must state or show the page thesis.
- Hero gets one dominant visual/content move, one primary CTA group, restrained motion.
- Visual treatment must amplify the section job.
- Proof, features, process, and CTA should not share identical rhythm unless meaning matches.
- CTA sections usually use `data-theme="accent"` or token-backed accent mapping.
- Accent overuse weakens meaning.

## Component rules

- A component earns itself through reuse, state, complexity, authoring clarity, or primitive ownership.
- Do not componentize every wrapper.
- Keep markup inline until repetition, state, or complexity earns extraction.
- Prefer small durable primitives: Section, Grid, Card, Button, Link, Image, form fields.
- Section injects `.c`; authors compose `.w`, `[g]`, and primitives in slots.
- Grid wraps `[g]` attrs without changing grammar.
- Card owns repeated surface, padding, radius, and rhythm.
- Button variants remap element tokens; they do not duplicate full CSS.
- Use slots/children for layout content.
- Keep props literal and concise: `title`, `label`, `href`, `items`, `theme`, `size`, `variant`.
- Use `variant` for component visual treatments; reserve `theme` for `data-theme` scope components like Section.
- Avoid object-shaped config unless data source requires it.
- Name variants by purpose: `tone`, `accent`, `secondary`, `ghost`, `outlined`, `invert`, `sm`, `lg`.
- Avoid visual variants like `blueShadowRounded`.

## Interaction rules

- State lives in truthful HTML, ARIA, and native attributes.
- CSS reads state through `[aria-*]`, `:has()`, `:checked`, `:user-invalid`, `:open`, and `[hidden]`.
- JS toggles truthful state; JS does not paint styles.
- Use `aria-expanded`, `aria-selected`, `aria-current`, `aria-invalid`, `aria-required` where behavior needs state.
- Every interactive region needs an accessible name.
- Use one private hook only when semantic selectors cannot carry visual chrome cleanly.
- Private hooks are short and component-owned: `.brg`, `.icn`, `.tabs`.
- Private hooks use local vars only: `--brg-*`, `--tab-*`, `--dia-*`.
- Private hooks are not layout wrappers and not state classes.
- Do not use `.is-open`, `.active`, `.selected` for state.

## Widget contracts

### Menu disclosure

- HTML: `<button class="brg" type="button" aria-expanded="false" aria-controls="nav" aria-label="Menu"></button>` plus `<nav id="nav" aria-label="Primary">`.
- CSS: style `.brg[aria-expanded="true"]`, `header:has(.brg[aria-expanded="true"]) nav`, and covered background interaction.
- JS: toggle `aria-expanded`; close on Escape when overlay behavior exists.
- Avoid clickable div menu and `.is-open` state class.

### Generic disclosure

- HTML: `button[aria-expanded][aria-controls]` controls a panel with matching `id`.
- State: toggle `aria-expanded` and `hidden` together.
- CSS: style `[aria-expanded="true"]` and `[hidden]`.
- Avoid panel visibility owned only by class.

### Current route

- HTML: use `<nav aria-label>` with real links and `aria-current="page"`.
- CSS: style `a[aria-current="page"]`.
- Avoid `.active` as only current state.

### Tabs

- HTML: `.tabs` root, `[role="tablist"]`, `button[role="tab"]`, `[role="tabpanel"]`.
- State: selected tab has `aria-selected="true"`; inactive tabs get `tabindex="-1"`; inactive panels use `hidden`.
- Keyboard: Arrow keys move tabs; Home/End jump; activation updates panel.
- CSS: style `[role="tab"][aria-selected="true"]` and `[role="tabpanel"][hidden]`.
- Avoid div tabs without roles and tab dependency for small UI.

### Accordion / FAQ

- HTML: use `<details>` and `<summary>` before custom JS.
- Use `name` for exclusive groups when supported.
- Style `details:open` or `details[open]`.
- Use `.icn` only for decorative chrome.
- Avoid accordion dependency for static FAQ.

### Checkbox / radio choice

- HTML: keep native input inside label.
- CSS: style `label:has(> input:checked)`, `label:has(:focus-visible)`, `label:has(> input:user-invalid)`.
- Use `accent-color` unless brand earns custom `appearance: none`.
- Avoid hidden native input plus disconnected styled div.

### Required checkbox group

- HTML: use `<fieldset aria-required="true" aria-invalid="false" aria-describedby="...">` with `<legend>` and group error text.
- JS: when none checked, sync `aria-invalid`, error visibility, and `setCustomValidity` on owned control.
- CSS: style `fieldset[aria-invalid="true"]`.
- Avoid `required` on every checkbox without group semantics.

### Dialog

- HTML: use native `<dialog aria-labelledby>` and `form method="dialog"` when appropriate.
- JS: call `showModal()` / `close()`; return focus to opener when needed.
- CSS: style `dialog` and `dialog::backdrop` with tokens/local vars.
- Avoid div overlay without dialog semantics or focus management.

## Forms

- Use real `<form>`, `<label>`, `<input>`, `<textarea>`, `<select>`, `<fieldset>`, `<legend>`, `<button type="submit">`.
- Use meaningful `name`, correct `type`, useful `autocomplete`, and helpful `inputmode`.
- Keep labels visible. Placeholders are examples, not labels.
- Use `--e-inp-sur`, `--e-inp-ink`, `--e-inp-bor` for official field skin.
- Use state roles for validation: `--c-bad-*`, `--c-good-*`, `--c-warn-*`.
- Error state needs readable text plus `aria-invalid`, `aria-describedby`, or native validation.
- Keep submit enabled until request starts.
- During async submit, set truthful disabled/busy state and announce status with `aria-live="polite"`.
- Do not block paste.
- Do not rely on spinner-only feedback.

## Navigation

- Use `<nav aria-label>`, list markup, and real links.
- Use `aria-current="page"` for active route.
- Use a real menu `<button>` with `aria-controls` and `aria-expanded`.
- Use `--e-head-*`, `--e-foot-*`, and `--z-head` for reusable chrome.
- When overlay menu opens, prevent covered background interaction and keep focus order understandable.
- Close on Escape when JS owns disclosure behavior.
- Avoid clickable div menus.
- Avoid `.active` as only route state.

## Motion

- Use one choreographed motion idea per page or surface.
- Motion should clarify state, hierarchy, navigation, affordance, or brand atmosphere.
- Use `--m-td-*` and `--m-tf-*` for timing.
- List transition properties explicitly. Never `transition: all`.
- Prefer `transform` and `opacity`.
- Avoid animating layout-heavy properties unless intrinsic-size animation is needed and degrades safely.
- Use `--i-hov-*`, `--i-foc-*`, `--i-prs-*`, `--i-exp-*` only when state math simplifies CSS.
- Collapse tokenized motion under `prefers-reduced-motion: reduce`.
- Avoid unavoidable parallax, large zooms, scroll-jacking, or long autoplaying movement.

## Accessibility

- Choose correct native element first.
- Add ARIA only when native semantics cannot express behavior.
- Add skip link on multi-region pages.
- Icon-only controls need visible text or `aria-label`.
- Decorative icons and SVGs use `aria-hidden="true"`.
- Informative images need useful `alt`.
- Decorative images use `alt=""` or `aria-hidden="true"`.
- Do not repeat adjacent captions in alt text.
- Focus style uses `:focus-visible`, `--s-bw`, and token-backed color.
- Text and interactive controls meet WCAG AA contrast across default, theme, hover, focus, disabled, muted, and feedback states.
- Color-only feedback is not enough.

## Performance

- Speed is perceived quality.
- Protect first render, interaction latency, scroll smoothness, and readable layout before adding enhancement weight.
- Keep aesthetic weight when it strengthens positioning, trust, desire, product clarity, or conversion.
- Optimize implementation before reducing visual ambition.
- Static sections ship zero runtime by default.
- Add JS only for behavior, data, lifecycle, analytics, or interaction HTML/CSS cannot own cleanly.
- Use native HTML/CSS before custom JS or dependencies: forms, disclosure, focus, scroll, media loading, responsive images, CSS state, CSS animation.
- Use small named functions with explicit init points for site JS.
- No app shell, registry, store, or plugin system unless product UI earns it.
- Return cleanup when lifecycle supports it.
- Guard loops/media with activity or visibility.
- New frontend dependency must beat native platform, existing helper, and small local function.
- Avoid inline styles except documented token escape hatches, e.g. `style="--logo-size: ..."`.
- Media must carry mood, proof, product clarity, or brand texture.
- Images need dimensions; strategic responsive images use `srcset`/`sizes` when useful.
- Above-fold LCP image uses eager load and priority; below-fold media lazy-loads.
- Preload critical font/LCP assets when useful. Use `font-display: swap`.
- Defer non-critical third-party scripts until interaction or visibility earns them.

## Copy

- Project brand source owns voice. Craft gives structure, not personality.
- Buttons and links name action or destination.
- Avoid vague CTAs unless surrounding title supplies context.
- Labels state the field.
- Helper text explains constraints.
- Errors state what happened and how to fix it.
- Status text is short and connected to `aria-live` when state changes without navigation.
- Use `Sending…`, `Message sent.`, `Could not send. Try again.` instead of spinner-only state.

## Anti-patterns

- Generic gradient-blob hero.
- Template section order without content logic.
- Nested `.c`.
- `.c.center` plus `.w.center` in same section.
- Margins on headings/paragraphs to fake rhythm.
- Raw hex in component CSS.
- Literal type weights in craft code.
- `transition: all`.
- `!important` specificity fights.
- Dependencies for static disclosure, tabs, accordion, reveal, carousel, or validation.
- `Learn More` everywhere.
- Removed focus outlines.
- Viewport zoom locks.
- Hidden native input replaced by disconnected div UI.
- JS class choreography for visual state.
- One-off global `--e-*` tokens.
- Unregistered variants, themes, utilities, or private hooks without local reason.

## Machine rule index

## Platform first

ID: platform.platform-first
Status: Must
Triggers: platform, dependency, runtime, browser, native
Use when: Choosing between native/browser capability, scripted behavior, or dependency.
Rule: Use native HTML/CSS/browser capability before custom JS or dependency.
Override: Product behavior native platform cannot express safely.

## Semantic HTML

ID: platform.semantic-html
Status: Must
Triggers: html, accessibility, aria, custom control
Use when: Creating structure or interaction.
Rule: Choose correct semantic element before ARIA or custom accessibility repair.
Override: None for standard controls.

## Small JS

ID: platform.small-js
Status: Default
Triggers: javascript, typescript, interaction, lifecycle
Use when: Adding site JS.
Rule: Use small named init functions, direct DOM boundaries, cleanup when lifecycle supports it, and no app shell/store unless product UI earns it.
Override: Stateful app surfaces with repeated cross-route interactions.

## Extraction rhythm

ID: frontend.extraction-rhythm
Status: Default
Triggers: component, extraction, wrapper, reuse
Use when: Deciding whether to extract markup into a component.
Rule: Keep markup inline until reuse, state, complexity, authoring clarity, or primitive ownership earns extraction.
Override: Starter systems may ship stable primitives for authors.

## Refactor boundary

ID: frontend.refactor-boundary
Status: Default
Triggers: refactor, cleanup, scope
Use when: Cleanup temptation appears during UI work.
Rule: Clean structure only when it directly improves current task safety or quality.
Override: Current structure blocks correct implementation.

## Component boundary

ID: components.extraction-threshold
Status: Must
Triggers: component, boundary, primitive
Use when: Creating or reviewing components.
Rule: Component boundaries must earn themselves through reuse, state, complexity, authoring clarity, or primitive ownership.
Override: None for wrapper-only extraction.

## CSS visual state

ID: components.css-owns-visual-state
Status: Default
Triggers: state, css, javascript, aria
Use when: Styling open, selected, current, checked, invalid, focus, hover, or pressed state.
Rule: JS toggles truthful state; CSS owns derivable visual state through attributes, native state, `:has()`, and tokens.
Override: Complex animation timeline or framework-owned transition with clear reason.

## Focused primitives

ID: components.primitives
Status: Default
Triggers: primitives, wrappers, section, grid, card, button
Use when: Choosing shared UI primitives.
Rule: Prefer focused primitives over wrapper stacks: Section, Grid, Card, Button, Link, Image, form fields.
Override: Product UI library with broader proven interaction needs.

## Semantic selectors

ID: styling.semantic-selectors
Status: Default
Triggers: selector, class, state, css
Use when: Choosing selectors or adding classes.
Rule: Prefer elements, attributes, ARIA/native states, `:has()`, and local structure before adding one-off classes.
Override: Existing coherent library owns class-based state.

## Form labels

ID: forms.labels-first
Status: Must
Triggers: forms, labels, validation, inputs
Use when: Creating or styling forms.
Rule: Use native form semantics, visible labels, readable connected validation, and paste/autofill support.
Override: None for standard forms.

## Semantic baseline

ID: accessibility.semantic-baseline
Status: Must
Triggers: accessibility, semantics, aria, controls
Use when: Creating accessible UI.
Rule: Start from native semantics; add ARIA only when native semantics cannot express behavior.
Override: None.

## Reduced motion

ID: motion.reduced-motion
Status: Must
Triggers: motion, animation, reduced motion, transition
Use when: Adding motion.
Rule: Honor `prefers-reduced-motion`; collapse or remove motion that can cause discomfort.
Override: None for essential UI.

## Verification

- Name which Craft sections informed implementation.
- Run project checks.
- Inspect changed route/component visually when UI changes.
- For token changes, inspect broad component coverage.
- For performance changes, check LCP candidate, media dimensions/priority, CLS risk, and interaction latency.
- For accessibility changes, check keyboard path, focus visibility, names, contrast, and reduced motion.

Style smell greps for produced code:

```sh
rg -n 'transition:\s*all' src
rg -n '!important' src
rg -n 'class="[^"]*__' src
rg -n '#[0-9a-fA-F]{3,8}\b' src/components
rg -n 'style="[^"]*(px|#|rgb)' src
rg -ni '>\s*learn more\s*<' src
rg -n 'class="c[^"]*".*class="c' src
rg -n '\bf-(lg|md|sm)\b' src
rg -n '\bc-[iagcs]\b' src/styles
```
