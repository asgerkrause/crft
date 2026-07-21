import assert from "node:assert/strict";
import test from "node:test";
import { createReport, REPORT_SCHEMA_VERSION } from "./report.mjs";
import { ANALYZER_VERSION, SEESS_VERSION } from "./version.mjs";

function finding(overrides = {}) {
  return {
    schemaVersion: "1.0",
    analyzerVersion: ANALYZER_VERSION,
    seessVersion: SEESS_VERSION,
    ruleId: "adoption/copied-tree-drift",
    path: "styles/tokens.css",
    range: { start: { line: 1, column: 1 }, end: { line: 1, column: 2 } },
    classification: "deterministic",
    evidence: { state: "observed", summary: "Copied token differs." },
    confidence: 1,
    status: "fail",
    safeNextAction: { type: "inspect", summary: "Compare canonical source." },
    ...overrides,
  };
}

test("creates a versioned, sorted, summarized report without an absolute root", () => {
  const report = createReport({
    command: "audit",
    scope: { entrypoint: "src/entry.css", adoption: "vendor/seess" },
    findings: [
      finding({ ruleId: "zeta/drift", status: "pass" }),
      finding({ ruleId: "alpha/drift" }),
    ],
  });

  assert.deepEqual(report, {
    schemaVersion: REPORT_SCHEMA_VERSION,
    analyzerVersion: ANALYZER_VERSION,
    seessVersion: SEESS_VERSION,
    command: "audit",
    scope: { entrypoint: "src/entry.css", adoption: "vendor/seess" },
    findings: [finding({ ruleId: "alpha/drift" }), finding({ ruleId: "zeta/drift", status: "pass" })],
    summary: { total: 2, pass: 1, fail: 1, review: 0, blocked: 0 },
  });
  assert.equal(JSON.stringify(report).includes("root"), false);
});

test("reconstructs and redacts findings before they enter the report", () => {
  const report = createReport({
    command: "verify",
    scope: { adoption: "vendor/seess" },
    findings: [finding({
      evidence: { state: "observed", summary: "API_KEY=not-for-report" },
      safeNextAction: { type: "inspect", summary: "Review token=not-for-report" },
    })],
  });

  assert.equal(report.findings[0].evidence.summary, "API_KEY=[REDACTED]");
  assert.equal(report.findings[0].safeNextAction.summary, "Review token=[REDACTED]");
});

test("rejects unknown envelope and scope fields", () => {
  const input = { command: "audit", scope: { entrypoint: "src/entry.css" }, findings: [] };
  assert.throws(() => createReport({ ...input, root: "/private/project" }), /report contains unknown field root/);
  assert.throws(() => createReport({ ...input, scope: { entrypoint: "src/entry.css", root: "private" } }), /scope contains unknown field root/);
});

test("rejects invalid commands and scope paths", () => {
  assert.throws(
    () => createReport({ command: "scan", scope: { entrypoint: "src/entry.css" }, findings: [] }),
    /command must be one of: adopt, audit, verify, migrate/,
  );
  assert.throws(
    () => createReport({ command: "audit", scope: { entrypoint: "/private/entry.css" }, findings: [] }),
    /scope.entrypoint must be a relative POSIX path/,
  );
  assert.throws(
    () => createReport({ command: "audit", scope: {}, findings: [] }),
    /scope must include entrypoint or adoption/,
  );
  assert.throws(
    () => createReport({ command: "audit", scope: { entrypoint: "src/entry.css" }, findings: [finding({ analyzerVersion: "0.2.0" })] }),
    /findings must use the current analyzer and seess versions/,
  );
});
