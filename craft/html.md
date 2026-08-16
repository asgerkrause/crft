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
        <div class="s">
          <h2>Proof</h2>
          <div g="3-2">...</div>
        </div>
      </div>
    </section>
  </main>

  <footer>...</footer>
</body>
```

Use one visible primary `main`. Use `section` for a thematic grouping and give it a useful visible heading when the content has one. A section needs no ID by default.

Add `aria-labelledby` only when the section should become a useful named `region` landmark. Reference its visible heading. Do not turn every page section into a region because excessive landmarks reduce navigation value.

Place `.c` only inside page landmarks. The exact `section > .c` relationship establishes CRFT’s named responsive container. A responsive grid is a descendant of that boundary, not the `.c` element.

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

`styles/layers/base.css` supplies these bounded defaults:

| Area                | Guarantee                                                                                                                                                                                                         |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Box and document    | Border-box sizing, zero default spacing, minimum document height, light/dark color scheme, intrinsic-size interpolation, stable scrollbar gutter, tab size, text-size control, and font smoothing                 |
| Active canvas       | Root, body, document controls, selections, marks, and `[data-skin]` consume active semantic colors                                                                                                                |
| Controls            | Font, color, letter spacing, text transform, native button appearance, square default radius, vertical textarea resize, content-driven textarea field sizing, text selection, and touch manipulation              |
| Media and data      | Responsive images, video, canvas, and SVG; automatic image/video height; visible SVG overflow; collapsed table borders                                                                                            |
| Lists and links     | List markers remain inside, navigation lists remove markers, and links inherit the current color                                                                                                                  |
| Interaction         | Pointer cursors for native interactive labels and controls, visible `:focus-visible`, disabled cursor treatment, target scroll offset, and transparent tap highlight                                              |
| Hidden and disabled | `[hidden]` cannot be overridden by ordinary display rules. Native `disabled` controls receive browser behavior. `[aria-disabled="true"]` receives cursor styling only; application code must enforce its behavior |
| Dialog              | Unconstrained dialog size, inherited color, and semantic dark backdrop                                                                                                                                            |
| Text details        | Strong weight, small text role, subscript and superscript positioning, monospace code elements, code treatment, abbreviation underline metrics, placeholder color, and progress alignment                         |
| Structural defaults | Borderless fieldsets and iframes, clipped horizontal overflow on `main`, and inherited active colors for selection and emphasis                                                                                   |

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
