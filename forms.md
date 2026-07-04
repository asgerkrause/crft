---
scope: craft
layer: forms
triggers:
  - forms
  - inputs
  - validation
  - labels
  - errors
updated: 2026-07-01
---

# Forms craft

Related: `accessibility`, `copy`, `tokens`, `components`.

## Native form semantics first

ID: forms.labels-first
Status: Must
Triggers: form, input, textarea, select, checkbox, radio, submit, label, validation
Use when: Building forms.
Rule: Use real `<form>`, `<label>`, `<input>`, `<textarea>`, `<select>`, `<fieldset>`, `<legend>`, and `<button type="submit">`. Keep validation readable, connected, and native-first. Add ARIA only when native semantics cannot express state.
Tradeoff: Less custom UI freedom; better accessibility and validation.
Override: None for standard forms.
Tiny example:
Good: wrapping label around input for one shared hit target.
Avoid: div-based fake fields.

## Field skins use input element tokens

ID: forms.input-tokens
Status: Default
Triggers: input tokens, field tokens, e-inp, form styling
Use when: Styling text inputs, selects, textareas, checkboxes, radios, or field wrappers.
Rule: Use `--e-inp-sur`, `--e-inp-ink`, and `--e-inp-bor` for official field skin. Use `--s-pd`, `--s-br`, `--s-bw`, and `--s-gp` for spacing/shape.
Tradeoff: Consistent field theming; specialty controls may need local vars.
Override: A component has a unique field-like visual role and documents local tokens.
Tiny example:
Good: `background: var(--e-inp-sur); color: var(--e-inp-ink); border-color: var(--e-inp-bor);`
Avoid: raw background/border colors in field components.

## Validation colors use state roles

ID: forms.validation-colors
Status: Default
Triggers: error, invalid, success, warning, validation color
Use when: Styling form feedback.
Rule: Use `--c-bad-*` for invalid/error, `--c-good-*` for success, and `--c-warn-*` for warning/help states. Do not hardcode red/green/orange.
Tradeoff: State colors theme consistently; more roles in token engine.
Override: Brand-specific state palette maps into these tokens first.
Tiny example:
Good: `border-color: var(--c-bad-bor); background: var(--c-bad-sur); color: var(--c-bad-ink);`
Avoid: `border-color: <raw-error-color>;`

## Errors include text and connection

ID: forms.connected-errors
Status: Must
Triggers: form errors, aria-describedby, aria-invalid, validation message
Use when: Rendering field errors.
Rule: Error state needs readable text, `aria-invalid` when applicable, and a connected description via `aria-describedby` or native validation.
Tradeoff: More markup; usable and screen-reader friendly.
Override: Native browser validation owns the message and submit flow.
Tiny example:
Good: input with visible error text and `aria-describedby="email-error"`.
Avoid: red border only.

## Submit state stays truthful

ID: forms.submit-state
Status: Default
Triggers: submit button, loading, disabled, pending, form status
Use when: Handling async submit.
Rule: Keep submit enabled until request starts. During request, set truthful disabled/busy state and announce status with `aria-live="polite"`.
Tradeoff: Slightly more state handling; avoids dead-feeling forms.
Override: Static HTML form with no async handler.
Tiny example:
Good: `<p aria-live="polite">Sending…</p>`.
Avoid: disabling submit on first keystroke or relying on spinner only.

## Applied patterns

### Connected error

```html
<label for="email">Email</label>
<input id="email" name="email" type="email" aria-invalid="true" aria-describedby="email-error">
<p id="email-error">Enter a valid email address.</p>
```

Decision: visual state plus text plus connection.

### Input skin through element tokens

```css
input {
  background: var(--e-inp-sur);
  color: var(--e-inp-ink);
  border: var(--s-bw) solid var(--e-inp-bor);
}
```

Decision: official field skin uses `--e-inp-*`.

### Async submit feedback

```html
<button type="submit" aria-busy="true">Sending</button>
<p aria-live="polite">Sending…</p>
```

Decision: state is truthful and announced.
