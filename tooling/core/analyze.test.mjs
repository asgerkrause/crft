import assert from "node:assert/strict";
import test from "node:test";
import { ANALYZER_VERSION, SEESS_VERSION } from "../contracts/version.mjs";
import { analyze } from "./analyze.mjs";

function finding(ruleId) {
  return {
    schemaVersion: "1.0",
    analyzerVersion: ANALYZER_VERSION,
    seessVersion: SEESS_VERSION,
    ruleId,
    path: "styles/tokens.css",
    range: { start: { line: 1, column: 1 }, end: { line: 1, column: 2 } },
    classification: "deterministic",
    evidence: { state: "observed", summary: "Observed." },
    confidence: 1,
    status: "fail",
    safeNextAction: { type: "inspect", summary: "Inspect." },
  };
}

test("runs injected rules and returns canonical sorted findings", () => {
  const scope = { entrypoint: { relative: "src/entry.css" } };
  const result = analyze({
    scope,
    rules: [
      (received) => [finding("zeta/rule")],
      (received) => {
        assert.equal(received, scope);
        return [finding("alpha/rule")];
      },
    ],
  });

  assert.deepEqual(result.map((item) => item.ruleId), ["alpha/rule", "zeta/rule"]);
});

test("rejects invalid rule injection and return values", () => {
  assert.throws(() => analyze({ scope: {}, rules: ["rule"] }), /rules must be an array of functions/);
  assert.throws(() => analyze({ scope: {}, rules: [() => finding("alpha/rule")] }), /rules must return arrays of findings/);
});
