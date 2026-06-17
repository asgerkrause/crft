---
scope: snz-craft
layer: forms
triggers:
  - forms
  - labels
  - errors
  - helper text
  - validation
  - field groups
  - submit
updated: 2026-05-28
---

# Forms craft

## Labels first

ID: forms.labels-first
Status: Must
Triggers: form, input, label, placeholder, accessibility, field
Use when: Building form fields.
Rule: Every input needs a real label. Placeholder is hint, not label.
Tradeoff: More visible structure; far better accessibility and comprehension.
Override: Visually hidden label is acceptable when UI pattern requires compact field.
Tiny example:
Good:
```html
<label for="email">Email</label>
<input id="email" name="email" type="email" autocomplete="email" />
```
Avoid: `<input placeholder="Email" />` as only label.
Related: copy.form-guidance, platform.semantic-html

## Helper and error text are connected

ID: forms.connected-help-error
Status: Must
Triggers: helper text, error text, aria-describedby, validation, form errors
Use when: Adding helper text, requirements, or validation errors.
Rule: Connect helper/error text with `aria-describedby`. Use `aria-invalid` when field has error.
Tradeoff: More IDs; screen readers get correct context.
Override: Framework form component handles this correctly.
Tiny example:
Good:
```html
<input id="email" aria-describedby="email-help email-error" aria-invalid="true" />
<p id="email-help">Use work email.</p>
<p id="email-error">Enter a valid email.</p>
```
Avoid: visual-only error text disconnected from field.
Related: copy.form-guidance, copy.state-feedback, platform.semantic-html

## Submit states name progress

ID: forms.submit-states
Status: Default
Triggers: submit, loading, pending, success, error, button copy, form state
Use when: Handling form submission UI.
Thinking: User needs to know whether action is available, in progress, succeeded, or failed.
Rule: Reflect pending/success/error states in accessible UI. Disable only when preventing duplicate action; keep label meaningful.
Tradeoff: More state handling; less uncertainty for user.
Override: Native form postback with full page response.
Tiny example:
Good: `Send message` → `Sending…` → success message near form.
Avoid: spinner-only button with no accessible label.
Related: copy.state-feedback, copy.cta-job, sections.copy-from-icp, components.css-owns-visual-state

## Group fields by user task

ID: forms.task-groups
Status: Default
Triggers: fieldset, legend, field groups, form layout, multi-step form
Use when: Organizing multiple fields.
Thinking: Form structure should follow user task, not database schema.
Rule: Group related fields with clear headings/`fieldset` + `legend` where appropriate.
Tradeoff: Slightly more markup; easier completion and scanning.
Override: Very short form with one or two fields.
Tiny example:
Good: Contact details, Project details, Preferences.
Avoid: ordering fields only by backend model columns.
Related: sections.page-rhythm
