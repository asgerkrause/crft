import assert from "node:assert/strict";
import test from "node:test";
import { FINDING_SCHEMA_VERSION } from "../contracts/finding.mjs";
import { createMigrationPlan } from "./plan.mjs";

function finding(overrides = {}) {
  return {
    schemaVersion: FINDING_SCHEMA_VERSION,
    analyzerVersion: "0.1.0",
    seessVersion: "1.0.0",
    ruleId: "adoption/copied-tree-drift",
    path: "styles/tokens.css",
    range: {
      start: { line: 12, column: 3 },
      end: { line: 12, column: 18 },
    },
    classification: "deterministic",
    evidence: { state: "observed", summary: "Copied source differs." },
    confidence: 1,
    status: "fail",
    safeNextAction: { type: "inspect", summary: "Compare the sources." },
    ...overrides,
  };
}

test("derives only read-only actions with finding references", () => {
  const plan = createMigrationPlan([
    finding({ safeNextAction: { type: "verify", summary: "Verify rendered behavior." } }),
    finding({
      ruleId: "adoption/base-check",
      path: "global.css",
      range: { start: { line: 1, column: 1 }, end: { line: 1, column: 8 } },
    }),
    finding({
      ruleId: "consumer/project-rule",
      path: "src/entry.css",
      range: { start: { line: 4, column: 1 }, end: { line: 4, column: 9 } },
      safeNextAction: { type: "preserve", summary: "Keep the consumer rule." },
    }),
    finding({
      ruleId: "consumer/entrypoint-unknown",
      path: "src/main.css",
      range: { start: { line: 1, column: 1 }, end: { line: 1, column: 1 } },
      evidence: { state: "blocked", summary: "Entrypoint owner is unavailable." },
      status: "blocked",
      safeNextAction: { type: "escalate", summary: "Ask the owner." },
    }),
  ]);

  assert.deepEqual(plan, [
    {
      action: "inspect",
      ruleId: "adoption/base-check",
      path: "global.css",
      range: { start: { line: 1, column: 1 }, end: { line: 1, column: 8 } },
    },
    {
      action: "verify",
      ruleId: "adoption/copied-tree-drift",
      path: "styles/tokens.css",
      range: { start: { line: 12, column: 3 }, end: { line: 12, column: 18 } },
    },
    {
      action: "escalate",
      ruleId: "consumer/entrypoint-unknown",
      path: "src/main.css",
      range: { start: { line: 1, column: 1 }, end: { line: 1, column: 1 } },
    },
    {
      action: "preserve",
      ruleId: "consumer/project-rule",
      path: "src/entry.css",
      range: { start: { line: 4, column: 1 }, end: { line: 4, column: 9 } },
    },
  ]);
});

test("is stable across input order and omits free-text action summaries", () => {
  const first = finding({ ruleId: "consumer/a", path: "src/a.css" });
  const second = finding({ ruleId: "consumer/b", path: "src/b.css" });
  const forward = createMigrationPlan([second, first]);
  const reverse = createMigrationPlan([first, second]);

  assert.deepEqual(forward, reverse);
  assert.doesNotMatch(JSON.stringify(forward), /rewrite|delete|autofix|mapping/i);
  assert.deepEqual(Object.keys(forward[0]).sort(), ["action", "path", "range", "ruleId"]);
});

test("validates every finding and leaves caller data unchanged", () => {
  const source = finding({ evidence: { state: "observed", summary: "token=private" } });
  const plan = createMigrationPlan([source]);

  assert.equal(plan[0].action, "inspect");
  assert.equal(source.evidence.summary, "token=private");
  assert.throws(() => createMigrationPlan([finding({ path: "../outside.css" })]), /Invalid finding/);
  assert.throws(() => createMigrationPlan({}), /findings must be an array/);
});
