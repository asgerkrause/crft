---
title: CRFT HTML
status: canonical
owner: html
read_when: Structuring landmarks, sections, source order, navigation, state, native elements, selectors, or JavaScript behavior.
---

# HTML

Use native HTML for meaning and behavior. Add ARIA only where native semantics end. The document must remain understandable without CSS.

## Page shape

```html
<body>
  <header>
    <nav aria-label="Primary">
      <ul>
        <!-- or <menu> -->
        <li><a href="/" aria-current="page">Home</a></li>
        <li><a href="/about">About</a></li>
      </ul>
    </nav>
  </header>

  <main>
    <section>
      <div class="c">
        <h1>Proof</h1>
        <p>Evidence that supports the page's claim.</p>
      </div>
    </section>
  </main>

  <footer>...</footer>
</body>
```

## Landmarks and regions

Page landmarks identify document areas for navigation: the page `header` is a `banner`, `nav` is `navigation`, `main` is `main`, and the page `footer` is `contentinfo`. A `header` or `footer` inside an `article` or `section` describes that local content; it is not the page banner or contentinfo landmark.

Use one visible primary `main`. Use `section` for a thematic grouping and give it a useful visible heading when the content has one. A section needs no ID by default. Do not put a class on `section`. Section identity is `id` when it has a fragment, native or ARIA relationship, behavior, integration, or stable external identity job. `data-skin` and `data-accent` remain canvas hooks.

Add `aria-labelledby` only when the section should become a useful named `region` landmark. Reference its visible heading. Do not turn every page section into a region because excessive landmarks reduce navigation value.

```html
<section aria-labelledby="evidence-title">
  <h2 id="evidence-title">Evidence</h2>
  <p>Results worth finding through region navigation.</p>
</section>
```

The heading ID above serves the ARIA relationship. Add an ID to the section itself only if it has its own job, such as a fragment link. Without an accessible name, a section does not become a `region` landmark merely because it has a heading or ID.

Containers (`.c`), stacks (`.s`), and grids (`[g]`) are layout roles. They create no ARIA landmark or region semantics. A generic `div` with one of these hooks remains generic; an `article` with `.s` keeps its article semantics. Choose the element for meaning, then apply the layout role where allowed.

[`layout.md`](layout.md) owns placement, nesting, spacing, alignment, and the exact `section > .c` query boundary. [`grid.md`](grid.md) owns responsive attributes and a complete nested stack/grid example.

## Element and selector ownership

- Links navigate. Buttons perform actions or change state.
- Lists represent sets or sequences. Tables represent tabular relationships.
- `figure` and `figcaption` bind media to its caption.
- `details` and `summary` own native disclosure.
- `dialog` owns modal or non-modal dialog semantics when supported by the product behavior.
- Native controls, labels, fieldsets, legends, and submit buttons own forms.
- Elements own semantics and safe defaults.
- Classes own stable components, page scopes, behavior, or visual roles that semantic elements, native attributes, public CRFT hooks, and bounded structure cannot safely own.
- IDs own fragments, native label relations, ARIA ID references, behavior, integration, or stable external identity. Every ID is unique and non-empty. Do not style through IDs.
- Native and ARIA attributes own truthful state.
- `data-*` owns application data, behavior, or a documented CRFT boundary.

Prefer semantic attributes, ARIA state, `:has()`, and bounded local structure before classes. Do not replace a useful class with a deep, positional, or content-dependent selector. Remove wrappers without semantic, layout, query, state, behavior, or integration ownership.

A skip link justifies a target ID on `main`. An explicit `label[for]` justifies its control ID. `aria-labelledby` and `aria-describedby` justify IDs on their referenced elements. An unused heading or section ID does not become useful because it may be needed later.

## Native base guarantees

`styles/crft.css` owns `@layer reset` then `@layer base`. Reset only neutralizes the user agent and consumes no tokens. Base supplies native defaults that may use public tokens.

Reset:

