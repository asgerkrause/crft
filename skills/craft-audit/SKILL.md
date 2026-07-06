---
name: craft-audit
description: Audit frontend/UI code, docs, or designs against a repo CRAFT.md or global Craft contract. Use for UI quality reviews, token/theme/variant drift, accessibility/performance regressions, component bloat, design-system consistency, or before claiming Craft-aligned implementation.
scope: craft
layer: skill
updated: 2026-07-06
---

# Craft Audit

## Goal

Find Craft drift that hurts clarity, continuity, accessibility, performance, or implementation quality.

## Inputs

- Prefer project `CRAFT.md` when present.
- Otherwise read global `~/craft/CRAFT.md`.
- Read changed files, surrounding owners, and visible routes/components.

## Flow

1. Read Craft contract.
2. Scope audit: diff, route, component, page, or whole frontend.
3. Map allowed vocabulary:
   - tokens;
   - data themes;
   - button variants;
   - primitives/utilities;
   - layout attrs;
   - private hooks.
4. Inspect implementation for:
   - unregistered tokens/classes/themes/variants;
   - raw values where tokens should own role;
   - nested `.c`, margin rhythm, wrapper sprawl;
   - JS visual-state choreography;
   - missing semantic HTML/ARIA state;
   - focus/zoom/reduced-motion/contrast issues;
   - avoidable dependency/runtime;
   - vague CTA/error/status copy;
   - component extraction before it is earned.
5. Produce high-conviction findings only.
6. Recommend smallest fix that restores Craft signal.

## Output

```md
## Craft audit verdict
PASS | PASS WITH RISKS | FIX FIRST | BLOCK

## Scope
files/routes/components reviewed:

## Critical
- `path:line` — issue, Craft rule, fix.

## Warnings
- `path:line` — issue, Craft rule, fix.

## Drift map
- tokens:
- themes:
- variants:
- primitives:
- accessibility:
- performance:

## Evidence
checks/screens/routes inspected:
```

## Rules

- Do not nitpick style if outcome still follows Craft.
- Do not invent new Craft rules during audit.
- Prefer deleting drift over adding compatibility aliases.
- Verification is evidence; audit is judgment.
- For implementation fixes, route to build after approval.
