# Brand-system local integration evidence

P0/CR1/BO1/AK1 integration of the frozen [shared contract](contract.md). This historical checkpoint describes the local artifacts consumed during integration, before repository delivery. It is not release or human design/accessibility acceptance. Current CRFT guidance/test corrections are recorded in [CORE3-EVIDENCE.md](CORE3-EVIDENCE.md); shared CSS and contract versions remain unchanged. Repository implementations remain owned by their respective units.

## Exact artifacts

| Unit | Artifact | Evidence |
| --- | --- | --- |
| CRFT CR1 | `brand-system-1-core3-fix1-21751765f960b96c` | [CORE3-EVIDENCE.md](CORE3-EVIDENCE.md), [snapshot hashes](https://github.com/sanitizestudio/crft/blob/c57d6ee6d7898e66f7dec88b8d421871aba2d744/handoffs/brand-system/CORE3-SHA256.json) |
| Brand OS BO1 | `brand-system-1-bo1-fix1-d1ac13fe6c5481c1` | Team `bo1-fix1-report.md`, `bo1-source-sha256.json`, `bo1-packages-sha256.json` |
| AK AK1 | `brand-system-1-ak1-860d25e0f82b1134` | Team `ak1-implement-report.md`, `ak1-source-inventory.json`, `ak1-output-sha256.json` |

Team evidence directory: `/Users/krause/.local/state/ak/team/brand-system-bo1-ak1/`. Full BO1 source SHA256: `d1ac13fe6c5481c1d00ba5c93d809703ae120b287690047a8734a87773047fb0`. AK scoped source SHA256: `860d25e0f82b11341b8fc815eeb1fd68fced2a826b5ad93e6e43139a8d15a9bc`. AK output-manifest SHA256: `febed7a355abd85273b97009a0e706651cadeef9da87f90236606989261732d1`. The earlier CR1 and initial BO1 evidence remains historical; use these corrected identities.

## Shared structure and adoption

The three shared CSS sources are `styles/global.css`, `styles/tokens.css`, and `styles/crft.css`. Semantic CSS contract 2 and packaging version 1 are distinct. Context/source version 3 carries the agreed roles, recipes, provenance and explicit static profiles.

`global.css` declares the prelude and imports. `tokens.css` owns editable brand inputs, derived recipes, semantic values, themes/skins, motion preferences and optional faces. `crft.css` owns framework behavior within the retained logical layers. Product CSS stays with its product owner. Follow [CORE3 adoption instructions](CORE3-EVIDENCE.md): copier options are `--layers tokens|full`, with optional `--fonts`. The copier writes a root manifest and never edits the consumer's entrypoint. Local extraction remains supported.

BO1 now projects `styles/tokens.css`; it emits no `global.css` or `crft.css`. Full replacement requires its `fullFramework` capability. Fieldnote remains explicitly token-only. Preserve exported styles/assets/effects together for relative URLs. AK guidance and consumers follow these boundaries; the installed CRFT skill continues to resolve to CRFT's source owner.

## Concrete producer-to-consumer proof

| Fixture | Complete BO1 package SHA256 | Context SHA256 captured by AK |
| --- | --- | --- |
| contract-fluid | `c691667daa03d3347ed3568f6a3b0449ffaf01deb0d8163d4a78390b71902de8` | `65bd2c8df230024d30e930cf2e509f5f851707d6609c2860b3a4f7fc6db52fe4` |
| contract-static | `2b11be023b8523cafa09dac1c3f3b52bcd5c571322d8691ce1283bb95c8f385b` | `a98aa4824f870657c9583269457b2a27c5441069fc555192d923706dc1c7c480` |

Producer roots: `/Users/krause/dev/repos/brand-os/examples/<fixture>/dist`. Durable consumer pins: `/Users/krause/dev/repos/ak/examples/brand-system/PRODUCER.json`. Both fixtures use the same content builders and semantic mappings. The web fluid/static distinction remains separate from approved Paper/Slides static values; no viewport sampling or arbitrary artboard scaling was introduced.

Team `output-fluid/` and `output-static/` each contain an 11-page A4 report, eight-slide 1280×720 deck, and standalone Figure, plus PDF/raster/font evidence. All 32 table rows survive pagination; 20 mm report side margins and explicit 58/58/54 mm table columns are measured. Placed figures remain 1:1. Forty-four computed role samples cover family, weight, leading, tracking, case, features, axes and optical sizing. Fresh-agent comprehension of role/profile provenance passed in the source review.

## Actual checks and review

| Check | Result |
| --- | --- |
| CRFT static contract, emission, copy/adoption, build and reference checks | PASS; 112 unit tests, 23 Chromium rendered tests |
| CSS move behavior preservation | PASS; normalized declarations unchanged except font URL rebasing |
| BO1 typecheck, source checks, schemas, three builds and DESIGN lint | PASS; 111 tests; zero lint errors (existing orphan-token warnings remain) |
| BO1 browser proof | PASS; 270 framework typography comparisons, 44 correction observations, 48 contrast pairs, fonts, scopes, native states and reduced motion |
| AK required repository check | PASS; typecheck, 916 tests and source smoke |
| AK browser, SVG and PDF checks | PASS within recorded limits; 44 role samples, both-theme review cases, 38 PDF pages, embedding and pagination checks |
| Coordinator independent validation | PASS; CRFT source/unit/build/contract, BO1 typecheck/111 tests, AK typecheck/eight regressions/diff checks, exact source/package/output hashes |
| Independent source reviews | PASS: CRFT, BO1 and AK fresh correction reviews; reports retained in Team |

Review found and corrected one CRFT legacy-layout classification issue, five BO1 metadata/recipe emission defects and three AK palette/geometry/badge defects. Reproductions, passing regression checks and fresh correction reviews are captured in Team. Review verdicts are source evidence; rendered and human acceptance are separate.

No dependency installation, commit, push, publication, deployment or client-project adoption occurred. Existing dirty work and original snapshots were preserved. User-owned Herdr panes `w35:p2` and `w32:pAG` remain open; temporary Team review panes were closed after settlement and report capture. Monitoring ends with this completed coordination turn.

## Limits

Static-brand proof explicitly substitutes Georgia/Courier New with Geist Mono; original-font appearance and embedding fidelity remain unproven. Private SNZ font proofs and embedded artifacts must remain local. Chromium's variable-font PDF path emits Type 3 subsets; Poppler reports bad glyph bounding boxes despite passing raster and text checks. Other PDF/print pipelines remain unverified.

Firefox/WebKit, desktop zoom, assistive-technology sessions, physical print/projector and human design/accessibility acceptance were not run. CSS dimensional division was proved in Chromium 155 only. Unsupported-feature checks are simulations, not older-engine certification. Film/fframes, Lottie, native DOCX/PPTX and other consumers remain outside AK1; the consumer inventory records follow-up scope.
