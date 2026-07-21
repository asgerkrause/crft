# Craft replacement benchmark protocol

**Status:** proposed; Phase 5–7 decision gate.
**Decision:** seess is a successor candidate, not a parity claim or retirement decision. No gate may be passed with unknown, blocked, inferred-only, or unverified evidence.

## Purpose and local authority

This protocol pre-registers how replacement fitness will be evaluated before a design-partner migration starts. It does not authorize a consumer change, source upload, automated rewrite, hosted service, Eve integration, or Craft retirement.

Local governing evidence:

- `.pi/handoff.md` — candidate positioning, Phase 5–7 sequence, intended benchmark measures, preservation-first analyzer boundary, and provisional online-layer direction.
- `README.md#Migration` and `AGENTS.md#Adoption and migration` — one complete verified slice at a time; preserve existing CSS until replacement; retain project-owned rules; search consumers before deletion.
- `README.md#Verification` and `AGENTS.md#Verification` — deterministic checks alone do not prove rendered behavior; verify responsive, accessibility, reduced-motion, and fallback paths.
- `README.md#Extension` and `AGENTS.md#Implementation doctrine` — native behavior and existing public API precede consumer-owned rules; shared API requires repeated evidence.

No external Craft source or consumer evidence is authorized in this lane. Every Craft-specific capability, consumer inventory, baseline, metric result, threshold value, and product-status fact is therefore **unknown** or **blocked** until a permitted evidence run records it.

## Evidence classes

| Class | Meaning | May support |
| --- | --- | --- |
| `observed` | Reproducible local source, command output, or approved migration record with path, revision, method, and timestamp. | A scoped pass or fail only. |
| `inferred` | Reasoned mapping from observed evidence; assumptions named. | Planning only; never a gate pass. |
| `unknown` | Required fact not yet collected. | No decision. |
| `blocked` | Evidence cannot be collected under current authority, access, or safety boundary. | No decision; record blocker and owner. |

Each finding also records verification mode: `deterministic`, `judgment`, or `rendered`. A rendered claim must name browser/viewport or container state, interaction/state coverage, reduced-motion setting where relevant, and capture location. A judgment mapping must identify reviewer and alternatives rejected. Automated output never authorizes deletion.

## Capability disposition register

Register each meaningful comparison capability before migration. A row describes the capability, not an assertion that it exists in Craft. Do not mark `existing seess equivalent` without observed local seess evidence and permitted comparison evidence.

| Disposition | Meaning | Required evidence before use |
| --- | --- | --- |
| `existing seess equivalent` | Existing documented seess behavior meets the approved migration need. | Canonical owner and rendered slice evidence. |
| `migrate into seess` | A missing repeated system role is proposed for shared ownership. | Repetition across unrelated approved consumers; admission, owner, documentation, specimen, and verification evidence. |
| `keep project-owned` | Presentation or behavior stays in the consumer-owned `@layer project`. | Slice evidence that public API cannot express the role and direct local rule preserves behavior. |
| `intentionally reject` | Candidate conflicts with seess boundaries or is not needed. | Local contract citation and approved exception rationale. |
| `needs consumer evidence` | No safe disposition yet. | Approved consumer baseline and migration evidence. |

Pre-registered initial rows:

| Capability area | Provisional disposition | Current evidence | Gate to resolve |
| --- | --- | --- | --- |
| Semantic HTML, native defaults, focus, skins, type, layout, grid, progressive fallback, finite utilities | `existing seess equivalent` for the documented seess surface only; comparison equivalence is `unknown`. | `README.md`, `AGENTS.md`, `global.css`, and `styles/*.css` are local source; no authorized comparison evidence. | Verified consumer slice per applicable area. |
| Shared token, selector, attribute, or utility expansion | `migrate into seess` only if admission evidence appears; otherwise `needs consumer evidence`. | Local admission policy observed; demand evidence unknown. | Repeated unrelated consumer need plus complete public-change verification. |
| Product components, one-off presentation, and consumer-specific responsive details | `keep project-owned`. | Local contract observed. | Verify direct project-layer rule and preserve semantics, states, and fallback. |
| Component-primitive doctrine, broad utility catalog, `data-theme`, viewport grid grammar, and automatic entrypoint mutation | `intentionally reject`. | `.pi/handoff.md`, `README.md`, and `AGENTS.md` prohibit or exclude these approaches. | No migration exception without a new approved architecture decision. |
| Deterministic adoption integrity, explicit entrypoint inspection, finding format, and migration-plan output | `needs consumer evidence`. | Direction is local planning evidence only; implementation/results unknown. | Phase 3–6 approved implementation and benchmark records. |
| Craft-only behavior not covered above | `unknown` / `blocked`. | External Craft evidence is not authorized. | Permitted, versioned comparison evidence. |

