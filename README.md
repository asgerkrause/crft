# seess CSS system

A dependency-free CSS foundation for tokens, type, layout, responsive grid, semantic skins, native behavior, progressive features, and a deliberately small utility surface.

## Find the rule

- [Adopt](#adopt)
- [Analyzer tooling](#analyzer-tooling)
- [Use](#use)
- [System decisions](#system-decisions)
- [Files and layers](#files-and-layers)
- [Naming](#naming)
- [Public tokens](#public-tokens)
- [Skins](#skins)
- [Accent routing](#accent-routing)
- [Type](#type)
- [Layout](#layout)
- [Grid grammar](#grid-grammar)
- [Features](#features)
- [Utilities](#utilities)
- [Migration](#migration)
- [Extension](#extension)
- [Verification](#verification)

## Adopt

From this repository, copy the complete system into a new isolated directory:

```sh
node scripts/copy-system.mjs /path/to/project/styles/seess
```

Preview the operation without writing:

```sh
node scripts/copy-system.mjs --dry-run /path/to/project/styles/seess
```

The target must not exist, and its parent directory must already exist and be writable. The command copies the canonical files byte-for-byte and preserves the required structure:

```text
seess/
├── global.css
├── sans.ttf
├── mono.ttf
└── styles/
    ├── base.css
    ├── tokens.css
    ├── type.css
    ├── layout.css
    ├── features.css
    ├── utility.css
    └── project.css
```

Import the copied entrypoint exactly once from the project's actual CSS entrypoint. For example, when that entrypoint and `seess/` share a parent directory:

```css
@import "./seess/global.css";

@layer project {
  /* Product and component rules belong here. */
}
```

Keep adopted system files unchanged. Put product rules in a consumer-owned `project` layer so the copied tree remains a recognizable system snapshot. Version one installs only: it does not merge, overwrite, upgrade, or edit an application entrypoint.

## Analyzer tooling

Run the local Node interface from this checkout. `adopt` requires an explicit absolute target; `audit`, `verify`, and `migrate` require an explicit absolute project root plus root-relative POSIX entrypoint and adoption paths.

```sh
node tooling/seess.mjs adopt --target /absolute/path/to/project/styles/seess --dry-run
node tooling/seess.mjs adopt --target /absolute/path/to/project/styles/seess
node tooling/seess.mjs audit --root /absolute/path/to/project --entrypoint src/entry.css --adoption styles/seess
node tooling/seess.mjs verify --root /absolute/path/to/project --entrypoint src/entry.css --adoption styles/seess
node tooling/seess.mjs migrate --root /absolute/path/to/project --entrypoint src/entry.css --adoption styles/seess
```

Each command emits JSON. `audit`, `verify`, and `migrate` emit a versioned report; `migrate` also emits a plan containing only `inspect`, `verify`, `preserve`, or `escalate` actions. Finding evidence states are `observed`, `inferred`, `unknown`, and `blocked`; classifications are `deterministic`, `heuristic`, `judgment`, and `rendered`.

`audit`, `verify`, and `migrate` are read-only: they do not execute consumer code, rewrite source, delete files, or modify an entrypoint. `adopt` is this interface's sole writing command and copies the system only to its explicit target. Traversal excludes known secret-path sources where possible (`.env*`, `.pem`, `.key`, and SSH paths); report paths additionally replace secret-like components with `[redacted-path]` before output.

Exit `0` means no failing or blocked findings, `1` means one or more failing findings, `2` means invalid input or usage, and `3` means one or more blocked findings. The live analyzer is `0.1.0`. Canonical comparison is the current checkout, not a version-pinned historical source; older adopted snapshots may therefore report drift.

## Use

Start with semantic HTML and compose the public layout API:

```html
<section data-skin="tone">
  <div class="c s">
    <header class="s">
      <p class="t-sm c-mu">System example</p>
      <h2>Meaning before hooks</h2>
    </header>

    <div g="3-2">
      <article class="feature" c="2-1">
        <h3>Shared structure</h3>
        <p>Existing roles handle type, spacing, layout, and color context.</p>
      </article>
      <aside class="feature" data-accent="success">
        <p class="c-ac">Ready</p>
      </aside>
    </div>
  </div>
</section>
```

Add only the product presentation the system does not own:

```css
@layer project {
  .feature {
    padding: var(--p);
    color: var(--c-fg);
    background: var(--c-sf);
    border: var(--b-wd) solid var(--c-bc);
    border-radius: var(--r);
  }
}
```

Values, formulas, breakpoints, skin mappings, and reduced-motion policy belong to CSS. Documentation explains meaning and use; it does not duplicate those declarations.

## System decisions

### Platform before abstraction

**ID:** `system.platform-first`  
**Use when:** Choosing markup, behavior, or a dependency.  
**Decision:** Start with semantic HTML, native CSS, and browser behavior. Add JavaScript only for state or behavior CSS cannot own.  
**Why:** The smallest correct platform solution has fewer failure modes and preserves accessibility.  
**Tradeoff:** Native constraints shape the design.  
**Exception:** Use an existing project abstraction when it is already the safer owner.

### Meaning before hooks

**ID:** `system.semantic-first`  
**Use when:** Choosing selectors or state hooks.  
**Decision:** Prefer elements, attributes, ARIA state, `:has()`, and local structure before adding classes. Classes are durable primitives, not reflexes. Local display hooks compose a base class with a nested qualifier; do not use BEM `__` or `--` names. Local conventions do not create public API.  
**Why:** Markup states what content is and CSS follows that truth.  
**Tradeoff:** Selectors require discipline.  
**Exception:** Repeated structure may earn one short, stable class.

### Native nesting for locality

**ID:** `system.nesting`  
**Use when:** Related selectors share an owner.  
**Decision:** Use native CSS nesting to keep variants, states, children, feature queries, and responsive rules beside their parent. Keep nesting shallow; normally no more than three levels.  
**Why:** A reader finds the complete behavior in one place without reconstructing a DOM tree.  
**Tradeoff:** Deep nesting becomes harder to scan than flat selectors.  
**Exception:** Flatten a selector when nesting obscures the public hook or cascade.

### Physical sizing and positioning

**ID:** `system.physical-geometry`  
**Use when:** Authoring or changing directional CSS.  
**Decision:** Reserve `*-block` and `*-inline` property forms for padding and margin. Use physical sizing, positioning, and edge properties such as `width`, `min-height`, `top`, `right`, `bottom`, `left`, and `border-top`. Existing declarations migrate only when touched.  
**Why:** Geometry remains direct while padding and margin retain concise directional control.  
**Tradeoff:** Writing-mode adaptation is limited to spacing unless a future requirement changes this policy.  
**Exception:** None for new or changed declarations.

### Tokens represent roles

**ID:** `system.token-role`  
**Use when:** Choosing or proposing a value.  
**Decision:** Reuse a public token by semantic job. Keep one-off product values in the project layer. Add a token only when a repeated system role is missing.  
**Why:** Repetition alone does not prove shared meaning.  
**Tradeoff:** A project may retain an intentional local literal.  
**Exception:** None for copied system values or formulas.

### Short names require a stable legend

**ID:** `system.short-names`  
**Use when:** Naming tokens, attributes, or primitives.  
**Decision:** Prefer short names that read clearly after learning one stable grammar. Do not add synonyms, clever abbreviations, or one-off utility names.  
**Why:** Compact daily authoring is valuable only when every name has one owner and meaning.  
**Tradeoff:** New readers need the legend below.  
**Exception:** A longer project-owned name is better than a false shared abstraction.

### Skins establish semantic context

**ID:** `system.skin-context`  
**Use when:** A region needs a different canvas relationship or accent source.  
**Decision:** Use `data-skin` to remap canvas roles and `data-accent` to route the accent family without painting the boundary.  
**Why:** Each cascade boundary changes one semantic relationship without recoloring individual descendants.  
**Tradeoff:** Local exceptions and nested resets must remain deliberate.  
**Exception:** A product-specific palette remains in the project layer. `data-theme` is not part of this system.

### Grid attributes express intent

**ID:** `system.grid-intent`  
**Use when:** Building responsive columns, spans, or deliberate visual order.  
**Decision:** Use `g`, `c`, `r`, and `o` instead of layout-class chains. Reason in large, medium, and small states resolved from the nearest `section > .c` query boundary.  
**Why:** Responsive intent remains visible in compact markup and follows available content width rather than the viewport.  
**Tradeoff:** Authors must learn one positional grammar.  
**Exception:** A genuinely unique composition may stay project-owned.

### Native fallback is complete behavior

**ID:** `system.progressive`  
**Use when:** Adding a browser feature or motion.  
**Decision:** Gate optional enhancements and preserve useful native behavior when unsupported or when reduced motion is requested.  
**Why:** Enhancement must not become a requirement for understanding or operating content.  
**Tradeoff:** Different browsers may receive different polish.  
**Exception:** None for accessibility-critical behavior.

### Shared API must earn admission

**ID:** `system.admission`  
**Use when:** Proposing a token, utility, selector, or attribute.  
**Decision:** Admit it only when existing API cannot express the role, unrelated consumers need it, one file clearly owns it, and behavior can be documented and verified.  
**Why:** A small strong system is easier to learn than a permissive utility catalog.  
**Tradeoff:** Some useful rules remain local until repetition proves them.  
**Exception:** Accessibility or correctness fixes may establish a shared rule immediately.

## Files and layers

`global.css` declares the order and imports one file per public layer:

| Layer | File | Owns |
| --- | --- | --- |
| `base` | `styles/base.css` | Reset, document settings, native element defaults, form inheritance, focus, and active document colors |
| `tokens` | `styles/tokens.css` | Public values, formulas, semantic colors, skins, responsive scales, and reduced-motion policy |
| `type` | `styles/type.css` | Bundled font faces plus body, text, display, and heading roles |
| `layout` | `styles/layout.css` | Structural spacing, named query containers, stacks, and grid grammar |
| `features` | `styles/features.css` | Progressive disclosure, corner-shape, and scroll-motion enhancements |
| `utility` | `styles/utility.css` | Finite screen-reader, color, weight, and text-transform utilities |
| `project` | `styles/project.css` | Canonical-repository product or site rules that intentionally extend the system |

The order is:

```css
@layer base, tokens, type, layout, features, utility, project;
```

A rule belongs in the first file whose stated job fully explains it. The project layer is an extension seam, not permission to rewrite shared semantics.

## Naming

Prefixes identify domains:

- `h`: header
- `l`: layout
- `s`: spacing
- `g`: gap
- `p`: padding
- `r`: radius
- `b`: border
- `f`: font
- `w`: weight
- `c`: color
- `t`: type
- `m`: motion

Common suffixes:

- `sc`: scale control
- `ba`: base
- `xs`, `sm`, `lg`, `xl`: scale members
- `cw`: content width
- `bl`: block boundary
- `sw`: color swatch
- `ac`, `sc`, `tr`: accent, secondary, tertiary
- `su`, `wn`, `dn`: success, warning, danger
- `bg`, `fg`, `sf`, `bc`, `mu`: background, foreground, surface, border color, muted
- `fs`, `lh`, `ls`, `fw`, `tt`: font size, line height, letter spacing, weight, transform
- `tf`, `td`: timing function and duration

Preserve established abbreviations and hyphenation. Do not create aliases.

## Public tokens

The public catalog below lists every token declared in `styles/tokens.css`. Each name is a stable, searchable API identifier; its declaration value and derivation remain owned by the source file. Consume tokens with `var()`.

### Header and layout tokens

| Token | Meaning |
| --- | --- |
| `--h-h` | Header sizing token |
| `--l-cw` | Default content-container width |
| `--l-cw-sm` | Narrow content-container width |
| `--l-cw-lg` | Wide content-container width |
| `--l-bl-h` | Horizontal block/layout inset |
| `--l-bl-v` | Vertical block/layout spacing |

### Spacing scale tokens

| Token | Meaning |
| --- | --- |
| `--s-sc` | Spacing scale control |
| `--s-ba` | Spacing base |
| `--s-xs` | Extra-small spacing member |
| `--s-sm` | Small spacing member |
| `--s` | Base spacing member |
| `--s-lg` | Large spacing member |
| `--s-xl` | Extra-large spacing member |

Use spacing for separation between major layout units and stack groups.

### Gap scale tokens

| Token | Meaning |
| --- | --- |
| `--g-sc` | Gap scale control |
| `--g-ba` | Gap base |
| `--g-xs` | Extra-small gap member |
| `--g-sm` | Small gap member |
| `--g` | Base gap member |
| `--g-lg` | Large gap member |
| `--g-xl` | Extra-large gap member |

Use gap for compact flex and grid relationships.

### Padding scale tokens

| Token | Meaning |
| --- | --- |
| `--p-sc` | Padding scale control |
| `--p-ba` | Padding base |
| `--p-xs` | Extra-small padding member |
| `--p-sm` | Small padding member |
| `--p` | Base padding member |
| `--p-lg` | Large padding member |
| `--p-xl` | Extra-large padding member |

### Radius tokens

| Token | Meaning |
| --- | --- |
| `--r-sc` | Radius scale control |
| `--r-ba` | Radius base |
| `--r-xs` | Extra-small radius member |
| `--r-sm` | Small radius member |
| `--r` | Base radius member |
| `--r-lg` | Large radius member |
| `--r-xl` | Extra-large radius member |

Fully round geometry is local presentation, not a system token.

### Border, font, and weight tokens

| Token | Meaning |
| --- | --- |
| `--b-wd` | Shared border-width token |
| `--f-sa` | Sans-serif font stack |
| `--f-se` | Serif font stack |
| `--f-mo` | Monospace font stack |
| `--f-bd` | Body font role |
| `--f-dp` | Display font role |
| `--w-lt` | Light weight role |
| `--w-rg` | Regular weight role |
| `--w-bd` | Bold weight role |

Use body and display font roles even when they currently share a family.

### Color swatch tokens

| Token | Meaning |
| --- | --- |
| `--c-sw-red` | Red palette swatch |
| `--c-sw-ora` | Orange palette swatch |
| `--c-sw-yel` | Yellow palette swatch |
| `--c-sw-lim` | Lime palette swatch |
| `--c-sw-gre` | Green palette swatch |
| `--c-sw-cya` | Cyan palette swatch |
| `--c-sw-sky` | Sky palette swatch |
| `--c-sw-blu` | Blue palette swatch |
| `--c-sw-pur` | Purple palette swatch |
| `--c-sw-pin` | Pink palette swatch |
| `--c-sw-mag` | Magenta palette swatch |
| `--c-sw-li` | Fixed light swatch |
| `--c-sw-da` | Fixed dark swatch |

Swatches define the palette. Product rules normally consume semantic colors instead.

### Semantic color tokens

| Token | Meaning |
| --- | --- |
| `--c-ac` | Active accent semantic color |
| `--c-sc` | Secondary semantic color |
| `--c-tr` | Tertiary semantic color |
| `--c-ac-co` | Contrast text on a solid accent fill |
| `--c-sc-co` | Contrast text on a solid secondary fill |
| `--c-tr-co` | Contrast text on a solid tertiary fill |
| `--c-ac-bg` | Accent-tinted background |
| `--c-sc-bg` | Secondary-tinted background |
| `--c-tr-bg` | Tertiary-tinted background |
| `--c-ac-fg` | Accent foreground on its tinted background |
| `--c-sc-fg` | Secondary foreground on its tinted background |
| `--c-tr-fg` | Tertiary foreground on its tinted background |
| `--c-ac-bc` | Accent-tinted border color |
| `--c-sc-bc` | Secondary-tinted border color |
| `--c-tr-bc` | Tertiary-tinted border color |
| `--c-su` | Success semantic color |
| `--c-wn` | Warning semantic color |
| `--c-dn` | Danger semantic color |
| `--c-su-fg` | Foreground paired with success |
| `--c-wn-fg` | Foreground paired with warning |
| `--c-dn-fg` | Foreground paired with danger |
| `--c-bg-base` | Scheme background anchor |
| `--c-fg-base` | Scheme foreground anchor |
| `--c-bg` | Active background role |
| `--c-fg` | Active foreground role |
| `--c-sf` | Active surface role |
| `--c-bc` | Active border-color role |
| `--c-mu` | Active muted-content role |

Use `--c-*-co` for text on the matching solid `--c-*` fill. Use the `--c-*-bg`, `--c-*-fg`, and `--c-*-bc` family together for tinted surfaces, text, and borders. Status colors retain their paired foreground tokens for solid fills. Override `--c-ac` and `--c-ac-co` together when establishing a project accent.

### Type scale controls

| Token | Meaning |
| --- | --- |
| `--t-sc` | Type scale control |
| `--t-ba` | Type base |

### Display and heading role tokens

Each role exposes size, line height, letter spacing, weight, text transform, and maximum readable measure.

| Role | Size | Line height | Letter spacing | Weight | Text transform | Max width |
| --- | --- | --- | --- | --- | --- | --- |
| Display | `--t-hd-fs` | `--t-hd-lh` | `--t-hd-ls` | `--t-hd-fw` | `--t-hd-tt` | `--t-hd-mw` |
| Heading one | `--t-h1-fs` | `--t-h1-lh` | `--t-h1-ls` | `--t-h1-fw` | `--t-h1-tt` | `--t-h1-mw` |
| Heading two | `--t-h2-fs` | `--t-h2-lh` | `--t-h2-ls` | `--t-h2-fw` | `--t-h2-tt` | `--t-h2-mw` |
| Heading three | `--t-h3-fs` | `--t-h3-lh` | `--t-h3-ls` | `--t-h3-fw` | `--t-h3-tt` | `--t-h3-mw` |
| Heading four | `--t-h4-fs` | `--t-h4-lh` | `--t-h4-ls` | `--t-h4-fw` | `--t-h4-tt` | `--t-h4-mw` |
| Heading five | `--t-h5-fs` | `--t-h5-lh` | `--t-h5-ls` | `--t-h5-fw` | `--t-h5-tt` | `--t-h5-mw` |
| Heading six | `--t-h6-fs` | `--t-h6-lh` | `--t-h6-ls` | `--t-h6-fw` | `--t-h6-tt` | `--t-h6-mw` |

### Text role tokens

| Role | Size | Line height | Letter spacing | Weight | Text transform | Max width |
| --- | --- | --- | --- | --- | --- | --- |
| Large text | `--t-lg-fs` | `--t-lg-lh` | `--t-lg-ls` | `--t-lg-fw` | `--t-lg-tt` | `--t-lg-mw` |
| Body text | `--t-bd-fs` | `--t-bd-lh` | `--t-bd-ls` | `--t-bd-fw` | `--t-bd-tt` | `--t-bd-mw` |
| Small text | `--t-sm-fs` | `--t-sm-lh` | `--t-sm-ls` | `--t-sm-fw` | `--t-sm-tt` | `--t-sm-mw` |

All ten roles default to `70ch`. Let the role own text measure: do not set `max-width` directly on headings or text-role elements. When a real composition requires a different measure, override the matching `--t-*-mw` token at the narrowest semantic boundary instead of replacing the property.

### Motion tokens

| Token | Meaning |
| --- | --- |
| `--m-tf-i` | Ease-in timing function |
| `--m-tf-o` | Ease-out timing function |
| `--m-tf-io` | Ease-in-out timing function |
| `--m-tf-g` | Glide timing function |
| `--m-tf-s` | Spring timing function |
| `--m-td-sf` | Shortest duration role |
| `--m-td-f` | Fast duration role |
| `--m-td` | Default duration role |
| `--m-td-s` | Slow duration role |
| `--m-td-ss` | Slowest duration role |

Motion roles resolve through the reduced-motion policy when requested.

## Internal properties

These properties are implementation state, not tokens or consumer override hooks:

- `--l-gc`
- `--l-cs`
- `--l-rs`
- `--or`
- `--m-src-to`
- `--m-src-fr`
- `--m-plx`

Use the public attributes that own them. Never set them in product CSS.

## Skins

Apply `data-skin` to the semantic boundary that should establish a color context:

| Value | Role |
| --- | --- |
| Empty `data-skin` | Re-establish the base semantic context |
| `invert` | Swap base foreground and background roles |
| `accent` | Establish an accent-tinted context |
| `secondary` | Establish a secondary-tinted context |
| `tertiary` | Establish a tertiary-tinted context |
| `tone` | Establish a restrained tonal context |

```html
<section data-skin="accent">
  <div class="c">...</div>
</section>
```

Descendants consume `--c-bg`, `--c-fg`, `--c-sf`, `--c-bc`, and `--c-mu`. Nested skins intentionally establish a new semantic boundary. Use `data-skin`; do not introduce `data-theme`.

## Accent routing

Use `data-accent` when a boundary should change which semantic family supplies `--c-ac`, `--c-ac-co`, `--c-ac-bg`, `--c-ac-fg`, and `--c-ac-bc` without changing the canvas:

| Value | Accent source |
| --- | --- |
| `secondary` | Route the secondary family through accent roles |
| `tertiary` | Route the tertiary family through accent roles |
| `success` | Route success through accent roles |
| `warning` | Route warning through accent roles |
| `danger` | Route danger through accent roles |

```html
<section data-accent="success">
  <p class="notice">Changes saved.</p>
</section>
```

Supported explicit routes: `secondary`, `tertiary`, `success`, `warning`, and `danger`; omit `data-accent` for the default accent.

`data-accent` routes tokens only; it does not paint the boundary. Product rules decide where to apply the routed roles:

```css
.notice {
  color: var(--c-ac-fg);
  background: var(--c-ac-bg);
  border-color: var(--c-ac-bc);
}
```

Use `data-skin` for canvas context and `data-accent` for accent routing. Feedback meaning still comes from content and appropriate native or ARIA semantics; color alone is insufficient. Palette swatches are not `data-accent` values because they do not define verified solid-contrast pairs.

## Type

Semantic heading elements establish document structure. Class aliases change visual role without changing semantics:

- `.hd`
- `.h1` through `.h6`
- `.t-bd`
- `.t-lg`
- `.t-sm`

Prefer the correct heading element. Use an alias only when visual and semantic levels intentionally differ.

`styles/type.css` owns the bundled `sans.ttf` and `mono.ttf` `@font-face` registrations. The registered `font-weight` range drives the variable `wght` axis through normal CSS weight selection; `font-variation-settings` is intentionally not used.

## Layout

### Container

- `.c`: default content boundary
- `.c.sm`: narrower boundary
- `.c.lg`: wider boundary

Page layout uses `section > .c`, with stacks, grids, and project composition inside that boundary. This exact structure establishes the named inline-size query container `container`; applying containment to every `.c` would break intrinsic uses such as header groups. The structural selector and query name are separate fixed parts of the public contract; renaming either requires changing the shared implementation and every matching query.

### Stack

- `.s`: vertical stack
- `.s.h`: horizontal stack
- `.s.w`: wrapping stack
- `.s.center`: cross-axis centering
- `.s.sb`: space-between distribution

Compose modifiers only when each one states real layout intent.

## Grid grammar

Grid markup has three states in this order: **large, medium, small**. They resolve from the inline size of the nearest ancestor matching `section > .c`, whose public query name is `container`; breakpoint declarations remain owned by `styles/layout.css`.

A responsive grid must be inside that boundary and must not compose `class="c"` and `g` on the same element, because a container cannot query itself. Without an ancestor `section > .c`, `[g]` keeps the useful small-state flex-column fallback.

```html
<section>
  <div class="c">
    <div g="4-2">...</div>
  </div>
</section>
```

### Parent columns: `g`

- `g` with no value uses the default column count on large and medium.
- `g="N"` uses the same column count on large and medium.
- `g="L-M"` uses the first number on large and the second on medium.
- Supported column counts are `1` through `12`.
- Every grid becomes a flex column on small.

```html
<div g="8-4">
  <article>...</article>
</div>
```

Meaning: eight columns large, four columns medium, flex column small.

### Child column span: `c`

Direct children span one column by default. Add `c` only when the default is wrong:

```html
<div g="8-4">
  <article c="4-2">Featured</article>
  <article>Default span</article>
</div>
```

- `c="N"`: same span large and medium.
- `c="L-M"`: separate large and medium spans.
- Each position accepts `1` through `12`, or `0` for a full row.
- `c="0"`: full row on large and medium.
- `c="0-N"` or `c="N-0"`: full row only in the corresponding large or medium position.
- Omit `c` for the default one-column span; an empty `c` is not public authoring grammar.
- Small flex-column layout makes column span inactive.

### Child row span: `r`

`r` uses the same one-number or `large-medium` grammar. Supported row spans are `1` through `4`. Omit `r` for the default one-row span; an empty `r` is not public authoring grammar. Use it rarely and only when content height is controlled. Small flex-column layout makes row span inactive.

### Child visual order: `o`

Order uses three positional letters: `large-medium-small`.

- `f`: first
- `a`: automatic source order
- `l`: last

```html
<article o="f-a-l">...</article>
```

Meaning: first large, automatic medium, last small. Always author all three positions as `o="L-M-S"`; shorter forms are not public authoring grammar.

Visual order never changes DOM, reading, or keyboard order. Source order must remain meaningful without CSS.

### Special parent modes

- `g="a"`: general auto-fit grid
- `g="a-sm"`: compact auto-fit grid
- `g="a-lg"`: spacious auto-fit grid
- `g="sg"`: subgrid alignment from medium upward

All modes use the small flex-column fallback. Attributes apply placement only to direct children. Malformed and out-of-range values are outside the public API; their partial CSS matches are intentionally unspecified.

## Features

`styles/features.css` contains progressive behavior, not components:

- Native `details` disclosure animation when supported.
- Optional `corner-shape` enhancement for existing controls and hooks.
- `.img-w[data-scrub]` image movement when view timelines are supported and motion is allowed.

```html
<div class="img-w" data-scrub>
  <img src="image.jpg" alt="">
</div>

<div class="img-w" data-scrub="reverse">
  <img src="image.jpg" alt="">
</div>
```

Bare `data-scrub` uses the default direction. `data-scrub="reverse"` inverts that movement. The attribute exposes no consumer styling state; its runtime properties remain private. `.btn` and `.card` are enhancement targets only. They are not component implementations.

## Utilities

The public utility surface is finite:

| Purpose | Selectors |
| --- | --- |
| Screen-reader content | `.sr`, `.sr.focusable` |
| Semantic color | `.c-fg`, `.c-mu`, `.c-ac`, `.c-sc` |
| Font family | `.f-sa`, `.f-se`, `.f-mo`, `.f-bd`, `.f-dp` |
| Weight | `.w-lt`, `.w-rg`, `.w-bd` |
| Text transform | `.tt-uc`, `.tt-lc`, `.tt-no`, `.tt-cp` |

Do not add arbitrary-value utilities, responsive utility variants, aliases, or utilities backed by internal properties.

## Base guarantees

`styles/base.css` preserves:

- predictable box sizing and margins;
- inherited form typography and color;
- visible keyboard focus;
- native hidden and disabled behavior;
- responsive media defaults;
- readable lists, tables, code, abbreviations, and scripts;
- dialog backdrop, selection, target scrolling, and placeholder behavior;
- active document and skin colors.

Use the correct native element before adding ARIA or rebuilding browser behavior.

## Migration

Adopt the system without deleting existing CSS, then migrate one complete user-visible slice at a time. A slice includes its semantic markup, default presentation, responsive behavior, interaction states, accessibility, and reduced-motion path where applicable.

Inventory the existing reset, tokens, type roles, layout, utilities, component rules, breakpoints, and state hooks. Classify each rule before changing it:

| Classification | Action |
| --- | --- |
| Native behavior | Remove the custom rule only after the native result is verified |
| Existing seess API | Replace it with the matching public role, selector, or attribute |
| Product or component detail | Keep one direct rule in the consumer-owned `project` layer |
| Possible shared-system gap | Preserve the local rule until repeated use passes the admission criteria |

Map by semantic role rather than similar names or literal values. Preserve source order, behavior, and every applicable state. Search all consumers before deleting old selectors, variables, files, or generated CSS. A migration is complete only after static checks and rendered verification at large, medium, and small states.

## Extension

In this canonical repository, `styles/project.css` owns product or site extensions and may be edited. An adopted tree is a byte-identical snapshot: consumers must leave its copied `styles/project.css` unchanged and put product or component rules outside that tree in a consumer-owned `@layer project`.

Use this order:

1. Native semantic HTML.
2. Existing public selector or attribute.
3. Public token in a project rule.
4. Intentional scoped token override.
5. One direct project-specific rule.
6. Shared API proposal only after admission criteria pass.

Do not force a product-specific detail into the shared system.

## Browser policy

Cascade layers, custom properties, native nesting, named inline-size container queries, logical properties, `:has()`, `light-dark()`, `color-mix()`, and `pow()` are baseline system features. Subgrid, animated disclosure content, corner shape, and scroll-linked motion are progressive enhancements with useful fallbacks.

## Verification

### Deterministic

Run:

```sh
node scripts/check-system.mjs
```

This verifies the canonical static source contract only. A pass confirms that CSS, the public token catalog, ownership documentation, and the adoption manifest agree.

Verify the isolated Astro reference separately:

```sh
cd reference && bun run test
```

This confirms that the reference builds and contains the required public specimens without exposing private implementation state. Neither check proves rendered browser behavior.

### Judgment

For every public change, confirm:

- the first matching layer still owns the behavior;
- shared API admission criteria are met;
- internal properties remain absent from consumer examples;
- no product component or arbitrary utility was added accidentally.

### Rendered

Verify browser behavior independently:

- Grid behavior matches large, medium, and small container semantics inside `section > .c.sm`, `section > .c`, `section > .c.lg`, and nested `section > .c` boundaries; grids without that structure remain stacked.
- Every semantic and aliased type role resolves to its matching `70ch` maximum-width token while `body` remains unconstrained.
- Skins work in both color schemes and nested contexts.
- Keyboard focus, native controls, screen-reader recovery, and source order remain valid.
- Reduced-motion and unsupported feature paths remain complete.
