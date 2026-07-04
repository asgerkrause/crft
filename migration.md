---
scope: craft
layer: migration
triggers:
  - migration
  - token migration
  - grep
  - old tokens
  - craft
updated: 2026-07-01
---

# Migration craft

Related: `tokens`, `token-contract`, `naming`, `styling`.

Use only when migration is explicitly approved. Do not migrate active projects by default.

## Safe grep

ID: migration.safe-grep
Status: Must
Triggers: rg, grep, token migration, custom properties, --s, --t, --c
Use when: Searching for CSS custom properties.
Rule: Always pass `--` before patterns that may start with dashes. Use boundary-aware patterns for old short tokens.
Tradeoff: More explicit commands; fewer false positives and no flag parsing bugs.
Override: None.
Tiny example:
Good:
```sh
rg -- 'var\(--(?:gp|pd|br|bw|s|i|t|g|b)\b' src
```
Avoid:
```sh
rg --s src
```

## Never blind replace short tokens

ID: migration.no-blind-short-replace
Status: Must
Triggers: find replace, --s, --i, --t, --c, broad replace
Use when: Migrating old short tokens to craft tokens.
Rule: Do not blind replace `--s`, `--i`, `--t`, `--c`, or single letters. Map by context.
Tradeoff: Slower; avoids semantic color bugs.
Override: None.
Tiny example:
Good: inspect `color: var(--i)` and choose `--c-ink` or `--c-fg` by role.
Avoid: replacing every `--i` with `--c-fg`.

## Old short-token to craft map

ID: migration.old-token-map
Status: Default
Triggers: old short tokens, token map, migration plan
Use when: Planning a migration from old short tokens.
Rule: Use this as starting map, then verify by context.
Override: Existing project token docs or local aliases prove a different mapping.

| Old | New |
| --- | --- |
| `--mw` | `--l-mw` |
| `--mw-sm` | `--l-mw-sm` |
| `--mw-lg` | `--l-mw-lg` |
| `--gc` | `--l-gc` |
| `--cs` | `--l-cs` |
| `--rs` | `--l-rs` |
| `--or` | `--l-or` |
| `--st` | `--l-st` |
| `--px` | `--s-px` |
| `--py` | `--s-py` |
| `--ss` | `--s-ss` |
| `--gp` | `--s-gp` |
| `--gp-xl/lg/sm/xs` | `--s-gp-xl/lg/sm/xs` |
| `--pd` | `--s-pd` |
| `--pd-xl/lg/sm/xs` | `--s-pd-xl/lg/sm/xs` |
| `--br` | `--s-br` |
| `--br-xl/lg/sm/xs/full` | `--s-br-xl/lg/sm/xs/pill` |
| `--bw` | `--s-bw` |
| `--fw-l/r/b` | `--t-fw-l/r/b` |
| `--ff-sans` | `--t-ff-ss` or project alias |
| `--ff-serif` | `--t-ff-se` |
| `--ff-mono` | `--t-ff-mo` |
| `--md-*` | `--t-md-*` |
| `--lg-*` | `--t-lg-*` |
| `--sm-*` | `--t-sm-*` |
| `--h0-*` … `--h6-*` | `--t-h0-*` … `--t-h6-*` |
| `--td-*` | `--m-td-*` |
| `--tf-*` | `--m-tf-*` |
| `--l` | `--c-light` or `--c-light-fixed` by context |
| `--d` | `--c-dark` or `--c-dark-fixed` by context |
| `--a` | `--c-acc` |
| `--ai` | `--c-acc-ink` |
| `--c` | `--c-sec` |
| `--ci` | `--c-sec-ink` |
| `--n00` … `--n100` | `--c-neu-00` … `--c-neu-100` |
| `--a05` … `--a95` | `--c-acc-05` … `--c-acc-95` |
| `--c05` … `--c95` | `--c-sec-05` … `--c-sec-95` |
| `--s` | `--c-bg` or `--c-sur` by context |
| `--i` | `--c-fg` or `--c-ink` by context |
| `--t` | `--c-sur` |
| `--g` | `--c-mut` |
| `--b` | `--c-bor` |

## Phased migration checklist

ID: migration.phased-checklist
Status: Default
Triggers: migration plan, craft migration, token rewrite
Use when: Planning actual implementation.
Rule: Migrate source of truth first, then globals, then primitives, then components, then docs/templates. Verify after each phase.
Override: Migration scope is intentionally narrower and has explicit acceptance evidence.

1. Protect dirty worktree.
2. Write token contract docs.
3. Build craft token engine.
4. Add temporary legacy bridge only if needed.
5. Migrate global CSS files.
6. Migrate shared primitives.
7. Migrate remaining components by group.
8. Sync curated examples.
9. Update package-local docs.
10. Run checks and old-token grep.

## Old-token purge check

ID: migration.old-token-purge
Status: Default
Triggers: verification, old token search, grep purge
Use when: Verifying migration.
Rule: Search old tokens with boundary-aware regex and inspect each hit. Expected hits should be limited to migration docs or an approved temporary bridge.
Override: Old tokens remain only in approved compatibility docs or legacy bridge code with removal trigger.
Tiny example:
```sh
rg -- 'var\(--(?:mw|gp|pd|br|bw|s|i|t|g|b|md-|lg-|sm-|h[0-6]-)\b' <paths>
```
