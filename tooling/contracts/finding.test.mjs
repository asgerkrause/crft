import assert from "node:assert/strict";
import test from "node:test";
import {
  FINDING_SCHEMA_VERSION,
  createFinding,
  redactEvidence,
  redactFindingPath,
  validateFinding,
  validateFindingPath,
} from "./finding.mjs";

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
    evidence: {
      state: "observed",
      summary: "Copied token differs from canonical source.",
    },
    confidence: 1,
    status: "fail",
    safeNextAction: {
      type: "inspect",
      summary: "Compare this file with the pinned canonical source.",
    },
    ...overrides,
  };
}

test("accepts a complete version 1.0 finding", () => {
  assert.deepEqual(validateFinding(finding()), []);
  assert.deepEqual(createFinding(finding()), finding());
});

test("requires schema, analyzer, and seess versions", () => {
  const errors = validateFinding(finding({ schemaVersion: "2.0", analyzerVersion: "latest", seessVersion: "1" }));
  assert.deepEqual(errors, [
    "schemaVersion must be 1.0",
    "analyzerVersion must be a semantic version",
    "seessVersion must be a semantic version",
  ]);
});

test("requires contract classifications, evidence states, status, confidence, and safe actions", () => {
  const errors = validateFinding(finding({
    classification: "guess",
    confidence: 1.1,
    status: "delete",
    evidence: { state: "claimed", summary: "Evidence" },
    safeNextAction: { type: "delete", summary: "Delete the file" },
  }));
  assert.deepEqual(errors, [
    "classification must be one of: deterministic, heuristic, judgment, rendered",
    "confidence must be a finite number from 0 through 1",
    "status must be one of: pass, fail, review, blocked",
    "evidence.state must be one of: observed, inferred, unknown, blocked",
    "safeNextAction.type must be one of: inspect, verify, preserve, escalate",
  ]);
});

test("rejects unknown fields at every object boundary", () => {
  const base = finding();
  const cases = [
    ["finding", finding({ secret: "API_KEY=not-for-report" })],
    ["range", finding({ range: { ...base.range, secret: true } })],
    ["range.start", finding({ range: { ...base.range, start: { ...base.range.start, secret: true } } })],
    ["range.end", finding({ range: { ...base.range, end: { ...base.range.end, secret: true } } })],
    ["evidence", finding({ evidence: { ...base.evidence, secret: true } })],
    ["safeNextAction", finding({ safeNextAction: { ...base.safeNextAction, secret: true } })],
  ];

  for (const [boundary, value] of cases) {
    assert.deepEqual(validateFinding(value), [`${boundary} contains unknown field secret`]);
  }
  assert.throws(() => createFinding(cases[0][1]), /finding contains unknown field secret/);
});

test("rejects unsafe paths, all control characters, and inverted ranges", () => {
  assert.equal(validateFindingPath("/private/key.css"), "path must be a relative POSIX path");
  assert.equal(validateFindingPath("styles/../tokens.css"), "path must not contain empty, '.' or '..' segments");
  assert.equal(validateFindingPath("styles\\tokens.css"), "path must be a relative POSIX path");
  assert.equal(validateFindingPath("C:/private/key.css"), "path must be a relative POSIX path");
  assert.equal(validateFindingPath("styles/\t/tokens.css"), "path must be a relative POSIX path");
  assert.equal(validateFindingPath("styles/\u007f/tokens.css"), "path must be a relative POSIX path");
  assert.deepEqual(validateFinding(finding({
    range: {
      start: { line: 7, column: 4 },
      end: { line: 7, column: 3 },
    },
  })), ["range end must not precede range start"]);
});

test("redacts secret-like path components without changing valid path structure", () => {
  const sourcePath = "src/secrets/api_key=not-for-report/theme.css";
  const redactedPath = "src/[redacted-path]/[redacted-path]/theme.css";
  const source = finding({ path: sourcePath });
  const result = createFinding(source);

  assert.equal(redactFindingPath(sourcePath), redactedPath);
  assert.equal(redactFindingPath(sourcePath), redactedPath);
  assert.equal(redactFindingPath("src/components/theme.css"), "src/components/theme.css");
  assert.equal(validateFindingPath(redactedPath), undefined);
  assert.equal(result.path, redactedPath);
  assert.equal(source.path, sourcePath);
});

test("redacts all transferable free-text fields without mutating caller input", () => {
  const source = finding({
    evidence: {
      state: "observed",
      summary: "Authorization: Bearer top-secret-token API_KEY=not-for-report",
      excerpts: ["-----BEGIN PRIVATE KEY-----\nsecret\n-----END PRIVATE KEY-----"],
    },
    safeNextAction: {
      type: "inspect",
      summary: "Escalate with token=not-for-report.",
    },
  });
  const result = createFinding(source);

  assert.equal(result.evidence.summary, "Authorization: Bearer [REDACTED] API_KEY=[REDACTED]");
  assert.deepEqual(result.evidence.excerpts, ["[REDACTED PRIVATE KEY]"]);
  assert.equal(result.safeNextAction.summary, "Escalate with token=[REDACTED]");
  assert.match(source.evidence.summary, /top-secret-token/);
  assert.match(source.safeNextAction.summary, /not-for-report/);
  assert.equal(redactEvidence("token=secret"), "token=[REDACTED]");
});

test("requires outcomes consistent with evidence authority", () => {
  assert.deepEqual(validateFinding(finding({
    evidence: { state: "inferred", summary: "Candidate only." },
    status: "pass",
  })), ["status pass requires observed evidence"]);
  assert.deepEqual(validateFinding(finding({
    evidence: { state: "unknown", summary: "No evidence." },
    status: "fail",
  })), ["status fail requires observed evidence"]);
  assert.deepEqual(validateFinding(finding({
    evidence: { state: "blocked", summary: "Source is unavailable." },
    status: "review",
    safeNextAction: { type: "inspect", summary: "Inspect later." },
  })), [
    "blocked evidence requires blocked status",
    "blocked evidence requires an escalate safeNextAction",
  ]);
  assert.deepEqual(validateFinding(finding({
    evidence: { state: "blocked", summary: "Source is unavailable." },
    status: "blocked",
    safeNextAction: { type: "escalate", summary: "Escalate to the source owner." },
  })), []);
});

test("throws a concise error for invalid findings", () => {
  assert.throws(
    () => createFinding(finding({ path: "../outside.css" })),
    /Invalid finding: path must not contain empty, '.' or '..' segments/,
  );
});
