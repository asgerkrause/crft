import { createFinding } from "../contracts/finding.mjs";

/**
 * Run injected synchronous rules against a resolved scope and return canonical findings.
 * @param {{ scope: unknown, rules: unknown }} input
 */
export function analyze(input) {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw new TypeError("analysis input must be an object");
  }
  const { scope, rules } = /** @type {{ scope?: unknown, rules?: unknown }} */ (input);
  if (!Array.isArray(rules) || rules.some((rule) => typeof rule !== "function")) {
    throw new TypeError("rules must be an array of functions");
  }

  const findings = [];
  for (const rule of rules) {
    const result = rule(scope);
    if (!Array.isArray(result)) throw new TypeError("rules must return arrays of findings");
    findings.push(...result.map(createFinding));
  }
  return findings.sort((left, right) => {
    const leftKey = JSON.stringify(left);
    const rightKey = JSON.stringify(right);
    return leftKey < rightKey ? -1 : leftKey > rightKey ? 1 : 0;
  });
}
