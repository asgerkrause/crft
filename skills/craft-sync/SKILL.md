---
name: craft-sync
description: Synchronize a project-local CRAFT.md/DESIGN.md with the global ~/craft/CRAFT.md while preserving project-owned overrides. Use when global Craft changes, project craft docs drift, or a repo needs an update report without blindly overwriting local design decisions.
scope: craft
layer: skill
updated: 2026-07-06
---

# Craft Sync

## Goal

Update project Craft contract without losing project-owned truth.

## Inputs

- Global source: `~/craft/CRAFT.md`.
- Project target: `CRAFT.md` or `DESIGN.md`.
- Project facts: token source, component source, brand docs, AGENTS/docs.

## Flow

1. Read global Craft and project Craft.
2. Classify differences:
   - global rule added/changed;
   - project override;
   - project-specific value;
   - stale local rule;
   - conflict requiring human choice.
3. Preserve project-owned values and stack syntax when backed by source.
4. Import global structural improvements only when they do not erase local truth.
5. Mark conflicts explicitly; do not silently choose global over project.
6. Update project Craft only after clear mapping.
7. Keep router docs tiny.
8. Report delta and evidence.

## Conflict policy

- Accessibility/security/performance hard rules beat local preference.
- Brand/source docs beat generic Craft voice or aesthetics.
- Project implementation patterns beat sample syntax.
- Global Craft vocabulary beats unowned local drift unless project source proves it.
- Unknown values stay `Unconfirmed` or are omitted.

## Output

```md
## Sync result
UPDATED | NO CHANGE | BLOCKED

## Imported
- global change -> project section

## Preserved project overrides
- local rule/value -> source evidence

## Conflicts
- issue -> needed decision

## Files touched

## Evidence
```

## Rules

- No blind overwrite.
- No migration appendix by default.
- No duplicate source truth.
- No implementation edits unless separately approved.
