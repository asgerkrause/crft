---
title: CRFT utilities
status: canonical
owner: utilities
read_when: Finding a public utility, deciding whether a utility belongs in CRFT, or checking hidden-content recovery.
---

# Utilities

CRFT exposes a finite utility surface for stable operations used by unrelated markup. Utilities do not replace semantic elements, layout composition, components, or project CSS.

## Public surface

| Purpose | Selectors | Operation |
| --- | --- | --- |
| Screen-reader content | `.sr`, `.sr.focusable` | Visually hide content; restore focusable content when keyboard-focused |
| Semantic color | `.c-fg`, `.c-mu`, `.c-ac`, `.c-sc` | Apply active foreground, muted, primary-accent, or secondary-accent color |
| Font family | `.f-sa`, `.f-se`, `.f-mo`, `.f-bd`, `.f-dp` | Apply sans, serif, mono, body, or display family |
| Font weight | `.w-lt`, `.w-rg`, `.w-bd` | Apply light, regular, or bold weight |
| Text transform | `.tt-uc`, `.tt-lc`, `.tt-no`, `.tt-cp` | Apply uppercase, lowercase, no transform, or capitalization |

Store text in natural case. Use transform utilities only for presentation.

`.sr.focusable` is intended for skip links and other keyboard-restorable content. Do not apply `.sr` to content that must remain visible or to hide a focusable control without a restoration path.

## Admission threshold

Add a shared utility only when:

1. unrelated markup needs the same stable operation;
2. an existing public element, attribute, class, or token cannot express it;
3. `styles/layers/utility.css` fully owns the operation;
4. accessibility can be verified;
5. the selector has one stable meaning.

Keep one-off values, component details, responsive variants, state variants, aliases, and private-state access in project CSS.

## Common mistakes

- Combining utilities until markup becomes a component styling language.
- Adding arbitrary spacing, color, or responsive utilities.
- Using `.c-ac` as the only feedback signal.
- Applying `.sr` to a control that remains keyboard-focusable but cannot become visible.
- Typing uppercase source copy instead of using presentation.
- Adding a utility for one call site.

## Verify

Confirm every documented selector exists in `styles/layers/utility.css` and no undocumented utility exists. Test `.sr.focusable` by keyboard. Check semantic color utilities across skins, accents, and schemes. Confirm font and transform utilities preserve type semantics, wrapping, and accessible names.
