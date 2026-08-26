# Changelog

Adopters compare `layers/crft-manifest.json` `revision` in their copy against the entries here, newest first.

## Unreleased

- `base.css` splits into a token-free `@layer reset` and a token-consuming `@layer base`; the checker enforces the token-free reset. New base behavior: start-aligned control text, no text selection on buttons, no hanging punctuation on controls.
- The copier writes `layers/crft-manifest.json` into every real copy: source revision, copied layers, file hashes, and a contract snapshot. An existing manifest aborts the publish like any other conflict.
- New `scripts/emit-contract.mjs` derives the machine-readable contract (public tokens, private properties, skins, accents, layers, dependencies) from live CSS.
- New `scripts/check-project.mjs` verifies consumer CSS against the adopted contract: private properties, single-side logical longhands, unknown CRFT-family tokens, missing layer dependencies.
- The contract checker pins owner structure instead of prose sentences, guards duplicate `@layer` blocks, hardens the reset token check, and replaces the retired-class blacklist with an example-class allowlist.
- Spacing property-form doctrine consolidates in `craft/layout.md`, including the ban on `*-block-start` and `*-inline-start` single-side longhands. The skill routes to it.
- `craft/tokens.md` documents calc()-over-new-token admission with a valid public-token example.
- Root `package.json` scripts (`check`, `test`, `contract`) and a CI workflow run all gates on every push.
- Rendered accessibility gate: axe-core WCAG A/AA scan in the reference Playwright suite with a measured muted-role exception and a shrinking open-findings register.
- Fluid-type accessibility gates: the checker fails any retune whose steps lose zoom growth (non-positive rem term) or whose text steps exceed the 2.5x doubling budget; a rendered test proves root-font-size doubling at the clamp ends.
- The contract gains a derived `bans` list (private properties plus canon rules) surfaced as the skill's Never section and checker-synced from one source.
- Type roles trim to cap height and alphabetic baseline under `@supports (text-box: trim-both cap alphabetic)`.
