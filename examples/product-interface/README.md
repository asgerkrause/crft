---
status: example
canonical: false
use_when: A product screen needs native controls, truthful UI states, and project chrome without promoting buttons or cards into CRFT.
not_for: Building a shared component kit, inventing CRFT form primitives, or styling meaning with color alone.
crft_api: confirmed
---

# Product interface

A workspace-invitations screen with filters, an invite form, and visible loading, empty, error, and success specimens.

## Demonstrates

- native labels, controls, groups, validation, disabled state, and submit behavior;
- `aria-invalid`, `aria-describedby`, `aria-busy`, alerts, and status text;
- `section > [c]` with large and medium filter/form columns;
- semantic skins and success or danger accent routing;
- native form-element selectors plus project-owned action, banner, panel, and state presentation.

Read [`markup.html`](markup.html) and [`example.css`](example.css).

## Layout intent

The diagram shows the task and state relationships. CSS owns the actual container thresholds.

```text
Large / medium                     Small
┌──────────┬────────────────────┐  ┌────────────────────┐
│ Filters  │ Invite form        │  │ Filters            │
└──────────┴────────────────────┘  ├────────────────────┤
┌───────────────────────────────┐  │ Invite form        │
│ Loading specimen              │  ├────────────────────┤
├───────────────────────────────┤  │ Loading            │
│ Empty specimen                │  │ Empty              │
├───────────────────────────────┤  │ Error              │
│ Error specimen                │  │ Success            │
├───────────────────────────────┤  └────────────────────┘
│ Success specimen              │
└───────────────────────────────┘
```

The static specimen shows four separate result sections. A product uses one results region and renders only its current state.

## Decisions

All states remain visible so the example needs no framework runtime. Text and truthful attributes carry meaning before color. The medium layout is inferred. One screen does not prove shared form, button, card, or banner API.

## Verify

Keyboard through filters and form controls. Check labels, groups, error relationships, disabled behavior, status announcements, focus, contrast, long content, and large-medium-small order. Exercise both color schemes.

```sh
node scripts/check-system.mjs
```

## Limits

Async requests, optimistic updates, routing, toast queues, framework components, and product density decisions remain application-owned.
