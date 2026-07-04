---
scope: craft
layer: implementation-bridge
triggers:
  - implementation
  - project structure
  - local conventions
  - conflict
  - bridge
updated: 2026-07-03
---

# Implementation bridge

Craft is backbone, not full stack. Use this bridge when applying craft inside any project implementation.

Related: `AGENTS`, `README`, `token-contract`, `styling`, `components`, `platform`.

## Ownership boundary

| Owner | Owns |
| --- | --- |
| craft | strategy, token language, accessibility, performance posture, CSS ownership principles, component boundary rules |
| project implementation | files, folders, build tools, component syntax, routing, data loading, scripts, tests, deployment commands |
| project agent contract | mapping from craft topics to local files, commands, conventions, and exceptions |

Craft should not name implementation package internals. Implementation docs should map craft into local structure.

## Precedence

1. Security, accessibility, data-loss, and legal constraints.
2. Project goal, scope, and explicit human task.
3. Project implementation contract and existing safe local patterns.
4. Craft `Status: Must` rules.
5. Craft `Status: Default` rules.
6. Craft examples as guidance only.

If project implementation conflicts with craft Default, use project pattern and name reason. If project implementation conflicts with craft Must, pause unless hard constraint makes craft impossible.

## Agent routing

When applying craft in a project:

1. Read project `AGENTS.md` or equivalent local contract.
2. Read craft `AGENTS.md` and matched craft topics.
3. Map craft concepts to local implementation files through project docs.
4. Do not invent new file structure because craft shows ownership layers.
5. Do not copy craft examples as implementation/component syntax unless project uses same syntax.

## Conflict examples

### CSS ownership

Craft says token source, reset baseline, typography layer, grid layer, primitive layer, component-owned styles.

Project decides exact files or build layers.

Decision: keep ownership jobs; follow project file names.

### Component syntax

Craft says component boundary earns itself through reuse, state, complexity, authoring clarity, or primitive ownership.

Project decides whether that boundary is HTML include, template, component file, server component, or local markup.

Decision: use project component syntax; preserve craft boundary logic.

### Tokens

Craft names token families and final consumed tokens.

Project decides actual values and whether tokens are fluid, direct media overrides, generated, or hand-authored.

Decision: components consume final craft token names when project has adopted them; implementation owns derivation.

## Implementation doc requirement

Each implementation package should document:

- where token source lives;
- where component-owned styles live;
- how routes/pages own section CSS;
- how to run checks/build;
- how craft topics map to local files;
- known overrides from craft defaults.