| Area | Guarantee |
| --- | --- |
| Box | Border-box sizing, zero default spacing, and `min-width: 0` |
| Document quirks | No text-size adjustment and a transparent tap highlight |
| Control strip | Inherited font, color, letter spacing, and line height; zero control radius; no forced text transform on `button` and `select`; restored selection on `input` and `textarea`; vertical textarea resize |
| Media and data | Block images, video, canvas, and SVG; automatic image and video height; visible SVG overflow; collapsed table borders |
| Structural strip | Borderless fieldsets and iframes, subscript and superscript positioning, progress alignment, unconstrained dialog size, and `[hidden]` that ordinary display rules cannot override, except `hidden="until-found"`, which stays searchable |

Base:

| Area | Guarantee |
| --- | --- |
| Document | Minimum document height, light/dark color scheme, intrinsic-size interpolation, pretty wrapping, stable scrollbar gutter, thin semantic scrollbars, no overscroll, tab size, hanging punctuation, and font smoothing |
| Active canvas | Root, body, document controls, selections, marks, and `[data-skin]` consume active semantic colors |
| Controls | Native button appearance, start-aligned control text, no hanging punctuation on controls, no text selection on `button`, minimal field and button chrome, invalid border color, muted disabled text, content-driven textarea field sizing, and touch manipulation |
| Lists and links | List markers sit outside with start padding, navigation lists remove markers and padding, links inherit color with no underline, `a` `button` and `label` use the public motion roles for color, surface, and `font-weight` transitions, and `aria-current="page"` is visible without color alone |
| Interaction | Pointer cursors for native interactive labels and controls, visible `:focus-visible`, disabled cursor treatment, and target scroll offset |
| Hidden and disabled | Native `disabled` controls receive browser behavior. `[aria-disabled="true"]` receives cursor styling only; application code must enforce its behavior |
| Dialog | Inherited color and a semantic dark backdrop |
| Disclosure | Native `details` remains operable. When `::details-content` is supported, closed content animates with motion roles |
| Text details | Strong weight, small text role, monospace code elements, code treatment, abbreviation underline metrics, and placeholder color |

Page-landmark overflow and view-transition names belong to [`layout.md`](layout.md).

Unsupported properties are ignored by the browser while the native element remains usable. These rules improve a correct element. They do not make an incorrect element semantic or accessible.

## Order and state

DOM order owns reading, heading, and keyboard order. CRFT’s `o` attribute changes presentation only.

Keep state in HTML:

- `aria-current="page"` for the current route;
- `open` for `details` and `dialog`;
- `checked`, `disabled`, `required`, and native validity for controls;
- `aria-expanded` for a custom disclosure trigger;
- `aria-selected` with `hidden` for real tabs;
- `aria-invalid` with connected explanatory text for exposed validation;
- `aria-busy` for a region that is updating.

CSS reads truthful state. JavaScript synchronizes behavior. Visible or announced text explains results that color or motion cannot.

## Navigation and overlays

Navigation uses labelled `nav`, real links, and `aria-current`. An overlay menu closes with Escape, restores focus when appropriate, prevents covered-background interaction, and avoids layout jumps.

A custom widget must implement its complete keyboard, focus, accessible name, state, and announcement contract. Prefer a native element when it supplies the required behavior.

## JavaScript boundary

JavaScript owns behavior, data, lifecycle, analytics, and integration that HTML and CSS cannot own cleanly. Use small named functions with explicit setup and teardown.

Do not use JavaScript for responsive layout, derivable visual state, static sections, or native behavior without a product requirement.

## Common mistakes

- An ID with no fragment, relationship, behavior, integration, or stable identity job.
- `aria-labelledby` on every section, which creates unnecessary region landmarks.
- `aria-label` or `aria-labelledby` on a generic wrapper that cannot use an author-provided name.
- `g` placed on the same element as the section `.c` boundary.
- A clickable `div` replacing a link or button.
- ARIA state that disagrees with visible or application state.
- CSS visual order used to repair source order.
- JavaScript used to add a class CSS can derive from a native attribute.

## Verify

Disable author CSS and confirm landmarks, headings, section sequence, links, controls, and results remain meaningful. Confirm unique purposeful IDs, valid fragments and ID references, intentional region names, state, source order, navigation, wrapper ownership, grid boundaries, and JavaScript ownership. Apply the keyboard and assistive-technology gates in [`accessibility.md`](accessibility.md).
