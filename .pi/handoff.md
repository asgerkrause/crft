# seess handoff

## Status

The repository was moved from:

```text
/Users/krause/Downloads/snz-css-token-system
```

to:

```text
/Users/krause/Development/seess
```

The previous Pi session could still read absolute paths but could not execute shell or mutation commands because its original working directory no longer existed. Continue from the new directory.

No Git repository was present before the move. Git has not been initialized. No baseline commit, dependency installation, deployment, push, or external consumer mutation has been performed.

## Product decision

The system is named **seess**.

Recommended naming:

- system/repository: `seess`
- CLI: `seess`
- commands: `seess adopt`, `seess audit`, `seess verify`, and later `seess migrate`
- optional hosted product: `seess audit`
- optional hosted repository: `seess-cloud`

Positioning:

> seess is the CSS foundation and frontend migration system intended to replace Craft.

It is Craft's successor candidate now. Declare it the sole source of truth only after capability disposition, real consumer migrations, and replacement gates pass.

`snz-tokens` was rejected because the system owns more than tokens. Avoid names implying a component library or making the agent technology the product.

## Canonical architecture

Keep the canonical CSS dependency-free:

```text
seess/
├── global.css
├── styles/          # canonical CSS owners
├── scripts/         # canonical checks and adoption
├── reference/       # isolated Astro specimens and rendered fixtures
├── tooling/         # future local audit CLI
├── .agents/         # seess skill
├── docs/decisions/  # future contracts and RFCs
├── README.md
└── AGENTS.md
```

Ownership remains:

- CSS: behavior, values, formulas, breakpoints, selectors
- `README.md`: public handbook
- `AGENTS.md`: repository constraints
- skill: mode routing, commands, stop conditions
- scripts/tooling: deterministic operations and evidence
- `reference/`: specimens and rendered verification only

Keep `reference/` in this repository for atomic API/specimen/test changes. It must remain optional, isolated, static, excluded from adoption, and unable to own canonical behavior. A future marketing site, account dashboard, or hosted agent should live separately.

## Completed consolidation

Already completed before this handoff:

- removed duplicate root reference ownership;
- deleted root `index.html`;
- moved root `index.css` to `reference/src/styles/reference.css`;
- updated `reference/src/styles/entry.css`;
- moved placeholder SVG under `reference/src/assets/`;
- removed Lenis and remote `unpkg.com` runtimes;
- separated canonical checks from Astro reference checks;
- added `.gitignore` for generated/scratch artifacts;
- updated `AGENTS.md` and `README.md` for the consolidated reference boundary;
- preserved production files under `styles/*.css`, `global.css`, and the public API.

Last known passing evidence:

```text
PASS: static contract — 156 public tokens, 7 private properties, 7 production layers
4/4 node:test checks passed
PASS: Astro reference — 13 sections, 156 public tokens, 3 emitted asset references, no hydrated islands
scripts/copy-system.mjs --dry-run passed without creating files
```

Rerun these checks fresh from the new location before relying on them.

## Known Phase 1 correctness issues

Repair before broader tooling:

1. `data-accent="accent"` is permitted in `AGENTS.md` and the skill but absent/retired in the CSS and `README.md`. Establish one exact supported set and verify all public surfaces. Current intended explicit routes appear to be `secondary`, `tertiary`, `success`, `warning`, and `danger`; verify from canonical CSS before editing rather than trusting this handoff.
2. Adoption promises copied files remain unchanged, but prior guidance suggested consumer changes in copied `styles/project.css`. Clarify:
   - canonical repository work may edit canonical `styles/project.css`;
   - adopted consumers leave the copied tree unchanged;
   - consumer rules live outside the adopted tree in a later consumer-owned `@layer project`.
3. Remove or derive any hard-coded public-token count in `reference/src/data.ts` or related reference copy.
4. Slim `.agents/skills/snz-css-system/SKILL.md` into a router. Do not duplicate the complete handbook.
5. Rename product/documentation identity to `seess` without changing selectors, token names, entrypoint names, or CSS behavior during this slice.

Acceptance tests requested by prior review:

- exact `data-accent` synchronization across CSS, `README.md`, `AGENTS.md`, skill, and reference, robust to quoting;
- adopt into a fixture, add consumer rules outside the copied tree, and verify adopted hashes remain unchanged;
- entrypoint verification fails for zero and multiple resolved `global.css` imports.

