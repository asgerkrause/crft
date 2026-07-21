import { files } from "../../scripts/copy-system.mjs";
import { createFinding, FINDING_SCHEMA_VERSION, validateFindingPath } from "../contracts/finding.mjs";
import { ANALYZER_VERSION, SEESS_VERSION } from "../contracts/version.mjs";

export const ADOPTION_MANIFEST = Object.freeze([...files]);

const ENTRY_KINDS = new Set(["file", "directory", "symlink", "other"]);
const SHA256 = /^[a-f0-9]{64}$/;

/**
 * Evaluate normalized adoption-tree records and resolved CSS import edges.
 * This rule deliberately performs no filesystem traversal or import resolution.
 *
 * @param {{
 *   adoptionPath: string,
 *   canonicalEntries: Array<{ path: string, kind: "file" | "directory" | "symlink" | "other", byteLength?: number, sha256?: string }>,
 *   adoptedEntries: Array<{ path: string, kind: "file" | "directory" | "symlink" | "other", byteLength?: number, sha256?: string }>,
 *   importGraph: { entrypoint: string, edges: Array<{ from: string, to: string }> },
 * }} input
 */
export function assessAdoptionIntegrity(input) {
  const { adoptionPath, canonicalEntries, adoptedEntries, importGraph } = validateInput(input);
  const canonical = indexEntries(canonicalEntries);
  const adopted = indexEntries(adoptedEntries);
  const expected = new Set(ADOPTION_MANIFEST);
  const findings = [];
  let manifestFailed = false;

  for (const path of ADOPTION_MANIFEST) {
    const entry = canonical.get(path);
    if (!entry) {
      findings.push(fail("adoption/manifest", scopedPath(adoptionPath, path), `Canonical manifest is missing ${path}.`));
      manifestFailed = true;
    } else if (entry.kind !== "file") {
      findings.push(fail("adoption/manifest", scopedPath(adoptionPath, path), `Canonical manifest entry ${path} is ${describeKind(entry.kind)}.`));
      manifestFailed = true;
    }
  }
  for (const path of canonical.keys()) {
    if (!expected.has(path)) {
      findings.push(fail("adoption/manifest", scopedPath(adoptionPath, path), `Canonical manifest contains extra entry ${path}.`));
      manifestFailed = true;
    }
  }
  for (const path of ADOPTION_MANIFEST) {
    if (!adopted.has(path)) {
      findings.push(fail("adoption/manifest", scopedPath(adoptionPath, path), `Copied tree is missing ${path}.`));
      manifestFailed = true;
    }
  }
  for (const [path, entry] of adopted) {
    if (expected.has(path)) {
      if (entry.kind !== "file") {
        findings.push(fail("adoption/manifest", scopedPath(adoptionPath, path), `Copied entry ${path} is ${describeKind(entry.kind)}.`));
        manifestFailed = true;
      }
    } else if (entry.kind === "file") {
      findings.push(fail("adoption/manifest", scopedPath(adoptionPath, path), `Copied tree contains extra entry ${path}.`));
      manifestFailed = true;
    } else {
      findings.push(fail("adoption/manifest", scopedPath(adoptionPath, path), `Copied tree contains ${describeKind(entry.kind)} ${path}.`));
      manifestFailed = true;
    }
  }
  if (!manifestFailed) {
    findings.push(pass("adoption/manifest", adoptionPath, "Copied tree contains exactly the ten canonical regular files."));
  }

  let contentFailed = false;
  for (const path of ADOPTION_MANIFEST) {
    const source = canonical.get(path);
    const copied = adopted.get(path);
    if (!source || !copied || source.kind !== "file" || copied.kind !== "file") continue;
    if (source.byteLength !== copied.byteLength || source.sha256 !== copied.sha256) {
      const mismatch = source.byteLength !== copied.byteLength ? "byte length" : "hash";
      findings.push(fail("adoption/copied-tree-drift", scopedPath(adoptionPath, path), `Copied ${path} differs from the canonical source by ${mismatch}.`));
      contentFailed = true;
    }
  }
  if (!contentFailed && !manifestFailed) {
    findings.push(pass("adoption/copied-tree-drift", adoptionPath, "All copied files, including styles/project.css, match canonical byte lengths and hashes."));
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
  return { adoptionPath, canonicalEntries, adoptedEntries, importGraph };
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
    if (entry.kind === "file") {
      if (!Number.isInteger(entry.byteLength) || entry.byteLength < 0) {
        throw new TypeError(`${label} file byteLength must be a non-negative integer`);
      }
      if (typeof entry.sha256 !== "string" || !SHA256.test(entry.sha256)) {
        throw new TypeError(`${label} file sha256 must be a lowercase SHA-256 hex digest`);
      }
    }
  }
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
  return kind === "symlink" ? "a symbolic link" : `a non-regular ${kind}`;
}

function pass(ruleId, path, summary) {
  return finding(ruleId, path, "pass", summary, "preserve", "Preserve the verified adoption tree.");
}

function fail(ruleId, path, summary) {
  return finding(ruleId, path, "fail", summary, "inspect", "Inspect the copied tree and canonical source before changing either.");
}

function finding(ruleId, path, status, summary, action, actionSummary) {
  return createFinding({
    schemaVersion: FINDING_SCHEMA_VERSION,
    analyzerVersion: ANALYZER_VERSION,
    seessVersion: SEESS_VERSION,
    ruleId,
    path,
    range: {
      start: { line: 1, column: 1 },
      end: { line: 1, column: 1 },
    },
    classification: "deterministic",
    evidence: { state: "observed", summary },
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
