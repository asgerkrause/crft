import { createFinding, FINDING_SCHEMA_VERSION, redactFindingPath, validateFindingPath } from "./finding.mjs";
import { ANALYZER_VERSION, SEESS_VERSION } from "./version.mjs";

export const REPORT_SCHEMA_VERSION = FINDING_SCHEMA_VERSION;
export const REPORT_COMMANDS = Object.freeze(["adopt", "audit", "verify", "migrate"]);

/**
 * A read-only report envelope. `scope` never includes an absolute project root.
 * @typedef {{ entrypoint?: string, adoption?: string }} ReportScope
 * @typedef {{ total: number, pass: number, fail: number, review: number, blocked: number }} ReportSummary
 * @typedef {{ schemaVersion: "1.0", analyzerVersion: string, seessVersion: string, command: "adopt" | "audit" | "verify" | "migrate", scope: ReportScope, findings: import("./finding.mjs").Finding[], summary: ReportSummary }} Report
 */

/**
 * Validate, redact, sort, and summarize a JSON-safe report.
 * @param {unknown} value
 * @returns {Report}
 */
export function createReport(value) {
  if (!isObject(value)) throw new TypeError("report must be an object");
  const input = /** @type {Record<string, unknown>} */ (value);
  assertOnlyFields(input, ["command", "scope", "findings"], "report");

  if (!REPORT_COMMANDS.includes(/** @type {never} */ (input.command))) {
    throw new TypeError(`command must be one of: ${REPORT_COMMANDS.join(", ")}`);
  }
  if (!Array.isArray(input.findings)) throw new TypeError("findings must be an array");

  const findings = input.findings.map(createFinding);
  for (const finding of findings) {
    if (finding.analyzerVersion !== ANALYZER_VERSION || finding.seessVersion !== SEESS_VERSION) {
      throw new TypeError("findings must use the current analyzer and seess versions");
    }
  }
  findings.sort(compareFindings);
  return {
    schemaVersion: REPORT_SCHEMA_VERSION,
    analyzerVersion: ANALYZER_VERSION,
    seessVersion: SEESS_VERSION,
    command: /** @type {Report["command"]} */ (input.command),
    scope: createScope(input.scope),
    findings,
    summary: summarize(findings),
  };
}

/** @param {unknown} value @returns {ReportScope} */
function createScope(value) {
  if (!isObject(value)) throw new TypeError("scope must be an object");
  const scope = /** @type {Record<string, unknown>} */ (value);
  assertOnlyFields(scope, ["entrypoint", "adoption"], "scope");
  if (scope.entrypoint === undefined && scope.adoption === undefined) {
    throw new TypeError("scope must include entrypoint or adoption");
  }

  /** @type {ReportScope} */
  const result = {};
  for (const key of ["entrypoint", "adoption"]) {
    if (scope[key] === undefined) continue;
    const path = scope[key];
    if (typeof path !== "string" || validateFindingPath(path)) {
      throw new TypeError(`scope.${key} must be a relative POSIX path`);
    }
    result[key] = redactFindingPath(path);
  }
  return result;
}

/** @param {import("./finding.mjs").Finding[]} findings @returns {ReportSummary} */
function summarize(findings) {
  const summary = { total: findings.length, pass: 0, fail: 0, review: 0, blocked: 0 };
  for (const finding of findings) summary[finding.status] += 1;
  return summary;
}

/** @param {import("./finding.mjs").Finding} left @param {import("./finding.mjs").Finding} right */
function compareFindings(left, right) {
  const leftKey = JSON.stringify(left);
  const rightKey = JSON.stringify(right);
  return leftKey < rightKey ? -1 : leftKey > rightKey ? 1 : 0;
}

/** @param {unknown} value */
function isObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

/** @param {Record<string, unknown>} value @param {string[]} allowed @param {string} label */
function assertOnlyFields(value, allowed, label) {
  for (const key of [...Object.getOwnPropertyNames(value), ...Object.getOwnPropertySymbols(value)]) {
    if (!allowed.includes(/** @type {never} */ (key))) {
      throw new TypeError(`${label} contains unknown field ${String(key)}`);
    }
  }
}
