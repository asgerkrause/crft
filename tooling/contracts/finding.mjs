const SEMVER = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?(?:\+[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?$/;
const RULE_ID = /^[a-z][a-z0-9-]*(?:\/[a-z][a-z0-9-]*)*$/;
const SECRET = /\b([A-Za-z_][A-Za-z0-9_]*(?:token|secret|password|key|credential)[A-Za-z0-9_]*|token|secret|password|key|credential)\s*[:=]\s*(['"]?)[^\s,'"}\]]+/gi;
const PRIVATE_KEY = /-----BEGIN [^-]*PRIVATE KEY-----[\s\S]*?-----END [^-]*PRIVATE KEY-----/g;
const BEARER_TOKEN = /\bBearer\s+[A-Za-z0-9._~+\/-]+=*/gi;
const SECRET_PATH_COMPONENT = /(?:^|[._=-])(?:api[-_]?key|access[-_]?token|auth[-_]?token|secret|password|credential|private[-_]?key|key)(?:$|[._=-])/i;
const SECRET_PATH_NAMES = new Set(["auth", "credential", "credentials", "key", "keys", "password", "passwords", "private", "secret", "secrets", "token", "tokens"]);

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
  if (path.includes("\\") || path.startsWith("/") || path.includes(":") || /\p{Cc}/u.test(path)) {
    return "path must be a relative POSIX path";
  }
  if (path.split("/").some((segment) => !segment || segment === "." || segment === "..")) {
    return "path must not contain empty, '.' or '..' segments";
  }
}

/**
 * Preserve relative path structure while replacing secret-like components.
 * @param {string} path
 * @returns {string}
 */
export function redactFindingPath(path) {
  return path.split("/").map((component) => isSecretPathComponent(component) ? "[redacted-path]" : component).join("/");
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
  if (!isObject(value)) return ["finding must be an object"];

  const finding = /** @type {Record<string, unknown>} */ (value);
  rejectUnknownFields(finding, [
    "schemaVersion", "analyzerVersion", "seessVersion", "ruleId", "path", "range",
    "classification", "evidence", "confidence", "status", "safeNextAction",
  ], "finding", errors);

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
  validateAuthority(finding.evidence, finding.status, finding.safeNextAction, errors);
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
  const evidence = finding.evidence;
  /** @type {Finding["evidence"]} */
  const redactedEvidence = {
    state: evidence.state,
    summary: redactEvidence(evidence.summary),
  };
  if (evidence.excerpts !== undefined) redactedEvidence.excerpts = evidence.excerpts.map(redactEvidence);

  return {
    schemaVersion: FINDING_SCHEMA_VERSION,
    analyzerVersion: finding.analyzerVersion,
    seessVersion: finding.seessVersion,
    ruleId: finding.ruleId,
    path: redactFindingPath(finding.path),
    range: {
      start: { line: finding.range.start.line, column: finding.range.start.column },
      end: { line: finding.range.end.line, column: finding.range.end.column },
    },
    classification: finding.classification,
    evidence: redactedEvidence,
    confidence: finding.confidence,
    status: finding.status,
    safeNextAction: {
      type: finding.safeNextAction.type,
      summary: redactEvidence(finding.safeNextAction.summary),
    },
  };
}

/** @param {unknown} range @param {string[]} errors */
function validateRange(range, errors) {
  if (!isObject(range)) {
    errors.push("range must contain start and end positions");
    return;
  }
  const location = /** @type {Record<string, unknown>} */ (range);
  rejectUnknownFields(location, ["start", "end"], "range", errors);
  const start = validatePosition(location.start, "range.start", errors);
  const end = validatePosition(location.end, "range.end", errors);
  if (!start || !end) return;
  if (end.line < start.line || (end.line === start.line && end.column < start.column)) {
    errors.push("range end must not precede range start");
  }
}

/** @param {unknown} position @param {string} label @param {string[]} errors */
function validatePosition(position, label, errors) {
  if (!isObject(position)) {
    errors.push("range positions must use positive integer line and column values");
    return;
  }
  const value = /** @type {Record<string, unknown>} */ (position);
  rejectUnknownFields(value, ["line", "column"], label, errors);
  const { line, column } = value;
  if (Number.isInteger(line) && line > 0 && Number.isInteger(column) && column > 0) {
    return /** @type {{ line: number, column: number }} */ ({ line, column });
  }
  errors.push("range positions must use positive integer line and column values");
}

/** @param {unknown} evidence @param {string[]} errors */
function validateEvidence(evidence, errors) {
  if (!isObject(evidence)) {
    errors.push("evidence must be an object");
    return;
  }
  const value = /** @type {Record<string, unknown>} */ (evidence);
  rejectUnknownFields(value, ["state", "summary", "excerpts"], "evidence", errors);
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
  if (!isObject(action)) {
    errors.push("safeNextAction must be an object");
    return;
  }
  const value = /** @type {Record<string, unknown>} */ (action);
  rejectUnknownFields(value, ["type", "summary"], "safeNextAction", errors);
  if (!SAFE_NEXT_ACTIONS.includes(/** @type {never} */ (value.type))) {
    errors.push(`safeNextAction.type must be one of: ${SAFE_NEXT_ACTIONS.join(", ")}`);
  }
  if (typeof value.summary !== "string" || !value.summary.trim()) {
    errors.push("safeNextAction.summary must be a non-empty string");
  }
}

/** @param {string} component */
function isSecretPathComponent(component) {
  const lower = component.toLowerCase();
  return SECRET_PATH_NAMES.has(lower)
    || lower.startsWith(".env")
    || lower.endsWith(".pem")
    || lower.endsWith(".key")
    || SECRET_PATH_COMPONENT.test(component);
}

/** @param {unknown} evidence @param {unknown} status @param {unknown} action @param {string[]} errors */
function validateAuthority(evidence, status, action, errors) {
  if (!isObject(evidence) || !isObject(action)) return;
  const state = /** @type {Record<string, unknown>} */ (evidence).state;
  const type = /** @type {Record<string, unknown>} */ (action).type;
  if ((status === "pass" || status === "fail") && state !== "observed") {
    errors.push(`status ${status} requires observed evidence`);
  }
  if (state === "blocked") {
    if (status !== "blocked") errors.push("blocked evidence requires blocked status");
    if (type !== "escalate") errors.push("blocked evidence requires an escalate safeNextAction");
  }
}

/** @param {unknown} value */
function isObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

/** @param {Record<string, unknown>} value @param {string[]} allowed @param {string} label @param {string[]} errors */
function rejectUnknownFields(value, allowed, label, errors) {
  for (const key of [...Object.getOwnPropertyNames(value), ...Object.getOwnPropertySymbols(value)]) {
    if (!allowed.includes(/** @type {never} */ (key))) {
      errors.push(`${label} contains unknown field ${String(key)}`);
    }
  }
}
