import { files } from "../../scripts/copy-system.mjs";
import { createFinding, FINDING_SCHEMA_VERSION, validateFindingPath } from "../contracts/finding.mjs";
import { ANALYZER_VERSION, SEESS_VERSION } from "../contracts/version.mjs";

export const ADOPTION_MANIFEST = Object.freeze([...files]);

const ENTRY_KINDS = new Set(["file", "directory", "symlink", "other"]);
const SHA256 = /^[a-f0-9]{64}$/;
const EXPECTED_DIRECTORIES = new Set(ADOPTION_MANIFEST.flatMap(parentPaths));

/**
 * Evaluate complete adoption-tree records and resolved CSS import edges. This
 * rule deliberately performs no filesystem traversal or import resolution.
 *
 * @param {{
 *   adoptionPath: string,
 *   canonicalEntries: Array<{ path: string, kind: "file" | "directory" | "symlink" | "other", byteLength?: number, sha256?: string, blocked?: string }>,
 *   adoptedEntries: Array<{ path: string, kind: "file" | "directory" | "symlink" | "other", byteLength?: number, sha256?: string, blocked?: string }>,
 *   importGraph: { entrypoint: string, edges: Array<{ from: string, to: string }>, blocked?: Array<{ path: string, range: import("../contracts/finding.mjs").FindingRange, blocked: string }> },
 * }} input
 */
export function assessAdoptionIntegrity(input) {
  const { adoptionPath, canonicalEntries, adoptedEntries, importGraph } = validateInput(input);
  const canonical = indexEntries(canonicalEntries);
  const adopted = indexEntries(adoptedEntries);
  const findings = [];
  let manifestFailed = false;

  for (const path of ADOPTION_MANIFEST) {
    manifestFailed = verifyExpectedEntry(findings, canonical, adoptionPath, path, "Canonical") || manifestFailed;
    manifestFailed = verifyExpectedEntry(findings, adopted, adoptionPath, path, "Copied") || manifestFailed;
  }
  for (const path of EXPECTED_DIRECTORIES) {
    manifestFailed = verifyExpectedEntry(findings, canonical, adoptionPath, path, "Canonical", "directory") || manifestFailed;
    manifestFailed = verifyExpectedEntry(findings, adopted, adoptionPath, path, "Copied", "directory") || manifestFailed;
  }
  for (const [path, entry] of canonical) {
    if (!isExpected(path)) {
      findings.push(fail("adoption/manifest", scopedPath(adoptionPath, path), `Canonical source contains extra ${describeKind(entry.kind)} ${path}.`));
      manifestFailed = true;
    }
  }
  for (const [path, entry] of adopted) {
    if (!isExpected(path)) {
      findings.push(fail("adoption/manifest", scopedPath(adoptionPath, path), `Copied tree contains extra ${describeKind(entry.kind)} ${path}.`));
      manifestFailed = true;
    }
  }
  if (!manifestFailed) {
    findings.push(pass("adoption/manifest", adoptionPath, "Copied tree contains exactly the canonical files and required directories."));
  }

  let contentFailed = false;
  let contentBlocked = false;
  for (const path of ADOPTION_MANIFEST) {
    const source = canonical.get(path);
    const copied = adopted.get(path);
    if (!source || !copied || source.kind !== "file" || copied.kind !== "file") continue;
    if (source.blocked || copied.blocked) {
      findings.push(blocked("adoption/copied-tree-read", scopedPath(adoptionPath, path), "A required adoption file could not be read stably for integrity verification."));
      contentBlocked = true;
      continue;
    }
    if (source.byteLength !== copied.byteLength || source.sha256 !== copied.sha256) {
      const mismatch = source.byteLength !== copied.byteLength ? "byte length" : "hash";
      findings.push(fail("adoption/copied-tree-drift", scopedPath(adoptionPath, path), `Copied ${path} differs from the canonical source by ${mismatch}.`));
      contentFailed = true;
    }
  }
  if (!contentFailed && !contentBlocked && !manifestFailed) {
    findings.push(pass("adoption/copied-tree-drift", adoptionPath, "All copied files, including styles/project.css, match canonical byte lengths and hashes."));
  }

  for (const item of importGraph.blocked) {
    findings.push(blocked("adoption/import-graph", item.path, "Static CSS import graph contains an unresolved or unsupported import.", item.range));
  }

  const adoptedGlobal = scopedPath(adoptionPath, "global.css");
  const resolvedEdges = importGraph.edges.filter(({ from, to }) => from === importGraph.entrypoint && to === adoptedGlobal);
  if (resolvedEdges.length === 1) {
    findings.push(pass("adoption/entrypoint-import", importGraph.entrypoint, `Entrypoint has one resolved edge to ${adoptedGlobal}.`));
  } else {
    findings.push(fail("adoption/entrypoint-import", importGraph.entrypoint, `Entrypoint has ${resolvedEdges.length} resolved entrypoint edges to ${adoptedGlobal}; expected exactly one.`));
  }

  return findings;
}

