import assert from "node:assert/strict";
import test from "node:test";
import { migrationPlanFixtureHashes, migrationPlanFixtureRoot } from "./fixtures/migration-plan.mjs";

/**
 * Integration seam: inject a future analyzer/CLI runner rather than importing an absent module.
 * @param {(input: { fixtureRoot: string }) => Promise<unknown> | unknown} run
 */
export async function assertMigrationPlanIntegration(run) {
  if (typeof run !== "function") throw new TypeError("run must be a function");

  const before = migrationPlanFixtureHashes();
  const result = await run({ fixtureRoot: migrationPlanFixtureRoot });
  assert.deepEqual(migrationPlanFixtureHashes(), before);
  return result;
}

test("migration plan preserves fixture files end to end", {
  skip: "Integration seam: inject the integrated analyzer/CLI runner after its contract is available.",
}, () => {});
