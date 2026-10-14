# Synthetic brand proof

`fluid.json` and `static.json` are the two synthetic brand inputs. `mixed.json` exercises a literal body size and explicit display endpoints on the fluid brand. `/brands/` renders all three through the same markup. These files implement the frozen fixture interface, not a production recipe schema.

Each input includes role metadata and numeric expected endpoint outputs. Roles map to steps: display 5, h1 4, h2 3, h3 2, lead 1, body 0, small/label/caption -1. Native h4–h6 consume h3; explicit role classes override native roles.

Dimensions carry `{ value, unit }`. Fluid bounds, base endpoints and role endpoints use rem magnitudes; ratios and steps are unitless. Final size is a rem length, tracking uses em, and measure uses ch. `recipes.mjs` validates the test inputs and emits CSS; equal endpoint sizes become literal final sizes. Tests separately remove those final sizes to prove equal foundations alone produce static modular output.

`public-contract.json` records the emitted version-2 public inventory at baseline revision `7358c7ef477a0b1890951bc8f967b2bea00f28b1` plus this uncommitted implementation. It is evidence, not a new authoritative inventory. The exact 154-token migration table remains in the coordinator's frozen `handoffs/brand-system/contract.md`.

Foundations and derived recipes rebind at root and `[data-theme]`. Theme font inputs are `--font`, `--font-display`, `--font-mono` and weights; semantic color inputs plus palette-light/dark are supported. Root convenience font aliases and arbitrary palette swatches do not reroute inherited semantic inputs. Literal role metadata inherits; derived font/weight aliases rebind, so final role font/weight exceptions must be reapplied at a theme boundary or below. Local final role-size overrides win. Skins choose the current scheme's canvas without cumulative transformations; accent routes recompute dependent semantic colors.

Rendered evidence: Chromium 149.0.7827.55, all 23 tests passing. Tests cover all roles at five widths and three root sizes, static/mixed results, scope overrides, font loading and opsz preservation, six intrinsic modes, partial subgrid and unsupported-feature fallbacks, native/custom disclosures, keyboard order, reduced motion, muted contrast, axe with no exemptions, 200% root text enlargement and 320px multilingual reflow. CDP page scaling proves pinch zoom, not desktop browser zoom. Desktop browser zoom, Firefox, WebKit and human design acceptance remain unverified. Automated axe is not complete product accessibility acceptance.
