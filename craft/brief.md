---
title: crft brief
status: canonical
owner: brief
read_when: Recording a supplied product outcome, page argument, content jobs, copy, evidence, or signature moves before implementation.
---

# Brief

General frontend craft and design judgment belong to the project or a companion design skill. crft records system-specific implementation constraints.

Record the job before structure or presentation. This file is a worksheet for product intent and content decisions supplied by project or design authority. It does not create those decisions or prescribe section templates.

## Product record

Record only supported facts. If project or design authority has not supplied a decision, mark it **Blocked**; crft does not choose it.

```text
User:
Decision or task:
Product outcome:
Primary constraint:
Non-goals:
Blocked decisions and owner:
```

Describe the audience through known motivation, prior knowledge, risk, context, and accessibility needs. Do not invent personas or confidence.

Label material claims:

- **Observed:** present in source or supplied evidence.
- **Inferred:** a defensible choice not proved by evidence.
- **Unknown:** available evidence cannot answer it.
- **Blocked:** authority or evidence is missing.

## Page argument

State what the page must help the user:

1. understand;
2. feel;
3. believe;
4. do.

Order content through context, value, mechanism, proof, trust, and action as the material requires. This sequence is reasoning, not a fixed page pattern.

The first screen establishes one thesis, one dominant visual relationship, and one primary action group. Put proof near the claim it supports.

Give each page section one primary job:

```text
Section:
Purpose:
First notice:
Claim, evidence, or task:
Action:
Relationship to adjacent sections:
Unknowns:
```

Rank the thesis and primary task first. Follow with claims, proof, explanation, controls, and metadata. Do not make every section dominant.

See [`examples/page-from-brief/`](../examples/page-from-brief/) for a complete brief-to-page specimen.

## Copy jobs

- Headlines state an offer, outcome, position, or useful tension.
- Supporting copy adds audience, mechanism, constraint, or proof.
- Buttons name actions. Links name destinations or results.
- Labels state purpose. Helper text explains constraints.
- Errors state what happened and how to recover.
- Empty states explain the condition and next available action.
- Status text states progress, completion, or failure without relying on color or motion.
- Claims require supplied evidence.

Remove copy that changes no decision or meaning. Keep one term for one concept.

## Source work

For a URL, screenshot, design file, brief, or existing page, record observed content, geometry, typography, color, media, state, motion, and available widths before implementation.

Separate:

- **System:** repeated roles already owned by crft.
- **Composition:** hierarchy, geometry, rhythm, alignment, and layering.
- **Atmosphere:** media, color, type character, texture, and motion.

Do not turn one reference detail into shared API. See [`examples/page-from-reference/`](../examples/page-from-reference/).

## Signature moves

Record zero to three distinctive relationships approved by project or design authority. For each move, record its strategic job, owner, responsive behavior, static or reduced-motion form, and acceptance evidence.

Prefer one coherent move to several unrelated effects.

## Common mistakes

- Starting from a section library before the page argument exists.
- Treating supplied copy as evidence for an unsupported claim.
- Adding several primary actions with equal emphasis.
- Describing a visual reference as exact when only one viewport or state was inspected.
- Promoting local art direction into crft API.

## Verify

Before implementation, have project authority confirm the outcome, audience, page argument, section sequence, primary action, proof, signature moves, responsive implications, and unresolved decisions. crft records that input; it does not approve it. Keep this record shorter than the content it guides.
