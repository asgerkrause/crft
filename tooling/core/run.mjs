import { createHash } from "node:crypto";
import { realpathSync } from "node:fs";
import { basename, isAbsolute } from "node:path";
import { fileURLToPath } from "node:url";
import { createFinding, FINDING_SCHEMA_VERSION } from "../contracts/finding.mjs";
import { ANALYZER_VERSION, SEESS_VERSION } from "../contracts/version.mjs";
import { buildCssImportGraph } from "./css-imports.mjs";
import { enumerateTree, inspectTextFile, readStableFile } from "./traverse.mjs";

export const CANONICAL_ROOT = realpathSync(fileURLToPath(new URL("../../", import.meta.url)));
export const SUPPORTED_SOURCE_EXTENSIONS = Object.freeze([".css", ".html", ".astro", ".js", ".jsx", ".ts", ".tsx", ".vue", ".svelte"]);

/** @param {unknown} target */
export function normalizeAdoptionTarget(target) {
  if (typeof target !== "string" || !isAbsolute(target) || !basename(target)) {
    throw new TypeError("--target must be an explicit absolute target path");
  }
  return { absolute: target, label: basename(target) };
}

/**
 * Build pure-rule integrity input from complete adoption entries and import edges.
 * @param {{ scope: { root: string, entrypoint: { absolute: string, relative: string }, adoption: { absolute: string, relative: string } }, manifest: string[] }} input
 */
export function collectIntegrityInput(input) {
  const { scope, manifest } = input;
  if (!scope?.entrypoint || !scope.adoption || !Array.isArray(manifest)) {
    throw new TypeError("integrity collection requires resolved entrypoint, adoption, and manifest");
  }
  const graph = buildCssImportGraph(scope);
  const expected = manifestPaths(manifest);
  return {
    adoptionPath: scope.adoption.relative,
    canonicalEntries: hashTree(CANONICAL_ROOT, expected),
    adoptedEntries: hashTree(scope.adoption.absolute),
    importGraph: {
      entrypoint: scope.entrypoint.relative,
      edges: resolvedEdges(graph),
      blocked: graph.blocked,
    },
  };
}

/**
 * Read only supported consumer source outside the adoption tree. Every skipped
 * node is retained so callers cannot report an unproven clean audit.
 * @param {{ root: string, adoption: { relative: string } }} scope
 */
export function collectConsumerRecords(scope) {
  if (!scope?.root || !scope?.adoption?.relative) throw new TypeError("consumer collection requires a resolved adoption scope");
  const adoptionPath = scope.adoption.relative;
  const adoptionPrefix = `${adoptionPath}/`;
  /** @type {{ path: string, text: string }[]} */
  const records = [];
  /** @type {{ path: string, reason: string }[]} */
  const skipped = [];

  for (const entry of enumerateTree(scope.root, {
    pruneExcluded: true,
    prune: (candidate) => candidate.relative === adoptionPath,
  })) {
    if (entry.relative === adoptionPath || entry.relative.startsWith(adoptionPrefix)) continue;
    if (entry.excluded) {
      skipped.push({ path: entry.relative, reason: "excluded" });
      continue;
    }
    if (entry.kind === "directory") continue;
    if (entry.kind !== "file") {
      skipped.push({ path: entry.relative, reason: entry.kind === "symlink" ? "symlink" : "non-regular" });
      continue;
    }
    if (!hasSupportedExtension(entry.relative)) {
      skipped.push({ path: entry.relative, reason: "unsupported-extension" });
      continue;
    }
    const result = inspectTextFile(entry.absolute);
    if ("text" in result) records.push({ path: entry.relative, text: result.text });
    else skipped.push({ path: entry.relative, reason: result.reason });
  }
  return { records: records.sort(comparePath), skipped: skipped.sort(comparePath) };
}

/**
 * Turn incomplete consumer coverage into contract-valid blocked findings.
 * @param {{ path: string, reason: string }[]} skipped
 */
export function consumerSkippedFindings(skipped) {
  return skipped.map(({ path, reason }) => createFinding({
    schemaVersion: FINDING_SCHEMA_VERSION,
    analyzerVersion: ANALYZER_VERSION,
    seessVersion: SEESS_VERSION,
    ruleId: "consumer-api/source-skipped",
    path,
    range: { start: { line: 1, column: 1 }, end: { line: 1, column: 1 } },
    classification: "deterministic",
    evidence: { state: "blocked", summary: `Consumer source was excluded from deterministic scanning: ${reason}.` },
    confidence: 1,
    status: "blocked",
    safeNextAction: { type: "escalate", summary: "Resolve or explicitly accept the skipped source before treating the audit as complete." },
  }));
}

/** @param {string} root @param {Set<string>} [allowed] */
function hashTree(root, allowed) {
  return enumerateTree(root)
    .filter((entry) => !allowed || allowed.has(entry.relative))
    .map((entry) => {
      if (entry.kind !== "file") return { path: entry.relative, kind: entry.kind };
      const result = readStableFile(entry.absolute);
      if ("reason" in result) return { path: entry.relative, kind: "file", blocked: result.reason };
      return {
        path: entry.relative,
        kind: "file",
        byteLength: result.bytes.length,
        sha256: createHash("sha256").update(result.bytes).digest("hex"),
      };
    })
    .sort(comparePath);
}

/** @param {string[]} manifest */
function manifestPaths(manifest) {
  const result = new Set(manifest);
  for (const path of manifest) {
    const segments = path.split("/");
    segments.pop();
    while (segments.length) {
      result.add(segments.join("/"));
      segments.pop();
    }
  }
  return result;
}

/** @param {{ files: { path: string, imports: object[] }[] }} graph */
function resolvedEdges(graph) {
  const edges = [];
  for (const file of graph.files) {
    for (const item of file.imports) {
      if (typeof item === "object" && item && "resolved" in item && typeof item.resolved === "string") {
        edges.push({ from: file.path, to: item.resolved });
      }
    }
  }
  return edges.sort((left, right) => JSON.stringify(left).localeCompare(JSON.stringify(right)));
}

/** @param {string} path */
function hasSupportedExtension(path) {
  return SUPPORTED_SOURCE_EXTENSIONS.some((extension) => path.endsWith(extension));
}

/** @param {{ path: string }} left @param {{ path: string }} right */
function comparePath(left, right) {
  return left.path.localeCompare(right.path);
}
