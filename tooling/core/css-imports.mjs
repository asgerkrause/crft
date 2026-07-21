import { dirname, relative, resolve } from "node:path";
import { resolveScopedPath } from "./scope.mjs";
import { readTextFile } from "./traverse.mjs";

const IMPORT = /@import\b\s*([^;]*);/gi;

/**
 * Parse statically written CSS imports with 1-based, end-exclusive source ranges.
 * @param {string} source
 */
export function parseCssImports(source) {
  const masked = source.replace(/\/\*[\s\S]*?\*\//g, (comment) => comment.replace(/[^\n]/g, " "));
  /** @type {{ specifier: string, range: { start: { line: number, column: number }, end: { line: number, column: number } } }[]} */
  const imports = [];
  for (const match of masked.matchAll(IMPORT)) {
    const specifier = parseSpecifier(match[1]);
    if (!specifier) continue;
    const start = /** @type {number} */ (match.index);
    imports.push({ specifier, range: rangeAt(source, start, start + match[0].length) });
  }
  return imports;
}

/**
 * Traverse a static local CSS import graph. Unsupported imports remain blocked metadata.
 * @param {{ root: string, entrypoint: { absolute: string, relative: string } }} scope
 */
export function buildCssImportGraph(scope) {
  if (!scope || typeof scope.root !== "string" || !scope.entrypoint) {
    throw new TypeError("CSS import graph requires a resolved entrypoint scope");
  }
  const root = scope.root;
  /** @type {{ path: string, imports: object[] }[]} */
  const files = [];
  /** @type {object[]} */
  const blocked = [];
  const states = new Map();

  /** @param {{ absolute: string, relative: string }} file */
  function visit(file) {
    states.set(file.absolute, "visiting");
    const source = readTextFile(file.absolute);
    if (source === undefined) {
      blocked.push(block(file.relative, { start: { line: 1, column: 1 }, end: { line: 1, column: 1 } }, "", "unreadable"));
      states.set(file.absolute, "done");
      return;
    }

    /** @type {object[]} */
    const imports = [];
    for (const item of parseCssImports(source)) {
      const resolution = resolveImport(root, file.absolute, item.specifier);
      if (resolution.reason) {
        const entry = block(file.relative, item.range, item.specifier, resolution.reason);
        imports.push(entry);
        blocked.push(entry);
        continue;
      }

      const target = resolution.file;
      const state = states.get(target.absolute);
      if (state === "visiting") {
        const entry = block(file.relative, item.range, item.specifier, "cycle");
        imports.push(entry);
        blocked.push(entry);
      } else {
        imports.push({ specifier: item.specifier, range: item.range, resolved: target.relative });
        if (state !== "done") visit(target);
      }
    }
    files.push({ path: file.relative, imports });
    states.set(file.absolute, "done");
  }

  visit(scope.entrypoint);
  files.sort((left, right) => compareText(left.path, right.path));
  blocked.sort((left, right) => compareText(JSON.stringify(left), JSON.stringify(right)));
  return { files, blocked };
}

/** @param {string} root @param {string} importer @param {string} specifier */
function resolveImport(root, importer, specifier) {
  if (/^(?:[A-Za-z][A-Za-z0-9+.-]*:|\/\/)/.test(specifier)) return { reason: "uri" };
  if (specifier.startsWith("/")) return { reason: "outside" };
  if (!specifier.startsWith("./") && !specifier.startsWith("../")) return { reason: "bare" };

  const candidate = resolve(dirname(importer), specifier);
  const scoped = relative(root, candidate).split("\\").join("/");
  if (!scoped || scoped.startsWith("../") || scoped === "..") return { reason: "outside" };
  try {
    return { file: resolveScopedPath(root, scoped, "file") };
  } catch {
    return { reason: "unavailable" };
  }
}

/** @param {string} source */
function parseSpecifier(source) {
  const value = source.trim();
  const quoted = /^(?:"([^"]+)"|'([^']+)')/.exec(value);
  if (quoted) return quoted[1] ?? quoted[2];
  const url = /^url\(\s*(?:"([^"]+)"|'([^']+)'|([^\s)]+))\s*\)/i.exec(value);
  if (url) return url[1] ?? url[2] ?? url[3];
  return value.split(/\s/, 1)[0] || undefined;
}

/** @param {string} source @param {number} start @param {number} end */
function rangeAt(source, start, end) {
  return { start: positionAt(source, start), end: positionAt(source, end) };
}

/** @param {string} source @param {number} offset */
function positionAt(source, offset) {
  const before = source.slice(0, offset);
  const line = before.split("\n").length;
  const column = offset - before.lastIndexOf("\n");
  return { line, column };
}

/** @param {string} path @param {{ start: { line: number, column: number }, end: { line: number, column: number } }} range @param {string} specifier @param {string} reason */
function block(path, range, specifier, reason) {
  return { path, range, specifier, blocked: reason };
}

/** @param {string} left @param {string} right */
function compareText(left, right) {
  return left < right ? -1 : left > right ? 1 : 0;
}
