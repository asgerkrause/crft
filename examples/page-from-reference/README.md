---
status: example
canonical: false
use_when: A screenshot, URL, or Figma export must drive a page slice without false fidelity claims.
not_for: Greenfield strategy with no visual source, or inventing shared components from one mock.
crft_api: confirmed
---

# Page from reference

Input: large and small captures of an editorial hero. The large view places narrow copy beside media. The small view stacks copy before media. Medium layout, exact type metrics, and motion are unavailable.

## Demonstrates

- observed, inferred, and unknown claims kept separate;
- copy-first DOM and keyboard order;
- `section > .c` with `g="12-6"` and project-owned spans;
- local image ratio, crop, focal position, and action presentation;
- optional public image scrub with a complete static and reduced-motion result.

Read [`markup.html`](markup.html) and [`example.css`](example.css).

## Layout intent

The diagram separates observed edge states from the inferred middle state. CSS owns the actual container thresholds.

```text
Observed large          Inferred medium       Observed small
┌─────────┬───────────┐ ┌────────┬──────────┐ ┌──────────────┐
│ Copy    │ Media     │ │ Copy   │ Media    │ │ Copy         │
│ + action│ + scrub   │ │        │ + scrub │ ├──────────────┤
└─────────┴───────────┘ └────────┴──────────┘ │ Media        │
                                             └──────────────┘
```

Copy precedes media in the DOM and keyboard path at every size.

## Decisions

Large asymmetry and small copy-first order come from supplied captures. Medium columns are inferred. The crop is a local rule, not a token. Image scrub is an intentional progressive departure because the supplied reference contains no motion evidence. Unsupported and reduced-motion paths retain the complete static image.

## Verify

Compare only against supplied viewports and states. Render the inferred medium state without calling it observed. Disable CSS and confirm copy, action, and image order. Check keyboard focus, contrast, image meaning, and both schemes.

```sh
node scripts/check-system.mjs
```

## Limits

Exact font files, medium composition, source motion, and interaction styling remain unknown. Do not claim pixel fidelity beyond inspected evidence.
