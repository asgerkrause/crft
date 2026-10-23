# Changelog

Adopters compare the `revision` in their copied `crft-manifest.json` against the entries here, newest first.

## Unreleased

- `--on-accent`, `--on-secondary`, `--on-tertiary`, `--on-success`, `--on-warning`, and `--on-danger` now follow their source color at `:root`: `contrast-color()` where supported (UA-defined algorithm), otherwise a relative-color flip at XYZ luminance 0.1791 (worst case 4.58:1 across sRGB). They resolve to pure black or white instead of `--palette-dark`/`--palette-light`; the hand-picked palette pair remains only where neither feature is supported. Projects that retune a source at `:root` no longer need to retune its companion; a source retuned on a descendant boundary still redeclares its companion there. A project override still wins.
- Bundled font families are renamed from `"SNZ Sans"` and `"SNZ Mono"` to `"sans"` and `"mono"` in `--font-sans`, `--font-mono`, and the optional `@font-face` rules. Project CSS that names the old families must switch to the new names or to the role tokens.
- `emit-contract` adds `digest`: `sha256:` plus the hex SHA-256 of JSON `{contractVersion, publicTokens, privateProperties}` in that key order, serialized like `JSON.stringify` with no whitespace (separators `,` and `:`), non-ASCII characters unescaped, encoded as UTF-8; array order is significant. `reference/fixtures/public-contract.json` is the committed `--out` output from a clean checkout, without `revision`, because squash merges make a commit SHA unusable as its identity. Brand OS reads its `publicTokens` and `privateProperties` as the custom-property allowlist and pins the digest. `check-system` fails when the fixture differs from emitted output, records a revision, or records `dirty: true`.
- The package ships two stylesheets, `tokens.css` and `crft.css`; `styles/global.css` is the repository prelude and is never copied. The eight logical layers keep their order. Former `styles/layers/*.css` files are gone; `check-project` still validates legacy layer packages and rejects mixed layouts.
- The copier accepts only `--layers tokens|full`; former per-layer selections fail with guidance. `--fonts` keeps the optional font faces in `tokens.css` and copies `sans.woff` and `mono.woff`.
- `crft.css` opens with a token-free `@layer reset` and a token-consuming `@layer base`; the checker enforces the token-free reset. New base behavior: start-aligned control text, no text selection on buttons, no hanging punctuation on controls.
- The copier writes `crft-manifest.json` beside the copied files in every real copy: semantic `contractVersion` 2, `packagingVersion` 1, source revision, copied layers, file hashes, and a contract snapshot. An existing manifest aborts the publish like any other conflict.
- New `scripts/emit-contract.mjs` derives the machine-readable contract (public tokens, private properties, themes, skins, accents, layers, dependencies, hooks, bans) from live CSS.
- New `scripts/check-project.mjs` verifies consumer CSS against the adopted contract: private properties, single-side logical longhands, unknown CRFT-family tokens, missing layer dependencies.
- The contract checker pins owner structure instead of prose sentences, guards duplicate `@layer` blocks, hardens the reset token check, and replaces the retired-class blacklist with an example-class allowlist.
- Spacing property-form doctrine consolidates in `craft/layout.md`, including the ban on `*-block-start` and `*-inline-start` single-side longhands. The skill routes to it.
- `craft/tokens.md` documents calc()-over-new-token admission with a valid public-token example.
- Root `package.json` scripts (`check`, `test`, `contract`) and a CI workflow run all gates on every push.
- Rendered accessibility gate: axe-core WCAG A/AA scan in the reference Playwright suite with a measured muted-role exception and a shrinking open-findings register.
- Fluid-type accessibility gates: the checker fails any retune whose steps lose zoom growth (non-positive rem term) or whose text steps exceed the 2.5x doubling budget; a rendered test proves root-font-size doubling at the clamp ends.
- The contract gains a derived `bans` list (private properties plus canon rules) surfaced as the skill's Never section and checker-synced from one source.
- Type roles trim to cap height and alphabetic baseline under `@supports (text-box: trim-both cap alphabetic)`.
