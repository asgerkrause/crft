---
title: CRFT forms and product states
status: canonical
owner: forms
read_when: Building forms, validation, async actions, status, errors, empty states, or recovery paths.
---

# Forms and product states

Use native controls and truthful HTML state. This file records sound form semantics, state implementation, and recovery constraints. The product owns its workflow, required states, language, and acceptance.

## Field contract

Every field needs:

- a persistent visible label;
- a useful `name`;
- the correct native element and `type`;
- applicable `autocomplete` and `inputmode`;
- connected helper or error text;
- preserved paste, autofill, selection, and native validation;
- a reachable recovery path.

Use `fieldset` and `legend` for a related control group. Style the native `fieldset`, `legend`, and descendant `label` before adding field-group classes. A placeholder is an example or hint, never the only label.

```html
<form>
  <h2>Invite a member</h2>

  <div>
    <label for="invite-email">Email address</label>
    <input
      id="invite-email"
      name="email"
      type="email"
      autocomplete="email"
      aria-describedby="invite-email-help invite-email-error"
      aria-invalid="true"
    >
    <p id="invite-email-help">Use the member’s work address.</p>
    <p id="invite-email-error" role="alert">Enter a complete email address.</p>
  </div>

  <button type="submit">Send invitation</button>
</form>
```

The field wrapper groups one label, control, helper, and error. It needs no class until project CSS requires a stable field role. The control ID and message IDs are purposeful because the explicit label and description references consume them. The form needs no accessible name unless exposing it as a named form landmark improves navigation.

## Validation

Validate at a useful interaction point. On submit failure:

1. retain entered data;
2. expose failing fields with `aria-invalid="true"`;
3. connect each field to specific explanatory text;
4. place focus on the first invalid control or a useful error summary;
5. state what happened and how to recover.

Do not disable submit only because a form is incomplete. Users must be able to discover the requirements. Native `disabled` is correct when an action is genuinely unavailable or already executing.

## Async actions

When a request starts:

- prevent duplicate effects;
- retain the action’s accessible name;
- expose a pending state on the action or updating region;
- keep surrounding layout stable;
- announce a material result;
- restore an available action or recovery path after failure.

Use `aria-busy="true"` on the region being updated. Use a stable `role="status"` for routine progress or completion. Use `role="alert"` for urgent failure that needs immediate announcement. Do not duplicate announcements.

## Product states

Product behavior determines which states apply and what they mean. Implement every applicable state truthfully:

| State | Required result |
| --- | --- |
| Loading | Identifies what is loading and preserves stable structure where useful |
| Empty | Explains why no content exists and the next available action |
| Error | States the failure, retained work, and recovery action |
| Success | Confirms the completed effect and resulting state |
| Offline | Explains unavailable work, retained data, and retry behavior |
| Disabled | Makes the unavailable control understandable in nearby context |
| Unavailable | Provides an explanation or alternative when the task cannot continue |

Text and truthful attributes carry meaning before color, icon, or motion.

See [`examples/product-interface/`](../examples/product-interface/) for native controls and visible state specimens.

## Layout and presentation

Keep each label, control, helper, and error as one visual group. Separate field groups more than content inside a field. Let labels, errors, and actions wrap. Do not use fixed heights that clip text.

Base supplies minimal control chrome. Project CSS owns density, filled actions, and any tighter field layout. Use CRFT semantic color and spacing roles. Verify each state in every canvas where the form appears.

## Common mistakes

- Placeholder-only labels.
- Error shown only through a red border.
- `aria-invalid` without connected explanatory text.
- Pending text that replaces the action name with an ambiguous spinner.
- A disabled submit button that hides validation requirements.
- Success announced through color or motion only.
- A custom select when the native control satisfies the product requirement.

## Verify

Keyboard through the complete task. Check labels, names, grouping, control type, autocomplete, paste, validation, focus movement, pending behavior, duplicate prevention, announcements, retained input, recovery, long content, zoom, both color schemes, and every applicable product state.