## Pre-registration record

Freeze this record before enrolling the first sample. A blank or `TBD` field blocks the affected gate; values must not be chosen after outcome review.

| Field | Pre-registered value |
| --- | --- |
| Protocol version and freeze revision | `TBD` |
| Decision owner and independent reviewer | `TBD` |
| Start/end window and migration time accounting | `TBD` |
| Analyzer/system revision and command versions | `TBD` |
| Supported browser matrix and reduced-motion setting | `TBD` |
| Evidence storage location, retention, redaction, and access controls | `TBD` |
| Threshold values, denominator, rounding, and missing-data handling | `TBD` |
| Approved exceptions and disqualifying conflicts | `TBD` |

### Samples

Enroll at least one approved sample in each slot. Actual repository identities, access, baseline state, and eligibility are unknown until explicit authority is granted.

| Slot | Required characteristics | Baseline required before work | Current state |
| --- | --- | --- | --- |
| `S1` content-heavy site | Content hierarchy and responsive reading layouts. | Entrypoint, affected slice, states, responsive/container states, accessibility baseline, and preserved CSS inventory. | `unknown` |
| `S2` application UI | Native controls, stateful workflows, and responsive layouts. | Same baseline plus state/keyboard coverage. | `unknown` |
| `S3` strongly branded client project | Distinct project-owned visual rules without forcing shared API expansion. | Same baseline plus brand/residual-CSS inventory. | `unknown` |
| `S4` comparison consumer | Approved Craft comparison scope and permitted evidence capture. | Versioned capability inventory and baseline with no source upload outside authorization. | `blocked`: no external Craft/consumer evidence authorized. |

An enrolled sample is excluded only with a dated reason, decision owner, and replacement sample or explicit scope reduction. Exclusion cannot improve aggregate metrics. Record partial migration separately; it is not a successful replacement result.

### Metrics and threshold placeholders

Measure each metric per sample and in aggregate. Report raw numerator/denominator, median and range where time-based, exclusions, and evidence class. Do not aggregate missing values as passes.

| Metric | Definition | Threshold placeholder |
| --- | --- | --- |
| Time to first verified slice | Elapsed active migration time from approved baseline to a slice passing required deterministic and rendered evidence. | `TBD: maximum per sample; aggregation rule TBD` |
| Deterministic finding precision | Confirmed actionable deterministic findings / deterministic findings reviewed. | `TBD: minimum; minimum reviewed count TBD` |
| False-positive review cost | Active reviewer time spent on findings later classified non-actionable / findings reviewed. | `TBD: maximum per sample and aggregate` |
| Residual project CSS | Consumer-owned CSS retained after verified slice, reported as rule count and bytes with reason classification; not a defect by itself. | `TBD: descriptive distribution and any ceiling by sample type` |
| Shared API exceptions | New or requested shared API exceptions per sample, classified admitted/rejected/deferred. | `TBD: maximum admitted exceptions; deferred handling TBD` |
| Accessibility/state defects | Confirmed migration-caused defects found in required keyboard, semantic, state, contrast, and reduced-motion checks / verified slices. | `TBD: maximum; severity policy TBD` |
| Responsive correctness | Required large, medium, and small checks passed / required checks executed, including no-container fallback where applicable. | `TBD: minimum per sample and aggregate` |
| Post-adoption drift caught | Confirmed copied-tree or entrypoint drift detected by verification / seeded or observed drift cases tested. | `TBD: minimum detection rate; required case count TBD` |

A metric is `unknown` when no approved measurement exists and `blocked` when collection exceeds authority. Neither result can satisfy a threshold. Threshold changes require a new protocol version, rationale, and re-run of every affected sample.

## Migration protocol

1. Obtain explicit consumer authority and name one consumer root, CSS entrypoint, approved slice, evidence location, and no-touch paths.
2. Capture baseline without executing consumer code by default: current imports, CSS ownership inventory, semantic markup, states, large/medium/small or equivalent container behavior, keyboard/focus, reduced motion, fallback, and relevant visual captures.
3. Classify every touched rule as native behavior, existing seess API, project-owned residual, shared-system candidate, `unknown`, or `blocked`. Do not map by name or literal similarity alone.
4. Adopt seess only through the approved copier. Import copied `global.css` exactly once; keep the copied tree unchanged, including `styles/project.css`; place consumer presentation outside it in the consumer-owned `@layer project`.
5. Migrate one complete user-visible slice. Preserve source order, meaningful DOM and keyboard order, labels, native controls, color-independent meaning, and useful unsupported/reduced-motion behavior.
6. Run deterministic checks, inspect every reported finding, and capture rendered evidence at required states. Record failures, residual project CSS, shared API exceptions, and unresolved capability dispositions.
7. Search the authorized consumer scope before deleting a selector, variable, file, generated CSS, or import. Absence of search evidence blocks deletion.
8. Independently review the evidence record. Freeze sample metrics before cross-sample comparison. No automated migration, forced rewrite, or deletion is authorized by this protocol.

