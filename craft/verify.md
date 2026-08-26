---
title: CRFT verification
status: canonical
owner: verify
read_when: Planning acceptance, reviewing a frontend, running checks, comparing a reference, or reporting completion and uncertainty.
---

# Verification

A missing check is not a pass. Record each applicable check as **Pass**, **Fail**, **Blocked**, **Not verified**, or **Not applicable**.

## Three gates

### Deterministic

Use repository and contract checks to prove source facts:

```sh
node scripts/check-system.mjs
node --test scripts/*.test.mjs
cd reference && bun run test
```

Deterministic checks can verify files, token names, selectors, attributes, grammar, examples, copy integrity, and built reference contracts. They cannot prove strategy, accessibility, visual quality, or full browser behavior.

### Judgment

Review:

- product outcome and page argument;
- content hierarchy and nearby evidence;
- composition, rhythm, density, type, color, and media;
- semantic structure, source order, state, and component boundaries;
- copy function and unsupported claims;
- accessibility and project ownership;
- responsive decisions and intentional departures;
- code and interface economy.

State the evidence for each material judgment. Do not turn preference into a defect.

### Rendered

Use a real browser. Verify relevant:

- large, medium, and small container states;
- source and focus order;
- default, hover, active, focus, selected, expanded, disabled, pending, loading, success, error, empty, offline, and unavailable states;
- long, short, and translated content;
- keyboard path and overlays;
- color schemes, skins, accents, contrast, and focus;
- zoom, text resize, wrapping, targets, and overflow;
- reduced motion and unsupported-feature fallbacks;
- media crop, loading, layout stability, console, and network;
- measured performance when required.

```sh
cd reference && bun run test:rendered
```

The reference proves selected CRFT behavior. Product acceptance requires the product’s own routes, content, states, browsers, and assistive technologies.

## Responsive and state matrix

Choose test sizes from content and supported behavior. For CRFT grid work, include `c="sm"`, `c`, `c="lg"`, nested section boundaries, intrinsic header/footer containers, and the no-container stacked fallback.

Exercise every state that can occur. Do not mark a state not applicable because the fixture omits it when the product can produce it.

## Reference-led fidelity

Compare only evidence that was supplied or inspected:

- hierarchy and geometry;
- rhythm and alignment;
- type and color relationships;
- layers and boundaries;
- media crop and focal point;
- signature moves;
- responsive and interactive states present in the evidence.

Record intentional departures. Do not claim pixel fidelity beyond the inspected source, viewport, state, browser, font, or asset.

## Ownership review

Confirm one owner for each rule, current public hooks, private-state exclusion, project-owned component presentation, earned wrappers and components, shallow nesting, and no avoidable utility, flag, dependency, or runtime.

Search all consumers before deleting a selector, token, file, or generated artifact.

## Copy review

Check headline function, supporting specificity, nearby proof, action names, labels, constraints, errors, recovery, pending language, completion language, and unsupported claims.

## Report

Report:

1. outcome and changed behavior;
2. exact file and owner changes;
3. public API effects or confirmation of none;
4. deterministic results;
5. judgment findings;
6. rendered coverage;
7. performance evidence when applicable;
8. blocked and not-verified checks;
9. remaining risk and uncertainty.

Lead with a failure, blocker, or material limit. Do not hide it after passing checks.

## Common mistakes

- Treating a static checker as rendered or accessibility evidence.
- Testing only one viewport or happy state.
- Claiming fidelity beyond supplied evidence.
- Reporting confidence instead of observed results.
- Omitting blocked or not-verified checks.
- Running broad tests before a focused failing check identifies the owner.
- Calling the reference a product acceptance suite.

## Completion

A frontend is complete only when each applicable gate has explicit evidence and no unresolved failure blocks its product outcome, task path, accessibility, public contract, or supported fallback.
