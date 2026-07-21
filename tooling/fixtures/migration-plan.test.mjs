import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { createMigrationPlan } from "../migrate/plan.mjs";
import { migrationPlanFixtureHashes, migrationPlanFixtureRoot } from "./migration-plan.mjs";

const expectedHashes = {
  "findings.json": "c35f797bbcf1e9326f9acf768b3d3814820730e5b2c8a78d46dd72005702fa95",
  "src/entry.css": "11a99030fbc855a5a1494bef955277b58b6d31711d75ac998d0800f9c34b79dd",
  "src/legacy.css": "2035c8994c94f503d3d85ee5e7ffadce971f866c56ea4b8199632e100c079e17",
};

test("migration-plan fixture hashes are frozen", () => {
  assert.deepEqual(migrationPlanFixtureHashes(), expectedHashes);
});

test("plan derivation leaves every fixture file unchanged", () => {
  const before = migrationPlanFixtureHashes();
  const findings = JSON.parse(readFileSync(`${migrationPlanFixtureRoot}/findings.json`, "utf8"));

  assert.deepEqual(createMigrationPlan(findings), [{
    action: "preserve",
    ruleId: "consumer/project-rule",
    path: "src/legacy.css",
    range: { start: { line: 1, column: 1 }, end: { line: 3, column: 2 } },
  }]);
  assert.deepEqual(migrationPlanFixtureHashes(), before);
});
