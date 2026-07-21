const SEMVER = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?(?:\+[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?$/;
const RULE_ID = /^[a-z][a-z0-9-]*(?:\/[a-z][a-z0-9-]*)*$/;
const SECRET = /\b([A-Za-z_][A-Za-z0-9_]*(?:token|secret|password|key|credential)[A-Za-z0-9_]*|token|secret|password|key|credential)\s*[:=]\s*(['"]?)[^\s,'"}\]]+/gi;
const PRIVATE_KEY = /-----BEGIN [^-]*PRIVATE KEY-----[\s\S]*?-----END [^-]*PRIVATE KEY-----/g;
const BEARER_TOKEN = /\bBearer\s+[A-Za-z0-9._~+\/-]+=*/gi;

export const FINDING_SCHEMA_VERSION = "1.0";
export const FINDING_CLASSIFICATIONS = Object.freeze([
  "deterministic",
  "heuristic",
  "judgment",
  "rendered",
]);
export const EVIDENCE_STATES = Object.freeze(["observed", "inferred", "unknown", "blocked"]);
export const FINDING_STATUSES = Object.freeze(["pass", "fail", "review", "blocked"]);
export const SAFE_NEXT_ACTIONS = Object.freeze(["inspect", "verify", "preserve", "escalate"]);

/**
 * A source location. Lines and columns are 1-based; the end is exclusive.
 * @typedef {{ start: { line: number, column: number }, end: { line: number, column: number } }} FindingRange
 */

/**
 * Machine-readable, read-only analyzer result.
 * @typedef {{
 *   schemaVersion: "1.0",
 *   analyzerVersion: string,
 *   seessVersion: string,
 *   ruleId: string,
 *   path: string,
 *   range: FindingRange,
 *   classification: "deterministic" | "heuristic" | "judgment" | "rendered",
 *   evidence: { state: "observed" | "inferred" | "unknown" | "blocked", summary: string, excerpts?: string[] },
 *   confidence: number,
 *   status: "pass" | "fail" | "review" | "blocked",
 *   safeNextAction: { type: "inspect" | "verify" | "preserve" | "escalate", summary: string }
 * }} Finding
 */

/**
 * Validate a repository-relative POSIX path without resolving it against disk.
 * @param {unknown} path
 * @returns {string | undefined}
 */
export function validateFindingPath(path) {
  if (typeof path !== "string" || !path) return "path must be a non-empty string";
  if (path.includes("\\") || path.startsWith("/") || path.includes("\0") || /[:\r\n]/.test(path)) {
    return "path must be a relative POSIX path";
  }
  if (path.split("/").some((segment) => !segment || segment === "." || segment === "..")) {
    return "path must not contain empty, '.' or '..' segments";
  }
}

/**
 * Replace common credentials before a finding leaves a local analyzer.
 * @param {string} text
 * @returns {string}
 */
export function redactEvidence(text) {
  return text
    .replace(PRIVATE_KEY, "[REDACTED PRIVATE KEY]")
    .replace(BEARER_TOKEN, "Bearer [REDACTED]")
    .replace(SECRET, "$1=[REDACTED]");
}

/**
 * @param {unknown} value
 * @returns {string[]}
 */
export function validateFinding(value) {
  /** @type {string[]} */
  const errors = [];
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return ["finding must be an object"];
  }

  const finding = /** @type {Record<string, unknown>} */ (value);
  if (finding.schemaVersion !== FINDING_SCHEMA_VERSION) {
    errors.push(`schemaVersion must be ${FINDING_SCHEMA_VERSION}`);
  }
  for (const key of ["analyzerVersion", "seessVersion"]) {
    if (typeof finding[key] !== "string" || !SEMVER.test(finding[key])) {
      errors.push(`${key} must be a semantic version`);
    }
  }
  if (typeof finding.ruleId !== "string" || !RULE_ID.test(finding.ruleId)) {
    errors.push("ruleId must be lowercase slash-delimited identifiers");
  }

  const pathError = validateFindingPath(finding.path);
  if (pathError) errors.push(pathError);
  validateRange(finding.range, errors);

  if (!FINDING_CLASSIFICATIONS.includes(/** @type {never} */ (finding.classification))) {
    errors.push(`classification must be one of: ${FINDING_CLASSIFICATIONS.join(", ")}`);
  }
  if (typeof finding.confidence !== "number" || !Number.isFinite(finding.confidence) || finding.confidence < 0 || finding.confidence > 1) {
    errors.push("confidence must be a finite number from 0 through 1");
  }
  if (!FINDING_STATUSES.includes(/** @type {never} */ (finding.status))) {
    errors.push(`status must be one of: ${FINDING_STATUSES.join(", ")}`);
  }
  validateEvidence(finding.evidence, errors);
  validateNextAction(finding.safeNextAction, errors);
  return errors;
}

/**
 * Validate, redact, and return a detached finding. No action type can mutate source.
 * @param {unknown} value
 * @returns {Finding}
 */
export function createFinding(value) {
  const errors = validateFinding(value);
  if (errors.length) throw new TypeError(`Invalid finding: ${errors.join("; ")}`);

  const finding = /** @type {Finding} */ (value);
  return {
    ...finding,
    range: { start: { ...finding.range.start }, end: { ...finding.range.end } },
    evidence: {
      ...finding.evidence,
      summary: redactEvidence(finding.evidence.summary),
      ...(finding.evidence.excerpts && { excerpts: finding.evidence.excerpts.map(redactEvidence) }),
    },
    safeNextAction: { ...finding.safeNextAction },
  };
}

/** @param {unknown} range @param {string[]} errors */
function validateRange(range, errors) {
  if (!range || typeof range !== "object" || Array.isArray(range)) {
    errors.push("range must contain start and end positions");
    return;
  }
  const location = /** @type {{ start?: unknown, end?: unknown }} */ (range);
  const start = validatePosition(location.start);
  const end = validatePosition(location.end);
  if (!start || !end) {
    errors.push("range positions must use positive integer line and column values");
    return;
  }
  if (end.line < start.line || (end.line === start.line && end.column < start.column)) {
    errors.push("range end must not precede range start");
  }
}

/** @param {unknown} position */
function validatePosition(position) {
  if (!position || typeof position !== "object" || Array.isArray(position)) return;
  const { line, column } = /** @type {{ line?: unknown, column?: unknown }} */ (position);
  return Number.isInteger(line) && line > 0 && Number.isInteger(column) && column > 0
    ? { line, column }
    : undefined;
}

/** @param {unknown} evidence @param {string[]} errors */
function validateEvidence(evidence, errors) {
  if (!evidence || typeof evidence !== "object" || Array.isArray(evidence)) {
    errors.push("evidence must be an object");
    return;
  }
  const value = /** @type {{ state?: unknown, summary?: unknown, excerpts?: unknown }} */ (evidence);
  if (!EVIDENCE_STATES.includes(/** @type {never} */ (value.state))) {
    errors.push(`evidence.state must be one of: ${EVIDENCE_STATES.join(", ")}`);
  }
  if (typeof value.summary !== "string" || !value.summary.trim()) {
    errors.push("evidence.summary must be a non-empty string");
  }
  if (value.excerpts !== undefined && (!Array.isArray(value.excerpts) || value.excerpts.some((excerpt) => typeof excerpt !== "string"))) {
    errors.push("evidence.excerpts must be an array of strings when present");
  }
}

/** @param {unknown} action @param {string[]} errors */
function validateNextAction(action, errors) {
  if (!action || typeof action !== "object" || Array.isArray(action)) {
    errors.push("safeNextAction must be an object");
    return;
  }
  const value = /** @type {{ type?: unknown, summary?: unknown }} */ (action);
  if (!SAFE_NEXT_ACTIONS.includes(/** @type {never} */ (value.type))) {
    errors.push(`safeNextAction.type must be one of: ${SAFE_NEXT_ACTIONS.join(", ")}`);
  }
  if (typeof value.summary !== "string" || !value.summary.trim()) {
    errors.push("safeNextAction.summary must be a non-empty string");
  }
}
