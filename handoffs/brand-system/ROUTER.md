# Brand system agent router

Give this file to any agent working on the shared CRFT, Brand OS, and AK migration.

The handoff directory is `/Users/krause/dev/repos/crft/handoffs/brand-system/`. Links below resolve relative to this file, not your working directory. If you receive this file as an attachment or pasted text, read the linked files from that directory. Do not guess missing contents.

## Choose your route

Use the user's or coordinator's explicit assignment first. Otherwise identify your current repository with `git rev-parse --show-toplevel` and select its route below. This also applies to a worktree of the named repository. Receiving this file alone does not make you the coordinator.

| Assignment or repository | Unit | Read after the shared files | Implementation scope |
| --- | --- | --- | --- |
| CRFT engineer / `crft` | CR1 | [crft.md](crft.md) | `/Users/krause/dev/repos/crft` or its assigned worktree |
| Brand OS engineer / `brand-os` | BO1 | [brand-os.md](brand-os.md) | `/Users/krause/dev/repos/brand-os` or its assigned worktree |
| AK engineer / `ak` | AK1 | [ak.md](ak.md) | `/Users/krause/dev/repos/ak` or its assigned worktree |
| Explicitly assigned coordinator or integration reviewer | P0 / INT1 | All three repository handoffs | Shared decisions and integration review; edits only within the explicit assignment |

If neither assignment nor repository identifies a route, read the shared files and ask which repository you own. Do not choose another agent's scope. An explicit assignment to another repository takes precedence over the directory where your session happened to start.

## Read in this order

1. Applicable `AGENTS.md` instructions for your assigned repository.
2. [README.md](README.md): purpose, sequence, acceptance criteria, and evidence limits.
3. [contract.md](contract.md): accepted direction, proposed details, and decisions still to freeze.
4. Your repository handoff from the table. Engineers do not need all three unless a specific dependency requires another owner's detail.
5. The actual source, owner documents, and skills required by that handoff. Check current working-tree changes before editing; the handoffs describe a research snapshot, not guaranteed current state.

## Start work

State your route, unit, assigned repository, and the next useful action. Check existing session authorization before requesting anything: an explicit instruction to implement your unit already authorizes that work within its scope. These planning files alone do not grant implementation authority.

Follow this dependency order:

```text
P0: coordinator freezes the shared contract
  → CR1: CRFT proves browser behavior and delivers recipe fixtures
  → BO1: Brand OS delivers versioned exports and static profiles
  → AK1: AK adapts its shared consumers and output formats
  → INT1: verify both brands across web, paper, and slides
```

Confirm required upstream artifacts and their revisions before dependent implementation. A handoff file is not evidence that its unit is complete. If an artifact is missing, continue useful read-only source and consumer inventory, then report the exact dependency; do not invent replacement fixtures or schemas independently.

Keep shared names and decisions in the linked contract. Do not create a competing copy per repository. Route consequential changes through the coordinator, who updates affected handoffs and evidence. Routine implementation choices within the agreed contract do not require renewed approval.

Finish with the unit's actual checks, remaining limits, and the artifact required by the next owner. Distinguish source validation, rendered evidence, and human design acceptance. Do not claim implementation or accessibility proof from these documents alone.
