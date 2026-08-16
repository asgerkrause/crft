---
status: example
canonical: false
use_when: Teaching or auditing the minimum durable composition of semantic HTML, public CRFT API, and thin project-owned CSS.
not_for: Treating this specimen as public API, a component kit, or a substitute for canonical source.
crft_api: confirmed
---

# Foundations

A minimal page shell with skip link, navigation, orientation, proof, native FAQ, and footer.

## Demonstrates

- semantic landmarks and purposeful fragment IDs;
- `section > .c` query boundaries;
- `.s`, `g="3-2"`, and small stacked fallback;
- type roles, semantic skins, accent routing, and finite utilities;
- native `details` with progressive enhancement;
- project-owned action and proof-tile presentation.

Read [`markup.html`](markup.html) and [`example.css`](example.css). The CSS intentionally uses only public tokens plus local properties.

## Layout intent

The diagram shows relationships, not breakpoint authority. CSS owns the actual container thresholds.

```text
Large                    Medium                 Small
┌─────────────────────┐  ┌───────────────────┐  ┌─────────────┐
│ Header              │  │ Header            │  │ Header      │
├─────────────────────┤  ├───────────────────┤  ├─────────────┤
│ Orientation         │  │ Orientation       │  │ Orientation │
├──────┬──────┬───────┤  ├─────────┬─────────┤  ├─────────────┤
│ P1   │ P2   │ P3    │  │ P1      │ P2      │  │ Proof 1     │
├──────┴──────┴───────┤  ├─────────┴─────────┤  │ Proof 2     │
│ FAQ                 │  │ P3                │  │ Proof 3     │
├─────────────────────┤  ├───────────────────┤  ├─────────────┤
│ Footer              │  │ FAQ               │  │ FAQ         │
└─────────────────────┘  ├───────────────────┤  ├─────────────┤
                         │ Footer            │  │ Footer      │
                         └───────────────────┘  └─────────────┘
```

Source order is header, orientation, proof, FAQ, then footer at every size.

## Decisions

Header and footer `.c` groups remain intrinsic because they are not section query boundaries. Proof tiles use project CSS because CRFT is not a card system. The FAQ remains useful without animation or JavaScript.

## Verify

Render large, medium, and small. Disable author CSS and confirm the outline remains meaningful. Keyboard through the skip link, navigation, and disclosure. Check focus, contrast, both color schemes, and reduced motion.

```sh
node scripts/check-system.mjs
```

## Limits

Brand, CMS, routing, and framework integration remain project-owned. Tile and action presentation are examples, not shared API.
