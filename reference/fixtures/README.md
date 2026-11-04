# Synthetic brand proof

`fluid.json` and `static.json` are the two synthetic brand inputs. `mixed.json` exercises a literal body size and explicit display endpoints on the fluid brand. `/brands/` renders all three through the same markup. These files implement the frozen fixture interface, not a production recipe schema.

Each input includes role metadata and numeric expected endpoint outputs. Roles map to steps: display 5, h1 4, h2 3, h3 2, lead 1, body 0, small/label/caption -1. Native h4–h6 consume h3; explicit role classes override native roles.

Dimensions carry `{ value, unit }`. Fluid bounds, base endpoints and role endpoints use rem magnitudes; ratios and steps are unitless. Final size is a rem length, tracking uses em, and measure uses ch. `recipes.mjs` validates the test inputs and emits CSS; equal endpoint sizes become literal final sizes. Tests separately remove those final sizes to prove equal foundations alone produce static modular output.

`public-contract.json` is the committed output of `node scripts/emit-contract.mjs --out reference/fixtures/public-contract.json`, run from a clean checkout. CSS remains authoritative. Older Brand OS versions read the v2 fixture; they must migrate before using this v3 fixture. Consumers read this fixture's `publicTokens` and `privateProperties` as its custom-property allowlist and pins its `digest`, which covers only those names and the contract version. Edits to bans, hooks, or the theme and accent value lists do not move the pin; adding or removing any custom property does: `sha256:` plus the hex SHA-256 of JSON `{contractVersion, publicTokens, privateProperties}` in that key order, serialized like `JSON.stringify` with no whitespace (separators `,` and `:`), non-ASCII characters unescaped, encoded as UTF-8; array order is significant. The fixture omits `revision` because squash merges make a commit SHA unusable as its identity. `node scripts/check-system.mjs` fails when the fixture differs from emitted output, records a revision, or records `dirty: true`. After a contract change, commit the CSS, regenerate the fixture on that clean checkout, and commit it. The historical 154-token migration table is excluded; current migration guidance lives in [adoption](../../docs/adopt.md).

Foundations and derived type, spacing, and radius recipes resolve at root only.
The fixture adapter accepts synthetic contractVersion 3 only; Brand OS v2 context output fails visibly.
Each static/fluid/mixed profile needs its own document root when rendered together.
Themes change only color. Final role sizes and metadata inherit and accept explicit local overrides.
This deliberately removes v2 theme-local foundation support; it does not migrate external Brand OS exports.

Current rendered proof lives in `reference/tests/brand-system.spec.mjs`; run it before claiming acceptance.
Historical upstream passes are not v3 results. Firefox, WebKit, desktop zoom, and human acceptance require separate evidence.
