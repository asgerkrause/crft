import { createFinding, validateFindingPath } from "../contracts/finding.mjs";
import { ANALYZER_VERSION, SEESS_VERSION } from "../contracts/version.mjs";

export const CONSUMER_API_RULE_IDS = Object.freeze({
  privateProperty: "consumer-api/private-property",
  retiredToken: "consumer-api/retired-token",
  retiredClass: "consumer-api/retired-class",
  retiredDataTheme: "consumer-api/retired-data-theme",
  retiredDataAccent: "consumer-api/retired-data-accent",
  unsupportedDataAccent: "consumer-api/unsupported-data-accent",
  dynamicDataAccent: "consumer-api/dynamic-data-accent",
});

export const PRIVATE_PROPERTIES = Object.freeze([
  "--l-gc",
  "--l-cs",
  "--l-rs",
  "--or",
  "--m-src-to",
  "--m-src-fr",
  "--m-plx",
]);

export const VALID_DATA_ACCENT_VALUES = Object.freeze([
  "secondary",
  "tertiary",
  "success",
  "warning",
  "danger",
]);

const RETIRED_TOKENS = ["--c-fb", "--c-ac-base", "--c-ac-co-base"];
const RETIRED_CLASS_SELECTORS = ["\\.fb\\s*\\{", "&\\.su\\b", "&\\.wn\\b", "&\\.dn\\b"];
const DATA_ACCENT_ASSIGNMENT = /(^|[^A-Za-z0-9_-])((?::|v-bind:)?data-accent|\[data-accent\])\s*=\s*("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`|\{(?:[^{}]|\{[^{}]*\})*\}|[^\s>\]]*)/gim;

/**
 * Analyze text-file records already approved by the core. This rule never reads
 * directories or files; callers pass only consumer records outside adoption.
 *
 * @param {{ path: string, text: string }[]} records
 * @returns {import("../contracts/finding.mjs").Finding[]}
 */
export function analyzeConsumerApi(records) {
  if (!Array.isArray(records)) throw new TypeError("records must be an array");

  /** @type {{ path: string, text: string }[]} */
  const files = records.map((record, index) => normalizeRecord(record, index));
  /** @type {import("../contracts/finding.mjs").Finding[]} */
  const findings = [];

  for (const file of files.sort(compareFiles)) {
    for (const property of PRIVATE_PROPERTIES) {
      addMatches(findings, file, new RegExp(`(?<![A-Za-z0-9_-])${escapeRegExp(property)}(?![A-Za-z0-9_-])`, "g"), {
        ruleId: CONSUMER_API_RULE_IDS.privateProperty,
        summary: "Consumer source uses a private implementation property.",
        next: "Replace the private property with documented consumer API or a project-owned rule.",
      });
    }

    for (const token of RETIRED_TOKENS) {
      addMatches(findings, file, new RegExp(`(?<![A-Za-z0-9_-])${escapeRegExp(token)}(?![A-Za-z0-9_-])`, "g"), {
        ruleId: CONSUMER_API_RULE_IDS.retiredToken,
        summary: "Consumer source uses a retired token.",
        next: "Replace the retired token with documented consumer API or a project-owned rule.",
      });
    }

    for (const selector of RETIRED_CLASS_SELECTORS) {
      addMatches(findings, file, new RegExp(selector, "g"), {
        ruleId: CONSUMER_API_RULE_IDS.retiredClass,
        summary: "Consumer source uses a retired feedback selector.",
        next: "Replace the retired selector with semantic markup and documented consumer API.",
      });
    }

    addMatches(findings, file, /(?<![A-Za-z0-9_-])data-theme(?![A-Za-z0-9_-])/gi, {
      ruleId: CONSUMER_API_RULE_IDS.retiredDataTheme,
      summary: "Consumer source uses retired data-theme API.",
      next: "Use data-skin for semantic canvas context.",
    });

    for (const assignment of dataAccentAssignments(file.text)) {
      const dynamic = assignment.name !== "data-accent" || isDynamicValue(assignment.value);
      if (dynamic) {
        findings.push(create(file, assignment.start, assignment.end, {
          ruleId: CONSUMER_API_RULE_IDS.dynamicDataAccent,
          status: "review",
          summary: "Consumer source computes a data-accent value.",
          next: "Resolve the expression to a documented explicit route before verification.",
        }));
        continue;
      }

      const value = literalValue(assignment.value);
      if (value === "accent") {
        findings.push(create(file, assignment.start, assignment.end, {
          ruleId: CONSUMER_API_RULE_IDS.retiredDataAccent,
          status: "fail",
          summary: "Consumer source uses retired data-accent API.",
          next: "Omit data-accent for the default route.",
        }));
      } else if (!VALID_DATA_ACCENT_VALUES.includes(value)) {
        findings.push(create(file, assignment.start, assignment.end, {
          ruleId: CONSUMER_API_RULE_IDS.unsupportedDataAccent,
          status: "fail",
          summary: "Consumer source uses an unsupported explicit data-accent value.",
          next: "Use a documented explicit route or omit data-accent for the default route.",
        }));
      }
    }
  }

  return findings.sort(compareFindings);
}

/** @param {unknown} record @param {number} index */
function normalizeRecord(record, index) {
  if (!record || typeof record !== "object" || Array.isArray(record)) {
    throw new TypeError(`records[${index}] must be a text-file record`);
  }
  const value = /** @type {{ path?: unknown, text?: unknown }} */ (record);
  if (typeof value.path !== "string" || validateFindingPath(value.path)) {
    throw new TypeError(`records[${index}].path must be a relative POSIX path`);
  }
  if (typeof value.text !== "string") throw new TypeError(`records[${index}].text must be a string`);
  return { path: value.path, text: value.text };
}

/** @param {{ path: string, text: string }} left @param {{ path: string, text: string }} right */
function compareFiles(left, right) {
  return left.path.localeCompare(right.path) || left.text.localeCompare(right.text);
}

/** @param {import("../contracts/finding.mjs").Finding[]} findings @param {{ path: string, text: string }} file @param {RegExp} expression @param {{ ruleId: string, summary: string, next: string }} detail */
function addMatches(findings, file, expression, detail) {
  for (const match of file.text.matchAll(expression)) {
    findings.push(create(file, match.index, match.index + match[0].length, { ...detail, status: "fail" }));
  }
}

/** @param {string} text */
function dataAccentAssignments(text) {
  /** @type {{ name: string, value: string, start: number, end: number }[]} */
  const assignments = [];
  for (const match of text.matchAll(DATA_ACCENT_ASSIGNMENT)) {
    const prefix = match[1];
    const name = match[2].toLowerCase();
    const value = match[3];
    const start = match.index + prefix.length;
    assignments.push({ name, value, start, end: match.index + match[0].length });
  }
  return assignments;
}

/** @param {string} value */
function isDynamicValue(value) {
  return value.startsWith("{")
    || /^["'`].*(?:\$\{|\{\{|<%)/.test(value)
    || /^(?:var|env|attr)\(/i.test(value)
    || value.startsWith("$");
}

/** @param {string} value */
function literalValue(value) {
  const quote = value[0];
  if ((quote === "\"" || quote === "'") && value.endsWith(quote)) return value.slice(1, -1);
  if (quote === "`") return value.slice(1, -1);
  return value;
}

/** @param {{ path: string, text: string }} file @param {number} start @param {number} end @param {{ ruleId: string, status: "fail" | "review", summary: string, next: string }} detail */
function create(file, start, end, detail) {
  return createFinding({
    schemaVersion: "1.0",
    analyzerVersion: ANALYZER_VERSION,
    seessVersion: SEESS_VERSION,
    ruleId: detail.ruleId,
    path: file.path,
    range: rangeFor(file.text, start, end),
    classification: "deterministic",
    evidence: { state: "observed", summary: detail.summary },
    confidence: 1,
    status: detail.status,
    safeNextAction: { type: "inspect", summary: detail.next },
  });
}

/** @param {string} text @param {number} start @param {number} end */
function rangeFor(text, start, end) {
  return { start: positionFor(text, start), end: positionFor(text, end) };
}

/** @param {string} text @param {number} index */
function positionFor(text, index) {
  const line = text.slice(0, index).split("\n");
  return { line: line.length, column: line.at(-1).length + 1 };
}

/** @param {import("../contracts/finding.mjs").Finding} left @param {import("../contracts/finding.mjs").Finding} right */
function compareFindings(left, right) {
  return left.path.localeCompare(right.path)
    || left.range.start.line - right.range.start.line
    || left.range.start.column - right.range.start.column
    || left.ruleId.localeCompare(right.ruleId);
}

/** @param {string} value */
function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
