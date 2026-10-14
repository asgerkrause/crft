# Brand OS implementation handoff — BO1

Repository: `/Users/krause/dev/repos/brand-os`.
Read [README](README.md) and [contract](contract.md) first. Status: implementation dispatched separately under current user authority; this handoff does not establish completion.

## CRFT packaging integration

Read the shared contract's approved core3 section and [current CRFT evidence](CORE3-EVIDENCE.md). Semantic cssContractVersion remains 2; packagingVersion 1 describes the flat tokens.css/crft.css package and root manifest. Brand OS web projection belongs in tokens.css, with complete framework token coverage, supported scope rebinding, reduced motion and optional brand faces. Framework selectors stay in crft.css; product presentation stays project-owned. Previous CR1 evidence/hashes are historical. Static format profiles and role mappings remain unchanged by packaging.

## Outcome

One typed brand model preserves shared fluid foundations, modular role steps, approved exceptions, semantic color recipes, and static format profiles. It exports live CSS for CRFT and resolved, provenance-bearing values for AK consumers without competing typography selectors or silent house substitutions.

Blocked by: P0 and CR1's proven recipe fixtures, public inventory, and browser semantics. Read-only schema/consumer inventory can precede CR1. Do not encode a guessed schema in parallel with an unresolved shared contract.

## Current evidence to verify again

- `src/contract.ts` owns a fixed vocabulary. It currently has one ratio for space/gap/radius, no padding family, and layout names such as gutter/width. Type roles include lede, optional h4, quote, and mono.
- `src/build.ts` already emits static typography when minSize is absent and fluid clamp() when present. It already emits live CSS calc() scale relationships. Do not describe all current CSS as flattened constants.
- The current fluid range and root conversion constants are hard-coded; CSS uses vw. Type roles emit `.type-*` selectors as well as variables, potentially competing with CRFT.
- `src/schema.ts` describes dimensions, typography extensions, and format geometry; the current profiles do not carry the complete approved per-format typography mapping proposed here.
- `src/context.ts` and release/distribution code provide existing provenance/version mechanisms. Extend them instead of adding another export platform.
- `test/` is the existing test directory. `tests/` was not present when inspected.
- Prior session evidence found Brand OS without a committed HEAD and with existing untracked work. Recheck its actual state; do not assume a clean baseline or claim a release from an uncommitted tree.

## Owns

Read local `AGENTS.md` first. Candidate owners, constrained by consumer tracing:

- `src/contract.ts`, `schema.ts`, `dtcg.ts`, `tokens.ts`, `check.ts`, `build.ts`, `context.ts`.
- `src/color.ts`, `tones.ts`, `specimen.ts`, `render.ts` when recipe evaluation or proof changes.
- `src/release.ts`, `distribution.ts`, `skills.ts`, and `cli.ts` only where versions, exports, or invocation actually need adaptation.
- Corresponding generated `schema/` files through the existing generator; `test/build.test.ts`, `check.test.ts`, `workflow.test.ts`, `strategy.test.ts` where applicable.
- `README.md`, synthetic `examples/fieldnote/`, and a second deliberately contrasting synthetic fixture if existing fixtures cannot express the proof.

Do not edit CRFT or AK implementation from this unit. Do not rewrite unrelated strategy/intake/voice workflows, install dependencies, publish packages, or edit client brand approvals.

## Work

1. Inventory old token/type names, DTCG aliases, existing exports, schema versions, example inputs, and consumers. Preserve existing approved data; define an explicit migration for lede→lead, removed visual h4, layout names, independent ratios, and retained quote/mono jobs.
2. Extend existing typed schemas to represent literal/alias/step/mix/fluid recipes and format mappings. Preserve explicit units in source. Detect cycles, invalid ranges, missing roles, unsupported axes, and invalid target conversions. Avoid arbitrary expression strings or another token language.
3. Store shared fluid bounds and type foundations, role-to-step mappings, independent spacing-family ratios, explicit step/endpoints, and final-role exceptions. Explicit approved values win over generated values. Keep all role properties, including weight, leading, tracking, measure, case/features, and supported font axes, in the context projection.
4. Emit web token CSS with live approved relationships and documented context rebinding. Match CR1's expected calculations and CSS input convention. Remove competing `.type-*` selectors from the new shared output; migrate existing consumers rather than deleting their styling silently. CRFT owns browser role selectors. Preserve font-face assets and their actual ranges.
5. Add static format profiles and explicit template-role mappings. Resolve exact approved target values first, approved recipes second, and fail missing mappings. A profile may use its own static base/ratio with shared steps. Do not choose a web viewport automatically. Validate minimum type sizes instead of clamping/shrinking them into compliance.
6. Version affected schemas, context, and exports together. Reuse release/adoption identities and existing distribution. Do not claim old context consumers support fields they discard. Expose capabilities and required mappings so AK can fail before rendering an unsupported brand.
7. Produce the two checked synthetic packages and expected web/paper/slide role values for AK1. Keep house format values as an explicit house profile, not fallback defaults in the resolver.

## Acceptance and verification

BO1 covers A1/A2/A4/A5 and the producer side of A6–A8. Run current package commands, after confirming them:

```sh
bun run typecheck
bun test
bun src/cli.ts check examples/fieldnote --json
```

Use `bun src/cli.ts --help` and the relevant subcommand help before assuming build/schema/render flags. Generate schema artifacts through the existing path and inspect the diff. Do not run a write-producing release/publish workflow merely to validate an export.

Required behavior tests:

- Compare role endpoints and representative intermediate/root-size calculations with CR1's fixture expectations; validate all used steps, not just the base role.
- Round-trip recipes and semantic metadata through context/export without losing min values, units, case, features, axes, or approval provenance.
- Explicit step and role overrides survive scale generation. Different padding/gap/radius relationships remain independent.
- Static profiles contain no unresolved viewport dependencies and preserve physical units. Approved artboard scaling recomputes geometry coherently; mere aspect-ratio equality is not authorization.
- Missing type mappings and unsupported font capabilities name the brand, format, role, and required decision. No client output receives house literals implicitly.
- Approved schemes/skins produce correct semantic colors and actual contrast evidence; missing dark/feedback data is handled according to declared capability rather than invention.
- Old/new schema and consumer-version combinations are either deliberately supported with tested translation or rejected clearly. Do not leave permanent undocumented aliases.

## Deliver to AK1

Provide the approved schema/context version, reproducible producer invocation, two synthetic package paths, checked recipe inputs, resolved role/format values, font capabilities/assets, migration table, and source/rendered evidence limits. Pin exact package identity rather than a mutable local name.

The weakest area is format derivation. If repeated overrides demonstrate that a shared ratio does not fit the medium, require explicit format role values while preserving the shared vocabulary.
