---
name: craft-css-scaffold
description: Scaffold Craft CSS files into a project with a deterministic script. Use when adding Craft CSS structure, split global CSS files, token starter values, grid/wrapper/motion utilities, or app layout CSS imports without asking an LLM to rewrite boilerplate.
scope: craft
layer: skill
updated: 2026-07-06
---

# Craft CSS Scaffold

## Goal

Install Craft CSS structure safely: valid starter CSS, no blank variables, no blind overwrite, no hand-written boilerplate.

## Inputs

- Global source: `~/craft/CRAFT.md`.
- Script: `~/craft/scripts/craft-css-scaffold.ts`.
- Project facts: framework, existing CSS entry, layout/app entry, token files, existing vars, project `AGENTS.md` / `BRAND.md` when present.
- Optional user notes: `static`, `fluid`, brand/token values to apply after scaffold.

## Flow

1. Read `~/craft/CRAFT.md`.
2. Inspect project facts:
   - package/framework files;
   - existing CSS shell/imports;
   - layout/app entry;
   - existing token variables;
   - whether a fluid system already exists or is requested.
3. Choose mode:
   - `auto` by default;
   - `static` when no fluid system is present or needed;
   - `fluid` only when requested or already clearly used.
4. Run dry-run first:

```sh
bun ~/craft/scripts/craft-css-scaffold.ts --project . --mode auto --dry-run
```

5. Review operations:
   - creates/patches CSS shell;
   - creates missing split CSS files;
   - imports CSS in app/layout only when one clear target exists;
   - reports manual import when target is ambiguous.
6. Run for real only after dry-run looks correct:

```sh
bun ~/craft/scripts/craft-css-scaffold.ts --project . --mode auto
```

7. Apply project-owned values only from source truth or explicit user notes. Do not invent client brand values.
8. Verify app build/lint/visual route when available.

## Script contract

- Generates valid CSS with neutral starter values; never blank vars.
- Existing files are preserved unless `--force` is explicitly passed.
- `auto` chooses `fluid` only when existing CSS clearly has `--l-fluid` or `*-min/max` token config; otherwise `static`.
- `static` ships final Craft tokens directly.
- `fluid` ships starter min/max config plus derived final tokens.
- Structural formulas are allowed: `calc()`, `clamp()`, `color-mix()`, interaction math, scroll scrub vars.
- Project taste values are replaceable defaults, not Craft canon.
- No dependency install.
- No framework ceremony beyond one clear CSS import patch.

## Output

```md
## Craft CSS scaffold
mode:
project:

## Dry-run
operations:

## Applied
files changed:
manual import needed:

## Verification
grep/check/build output:
```

## Rules

- Do not ask an LLM to write all scaffold CSS by hand when the script can generate it.
- Do not overwrite existing CSS without `--force` and explicit user approval.
- Do not force fluid tokens into small/static projects.
- Do not leave unresolved variables in generated CSS.
- If import target is unclear, stop with manual import instruction instead of guessing.
