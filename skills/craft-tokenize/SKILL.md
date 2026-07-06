---
name: craft-tokenize
description: Map existing frontend CSS variables, classes, themes, and component variants into the Craft token/registry model. Use when creating token catalogs, filling CRAFT.md frontmatter/registries, auditing variable roles, or planning token adoption without blind migration.
scope: craft
layer: skill
updated: 2026-07-06
---

# Craft Tokenize

## Goal

Turn local CSS/design vocabulary into a clear Craft registry without guessing or blind migration.

## Inputs

- Project CSS/token files.
- Component primitives and variants.
- Theme declarations and data attributes.
- Global or project `CRAFT.md`.

## Flow

1. Read Craft token contract.
2. Find local variables/classes/themes with safe grep.
3. Group by role:
   - layout/stack;
   - space/shape;
   - typography;
   - color/state;
   - element skin;
   - motion;
   - interaction state;
   - primitives/utilities;
   - private hooks.
4. Classify each item:
   - exact Craft match;
   - project-owned alias;
   - one-off local var;
   - drift/unknown.
5. Build registry tables for `CRAFT.md` frontmatter/body.
6. Report migration candidates separately. Do not edit implementation unless explicitly approved.

## Safe grep examples

```sh
rg -- '--[a-z][a-z0-9-]*' src
rg -- 'data-theme=' src
rg -- 'class="[^"]*(btn|crd|\bc\b|\bw\b|t-|c-)' src
rg -- '\[(g|c|r|o|in)=' src
```

Always pass `--` before patterns that may start with `-`.

## Output

```md
## Tokenize result

## Exact Craft matches
| Local | Craft role | Source |

## Project-owned aliases
| Local | Craft family | Reason | Source |

## One-off locals
| Local | Owner | Upgrade trigger |

## Drift / unknown
| Local | Why unclear | Needed evidence |

## Suggested CRAFT.md registry delta
```

## Rules

- Do not blind replace short variables like `--s`, `--i`, `--t`, `--c`.
- Do not invent values or meanings from names alone.
- Prefer local vars for one-off art direction.
- Prefer source evidence over naming vibes.
- Keep old-world migration maps out of canonical Craft unless user explicitly asks.
