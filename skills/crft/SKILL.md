---
name: crft
description: Build, review, migrate, or extend SNZ frontend design and CSS with CRFT. Use for landing pages, marketing shells, product UI, page and section structure, component and class naming, layout composition, CSS ownership, tokens, skins, type, layout, grid, accessibility, performance, responsive behavior, or rendered verification.
---

# CRFT

CRFT is the standalone SNZ frontend design and CSS source of truth.

## Route

1. Read project instructions and current source.
2. Confirm the adopted CSS tree before treating CRFT as live API:
   - CRFT copy (`styles/global.css` plus `styles/layers/`): use that live CSS.
   - No adopted system: semantic HTML and local project CSS only. Do not invent CRFT, Tailwind, or React into an HTML-first repo.
3. When the project uses CRFT, read `CRAFT.md` in this repo if present. Then read only the owners required by its route.
4. Inspect the project's live CSS before changing or documenting API.

Project source owns product facts. CRFT owns frontend decisions. CSS owns live values and behavior. Examples and references are evidence only.

Match the project's existing naming grammar. If none, prefer a plural collection and a singular unit.

## Work

Use semantic HTML and native behavior before public CRFT API, project CSS, scoped overrides, or JavaScript. Propose shared API only after unrelated consumers prove the role.

Attributes are the finite composition API (`c`, `s`, `t`, `g`, `x`, `y`, `o`, `l`). `data-*` owns inherited canvas and opt-in behavior. Classes own override, recovery, and product use cases. Do not add a spacing, alignment, or display matrix.

`.btn`, `.crd`, and `.lnk` remain project-owned conventions.

Separate observed, inferred, unknown, and blocked claims. Verify deterministic, judgment, and rendered gates independently.

## Stop

Stop when authority, ownership, live CSS behavior, accessibility, source order, keyboard behavior, contrast, reduced motion, fallback, or deletion safety cannot be established.

## Report

Report outcome, owners, public API, residual project CSS, checks, rendered evidence, limits, and uncertainty.
