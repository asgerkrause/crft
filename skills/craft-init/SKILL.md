---
name: craft-init
description: Create or update a project-local CRAFT.md from the global Craft contract. Use when starting frontend/UI work in a repo, adding Craft to a project, adapting Craft to an existing stack/design system, or generating a repo-specific CRAFT.md/DESIGN.md without implementing code.
scope: craft
layer: skill
updated: 2026-07-06
---

# Craft Init

## Goal

Create one project-local craft contract agents can read before UI work.

## Inputs

- Global source: `~/craft/CRAFT.md`.
- Project facts: local `AGENTS.md`, `BRAND.md`, stack docs, CSS/token files, component primitives, routes, visual conventions.
- Optional target name: `CRAFT.md` by default, `DESIGN.md` only for public design-system/export use.

## Flow

1. Read global `~/craft/CRAFT.md`.
2. Read project context and existing frontend source. Do not invent values from Craft.
3. Extract local facts:
   - token files and variable names;
   - data themes;
   - button/card/input/header/footer primitives;
   - layout attributes/classes;
   - framework/component syntax;
   - verification commands.
4. Decide output:
   - `CRAFT.md` for internal agent source truth;
   - `DESIGN.md` for public design-system docs.
5. Write one project-local contract:
   - preserve Craft rule intent;
   - replace generic registries with project-owned names/values only when proven;
   - mark unknowns as `Unconfirmed`, not invented.
6. Keep project `AGENTS.md` as router only: “read `CRAFT.md`”.
7. Stop with summary and evidence. Do not refactor implementation unless separately approved.

## Output shape

```md
---
name: <Project Craft>
status: canonical
scope: frontend
source: global Craft + project facts
values: project-owned
---

# Craft

## Use
## Overview
## Tokens
## Themes
## Primitives
## Components
## Interaction
## Accessibility
## Performance
## Verification
```

## Rules

- One source truth per repo.
- No topic-file maze.
- No migration appendix by default.
- No token values unless found in project source or explicitly supplied.
- Project brand owns voice and visual direction.
- Project implementation owns framework syntax and commands.
- If local code conflicts with global Craft, name conflict and choose safer/project-owned path.