## Stop rules

Stop the sample and record `blocked` or `unknown` when any condition holds:

- consumer authority, entrypoint ownership, scope, or evidence-retention terms are ambiguous;
- required baseline, source search, state coverage, responsive coverage, rendered evidence, or independent review is absent;
- a change needs a public CSS API, canonical-owner edit, dependency, external access, production action, or consumer mutation not explicitly authorized;
- a required behavior would be replaced by an unverified component, JavaScript state styling, opaque model judgment, or automatic deletion;
- semantic structure, keyboard order, focus visibility, contrast, reduced-motion behavior, or useful fallback regresses;
- a metric denominator, threshold, revision, or missing-data rule was not frozen before enrollment;
- raw source, credentials, secrets, generated output, or out-of-scope paths would leave the approved local boundary.

A stop is not a failure of the consumer or system. It is evidence that the decision remains unmade.

## Phase 6 replacement and retirement gates

Replacement is a go only when every required gate is `observed` and passes its frozen threshold. Until then, status remains **candidate; no parity or retirement claim**.

| Gate | Go condition | Current state |
| --- | --- | --- |
| Sample coverage | `S1`–`S4` enrolled and complete, or each missing slot has an approved exemption that does not make a replacement claim. | `S1`–`S3` unknown; `S4` blocked. |
| Capability disposition | Every meaningful comparison capability is registered and resolved to one allowed disposition with evidence. | Blocked/unknown. |
| Migration safety | Every completed slice has approved scope, deterministic and rendered evidence, preserved accessibility/state/fallback behavior, and deletion search evidence. | Unknown. |
| Metric thresholds | Every required metric meets frozen per-sample and aggregate thresholds; missing/blocked metrics fail the gate. | Thresholds TBD; cannot pass. |
| Consumer disposition | Known consumers are migrated or explicitly exempted; no active imports remain in each authorized scope. | Consumer inventory unknown/blocked. |
| Guidance and verification | Required guidance moved, Craft-only behavior disposed, and seess verification passes at the frozen revision. | Unknown. |
| Retirement decision | Decision owner accepts evidence and records remaining project-owned residuals and exceptions. | Not authorized. |

Retirement is prohibited if any known consumer remains unclassified, any active import remains, any Craft-only behavior lacks a disposition, any required metric is missing, or the comparison evidence is blocked. Retirement means only the explicitly approved scope; it does not imply global parity.

## Phase 7 hosted and Eve go/no-go gates

A local analyzer/CI path remains the default. A hosted layer is not justified by this protocol unless recurring value is observed across approved migrations. No production deployment is authorized here.

| Gate | Hosted control-plane go condition | Current state |
| --- | --- | --- |
| Proven need | Repeated approved users need cross-repository baselines, review, trends, or scheduled checks beyond local analyzer/CI. | Unknown. |
| Data boundary | Raw source stays local by default; only explicitly opted-in findings metadata crosses the boundary; fields, redaction, retention, deletion, and access controls are observed and reviewed. | Unknown. |
| Analyzer authority | Hosted service orchestrates approved analyzer output only; it cannot own CSS semantics, mutate repositories, or turn heuristic/judgment output into deletion authority. | Required constraint; implementation unknown. |
| Threat model | Auth, tenancy, transport, storage, logs, secrets, abuse handling, incident response, and data-subject controls receive an approved threat model and security review. | Blocked: no hosted design authorized. |
| Stateless preview | A Vercel preview first proves the boundary using public or synthetic input only, with no production data or deploy. | Blocked: no Vercel design or authority. |
| Operational fit | Cost, reliability, failure recovery, observability, support ownership, and user consent meet frozen acceptance criteria. | Unknown. |

Eve is **no-go / undecided** unless all hosted gates pass and observed demand specifically requires scheduled multi-repository checks, resumable jobs, approval queues, long-running state, or human-approved PR workflows. Before reconsideration, record authoritative evidence for Eve product status, durability, sandboxing, security, operating model, and failure boundaries. Eve may orchestrate an approved analyzer; it must never own analyzer rules, CSS semantics, source truth, or deletion authority.

## Decision record template

For every sample and gate decision, record:

```text
protocol version / revision:
sample slot and approved scope:
evidence class and verification mode:
source paths, commands, captures, and timestamps:
capability dispositions changed:
metric numerator / denominator / threshold:
residual project-owned rules and reason:
exceptions, blockers, and stop-rule events:
independent reviewer:
decision: go | no-go | blocked | unknown
```

No blank field implies success. A `go` is scoped to the recorded evidence only.
