# AK implementation handoff — AK1

Repository: `/Users/krause/dev/repos/ak`.
Read [README](README.md) and [contract](contract.md) first. Status: implementation dispatched separately under current user authority; this handoff does not establish completion.

## CRFT packaging integration

Read the shared contract's approved core3 section and [current CRFT evidence](CORE3-EVIDENCE.md). Semantic cssContractVersion remains 2; packagingVersion 1 describes the flat tokens.css/crft.css package and root manifest. Brand OS web projection belongs in tokens.css, with complete framework token coverage, supported scope rebinding, reduced motion and optional brand faces. Framework selectors stay in crft.css; product presentation stays project-owned. Previous CR1 evidence/hashes are historical. Static format profiles and role mappings remain unchanged by packaging.

## Outcome

UI, Paper, Slides, and Figure consume one checked brand contract, understand shared role names and recipes, and render approved values for their medium. Brand identity, voice, composition, and font behavior survive adaptation. Skills no longer claim full brand support after importing only colors and font families.

Blocked by: BO1's versioned packages/context and CR1's proven browser grammar. Read-only consumer inventories and guidance reviews may start earlier. Native DOCX/PPTX, Film, Lottie, and other outputs need a capability inventory and explicit later units; do not claim the whole AK ecosystem is migrated after the first four consumers.

## Current evidence to verify again

- `skills/figure/brand.ts` and `brand-system.md` already provide shared Brand OS consumption for Figure, Slides, and Paper. Extend this boundary rather than adding three loaders.
- The adapter currently imports palette, font families, and stroke width, not full type scales, format profiles, or spacing. Its guidance explicitly records this limitation.
- `skills/slides/format.ts` owns a 1280×720 format with literal typography, layout geometry, and derived figure slots. Its role vocabulary differs from Brand OS. Format typing derives from the literal object.
- `skills/paper/format.ts` owns A4 geometry in mm and type in pt; its current Role weight type is 400|500. These restrictions cannot represent arbitrary approved brand weights.
- Brand OS's synthetic slide format is 1920×1080; A4 profiles may use different margins and columns. Matching a page label or aspect ratio does not prove compatibility.
- `skills/ui/html-css.md` favors semantics, native state, shallow nesting, intrinsic layout, and derived relationships. UI's house taste is not authority to reject an approved client brand.
- `/Users/krause/.agents/skills/crft` resolves to the CRFT repository's `skills/crft`. No AK-owned `skills/crft` was observed. Do not duplicate or edit its installed symlink target as if AK owns it.

## Owns

Read local instructions, `skills/improve/SKILL.md` or its actual source location, and applicable output skill owners before edits. Confirm installed skills resolve to the source tree. Source skill edits can become live immediately.

Candidate scope, narrowed by search:

- `skills/figure/brand.ts`, `brand-system.md`, `brand-os.test.ts`, `brands/house.json`, synthetic fixtures, and Figure consumers that use the changed snapshot.
- `skills/paper/format.ts`, `doc.ts` if present, actual renderer/pagination owners found by search, `inspect.js`, `SKILL.md`, and affected tests.
- `skills/slides/format.ts`, `runtime.ts`, `deck.ts`, `parts.ts`, affected `layouts/`, `inspect.js`, `SKILL.md`, and corresponding tests.
- `skills/ui/SKILL.md`, `system.md`, `typography.md`, `html-css.md`, `outputs.md`, and recipes that actually encode old names or conflicting behavior.
- `skills/init-brand-md/SKILL.md`, `contract.md`, and `audit.md` where they emit or teach legacy token vocabularies. Route legacy material through an explicit import/mapping rather than creating another canonical token source.

Do not modify global instructions, hooks, unrelated skills, installed vendor skills, or CRFT/Brand OS source in this unit. Adding a new skill, dependency, or broad pipeline change needs its own demonstrated scope and authorization.

## Work

1. Inventory every snapshot consumer and every old role spelling. Record unsupported outputs honestly. Distinguish house taste, platform constraints, approved brand rules, and local template slots.
2. Extend the existing shared adapter for BO1's version and capabilities. Preserve provenance, themes, fonts, role values, format geometry, and explicit mappings. Validate once at the boundary; do not loosen types with any, casts, non-null assertions, or ignored errors.
3. Replace literal-only format typing with a validated format shape capable of representing approved values. Retain current house values as the selected house profile. Do not make client values optional with house fallbacks. Keep any independently valid palette-only legacy mode explicit about its limited capability.
4. Map Paper and Slides template slots to semantic brand roles. Rename lede→lead through callers, exports, fixtures, documentation, and inspectors. Do not mechanically equate statement with lead or meta with caption without checking the content job.
5. Apply size, family, weight, leading, tracking, and relevant measure/features/axes. Preserve static-font fallbacks and licensed embeddings. If a renderer cannot support an approved axis or font, report the capability mismatch; do not silently flatten it.
6. Recompute columns, slots, pagination, figure dimensions, and inspector bounds whenever geometry changes. Fixed documents use approved static profiles; no accidental vw/vi fluid type from web CSS. Text overflow triggers composition/reflow decisions, not silent shrinking.
7. Update UI and brand guidance to teach the common roles and calculations, native states, and CRFT's actual shipped grammar. Brand source remains the vocabulary owner; skills explain consumption and judgment rather than copying a full token catalog or scale formula.
8. Render both synthetic brands through Figure, Paper, and Slides and compare with the CRFT proof. Record source checks, rendered facts, and human acceptance separately. List remaining consumers needing follow-up units.

## Acceptance and verification

AK1 covers A1/A4/A5/A6/A8 and the consumer side of A7. It preserves browser behavior A3 wherever output has interactive controls.

Confirmed existing checks:

```sh
bun test skills/figure/brand-os.test.ts
bun test skills/paper skills/slides
bun run check
```

Choose focused regressions during implementation, then run the required repository check. Confirm actual render/inspect commands in each skill; do not guess their CLI flags. If skill names or links change, follow the existing home-link workflow; ordinary source edits do not justify reinstalling everything.

Required rendered cases:

- An 8+ page report with contents, long headings/labels, dense tables, figures, and flowing text. Verify actual output size, margins, pagination, reading order, embedded fonts, and effective type sizes.
- A small deck with a cover, text-heavy slide, comparison, table/chart, and closing slide. Verify artboard calibration, slots, figure labels, static type, and no clipping.
- A figure placed in both outputs, with label readability evaluated at its placed size rather than only at the source canvas size.
- One fluid web brand and one static, visually different brand, using the same role mappings and content structure. Explicit brand omissions must trigger named errors for required roles.
- Unsupported theme/axis/mapping cases fail before misleading output. No house typography or invented dark palette silently enters client output.
- A fresh agent reads the brand context and skill, selects roles by purpose, and explains the source and format mapping without needing the original chat.

## Deliver integration evidence

Record adapter/context version, exact brand package identity, output paths, rendered and PDF inspection results, font substitutions made only for tests, limitations, and the remaining consumer inventory. Passing tests with substitute fonts does not establish fidelity to the original brand font.

The shared contract should enable distinct client expression. If skill defaults repeatedly override brand decisions, fix the ownership boundary rather than adding per-client flags.
