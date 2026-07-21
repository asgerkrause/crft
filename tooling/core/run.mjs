import { createHash } from "node:crypto";
import { readFileSync, realpathSync } from "node:fs";
import { basename, isAbsolute } from "node:path";
import { fileURLToPath } from "node:url";
import { buildCssImportGraph } from "./css-imports.mjs";
import { readTextFile, walkFiles } from "./traverse.mjs";

export const CANONICAL_ROOT = realpathSync(fileURLToPath(new URL("../../", import.meta.url)));

/** @param {unknown} target */
export function normalizeAdoptionTarget(target) {
  if (typeof target !== "string" || !isAbsolute(target) || !basename(target)) {
    throw new TypeError("--target must be an explicit absolute target path");
  }
  return { absolute: target, label: basename(target) };
}

/**
 * Build pure-rule integrity input from core-owned traversal, hashes, and import edges.
 * @param {{ scope: { root: string, entrypoint: { absolute: string, relative: string }, adoption: { absolute: string, relative: string } }, manifest: string[] }} input
 */
export function collectIntegrityInput(input) {
  const { scope, manifest } = input;
  if (!scope?.entrypoint || !scope.adoption || !Array.isArray(manifest)) {
    throw new TypeError("integrity collection requires resolved entrypoint, adoption, and manifest");
  }
  const graph = buildCssImportGraph(scope);
  return {
    adoptionPath: scope.adoption.relative,
    canonicalEntries: hashTree(CANONICAL_ROOT, new Set(manifest)),
    adoptedEntries: hashTree(scope.adoption.absolute),
    importGraph: {
      entrypoint: scope.entrypoint.relative,
      edges: resolvedEdges(graph),
    },
  };
}

/**
 * Read bounded non-binary consumer records outside the adopted tree.
 * @param {{ root: string, adoption: { relative: string } }} scope
 */
export function collectConsumerRecords(scope) {
  if (!scope?.root || !scope?.adoption?.relative) throw new TypeError("consumer collection requires a resolved adoption scope");
  const adoptionPrefix = `${scope.adoption.relative}/`;
  const records = [];
  for (const file of walkFiles(scope.root)) {
    if (file.relative === scope.adoption.relative || file.relative.startsWith(adoptionPrefix)) continue;
    const text = readTextFile(file.absolute);
    if (text !== undefined && !text.includes("\0")) records.push({ path: file.relative, text });
  }
  return records;
}

/** @param {string} root @param {Set<string>} [allowed] */
function hashTree(root, allowed) {
  return walkFiles(root)
    .filter((file) => !allowed || allowed.has(file.relative))
    .map((file) => {
      const bytes = readFileSync(file.absolute);
      return {
        path: file.relative,
        kind: "file",
        byteLength: bytes.length,
        sha256: createHash("sha256").update(bytes).digest("hex"),
      };
    });
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
