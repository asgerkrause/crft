# seess handoff

## Current state

Local Phases 1–4 are complete on `main` at `45b55d7`.

Implemented:

- repaired and synchronized public contract documentation;
- versioned finding/report contracts with strict validation and redaction;
- static reference fixtures and checks;
- local `seess` analyzer commands: `adopt`, `verify`, `audit`, and plan-only `migrate`;
- complete adoption-tree evidence, blocked-evidence propagation, bounded stable reads, and lexical CSS import analysis;
- private staged adoption with atomic target claim and inode-checked cleanup;
- Chromium rendered reference acceptance;
- Craft replacement benchmark protocol;
- optional hosted-audit architecture and threat model.

Canonical `global.css` and `styles/*.css` were not changed by this roadmap.

## Fresh evidence

Latest full verification:

```text
node --test                    70/70 pass
node scripts/check-system.mjs PASS
cd reference && bun run test  PASS
cd reference && bun run test:rendered 5/5 pass
security review               PASS within documented local threat model
```

Worktree is clean. No push, deploy, publish, external consumer mutation, or Craft retirement claim has occurred.

## Trust boundary

The local CLI requires a stable developer-controlled filesystem during each command. It does not defend against an untrusted process concurrently replacing source directories or files. `adopt` atomically claims an absent target and never overwrites a competing target.

Hosted operation remains unauthorized. Any future service must use immutable private snapshots and satisfy `docs/decisions/hosted-audit-boundary.md`. Eve is intentionally rejected for the first hosted implementation because the required workload is a bounded deterministic job.

## Remaining gates

1. Select real consumer repositories and obtain explicit authority before reading or mutating them.
2. Run baseline `audit`/`verify`, classify findings, and migrate one complete user-visible slice at a time.
3. Complete the Craft capability disposition and benchmark with real consumer evidence.
4. Obtain explicit authority before any push, external mutation, dependency change, repository creation, production configuration, deploy, publish, or release.
5. Retire Craft only after all known consumers are migrated or exempted, no active imports remain, and replacement gates pass.

## Cleanup

Stale Herdr worker panes were closed; only the root seess pane remains. Historical isolated worktrees remain under `.pi/scratch/worktrees/` for auditability and can be removed separately when desired.
