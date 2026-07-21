import { createFinding } from "../contracts/finding.mjs";

/**
 * Derive a stable, read-only migration plan from validated findings.
 * @param {unknown[]} findings
 * @returns {{ action: "inspect" | "verify" | "preserve" | "escalate", ruleId: string, path: string, range: import("../contracts/finding.mjs").FindingRange }[]}
 */
export function createMigrationPlan(findings) {
  if (!Array.isArray(findings)) throw new TypeError("findings must be an array");

  return findings
    .map(createFinding)
    .map((finding) => ({
      action: finding.safeNextAction.type,
      ruleId: finding.ruleId,
      path: finding.path,
      range: finding.range,
    }))
    .sort(comparePlanActions);
}

/** @param {ReturnType<typeof createMigrationPlan>[number]} left @param {ReturnType<typeof createMigrationPlan>[number]} right */
function comparePlanActions(left, right) {
  return compareFields([
    left.ruleId,
    left.path,
    left.range.start.line,
    left.range.start.column,
    left.range.end.line,
    left.range.end.column,
    left.action,
  ], [
    right.ruleId,
    right.path,
    right.range.start.line,
    right.range.start.column,
    right.range.end.line,
    right.range.end.column,
    right.action,
  ]);
}

/** @param {(string | number)[]} left @param {(string | number)[]} right */
function compareFields(left, right) {
  for (let index = 0; index < left.length; index += 1) {
    if (left[index] < right[index]) return -1;
    if (left[index] > right[index]) return 1;
  }
  return 0;
}
