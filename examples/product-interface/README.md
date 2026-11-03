---
status: example
canonical: false
crft_api: confirmed
---

# Product interface

A sidebar workspace with local search, native validation, draft creation, and selectable loading, empty, and error states.

Open `/examples/product-interface/` in the reference app.
Read [`markup.html`](markup.html) and [`example.css`](example.css).

The application shell uses project-owned CSS grid, semantic navigation, and meaningful main-section IDs.
Native `details` keeps mobile navigation keyboard-operable. Without script, navigation starts expanded.
[`example.js`](example.js) filters fictional records and creates temporary local drafts. It sends no requests or emails.
A keyboard-focusable records region scrolls the table horizontally under narrow widths and text enlargement.
The state selector exposes loading, empty, and error previews; Retry restores local records.
Appearance sets `document.documentElement.style.colorScheme`; System clears the override.
A compact spacing recipe lives on root; descendants inherit its resolved scale. Local final role sizes remain permitted.

## Layout intent

```text
Wide:   Navigation | Workspace
Narrow: Navigation
        Workspace
```

Run `bun run test` and `bun run test:rendered` from `reference/`.
Browser checks cover responsive layout, keyboard operation, content pressure, themes, and reduced motion where applicable.

Stop: Backend integration, real-device behavior, and Firefox/WebKit proof remain outside this example.
Reply: Changed paths, executed checks, rendered evidence, remaining gaps.