The latter two may land with the adoption verifier rather than Phase 1 if that keeps the first change narrow.

## TypeScript decision

Do not add a root TypeScript toolchain yet.

Use:

- Node ESM (`.mjs`) for root tools;
- JSDoc for structured types;
- JSON output for machine-readable reports;
- TypeScript inside `reference/`, where Astro already owns it.

Reconsider TypeScript only when several tools share and transform a non-trivial versioned domain model. Do not add dependencies without explicit approval.

## Product boundary

First product:

> seess adoption audit and drift guard

It may:

- validate adoption integrity;
- inspect an explicit project root and CSS entrypoint;
- identify deterministic violations;
- inventory heuristic migration candidates;
- emit evidence-backed migration plans;
- prevent contract drift.

It must not:

- automatically migrate arbitrary CSS;
- prove visual equivalence from static source;
- delete selectors or rewrite projects;
- execute consumer code by default;
- modify repositories;
- claim accessibility without rendered evidence.

Every finding must distinguish authority:

- deterministic: exact contract pass/fail;
- heuristic: inventory candidate;
- judgment: proposed mapping;
- rendered: user-visible behavioral evidence.

No finding authorizes deletion automatically.

## Craft replacement direction

Replace Craft through disposition and proof, not wholesale copying.

Transfer useful methods:

- `observed / inferred / unknown / blocked` evidence labels;
- deterministic, judgment, and rendered verification gates;
- accessibility and state coverage;
- concise finding format: `path:line — rule ID — evidence — smallest fix`;
- dry-run, machine-readable reports, preservation by default, explicit force/refusal on ambiguity.

Do not copy:

- Craft component primitives;
- Craft tokens;
- `data-theme`;
- viewport grid grammar;
- automatic entrypoint mutation;
- broad utility/component doctrine.

Create a disposition table for every meaningful Craft capability:

```text
Craft capability
→ existing seess equivalent
→ migrate into seess
→ keep project-owned
→ intentionally reject
→ needs consumer evidence
```

Retire Craft only after known consumers are migrated or exempted, no active imports remain, required guidance has moved, Craft-only behavior has a disposition, and seess verification passes.

## Approved phase plan

### Phase 1 — Contract repair

- fix accent synchronization;
- clarify consumer project-layer ownership;
- remove hard-coded counts;
- slim the skill;
- rename product identity to seess without public CSS API changes.

### Phase 2 — Finding contract

Define a versioned JSON/JSDoc finding schema with:

- rule ID;
- analyzer and seess versions;
- path/range;
- evidence;
- classification;
- confidence;
- status;
- safe next action;
- redaction rules.

### Phase 3 — Local analyzer

Initial commands:

```sh
seess adopt
seess audit
seess verify
```

`seess migrate` initially produces a plan only.

Safety:

- read-only;
- explicit root and entrypoint;
- no framework guessing;
- no project code execution;
- no model calls by default;
- exclude secrets, dependency trees, generated output, and paths outside the explicit root;
- treat repository content as untrusted input.

### Phase 4 — Stronger verification

Add copier failure/cleanup tests, analyzer fixtures, and browser-backed acceptance for grid/container behavior, type roles, skins, focus, reduced motion, native controls, and unsupported-feature fallbacks.

### Phase 5 — Frontend-quality reference

Add one on-demand reference under the skill, likely:

```text
.agents/skills/seess/references/frontend-quality.md
```

or preserve the existing skill path during the first rename if renaming it would create avoidable churn.

It should contain only migration evidence and frontend verification guidance, not a second CSS doctrine.

### Phase 6 — Design-partner migrations

Benchmark at least:

1. content-heavy site;
2. application UI;
3. strongly branded client project;
4. Craft as a comparison consumer.

Measure:

- time to first verified slice;
- deterministic finding precision;
- false-positive review cost;
- residual project CSS;
- shared API exceptions;
- accessibility/state defects;
- responsive correctness;
- post-adoption drift caught.

Set thresholds before seeing results.

### Phase 7 — Optional online layer

Only after recurring value is proven:

```text
local analyzer / CI
        ↓ opt-in findings metadata
Vercel control plane
        ↓
dashboard, baselines, review, trends
```

