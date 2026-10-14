# Shared brand system handoff

Recorded: 2026-10-13. Status: P0 frozen as `brand-system-1`; CR1 implemented locally and verified with the limits below; three-file packaging migration authorized; BO1/AK1 dispatched separately, completion not established here.
CRFT source inspected at `7358c7ef477a0b1890951bc8f967b2bea00f28b1`.

## Start here

AK and the assistant agreed on a direction for one readable brand contract across CRFT, Brand OS, and AK's output skills. This directory preserves that discussion for fresh sessions. Originally the user authorized handoff documents only. On 2026-10-13 AK authorized this session to coordinate P0 and implement CR1. This does not authorize committing, publishing, or editing other repositories.

Read [the shared contract](contract.md), then the relevant repository handoff:

- [CRFT](crft.md): browser reference, selectors, token consumption, contract tooling, examples.
- [Brand OS](brand-os.md): approved brand data, scale recipes, CSS and static exports, versioned context.
- [AK](ak.md): shared brand adapter, UI guidance, Paper, Slides, Figure, and later consumers.

P0 is frozen and CR1 is now implemented in the local working tree. Read current [three-file evidence](CORE3-EVIDENCE.md) and [exact file hashes](CORE3-SHA256.json) before downstream work. [CR1 evidence](CR1-EVIDENCE.md) and [CR1 hashes](CR1-SHA256.json) are historical and identify the preserved pre-packaging baseline. [Local integration evidence](INT1-EVIDENCE.md) records the completed BO1/AK1 implementation snapshots and their limits. CRFT delivery is tracked in [PR #7](https://github.com/sanitizestudio/crft/pull/7); downstream repositories own their separate delivery. Current `AGENTS.md`, `CRAFT.md`, skills, and source describe the implemented CRFT contract. Reinspect source and working-tree changes at the beginning of each session. Do not overwrite unrelated work.

## Decision

Use one shared contract and three bounded implementations. Prove the browser behavior in CRFT first, while keeping Brand OS's data and static-format requirements in the contract from the start. Then implement Brand OS exports and migrate AK consumers. Do not finish an isolated web framework and ask print and slides to accommodate accidental browser assumptions afterward.

CRFT is the first implementation proof. Brand OS is the eventual owner of the machine-readable brand vocabulary and approved recipes. CRFT owns its CSS implementation and adoption API; AK owns output adapters and rendered acceptance. No fourth repository, platform service, component library, or general expression language is proposed.

## Sequence and handoff gates

1. **P0 — Freeze the proposed contract.** Coordinator reviews `contract.md`, resolves its explicitly listed implementation decisions, and records the approved revision. Existing accepted direction should not be reopened without concrete contrary evidence. No parallel worker may independently rename shared roles.
2. **CR1 — CRFT proof and migration.** Implement one coherent browser reference using synthetic fluid and static brands. Deliver the role inventory, recipe fixtures, selector grammar, migration map, and actual browser evidence. See `crft.md`.
3. **BO1 — Brand OS contract and projections.** Use CR1's fixture shapes and proven semantics to implement typed source recipes, live web CSS, static format profiles, and versioned exports. Deliver checked packages and context snapshots. See `brand-os.md`.
4. **AK1 — Shared consumption and output migration.** Consume BO1's versioned artifacts through the existing adapter. Update UI guidance, Paper, Slides, and Figure within their owners. See `ak.md`.
5. **INT1 — Cross-repository acceptance.** Run both synthetic brands through the same web structure, a demanding multipage report, and a small slide deck. Compare computed values, static exports, brand expression, and missing-capability errors. Record source checks, rendered checks, and design judgment separately.

The order identifies concrete artifact dependencies, not a requirement to idle all other work. Read-only consumer inventories may run earlier. Parallel implementation requires frozen shared interfaces and disjoint ownership. Changes to the contract invalidate affected fixtures and evidence; update the coordinator record before downstream work continues.

## Acceptance shared by all handoffs

- **A1 — Vocabulary:** the same role names and meanings are used in data, CSS, exports, and skill guidance. No new visual h4/h5/h6 roles; native heading semantics survive.
- **A2 — Mathematics:** one default fluid range drives endpoint interpolation; modular type steps, explicit endpoint exceptions, static values, and independent spacing scales all work without handwritten slope guesses.
- **A3 — Browser behavior:** native semantics and interactions, container/grid behavior, focus, source order, supported scoped overrides, enlargement, and narrow reflow remain correct.
- **A4 — Typography and fonts:** size, family, weight, leading, tracking, measure, and supported axes preserve approved brand intent. Variable and static font fallbacks, nested emphasis, and font loading are demonstrated.
- **A5 — Static formats:** paper and slide roles resolve through approved format values or recipes. Physical units and artboard geometry are explicit. Missing mappings fail; client output never silently borrows house typography.
- **A6 — Brand expression:** the same content structure supports two visibly different synthetic brands without introducing per-brand component forks. Approved client rules outrank house taste.
- **A7 — Adoption:** schemas, context versions, CRFT manifests/checkers, migration guidance, and existing consumers agree. Unsupported old/new combinations fail clearly.
- **A8 — Agent use:** a fresh agent can choose roles, explain derivations, and produce an output without inventing token names, ignoring missing mappings, or duplicating the scale engine.

## Fresh-session starting prompt

> Read `/Users/krause/dev/repos/crft/handoffs/brand-system/README.md`, `contract.md`, and the handoff for your repository. Read local instructions and current source. Treat these files as the design handoff, not proof of implemented behavior. Report current drift, the assigned unit's exact scope, and any unresolved contract decision. Implement only when this session explicitly authorizes the unit. Preserve the accepted shared fluid range, modular type steps, semantic roles, readable names, and native HTML strategy. Finish with actual checks and the artifact needed by the next repository.

For a later authorized implementation, name the unit explicitly: CR1, BO1, or AK1. Start with CR1 after P0. A new session should not migrate all three repositories opportunistically.

## Evidence and limits

The source and historical CRFT transitions were inspected during the discussion. An independent Claude Opus 5.5 review at xhigh challenged grid behavior, naming, variable inheritance, and cross-format mappings. The coordinator retained some different naming judgments; the decisions in `contract.md` supersede earlier conversational alternatives.

A numerical check compared the proposed shared-length interpolation against the existing slope formulation for seven steps, six viewport widths, and three root font sizes. Maximum floating-point difference was approximately `2.84e-14` CSS px. That is mathematical evidence only, not a browser, accessibility, or visual acceptance result.

CR1 implementation and Chromium evidence now accompany these handoffs; see [the check results and limits](CR1-EVIDENCE.md). Desktop browser zoom, Firefox/WebKit, human acceptance and cross-format proof remain unverified. The weakest assumption is that a shared hierarchy will need relatively few format-specific exceptions. If real brands require many, preserve explicit format values rather than forcing a universal ratio.
