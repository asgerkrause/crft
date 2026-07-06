---
scope: craft
layer: agent-contract
updated: 2026-07-06
---

# Craft agent contract

## Goal

Apply `CRAFT.md` as universal frontend source truth: strategy-first, aesthetic-high, performance-native, accessible, tokenized UI guidance.

## Source boundary

- This folder is self-contained.
- `CRAFT.md` is canonical and complete.
- Project context may override Craft only when project goal, brand, accessibility, security, performance, or existing safe local pattern demands it.
- Craft skill source lives in `skills/`; deterministic helpers live in `scripts/`; installed Pi copies may mirror them under `~/.pi/agent/skills/` and `~/.pi/agent/scripts/`.
- Do not require external folders, local paths, private project names, implementation package docs, generated build artifacts, or legacy migration maps.

## Retrieval order

1. Read `CRAFT.md`.
2. Use project `AGENTS.md`, brand, stack, and local implementation docs before forcing sample syntax.

No topic-file hopping. No appendix routing. No full-folder load unless auditing this folder itself.

## Apply rules

- `CRAFT.md` hard rules block unless project constraints make them impossible.
- Project brand owns voice and visual direction.
- Project implementation owns files, framework syntax, commands, tests, and deployment.
- Craft examples teach structure and token names, not values.
- Prefer semantic HTML, tokens, CSS, native platform, existing helpers, then small custom code.
- Verify visible behavior for UI/token/style changes.

## Publish guard

Before claiming docs publish-ready:

```sh
find . -maxdepth 2 -type f ! -path './.git/*' ! -path './.pi/scratch/*' | sort
rg -n 'patterns\.md|migration\.md|examples\.md|grid\.md|implementation-bridge\.md|naming\.md|platform\.md|token-contract\.md' *.md
rg -n '^(Relat(e)d:|Rule(s):)' *.md
```

Expected source set: `CRAFT.md`, `AGENTS.md`, `README.md`, `skills/*/SKILL.md`, `scripts/*`, optional repo adapter files.
