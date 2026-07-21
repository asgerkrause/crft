import { dirname, relative, resolve } from "node:path";
import { resolveScopedPath } from "./scope.mjs";
import { readTextFile } from "./traverse.mjs";

/**
 * Parse valid static CSS imports with 1-based, end-exclusive source ranges.
 * Invalid, dynamic, and out-of-order candidates are intentionally omitted.
 * @param {string} source
 */
export function parseCssImports(source) {
  return scanCssImports(source)
    .filter((item) => !item.blocked)
    .map(({ specifier, range }) => ({ specifier, range }));
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
    for (const item of scanCssImports(source)) {
      if (item.blocked) {
        const entry = block(file.relative, item.range, item.specifier, item.blocked);
        imports.push(entry);
        blocked.push(entry);
        continue;
      }

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

/**
 * Scan top-level CSS with comments, strings, and nested blocks masked by lexical state.
 * @param {string} source
 */
function scanCssImports(source) {
  /** @type {{ specifier: string, range: { start: { line: number, column: number }, end: { line: number, column: number } }, blocked?: string }[]} */
  const imports = [];
  let index = 0;
  let depth = 0;
  let importsAllowed = true;

  while (index < source.length) {
    const character = source[index];
    if (isWhitespace(character)) {
      index += 1;
      continue;
    }
    if (startsComment(source, index)) {
      index = skipComment(source, index);
      continue;
    }
    if (isQuote(character)) {
      index = readString(source, index).end;
      if (depth === 0) importsAllowed = false;
      continue;
    }
    if (character === "{") {
      if (depth === 0) importsAllowed = false;
      depth += 1;
      index += 1;
      continue;
    }
    if (character === "}") {
      depth = Math.max(0, depth - 1);
      index += 1;
      continue;
    }
    if (depth !== 0) {
      index += 1;
      continue;
    }
    if (character === "@") {
      const keyword = readIdentifier(source, index + 1);
      if (keyword.value.toLowerCase() === "import") {
        const item = readImport(source, index, keyword.end);
        if (!importsAllowed && !item.blocked) item.blocked = "ordering";
        imports.push(item);
        index = item.end;
        continue;
      }
      if (importsAllowed && isImportPrelude(keyword.value) && isTopLevelStatement(source, keyword.end)) {
        index = scanStatement(source, keyword.end).end;
        continue;
      }
    }
    importsAllowed = false;
    index += 1;
  }

  return imports.map(({ start, end, specifier, blocked }) => ({
    specifier,
    range: rangeAt(source, start, end),
    ...(blocked ? { blocked } : {}),
  }));
}

/** @param {string} source @param {number} start @param {number} afterKeyword */
function readImport(source, start, afterKeyword) {
  let index = skipTrivia(source, afterKeyword);
  if (isQuote(source[index])) {
    const string = readString(source, index);
    if (!string.closed) return importItem(start, source.length, string.value, "syntax");
    const statement = scanStatement(source, string.end);
    return importItem(start, statement.end, string.value, statement.valid ? undefined : "syntax");
  }

  const keyword = readIdentifier(source, index);
  const statement = scanStatement(source, index);
  if (keyword.value.toLowerCase() === "url") {
    return importItem(start, statement.end, source.slice(index, statement.end).trim(), "url");
  }
  if (index >= source.length || source[index] === ";") {
    return importItem(start, statement.end, "", "syntax");
  }
  const value = source.slice(index, statement.end).trim();
  return importItem(start, statement.end, value, isDynamicImport(value) ? "dynamic" : "unsupported");
}

/** @param {number} start @param {number} end @param {string} specifier @param {string | undefined} blocked */
function importItem(start, end, specifier, blocked) {
  return { start, end: Math.max(start + 1, end), specifier, blocked };
}

/** @param {string} source @param {number} index */
function scanStatement(source, index) {
  let parentheses = 0;
  let brackets = 0;
  let valid = true;

  while (index < source.length) {
    const character = source[index];
    if (startsComment(source, index)) {
      index = skipComment(source, index);
      continue;
    }
    if (isQuote(character)) {
      const string = readString(source, index);
      if (!string.closed) return { end: source.length, valid: false };
      index = string.end;
      continue;
    }
    if (character === "(") parentheses += 1;
    else if (character === ")") {
      if (parentheses === 0) valid = false;
      else parentheses -= 1;
    } else if (character === "[") brackets += 1;
    else if (character === "]") {
      if (brackets === 0) valid = false;
      else brackets -= 1;
    } else if (character === "{" || character === "}") valid = false;
    else if (character === ";" && parentheses === 0 && brackets === 0) {
      return { end: index + 1, valid };
    }
    index += 1;
  }
  return { end: source.length, valid: false };
}

/** @param {string} source @param {number} index */
function isTopLevelStatement(source, index) {
  const statement = scanStatement(source, index);
  return statement.valid && statement.end > index && source[statement.end - 1] === ";";
}

/** @param {string} value */
function isImportPrelude(value) {
  const keyword = value.toLowerCase();
  return keyword === "charset" || keyword === "layer";
}

/** @param {string} value */
function isDynamicImport(value) {
  return /^(?:var|env)\(/i.test(value);
}

/** @param {string} source @param {number} index */
function skipTrivia(source, index) {
  while (index < source.length) {
    if (isWhitespace(source[index])) {
      index += 1;
    } else if (startsComment(source, index)) {
      index = skipComment(source, index);
    } else {
      break;
    }
  }
  return index;
}

/** @param {string} source @param {number} index */
function readIdentifier(source, index) {
  const start = index;
  while (index < source.length && isIdentifierCharacter(source[index])) index += 1;
  return { value: source.slice(start, index), end: index };
}

/** @param {string} source @param {number} index */
function readString(source, index) {
  const quote = source[index];
  let value = "";
  index += 1;
  while (index < source.length) {
    const character = source[index];
    if (character === quote) return { value, end: index + 1, closed: true };
    if (character === "\\") {
      if (index + 1 >= source.length) return { value, end: source.length, closed: false };
      value += source[index + 1];
      index += 2;
    } else {
      value += character;
      index += 1;
    }
  }
  return { value, end: source.length, closed: false };
}

/** @param {string} source @param {number} index */
function startsComment(source, index) {
  return source[index] === "/" && source[index + 1] === "*";
}

/** @param {string} source @param {number} index */
function skipComment(source, index) {
  const end = source.indexOf("*/", index + 2);
  return end === -1 ? source.length : end + 2;
}

/** @param {string | undefined} character */
function isWhitespace(character) {
  return Boolean(character) && /\s/.test(character);
}

/** @param {string | undefined} character */
function isQuote(character) {
  return character === '"' || character === "'";
}

/** @param {string | undefined} character */
function isIdentifierCharacter(character) {
  return Boolean(character) && /[A-Za-z0-9_-]/.test(character);
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
