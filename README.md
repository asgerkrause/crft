---
scope: snz-craft
layer: router
triggers:
  - craft
  - frontend
  - ui
  - implementation taste
  - retrieval
updated: 2026-05-28
---

# Craft

SNZ implementation defaults. Retrieval docs, not prompt doctrine. Use them to make decisions when project context is silent.

## Purpose

Craft docs teach how to think through frontend implementation: structure, semantic HTML, CSS shape, tokens, motion, components, naming, and UI copy process. They are not client brand voice and not project memory.

Canonical path: `~/craft`. Tool-specific paths like `~/.pi/agent/craft` and `~/.codex/craft` should symlink here.

## Sanitize inheritance

Sanitize may remove implementation ceremony: unnecessary dependencies, wrappers, abstractions, custom JS, and premature component extraction. It must not remove craft quality: semantic HTML, accessibility, brand fit, motion comfort, validation, visual hierarchy, responsive rhythm, or client-visible polish.

`craft-check` guards this inheritance by requiring the core platform, extraction, component, styling, form, accessibility, and motion rules that Sanitize relies on.

## Precedence

1. Project `AGENTS.md` — scope, stack, commands, engagement
2. Repo `BRAND.md` — client-facing voice, visual direction, audience
3. `~/.claude/CLAUDE.md` — hard technical, accessibility, and performance rules
4. Existing local pattern — for small changes, unless it violates higher rules
5. `craft/*` — SNZ fallback defaults

For new sections/components, craft carries more weight. For tiny edits inside existing code, preserve local pattern unless it is clearly weaker.

## Retrieval flow

For frontend/UI work, search before reading full files:

```sh
rg -i "hero|cards|grid|aria-expanded|tokens|motion|form|nav" ~/craft
```

Then:

1. Read matching rule blocks or files.
2. Follow `Related` only when it can change implementation.
3. Read max 3 related rules/files per decision.
4. Skip craft for backend-only, config-only, docs-only, or pure Q&A unless exact craft rule matters.

## Rule block format

```md
## Rule title

ID: file.rule-slug
Status: Must | Default | Avoid | Ban
Triggers: keyword, phrase, selector, task language
Use when: Situation where rule changes choice.
Thinking: Decision frame. Required for design/copy rules; optional for technical rules.
Rule: Concrete default.
Tradeoff: What this optimizes and what it costs.
Override: When project context wins.
Tiny example:
Good:
...
Avoid:
...
Related: styling.semantic-selectors, tokens.spacing-scale
```

Status meanings:

- `Must` — accessibility, correctness, or performance. Rare.
- `Default` — preferred SNZ fallback. Most rules.
- `Avoid` — smell; acceptable with reason.
- `Ban` — hard no without explicit instruction. Very rare.

## Promotion rule

Add or upgrade craft only when:

- Same correction happens 2+ times.
- Rule affects accessibility, correctness, or performance.
- Rule defines signature SNZ implementation style.
- User explicitly says “make this craft”.

Every rule must change a decision. If it cannot state `Use when`, `Rule`, and `Override`, it is not ready.

## Review checklist

For UI/frontend review:

- Did worker search craft before meaningful UI implementation?
- Did chosen craft rules affect markup, CSS, tokens, component shape, motion, or copy thinking?
- Did `BRAND.md`, project `AGENTS.md`, or `CLAUDE.md` override craft?
- Did implementation over-apply craft where local project pattern should win?
- Are examples abstracted and free of client/private details?

## File map

- `platform.md` — platform-first HTML/CSS/JS syntax baseline
- `frontend.md` — page anatomy, extraction, implementation posture
- `components.md` — primitives, props, folders, refactor boundaries
- `styling.md` — selectors, state, classes, CSS shape
- `grid.md` — grid attributes, spans, order, responsive layout
- `tokens.md` — spacing, type, color, theme, motion tokens
- `motion.md` — why/when motion, reduced motion, implementation
- `accessibility.md` — a11y entry point for semantics, focus, labels, structure, contrast, motion
- `copy.md` — UX copy jobs, states, forms, nav labels, brand voice boundaries
- `naming.md` — names for components, props, state, primitives
- `navigation.md` — header, nav, menus, active states
- `forms.md` — labels, errors, helper text, submit states
- `sections.md` — hero, feature groups, CTAs, page rhythm, copy thinking
- `examples.md` — larger patterns composing multiple rules