Keep raw source local by default. A stateless Vercel preview may use public or synthetic input first. No production deploy without explicit approval.

Eve remains undecided. Evaluate it only if customers need scheduled multi-repository checks, resumable jobs, approval queues, long-running state, or human-approved PR workflows. Eve may orchestrate the analyzer but must never own analyzer rules or CSS semantics. Current authoritative evidence for Vercel's Eve product status, durability, sandboxing, and security is insufficient.

## Parallel build plan

Do not run one implementation pane per phase. Use dependency-aware waves and at most four active writing lanes.

### Setup

1. Inspect the moved workspace and ignored/generated files.
2. Run fresh baseline checks.
3. Classify workspace state.
4. Initialize Git only with user authority.
5. Creating a baseline commit also requires explicit commit authority.
6. After a baseline commit, create isolated branches/worktrees for writers.

No Git repository existed at handoff time. Without Git/worktrees, use read-only subagents and keep all writes in one pane; conflict-free parallel writing cannot be guaranteed on a shared filesystem.

### Wave 1

- Lane A, writer: Phase 1 contract repair and seess naming.
- Lane B, read-only: finding-schema design.
- Lane C, read-only: rendered-test matrix.
- Lane D, read-only: Craft capability/disposition audit.

Lane A exclusively owns during this wave:

- `AGENTS.md`
- `README.md`
- `.agents/skills/snz-css-system/SKILL.md`
- `scripts/check-system.mjs`
- `scripts/check-system.test.mjs`
- relevant hard-coded reference data/copy file

Integrate and verify before Wave 2.

### Wave 2

Parallel exclusive writers:

- finding contract and tests;
- Astro rendered fixtures/checks;
- frontend-quality reference;
- Craft replacement benchmark protocol.

The root orchestrator alone adjusts shared pointers in `README.md`, `AGENTS.md`, and the skill.

### Wave 3

Freeze rule/finding interfaces, then split:

- analyzer core/CLI and safe traversal;
- adoption-integrity rules;
- consumer API rules;
- analyzer fixtures/tests.

Initial deterministic rules:

- copied tree matches pinned canonical source;
- expected files exist;
- explicit entrypoint resolves adopted `global.css` exactly once;
- copied files remain unchanged;
- consumer project rules remain outside the copied tree;
- private properties and retired API are absent;
- supported attribute values are respected where statically provable.

### Wave 4

- read-only code review;
- read-only security review;
- first real consumer migration;
- Craft benchmark preparation.

### Wave 5

Run three migrations in separate consumer repositories using one frozen protocol. Do not modify external repositories without explicit authority.

### Wave 6

Use benchmark evidence to decide replacement status and remaining gaps.

### Wave 7

Only if earned:

- hosted architecture/threat model;
- stateless Vercel preview using synthetic/public input;
- Eve research.

## Conflict-control rules

- One lane owns each file.
- No writer edits another lane's files.
- Shared interfaces freeze before parallel consumers implement against them.
- Integration is sequential.
- Run verification after every integration.
- Reviewers and verifiers remain read-only.
- Stop when a lane needs an unowned file, a dependency, consumer code execution, external source upload, public API expansion, or mutation outside its approved scope.
- Main pane retains canonical CSS ownership unless explicitly delegated.

## Immediate continuation

From a fresh Pi session in `/Users/krause/Development/seess`:

1. Read `AGENTS.md`, this handoff, `README.md`, `global.css`, the seven canonical CSS owners, current scripts/tests, and the local skill.
2. Run:

```sh
node scripts/check-system.mjs
node --test scripts/check-system.test.mjs
cd reference && bun run test
```

3. Inspect generated/ignored files and confirm no secrets or environment files would enter Git.
4. Report the workspace verdict.
5. Ask one concrete confirmation before creating the baseline commit. Do not commit merely because the user previously said `build`.
6. After the baseline commit is explicitly approved, start orchestration and execute Wave 1.

## Authority already granted and not granted

Granted:

- move the repository to `/Users/krause/Development/seess`;
- continue planning/build preparation;
- use parallel lanes under the conflict controls above.

Not yet granted:

- baseline commit;
- push or remote creation;
- dependency installation;
- external consumer modification;
- Vercel deployment;
- production changes;
- Eve integration.
