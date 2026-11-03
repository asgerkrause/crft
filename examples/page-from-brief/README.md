---
status: example
canonical: false
use_when: A written product brief must drive a full page without a visual reference.
not_for: Pixel-matching a screenshot or promoting brief-specific presentation into crft.
crft_api: confirmed
---

# Page from brief

Brief:

> Help a skeptical technical lead decide to copy crft for one marketing site. Lead with “structure without a component tax,” one primary action, ownership proof, and clear non-goals.

## Demonstrates

- strategy translated into section jobs and source order;
- one thesis and primary action group;
- an ownership ladder, proof claims, refusal strip, FAQ, and closing action;
- `section > .c`, public grid and type roles, `tone` and `invert` themes;
- project-owned action and editorial presentation.

Read [`markup.html`](markup.html) and [`example.css`](example.css).

## Layout intent

The diagram records the brief-driven hierarchy. CSS owns the actual container thresholds.

```text
Large                         Medium                    Small
┌──────────────┬───────────┐  ┌──────────────────────┐  ┌──────────────┐
│ Thesis       │ Ownership │  │ Thesis               │  │ Thesis       │
│ + action     │ ladder    │  ├──────────────────────┤  ├──────────────┤
├──────┬───────┴──┬────────┤  │ Ownership ladder     │  │ Ownership    │
│ P1   │ P2       │ P3     │  ├──────────┬───────────┤  ├──────────────┤
├──────┴──────────┴────────┤  │ P1       │ P2        │  │ Proof 1     │
│ Refusal                  │  ├──────────┴───────────┤  │ Proof 2     │
│ FAQ                      │  │ P3                   │  │ Proof 3     │
│ Closing action           │  ├──────────────────────┤  ├──────────────┤
└──────────────────────────┘  │ Refusal · FAQ · action│  │ Refusal      │
                              └──────────────────────┘  │ FAQ · action │
                                                        └──────────────┘
```

The DOM keeps thesis, ownership, proof, refusal, FAQ, and conversion in that order.

## Decisions

The page order is orientation, ownership, proof, refusal, risk reduction, and conversion. The medium proof layout is inferred because the brief provides no medium evidence. Motion is omitted because the brief does not specify it.

## Verify

Without CSS, confirm the thesis, action, proof, and refusals remain clear. Render large, medium, and small. Check source and focus order, native FAQ behavior, contrast, and both schemes. Keep inferred layout distinct from supplied product facts.

```sh
node scripts/check-system.mjs
```

## Limits

URLs, analytics, consent, localization, CMS mapping, and brand media remain project-owned. No shared marketing-section API is proved by this page.
