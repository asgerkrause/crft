---
status: example
canonical: false
use_when: A brand needs distinctive type, accent, radius, and composition while keeping its copied crft source maintainable.
not_for: Minting shared tokens or utilities from one brand, scattering base brand values outside the token owner, or treating art direction as public API.
crft_api: confirmed
---

# Branded extension

Northline Press needs display-led type, signal color, sharp radii, and an asymmetric editorial campaign board.

## Demonstrates

- base brand values owned by copied `styles/tokens.css`;
- root radius recipe and campaign-only accent overrides scoped to `.northline`;
- narrow type-measure overrides through matching role tokens;
- `section > .c.lg`, public grid spans, nested themes, and accent routing;
- project-owned hairlines, index marks, board frame, action presentation, and progressively enhanced issue stagger.

Read [`markup.html`](markup.html) and [`example.css`](example.css).

## Layout intent

The diagram shows editorial hierarchy, not breakpoint authority. CSS owns the actual container thresholds.

```text
Large                         Medium                    Small
┌────────────┬──────────────┐ ┌──────────┬───────────┐ ┌──────────────┐
│ Masthead   │ Folio        │ │ Masthead │ Folio     │ │ Masthead     │
│ + action   │ accent panel │ │          │           │ ├──────────────┤
└────────────┴──────────────┘ └──────────┴───────────┘ │ Folio        │
┌────────┬────────┬─────────┐ ┌──────────┬───────────┐ ├──────────────┤
│Issue 1 │Issue 2 │Issue 3  │ │ Issue 1  │ Issue 2…  │ │ Issues × 3   │
└────────┴────────┴─────────┘ └──────────┴───────────┘ └──────────────┘
```

Source order remains masthead, folio, then issues. Motion does not change that order.

## Decisions

The campaign variation is scoped so it cannot leak into unrelated product chrome. The editorial board remains a project composition. Medium columns are inferred. Licensed fonts and exact brand color specifications are unavailable. Issue entry motion uses `sibling-index()` only inside `@supports` and `prefers-reduced-motion: no-preference`; the default result is static and complete.

## Verify

Render large, medium, and small. Check nested themes and both schemes. Test title wrapping, source order, focus, and solid accent contrast. Confirm base brand values are not scattered through product rules.

```sh
node scripts/check-system.mjs
```

## Limits

Campaign composition, action styling, index marks, webfont loading, and asset pipelines remain project-owned. One campaign does not prove shared crft API.