function validateInput(input) {
  if (!isObject(input)) throw new TypeError("adoption integrity input must be an object");
  const { adoptionPath, canonicalEntries, adoptedEntries, importGraph } = input;
  assertPath(adoptionPath, "adoptionPath");
  validateEntries(canonicalEntries, "canonicalEntries");
  validateEntries(adoptedEntries, "adoptedEntries");
  if (!isObject(importGraph)) throw new TypeError("importGraph must be an object");
  assertPath(importGraph.entrypoint, "importGraph.entrypoint");
  if (!Array.isArray(importGraph.edges)) throw new TypeError("importGraph.edges must be an array");
  for (const edge of importGraph.edges) {
    if (!isObject(edge)) throw new TypeError("importGraph.edges must contain { from, to } records");
    assertPath(edge.from, "importGraph edge from");
    assertPath(edge.to, "importGraph edge to");
  }
  const blockedEntries = importGraph.blocked ?? [];
  if (!Array.isArray(blockedEntries)) throw new TypeError("importGraph.blocked must be an array");
  for (const entry of blockedEntries) validateBlockedEntry(entry);
  return { adoptionPath, canonicalEntries, adoptedEntries, importGraph: { ...importGraph, blocked: blockedEntries } };
}

function validateEntries(entries, label) {
  if (!Array.isArray(entries)) throw new TypeError(`${label} must be an array`);
  const paths = new Set();
  for (const entry of entries) {
    if (!isObject(entry)) throw new TypeError(`${label} must contain entry records`);
    assertPath(entry.path, `${label} entry path`);
    if (paths.has(entry.path)) throw new TypeError(`${label} must not contain duplicate paths`);
    paths.add(entry.path);
    if (!ENTRY_KINDS.has(entry.kind)) throw new TypeError(`${label} entry kind is invalid`);
    if (entry.blocked !== undefined && (typeof entry.blocked !== "string" || !entry.blocked)) {
      throw new TypeError(`${label} entry blocked must be a non-empty string`);
    }
    if (entry.kind === "file" && entry.blocked === undefined) {
      if (!Number.isInteger(entry.byteLength) || entry.byteLength < 0) {
        throw new TypeError(`${label} file byteLength must be a non-negative integer`);
      }
      if (typeof entry.sha256 !== "string" || !SHA256.test(entry.sha256)) {
        throw new TypeError(`${label} file sha256 must be a lowercase SHA-256 hex digest`);
      }
    }
  }
}

function validateBlockedEntry(entry) {
  if (!isObject(entry)) throw new TypeError("importGraph.blocked must contain blocked records");
  assertPath(entry.path, "importGraph blocked path");
  if (typeof entry.blocked !== "string" || !entry.blocked) throw new TypeError("importGraph blocked reason must be a non-empty string");
  validateRange(entry.range, "importGraph blocked range");
}

function validateRange(range, label) {
  if (!isObject(range) || !isObject(range.start) || !isObject(range.end)) throw new TypeError(`${label} must contain source positions`);
  for (const position of [range.start, range.end]) {
    if (!Number.isInteger(position.line) || position.line < 1 || !Number.isInteger(position.column) || position.column < 1) {
      throw new TypeError(`${label} positions must be positive integers`);
    }
  }
}

function verifyExpectedEntry(findings, entries, adoptionPath, path, label, kind = "file") {
  const entry = entries.get(path);
  if (!entry) {
    findings.push(fail("adoption/manifest", scopedPath(adoptionPath, path), `${label} manifest is missing ${path}.`));
    return true;
  }
  if (entry.kind !== kind) {
    findings.push(fail("adoption/manifest", scopedPath(adoptionPath, path), `${label} manifest entry ${path} is ${describeKind(entry.kind)}.`));
    return true;
  }
  return false;
}

/** @param {string} path */
function isExpected(path) {
  return ADOPTION_MANIFEST.includes(path) || EXPECTED_DIRECTORIES.has(path);
}

/** @param {string} path */
function parentPaths(path) {
  const result = [];
  const segments = path.split("/");
  segments.pop();
  while (segments.length) {
    result.push(segments.join("/"));
    segments.pop();
  }
  return result;
}

function indexEntries(entries) {
  const result = new Map();
  for (const entry of entries) result.set(entry.path, entry);
  return result;
}

function scopedPath(adoptionPath, path) {
  return `${adoptionPath}/${path}`;
}

function describeKind(kind) {
  return kind === "symlink" ? "symbolic link" : kind === "directory" ? "directory" : kind === "file" ? "regular file" : "non-regular node";
}

function pass(ruleId, path, summary) {
  return finding(ruleId, path, "pass", "observed", summary, "preserve", "Preserve the verified adoption tree.");
}

function fail(ruleId, path, summary) {
  return finding(ruleId, path, "fail", "observed", summary, "inspect", "Inspect the copied tree and canonical source before changing either.");
}

function blocked(ruleId, path, summary, range = { start: { line: 1, column: 1 }, end: { line: 1, column: 1 } }) {
  return finding(ruleId, path, "blocked", "blocked", summary, "escalate", "Resolve the blocked source before treating integrity verification as complete.", range);
}

function finding(ruleId, path, status, state, summary, action, actionSummary, range = { start: { line: 1, column: 1 }, end: { line: 1, column: 1 } }) {
  return createFinding({
    schemaVersion: FINDING_SCHEMA_VERSION,
    analyzerVersion: ANALYZER_VERSION,
    seessVersion: SEESS_VERSION,
    ruleId,
    path,
    range,
    classification: "deterministic",
    evidence: { state, summary },
    confidence: 1,
    status,
    safeNextAction: { type: action, summary: actionSummary },
  });
}

function assertPath(path, label) {
  if (validateFindingPath(path)) throw new TypeError(`${label} must be a relative POSIX path`);
}

function isObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
