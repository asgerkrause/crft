# CRFT three-file migration evidence

Unit: CR1 packaging follow-up, dispatch crft-core3-implement, worker crft-core3. Checkout: `/Users/krause/dev/repos/crft`, branch `launch-polish`, base revision `7358c7ef477a0b1890951bc8f967b2bea00f28b1`. The implementation snapshot was committed as c57d6ee6d7898e66f7dec88b8d421871aba2d744. Delivery corrections below update guidance and test coverage without changing the shared CSS. Current file hashes and artifact identity are recorded in [CORE3-SHA256.json](CORE3-SHA256.json); [PR #7](https://github.com/sanitizestudio/crft/pull/7) records delivery status.

## Result and adoption

Shared source contains exactly three CSS files: `styles/global.css` (prelude/imports), `styles/tokens.css` (brand foundations, role metadata, recipes, themes/skins, motion preferences and optional faces), and `styles/crft.css` (framework behavior). The eight logical layers keep their precedence. Superseded styles/layers/*.css files were removed after consumer tracing; bundled WOFF assets remain beside tokens.css. Product/reference CSS stays in its existing owner.

Semantic contractVersion remains 2: 221 public tokens, eight private properties, unchanged hooks, theme/skin/accent vocabulary, and logical dependencies. Emitted contracts and new root manifests add packagingVersion 1. The copier accepts exactly tokens or full; other former layer selections fail explicitly. Full copies tokens.css and crft.css, tokens copies only tokens.css. Neither copies or edits global.css. Optional --fonts retains the marked final font-face section and copies adjacent WOFF files; default copies omit that section and those assets.

```sh
node scripts/copy-system.mjs --dry-run --layers tokens /absolute/project/styles
node scripts/copy-system.mjs --layers full --fonts /absolute/project/styles
node scripts/check-project.mjs /absolute/project/styles
```

Place the printed entry block at the top of the existing consumer entrypoint:

```css
@layer reset, base, tokens, type, layout, grid, motion, utility, project;

@import "./tokens.css";
@import "./crft.css";
```

Tokens-only adoption omits the crft.css import. Brand OS output belongs in the adopted tokens.css owner and must preserve required token jobs, scope rebinding and reduced-motion substitutions; its replacement completeness is a separate BO1 verification. Context v3 may continue declaring cssContractVersion 2. No Brand OS or AK source was edited here.

Recorded/manual legacy layer packages retain semantic v1/v2 checking. Mixed flat/layer packages and unknown packaging versions fail. Project entrypoints remain owned; copies retain conflict safety, private staging, symlink refusal and rollback. Tests cover a valid flat package whose destination directory is itself named layers.

## Verification

| Check | Result |
| --- | --- |
| Checkout and pre-migration CR1 SHA-256 proof | PASS: all 82 recorded files matched before edits |
| Coordinator independent normalized CSS comparison | PASS: crft.css equals old base+type+layout+grid+motion+utility; tokens.css equals old tokens+fonts, with only adjacent font URL rebase |
| Semantic contract comparison with preserved baseline | PASS: only physical file-to-layer map and packagingVersion differ |
| `node scripts/check-system.mjs` | PASS: 221 public tokens, eight private properties, eight layers |
| `node --test scripts/*.test.mjs` | PASS: 112 tests, no failures/skips (including fix1) |
| `node scripts/emit-contract.mjs` | PASS: current public-contract.json fixture matches emitted output |
| `bun run build` | PASS: standalone distribution, optional fonts omitted |
| reference `bun run test` | PASS: two routes, 13 sections, 44 fixtures, 221 public tokens, no hydrated islands |
| reference `bun run test:rendered` | PASS: 23 Chromium tests, including axe without exemptions |
| Full copy with fonts dry run | PASS: tokens.css, crft.css, two WOFF files, root manifest; no target created |
| `git diff --check` | PASS |
| Strict TypeScript | NOT RUN: no TypeScript source changed relative to preserved CR1 baseline; Astro builds passed |

The existing rendered suite ran with Chromium 149.0.7827.55. It confirms actual font HTTP responses and loaded faces, intermediate weights and nested emphasis, static/fluid/mixed recipes, root/theme/final overrides, numbered/intrinsic/subgrid fallbacks, keyboard source order, native/custom disclosure, dialog/hidden behavior, themes/skins/accent routes, contrast, reduced motion, text enlargement and narrow multilingual reflow.

The reference minifier sorts layer blocks and removes the redundant prelude; the retained built-output check verifies resulting layer order. An intermediate prelude-string check failed and was replaced with the existing layer-order check. No unresolved check failure remains.

Coordinator source proof: `/Users/krause/.local/state/ak/team/brand-system-bo1-ak1/core3-coordinator-source-proof.md`. Pre-migration originals: `originals/crft-core3` in that same directory. Test logs from this run: `/tmp/crft-core3-tests.log` and `/tmp/crft-core3-rendered.log`. The worker report records the exact changed file inventory.

## Review correction — crft-core3-fix1

The coordinator reproduced a legacy compatibility regression after the initial implementation settled: a full recorded legacy v2 package plus project-owned root tokens.css was incorrectly classified as mixed packaging. The checker now uses legacy manifest/layer evidence before that ambiguous filename, while explicit root crft.css or a root flat manifest still rejects a mixed package. Contract discovery follows the same precedence for manual legacy copies. No general CSS parser was added.

One regression covers full legacy layout with project-owned root tokens.css, both recorded and manual, plus explicit flat-framework/manifest rejection. The exact reproduction using the preserved legacy copier now passes with `1 files, 221 tokens verified`. Focused checker tests pass (20); all unit tests pass (112); source contract and diff checks pass. Current emitted contract still matches the saved fixture. All three CSS files and both font assets retain their prior hashes, so browser/build tests were not repeated; the 23-test Chromium evidence above remains applicable to unchanged CSS.

Fix log: `/tmp/crft-core3-fix1-tests.log`. Fix report: `/Users/krause/.local/state/ak/team/brand-system-bo1-ak1/crft-core3-fix1-report.md`. The initial crft-core3-implement-report.md is preserved as historical first-pass evidence.

## Committed delivery review correction

Fresh review of c57d6ee found that the reference axe test set data-theme while leaving data-mode="system". The project layer therefore retained color-scheme: light dark. A new computed-style assertion reproduced this gap before correction. The test now synchronizes both attributes and asserts the effective scheme. It waits for finite CSS transitions to finish before scanning; infinite motion examples continue normally. The intermediate contrast failures were observed during the existing 200 ms color transition, not in settled schemes. The corrected focused light/dark audit passes without exclusions or CSS changes.

Remaining motion/container guidance, the rendered Motion specimen and two example comments now use the shipped --transition-* tokens and .c container classes. The query-boundary guard now rejects a generic .c container as well as the retired generic [c] boundary; its mutation test failed before the correction and passes after it. Legacy spellings remain in explicit migration guidance, historical evidence and rejection tests, apart from the current c grid-span attribute. All three shared CSS files, font assets, contract versions and adoption behavior are byte-identical to the artifact consumed by BO1/AK1. Their existing CSS compatibility proof and static profiles remain applicable.

Delivery logs and the exact-head receipt are in /Users/krause/.local/state/ak/team/crft-delivery/. The fresh committed review and post-commit checks are posted on PR #7. The earlier 23-test run did not prove separate light/dark axe coverage; the corrected audit supersedes that claim. Historical artifact brand-system-1-core3-fix1-21751765f960b96c remains recoverable from commit c57d6ee6d7898e66f7dec88b8d421871aba2d744.

## Historical evidence and limits

[CR1-EVIDENCE.md](CR1-EVIDENCE.md) and CR1-SHA256.json are preserved historical records of the pre-packaging CR1 result; their old source paths/hashes do not identify current packaging. Fluid/static/mixed recipe fixtures and the accepted semantic contract remain intact.

Firefox, WebKit, desktop browser zoom, assistive-technology sessions and human design/accessibility acceptance remain unverified. Unsupported-feature paths are simulated in Chromium, not proved in older engines. No client adoption, BO1 replacement-export acceptance, paper/slide integration, commit, push, release or deployment is claimed. The remaining integration risk is complete approved replacement brand tokens and motion preferences, owned by BO1 and final integration review.
