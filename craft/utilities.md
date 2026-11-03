---
title: crft utilities
status: canonical
owner: utilities
read_when: Finding a public utility, deciding whether a utility belongs in crft, or checking hidden-content recovery.
---

# Utilities

crft exposes a finite utility surface for stable operations used by unrelated markup. Utilities do not replace semantic elements, layout composition, components, or project CSS.

## Public surface

| Purpose | Selectors | Operation |
| --- | --- | --- |
| Screen-reader content | `.sr`, `.sr.focusable` | Visually hide content; restore focusable content when keyboard-focused |
| Corner shape | `.squircle` | Opt one element into `corner-shape: squircle`; browsers without support ignore it; visible only where it has a radius |

`.squircle` is opt-in per element and never applies to descendants; without `corner-shape` support the ordinary radius remains. It is the one admitted exception to criterion 1 below: it replaces a former global base default, so the system owner admitted it without a second consumer to keep an opt-in path for existing adopters. `.sr.focusable` is intended for skip links and other keyboard-restorable content. Do not apply `.sr` to content that must remain visible or to hide a focusable control without a restoration path.

Semantic role classes live in [`type.md`](type.md). Line clamp is `l`. Measure is `.c`; grouping is `.s`. Grid spans are `c` and `r`. Other arrangements belong to project CSS. Do not add a utility matrix for those jobs.

## Admission threshold

Add a shared utility only when:

1. unrelated markup needs the same stable operation;
2. an existing public element, attribute, class, or token cannot express it;
3. `styles/crft.css` fully owns the operation;
4. accessibility can be verified;
5. the selector has one stable meaning.

Keep one-off values, component details, responsive variants, state variants, aliases, and private-state access in project CSS.

## Common mistakes

- Combining utilities until markup becomes a component styling language.
- Adding arbitrary spacing, color, or responsive utilities.
- Applying `.sr` to a control that remains keyboard-focusable but cannot become visible.
- Adding a utility for one call site.
- Importing a spacing, alignment, or border class catalog to “complete” the system.

## Verify

Confirm every documented selector exists in `styles/crft.css` and no undocumented utility exists. Test `.sr.focusable` by keyboard.
